function timeDifference(current, previous) {
  const milliSecondsPerMinute = 60 * 1000;
  const milliSecondsPerHour = milliSecondsPerMinute * 60;
  const milliSecondsPerDay = milliSecondsPerHour * 24;
  const milliSecondsPerMonth = milliSecondsPerDay * 30;
  const milliSecondsPerYear = milliSecondsPerDay * 365;

  const elapsed = current - previous;

  const pluralize = (num, word) => (num > 1 ? `${word}s` : word);

  if (elapsed < milliSecondsPerMinute / 3) {
    return 'just now';
  }

  if (elapsed < milliSecondsPerMinute) {
    return 'less than 1 minute ago';
  }

  if (elapsed < milliSecondsPerHour) {
    const minutes = Math.round(elapsed / milliSecondsPerMinute);
    return `${minutes} ${pluralize(minutes, 'minute')} ago`;
  }
  if (elapsed < milliSecondsPerDay) {
    const hours = Math.round(elapsed / milliSecondsPerHour);
    return `${hours} ${pluralize(hours, 'hour')} ago`;
  }
  if (elapsed < milliSecondsPerMonth) {
    const days = Math.round(elapsed / milliSecondsPerDay);
    return `${days} ${pluralize(days, 'day')} ago`;
  }
  if (elapsed < milliSecondsPerYear) {
    const months = Math.round(elapsed / milliSecondsPerMonth);
    return `${months} ${pluralize(months, 'month')} ago`;
  }
  const years = Math.round(elapsed / milliSecondsPerYear);
  return `${years} ${pluralize(years, 'year')} ago`;
}

export default function timeDifferenceForDate(date) {
  const now = new Date().getTime();
  const updated = new Date(date).getTime();
  return timeDifference(now, updated);
}
