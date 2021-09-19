<script lang="ts">
  import type { Alert, Location } from '../model';
  import { createEventDispatcher, getContext } from 'svelte';
  import { fade } from 'svelte/transition';
  import { locationSearch } from '../api';
  import { Context } from '../model';
  import { debounce } from '../util/debounce';
  import LoadingOverlay from './LoadingOverlay.svelte';

  export let isLoading = false;
  export let placeholder = 'Location';

  const dispatch = createEventDispatcher<Location>();
  const alert: (alert: Alert) => void = getContext(Context.ALERTS);
  const debouncedAlert = debounce(alert, 2000);

  let value = '';
  let input: HTMLInputElement;
  let suggestions: Location[] = [];
  let selectedSuggestionIndex = -1;
  let isFocused = false;
  let isLoadingSuggestions = false;

  const searchLocation = async (e: any) => {
    const searchText: string = e.target.value;

    selectedSuggestionIndex = -1;

    if (!searchText || searchText.length <= 2) {
      suggestions = [];
      return;
    }

    try {
      isLoadingSuggestions = true;
      suggestions = await locationSearch(searchText);
      if (suggestions.length) {
        selectedSuggestionIndex = 0;
      }
    } catch (error) {
      debouncedAlert({ type: 'error', message: 'Could not load suggestions' });
      console.error(error);
    } finally {
      isLoadingSuggestions = false;
    }
  };

  const clearInput = () => {
    value = '';
    suggestions = [];
    selectedSuggestionIndex = -1;
    input.focus();
    dispatch('clear' as any);
  };

  const submit = async () => {
    if (selectedSuggestionIndex === -1) {
      console.debug('LocationInput: submit: no suggestion selected');
      return;
    }
    value = suggestions[selectedSuggestionIndex].name;
    dispatch('submit' as any, suggestions[selectedSuggestionIndex]);
    input.blur();
  };

  const selectSuggestion = (index: number) => {
    selectedSuggestionIndex = index;
  };

  const selectAndSubmit = (index: number) => {
    selectSuggestion(index);
    submit();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      submit();
    } else if (e.key === 'Escape') {
      input.blur();
    } else if (e.key === 'ArrowDown') {
      selectSuggestion(Math.min(selectedSuggestionIndex + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp' && selectedSuggestionIndex !== -1) {
      selectSuggestion(Math.max(selectedSuggestionIndex - 1, 0));
    }
  };
</script>

<div class="location-input">
  <div class="input-wrapper" class:suggestions-visible={isFocused && suggestions.length}>
    <div class="input-clearable">
      <input
        class="input"
        {placeholder}
        type="text"
        bind:value
        bind:this={input}
        on:keydown={handleKeyDown}
        on:input={debounce(searchLocation)}
        on:focus={() => (isFocused = true)}
        on:blur={() => (isFocused = false)}
      />
      <button class="input-clear-button" on:click={clearInput} title="Clear" disabled={!value}
        >{'\u00d7'}</button
      >
    </div>
    <LoadingOverlay isLoading={isLoadingSuggestions || isLoading}>
      <button class="button" on:click={submit} disabled={selectedSuggestionIndex === -1}
        >Select</button
      >
    </LoadingOverlay>
  </div>
  {#if isFocused && suggestions.length}
    <div class="suggestions-wrapper" transition:fade={{ duration: 200 }}>
      <ul class="suggestions-list">
        {#each suggestions as { name, id }, index (id)}
          <li
            class="suggestion"
            class:selected={selectedSuggestionIndex === index}
            on:click={() => selectAndSubmit(index)}
            on:mouseenter={() => selectSuggestion(index)}
          >
            {name}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .location-input {
    width: 400px;
  }
  .input-wrapper {
    display: flex;
    background: #ddd;
    padding: var(--spacing-2);
    border-radius: var(--radius-2);
    filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.1));
    gap: var(--spacing-2);
  }
  .input-wrapper.suggestions-visible {
    border-radius: var(--radius-2) var(--radius-2) 0 0;
  }
  .input-clearable {
    flex: auto;
    position: relative;
  }
  .input {
    border: none;
    border-radius: var(--radius-1);
    background-color: rgb(245, 245, 245);
    padding: var(--spacing-2) var(--spacing-3);
    font-size: 100%;
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
    position: relative;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    box-shadow: none;
  }
  .input:focus {
    outline: none;
    background-color: rgb(255, 255, 255);
    box-shadow: 0 0 8px hsla(220, 100%, 50%, 0.5);
  }
  .input::placeholder {
    color: #222;
  }
  .input-clear-button {
    position: absolute;
    right: 0;
    top: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 100%;
    padding: var(--spacing-2) var(--spacing-3);
    opacity: 1;
    transition: opacity 0.2s ease;
  }
  .input-clear-button:disabled {
    opacity: 0;
    pointer-events: none;
  }
  .button {
    border: none;
    background: transparent;
    font-size: 100%;
    padding: var(--spacing-2) var(--spacing-2);
    transition: background-color 0.2s ease;
    border-radius: var(--radius-1);
    cursor: pointer;
  }
  .button:disabled {
    cursor: not-allowed;
    color: #444;
  }
  .button:not(:disabled):hover {
    background-color: #ccc;
  }
  .suggestions-wrapper {
    position: relative;
    z-index: 1;
  }
  .suggestions-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    position: absolute;
    left: 0;
    right: 0;
    background: white;
    border-radius: 0 0 var(--radius-2) var(--radius-2);
    filter: drop-shadow(0 0 16px rgba(0, 0, 0, 0.2));
  }
  .suggestion {
    padding: var(--spacing-3);
  }
  .suggestion:last-child {
    border-radius: 0 0 var(--radius-2) var(--radius-2);
  }
  .suggestion:not(:last-child) {
    border-bottom: 1px solid #ddd;
  }
  .suggestion.selected {
    background-color: #eee;
  }
</style>
