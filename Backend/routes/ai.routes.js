import express from "express";
import { getContent } from "../controllers/ai.controller.js";

const router = express.Router();

router.get("/get-content", getContent);

export default router;
