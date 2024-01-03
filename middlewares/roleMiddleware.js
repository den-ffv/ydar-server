import jwt from "jsonwebtoken";
import { secret } from "../config.js";

export default function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTION") {
      next();
    }
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res
          .status(403)
          .json({ message: "The user is not authorized 😥" });
      }
      const { roles: userRoles } = jwt.verify(token, secret);
      let hasRole = false;
      userRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        return res.status(403).json({ message: "You do not have access 🥲" });
      }
      next()
    } catch (err) {
      return res.status(403).json({ message: "The user is not authorized 😥" });
    }
  };
}
