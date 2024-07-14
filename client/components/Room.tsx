"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function Room() {
  const session = useSession();
  const roomId = window.location.pathname.split("/")[2];
  const [notify, setNotify] = useState(false);
  const [fromUser, setFromUser] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    try {
      if (!session.data?.user.id) return;
      const ws = new WebSocket("ws://localhost:8080");
      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: "join-room",
            roomId: roomId,
            userId: session.data?.user.id,
            username: session.data?.user.name,
          })
        );
      };

      ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        const { type, user, username } = data;
        switch (type) {
          case "ping":
            setNotify(true);
            setFromUser(user);
            setTimeout(() => {
              setNotify(false);
              setFromUser("");
            }, 1000);
            break;
          case "join-room":
            setUsers([...users, username]);
            break;
        }
      };

      return () => {
        ws.close();
      };
    } catch (error) {
      console.log(error);
    }
  }, [session.data?.user.id, roomId]);

  useEffect(() => {
    //get user for new joining
    if (!session.data?.user.id) return;
    const getUsers = async () => {
      const res = await axios.get(
        `/api/users/getusers?userId=${session.data?.user.id}&roomId=${roomId}`
      );
      setUsers(res.data.users.map((user: any) => user.user.username));
    };
    getUsers();
  }, [session.data?.user.id, roomId]);
  if(!session.data?.user.id) return <div>loading...</div>
  return (
    <div>
      {notify && <div>{fromUser} pinged you</div>}
      <div>Users in the room</div>
      {users.map((user) => (
        <div key={user}>{user}</div>
      ))}
    </div>
  );
}
