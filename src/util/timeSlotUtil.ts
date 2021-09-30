export const createTimeSlotArray = (startWorkingHour = 0, endWorkingHour = 0) =>
  new Array(24).fill(false).map((_, i) => i >= startWorkingHour && i < endWorkingHour);

export const countSlots = (slotList: boolean[]) => slotList.filter((slot) => slot).length;

export const mergeSlotLists = (listA: boolean[], listB: boolean[]): boolean[] => {
  if (listA.length !== listB.length) {
    throw new Error('Lists must be of equal lengths');
  }
  return listA.map((value, index) => value && listB[index]);
};

export const shiftSlots = (slotList: boolean[], offset: number) => {
  const adjustedOffset = offset > 0 ? offset : offset + slotList.length;
  return slotList.slice(adjustedOffset).concat(slotList.slice(0, adjustedOffset));
};

export const divideTimeSlots = (slotList: boolean[], factor: number) =>
  new Array(slotList.length * factor).fill(false).map((_, i) => slotList[Math.floor(i / factor)]);

export const utcOffsetToSlotShift = (utcOffsetMinutes: number, precision: number) =>
  Math.floor(utcOffsetMinutes / (60 / precision));

export const countOverlap = (
  slotsA: boolean[],
  slotsB: boolean[],
  utcOffsetMinutesA: number,
  utcOffsetMinutesB: number,
  precision = 4
) => {
  const dividedSlotsA = divideTimeSlots(slotsA, precision);
  const dividedSlotsB = divideTimeSlots(slotsB, precision);

  const offsetAInSlots = utcOffsetToSlotShift(utcOffsetMinutesA, precision);
  const offsetBInSlots = utcOffsetToSlotShift(utcOffsetMinutesB, precision);

  const adjustedA = shiftSlots(dividedSlotsA, offsetAInSlots);
  const adjustedB = shiftSlots(dividedSlotsB, offsetBInSlots);

  const overlapInSlots = countSlots(mergeSlotLists(adjustedA, adjustedB));
  const overlapInHours = overlapInSlots / precision;

  return overlapInHours;
};
