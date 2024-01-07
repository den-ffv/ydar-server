import { v4 } from "uuid";
import bcrypt from "bcryptjs";

import User from "../models/User.js"
import Role from "../models/Role.js";
import MailService from "../service/mailService.js";
import TokenService from "../service/tokenService.js";


class UserService {
  async registration(name, lastname, email, password, res) {
    const candidate = await User.findOne({ email });
    if (candidate) {
      return res
        .status(400)
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
    await MailService.sendActivationMain(email, activationLink);


    const tokens = TokenService.generateTokens({ user });
    await TokenService.saveToken(user._id, tokens.refreshToken);
    return { ...tokens, user };
  }
}

export default new UserService()
