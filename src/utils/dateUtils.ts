/**
 * Formats a date into a human-readable string (e.g., "Jan 01, 2025")
 * @param date - Date object or date string to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      throw new Error('Invalid date');
    }
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Formats a date into a time string (e.g., "14:30" or "2:30 PM")
 * @param date - Date object or date string to format
 * @param use24Hour - Whether to use 24-hour format (default: false)
 * @returns Formatted time string
 */
export function formatTime(date: Date | string, use24Hour: boolean = false): string {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      throw new Error('Invalid date');
    }
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: !use24Hour
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid time';
  }
}

/**
 * Formats a date and time into a complete timestamp
 * @param date - Date object or date string to format
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | string): string {
  try {
    return `${formatDate(date)} ${formatTime(date)}`;
  } catch (error) {
    console.error('Error formatting date and time:', error);
    return 'Invalid date/time';
  }
}
