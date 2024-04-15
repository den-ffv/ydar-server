import bcrypt from "bcryptjs";
import { v4 } from "uuid";
import multer from "multer";
import fs from "fs";
import path from "path";

import User from "../models/User.js";
import Role from "../models/Role.js";

import MailService from "../service/mailService.js";
import generateAccessToken from "../config/generateToken.js";
import { storage } from "../config/photoController.js";

class UserController {
  async registration(req, res) {
    try {
      const { name, lastname, email, password } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res
          .status(401)
          .json({ message: `The user with email ${email} already exists` });
      }
      const hashPassword = await bcrypt.hash(password, 3);
      const userRole = await Role.findOne({ value: "user" });
      const activationLink = v4();
      const user = await User.create({
        name,
        lastname,
        email,
        password: hashPassword,
        role: [userRole.value],
        activationLink,
      });
      const token = generateAccessToken(
        user._id,
        user.role,
        user.isVerification
      );
      // await MailService.sendActivationMain(
      //   email,
      //   `${process.env.API_URL}/api/activate/${activationLink}`
      // );

      return res
        .status(200)
        .json({ message: "The user is successfully arranged", token, user });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Registration error", err });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        const validePassword = bcrypt.compareSync(password, user.password);
        if (validePassword) {
          const token = generateAccessToken(
            user._id,
            user.role,
            user.isVerification
          );
          return res.json({ token, user });
        } else {
          res.status(400).json({ message: "The password is not correct" });
        }
      } else {
        res.status(400).json({ message: "User was not found" });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Error in login" });
    }
  }
  async logout(req, res) {
    try {
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "" });
    }
  }
  async refresh(req, res) {
    try {
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "" });
    }
  }
  async activate(req, res) {
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
        return res.status(404).json({ message: "User not found." });
      }
      user.isVerification = true;
      await user.save();
      return res
        .status(200)
        .json({ message: "User verified successfully.", user });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error." });
    }
  }
  async getUsers(req, res) {
    try {
      const users = await User.find({});

      if (!users) {
        return res.status(400).json({ message: "Failed to get users" });
      }

      return res.status(200).json({ users });
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

      const existingUser = await User.findById(userId);
      let existingPhotoPath = null;
      if (existingUser && existingUser.userPhoto) {
        existingPhotoPath = existingUser.userPhoto;
      }
      const upload = multer({ storage });

      upload.single("avatar")(req, res, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error uploading photo" });
        }
        const nameOfProfilePicture = req.file.filename;
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { userPhoto: nameOfProfilePicture },
          { new: true }
        );
        if (!updatedUser) {
          return res.status(400).json({ message: "User not found" });
        }
        if (existingPhotoPath) {
          const uploadsDir = "uploads/avatar/";
          const fullPath = path.join(uploadsDir, existingPhotoPath);
          try {
            await fs.promises.unlink(fullPath);
            console.log(`Old photo ${existingPhotoPath} deleted successfully`);
          } catch (err) {
            console.error(`Error deleting old photo: ${err}`);
          }
        }
        res.json({
          user: updatedUser,
          message: "The photo is successfully installed",
        });
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error installing photo" });
    }
  }
}

export default new UserController();
