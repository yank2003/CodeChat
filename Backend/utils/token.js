import jwt from "jsonwebtoken";

export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  res.cookie("token", token, {
    expires: new Date(Date.now() + 60 * 60 * 1000 * 12),
    httpOnly: true,
  });

  return token;
};
