import { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  photo?: string;
  bio?: string;
  location?: string;
  personalWebsite?: string;
  joinDate: Date;
  savedEvents: Schema.Types.ObjectId[];
}

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  photo: { type: String },
  bio: { type: String },
  location: { type: String },
  personalWebsite: { type: String },
  joinDate: { type: Date, default: Date.now },
  savedEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
});

const User = models.User || model<IUser>("User", UserSchema);

export default User;
