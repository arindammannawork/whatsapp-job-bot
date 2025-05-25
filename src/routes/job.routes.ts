import express from "express";
import { handleJobPost } from "../controllers/job.controller";

const router = express.Router();

router.post("/process", handleJobPost);

export default router;
