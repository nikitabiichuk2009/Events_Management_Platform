import { Schema, models, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  events: Schema.Types.ObjectId[];
  followers: Schema.Types.ObjectId[];
  createdAt: Date;
}

const CategorySchema = new Schema({
  name: { type: String, required: true },
  events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

const Category = models.Category || model<ICategory>("Category", CategorySchema);

export default Category;
