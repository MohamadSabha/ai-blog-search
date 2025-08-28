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

// POST /search
router.post("/", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const db = getDB();
    const collection = db.collection(process.env.COLLECTION_NAME);

    console.log("🔍 Generating embedding for query...");
    const queryEmbedding = await LocalEmbedder.generateEmbedding(query);
    console.log("✅ Query embedding generated");

    // Vector search pipeline
    const pipeline = [
      {
        $vectorSearch: {
          index: "vector_index",
          queryVector: queryEmbedding,
          path: "embedding",
          limit: 5, // top 5 results returned
          numCandidates: 200, // consider more candidates for better ranking
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

    let results = await collection.aggregate(pipeline).toArray();
    console.log(`📊 Found ${results.length} results from vector search`);

    // Filter by minimum similarity (dynamic threshold)
    const similarityThreshold = 0.65; // adjust based on your testing
    results = results.filter((r) => r.similarity >= similarityThreshold);

    // Optional: filter results that contain at least one query word
    results = results.filter((r) => containsQueryWord(r.content, query));

    if (results.length === 0) {
      return res.json({
        success: true,
        message: "No relevant results found. Try another query.",
        results: [],
      });
    }

    res.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("❌ Search error:", error);
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
// import LocalEmbedder from "../lib/localEmbedder.js";

// const router = express.Router();

// function cosineSimilarity(a, b) {
//   const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
//   const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
//   const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
//   return dotProduct / (normA * normB);
// }

// router.post("/", async (req, res) => {
//   try {
//     console.log("🔍 Search route handler called");

//     const { query } = req.body;
//     if (!query) return res.status(400).json({ error: "Query is required" });

//     const db = getDB();
//     const collection = db.collection(process.env.COLLECTION_NAME);

//     console.log("🔍 Generating embedding for query...");
//     const queryEmbedding = await LocalEmbedder.generateEmbedding(query);
//     console.log("✅ Query embedding generated");

//     const chunks = await collection.find({}).toArray();
//     console.log(`📊 Found ${chunks.length} chunks to search through`);

//     const results = chunks.map((chunk) => ({
//       filename: chunk.filename,
//       content: chunk.content,
//       similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
//     }));

//     results.sort((a, b) => b.similarity - a.similarity);
//     // ---  Confidence Threshold Logic ---
//     const confidenceThreshold = 0.25; // Adjust this value based on testing
//     const filteredResults = results.filter(
//       (result) => result.similarity >= confidenceThreshold
//     );

//     console.log(
//       `🎯 Search completed. Found ${results.length} results, ${filteredResults.length} after confidence filtering`
//     );

//     // If no results meet the threshold, return a message
//     if (filteredResults.length === 0) {
//       return res.json({
//         success: true,
//         message:
//           "No relevant results found. Try asking about web development, data engineering, or machine learning.",
//         results: [],
//       });
//     }

//     res.json({
//       success: true,
//       results: filteredResults.slice(0, 5), // using filteredResults
//     });
//   } catch (error) {
//     console.error("Search error:", error);
//     res.status(500).json({
//       error: "Internal server error",
//       details: error.message,
//     });
//   }
// });

// export default router;
