import {
  shiftSlots,
  countSlots,
  createTimeSlotArray,
  divideTimeSlots,
  mergeSlotLists,
  countOverlap,
  utcOffsetToSlotShift,
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
  expect(shiftSlots([false, true, false], 0)).toEqual([false, true, false]);
  expect(shiftSlots([false, true, false], 1)).toEqual([true, false, false]);
  expect(shiftSlots([false, true, false], -1)).toEqual([false, false, true]);
  expect(shiftSlots([true, false, false], 1)).toEqual([false, false, true]);
  expect(shiftSlots([false, false, true], -1)).toEqual([true, false, false]);

  expect(shiftSlots(createTimeSlotArray(9, 17), -4)).toEqual(createTimeSlotArray(13, 21));

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
  expect(shiftSlots(createTimeSlotArray(9, 17), -9)).toEqual(expected);
});

test('divideTimeSlots', () => {
  expect(divideTimeSlots([], 7)).toEqual([]);
  expect(divideTimeSlots([false, false], 1)).toEqual([false, false]);
  expect(divideTimeSlots([false], 2)).toEqual([false, false]);
  expect(divideTimeSlots([false, true], 2)).toEqual([false, false, true, true]);
  expect(divideTimeSlots([false, true, false], 2)).toEqual([
    false,
    false,
    true,
    true,
    false,
    false,
  ]);
});

test('utcOffsetToSlotShift', () => {
  expect(utcOffsetToSlotShift(0, 1)).toEqual(0);
  expect(utcOffsetToSlotShift(0, 4)).toEqual(0);
  expect(utcOffsetToSlotShift(60, 1)).toEqual(1);
  expect(utcOffsetToSlotShift(60, 4)).toEqual(4);
  expect(utcOffsetToSlotShift(90, 4)).toEqual(6);
  expect(utcOffsetToSlotShift(-90, 4)).toEqual(-6);
});

test('mergeSlotListsWithTimezones', () => {
  expect(countOverlap(createTimeSlotArray(), createTimeSlotArray(9, 17), 0, 0)).toEqual(0);
});
