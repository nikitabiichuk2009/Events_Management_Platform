import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface UserCardProps {
  clerkId: string;
  fullName: string;
  username: string;
  picture: string;
  eventsCount: number;
}

const UserCard = ({
  clerkId,
  fullName,
  username,
  picture,
  eventsCount,
}: UserCardProps) => {
  return (
    <div className="shadow-lg w-full md:w-[260px] rounded-xl">
      <div className="flex h-[380px] flex-col items-center justify-center gap-[18px] rounded-xl border p-8">
        <div className="relative size-28">
          <Image
            src={picture}
            alt={username}
            layout="fill"
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <h3 className="p-bold-24 line-clamp-1">{fullName}</h3>
          <p className="p-regular-16 text-grey-400">@{username}</p>
        </div>
        <p
          className="p-medium-16 font-spaceGrotesk rounded-full px-5 py-2 line-clamp-1 text-primary-400 bg-primary-500/10"
        >
          <span className="font-bold">{eventsCount} </span>
          {eventsCount === 1 ? "Event" : "Events"}
        </p>

        <Link href={`/profile/${clerkId}`} className="w-full">
          <Button className="w-full">View Profile</Button>
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
