/**
 * Shared Persian Date/Time Formatter (BUG-106)
 * Formats epoch milliseconds into a consistent Solar Hijri (fa-IR-u-ca-persian) date and 24-hour time string.
 */
export function getCurrentPersianDateTimeStr(nowMs: number = Date.now()): string {
  const d = new Date(Number.isFinite(nowMs) ? nowMs : Date.now());
  try {
    const datePart = d.toLocaleDateString('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const timePart = d.toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return `${datePart} - ${timePart}`;
  } catch {
    return d.toLocaleDateString('fa-IR');
  }
}
