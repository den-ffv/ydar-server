import { Schema, model } from "mongoose";


const Post = new Schema({
  //author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  imageUrl: { type: String, require: true },
  title: { type: String, require: true },
  content: { type: String, require: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default model("Post", Post);
