import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function HomeLoading() {
  return (
    <>
      <section className="bg-primary-400 bg-opacity-15 bg-escheresque-pattern">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">Loading Home page...</h1>
            <p className="p-regular-16 md:p-regular-18 xl:p-regular-24 text-primary-400">
              We're preparing your personalized event experience. Hang tight as
              we load the platform for you.
            </p>
            <Skeleton className="h-12 w-32 rounded-full" />
          </div>
          <Skeleton className="h-[70vh] 2xl:h-[50vh] w-full object-contain object-center" />
        </div>
      </section>

      <section id="events" className="wrapper my-8 flex-col flex">
        <h2 className="h2-bold">Loading Events...</h2>
        <p className="p-regular-16 md:p-regular-18 xl:p-regular-20 text-primary-400 font-spaceGrotesk">
          Please wait while we load the events for you.
        </p>
        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 sm:w-[170px] rounded-md" />
        </div>
        <div className="mt-12 flex flex-wrap gap-5 2xl:gap-8 items-center max-md:justify-center">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-[32rem] w-[25rem] rounded-xl" />
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
}
