// ───────────────────────────────────────────────────────────────────
// MODULE: Per-Mode Authority Flip Tests
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
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
  });
});
