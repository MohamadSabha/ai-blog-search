import { pipeline, env } from "@xenova/transformers";

// Configure to use CPU and avoid CUDA issues
env.backends.onnx.wasm.numThreads = 1;
env.allowLocalModels = true;

class LocalEmbedder {
  static instance = null;

  static async getInstance() {
    if (this.instance === null) {
      console.log("🔄 Loading local embedding model...");
      this.instance = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2",
        { revision: "main" }
      );
      console.log("✅ Local embedding model loaded");
    }
    return this.instance;
  }

  static async generateEmbedding(text) {
    try {
      const extractor = await this.getInstance();
      const output = await extractor(text, {
        pooling: "mean",
        normalize: true,
      });

      // Convert tensor to array
      let embedding = Array.from(output.data);

      return embedding;
    } catch (error) {
      console.error("❌ Local embedding error:", error);
      throw error;
    }
  }
}

export default LocalEmbedder;
