"use client";

import { Event } from "@/types";
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import React from "react";
import Link from "next/link";
import Checkout from "./Checkout";

const CheckoutButton = ({ event, user }: { event: Event; user: { clerkId: string; userId: string } }) => {
  const areTicketsAvailable = new Date(event.endDateTime) > new Date();

  return (
    <>
      {areTicketsAvailable ? (
        <>
          <SignedIn>
            <Checkout event={event} user={user} />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" className="w-full md:w-fit">
              Login to buy a ticket
            </Link>
          </SignedOut>
        </>
      ) : (
        <p className="p-medium-16 font-spaceGrotesk text-red-400">
          Tickets are no longer available for this event.
        </p>
      )}
    </>
  );
};

export default CheckoutButton;
