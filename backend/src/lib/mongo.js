import { MongoClient } from "mongodb";

let client;
let db;

const connectDB = async () => {
  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log("✅ MongoDB connected successfully");

    // Create vector search index
    // await createVectorIndex();

    return db;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const createVectorIndex = async () => {
  try {
    const collection = db.collection(process.env.COLLECTION_NAME);

    const indexes = await collection.indexes();
    const vectorIndexExists = indexes.some(
      (index) => index.name === "vector_index"
    );

    if (!vectorIndexExists) {
      await collection.createIndex(
        { embedding: "vector" },
        {
          name: "vector_index",
          vector: {
            // ⚡ Correct key here
            dimensions: 384,
            similarity: "cosine",
          },
        }
      );
      console.log("✅ Vector search index created");
    } else {
      console.log("✅ Vector search index already exists");
    }
  } catch (error) {
    console.error("❌ Error creating vector index:", error.message);
  }
};
const getDB = () => {
  if (!db) throw new Error("Database not connected");
  return db;
};

const closeDB = async () => {
  if (client) await client.close();
};

export { connectDB, getDB, closeDB };
// beforwe indexing

// import { MongoClient } from "mongodb";

// let client;
// let db;

// const connectDB = async () => {
//   try {
//     client = new MongoClient(process.env.MONGODB_URI);
//     await client.connect();
//     db = client.db(process.env.DB_NAME);
//     console.log("✅ MongoDB connected successfully");

//     // Create collection if it doesn't exist
//     const collections = await db.listCollections().toArray();
//     const collectionExists = collections.some(
//       (col) => col.name === process.env.COLLECTION_NAME
//     );

//     if (!collectionExists) {
//       await db.createCollection(process.env.COLLECTION_NAME);
//       console.log("✅ Collection created");
//     }

//     return db;
//   } catch (error) {
//     console.error("❌ MongoDB connection error:", error);
//     process.exit(1);
//   }
// };

// const getDB = () => {
//   if (!db) throw new Error("Database not connected");
//   return db;
// };

// const closeDB = async () => {
//   if (client) await client.close();
// };

// export { connectDB, getDB, closeDB };
