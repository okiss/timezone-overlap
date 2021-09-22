import type { Handler } from '@netlify/functions';
import { placeDetails, timezoneAtCoordinates } from '../googleMaps';
import { HTTPError } from '../util';

const handler: Handler = async (event, context) => {
  const placeId = event.queryStringParameters?.id;
  if (!placeId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No ID was provided' }),
    };
  }

  try {
    const placeDetailsResponse = await placeDetails(placeId);

    const { lat, lng } = placeDetailsResponse.result.geometry.location;

    const timezoneResponse = await timezoneAtCoordinates(lat, lng);

    return {
      statusCode: 200,
      body: JSON.stringify(timezoneResponse),
    };
  } catch (error) {
    if (error instanceof HTTPError) {
      return error.response;
    }
    throw error;
  }
};

export { handler };
