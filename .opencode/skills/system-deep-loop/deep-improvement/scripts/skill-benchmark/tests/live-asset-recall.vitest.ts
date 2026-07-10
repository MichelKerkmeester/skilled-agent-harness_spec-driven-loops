import { describe, it, expect } from 'vitest';
import { resolve, join } from 'node:path';

const SB = resolve(__dirname, '..');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { scoreScenario } = require(join(SB, 'score-skill-benchmark.cjs'));

// Live mode reports references and assets on separate channels. The sk-doc gold
// authors an asset target in expected_resources; the live model correctly states
// that asset on its own `assets` channel. Recall must credit it, and live d1-intra
// must not be halved by an intent term the live prompt never asks for.
describe('live-mode scoring — asset recall fold + intent-drop', () => {
  it('credits a correctly-routed asset the model states on the assets channel', () => {
    const scenario = {
      scenarioId: 'AF-1', classKind: 'routing',
      expectedResources: ['assets/security_checklist.md'], negativeActivation: false,
    };
    const observed = {
      mode: 'live', parseable: true,
      observedResources: ['references/review_core.md'],
      observedAssets: ['assets/security_checklist.md'], missingResources: [],
    };
    const row = scoreScenario({ scenario, observed, traceMode: 'live' });
    expect(row.dims.d1intra.resourceRecall).toBe(1); // asset folded into recall
    expect(row.dims.d1intra.score).toBe(1);          // live d1-intra = resource recall
  });

  it('still scores 0 when the correct asset is absent from both channels', () => {
    const scenario = {
      scenarioId: 'AF-2', classKind: 'routing',
      expectedResources: ['assets/security_checklist.md'], negativeActivation: false,
    };
    const observed = {
      mode: 'live', parseable: true,
      observedResources: ['references/review_core.md'],
      observedAssets: ['assets/unrelated.md'], missingResources: [],
    };
    const row = scoreScenario({ scenario, observed, traceMode: 'live' });
    expect(row.dims.d1intra.resourceRecall).toBe(0);
    expect(row.dims.d1intra.score).toBe(0);
  });

  it('live d1-intra is resource-recall only (unobservable intent term dropped)', () => {
    const scenario = {
      scenarioId: 'AF-3', classKind: 'routing',
      expectedResources: ['references/a.md'], expectedIntent: 'SECURITY', negativeActivation: false,
    };
    const observed = {
      mode: 'live', parseable: true, observedIntents: [],
      observedResources: ['references/a.md'], observedAssets: [], missingResources: [],
    };
    const row = scoreScenario({ scenario, observed, traceMode: 'live' });
    expect(row.dims.d1intra.intentRecall).toBe(0); // model never emits the intent key
    expect(row.dims.d1intra.score).toBe(1);        // but full resource recall is credited
    expect(row.dims.d1intra.liveResourceOnly).toBe(true);
  });

  it('router tier keeps the intent+resource blend (no live carve-out)', () => {
    const scenario = {
      scenarioId: 'AF-4', classKind: 'routing',
      expectedResources: ['references/a.md'], expectedIntent: 'SECURITY', negativeActivation: false,
    };
    const observed = {
      mode: 'router', parseable: true, observedIntents: [],
      observedResources: ['references/a.md'], missingResources: [],
    };
    const row = scoreScenario({ scenario, observed, traceMode: 'router' });
    expect(row.dims.d1intra.score).toBeCloseTo(0.6, 5); // 0.4*0 + 0.6*1
    expect(row.dims.d1intra.liveResourceOnly).toBeUndefined();
  });

  it('does not fold assets in router tier (D3 waste artifact stays fixed there)', () => {
    const scenario = {
      scenarioId: 'AF-5', classKind: 'routing',
      expectedResources: ['assets/security_checklist.md'], negativeActivation: false,
    };
    const observed = {
      mode: 'router', parseable: true,
      observedResources: ['references/review_core.md'],
      observedAssets: ['assets/security_checklist.md'], missingResources: [],
    };
    const row = scoreScenario({ scenario, observed, traceMode: 'router' });
    // router tier compares against observedResources only — asset stays on its lane
    expect(row.dims.d1intra.resourceRecall).toBe(0);
  });
});
