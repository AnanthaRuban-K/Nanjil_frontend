const INDIA_TIME_ZONE = "Asia/Kolkata";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: INDIA_TIME_ZONE,
});

const timeFormatter = new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: INDIA_TIME_ZONE,
});

function formatDateParts(date: Date) {
  const parts = dateFormatter.formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value;

  return `${value("day")}-${value("month")}-${value("year")}`;
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "-";

  // Parse date-only database values without a timezone conversion.
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnly) {
    const [, year, month, day] = dateOnly;
    return `${day}-${month}-${year}`;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : formatDateParts(date);
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return `${formatDateParts(date)}, ${timeFormatter.format(date)}`;
}
