import React from "react";
import { FileText, Star } from "lucide-react";

const ResultsList = ({ results, type = "search" }) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl text-gray-600">No results found</h3>
        <p className="text-gray-500">
          Try a different search term or ask a question
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {type === "search" ? "Search Results" : "Answer"}
        </h2>
        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
          {results.length} {type === "search" ? "results" : "sources"}
        </span>
      </div>

      {type === "ask" && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">💡 Answer</h3>
          <p className="text-gray-700">{results.answer}</p>
        </div>
      )}

      <div className="grid gap-4">
        {(type === "ask" ? results.sources : results).map((result, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <FileText size={16} className="text-gray-400" />
                <span className="font-semibold text-gray-700">
                  {result.filename}
                </span>
                <span className="text-sm text-gray-500">
                  • Result {index + 1}
                </span>
              </div>
              {result.similarity && (
                <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                  <Star size={12} />
                  <span>{(result.similarity * 100).toFixed(1)}%</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 leading-relaxed">{result.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsList;
