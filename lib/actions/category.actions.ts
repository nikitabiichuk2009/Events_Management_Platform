"use server";

import { GetAllCategoriesParams, GetEventsByCategoryIdParams } from "@/types";
import { connectToDB } from "../database";
import Category, { ICategory } from "../database/models/category.model";
import { FilterQuery } from "mongoose";
import Event from "../database/models/event.model";
import User from "../database/models/user.model";
import { unstable_cache } from "next/cache";

export async function getAllCategories(params: GetAllCategoriesParams): Promise<{ categories: ICategory[], isNext: boolean }> {
  const cachedGetAllCategories = unstable_cache(
    async (params: GetAllCategoriesParams) => {
      try {
        await connectToDB();
        const { page = 1, limit = 10, query, filter, isFilterByName } = params;

        const searchQuery: FilterQuery<typeof Category> = query
          ? { name: { $regex: new RegExp(query, "i") } }
          : {};

        let sortOption = {};
        switch (filter) {
          case "popular":
            sortOption = { eventsCount: -1, createdAt: -1 };
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
          default:
            sortOption = isFilterByName ? { name: 1 } : { createdAt: -1 };
            break;
        }

        const categories = await Category.aggregate([
          { $match: searchQuery },
          {
            $addFields: {
              eventsCount: { $size: "$events" },
            },
          },
          { $sort: sortOption },
          { $skip: (page - 1) * limit },
          { $limit: limit },
        ]);

        const totalCategories = await Category.countDocuments(searchQuery);
        const hasNextPage = totalCategories > (page - 1) * limit + categories.length;

        return { categories, isNext: hasNextPage };
      } catch (err) {
        console.error("Error getting all categories:", err);
        throw new Error("Error getting all categories");
      }
    },
    ["all_categories"],
    { tags: ["all_categories"], revalidate: 600 }
  );

  return cachedGetAllCategories(params);
}

export async function getEventsByCategoryId({
  categoryId,
  query = "",
  filter = "",
  page = 1,
  limit = 10,
}: GetEventsByCategoryIdParams): Promise<{ events: Event[], isNext: boolean }> {
  const cachedGetEventsByCategoryId = unstable_cache(
    async ({ categoryId, query, filter, page, limit }: GetEventsByCategoryIdParams) => {
      try {
        await connectToDB();

        const skip = (page - 1) * limit;

        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
          throw new Error("Category not found");
        }

        const searchQuery: any = {
          category: categoryId,
        };
        if (query) {
          searchQuery["$or"] = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ];
        }

        let sortOption = {};
        switch (filter) {
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
          .populate({ path: "organizer", select: "clerkId username photo", model: User })
          .populate({ path: "category", select: "_id name", model: Category })
          .exec();

        const totalEventsCount = await Event.countDocuments(searchQuery);
        const isNextPage = totalEventsCount > skip + events.length;

        return {
          events,
          isNext: isNextPage,
        };
      } catch (err) {
        console.error("Error fetching events by category:", err);
        throw new Error("Error fetching events by category");
      }
    },
    ["events_by_category"],
    { tags: ["events_by_category"], revalidate: 600 }
  );

  return cachedGetEventsByCategoryId({ categoryId, query, filter, page, limit });
}