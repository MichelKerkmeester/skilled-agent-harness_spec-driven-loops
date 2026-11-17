// Reads the hook's own default health records for 2026-11-13 and reports the
// observed hook latency and emitted bytes. Read-only: it never writes a record.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = '/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/speckit-skill-advisor-metrics';
const files = readdirSync(dir).filter((name) => name.endsWith('-diagnostics.jsonl'));
const records = [];
for (const name of files) {
  const lines = readFileSync(join(dir, name), 'utf8').split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const row = JSON.parse(line);
      if (typeof row.timestamp === 'string' && row.timestamp.startsWith('2026-11-13')) records.push(row);
    } catch {
      // A truncated tail line is not a record.
    }
  }
}

function percentile(values, ratio) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(ratio * sorted.length) - 1)];
}

function stats(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return {
    n: sorted.length,
    median: percentile(sorted, 0.5),
    p95: percentile(sorted, 0.95),
    p99: percentile(sorted, 0.99),
    max: sorted.length === 0 ? 0 : sorted[sorted.length - 1],
    min: sorted.length === 0 ? 0 : sorted[0],
  };
}

const byRuntime = {};
for (const row of records) {
  const key = String(row.runtime ?? 'unknown');
  byRuntime[key] = (byRuntime[key] ?? 0) + 1;
}

const cacheHits = records.filter((row) => row.cacheHit === true);
const cacheMisses = records.filter((row) => row.cacheHit !== true);
const durations = records.map((row) => Number(row.durationMs ?? 0)).filter(Number.isFinite);
const emitted = records.map((row) => Number(row.emittedBytes ?? 0)).filter(Number.isFinite);
const over = (limit) => durations.filter((value) => value > limit).length;

const summary = {
  files: files.length,
  records: records.length,
  byRuntime,
  statuses: records.reduce((acc, row) => {
    const key = String(row.status ?? 'unknown');
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {}),
  freshness: records.reduce((acc, row) => {
    const key = String(row.freshness ?? 'unknown');
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {}),
  cacheHitRate: records.length === 0 ? 0 : Number((cacheHits.length / records.length).toFixed(3)),
  durationMs: stats(durations),
  durationMsCacheMiss: stats(cacheMisses.map((row) => Number(row.durationMs ?? 0))),
  durationMsCacheHit: stats(cacheHits.map((row) => Number(row.durationMs ?? 0))),
  emittedBytes: stats(emitted),
  overBudget2500: over(2500),
  over1000ms: over(1000),
  zeroDuration: durations.filter((value) => value === 0).length,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
