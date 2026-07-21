// ───────────────────────────────────────────────────────────────────
// MODULE: Mixed-Version Fixture Tests
// ───────────────────────────────────────────────────────────────────

import { readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  CompatibilityError,
  CompatibilityErrorCodes,
  StateUpcasterRegistry,
} from '../../lib/compatibility-shadow/index.js';
import {
  MIXED_VERSION_SCENARIOS,
  MixedVersionCompatibilityAdapter,
  MixedVersionFixtureError,
  MixedVersionFixtureErrorCodes,
  PHASE_013_WORKSTREAMS,
  assertResumeClassification,
  assertManifestWorkstreamCoverage,
  compileMixedVersionCase,
  createFrozenInflightResumeClassifier,
  createMixedVersionCompatibilityAdapter,
  createMixedVersionCorpus,
  createMixedVersionEventDefinition,
  createMixedVersionStateDefinition,
  replaceCapsuleReference,
  runMixedVersionOracle,
  verifyCompiledMixedVersionCase,
} from '../../lib/mixed-version-fixtures/index.js';
import { EventTypeRegistry, canonicalJson } from '../../lib/event-envelope/index.js';
import { SealedArtifactStore } from '../../lib/sealed-reference-artifacts/index.js';

import type { StateRecordTypeDefinition } from '../../lib/compatibility-shadow/index.js';
import type {
  MixedVersionCase,
  MixedVersionReducerExecutor,
  MixedVersionReducerObservation,
  MixedVersionRestartMetadata,
  MixedVersionResumeClassifierConfig,
  MixedVersionScenarioFamily,
} from '../../lib/mixed-version-fixtures/index.js';

const TEST_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = resolve(TEST_DIRECTORY, '../../../../../..');
const PHASE_TREE_PATH = join(
  REPOSITORY_ROOT,
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json',
);
const CENSUS_PATH = join(
  REPOSITORY_ROOT,
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation',
  '003-baseline-taxonomy-and-state-census/state-backend-census.json',
);
const TEMPORARY_ROOTS: string[] = [];

const EXPECTED_BY_SCENARIO: Readonly<
  Record<MixedVersionScenarioFamily, MixedVersionReducerObservation>
> = Object.freeze({
  'pure-old': {
    acceptedEventIds: ['pure-old-event-1'],
    rejectedEventIds: [],
    stateTransitions: [{ from: 'seed', eventId: 'pure-old-event-1', to: 'complete' }],
    terminalResult: 'complete',
    pendingEffects: [],
    receipts: ['receipt-control'],
    effectExecutions: [],
    outputArtifacts: ['legacy-mode-output'],
    resumeClassification: null,
  },
  'pure-new': {
    acceptedEventIds: ['pure-new-event-1'],
    rejectedEventIds: [],
    stateTransitions: [{ from: 'seed', eventId: 'pure-new-event-1', to: 'complete' }],
    terminalResult: 'complete',
    pendingEffects: [],
    receipts: ['receipt-control'],
    effectExecutions: [],
    outputArtifacts: ['legacy-mode-output'],
    resumeClassification: null,
  },
  'mid-upgrade': {
    acceptedEventIds: ['mid-upgrade-event-1', 'mid-upgrade-event-2'],
    rejectedEventIds: [],
    stateTransitions: [
      { from: 'seed', eventId: 'mid-upgrade-event-1', to: 'prepared' },
      { from: 'prepared', eventId: 'mid-upgrade-event-2', to: 'complete' },
    ],
    terminalResult: 'complete',
    pendingEffects: [],
    receipts: ['receipt-control'],
    effectExecutions: [],
    outputArtifacts: ['legacy-mode-output'],
    resumeClassification: null,
  },
  'interrupted-migration': {
    acceptedEventIds: ['interrupted-migration-event-1'],
    rejectedEventIds: [],
    stateTransitions: [
      { from: 'seed', eventId: 'interrupted-migration-event-1', to: 'paused' },
    ],
    terminalResult: 'blocked-for-classification',
    pendingEffects: ['effect-pending'],
    receipts: ['effect-accepted-receipt'],
    effectExecutions: ['effect-accepted'],
    outputArtifacts: ['legacy-mode-output'],
    resumeClassification: 'pin-legacy',
  },
});

function manifestWorkstreams(): readonly string[] {
  const manifest = JSON.parse(readFileSync(PHASE_TREE_PATH, 'utf8')) as {
    readonly mode_workstreams_phase_013: readonly string[];
  };
  return manifest.mode_workstreams_phase_013;
}

function temporaryStore(label: string): SealedArtifactStore {
  const root = join(tmpdir(), `mixed-version-${process.pid}-${label}-${TEMPORARY_ROOTS.length}`);
  TEMPORARY_ROOTS.push(root);
  return new SealedArtifactStore({ rootDirectory: root });
}

function fixtureFor(scenario: MixedVersionScenarioFamily): MixedVersionCase {
  const corpus = createMixedVersionCorpus(manifestWorkstreams());
  const fixture = corpus.cases.find((candidate) => (
    candidate.workstream === PHASE_013_WORKSTREAMS[0]
    && candidate.scenarioFamily === scenario
  ));
  if (!fixture) throw new Error(`Missing fixture ${scenario}`);
  return fixture;
}

const authoredReducer: MixedVersionReducerExecutor = ({ fixture }) => {
  const expected = EXPECTED_BY_SCENARIO[fixture.scenarioFamily];
  return JSON.parse(JSON.stringify(expected)) as MixedVersionReducerObservation;
};

function resumeClassifier(): MixedVersionResumeClassifierConfig {
  return {
    classificationId: 'mixed-version-interrupted-fixture',
    classifiedAt: '2026-07-21T00:00:00Z',
    classifierBuildId: 'mixed-version-fixture-harness',
    censusBytes: readFileSync(CENSUS_PATH),
    rowId: 'fanout-checkpoints',
  };
}

async function runFixture(
  scenario: MixedVersionScenarioFamily,
  executeLegacy: MixedVersionReducerExecutor = authoredReducer,
  executeDark: MixedVersionReducerExecutor = authoredReducer,
) {
  const fixture = fixtureFor(scenario);
  const store = temporaryStore(scenario);
  const compiled = await compileMixedVersionCase(store, fixture);
  return runMixedVersionOracle({
    store,
    compiled,
    compatibility: createMixedVersionCompatibilityAdapter(),
    executeLegacy,
    executeDark,
    resumeClassifier: scenario === 'interrupted-migration' ? resumeClassifier() : undefined,
    executionRoot: join(tmpdir(), 'mixed-version-execution'),
  });
}

afterEach(() => {
  while (TEMPORARY_ROOTS.length > 0) {
    const root = TEMPORARY_ROOTS.pop();
    if (root) rmSync(root, { recursive: true, force: true });
  }
});

describe('manifest-derived sealed corpus', () => {
  it('covers every workstream and scenario with common ordered before variants', () => {
    const workstreams = manifestWorkstreams();
    const corpus = createMixedVersionCorpus(workstreams);

    expect(workstreams).toEqual(PHASE_013_WORKSTREAMS);
    expect(corpus.cases).toHaveLength(32);
    expect(corpus.parityManifest.caseCount).toBe(32);
    for (const workstream of PHASE_013_WORKSTREAMS) {
      expect(corpus.cases.filter((fixture) => fixture.workstream === workstream)
        .map((fixture) => fixture.scenarioFamily)).toEqual(MIXED_VERSION_SCENARIOS);
    }
    expect(workstreams.indexOf('004-deep-improvement-common'))
      .toBeLessThan(workstreams.indexOf('005-agent-improvement'));
  });

  it('rejects a missing or reordered manifest row as coverage drift', () => {
    expect(() => assertManifestWorkstreamCoverage(manifestWorkstreams().slice(1)))
      .toThrowError(MixedVersionFixtureError);
    expect(() => assertManifestWorkstreamCoverage([...manifestWorkstreams()].reverse()))
      .toThrowError(MixedVersionFixtureError);
  });

  it('rejects fixture-time rebaselining even when a reducer would match it', async () => {
    const fixture = fixtureFor('pure-old');
    const forged = JSON.parse(JSON.stringify(fixture)) as MixedVersionCase;
    forged.expected.terminalResult = 'forged-result';

    await expect(compileMixedVersionCase(temporaryStore('rebaseline'), forged))
      .rejects.toMatchObject({ code: MixedVersionFixtureErrorCodes.FIXTURE_REBASELINE });
  });
});

describe('mixed-version compatibility and oracle', () => {
  it.each(MIXED_VERSION_SCENARIOS)('passes the authored %s fixture twice', async (scenario) => {
    await expect(runFixture(scenario)).resolves.toMatchObject({
      ok: true,
      deterministicRuns: 2,
      parityEligible: true,
      certificateEligible: true,
      authorityState: 'legacy_authoritative',
      authorityMutation: false,
    });
  });

  it('records event and state versions independently across all four pairs', () => {
    const corpus = createMixedVersionCorpus(manifestWorkstreams());
    const pairs = new Set(corpus.cases.flatMap((fixture) =>
      fixture.events.map((event) => `${event.storedVersion}:${fixture.stateVersion}`)));

    expect([...pairs].sort()).toEqual(['1:1', '1:3', '3:1', '3:3']);
    const fixture = JSON.parse(JSON.stringify(fixtureFor('pure-old'))) as MixedVersionCase;
    fixture.eventVersions = [3];
    expect(() => createMixedVersionCompatibilityAdapter().observe(fixture))
      .toThrowError(MixedVersionFixtureError);
  });

  it('uses exact adjacent hops and never downcasts the boundary write', () => {
    const observation = createMixedVersionCompatibilityAdapter().observe(fixtureFor('mid-upgrade'));

    expect(observation.eventHopTrace).toEqual([['1->2', '2->3'], []]);
    expect(observation.eventStoredVersions).toEqual([1, 3]);
    expect(observation.eventEffectiveVersions).toEqual([3, 3]);
    expect(observation.stateHopTrace).toEqual([]);
  });

  it('rejects an adjacent-chain gap through the frozen registry', () => {
    const definition = createMixedVersionStateDefinition();
    expect(() => new StateUpcasterRegistry([{
      ...definition,
      upcasters: [definition.upcasters[0]],
    }])).toThrowError(CompatibilityError);
    try {
      new StateUpcasterRegistry([{ ...definition, upcasters: [definition.upcasters[0]] }]);
    } catch (error: unknown) {
      expect((error as CompatibilityError).code)
        .toBe(CompatibilityErrorCodes.REGISTRY_UPCASTER_GAP);
    }
  });

  it('rejects lossy state output through the frozen registry', () => {
    const definition = createMixedVersionStateDefinition();
    const lossy: StateRecordTypeDefinition = {
      ...definition,
      upcasters: [{
        ...definition.upcasters[0],
        upcast: (record) => ({
          record: {
            ...record,
            stateVersion: 2,
            payload: { status: 'accepted' },
          },
          sourceFieldMap: {},
        }),
      }, definition.upcasters[1]],
    };
    expect(() => new StateUpcasterRegistry([lossy])).toThrowError(CompatibilityError);
  });

  it('blocks a tampered seal before either reducer path runs', async () => {
    const store = temporaryStore('seal-mismatch');
    const compiled = await compileMixedVersionCase(store, fixtureFor('pure-old'));
    const digest = '0'.repeat(64);
    const tampered = replaceCapsuleReference(compiled, {
      ...compiled.capsuleReference,
      content_digest: digest,
      qualified_digest: `sha256:${digest}`,
    });
    let pathRuns = 0;
    const execute: MixedVersionReducerExecutor = () => {
      pathRuns += 1;
      return EXPECTED_BY_SCENARIO['pure-old'];
    };
    const result = await runMixedVersionOracle({
      store,
      compiled: tampered,
      compatibility: createMixedVersionCompatibilityAdapter(),
      executeLegacy: execute,
      executeDark: execute,
      executionRoot: join(tmpdir(), 'mixed-version-execution'),
    });

    expect(result).toMatchObject({
      ok: false,
      code: MixedVersionFixtureErrorCodes.SEAL_VERIFICATION_FAILED,
      parityEligible: false,
      certificateEligible: false,
    });
    expect(pathRuns).toBe(0);
  });

  it('never publishes a partially sealed input capsule', async () => {
    const root = join(tmpdir(), `mixed-version-${process.pid}-partial-publication`);
    TEMPORARY_ROOTS.push(root);
    const store = new SealedArtifactStore({
      rootDirectory: root,
      faultInjection: {
        beforeReferencePublication: () => {
          throw new Error('injected publication stop');
        },
      },
    });

    await expect(compileMixedVersionCase(store, fixtureFor('pure-old'))).rejects.toThrow();
  });

  it('releases byte-identical data on repeated verified reads', async () => {
    const store = temporaryStore('repeat-read');
    const compiled = await compileMixedVersionCase(store, fixtureFor('pure-new'));
    const first = await verifyCompiledMixedVersionCase(store, compiled);
    const second = await verifyCompiledMixedVersionCase(store, compiled);

    expect(canonicalJson(first)).toBe(canonicalJson(second));
    expect(canonicalJson(first)).toBe(canonicalJson(fixtureFor('pure-new')));
  });

  it('seals replay-affecting environment as an independent ordered input', async () => {
    const store = temporaryStore('sealed-environment');
    const compiled = await compileMixedVersionCase(store, fixtureFor('pure-new'));

    expect(compiled.orderedInputs.map((input) => input.key)).toEqual([
      'case-envelope',
      'prompts',
      'initial-state',
      'configuration',
      'evaluator-material',
      'prior-outputs',
      'version-policy',
      'environment',
      'event-stream',
      'restart-metadata',
    ]);
    await expect(verifyCompiledMixedVersionCase(store, compiled)).resolves.toMatchObject({
      replayInputs: {
        environment: { timezone: 'UTC', locale: 'en-US', featureFlags: [] },
      },
    });
  });

  it('blocks a reducer divergence instead of rebaselining', async () => {
    const divergent: MixedVersionReducerExecutor = () => ({
      ...EXPECTED_BY_SCENARIO['pure-new'],
      terminalResult: 'different',
    });
    await expect(runFixture('pure-new', authoredReducer, divergent)).resolves.toMatchObject({
      ok: false,
      code: MixedVersionFixtureErrorCodes.REDUCER_DIVERGENCE,
      parityEligible: false,
    });
  });

  it('never exposes authored expectations to the implementation under test', async () => {
    let expectationWasVisible = false;
    const probingReducer: MixedVersionReducerExecutor = ({ fixture }) => {
      expectationWasVisible = Object.prototype.hasOwnProperty.call(fixture, 'expected');
      return EXPECTED_BY_SCENARIO[fixture.scenarioFamily];
    };

    await expect(runFixture('pure-new', probingReducer, probingReducer)).resolves.toMatchObject({
      ok: true,
      parityEligible: true,
    });
    expect(expectationWasVisible).toBe(false);
  });

  it('blocks a missing observation with no partial eligibility', async () => {
    const missing: MixedVersionReducerExecutor = () => {
      const { terminalResult: _terminalResult, ...partial } =
        EXPECTED_BY_SCENARIO['pure-new'];
      return partial as MixedVersionReducerObservation;
    };
    await expect(runFixture('pure-new', authoredReducer, missing)).resolves.toMatchObject({
      ok: false,
      code: MixedVersionFixtureErrorCodes.REDUCER_DIVERGENCE,
      parityEligible: false,
      certificateEligible: false,
    });
  });

  it('blocks a nondeterministic rerun with no partial eligibility', async () => {
    const nondeterministic: MixedVersionReducerExecutor = ({ fixture, runIndex }) => ({
      ...EXPECTED_BY_SCENARIO[fixture.scenarioFamily],
      terminalResult: runIndex === 1 ? 'complete' : 'changed',
    });
    await expect(runFixture('pure-new', nondeterministic, authoredReducer)).resolves.toMatchObject({
      ok: false,
      code: MixedVersionFixtureErrorCodes.NONDETERMINISTIC_RERUN,
      parityEligible: false,
      certificateEligible: false,
    });
  });

  it('blocks duplicated accepted effects during interrupted resume', async () => {
    const duplicate: MixedVersionReducerExecutor = () => ({
      ...EXPECTED_BY_SCENARIO['interrupted-migration'],
      effectExecutions: ['effect-accepted', 'effect-accepted'],
    });
    await expect(runFixture('interrupted-migration', duplicate, duplicate))
      .resolves.toMatchObject({
        ok: false,
        code: MixedVersionFixtureErrorCodes.DUPLICATE_EFFECT,
        parityEligible: false,
        certificateEligible: false,
      });
  });

  it('classifies declared restart evidence and rejects an authored divergence', () => {
    const restart = fixtureFor('interrupted-migration').replayInputs.restartMetadata;
    const classified = createFrozenInflightResumeClassifier(resumeClassifier(), restart)();

    expect(classified).toBe('pin-legacy');
    expect(() => assertResumeClassification('block', classified)).toThrowError(
      expect.objectContaining({ code: MixedVersionFixtureErrorCodes.RESUME_DIVERGENCE }),
    );

    const missingReceipt: MixedVersionRestartMetadata = {
      ...restart,
      receipts: [],
    };
    expect(createFrozenInflightResumeClassifier(resumeClassifier(), missingReceipt)())
      .toBe('block');
  });

  it('keeps shadow comparison additive-dark with isolated roots', async () => {
    const roots: string[] = [];
    const recordingReducer: MixedVersionReducerExecutor = (context) => {
      roots.push(`${context.path}:${context.executionRoot}`);
      return EXPECTED_BY_SCENARIO[context.fixture.scenarioFamily];
    };
    const result = await runFixture('mid-upgrade', recordingReducer, recordingReducer);

    expect(result).toMatchObject({
      ok: true,
      authorityState: 'legacy_authoritative',
      authorityMutation: false,
    });
    expect(new Set(roots.filter((entry) => entry.startsWith('legacy:'))).size).toBe(1);
    expect(new Set(roots.filter((entry) => entry.startsWith('dark:'))).size).toBe(1);
    expect(roots[0]).not.toBe(roots[1]);
  });

  it('rejects unsupported future event and old state pairs before reading', () => {
    const eventRegistry = new EventTypeRegistry([createMixedVersionEventDefinition()]);
    const stateRegistry = new StateUpcasterRegistry([createMixedVersionStateDefinition()]);
    const adapter = new MixedVersionCompatibilityAdapter(eventRegistry, stateRegistry);
    const fixture = JSON.parse(
      JSON.stringify(fixtureFor('interrupted-migration')),
    ) as MixedVersionCase;
    fixture.eventVersions = [4];
    fixture.events[0].storedVersion = 4;

    expect(() => adapter.observe(fixture)).toThrowError(MixedVersionFixtureError);
    try {
      adapter.observe(fixture);
    } catch (error: unknown) {
      expect((error as MixedVersionFixtureError).code)
        .toBe(MixedVersionFixtureErrorCodes.UNSUPPORTED_VERSION_PAIR);
    }
  });
});
