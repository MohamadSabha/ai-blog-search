import express from "express";
import { getDB } from "../lib/mongo.js";
import LocalEmbedder from "../lib/localEmbedder.js";

const router = express.Router();

function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (normA * normB);
}

router.post("/", async (req, res) => {
  try {
    console.log("🔍 Search route handler called");

    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const db = getDB();
    const collection = db.collection(process.env.COLLECTION_NAME);

    console.log("🔍 Generating embedding for query...");
    const queryEmbedding = await LocalEmbedder.generateEmbedding(query);
    console.log("✅ Query embedding generated");

    const chunks = await collection.find({}).toArray();
    console.log(`📊 Found ${chunks.length} chunks to search through`);

    const results = chunks.map((chunk) => ({
      filename: chunk.filename,
      content: chunk.content,
      similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
    }));

    results.sort((a, b) => b.similarity - a.similarity);

    console.log(`🎯 Search completed. Found ${results.length} results`);

    res.json({
      success: true,
      results: results.slice(0, 5),
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

export default router;
