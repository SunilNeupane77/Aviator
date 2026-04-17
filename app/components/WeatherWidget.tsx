import { CloudRain, Sun, Cloud, Wind, Droplets } from "lucide-react";

export interface WeatherData {
  temp: number;
  condition: "Sunny" | "Cloudy" | "Rain" | "Clear";
  humidity: number;
  windSpeed: number;
  location: string;
}

interface WeatherWidgetProps {
  weather: WeatherData;
}

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case 'Sunny':
    case 'Clear':
      return <Sun className="w-12 h-12 text-yellow-500" />;
    case 'Rain':
      return <CloudRain className="w-12 h-12 text-blue-400" />;
    case 'Cloudy':
    default:
      return <Cloud className="w-12 h-12 text-slate-400" />;
  }
};

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 animate-fade-in w-full h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Destination Weather</h3>
          <p className="text-slate-500 dark:text-slate-400">{weather.location}</p>
        </div>
        {getWeatherIcon(weather.condition)}
      </div>
      
      <div className="flex items-end gap-4 mb-8">
        <span className="text-6xl font-bold tracking-tighter text-slate-900 dark:text-white">
          {weather.temp}°
        </span>
        <span className="text-xl text-slate-500 dark:text-slate-400 font-medium mb-2">
          {weather.condition}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 p-3 rounded-2xl">
          <div className="p-2 bg-blue-500/10 rounded-xl">
            <Droplets className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Humidity</p>
            <p className="font-semibold text-slate-900 dark:text-white">{weather.humidity}%</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 p-3 rounded-2xl">
          <div className="p-2 bg-teal-500/10 rounded-xl">
            <Wind className="w-5 h-5 text-teal-500" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Wind</p>
            <p className="font-semibold text-slate-900 dark:text-white">{weather.windSpeed} km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
}
