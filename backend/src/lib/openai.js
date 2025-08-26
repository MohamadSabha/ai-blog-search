import OpenAI from "openai";
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embed(text) {
  // text-embedding-3-small -> 1536 dimensions, cheap & good
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding; // number[]
}
