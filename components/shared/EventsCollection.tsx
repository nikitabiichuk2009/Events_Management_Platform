import React from "react";
import NoResults from "./NoResults";
import EventCard from "./cards/EventCard";
import { Event } from "@/types";
import { auth } from "@clerk/nextjs/server";

type EventsCollectionProps = {
  emptyTitle: string;
  emptyDescription: string;
  emptyButtonTitle: string;
  emptyButtonHref: string;
  data: Event[];
  collectionType: "All_Events" | "Events_Organized" | "My_Tickets";
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
    <ul className="flex flex-wrap gap-1 lg:gap-5">
      {data.map((event: Event) => {
        const hasOrderLink = collectionType === "Events_Organized";
        const hidePrice = collectionType === "My_Tickets";
        return (
          <li key={event._id}>
            <EventCard
              event={event}
              hasOrderLink={hasOrderLink}
              hidePrice={hidePrice}
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
