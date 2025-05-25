// src/services/ocr.service.ts
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

export const extractTextFromImage = async (
  imageFilePath: string
): Promise<string> => {
  const form = new FormData();
  form.append("apikey", process.env.OCR_SPACE_API_KEY || "helloworld"); // Use "helloworld" for testing
  form.append("language", "eng");
  form.append("isOverlayRequired", "false");
  form.append("file", fs.createReadStream(path.resolve(imageFilePath)));

  try {
    const response = await axios.post(
      "https://api.ocr.space/parse/image",
      form,
      { headers: form.getHeaders() }
    );

    const result = response.data;
    if (result.IsErroredOnProcessing) {
      throw new Error(result.ErrorMessage[0]);
    }

    return result.ParsedResults?.[0]?.ParsedText || "";
  } catch (error: any) {
    console.error("OCR Error:", error.message);
    throw new Error("Failed to extract text from image.");
  }
};
