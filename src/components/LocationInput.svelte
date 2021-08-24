<script lang="ts">
  import { getContext } from 'svelte';
  import { cityAutocomplete, getPlaceDetails, MAPS_CONTEXT } from '../maps';
  import type { MapsContext, Place } from '../maps';
  import { debounce } from '../util';

  export let value = '';

  const { mapsPromise } = getContext<MapsContext>(MAPS_CONTEXT);

  let suggestions: Place[] = [];

  const searchLocation = async (e: any) => {
    const searchText: string = e.target.value;

    if (!searchText || searchText.length <= 2) {
      suggestions = [];
      return;
    }

    try {
      const maps = await mapsPromise;
      suggestions = await cityAutocomplete(maps, searchText);
    } catch (error) {
      console.error(error);
    }
  };

  const selectSuggestion = (index: number) => async () => {
    const details = await getPlaceDetails(suggestions[index].placeId);
    console.log(details);
  };
</script>

{#await mapsPromise}
  ...loading
{:then maps}
  <input type="text" {value} on:input={debounce(searchLocation)} on:change={selectSuggestion(0)} />
  <ul>
    {#each suggestions as { description }, index}
      <li on:click={selectSuggestion(index)}>{description}</li>
    {/each}
  </ul>
{/await}
