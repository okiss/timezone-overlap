<script lang="ts">
  import type { Alert } from '../model';
  import { setContext } from 'svelte';
  import { fade } from 'svelte/transition';
  import { Context } from '../model';

  let alertList: { alert: Alert; id: string }[] = [];

  const removeAlert = (id: string) => {
    const alertIndex = alertList.findIndex((alert) => alert.id === id);
    if (alertIndex !== -1) {
      alertList = alertList.slice(0, alertIndex).concat(alertList.slice(alertIndex + 1));
    }
  };

  setContext(Context.ALERTS, (alert: Alert) => {
    const id = `${Date.now()}-${(Math.random() + 1) * 10}`;
    alertList = [{ id, alert }].concat(alertList);

    setTimeout(() => {
      removeAlert(id);
    }, 20_000);
  });
</script>

<slot />

<div class="alerts-container">
  {#each alertList as { alert, id } (id)}
    <div
      transition:fade
      class="alert"
      class:error={alert.type === 'error'}
      class:warning={alert.type === 'warning'}
      class:success={alert.type === 'success'}
    >
      {alert.message}
    </div>
  {/each}
</div>

<style>
  .alerts-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    padding: var(--spacing-4);
    align-items: center;
  }
  .alert {
    width: 400px;
    padding: var(--spacing-2);
    border-radius: var(--radius-1);
  }
  .error {
    background-color: pink;
  }
  .warning {
    background-color: sandybrown;
  }
  .success {
    background-color: seagreen;
  }
</style>
