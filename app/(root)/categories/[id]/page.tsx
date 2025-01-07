import React from "react";
import { getEventsByCategoryId } from "@/lib/actions/category.actions";
import { stringifyObject } from "@/lib/utils";
import { Metadata } from "next";
import EventsCollection from "@/components/shared/EventsCollection";
import SearchBar from "@/components/shared/SearchBar";
import Filter from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";
import NoResults from "@/components/shared/NoResults";
import { EventFilters } from "@/constants";
import { SearchParamProps } from "@/types";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Evently | Category Events",
  description: "View all events associated with this category on Evently.",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};

export default async function CategoryPage({
  params,
  searchParams,
}: SearchParamProps) {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;
  const categoryId = resolvedParams.id;
  if (!categoryId) {
    return redirect("/categories");
  }
  const searchQuery = resolvedSearchParams.q || "";
  const filter = resolvedSearchParams.filter || "";
  const page = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page, 10)
    : 1;

  let events;
  let isNext;

  try {
    const result = await getEventsByCategoryId({
      categoryId,
      query: searchQuery,
      filter,
      page,
      limit: 12,
    });
    const parsedResult = stringifyObject(result);
    events = parsedResult.events;
    isNext = parsedResult.isNext;
  } catch (error) {
    console.error("Error fetching category events:", error);
    return (
      <div className="wrapper flex flex-col items-center">
        <h1 className="h2-bold">Error Occurred</h1>
        <NoResults
          title="Error loading events"
          description="Failed to load events for this category. Please try again later."
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
          <h2 className="h2-bold">Explore Events in this Category</h2>
          <p className="p-regular-16 md:p-regular-18 xl:p-regular-20 text-primary-400 font-spaceGrotesk">
            Discover events that match your interest in this category.
          </p>
        </div>
      </section>
      <section className="wrapper">
        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <SearchBar
            searchFor="Search events in this category"
            iconPosition="left"
            route={`/categories/${categoryId}`}
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
          emptyDescription="No events found in this category right now. Check back later!"
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