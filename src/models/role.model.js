import mongoose from "mongoose";
import { Snowflake } from "@theinternetfolks/snowflake";


const roleSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => Snowflake.generate().toString(),
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please enter the role name"],
      minLength: [2, "Role name must be at least 2 characters"],
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Role", roleSchema);
