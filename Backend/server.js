import express from "express";
import http from "http";
import { connectDB } from "../Backend/db/connectDB.js";
import authRoutes from "../Backend/routes/auth.routes.js";
import projectRoutes from "../Backend/routes/project.routes.js";
import aiRoutes from "../Backend/routes/ai.routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { ProjectModel } from "./models/project.model.js";
import { generateContent } from "./services/ai.service.js";
dotenv.config();
const app = express();

const port = process.env.PORT || 5000;

connectDB();

//Routes
app.use(
  cors({
    origin: "http://localhost:5173", //  frontend URL
    credentials: true, // Allow cookies and other credentials
  })
);
app.use(express.json()); //checking the  JSON payload
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/ai", aiRoutes);

//http server and socket io connection
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

//middleware to protect io connection

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];
    if (!token) {
      console.error("No token provided");
      return next(new Error("Authentication error: No token provided"));
    }

    const projectId = socket.handshake.query.projectId;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      console.error("Invalid Project ID:", projectId);
      return next(new Error("Invalid Project Id"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = decoded;
    socket.project = await ProjectModel.findById(projectId);
    if (!socket.project) {
      console.error("Project not found for ID:", projectId);
      return next(new Error("Project not found"));
    }

    next();
  } catch (error) {
    console.error("Error during handshake:", error.message);
    next(error);
  }
});

io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();
  console.log("a user connected");
  socket.join(socket.roomId);
  socket.on("project-message", async (data) => {
    const message = data.content;
    const genieisPresent = message.includes("@genie");
    if (genieisPresent) {
      const prompt = message.replace("@genie", "");
      const result = await generateContent(prompt);
      io.to(socket.roomId).emit("project-message", {
        content: result,
        senderEmail: "genieAI",
      });

      return;
    }
    socket.broadcast.to(socket.roomId).emit("project-message", data);
  });
  // socket.on("event", (data) => {});
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    socket.leave(socket.roomId);
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});
httpServer.listen(port,'0.0.0.0:8080', () => {
  console.log("Server listening on port " + port);
});
