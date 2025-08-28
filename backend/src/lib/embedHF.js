// // backend/src/lib/embedXeno.js
// import fetch from "node-fetch";
// import dotenv from "dotenv";
// dotenv.config();

// const HF_API_TOKEN = process.env.HF_API_KEY;
// const HF_EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"; // can change

// export async function getEmbedding(text) {
//   const response = await fetch(
//     `https://api-inference.huggingface.co/embeddings/${HF_EMBED_MODEL}`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${HF_API_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ inputs: text }),
//     }
//   );

//   if (!response.ok) {
//     throw new Error(
//       `Hugging Face API error: ${response.status} ${response.statusText}`
//     );
//   }

//   const data = await response.json();

//   // API returns a 1D array
//   return data.embedding;
// }
