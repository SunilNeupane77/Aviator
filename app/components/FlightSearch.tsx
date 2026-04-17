"use client";

import { useState, useEffect } from "react";
import { PlaneTakeoff, Search, Clock, X } from "lucide-react";

interface FlightSearchProps {
  onSearch: (flightNumber: string) => void;
  isLoading: boolean;
}

export default function FlightSearch({ onSearch, isLoading }: FlightSearchProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("recentFlights");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    // Update recent searches
    const updated = [searchQuery.toUpperCase(), ...recentSearches.filter(q => q.toUpperCase() !== searchQuery.toUpperCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentFlights", JSON.stringify(updated));
    
    onSearch(searchQuery.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentFlights");
  };

  return (
    <div className="w-full max-w-2xl mx-auto z-10 relative animate-slide-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-4 ring-1 ring-blue-500/20">
          <PlaneTakeoff className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
          Track Your Flight
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Real-time updates, weather conditions, and instant notifications.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-32 py-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl text-lg shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none dark:text-white placeholder-slate-400 uppercase"
          placeholder="e.g., AA100"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Search"
          )}
        </button>
      </form>

      {recentSearches.length > 0 && (
        <div className="mt-6 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Recent Searches
            </h3>
            <button onClick={clearRecent} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search) => (
              <button
                key={search}
                onClick={() => {
                  setQuery(search);
                  handleSearch(search);
                }}
                className="px-4 py-2 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20 dark:hover:border-blue-800 transition-all text-sm font-medium flex items-center gap-2"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
