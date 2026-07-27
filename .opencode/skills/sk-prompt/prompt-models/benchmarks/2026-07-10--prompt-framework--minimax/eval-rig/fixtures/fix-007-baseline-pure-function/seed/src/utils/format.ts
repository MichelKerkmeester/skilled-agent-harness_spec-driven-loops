const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

export function formatBytes(n: number): string {
  if (n === 0) return '0 B';

  const magnitude = Math.min(
    Math.floor(Math.log(Math.abs(n)) / Math.log(1000)),
    UNITS.length - 1
  );
  const value = n / Math.pow(1000, magnitude);

  return `${parseFloat(value.toFixed(1))} ${UNITS[magnitude]}`;
}
