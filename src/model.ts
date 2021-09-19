export type Location = { id: string; name: string };

export type Alert = { type: 'success' | 'error' | 'warning'; message: string };

export enum Context {
  ALERTS = 'context-alerts',
}
