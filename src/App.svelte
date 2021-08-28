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
  <div class="title">Timezone overlap calculator</div>
  <div class="overlap">There is {overlap} {overlap === 1 ? 'hour' : 'hours'} of overlap</div>
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
    justify-content: space-between;
    background-color: #eee;
    padding: var(--spacing-4) var(--spacing-6);
  }
  .overlap {
    font-weight: bold;
    border-radius: var(--radius-1);
    background-color: #b5ebb5;
    padding: var(--spacing-2);
  }
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-7);
    padding-top: var(--spacing-7);
  }
</style>
