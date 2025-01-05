"use server";

import { GetAllCategoriesParams } from "@/types";
import { connectToDB } from "../database";
import Category, { ICategory } from "../database/models/category.model";
import { FilterQuery } from "mongoose";

export async function getAllCategories(params: GetAllCategoriesParams): Promise<{ categories: ICategory[], isNext: boolean }> {
  try {
    await connectToDB();
    const { page = 1, pageSize = 10, query, filter } = params;
    const searchQuery: FilterQuery<typeof Category> = query
      ? { name: { $regex: new RegExp(query, "i") } }
      : {};

    let sortOption = {};
    switch (filter) {
      case "popular":
        sortOption = { followers: -1 };
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
        sortOption = { questionsCount: -1 };
        break;
    }
    const categories = await Category.find(searchQuery).sort(sortOption).skip((page - 1) * pageSize).limit(pageSize);
    const totalCategories = await Category.countDocuments(searchQuery);
    const hasNextPage = totalCategories > ((page - 1) * pageSize) + categories.length;
    return { categories, isNext: hasNextPage };
  } catch (err) {
    console.error("Error getting all categories:", err);
    throw new Error("Error getting all categories");
  }
}
