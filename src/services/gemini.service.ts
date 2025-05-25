// import { PredictionServiceClient } from "@google-cloud/aiplatform";

// const client = new PredictionServiceClient();
// AIzaSyBO6fNE50z-eSnemD9y2Ccag5-yG3B6hhg
// export async function generateEmail(jobDesc: string, userProfile: string) {
//   const project = "938571162291";
//   const location = "us-central1"; // region
//   const endpoint = `projects/${project}/locations/${location}/publishers/google/models/chat-bison-001`;

//   const prompt = `
//   You are an assistant that writes professional job application emails.

// Given the job description:
// """${jobDesc}"""

// And the applicant profile:
// """${userProfile}"""

// Write a short, formal email applying for the job. Mention resume is attached.
//   `;

//   const request = {
//     endpoint,
//     instances: [
//       {
//         content: prompt,
//       },
//     ],
//     parameters: {
//       temperature: 0.7,
//       maxOutputTokens: 256,
//     },
//   };

//   const [response] = await client.predict(request);
//   const result = response.predictions?.[0]?.content || "No response";
//   return result;
// }
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: "AIzaSyBO6fNE50z-eSnemD9y2Ccag5-yG3B6hhg",
// });
const { GoogleGenAI } = require("@google/genai"); // Older package name
const ai = new GoogleGenAI({
  apiKey: "AIzaSyBO6fNE50z-eSnemD9y2Ccag5-yG3B6hhg",
});
export async function tryGoogleAi(
  jobDesc: string,
  userProfile: string,
  extraPromt?: string
) {
  // const genaiModule = await import("@google/genai");
  // const { GoogleGenAI } = genaiModule;

  // const ai = new GoogleGenAI({
  //   apiKey: process.env.GOOGLE_API_KEY!,
  // }); // load from .env instead of hardcoding

  const prompt = `
You are an assistant that writes professional job application emails.

Given the job description:
"""${jobDesc}"""

And the applicant profile:
"""${userProfile}"""

Write a short, formal email applying for the job. Mention resume is attached.

Use chessy subject line and ensure your email is not too formal.
Don't mention the advertised platform. Always try to mention the person's name instead of "dear hiring team" or "HR"; if not available in the job description then you can use HR or hiring team etc.
Always mention some of my project live links:

- https://lastasa.vercel.app
- https://visualizer-kohl.vercel.app
- https://boibondhupub.com
- https://www.autogorilla.com
- https://credo-7y6h.vercel.app

${extraPromt || ""}
  `;

  const model = ai.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const response = await result.response;
  const text = response.text(); // this works only after calling `.response`

  return text;
}
