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
  <div>Timezone overlap calculator</div>
  <div>There is {overlap} {overlap === 1 ? 'hour' : 'hours'} of overlap</div>
</header>
<main>
  <TimezoneInput bind:offset={offsetA} />
  <TimeSlots {offsetA} {offsetB} on:change={updateOverlap} />
  <TimezoneInput bind:offset={offsetB} />
</main>

<style>
  header {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    background-color: #eee;
    height: 60px;
  }
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-6);
    margin-top: var(--spacing-6);
  }
</style>
