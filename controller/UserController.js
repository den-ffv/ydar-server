import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";
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
      const { name, lastname, email, password } = req.body;
      const userData = await UserService.registration(
        name,
        lastname,
        email,
        password,
        res
      );

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res
        .status(200)
        .json({ message: "The user is successfully arranged", userData });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Registration error", err });
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
      console.error(err);
      return res.status(400).json({ message: "Login error" });
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
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found 😩" });
      }
      user.isVerification = true;
      await user.save();
      return res.status(200).json({ message: "User verified successfully 🥳" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error 😩" });
    }
  }
  async getUsers(req, res) {
    try {
      const users = await User.find();

      if (!users) {
        return res.status(400).json({ message: "Failed to get users" });
      }

      return res.json({ users });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "Error when receiving users" });
    }
  }
  async getUserByID(req, res) {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId);

      if (!user) {
        return res
          .status(400)
          .json({ message: "User with such ID was not found" });
      }

      return res
        .status(200)
        .json({ message: "User successfully received", user });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Error when receiving user" });
    }
  }
  async deleteUser(req, res) {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId);

      if (!user) {
        return res
          .status(200)
          .json({ message: "User with such ID was not found" });
      }

      await User.deleteOne({ _id: userId });
      return res
        .status(200)
        .json({ message: "The user has been successfully deleted" });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Error when deleted user" });
    }
  }
  async addAvatar(req, res) {
    try {
      const userId = req.params.id;

      const nameOfProfilePicture = req.file.filename;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { userPhoto: nameOfProfilePicture },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(400).json({ message: "User not found" });
      }

      res.json({
        user: updatedUser,
        message: "The photo is successfully installed",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error installing photo" });
    }
  }
}

export default new UserController();
