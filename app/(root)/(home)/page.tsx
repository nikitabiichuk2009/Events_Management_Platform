import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { getAllEvents } from "@/lib/actions/events.actions";
import { stringifyObject } from "@/lib/utils";
import NoResults from "@/components/shared/NoResults";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evently | Home",
  description: "Explore a wide range of events, connect with organizers, and find the perfect event for you.",
  icons: {
    icon: "/assets/images/logo.svg"
  }
}

export default async function Home() {
  let events;
  let eventsCount = 0;
  try {
    const result = await getAllEvents({query: "", category: "", limit: 10, page: 1});
    const parsedResult = stringifyObject(result);
    events = parsedResult.allEvents;
    eventsCount = parsedResult.totalEventsCount;
    console.log(eventsCount)
    console.log(events)
  } catch (err) {
    console.log(err)
    return (
      <div className="wrapper flex flex-col items-center">
        <h1 className="h2-bold">Error occurred</h1>
        <NoResults
          title="Error loading events"
          description="Failed to load events. Please try again later."
          buttonTitle="Go back"
          href="/"
        />
      </div>
    );
  }
  return (
    <>
      <section className="bg-primary-50">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
          <h1 className="h1-bold">
            Host, Connect, and Grow: Your Ultimate Event Management Platform
          </h1>
          <p className="p-regular-16 md:p-regular-18 xl:p-regular-24 text-primary-400">
            Evently is your go-to platform for creating, managing, and promoting
            events. Whether you're a seasoned event planner or a first-time
            organizer, we've got you covered.
          </p>
          <Button className="md:w-fit rounded-full" size="lg">
            <Link href="#events">Explore events</Link>
          </Button>
        </div>
        <div>
          <Image
            src="/assets/images/hero.png"
            alt="Evently hero"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center2xl:max-h-[50vh]"
          />
        </div>
      </div>
    </section>
    <section id="events" className="wrapper my-8 flex-col gap-8 md:gap-12">
      <h2 className="h2-bold">Trusted by <span className="text-primary-500">{eventsCount}</span> <br /> of Events</h2>
      <div className="flex w-full flex-col gap-5 md:flex-row">
        Search
        FilterCategory
      </div>
    </section>
    </>
  );
}

