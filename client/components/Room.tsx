"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useRef } from "react";

export default function Room() {
  const { data: session, status } = useSession();
  const roomId = window.location.pathname.split("/")[2];
  const [notify, setNotify] = useState(false);
  const [fromUser, setFromUser] = useState("");
  const [users, setUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const usersRef = useRef<string[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (status === "loading" || !session?.user?.id || !roomId) return;

    const getUsers = async () => {
      try {
        const res = await axios.get(
          `/api/users/getusers?userId=${session.user.id}&roomId=${roomId}`
        );
        const fetchedUsers = res.data.users.map((user: any) => user.user.username);
        setUsers(fetchedUsers);
        usersRef.current = fetchedUsers;
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [status, session?.user?.id, roomId]);

  useEffect(() => {
    if (status === "loading" || !session?.user?.id || !roomId) return;

    if (ws.current) {
      ws.current.close();
    }

    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      ws.current?.send(
        JSON.stringify({
          type: "join-room",
          roomId: roomId,
          userId: session.user.id,
          username: session.user.name,
        })
      );
    };

    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log(data);
      const { type, username } = data;

      switch (type) {
        case "ping":
          setNotify(true);
          setFromUser(username);
          setTimeout(() => {
            setNotify(false);
            setFromUser("");
          }, 1000);
          break;
        case "join-room":
          handleJoin(username);
          break;
        default:
          break;
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [status, session?.user?.id, roomId]);

  const handleJoin = (username: string) => {
    console.log(usersRef.current);
    if (!usersRef.current.includes(username)) {
      setUsers((prev) => [...prev, username]);
      usersRef.current.push(username);
    }
  };

  if (loading) return <div>Loading....</div>;
  if (!session?.user?.id || !roomId) return <div>Loading...</div>;

  return (
    <div>
      {notify && <div>{fromUser} pinged you</div>}
      <div>Users in the room:</div>
      {users.map((user) => (
        <div key={user}>{user}</div>
      ))}
    </div>
  );
}
