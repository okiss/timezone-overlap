import type { Handler } from '@netlify/functions';
import { API_TYPE, googleMapsApi, HTTPError } from '../util';

const handler: Handler = async (event, context) => {
  const placeId = event.queryStringParameters?.id;
  if (!placeId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No ID was provided' }),
    };
  }

  try {
    const placeDetailsResponse = await googleMapsApi(
      API_TYPE.PLACE_DETAILS,
      {
        fields: 'geometry',
        place_id: placeId,
      },
      (data) => typeof data?.geometry?.location?.lat === 'string'
    );

    const { lat, lng } = placeDetailsResponse.geometry.location;

    const timezoneResponse = await googleMapsApi(
      API_TYPE.TIMEZONE,
      {
        location: `${lat},${lng}`,
        timestamp: String(new Date(new Date().getFullYear(), 0).getTime() / 1000),
      },
      (data) => typeof data?.rawOffset === 'number' && typeof data?.timeZoneName === 'string'
    );

    return {
      statusCode: 200,
      body: JSON.stringify(timezoneResponse),
    };
  } catch (error) {
    if (error instanceof HTTPError) {
      return error.response;
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error' }),
    };
  }
};

export { handler };
