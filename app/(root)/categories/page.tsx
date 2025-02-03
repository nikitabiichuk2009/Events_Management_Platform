import React from "react";
import NoResults from "@/components/shared/NoResults";
import { getAllCategories } from "@/lib/actions/category.actions";
import { stringifyObject } from "@/lib/utils";
import { Metadata } from "next";
import { ICategory } from "@/lib/database/models/category.model";
import CategoryCard from "@/components/shared/cards/CategoryCard";
import SearchBar from "@/components/shared/SearchBar";
import Filter from "@/components/shared/Filter";
import { CategoryFilters } from "@/constants";
import Pagination from "@/components/shared/Pagination";
import { SearchParamsProps } from "@/types";

export const metadata: Metadata = {
  title: "Evently | All Categories Page",
  description: "All categories page of Evently",
  icons: {
    icon: "/assets/images/logo.svg",
  },
  openGraph: {
    title: "Evently | All Categories Page",
    description: "All categories page of Evently",
    images: ["/assets/images/hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Evently | All Categories Page",
    description: "All categories page of Evently",
    images: ["/assets/images/hero.png"],
  },
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const resolvedSearchParams = await searchParams; // Next js 15 update! We should await params

  const searchQuery = resolvedSearchParams.q || "";
  const filter = resolvedSearchParams.filter || "";
  const page = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page, 10)
    : 1;

  let allCategories;
  let isNext;
  let resetPageCount;
  try {
    const categories = await getAllCategories({
      query: searchQuery,
      filter,
      page,
      limit: 16,
    });
    allCategories = stringifyObject(categories.categories);
    isNext = categories.isNext;
    resetPageCount = categories.resetPageCount;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return (
      <div className="wrapper flex flex-col items-center">
        <h1 className="h2-bold">Error Occurred</h1>
        <NoResults
          title="Error loading categories"
          description="Failed to load category information. Please try again later."
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
          <h2 className="h2-bold">Explore our Categories</h2>
          <p className="p-regular-16 md:p-regular-18 xl:p-regular-20 text-primary-400 font-spaceGrotesk">
            Discover a wide range of categories to find the perfect event for
            you.
          </p>
        </div>
      </section>
      <section className="wrapper">
        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <SearchBar
            searchFor="Search for categories"
            iconPosition="left"
            route="/categories"
            imgSrc="/assets/icons/search.svg"
            otherClasses="flex-1"
            resetPageCount={resetPageCount}
          />
          <Filter
            filters={CategoryFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
          />
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          {allCategories.length > 0 ? (
            allCategories.map((category: ICategory & { _id: string }) => (
              <CategoryCard
                key={category._id}
                id={category._id}
                name={category.name}
                eventCount={category.events.length}
              />
            ))
          ) : (
            <NoResults
              title="No categories found"
              description="Currently, there are no categories to display. If no events are available, that means there are no categories to display."
              buttonTitle="Go create one"
              href="/create-event"
            />
          )}
        </div>
        <div className="mt-10">
          <Pagination pageNumber={page} isNext={isNext} />
        </div>
      </section>
    </>
  );
}
