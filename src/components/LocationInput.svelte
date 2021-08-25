<script lang="ts">
  import { getTimezone, locationSearch } from '../api';

  import { debounce } from '../util';

  export let value = '';

  let input: HTMLInputElement;
  let suggestions: { name: string; id: string }[] = [];
  let suggestionsVisiblity = false;

  const searchLocation = async (e: any) => {
    const searchText: string = e.target.value;

    if (!searchText || searchText.length <= 2) {
      suggestions = [];
      return;
    }

    try {
      suggestions = await locationSearch(searchText);
    } catch (error) {
      console.error(error);
    }
  };

  const selectSuggestion = (index: number) => async () => {
    const details = await getTimezone(suggestions[index].id);
    console.log(details);
    value = suggestions[index].name;
    suggestionsVisiblity = false;
    input.blur();
  };
</script>

<div>
  <div>
    <input
      type="text"
      {value}
      bind:this={input}
      on:input={debounce(searchLocation)}
      on:change={selectSuggestion(0)}
      on:focus={() => (suggestionsVisiblity = true)}
    />
    <button on:click={selectSuggestion(0)} disabled={suggestions.length === 0}>Set</button>
  </div>
  <div class:suggestionsVisible={suggestionsVisiblity}>
    <ul>
      {#each suggestions as { name, id }, index (id)}
        <li on:click={selectSuggestion(index)}>{name}</li>
      {/each}
    </ul>
  </div>
</div>
