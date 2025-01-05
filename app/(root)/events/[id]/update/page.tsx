import EventForm from "@/components/shared/EventForm";
import NoResults from "@/components/shared/NoResults";
import { getAllCategories } from "@/lib/actions/category.actions";
import { getEventById } from "@/lib/actions/events.actions";
import { stringifyObject } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Evently | Edit Event",
  description: "Edit an event on Evently, the platform for creating and managing events.",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { userId } = await auth();
  const resolvedParams = await params;
  let event;
  let initialValues;
  let categories;

  try {
    const result = await getEventById(resolvedParams.id);
    event = stringifyObject(result);
    const parsedCategories = await getAllCategories({});
    categories = stringifyObject(parsedCategories.categories);
    if (event.organizer.clerkId !== userId) {
      return (
        <div className="wrapper flex flex-col items-center">
          <h1 className="h2-bold text-dark100_light900">403 - Access Forbidden</h1>
          <NoResults
            title="You are not the event organizer"
            description="You do not have permission to edit this event. Please ensure you are logged in with the correct account. If you believe this is an error, contact support for assistance."
            buttonTitle="Go back"
            href={`/events/${resolvedParams.id}`}
          />
        </div>
      );
    }

    initialValues = {
      title: event.title,
      description: event.description,
      location: event.location,
      imageUrl: event.imageUrl,
      startDateTime: new Date(event.startDateTime),
      endDateTime: new Date(event.endDateTime),
      price: event.price,
      isFree: event.isFree,
      url: event.url,
      category: event.category.name,
    };
  } catch (err) {
    console.error(err);
    return (
      <div className="wrapper flex flex-col items-center">
        <h1 className="h2-bold">Error Occurred</h1>
        <NoResults
          title="Error loading event data"
          description="There was an error fetching the event data. Try reloading the page or go back. If this persists, please try again later."
          buttonTitle="Go back"
          href={`/events/${resolvedParams.id}`}
        />
      </div>
    );
  }

  return (
    <>
      <section className="bg-primary-50 py-5 md:py-10">
        <div className="wrapper flex flex-col gap-2 text-center sm:text-left">
          <h2 className="h2-bold">Edit Event</h2>
          <p className="p-regular-16 md:p-regular-18 xl:p-regular-20 text-primary-400 font-spaceGrotesk">
            Update your event details and ensure everything is up-to-date!
          </p>
        </div>
      </section>
      <div className="wrapper my-8">
        <EventForm
          userId={userId || ""}
          eventIdToEdit={event._id}
          type="update"
          categories={categories}
          initialValues={initialValues}
        />
      </div>
    </>
  );
};

export default Page;
