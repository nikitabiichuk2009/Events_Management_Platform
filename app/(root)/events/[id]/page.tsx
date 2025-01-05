import React from "react";
import NoResults from "@/components/shared/NoResults";
import { Metadata } from "next";
import { getEventById, getRelatedEvents } from "@/lib/actions/events.actions";
import { formatDateTime, stringifyObject } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/actions/user.actions";
import EventDetailsHeaderCard from "@/components/shared/cards/EventDetailsCard";
import { SearchParamsProps } from "@/types";
import { redirect } from "next/navigation";
import Pagination from "@/components/shared/Pagination";
import EventsCollection from "@/components/shared/EventsCollection";
import { EventFilters } from "@/constants";
import Filter from "@/components/shared/Filter";
import SearchBar from "@/components/shared/SearchBar";

export const metadata: Metadata = {
  title: "Evently | Event Details",
  description: "View details of a specific event on Evently.",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};

export default async function EventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParamsProps>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.query || "";
  const filter = resolvedSearchParams.category || "";
  const page = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page, 10)
    : 1;
  const eventId = resolvedParams.id || "";
  if (!eventId) {
    redirect("/");
  }
  let event;
  let user;
  let relatedEvents;
  let isNext;
  let hasErrorOccurredDuringLoadingRelatedEvents = false;
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
    const unParsedEvent = await getEventById(eventId);
    event = stringifyObject(unParsedEvent);
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
  try {
    const unParsedRelatedEvents = await getRelatedEvents({
      categoryId: event.category._id,
      currentEventId: event._id,
      query: searchQuery,
      category: filter,
      page,
      limit: 10,
    });
    const parsedEvents = stringifyObject(unParsedRelatedEvents);
    relatedEvents = parsedEvents.events;
    isNext = parsedEvents.isNext;
  } catch (err) {
    console.error(err);
    hasErrorOccurredDuringLoadingRelatedEvents = true;
  }

  return (
    <>
      <section className="flex justify-center bg-primary-50">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-10 lg:gap-12 xl:gap-16 max-lg:items-start max-lg:justify-center max-lg:wrapper">
          <Image
            src={event.imageUrl}
            alt={event.title}
            width={500}
            height={500}
            className="h-full w-full sm:min-h-[250px] sm:min-w-[500px] xl:min-h-[300px] xl:min-w-[600px] object-cover object-center rounded-md"
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
                    className={`p-bold-16 xl:p-bold-18 font-spaceGrotesk rounded-full px-5 py-2 line-clamp-1 ${
                      event.isFree
                        ? "text-green-500 bg-green-500/10"
                        : "text-primary-400 bg-primary-500/10"
                    }`}
                  >
                    {event.isFree ? "Free" : `$${event.price}`}
                  </p>
                  <Link href={`/events?category=${event.category._id}`}>
                    <Badge className="w-fit border-none px-4 py-2 text-white bg-primary-400 rounded-full cursor-pointer whitespace-nowrap line-clamp-1">
                      {event.category.name}
                    </Badge>
                  </Link>
                </div>
                <p className="p-medium-16 xl:p-medium-18 ml-2 mt-2 sm:mt-0">
                  by{" "}
                  <span className="text-grey-500">
                    {event.organizer.firstName} {event.organizer.lastName} | @
                    {event.organizer.username}
                  </span>{" "}
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
                  className="size-6 xl:size-8"
                />
                <p className="p-medium-16 xl:p-medium-18">
                  {formatDateTime(event.startDateTime)} -{" "}
                  {formatDateTime(event.endDateTime)}
                </p>
              </div>
              <div className="flex gap-2 md:gap-3 items-center">
                <Image
                  src="/assets/icons/location.svg"
                  alt="location"
                  width={32}
                  height={32}
                  className="size-6 xl:size-8"
                />
                <p className="p-medium-16 xl:p-medium-18">{event.location}</p>
              </div>
              <Link
                href={event.url}
                className="flex gap-2 md:gap-3 items-center"
              >
                <Image
                  src="/assets/icons/link.svg"
                  alt="link"
                  width={28}
                  height={28}
                  className="size-5 xl:size-7"
                />
                <p className="p-medium-16 xl:p-medium-18 text-primary-400 hover:text-primary-500 ease-in-out duration-300 transition-colors line-clamp-1">
                  {event.url}
                </p>
              </Link>
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <p className="p-regular-16 xl:p-regular-18 font-spaceGrotesk max-w-[45rem]">
                {event.description}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="wrapper my-16" id="related-events">
        <h2 className="h2-bold">Related Events</h2>
        <p className="p-regular-16 md:p-regular-18 xl:p-regular-20 text-primary-400 font-spaceGrotesk">
          Discover events that match your interest in this category.
        </p>
        <div className="mt-12 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <SearchBar
            searchFor="Search related events"
            iconPosition="left"
            route={`/events/${event._id}`}
            imgSrc="/assets/icons/search.svg"
            otherClasses="flex-1"
          />
          <Filter
            filters={EventFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
          />
        </div>
        {hasErrorOccurredDuringLoadingRelatedEvents ? (
          <div className="mt-12 flex justify-center">
            <NoResults
              title="Error loading related events"
              description="An error occurred while loading related events. Please try again later."
              buttonTitle="Go Back"
              href={`/events/${event._id}`}
            />
          </div>
        ) : (
          <EventsCollection
            data={relatedEvents}
            collectionType="All_Events"
            emptyTitle="No related events found"
            emptyDescription="No events in the same category right now."
            emptyButtonTitle="Explore All Events"
            emptyButtonHref="/events"
          />
        )}
        <div className="mt-10">
          <Pagination
            pageNumber={page}
            isNext={isNext}
            section="related-events"
          />
        </div>
      </section>
    </>
  );
}
