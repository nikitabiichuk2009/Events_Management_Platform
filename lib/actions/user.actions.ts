"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../database";
import User, { IUser } from "../database/models/user.model";
import Order from "../database/models/order.model";
import Category, { ICategory } from "../database/models/category.model";
import Event from "../database/models/event.model";
import { CreateUserParams, DeleteUserParams, GetUserStatsParams, SaveEventParams, UpdateUserParams } from "@/types";
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
    return updatedUser;
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

export async function getUserCategories(params: GetUserStatsParams): Promise<{ categories: ICategory[], isNext: boolean }> {
  try {
    await connectToDB();
    const { userId, page = 1, pageSize = 10 } = params;
    const skip = (page - 1) * pageSize;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const categories = await Category.aggregate([
      { $match: { followers: userObjectId } },
      {
        $addFields: {
          eventsCount: { $size: "$events" },
        },
      },
      {
        $sort: { eventsCount: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: pageSize,
      },
    ]);

    const totalUserCategories = await Category.countDocuments({ followers: userObjectId });
    const hasNextPage = totalUserCategories > skip + categories.length;

    return { categories, isNext: hasNextPage };
  } catch (error) {
    console.error("Error fetching user categories:", error);
    throw new Error("Error fetching user categories");
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    await connectToDB();
    const user = await User.findOne({ clerkId });
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