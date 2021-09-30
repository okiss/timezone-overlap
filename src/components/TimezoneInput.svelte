<script lang="ts">
  import type { Alert, Location } from '../model';
  import { getContext } from 'svelte';
  import { getTimezone } from '../api';
  import { Context } from '../model';
  import LocationInput from './LocationInput.svelte';

  export let offset = 0;
  export let location = '';
  export let label = 'Location';
  export let placeholder = '';

  const alert: (alert: Alert) => void = getContext(Context.ALERTS);

  let timeZoneName = '';
  let isLoading = false;

  const onLocationSelected = async (event: CustomEvent<Location>) => {
    isLoading = true;
    try {
      const result = await getTimezone(event.detail.id);
      location = event.detail.name;
      offset = Math.round(result.rawOffset / 60);
      timeZoneName = result.timeZoneName;
    } catch (error) {
      alert({ type: 'error', message: 'Could not load time zone information' });
      console.error(error);
    } finally {
      isLoading = false;
    }
  };

  const onClear = () => {
    offset = 0;
    location = '';
    timeZoneName = '';
  };

  let offsetText: string;
  let timeZoneText: string;
  $: offsetText = `UTC${offset >= 0 ? '+' : ''}${offset / 60}`;
  $: timeZoneText = timeZoneName ? `(${timeZoneName})` : '';
</script>

<div class="time-zone-input">
  <LocationInput
    {isLoading}
    {label}
    {placeholder}
    on:submit={onLocationSelected}
    on:clear={onClear}
  />
  <div class="info">
    <span class="offset">{offsetText}</span> <span>{timeZoneText}</span>
  </div>
</div>

<style>
  .time-zone-input {
    width: 400px;
  }
  .info {
    margin-top: var(--spacing-2);
    text-align: center;
    font-family: 'Consolas', monospace;
  }
  .offset {
    font-weight: bold;
  }
</style>
