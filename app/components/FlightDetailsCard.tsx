import { useState } from "react";
import { Plane, Clock, MapPin, CheckCircle2, AlertTriangle, XCircle, Info, Share2, Check } from "lucide-react";

export interface FlightData {
  flight_number: string;
  airline: string;
  status: "scheduled" | "active" | "landed" | "cancelled" | "incident" | "diverted" | string;
  departure: {
    airport: string;
    iata: string;
    scheduled: string;
    terminal: string | null;
    gate: string | null;
    city?: string;
  };
  arrival: {
    airport: string;
    iata: string;
    scheduled: string;
    terminal: string | null;
    gate: string | null;
    city?: string;
  };
}

interface FlightDetailsCardProps {
  flight: FlightData;
}

const formatTime = (dateString: string) => {
  if (!dateString) return 'TBD';
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'TBD';
  return new Date(dateString).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
    case 'landed':
      return 'text-green-500 bg-green-500/10 border-green-500/20';
    case 'scheduled':
      return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    case 'cancelled':
      return 'text-red-500 bg-red-500/10 border-red-500/20';
    default:
      return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
    case 'landed':
      return <CheckCircle2 className="w-5 h-5" />;
    case 'cancelled':
      return <XCircle className="w-5 h-5" />;
    default:
      return <AlertTriangle className="w-5 h-5" />;
  }
};

const getProgressWidth = (status: string) => {
  switch (status) {
    case 'landed': return '100%';
    case 'active': return '50%';
    case 'scheduled': return '5%';
    case 'cancelled': return '0%';
    default: return '25%';
  }
};

export default function FlightDetailsCard({ flight }: FlightDetailsCardProps) {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const isCancelled = flight.status === 'cancelled';

  const handleShare = () => {
    const text = `✈️ Track my flight! ${flight.airline} ${flight.flight_number}\n🛫 Departs: ${flight.departure.iata} at ${formatTime(flight.departure.scheduled)}\n🛬 Arrives: ${flight.arrival.iata} at ${formatTime(flight.arrival.scheduled)}\nStatus: ${flight.status.toUpperCase()}`;
    
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
      }
      document.body.removeChild(textArea);
    } catch (err) {
      console.error('Fallback copy failed', err);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 animate-fade-in w-full hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-wrap items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Plane className={`w-6 h-6 transition-transform hover:scale-110 ${isCancelled ? 'text-red-500' : 'text-blue-500'}`} />
            {flight.airline} {flight.flight_number}
          </h2>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-105 transition-all text-slate-700 dark:text-slate-300 shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Share'}
          </button>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold capitalize animate-pulse-slow ${getStatusColor(flight.status)}`}>
            {getStatusIcon(flight.status)}
            {flight.status}
          </div>
        </div>
      </div>

      <div className="relative flex justify-between items-start md:items-center flex-col md:flex-row gap-8 md:gap-0">
        {/* Departure */}
        <div className="flex-1 w-full md:w-auto group">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Departure</p>
          <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">{flight.departure.iata}</p>
          <p className="text-lg text-slate-700 dark:text-slate-300 font-medium truncate" title={flight.departure.airport}>{flight.departure.airport}</p>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
              <Clock className="w-4 h-4 shrink-0" />
              <span className="truncate">{formatTime(flight.departure.scheduled)} • {formatDate(flight.departure.scheduled)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Terminal {flight.departure.terminal || 'TBD'} • Gate {flight.departure.gate || 'TBD'}</span>
            </div>
          </div>
        </div>

        {/* Plane graphic / Timeline */}
        <div className="w-full md:flex-1 md:px-8 py-6 md:py-0">
          <div className="w-full flex items-center relative">
            <div className={`w-3 h-3 rounded-full shrink-0 z-10 animate-pulse ${isCancelled ? 'bg-red-500 ring-red-500/20' : 'bg-blue-500 ring-blue-500/20'} ring-4`} />
            
            <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 relative overflow-hidden rounded-full mx-2">
              <div 
                className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-in-out ${isCancelled ? 'bg-red-500' : 'bg-blue-500'}`} 
                style={{ width: getProgressWidth(flight.status) }}
              />
            </div>
            
            <Plane 
              className={`w-6 h-6 absolute top-1/2 -translate-y-1/2 -mt-3 transition-all duration-1000 ease-in-out hover:scale-125 ${isCancelled ? 'text-red-500' : 'text-blue-500'}`} 
              style={{ left: `calc(${getProgressWidth(flight.status)} - 12px)` }}
            />

            <div className={`w-3 h-3 rounded-full shrink-0 z-10 ${flight.status === 'landed' ? 'bg-green-500 ring-4 ring-green-500/20 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`} />
          </div>
          <div className="text-center mt-6">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-default">
              <Info className="w-3 h-3" />
              {flight.status === 'active' ? 'In Air' : flight.status === 'scheduled' ? 'On Ground' : flight.status}
            </p>
          </div>
        </div>

        {/* Arrival */}
        <div className="flex-1 w-full md:w-auto text-left md:text-right group">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Arrival</p>
          <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-green-500 transition-colors">{flight.arrival.iata}</p>
          <p className="text-lg text-slate-700 dark:text-slate-300 font-medium truncate" title={flight.arrival.airport}>{flight.arrival.airport}</p>
          
          <div className="mt-4 space-y-2 flex flex-col md:items-end">
            <div className="flex items-center md:flex-row-reverse gap-2 text-slate-600 dark:text-slate-400 hover:text-green-500 dark:hover:text-green-400 transition-colors">
              <Clock className="w-4 h-4 shrink-0" />
              <span className="truncate">{formatTime(flight.arrival.scheduled)} • {formatDate(flight.arrival.scheduled)}</span>
            </div>
            <div className="flex items-center md:flex-row-reverse gap-2 text-slate-600 dark:text-slate-400 hover:text-green-500 dark:hover:text-green-400 transition-colors">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Terminal {flight.arrival.terminal || 'TBD'} • Gate {flight.arrival.gate || 'TBD'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
