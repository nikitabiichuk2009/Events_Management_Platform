import React from "react";
import NoResults from "@/components/shared/NoResults";
import { stringifyObject } from "@/lib/utils";
import { Metadata } from "next";
import UserCard from "@/components/shared/cards/UserCard";
import SearchBar from "@/components/shared/SearchBar";
import Filter from "@/components/shared/Filter";
import { UserFilters } from "@/constants";
import Pagination from "@/components/shared/Pagination";
import { SearchParamsProps, User } from "@/types";
import { getAllUsers } from "@/lib/actions/user.actions";

export const metadata: Metadata = {
  title: "Evently | Community Page",
  description: "Explore the Evently community.",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const resolvedSearchParams = await searchParams;

  const searchQuery = resolvedSearchParams.q || "";
  const filter = resolvedSearchParams.filter || "";
  const page = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page, 10)
    : 1;

  let allUsers;
  let isNext;

  try {
    const users = await getAllUsers({
      query: searchQuery,
      filter: filter as "newUsers" | "oldUsers" | "topCreators",
      page,
      limit: 16,
    });
    allUsers = stringifyObject(users.users);
    isNext = users.isNextPage;
  } catch (error) {
    console.error("Error fetching users:", error);
    return (
      <div className="wrapper flex flex-col items-center">
        <h1 className="h2-bold">Error Occurred</h1>
        <NoResults
          title="Error loading users"
          description="Failed to load users. Please try again later."
          buttonTitle="Go explore events instead"
          href="/#events"
        />
      </div>
    );
  }

  return (
    <>
      <section className="bg-primary-50 py-5 md:py-10">
        <div className="wrapper flex flex-col gap-2 text-center sm:text-left">
          <h2 className="h2-bold">Explore the Evently Community</h2>
          <p className="p-regular-16 md:p-regular-18 xl:p-regular-20 text-primary-400 font-spaceGrotesk">
            Discover other users and learn more about their interests and events.
          </p>
        </div>
      </section>
      <section className="wrapper">
        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <SearchBar
            searchFor="Search for users"
            iconPosition="left"
            route="/community"
            imgSrc="/assets/icons/search.svg"
            otherClasses="flex-1"
          />
          <Filter
            filters={UserFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
          />
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          {allUsers.length > 0 ? (
            allUsers.map((user: User) => (
              <UserCard
                key={user._id}
                clerkId={user.clerkId}
                fullName={`${user.firstName} ${user.lastName}`}
                username={user.username}
                picture={user.photo!}
                eventsCount={user.eventsCreatedCount}
              />
            ))
          ) : (
            <NoResults
              title="No users found"
              description="There are currently no users to display."
              buttonTitle="Go explore events instead"
              href="/#events"
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
