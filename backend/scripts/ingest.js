import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB, getDB } from "../src/lib/mongo.js";
import { chunkText } from "../src/lib/chunk.js";
// import HuggingFaceEmbedder from "../src/lib/huggingface.js";

// Change this import:
import LocalEmbedder from "../src/lib/localEmbedder.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function ingestBlogFiles() {
  try {
    await connectDB();
    const db = getDB();
    const collection = db.collection(process.env.COLLECTION_NAME);

    const blogDir = path.join(__dirname, "../../data/blog");
    const files = await fs.readdir(blogDir);

    for (const file of files) {
      if (file.endsWith(".md")) {
        console.log(`📄 Processing ${file}...`);

        const filePath = path.join(blogDir, file);
        const content = await fs.readFile(filePath, "utf-8");
        const chunks = chunkText(content);

        console.log(`   Found ${chunks.length} chunks`);

        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          console.log(
            `   Generating embedding for chunk ${i + 1}/${chunks.length}...`
          );

          try {
            const embedding = await LocalEmbedder.generateEmbedding(chunk);

            await collection.insertOne({
              filename: file,
              chunkIndex: i,
              content: chunk,
              embedding: embedding,
              createdAt: new Date(),
            });

            console.log(`   ✅ Chunk ${i + 1} saved`);

            // Add delay to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 500));
          } catch (error) {
            console.error(
              `   ❌ Error processing chunk ${i + 1}:`,
              error.message
            );
          }
        }
      }
    }

    console.log("🎉 Ingestion completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Ingestion error:", error);
    process.exit(1);
  }
}

ingestBlogFiles();
