import mongoose from "mongoose";
import { Snowflake } from "@theinternetfolks/snowflake";

const communitySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => Snowflake.generate().toString(),
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    owner: {
      type: String,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model("Community", communitySchema);
