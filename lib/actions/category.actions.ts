"use server";

import { connectToDB } from "../database";
import Category from "../database/models/category.model";

export async function getAllCategories() {
  try {
    await connectToDB();
    const categories = await Category.find({}).lean();
    return categories;
  } catch (err) {
    console.error("Error getting all categories:", err);
    throw new Error("Error getting all categories");
  }
}
