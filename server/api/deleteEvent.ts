import { google } from 'googleapis';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import { defineEventHandler, EventHandlerRequest, H3Event } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event); // Read dynamic input from the request body
    const { eventId } = body;

    // Load the service account credentials
    const credentialsPath = resolve('server/config/key.json');
    const credentials = JSON.parse(await fs.readFile(credentialsPath, 'utf-8'));

    // Authenticate the service account
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    // Initialize the Calendar API client
    const calendar = google.calendar({ version: 'v3', auth });

    // Delete the event from the calendar
    await calendar.events.delete({
      calendarId: 'aba2812cffb859323a30180e8484b6767ef51177d72fd3111a8f0f21840df05e@group.calendar.google.com', // Use your existing calendar ID
      eventId: eventId, // Event ID to be deleted
    });

    // Return success response
    return {
      success: true,
      message: 'Event deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting event:', error);
    return {
      success: false,
      message: 'Error deleting event',
      error: error instanceof Error ? error.message : String(error),
    };
  }
});

async function readBody(event: H3Event<EventHandlerRequest>) {
  const chunks: Uint8Array[] = [];
  for await (const chunk of event.req) {
    chunks.push(chunk);
  }
  const rawBody = Buffer.concat(chunks).toString('utf-8');
  return JSON.parse(rawBody);
}

