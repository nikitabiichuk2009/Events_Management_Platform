"use server";

import { connectToDB } from "../database";
import User from "../database/models/user.model";
import Event from "../database/models/event.model";
import Category from "../database/models/category.model";
import { CreateEventParams, GetAllEventsParams } from "@/types";
import { revalidatePath } from "next/cache";

export async function createEvent({ userId, event, path }: CreateEventParams): Promise<void> {
  try {
    await connectToDB();

    const organizer = await User.findById(userId);
    if (!organizer) {
      throw new Error("Organizer not found");
    }

    // Check if category exists, if not, create it with the user as a follower
    const category = await Category.findOneAndUpdate(
      { name: event.category },
      {
        $setOnInsert: {
          name: event.category, // Create new category if not found
          followers: [organizer._id],
          events: [],
        },
      },
      { upsert: true, new: true } // Upsert and return the document
    );

    // Ensure the user is added to the followers list if not already
    await Category.updateOne(
      { _id: category._id },
      { $addToSet: { followers: organizer._id } }
    );

    const newEvent = await Event.create({
      title: event.title,
      description: event.description,
      location: event.location,
      imageUrl: event.imageUrl,
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime,
      price: event.price,
      isFree: event.isFree,
      url: event.url,
      category: category._id,
      organizer: organizer._id,
    });

    await Category.updateOne(
      { _id: category._id },
      { $addToSet: { events: newEvent._id } }
    );

    revalidatePath(path);

  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error("Error creating event");
  }
}

export async function getAllEvents({
  query = "",
  category = "", // Accepted but not processed for now
  limit = 10,
  page = 1,
}: GetAllEventsParams): Promise<{
  allEvents: any[];
  isNextPage: boolean;
  totalEventsCount: number;
}> {
  try {
    await connectToDB();
    const skip = (page - 1) * limit;

    const searchQuery: any = {};
    if (query) {
      searchQuery.title = { $regex: query, $options: "i" };
    }

    const allEvents = await Event.find(searchQuery)
      .sort({ createdAt: "desc" })
      .skip(skip)
      .limit(limit)
      .populate({ path: "organizer", model: User })
      .populate({ path: "category", model: Category })
      .exec();

    const totalEventsCount = await Event.countDocuments(searchQuery);

    const isNextPage = totalEventsCount > skip + allEvents.length;

    return { allEvents, isNextPage, totalEventsCount };
  } catch (err: any) {
    console.error("Error fetching all events:", err);
    throw new Error("Error fetching all events");
  }
}
