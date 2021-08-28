<script lang="ts">
  export let isLoading = false;
</script>

<div class="loading-overlay" class:is-loading={isLoading}>
  <div class="slot-wrapper">
    <slot />
  </div>
  <div class="loader">···</div>
</div>

<style>
  .loading-overlay {
    position: relative;
  }
  .loading-overlay.is-loading {
    cursor: wait;
  }
  .loading-overlay.is-loading > * {
    pointer-events: none;
  }
  .slot-wrapper {
    opacity: 1;
    filter: none;
    transition: all 0.2s ease;
  }
  .is-loading .slot-wrapper {
    opacity: 0.2;
    filter: blur(4px);
  }
  .loader {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  .is-loading .loader {
    visibility: visible;
    opacity: 1;
  }
</style>
