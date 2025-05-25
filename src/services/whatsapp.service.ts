import { Request, Response } from "express";
import twilioClient from "../config/twilio";
import axios from "axios";
import fs from "fs";
import path from "path";
import { extractEmailFromText, extractTextFromImage } from "../utils/ocr.util";
import { myProfile } from "../asset/staticdata";
import { tryGoogleAi } from "./gemini.service";
import { extractSubject, removeSubjectLine } from "../utils/basic.util";
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

    // Download image using Twilio auth
    const fileExtension = mediaType.split("/")[1]; // jpeg, png, etc.
    const filename = `image_${Date.now()}.${fileExtension}`;
    const savePath = path.join(__dirname, "../../uploads", filename);

    try {
      const response = await axios.get(mediaUrl, {
        responseType: "stream",
        auth: {
          username: process.env.TWILIO_ACCOUNT_SID!,
          password: process.env.TWILIO_AUTH_TOKEN!,
        },
      });

      const writer = fs.createWriteStream(savePath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        // console.log("✅ Image saved to:", savePath);
        const extractedText = await extractTextFromImage(savePath);
        // console.log("📜 Extracted Text:\n", extractedText);
        const googleAiOutput = await tryGoogleAi(
          extractedText,
          myProfile,
          extraPromt
        );
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
              path: "./src/asset/resume.pdf", // make sure the file exists
            },
          ],
        });
        console.log(result);

        // const applicationEmail = await generateEmail(extractedText, myProfile);
        // console.log("📩 Generated Email:\n", applicationEmail);
      });

      writer.on("error", (err) => {
        console.error("❌ Error writing file:", err);
      });
    } catch (error) {
      console.error("❌ Failed to download image:", error);
    }
  }

  res.send("<Response></Response>");
};
