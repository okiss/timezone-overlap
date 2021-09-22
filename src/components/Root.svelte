<script lang="ts">
  import type { Alert } from '../model';
  import { getContext } from 'svelte';
  import { fly } from 'svelte/transition';
  import { Context } from '../model';
  import TimeSlots from './TimeSlots.svelte';
  import TimezoneInput from './TimezoneInput.svelte';

  const alert: (alert: Alert) => void = getContext(Context.ALERTS);

  let offsetA = 0;
  let offsetB = 0;
  let overlap = 0;

  let locationA = '';
  let locationB = '';

  const updateOverlap = (e: CustomEvent<number>) => {
    overlap = e.detail;
  };

  const alertDayShifted = (e: CustomEvent<number>) => {
    const messageDays = e.detail > 0 ? ['Tuesday', 'Monday'] : ['Monday', 'Tuesday'];
    const cityA = locationA.split(', ')[0];
    const cityB = locationB.split(', ')[0];
    const shiftedCity = e.detail > 0 ? cityA : cityB;
    alert({
      type: 'warning',
      message: `These locations are more then 12 hours apart in the same day. Therefore the time slots for ${shiftedCity} were shifted one day forward. For example, you see how the hours align when it is e.g. ${messageDays[0]} in ${cityA} and ${messageDays[1]} in ${cityB}`,
    });
  };
</script>

<header>
  <h1>Time zone overlap calculator</h1>
  <div class="overlap">
    There is {#key overlap}<span style="display: inline-block" in:fly={{ y: -20 }}>{overlap}</span
      >{/key}
    {overlap === 1 ? 'hour' : 'hours'} of overlap
  </div>
</header>
<main>
  <div class="inputs">
    <TimezoneInput
      label={'Your location'}
      placeholder={'Cape Town'}
      bind:offset={offsetA}
      bind:location={locationA}
    />
    <TimezoneInput
      label={"Client's location"}
      placeholder={'San Francisco'}
      bind:offset={offsetB}
      bind:location={locationB}
    />
  </div>
  <TimeSlots
    {offsetA}
    {offsetB}
    on:change={updateOverlap}
    on:dayShifted={alertDayShifted}
    labelA={'Your working hours'}
    labelB={"Client's working hours"}
  />
</main>

<style>
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-4) var(--spacing-6);
    background: var(--primary);
    box-shadow: 0 0 40px #0028ff29;
  }
  h1 {
    margin: 0;
    font-size: 20px;
    color: #ffeed0;
    text-transform: uppercase;
    font-family: var(--font-monospace);
  }
  .overlap {
    min-width: 280px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    border-radius: var(--radius-2);
    color: var(--primary);
    background-color: #b5ebb5;
    padding: var(--spacing-2);
    box-shadow: 0 0 16px #b5ebb594;
  }
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-7);
    padding-top: var(--spacing-6);
  }
  .inputs {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-7);
  }
</style>
