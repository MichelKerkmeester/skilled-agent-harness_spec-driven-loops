// ───────────────────────────────────────────────────────────────────
// MODULE: Independent Authority Verifier CLI Tests
// ───────────────────────────────────────────────────────────────────
//
// The verifier is the tool an operator runs to decide whether the authority
// flip is complete, and it reads each mode's record straight from disk by
// design (no flip-runner code in the path). A verifier that has never been
// shown a stored record, a missing record or a malformed one is only a claim
// about itself, so these cases spawn the real CLI against real files and
// assert the real process exit code and JSON.

import { afterEach, describe, expect, it } from 'vitest';
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = resolve(here, '..', '..', 'scripts', 'verify-authority.cjs');

// The verifier walks the frozen cutover order; keep the fixture's mode list
// explicit so a mode added to the real order without a fixture record shows up
// as a default-source record instead of silently passing.
const MODES = [
  'deep-research',
  'deep-review',
  'deep-ai-council',
  'deep-improvement-common',
  'agent-improvement',
  'model-benchmark',
];

const dirs: string[] = [];

afterEach(() => {
  while (dirs.length > 0) {
    const dir = dirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

function freshAuthRoot(): string {
  const dir = mkdtempSync(join(tmpdir(), 'verify-authority-'));
  dirs.push(dir);
  const authRoot = join(dir, 'authority');
  mkdirSync(authRoot, { recursive: true });
  return authRoot;
}

function writeRecord(
  authRoot: string,
  mode: string,
  state: string,
  selectedWriter?: string,
): void {
  const core = {
    schemaVersion: 1,
    mode,
    state,
    epoch: 1,
    selectedWriter: selectedWriter
      ?? (state === 'new_authoritative_reversible' || state === 'new_authoritative_final'
        ? 'dark'
        : 'legacy'),
    candidateSha: null,
    policyVersion: 0,
    cutoverCertificateDigest: null,
    lastTransitionDigest: null,
    updatedAt: new Date('2026-08-19T12:00:00Z').toISOString(),
  };
  const record = { ...core, recordDigest: sha256Bytes(canonicalBytes(core)) };
  writeFileSync(join(authRoot, `authority-${mode}.json`), JSON.stringify(record, null, 2));
}

function writeAll(authRoot: string, state: string, selectedWriter?: string): void {
  for (const mode of MODES) writeRecord(authRoot, mode, state, selectedWriter);
}

interface RunResult {
  readonly exit: number | null;
  readonly stdout: string;
  readonly j: Record<string, unknown>;
}

function run(...args: string[]): RunResult {
  // The CLI re-execs itself through tsx unless this marker is present; the
  // test process must decide that, not inherit it from an outer runtime.
  const env = { ...process.env };
  delete env.DEEP_LOOP_TSX_LOADED;
  const r = spawnSync(process.execPath, [CLI_PATH, ...args], { encoding: 'utf8', env });
  const stdout = r.stdout || '';
  const last = stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) ?? '{}';
  let j: Record<string, unknown> = {};
  try {
    j = JSON.parse(last) as Record<string, unknown>;
  } catch {
    j = { raw: last, stderr: r.stderr };
  }
  return { exit: r.status, stdout, j };
}

function records(j: Record<string, unknown>): Record<string, unknown>[] {
  return (j.records as Record<string, unknown>[]) ?? [];
}

describe('verify-authority CLI', () => {
  it('reports all modes on ledger for stored final records', () => {
    const authRoot = freshAuthRoot();
    writeAll(authRoot, 'new_authoritative_final');
    const r = run('--authority-root', authRoot);
    expect(r.exit).toBe(0);
    expect(r.j.allOnLedger).toBe(true);
    expect(r.j.authorityRoot).toBe(authRoot);
    expect(records(r.j)).toHaveLength(MODES.length);
    expect(records(r.j).every((rec) => rec.source === 'stored'
      && rec.state === 'new_authoritative_final'
      && rec.selectedWriter === 'dark')).toBe(true);
  });

  it('counts the reversible tier as enabled too', () => {
    const authRoot = freshAuthRoot();
    writeAll(authRoot, 'new_authoritative_reversible');
    const r = run('--authority-root', authRoot);
    expect(r.exit).toBe(0);
    expect(r.j.allOnLedger).toBe(true);
  });

  it('reports missing records as synthesized defaults and exits 2', () => {
    const authRoot = freshAuthRoot();
    const r = run('--authority-root', authRoot);
    expect(r.exit).toBe(2);
    expect(r.j.allOnLedger).toBe(false);
    expect(records(r.j)).toHaveLength(MODES.length);
    expect(records(r.j).every((rec) => rec.source === 'default'
      && rec.state === 'legacy_authoritative'
      && rec.selectedWriter === 'legacy')).toBe(true);
  });

  it('reports a malformed record instead of treating it as legacy', () => {
    const authRoot = freshAuthRoot();
    writeAll(authRoot, 'new_authoritative_final');
    writeFileSync(join(authRoot, 'authority-deep-review.json'), '{ not json');
    const r = run('--authority-root', authRoot);
    expect(r.exit).toBe(2);
    expect(r.j.allOnLedger).toBe(false);
    expect(records(r.j).find((rec) => rec.mode === 'deep-review')).toMatchObject({
      source: 'malformed',
    });
  });

  it('does not call a stored ledger state enabled while the writer is still legacy', () => {
    const authRoot = freshAuthRoot();
    writeAll(authRoot, 'new_authoritative_final', 'legacy');
    const r = run('--authority-root', authRoot);
    expect(r.exit).toBe(2);
    expect(r.j.allOnLedger).toBe(false);
  });

  it('exits 2 when one mode is still on the default record', () => {
    const authRoot = freshAuthRoot();
    writeAll(authRoot, 'new_authoritative_final');
    rmSync(join(authRoot, 'authority-model-benchmark.json'));
    const r = run('--authority-root', authRoot);
    expect(r.exit).toBe(2);
    expect(r.j.allOnLedger).toBe(false);
    expect(records(r.j).find((rec) => rec.mode === 'model-benchmark')).toMatchObject({
      source: 'default',
      state: 'legacy_authoritative',
    });
  });

  it('prints help and exits 0', () => {
    const r = run('--help');
    expect(r.exit).toBe(0);
    expect(r.stdout).toContain('Independent Authority Verifier');
  });

  it('rejects an unknown flag with a machine-readable argument error', () => {
    const authRoot = freshAuthRoot();
    const r = run('--authority-root', authRoot, '--bogus');
    expect(r.exit).toBe(1);
    expect(r.j.code).toBe('UNKNOWN_ARGUMENT');
  });

  it('rejects a positional argument before touching any authority root', () => {
    const r = run('nonsense');
    expect(r.exit).toBe(1);
    expect(r.j.code).toBe('ARG_PARSE_ERROR');
  });

  it('requires a value for --authority-root', () => {
    const r = run('--authority-root');
    expect(r.exit).toBe(1);
    expect(r.j.code).toBe('ARG_VALUE_REQUIRED');
  });
});
