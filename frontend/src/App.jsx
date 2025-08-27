import React, { useState } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import ResultsList from "./components/ResultsList";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  // Local states
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to perform search
  const search = async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/search", { query });
      setResults(response.data.results);
    } catch (err) {
      setError(err.response?.data?.error || "Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to ask a question
  const ask = async (question) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/ask", { question });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to get answer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🔍 AI Blog Search
          </h1>
          <p className="text-white/90">
            Search and ask questions about your blog content
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={search} onAsk={ask} isLoading={isLoading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
            <p>❌ {error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <LoadingSpinner
            message={
              results ? "Refining results..." : "Analyzing your query..."
            }
          />
        )}

        {/* Results */}
        {!isLoading && results && (
          <ResultsList
            results={results}
            type={results.answer ? "ask" : "search"}
          />
        )}

        {/* Empty State */}
        {!isLoading && !results && !error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl text-white mb-2">
              Welcome to AI Blog Search
            </h3>
            <p className="text-white/80">
              Enter a search query or ask a question to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
