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
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyBO6fNE50z-eSnemD9y2Ccag5-yG3B6hhg",
});

export async function tryGoogleAi(
  jobDesc: string,
  userProfile: string,
  extraPromt?: string | undefined
) {
  const prompt = `
  You are an assistant that writes professional job application emails.

Given the job description:
"""${jobDesc}"""

And the applicant profile:
"""${userProfile}"""

Write a short, formal email applying for the job. Mention resume is attached.

Use Chessy subject line and  ensure your email is not too formal.
dont mention the advertised platform. allways try to mention person name instead of dear hiring team or hr if not abhilable in job description then you can use hr or hiring team etc
allways mentiones some of my project live links 

https://lastasa.vercel.app
https://visualizer-kohl.vercel.app
https://boibondhupub.com
https://www.autogorilla.com
https://credo-7y6h.vercel.app


${extraPromt}  

`;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-05-20",
    // model: "gemini-2.0-flash",
    contents: prompt,
  });
  console.log(response.text);
  // console.log(JSON.stringify(response));
  // console.log(JSON.parse(response));

  // return JSON.stringify(response) || "No response";
  return response;
}
