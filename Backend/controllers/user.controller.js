import { UserModel } from "../models/user.model.js";
import { generateToken } from "../utils/token.js";
import bcrypt from "bcrypt";
import redisClient from "../services/redis.service.js";

export const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    //validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }
    //check if user already exists
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    //create user
    const hashPassword = await bcrypt.hash(password, 10);
    //creating new user
    const user = await UserModel.create({
      email,
      password: hashPassword,
    });
    // jwt token
    const jwttokengenerated = generateToken(res, user._id);
    //successfull creation of user
    delete user._doc.password;
    res.status(201).json({
      user,
      token: jwttokengenerated,
    });
  } catch (error) {
    console.error("Error creating user", error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }
    //check if user exists and password is correct
    // usermodel has select as false so no user can acess the password
    const user = await UserModel.findOne({ email: email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!user.password) {
      return res.status(401).json({ message: "Password not found" });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    //generate token
    const generatedToken = generateToken(res, user._id);
    //successfull login
    delete user._doc.password;
    res.json({ user, token: generatedToken });
  } catch (error) {
    console.error("Log-In failed", error);
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) return res.status(401).json({ msg: "User not found" });
    return res.status(200).json({ msg: "Authentication successful" });
  } catch (error) {
    console.error("Error checking auth", error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    redisClient.set(token, "logout", "EX", 60 * 60 * 24);
    res.status(200).json({ msg: "Logged Out Successfully" });
  } catch (error) {
    console.error("Error logging out", error);
    return res.status(400).json({ msg: "Logout Error" });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await UserModel.find({ _id: { $ne: req.userId } });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error getting all users", error);
    res.status(500).json({ msg: "Server Error" });
  }
};
