import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Provider } from "@/lib/provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Work_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nautyfy",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <Navbar />
          {children}
          <Toaster/>
        </Provider>
      </body>
    </html>
  );
}
