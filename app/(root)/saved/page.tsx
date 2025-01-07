import React from "react";
import NoResults from "@/components/shared/NoResults";
import { getUserSavedEventsByClerkId } from "@/lib/actions/user.actions";
import { stringifyObject } from "@/lib/utils";
import { Metadata } from "next";
import EventsCollection from "@/components/shared/EventsCollection";
import SearchBar from "@/components/shared/SearchBar";
import Filter from "@/components/shared/Filter";
import { EventFilters } from "@/constants";
import Pagination from "@/components/shared/Pagination";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Evently | Saved Events",
  description: "View all your saved events on Evently.",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};

export default async function SavedEventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const resolvedSearchParams = await searchParams;

  const searchQuery = resolvedSearchParams.q || "";
  const filter = resolvedSearchParams.filter || "";
  const page = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page, 10)
    : 1;

  let savedEvents;
  let isNext;

  try {
    const result = await getUserSavedEventsByClerkId({
      clerkId: userId,
      query: searchQuery,
      category: filter,
      page,
      limit: 12,
    });
    const parsedResult = stringifyObject(result);
    savedEvents = parsedResult.savedEvents;
    isNext = parsedResult.isNextPage;
  } catch (error) {
    console.error("Error fetching saved events:", error);
    return (
      <div className="wrapper flex flex-col items-center">
        <h1 className="h2-bold">Error Occurred</h1>
        <NoResults
          title="Error loading saved events"
          description="Failed to load saved events. Please try again later."
          buttonTitle="Go back"
          href="/"
        />
      </div>
    );
  }

  return (
    <>
      <section className="bg-primary-50 py-5 md:py-10">
        <div className="wrapper flex flex-col gap-2 text-center sm:text-left">
          <h2 className="h2-bold">Your Saved Events</h2>
          <p className="p-regular-16 md:p-regular-18 xl:p-regular-20 text-primary-400 font-spaceGrotesk">
            Access all your saved events in one place.
          </p>
        </div>
      </section>
      <section className="wrapper">
        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <SearchBar
            searchFor="Search saved events"
            iconPosition="left"
            route="/saved-events"
            imgSrc="/assets/icons/search.svg"
            otherClasses="flex-1"
          />
          <Filter
            filters={EventFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
          />
        </div>
        <EventsCollection
          data={savedEvents}
          collectionType="All_Events"
          emptyTitle="No saved events found"
          emptyDescription="You don't have any saved events. Explore events and save them!"
          emptyButtonTitle="Explore Events"
          emptyButtonHref="/#events"
        />
        <div className="mt-10">
          <Pagination pageNumber={page} isNext={isNext} />
        </div>
      </section>
    </>
  );
};