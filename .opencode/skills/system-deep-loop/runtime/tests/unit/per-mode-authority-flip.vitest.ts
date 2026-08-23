// ───────────────────────────────────────────────────────────────────
// MODULE: Per-Mode Authority Flip Tests
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';
import { writeCanonicalJsonAtomic } from '../../lib/locks-and-fencing/durable-file.js';
import {
  AuthorityFlipError,
  AuthorityRegistry,
  isValidAuthorityRecord,
  selectAuthorityRoute,
} from '../../lib/per-mode-authority-flip/index.js';

import type {
  AuthorityRecord,
  AuthorityRoute,
  CutoverCertificateMode,
} from '../../lib/per-mode-authority-flip/index.js';

const CANDIDATE_SHA = 'a'.repeat(40);
const MODE: CutoverCertificateMode = 'deep-research';

function digest(label: string): string {
  return createHash('sha256').update(label, 'utf8').digest('hex');
}

function seedAuthorityRecord(root: string, record: Omit<AuthorityRecord, 'recordDigest'>): AuthorityRecord {
  const full: AuthorityRecord = Object.freeze({
    ...record,
    recordDigest: sha256Bytes(canonicalBytes(record as never)),
  });
  writeCanonicalJsonAtomic(join(root, `authority-${record.mode}.json`), full as never);
  return full;
}

function cutoverReadyRecord(mode: CutoverCertificateMode, epoch: number): Omit<AuthorityRecord, 'recordDigest'> {
  return {
    schemaVersion: 1,
    mode,
    state: 'cutover_ready',
    epoch,
    selectedWriter: 'legacy',
    candidateSha: null,
    policyVersion: 0,
    cutoverCertificateDigest: null,
    lastTransitionDigest: null,
    updatedAt: '2026-08-09T00:00:00Z',
  };
}

// ───────────────────────────────────────────────────────────────────
// 2. SELECTOR
// ───────────────────────────────────────────────────────────────────

describe('selectAuthorityRoute', () => {
  function validRecord(overrides: Readonly<Partial<AuthorityRecord>> = {}): AuthorityRecord {
    const core = {
      schemaVersion: 1 as const,
      mode: MODE,
      state: 'legacy_authoritative' as const,
      epoch: 1,
      selectedWriter: 'legacy' as const,
      candidateSha: null,
      policyVersion: 0,
      cutoverCertificateDigest: null,
      lastTransitionDigest: null,
      updatedAt: '2026-08-09T00:00:00Z',
      ...overrides,
    };
    return { ...core, recordDigest: sha256Bytes(canonicalBytes(core as never)) };
  }

  it('routes legacy_authoritative to legacy with no shadow route', () => {
    const result = selectAuthorityRoute(validRecord(), { mode: MODE });
    expect(result).toEqual({
      outcome: 'selected', route: 'legacy', shadowRoute: null, state: 'legacy_authoritative', epoch: 1, admissionOpen: true,
    });
  });

  it('routes cutover_ready to legacy while shadowing dark for observation', () => {
    const result = selectAuthorityRoute(validRecord({ state: 'cutover_ready' }), { mode: MODE });
    expect(result).toEqual({
      outcome: 'selected', route: 'legacy', shadowRoute: 'dark', state: 'cutover_ready', epoch: 1, admissionOpen: true,
    });
  });

  it('routes new_authoritative_reversible to dark while legacy stays observable', () => {
    const result = selectAuthorityRoute(
      validRecord({ state: 'new_authoritative_reversible', epoch: 2, selectedWriter: 'dark' }),
      { mode: MODE },
    );
    expect(result).toEqual({
      outcome: 'selected', route: 'dark', shadowRoute: 'legacy', state: 'new_authoritative_reversible', epoch: 2, admissionOpen: true,
    });
  });

  it('routes new_authoritative_final to dark with no shadow route', () => {
    const result = selectAuthorityRoute(
      validRecord({ state: 'new_authoritative_final', epoch: 3, selectedWriter: 'dark' }),
      { mode: MODE },
    );
    expect(result.outcome).toBe('selected');
    if (result.outcome !== 'selected') throw new Error('expected selected');
    expect(result.route).toBe('dark');
    expect(result.shadowRoute).toBeNull();
  });

  it('denies admission during rollback_pending rather than exposing either writer', () => {
    const result = selectAuthorityRoute(validRecord({ state: 'rollback_pending' }), { mode: MODE });
    expect(result).toEqual({ outcome: 'denied', reasonCode: 'ACTIVE_TRANSACTION_CONFLICT' });
  });

  it('denies a missing record', () => {
    expect(selectAuthorityRoute(undefined, { mode: MODE })).toEqual({ outcome: 'denied', reasonCode: 'RECORD_MALFORMED' });
  });

  it('denies a record whose digest was tampered', () => {
    const record = { ...validRecord(), recordDigest: digest('tampered') };
    expect(selectAuthorityRoute(record, { mode: MODE })).toEqual({ outcome: 'denied', reasonCode: 'RECORD_MALFORMED' });
  });

  it('denies an unknown authority state', () => {
    const record = { ...validRecord(), state: 'not-a-real-state' };
    const tampered = { ...record, recordDigest: sha256Bytes(canonicalBytes(record as never)) };
    expect(selectAuthorityRoute(tampered, { mode: MODE })).toEqual({ outcome: 'denied', reasonCode: 'RECORD_MALFORMED' });
  });

  it('denies a record bound to a different mode than expected', () => {
    const result = selectAuthorityRoute(validRecord(), { mode: 'deep-review' });
    expect(result).toEqual({ outcome: 'denied', reasonCode: 'WRONG_MODE_BINDING' });
  });

  it('denies a policy-version mismatch (policy drift)', () => {
    const result = selectAuthorityRoute(validRecord({ policyVersion: 2 }), { mode: MODE, policyVersion: 1 });
    expect(result).toEqual({ outcome: 'denied', reasonCode: 'POLICY_MISMATCH' });
  });

  it('denies a caller-supplied expected record digest that no longer matches (stale cache)', () => {
    const result = selectAuthorityRoute(validRecord(), { mode: MODE, expectedRecordDigest: digest('stale-cache') });
    expect(result).toEqual({ outcome: 'denied', reasonCode: 'RECORD_DIGEST_MISMATCH' });
  });

  it('accepts a matching caller-supplied expected record digest', () => {
    const record = validRecord();
    const result = selectAuthorityRoute(record, { mode: MODE, expectedRecordDigest: record.recordDigest });
    expect(result.outcome).toBe('selected');
  });
});

describe('isValidAuthorityRecord', () => {
  it('rejects a non-object value', () => {
    expect(isValidAuthorityRecord(null)).toBe(false);
    expect(isValidAuthorityRecord('not-a-record')).toBe(false);
  });
});

// ───────────────────────────────────────────────────────────────────
// 3. AUTHORITY REGISTRY
// ───────────────────────────────────────────────────────────────────

describe('AuthorityRegistry', () => {
  const temporaryRoots: string[] = [];
  afterEach(() => {
    while (temporaryRoots.length > 0) {
      const root = temporaryRoots.pop();
      if (root) rmSync(root, { recursive: true, force: true });
    }
  });
  function temporaryRoot(label: string): string {
    const root = mkdtempSync(join(tmpdir(), `authority-registry-${label}-`));
    temporaryRoots.push(root);
    return root;
  }

  it('reads legacy_authoritative at epoch 1 as the default for a mode never written', () => {
    const registry = new AuthorityRegistry(temporaryRoot('default'));
    const record = registry.read('deep-research');
    expect(record.state).toBe('legacy_authoritative');
    expect(record.epoch).toBe(1);
    expect(record.selectedWriter).toBe('legacy');
    expect(isValidAuthorityRecord(record)).toBe(true);
  });

  it('flips cutover_ready to new_authoritative_reversible with a monotonic epoch increment', () => {
    const root = temporaryRoot('cas-success');
    seedAuthorityRecord(root, cutoverReadyRecord('deep-research', 5));
    const registry = new AuthorityRegistry(root);
    const outcome = registry.compareAndSwap({
      mode: 'deep-research',
      expectedState: 'cutover_ready',
      expectedEpoch: 5,
      nextSelectedWriter: 'dark',
      candidateSha: CANDIDATE_SHA,
      policyVersion: 1,
      cutoverCertificateDigest: digest('certificate'),
      lastTransitionDigest: digest('transition'),
      at: '2026-08-09T00:10:00Z',
    });
    expect(outcome.resumed).toBe(false);
    expect(outcome.record.state).toBe('new_authoritative_reversible');
    expect(outcome.record.epoch).toBe(6);
    expect(registry.read('deep-research').epoch).toBe(6);
  });

  it('rejects a stale/wrong epoch CAS and leaves the record unchanged', () => {
    const root = temporaryRoot('cas-stale-epoch');
    seedAuthorityRecord(root, cutoverReadyRecord('deep-research', 5));
    const registry = new AuthorityRegistry(root);
    expect(() => registry.compareAndSwap({
      mode: 'deep-research',
      expectedState: 'cutover_ready',
      expectedEpoch: 4,
      nextSelectedWriter: 'dark',
      candidateSha: CANDIDATE_SHA,
      policyVersion: 1,
      cutoverCertificateDigest: digest('certificate'),
      lastTransitionDigest: digest('transition'),
      at: '2026-08-09T00:10:00Z',
    })).toThrow(AuthorityFlipError);
    const record = registry.read('deep-research');
    expect(record.state).toBe('cutover_ready');
    expect(record.epoch).toBe(5);
  });

  it('rejects a CAS whose expected state does not match the current record', () => {
    const root = temporaryRoot('cas-wrong-state');
    // Default record is legacy_authoritative@1, not cutover_ready.
    const registry = new AuthorityRegistry(root);
    expect(() => registry.compareAndSwap({
      mode: 'deep-research',
      expectedState: 'cutover_ready',
      expectedEpoch: 1,
      nextSelectedWriter: 'dark',
      candidateSha: CANDIDATE_SHA,
      policyVersion: 1,
      cutoverCertificateDigest: digest('certificate'),
      lastTransitionDigest: digest('transition'),
      at: '2026-08-09T00:10:00Z',
    })).toThrow(AuthorityFlipError);
    expect(registry.read('deep-research').state).toBe('legacy_authoritative');
  });

  it('resumes idempotently when the record already reflects the exact target transition', () => {
    const root = temporaryRoot('cas-resume');
    seedAuthorityRecord(root, cutoverReadyRecord('deep-research', 5));
    const registry = new AuthorityRegistry(root);
    const first = registry.compareAndSwap({
      mode: 'deep-research',
      expectedState: 'cutover_ready',
      expectedEpoch: 5,
      nextSelectedWriter: 'dark',
      candidateSha: CANDIDATE_SHA,
      policyVersion: 1,
      cutoverCertificateDigest: digest('certificate'),
      lastTransitionDigest: digest('transition'),
      at: '2026-08-09T00:10:00Z',
    });
    expect(first.resumed).toBe(false);

    // A second CAS call with the same expected pre-state fails the literal
    // precondition (the record already moved), but because it already
    // reflects the exact same target and transition digest, this is the
    // resume path rather than a genuine conflict.
    const second = registry.compareAndSwap({
      mode: 'deep-research',
      expectedState: 'cutover_ready',
      expectedEpoch: 5,
      nextSelectedWriter: 'dark',
      candidateSha: CANDIDATE_SHA,
      policyVersion: 1,
      cutoverCertificateDigest: digest('certificate'),
      lastTransitionDigest: digest('transition'),
      at: '2026-08-09T00:20:00Z',
    });
    expect(second.resumed).toBe(true);
    expect(second.record.epoch).toBe(6);
    expect(second.record.updatedAt).toBe(first.record.updatedAt);
  });

  it('rejects a compareAndSwap whose nextSelectedWriter the reader rejects, leaving the record byte-identical', () => {
    const root = temporaryRoot('cas-bad-writer');
    seedAuthorityRecord(root, cutoverReadyRecord('deep-research', 5));
    const registry = new AuthorityRegistry(root);
    const recordPath = join(root, 'authority-deep-research.json');
    const before = readFileSync(recordPath);

    // The guard exists for untyped callers (the enablement CLI is a .cjs
    // file), so the bad value is cast at the test boundary to reach the
    // runtime check rather than being caught at compile time.
    let thrown: unknown;
    try {
      registry.compareAndSwap({
        mode: 'deep-research',
        expectedState: 'cutover_ready',
        expectedEpoch: 5,
        nextSelectedWriter: 'spine' as unknown as AuthorityRoute,
        candidateSha: CANDIDATE_SHA,
        policyVersion: 1,
        cutoverCertificateDigest: digest('certificate'),
        lastTransitionDigest: digest('transition'),
        at: '2026-08-09T00:10:00Z',
      });
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(AuthorityFlipError);
    expect((thrown as AuthorityFlipError).reasonCode).toBe('RECORD_MALFORMED');

    // Nothing was written: the on-disk bytes are unchanged.
    const after = readFileSync(recordPath);
    expect(after.equals(before)).toBe(true);
  });

  it('proves the writer guard runs before lock acquisition by using a root the process cannot write to', () => {
    const root = temporaryRoot('cas-bad-writer-ordering');
    const registry = new AuthorityRegistry(root);
    registry.prepareCutover({
      mode: 'deep-research',
      expectedEpoch: 1,
      candidateSha: CANDIDATE_SHA,
      policyVersion: 1,
      at: '2026-08-09T00:00:00Z',
    });

    // Making the root unwritable forces lock acquisition to fail: if the
    // writer guard did not run first, the bad-writer call would surface the
    // lock error instead of the writer error, so the reason code discriminates
    // the ordering rather than merely asserting it.
    chmodSync(root, 0o500);
    try {
      // The guard exists for untyped callers (the enablement CLI is a .cjs
      // file), so the bad value is cast at the test boundary to reach the
      // runtime check rather than being caught at compile time.
      let thrown: unknown;
      try {
        registry.compareAndSwap({
          mode: 'deep-research',
          expectedState: 'cutover_ready',
          expectedEpoch: 1,
          nextSelectedWriter: 'spine' as unknown as AuthorityRoute,
          candidateSha: CANDIDATE_SHA,
          policyVersion: 1,
          cutoverCertificateDigest: digest('certificate'),
          lastTransitionDigest: digest('transition'),
          at: '2026-08-09T00:10:00Z',
        });
      } catch (error) {
        thrown = error;
      }
      expect(thrown).toBeInstanceOf(AuthorityFlipError);
      expect((thrown as AuthorityFlipError).reasonCode).toBe('RECORD_MALFORMED');

      // Control: an admitted writer ('dark') reaches lock acquisition on the
      // same unwritable root and fails there, proving the bad-writer call
      // above never contended for a lock — the writer guard rejected it first.
      let control: unknown;
      try {
        registry.compareAndSwap({
          mode: 'deep-research',
          expectedState: 'cutover_ready',
          expectedEpoch: 1,
          nextSelectedWriter: 'dark',
          candidateSha: CANDIDATE_SHA,
          policyVersion: 1,
          cutoverCertificateDigest: digest('certificate'),
          lastTransitionDigest: digest('transition'),
          at: '2026-08-09T00:10:00Z',
        });
      } catch (error) {
        control = error;
      }
      expect(control).toBeInstanceOf(AuthorityFlipError);
      expect((control as AuthorityFlipError).reasonCode).toBe('ACTIVE_TRANSACTION_CONFLICT');
    } finally {
      chmodSync(root, 0o700);
    }
  });

  it('still admits a compareAndSwap with nextSelectedWriter "dark" and reads the record back cleanly', () => {
    const root = temporaryRoot('cas-dark-control');
    seedAuthorityRecord(root, cutoverReadyRecord('deep-research', 5));
    const registry = new AuthorityRegistry(root);
    const outcome = registry.compareAndSwap({
      mode: 'deep-research',
      expectedState: 'cutover_ready',
      expectedEpoch: 5,
      nextSelectedWriter: 'dark',
      candidateSha: CANDIDATE_SHA,
      policyVersion: 1,
      cutoverCertificateDigest: digest('certificate'),
      lastTransitionDigest: digest('transition'),
      at: '2026-08-09T00:10:00Z',
    });
    expect(outcome.resumed).toBe(false);
    expect(outcome.record.selectedWriter).toBe('dark');
    // The green control: the guard is not rejecting everything, and the
    // written record still passes the reader's integrity check.
    const readBack = registry.read('deep-research');
    expect(isValidAuthorityRecord(readBack)).toBe(true);
    expect(readBack.selectedWriter).toBe('dark');
  });

  it('rejects a tampered on-disk record rather than trusting stored bytes', () => {
    const root = temporaryRoot('tampered');
    const record = cutoverReadyRecord('deep-research', 5);
    writeCanonicalJsonAtomic(
      join(root, 'authority-deep-research.json'),
      { ...record, recordDigest: digest('forged') } as never,
    );
    const registry = new AuthorityRegistry(root);
    expect(() => registry.read('deep-research')).toThrow(AuthorityFlipError);
  });

  it('serializes transactions through the transaction lock', async () => {
    const registry = new AuthorityRegistry(temporaryRoot('transaction-lock'));
    const started: string[] = [];
    const first = registry.withTransactionLock(async () => {
      started.push('first');
      await new Promise((resolveWait) => setTimeout(resolveWait, 10));
      return 'first-done';
    });
    await expect(registry.withTransactionLock(async () => 'second-done')).rejects.toThrow(AuthorityFlipError);
    expect(await first).toBe('first-done');
    expect(started).toEqual(['first']);
  });

  // ─────────────────────────────────────────────────────────────────
  // prepareCutover: the missing producer for the cutover_ready state
  // ─────────────────────────────────────────────────────────────────

  describe('prepareCutover', () => {
    it('moves a legacy record to cutover_ready at the same epoch, with selectedWriter still legacy', () => {
      const root = temporaryRoot('prepare-cutover');
      seedAuthorityRecord(root, {
        schemaVersion: 1,
        mode: 'deep-research',
        state: 'legacy_authoritative',
        epoch: 5,
        selectedWriter: 'legacy',
        candidateSha: null,
        policyVersion: 0,
        cutoverCertificateDigest: null,
        lastTransitionDigest: null,
        updatedAt: '2026-08-09T00:00:00Z',
      });
      const registry = new AuthorityRegistry(root);
      const outcome = registry.prepareCutover({
        mode: 'deep-research',
        expectedEpoch: 5,
        candidateSha: CANDIDATE_SHA,
        policyVersion: 1,
        at: '2026-08-09T00:05:00Z',
      });
      expect(outcome.resumed).toBe(false);
      expect(outcome.record.state).toBe('cutover_ready');
      expect(outcome.record.epoch).toBe(5);
      expect(outcome.record.selectedWriter).toBe('legacy');
      expect(outcome.record.candidateSha).toBe(CANDIDATE_SHA);
      expect(registry.read('deep-research').state).toBe('cutover_ready');
      expect(registry.read('deep-research').epoch).toBe(5);
    });

    it('resumes idempotently when called twice with identical input, without changing updatedAt', () => {
      const root = temporaryRoot('prepare-cutover-resume');
      seedAuthorityRecord(root, {
        schemaVersion: 1,
        mode: 'deep-research',
        state: 'legacy_authoritative',
        epoch: 5,
        selectedWriter: 'legacy',
        candidateSha: null,
        policyVersion: 0,
        cutoverCertificateDigest: null,
        lastTransitionDigest: null,
        updatedAt: '2026-08-09T00:00:00Z',
      });
      const registry = new AuthorityRegistry(root);
      const first = registry.prepareCutover({
        mode: 'deep-research',
        expectedEpoch: 5,
        candidateSha: CANDIDATE_SHA,
        policyVersion: 1,
        at: '2026-08-09T00:05:00Z',
      });
      expect(first.resumed).toBe(false);
      const second = registry.prepareCutover({
        mode: 'deep-research',
        expectedEpoch: 5,
        candidateSha: CANDIDATE_SHA,
        policyVersion: 1,
        at: '2026-08-09T00:10:00Z',
      });
      expect(second.resumed).toBe(true);
      expect(second.record.updatedAt).toBe(first.record.updatedAt);
    });

    it('throws CAS_CONFLICT when the record is not in the legacy_authoritative state', () => {
      const root = temporaryRoot('prepare-cutover-wrong-state');
      seedAuthorityRecord(root, {
        schemaVersion: 1,
        mode: 'deep-research',
        state: 'new_authoritative_reversible',
        epoch: 5,
        selectedWriter: 'dark',
        candidateSha: CANDIDATE_SHA,
        policyVersion: 1,
        cutoverCertificateDigest: digest('certificate'),
        lastTransitionDigest: digest('transition'),
        updatedAt: '2026-08-09T00:00:00Z',
      });
      const registry = new AuthorityRegistry(root);
      try {
        registry.prepareCutover({
          mode: 'deep-research',
          expectedEpoch: 5,
          candidateSha: CANDIDATE_SHA,
          policyVersion: 1,
          at: '2026-08-09T00:05:00Z',
        });
        throw new Error('expected prepareCutover to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(AuthorityFlipError);
        expect((error as AuthorityFlipError).reasonCode).toBe('CAS_CONFLICT');
      }
      expect(registry.read('deep-research').state).toBe('new_authoritative_reversible');
    });

    it('throws CAS_CONFLICT on an epoch mismatch', () => {
      const root = temporaryRoot('prepare-cutover-epoch-mismatch');
      seedAuthorityRecord(root, {
        schemaVersion: 1,
        mode: 'deep-research',
        state: 'legacy_authoritative',
        epoch: 5,
        selectedWriter: 'legacy',
        candidateSha: null,
        policyVersion: 0,
        cutoverCertificateDigest: null,
        lastTransitionDigest: null,
        updatedAt: '2026-08-09T00:00:00Z',
      });
      const registry = new AuthorityRegistry(root);
      try {
        registry.prepareCutover({
          mode: 'deep-research',
          expectedEpoch: 4,
          candidateSha: CANDIDATE_SHA,
          policyVersion: 1,
          at: '2026-08-09T00:05:00Z',
        });
        throw new Error('expected prepareCutover to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(AuthorityFlipError);
        expect((error as AuthorityFlipError).reasonCode).toBe('CAS_CONFLICT');
      }
      expect(registry.read('deep-research').state).toBe('legacy_authoritative');
      expect(registry.read('deep-research').epoch).toBe(5);
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // Reverse CAS: rollback actually restores durable authority
  // ─────────────────────────────────────────────────────────────────

  describe('compareAndSwapRollback', () => {
    it('admits a write at cutover_ready, flips forward, then rollback restores legacy at a new epoch and denies the stale dark epoch', () => {
      const root = temporaryRoot('rollback-restores');
      seedAuthorityRecord(root, cutoverReadyRecord('deep-research', 5));
      const registry = new AuthorityRegistry(root);

      // A canonical write is admitted at cutover_ready (legacy still routes).
      const preFlip = selectAuthorityRoute(registry.read('deep-research'), { mode: 'deep-research' });
      expect(preFlip).toMatchObject({ outcome: 'selected', route: 'legacy' });

      // Forward flip: legacy -> dark, epoch 5 -> 6.
      const flipped = registry.compareAndSwap({
        mode: 'deep-research',
        expectedState: 'cutover_ready',
        expectedEpoch: 5,
        nextSelectedWriter: 'dark',
        candidateSha: CANDIDATE_SHA,
        policyVersion: 1,
        cutoverCertificateDigest: digest('certificate'),
        lastTransitionDigest: digest('forward-transition'),
        at: '2026-08-09T00:10:00Z',
      });
      expect(flipped.record.state).toBe('new_authoritative_reversible');
      const darkDigest = flipped.record.recordDigest;
      const staleExpectation = { mode: 'deep-research' as const, expectedRecordDigest: darkDigest };

      // Rollback: dark -> legacy, epoch 6 -> 7, against the same registry.
      const rolledBack = registry.compareAndSwapRollback({
        mode: 'deep-research',
        expectedEpoch: 6,
        rollbackCertificateDigest: digest('rollback-certificate'),
        at: '2026-08-09T00:20:00Z',
      });
      expect(rolledBack.resumed).toBe(false);
      expect(rolledBack.record.state).toBe('legacy_authoritative');
      expect(rolledBack.record.epoch).toBe(7);
      expect(rolledBack.record.selectedWriter).toBe('legacy');

      // The selector reads legacy back at the new epoch from the same
      // durable registry the forward flip published to.
      const freshRecord = registry.read('deep-research');
      expect(freshRecord.epoch).toBe(7);
      const postRollback = selectAuthorityRoute(freshRecord, { mode: 'deep-research' });
      expect(postRollback).toMatchObject({ outcome: 'selected', route: 'legacy', epoch: 7 });

      // A caller still holding the pre-rollback dark-authoritative record
      // digest (a stale lease) is denied rather than silently admitted.
      const staleWrite = selectAuthorityRoute(freshRecord, staleExpectation);
      expect(staleWrite).toEqual({ outcome: 'denied', reasonCode: 'RECORD_DIGEST_MISMATCH' });
    });

    it('rejects a rollback whose expected epoch/state no longer matches the durable record', () => {
      const root = temporaryRoot('rollback-conflict');
      // Default record is legacy_authoritative@1, never flipped forward.
      const registry = new AuthorityRegistry(root);
      expect(() => registry.compareAndSwapRollback({
        mode: 'deep-research',
        expectedEpoch: 1,
        rollbackCertificateDigest: digest('rollback-certificate'),
        at: '2026-08-09T00:20:00Z',
      })).toThrow(AuthorityFlipError);
      expect(registry.read('deep-research').state).toBe('legacy_authoritative');
    });

    it('resumes from a crash-stranded rollback_pending and completes the second write deterministically', () => {
      const root = temporaryRoot('rollback-resume-pending');
      const registry = new AuthorityRegistry(root);
      // Simulate a hard death between the two rollback writes: the durable
      // record is stranded at rollback_pending, exactly what the first
      // write of `compareAndSwapRollback` would leave behind.
      seedAuthorityRecord(root, {
        schemaVersion: 1,
        mode: 'deep-research',
        state: 'rollback_pending',
        epoch: 6,
        selectedWriter: 'dark',
        candidateSha: CANDIDATE_SHA,
        policyVersion: 1,
        cutoverCertificateDigest: digest('certificate'),
        lastTransitionDigest: digest('rollback-certificate'),
        updatedAt: '2026-08-09T00:15:00Z',
      });

      // Admission stays fail-closed while stranded: neither writer is exposed.
      expect(selectAuthorityRoute(registry.read('deep-research'), { mode: 'deep-research' })).toEqual({
        outcome: 'denied', reasonCode: 'ACTIVE_TRANSACTION_CONFLICT',
      });

      const resumed = registry.compareAndSwapRollback({
        mode: 'deep-research',
        expectedEpoch: 6,
        rollbackCertificateDigest: digest('rollback-certificate'),
        at: '2026-08-09T00:25:00Z',
      });
      expect(resumed.resumed).toBe(true);
      expect(resumed.record.state).toBe('legacy_authoritative');
      expect(resumed.record.epoch).toBe(7);
      expect(selectAuthorityRoute(registry.read('deep-research'), { mode: 'deep-research' })).toMatchObject({
        outcome: 'selected', route: 'legacy',
      });
    });

    it('resumes idempotently when the rollback already fully completed', () => {
      const root = temporaryRoot('rollback-resume-final');
      const registry = new AuthorityRegistry(root);
      seedAuthorityRecord(root, {
        schemaVersion: 1,
        mode: 'deep-research',
        state: 'legacy_authoritative',
        epoch: 7,
        selectedWriter: 'legacy',
        candidateSha: CANDIDATE_SHA,
        policyVersion: 1,
        cutoverCertificateDigest: digest('certificate'),
        lastTransitionDigest: digest('rollback-certificate'),
        updatedAt: '2026-08-09T00:25:00Z',
      });
      const resumed = registry.compareAndSwapRollback({
        mode: 'deep-research',
        expectedEpoch: 6,
        rollbackCertificateDigest: digest('rollback-certificate'),
        at: '2026-08-09T00:30:00Z',
      });
      expect(resumed.resumed).toBe(true);
      expect(resumed.record.epoch).toBe(7);
      expect(resumed.record.updatedAt).toBe('2026-08-09T00:25:00Z');
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // Stale-lock reclaim
  // ─────────────────────────────────────────────────────────────────

  describe('stale-lock reclaim', () => {
    function deadPid(): number {
      // A real, previously valid PID that has already exited — the most
      // portable way to obtain a guaranteed-dead PID for an ESRCH check.
      const child = spawnSync(process.execPath, ['-e', 'process.exit(0)']);
      const pid = child.pid;
      if (typeof pid !== 'number' || pid <= 0) throw new Error('failed to obtain a dead pid fixture');
      return pid;
    }

    it('reclaims a transaction lock left by a process that no longer exists', async () => {
      const root = temporaryRoot('stale-lock-dead-pid');
      const registry = new AuthorityRegistry(root);
      writeFileSync(
        join(root, 'authority-flip-transaction.lock'),
        JSON.stringify({ pid: deadPid(), acquiredAt: '2026-08-09T00:00:00Z' }),
      );
      const result = await registry.withTransactionLock(async () => 'reclaimed');
      expect(result).toBe('reclaimed');
    });

    it('reclaims a transaction lock older than the stale-lock TTL even if its owner pid is still alive', async () => {
      const root = temporaryRoot('stale-lock-ttl');
      const now = new Date('2026-08-09T01:00:00Z');
      // A 1ms TTL constructor makes any pre-existing lock file immediately stale.
      const registry = new AuthorityRegistry(root, () => now, 1);
      writeFileSync(
        join(root, 'authority-flip-transaction.lock'),
        JSON.stringify({ pid: process.pid, acquiredAt: '2026-08-09T00:00:00Z' }),
      );
      const result = await registry.withTransactionLock(async () => 'reclaimed');
      expect(result).toBe('reclaimed');
    });

    it('does not reclaim a live, non-stale transaction lock (no regression on the existing fail-fast conflict contract)', async () => {
      const root = temporaryRoot('stale-lock-live');
      const registry = new AuthorityRegistry(root);
      writeFileSync(
        join(root, 'authority-flip-transaction.lock'),
        JSON.stringify({ pid: process.pid, acquiredAt: new Date().toISOString() }),
      );
      await expect(registry.withTransactionLock(async () => 'should-not-run')).rejects.toThrow(AuthorityFlipError);
    });

    it('does not auto-reclaim a malformed lock file (fails loud rather than displacing an unknown holder)', async () => {
      const root = temporaryRoot('stale-lock-malformed');
      const registry = new AuthorityRegistry(root);
      writeFileSync(join(root, 'authority-flip-transaction.lock'), 'not-json');
      await expect(registry.withTransactionLock(async () => 'should-not-run')).rejects.toThrow(AuthorityFlipError);
    });

    it('reclaims a per-mode CAS lock left by a dead process, so a stranded forward flip is still completable', () => {
      const root = temporaryRoot('stale-lock-per-mode');
      seedAuthorityRecord(root, cutoverReadyRecord('deep-research', 5));
      const registry = new AuthorityRegistry(root);
      writeFileSync(
        join(root, 'authority-deep-research.lock'),
        JSON.stringify({ pid: deadPid(), acquiredAt: '2026-08-09T00:00:00Z' }),
      );
      const outcome = registry.compareAndSwap({
        mode: 'deep-research',
        expectedState: 'cutover_ready',
        expectedEpoch: 5,
        nextSelectedWriter: 'dark',
        candidateSha: CANDIDATE_SHA,
        policyVersion: 1,
        cutoverCertificateDigest: digest('certificate'),
        lastTransitionDigest: digest('transition'),
        at: '2026-08-09T00:10:00Z',
      });
      expect(outcome.record.state).toBe('new_authoritative_reversible');
    });
  });
});
