<script lang="ts">
  import Alerts from './components/Alerts.svelte';
  import Root from './components/Root.svelte';
</script>

<Alerts>
  <Root />
</Alerts>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
    line-height: 1;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    min-width: 1000px;
  }

  :global(html) {
    box-sizing: border-box;
  }
  :global(*, *:before, *:after) {
    box-sizing: inherit;
  }

  :global(:root) {
    --background: white;
    --primary: #18244f;

    --spacing-1: 4px;
    --spacing-2: 8px;
    --spacing-3: 12px;
    --spacing-4: 20px;
    --spacing-5: 32px;
    --spacing-6: 52px;
    --spacing-7: 84px;

    --radius-1: 6px;
    --radius-2: 8px;

    --time-slot-cell-size: 40px;

    --font-monospace: Consolas, monaco, monospace;
  }
</style>
