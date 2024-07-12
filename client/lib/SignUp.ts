import { z } from "zod";
import db from "./db";
interface SignInProps {
  username: string;
  password: string;
  confirmPassword?: string;
}

const signUpSchema = z.object({
  username: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
});

export const SignUp = async (SignInData: SignInProps) => {
  try {
    console.log(SignInData);
    const valid = signUpSchema.safeParse(SignInData);
    if (!valid.success) return { error: true, message: "Invalid data" };

    let user = await db.user.findUnique({
      where: {
        username: SignInData.username,
      },
    });
    console.log(user);
    if (user) return { error: true, message: "Username already taken" };
    user = await db.user.create({
      data: {
        username: SignInData.username,
        password: SignInData.password,
      },
    });

    return {
      error: false,
      message: "User created",
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: "Something went wrong",
    };
  }
};
