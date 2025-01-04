import React from "react";
import NoResults from "@/components/shared/NoResults";
import { Metadata } from "next";
import { getEventById } from "@/lib/actions/events.actions";
import { formatDateTime, stringifyObject } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/actions/user.actions";
import EventDetailsHeaderCard from "@/components/shared/cards/EventDetailsCard";

export const metadata: Metadata = {
  title: "Evently | Event Details",
  description: "View details of a specific event on Evently.",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};

const EventPage = async ({ params }: { params: { id: string } }) => {
  const resolvedParams = await params;
  let event;
  let user;
  const { userId } = await auth();
  try {
    if (!userId) return;
    const unParsedUser = await getUserByClerkId(userId);
    user = stringifyObject(unParsedUser);
  } catch (err) {
    console.error(err);
    return (
      <div className="wrapper flex flex-col items-center">
        <h1 className="h2-bold">Error Occurred</h1>
        <NoResults
          title="User not found"
          description="We couldn't load the current user. Please try again later."
          buttonTitle="Go Back"
          href="/events"
        />
      </div>
    );
  }
  try {
    const unParsedEvent = await getEventById(resolvedParams.id);
    event = stringifyObject(unParsedEvent);
    console.log(event);
  } catch (err) {
    console.error(err);
    return (
      <div className="wrapper flex flex-col items-center">
        <h1 className="h2-bold">Error Occurred</h1>
        <NoResults
          title="Event not found"
          description="We couldn't find the event you're looking for or could not load the event. Please try again later."
          buttonTitle="Go Back"
          href="/events"
        />
      </div>
    );
  }

  return (
    <>
      <section className="flex justify-center bg-primary-50">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-16 max-lg:items-center max-lg:justify-center">
          <Image
            src={event.imageUrl}
            alt={event.title}
            width={500}
            height={500}
            className="h-full min-h-[300px] min-w-[600px] object-cover object-center md:rounded-md"
          />
          <div className="flex w-full flex-col gap-8 md:gap-10 lg:py-3">
            <div className="flex flex-col gap-6">
              <EventDetailsHeaderCard
                eventTitle={event.title}
                hasSaved={userId ? user.savedEvents.includes(event._id) : false}
                userClerkId={userId || ""}
                eventId={event._id}
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3 items-center">
                  <p
                    className={`p-bold-18 font-spaceGrotesk rounded-full px-5 py-2 ${
                      event.isFree
                        ? "text-green-500 bg-green-500/10"
                        : "text-primary-400 bg-primary-500/10"
                    }`}
                  >
                    {event.isFree ? "Free" : `$${event.price}`}
                  </p>
                  <Link href={`/events?category=${event.category._id}`}>
                    <Badge className="w-fit border-none px-4 py-2 text-white bg-primary-400 rounded-full cursor-pointer">
                      {event.category.name}
                    </Badge>
                  </Link>
                </div>
                <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                  by {event.organizer.firstName} {event.organizer.lastName} | @
                  {event.organizer.username}
                </p>
              </div>
            </div>
            {/* CHECKOUT BUTTON */}
            <div className="flex flex-col gap-5">
              <div className="flex gap-2 md:gap-3 items-center">
                <Image
                  src="/assets/icons/calendar.svg"
                  alt="calendar"
                  width={32}
                  height={32}
                />
                <p className="p-medium-16 md:p-medium-18">
                  {formatDateTime(new Date(event.startDateTime))} -{" "}
                  {formatDateTime(new Date(event.endDateTime))}
                </p>
              </div>
              <div className="flex gap-2 md:gap-3 items-center">
                <Image
                  src="/assets/icons/location.svg"
                  alt="location"
                  width={32}
                  height={32}
                />
                <p className="p-medium-16 md:p-medium-18">{event.location}</p>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <p className="p-regular-16 md:p-regular-18 font-spaceGrotesk line-clamp-4">
                {event.description}
              </p>
              <Link
                href={event.url}
                className="p-regular-16 md:p-regular-18 text-primary-500 hover:text-primary-400 ease-in-out duration-300 transition-colors"
              >
                View Info about the Event
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EventPage;
