import { Schema, model } from "mongoose";

const User = new Schema({
  userPhoto: { type: String, required: false, default: null },
  name: { type: String, required: true },
  lastname: { type: String, required: false, default: null },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: [{ type: String, ref: "Role" }],
  rating: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  savedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  savedEvent: [{ type: Schema.Types.ObjectId, ref: "Event" }],
  isVerification: { type: Boolean, default: false },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String, required: false },
  telegramId: { type: String, required: false, default: Date.now },
  googleId: { type: String, required: false, default: Date.now },
});

export default model("User", User);
