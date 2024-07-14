"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { signIn } from "next-auth/react";
import { toast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
interface SignInProps {
  username: string;
  password: string;
  confirmPassword?: string;
}

export default function SignInComponent() {
  const [error, setError] = useState("");
  const [isSignIn, setIsSignIn] = useState(true);
  const [signInData, setSignInData] = useState<SignInProps>({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async () => {
    try {
      if (isSignIn) {
        //use next-auth to sign in
        const response = await signIn("credentials", {
          username: signInData.username,
          password: signInData.password,
          redirect: false,
        });
        if (response?.status !== 200) {
          toast({
            variant: "destructive",
            title: "Error",
            // @ts-ignore
            description: `${response?.error}`,
            action: (
              <ToastAction altText="Close notification">
                Close notification
              </ToastAction>
            ),
          });
        }
        if (!response) return;
        if (response.status !== 200) {
          if (!response.error) setError("Somethng went wrong");
          else setError(response.error);
        } else window.location.href = "/";
      } else {
        if (signInData.password !== signInData.confirmPassword) {
          toast({
            variant:"destructive",
            title: "Error",
            // @ts-ignore
            description: `Password do not match`,
            action: (
              <ToastAction altText="Close notification">
                Close notification
              </ToastAction>
            ),
          });
          return;
        }
        const response = await axios.post("/api/signup", signInData);
        if (response.status === 200) {
          setIsSignIn(true);
        }
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    }
  };

  return (
    <main className="flex h-[80vh] w-full items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            {isSignIn ? "Sign in" : "Sign up"}
          </CardTitle>
          <CardDescription>
            {isSignIn
              ? "Enter your username and password to sign in"
              : "Enter your details to create an account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              onChange={(e) => {
                setSignInData((prev) => ({
                  ...prev,
                  username: e.target.value,
                }));
              }}
              id="username"
              placeholder="Enter your username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              onChange={(e) => {
                setSignInData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
              id="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>
          {!isSignIn && (
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                onChange={(e) => {
                  setSignInData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }));
                }}
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                required
              />
            </div>
          )}
          <Button onClick={handleSubmit} className="w-full">
            {isSignIn ? "Sign in" : "Sign up"}
          </Button>
        </CardContent>
        <CardFooter>
          <div className="flex items-center w-full justify-around">
            <span className="text-muted-foreground">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}
            </span>
            <Button
              variant="link"
              onClick={() => setIsSignIn((prev) => !prev)}
              className="text-primary"
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
