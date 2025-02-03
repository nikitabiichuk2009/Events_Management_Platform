"use server";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { connectToDB } from "../database";
import User, { IUser } from "../database/models/user.model";
import Order from "../database/models/order.model";
import Category from "../database/models/category.model";
import Event, { IEvent } from "../database/models/event.model";
import {
  CreateUserParams,
  DeleteUserParams,
  GetSavedEventsByUserParams,
  SaveEventParams,
  UpdateUserParams,
  GetUserTicketsParams,
  GetAllUsersParams,
  GetUserOrganizedEventsParams,
} from "@/types";
import { FilterQuery } from "mongoose";
import { stringifyObject } from "@/lib/utils";
import mongoose from "mongoose";

export async function createUser(userData: CreateUserParams): Promise<IUser> {
  await connectToDB();

  try {
    const newUser = await User.create(userData);
    revalidatePath("/");
    revalidatePath("/community");
    return newUser;
  } catch (err) {
    console.error("Error creating user:", err);
    throw new Error("Error creating user");
  }
}

export async function updateUser(userData: UpdateUserParams): Promise<IUser> {
  const { clerkId, updateData, path } = userData;

  await connectToDB();

  try {
    const updatedUser = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });
    revalidatePath("/");
    revalidatePath(path);
    revalidatePath(`${path}/update`);
    revalidatePath("/community");
    revalidatePath("/categories");
    revalidateTag("events_by_category");
    revalidateTag("event_by_id");
    revalidatePath("/orders");
    revalidatePath("/saved");
    revalidateTag("user_tickets");
    revalidateTag("user_organized_events");

    return stringifyObject(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    throw new Error("Error updating user");
  }
}

export async function deleteUser(userData: DeleteUserParams): Promise<IUser> {
  const { clerkId } = userData;

  await connectToDB();

  try {
    const user = await User.findOne({ clerkId });
    if (!user) {
      throw new Error("User not found!");
    }

    await Order.deleteMany({ buyer: user._id });

    const events = await Event.find({ organizer: user._id });
    const eventIds = events.map((event) => event._id);

    await Event.deleteMany({ organizer: user._id });

    await Category.updateMany(
      { events: { $in: eventIds } },
      { $pull: { events: { $in: eventIds } } }
    );

    await Category.updateMany(
      { followers: user._id },
      { $pull: { followers: user._id } }
    );

    await User.deleteOne({ clerkId });

    revalidatePath("/");
    revalidatePath("/community");
    revalidatePath("/categories");
    revalidateTag("events_by_category");
    revalidatePath("/orders");
    revalidatePath("/saved");
    revalidateTag("user_tickets");
    revalidateTag("user_organized_events");

    return user;
  } catch (err) {
    console.error("Error deleting user and related data:", err);
    throw new Error("Error deleting user and related data");
  }
}

export async function getUserCategories(
  userId: string
): Promise<{ name: string; id: string }[]> {
  const cachedGetUserCategories = unstable_cache(
    async (userId: string) => {
      try {
        await connectToDB();
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const categoriesResult = await Category.aggregate([
          { $match: { followers: userObjectId } },
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ]);
        const categories = categoriesResult.map(
          (category: { name: string; _id: string }) => ({
            name: category.name,
            id: category._id.toString(),
          })
        );
        return categories;
      } catch (error) {
        console.error("Error fetching user categories:", error);
        throw new Error("Error fetching user categories");
      }
    },
    ["user_categories"],
    { tags: ["user_categories"], revalidate: 600 }
  );

  return cachedGetUserCategories(userId);
}

export async function getUserOrganizedEvents({
  userId,
  query = "",
  category = "",
  page = 1,
  limit = 10,
}: GetUserOrganizedEventsParams): Promise<{
  events: Event[];
  isNextPage: boolean;
  totalOrganizedEventsCount: number;
  resetPageCount: boolean;
}> {
  const cachedGetUserOrganizedEvents = unstable_cache(
    async ({
      userId,
      query,
      category,
      page,
      limit,
    }: GetUserOrganizedEventsParams) => {
      await connectToDB();

      const skip = (page - 1) * limit;
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const searchQuery: FilterQuery<IEvent> = { organizer: userObjectId };

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
        .populate({ path: "category", select: "_id name", model: Category })
        .populate({
          path: "organizer",
          select: "clerkId username photo",
          model: User,
        });

      const totalCount = await Event.countDocuments(searchQuery);
      const totalOrganizedEventsCount = await Event.countDocuments({
        organizer: userObjectId,
      });
      const isNextPage = totalCount > skip + events.length;
      const resetPageCount = totalCount < skip;
      return { events, isNextPage, totalOrganizedEventsCount, resetPageCount };
    },
    ["user_organized_events"],
    { tags: ["user_organized_events"], revalidate: 600 }
  );

  return cachedGetUserOrganizedEvents({ userId, query, category, page, limit });
}

export async function getUserTickets({
  userId,
  query = "",
  category = "",
  limit = 10,
  page = 1,
}: GetUserTicketsParams): Promise<{
  tickets: (typeof Order)[];
  isNextPage: boolean;
  totalTicketsCount: number;
  resetPageCount: boolean;
}> {
  const cachedGetUserTickets = unstable_cache(
    async ({ userId, query, category, limit, page }: GetUserTicketsParams) => {
      try {
        await connectToDB();

        const skip = (page! - 1) * limit!;

        let matchingEventIds: mongoose.Types.ObjectId[] = [];
        if (query) {
          const searchRegex = new RegExp(query, "i");
          const matchingEvents = await Event.find({
            $or: [{ title: searchRegex }, { description: searchRegex }],
          }).select("_id");
          matchingEventIds = matchingEvents.map((event) => event._id);
        }

        const searchQuery: FilterQuery<typeof Order> = { buyer: userId };
        if (query) {
          searchQuery.event = { $in: matchingEventIds };
        }

        let sortOption = {};
        switch (category) {
          case "recently-purchased":
            sortOption = { createdAt: -1 };
            break;
          case "oldest":
            sortOption = { createdAt: 1 };
            break;
          case "cheapest":
            sortOption = { totalAmount: 1 };
            break;
          case "most-expensive":
            sortOption = { totalAmount: -1 };
            break;
          default:
            sortOption = { createdAt: -1 };
            break;
        }

        let tickets = await Order.find(searchQuery)
          .sort(sortOption)
          .skip(skip)
          .limit(limit!)
          .populate({
            path: "event",
            model: Event,
            select:
              "title description startDateTime endDateTime category organizer savedCount _id imageUrl price isFree",
            populate: [
              {
                path: "organizer",
                model: User,
                select: "firstName lastName username clerkId photo",
              },
              {
                path: "category",
                model: Category,
                select: "name _id",
              },
            ],
          })
          .populate({
            path: "buyer",
            model: User,
            select: "firstName lastName username clerkId photo",
          });

        const totalCount = await Order.countDocuments(searchQuery);
        const totalTicketsCount = await Order.countDocuments({ buyer: userId });
        const isNextPage = totalCount > skip + tickets.length;
        const resetPageCount = totalCount < skip;
        return { tickets, isNextPage, totalTicketsCount, resetPageCount };
      } catch (err) {
        console.error("Error fetching user tickets:", err);
        throw new Error("Error fetching user tickets");
      }
    },
    ["user_tickets"],
    { tags: ["user_tickets"], revalidate: 600 }
  );

  return cachedGetUserTickets({ userId, query, category, limit, page });
}

export async function getUserByClerkId(
  clerkId: string,
  shouldPopulateSavedEvents: boolean
) {
  const cachedGetUserByClerkId = unstable_cache(
    async (clerkId: string) => {
      await connectToDB();
      const user = await User.findOne({ clerkId });
      if (!user) {
        throw new Error("User not found!");
      }
      if (shouldPopulateSavedEvents) {
        user.populate({ path: "savedEvents", model: Event });
      }
      return user;
    },
    ["user_by_clerk_id"],
    { tags: ["user_by_clerk_id"], revalidate: 600 }
  );

  return cachedGetUserByClerkId(clerkId);
}

export async function saveEvent(params: SaveEventParams): Promise<void> {
  try {
    await connectToDB();
    const { eventId, userClerkId, hasSaved, path } = params;

    const userUpdate = hasSaved
      ? { $pull: { savedEvents: eventId } }
      : { $addToSet: { savedEvents: eventId } };

    const user = await User.findOneAndUpdate(
      { clerkId: userClerkId },
      userUpdate,
      { new: true }
    );

    if (!user) {
      throw new Error("User not found!");
    }

    const eventUpdate = hasSaved
      ? { $inc: { savedCount: -1 } }
      : { $inc: { savedCount: 1 } };

    const event = await Event.findByIdAndUpdate(eventId, eventUpdate, {
      new: true,
    });

    if (!event) {
      throw new Error("Event not found!");
    }

    revalidatePath(path);
    revalidatePath("/saved");
  } catch (err) {
    console.error("Error saving event:", err);
    throw new Error("Error saving event.");
  }
}

export async function getUserSavedEventsByClerkId({
  clerkId,
  query = "",
  category = "",
  limit = 10,
  page = 1,
}: GetSavedEventsByUserParams): Promise<{
  savedEvents: Event[];
  isNextPage: boolean;
  resetPageCount: boolean;
}> {
  const cachedGetUserSavedEventsByClerkId = unstable_cache(
    async ({
      clerkId,
      query,
      category,
      limit,
      page,
    }: GetSavedEventsByUserParams) => {
      try {
        await connectToDB();

        const user = await User.findOne({ clerkId }).populate({
          path: "savedEvents",
          model: Event,
        });

        if (!user) {
          throw new Error("User not found");
        }

        const skip = (page - 1) * limit;

        const searchQuery: FilterQuery<IEvent & { _id: string }> = {
          _id: {
            $in: user.savedEvents.map(
              (event: IEvent & { _id: string }) => event._id
            ),
          },
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

        const savedEvents = await Event.find(searchQuery)
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

        const totalSavedEventsCount = await Event.countDocuments(searchQuery);
        const resetPageCount = totalSavedEventsCount < skip;
        const isNextPage = totalSavedEventsCount > skip + savedEvents.length;

        return { savedEvents, isNextPage, resetPageCount };
      } catch (err) {
        console.error("Error fetching saved events:", err);
        throw new Error("Error fetching saved events");
      }
    },
    ["user_saved_events_by_clerk_id"],
    { tags: ["user_saved_events_by_clerk_id"], revalidate: 600 }
  );

  return cachedGetUserSavedEventsByClerkId({
    clerkId,
    query,
    category,
    limit,
    page,
  });
}

export async function getUserOrganizedEventsAndOrders(clerkId: string) {
  const cachedGetUserOrganizedEventsAndOrders = unstable_cache(
    async (clerkId: string) => {
      try {
        await connectToDB();

        const user = await User.findOne({ clerkId });

        if (!user) {
          throw new Error("User not found");
        }

        const organizedEvents = await Event.find({ organizer: user._id });

        if (!organizedEvents.length) {
          return {
            organizedEvents: [],
            orders: [],
          };
        }

        const eventIds = organizedEvents.map((event) => event._id);
        const orders = await Order.find({ event: { $in: eventIds } })
          .sort({ createdAt: -1 })
          .populate({
            path: "event",
            model: Event,
            select: "title description",
          })
          .populate({
            path: "buyer",
            model: User,
            select: "username email photo clerkId",
          });

        return {
          organizedEvents,
          orders,
        };
      } catch (err) {
        console.error("Error fetching user-organized events and orders:", err);
        throw new Error("Error fetching user-organized events and orders");
      }
    },
    ["organized_events_and_orders"],
    { tags: ["organized_events_and_orders"], revalidate: 600 }
  );

  return cachedGetUserOrganizedEventsAndOrders(clerkId);
}

export async function getAllUsers({
  query = "",
  filter = "newUsers",
  page = 1,
  limit = 10,
}: GetAllUsersParams): Promise<{
  users: IUser[];
  isNextPage: boolean;
  totalUsersCount: number;
  resetPageCount: boolean;
}> {
  const cachedGetAllUsers = unstable_cache(
    async ({ query, filter, page, limit }: GetAllUsersParams) => {
      await connectToDB();

      const skip = (page - 1) * limit;

      const searchQuery: any = {};
      if (query) {
        searchQuery.$or = [
          { username: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } },
          { firstName: { $regex: query, $options: "i" } },
        ];
      }

      let sortOption = {};
      switch (filter) {
        case "newUsers":
          sortOption = { joinDate: -1 };
          break;
        case "oldUsers":
          sortOption = { joinDate: 1 };
          break;
        case "topCreators":
          sortOption = { eventsCreatedCount: -1 };
          break;
        default:
          sortOption = { joinDate: -1 };
      }

      const users = await User.find(searchQuery)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .select(
          "_id clerkId username firstName lastName photo eventsCreatedCount"
        )
        .exec();

      const totalUsersCount = await User.countDocuments(searchQuery);
      const isNextPage = totalUsersCount > skip + users.length;
      const resetPageCount = totalUsersCount < skip;
      return { users, isNextPage, totalUsersCount, resetPageCount };
    },
    ["all_users"],
    { tags: ["all_users"], revalidate: 600 }
  );

  return cachedGetAllUsers({ query, filter, page, limit });
}
