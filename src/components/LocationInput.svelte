<script lang="ts">
  import { debounce } from '../util';

  export let value = '';

  let suggestions = [];

  const searchLocation = (e: any) => {
    const searchText: string = e.target.value;

    if (!searchText || searchText.length <= 2) return;
  };
</script>

<input type="text" {value} on:input={debounce(searchLocation)} />
