"use client";
import React, { useState } from "react";
import Image from "next/image";
import { saveEvent } from "@/lib/actions/user.actions";
import { useToast } from "@/hooks/use-toast";

export default function EventDetailsHeaderCard({
  eventTitle,
  hasSaved,
  userClerkId,
  eventId,
}: {
  eventTitle: string;
  hasSaved: boolean;
  userClerkId: string;
  eventId: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSaveEvent = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await saveEvent({
        eventId,
        userClerkId,
        hasSaved,
        path: `/events/${eventId}`,
      });
      toast({
        title: hasSaved ? "Event removed from saved" : "Event saved",
        description: hasSaved ? "Successfully removed from saved events" : "Successfully saved to your events. You can find it in your saved events",
        className: "bg-green-500 text-white border-none",
      });
    } catch (err) {
      console.error("Error saving event:", err);
      toast({
        title: "Error saving event",
        description: "Something went wrong, please try again later",
        className: "bg-red-500 text-white border-none",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex gap-6 items-center">
      <h2 className="h2-bold">{eventTitle}</h2>
      <Image
        src={
          hasSaved
            ? "/assets/icons/star-filled.svg"
            : "/assets/icons/star-red.svg"
        }
        width={24}
        height={24}
        alt="saved"
        className={`cursor-pointer ${isSubmitting ? "opacity-50" : ""}`}
        onClick={isSubmitting ? undefined : handleSaveEvent}
      />
    </div>
  );
}
