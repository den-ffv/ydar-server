import jwt from "jsonwebtoken";


const generateAccessToken = (id, roles, isVerification) => {
    const payload = {
      id,
      roles,
      isVerification,
    };
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "24h" });
  };

export default generateAccessToken