import React, { useState } from "react";
import { Search, MessageCircle } from "lucide-react";

const SearchBar = ({ onSearch, onAsk, isLoading }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleAsk = () => {
    if (query.trim()) {
      onAsk(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something about the blog content..."
          className="w-full px-6 py-4 text-lg border-0 rounded-full shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          disabled={isLoading}
        />
        <div className="absolute right-2 top-2 flex space-x-2">
          <button
            type="button"
            onClick={handleAsk}
            disabled={isLoading || !query.trim()}
            className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Ask Question"
          >
            <MessageCircle size={20} />
          </button>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Search"
          >
            <Search size={20} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
