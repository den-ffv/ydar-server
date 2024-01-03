import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

import router from "./router/routers.js";

const PORT = process.env.PORT || 5555;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", router);

const start = async () => {
  try {
    await mongoose
      .connect(process.env.DB_UNL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("Successful database connection 🥳"))
      .catch((err) => console.log("Error when connected to database 😱", err));
    app.listen(PORT, () => console.log(`Server started on PORT: ${PORT} 🚀`));
  } catch (err) {
    console.log(err);
  }
};
start();
