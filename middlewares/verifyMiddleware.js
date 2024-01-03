export default (req, res, next) => {
  try {
    const user = req.user;
    if (!user || !user.isVerification) {
      console.log(req.user);
      return res.status(403).json({ message: "The user is not verified 😱" });
    }

    next();
  } catch (error) {
    res.status(403).json({ message:  "The user is not authorized 😥" });
  }
};
