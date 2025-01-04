import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const CategoriesLoading = () => {
  return (
    <>
      <section className="bg-primary-50 py-5 md:py-10">
        <div className="wrapper flex flex-col gap-2 text-center sm:text-left">
          <h2 className="h2-bold">Loading Categories...</h2>
          <p className="p-regular-16 md:p-regular-18 xl:p-regular-20 text-primary-400 font-spaceGrotesk">
            Please wait while we load the categories for you.
          </p>
        </div>
      </section>
      <section className="wrapper">
        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="min-h-14 sm:min-w-[170px]" />
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          {Array.from({ length: 10 }).map((_, idx) => (
            <Skeleton
              key={idx}
              className="h-[150px] w-full rounded-2xl md:w-[260px]"
            />
          ))}
        </div>
        <div className="mt-10 flex w-full items-center justify-center gap-2">
          <Skeleton className="h-10 w-20 rounded-md" />
          <Skeleton className="size-10 rounded-md" />
          <Skeleton className="h-10 w-20 rounded-md" />
        </div>
      </section>
    </>
  );
};

export default CategoriesLoading;
