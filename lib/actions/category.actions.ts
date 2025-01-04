"use server";

import { connectToDB } from "../database";
import Category, { ICategory } from "../database/models/category.model";

export async function getAllCategories(): Promise<ICategory[]> {
  try {
    await connectToDB();
    const categories = await Category.find({});
    return categories;
  } catch (err) {
    console.error("Error getting all categories:", err);
    throw new Error("Error getting all categories");
  }
}
