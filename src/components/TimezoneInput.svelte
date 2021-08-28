<script lang="ts">
  import { getTimezone } from '../api';
  import LocationInput from './LocationInput.svelte';

  export let offset: number;

  let timeZoneName = '';
  let isLoading = false;

  const onLocationSelected = async (event: CustomEvent<string>) => {
    isLoading = true;
    try {
      const result = await getTimezone(event.detail);
      offset = Math.round(result.rawOffset / 60 / 60);
      timeZoneName = result.timeZoneName;
    } catch (error) {
      console.error(error);
    } finally {
      isLoading = false;
    }
  };

  const onClear = () => {
    offset = 0;
    timeZoneName = '';
  };

  let offsetText: string;
  let timeZoneText: string;
  $: offsetText = `UTC${offset >= 0 ? '+' : ''}${offset}`;
  $: timeZoneText = timeZoneName ? `(${timeZoneName})` : '';
</script>

<div class="time-zone-input">
  <LocationInput {isLoading} on:submit={onLocationSelected} on:clear={onClear} />
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
