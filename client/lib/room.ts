import { RoomProps } from "@/components/HeroSection";
import { z } from "zod";
import db from "./db";

const roomSchema = z.object({
  roomName: z.string().min(1),
  password: z.string().min(1),
});
export const makeRoom = async (roomData: RoomProps, user: any) => {
  try {
    const { roomName, password } = roomData;
    const valid = roomSchema.safeParse(roomData);
    if (!valid) return { error: true, message: "Invalid data" };
    const findUser = await db.user.findFirst({
      where: {
        username: user.name,
      },
    });
    if (!findUser) return { error: true, message: "User not found" };
    const findRoom = await db.room.findFirst({
      where: {
        name: roomName,
      },
    });
    if (findRoom) return { error: true, message: "Room already exists" };
    const newRoom = await db.room.create({
      data: {
        name: roomName,
        password,
      },
    });
    const userRoom = await db.userRoom.create({
      data: {
        userId: findUser.id,
        roomId: newRoom.id,
      },
    });
    return { error: false, data: userRoom };
  } catch (error) {
    console.log(error);
    return { error: true, message: "An error occurred" };
  }
};
export const joinRoom = async (roomData: RoomProps, user: any) => {
  try {
    const { roomName, password } = roomData;
    const valid = roomSchema.safeParse(roomData);
    if (!valid) return { error: true, message: "Invalid data" };
    const findUser = await db.user.findFirst({
      where: {
        username: user.name,
      },
    });
    if (!findUser) return { error: true, message: "User not found" };
    const findRoom = await db.room.findFirst({
      where: {
        name: roomName,
      },
    });
    if (!findRoom) return { error: true, message: "Room not found" };
    if (findRoom.password !== password)
      return { error: true, message: "Invalid password" };
    const userRoom = await db.userRoom.create({
      data: {
        userId: findUser.id,
        roomId: findRoom.id,
      },
    });
    return { error: false, data: userRoom };
  } catch (error) {
    console.log(error);
    return { error: true, message: "An error occurred" };
  }
};
