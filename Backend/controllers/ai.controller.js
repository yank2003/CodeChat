import * as ai from "../services/ai.service.js";
export const getContent = async (req, res) => {
  try {
    const { prompt } = req.query;
    const content = await ai.generateContent(prompt);
    res.send(content);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
