"use client";

import { useState, useEffect } from "react";
import { Plane, AlertCircle } from "lucide-react";
import SkeletonCard from "./SkeletonCard";

interface LiveFlight {
  flight_number: string;
  airline: string;
  status: string;
  departure: { iata: string; airport: string };
  arrival: { iata: string; airport: string };
}

interface LiveFlightsListProps {
  onSelect: (flightNumber: string) => void;
  selectedFlightNumber?: string;
}

export default function LiveFlightsList({ onSelect, selectedFlightNumber }: LiveFlightsListProps) {
  const [flights, setFlights] = useState<LiveFlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLiveFlights = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/flights/live");
        if (!res.ok) throw new Error("Failed to load live flights");
        const data = await res.json();
        if (data.flights) setFlights(data.flights);
      } catch (err) {
        setError("Unable to load live flights right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveFlights();
  }, []);

  if (error) {
    return (
      <div className="w-full p-6 flex flex-col items-center justify-center text-center text-slate-500">
        <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar pr-2 gap-3 pb-6">
      {isLoading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : flights.length === 0 ? (
        <div className="w-full p-6 text-center text-slate-500 text-sm">
          No live flights detected.
        </div>
      ) : (
        flights.map((flight) => (
          <button
            key={flight.flight_number}
            onClick={() => onSelect(flight.flight_number)}
            className={`flex flex-col p-4 rounded-2xl border transition-all text-left group ${
              selectedFlightNumber === flight.flight_number
                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-md shadow-blue-500/10"
                : "bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700"
            }`}
          >
            <div className="flex justify-between items-center w-full mb-3">
              <span className={`font-bold flex items-center gap-2 ${
                selectedFlightNumber === flight.flight_number 
                  ? "text-blue-700 dark:text-blue-400" 
                  : "text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
              }`}>
                <Plane className="w-4 h-4" />
                {flight.airline} {flight.flight_number}
              </span>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 uppercase tracking-wider">
                {flight.status}
              </span>
            </div>
            
            <div className="flex justify-between items-center w-full text-slate-600 dark:text-slate-400">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-800 dark:text-slate-200">{flight.departure.iata}</span>
                <span className="text-xs max-w-[100px] truncate" title={flight.departure.airport}>{flight.departure.airport}</span>
              </div>
              
              <div className="flex-1 px-3 flex items-center justify-center relative">
                 <div className="w-full border-t border-dashed border-slate-300 dark:border-slate-600"></div>
                 <Plane className="w-4 h-4 text-slate-400 absolute rotate-90" />
              </div>

              <div className="flex flex-col text-right">
                <span className="text-xl font-bold text-slate-800 dark:text-slate-200">{flight.arrival.iata}</span>
                <span className="text-xs max-w-[100px] truncate" title={flight.arrival.airport}>{flight.arrival.airport}</span>
              </div>
            </div>
          </button>
        ))
      )}
    </div>
  );
}
