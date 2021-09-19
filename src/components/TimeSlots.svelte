<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import {
    countSlots,
    createTimeSlotArray,
    mergeSlotListsWithTimezones,
  } from '../util/timeSlotUtil';
  import TimeSlotSelect from './TimeSlotSelect.svelte';

  export let slotsA: boolean[] = createTimeSlotArray();
  export let slotsB: boolean[] = createTimeSlotArray(9, 17);
  export let offsetA = 0;
  export let offsetB = 0;
  export let labelA = '';
  export let labelB = '';

  const dispatch = createEventDispatcher<number>();

  let translate = 0;
  $: {
    let offsetDiff = offsetB - offsetA;
    if (offsetDiff > 12) {
      offsetDiff -= 24;
      dispatch('dayShifted' as any, -1);
    }
    if (offsetDiff < -12) {
      offsetDiff += 24;
      dispatch('dayShifted' as any, +1);
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
  <div class="label label-top">{labelA || ' '}</div>
  <div class="timeselect-align" style="transform: translateX({translate}px)">
    <TimeSlotSelect bind:value={slotsA} />
  </div>
  <div class="timeselect-align" style="transform: translateX({-translate}px)">
    <TimeSlotSelect bind:value={slotsB} mirrorLayout={true} />
  </div>
  <div class="label label-bottom">{labelB || ' '}</div>
</div>

<style>
  .timeselect-align {
    transition: transform 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .label {
    text-align: center;
    color: #555;
  }
  .label-top {
    padding-bottom: var(--spacing-4);
  }
  .label-bottom {
    padding-top: var(--spacing-4);
  }
</style>
