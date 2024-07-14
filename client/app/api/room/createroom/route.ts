import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const roomSchema = z.object({
  roomName: z.string().min(1),
  password: z.string().min(1),
});

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const url = new URL(req.url);
    const roomData = await req.json();
    const { roomName, password } = roomData;

    const valid = roomSchema.safeParse(roomData);
    if (!valid) return new NextResponse("Invalid data", { status: 400 });

    const userId = url.searchParams.get("userId");
    if (!userId) return new NextResponse("User not found", { status: 404 });
    const findUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!findUser) return new NextResponse("User not found", { status: 404 });

    const findRoom = await db.room.findFirst({
      where: {
        name: roomName,
      },
    });
    if (findRoom)
      return new NextResponse("Room already exists", { status: 400 });
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
    return NextResponse.json({ message: "Room created", room: userRoom });
  } catch (error) {
    console.log(error);
    return new NextResponse("An error occurred", { status: 500 });
  }
};
