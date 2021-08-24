import { setContext } from 'svelte';

export const MAPS_CONTEXT = 'maps';

const getMaps = async (initPromise: Promise<void>) => {
  await initPromise;
  return (window as any).google.maps;
};

export type MapsContext = {
  mapsPromise: Promise<typeof google.maps>;
};

export const initMapsContext = (initPromise: Promise<void>) => {
  setContext<MapsContext>(MAPS_CONTEXT, {
    mapsPromise: getMaps(initPromise),
  });
};
