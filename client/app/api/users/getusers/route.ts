import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const url = new URL(req.nextUrl);
    const userId = url.searchParams.get("userId");
    const roomId = url.searchParams.get("roomId");
    console.log(userId, roomId);
    if (!userId) {
      return new NextResponse("User Id is required", { status: 400 });
    }
    if (!roomId) {
      return new NextResponse("Room Id is required", { status: 400 });
    }
    const checkuser = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!checkuser) {
      return new NextResponse("User not found", { status: 404 });
    }
    const userinroom = await db.userRoom.findFirst({
      where: {
        userId: userId,
        roomId: roomId,
      },
    });
    if (!userinroom) {
      return new NextResponse("User not in room", { status: 404 });
    }
    const users = await db.room.findFirst({
      where: {
        id: roomId,
      },
      include: {
        users: {
          select: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
};
