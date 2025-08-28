// import axios from "axios";

// class HuggingFaceEmbedder {
//   static async generateEmbedding(text) {
//     try {
//       // Try different models in order of preference
//       const models = [
//         "sentence-transformers/all-MiniLM-L6-v2",
//         "sentence-transformers/paraphrase-MiniLM-L6-v2",
//         "sentence-transformers/all-mpnet-base-v2",
//       ];

//       let lastError;

//       for (const model of models) {
//         try {
//           console.log(`   Trying model: ${model}`);
//           const response = await axios.post(
//             `https://api-inference.huggingface.co/models/${model}`,
//             {
//               inputs: text,
//             },
//             {
//               headers: {
//                 Authorization: `Bearer ${process.env.HF_API_KEY}`,
//                 "Content-Type": "application/json",
//               },
//               timeout: 15000,
//             }
//           );

//           if (Array.isArray(response.data) && response.data.length > 0) {
//             return response.data[0];
//           }
//           return response.data;
//         } catch (error) {
//           lastError = error;
//           console.log(`   ❌ Model ${model} failed: ${error.message}`);
//           continue; // Try next model
//         }
//       }

//       throw lastError || new Error("All models failed");
//     } catch (error) {
//       console.error("❌ All Hugging Face models failed:", error.message);
//       throw error;
//     }
//   }
// }

// export default HuggingFaceEmbedder;
