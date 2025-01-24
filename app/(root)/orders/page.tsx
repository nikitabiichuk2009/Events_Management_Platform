import React from "react";
import DataTable from "@/components/shared/ordersTable/DataTable";
import { columns } from "@/components/shared/ordersTable/columns";
import NoResults from "@/components/shared/NoResults";
import { getUserOrganizedEventsAndOrders } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { stringifyObject } from "@/lib/utils";
import { SearchParamsProps } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evently | Your Orders",
  description: "Your orders page of Evently",
  icons: {
    icon: "/assets/images/logo.svg",
  },
  openGraph: {
    title: "Evently | Your Orders",
    description: "Your orders page of Evently",
    images: ["/assets/images/hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Evently | Your Orders",
    description: "Your orders page of Evently",
    images: ["/assets/images/hero.png"],
  },
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const resolvedSearchParams = await searchParams;
  const eventId = resolvedSearchParams.eventId || "";
  let orders;

  try {
    const result = await getUserOrganizedEventsAndOrders(userId);
    const parsedResult = stringifyObject(result);
    orders = parsedResult.orders;
    const organizedEvents = parsedResult.organizedEvents;
    if (!result || organizedEvents.length === 0) {
      return (
        <div className="wrapper flex flex-col items-center">
          <NoResults
            title="No Organized Events Found"
            description="You currently have no organized events or orders to display."
            buttonTitle="Go create an event"
            href="/create-event"
          />
        </div>
      );
    } else if (orders.length === 0) {
      return (
        <div className="wrapper flex flex-col items-center">
          <NoResults
            title="No Orders Found"
            description="You currently have no orders to display."
            buttonTitle="Go to organized events"
            href={`/profile/${userId}#profile-organized-events`}
          />
        </div>
      );
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return (
      <div className="wrapper flex flex-col items-center">
        <NoResults
          title="Error Occurred"
          description="Failed to load organized events or orders. Please try again later."
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
          <h2 className="h2-bold">
            Explore information about your organized events
          </h2>
          <p className="p-regular-16 md:p-regular-18 xl:p-regular-20 text-primary-400 font-spaceGrotesk">
            View the information about your events and the people who bought
            tickets.
          </p>
        </div>
      </section>
      <section id="orders-table" className="wrapper mt-10">
        <DataTable data={orders} columns={columns} eventIdFilter={eventId} />
      </section>
    </>
  );
}
