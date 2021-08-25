export enum API_TYPE {
  AUTOCOMPLETE = '/place/autocomplete',
  PLACE_DETAILS = '/place/details',
  TIMEZONE = '/timezone',
}

export type AutocompleteResponse = {
  predictions: {
    description: string;
    place_id: string;
  }[];
};

export type PlaceDetailsResponse = {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
};

export type TimezoneResponse = {
  rawOffset: number;
  timeZoneName: string;
};
