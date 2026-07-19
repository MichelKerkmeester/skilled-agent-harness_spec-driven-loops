// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Metrics Stub
// ───────────────────────────────────────────────────────────────

export function isSpeckitMetricsEnabled(): boolean {
  return false;
}

export const speckitMetrics = {
  incrementCounter(_name: string, _labels?: Record<string, string>): void {},
  recordHistogram(_name: string, _value: number, _labels?: Record<string, string>): void {},
};
