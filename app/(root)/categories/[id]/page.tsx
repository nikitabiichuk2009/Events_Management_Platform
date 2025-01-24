import React from "react";
import { getEventsByCategoryId } from "@/lib/actions/category.actions";
import { stringifyObject } from "@/lib/utils";
import EventsCollection from "@/components/shared/EventsCollection";
import SearchBar from "@/components/shared/SearchBar";
import Filter from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";
import NoResults from "@/components/shared/NoResults";
import { EventFilters } from "@/constants";
import { SearchParamProps } from "@/types";

export async function generateMetadata({ params, searchParams }: SearchParamProps) {
  const resolvedParams = await params;
  const categoryId = resolvedParams.id;
  try {
    const category = await getEventsByCategoryId({ categoryId, page: 1, limit: 1, query: "", filter: "" });
    const parsedResult = stringifyObject(category);
    const categoryName = parsedResult.categoryName;
    return {
      title: `Evently | ${categoryName} - Category`,
      description: `Explore events in the ${categoryName} category on Evently.`,
      icons: {
        icon: "/assets/images/logo.svg",
      },
      openGraph: {
        title: `Evently | ${categoryName} - Category`,
        description: `Explore events in the ${categoryName} category on Evently.`,
        images: ["/assets/images/hero.png"],
      },
      twitter: {
        card: "summary_large_image",
        title: `Evently | ${categoryName} - Category`,
        description: `Explore events in the ${categoryName} category on Evently.`,
        images: ["/assets/images/hero.png"],
      },
    };
  } catch (error) {
    console.error("Error fetching category:", error);
    return {
      title: "Evently | Category Events",
      description: "View all categories on Evently.",
    };
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: SearchParamProps) {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;
  const categoryId = resolvedParams.id;

  const searchQuery = resolvedSearchParams.q || "";
  const filter = resolvedSearchParams.filter || "";
  const page = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page, 10)
    : 1;

  let events;
  let isNext;
  let categoryName;
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
    categoryName = parsedResult.categoryName;
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
          <h2 className="h2-bold">{categoryName}</h2>
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