"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ToastAction } from "./ui/toast";
import { toast } from "./ui/use-toast";

interface UserProps {
  username: string;
  userId: string;
}

export default function Room() {
  const { data: session, status } = useSession();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [notify, setNotify] = useState(false);
  const [fromUser, setFromUser] = useState("");
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(true);
  const usersRef = useRef<UserProps[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    setRoomId(window.location.pathname.split("/")[2]);
    if (!session?.user?.id || !roomId) return;
    const getUsers = async () => {
      try {
        const res = await axios.get(
          `/api/users/getusers?userId=${session.user.id}&roomId=${roomId}`
        );
        const fetchedUsers = res.data.users.map((user: any) => {
          return {
            username: user.user.username,
            userId: user.user.id,
          };
        });
        setUsers(fetchedUsers);
        usersRef.current = fetchedUsers;
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [session?.user?.id, roomId]);

  useEffect(() => {
    if (status === "loading" || !session?.user?.id || !roomId) return;

    if (ws.current) {
      ws.current.close();
    }

    ws.current = new WebSocket(`${process.env.NEXT_PUBLIC_WS}`);

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
      const { type, username, userId, from } = data;

      switch (type) {
        case "ping":
          setNotify(true);
          setFromUser(from);
          setTimeout(() => {
            setNotify(false);
            setFromUser("");
          }, 1000);
          toast({
            title: "You received a notification",
            description: `From: ${from}`,
            action: (
              <ToastAction altText="Close notification">
                Close notification
              </ToastAction>
            ),
          });
          break;
        case "join-room":
          console.log(data);
          handleJoin(username, userId);
          break;
        default:
          break;
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [status, session?.user?.id, roomId, session?.user.name]);

  const handleJoin = (username: string, userId: string) => {
    const userExists = usersRef.current.some(
      (user) => user.username === username && user.userId === userId
    );

    if (!userExists) {
      setUsers((prev) => [...prev, { username, userId }]);
      usersRef.current.push({ username, userId });
    }
  };

  const sendPing = (userId: string) => {
    ws.current?.send(
      JSON.stringify({
        type: "ping",
        roomId: roomId,
        userId: session?.user.id,
        username: session?.user.name,
        targetuserId: userId,
      })
    );
  };
  
  if (loading) return <div>Loading....</div>;
  if (!session?.user?.id || !roomId) return <div>Loading...</div>;
  return (
    <main className="flex flex-col items-center justify-center h-[80vh] bg-background">
      <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 ">
        <div className="flex flex-wrap justify-center items-center gap-6 ">
          {users.map((user) => (
            <Card
              key={user.userId}
              className="bg-card text-card-foreground shadow-sm min-w-[200px]"
            >
              <div className="flex flex-col items-center justify-center p-6 space-y-4 relative">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">{user.username}</h3>
                </div>
                {session.user.id === user.userId ? (
                  <Button
                    variant="outline"
                    disabled
                    className="text-red-500 font-semibold"
                  >
                    You
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => sendPing(user.userId)}
                  >
                    Notify
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
