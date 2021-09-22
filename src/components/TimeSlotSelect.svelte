<script lang="ts">
  import { createTimeSlotArray } from '../util/timeSlotUtil';
  export let startHour = 6;
  export let endHour = 22;
  export let mirrorLayout = false;
  export let value = createTimeSlotArray();

  let displayedHours = new Array<number>(1 + endHour - startHour)
    .fill(0)
    .map((_, index) => startHour + index);
  let isSelecting = false;
  let selectionInitialized = false;
  let selectionStartValue: boolean;

  const changeTimeSlotValue = (index: number, slotValue: boolean) => {
    value = [...value.slice(0, index), slotValue, ...value.slice(index + 1)];
  };

  const startDragSelection = (index: number) => () => {
    isSelecting = true;
    selectionInitialized = false;

    if (!selectionInitialized) {
      selectionStartValue = value[index];
      selectionInitialized = true;
    }

    changeTimeSlotValue(index, !selectionStartValue);
  };

  const endDragSelection = () => {
    isSelecting = false;
    selectionInitialized = false;
  };

  const dragEnterCell = (index: number) => () => {
    if (!isSelecting) return;

    if (value[index] === selectionStartValue) {
      changeTimeSlotValue(index, !selectionStartValue);
    } else {
      endDragSelection();
    }
  };

  const keyboardSelect = (index: number) => (e: any) => {
    if (e.key === 'Enter') {
      changeTimeSlotValue(index, !value[index]);
    }
  };
</script>

<div class="time-select" class:mirror={mirrorLayout}>
  <div class="hours">
    {#each displayedHours as hour}
      <div class="hour">
        {hour}
      </div>
    {/each}
  </div>
  <div
    class="slots"
    class:is-selecting={isSelecting}
    on:mouseup={endDragSelection}
    on:mouseleave={endDragSelection}
  >
    {#each value as slot, i}
      {#if i >= startHour && i < endHour}
        <button
          class="slot"
          class:selected={slot}
          tabindex="0"
          on:keydown={keyboardSelect(i)}
          on:mousedown={startDragSelection(i)}
          on:mouseenter={dragEnterCell(i)}
        />
      {/if}
    {/each}
  </div>
</div>

<style>
  .time-select {
    display: flex;
    flex-direction: column;
    padding-bottom: var(--spacing-1);
    gap: var(--spacing-2);
  }
  .time-select.mirror {
    flex-direction: column-reverse;
    padding-top: var(--spacing-1);
    padding-bottom: 0;
  }
  .hours {
    display: flex;
    flex-direction: row;
  }
  .hour {
    width: var(--time-slot-cell-size);
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    font-family: var(--font-monospace);
  }

  .slots {
    margin: 0 calc(var(--time-slot-cell-size) / 2);
    display: flex;
    flex-direction: row;
    filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.1));
  }
  .slot {
    width: var(--time-slot-cell-size);
    height: var(--time-slot-cell-size);
    background-color: #ddd;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .is-selecting .slot {
    cursor: ew-resize;
  }
  .slot:hover {
    background-color: #ccc;
  }
  .slot:first-child {
    border-radius: var(--radius-2) 0 0 var(--radius-2);
  }
  .slot:last-child {
    border-radius: 0 var(--radius-2) var(--radius-2) 0;
  }
  .slot:not(:last-child) {
    border-right: 1px solid var(--background);
  }
  .slot.selected {
    background-color: #f44;
  }
  .slot.selected:hover {
    background-color: #f00;
  }
</style>
