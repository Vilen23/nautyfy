import React from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function UserCard() {
  return (
    <Card className="relative overflow-hidden rounded-lg group">
      <CardContent className="flex flex-col items-center justify-center p-6 bg-background">
        <Avatar className="mb-4">
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="text-lg font-semibold">@jdoe</div>
        <Button variant="secondary" size="sm" className="mt-4">
          Notify
        </Button>
      </CardContent>
    </Card>
  );
}
