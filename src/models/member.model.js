import mongoose from "mongoose";
import { Snowflake } from "@theinternetfolks/snowflake";

const memberSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => Snowflake.generate().toString(),
      required: true,
    },
    community: {
      type: String,
      ref: "Community",
      required: true,
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      ref: "Role",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Member", memberSchema);
