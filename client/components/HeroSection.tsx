"use client";
import Image from "next/image";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { joinRoom, makeRoom } from "@/lib/room";
import axios from "axios";

export interface RoomProps {
  roomName: string;
  password: string;
}

export default function HeroSection() {
  const session = useSession();
  const router = useRouter();
  const [roomData, setRoomData] = useState<RoomProps>({
    roomName: "",
    password: "",
  });

  const handleJoinRoom = async () => {
    const response = await axios.post(
      `/api/room/joinroom/?userId=${session.data?.user?.id}`,
      roomData
    );
    if (response.status === 200) {
      router.push(`/room/${response.data.room.roomId}`);
    }
  };
  
  const handleMakeRoom = async () => {
    const response = await axios.post(
      `/api/room/createroom/?userId=${session.data?.user?.id}`,
      roomData
    );
    if (response.status === 200) {
      router.push(`/room/${response.data.room.roomId}`);
    }
  };
  return (
    <div>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 h-[80vh]">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Connect with others in virtual rooms
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Nauty-fy is the ultimate platform for creating and joining
                  virtual rooms to interact with like-minded individuals.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer">
                      Make Room
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[325px]">
                    {session.data?.user ? (
                      <DialogHeader>
                        <DialogTitle className="text-center">
                          Make Room
                        </DialogTitle>
                        <DialogDescription className="flex flex-col gap-4">
                          <Input
                            onChange={(e) => {
                              setRoomData({
                                ...roomData,
                                roomName: e.target.value,
                              });
                            }}
                            type="text"
                            placeholder="Room Name"
                          />
                          <Input
                            onChange={(e) => {
                              setRoomData({
                                ...roomData,
                                password: e.target.value,
                              });
                            }}
                            type="password"
                            placeholder="Password"
                          />
                          <Button onClick={handleMakeRoom}>Create</Button>
                        </DialogDescription>
                      </DialogHeader>
                    ) : (
                      <DialogHeader>
                        <DialogTitle className="text-center">
                          Please Sign in
                        </DialogTitle>
                        <DialogDescription className="flex flex-col gap-4">
                          <p className="text-muted-foreground">
                            You need to sign in to create a room
                          </p>
                          <Button
                            onClick={() => {
                              router.push("/signin");
                            }}
                          >
                            SignIn
                          </Button>
                        </DialogDescription>
                      </DialogHeader>
                    )}
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                      Join a Room
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[325px]">
                    {session.data?.user ? (
                      <DialogHeader>
                        <DialogTitle className="text-center">
                          Join Room
                        </DialogTitle>
                        <DialogDescription className="flex flex-col gap-4">
                          <Input
                            onChange={(e) => {
                              setRoomData({
                                ...roomData,
                                roomName: e.target.value,
                              });
                            }}
                            type="text"
                            placeholder="Room Name"
                          />
                          <Input
                            onChange={(e) => {
                              setRoomData({
                                ...roomData,
                                password: e.target.value,
                              });
                            }}
                            type="password"
                            placeholder="Password"
                          />
                          <Button onClick={handleJoinRoom}>Join</Button>
                        </DialogDescription>
                      </DialogHeader>
                    ) : (
                      <DialogHeader>
                        <DialogTitle className="text-center">
                          Please Sign in
                        </DialogTitle>
                        <DialogDescription className="flex flex-col gap-4">
                          <p className="text-muted-foreground">
                            You need to sign in to join a room
                          </p>
                          <Button
                            onClick={() => {
                              router.push("/signin");
                            }}
                          >
                            SignIn
                          </Button>
                        </DialogDescription>
                      </DialogHeader>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <Image
              src="/Untitled.jpg"
              width="550"
              height="550"
              alt="Hero"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
