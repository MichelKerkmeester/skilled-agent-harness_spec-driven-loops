export function status(enabled: boolean, count: number): string {
  if (enabled && count > 0) return "active";
  return "empty";
}
