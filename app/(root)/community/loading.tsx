import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommunityLoading() {
  return (
    <>
      <section className="bg-primary-50 py-5 md:py-10">
        <div className="wrapper flex flex-col gap-2 text-center sm:text-left">
          <h2 className="h2-bold">Loading the Evently Community</h2>
          <p className="p-regular-16 md:p-regular-18 xl:p-regular-20 text-primary-400 font-spaceGrotesk">
            Please wait while we load the community members.
          </p>
        </div>
      </section>
      <section className="wrapper">
        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="min-h-14 sm:min-w-[170px] rounded-md" />
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-[380px] w-full md:w-[260px] rounded-xl shadow-lg"
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
}
