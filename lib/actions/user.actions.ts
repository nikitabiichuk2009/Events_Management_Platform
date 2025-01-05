"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../database";
import User, { IUser } from "../database/models/user.model";
import Order from "../database/models/order.model";
import Category from "../database/models/category.model";
import Event, { IEvent } from "../database/models/event.model";
import { CreateUserParams, DeleteUserParams, GetEventsByUserParams, GetSavedEventsByUserParams, SaveEventParams, UpdateUserParams } from "@/types";
import { FilterQuery } from "mongoose";
import { stringifyObject } from '@/lib/utils';
import mongoose from "mongoose";

export async function createUser(userData: CreateUserParams): Promise<IUser> {
  await connectToDB();

  try {
    const newUser = await User.create(userData);
    revalidatePath("/");
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
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      updateData,
      { new: true }
    );
    revalidatePath("/");
    revalidatePath(path);

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
    return user;
  } catch (err) {
    console.error("Error deleting user and related data:", err);
    throw new Error("Error deleting user and related data");
  }
}

export async function getUserCategories(userId: string): Promise<{ name: string; id: string }[]> {
  try {
    await connectToDB();
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const categoriesResult = await Category.aggregate([
      { $match: { followers: userObjectId } },
      {
        $project: {
          _id: 0,
          name: 1,
        },
      },
    ]);
    const categories = categoriesResult.map((category: { name: string, _id: string }) => ({
      name: category.name,
      id: category._id,
    }));
    return categories;
  } catch (error) {
    console.error("Error fetching user categories:", error);
    throw new Error("Error fetching user categories");
  }
}

export async function getUserOrganizedEvents({
  userId,
  query = "",
  category = "",
  page = 1,
  limit = 10,
}: GetEventsByUserParams): Promise<{ events: Event[]; isNextPage: boolean }> {
  try {
    await connectToDB();

    const skip = (page - 1) * limit;
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const searchQuery: FilterQuery<IEvent> = { organizer: userObjectId };

    if (query) {
      searchQuery.title = { $regex: query, $options: "i" };
    }

    let sortOption = {};
    switch (category) {
      case "popular":
        sortOption = { savedCount: -1 };
        break;
      case "recent":
        sortOption = { createdAt: -1 };
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
      .populate({ path: "category", model: Category })
      .populate({ path: "organizer", model: User });

    const totalCount = await Event.countDocuments(searchQuery);
    const isNextPage = totalCount > skip + events.length;

    return { events, isNextPage };
  } catch (err) {
    console.error("Error fetching organized events:", err);
    throw new Error("Error fetching organized events");
  }
}

export async function getUserByClerkId(clerkId: string, shouldPopulateSavedEvents: boolean) {
  try {
    await connectToDB();
    const user = await User.findOne({ clerkId });
    if (!user) {
      throw new Error("User not found!");
    }
    if (shouldPopulateSavedEvents) {
      user.populate({ path: "savedEvents", model: Event });
    }
    return user;
  } catch (error) {
    console.error("Error fetching user by clerkId:", error);
    throw new Error("Error fetching user by clerkId");
  }
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
}> {
  try {
    await connectToDB();

    const user = await User.findOne({ clerkId }).populate({ path: "savedEvents", model: Event });

    if (!user) {
      throw new Error("User not found");
    }

    const skip = (page - 1) * limit;

    const searchQuery: FilterQuery<IEvent & { _id: string }> = {
      _id: { $in: user.savedEvents.map((event: IEvent & { _id: string }) => event._id) },
    };

    if (query) {
      searchQuery.title = { $regex: query, $options: "i" };
    }

    let sortOption = {};
    switch (category) {
      case "popular":
        sortOption = { savedCount: -1 };
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
      .populate({ path: "organizer", model: User })
      .populate({ path: "category", model: Category })
      .exec();

    const totalSavedEventsCount = await Event.countDocuments(searchQuery);
    const isNextPage = totalSavedEventsCount > skip + savedEvents.length;

    return { savedEvents, isNextPage };
  } catch (err) {
    console.error("Error fetching saved events:", err);
    throw new Error("Error fetching saved events");
  }
}
