import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');

  if (!location) {
    return NextResponse.json({ error: 'Location is required' }, { status: 400 });
  }

  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey || apiKey === 'your_openweathermap_api_key_here') {
    return NextResponse.json({ error: 'OpenWeatherMap API key is not configured' }, { status: 500 });
  }

  try {
    // OpenWeatherMap usually works better with just the city name, we can try to clean the airport name slightly
    // E.g., "Ezeiza Ministro Pistarini" -> search as is, but if it fails we might get a 404.
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenWeatherMap responded with ${response.status}: ${errorText}`);
      
      if (response.status === 404) {
         return NextResponse.json({ error: 'Weather data not found for this location' }, { status: 404 });
      }
      throw new Error(`Failed to fetch from OpenWeatherMap: ${response.status}`);
    }

    const data = await response.json();

    let condition = 'Cloudy';
    const weatherMain = data.weather[0].main;
    if (weatherMain === 'Clear') condition = 'Sunny';
    else if (weatherMain === 'Rain' || weatherMain === 'Drizzle') condition = 'Rain';
    else if (weatherMain === 'Clouds') condition = 'Cloudy';

    const formattedWeather = {
      temp: Math.round(data.main.temp),
      condition,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
      location: data.name,
    };

    return NextResponse.json(formattedWeather);
  } catch (error) {
    console.error("OpenWeatherMap API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
