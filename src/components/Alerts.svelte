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
      <div class="alert-message">{alert.message}</div>
      <button class="close-button" on:click={() => removeAlert(id)}>{'\u00d7'}</button>
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
    align-items: flex-end;
  }
  .alert {
    width: 400px;
    display: flex;
    border-radius: var(--radius-1);
    transition: box-shadow 0.4s ease;
  }
  .alert-message {
    flex: auto;
    padding: var(--spacing-3) var(--spacing-4);
  }
  .close-button {
    flex: none;
    width: 40px;
    font-size: 16px;
    border-radius: 0 var(--radius-1) var(--radius-1) 0;
    background: none;
    border: none;
    cursor: pointer;
    background-color: #fff1;
    transition: background-color 0.4s ease;
  }
  .close-button:hover {
    background-color: #fff3;
  }
  .error {
    background-color: #ea868f;
    box-shadow: 0 0 12px #ea868f33;
  }
  .error:hover {
    box-shadow: 0 0 12px #ea868fcc;
  }
  .warning {
    background-color: #feb272;
    box-shadow: 0 0 12px #feb27233;
  }
  .warning:hover {
    box-shadow: 0 0 12px #feb272cc;
  }
  .success {
    background-color: #75b798;
    box-shadow: 0 0 12px #75b79833;
  }
  .success:hover {
    box-shadow: 0 0 12px #75b798cc;
  }
</style>
