"use client";

import { Event, Order } from "@/types";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import React from "react";
import Link from "next/link";
import Checkout from "./Checkout";
import { Button } from "@/components/ui/button";

const CheckoutButton = ({
  event,
  user,
  userTickets,
}: {
  event: Event;
  user: { clerkId: string; userId: string };
  userTickets: Order[];
}) => {
  const isEventClosed = new Date(event.endDateTime) < new Date();
  const isUserOrganizer = event.organizer.clerkId === user.clerkId;
  const isUserAlreadyBoughtTicket = userTickets.some(
    (order) => order.event._id === event._id
  );

  if (isEventClosed) {
    return (
      <p className="p-medium-16 font-spaceGrotesk text-red-400">
        Tickets are no longer available for this event.
      </p>
    );
  }

  if (isUserOrganizer) {
    return null;
  }

  if (isUserAlreadyBoughtTicket) {
    return (
      <p className="p-medium-16 font-spaceGrotesk text-red-400">
        You have already bought a ticket for this event.
      </p>
    );
  }

  return (
    <>
      <SignedIn>
        <Checkout event={event} user={user} />
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in">
          <Button size="lg" className="w-full md:w-fit">
            Login to buy a ticket
          </Button>
        </Link>
      </SignedOut>
    </>
  );
};

export default CheckoutButton;
