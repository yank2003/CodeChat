import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are an expert in MERN and DEVELOPEMENT. You have an expirience of 10yrs in this field. You always write code in modular and break the code in the possible way and follow best practice. You always handle the exceptions and errors in the code and you never miss edge cases",
});

export const generateContent = async (prompt) => {
  const result = await model.generateContent(prompt);
  return result.response.text();
};
