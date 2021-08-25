import type { Handler } from '@netlify/functions';
import { API_TYPE, googleMapsApi, HTTPError } from '../util';

const handler: Handler = async (event, context) => {
  const query = event.queryStringParameters?.query;
  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No query was provided' }),
    };
  }

  try {
    let response;
    response = await googleMapsApi(
      API_TYPE.AUTOCOMPLETE,
      { input: query, types: '(cities)' },
      (data) => Array.isArray(data?.predictions)
    );

    const data = response.data.predictions.map(
      ({ description, place_id }: { description: string; place_id: string }) => ({
        name: description,
        id: place_id,
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    if (error instanceof HTTPError) {
      return error.response;
    }
    throw error;
  }
};

export { handler };
