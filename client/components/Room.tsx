"use client";
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
        const { type, user,username } = data;
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
            setUsers((prev) => [...prev, username]);
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

  useEffect(()=>{

  },[])
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
