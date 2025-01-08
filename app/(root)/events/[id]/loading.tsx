import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const EventDetailsLoading = () => {
  return (
    <>
      <section className="flex justify-center bg-primary-50">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-10 xl:gap-16 max-lg:items-start max-lg:justify-center wrapper lg:py-0">
          <div className="relative rounded-md w-full lg:w-3/4 xl:w-full aspect-[16/9]">
            <Skeleton className="absolute inset-0 object-cover object-center rounded-md bg-slate-200" />
          </div>
          <div className="flex w-full flex-col gap-8 md:gap-10 lg:py-3">
            <div className="flex flex-col gap-6">
              <div className="flex gap-4 xl:gap-6 items-center">
                <h2 className="h2-for-event-details">
                  Loading Event Details...
                </h2>
                <Skeleton className="size-6 rounded-md bg-slate-200" />
              </div>
              <Skeleton className="w-full h-11 md:w-32 bg-slate-200" />
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col 2xl:flex-row sm:items-center lg:items-start 2xl:items-center">
                <Skeleton className="h-8 w-28 bg-slate-200" />
                <Skeleton className="h-6 w-32 bg-slate-200" />
                <Skeleton className="h-8 w-40 bg-slate-200" />
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex gap-2 md:gap-3 items-center">
                <Skeleton className="h-8 w-60 bg-slate-200" />
              </div>
              <div className="flex gap-2 md:gap-3 items-center">
                <Skeleton className="h-8 w-60 bg-slate-200" />
              </div>
              <Skeleton className="h-8 w-[80%] bg-slate-200" />
            </div>
            <Skeleton className="h-1 w-full bg-slate-300" />
            <Skeleton className="h-20 w-full bg-slate-200" />
          </div>
        </div>
      </section>
      <section className="wrapper my-16" id="related-events">
        <h2 className="h2-bold">Loading Related Events...</h2>
        <p className="p-regular-16 md:p-regular-18 xl:p-regular-20 text-primary-400 font-spaceGrotesk">
          Please wait while we load events that match your interests in this
          category.
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
};

export default EventDetailsLoading;
