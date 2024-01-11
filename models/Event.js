import { Schema, model } from "mongoose";

const Event = new Schema({
  //author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  imageUrl: { type: String, require: true },
  title: { type: String, require: true },
  content: { type: String, require: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  location: { type: String, required: true },
  //attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default model("Event", Event);
