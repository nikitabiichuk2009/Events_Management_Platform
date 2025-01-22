"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import Link from "next/link";
import { Event } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteEventById } from "@/lib/actions/events.actions";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";

type EventCardProps = {
  event: Event;
  hasOrderLink: boolean;
  userClerkId: string;
  dateOfPurchase?: string;
  isTicket?: boolean;
};

export default function EventCard({
  event,
  hasOrderLink,
  userClerkId,
  dateOfPurchase,
  isTicket = false,
}: EventCardProps) {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isTicket) {
      const purchaseSuccess = searchParams.get("purchaseSuccess");
      if (purchaseSuccess === "true") {
        toast({
          title: "Congratulations!",
          description: "You successfully purchased an event ticket.",
          className: "bg-green-500 text-white border-none",
        });
      }
    }
  }, [isTicket, searchParams, toast]);

  const handleDeleteEvent = async () => {
    try {
      await deleteEventById(event._id);
      toast({
        title: "Event deleted successfully",
        description: "Your event has been deleted successfully",
        className: "bg-green-500 text-white border-none",
      });
    } catch (error) {
      toast({
        title: "Error deleting event",
        description: "An error occurred while deleting your event",
        className: "bg-red-500 text-white border-none",
      });
    }
  };

  return (
    <div className="shadow-lg rounded-xl overflow-hidden">
      <div
        className={`bg-primary-50 relative border-black/[0.1] ${
          dateOfPurchase || hasOrderLink ? "h-[35.5rem]" : "h-[33.5rem]"
        } rounded-xl p-6 border`}
      >
        <div className="text-lg font-bold text-neutral-600 dark:text-white flex flex-row gap-4 items-center">
          <p
            className={`whitespace-nowrap line-clamp-1 ${
              userClerkId === event.organizer.clerkId
                ? "max-w-[16rem]"
                : "max-w-[20rem]"
            }`}
          >
            {event.title}
          </p>
          {userClerkId === event.organizer.clerkId && (
            <div className="flex flex-row gap-2">
              <Link href={`/events/${event._id}/update`}>
                <Image
                  src="/assets/icons/edit.svg"
                  alt="edit icon"
                  width={18}
                  height={18}
                />
              </Link>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Image
                    src="/assets/icons/delete.svg"
                    alt="delete icon"
                    width={18}
                    height={18}
                  />
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gray-50">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your event.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteEvent}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
        <div className="w-full mt-4">
          <div className="relative h-56 w-full overflow-hidden rounded-xl">
            <Image
              src={event.imageUrl}
              alt={event.title}
              layout="fill"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-5 mt-4">
            <div className="flex gap-2 md:gap-3 items-center">
              <Image
                src="/assets/icons/calendar.svg"
                alt="calendar"
                width={18}
                height={18}
              />
              <p className="p-medium-16 md:p-medium-14">
                {formatDateTime(event.startDateTime)} -{" "}
                {formatDateTime(event.endDateTime)}
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center mt-4">
            <p
              className={`p-bold-16 font-spaceGrotesk rounded-full px-5 py-2 line-clamp-1 ${
                event.isFree
                  ? "text-green-500 bg-green-500/10"
                  : "text-primary-400 bg-primary-500/10"
              }`}
            >
              {event.isFree ? "Free" : `$${event.price}`}
            </p>
            <Link href={`/categories/${event.category._id}`}>
              <Badge className="w-fit border-none px-4 py-2 text-white bg-primary-400 rounded-full cursor-pointer line-clamp-1">
                {event.category.name}
              </Badge>
            </Link>
          </div>
          <p className="p-medium-14_5 text-white mt-2 bg-orange-400 rounded-full px-3 py-1.5 w-fit">
            <span className="text-primary-500 font-bold font-spaceGrotesk">
              {event.savedCount}{" "}
            </span>
            {event.savedCount === 1 ? "save" : "saves"}
          </p>
          {dateOfPurchase && (
            <p className="p-medium-16 font-spaceGrotesk text-grey-400 mt-2">
              Purchased on: {formatDateTime(dateOfPurchase)}
            </p>
          )}
        </div>
        <div className="flex justify-between items-center mt-8">
          <div className="flex flex-col gap-2">
            <Link
              href={`/profile/${event.organizer.clerkId}`}
              className="px-4 py-2 rounded-xl"
            >
              <div className="flex flex-row gap-2 items-center">
                <div className="relative size-8 md:size-6 rounded-full">
                  <Image
                    src={event.organizer.photo!}
                    alt={event.organizer.username}
                    layout="fill"
                    className="rounded-full object-cover"
                  />
                </div>
                <p className="p-medium-16 md:p-medium-14 text-grey-500">
                  @{event.organizer.username}
                </p>
              </div>
            </Link>
            {hasOrderLink && (
              <Link
                href={`/orders?eventId=${event._id}`}
                className="text-primary-400 hover:text-primary-500 ease-in-out duration-300 transition-colors px-4"
              >
                Order Info -&gt;
              </Link>
            )}
          </div>
          <Link href={`/events/${event._id}`}>
            <Button className="rounded-full text-xs px-4 py-[1.5]">
              Details -&gt;
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
