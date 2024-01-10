import { v4 } from "uuid";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Role from "../models/Role.js";
import MailService from "../service/mailService.js";
import TokenService from "../service/tokenService.js";
import UserDto from "../config/userDto.js";
class UserService {
  async registration(name, lastname, email, password) {
    const candidate = await User.findOne({ email });
    if (candidate) {
      throw new Error(`The user with email ${email} already exists`);
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
    // await MailService.sendActivationMain(
    //   email,
    //   `${process.env.API_URL}/api/activate/${activationLink}`
    // );

    const userDto = new UserDto(user);

    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }
}

export default new UserService();
