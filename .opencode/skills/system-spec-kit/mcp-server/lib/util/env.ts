// -------------------------------------------------------------------
// MODULE: Bounded environment parsing
// -------------------------------------------------------------------

export function parseBoundedEnv(name: string, fallback: number, min: number, max: number): number {
  if (!Number.isFinite(fallback) || !Number.isFinite(min) || !Number.isFinite(max)) {
    throw new TypeError('parseBoundedEnv bounds must be finite numbers');
  }
  if (min > max) {
    throw new RangeError(`parseBoundedEnv min must be <= max for ${name}`);
  }

  const raw = process.env[name];
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  if (!Number.isInteger(parsed)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, parsed));
}
