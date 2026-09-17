// Proves the deep-improvement-ledgers projection surface folds ledger
// events into the TWO fixed improvement ledgers the real improvement
// reducer (deep-improvement/scripts/shared/reduce-state.cjs) reads: the
// scored-candidate state log and the lifecycle/stop journal. The
// load-bearing check is not self-consistency of the fold but that the
// REAL consumer reads both projected files without corruption and the
// derived registry reflects the folded candidates and journal events.
// The negative-control toggle proves the state-file assertion can go red.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  createDeepImprovementLedgersProjectionContract,
  foldLegacyProjectionSurface,
} from '../../lib/legacy-projections/index.js';

import type { EventReadResult, JsonObject } from '../../lib/event-envelope/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const runtimeRoot = resolve(here, '..', '..');
const REDUCE_SCRIPT = resolve(
  runtimeRoot, '..', 'deep-improvement', 'scripts', 'shared', 'reduce-state.cjs',
);
const CONTRACT_PATH = resolve(
  runtimeRoot, 'lib', 'legacy-projections', 'deep-improvement-ledgers-contract.ts',
);
const TSX_BIN = resolve(runtimeRoot, 'node_modules', '.bin', 'tsx');

const FIXED_TS = '2026-08-23T00:00:00.000Z';
const TEST_LEDGER_ID = 'deep-improvement-ledger';
const GENESIS_HASH = '0'.repeat(64);

const fakeHead = Object.freeze({
  ledgerId: TEST_LEDGER_ID,
  sequence: 0,
  recordHash: GENESIS_HASH,
});

// A minimal event carrying only the fields the contract's reduce() reads:
// effective.envelope.{event_type, occurred_at, payload:{stem, scope, data}}.
function improvementEvent(
  stem: string,
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  occurredAt: string = FIXED_TS,
): EventReadResult {
  return {
    effective: {
      envelope: {
        event_type: `deep-improvement-common.ledger.${stem.replace(/^deep_improvement_common\./, '').replaceAll('_', '-')}`,
        occurred_at: occurredAt,
        payload: { stem, scope, data },
      },
    },
  } as unknown as EventReadResult;
}

const baseScope = (candidateId: string) => ({
  runId: 'improve-1',
  lineageId: 'lineage-1',
  variant: 'agent-improvement',
  candidateId,
});

// Synthetic events spanning one run: a session_start, two scored candidates
// (one confirmed→accepted, one disputed→rejected), a canary gate pass, and
// a run completion. The state-bearing verdicts produce the scored rows the
// reducer counts; the journal-bearing lifecycle produces the audit events
// the reducer's journalSummary surfaces.
function fixtureEvents(): EventReadResult[] {
  return [
    improvementEvent(
      'deep_improvement_common.run_started',
      { runId: 'improve-1', lineageId: 'lineage-1', variant: 'agent-improvement' },
      { generation: 1, charterDigest: '0'.repeat(64), configDigest: '0'.repeat(64), operatorRef: 'op', serviceContractVersion: '1', replayFingerprint: '0'.repeat(64), maxIterations: 5 },
    ),
    improvementEvent(
      'deep_improvement_common.evaluation_verification_recorded',
      { ...baseScope('C001'), evaluationEpochId: 'epoch-1' },
      { requestEventId: 'E1', verifierRef: 'v', verificationOutcome: 'confirmed', verificationEvidenceRef: 'e', verificationEvidenceDigest: '0'.repeat(64), verificationReceiptRef: 'r' },
    ),
    improvementEvent(
      'deep_improvement_common.evaluation_verification_recorded',
      { ...baseScope('C002'), evaluationEpochId: 'epoch-2' },
      { requestEventId: 'E2', verifierRef: 'v', verificationOutcome: 'disputed', verificationEvidenceRef: 'e', verificationEvidenceDigest: '0'.repeat(64), verificationReceiptRef: 'r' },
    ),
    improvementEvent(
      'deep_improvement_common.canary_gate_passed',
      { ...baseScope('C001'), canaryEpochId: 'ce-1', canarySuiteId: 'cs-1' },
      { executionEventIds: [], evidenceSetDigest: '0'.repeat(64), policyVersion: '1', policyFingerprint: 'f', decisionReceiptRef: 'r' },
    ),
    improvementEvent(
      'deep_improvement_common.run_completed',
      { runId: 'improve-1', lineageId: 'lineage-1', variant: 'agent-improvement' },
      { terminalOutcome: 'completed', stopReason: 'converged', sessionOutcome: 'keptBaseline', finalLedgerTailHash: '0'.repeat(64), counts: { candidates: 2, evaluations: 2, observations: 0, canaryRuns: 1, promotions: 0 }, completionEvidenceRefs: [] },
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
});

describe('deep-improvement-ledgers projection surface — byte proof', () => {
  it('folds events into exactly two fixed artifacts at the two relativePaths the reducer reads', () => {
    const surface = createDeepImprovementLedgersProjectionContract();
    const folded = foldLegacyProjectionSurface(surface, fixtureEvents(), fakeHead);

    // Static multi-file surface: exactly two fixed artifacts, no fan-out.
    expect(folded).toHaveLength(2);

    const stateArtifact = folded.find((a) => a.artifactId === 'improvement-state');
    expect(stateArtifact).toBeDefined();
    expect(stateArtifact!.relativePath).toBe('improvement/agent-improvement-state.jsonl');
    expect(stateArtifact!.format).toBe('jsonl');

    const journalArtifact = folded.find((a) => a.artifactId === 'improvement-journal');
    expect(journalArtifact).toBeDefined();
    expect(journalArtifact!.relativePath).toBe('improvement/improvement-journal.jsonl');
    expect(journalArtifact!.format).toBe('jsonl');

    // State file: two scored-candidate rows — one accepted (confirmed
    // verdict), one rejected (disputed verdict). Each carries the
    // type/recommendation/mode/profileId vocabulary buildRegistry reads.
    const stateRows = parseJsonl(stateArtifact!.bytes);
    expect(stateRows).toHaveLength(2);
    const accepted = stateRows.filter((r) => r.type === 'accepted');
    const rejected = stateRows.filter((r) => r.type === 'rejected');
    expect(accepted).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect(accepted[0]).toMatchObject({ recommendation: 'candidate-better', mode: 'agent-improvement', profileId: 'C001' });
    expect(rejected[0]).toMatchObject({ recommendation: 'candidate-worse', mode: 'agent-improvement', profileId: 'C002' });

    // Journal file: three lifecycle/stop rows — session_start,
    // legal_stop_evaluated (canary gate pass), session_ended (run
    // completed with stopReason/sessionOutcome). Each carries the
    // eventType/timestamp/details vocabulary buildJournalSummary reads.
    const journalRows = parseJsonl(journalArtifact!.bytes);
    expect(journalRows).toHaveLength(3);
    const jTypes = journalRows.map((r) => r.eventType);
    expect(jTypes).toEqual(['session_start', 'legal_stop_evaluated', 'session_ended']);
    const endRow = journalRows.find((r) => r.eventType === 'session_ended') as JsonObject;
    expect((endRow.details as JsonObject).stopReason).toBe('converged');
    expect((endRow.details as JsonObject).sessionOutcome).toBe('keptBaseline');
    const legalRow = journalRows.find((r) => r.eventType === 'legal_stop_evaluated') as JsonObject;
    expect((legalRow.details as JsonObject).gateResults).toBeDefined();
  });
});

describe('deep-improvement-ledgers projection surface — real-consumer proof', () => {
  it('produces files the real improvement reducer reads without corruption and with the folded candidates/journal', () => {
    const specFolder = mkdtempSync(join(tmpdir(), 'improvement-ledgers-projection-'));
    scratchDirs.push(specFolder);

    // Fold and write each artifact's bytes at its spec-folder-relative
    // path (both files under <specFolder>/improvement/). The reducer's
    // runtimeRoot is the improvement directory itself.
    const surface = createDeepImprovementLedgersProjectionContract();
    const folded = foldLegacyProjectionSurface(surface, fixtureEvents(), fakeHead);
    for (const artifact of folded) {
      const outputPath = join(specFolder, artifact.relativePath);
      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(outputPath, decodeUtf8(artifact.bytes));
    }

    const runtimeRootArg = join(specFolder, 'improvement');
    const stdout = execFileSync('node', [REDUCE_SCRIPT, runtimeRootArg], {
      cwd: runtimeRoot,
      encoding: 'utf8',
    });
    const summary = JSON.parse(stdout.trim()) as {
      totalRecords: number;
      corruptionCount: number;
      registryPath: string;
    };

    // No corruption: the projected JSONL is well-formed, so the reducer
    // reports a clean parse with zero corruption warnings.
    expect(summary.corruptionCount).toBe(0);

    // The two scored-candidate state rows are reflected as totalRecords.
    expect(summary.totalRecords).toBe(2);

    // The reducer's derived registry reflects the folded candidates and
    // journal events: one accepted and one rejected candidate, and the
    // three journal events surfaced in journalSummary.
    const registry = JSON.parse(readFileSync(summary.registryPath, 'utf8')) as {
      globalMetrics: { acceptedCount: number; rejectedCount: number };
      journalSummary: {
        totalEvents: number;
        eventTypeCounts: Record<string, number>;
        stopReason: string | null;
        sessionOutcome: string | null;
        latestLegalStop: { gateResults: Record<string, unknown> } | null;
      } | null;
    };
    expect(registry.globalMetrics.acceptedCount).toBe(1);
    expect(registry.globalMetrics.rejectedCount).toBe(1);
    expect(registry.journalSummary).not.toBeNull();
    expect(registry.journalSummary!.totalEvents).toBe(3);
    expect(registry.journalSummary!.eventTypeCounts).toEqual({
      legal_stop_evaluated: 1,
      session_ended: 1,
      session_start: 1,
    });
    // The folded run_completed row carried stopReason/sessionOutcome,
    // which the reducer's journalSummary surfaces.
    expect(registry.journalSummary!.stopReason).toBe('converged');
    expect(registry.journalSummary!.sessionOutcome).toBe('keptBaseline');
    // The folded canary_gate_passed row produced a legal_stop_evaluated
    // event whose gateResults the reducer's latestLegalStop retains.
    expect(registry.journalSummary!.latestLegalStop).not.toBeNull();
    expect(registry.journalSummary!.latestLegalStop!.gateResults.improvementGate).toBe('pass');
  });
});

// Negative-control proof: the contract carries a module-scope toggle
// (EMIT_SCORED_STATE_ROWS) that, when false, suppresses the scored-candidate
// verdict rows so the state file loses every accepted/rejected candidate.
// The proof flips the toggle in the contract source via a shell sed, runs
// the fold in a fresh subprocess (so the flip is observed), and restores
// the contract via a shell trap on EXIT/INT/TERM using ABSOLUTE paths — so
// the source is never left mutated even on interruption. All three states
// (GREEN, RED, RESTORE) are printed.
function writeNegControlHelper(helperPath: string): void {
  const helper = `import { createDeepImprovementLedgersProjectionContract } from ${JSON.stringify(CONTRACT_PATH.replace(/\.ts$/, '.js'))};
import { foldLegacyProjectionSurface } from ${JSON.stringify(resolve(runtimeRoot, 'lib', 'legacy-projections', 'legacy-projection-surface-fold.js'))};
import type { EventReadResult } from ${JSON.stringify(resolve(runtimeRoot, 'lib', 'event-envelope', 'index.js'))};
const TS = ${JSON.stringify(FIXED_TS)};
function ev(stem: string, scope: Record<string, unknown>, data: Record<string, unknown>): EventReadResult {
  return { effective: { envelope: { event_type: 'x', occurred_at: TS, payload: { stem, scope, data } } } } as unknown as EventReadResult;
}
const events: EventReadResult[] = [
  ev('deep_improvement_common.evaluation_verification_recorded', { runId:'r', lineageId:'l', variant:'agent-improvement', candidateId:'C001', evaluationEpochId:'e1' }, { verificationOutcome:'confirmed' }),
  ev('deep_improvement_common.evaluation_verification_recorded', { runId:'r', lineageId:'l', variant:'agent-improvement', candidateId:'C002', evaluationEpochId:'e2' }, { verificationOutcome:'disputed' }),
];
const surface = createDeepImprovementLedgersProjectionContract();
const head = { ledgerId: 'deep-improvement-ledger', sequence: 0, recordHash: '0'.repeat(64) };
const folded = foldLegacyProjectionSurface(surface, events, head as any);
function dec(b: Uint8Array): any[] { const t = new TextDecoder().decode(b).trimEnd(); return t === '' ? [] : t.split('\\n').map((l) => JSON.parse(l)); }
const state = folded.find((a) => a.artifactId === 'improvement-state')!;
const srows = dec(state.bytes);
const accepted = srows.filter((r) => r.type === 'accepted').length;
const rejected = srows.filter((r) => r.type === 'rejected').length;
process.stdout.write(JSON.stringify({ stateRows: srows.length, accepted, rejected }));
`;
  writeFileSync(helperPath, helper);
}

interface NegControlCounts {
  readonly stateRows: number;
  readonly accepted: number;
  readonly rejected: number;
}

describe('deep-improvement-ledgers projection surface — negative control', () => {
  it('flips the contract toggle GREEN->RED->RESTORE and prints all three states', () => {
    // Sanity: the contract starts in the production (true) state.
    const before = readFileSync(CONTRACT_PATH, 'utf8');
    expect(before).toContain('const EMIT_SCORED_STATE_ROWS = true;');

    const tmp = mkdtempSync(join(tmpdir(), 'improvement-ledgers-negctl-'));
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
      `FLIP_FALSE="s/^const EMIT_SCORED_STATE_ROWS = true;\\$/const EMIT_SCORED_STATE_ROWS = false;/"`,
      `FLIP_TRUE="s/^const EMIT_SCORED_STATE_ROWS = false;\\$/const EMIT_SCORED_STATE_ROWS = true;/"`,
      `echo "GREEN: $(run)"`,
      // Single-quoted trap body: stored literally and re-evaluated at fire
      // time, so the inner double quotes become real quotes and the JSON
      // the helper prints is not mangled by nested-quote escaping. The
      // restore is performed BY the trap on EXIT/INT/TERM (absolute paths),
      // so the contract source is never left mutated even on interruption.
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
      if (afterAttempt.includes('const EMIT_SCORED_STATE_ROWS = false;')) {
        const restored = afterAttempt.replace(
          'const EMIT_SCORED_STATE_ROWS = false;',
          'const EMIT_SCORED_STATE_ROWS = true;',
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

    // GREEN: the two scored-candidate verdicts fold into two state rows
    // (one accepted, one rejected).
    expect(green.stateRows).toBe(2);
    expect(green.accepted).toBe(1);
    expect(green.rejected).toBe(1);

    // RED: the toggle suppressed the scored rows, so the state file is
    // empty of accepted/rejected candidates — the assertion that would
    // have passed green now fails, proving the check can observe the fold.
    expect(red.stateRows).toBe(0);
    expect(red.accepted).toBe(0);
    expect(red.rejected).toBe(0);

    // RESTORE: the trap restored the toggle and the scored rows return.
    expect(restore.stateRows).toBe(2);
    expect(restore.accepted).toBe(1);
    expect(restore.rejected).toBe(1);

    // Final-state proof: the contract source is back to the production
    // toggle value with no stray mutation.
    const after = readFileSync(CONTRACT_PATH, 'utf8');
    expect(after).toContain('const EMIT_SCORED_STATE_ROWS = true;');
    expect(after).not.toContain('const EMIT_SCORED_STATE_ROWS = false;');
    expect(after).toBe(before);
  });
});
