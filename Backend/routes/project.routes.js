import express from "express";
import {
  project,
  getAllProject,
  addToProject,
  getProjectById,
} from "../controllers/project.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/create", authUser, project);
router.get("/all", authUser, getAllProject);
router.get("/get-project/:projectId", authUser, getProjectById);
router.put("/add-user", authUser, addToProject);

export default router;
