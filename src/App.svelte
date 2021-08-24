<script lang="ts">
  import { countSlots, createTimeSlotArray, mergeSlotListsWithTimezones } from './timeSlotUtil';
  import TimeSelect from './components/TimeSlotSelect.svelte';
  import { URLState, URL_PARAMS } from './urlState';
  import LocationInput from './components/LocationInput.svelte';
  import { initMapsContext } from './maps';

  export let googleMapsInitPromise: Promise<void>;

  initMapsContext(googleMapsInitPromise);

  const urlState = new URLState();

  let slotsA: boolean[];
  let slotsB: boolean[] = createTimeSlotArray(9, 17);
  let offsetA = urlState.get(URL_PARAMS.TIME_ZONE_A) || 0;
  let offsetB = urlState.get(URL_PARAMS.TIME_ZONE_B) || 0;

  let slotACount: number;
  let slotBCount: number;
  let overlapCount: number;

  $: slotACount = countSlots(slotsA);
  $: slotBCount = countSlots(slotsB);
  $: overlapCount =
    slotsA && slotsB
      ? countSlots(mergeSlotListsWithTimezones(slotsA, slotsB, offsetA, offsetB))
      : 0;

  let translate = 0;
  $: {
    let offsetDiff = offsetB - offsetA;
    if (offsetDiff > 12) {
      offsetDiff -= 24;
    }
    if (offsetDiff < -12) {
      offsetDiff += 24;
    }
    translate = offsetDiff * 20;
  }

  $: {
    urlState.saveState({
      [URL_PARAMS.TIME_ZONE_A]: offsetA,
      [URL_PARAMS.TIME_ZONE_B]: offsetB,
    });
  }
</script>

<main>
  <input type="number" bind:value={offsetA} min={-12} max={12} />
  <input type="number" bind:value={offsetB} min={-12} max={12} />
  <div class="timeselect-align" style="transform: translateX({translate}px)">
    <TimeSelect bind:value={slotsA} />
  </div>
  <div class="timeselect-align" style="transform: translateX({-translate}px)">
    <TimeSelect bind:value={slotsB} mirrorLayout={true} />
  </div>
  {slotACount}
  {slotBCount}
  {overlapCount}
  <LocationInput />
</main>

<style>
  main {
    overflow-x: hidden;
  }
  .timeselect-align {
    transition: transform 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
