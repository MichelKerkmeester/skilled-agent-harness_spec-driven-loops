// ───────────────────────────────────────────────────────────────────
// MODULE: Verify Iteration Unit Tests
// ───────────────────────────────────────────────────────────────────

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { verify, REASONS } = require('../../scripts/verify-iteration.cjs');
const GATEWAY_CLI = require.resolve('../../scripts/append-mode-event.cjs');

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

  it('names the state row mismatch when the delta carries the route proof', () => {
    writeComplete(dir, 1);
    fs.writeFileSync(path.join(dir, 'deep-review-state.jsonl'), `${JSON.stringify(reviewRecord(1, { target_agent: 'general' }))}\n`);
    const r = verify('review', dir, 1);
    expect(r.ok).toBe(true);
    const warning = (r.warnings ?? []).join(' ');
    expect(warning).toContain('came from deltas/iter-001.jsonl');
    expect(warning).toContain(REASONS.ROUTE_PROOF_MISMATCH);
    expect(warning).not.toMatch(/lacked route proof/);
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

  it('returns findings_not_enumerated only for a landed iteration: removing any artifact changes the reason', () => {
    const noFindingsNarrative = '# Iteration 1\n\n## Actions Taken\nReviewed the target.\n';
    const landedRun = (name: string): string => {
      const runDir = path.join(findingsDir, name);
      const record = researchRecord(1, { findingsCount: 3 });
      writeResearchArtifacts(runDir, record, noFindingsNarrative, [record]);
      return runDir;
    };

    expect(verify('research', landedRun('landed'), 1).reason).toBe('findings_not_enumerated');

    const noNarrative = landedRun('no-narrative');
    fs.rmSync(path.join(noNarrative, 'iterations', 'iteration-001.md'));
    expect(verify('research', noNarrative, 1).reason).toBe('iteration_file_missing');

    const noRecord = landedRun('no-record');
    fs.writeFileSync(path.join(noRecord, 'deep-research-state.jsonl'), `${JSON.stringify({ type: 'event', iteration: 1 })}\n`);
    expect(verify('research', noRecord, 1).reason).toBe('state_record_missing');

    const noDelta = landedRun('no-delta');
    fs.rmSync(path.join(noDelta, 'deltas', 'iter-001.jsonl'));
    expect(verify('research', noDelta, 1).reason).toBe('delta_file_missing');
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
      // The reducer keys a delta finding by id || findingId, so the verifier
      // accepts either; a row with no usable id key still does not enumerate.
      ['review-delta-finding-id', { id: undefined, findingId: 'R2-P1-001' }, true],
      ['review-delta-no-id-key', { id: undefined }, false],
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

// The pre-dispatch audit records a non-native executor on the iteration's
// iteration_start row, through the append gateway on a ledger-backed log and
// straight into the log without one. Each case pairs the passing shape with the
// same iteration missing its executor, so the gate is shown to bite where it should.
describe('verify-iteration executor provenance', () => {
  let root: string;
  const previousLineageId = process.env.SPECKIT_FANOUT_LINEAGE_ID;
  const executor = { kind: 'cli-deepseek-harness', model: 'deepseek-v4.1-flash-1017', executable: 'cli-deepseek-harness' };

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-iter-executor-'));
    process.env.DEEP_LOOP_LEDGER_BACKING_GATE = '0';
    delete process.env.SPECKIT_FANOUT_LINEAGE_ID;
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
    delete process.env.DEEP_LOOP_LEDGER_BACKING_GATE;
    if (previousLineageId === undefined) delete process.env.SPECKIT_FANOUT_LINEAGE_ID;
    else process.env.SPECKIT_FANOUT_LINEAGE_ID = previousLineageId;
  });

  function reviewRun(relativeDir: string, config: Record<string, unknown> | null, stateRows: Record<string, unknown>[]): string {
    const dir = path.join(root, relativeDir);
    writeComplete(dir, 1);
    fs.writeFileSync(path.join(dir, 'deep-review-state.jsonl'), `${stateRows.map((row) => JSON.stringify(row)).join('\n')}\n`);
    if (config) fs.writeFileSync(path.join(dir, 'deep-review-config.json'), JSON.stringify(config));
    return dir;
  }

  function researchRun(relativeDir: string, stateRows: Record<string, unknown>[]): string {
    const dir = path.join(root, relativeDir);
    const record = {
      type: 'iteration',
      iteration: 1,
      mode: 'research',
      target_agent: 'deep-research',
      agent_definition_loaded: true,
      resolved_route: 'Resolved route: mode=research target_agent=deep-research',
      run: 1,
      status: 'complete',
    };
    fs.mkdirSync(path.join(dir, 'iterations'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'deltas'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'iterations', 'iteration-001.md'), '# Iteration 1\n\n## Findings\n\nNone.\n');
    fs.writeFileSync(path.join(dir, 'deltas', 'iter-001.jsonl'), `${JSON.stringify(record)}\n`);
    fs.writeFileSync(path.join(dir, 'deep-research-state.jsonl'), `${[...stateRows, record].map((row) => JSON.stringify(row)).join('\n')}\n`);
    fs.writeFileSync(path.join(dir, 'deep-research-config.json'), JSON.stringify({ executor }));
    return dir;
  }

  const nonNative = { executor };
  const start = (iteration: number, extra: Record<string, unknown> = {}) => ({ type: 'iteration_start', iteration, executor, ...extra });

  it('fails executor_missing when a non-native iteration names no executor anywhere', () => {
    const dir = reviewRun('review', nonNative, [reviewRecord(1)]);
    const r = verify('review', dir, 1);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe('executor_missing');
    expect(r.detail).toContain("'cli-deepseek-harness'");
  });

  it('returns executor_missing only for a landed iteration: removing any artifact changes the reason', () => {
    const landed = reviewRun('landed', nonNative, [reviewRecord(1)]);
    expect(verify('review', landed, 1).reason).toBe('executor_missing');

    const noNarrative = reviewRun('no-narrative', nonNative, [reviewRecord(1)]);
    fs.rmSync(path.join(noNarrative, 'iterations', 'iteration-001.md'));
    expect(verify('review', noNarrative, 1).reason).toBe('iteration_file_missing');

    const noRecord = reviewRun('no-record', nonNative, [{ type: 'event', iteration: 1 }]);
    expect(verify('review', noRecord, 1).reason).toBe('state_record_missing');

    const noDelta = reviewRun('no-delta', nonNative, [reviewRecord(1)]);
    fs.rmSync(path.join(noDelta, 'deltas', 'iter-001.jsonl'));
    expect(verify('review', noDelta, 1).reason).toBe('delta_file_missing');
  });

  it('does not take an executor row filed under another iteration', () => {
    const dir = reviewRun('review', nonNative, [start(2), reviewRecord(1)]);
    expect(verify('review', dir, 1).reason).toBe('executor_missing');
  });

  it('accepts the executor on the iteration_start row of a log with no ledger', () => {
    expect(verify('review', reviewRun('bare', nonNative, [reviewRecord(1)]), 1).reason).toBe('executor_missing');
    expect(verify('review', reviewRun('opened', nonNative, [start(1), reviewRecord(1)]), 1).ok).toBe(true);
  });

  it('accepts the executor on the gateway-written iteration_start row of a ledger-backed log', () => {
    const withLedger = (name: string, rows: Record<string, unknown>[]) => {
      const dir = reviewRun(name, nonNative, rows);
      fs.mkdirSync(path.join(dir, 'deep-review-ledger', 'frames'), { recursive: true });
      fs.writeFileSync(path.join(dir, 'deep-review-ledger', 'frames', '0000000000000001.frame'), '{}\n');
      return dir;
    };
    expect(verify('review', withLedger('bare', [reviewRecord(1)]), 1).reason).toBe('executor_missing');
    const opened = withLedger('opened', [start(1, { runId: 's1', sessionId: 's1', lineageId: 's1' }), reviewRecord(1)]);
    expect(verify('review', opened, 1).ok).toBe(true);
  });

  it('accepts the executor merged onto the iteration record itself', () => {
    expect(verify('review', reviewRun('bare', nonNative, [reviewRecord(1)]), 1).reason).toBe('executor_missing');
    expect(verify('review', reviewRun('merged', nonNative, [reviewRecord(1, { executor })]), 1).ok).toBe(true);
  });

  it('checks a research run the same way', () => {
    const bare = researchRun('bare', []);
    expect(verify('research', bare, 1).reason).toBe('executor_missing');
    expect(verify('research', researchRun('opened', [start(1)]), 1).ok).toBe(true);
  });

  it('leaves native runs and runs with no executor block unchecked', () => {
    expect(verify('review', reviewRun('cli', nonNative, [reviewRecord(1)]), 1).reason).toBe('executor_missing');
    expect(verify('review', reviewRun('native', { executor: { kind: 'native' } }, [reviewRecord(1)]), 1).ok).toBe(true);
    expect(verify('review', reviewRun('no-block', { mode: 'review' }, [reviewRecord(1)]), 1).ok).toBe(true);
    expect(verify('review', reviewRun('no-config', null, [reviewRecord(1)]), 1).ok).toBe(true);
  });

  // A fan-out lineage runs its iterations inline with no executor row, so the gate
  // reads the invocation metadata the fan-out runner writes before it spawns one.
  function writeInvocationMetadata(dir: string, effectiveConfig: Record<string, unknown> | null) {
    fs.writeFileSync(path.join(dir, 'invocation-metadata.json'), `${JSON.stringify({ effectiveConfig, invocationFingerprint: 'inv:test' })}\n`);
  }

  it('passes a fan-out lineage whose invocation metadata names the configured executor', () => {
    const underLineages = reviewRun('review/lineages/luna', nonNative, [reviewRecord(1)]);
    const overridden = reviewRun('elsewhere', { ...nonNative, fanout_lineage_artifact_dir: 'specs/x/review/lineages/luna' }, [reviewRecord(1)]);
    const flagged = reviewRun('flagged', nonNative, [reviewRecord(1)]);
    process.env.SPECKIT_FANOUT_LINEAGE_ID = 'luna';
    for (const dir of [underLineages, overridden, flagged]) {
      expect(verify('review', dir, 1).reason).toBe('executor_missing');
      writeInvocationMetadata(dir, { kind: executor.kind, model: executor.model });
      expect(verify('review', dir, 1).ok).toBe(true);
    }
  });

  it('fails a fan-out lineage whose invocation metadata is missing or names no matching executor', () => {
    const dir = reviewRun('review/lineages/luna', nonNative, [reviewRecord(1)]);
    const missing = verify('review', dir, 1);
    expect(missing.reason).toBe('executor_missing');
    expect(missing.detail).toContain('invocation-metadata.json');
    writeInvocationMetadata(dir, null);
    expect(verify('review', dir, 1).reason).toBe('executor_missing');
    writeInvocationMetadata(dir, { model: executor.model });
    expect(verify('review', dir, 1).reason).toBe('executor_missing');
    fs.writeFileSync(path.join(dir, 'invocation-metadata.json'), '{not json\n');
    expect(verify('review', dir, 1).reason).toBe('executor_missing');
    writeInvocationMetadata(dir, { kind: 'cli-codex' });
    const other = verify('review', dir, 1);
    expect(other.reason).toBe('executor_missing');
    expect(other.detail).toContain("names 'cli-codex'");
  });

  it('leaves a native lineage and a lineage with no executor block unchecked', () => {
    expect(verify('review', reviewRun('review/lineages/cli', nonNative, [reviewRecord(1)]), 1).reason).toBe('executor_missing');
    expect(verify('review', reviewRun('review/lineages/native', { executor: { kind: 'native' } }, [reviewRecord(1)]), 1).ok).toBe(true);
    expect(verify('review', reviewRun('review/lineages/no-block', { mode: 'review' }, [reviewRecord(1)]), 1).ok).toBe(true);
  });
});

// The research leaf records one flat iteration row through the append gateway, so
// the state row verify() reads here is the row the gateway projects back rather
// than a fixture that already carries every field the leaf wrote. Anything the
// projection drops is invisible to the gate, which is what these cases pin: the
// findings count and the route proof must survive the round trip as they were sent.
describe('verify-iteration on a gateway-projected research row', () => {
  let root: string;
  const previousAuthorityRoot = process.env.DEEP_LOOP_AUTHORITY_ROOT;
  const RUN_ID = 'run-projected-001';
  const LINEAGE_ID = 'lineage-projected-001';
  const digest = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

  type GatewayResult = { exitCode: number | null; stderr: string; stdout: string };

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-iter-projected-'));
    // The gateway is handed a private authority root per case; the ledger and
    // watermark cross-checks root themselves in the host checkout's authority
    // state, so they are switched off rather than read against the wrong root.
    process.env.DEEP_LOOP_LEDGER_BACKING_GATE = '0';
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
    if (previousAuthorityRoot === undefined) delete process.env.DEEP_LOOP_AUTHORITY_ROOT;
    else process.env.DEEP_LOOP_AUTHORITY_ROOT = previousAuthorityRoot;
    delete process.env.DEEP_LOOP_LEDGER_BACKING_GATE;
  });

  function gateway(args: string[], authorityRoot: string): GatewayResult {
    const result = spawnSync(process.execPath, [GATEWAY_CLI, ...args], {
      encoding: 'utf8',
      env: { ...process.env, DEEP_LOOP_AUTHORITY_ROOT: authorityRoot },
    });
    return {
      exitCode: result.status,
      stderr: result.stderr ?? '',
      stdout: (result.stdout ?? '').trim(),
    };
  }

  function writeEvent(runDir: string, payload: Record<string, unknown>): string {
    const eventPath = path.join(runDir, 'event.json');
    fs.writeFileSync(eventPath, JSON.stringify(payload), 'utf8');
    return eventPath;
  }

  // A run has to be open before an iteration can be recorded against it, so each
  // case opens one with the canonical stem the workflow speaks.
  function openResearchRun(name: string): { artifactDir: string; runDir: string; authorityRoot: string } {
    const runDir = path.join(root, name);
    const authorityRoot = path.join(root, `${name}-authority`);
    fs.mkdirSync(runDir, { recursive: true });
    fs.mkdirSync(authorityRoot, { recursive: true });
    const opened = gateway(
      ['--mode', 'deep-research', '--run-directory', runDir, '--event-json', writeEvent(runDir, {
        stem: 'deep_research.run_initialized',
        scope: { runId: RUN_ID, lineageId: LINEAGE_ID },
        data: {
          generation: 1,
          charterDigest: digest,
          configDigest: digest,
          executorFingerprint: digest,
          replayFingerprint: digest,
          maxIterations: 10,
          convergencePolicyVersion: '1.0.0',
        },
      })],
      authorityRoot,
    );
    expect(opened.exitCode, opened.stderr + opened.stdout).toBe(0);
    return { artifactDir: path.join(runDir, 'research'), runDir, authorityRoot };
  }

  function appendThroughGateway(runDir: string, authorityRoot: string, record: Record<string, unknown>): void {
    const appended = gateway(
      ['--mode', 'deep-research', '--run-directory', runDir, '--event-json', writeEvent(runDir, record)],
      authorityRoot,
    );
    expect(appended.exitCode, appended.stderr + appended.stdout).toBe(0);
  }

  // The flat row the research leaf hands the gateway: route proof plus the count
  // and focus bookkeeping the state log is read back for after the run.
  function leafIterationRecord(overrides: Record<string, unknown> = {}): Record<string, unknown> {
    return {
      type: 'iteration',
      iteration: 1,
      runId: RUN_ID,
      sessionId: RUN_ID,
      lineageId: LINEAGE_ID,
      mode: 'research',
      target_agent: 'deep-research',
      agent_definition_loaded: true,
      resolved_route: 'Resolved route: mode=research target_agent=deep-research',
      run: 1,
      status: 'complete',
      focus: 'findings enumeration and route proof',
      findingsCount: 0,
      newInfoRatio: 0.5,
      noveltyJustification: 'The iteration opened a file no earlier pass had read.',
      keyQuestions: [],
      answeredQuestions: [],
      ruledOut: [],
      focusTrack: 'correctness',
      edgeCase: 'none',
      toolsUsed: ['Read'],
      sourcesQueried: ['src/file.ts:42'],
      ...overrides,
    };
  }

  function writeLeafArtifacts(artifactDir: string, record: Record<string, unknown>, narrative: string): void {
    fs.mkdirSync(path.join(artifactDir, 'iterations'), { recursive: true });
    fs.mkdirSync(path.join(artifactDir, 'deltas'), { recursive: true });
    fs.writeFileSync(path.join(artifactDir, 'iterations', 'iteration-001.md'), narrative);
    fs.writeFileSync(path.join(artifactDir, 'deltas', 'iter-001.jsonl'), `${JSON.stringify(record)}\n`);
  }

  it('runs the findings gate on a findingsCount that arrives through the gateway', () => {
    const { artifactDir, runDir, authorityRoot } = openResearchRun('count-only');
    const record = leafIterationRecord({ findingsCount: 3 });
    appendThroughGateway(runDir, authorityRoot, record);
    writeLeafArtifacts(artifactDir, record, '# Iteration 1\n\n## Findings\n\nNone enumerated.\n');

    const r = verify('research', artifactDir, 1);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe('findings_not_enumerated');
  });

  it('passes route proof from the projected state row itself', () => {
    const { artifactDir, runDir, authorityRoot } = openResearchRun('route-proof');
    const record = leafIterationRecord({ findingsCount: 1 });
    appendThroughGateway(runDir, authorityRoot, record);
    writeLeafArtifacts(artifactDir, record, [
      '# Iteration 1',
      '',
      '## Findings',
      '',
      '- **F1**: The runner owns the stop decision - `runner.cjs:42`',
      '',
    ].join('\n'));

    const r = verify('research', artifactDir, 1);
    expect(r.ok).toBe(true);
    expect((r.warnings ?? []).join(' ')).not.toMatch(/came from deltas/i);
  });

  it('keeps a passing verdict when findings are enumerated and answered questions sit in the key questions', () => {
    const { artifactDir, runDir, authorityRoot } = openResearchRun('questions');
    const question = 'Which file owns the stop?';
    const record = leafIterationRecord({
      findingsCount: 2,
      keyQuestions: [question],
      answeredQuestions: [question],
    });
    appendThroughGateway(runDir, authorityRoot, record);
    writeLeafArtifacts(artifactDir, record, [
      '# Iteration 1',
      '',
      '## Findings',
      '',
      '- **F1**: The runner owns the stop decision - `runner.cjs:42`',
      '- **F2**: The plan records the stop through the same file - `plan.cjs:11`',
      '',
    ].join('\n'));

    const r = verify('research', artifactDir, 1);
    expect(r.ok).toBe(true);
  });
});

// A landed iteration fails verification only with a reason returned after the delta check.
// A second leaf refuses to overwrite a landed iteration, so redispatching it spends a full
// dispatch for nothing; the workflow rule must name those reasons and skip the redispatch.
describe('workflow redispatch rule skips reasons only a landed iteration returns', () => {
  const assets = path.resolve(__dirname, '..', '..', '..', '..', '..', 'commands', 'deep', 'assets');
  const skipClause = 'Skip this redispatch when the failure reason is executor_missing, findings_not_enumerated or ledger_backing_missing.';
  const stillRedispatched = ['iteration_file_missing', 'state_record_missing', 'delta_file_missing', 'route_proof_missing', 'route_proof_mismatch'];

  function redispatchRule(file: string): string {
    const line = fs.readFileSync(path.join(assets, file), 'utf8')
      .split(/\r?\n/)
      .find((candidate) => candidate.trim().startsWith('redispatch_once:'));
    expect(line, `${file} has a redispatch_once rule`).toBeDefined();
    return line as string;
  }

  for (const file of ['deep-research.yaml', 'deep-review.yaml']) {
    it(`${file} skips the redispatch for landed-iteration reasons and still caps it at one`, () => {
      const rule = redispatchRule(file);
      expect(rule).toContain(skipClause);
      for (const reason of stillRedispatched) expect(rule).not.toContain(reason);
      expect(rule).toContain('Never re-dispatch a given iteration more than once');
    });
  }
});
