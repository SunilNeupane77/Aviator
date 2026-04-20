import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const flightNumber = searchParams.get('flight');

  if (!flightNumber) {
    return NextResponse.json({ error: 'Flight number is required' }, { status: 400 });
  }

  const apiKey = process.env.AVIATIONSTACK_API_KEY;

  if (!apiKey || apiKey === 'your_aviationstack_api_key_here') {
    return NextResponse.json({ error: 'Aviationstack API key is not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${flightNumber}`);
    if (!response.ok) {
      throw new Error('Failed to fetch from Aviationstack');
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    const flightInfo = data.data[0];

    // Helper to extract city from timezone (e.g. "Europe/London" -> "London")
    const extractCity = (timezoneStr: string) => {
      if (!timezoneStr) return undefined;
      const parts = timezoneStr.split('/');
      if (parts.length > 1) {
        return parts[parts.length - 1].replace(/_/g, ' ');
      }
      return undefined;
    };

    // Map Aviationstack response to our app's format
    const formattedFlight = {
      flight_number: flightInfo.flight.iata,
      airline: flightInfo.airline.name,
      status: flightInfo.flight_status,
      departure: {
        airport: flightInfo.departure.airport,
        iata: flightInfo.departure.iata,
        scheduled: flightInfo.departure.scheduled,
        terminal: flightInfo.departure.terminal,
        gate: flightInfo.departure.gate,
        city: extractCity(flightInfo.departure.timezone),
      },
      arrival: {
        airport: flightInfo.arrival.airport,
        iata: flightInfo.arrival.iata,
        scheduled: flightInfo.arrival.scheduled,
        terminal: flightInfo.arrival.terminal,
        gate: flightInfo.arrival.gate,
        city: extractCity(flightInfo.arrival.timezone),
      }
    };

    return NextResponse.json(formattedFlight);
  } catch (error) {
    console.error("Aviationstack API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch flight data' }, { status: 500 });
  }
}
