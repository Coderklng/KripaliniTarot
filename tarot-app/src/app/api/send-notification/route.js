import { NextResponse } from 'next/server';
import { adminMessaging } from '@/lib/firebaseAdmin';

// POST Method (Main Notification Handler)
export async function POST(request) {
  try {
    const { token, title, body } = await request.json();

    const message = {
      notification: { title, body },
      token: token,
    };

    const response = await adminMessaging.send(message);
    return NextResponse.json({ success: true, response });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET Method (Quick Route Health Check)
export async function GET() {
  return NextResponse.json({ 
    message: "Send Notification API is active. Send a POST request to trigger notifications." 
  });
}