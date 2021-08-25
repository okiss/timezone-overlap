import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

const GOOGLE_MAPS_API_BASE_URL = 'https://maps.googleapis.com/maps/api';

export enum API_TYPE {
  AUTOCOMPLETE = '/place/autocomplete',
  PLACE_DETAILS = '/place/details',
  TIMEZONE = '/timezone',
}

export async function googleMapsApi(
  api: API_TYPE,
  params: Record<string, string>,
  validate: (responseData: any) => boolean
) {
  const urlSearchParams = new URLSearchParams(params);
  urlSearchParams.set('key', process.env.GOOGLE_MAPS_API_KEY!);

  const googleResponse = await fetch(
    `${GOOGLE_MAPS_API_BASE_URL}${api}/json?${urlSearchParams.toString()}`
  );
  const googleResponseData = await googleResponse.json();

  if (!googleResponse.ok) {
    throw new HTTPError(googleResponse.status);
  }

  const isValidResponse = googleResponseData.status === 'OK' && validate(googleResponseData);

  if (!isValidResponse) {
    throw new HTTPError(500, 'Google Maps: ' + googleResponseData.error_message || 'Error');
  }

  return googleResponseData;
}

export class HTTPError extends Error {
  response: {
    statusCode: number;
    body: string;
  };

  constructor(statusCode: number, message = 'Error') {
    super(message);
    this.response = {
      statusCode,
      body: JSON.stringify({ message }),
    };
  }
}
