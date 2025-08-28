import express from "express";
import { getDB } from "../lib/mongo.js";
import LocalEmbedder from "../lib/localEmbedder.js";

const router = express.Router();

// Helper: basic keyword check (optional)
const containsQueryWord = (content, query) => {
  const words = query.toLowerCase().split(/\s+/);
  const text = content.toLowerCase();
  return words.some((w) => text.includes(w));
};

// POST /ask
router.post("/", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question)
      return res.status(400).json({ error: "Question is required" });

    const db = getDB();
    const collection = db.collection(process.env.COLLECTION_NAME);

    console.log("🔍 Generating embedding for question...");
    const questionEmbedding = await LocalEmbedder.generateEmbedding(question);
    console.log("✅ Question embedding generated");

    // Vector search pipeline
    const pipeline = [
      {
        $vectorSearch: {
          index: "vector_index",
          queryVector: questionEmbedding,
          path: "embedding",
          limit: 3, // top 3 chunks for answer
          numCandidates: 200, // consider more candidates for accuracy
        },
      },
      {
        $project: {
          filename: 1,
          content: 1,
          similarity: { $meta: "vectorSearchScore" },
        },
      },
    ];

    let relevantChunks = await collection.aggregate(pipeline).toArray();
    console.log(`📊 Found ${relevantChunks.length} chunks from vector search`);

    // Apply confidence threshold
    const similarityThreshold = 0.65;
    relevantChunks = relevantChunks.filter(
      (c) => c.similarity >= similarityThreshold
    );

    // Optional keyword filter
    relevantChunks = relevantChunks.filter((c) =>
      containsQueryWord(c.content, question)
    );

    if (relevantChunks.length === 0) {
      return res.json({
        success: true,
        answer: "No relevant information found for this question.",
        sources: [],
      });
    }

    // Generate answer from top chunks
    const context = relevantChunks.map((c) => c.content).join("\n\n");
    const answer = `Based on the top sources: ${context}`;

    res.json({
      success: true,
      answer,
      sources: relevantChunks,
    });
  } catch (error) {
    console.error("❌ Ask error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

export default router;

// before indexing
// import express from "express";
// import { getDB } from "../lib/mongo.js";
// import LocalEmbedder from "../lib/localEmbedder.js"; // Changed from HuggingFaceEmbedder

// const router = express.Router();

// function cosineSimilarity(a, b) {
//   const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
//   const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
//   const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
//   return dotProduct / (normA * normB);
// }

// router.post("/", async (req, res) => {
//   try {
//     const { question } = req.body;
//     if (!question)
//       return res.status(400).json({ error: "Question is required" });

//     const db = getDB();
//     const collection = db.collection(process.env.COLLECTION_NAME);

//     // Generate question embedding using LOCAL embedder
//     console.log("🤔 Generating embedding for question...");
//     const questionEmbedding = await LocalEmbedder.generateEmbedding(question);
//     console.log("✅ Question embedding generated");

//     // Get all chunks
//     const chunks = await collection.find({}).toArray();
//     console.log(`📊 Found ${chunks.length} chunks to search through`);

//     // Find relevant chunks
//     const relevantChunks = chunks
//       .map((chunk) => ({
//         filename: chunk.filename,
//         content: chunk.content,
//         similarity: cosineSimilarity(questionEmbedding, chunk.embedding),
//       }))
//       .sort((a, b) => b.similarity - a.similarity)
//       .slice(0, 3);

//     console.log(`📚 Found ${relevantChunks.length} relevant chunks`);

//     // Simple answer generation
//     const context = relevantChunks.map((c) => c.content).join("\n\n");
//     const answer = `Based on my knowledge: ${context}`;

//     res.json({
//       success: true,
//       answer,
//       sources: relevantChunks,
//     });
//   } catch (error) {
//     console.error("Ask error:", error);
//     res
//       .status(500)
//       .json({ error: "Internal server error", details: error.message });
//   }
// });

// export default router;
