import { Handler } from '@netlify/functions';

const AUTOCOMPLETE_API_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete';

const handler: Handler = async (event, context) => {
  const query = event.queryStringParameters.query;
  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No query was provided' }),
    };
  }

  const params = new URLSearchParams();
  params.set('key', process.env.GOOGLE_MAPS_API_KEY);
  params.set('input', event.queryStringParameters.query);
  params.set('types', '(cities)');

  const placesResponse = await fetch(`${AUTOCOMPLETE_API_URL}/json?${params.toString()}`);
  const placesResponseData = await placesResponse.json();

  if (!placesResponse.ok) {
    return {
      statusCode: placesResponse.status,
      message: 'Error',
    };
  }

  if (placesResponseData.status !== 'OK') {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Google Maps: ' + placesResponseData.error_message || 'Error',
      }),
    };
  }

  const data = placesResponseData.predictions.map(({ description, place_id }) => ({
    city: description,
    placeId: place_id,
  }));

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};

export { handler };
