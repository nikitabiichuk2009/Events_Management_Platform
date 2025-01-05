import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).max(40, { message: "Title must be less than 40 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(400, { message: "Description must be less than 400 characters" }),
  location: z.string().min(3, { message: "Location must be at least 3 characters" }).max(150, { message: "Location must be less than 150 characters" }),
  url: z.string().url({ message: "Invalid URL" }),
  imageUrl: z.string().url({ message: "Invalid image URL" }),
  price: z.number().max(10000000000, { message: "ARE YOU SERIOUS? Price must be less than 10000000000." }),
  category: z.string().min(3, { message: "Category must be at least 3 characters" }).max(35, { message: "Category must be less than 35 characters" }),
  isFree: z.boolean({ message: "Please select whether the event is free" }),
  startDateTime: z.date({ message: "Start date and time is required" }),
  endDateTime: z.date({ message: "End date and time is required" }),
});
