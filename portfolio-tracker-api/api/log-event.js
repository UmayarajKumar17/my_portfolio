// Serverless function for logging events like CV downloads
// This will work with Vercel or Netlify Functions

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase only once
let firebaseApp;
let db;

const initializeFirebase = () => {
  if (!firebaseApp) {
    // Vercel and Netlify both support environment variables
    const serviceAccountKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
    
    firebaseApp = initializeApp({
      credential: cert(serviceAccountKey)
    });
    
    db = getFirestore();
  }
  return db;
};

exports.handler = async (event, context) => {
  // Set CORS headers for browsers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  try {
    // Parse the incoming request
    const body = JSON.parse(event.body);
    const { sessionId, eventType, timestamp, userAgent, referrer } = body;

    if (!sessionId || !eventType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Initialize Firestore
    const db = initializeFirebase();
    
    // Add the event to Firestore
    await db.collection('portfolio_events').add({
      sessionId,
      eventType,
      timestamp,
      userAgent,
      referrer,
      createdAt: new Date().toISOString()
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Error logging event:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to log event' })
    };
  }
}; 