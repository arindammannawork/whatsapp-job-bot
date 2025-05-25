import { Request, Response } from "express";
import { sendWhatsAppMessage } from "../services/whatsapp.service";

export const handleJobPost = async (req: Request, res: Response) => {
  const { text } = req.body;
  // Placeholder logic
  res.json({ message: "Received text", extractedEmail: "[email@example.com]" });
};

export const sendTestMessage = async (req: Request, res: Response) => {
  console.log("TWILIO SID:", process.env.TWILIO_ACCOUNT_SID);
  console.log("TWILIO TOKEN:", process.env.TWILIO_AUTH_TOKEN);

  try {
    const to = process.env.MY_WHATSAPP_NUMBER!;
    const sid = await sendWhatsAppMessage(
      to,
      "Hello from your WhatsApp Bot 👋"
    );
    res.json({ status: "Message sent", sid });
  } catch (err) {
    res.status(500).json({ error: "Message failed", details: err });
  }
};
