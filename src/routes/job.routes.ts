import express, { Request, Response } from "express";
import { handleJobPost, sendTestMessage } from "../controllers/job.controller";
import { handleIncomingMessage } from "../services/whatsapp.service";
import { tryGoogleAi } from "../services/gemini.service";
import { dummyJobdesc, myProfile } from "../asset/staticdata";
import { sendEmail } from "../services/email.service";

const router = express.Router();

router.post("/process", handleJobPost);
router.get("/test-whatsapp", sendTestMessage);
router.post("/incoming", handleIncomingMessage);
// router.get("/try", async (req, res) => {
//   try {
//     const result = await tryGoogleAi(dummyJobdesc, myProfile);
//     // res.json(result);
//     // console.log("result:", result);
//     res.status(200).json(JSON.parse(result));
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "An error occurred" });
//   }
// });

// router.get("/try", async (req: Request, res: Response) => {
//   const result = await sendEmail({
//     to: "arindammannawork@gmail.com",
//     subject: "Application for Frontend Developer",
//     text: "Dear HR, Please find attached my resume for the job post.",
//     attachments: [
//       {
//         filename: "resume.pdf",
//         path: "./src/asset/resume.pdf", // make sure the file exists
//       },
//     ],
//   });

//   console.log(result);
//   res.status(200).json({ message: "Email sent successfully" });
// });

export default router;
