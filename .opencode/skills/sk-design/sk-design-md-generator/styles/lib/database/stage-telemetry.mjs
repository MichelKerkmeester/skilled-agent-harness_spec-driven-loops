// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Residency-Honest Stage Telemetry                                        ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// Every recorded stage is tagged with where its wall time was spent: `native`
// for work executed inside the node:sqlite / FTS5 boundary, `js-resident` for
// work executed on the JS heap and event loop (fs orchestration, JSON decode,
// cosine, sort, RRF, card assembly). There is no blended or opaque bucket — a
// record without a valid residency cannot be created.
//
// Attribution is measured, not assumed: the summary compares a real elapsed
// wall span (an explicit overall timer, or the first span start through the
// last span end) against the sum of the recorded span durations and reports the
// remainder as `unattributedMs`. Work that runs outside every span therefore
// surfaces honestly instead of being silently folded into a residency bucket.

import { performance } from 'node:perf_hooks';

export const RESIDENCY = Object.freeze({
  NATIVE: 'native',
  JS_RESIDENT: 'js-resident',
});

const RESIDENCY_VALUES = new Set(Object.values(RESIDENCY));

function assertResidency(residency) {
  if (!RESIDENCY_VALUES.has(residency)) {
    throw new TypeError(`Unknown telemetry residency: ${String(residency)}`);
  }
}

/**
 * Create a stage recorder with injectable clock and memory probes.
 *
 * @param {Object} [options] - Probe overrides for deterministic tests.
 * @param {Function} [options.now] - Monotonic millisecond clock.
 * @param {Function} [options.memory] - Resident-set byte probe.
 * @returns {Object} Recorder with span/record/overall/summary access.
 */
export function createStageRecorder({ now, memory } = {}) {
  const clock = typeof now === 'function' ? now : () => performance.now();
  const readRss = typeof memory === 'function' ? memory : () => process.memoryUsage().rss;
  const records = [];
  let firstStartedAt = null;
  let lastEndedAt = null;
  let rootStartedAt = null;
  let rootEndedAt = null;

  function observeWindow(startedAt, endedAt) {
    if (firstStartedAt === null || startedAt < firstStartedAt) firstStartedAt = startedAt;
    if (lastEndedAt === null || endedAt > lastEndedAt) lastEndedAt = endedAt;
  }

  function record(stage, residency, startedAt, startedRss, items = 0) {
    assertResidency(residency);
    const endedAt = clock();
    const latencyMs = endedAt - startedAt;
    const rssDeltaBytes = readRss() - startedRss;
    observeWindow(startedAt, endedAt);
    records.push(Object.freeze({
      stage,
      residency,
      latencyMs,
      items,
      throughputPerSecond: latencyMs > 0 ? (items / latencyMs) * 1_000 : null,
      rssDeltaBytes,
    }));
  }

  return {
    clock,
    memory: readRss,
    record,
    /**
     * Open a bracketed span; call `end(items)` once the stage work completes.
     *
     * @param {string} stage - Stage label.
     * @param {string} residency - `native` or `js-resident`.
     * @returns {{end: Function}} Span handle.
     */
    span(stage, residency) {
      assertResidency(residency);
      const startedAt = clock();
      const startedRss = readRss();
      return { end(items = 0) { record(stage, residency, startedAt, startedRss, items); } };
    },
    /**
     * Bracket the whole instrumented region so the summary can measure the wall
     * time that no individual span accounted for.
     *
     * @returns {{end: Function}} Overall-timer handle.
     */
    overall() {
      rootStartedAt = clock();
      return { end() { rootEndedAt = clock(); } };
    },
    records: () => records.slice(),
    /**
     * Decompose recorded latency into native and JS-resident buckets and report
     * the wall time that fell outside every span.
     *
     * @returns {Object} Bucketed totals plus measured elapsed and unattributed cost.
     */
    summary() {
      const buckets = { [RESIDENCY.NATIVE]: 0, [RESIDENCY.JS_RESIDENT]: 0 };
      let items = 0;
      for (const entry of records) {
        buckets[entry.residency] += entry.latencyMs;
        items += entry.items;
      }
      const native = buckets[RESIDENCY.NATIVE];
      const jsResident = buckets[RESIDENCY.JS_RESIDENT];
      const total = native + jsResident;
      const windowStart = rootStartedAt ?? firstStartedAt;
      const windowEnd = rootEndedAt ?? lastEndedAt;
      const elapsedMs = windowStart !== null && windowEnd !== null && windowEnd > windowStart
        ? windowEnd - windowStart
        : total;
      const unattributedMs = Math.max(0, elapsedMs - total);
      return {
        native,
        jsResident,
        total,
        elapsedMs,
        unattributedMs,
        stageCount: records.length,
        items,
      };
    },
  };
}
