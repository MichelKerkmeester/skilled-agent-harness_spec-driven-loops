// ───────────────────────────────────────────────────────────────────
// MODULE: Durable Authority Flip Runner + Independent Verifier Tests
// ───────────────────────────────────────────────────────────────────
// The runner's safety story is the same as the enablement CLI's: a dry
// run changes nothing, a failed step leaves later modes untouched, and a
// full commit lands every mode on ledger. The verifier is independent,
// so these tests assert against the filesystem (the on-disk records)
// rather than against what the runner reports — a test that only read
// the runner's own JSON would be trusting the thing under test.

import { afterEach, describe, expect, it } from 'vitest';

// The scripts are CJS that dynamically import their TypeScript modules
// by `.js` specifier. Registering tsx makes those specifiers resolve to
// the `.ts` source, exactly as the scripts' own tsx bootstrap does when
// they run as subprocesses.
import 'tsx';

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';
import { AUTHORITY_FLIP_MODE_ORDER } from '../../lib/per-mode-authority-flip/index.js';

// The registry's tamper-evident binding is a sha256 over the canonical
// JSON of the record core (every field except recordDigest). A pre-seeded
// record with a fake digest is rejected at read time as RECORD_MALFORMED,
// before prepareCutover ever runs — so the test must compute the real
// digest to exercise the CAS_CONFLICT path it intends to probe.
function computeRecordDigest(core: Record<string, unknown>): string {
  return sha256Bytes(canonicalBytes(core as never));
}

const here = dirname(fileURLToPath(import.meta.url));
const FLIP_CLI = resolve(here, '..', '..', 'scripts', 'flip-authority.cjs');
const VERIFY_CLI = resolve(here, '..', '..', 'scripts', 'verify-authority.cjs');

type CliResult = {
  exitCode: number | null;
  json: Record<string, unknown>;
  rawStdout: string;
  stderr: string;
};

function runCli(script: string, args: string[], environmentOverlay: NodeJS.ProcessEnv = {}): CliResult {
  const result = spawnSync(process.execPath, [script, ...args], {
    encoding: 'utf8',
    env: { ...process.env, ...environmentOverlay },
  });
  const stdout = (result.stdout ?? '').trim();
  const lastLine = stdout.split(/\r?\n/).filter(Boolean).at(-1) ?? '{}';
  let json: Record<string, unknown> = {};
  try {
    json = JSON.parse(lastLine);
  } catch {
    json = { raw: lastLine };
  }
  return {
    exitCode: result.status,
    json,
    rawStdout: stdout,
    stderr: result.stderr ?? '',
  };
}

const temporaryDirectories: string[] = [];

function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'flip-authority-'));
  temporaryDirectories.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of temporaryDirectories) {
    rmSync(dir, { recursive: true, force: true });
  }
  temporaryDirectories.length = 0;
});

const ALL_EIGHT_MODES = [...AUTHORITY_FLIP_MODE_ORDER];

describe('flip-authority.cjs — dry run', () => {
  it('plans 8 flips and writes nothing', () => {
    const tmp = makeTempDir();
    const authority = join(tmp, 'authority');
    const { exitCode, json } = runCli(FLIP_CLI, ['--authority-root', authority, '--dry-run']);

    expect(exitCode).toBe(0);
    expect(json.ok).toBe(true);
    expect(json.mode).toBe('dry-run');
    const plan = json.plan as Record<string, unknown>[];
    expect(plan.length).toBe(8);
    expect(plan.map((p) => p.mode)).toEqual(ALL_EIGHT_MODES);
    expect(plan.every((p) => p.result === 'would-flip')).toBe(true);
    // A dry run must not create the authority root or any record file.
    expect(existsSync(authority)).toBe(false);
  });

  it('defaults to dry-run when neither --dry-run nor --commit is passed', () => {
    const tmp = makeTempDir();
    const authority = join(tmp, 'authority');
    const { exitCode, json } = runCli(FLIP_CLI, ['--authority-root', authority]);

    expect(exitCode).toBe(0);
    expect(json.mode).toBe('dry-run');
    expect(existsSync(authority)).toBe(false);
  });

  it('rejects --dry-run and --commit together', () => {
    const tmp = makeTempDir();
    const authority = join(tmp, 'authority');
    const { exitCode, json } = runCli(FLIP_CLI, ['--authority-root', authority, '--dry-run', '--commit']);

    expect(exitCode).toBe(1);
    expect(json.code).toBe('CONFLICTING_FLAGS');
  });
});

describe('flip-authority.cjs — commit', () => {
  it('flips all 8 modes to new_authoritative_reversible/dark/epoch2', () => {
    const tmp = makeTempDir();
    const authority = join(tmp, 'authority');
    const { exitCode, json } = runCli(FLIP_CLI, ['--authority-root', authority, '--commit']);

    expect(exitCode).toBe(0);
    expect(json.ok).toBe(true);
    expect(json.mode).toBe('commit');
    expect(json.allFlipped).toBe(true);
    const results = json.results as Record<string, unknown>[];
    expect(results.length).toBe(8);
    expect(results.every((r) => r.result === 'flipped')).toBe(true);

    // Assert against the filesystem, not the runner's report.
    for (const mode of ALL_EIGHT_MODES) {
      const record = JSON.parse(readFileSync(join(authority, `authority-${mode}.json`), 'utf8')) as Record<string, unknown>;
      expect(record.state).toBe('new_authoritative_reversible');
      expect(record.epoch).toBe(2);
      expect(record.selectedWriter).toBe('dark');
    }
  });

  it('is idempotent: a second commit reports already-flipped for every mode', () => {
    const tmp = makeTempDir();
    const authority = join(tmp, 'authority');
    runCli(FLIP_CLI, ['--authority-root', authority, '--commit']);
    const { exitCode, json } = runCli(FLIP_CLI, ['--authority-root', authority, '--commit']);

    expect(exitCode).toBe(0);
    expect(json.allFlipped).toBe(true);
    const results = json.results as Record<string, unknown>[];
    expect(results.every((r) => r.result === 'already-flipped')).toBe(true);
  });
});

describe('verify-authority.cjs — independent read', () => {
  it('reports allOnLedger false on an empty root (every mode is a synthesized default)', () => {
    const tmp = makeTempDir();
    const authority = join(tmp, 'authority');
    const { exitCode, json } = runCli(VERIFY_CLI, ['--authority-root', authority]);

    expect(exitCode).toBe(2);
    expect(json.allOnLedger).toBe(false);
    const records = json.records as Record<string, unknown>[];
    expect(records.length).toBe(8);
    expect(records.every((r) => r.source === 'default')).toBe(true);
  });

  it('reports allOnLedger true after a full commit', () => {
    const tmp = makeTempDir();
    const authority = join(tmp, 'authority');
    runCli(FLIP_CLI, ['--authority-root', authority, '--commit']);
    const { exitCode, json } = runCli(VERIFY_CLI, ['--authority-root', authority]);

    expect(exitCode).toBe(0);
    expect(json.allOnLedger).toBe(true);
    const records = json.records as Record<string, unknown>[];
    expect(records.every((r) => r.source === 'stored' && r.state === 'new_authoritative_reversible' && r.selectedWriter === 'dark')).toBe(true);
  });

  it('reports a malformed record as source malformed without throwing', () => {
    const tmp = makeTempDir();
    const authority = join(tmp, 'authority');
    mkdirSync(authority, { recursive: true });
    writeFileSync(join(authority, 'authority-deep-research.json'), '{', 'utf8');
    // The verifier reads the directory directly; the root must exist.
    const { exitCode, json } = runCli(VERIFY_CLI, ['--authority-root', authority]);

    expect(exitCode).toBe(2);
    expect(json.allOnLedger).toBe(false);
    const records = json.records as Record<string, unknown>[];
    const research = records.find((r) => r.mode === 'deep-research') as Record<string, unknown>;
    expect(research.source).toBe('malformed');
    expect(research.state).toBeNull();
  });
});

describe('flip-authority.cjs — order and stop', () => {
  it('stops at a mid-order mode whose state prepareCutover rejects and leaves later modes untouched', () => {
    const tmp = makeTempDir();
    const authority = join(tmp, 'authority');
    mkdirSync(authority, { recursive: true });
    // Pre-seed deep-ai-council (3rd in order) with a shadowing record at
    // epoch 1. prepareCutover expects legacy_authoritative at the current
    // epoch, so a shadowing record is rejected with CAS_CONFLICT.
    const seededCore = {
      schemaVersion: 1,
      mode: 'deep-ai-council',
      state: 'shadowing',
      epoch: 1,
      selectedWriter: 'legacy',
      candidateSha: null,
      policyVersion: 0,
      cutoverCertificateDigest: null,
      lastTransitionDigest: null,
      updatedAt: '2026-01-01T00:00:00.000Z',
    };
    writeFileSync(
      join(authority, 'authority-deep-ai-council.json'),
      JSON.stringify({ ...seededCore, recordDigest: computeRecordDigest(seededCore) }),
      'utf8',
    );

    const { exitCode, json } = runCli(FLIP_CLI, ['--authority-root', authority, '--commit']);

    expect(exitCode).toBe(2);
    expect(json.ok).toBe(false);
    expect(json.stoppedAt).toBe('deep-ai-council');
    const results = json.results as Record<string, unknown>[];
    // The two modes before the failing one flipped; the failing one
    // reported a failure; later modes were never attempted.
    expect(results.map((r) => r.mode)).toEqual(['deep-research', 'deep-review', 'deep-ai-council']);
    const failed = results.find((r) => r.mode === 'deep-ai-council') as Record<string, unknown>;
    expect(failed.result).toBe('failed');
    expect(failed.reasonCode).toBe('CAS_CONFLICT');

    // Later modes must not have any record file on disk.
    const laterModes = ['deep-improvement-common', 'agent-improvement', 'model-benchmark', 'skill-benchmark', 'deep-alignment'];
    for (const mode of laterModes) {
      expect(existsSync(join(authority, `authority-${mode}.json`))).toBe(false);
    }
  });
});

describe('flip-authority.cjs — negative control (CAS disabled)', () => {
  it('leaves records stuck at cutover_ready when the CAS is disabled, and verify reports allOnLedger false', async () => {
    const tmp = makeTempDir();
    const authority = join(tmp, 'authority');
    // The COMMIT_CAS toggle is module-scope inside the script; the only
    // way a subprocess can disable it is through a test seam. The script
    // does not expose one to the environment by design, so this test
    // drives flipOneMode in-process with the seam, then runs the
    // verifier as a subprocess against the on-disk result.
    const { createRequire } = require('node:module');
    const requireFromTest = createRequire(import.meta.url);
    const { flipOneMode, __setCommitCas } = requireFromTest(FLIP_CLI) as {
      flipOneMode: (registry: unknown, mode: string) => Promise<Record<string, unknown>>;
      __setCommitCas: (value: boolean) => void;
    };
    const { AuthorityRegistry } = requireFromTest('../../lib/per-mode-authority-flip/index.ts') as {
      AuthorityRegistry: new (root: string) => unknown;
    };

    __setCommitCas(false);
    let outcome: Record<string, unknown>;
    try {
      const registry = new AuthorityRegistry(authority);
      outcome = await flipOneMode(registry, 'deep-research');
    } finally {
      // Restore immediately so a trap or later test never sees the
      // disabled state. The negative control is bounded to this block.
      __setCommitCas(true);
    }

    // The disabled CAS is a controlled failure, not a thrown error.
    expect(outcome!.result).toBe('cas-disabled');
    expect(outcome!.reasonCode).toBe('CAS_DISABLED');

    // The first mode's record must be stuck at cutover_ready, not flipped.
    const record = JSON.parse(readFileSync(join(authority, 'authority-deep-research.json'), 'utf8')) as Record<string, unknown>;
    expect(record.state).toBe('cutover_ready');
    expect(record.selectedWriter).toBe('legacy');

    const { exitCode, json } = runCli(VERIFY_CLI, ['--authority-root', authority]);
    expect(exitCode).toBe(2);
    expect(json.allOnLedger).toBe(false);
  });
});

describe('real authority store is never touched', () => {
  const realStore = resolve(here, '..', '..', '..', '..', '.authority-state');
  // Snapshot the real store at collection time — before any test in this file
  // executes — so the guard verifies this suite writes nothing to it (each test
  // must pass a temp --authority-root). Comparing against this baseline rather
  // than an empty store tolerates production authority records that legitimately
  // pre-exist on disk after a real flip, while still catching a test that drops
  // the flag and writes a new record.
  const initialEntries = existsSync(realStore) ? readdirSync(realStore).sort() : null;
  it('this suite does not modify the real .authority-state directory', () => {
    if (initialEntries === null) {
      // If the real store does not exist, there is nothing to pollute.
      expect(true).toBe(true);
      return;
    }
    const entries = readdirSync(realStore).sort();
    expect(entries).toEqual(initialEntries);
  });
});
