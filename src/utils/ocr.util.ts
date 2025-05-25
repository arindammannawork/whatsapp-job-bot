import Tesseract from "tesseract.js";
import path from "path";

export const extractTextFromImage = async (
  imagePath: string
): Promise<string> => {
  const result = await Tesseract.recognize(imagePath, "eng", {
    logger: (m: any) => console.log(m.status, m.progress),
    corePath: path.join(
      __dirname,
      "../../public/tesseract/tesseract-core-simd.js"
    ),
    workerPath: path.join(
      __dirname,
      "../../public/tesseract/tesseract.worker.min.js"
    ),
  } as any); // bypass TS types
  return result.data.text;
};
