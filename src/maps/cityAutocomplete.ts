export type Place = {
  description: string;
  placeId: string;
};

let autocompleteService: google.maps.places.AutocompleteService;

export function cityAutocomplete(maps: typeof window.google.maps, input: string) {
  return new Promise<Place[]>((resolve, reject) => {
    if (!autocompleteService) {
      autocompleteService = new maps.places.AutocompleteService();
    }

    const request: google.maps.places.AutocompletionRequest = { input, types: ['(cities)'] };

    autocompleteService.getPlacePredictions(request, (suggestions, status) => {
      if (status !== 'OK') {
        reject();
        return;
      }

      if (!suggestions) {
        resolve([]);
        return;
      }
      console.log(suggestions);

      resolve(
        suggestions.map((suggestion) => ({
          description: suggestion.description,
          placeId: suggestion.place_id!,
        }))
      );
    });
  });
}
