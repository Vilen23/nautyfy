"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Work_Sans } from "next/font/google";
import { TbCircleFilled } from "react-icons/tb";
import { signOut, useSession } from "next-auth/react";
import { CiUser } from "react-icons/ci";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { MdNotificationAdd } from "react-icons/md";
const cursive = Work_Sans({ weight: "700", subsets: ["latin"] });

export default function Navbar() {
  const [hasShadow, setHasShadow] = useState(false);
  const session = useSession();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasShadow(true);
      } else {
        setHasShadow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`${
        hasShadow ? "bg-black/10" : "bg-white"
      } py-2 px-10 sticky top-0 z-50 transition-all duration-500`}
    >
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link
          href="/"
          className="flex items-center justify-center"
          prefetch={false}
        >
          <span className={`${cursive.className} text-4xl relative`}>
            Nauty-fy
            <TbCircleFilled className="absolute right-[-20px] top-0 text-red-500 text-xs" />
          </span>
        </Link>
        {!session.data?.user ? (
          <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
            <Link
              href="/signin"
              className="text-xl font-medium cursor-pointer underline-offset-4 group rounded-full px-3 py-2  gap-2"
            >
                <div className="flex items-center gap-3"><MdNotificationAdd size={24} className="text-red-500"/>
                SignUp</div>
              <div className="h-[2px] bg-black w-0 group-hover:w-full transition-all duration-500 mt-2"></div>
            </Link>
          </nav>
        ) : (
          <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="text-xl font-medium flex flex-col  cursor-pointer underline-offset-4 group">
                  <div className="flex items-center gap-2">
                    <CiUser size={24} className="text-red-500" />{" "}
                    {session.data?.user?.name}
                  </div>
                  <div className="h-[2px] bg-black w-0 group-hover:w-full transition-all duration-500 mt-2"></div>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Do you want to logout?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure that you want to logout?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      signOut();
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </nav>
        )}
      </header>
    </div>
  );
}
