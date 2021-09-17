<script lang="ts">
  import TimeSlots from './components/TimeSlots.svelte';
  import TimezoneInput from './components/TimezoneInput.svelte';

  let offsetA = 0;
  let offsetB = 0;
  let overlap = 0;

  const updateOverlap = (e: CustomEvent<number>) => {
    overlap = e.detail;
  };
</script>

<header>
  <div class="title">Time zone overlap calculator</div>
  <div class="overlap">There is {overlap} {overlap === 1 ? 'hour' : 'hours'} of overlap</div>
</header>
<main>
  <div class="inputs">
    <TimezoneInput bind:offset={offsetA} placeholder={'Your location'} />
    <TimezoneInput bind:offset={offsetB} placeholder={"Client's location"} />
  </div>
  <TimeSlots
    {offsetA}
    {offsetB}
    on:change={updateOverlap}
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
  .title {
    color: #ffeed0;
    text-transform: uppercase;
    font-family: var(--font-monospace);
  }
  .overlap {
    font-weight: bold;
    border-radius: var(--radius-1);
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
