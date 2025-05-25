import { Request, Response } from "express";

export const handleJobPost = async (req: Request, res: Response) => {
  const { text } = req.body;
  // Placeholder logic
  res.json({ message: "Received text", extractedEmail: "[email@example.com]" });
};
