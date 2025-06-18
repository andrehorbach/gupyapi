export function truncateString(value: any, maxLength: number = 10000): any {
  if (typeof value === 'string' && value.length > maxLength) {
    return value.slice(0, maxLength) + '... [truncated]';
  } else if (Array.isArray(value)) {
    return value.map(item => truncateString(item, maxLength));
  } else if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, truncateString(val, maxLength)])
    );
  }
  return value;
}