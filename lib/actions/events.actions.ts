"use server";
import { UTApi } from "uploadthing/server";

import { connectToDB } from "../database";
import User from "../database/models/user.model";
import Event from "../database/models/event.model";
import Category from "../database/models/category.model";
import {
  CreateEventParams,
  GetAllEventsParams,
  UpdateEventParams,
} from "@/types";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import Order from "../database/models/order.model";

export async function createEvent({
  userId,
  event,
  path,
}: CreateEventParams): Promise<void> {
  try {
    await connectToDB();

    const organizer = await User.findById(userId).select("clerkId _id");
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

    await User.updateOne(
      { _id: organizer._id },
      { $inc: { eventsCreatedCount: 1 } }
    );

    revalidatePath(path);
    revalidatePath("/community");
    revalidatePath(`/profile/${organizer.clerkId}`);
    revalidatePath("/categories");
    revalidatePath(`/categories/${category._id.toString()}`);
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error("Error creating event");
  }
}

export async function updateEvent({
  userId,
  event,
  path,
}: UpdateEventParams): Promise<void> {
  try {
    await connectToDB();

    const existingEvent = await Event.findById(event._id)
      .populate({
        path: "organizer",
        select: "clerkId _id",
        model: User,
      })
      .populate({
        path: "category",
        select: "_id name",
        model: Category,
      });

    if (!existingEvent) {
      throw new Error("Event not found");
    }
    try {
      if (existingEvent.imageUrl !== event.imageUrl) {
        const utApi = new UTApi();
        const existingEventImageUrlKey = existingEvent.imageUrl
          .split("/")
          .pop();
        await utApi.deleteFiles(existingEventImageUrlKey);
      }
    } catch (error) {
      console.error("Error deleting event image:", error);
    }

    if (existingEvent.organizer.clerkId !== userId) {
      throw new Error("You are not authorized to update this event");
    }

    const newCategory = await Category.findOneAndUpdate(
      { name: event.category },
      {
        $setOnInsert: {
          name: event.category,
          followers: [existingEvent.organizer._id],
          events: [],
        },
      },
      { upsert: true, new: true }
    );
    console.log({
      existingEventCategoryName: existingEvent.category.name,
      newCategoryName: newCategory.name,
    });
    const isCategoryChanged = existingEvent.category.name !== newCategory.name;

    await Category.updateOne(
      { _id: newCategory._id },
      { $addToSet: { followers: existingEvent.organizer._id } }
    );

    // If the category has changed, remove the event from the old category
    if (isCategoryChanged) {
      await Category.updateOne(
        { _id: existingEvent.category },
        { $pull: { events: existingEvent._id } }
      );
    }
    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      {
        title: event.title,
        description: event.description,
        location: event.location,
        imageUrl: event.imageUrl,
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
        price: event.price,
        isFree: event.isFree,
        url: event.url,
        category: newCategory._id,
      },
      { new: true }
    );

    if (!updatedEvent) {
      throw new Error("Error updating event");
    }

    if (isCategoryChanged) {
      // Check if the user has any remaining events in the old category
      const remainingEventsInOldCategory = await Event.countDocuments({
        organizer: existingEvent.organizer._id,
        category: existingEvent.category._id,
      });

      if (remainingEventsInOldCategory === 0) {
        await Category.updateOne(
          { _id: existingEvent.category },
          { $pull: { followers: existingEvent.organizer._id } }
        );
      }
    }

    await Category.updateOne(
      { _id: newCategory._id },
      { $addToSet: { events: updatedEvent._id } }
    );

    revalidatePath("/");
    revalidateTag("user_tickets");
    revalidatePath(path);
    revalidatePath(`${path}/update`);
    revalidatePath("/community");
    revalidatePath(`/profile/${existingEvent.organizer.clerkId}`);
    revalidatePath("/categories");
    revalidatePath(`/categories/${newCategory._id.toString()}`);
    revalidatePath("/saved");
  } catch (error) {
    console.error("Error updating event:", error);
    throw new Error("Error updating event");
  }
}

export async function deleteEventById(eventId: string): Promise<void> {
  try {
    await connectToDB();

    const event = await Event.findById(eventId).populate({
      path: "category",
      select: "_id",
      model: Category,
    });
    if (!event) {
      throw new Error("Event not found");
    }
    try {
      const utApi = new UTApi();
      const eventImageUrlKey = event.imageUrl.split("/").pop();
      await utApi.deleteFiles(eventImageUrlKey);
    } catch (error) {
      console.error("Error deleting event image:", error);
    }

    await Category.updateOne(
      { _id: event.category },
      { $pull: { events: event._id, followers: event.organizer } }
    );

    await User.updateMany(
      { savedEvents: event._id },
      { $pull: { events: event._id } }
    );

    await Order.deleteMany({ event: event._id });

    await Event.findByIdAndDelete(eventId);

    const organizer = await User.findById(event.organizer._id).select(
      "clerkId _id"
    );
    if (!organizer) {
      throw new Error("Organizer not found");
    }
    await organizer.updateOne(
      { _id: organizer._id },
      { $inc: { eventsCreatedCount: -1 } }
    );

    revalidatePath("/saved");
    revalidatePath("/");
    revalidatePath("/categories");
    revalidatePath("/community");
    revalidatePath("/orders");
    revalidatePath(`/categories/${event.category._id.toString()}`);
    revalidatePath(`/events/${event._id.toString()}`);
    revalidatePath(`/profile/${organizer.clerkId}`);
    revalidateTag("user_tickets");

    console.log(`Event with ID ${eventId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw new Error("Error deleting event");
  }
}

export async function getAllEvents({
  query = "",
  category = "",
  limit = 10,
  page = 1,
}: GetAllEventsParams): Promise<{
  allEvents: any[];
  isNextPage: boolean;
  totalEventsCount: number;
}> {
  const cachedGetAllEvents = unstable_cache(
    async ({ query, category, limit, page }: GetAllEventsParams) => {
      try {
        await connectToDB();
        const skip = (page - 1) * limit;

        const searchQuery: any = {};
        if (query) {
          searchQuery["$or"] = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ];
        }

        let sortOption = {};
        switch (category) {
          case "popular":
            sortOption = { savedCount: -1, createdAt: -1 };
            break;
          case "recent":
            sortOption = { createdAt: -1 };
            break;
          case "name":
            sortOption = { name: 1 };
            break;
          case "old":
            sortOption = { createdAt: 1 };
            break;
          case "free":
            searchQuery.isFree = true;
            sortOption = { createdAt: -1 };
            break;
          case "cheapest":
            sortOption = { price: 1 };
            break;
          case "most-expensive":
            sortOption = { price: -1 };
            break;
          default:
            sortOption = { createdAt: -1 };
            break;
        }

        const allEvents = await Event.find(searchQuery)
          .sort(sortOption)
          .skip(skip)
          .limit(limit)
          .populate({
            path: "organizer",
            select: "clerkId username photo",
            model: User,
          })
          .populate({ path: "category", select: "_id name", model: Category })
          .exec();

        const totalEventsCount = await Event.countDocuments(searchQuery);
        const isNextPage = totalEventsCount > skip + allEvents.length;
        const totalEventsCountWithoutQuery = await Event.countDocuments();

        return { allEvents, isNextPage, totalEventsCount: totalEventsCountWithoutQuery };
      } catch (err: any) {
        console.error("Error fetching all events:", err);
        throw new Error("Error fetching all events");
      }
    },
    ["all_events"],
    { tags: ["all_events"], revalidate: 600 }
  );

  return cachedGetAllEvents({ query, category, limit, page });
}

export async function getEventById(eventId: string) {
  const cachedGetEventById = unstable_cache(
    async (eventId: string) => {
      try {
        await connectToDB();

        const event = await Event.findById(eventId)
          .populate({
            path: "organizer",
            select: "clerkId username photo firstName lastName",
            model: User,
          })
          .populate({ path: "category", select: "_id name", model: Category })
          .exec();

        if (!event) {
          throw new Error("Event not found");
        }

        return event;
      } catch (err) {
        console.error("Error fetching event by ID:", err);
        throw new Error("Error fetching event by ID");
      }
    },
    ["event_by_id"],
    { tags: ["event_by_id"], revalidate: 600 }
  );

  return cachedGetEventById(eventId);
}

export async function getRelatedEvents({
  categoryId,
  currentEventId,
  query = "",
  category = "",
  page = 1,
  limit = 10,
}: GetAllEventsParams & {
  categoryId: string;
  currentEventId: string;
}): Promise<{
  events: Event[];
  isNext: boolean;
}> {
  const cachedGetRelatedEvents = unstable_cache(
    async ({
      categoryId,
      currentEventId,
      query,
      category,
      page,
      limit,
    }: GetAllEventsParams & { categoryId: string; currentEventId: string }) => {
      try {
        await connectToDB();

        const skip = (page - 1) * limit;
        const searchQuery: any = {
          category: categoryId,
          _id: { $ne: currentEventId }, // Exclude the current event
        };

        if (query) {
          searchQuery["$or"] = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ];
        }

        let sortOption = {};
        switch (category) {
          case "popular":
            sortOption = { savedCount: -1, createdAt: -1 };
            break;
          case "recent":
            sortOption = { createdAt: -1 };
            break;
          case "name":
            sortOption = { title: 1 };
            break;
          case "old":
            sortOption = { createdAt: 1 };
            break;
          case "free":
            searchQuery.isFree = true;
            sortOption = { createdAt: -1 };
            break;
          case "cheapest":
            sortOption = { price: 1 };
            break;
          case "most-expensive":
            sortOption = { price: -1 };
            break;
          default:
            sortOption = { createdAt: -1 };
            break;
        }

        const events = await Event.find(searchQuery)
          .sort(sortOption)
          .skip(skip)
          .limit(limit)
          .populate({
            path: "organizer",
            select: "clerkId username photo",
            model: User,
          })
          .populate({ path: "category", select: "_id name", model: Category })
          .exec();

        const totalCount = await Event.countDocuments(searchQuery);
        const isNextPage = totalCount > skip + events.length;

        return { events, isNext: isNextPage };
      } catch (err) {
        console.error("Error fetching related events:", err);
        throw new Error("Error fetching related events");
      }
    },
    ["related_events"],
    { tags: ["related_events"], revalidate: 600 }
  );

  return cachedGetRelatedEvents({
    categoryId,
    currentEventId,
    query,
    category,
    page,
    limit,
  });
}
