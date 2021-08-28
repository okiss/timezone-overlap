<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { countSlots, createTimeSlotArray, mergeSlotListsWithTimezones } from '../timeSlotUtil';
  import TimeSelect from './TimeSlotSelect.svelte';

  export let slotsA: boolean[] = createTimeSlotArray();
  export let slotsB: boolean[] = createTimeSlotArray(9, 17);
  export let offsetA = 0;
  export let offsetB = 0;

  const dispatch = createEventDispatcher<number>();

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
    const overlapCount =
      slotsA && slotsB
        ? countSlots(mergeSlotListsWithTimezones(slotsA, slotsB, offsetA, offsetB))
        : 0;
    dispatch('change' as any, overlapCount);
  }
</script>

<div>
  <div class="timeselect-align" style="transform: translateX({translate}px)">
    <TimeSelect bind:value={slotsA} />
  </div>
  <div class="timeselect-align" style="transform: translateX({-translate}px)">
    <TimeSelect bind:value={slotsB} mirrorLayout={true} />
  </div>
</div>

<style>
  .timeselect-align {
    transition: transform 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
