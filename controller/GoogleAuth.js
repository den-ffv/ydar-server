import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { v4 } from "uuid";
import User from "../models/User.js";
import Role from "../models/Role.js";
import UserDto from "../config/userDto.js";
import TokenService from "../service/tokenService.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5555/api/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });
        const userRole = await Role.findOne({ value: "user" });
        if (existingUser) {
          const token = TokenService.generateTokens({ ...existingUser });
          return done(null, existingUser, token);
        }
        const activationLink = v4();
        const newUser = new User({
          googleId: profile.id,
          email: profile.email,
          name: profile.displayName,
          password: profile.id,
          role: [userRole.value],
          activationLink,
        });

        const tokens = TokenService.generateTokens({ ...newUser });
        // await TokenService.saveToken(newUser.id, tokens.refreshToken);
        const savedUser = await newUser.save();

        return done(null, savedUser, tokens);
      } catch (err) {
        console.error(err);
        return done(err);
      }
    }
  )
);

passport.serializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user, id);
  } catch (err) {}
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
