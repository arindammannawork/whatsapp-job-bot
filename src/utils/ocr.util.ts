import Tesseract from "tesseract.js";
import path from "path";

export const extractTextFromImage = async (
  imagePath: string
): Promise<string> => {
  const result = await Tesseract.recognize(imagePath, "eng", {
    logger: (m: any) => console.log(m.status, m.progress),
    corePath:
      "https://cdn.jsdelivr.net/npm/tesseract.js-core@v4.0.2/tesseract-core-simd.js",
    workerPath:
      "https://cdn.jsdelivr.net/npm/tesseract.js@4.0.2/dist/worker.min.js",
  } as any); // bypass TS types
  return result.data.text;
};
