import { z } from "zod";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

const signUpSchema = z.object({
  username: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
});

export const POST = async (req: NextRequest, res: NextResponse) => {
  const SignInData = await req.json();

  const valid = signUpSchema.safeParse(SignInData);
  if (!valid.success) {
    return new NextResponse("Invalid data", { status: 400 });
  }

  try {
    let user = await db.user.findUnique({
      where: {
        username: SignInData.username,
      },
    });

    if (user) {
      return new NextResponse("Username Already Taken", { status: 400 });
    }
    const hashpassword = await bcrypt.hash(SignInData.password, 10);
    user = await db.user.create({
      data: {
        username: SignInData.username,
        password: hashpassword,
      },
    });

    return NextResponse.json({ message: "User created" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Something went wrong", { status: 400 });
  }
};
