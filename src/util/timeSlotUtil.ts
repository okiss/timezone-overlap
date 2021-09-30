export const createTimeSlotArray = (startWorkingHour = 0, endWorkingHour = 0) =>
  new Array(24).fill(false).map((_, i) => i >= startWorkingHour && i < endWorkingHour);

export const countSlots = (slotList: boolean[]) => slotList.filter((slot) => slot).length;

export const mergeSlotLists = (listA: boolean[], listB: boolean[]): boolean[] => {
  if (listA.length !== listB.length) {
    throw new Error('Lists must be of equal lengths');
  }
  return listA.map((value, index) => value && listB[index]);
};

export const adjustSlotListToUTC = (slotList: boolean[], utcOffset: number) => {
  const offset = utcOffset > 0 ? utcOffset : utcOffset + slotList.length;
  return slotList.slice(offset).concat(slotList.slice(0, offset));
};

export const mergeSlotListsWithTimezones = (
  listA: boolean[],
  listB: boolean[],
  utcOffsetA: number,
  utcOffsetB: number
): boolean[] => {
  const adjustedA = adjustSlotListToUTC(listA, utcOffsetA);
  const adjustedB = adjustSlotListToUTC(listB, utcOffsetB);
  return mergeSlotLists(adjustedA, adjustedB);
};
