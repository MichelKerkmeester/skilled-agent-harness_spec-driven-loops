import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

const nodeRequire = createRequire(import.meta.url);
const { buildTrendFlatlineAdvisories, formatTrendAdvisoryEvent } = nodeRequire(
  '../../../deep-research/scripts/reduce-state.cjs',
) as {
  buildTrendFlatlineAdvisories: (config: unknown, histories: unknown, latest: unknown) => any[];
  formatTrendAdvisoryEvent: (event: unknown) => string;
};

// A novelty signal pinned flat at a HIGH value reads as full novelty but is inert —
// the exact failure that let a 20-iteration run be cited as "not exhausted" while every
// iteration self-reported newInfoRatio 1.0. The detector must escalate that case.
describe('newInfoRatio inertness detection', () => {
  const config = { trendFlatlineWindow: 5 };
  const latest = { timestamp: '2026-01-01T00:00:00Z', run: 5 };

  it('escalates a flat-HIGH newInfoRatio to a warning (inert novelty signal)', () => {
    const events = buildTrendFlatlineAdvisories(config, { newInfoRatio: [1, 1, 1, 1, 1] }, latest);
    const inert = events.find((e) => e.metric === 'newInfoRatio');
    expect(inert).toBeDefined();
    expect(inert.event).toBe('novelty_signal_inert');
    expect(inert.severity).toBe('warning');
    expect(inert.note).toMatch(/uninformative|untrustworthy/i);
    expect(formatTrendAdvisoryEvent(inert)).toMatch(/WARNING/);
  });

  it('leaves a flat-LOW newInfoRatio as a plain advisory (legitimate stuck-detection)', () => {
    const events = buildTrendFlatlineAdvisories(config, { newInfoRatio: [0, 0, 0, 0, 0] }, latest);
    const ev = events.find((e) => e.metric === 'newInfoRatio');
    expect(ev).toBeDefined();
    expect(ev.event).toBe('trend_flatline');
    expect(ev.severity).toBe('advisory');
  });

  it('does not fire when newInfoRatio actually varies', () => {
    const events = buildTrendFlatlineAdvisories(config, { newInfoRatio: [1, 0.5, 0.2, 0.8, 0.1] }, latest);
    expect(events.find((e) => e.metric === 'newInfoRatio')).toBeUndefined();
  });
});
