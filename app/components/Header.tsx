"use client";

import { Plane, Search, Radio } from "lucide-react";

interface HeaderProps {
  currentTab: "search" | "live";
  onTabChange: (tab: "search" | "live") => void;
}

export default function Header({ currentTab, onTabChange }: HeaderProps) {
  return (
    <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange("search")}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">AeroTrack</span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => onTabChange("search")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === "search"
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
            }`}
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
          
          <button
            onClick={() => onTabChange("live")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === "live"
                ? "bg-white dark:bg-slate-700 text-red-500 dark:text-red-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
            }`}
          >
            <Radio className={`w-4 h-4 ${currentTab === "live" ? "animate-pulse" : ""}`} />
            <span className="hidden sm:inline">Live Board</span>
          </button>
        </nav>

      </div>
    </header>
  );
}
