<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { locationSearch } from '../api';
  import { debounce } from '../util';
  import LoadingOverlay from './LoadingOverlay.svelte';

  export let isLoading = false;

  const dispatch = createEventDispatcher<string>();

  let value = '';
  let input: HTMLInputElement;
  let suggestions: { name: string; id: string }[] = [];
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
    } catch (error) {
      console.error(error);
    } finally {
      isLoadingSuggestions = false;
    }
  };

  const clear = () => {
    suggestions = [];
    selectedSuggestionIndex = -1;
    value = '';
    input.focus();
    dispatch('clear' as any);
  };

  const submit = async () => {
    if (selectedSuggestionIndex === -1) {
      console.debug('LocationInput: submit: no suggestion selected');
      return;
    }
    value = suggestions[selectedSuggestionIndex].name;
    input.blur();
    dispatch('submit' as any, suggestions[selectedSuggestionIndex].id);
  };

  const selectSuggestion = (index: number) => {
    selectedSuggestionIndex = index;
  };

  const selectAndSubmit = (index: number) => {
    selectSuggestion(index);
    submit();
  };

  const selectSuggestionArrowKeys = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      selectSuggestion(Math.min(selectedSuggestionIndex + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      selectSuggestion(Math.max(selectedSuggestionIndex - 1, 0));
    }
  };
</script>

<div class="location-input">
  <div class="input-wrapper" class:suggestions-visible={isFocused && suggestions.length}>
    <input
      class="input"
      placeholder="Location"
      type="text"
      {value}
      bind:this={input}
      on:keydown={selectSuggestionArrowKeys}
      on:input={debounce(searchLocation)}
      on:change={submit}
      on:focus={() => (isFocused = true)}
      on:blur={() => (isFocused = false)}
    />
    <button class="button" on:click={clear} title="Clear">{'\u00d7'}</button>
    <LoadingOverlay isLoading={isLoadingSuggestions || isLoading}>
      <button class="button" on:click={submit} disabled={selectedSuggestionIndex === -1}
        >Select</button
      >
    </LoadingOverlay>
  </div>
  <div class="suggestions-wrapper" class:suggestions-visible={isFocused && suggestions.length}>
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
    transition: filter 0.5s ease;
  }
  .input-wrapper:hover {
    filter: drop-shadow(0 0 12px rgba(0, 0, 0, 0.15));
  }
  .input-wrapper.suggestions-visible {
    border-radius: var(--radius-2) var(--radius-2) 0 0;
  }
  .input {
    flex: auto;
    border: none;
    border-radius: var(--radius-1);
    background-color: rgb(234, 234, 234);
    padding: var(--spacing-2);
    font-size: 100%;
    transition: background-color 0.3s ease;
  }
  .input:focus {
    outline: none;
    background-color: rgb(250, 250, 250);
  }
  .button {
    border: none;
    background: transparent;
    font-size: 100%;
    padding: var(--spacing-2) var(--spacing-2);
    transition: background-color 0.3s ease;
    border-radius: var(--radius-1);
    cursor: pointer;
  }
  .button:disabled {
    cursor: not-allowed;
  }
  .button:not(:disabled):hover {
    background-color: #ccc;
  }
  .suggestions-wrapper {
    position: relative;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }
  .suggestions-wrapper.suggestions-visible {
    opacity: 1;
    visibility: visible;
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
