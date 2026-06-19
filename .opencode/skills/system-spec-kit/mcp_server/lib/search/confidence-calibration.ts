// ───────────────────────────────────────────────────────────────
// MODULE: Confidence Calibration
// ───────────────────────────────────────────────────────────────
// Maps a raw per-result confidence value (0–1) onto an empirical
// P(relevant) using a monotonic calibration model fit from labeled
// query→memory relevance judgements.
//
// STATUS: UNVALIDATED INFRASTRUCTURE. The fitting and apply math here
// is exercised by tests, but no production-grade labeled set has been
// collected yet. The starter labeled set shipped alongside this module
// is a CORPUS-DERIVED PROXY (spec titles/keywords as queries, the spec's
// own memory as the positive), NOT human-judged live `memory_search`
// traffic. The real ~50–100 judged pairs from live traffic are the
// documented follow-up before any model here is trusted in ranking.
//
// Because of that, the wiring in confidence-scoring.ts keeps this OFF by
// default (SPECKIT_CONFIDENCE_CALIBRATION) and only applies a model when
// one is explicitly provided. Default behavior is unchanged.

import { readFileSync } from 'node:fs';

// -- Types --

/**
 * One labeled relevance judgement: did `memoryId` satisfy `query`?
 * `relevant` is the binary ground-truth label (1 = relevant, 0 = not).
 */
export interface LabeledPair {
  query: string;
  memoryId: number | string;
  relevant: 0 | 1;
}

export interface GradedLabeledPair {
  query: string;
  memoryId: number | string;
  relevance: number;
}

/**
 * One fitting sample: the model maps a pre-calibration confidence value
 * (`rawValue`, 0–1) onto the observed binary relevance label. Producing
 * these from a LabeledPair[] requires running search to obtain the
 * rawValue each query/memory pair scored — that join is the labeled-traffic
 * follow-up, not something this module can synthesize.
 */
export interface CalibrationSample {
  rawValue: number;
  relevant: 0 | 1;
}

/**
 * A fitted monotonic calibration curve. `points` are sorted by `x`
 * (rawValue) with non-decreasing `y` (P(relevant)); applyCalibration
 * interpolates between them. Kept as plain data so a model can be
 * serialized to JSON and reloaded without re-fitting.
 */
export interface CalibrationModel {
  method: 'isotonic';
  points: Array<{ x: number; y: number }>;
  /** Number of samples the model was fit from (provenance / sanity check). */
  fittedFrom: number;
}

// -- Helpers --

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

// -- Labeled-set loading --

/**
 * Validate and normalize a parsed labeled set into LabeledPair[].
 * Rejects malformed entries rather than silently coercing them, so a
 * bad labeled file fails loudly instead of fitting on garbage.
 */
export function loadLabeledSet(json: unknown): LabeledPair[] {
  if (!Array.isArray(json)) {
    throw new Error('labeled set must be a JSON array of {query, memoryId, relevant}');
  }
  return json.map((entry, i) => {
    if (!entry || typeof entry !== 'object') {
      throw new Error(`labeled set entry ${i} is not an object`);
    }
    const e = entry as Record<string, unknown>;
    const query = e.query;
    const memoryId = e.memoryId;
    const relevant = e.relevant;
    if (typeof query !== 'string' || query.trim().length === 0) {
      throw new Error(`labeled set entry ${i} has an invalid query`);
    }
    if (typeof memoryId !== 'string' && typeof memoryId !== 'number') {
      throw new Error(`labeled set entry ${i} has an invalid memoryId`);
    }
    if (relevant !== 0 && relevant !== 1) {
      throw new Error(`labeled set entry ${i} relevant must be 0 or 1`);
    }
    return { query, memoryId, relevant };
  });
}

export function binarizeGradedLabeledSet(
  json: unknown,
  relevanceThreshold: number = 2,
): LabeledPair[] {
  if (!Array.isArray(json)) {
    throw new Error('graded labeled set must be a JSON array of {query, memoryId, relevance}');
  }
  const threshold = Number.isFinite(relevanceThreshold) ? relevanceThreshold : 2;
  return json.map((entry, i) => {
    if (!entry || typeof entry !== 'object') {
      throw new Error(`graded labeled set entry ${i} is not an object`);
    }
    const e = entry as Record<string, unknown>;
    const query = e.query;
    const memoryId = e.memoryId;
    const relevance = e.relevance;
    if (typeof query !== 'string' || query.trim().length === 0) {
      throw new Error(`graded labeled set entry ${i} has an invalid query`);
    }
    if (typeof memoryId !== 'string' && typeof memoryId !== 'number') {
      throw new Error(`graded labeled set entry ${i} has an invalid memoryId`);
    }
    if (typeof relevance !== 'number' || !Number.isFinite(relevance)) {
      throw new Error(`graded labeled set entry ${i} has an invalid relevance`);
    }
    return {
      query,
      memoryId,
      relevant: relevance >= threshold ? 1 : 0,
    };
  });
}

/**
 * Read and parse a CalibrationModel from a JSON file path. Returns null
 * when the path is missing/unreadable or the contents are not a valid
 * model, so a misconfigured path degrades to a no-op rather than throwing
 * in the search hot path.
 */
export function loadCalibrationModel(path: string): CalibrationModel | null {
  let raw: string;
  try {
    raw = readFileSync(path, 'utf8');
  } catch {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object') return null;
  const m = parsed as Record<string, unknown>;
  if (m.method !== 'isotonic' || !Array.isArray(m.points)) return null;
  const points: Array<{ x: number; y: number }> = [];
  for (const p of m.points) {
    if (!p || typeof p !== 'object') return null;
    const x = (p as Record<string, unknown>).x;
    const y = (p as Record<string, unknown>).y;
    if (typeof x !== 'number' || typeof y !== 'number') return null;
    points.push({ x, y });
  }
  if (points.length === 0) return null;
  const fittedFrom = typeof m.fittedFrom === 'number' ? m.fittedFrom : points.length;
  return { method: 'isotonic', points, fittedFrom };
}

// -- Fitting --

/**
 * Fit an isotonic (monotonic non-decreasing) calibration curve via the
 * Pool Adjacent Violators algorithm (PAV). The result maps rawValue →
 * P(relevant) and is guaranteed non-decreasing, so a higher raw confidence
 * never calibrates to a lower probability.
 *
 * Each output point is a pooled block: x = mean rawValue of the block,
 * y = empirical relevance rate of the block. Ties in rawValue are merged
 * before pooling so the curve is well defined.
 */
export function fitCalibration(samples: CalibrationSample[]): CalibrationModel {
  const clean = samples
    .filter((s) => Number.isFinite(s.rawValue) && (s.relevant === 0 || s.relevant === 1))
    .map((s) => ({ x: clamp01(s.rawValue), y: s.relevant as number }))
    .sort((a, b) => a.x - b.x);

  if (clean.length === 0) {
    return { method: 'isotonic', points: [], fittedFrom: 0 };
  }

  // Each block tracks the pooled sum of x and y plus the sample count so a
  // merge is O(1). PAV merges left while the previous block's mean y is greater
  // than OR equal to the current block's mean y. The `>` case repairs a
  // monotonicity violation; the `===` case collapses adjacent equal-mean blocks
  // into one — pooling equal means leaves the mean (and therefore y) unchanged,
  // so it is purely a serialization-size reduction with no effect on the fitted
  // curve or its interpolation.
  interface Block {
    sumX: number;
    sumY: number;
    count: number;
  }
  const blocks: Block[] = [];
  for (const { x, y } of clean) {
    blocks.push({ sumX: x, sumY: y, count: 1 });
    while (blocks.length >= 2) {
      const curr = blocks[blocks.length - 1]!;
      const prev = blocks[blocks.length - 2]!;
      if (prev.sumY / prev.count < curr.sumY / curr.count) break;
      prev.sumX += curr.sumX;
      prev.sumY += curr.sumY;
      prev.count += curr.count;
      blocks.pop();
    }
  }

  const points = blocks.map((b) => ({
    x: b.sumX / b.count,
    y: clamp01(b.sumY / b.count),
  }));

  return { method: 'isotonic', points, fittedFrom: clean.length };
}

// -- Apply --

/**
 * Map a raw confidence value through the fitted curve via piecewise-linear
 * interpolation between pooled blocks. Values below the first / above the
 * last block clamp to that block's probability. Output is bounded to 0–1
 * and monotonic in `rawValue` (the points are non-decreasing in y).
 *
 * An empty model is the identity (returns the clamped rawValue), so an
 * unfit or degenerate model never distorts confidence.
 */
export function applyCalibration(model: CalibrationModel, rawValue: number): number {
  const x = clamp01(rawValue);
  const pts = model.points;
  if (pts.length === 0) return x;
  if (x <= pts[0]!.x) return clamp01(pts[0]!.y);
  const last = pts[pts.length - 1]!;
  if (x >= last.x) return clamp01(last.y);

  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]!;
    const b = pts[i + 1]!;
    if (x >= a.x && x <= b.x) {
      const span = b.x - a.x;
      if (span <= 0) return clamp01(b.y);
      const t = (x - a.x) / span;
      return clamp01(a.y + t * (b.y - a.y));
    }
  }
  return clamp01(last.y);
}
