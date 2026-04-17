import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.AVIATIONSTACK_API_KEY;

  if (!apiKey || apiKey === 'your_aviationstack_api_key_here') {
    return NextResponse.json({ error: 'Aviationstack API key is not configured' }, { status: 500 });
  }

  try {
    // Fetch a list of active flights. Limit to 20 to avoid massive payloads.
    const response = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_status=active&limit=20`);
    if (!response.ok) {
      throw new Error('Failed to fetch live flights from Aviationstack');
    }
    
    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return NextResponse.json({ flights: [] });
    }

    // Map and filter Aviationstack response to a clean list
    const flights = data.data
      .filter((f: any) => f.flight && f.flight.iata && f.airline && f.airline.name) // ensure valid data
      .map((flightInfo: any) => ({
        flight_number: flightInfo.flight.iata,
        airline: flightInfo.airline.name,
        status: flightInfo.flight_status,
        departure: {
          airport: flightInfo.departure.airport || flightInfo.departure.iata || 'Unknown',
          iata: flightInfo.departure.iata,
        },
        arrival: {
          airport: flightInfo.arrival.airport || flightInfo.arrival.iata || 'Unknown',
          iata: flightInfo.arrival.iata,
        }
      }));

    return NextResponse.json({ flights });
  } catch (error) {
    console.error("Aviationstack API Live Flights Error:", error);
    return NextResponse.json({ error: 'Failed to fetch live flights data' }, { status: 500 });
  }
}
