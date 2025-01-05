import React from "react";
import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  getUserByClerkId,
  getUserOrganizedEvents,
  getUserCategories,
} from "@/lib/actions/user.actions";
import NoResults from "@/components/shared/NoResults";
import { Button } from "@/components/ui/button";
import ProfileLink from "@/components/shared/ProfileLink";
import EventsCollection from "@/components/shared/EventsCollection";
import { stringifyObject } from "@/lib/utils";
import { Event, SearchParamProps } from "@/types";
import { Badge } from "@/components/ui/badge";
import { EventFilters } from "@/constants";
import SearchBar from "@/components/shared/SearchBar";
import Filter from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";
export const metadata: Metadata = {
  title: "Evently | Profile Page",
  description: "Profile page of user",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

export default async function ProfilePage({
  params,
  searchParams,
}: SearchParamProps) {
  const { userId } = await auth();
  const resolvedParams = await params;
  const profileId = resolvedParams.id;

  const resolvedSearchParams = await searchParams;

  const searchQuery = resolvedSearchParams.q || "";
  const filter = resolvedSearchParams.filter || "";
  const page = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page, 10)
    : 1;

  let userParsed;
  let formattedJoinedDate;
  let organizedEvents: Event[] = [];
  let organizedEventsCount = 0;
  let isNextOrganizedEvents = false;
  let userCategories: { name: string; id: string }[] = [];
  let userCategoriesCount = 0;
  let hasErrorOccurredDuringCategoriesFetch = false;
  let hasErrorOccurredDuringOrganizedEventsFetch = false;

  try {
    const user = await getUserByClerkId(profileId, false);
    userParsed = stringifyObject(user);
    formattedJoinedDate = new Date(userParsed.joinDate).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
      }
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    return (
      <NoResults
        title="Error fetching user data"
        description="The user you're looking for doesn't exist or there was an error fetching their data."
        buttonTitle="Go Back"
        href="/"
      />
    );
  }

  try {
    const categories = await getUserCategories(userParsed._id);
    userCategories = stringifyObject(categories);
    userCategoriesCount = userCategories.length;
  } catch (error) {
    console.error("Error fetching user categories:", error);
    hasErrorOccurredDuringCategoriesFetch = true;
  }

  try {
    const unParsedEvents = await getUserOrganizedEvents({
      userId: userParsed._id,
      limit: 10,
      page,
      query: searchQuery,
      category: filter,
    });
    const parsedEvents = stringifyObject(unParsedEvents);
    organizedEvents = parsedEvents.events;
    organizedEventsCount = organizedEvents.length;
    isNextOrganizedEvents = parsedEvents.isNextPage;
  } catch (error) {
    console.error("Error fetching organized events:", error);
    hasErrorOccurredDuringOrganizedEventsFetch = true;
  }

  return (
    <>
      <section
        id="profile-header"
        className="wrapper flex flex-col justify-start w-full"
      >
        <div className="flex items-center justify-between flex-col md:flex-row gap-4 md:gap-0">
          <div className="flex items-center gap-6">
            <div className="relative size-36 md:size-48 rounded-full overflow-hidden">
              <Image
                src={userParsed.photo}
                alt="Profile Image"
                layout="fill"
                className="rounded-full object-cover shadow-lg"
              />
            </div>
            <div>
              <h2 className="h2-bold">
                {userParsed.firstName} {userParsed.lastName}
              </h2>
              <p className="p-regular-18 text-grey-400">
                @{userParsed.username}
              </p>
            </div>
          </div>
          {userId === profileId && (
            <SignedIn>
              <Link
                href={`/profile/${profileId}/update`}
                className="max-md:w-full"
              >
                <Button className="mt-8 md:mt-0 min-h-[46px] w-full md:w-fit md:min-w-[175px]">
                  Edit Profile
                </Button>
              </Link>
            </SignedIn>
          )}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
          {userParsed.personalWebsite && (
            <ProfileLink
              imgUrl="/assets/icons/link.svg"
              alt="Portfolio link"
              href={userParsed.personalWebsite}
              title="Portfolio"
            />
          )}
          {userParsed.location && (
            <ProfileLink
              imgUrl="/assets/icons/location.svg"
              alt="Location"
              title={userParsed.location}
            />
          )}
          <ProfileLink
            imgUrl="/assets/icons/calendar.svg"
            alt="Joined date"
            title={`Joined ${formattedJoinedDate}`}
          />
        </div>
        {userParsed.bio && (
          <p className="mt-6 p-medium-18 font-spaceGrotesk">
            <span className="font-semibold font-poppins">Bio:</span>{" "}
            {userParsed.bio}
          </p>
        )}
      </section>
      <section id="profile-tickets" className="bg-primary-50">
        <div className="wrapper">
          <div className="flex flex-col gap-4 text-center sm:text-left">
            <h2 className="h2-bold">
              Tickets - <span className="text-primary-400">0</span>
            </h2>
            <p className="p-regular-16 md:p-regular-18 xl:p-regular-20 text-primary-400 font-spaceGrotesk">
              Tickets purchased by this user.
            </p>
          </div>
          {/* <EventsCollection
            data={organizedEvents}
            collectionType="All_Tickets"
            emptyTitle="No tickets purchased yet"
            emptyDescription="This user hasn't purchased any tickets yet."
            emptyButtonTitle="Explore Events"
            emptyButtonHref="/#events"
          /> */}
        </div>
      </section>
      {!hasErrorOccurredDuringCategoriesFetch ? (
        <section id="profile-categories" className="mt-8 bg-white">
          <div className="wrapper">
            <div className="flex flex-col gap-4 text-center sm:text-left">
              <h2 className="h2-bold">
                Categories Used by the User -{" "}
                <span className="text-primary-400">{userCategoriesCount}</span>
              </h2>
              <p className="p-regular-16 md:p-regular-18 xl:p-regular-20 text-primary-400 font-spaceGrotesk">
                Categories this user is interested in.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:gap-6 mt-6 max-md:justify-center">
              {userCategories.length > 0 ? (
                userCategories
                  .slice(0, 15)
                  .map(
                    (category: { name: string; id: string }, index: number) => (
                      <Link
                        href={`/categories/${category.id}`}
                        key={`${category.name}-${index}`}
                      >
                        <Badge className="w-fit border-none px-4 py-2 text-white bg-primary-400 rounded-full cursor-pointer whitespace-nowrap">
                          {category.name}
                        </Badge>
                      </Link>
                    )
                  )
              ) : (
                <NoResults
                  title="No categories found"
                  description="This user hasn't used any categories yet."
                  buttonTitle="Go Back"
                  href="/profile"
                />
              )}
              {userCategories.length > 15 && (
                <Badge className="w-fit border-none px-4 py-2 text-white bg-primary-400 rounded-full cursor-pointer whitespace-nowrap pointer-events-none">
                  ...
                </Badge>
              )}
            </div>
          </div>
        </section>
      ) : (
        <NoResults
          title="Error fetching categories"
          description="We couldn't fetch the categories or could not load the categories. Please try again later."
          buttonTitle="Go Back"
          href="/profile"
        />
      )}
      {!hasErrorOccurredDuringOrganizedEventsFetch ? (
        <section id="profile-organized-events" className="mt-8 bg-primary-50">
          <div className="wrapper">
            <div className="flex items-center justify-between flex-col md:flex-row gap-4 md:gap-0">
              <div className="flex flex-col gap-4 text-center sm:text-left">
                <h2 className="h2-bold">
                  Organized Events -{" "}
                  <span className="text-primary-400">
                    {organizedEventsCount}
                  </span>
                </h2>
                <p className="p-regular-16 md:p-regular-18 xl:p-regular-20 text-primary-400 font-spaceGrotesk">
                  Events organized by this user.
                </p>
              </div>
              {userId === profileId && (
                <Link href="/create-event" className="max-md:w-full">
                  <Button className="mt-8 md:mt-0 min-h-[46px] w-full md:w-fit md:min-w-[175px]">
                    Create new Event
                  </Button>
                </Link>
              )}
            </div>
            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
              <SearchBar
                searchFor="Search for events"
                iconPosition="left"
                route="/"
                imgSrc="/assets/icons/search.svg"
                otherClasses="flex-1"
              />
              <Filter
                filters={EventFilters}
                otherClasses="min-h-[56px] sm:min-w-[170px]"
              />
            </div>
            <EventsCollection
              data={organizedEvents}
              collectionType="All_Events"
              emptyTitle="No events organized yet"
              emptyDescription="This user hasn't organized any events yet."
              emptyButtonTitle="Explore Events"
              emptyButtonHref="/#events"
            />
            <div className="mt-10">
              <Pagination
                pageNumber={page}
                isNext={isNextOrganizedEvents}
                section="profile-organized-events"
              />
            </div>
          </div>
        </section>
      ) : (
        <NoResults
          title="Error fetching organized events"
          description="We couldn't fetch the organized events or could not load the events. Please try again later."
          buttonTitle="Go Back"
          href="/profile"
        />
      )}
    </>
  );
}
