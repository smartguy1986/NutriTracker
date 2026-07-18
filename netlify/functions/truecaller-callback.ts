import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    console.log("Received Truecaller callback payload:", payload);
    
    // In a real application, you would verify the signature of this payload
    // and extract the user's phone number/profile from it.
    // Truecaller sends the `requestNonce` back which you can use to tie this to a specific user session.
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Truecaller verification received successfully',
        data: payload
      }),
    };
  } catch (error) {
    console.error("Error processing Truecaller callback:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
