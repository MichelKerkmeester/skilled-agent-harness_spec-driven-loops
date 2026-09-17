// Proves the deep-ai-council-config-state projection surface folds ledger
// events into the TWO ledger-derived .jsonl files the real council
// orchestrator reads: ai-council-state.jsonl (graph replay + completion
// advisor) and session-state.jsonl (round-state reader). The
// ai-council-config.json artifact is intentionally omitted — the ledger
// carries only digests of the config, not its content — and the test
// proves the consumer tolerates that gap. The negative-control toggle
// proves the state-file assertion can go red.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  createDeepAiCouncilConfigStateProjectionContract,
  foldLegacyProjectionSurface,
} from '../../lib/legacy-projections/index.js';

import type { EventReadResult, JsonObject } from '../../lib/event-envelope/index.js';

const require = createRequire(import.meta.url);

// Real consumers — required from their shipped .cjs modules so the proof
// runs against the actual orchestrator code, not a reimplementation.
const replayModule = require(
  join('..', '..', '..', 'deep-ai-council', 'scripts', 'replay-graph-from-artifacts.cjs'),
) as {
  derivePayload: (
    specFolder: string,
    sessionId: string,
    events: JsonObject[],
  ) => { nodes: JsonObject[]; edges: JsonObject[] };
  parseJsonl: (filePath: string) => JsonObject[];
};
const adviseModule = require(
  join('..', '..', '..', 'deep-ai-council', 'scripts', 'advise-council-completion.cjs'),
) as {
  collectAdvisories: (packetSpecFolder: string) => string[];
  collectSummary: (packetSpecFolder: string) => {
    artifact_written: number;
    rollback: number;
    artifact_superseded: number;
  };
};
const roundStateModule = require(
  join('..', '..', 'lib', 'council', 'round-state-jsonl.cjs'),
) as {
  readRoundStateRecords: (statePath: string, options?: { repair?: boolean }) => JsonObject[];
};

const here = dirname(fileURLToPath(import.meta.url));
const runtimeRoot = resolve(here, '..', '..');
const CONTRACT_PATH = resolve(
  runtimeRoot, 'lib', 'legacy-projections', 'deep-ai-council-config-state-contract.ts',
);
const TSX_BIN = resolve(runtimeRoot, 'node_modules', '.bin', 'tsx');

const FIXED_TS = '2026-08-23T00:00:00.000Z';
const TEST_LEDGER_ID = 'deep-ai-council-ledger';
const GENESIS_HASH = '0'.repeat(64);

const fakeHead = Object.freeze({
  ledgerId: TEST_LEDGER_ID,
  sequence: 0,
  recordHash: GENESIS_HASH,
});

// A minimal event carrying only the fields the contract's reduce() reads:
// effective.envelope.{event_type, occurred_at, payload:{stem, scope, data}}.
function councilEvent(
  stem: string,
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  occurredAt: string = FIXED_TS,
): EventReadResult {
  return {
    effective: {
      envelope: {
        event_type: `deep-ai-council.ledger.${stem.replace(/^ai_council\./, '').replaceAll('_', '-')}`,
        occurred_at: occurredAt,
        payload: { stem, scope, data },
      },
    },
  } as unknown as EventReadResult;
}

const runScope = (roundId: string) => ({
  runId: 'council-run-1',
  roundId,
});

const seatScope = (roundId: string, seatId: string) => ({
  runId: 'council-run-1',
  roundId,
  seatId,
});

// Synthetic events spanning one council run: a run initialization, one
// round with two seats returning, a deliberation synthesis, a round end,
// an artifact commit, and a council completion. The state-bearing stems
// produce the rows the graph replay derives nodes from; the
// council_complete row is the load-bearing terminal event the completion
// advisor checks for. The session-bearing stems produce the session
// lifecycle rows the round-state reader parses.
function fixtureEvents(): EventReadResult[] {
  return [
    councilEvent(
      'ai_council.run_initialized',
      { runId: 'council-run-1', roundId: 'round-001' },
      {
        target: { targetId: 't1', targetType: 'file', artifactRef: 'a1', targetVersion: '1', contentDigest: GENESIS_HASH },
        targetDigest: GENESIS_HASH,
        taskClass: 'code',
        configDigest: GENESIS_HASH,
        strategyDigest: GENESIS_HASH,
        convergencePolicyDigest: GENESIS_HASH,
        testGatePolicyDigest: GENESIS_HASH,
        maxRounds: 3,
        minSeatCount: 2,
        maxSeatCount: 5,
        planningOnly: true,
        initialReplayFingerprint: GENESIS_HASH,
      },
    ),
    councilEvent(
      'ai_council.round_started',
      runScope('round-001'),
      {
        roundNumber: 1,
        executorBoundaryRef: 'in-cli',
        seatRosterDigest: GENESIS_HASH,
        protocolVersion: '1',
        promptPackDigest: GENESIS_HASH,
        budgetRef: 'b1',
        priorRoundRef: null,
        exposurePolicyVersion: '1',
        informationSurface: {
          role: 'orchestrator',
          capabilityRefs: [],
          visibleDigests: [],
          generatorIdentityVisible: false,
          rationaleVisible: false,
          peerScoresVisible: false,
          voteCountsVisible: false,
          independentJudgmentsCommitted: true,
        },
      },
    ),
    councilEvent(
      'ai_council.seat_returned',
      seatScope('round-001', 'seat-001'),
      {
        targetVersion: '1',
        responseStatus: 'returned',
        proposalDigest: GENESIS_HASH,
        artifactRef: 'a1',
        artifactDigest: GENESIS_HASH,
        rawScores: { quality: 0.8, feasibility: 0.7, novelty: 0.6, risk: 0.3 },
        rawConfidence: 0.9,
        usage: { receiptRef: 'r1', inputTokens: 100, outputTokens: 200, costMicros: 50 },
        evidenceRefs: [],
        outputSchemaVersion: '1',
        observationDigest: GENESIS_HASH,
        informationSurface: {
          role: 'generator',
          capabilityRefs: [],
          visibleDigests: [],
          generatorIdentityVisible: false,
          rationaleVisible: false,
          peerScoresVisible: false,
          voteCountsVisible: false,
          independentJudgmentsCommitted: true,
        },
        failureReason: null,
        timeoutReason: null,
      },
    ),
    councilEvent(
      'ai_council.seat_returned',
      seatScope('round-001', 'seat-002'),
      {
        targetVersion: '1',
        responseStatus: 'returned',
        proposalDigest: GENESIS_HASH,
        artifactRef: 'a2',
        artifactDigest: GENESIS_HASH,
        rawScores: { quality: 0.7, feasibility: 0.8, novelty: 0.5, risk: 0.2 },
        rawConfidence: 0.85,
        usage: { receiptRef: 'r2', inputTokens: 120, outputTokens: 180, costMicros: 45 },
        evidenceRefs: [],
        outputSchemaVersion: '1',
        observationDigest: GENESIS_HASH,
        informationSurface: {
          role: 'generator',
          capabilityRefs: [],
          visibleDigests: [],
          generatorIdentityVisible: false,
          rationaleVisible: false,
          peerScoresVisible: false,
          voteCountsVisible: false,
          independentJudgmentsCommitted: true,
        },
        failureReason: null,
        timeoutReason: null,
      },
    ),
    councilEvent(
      'ai_council.deliberation_synthesized',
      runScope('round-001'),
      {
        inputEventRange: { firstEventId: 'e1', lastEventId: 'e4' },
        candidateSetDigest: GENESIS_HASH,
        planDisposition: 'selected',
        selectedPlanDigest: GENESIS_HASH,
        disagreementRefs: [],
        minorityRefs: [],
        synthesisPolicyFingerprint: GENESIS_HASH,
        evaluatorFingerprint: GENESIS_HASH,
        reportDraftRef: 'rd1',
        synthesisReceiptRef: 'sr1',
      },
    ),
    councilEvent(
      'ai_council.round_ended',
      runScope('round-001'),
      {
        roundStatus: 'complete',
        convergenceEventId: 'e5',
        acceptedCandidateRefs: [],
        rejectedCandidateRefs: [],
        unresolvedCandidateRefs: [],
        seatOutcomeCounts: { selected: 2, dispatched: 2, returned: 2, failed: 0, timedOut: 0 },
        lateResultDisposition: 'none',
        finalRoundTailDigest: GENESIS_HASH,
        continuationDecision: 'complete',
      },
    ),
    councilEvent(
      'ai_council.artifact_committed',
      { runId: 'council-run-1', roundId: 'round-001', artifactId: 'art-1' },
      {
        artifactKind: 'report',
        safeRelativePath: 'council-report.md',
        schemaVersion: '1',
        byteDigest: GENESIS_HASH,
        contentDigest: GENESIS_HASH,
        requiredSectionResults: [],
        sourceEventRange: { firstEventId: 'e1', lastEventId: 'e6' },
        supersedesArtifactId: null,
        rollbackRef: null,
      },
    ),
    councilEvent(
      'ai_council.council_complete',
      runScope('round-001'),
      {
        terminalStatus: 'completed',
        convergenceEventId: 'e5',
        finalDeliberationEventId: 'e5',
        artifactManifestRef: 'am1',
        councilTestGateEventId: 'tg1',
        finalLedgerTailDigest: GENESIS_HASH,
        counts: { rounds: 1, seats: 2, proposals: 2, judgments: 0 },
        recommendationOrUserDecisionRef: 'rec1',
        terminalReason: 'converged',
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
});

describe('deep-ai-council-config-state projection surface — byte proof', () => {
  it('folds events into exactly two .jsonl artifacts (no fabricated config.json) at the relativePaths the consumers read', () => {
    const surface = createDeepAiCouncilConfigStateProjectionContract();
    const folded = foldLegacyProjectionSurface(surface, fixtureEvents(), fakeHead);

    // The config.json artifact is omitted: the ledger carries only
    // digests of the config, not its content, so the surface folds only
    // the two ledger-derived .jsonl files.
    expect(folded).toHaveLength(2);

    const stateArtifact = folded.find((a) => a.artifactId === 'council-state');
    expect(stateArtifact).toBeDefined();
    expect(stateArtifact!.relativePath).toBe('ai-council/ai-council-state.jsonl');
    expect(stateArtifact!.format).toBe('jsonl');

    const sessionArtifact = folded.find((a) => a.artifactId === 'council-session-state');
    expect(sessionArtifact).toBeDefined();
    expect(sessionArtifact!.relativePath).toBe('ai-council/session-state.jsonl');
    expect(sessionArtifact!.format).toBe('jsonl');

    // State file: round_start, two seat_returned rows, deliberation_synthesized,
    // round_end, artifact_written, council_complete — seven rows carrying
    // the event/round/seat vocabulary the graph replay and advisor read.
    const stateRows = parseJsonl(stateArtifact!.bytes);
    expect(stateRows).toHaveLength(7);
    const stateEvents = stateRows.map((r) => r.event);
    expect(stateEvents).toEqual([
      'round_start',
      'seat_returned',
      'seat_returned',
      'deliberation_synthesized',
      'round_end',
      'artifact_written',
      'council_complete',
    ]);

    // The council_complete row is the terminal event the advisor checks for.
    const completeRow = stateRows.find((r) => r.event === 'council_complete') as JsonObject;
    expect(completeRow).toBeDefined();
    expect(completeRow.timestamp).toBe(FIXED_TS);

    // The artifact_written row carries the audit fields the advisor counts.
    const artifactRow = stateRows.find((r) => r.event === 'artifact_written') as JsonObject;
    expect(artifactRow.path).toBe('council-report.md');
    expect(artifactRow.checksum).toBe(`sha256:${GENESIS_HASH}`);

    // The seat_returned rows carry the round/seat/status vocabulary.
    const seatRows = stateRows.filter((r) => r.event === 'seat_returned');
    expect(seatRows).toHaveLength(2);
    expect(seatRows[0]).toMatchObject({ round: 1, seat: 'seat-001', status: 'ok' });
    expect(seatRows[1]).toMatchObject({ round: 1, seat: 'seat-002', status: 'ok' });

    // Session file: session_start, round_start, two seat_returned rows,
    // round_end, session_complete — six rows carrying the type/event
    // vocabulary the round-state reader parses. The deliberation and
    // artifact stems are state-bearing only, not session-bearing.
    const sessionRows = parseJsonl(sessionArtifact!.bytes);
    expect(sessionRows).toHaveLength(6);
    const sessionEvents = sessionRows.map((r) => r.event);
    expect(sessionEvents).toEqual([
      'session_start',
      'round_start',
      'seat_returned',
      'seat_returned',
      'round_end',
      'session_complete',
    ]);

    // The session_start row carries the session_id from the run scope.
    const startRow = sessionRows.find((r) => r.event === 'session_start') as JsonObject;
    expect(startRow.session_id).toBe('council-run-1');
  });
});

describe('deep-ai-council-config-state projection surface — real-consumer proof', () => {
  it('produces files the real council consumers read without corruption and with the folded events reflected', () => {
    const specFolder = mkdtempSync(join(tmpdir(), 'council-config-state-projection-'));
    scratchDirs.push(specFolder);

    // Fold and write each artifact's bytes at its spec-folder-relative
    // path (both files under <specFolder>/ai-council/).
    const surface = createDeepAiCouncilConfigStateProjectionContract();
    const folded = foldLegacyProjectionSurface(surface, fixtureEvents(), fakeHead);
    for (const artifact of folded) {
      const outputPath = join(specFolder, artifact.relativePath);
      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(outputPath, decodeUtf8(artifact.bytes));
    }

    // Consumer 1: the graph replay reads ai-council-state.jsonl and
    // derives a graph payload with SESSION/ROUND/SEAT nodes. No
    // corruption means parseJsonl succeeds and derivePayload returns
    // nodes reflecting the folded events.
    const statePath = join(specFolder, 'ai-council', 'ai-council-state.jsonl');
    const parsedEvents = replayModule.parseJsonl(statePath);
    expect(parsedEvents.length).toBe(7);
    const payload = replayModule.derivePayload(specFolder, 'council-run-1', parsedEvents);
    const nodeKinds = payload.nodes.map((n) => n.kind);
    expect(nodeKinds).toContain('SESSION');
    expect(nodeKinds).toContain('ROUND');
    expect(nodeKinds.filter((k) => k === 'SEAT').length).toBe(2);

    // Consumer 2: the completion advisor reads ai-council-state.jsonl
    // and ai-council-config.json. The config is absent (omitted by the
    // premise check), but readJsonIfExists returns null and the advisor
    // skips the seat-count check — no corruption, and the council_complete
    // event is present so no missing-complete advisory fires.
    const advisories = adviseModule.collectAdvisories(specFolder);
    const missingComplete = advisories.find((a) => a.includes('missing council_complete'));
    expect(missingComplete).toBeUndefined();

    const summary = adviseModule.collectSummary(specFolder);
    expect(summary.artifact_written).toBe(1);
    expect(summary.rollback).toBe(0);
    expect(summary.artifact_superseded).toBe(0);

    // Consumer 3: the round-state reader parses session-state.jsonl
    // without corruption — every line is valid JSON and the records
    // reflect the folded session lifecycle.
    const sessionStatePath = join(specFolder, 'ai-council', 'session-state.jsonl');
    const sessionRecords = roundStateModule.readRoundStateRecords(sessionStatePath);
    expect(sessionRecords.length).toBe(6);
    const sessionRecordEvents = sessionRecords.map((r) => r.event);
    expect(sessionRecordEvents).toContain('session_start');
    expect(sessionRecordEvents).toContain('session_complete');
  });
});

// Negative-control proof: the contract carries a module-scope toggle
// (EMIT_COUNCIL_COMPLETE_ROW) that, when false, suppresses the
// council_complete row from the state file so the completion advisor
// reports a missing council_complete event. The proof flips the toggle
// in the contract source via a shell sed, runs the fold in a fresh
// subprocess (so the flip is observed), and restores the contract via a
// shell trap on EXIT/INT/TERM using ABSOLUTE paths — so the source is
// never left mutated even on interruption. All three states (GREEN, RED,
// RESTORE) are printed.
function writeNegControlHelper(helperPath: string): void {
  const helper = `import { createDeepAiCouncilConfigStateProjectionContract } from ${JSON.stringify(CONTRACT_PATH.replace(/\.ts$/, '.js'))};
import { foldLegacyProjectionSurface } from ${JSON.stringify(resolve(runtimeRoot, 'lib', 'legacy-projections', 'legacy-projection-surface-fold.js'))};
import type { EventReadResult } from ${JSON.stringify(resolve(runtimeRoot, 'lib', 'event-envelope', 'index.js'))};
const TS = ${JSON.stringify(FIXED_TS)};
function ev(stem: string, scope: Record<string, unknown>, data: Record<string, unknown>): EventReadResult {
  return { effective: { envelope: { event_type: 'x', occurred_at: TS, payload: { stem, scope, data } } } } as unknown as EventReadResult;
}
const events: EventReadResult[] = [
  ev('ai_council.round_started', { runId: 'r', roundId: 'round-001' }, { roundNumber: 1 }),
  ev('ai_council.seat_returned', { runId: 'r', roundId: 'round-001', seatId: 'seat-001' }, { responseStatus: 'returned' }),
  ev('ai_council.council_complete', { runId: 'r', roundId: 'round-001' }, { terminalStatus: 'completed' }),
];
const surface = createDeepAiCouncilConfigStateProjectionContract();
const head = { ledgerId: 'deep-ai-council-ledger', sequence: 0, recordHash: '0'.repeat(64) };
const folded = foldLegacyProjectionSurface(surface, events, head as any);
function dec(b: Uint8Array): any[] { const t = new TextDecoder().decode(b).trimEnd(); return t === '' ? [] : t.split('\\n').map((l) => JSON.parse(l)); }
const state = folded.find((a) => a.artifactId === 'council-state')!;
const srows = dec(state.bytes);
const hasComplete = srows.some((r) => r.event === 'council_complete');
const rowCount = srows.length;
process.stdout.write(JSON.stringify({ rowCount, hasComplete }));
`;
  writeFileSync(helperPath, helper);
}

interface NegControlCounts {
  readonly rowCount: number;
  readonly hasComplete: boolean;
}

describe('deep-ai-council-config-state projection surface — negative control', () => {
  it('flips the contract toggle GREEN->RED->RESTORE and prints all three states', () => {
    // Sanity: the contract starts in the production (true) state.
    const before = readFileSync(CONTRACT_PATH, 'utf8');
    expect(before).toContain('const EMIT_COUNCIL_COMPLETE_ROW = true;');

    const tmp = mkdtempSync(join(tmpdir(), 'council-config-state-negctl-'));
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
      `FLIP_FALSE="s/^const EMIT_COUNCIL_COMPLETE_ROW = true;\\$/const EMIT_COUNCIL_COMPLETE_ROW = false;/"`,
      `FLIP_TRUE="s/^const EMIT_COUNCIL_COMPLETE_ROW = false;\\$/const EMIT_COUNCIL_COMPLETE_ROW = true;/"`,
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
      if (afterAttempt.includes('const EMIT_COUNCIL_COMPLETE_ROW = false;')) {
        const restored = afterAttempt.replace(
          'const EMIT_COUNCIL_COMPLETE_ROW = false;',
          'const EMIT_COUNCIL_COMPLETE_ROW = true;',
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

    // GREEN: the three events fold into three state rows including the
    // council_complete terminal event.
    expect(green.rowCount).toBe(3);
    expect(green.hasComplete).toBe(true);

    // RED: the toggle suppressed the council_complete row, so the state
    // file loses its terminal event — the assertion that would have
    // passed green now fails, proving the check can observe the fold.
    expect(red.rowCount).toBe(2);
    expect(red.hasComplete).toBe(false);

    // RESTORE: the trap restored the toggle and the council_complete
    // row returns.
    expect(restore.rowCount).toBe(3);
    expect(restore.hasComplete).toBe(true);

    // Final-state proof: the contract source is back to the production
    // toggle value with no stray mutation.
    const after = readFileSync(CONTRACT_PATH, 'utf8');
    expect(after).toContain('const EMIT_COUNCIL_COMPLETE_ROW = true;');
    expect(after).not.toContain('const EMIT_COUNCIL_COMPLETE_ROW = false;');
    expect(after).toBe(before);
  });
});
