import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { getAllEvents } from "@/lib/actions/events.actions";
import { stringifyObject } from "@/lib/utils";
import NoResults from "@/components/shared/NoResults";
import { Metadata } from "next";
import EventsCollection from "@/components/shared/EventsCollection";
import SearchBar from "@/components/shared/SearchBar";
import Filter from "@/components/shared/Filter";
import { EventFilters } from "@/constants";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";

export const metadata: Metadata = {
  title: "Evently | Home",
  description:
    "Explore a wide range of events, connect with organizers, and find the perfect event for you.",
  icons: {
    icon: "/assets/images/logo.svg",
  },
  openGraph: {
    title: "Evently | Home",
    description:
      "Explore a wide range of events, connect with organizers, and find the perfect event for you.",
    images: ["/assets/images/hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Evently | Home",
    description:
      "Explore a wide range of events, connect with organizers, and find the perfect event for you.",
    images: ["/assets/images/hero.png"],
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const resolvedSearchParams = await searchParams;

  const searchQuery = resolvedSearchParams.q || "";
  const filter = resolvedSearchParams.filter || "";
  const page = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page, 10)
    : 1;

  let events;
  let eventsCount = 0;
  let isNext;
  try {
    const result = await getAllEvents({
      query: searchQuery,
      category: filter,
      limit: 12,
      page: page,
    });
    const parsedResult = stringifyObject(result);
    events = parsedResult.allEvents;
    eventsCount = parsedResult.totalEventsCount;
    isNext = parsedResult.isNextPage;
  } catch (err) {
    console.log(err);
    return (
      <div className="wrapper flex flex-col items-center">
        <h1 className="h2-bold">Error occurred</h1>
        <NoResults
          title="Error loading events"
          description="Failed to load events. Please try again later."
          buttonTitle="Go back"
          href="/"
        />
      </div>
    );
  }
  return (
    <>
      <section className="bg-primary-400 bg-opacity-15 bg-escheresque-pattern">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
              <span className="text-primary-500">Host, Connect, and Grow</span>:
              Your Ultimate Event Management Platform
            </h1>
            <p className="p-regular-16 md:p-regular-18 xl:p-regular-24 text-primary-400">
              Evently is your go-to platform for creating, managing, and
              promoting events. Whether you're an experienced event planner or
              a first-time organizer, we've got you covered.
            </p>
            <Button className="md:w-fit rounded-full" size="lg">
              <Link href="#events">Explore events</Link>
            </Button>
          </div>
          <div>
            <Image
              src="/assets/images/hero.png"
              alt="Evently hero"
              width={1000}
              height={1000}
              className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
            />
          </div>
        </div>
      </section>
      <section id="events" className="wrapper my-8 flex-col flex">
        <h2 className="h2-bold">
          Trusted by <span className="text-primary-500">{eventsCount}</span>{" "}
          <br /> of Events
        </h2>
        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <SearchBar
            searchFor="Search for events"
            iconPosition="left"
            route="/"
            imgSrc="/assets/icons/search.svg"
            otherClasses="flex-1"
          />
          <Filter
            filters={EventFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
          />
        </div>
        <EventsCollection
          data={events}
          collectionType="All_Events"
          emptyTitle="No events found"
          emptyDescription="No events found right now, but you can create one"
          emptyButtonTitle="Go create one"
          emptyButtonHref="/create-event"
        />
        <div className="mt-10">
          <Pagination pageNumber={page} isNext={isNext} section="events" />
        </div>
      </section>
    </>
  );
}