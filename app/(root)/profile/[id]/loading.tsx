import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ProfilePageLoading = () => {
  return (
    <>
      <section
        id="profile-header"
        className="wrapper flex flex-col justify-start w-full py-5 md:py-10"
      >
        <div className="flex items-center justify-between flex-col md:flex-row gap-4 md:gap-0">
          <div className="flex items-center gap-6">
            <div className="relative size-36 md:size-48 rounded-full shadow-black shadow-sm">
              <Skeleton className="rounded-full w-full h-full" />
            </div>
            <div>
              <h2 className="h2-bold">Please wait...</h2>
              <p className="p-regular-18 text-grey-400">
              Loading user profile...
              </p>
            </div>
          </div>
          <Skeleton className="mt-8 md:mt-0 min-h-[46px] w-full md:w-fit md:min-w-[175px]" />
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-32 rounded-md" />
          <Skeleton className="h-6 w-28 rounded-md" />
        </div>
        <Skeleton className="mt-6 h-8 w-full md:w-3/4 rounded-md" />
      </section>

      <section id="profile-tickets" className="bg-primary-50">
        <div className="wrapper">
          <div>
            <h2 className="h2-bold">Loading Tickets...</h2>
            <p className="p-regular-18 text-primary-400">
              Please wait while we load user's tickets.
            </p>
          </div>{" "}
          <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
            <Skeleton className="h-14 w-full rounded-xl bg-slate-200" />
            <Skeleton className="min-h-14 sm:min-w-[170px] rounded-md bg-slate-200" />
          </div>
          <div className="mt-12 flex flex-wrap gap-5 items-center max-md:justify-center">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="h-[32rem] w-[25rem] rounded-xl bg-slate-200"
              />
            ))}
          </div>
          <div className="mt-10 flex w-full items-center justify-center gap-2">
            <Skeleton className="h-10 w-20 rounded-md bg-slate-200" />
            <Skeleton className="size-10 rounded-md bg-slate-200" />
            <Skeleton className="h-10 w-20 rounded-md bg-slate-200" />
          </div>
        </div>
      </section>

      <section id="profile-categories" className="mt-8 bg-white">
        <div className="wrapper">
          <Skeleton className="h-10 w-64 mt-8 rounded-md" />
          <div className="mt-12 flex flex-wrap gap-3 md:gap-6 max-md:justify-center">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-8 w-28 rounded-full" />
            ))}
          </div>
        </div>
      </section>

      <section id="profile-organized-events" className="mt-8 bg-primary-50">
        <div className="wrapper">
          <div>
            <h2 className="h2-bold">Loading Organized Events...</h2>
            <p className="p-regular-18 text-primary-400">
              Please wait while we load user's organized events.
            </p>
          </div>
          <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
            <Skeleton className="h-14 w-full rounded-xl bg-slate-200" />
            <Skeleton className="min-h-14 sm:min-w-[170px] rounded-md bg-slate-200" />
          </div>
          <div className="mt-12 flex flex-wrap gap-5 items-center max-md:justify-center">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="h-[32rem] w-[25rem] rounded-xl bg-slate-200"
              />
            ))}
          </div>
          <div className="mt-10 flex w-full items-center justify-center gap-2">
            <Skeleton className="h-10 w-20 rounded-md bg-slate-200" />
            <Skeleton className="size-10 rounded-md bg-slate-200" />
            <Skeleton className="h-10 w-20 rounded-md bg-slate-200" />
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfilePageLoading;
