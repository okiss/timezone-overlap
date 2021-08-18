import App from './App.svelte';

const app = new App({
  target: document.getElementById('root')!,
  props: {
    googleMapsInitPromise: (window as any).googleMapsInitPromise as Promise<void>,
  },
});

export default app;
