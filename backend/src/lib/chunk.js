function chunkText(text, maxSentences = 3) {
  // Split by common sentence endings
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);
  const chunks = [];

  for (let i = 0; i < sentences.length; i += maxSentences) {
    const chunk = sentences.slice(i, i + maxSentences).join(" ");
    if (chunk.trim().length > 10) {
      // Minimum length check
      chunks.push(chunk);
    }
  }

  return chunks;
}

export { chunkText };
