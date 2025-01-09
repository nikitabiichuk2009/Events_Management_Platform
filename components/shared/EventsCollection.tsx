import React from "react";
import NoResults from "./NoResults";
import EventCard from "./cards/EventCard";
import { Event, Order } from "@/types";
import { auth } from "@clerk/nextjs/server";

type EventsCollectionProps = {
  emptyTitle: string;
  emptyDescription: string;
  emptyButtonTitle: string;
  emptyButtonHref: string;
  data: Event[] | Order[];
  collectionType: "All_Events" | "Events_Organized" | "All_Tickets";
};

const EventsCollection = async ({
  data,
  collectionType,
  emptyTitle,
  emptyDescription,
  emptyButtonTitle,
  emptyButtonHref,
}: EventsCollectionProps) => {
  const { userId } = await auth();

  return data.length > 0 ? (
    <ul className="flex flex-wrap gap-4 lg:gap-8 items-center max-md:justify-center mt-12">
      {collectionType === "All_Tickets" &&
        data.every((item) => "buyer" in item) &&
        data.map((order: Order) => {
          return (
            <li key={order._id} className="w-full md:w-[21rem] lg:w-[23rem]">
              <EventCard
                event={order.event}
                hasOrderLink={false}
                userClerkId={userId || ""}
                dateOfPurchase={order.createdAt.toString()}
              />
            </li>
          );
        })}

      {(collectionType === "All_Events" ||
        collectionType === "Events_Organized") &&
        data.every((item) => "organizer" in item) &&
        data.map((event: Event) => {
          const hasOrderLink = collectionType === "Events_Organized" && event.organizer.clerkId === userId;
          return (
            <li key={event._id} className="w-full md:w-[21rem] lg:w-[23rem]">
              <EventCard
                event={event}
                hasOrderLink={hasOrderLink}
                userClerkId={userId || ""}
              />
            </li>
          );
        })}
    </ul>
  ) : (
    <NoResults
      title={emptyTitle}
      description={emptyDescription}
      buttonTitle={emptyButtonTitle}
      href={emptyButtonHref}
    />
  );
};

export default EventsCollection;
