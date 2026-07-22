/**
 * Number of nights between two dates, based on true elapsed time
 * (not calendar-day-of-month subtraction, which breaks across month
 * boundaries — e.g. Apr 28 → May 2 must be 4 nights, not -26).
 *
 * Returns a non-negative integer; a same-day or inverted range yields 0.
 */
export const nightsBetween = (
  start: Date | string | number,
  end: Date | string | number,
): number => {
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();

  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return 0;

  const nights = Math.round((endMs - startMs) / (1000 * 60 * 60 * 24));
  return Math.max(0, nights);
};
