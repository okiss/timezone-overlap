import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import { API_TYPE, AutocompleteResponse, PlaceDetailsResponse, TimezoneResponse } from './model';
import { HTTPError } from './util';

const GOOGLE_MAPS_API_BASE_URL = 'https://maps.googleapis.com/maps/api';

async function googleMapsApi<T>(
  api: API_TYPE,
  params: Record<string, string>,
  validate: (responseData: T) => boolean
): Promise<T> {
  const urlSearchParams = new URLSearchParams(params);
  urlSearchParams.set('key', process.env.GOOGLE_MAPS_API_KEY!);

  const googleResponse = await fetch(
    `${GOOGLE_MAPS_API_BASE_URL}${api}/json?${urlSearchParams.toString()}`
  );
  const googleResponseData = await googleResponse.json();

  console.log({
    url: googleResponse.url,
    status: googleResponse.status,
    data: JSON.stringify(googleResponseData),
  });

  if (!googleResponse.ok) {
    throw new HTTPError(googleResponse.status, 'Error contacting Google Maps API');
  }
  if (!(googleResponseData.status === 'OK' || googleResponseData.status === 'ZERO_RESULTS')) {
    throw new HTTPError(500, 'Google Maps: ' + (googleResponseData.error_message || 'Error'));
  }
  if (!validate(googleResponseData)) {
    throw new HTTPError(500, 'Google Maps: Invalid response');
  }

  return googleResponseData;
}

export function autocomplete(query: string) {
  return googleMapsApi<AutocompleteResponse>(
    API_TYPE.AUTOCOMPLETE,
    { input: query, types: '(cities)' },
    (data) => Array.isArray(data?.predictions)
  );
}

export function placeDetails(placeId: string) {
  return googleMapsApi<PlaceDetailsResponse>(
    API_TYPE.PLACE_DETAILS,
    {
      fields: 'geometry',
      place_id: placeId,
    },
    (data) => typeof data?.result?.geometry?.location?.lat === 'number'
  );
}

export function timezoneAtCoordinates(lat: number, lng: number) {
  const timestampSeconds = Date.now() / 1000;
  const roundedTimestamp = timestampSeconds - (timestampSeconds % (60 * 60));

  return googleMapsApi<TimezoneResponse>(
    API_TYPE.TIMEZONE,
    {
      location: `${lat},${lng}`,
      timestamp: `${roundedTimestamp}`,
    },
    (data) => typeof data?.rawOffset === 'number' && typeof data?.timeZoneName === 'string'
  );
}
