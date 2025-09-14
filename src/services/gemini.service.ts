import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

const chat = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-preview-05-20", // closest production-ready model
  // model: "gemini-2.0-flash", // closest production-ready model
  apiKey: process.env.GEMINI_API_KEY,
  baseUrl: "https://us-south1-generativelanguage.googleapis.com",
});

export async function tryGoogleAi(
  jobDesc: string,
  userProfile: string,
  extraPromt?: string
) {
  const prompt = `
You are an assistant that writes professional job application emails.

Given the job description:
"""${jobDesc}"""

And the applicant profile:
"""${userProfile}"""

Write a short, formal email applying for the job. Mention resume is attached.

Use Chessy subject line and ensure your email is not too formal.
Don't mention the advertised platform. Always try to mention a person's name instead of "Dear Hiring Team" or "HR". If a name is not available in the job description, then use "HR" or "Hiring Team".

Always mention some of my project live links:

- https://visualizer-kohl.vercel.app
- https://boibondhupub.com
- https://www.autogorilla.com
- https://credo-7y6h.vercel.app

${extraPromt || ""}
  `;

  const response = await chat.call([new HumanMessage(prompt)]);

  console.log(response.content);
  return response.content;
}
