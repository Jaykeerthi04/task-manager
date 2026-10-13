const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Whole days from today to the given date (negative = in the past). */
export function daysFromToday(iso: string): number {
  const diff = startOfDay(new Date(iso)).getTime() - startOfDay(new Date()).getTime();
  return Math.round(diff / MS_PER_DAY);
}

export function formatLongDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDueDate(iso: string): string {
  const days = daysFromToday(iso);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  return formatLongDate(new Date(iso));
}

export function isOverdue(iso: string, completed: boolean): boolean {
  return !completed && daysFromToday(iso) < 0;
}

export function todayLabel(): string {
  return new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
}
