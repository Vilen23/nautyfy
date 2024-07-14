import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const roomSchema = z.object({
  roomName: z.string().min(1),
  password: z.string().min(1),
});
export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const url = new URL(req.nextUrl);
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
    if (!findRoom) return new NextResponse("Room not found", { status: 404 });
    if (findRoom.password !== password)
      return new NextResponse("Invalid password", { status: 400 });

    const userinRoom = await db.userRoom.findFirst({
      where: {
        userId: findUser.id,
        roomId: findRoom.id,
      },
    });
    if (userinRoom)
      return NextResponse.json({
        message: "User already in room",
        room: userinRoom,
      });
    const userRoom = await db.userRoom.create({
      data: {
        userId: findUser.id,
        roomId: findRoom.id,
      },
    });
    return NextResponse.json({ message: "Room joined", room: userRoom });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
