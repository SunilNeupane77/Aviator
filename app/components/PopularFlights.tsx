"use client";

import { Plane, Star } from "lucide-react";

interface PopularFlightsProps {
  onSelect: (flightNumber: string) => void;
  isLoading: boolean;
}

export default function PopularFlights({ onSelect, isLoading }: PopularFlightsProps) {
  const popularFlights = [
    { number: "AA100", route: "JFK → LHR" },
    { number: "BA249", route: "GIG → LHR" },
    { number: "UA54", route: "CDG → IAD" },
    { number: "EK202", route: "JFK → DXB" },
    { number: "DL474", route: "JFK → MAD" },
    { number: "AF23", route: "JFK → CDG" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 z-10 relative animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-2 mb-4 text-slate-700 dark:text-slate-300">
        <Star className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold">Popular Active Flights</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {popularFlights.map((flight) => (
          <button
            key={flight.number}
            onClick={() => onSelect(flight.number)}
            disabled={isLoading}
            className="flex flex-col items-start p-3 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-300 hover:shadow-md transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
              <Plane className="w-3 h-3" />
              {flight.number}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">{flight.route}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
