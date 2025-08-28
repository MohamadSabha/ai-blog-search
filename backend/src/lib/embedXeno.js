// const { pipeline, env } = require("@xenova/transformers");

// // Use CPU instead of requiring CUDA
// env.backends.onnx.wasm.numThreads = 1;

// class EmbeddingGenerator {
//   static instance = null;

//   static async getInstance() {
//     if (this.instance === null) {
//       this.instance = await pipeline(
//         "feature-extraction",
//         process.env.EMBEDDING_MODEL || "Xenova/all-MiniLM-L6-v2"
//       );
//     }
//     return this.instance;
//   }

//   static async generateEmbedding(text) {
//     try {
//       const extractor = await this.getInstance();
//       const output = await extractor(text, {
//         pooling: "mean",
//         normalize: true,
//       });

//       // Convert tensor to array and ensure it's 1D
//       let embedding = Array.from(output.data);

//       // Handle potential 2D output by taking the first (and only) element
//       if (Array.isArray(embedding[0])) {
//         embedding = embedding[0];
//       }

//       return embedding;
//     } catch (error) {
//       console.error("Error generating embedding:", error);
//       throw error;
//     }
//   }
// }

// module.exports = EmbeddingGenerator;
