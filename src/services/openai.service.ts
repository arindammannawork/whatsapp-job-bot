import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a job application email using job description and user profile
 */
export const generateJobApplicationEmail = async (
  jobText: string,
  userProfile: string
): Promise<string> => {
  const prompt = `
You are an assistant that writes professional job application emails.

Given the job description:
"""${jobText}"""

And the applicant profile:
"""${userProfile}"""

Write a short, formal email applying for the job. Mention resume is attached.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0].message.content || "Could not generate email.";
};
