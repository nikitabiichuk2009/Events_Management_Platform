import React from "react";
import NoResults from "@/components/shared/NoResults";
import { getAllCategories } from "@/lib/actions/category.actions";
import { stringifyObject } from "@/lib/utils";
import { Metadata } from "next";
import { ICategory } from "@/lib/database/models/category.model";
import CategoryCard from "@/components/shared/cards/CategoryCard";

export const metadata: Metadata = {
  title: "Evently | All Categories Page",
  description: "All categories page of Evently",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};

const CategoriesPage = async () => {
  let allCategories;

  try {
    const categories = await getAllCategories();
    allCategories = stringifyObject(categories);

    if (allCategories.length === 0) {
      return (
        <div className="wrapper flex flex-col items-center">
          <h1 className="h2-bold">No Categories Found</h1>
          <NoResults
            title="No categories available"
            description="Currently, there are no categories to display. Please check back later."
            buttonTitle="Explore Events"
            href="/events"
          />
        </div>
      );
    }
  } catch (error) {
    console.log(error);
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
        <div className="mt-8 flex flex-wrap gap-4">
          {allCategories.map((category: ICategory & { _id: string }) => (
            <CategoryCard
              key={category._id}
              id={category._id}
              name={category.name}
              eventCount={category.events.length}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default CategoriesPage;
