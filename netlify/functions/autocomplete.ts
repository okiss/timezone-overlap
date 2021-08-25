import type { Handler } from '@netlify/functions';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

const AUTOCOMPLETE_API_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete';

const handler: Handler = async (event, context) => {
  const query = event.queryStringParameters?.query;
  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No query was provided' }),
    };
  }

  const params = new URLSearchParams();
  params.set('key', process.env.GOOGLE_MAPS_API_KEY!);
  params.set('input', query);
  params.set('types', '(cities)');

  const placesResponse = await fetch(`${AUTOCOMPLETE_API_URL}/json?${params.toString()}`);
  const placesResponseData = await placesResponse.json();

  if (!placesResponse.ok) {
    return {
      statusCode: placesResponse.status,
      message: 'Error',
    };
  }

  const isValidResponse =
    placesResponseData.status === 'OK' && Array.isArray(placesResponseData?.predictions);

  if (!isValidResponse) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Google Maps: ' + placesResponseData.error_message || 'Error',
      }),
    };
  }

  const data = placesResponseData.predictions.map(
    ({ description, place_id }: { description: string; place_id: string }) => ({
      name: description,
      id: place_id,
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};

export { handler };
