// ───────────────────────────────────────────────────────────────────
// MODULE: Verify Iteration Unit Tests
// ───────────────────────────────────────────────────────────────────

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { verify, REASONS } = require('../../scripts/verify-iteration.cjs');

// Minimal valid review iteration record mirroring the leaf output contract:
// type=iteration + route-proof fields + the numeric iteration key.
function reviewRecord(iteration: number, overrides: Record<string, unknown> = {}) {
  return {
    type: 'iteration',
    iteration,
    mode: 'review',
    target_agent: 'deep-review',
    agent_definition_loaded: true,
    resolved_route: 'Resolved route: mode=review target_agent=deep-review',
    run: 'run-001',
    status: 'complete',
    ...overrides,
  };
}

function writeComplete(dir: string, iteration: number) {
  const nnn = String(iteration).padStart(3, '0');
  fs.mkdirSync(path.join(dir, 'iterations'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'deltas'), { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'iterations', `iteration-${nnn}.md`),
    `# Iteration ${iteration}\n\nFindings...\n\nReview verdict: PASS\n`,
  );
  fs.writeFileSync(path.join(dir, 'deep-review-state.jsonl'), `${JSON.stringify(reviewRecord(iteration))}\n`);
  fs.writeFileSync(path.join(dir, 'deltas', `iter-${nnn}.jsonl`), `${JSON.stringify(reviewRecord(iteration))}\n`);
}

describe('verify-iteration leaf-reliability check', () => {
  let dir: string;
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-iter-'));
    // These tests exercise the narrative/route-proof/delta checks, not ledger backing.
    // Disable the ledger-backing gate so they do not fail on the absent test ledger.
    process.env.DEEP_LOOP_LEDGER_BACKING_GATE = '0';
  });
  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
    delete process.env.DEEP_LOOP_LEDGER_BACKING_GATE;
  });

  it('passes when all three artifacts + route-proof are present', () => {
    writeComplete(dir, 1);
    const r = verify('review', dir, 1);
    expect(r.ok).toBe(true);
  });

  it('supports a descriptive suffix on the narrative filename', () => {
    writeComplete(dir, 2);
    fs.renameSync(path.join(dir, 'iterations', 'iteration-002.md'), path.join(dir, 'iterations', 'iteration-002-focus-correctness.md'));
    const r = verify('review', dir, 2);
    expect(r.ok).toBe(true);
  });

  it('fails iteration_file_missing when the narrative is absent', () => {
    writeComplete(dir, 1);
    fs.rmSync(path.join(dir, 'iterations', 'iteration-001.md'));
    const r = verify('review', dir, 1);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe(REASONS.ITERATION_FILE_MISSING);
  });

  it('names the dispatch failure from the completion receipt when the narrative is absent', () => {
    writeComplete(dir, 1);
    fs.rmSync(path.join(dir, 'iterations', 'iteration-001.md'));
    const receipts = path.join(dir, 'dispatch-receipts');
    fs.mkdirSync(receipts);
    const executor = { kind: 'cli-pi', timeoutSeconds: 900 };
    const receipt = (phase: string, issuedAt: string, facts: Record<string, unknown>) => fs.writeFileSync(
      path.join(receipts, `dispatch-review-i1-g1.${phase}.json`),
      JSON.stringify({ type: 'dispatch_receipt', phase, dispatchId: 'review-i1-g1', issuedAt, facts: { iteration: 1, executor, ...facts } }),
    );
    receipt('intent', '2026-10-05T09:02:25.000Z', {});
    receipt('completion', '2026-10-05T09:17:24.000Z', { exitStatus: 143, signal: null });
    fs.writeFileSync(path.join(receipts, 'dispatch-review-i1-g1.attempt-1.completion.json'), '{}');

    const failed = verify('review', dir, 1);
    expect(failed.reason).toBe(REASONS.DISPATCH_FAILED);
    expect(failed.detail).toBe('dispatch review-i1-g1: cli-pi exited 143, after 899 s, at the 900 s executor timeout, '
      + '1 earlier attempt(s) kept as dispatch-review-i1-g1.attempt-N; no iterations/iteration-001*.md written');

    // A clean exit that still wrote nothing stays an artifact failure, not a dispatch one.
    receipt('completion', '2026-10-05T09:05:00.000Z', { exitStatus: 0, signal: null });
    expect(verify('review', dir, 1).reason).toBe(REASONS.ITERATION_FILE_MISSING);
  });

  it('fails iteration_verdict_missing when the review verdict line is absent', () => {
    writeComplete(dir, 1);
    fs.writeFileSync(path.join(dir, 'iterations', 'iteration-001.md'), '# Iteration 1\n\nNo verdict here.\n');
    const r = verify('review', dir, 1);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe(REASONS.ITERATION_VERDICT_MISSING);
  });

  it('fails state_record_missing when no matching iteration record exists', () => {
    writeComplete(dir, 1);
    fs.writeFileSync(path.join(dir, 'deep-review-state.jsonl'), `${JSON.stringify(reviewRecord(2))}\n`);
    const r = verify('review', dir, 1);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe(REASONS.STATE_RECORD_MISSING);
  });

  it('fails route_proof_missing when neither the state record nor the delta carries route-proof fields', () => {
    writeComplete(dir, 1);
    const bare = { type: 'iteration', iteration: 1, run: 'run-001', status: 'complete' };
    fs.writeFileSync(path.join(dir, 'deep-review-state.jsonl'), `${JSON.stringify(bare)}\n`);
    fs.writeFileSync(path.join(dir, 'deltas', 'iter-001.jsonl'), `${JSON.stringify(bare)}\n`);
    const r = verify('review', dir, 1);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe(REASONS.ROUTE_PROOF_MISSING);
  });

  it('passes on the delta when the projection drops route-proof fields, and names its source', () => {
    writeComplete(dir, 1);
    const bare = { type: 'iteration', iteration: 1, run: 'run-001', status: 'complete' };
    fs.writeFileSync(path.join(dir, 'deep-review-state.jsonl'), `${JSON.stringify(bare)}\n`);
    const r = verify('review', dir, 1);
    expect(r.ok).toBe(true);
    expect(r.warnings?.join(' ')).toContain('deltas/iter-001.jsonl');
  });

  it('fails route_proof_mismatch when target_agent is wrong in both places', () => {
    writeComplete(dir, 1);
    const wrong = reviewRecord(1, { target_agent: 'general' });
    fs.writeFileSync(path.join(dir, 'deep-review-state.jsonl'), `${JSON.stringify(wrong)}\n`);
    fs.writeFileSync(path.join(dir, 'deltas', 'iter-001.jsonl'), `${JSON.stringify(wrong)}\n`);
    const r = verify('review', dir, 1);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe(REASONS.ROUTE_PROOF_MISMATCH);
  });

  it('fails delta_file_missing when the delta is absent', () => {
    writeComplete(dir, 1);
    fs.rmSync(path.join(dir, 'deltas', 'iter-001.jsonl'));
    const r = verify('review', dir, 1);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe(REASONS.DELTA_FILE_MISSING);
  });

  it('uses the latest record when an append-only redispatch added a corrected one', () => {
    writeComplete(dir, 1);
    // A bad record first (route-proof mismatch), then the corrected retry record.
    const bad = reviewRecord(1, { target_agent: 'general' });
    const good = reviewRecord(1);
    fs.writeFileSync(path.join(dir, 'deep-review-state.jsonl'), `${JSON.stringify(bad)}\n${JSON.stringify(good)}\n`);
    const r = verify('review', dir, 1);
    expect(r.ok).toBe(true);
  });

  it('skips malformed JSONL lines without crashing', () => {
    writeComplete(dir, 1);
    fs.appendFileSync(path.join(dir, 'deep-review-state.jsonl'), 'not json at all\n');
    const r = verify('review', dir, 1);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe(REASONS.STATE_LOG_MALFORMED);
  });
});

// The append-gateway cross-check needs the real packet-root/mode-subfolder
// nesting (packetRoot/review/deep-review-state.jsonl) because it derives the
// gateway's watermark location from the state log's PARENT directory -- unlike
// the flat fixtures above, which don't exercise that check because no test
// there configures a live authority root (see checkGatewayReceipt's
// not-enforced short-circuit).
describe('verify-iteration gateway-receipt corroboration', () => {
  let packetRoot: string;
  let artifactDir: string;
  const previousAuthorityRoot = process.env.DEEP_LOOP_AUTHORITY_ROOT;

  beforeEach(() => {
    packetRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-iter-gateway-'));
    artifactDir = path.join(packetRoot, 'review');
    writeComplete(artifactDir, 1);
    // These tests target the opt-in watermark advisory, not the ledger-backing gate.
    process.env.DEEP_LOOP_LEDGER_BACKING_GATE = '0';
  });

  afterEach(() => {
    fs.rmSync(packetRoot, { recursive: true, force: true });
    if (previousAuthorityRoot === undefined) delete process.env.DEEP_LOOP_AUTHORITY_ROOT;
    else process.env.DEEP_LOOP_AUTHORITY_ROOT = previousAuthorityRoot;
    delete process.env.DEEP_LOOP_VERIFY_GATEWAY_RECEIPT;
    delete process.env.DEEP_LOOP_LEDGER_BACKING_GATE;
  });

  function canonicalJson(value: unknown): string {
    const sortKeysDeep = (input: unknown): unknown => {
      if (Array.isArray(input)) return input.map(sortKeysDeep);
      if (input && typeof input === 'object') {
        const out: Record<string, unknown> = {};
        for (const key of Object.keys(input as Record<string, unknown>).sort()) {
          out[key] = sortKeysDeep((input as Record<string, unknown>)[key]);
        }
        return out;
      }
      return input;
    };
    return JSON.stringify(sortKeysDeep(value));
  }

  function sha256Hex(bytes: Buffer): string {
    return crypto.createHash('sha256').update(bytes).digest('hex');
  }

  function writeAuthority(state: string): string {
    const authRoot = path.join(packetRoot, 'authority');
    fs.mkdirSync(authRoot, { recursive: true });
    const core = {
      schemaVersion: 1,
      mode: 'deep-review',
      state,
      epoch: 1,
      selectedWriter: state === 'new_authoritative_reversible' || state === 'new_authoritative_final' ? 'dark' : 'legacy',
      candidateSha: null,
      policyVersion: 0,
      cutoverCertificateDigest: null,
      lastTransitionDigest: null,
      updatedAt: new Date('2026-08-19T12:00:00Z').toISOString(),
    };
    const record = { ...core, recordDigest: sha256Hex(Buffer.from(canonicalJson(core), 'utf8')) };
    fs.writeFileSync(path.join(authRoot, 'authority-deep-review.json'), JSON.stringify(record, null, 2));
    return authRoot;
  }

  function publishMatchingWatermark(): void {
    const legacyFile = path.join(artifactDir, 'deep-review-state.jsonl');
    const bytes = fs.readFileSync(legacyFile);
    const watermarkDir = path.join(packetRoot, '.legacy-projection-watermarks');
    fs.mkdirSync(watermarkDir, { recursive: true });
    fs.writeFileSync(
      path.join(watermarkDir, 'review-state.json'),
      JSON.stringify({
        watermark_version: 1,
        artifact_id: 'review-state',
        ledger_id: 'l1',
        ledger_sequence: 3,
        ledger_record_hash: 'a'.repeat(64),
        projection_version: 1,
        reducer_version: 1,
        replay_fingerprint: 'b'.repeat(64),
        base_sha: 'c'.repeat(40),
        base_digest: 'd'.repeat(64),
        prior_ledger_sequence: null,
        prior_output_digest: null,
        output_digest: sha256Hex(bytes),
        output_byte_length: bytes.length,
        refreshed_at: '2026-08-19T12:00:00Z',
      }, null, 2),
    );
  }

  it('stays inert by default (opt-in flag unset), even when the mode is on ledger authority', () => {
    process.env.DEEP_LOOP_AUTHORITY_ROOT = writeAuthority('new_authoritative_final');
    delete process.env.DEEP_LOOP_VERIFY_GATEWAY_RECEIPT;
    const r = verify('review', artifactDir, 1);
    expect(r.ok).toBe(true);
    expect(r.warnings).toBeUndefined();
  });

  // The exact shape of the reported incident: a leaf writes the projection
  // directly under ledger authority, so a complete-looking record has no gateway
  // watermark behind it. With corroboration enabled this surfaces as an advisory
  // -- visible but non-fatal, so a possibly-valid iteration is not blocked while
  // the migration is mid-flight and not every path publishes a watermark yet.
  it('surfaces an advisory (never a hard failure) when enabled and no watermark was published', () => {
    process.env.DEEP_LOOP_AUTHORITY_ROOT = writeAuthority('new_authoritative_final');
    process.env.DEEP_LOOP_VERIFY_GATEWAY_RECEIPT = '1';
    const r = verify('review', artifactDir, 1);
    expect(r.ok).toBe(true);
    expect(r.warnings).toBeDefined();
    expect(r.warnings?.some((w) => w.includes('gateway receipt'))).toBe(true);
  });

  it('surfaces an advisory when enabled and the state log drifted from a published watermark', () => {
    publishMatchingWatermark();
    // Simulate a leaf bypassing the gateway on a later write.
    fs.appendFileSync(
      path.join(artifactDir, 'deep-review-state.jsonl'),
      `${JSON.stringify(reviewRecord(2))}\n`,
    );
    process.env.DEEP_LOOP_AUTHORITY_ROOT = writeAuthority('new_authoritative_final');
    process.env.DEEP_LOOP_VERIFY_GATEWAY_RECEIPT = '1';
    const r = verify('review', artifactDir, 1);
    expect(r.ok).toBe(true);
    expect(r.warnings).toBeDefined();
  });

  it('passes with no advisory when enabled and the state log matches the watermark', () => {
    publishMatchingWatermark();
    process.env.DEEP_LOOP_AUTHORITY_ROOT = writeAuthority('new_authoritative_final');
    process.env.DEEP_LOOP_VERIFY_GATEWAY_RECEIPT = '1';
    const r = verify('review', artifactDir, 1);
    expect(r.ok).toBe(true);
    expect(r.warnings).toBeUndefined();
  });
});

describe('verify-iteration ledger-backing gate (structural, default-on)', () => {
  let packetRoot: string;
  let artifactDir: string;
  const previousAuthorityRoot = process.env.DEEP_LOOP_AUTHORITY_ROOT;

  beforeEach(() => {
    packetRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-iter-ledger-'));
    artifactDir = path.join(packetRoot, 'review');
    writeComplete(artifactDir, 1);
    delete process.env.DEEP_LOOP_LEDGER_BACKING_GATE; // default on
  });

  afterEach(() => {
    fs.rmSync(packetRoot, { recursive: true, force: true });
    if (previousAuthorityRoot === undefined) delete process.env.DEEP_LOOP_AUTHORITY_ROOT;
    else process.env.DEEP_LOOP_AUTHORITY_ROOT = previousAuthorityRoot;
    delete process.env.DEEP_LOOP_LEDGER_BACKING_GATE;
  });

  function canon(value: unknown): string {
    const sortKeysDeep = (input: unknown): unknown => {
      if (Array.isArray(input)) return input.map(sortKeysDeep);
      if (input && typeof input === 'object') {
        const out: Record<string, unknown> = {};
        for (const key of Object.keys(input as Record<string, unknown>).sort()) {
          out[key] = sortKeysDeep((input as Record<string, unknown>)[key]);
        }
        return out;
      }
      return input;
    };
    return JSON.stringify(sortKeysDeep(value));
  }

  function writeAuthority(state: string): string {
    const authRoot = path.join(packetRoot, 'authority');
    fs.mkdirSync(authRoot, { recursive: true });
    const core = {
      schemaVersion: 1,
      mode: 'deep-review',
      state,
      epoch: 1,
      selectedWriter: state === 'new_authoritative_reversible' || state === 'new_authoritative_final' ? 'dark' : 'legacy',
      candidateSha: null,
      policyVersion: 0,
      cutoverCertificateDigest: null,
      lastTransitionDigest: null,
      updatedAt: new Date('2026-08-19T12:00:00Z').toISOString(),
    };
    const record = { ...core, recordDigest: crypto.createHash('sha256').update(canon(core), 'utf8').digest('hex') };
    fs.writeFileSync(path.join(authRoot, 'authority-deep-review.json'), JSON.stringify(record, null, 2));
    return authRoot;
  }

  function writeLedgerFrames(): void {
    const framesDir = path.join(artifactDir, 'deep-review-ledger', 'frames');
    fs.mkdirSync(framesDir, { recursive: true });
    fs.writeFileSync(path.join(framesDir, '0000000000000001.frame'), '{}\n');
  }

  // The reported incident: under ledger authority the projection shows a complete
  // iteration but no mode ledger backs it -- the leaf wrote the projection directly.
  it('fails the iteration under ledger authority when no mode ledger backs the projection', () => {
    process.env.DEEP_LOOP_AUTHORITY_ROOT = writeAuthority('new_authoritative_final');
    const r = verify('review', artifactDir, 1);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe(REASONS.LEDGER_BACKING_MISSING);
  });

  it('passes when the mode ledger has backing frames and names the producing root', () => {
    writeLedgerFrames();
    process.env.DEEP_LOOP_AUTHORITY_ROOT = writeAuthority('new_authoritative_final');
    const r = verify('review', artifactDir, 1);
    expect(r.ok).toBe(true);
    expect(r.ledgerBacking).toEqual({
      status: 'backed',
      framesRoot: path.join(artifactDir, 'deep-review-ledger', 'frames'),
      framesRootKind: 'artifact-dir',
    });
    expect(r.warnings).toBeUndefined();
  });

  it('accepts a parent-of-lineage frames root but reports it as a warning', () => {
    const parentFrames = path.join(packetRoot, 'deep-review-ledger', 'frames');
    fs.mkdirSync(parentFrames, { recursive: true });
    fs.writeFileSync(path.join(parentFrames, '0000000000000001.frame'), '{}\n');
    process.env.DEEP_LOOP_AUTHORITY_ROOT = writeAuthority('new_authoritative_final');
    const r = verify('review', artifactDir, 1);
    expect(r.ok).toBe(true);
    expect(r.ledgerBacking).toEqual({
      status: 'backed',
      framesRoot: parentFrames,
      framesRootKind: 'parent-of-lineage',
    });
    expect(r.warnings?.some((w) => w.includes('parent-of-lineage'))).toBe(true);
  });

  it('the kill-switch (DEEP_LOOP_LEDGER_BACKING_GATE=0) disables the gate', () => {
    process.env.DEEP_LOOP_AUTHORITY_ROOT = writeAuthority('new_authoritative_final');
    process.env.DEEP_LOOP_LEDGER_BACKING_GATE = '0';
    const r = verify('review', artifactDir, 1);
    expect(r.ok).toBe(true);
    expect(r.ledgerBacking).toEqual({ status: 'disabled' });
  });

  it('stays inert before the mode moves to ledger authority (legacy writer sanctioned)', () => {
    process.env.DEEP_LOOP_AUTHORITY_ROOT = writeAuthority('legacy_authoritative');
    const r = verify('review', artifactDir, 1);
    expect(r.ok).toBe(true);
    expect(r.ledgerBacking.status).toBe('not-enforced');
  });
});

describe('verify-iteration findings enumeration', () => {
  let findingsDir: string;

  beforeEach(() => {
    findingsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-iter-findings-'));
    process.env.DEEP_LOOP_LEDGER_BACKING_GATE = '0';
  });

  afterEach(() => {
    fs.rmSync(findingsDir, { recursive: true, force: true });
    delete process.env.DEEP_LOOP_LEDGER_BACKING_GATE;
  });

  function writeResearchArtifacts(
    artifactDir: string,
    record: Record<string, unknown>,
    narrative: string,
    deltaRecords: Record<string, unknown>[],
  ): void {
    const iteration = Number(record.iteration);
    const nnn = String(iteration).padStart(3, '0');
    fs.mkdirSync(path.join(artifactDir, 'iterations'), { recursive: true });
    fs.mkdirSync(path.join(artifactDir, 'deltas'), { recursive: true });
    fs.writeFileSync(path.join(artifactDir, 'iterations', `iteration-${nnn}.md`), narrative);
    fs.writeFileSync(path.join(artifactDir, 'deep-research-state.jsonl'), `${JSON.stringify(record)}\n`);
    fs.writeFileSync(
      path.join(artifactDir, 'deltas', `iter-${nnn}.jsonl`),
      `${deltaRecords.map((delta) => JSON.stringify(delta)).join('\n')}\n`,
    );
  }

  function researchRecord(iteration: number, overrides: Record<string, unknown> = {}) {
    return {
      type: 'iteration',
      iteration,
      mode: 'research',
      target_agent: 'deep-research',
      agent_definition_loaded: true,
      resolved_route: 'Resolved route: mode=research target_agent=deep-research',
      run: iteration,
      status: 'complete',
      ...overrides,
    };
  }

  function writeReviewArtifacts(
    artifactDir: string,
    record: Record<string, unknown>,
    narrative: string,
    extraDeltaRows: Record<string, unknown>[] = [],
  ): void {
    const iteration = Number(record.iteration);
    const nnn = String(iteration).padStart(3, '0');
    fs.mkdirSync(path.join(artifactDir, 'iterations'), { recursive: true });
    fs.mkdirSync(path.join(artifactDir, 'deltas'), { recursive: true });
    fs.writeFileSync(path.join(artifactDir, 'iterations', `iteration-${nnn}.md`), narrative);
    fs.writeFileSync(path.join(artifactDir, 'deep-review-state.jsonl'), `${JSON.stringify(record)}\n`);
    fs.writeFileSync(
      path.join(artifactDir, 'deltas', `iter-${nnn}.jsonl`),
      [record, ...extraDeltaRows].map((row) => JSON.stringify(row)).join('\n') + '\n',
    );
  }

  it('rejects unenumerated research counts and keeps delta, Markdown, zero, and absent cases valid', () => {
    const countOnlyDir = path.join(findingsDir, 'count-only');
    const countOnlyRecord = researchRecord(1, { findingsCount: 3 });
    const noFindingsNarrative = '# Iteration 1\n\n## Actions Taken\nReviewed the target.\n';
    writeResearchArtifacts(countOnlyDir, countOnlyRecord, noFindingsNarrative, [countOnlyRecord]);
    const rejected = verify('research', countOnlyDir, 1);
    expect(rejected.ok).toBe(false);
    expect(rejected.reason).toBe('findings_not_enumerated');

    const deltaDir = path.join(findingsDir, 'delta-findings');
    const deltaRecord = researchRecord(1, { findingsCount: 3 });
    const findingRows = Array.from({ length: 3 }, (_, index) => ({
      type: 'finding',
      id: `F${index + 1}`,
      label: `Research finding ${index + 1}`,
      iteration: 1,
      sources: ['src/example.ts'],
    }));
    writeResearchArtifacts(deltaDir, deltaRecord, noFindingsNarrative, [deltaRecord, ...findingRows]);
    expect(verify('research', deltaDir, 1).ok).toBe(true);

    const markdownDir = path.join(findingsDir, 'markdown-findings');
    const markdownRecord = researchRecord(1, { findingsCount: 3 });
    const findingsNarrative = [
      '# Iteration 1',
      '',
      '## Findings',
      '1. First finding',
      '2. Second finding',
      '3. Third finding',
      '',
      '## Questions Remaining',
    ].join('\n');
    writeResearchArtifacts(markdownDir, markdownRecord, findingsNarrative, [markdownRecord]);
    expect(verify('research', markdownDir, 1).ok).toBe(true);

    const zeroDir = path.join(findingsDir, 'zero-count');
    const zeroRecord = researchRecord(1, { findingsCount: 0 });
    writeResearchArtifacts(zeroDir, zeroRecord, noFindingsNarrative, [zeroRecord]);
    expect(verify('research', zeroDir, 1).ok).toBe(true);

    const absentDir = path.join(findingsDir, 'absent-count');
    const absentRecord = researchRecord(1);
    writeResearchArtifacts(absentDir, absentRecord, noFindingsNarrative, [absentRecord]);
    expect(verify('research', absentDir, 1).ok).toBe(true);
  });

  it('counts only delta finding rows the merge files under this iteration', () => {
    const noFindingsNarrative = '# Iteration 1\n\n## Actions Taken\nReviewed the target.\n';
    const findingRow = (iteration: number | undefined) => ({
      type: 'finding',
      id: 'F1',
      label: 'Research finding',
      ...(iteration === undefined ? {} : { iteration }),
      sources: ['src/example.ts'],
    });

    const foreignDir = path.join(findingsDir, 'foreign-row');
    const foreignRecord = researchRecord(1, { findingsCount: 1 });
    writeResearchArtifacts(foreignDir, foreignRecord, noFindingsNarrative, [foreignRecord, findingRow(2)]);
    const rejected = verify('research', foreignDir, 1);
    expect(rejected.ok).toBe(false);
    expect(rejected.reason).toBe('findings_not_enumerated');

    const unkeyedDir = path.join(findingsDir, 'unkeyed-row');
    const unkeyedRecord = researchRecord(1, { findingsCount: 1 });
    writeResearchArtifacts(unkeyedDir, unkeyedRecord, noFindingsNarrative, [unkeyedRecord, findingRow(undefined)]);
    expect(verify('research', unkeyedDir, 1).ok).toBe(true);
  });

  it('rejects unenumerated review counts and passes matching findingDetails', () => {
    const verdictNarrative = '# Iteration 1\n\nFindings...\n\nReview verdict: PASS\n';
    const countOnlyDir = path.join(findingsDir, 'review-count-only');
    const countOnlyRecord = reviewRecord(1, { findingsCount: 2, findingDetails: [] });
    writeReviewArtifacts(countOnlyDir, countOnlyRecord, verdictNarrative);
    const rejected = verify('review', countOnlyDir, 1);
    expect(rejected.ok).toBe(false);
    expect(rejected.reason).toBe('findings_not_enumerated');

    const enumeratedDir = path.join(findingsDir, 'review-enumerated');
    const enumeratedRecord = reviewRecord(1, {
      findingsCount: 2,
      findingDetails: [
        { id: 'R1-P1-001', severity: 'P1', title: 'First review finding' },
        { id: 'R1-P2-001', severity: 'P2', title: 'Second review finding' },
      ],
    });
    writeReviewArtifacts(enumeratedDir, enumeratedRecord, verdictNarrative);
    expect(verify('review', enumeratedDir, 1).ok).toBe(true);
  });

  it('accepts review details that list more findings than the iteration count, with adjudicated severity', () => {
    const verdictNarrative = '# Iteration 5\n\nFindings...\n\nReview verdict: CONDITIONAL\n';
    const activeListDir = path.join(findingsDir, 'review-active-list');
    const activeListRecord = reviewRecord(5, {
      findingsCount: 1,
      findingDetails: [
        { id: 'R2-P0-001', severity: 'P0', title: 'Carried finding' },
        { findingId: 'R1-P1-001', finalSeverity: 'P1', title: 'Adjudicated finding' },
        { id: 'R5-P2-001', severity: 'P2', title: 'New finding' },
      ],
    });
    writeReviewArtifacts(activeListDir, activeListRecord, verdictNarrative);
    expect(verify('review', activeListDir, 5).ok).toBe(true);

    const unreadableDir = path.join(findingsDir, 'review-unreadable');
    const unreadableRecord = reviewRecord(5, {
      findingsCount: 1,
      findingDetails: [{ severity: 'P1' }],
    });
    writeReviewArtifacts(unreadableDir, unreadableRecord, verdictNarrative);
    const rejected = verify('review', unreadableDir, 5);
    expect(rejected.ok).toBe(false);
    expect(rejected.reason).toBe('findings_not_enumerated');
  });

  it('accepts review findings listed only as delta rows filed under this iteration', () => {
    const verdictNarrative = '# Iteration 2\n\nFindings...\n\nReview verdict: CONDITIONAL\n';
    const deltaRow = (overrides: Record<string, unknown>) => ({
      type: 'finding',
      id: 'R2-P1-001',
      severity: 'P1',
      title: 'Delta-only review finding',
      iteration: 2,
      ...overrides,
    });
    const cases: Array<[string, Record<string, unknown>, boolean]> = [
      ['review-delta-row', {}, true],
      ['review-delta-adjudicated', { severity: 'high', finalSeverity: 'P2' }, true],
      ['review-delta-foreign', { iteration: 3 }, false],
      ['review-delta-unranked', { severity: 'high' }, false],
      ['review-delta-string-iteration', { iteration: '2' }, false],
      ['review-delta-unkeyed', { iteration: undefined }, false],
    ];
    for (const [name, overrides, expected] of cases) {
      const dir = path.join(findingsDir, name);
      writeReviewArtifacts(dir, reviewRecord(2, { findingsCount: 1 }), verdictNarrative, [deltaRow(overrides)]);
      const result = verify('review', dir, 2);
      expect(result.ok, name).toBe(expected);
      if (!expected) expect(result.reason, name).toBe('findings_not_enumerated');
    }
  });

  it('accepts review findings listed only in the Markdown severity sections the reducer parses', () => {
    const listed = [
      '# Iteration 3: Correctness',
      '',
      '## Findings',
      '',
      '### P1, Required',
      '',
      '- **F001**: Guard compares paths lexically - `scripts/apply.cjs:12` - Use a containment test',
      '',
      'Review verdict: CONDITIONAL',
      '',
    ].join('\n');
    const listedDir = path.join(findingsDir, 'review-markdown-listed');
    writeReviewArtifacts(listedDir, reviewRecord(3, { findingsCount: 1 }), listed);
    expect(verify('review', listedDir, 3).ok).toBe(true);

    const proseOnly = '# Iteration 3: Correctness\n\n## Findings\n\nOne P1 in the path guard.\n\nReview verdict: CONDITIONAL\n';
    const proseDir = path.join(findingsDir, 'review-markdown-prose');
    writeReviewArtifacts(proseDir, reviewRecord(3, { findingsCount: 1 }), proseOnly);
    const rejected = verify('review', proseDir, 3);
    expect(rejected.ok).toBe(false);
    expect(rejected.reason).toBe('findings_not_enumerated');
  });

  it('gates a review on its new findings, not the running total it carries', () => {
    const verdictNarrative = '# Iteration 4\n\n## Result\nNo new finding in this pass.\n\nReview verdict: PASS\n';
    const carriedDir = path.join(findingsDir, 'review-carried-total');
    writeReviewArtifacts(carriedDir, reviewRecord(4, {
      findingsCount: 5,
      findingsSummary: { P0: 0, P1: 1, P2: 4 },
      findingsNew: { P0: 0, P1: 0, P2: 0 },
      findingDetails: [],
    }), verdictNarrative);
    expect(verify('review', carriedDir, 4).ok).toBe(true);

    const unlistedDir = path.join(findingsDir, 'review-new-unlisted');
    writeReviewArtifacts(unlistedDir, reviewRecord(4, {
      findingsCount: 5,
      findingsSummary: { P0: 0, P1: 1, P2: 4 },
      findingsNew: { P0: 0, P1: 1, P2: 0 },
      findingDetails: [],
    }), verdictNarrative);
    const rejected = verify('review', unlistedDir, 4);
    expect(rejected.ok).toBe(false);
    expect(rejected.reason).toBe('findings_not_enumerated');
  });

  it('reads a list-shaped findingsNew as the list of new findings', () => {
    const verdictNarrative = '# Iteration 5\n\n## Result\nNothing new.\n\nReview verdict: PASS\n';
    const noneNewDir = path.join(findingsDir, 'review-list-none-new');
    writeReviewArtifacts(noneNewDir, reviewRecord(5, {
      findingsCount: 7, findingsNew: [], findingDetails: [],
    }), verdictNarrative);
    expect(verify('review', noneNewDir, 5).ok).toBe(true);

    const oneNewDir = path.join(findingsDir, 'review-list-one-new');
    writeReviewArtifacts(oneNewDir, reviewRecord(5, {
      findingsCount: 7, findingsNew: [{ id: 'R5-P1-001' }], findingDetails: [],
    }), verdictNarrative);
    const rejected = verify('review', oneNewDir, 5);
    expect(rejected.ok).toBe(false);
    expect(rejected.reason).toBe('findings_not_enumerated');
  });

  it('lets a valid source carry the claim when findingDetails holds an unranked entry', () => {
    const verdictNarrative = '# Iteration 2\n\nFindings...\n\nReview verdict: CONDITIONAL\n';
    const dir = path.join(findingsDir, 'review-details-partial');
    writeReviewArtifacts(dir, reviewRecord(2, {
      findingsCount: 1,
      findingDetails: [{ id: 'A', severity: 'P1' }, { id: 'B', severity: 'high' }],
    }), verdictNarrative, [{ type: 'finding', id: 'A', severity: 'P1', title: 'Kept by the reducer', iteration: 2 }]);
    expect(verify('review', dir, 2).ok).toBe(true);
  });

  it('ignores Markdown findings in a suffixed narrative the reducer never loads', () => {
    const listed = [
      '# Iteration 3: Correctness',
      '',
      '## Findings',
      '',
      '### P1, Required',
      '',
      '- **F001**: Guard compares paths lexically - `scripts/apply.cjs:12` - Use a containment test',
      '',
      'Review verdict: CONDITIONAL',
      '',
    ].join('\n');
    const dir = path.join(findingsDir, 'review-markdown-suffixed');
    writeReviewArtifacts(dir, reviewRecord(3, { findingsCount: 1 }), listed);
    fs.renameSync(path.join(dir, 'iterations', 'iteration-003.md'), path.join(dir, 'iterations', 'iteration-003-correctness.md'));
    const rejected = verify('review', dir, 3);
    expect(rejected.ok).toBe(false);
    expect(rejected.reason).toBe('findings_not_enumerated');
  });
});
