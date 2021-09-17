<script lang="ts">
  export let size = '22px';
</script>

<div class="loader" style="width:{size}; height:{size}" />

<style>
  .loader,
  .loader:after {
    --stroke-width: 2px;
    border-radius: 50%;
  }
  .loader {
    position: relative;
    border-top: var(--stroke-width) solid rgba(255, 255, 255, 0.4);
    border-right: var(--stroke-width) solid rgba(255, 255, 255, 0.4);
    border-bottom: var(--stroke-width) solid rgba(255, 255, 255, 0.4);
    border-left: var(--stroke-width) solid var(--primary);
    transform: translateZ(0);
    animation: spin 0.5s infinite linear;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
