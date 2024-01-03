import User from "../models/User.js";

import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { secret } from "../config.js";

import UserService from "../service/userService.js";

const generateAccessToken = (id, roles, isVerification) => {
  const payload = {
    id,
    roles,
    isVerification,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class UserController {
  async registration(req, res, next) {
    try {
      // const validationError = validationResult(req);
      // if (!validationError.isEmpty()) {
      //   return res
      //     .status(400)
      //     .json({ message: "Restration error", validationError });
      // }
      const { name, lastname, email, password } = req.body;
      const userData = await UserService.registration(name, lastname, email, password);

      res.cookie("refreshToken", userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly : true})

      return res.status(200).json({ message: "The user is successfully arranged", userData })
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Registration error", err });
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: "User was not found" });
      }
      const validePassword = bcrypt.compareSync(password, user.password);
      if (!validePassword) {
        res.status(400).json({ message: "The password is not correct" });
      }
      const token = generateAccessToken(
        user._id,
        user.role,
        user.isVerification
      );
      return res.json({ token, user });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Login error" });
    }
  }
  async logout(req, res, next) {
    try {
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "" });
    }
  }
  async refresh(req, res, next) {
    try {
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "" });
    }
  }
  async activate(req, res, next) {
    try {
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "" });
    }
  }

  async verifyUser(req, res) {
    const { userId } = req.params;
    console.log(req.user);
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found 😩" });
      }
      user.isVerification = true;
      await user.save();
      res.status(200).json({ message: "User verified successfully 🥳" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error 😩" });
    }
  }
  async getUsers(req, res) {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Failed to get users" });
    }
  }
}

export default new UserController();
