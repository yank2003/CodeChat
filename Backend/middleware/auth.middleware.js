import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
    if (!token) {
      return res.status(401).send({ error: "Please authenticate" });
    }
    const isBlacklisted = await redisClient.get(token);
    if (isBlacklisted) {
      return res.status(401).send({ error: "Unauthorized User" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(404).send({ error: "Please authenticate" });
  }
};
