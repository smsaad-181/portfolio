/**
 * Dates in content are "YYYY", "YYYY-MM" or "YYYY-MM-DD". A year-only value
 * (e.g. freelance work "2021 – 2025") is shown as just the year, so the site
 * never invents a month that the CV doesn't state.
 */

/** Accepted by the experience schema (a full ISO datetime is accepted too). */
export const DATE_PATTERN = /^\d{4}(-\d{2}(-\d{2}(T[\d:.]+Z?)?)?)?$/;

/** True for a real calendar date in one of the accepted formats
 * ("2025-13" or "2025-02-31" are rejected, so a bad save fails the build). */
export function isValidDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const [y = 0, m = 1, d = 1] = value.slice(0, 10).split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

/** "2021" → "2021"; "2025-01-14" → "Jan 2025". */
export function formatMonthYear(value: string): string {
  if (/^\d{4}$/.test(value)) return value;
  return new Date(value).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
}