/**
 * Helper to format last modified date into a friendly Italian relative/formatted string.
 * @param {string | number | Date} dateInput
 * @returns {string}
 */
export function formatLastModified(dateInput) {
  if (!dateInput) return null;

  const d = new Date(dateInput);
  if (isNaN(d.getTime())) {
    return String(dateInput);
  }

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();

  // If date is in the future or system clock skew
  if (diffMs < 0) {
    const dateStr = d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
    return `Modificato il ${dateStr}`;
  }

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  const isSameDay = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (diffSec < 60) {
    return 'Modificato poco fa';
  }
  if (diffMin < 60) {
    return `Modificato ${diffMin} ${diffMin === 1 ? 'minuto' : 'minuti'} fa`;
  }
  if (isSameDay(d, now)) {
    const timeStr = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    return `Modificato oggi alle ${timeStr}`;
  }
  if (isSameDay(d, yesterday)) {
    const timeStr = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    return `Modificato ieri alle ${timeStr}`;
  }
  if (diffDays < 7) {
    return `Modificato ${diffDays} giorni fa`;
  }

  const dateStr = d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
  return `Modificato il ${dateStr}`;
}
