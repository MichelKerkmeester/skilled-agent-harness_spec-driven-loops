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

  it('fails route_proof_missing when the record omits route-proof fields', () => {
    writeComplete(dir, 1);
    const bare = { type: 'iteration', iteration: 1, run: 'run-001', status: 'complete' };
    fs.writeFileSync(path.join(dir, 'deep-review-state.jsonl'), `${JSON.stringify(bare)}\n`);
    const r = verify('review', dir, 1);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe(REASONS.ROUTE_PROOF_MISSING);
  });

  it('fails route_proof_mismatch when target_agent is wrong', () => {
    writeComplete(dir, 1);
    const wrong = reviewRecord(1, { target_agent: 'general' });
    fs.writeFileSync(path.join(dir, 'deep-review-state.jsonl'), `${JSON.stringify(wrong)}\n`);
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

  it('passes when the mode ledger has backing frames', () => {
    writeLedgerFrames();
    process.env.DEEP_LOOP_AUTHORITY_ROOT = writeAuthority('new_authoritative_final');
    const r = verify('review', artifactDir, 1);
    expect(r.ok).toBe(true);
  });

  it('the kill-switch (DEEP_LOOP_LEDGER_BACKING_GATE=0) disables the gate', () => {
    process.env.DEEP_LOOP_AUTHORITY_ROOT = writeAuthority('new_authoritative_final');
    process.env.DEEP_LOOP_LEDGER_BACKING_GATE = '0';
    const r = verify('review', artifactDir, 1);
    expect(r.ok).toBe(true);
  });

  it('stays inert before the mode moves to ledger authority (legacy writer sanctioned)', () => {
    process.env.DEEP_LOOP_AUTHORITY_ROOT = writeAuthority('legacy_authoritative');
    const r = verify('review', artifactDir, 1);
    expect(r.ok).toBe(true);
  });
});
