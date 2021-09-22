import type { Handler } from '@netlify/functions';
import { autocomplete } from '../googleMaps';
import { HTTPError } from '../util';

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
    response = await autocomplete(query);

    const data = response.predictions.map(({ description, place_id }) => ({
      name: description,
      id: place_id,
    }));

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
