import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minLength: [6, "Email must be at least 6 characters"],
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password must be at least 8 characters"],
      select: false,
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("ChatApp", userSchema); // ("collection name " , "the schema")
