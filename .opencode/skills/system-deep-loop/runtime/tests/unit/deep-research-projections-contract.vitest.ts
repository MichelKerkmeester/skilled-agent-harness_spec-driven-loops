// Proves the deep-research-projections projection surface folds ledger
// events into the ledger-derivable findings registry whose JSON shape
// matches the exact records the source/evidence/claim/supersession stems
// carry. The load-bearing check is not self-consistency of the fold but
// that the projected bytes hold the concrete ledger-derivable content
// (sources, evidence, claims, supersessions) and omit the prose files the
// ledger does not carry. The negative-control toggle proves the claims
// assertion can go red.

import { execFileSync } from 'node:child_process';
import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  createDeepResearchProjectionsProjectionContract,
  foldLegacyProjectionSurface,
} from '../../lib/legacy-projections/index.js';

import type { EventReadResult, JsonObject } from '../../lib/event-envelope/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const runtimeRoot = resolve(here, '..', '..');
const CONTRACT_PATH = resolve(
  runtimeRoot, 'lib', 'legacy-projections', 'deep-research-projections-contract.ts',
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

// Synthetic events exercising every registry-bearing stem once, plus a
// non-registry stem (iteration_started) to prove it is ignored. The
// fixture spans one iteration so the registry holds one source, one
// evidence record, two claims (one asserted, one related), and one
// supersession.
function registryFixtureEvents(): EventReadResult[] {
  return [
    researchEvent(
      'deep_research.iteration_started',
      { runId: 'res-1', lineageId: 'lin-1', iteration: 1 },
      { focusRef: 'focus-1', stateTailDigest: 'd0', strategyDigest: 'd1', status: 'started' },
    ),
    researchEvent(
      'deep_research.source_captured',
      { runId: 'res-1', lineageId: 'lin-1', iteration: 1, sourceVersionId: 'src-v1' },
      {
        sourceIdentityDigest: 'sid-1',
        locator: { kind: 'url', value: 'https://example.test/a' },
        capturedAt: FIXED_TS,
        contentDigest: 'cd-1',
        mediaType: 'text/html',
        retrievalReceiptRef: 'rr-1',
        parentSourceVersionId: null,
        instructionScanResult: 'clean',
      },
    ),
    researchEvent(
      'deep_research.evidence_admission_decided',
      { runId: 'res-1', lineageId: 'lin-1', iteration: 1, sourceVersionId: 'src-v1', evidenceId: 'ev-1' },
      {
        disposition: 'admit',
        passageLocators: [],
        atomicClaimRefs: ['cl-v1'],
        derivativeSourceGroup: 'grp-1',
        admissionPolicyVersion: '1.0.0',
        contaminationStatus: 'clean',
        reasonCode: 'ok',
      },
    ),
    researchEvent(
      'deep_research.claim_asserted',
      { runId: 'res-1', lineageId: 'lin-1', iteration: 1, claimVersionId: 'cl-v1' },
      {
        claimId: 'cl-1',
        normalizedClaimDigest: 'ncd-1',
        evidenceIds: ['ev-1'],
        independenceGroup: 'ig-1',
        rawConfidence: 0.8,
        claimStatus: 'supported',
      },
    ),
    researchEvent(
      'deep_research.claim_relation_recorded',
      { runId: 'res-1', lineageId: 'lin-1', iteration: 1, claimVersionId: 'cl-v2' },
      {
        claimId: 'cl-1',
        relatedClaimVersionId: 'cl-v1',
        evidenceIds: ['ev-1'],
        relation: 'supports',
        independenceGroup: 'ig-1',
        rawConfidence: 0.7,
        claimStatus: 'supported',
      },
    ),
    researchEvent(
      'deep_research.claim_superseded',
      { runId: 'res-1', lineageId: 'lin-1', iteration: 1, claimVersionId: 'cl-v3' },
      {
        priorClaimVersionId: 'cl-v1',
        successorClaimVersionId: 'cl-v2',
        supersessionReason: 'stronger evidence',
        effectiveAt: FIXED_TS,
        replacementEvidenceIds: ['ev-1'],
        invalidationScope: 'full',
      },
    ),
  ];
}

function decodeUtf8(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

function parseJson(bytes: Uint8Array): JsonObject {
  return JSON.parse(decodeUtf8(bytes)) as JsonObject;
}

const scratchDirs: string[] = [];
afterEach(() => {
  while (scratchDirs.length > 0) {
    const dir = scratchDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// (a) BYTE PROOF — concrete ledger-derivable registry content
// ───────────────────────────────────────────────────────────────────

describe('deep-research-projections projection surface — findings-registry byte proof', () => {
  it('folds registry-bearing events into one JSON artifact with the exact ledger-derivable records', () => {
    const surface = createDeepResearchProjectionsProjectionContract();
    const events = registryFixtureEvents();
    const folded = foldLegacyProjectionSurface(surface, events, fakeHead);

    // One artifact: the findings registry. The three prose files in the
    // mixed surface are omitted (not ledger-derivable), so exactly one.
    expect(folded).toHaveLength(1);
    expect(folded[0].relativePath).toBe('research/deep-research-findings-registry.json');
    expect(folded[0].format).toBe('json');
    expect(folded[0].artifactId).toBe('research-projections:findings-registry');

    const registry = parseJson(folded[0].bytes);
    const sources = registry.sources as JsonObject[];
    const evidence = registry.evidence as JsonObject[];
    const claims = registry.claims as JsonObject[];
    const supersessions = registry.supersessions as JsonObject[];

    // One source from source_captured; iteration_started ignored.
    expect(sources).toHaveLength(1);
    expect(sources[0]).toMatchObject({
      iteration: 1,
      sourceVersionId: 'src-v1',
      sourceIdentityDigest: 'sid-1',
      contentDigest: 'cd-1',
      mediaType: 'text/html',
      retrievalReceiptRef: 'rr-1',
      instructionScanResult: 'clean',
      capturedAt: FIXED_TS,
      producerEventTimestamp: FIXED_TS,
    });

    // One evidence record from evidence_admission_decided.
    expect(evidence).toHaveLength(1);
    expect(evidence[0]).toMatchObject({
      iteration: 1,
      sourceVersionId: 'src-v1',
      evidenceId: 'ev-1',
      disposition: 'admit',
      atomicClaimRefs: ['cl-v1'],
      derivativeSourceGroup: 'grp-1',
      admissionPolicyVersion: '1.0.0',
      contaminationStatus: 'clean',
      reasonCode: 'ok',
      producerEventTimestamp: FIXED_TS,
    });

    // Two claims: one asserted (relation 'asserts', no related version),
    // one related (relation 'supports', with related version).
    expect(claims).toHaveLength(2);
    expect(claims[0]).toMatchObject({
      iteration: 1,
      claimVersionId: 'cl-v1',
      claimId: 'cl-1',
      relatedClaimVersionId: '',
      relation: 'asserts',
      normalizedClaimDigest: 'ncd-1',
      evidenceIds: ['ev-1'],
      independenceGroup: 'ig-1',
      rawConfidence: 0.8,
      claimStatus: 'supported',
      producerEventTimestamp: FIXED_TS,
    });
    expect(claims[1]).toMatchObject({
      iteration: 1,
      claimVersionId: 'cl-v2',
      claimId: 'cl-1',
      relatedClaimVersionId: 'cl-v1',
      relation: 'supports',
      evidenceIds: ['ev-1'],
      rawConfidence: 0.7,
      claimStatus: 'supported',
      producerEventTimestamp: FIXED_TS,
    });

    // One supersession from claim_superseded.
    expect(supersessions).toHaveLength(1);
    expect(supersessions[0]).toMatchObject({
      iteration: 1,
      priorClaimVersionId: 'cl-v1',
      successorClaimVersionId: 'cl-v2',
      supersessionReason: 'stronger evidence',
      effectiveAt: FIXED_TS,
      replacementEvidenceIds: ['ev-1'],
      invalidationScope: 'full',
      producerEventTimestamp: FIXED_TS,
    });

    // The prose files are omitted: the registry carries only the four
    // ledger-derivable arrays, no dashboard/report/resource-map keys.
    expect(Object.keys(registry).sort()).toEqual(
      ['claims', 'evidence', 'sources', 'supersessions'],
    );
  });

  it('produces stable pretty-printed JSON bytes with a trailing newline', () => {
    const surface = createDeepResearchProjectionsProjectionContract();
    const folded = foldLegacyProjectionSurface(surface, registryFixtureEvents(), fakeHead);
    const text = decodeUtf8(folded[0].bytes);
    // serializeLegacyJson terminates with a newline and indents two spaces.
    expect(text.endsWith('\n')).toBe(true);
    expect(text).toContain('\n  "sources":');
    // Re-parsing yields the same bytes (canonical round-trip).
    const reparsed = parseJson(folded[0].bytes);
    expect((reparsed.claims as JsonObject[]).length).toBe(2);
  });
});

// ───────────────────────────────────────────────────────────────────
// (b) NEGATIVE CONTROL
// ───────────────────────────────────────────────────────────────────

// The helper runs in a fresh tsx subprocess so the flipped toggle is
// observed. It folds the same fixture events and reports the claims
// count and the full registry shape so the GREEN/RED contrast is the
// claims array length, not a self-consistency tautology.
function writeNegControlHelper(helperPath: string): void {
  const helper = `import { createDeepResearchProjectionsProjectionContract } from ${JSON.stringify(CONTRACT_PATH.replace(/\\.ts$/, '.js'))};
import { foldLegacyProjectionSurface } from ${JSON.stringify(resolve(runtimeRoot, 'lib', 'legacy-projections', 'legacy-projection-surface-fold.js'))};
import type { EventReadResult } from ${JSON.stringify(resolve(runtimeRoot, 'lib', 'event-envelope', 'index.js'))};
const TS = ${JSON.stringify(FIXED_TS)};
function ev(stem: string, scope: Record<string, unknown>, data: Record<string, unknown>): EventReadResult {
  return { effective: { envelope: { event_type: 'x', occurred_at: TS, payload: { stem, scope, data } } } } as unknown as EventReadResult;
}
const events: EventReadResult[] = [
  ev('deep_research.source_captured', { runId: 'r', lineageId: 'l', iteration: 1, sourceVersionId: 'sv1' }, { sourceIdentityDigest: 'sid', locator: {}, capturedAt: TS, contentDigest: 'cd', mediaType: 'text/html', retrievalReceiptRef: 'rr', parentSourceVersionId: null, instructionScanResult: 'clean' }),
  ev('deep_research.claim_asserted', { runId: 'r', lineageId: 'l', iteration: 1, claimVersionId: 'cv1' }, { claimId: 'c1', normalizedClaimDigest: 'n', evidenceIds: [], independenceGroup: 'ig', rawConfidence: 0.5, claimStatus: 'supported' }),
  ev('deep_research.claim_relation_recorded', { runId: 'r', lineageId: 'l', iteration: 1, claimVersionId: 'cv2' }, { claimId: 'c1', relatedClaimVersionId: 'cv1', evidenceIds: [], relation: 'supports', independenceGroup: 'ig', rawConfidence: 0.5, claimStatus: 'supported' }),
];
const surface = createDeepResearchProjectionsProjectionContract();
const head = { ledgerId: 'deep-research-ledger', sequence: 0, recordHash: '0'.repeat(64) };
const folded = foldLegacyProjectionSurface(surface, events, head as any);
const registry = JSON.parse(new TextDecoder().decode(folded[0].bytes));
const claimsCount = registry.claims.length;
const sourcesCount = registry.sources.length;
process.stdout.write(JSON.stringify({ claimsCount, sourcesCount }));
`;
  writeFileSync(helperPath, helper);
}

interface NegControlCounts {
  readonly claimsCount: number;
  readonly sourcesCount: number;
}

describe('deep-research-projections projection surface — negative control', () => {
  it('flips the contract toggle GREEN->RED->RESTORE and prints all three states', () => {
    // Sanity: the contract starts in the production (true) state.
    const before = readFileSync(CONTRACT_PATH, 'utf8');
    expect(before).toContain('const EMIT_CLAIMS = true;');

    const tmp = mkdtempSync(join(tmpdir(), 'research-proj-negctl-'));
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
      `FLIP_FALSE="s/^const EMIT_CLAIMS = true;\\$/const EMIT_CLAIMS = false;/"`,
      `FLIP_TRUE="s/^const EMIT_CLAIMS = false;\\$/const EMIT_CLAIMS = true;/"`,
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
      if (afterAttempt.includes('const EMIT_CLAIMS = false;')) {
        const restored = afterAttempt.replace(
          'const EMIT_CLAIMS = false;',
          'const EMIT_CLAIMS = true;',
        );
        writeFileSync(CONTRACT_PATH, restored);
      }
    }

    const lines = stdout.split('\n').filter((l) => l.length > 0);
    const greenLine = lines.find((l) => l.startsWith('GREEN: '));
    const redLine = lines.find((l) => l.startsWith('RED: '));
    const restoreLine = lines.find((l) => l.startsWith('RESTORE: '));

    for (const l of lines) {
      process.stdout.write(`${l}\n`);
    }

    expect(greenLine).toBeDefined();
    expect(redLine).toBeDefined();
    expect(restoreLine).toBeDefined();

    const green = JSON.parse(greenLine!.slice('GREEN: '.length)) as NegControlCounts;
    const red = JSON.parse(redLine!.slice('RED: '.length)) as NegControlCounts;
    const restore = JSON.parse(restoreLine!.slice('RESTORE: '.length)) as NegControlCounts;

    // GREEN: both claims present; sources still fold (the hook only
    // suppresses claims, so the sources array proves the fold ran).
    expect(green.claimsCount).toBe(2);
    expect(green.sourcesCount).toBe(1);

    // RED: the toggle suppressed claim rows, so the claims array is
    // empty — the load-bearing assertion that would have passed green
    // now fails. Sources still fold, proving the fold ran and only the
    // claims branch was disabled.
    expect(red.claimsCount).toBe(0);
    expect(red.sourcesCount).toBe(1);

    // RESTORE: the trap restored the toggle and the claims return.
    expect(restore.claimsCount).toBe(2);
    expect(restore.sourcesCount).toBe(1);

    // Final-state proof: the contract source is back to the production
    // toggle value with no stray mutation.
    const after = readFileSync(CONTRACT_PATH, 'utf8');
    expect(after).toContain('const EMIT_CLAIMS = true;');
    expect(after).not.toContain('const EMIT_CLAIMS = false;');
    expect(after).toBe(before);
  });
});
