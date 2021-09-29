import App from './App.svelte';

navigator.serviceWorker?.register('/sw.js');

const app = new App({
  target: document.getElementById('root')!,
});

export default app;
