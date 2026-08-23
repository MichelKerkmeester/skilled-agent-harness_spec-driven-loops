// ───────────────────────────────────────────────────────────────────
// MODULE: Authority Finalize (window-free reversible -> final) Tests
// ───────────────────────────────────────────────────────────────────
//
// Covers the window-free finalize CAS edge
// `new_authoritative_reversible(epoch N) -> new_authoritative_final(epoch N+1)`
// and the flip-runner `--finalize` path. Finalize is window-free by
// operator decision: no rollback window, drill, or certificate
// precondition is required or simulated. The digests are content
// bindings over the actual transition facts, not gate receipts.

import 'tsx';

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';
import { writeCanonicalJsonAtomic } from '../../lib/locks-and-fencing/durable-file.js';
import {
  AuthorityFlipError,
  AuthorityRegistry,
  AUTHORITY_FLIP_MODE_ORDER,
  isValidAuthorityRecord,
  selectAuthorityRoute,
} from '../../lib/per-mode-authority-flip/index.js';

import type { AuthorityRecord, CutoverCertificateMode } from '../../lib/per-mode-authority-flip/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const FLIP_CLI = resolve(here, '..', '..', 'scripts', 'flip-authority.cjs');

const CANDIDATE_SHA = 'a'.repeat(40);
const MODE: CutoverCertificateMode = 'deep-research';

const temporaryRoots: string[] = [];

afterEach(() => {
  while (temporaryRoots.length > 0) {
    const root = temporaryRoots.pop();
    if (root) rmSync(root, { recursive: true, force: true });
  }
});

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `authority-finalize-${label}-`));
  temporaryRoots.push(root);
  return root;
}

/** Writes an authority record file with the exact schema/digest the registry itself would produce. */
function seedAuthorityRecord(root: string, record: Omit<AuthorityRecord, 'recordDigest'>): AuthorityRecord {
  const full: AuthorityRecord = Object.freeze({
    ...record,
    recordDigest: sha256Bytes(canonicalBytes(record as never)),
  });
  writeCanonicalJsonAtomic(join(root, `authority-${record.mode}.json`), full as never);
  return full;
}

/** A record sitting at new_authoritative_reversible/dark, the finalize pre-state. */
function reversibleRecord(mode: CutoverCertificateMode, epoch: number): Omit<AuthorityRecord, 'recordDigest'> {
  return {
    schemaVersion: 1,
    mode,
    state: 'new_authoritative_reversible',
    epoch,
    selectedWriter: 'dark',
    candidateSha: CANDIDATE_SHA,
    policyVersion: 1,
    cutoverCertificateDigest: sha256Bytes(canonicalBytes({ kind: 'forward-cutover', mode, epoch } as never)),
    lastTransitionDigest: sha256Bytes(canonicalBytes({ kind: 'forward-transition', mode, epoch } as never)),
    updatedAt: '2026-08-22T00:00:00Z',
  };
}

// ───────────────────────────────────────────────────────────────────
// 1. REGISTRY: compareAndSwapFinalize
// ───────────────────────────────────────────────────────────────────

describe('AuthorityRegistry.compareAndSwapFinalize', () => {
  it('lands a reversible/dark record at final/dark/epoch N+1 with a valid recomputed integrity digest', () => {
    const root = temporaryRoot('finalize-success');
    seedAuthorityRecord(root, reversibleRecord('deep-research', 6));
    const registry = new AuthorityRegistry(root);

    const finalizeFacts = {
      mode: 'deep-research',
      finalizePath: 'registry-direct',
      fromState: 'new_authoritative_reversible',
      toState: 'new_authoritative_final',
      fromEpoch: 6,
      toEpoch: 7,
      selectedWriter: 'dark',
      candidateSha: CANDIDATE_SHA,
      policyVersion: 1,
      rollbackWindowRequired: false,
    };
    const cutoverCertificateDigest = sha256Bytes(canonicalBytes(finalizeFacts as never));
    const lastTransitionDigest = sha256Bytes(canonicalBytes({ ...finalizeFacts, at: '2026-08-22T00:10:00Z' } as never));

    const outcome = registry.compareAndSwapFinalize({
      mode: 'deep-research',
      expectedState: 'new_authoritative_reversible',
      expectedEpoch: 6,
      candidateSha: CANDIDATE_SHA,
      policyVersion: 1,
      cutoverCertificateDigest,
      lastTransitionDigest,
      at: '2026-08-22T00:10:00Z',
    });

    expect(outcome.resumed).toBe(false);
    expect(outcome.record.state).toBe('new_authoritative_final');
    expect(outcome.record.epoch).toBe(7);
    expect(outcome.record.selectedWriter).toBe('dark');

    // The on-disk record reads back cleanly and passes the tamper-evident
    // integrity check (the digest is recomputed by the selector).
    const onDisk = registry.read('deep-research');
    expect(onDisk.state).toBe('new_authoritative_final');
    expect(onDisk.epoch).toBe(7);
    expect(onDisk.selectedWriter).toBe('dark');
    expect(isValidAuthorityRecord(onDisk)).toBe(true);

    // The selector routes final to dark with no shadow route.
    const route = selectAuthorityRoute(onDisk, { mode: 'deep-research' });
    expect(route).toMatchObject({ outcome: 'selected', route: 'dark', shadowRoute: null });
  });

  it('denies a wrong-epoch finalize with CAS_CONFLICT and leaves the on-disk record byte-identical', () => {
    const root = temporaryRoot('finalize-wrong-epoch');
    seedAuthorityRecord(root, reversibleRecord('deep-research', 6));
    const registry = new AuthorityRegistry(root);
    const recordPath = join(root, 'authority-deep-research.json');
    const before = readFileSync(recordPath);

    const finalizeFacts = {
      mode: 'deep-research',
      finalizePath: 'registry-direct',
      fromState: 'new_authoritative_reversible',
      toState: 'new_authoritative_final',
      fromEpoch: 5,
      toEpoch: 6,
      selectedWriter: 'dark',
      candidateSha: CANDIDATE_SHA,
      policyVersion: 1,
      rollbackWindowRequired: false,
    };
    const cutoverCertificateDigest = sha256Bytes(canonicalBytes(finalizeFacts as never));
    const lastTransitionDigest = sha256Bytes(canonicalBytes({ ...finalizeFacts, at: '2026-08-22T00:10:00Z' } as never));

    // Expected epoch 5, but the record is at epoch 6 — a stale caller.
    let thrown: unknown;
    try {
      registry.compareAndSwapFinalize({
        mode: 'deep-research',
        expectedState: 'new_authoritative_reversible',
        expectedEpoch: 5,
        candidateSha: CANDIDATE_SHA,
        policyVersion: 1,
        cutoverCertificateDigest,
        lastTransitionDigest,
        at: '2026-08-22T00:10:00Z',
      });
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(AuthorityFlipError);
    expect((thrown as AuthorityFlipError).reasonCode).toBe('CAS_CONFLICT');

    // Nothing was written: the on-disk bytes are unchanged.
    const after = readFileSync(recordPath);
    expect(after.equals(before)).toBe(true);

    // The record is still reversible at epoch 6.
    const record = registry.read('deep-research');
    expect(record.state).toBe('new_authoritative_reversible');
    expect(record.epoch).toBe(6);
  });

  it('denies a finalize whose expected state does not match the current record', () => {
    const root = temporaryRoot('finalize-wrong-state');
    // Default record is legacy_authoritative@1, not reversible.
    const registry = new AuthorityRegistry(root);

    let thrown: unknown;
    try {
      registry.compareAndSwapFinalize({
        mode: 'deep-research',
        expectedState: 'new_authoritative_reversible',
        expectedEpoch: 1,
        candidateSha: CANDIDATE_SHA,
        policyVersion: 1,
        cutoverCertificateDigest: sha256Bytes(canonicalBytes('finalize-cert' as never)),
        lastTransitionDigest: sha256Bytes(canonicalBytes('finalize-transition' as never)),
        at: '2026-08-22T00:10:00Z',
      });
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(AuthorityFlipError);
    expect((thrown as AuthorityFlipError).reasonCode).toBe('CAS_CONFLICT');
    expect(registry.read('deep-research').state).toBe('legacy_authoritative');
  });

  it('resumes idempotently when the record already reflects the exact finalize target', () => {
    const root = temporaryRoot('finalize-resume');
    seedAuthorityRecord(root, reversibleRecord('deep-research', 6));
    const registry = new AuthorityRegistry(root);

    const finalizeFacts = {
      mode: 'deep-research',
      finalizePath: 'registry-direct',
      fromState: 'new_authoritative_reversible',
      toState: 'new_authoritative_final',
      fromEpoch: 6,
      toEpoch: 7,
      selectedWriter: 'dark',
      candidateSha: CANDIDATE_SHA,
      policyVersion: 1,
      rollbackWindowRequired: false,
    };
    const cutoverCertificateDigest = sha256Bytes(canonicalBytes(finalizeFacts as never));
    const lastTransitionDigest = sha256Bytes(canonicalBytes({ ...finalizeFacts, at: '2026-08-22T00:10:00Z' } as never));

    const first = registry.compareAndSwapFinalize({
      mode: 'deep-research',
      expectedState: 'new_authoritative_reversible',
      expectedEpoch: 6,
      candidateSha: CANDIDATE_SHA,
      policyVersion: 1,
      cutoverCertificateDigest,
      lastTransitionDigest,
      at: '2026-08-22T00:10:00Z',
    });
    expect(first.resumed).toBe(false);

    // A second call with the same expected pre-state fails the literal
    // precondition (the record already moved), but because it already
    // reflects the exact same target and digests, this is the resume
    // path rather than a genuine conflict.
    const second = registry.compareAndSwapFinalize({
      mode: 'deep-research',
      expectedState: 'new_authoritative_reversible',
      expectedEpoch: 6,
      candidateSha: CANDIDATE_SHA,
      policyVersion: 1,
      cutoverCertificateDigest,
      lastTransitionDigest,
      at: '2026-08-22T00:20:00Z',
    });
    expect(second.resumed).toBe(true);
    expect(second.record.epoch).toBe(7);
    expect(second.record.updatedAt).toBe(first.record.updatedAt);
  });
});

// ───────────────────────────────────────────────────────────────────
// 2. FLIP RUNNER: finalizeOneMode (in-process, behind COMMIT_CAS gate)
// ───────────────────────────────────────────────────────────────────

describe('flip-authority.cjs — finalizeOneMode', () => {
  it('finalizes a reversible/dark record to final/dark on disk when the CAS is committed', async () => {
    const root = temporaryRoot('runner-finalize-commit');
    seedAuthorityRecord(root, reversibleRecord('deep-research', 2));

    const { createRequire } = require('node:module');
    const requireFromTest = createRequire(import.meta.url);
    const { finalizeOneMode } = requireFromTest(FLIP_CLI) as {
      finalizeOneMode: (registry: unknown, mode: string) => Promise<Record<string, unknown>>;
    };
    const { AuthorityRegistry: RegistryCtor } = requireFromTest('../../lib/per-mode-authority-flip/index.ts') as {
      AuthorityRegistry: new (root: string) => unknown;
    };

    const registry = new RegistryCtor(root);
    const outcome = await finalizeOneMode(registry, 'deep-research');

    expect(outcome.result).toBe('finalized');
    expect(outcome.to).toMatchObject({ state: 'new_authoritative_final', epoch: 3, selectedWriter: 'dark' });

    // Assert against the filesystem, not the runner's report.
    const record = JSON.parse(readFileSync(join(root, 'authority-deep-research.json'), 'utf8')) as Record<string, unknown>;
    expect(record.state).toBe('new_authoritative_final');
    expect(record.epoch).toBe(3);
    expect(record.selectedWriter).toBe('dark');
  });

  it('reports already-final and writes nothing when the record is already final', async () => {
    const root = temporaryRoot('runner-finalize-already');
    seedAuthorityRecord(root, {
      ...reversibleRecord('deep-research', 2),
      state: 'new_authoritative_final',
      epoch: 3,
    });
    const recordPath = join(root, 'authority-deep-research.json');
    const before = readFileSync(recordPath);

    const { createRequire } = require('node:module');
    const requireFromTest = createRequire(import.meta.url);
    const { finalizeOneMode } = requireFromTest(FLIP_CLI) as {
      finalizeOneMode: (registry: unknown, mode: string) => Promise<Record<string, unknown>>;
    };
    const { AuthorityRegistry: RegistryCtor } = requireFromTest('../../lib/per-mode-authority-flip/index.ts') as {
      AuthorityRegistry: new (root: string) => unknown;
    };

    const registry = new RegistryCtor(root);
    const outcome = await finalizeOneMode(registry, 'deep-research');

    expect(outcome.result).toBe('already-final');
    // The on-disk bytes are unchanged.
    const after = readFileSync(recordPath);
    expect(after.equals(before)).toBe(true);
  });

  it('reports a controlled failure and leaves the record reversible when the CAS is disabled', async () => {
    const root = temporaryRoot('runner-finalize-cas-disabled');
    seedAuthorityRecord(root, reversibleRecord('deep-research', 2));
    const recordPath = join(root, 'authority-deep-research.json');
    const before = readFileSync(recordPath);

    const { createRequire } = require('node:module');
    const requireFromTest = createRequire(import.meta.url);
    const { finalizeOneMode, __setCommitCas } = requireFromTest(FLIP_CLI) as {
      finalizeOneMode: (registry: unknown, mode: string) => Promise<Record<string, unknown>>;
      __setCommitCas: (value: boolean) => void;
    };
    const { AuthorityRegistry: RegistryCtor } = requireFromTest('../../lib/per-mode-authority-flip/index.ts') as {
      AuthorityRegistry: new (root: string) => unknown;
    };

    __setCommitCas(false);
    let outcome: Record<string, unknown>;
    try {
      const registry = new RegistryCtor(root);
      outcome = await finalizeOneMode(registry, 'deep-research');
    } finally {
      // Restore immediately so a trap or later test never sees the
      // disabled state. The negative control is bounded to this block.
      __setCommitCas(true);
    }

    expect(outcome!.result).toBe('cas-disabled');
    expect(outcome!.reasonCode).toBe('CAS_DISABLED');

    // The record must still be reversible — the finalize did not land.
    const record = JSON.parse(readFileSync(recordPath, 'utf8')) as Record<string, unknown>;
    expect(record.state).toBe('new_authoritative_reversible');
    expect(record.selectedWriter).toBe('dark');
    expect(record.epoch).toBe(2);
    // Nothing was written: the on-disk bytes are unchanged.
    const after = readFileSync(recordPath);
    expect(after.equals(before)).toBe(true);
  });

  it('reports a controlled failure for a record that is not reversible/dark', async () => {
    const root = temporaryRoot('runner-finalize-not-reversible');
    // A legacy record cannot be finalized directly.
    const { createRequire } = require('node:module');
    const requireFromTest = createRequire(import.meta.url);
    const { finalizeOneMode } = requireFromTest(FLIP_CLI) as {
      finalizeOneMode: (registry: unknown, mode: string) => Promise<Record<string, unknown>>;
    };
    const { AuthorityRegistry: RegistryCtor } = requireFromTest('../../lib/per-mode-authority-flip/index.ts') as {
      AuthorityRegistry: new (root: string) => unknown;
    };

    const registry = new RegistryCtor(root);
    const outcome = await finalizeOneMode(registry, 'deep-research');

    expect(outcome.result).toBe('failed');
    expect(outcome.reasonCode).toBe('CAS_CONFLICT');
  });
});

// ───────────────────────────────────────────────────────────────────
// 3. FLIP RUNNER: --finalize --dry-run (writes nothing)
// ───────────────────────────────────────────────────────────────────

describe('flip-authority.cjs --finalize --dry-run', () => {
  function runCli(script: string, args: string[]): { exitCode: number | null; json: Record<string, unknown> } {
    const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
    const stdout = (result.stdout ?? '').trim();
    const lastLine = stdout.split(/\r?\n/).filter(Boolean).at(-1) ?? '{}';
    let json: Record<string, unknown> = {};
    try {
      json = JSON.parse(lastLine);
    } catch {
      json = { raw: lastLine };
    }
    return { exitCode: result.status, json };
  }

  it('plans a finalize for every reversible mode and writes nothing', () => {
    const root = temporaryRoot('finalize-dry-run-plan');
    // Seed all 8 modes at reversible/dark/epoch 2 (the post-flip state).
    for (const modeName of AUTHORITY_FLIP_MODE_ORDER) {
      seedAuthorityRecord(root, reversibleRecord(modeName, 2));
    }

    const { exitCode, json } = runCli(FLIP_CLI, ['--authority-root', root, '--finalize', '--dry-run']);
    expect(exitCode).toBe(0);
    expect(json.ok).toBe(true);
    expect(json.mode).toBe('finalize-dry-run');
    const plan = json.plan as Record<string, unknown>[];
    expect(plan.length).toBe(8);
    expect(plan.every((p) => p.result === 'would-finalize')).toBe(true);
    // Every planned target is final at epoch 3.
    for (const entry of plan) {
      const to = entry.to as Record<string, unknown>;
      expect(to.state).toBe('new_authoritative_final');
      expect(to.epoch).toBe(3);
      expect(to.selectedWriter).toBe('dark');
    }
    // A dry run must not mutate any record file.
    for (const modeName of AUTHORITY_FLIP_MODE_ORDER) {
      const record = JSON.parse(readFileSync(join(root, `authority-${modeName}.json`), 'utf8')) as Record<string, unknown>;
      expect(record.state).toBe('new_authoritative_reversible');
      expect(record.epoch).toBe(2);
    }
  });

  it('reports already-final for a finalized mode and writes nothing', () => {
    const root = temporaryRoot('finalize-dry-run-already');
    for (const modeName of AUTHORITY_FLIP_MODE_ORDER) {
      seedAuthorityRecord(root, {
        ...reversibleRecord(modeName, 2),
        state: 'new_authoritative_final',
        epoch: 3,
      });
    }

    const { exitCode, json } = runCli(FLIP_CLI, ['--authority-root', root, '--finalize', '--dry-run']);
    expect(exitCode).toBe(0);
    expect(json.mode).toBe('finalize-dry-run');
    const plan = json.plan as Record<string, unknown>[];
    expect(plan.every((p) => p.result === 'already-final')).toBe(true);
    expect(json.allFlipped).toBe(true);
  });

  it('writes nothing when the authority root does not exist', () => {
    const root = temporaryRoot('finalize-dry-run-empty');
    const authority = join(root, 'authority');

    const { exitCode, json } = runCli(FLIP_CLI, ['--authority-root', authority, '--finalize', '--dry-run']);
    expect(exitCode).toBe(0);
    const plan = json.plan as Record<string, unknown>[];
    expect(plan.length).toBe(8);
    // A non-existent root reads as default legacy, which is not reversible.
    expect(plan.every((p) => p.result === 'not-reversible')).toBe(true);
    expect(existsSync(authority)).toBe(false);
  });
});
