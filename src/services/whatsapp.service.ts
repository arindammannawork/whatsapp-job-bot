import { Request, Response } from "express";
import twilioClient from "../config/twilio";
import axios from "axios";
import fs from "fs";
import path from "path";
import { extractTextFromImage } from "../utils/ocr.util";
import { myProfile } from "../asset/staticdata";
import { tryGoogleAi } from "./gemini.service";
import {
  extractEmailFromText,
  extractSubject,
  removeSubjectLine,
} from "../utils/basic.util";
import { sendEmail } from "./email.service";

export const sendWhatsAppMessage = async (to: string, body: string) => {
  try {
    const message = await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      // contentSid: "HXb5b62575e6e4ff6129ad7c8efe1f983e",
      // contentVariables: '{"1":"12/1","2":"3pm"}',
      to,
      body,
    });

    return message.sid;
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
    throw error;
  }
};

export const handleIncomingMessage = async (req: Request, res: Response) => {
  const from = req.body.From;
  const numMedia = parseInt(req.body.NumMedia || "0", 10);

  console.log("📨 Message from:", from);
  console.log("📷 Media count:", numMedia);
  const extraPromt = req.body.Body;
  console.log("req.body", req.body.Body);

  if (numMedia > 0) {
    const mediaUrl = req.body.MediaUrl0;
    const mediaType = req.body.MediaContentType0;

    const fileExtension = mediaType.split("/")[1]; // jpeg, png, etc.
    const filename = `image_${Date.now()}.${fileExtension}`;
    const savePath = path.join("/tmp", filename); // ✅ Use /tmp for Vercel
    console.log(1);

    try {
      console.log(2);
      const response = await axios.get(mediaUrl, {
        responseType: "stream",
        auth: {
          username: process.env.TWILIO_ACCOUNT_SID!,
          password: process.env.TWILIO_AUTH_TOKEN!,
        },
      });
      console.log(3);

      const writer = fs.createWriteStream(savePath);
      console.log(4);

      await new Promise<void>((resolve, reject) => {
        response.data.pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      console.log(5, "Image saved");

      const extractedText = await extractTextFromImage(savePath);
      console.log(6, "Extracted Text");

      const googleAiOutput = await tryGoogleAi(
        extractedText,
        myProfile,
        extraPromt
      );
      console.log(7, "AI Output");

      const subject = extractSubject(googleAiOutput.text);
      const mailtext = removeSubjectLine(googleAiOutput.text);

      const emails = extractEmailFromText(`${extractedText}. ${extraPromt}`);
      console.log("📧 Emails Found:", emails);

      const result = await sendEmail({
        to: emails,
        subject: subject as string,
        text: mailtext as string,
        attachments: [
          {
            filename: "resume.pdf",
            path: "./src/asset/resume.pdf", // ✅ Make sure this file exists at build time
          },
        ],
      });

      console.log(8, result);

      const sid = await sendWhatsAppMessage(
        process.env.MY_WHATSAPP_NUMBER!,
        `Email sent: ${result.response}`
      );
      console.log("📤 WhatsApp SID:", sid);
    } catch (error: any) {
      console.error("❌ Failed:", error.message || error);
      const sid = await sendWhatsAppMessage(
        process.env.MY_WHATSAPP_NUMBER!,
        `Email failed: ${error.message || error}`
      );
      console.log("📤 WhatsApp SID (Error):", sid);
    }
  }

  res.send("<Response></Response>");
};

// export const handleIncomingMessage = async (req: Request, res: Response) => {
//   const from = req.body.From;
//   const numMedia = parseInt(req.body.NumMedia || "0", 10);

//   console.log("📨 Message from:", from);
//   console.log("📷 Media count:", numMedia);
//   const extraPromt = req.body.Body;
//   console.log("req.body", req.body.Body);
//   if (numMedia > 0) {
//     const mediaUrl = req.body.MediaUrl0;
//     const mediaType = req.body.MediaContentType0;

//     // Download image using Twilio auth
//     const fileExtension = mediaType.split("/")[1]; // jpeg, png, etc.
//     const filename = `image_${Date.now()}.${fileExtension}`;
//     // const savePath = path.join(__dirname, "../../uploads", filename);
//     const savePath = path.join("/tmp", filename); // ✅ Use /tmp for Vercel
//     console.log(1);

//     try {
//       console.log(2);
//       const response = await axios.get(mediaUrl, {
//         responseType: "stream",
//         auth: {
//           username: process.env.TWILIO_ACCOUNT_SID!,
//           password: process.env.TWILIO_AUTH_TOKEN!,
//         },
//       });
//       console.log(3);

//       const writer = fs.createWriteStream(savePath);
//       console.log(4);
//       response.data.pipe(writer);
//       console.log(5);
//       writer.on("finish", async () => {
//         // console.log("✅ Image saved to:", savePath);
//         console.log(6);
//         const extractedText = await extractTextFromImage(savePath);
//         // console.log("📜 Extracted Text:\n", extractedText);
//         console.log(7);
//         const googleAiOutput = await tryGoogleAi(
//           extractedText,
//           myProfile,
//           extraPromt
//         );
//         console.log(6);
//         const subject = extractSubject(googleAiOutput.text);
//         const mailtext = removeSubjectLine(googleAiOutput.text);

//         const emails = extractEmailFromText(`${extractedText}. ${extraPromt}`);
//         console.log("📧 Emails Found:", emails);

//         const result = await sendEmail({
//           to: emails,
//           subject: subject as string,
//           text: mailtext as string,
//           attachments: [
//             {
//               filename: "resume.pdf",
//               path: "./src/asset/resume.pdf", // make sure the file exists
//             },
//           ],
//         });
//         console.log(7);
//         console.log(result);
//         const sid = await sendWhatsAppMessage(
//           process.env.MY_WHATSAPP_NUMBER!,
//           `Email sent: ${result.response}`
//         );
//         console.log(sid);
//         console.log(8);
//         // const applicationEmail = await generateEmail(extractedText, myProfile);
//         // console.log("📩 Generated Email:\n", applicationEmail);
//       });

//       writer.on("error", (err) => {
//         console.error("❌ Error writing file:", err);
//         throw err;
//       });
//     } catch (error) {
//       console.error("❌ Failed to download image:", error);
//       const sid = await sendWhatsAppMessage(
//         process.env.MY_WHATSAPP_NUMBER!,
//         `Email sent: ${error}`
//       );
//       console.log(sid);
//     }
//   }

//   res.send("<Response></Response>");
// };
