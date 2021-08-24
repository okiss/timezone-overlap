export type LocationDetails = {
  address: string;
  placeId: string;
  lat: number;
  lng: number;
};

type Response = {
  a: number;
};

const API_BASE_URL = 'https://maps.googleapis.com/maps/api';

export async function getPlaceDetails(placeId: string) {
  const params = new URLSearchParams();
  params.set('place_id', placeId);
  params.set('key', 'AIzaSyBhrMVxKFmFD-kJ34ItS9C5GDysNHxBRmg');

  const url = `${API_BASE_URL}/place/details/json?${params.toString()}`;
  const result = await fetch(url);
  if (!result.ok) {
    throw new Error('getPlaceDetails: fetch error');
  }
  const details: Response = await result.json();
  console.log(details);
}
