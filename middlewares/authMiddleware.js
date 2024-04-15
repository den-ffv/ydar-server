import jwt from "jsonwebtoken";


export default (req, res, next) => {
  if (req.method === "OPTION") {
    next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "The user is not authorized 😥" });
    }
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decodedData;
    next()
  } catch (err) {
    return res.status(403).json({ message: "The user is not authorized 😥" });
  }
};
