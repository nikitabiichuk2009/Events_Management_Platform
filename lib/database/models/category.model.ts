import { Schema, models, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  events: Schema.Types.ObjectId[];
  followers: Schema.Types.ObjectId[];
}

const CategorySchema = new Schema({
  name: { type: String, required: true },
  events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Category = models.Category || model<ICategory>("Category", CategorySchema);

export default Category;
