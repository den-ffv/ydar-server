import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

import router from "./router/routers.js";
import passport from "passport";
import session from "express-session";

const PORT = process.env.PORT || 5555;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", router);
app.get("/", (req, res) => {
  return res.send("hello");
});

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
