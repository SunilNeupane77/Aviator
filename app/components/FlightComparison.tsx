import { FlightData } from "./FlightDetailsCard";
import { X, Clock, MapPin, TrendingUp } from "lucide-react";

interface FlightComparisonProps {
  flights: FlightData[];
  onRemove: (index: number) => void;
}

const formatTime = (dateString: string) => {
  if (!dateString) return 'TBD';
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
    case 'landed':
      return 'bg-green-500';
    case 'scheduled':
      return 'bg-blue-500';
    case 'cancelled':
      return 'bg-red-500';
    default:
      return 'bg-yellow-500';
  }
};

export default function FlightComparison({ flights, onRemove }: FlightComparisonProps) {
  if (flights.length === 0) return null;

  return (
    <div className="glass-card rounded-3xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Flight Comparison ({flights.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flights.map((flight, idx) => (
          <div key={idx} className="relative bg-white/50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onRemove(idx)}
              className="absolute top-2 right-2 p-1 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <div className={`inline-block w-2 h-2 rounded-full ${getStatusColor(flight.status)} mr-2`} />
              <span className="font-bold text-slate-900 dark:text-white">{flight.flight_number}</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{flight.airline}</p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">From</p>
                <p className="font-bold text-lg text-slate-900 dark:text-white">{flight.departure.iata}</p>
                <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 mt-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(flight.departure.scheduled)}
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">To</p>
                <p className="font-bold text-lg text-slate-900 dark:text-white">{flight.arrival.iata}</p>
                <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 mt-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(flight.arrival.scheduled)}
                </div>
              </div>

              <div className="pt-2">
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                  flight.status === 'active' || flight.status === 'landed' 
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : flight.status === 'cancelled'
                    ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                    : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                }`}>
                  {flight.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {flights.length < 3 && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
          Search for more flights to compare (max 3)
        </p>
      )}
    </div>
  );
}
