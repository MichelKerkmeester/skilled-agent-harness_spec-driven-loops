// Proves the deep-research-deltas projection surface fans ledger events out
// into one per-iteration delta file whose rows match the exact shape the real
// consumer (verify-iteration) reads. The load-bearing check is not
// self-consistency of the fold but that the REAL consumer reads the projected
// files without corruption and accepts the iteration record. The
// negative-control toggle proves the fan-out assertion can go red.

import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  readFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  createDeepResearchDeltasProjectionContract,
  foldLegacyProjectionSurface,
} from '../../lib/legacy-projections/index.js';

import type { EventReadResult, JsonObject } from '../../lib/event-envelope/index.js';

const require_ = createRequire(import.meta.url);
// The consumer is shipped as CommonJS; require it through createRequire so the
// projected files are exercised by the same code path the runtime uses.
const { verify } = require_('../../scripts/verify-iteration.cjs') as {
  verify: (
    loopType: string,
    artifactDir: string,
    iteration: number,
  ) => { ok: boolean; reason: string | null; detail: string };
};

const here = dirname(fileURLToPath(import.meta.url));
const runtimeRoot = resolve(here, '..', '..');
const CONTRACT_PATH = resolve(
  runtimeRoot, 'lib', 'legacy-projections', 'deep-research-deltas-contract.ts',
);
const TSX_BIN = resolve(runtimeRoot, 'node_modules', '.bin', 'tsx');

const FIXED_TS = '2026-08-23T00:00:00.000Z';
const TEST_LEDGER_ID = 'deep-research-ledger';
const GENESIS_HASH = '0'.repeat(64);

const fakeHead = Object.freeze({
  ledgerId: TEST_LEDGER_ID,
  sequence: 0,
  recordHash: GENESIS_HASH,
});

// A minimal event carrying only the fields the contract's reduce() reads:
// effective.envelope.{event_type, occurred_at, payload:{stem, scope, data}}.
function researchEvent(
  stem: string,
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  occurredAt: string = FIXED_TS,
): EventReadResult {
  return {
    effective: {
      envelope: {
        event_type: `deep-research.ledger.${stem.replace(/^deep_research\./, '').replace(/_/g, '-')}`,
        occurred_at: occurredAt,
        payload: { stem, scope, data },
      },
    },
  } as unknown as EventReadResult;
}

// Synthetic events spanning iterations 1 and 2 with iteration-completed stems.
// Iteration 1: a completed iteration with status 'complete'.
// Iteration 2: a completed iteration with status 'insight'.
// A non-delta-bearing stem (iteration_started) is included to prove it is
// ignored — only iteration_completed produces delta rows.
function deltaFixtureEvents(): EventReadResult[] {
  return [
    researchEvent(
      'deep_research.iteration_started',
      { runId: 'res-1', lineageId: 'lin-1', iteration: 1 },
      { focusRef: 'focus-1', stateTailDigest: 'd0', strategyDigest: 'd1', status: 'started' },
    ),
    researchEvent(
      'deep_research.iteration_completed',
      { runId: 'res-1', lineageId: 'lin-1', iteration: 1 },
      {
        status: 'complete',
        rawNewInfoRatio: 0.7,
        trustedEvidenceYield: 0.5,
        outputDigest: 'd2',
        ruledOutApproachRefs: [],
        nextFocusCausationId: 'cf-1',
      },
    ),
    researchEvent(
      'deep_research.iteration_completed',
      { runId: 'res-1', lineageId: 'lin-1', iteration: 2 },
      {
        status: 'insight',
        rawNewInfoRatio: 0.6,
        trustedEvidenceYield: 0.4,
        outputDigest: 'd3',
        ruledOutApproachRefs: ['approach-a'],
        nextFocusCausationId: 'cf-2',
      },
    ),
  ];
}

function decodeUtf8(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

function parseJsonl(bytes: Uint8Array): JsonObject[] {
  const text = decodeUtf8(bytes).trimEnd();
  if (text === '') return [];
  return text.split('\n').map((line) => JSON.parse(line) as JsonObject);
}

const scratchDirs: string[] = [];
afterEach(() => {
  while (scratchDirs.length > 0) {
    const dir = scratchDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
  delete process.env.DEEP_LOOP_LEDGER_BACKING_GATE;
});

// ───────────────────────────────────────────────────────────────────
// (a) FAN-OUT BYTE PROOF
// ───────────────────────────────────────────────────────────────────

describe('deep-research-deltas projection surface — fan-out byte proof', () => {
  it('fans out events into one jsonl artifact per iteration with only that iteration rows', () => {
    const surface = createDeepResearchDeltasProjectionContract();
    const events = deltaFixtureEvents();
    const folded = foldLegacyProjectionSurface(surface, events, fakeHead);

    // Two distinct iterations present (1 and 2) → exactly two artifacts.
    // The iteration_started event is ignored (not delta-bearing).
    expect(folded).toHaveLength(2);
    expect(folded[0].relativePath).toBe('research/deltas/iter-001.jsonl');
    expect(folded[1].relativePath).toBe('research/deltas/iter-002.jsonl');
    expect(folded[0].format).toBe('jsonl');
    expect(folded[1].format).toBe('jsonl');
    expect(folded[0].artifactId).toBe('research-deltas:iter-001');
    expect(folded[1].artifactId).toBe('research-deltas:iter-002');

    // Iteration 1 file: one iteration-completed row, iteration 1 only.
    const rows1 = parseJsonl(folded[0].bytes);
    expect(rows1).toHaveLength(1);
    expect(rows1.every((r) => r.run === 1)).toBe(true);
    expect(rows1[0]).toMatchObject({
      type: 'iteration',
      schemaVersion: 1,
      sessionId: 'res-1',
      parentSessionId: 'lin-1',
      run: 1,
      status: 'complete',
      newInfoRatio: 0.7,
      timestamp: FIXED_TS,
    });

    // Iteration 2 file: one iteration-completed row, iteration 2 only.
    const rows2 = parseJsonl(folded[1].bytes);
    expect(rows2).toHaveLength(1);
    expect(rows2[0].run).toBe(2);
    expect(rows2[0]).toMatchObject({
      type: 'iteration',
      run: 2,
      status: 'insight',
      newInfoRatio: 0.6,
    });
  });
});

// ───────────────────────────────────────────────────────────────────
// (b) REAL-CONSUMER PROOF
// ───────────────────────────────────────────────────────────────────

describe('deep-research-deltas projection surface — real-consumer proof', () => {
  it('produces delta files the real verify-iteration consumer reads without corruption and accepts', () => {
    const specFolder = mkdtempSync(join(tmpdir(), 'research-deltas-projection-'));
    scratchDirs.push(specFolder);
    const researchDir = join(specFolder, 'research');
    const deltasDir = join(researchDir, 'deltas');
    const iterationsDir = join(researchDir, 'iterations');
    mkdirSync(deltasDir, { recursive: true });
    mkdirSync(iterationsDir, { recursive: true });

    // Fold and write each artifact's bytes to the deltas directory.
    const surface = createDeepResearchDeltasProjectionContract();
    const folded = foldLegacyProjectionSurface(surface, deltaFixtureEvents(), fakeHead);
    for (const artifact of folded) {
      writeFileSync(join(deltasDir, basename(artifact.relativePath)), decodeUtf8(artifact.bytes));
    }

    // Write the minimal companion files verify-iteration requires:
    // 1. A non-empty narrative markdown per iteration (research has no
    //    verdict line requirement, unlike review).
    writeFileSync(
      join(iterationsDir, 'iteration-001.md'),
      '# Iteration 1\n\nResearch iteration 1 narrative.\n',
    );
    writeFileSync(
      join(iterationsDir, 'iteration-002.md'),
      '# Iteration 2\n\nResearch iteration 2 narrative.\n',
    );

    // 2. A state-log record per iteration with route-proof fields the
    //    consumer checks (mode, target_agent, agent_definition_loaded,
    //    resolved_route). The delta file itself only needs type:'iteration'.
    const stateRecord1 = {
      type: 'iteration',
      iteration: 1,
      mode: 'research',
      target_agent: 'deep-research',
      agent_definition_loaded: true,
      resolved_route: 'deep-research-leaf-1',
      timestamp: FIXED_TS,
    };
    const stateRecord2 = {
      type: 'iteration',
      iteration: 2,
      mode: 'research',
      target_agent: 'deep-research',
      agent_definition_loaded: true,
      resolved_route: 'deep-research-leaf-2',
      timestamp: FIXED_TS,
    };
    writeFileSync(
      join(researchDir, 'deep-research-state.jsonl'),
      `${JSON.stringify(stateRecord1)}\n${JSON.stringify(stateRecord2)}\n`,
    );

    // This proves delta-file consumption, not ledger backing: the fixture writes the
    // projection directly without a mode ledger, so disable the ledger-backing gate.
    process.env.DEEP_LOOP_LEDGER_BACKING_GATE = '0';
    // Run the REAL consumer against both iterations.
    const result1 = verify('research', researchDir, 1);
    const result2 = verify('research', researchDir, 2);

    // No corruption: the projected JSONL is well-formed and the consumer
    // accepts each iteration's delta file (at least one type:'iteration').
    expect(result1.ok).toBe(true);
    expect(result1.reason).toBeNull();
    expect(result2.ok).toBe(true);
    expect(result2.reason).toBeNull();
  });
});

// ───────────────────────────────────────────────────────────────────
// (c) NEGATIVE CONTROL
// ───────────────────────────────────────────────────────────────────

// The helper runs in a fresh tsx subprocess so the flipped toggle is observed.
// It folds the same fixture events and reports the artifact count and whether
// the per-iteration partition is correct.
function writeNegControlHelper(helperPath: string): void {
  const helper = `import { createDeepResearchDeltasProjectionContract } from ${JSON.stringify(CONTRACT_PATH.replace(/\\.ts$/, '.js'))};
import { foldLegacyProjectionSurface } from ${JSON.stringify(resolve(runtimeRoot, 'lib', 'legacy-projections', 'legacy-projection-surface-fold.js'))};
import type { EventReadResult } from ${JSON.stringify(resolve(runtimeRoot, 'lib', 'event-envelope', 'index.js'))};
const TS = ${JSON.stringify(FIXED_TS)};
function ev(stem: string, scope: Record<string, unknown>, data: Record<string, unknown>): EventReadResult {
  return { effective: { envelope: { event_type: 'x', occurred_at: TS, payload: { stem, scope, data } } } } as unknown as EventReadResult;
}
const events: EventReadResult[] = [
  ev('deep_research.iteration_completed', { runId: 'r', lineageId: 'l', iteration: 1 }, { status: 'complete', rawNewInfoRatio: 0.7, trustedEvidenceYield: 0.5, outputDigest: 'd', ruledOutApproachRefs: [], nextFocusCausationId: 'c' }),
  ev('deep_research.iteration_completed', { runId: 'r', lineageId: 'l', iteration: 2 }, { status: 'insight', rawNewInfoRatio: 0.6, trustedEvidenceYield: 0.4, outputDigest: 'd', ruledOutApproachRefs: [], nextFocusCausationId: 'c' }),
];
const surface = createDeepResearchDeltasProjectionContract();
const head = { ledgerId: 'deep-research-ledger', sequence: 0, recordHash: '0'.repeat(64) };
const folded = foldLegacyProjectionSurface(surface, events, head as any);
const artifactCount = folded.length;
const paths = folded.map((a) => a.relativePath);
const iter1Rows = folded.find((a) => a.relativePath === 'research/deltas/iter-001.jsonl');
const iter1RowCount = iter1Rows ? new TextDecoder().decode(iter1Rows.bytes).trimEnd().split('\\n').length : 0;
process.stdout.write(JSON.stringify({ artifactCount, paths, iter1RowCount }));
`;
  writeFileSync(helperPath, helper);
}

interface NegControlCounts {
  readonly artifactCount: number;
  readonly paths: readonly string[];
  readonly iter1RowCount: number;
}

describe('deep-research-deltas projection surface — negative control', () => {
  it('flips the contract toggle GREEN->RED->RESTORE and prints all three states', () => {
    // Sanity: the contract starts in the production (true) state.
    const before = readFileSync(CONTRACT_PATH, 'utf8');
    expect(before).toContain('const PARTITION_BY_ITERATION = true;');

    const tmp = mkdtempSync(join(tmpdir(), 'research-deltas-negctl-'));
    scratchDirs.push(tmp);
    const helperPath = join(tmp, 'neg-control-helper.ts');
    writeNegControlHelper(helperPath);

    // One bash invocation runs the whole GREEN -> RED -> RESTORE sequence.
    // The RESTORE is performed BY the trap on EXIT/INT/TERM (not by an
    // explicit sed before exit), so the source is restored even if the
    // RED run is interrupted. All paths are absolute.
    const script = [
      `set -e`,
      `CONTRACT=${JSON.stringify(CONTRACT_PATH)}`,
      `HELPER=${JSON.stringify(helperPath)}`,
      `TSX=${JSON.stringify(TSX_BIN)}`,
      `run() { "$TSX" "$HELPER"; }`,
      `FLIP_FALSE="s/^const PARTITION_BY_ITERATION = true;\\$/const PARTITION_BY_ITERATION = false;/"`,
      `FLIP_TRUE="s/^const PARTITION_BY_ITERATION = false;\\$/const PARTITION_BY_ITERATION = true;/"`,
      `echo "GREEN: $(run)"`,
      `trap 'sed -i "" "$FLIP_TRUE" "$CONTRACT"; echo "RESTORE: $(run)"' EXIT INT TERM`,
      `sed -i '' "$FLIP_FALSE" "$CONTRACT"`,
      `echo "RED: $(run)"`,
    ].join('\n');

    let stdout: string;
    try {
      stdout = execFileSync('bash', ['-c', script], { cwd: runtimeRoot, encoding: 'utf8' });
    } finally {
      // Belt-and-suspenders: ensure the contract is restored even if the
      // bash invocation itself failed before the trap could fire.
      const afterAttempt = readFileSync(CONTRACT_PATH, 'utf8');
      if (afterAttempt.includes('const PARTITION_BY_ITERATION = false;')) {
        const restored = afterAttempt.replace(
          'const PARTITION_BY_ITERATION = false;',
          'const PARTITION_BY_ITERATION = true;',
        );
        writeFileSync(CONTRACT_PATH, restored);
      }
    }

    const lines = stdout.split('\n').filter((l) => l.length > 0);
    const greenLine = lines.find((l) => l.startsWith('GREEN: '));
    const redLine = lines.find((l) => l.startsWith('RED: '));
    const restoreLine = lines.find((l) => l.startsWith('RESTORE: '));

    // Print all three states for visibility.
    for (const l of lines) {
      process.stdout.write(`${l}\n`);
    }

    expect(greenLine).toBeDefined();
    expect(redLine).toBeDefined();
    expect(restoreLine).toBeDefined();

    const green = JSON.parse(greenLine!.slice('GREEN: '.length)) as NegControlCounts;
    const red = JSON.parse(redLine!.slice('RED: '.length)) as NegControlCounts;
    const restore = JSON.parse(restoreLine!.slice('RESTORE: '.length)) as NegControlCounts;

    // GREEN: two iterations partition into two artifacts at the correct paths.
    expect(green.artifactCount).toBe(2);
    expect(green.paths).toEqual([
      'research/deltas/iter-001.jsonl',
      'research/deltas/iter-002.jsonl',
    ]);
    expect(green.iter1RowCount).toBe(1);

    // RED: the toggle collapsed all events into a single iter-001 artifact,
    // so the fan-out assertion that would have passed green now fails —
    // one artifact instead of two, and iter-001 carries both iterations'
    // rows instead of only its own.
    expect(red.artifactCount).toBe(1);
    expect(red.paths).toEqual(['research/deltas/iter-001.jsonl']);
    expect(red.iter1RowCount).toBe(2);

    // RESTORE: the trap restored the toggle and the partition returns.
    expect(restore.artifactCount).toBe(2);
    expect(restore.paths).toEqual([
      'research/deltas/iter-001.jsonl',
      'research/deltas/iter-002.jsonl',
    ]);
    expect(restore.iter1RowCount).toBe(1);

    // Final-state proof: the contract source is back to the production
    // toggle value with no stray mutation.
    const after = readFileSync(CONTRACT_PATH, 'utf8');
    expect(after).toContain('const PARTITION_BY_ITERATION = true;');
    expect(after).not.toContain('const PARTITION_BY_ITERATION = false;');
    expect(after).toBe(before);
  });
});
