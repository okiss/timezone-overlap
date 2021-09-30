import {
  adjustSlotListToUTC,
  countSlots,
  createTimeSlotArray,
  mergeSlotLists,
  mergeSlotListsWithTimezones,
} from '../util/timeSlotUtil';

test('createTimeSlotArray: no arguments', () => {
  const result = createTimeSlotArray();
  expect(result.length).toBe(24);
  expect(result.every((value) => value === false)).toBe(true);
});

test('createTimeSlotArray: 9-17', () => {
  const result = createTimeSlotArray(9, 17);
  expect(result).toEqual([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
});

test('countSlots', () => {
  expect(countSlots([])).toBe(0);
  expect(countSlots([false])).toBe(0);
  expect(countSlots([true])).toBe(1);
  expect(countSlots([false, false])).toBe(0);
  expect(countSlots([false, true])).toBe(1);
  expect(countSlots([true, false])).toBe(1);
  expect(countSlots([true, true])).toBe(2);
  expect(countSlots([false, true, false])).toBe(1);
  expect(countSlots([true, false, true])).toBe(2);

  expect(countSlots(createTimeSlotArray())).toBe(0);
  expect(countSlots(createTimeSlotArray(9, 17))).toBe(8);
});

test('mergeSlotLists', () => {
  expect(mergeSlotLists([], [])).toEqual([]);
  expect(mergeSlotLists([false], [false])).toEqual([false]);
  expect(mergeSlotLists([false], [true])).toEqual([false]);
  expect(mergeSlotLists([true], [false])).toEqual([false]);
  expect(mergeSlotLists([true], [true])).toEqual([true]);
  expect(mergeSlotLists(createTimeSlotArray(), createTimeSlotArray())).toEqual(
    createTimeSlotArray()
  );
  expect(mergeSlotLists(createTimeSlotArray(), createTimeSlotArray(9, 17))).toEqual(
    createTimeSlotArray()
  );
  expect(mergeSlotLists(createTimeSlotArray(9, 17), createTimeSlotArray(9, 17))).toEqual(
    createTimeSlotArray(9, 17)
  );
  expect(() => mergeSlotLists([], [false])).toThrow('Lists must be of equal lengths');
});

test('adjustSlotListToUTC', () => {
  expect(adjustSlotListToUTC([false, true, false], 0)).toEqual([false, true, false]);
  expect(adjustSlotListToUTC([false, true, false], 1)).toEqual([true, false, false]);
  expect(adjustSlotListToUTC([false, true, false], -1)).toEqual([false, false, true]);
  expect(adjustSlotListToUTC([true, false, false], 1)).toEqual([false, false, true]);
  expect(adjustSlotListToUTC([false, false, true], -1)).toEqual([true, false, false]);

  expect(adjustSlotListToUTC(createTimeSlotArray(9, 17), -4)).toEqual(createTimeSlotArray(13, 21));

  const expected = [
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    true,
    true,
    true,
    true,
    true,
  ];
  expect(expected.length).toBe(24);
  expect(countSlots(expected)).toBe(8);
  expect(adjustSlotListToUTC(createTimeSlotArray(9, 17), -9)).toEqual(expected);
});

test('mergeSlotListsWithTimezones', () => {
  expect(
    mergeSlotListsWithTimezones(createTimeSlotArray(), createTimeSlotArray(9, 17), 0, 0)
  ).toEqual(createTimeSlotArray());

  expect(
    mergeSlotListsWithTimezones(createTimeSlotArray(4, 12), createTimeSlotArray(8, 16), -4, 0)
  ).toEqual(createTimeSlotArray(8, 16));

  expect(
    mergeSlotListsWithTimezones(createTimeSlotArray(9, 17), createTimeSlotArray(9, 17), 0, 0)
  ).toEqual(createTimeSlotArray(9, 17));

  expect(
    mergeSlotListsWithTimezones(createTimeSlotArray(9, 17), createTimeSlotArray(9, 17), 3, 3)
  ).toEqual(createTimeSlotArray(6, 14));

  expect(
    mergeSlotListsWithTimezones(createTimeSlotArray(9, 17), createTimeSlotArray(9, 17), 3, -3)
  ).toEqual(createTimeSlotArray(12, 14));
});
