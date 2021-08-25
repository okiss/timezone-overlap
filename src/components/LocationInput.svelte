<script lang="ts">
  import { getTimezone, locationSearch } from '../api';

  import { debounce } from '../util';

  export let value = '';

  let suggestions: { name: string; id: string }[] = [];

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
  };
</script>

<input type="text" {value} on:input={debounce(searchLocation)} on:change={selectSuggestion(0)} />
<ul>
  {#each suggestions as { name }, index}
    <li on:click={selectSuggestion(index)}>{name}</li>
  {/each}
</ul>
