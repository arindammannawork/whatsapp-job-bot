import Tesseract from "tesseract.js";

/**
 * Runs OCR on the given image path
 * @param imagePath - Path to the image
 * @returns Extracted full text
 */
export const extractTextFromImage = async (
  imagePath: string
): Promise<string> => {
  const result = await Tesseract.recognize(imagePath, "eng", {
    logger: (m) => console.log(m.status, m.progress), // optional logging
  });

  return result.data.text;
};

/**
 * Extract email from plain text
 */
export const extractEmailFromText = (text: string): string[] => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex);
  return matches || [];
};
