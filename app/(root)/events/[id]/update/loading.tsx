import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function UpdateEventLoading() {
  return (
    <>
      <section className="bg-primary-50 py-5 md:py-10">
        <div className="wrapper flex flex-col gap-2 text-center sm:text-left">
          <h2 className="h2-bold">Loading Event Form with your details...</h2>
          <p className="p-regular-16 md:p-regular-18 xl:p-regular-20 text-primary-400 font-spaceGrotesk">
            Please wait while we load the form for updating your event.
          </p>
        </div>
      </section>
      <div className="wrapper my-8">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col md:flex-row gap-3">
            <Skeleton className="min-h-[56px] rounded-md w-full" />
            <Skeleton className="min-h-[56px] rounded-md w-full" />
          </div>
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-96 w-full rounded-md" />
          <Skeleton className="min-h-[56px] rounded-md w-full" />
          <div className="flex flex-col md:flex-row gap-3">
            <Skeleton className="min-h-[56px] rounded-md w-full" />
            <Skeleton className="min-h-[56px] rounded-md w-full" />
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <Skeleton className="min-h-[56px] rounded-md w-full" />
            <Skeleton className="min-h-[56px] rounded-md w-full" />
          </div>
          <Skeleton className="h-11 w-full md:w-32 rounded-md" />
        </div>
      </div>
    </>
  );
};
