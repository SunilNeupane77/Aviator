"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import FlightSearch from "./components/FlightSearch";
import PopularFlights from "./components/PopularFlights";
import FlightDetailsCard, { FlightData } from "./components/FlightDetailsCard";
import WeatherWidget, { WeatherData } from "./components/WeatherWidget";
import NotificationForm from "./components/NotificationForm";
import LiveFlightsList from "./components/LiveFlightsList";
import FlightComparison from "./components/FlightComparison";
import { Plane, RefreshCw, Star } from "lucide-react";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<"search" | "live">("search");
  const [flightData, setFlightData] = useState<FlightData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [compareFlights, setCompareFlights] = useState<FlightData[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favFlights');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh || !flightData) return;
    const interval = setInterval(() => {
      handleSearch(flightData.flight_number);
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [autoRefresh, flightData]);

  const handleSearch = async (flightNumber: string) => {
    setIsLoading(true);
    setError(null);
    if (!compareMode) {
      setFlightData(null);
      setWeatherData(null);
    }

    try {
      const flightRes = await fetch(`/api/flight?flight=${flightNumber}`);
      if (!flightRes.ok) throw new Error("Flight not found");
      const flight: FlightData = await flightRes.json();
      
      if (compareMode) {
        setCompareFlights(prev => [...prev, flight].slice(-3)); // Max 3 flights
      } else {
        setFlightData(flight);
        const weatherLocation = flight.arrival.city || flight.arrival.airport;
        const weatherRes = await fetch(`/api/weather?location=${encodeURIComponent(weatherLocation)}`);
        if (weatherRes.ok) {
          const weather: WeatherData = await weatherRes.json();
          setWeatherData(weather);
        }
      }
    } catch (err) {
      setError("Could not find information for that flight. Please check the flight number and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (flightNumber: string) => {
    const updated = favorites.includes(flightNumber)
      ? favorites.filter(f => f !== flightNumber)
      : [...favorites, flightNumber];
    setFavorites(updated);
    localStorage.setItem('favFlights', JSON.stringify(updated));
  };

  const handleTabChange = (tab: "search" | "live") => {
    setCurrentTab(tab);
    setCompareMode(false);
    setCompareFlights([]);
    if (tab === "search") {
      setFlightData(null);
      setWeatherData(null);
      setError(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-500/30">
      <Header currentTab={currentTab} onTabChange={handleTabChange} />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 h-[calc(100vh-4rem)]">
        
        {currentTab === "search" ? (
          <div className="h-full flex flex-col justify-center items-center relative overflow-hidden px-4">
            <div className="absolute top-1/4 left-1/4 w-[40%] h-[40%] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[40%] h-[40%] bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
            
            {/* Interactive Controls */}
            <div className="absolute top-4 right-4 flex gap-2 z-20">
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  compareMode 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                {compareMode ? 'Exit Compare' : 'Compare Flights'}
              </button>
              {favorites.length > 0 && (
                <button
                  className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 font-medium transition-all flex items-center gap-2"
                  title="View Favorites"
                >
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {favorites.length}
                </button>
              )}
            </div>

            <FlightSearch onSearch={handleSearch} isLoading={isLoading} />
            <PopularFlights onSelect={handleSearch} isLoading={isLoading} />

            {error && (
              <div className="mt-8 p-4 w-full max-w-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 animate-fade-in text-center shadow-sm z-10">
                {error}
              </div>
            )}

            {compareMode && compareFlights.length > 0 && (
              <div className="mt-12 w-full max-w-6xl animate-slide-up z-10">
                <FlightComparison flights={compareFlights} onRemove={(idx) => setCompareFlights(prev => prev.filter((_, i) => i !== idx))} />
              </div>
            )}

            {!compareMode && flightData && (
              <div className="mt-12 w-full max-w-5xl flex flex-col gap-8 animate-slide-up z-10" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAutoRefresh(!autoRefresh)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        autoRefresh 
                          ? 'bg-green-500 text-white' 
                          : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                      Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
                    </button>
                    <button
                      onClick={() => toggleFavorite(flightData.flight_number)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all"
                    >
                      <Star className={`w-4 h-4 ${favorites.includes(flightData.flight_number) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      {favorites.includes(flightData.flight_number) ? 'Saved' : 'Save'}
                    </button>
                  </div>
                </div>
                <FlightDetailsCard flight={flightData} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {weatherData && (
                    <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                      <WeatherWidget weather={weatherData} />
                    </div>
                  )}
                  <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <NotificationForm flightNumber={flightData.flight_number} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            
            {/* Sidebar List */}
            <div className="lg:col-span-4 h-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-4 flex flex-col shadow-sm">
              <div className="flex items-center gap-2 mb-4 px-2 text-slate-800 dark:text-slate-200">
                <Plane className="w-5 h-5 text-blue-500" />
                <h2 className="font-bold text-lg">Active Flights</h2>
              </div>
              <div className="flex-1 overflow-hidden">
                <LiveFlightsList 
                  onSelect={handleSearch} 
                  selectedFlightNumber={flightData?.flight_number} 
                />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 h-full overflow-y-auto custom-scrollbar rounded-3xl pb-8">
              {isLoading && !flightData && (
                <div className="w-full h-64 bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-center animate-pulse">
                   <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
              )}

              {error && (
                <div className="p-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-center shadow-sm">
                  {error}
                </div>
              )}

              {!flightData && !isLoading && !error && (
                <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-white/30 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-3xl border-dashed">
                  <Plane className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-700" />
                  <p className="text-lg">Select a flight from the board to view details</p>
                </div>
              )}

              {flightData && (
                <div className="flex flex-col gap-6 animate-slide-up">
                  <FlightDetailsCard flight={flightData} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {weatherData && (
                      <div className="h-full">
                        <WeatherWidget weather={weatherData} />
                      </div>
                    )}
                    <div className="h-full">
                      <NotificationForm flightNumber={flightData.flight_number} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        )}
        
      </main>
    </div>
  );
}
