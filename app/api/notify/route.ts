import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, flightNumber } = body;

    if (!phone || !flightNumber) {
      return NextResponse.json(
        { error: 'Phone and flight number are required' },
        { status: 400 }
      );
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || accountSid === 'your_twilio_account_sid_here' || !authToken || !twilioPhone) {
      return NextResponse.json(
        { error: 'Twilio credentials are not configured' },
        { status: 500 }
      );
    }

    const client = require('twilio')(accountSid, authToken);
    
    try {
      await client.messages.create({
        body: `You are subscribed to updates for flight ${flightNumber}. We will notify you of any changes.`,
        from: twilioPhone,
        to: phone
      });
      
      return NextResponse.json({ success: true, message: 'SMS sent successfully' });
    } catch (twilioError: any) {
      console.error("Twilio API Error:", twilioError);
      return NextResponse.json(
        { error: twilioError.message || 'Failed to send SMS via Twilio' },
        { status: 400 } // 400 because it's usually a bad phone number format
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
