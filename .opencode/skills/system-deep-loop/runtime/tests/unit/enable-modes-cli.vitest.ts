// ───────────────────────────────────────────────────────────────────
// MODULE: Fleet Mode Enablement CLI Tests
// ───────────────────────────────────────────────────────────────────
// The CLI's whole safety story is that a dry run changes nothing and a
// failed step leaves authority exactly as it found it. These tests put
// that promise to the proof: they assert against the filesystem — the
// absence of a state file, the absence of an authority record — rather
// than against what the CLI says it did. A test that only read the
// CLI's own JSON report would be trusting the thing under test.

import { afterEach, describe, expect, it } from 'vitest';

// buildRunStep is a CJS script that, when driven in-process here, dynamically
// imports its TypeScript modules by `.js` specifier. Registering tsx makes
// those specifiers resolve to the `.ts` source, exactly as the CLI's own
// tsx bootstrap does when the script runs as a subprocess.
import 'tsx';

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';
import { AuthorityRegistry, AUTHORITY_FLIP_MODE_ORDER } from '../../lib/per-mode-authority-flip/index.js';
import { runFleetEnablement } from '../../lib/fleet-enablement/index.js';

// A minimal read-port shape for the ledger stubs the flip proofs inject.
// buildRunStep no longer reads these ports — the registry-direct flip
// depends only on the authority registry — so the stubs are an inert
// argument the kept proofs still pass positionally.
type LedgerReadPort = {
  getVerifiedHead(): Promise<{ sequence: number }>;
  readVerifiedEvents(): Promise<readonly unknown[]>;
};

const requireFromTest = createRequire(import.meta.url);
const {
  buildRunStep,
  __setCompareAndSwapEnabled,
} = requireFromTest('../../scripts/enable-modes.cjs') as {
  buildRunStep: (
    registry: { read: (mode: string) => { state: string } },
    deriveModeSurfaceSet: (mode: string) => {
      surfaceIds: string[];
      projectableSurfaceIds: string[];
      readers: unknown[];
      hasProjectableSurface: boolean;
      sharedWith: string[];
    },
    runDirectory: string,
    censusPath: string,
    continuityId: string | null | undefined,
    ledgerPorts?: {
      modeLedger: () => LedgerReadPort;
      effectLedger: () => LedgerReadPort;
    },
  ) => (mode: string) => Promise<{
    ok: boolean;
    failedCheck: string | null;
    reason: string | null;
  }>;
  __setCompareAndSwapEnabled: (value: boolean) => void;
};

const here = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = resolve(here, '..', '..', 'scripts', 'enable-modes.cjs');
const CENSUS_PATH = resolve(
  here,
  '../../../../../specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/state-backend-census.json',
);

type CliResult = {
  exitCode: number | null;
  json: Record<string, unknown>;
  rawStdout: string;
  stderr: string;
};

function runCli(args: string[], environmentOverlay: NodeJS.ProcessEnv = {}): CliResult {
  const result = spawnSync(process.execPath, [CLI_PATH, ...args], {
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
  const dir = mkdtempSync(join(tmpdir(), 'fleet-enablement-'));
  temporaryDirectories.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of temporaryDirectories) {
    rmSync(dir, { recursive: true, force: true });
  }
  temporaryDirectories.length = 0;
});

const PLANNED_MODES = [
  'deep-review',
  'deep-ai-council',
  'deep-improvement-common',
  'agent-improvement',
  'model-benchmark',
  'skill-benchmark',
  'deep-alignment',
];

const MODES_AFTER_DEEP_REVIEW = [
  'deep-ai-council',
  'deep-improvement-common',
  'agent-improvement',
  'model-benchmark',
  'skill-benchmark',
  'deep-alignment',
];

describe('enable-modes CLI', () => {

  it('stops cleanly at a mode whose authority record cannot be read', async () => {
    const os = await import('node:os');
    const path = await import('node:path');
    const fs = await import('node:fs');

    const authorityRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'enable-modes-'));
    const runDir = fs.mkdtempSync(path.join(os.tmpdir(), 'enable-modes-run-'));
    const statePath = path.join(authorityRoot, 'state.json');
    try {
      fs.writeFileSync(
        path.join(authorityRoot, 'authority-deep-review.json'),
        '{',
        'utf8',
      );

      const result = runCli([
        '--state',
        statePath,
        '--authority-root',
        authorityRoot,
        '--run-directory',
        runDir,
        '--census',
        CENSUS_PATH,
        '--continuity-id',
        'lineage-alpha',
      ]);

      expect(result.exitCode).toBe(2);
      expect(result.json.code).toBe('MODE_STEP_FAILED');
      const failure = result.json.failure as Record<string, unknown>;
      expect(failure.mode).toBe('deep-review');
      expect(failure.check).toBe('flip');

      const persisted = JSON.parse(fs.readFileSync(statePath, 'utf8')) as Record<
        string,
        unknown
      >;
      const persistedFailure = persisted.failure as Record<string, unknown>;
      expect(persistedFailure.mode).toBe('deep-review');
      // A mode whose record cannot be read is a failure of that mode, not of the
      // run; aborting here would skip every remaining mode and lose where the
      // run actually stopped.
    } finally {
      fs.rmSync(authorityRoot, { recursive: true, force: true });
      fs.rmSync(runDir, { recursive: true, force: true });
    }
  });
  it('plans every fleet mode without touching anything', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const { exitCode, json } = runCli(['--dry-run', '--state', statePath]);

    expect(exitCode).toBe(0);
    expect(json.ok).toBe(true);
    expect(json.dryRun).toBe(true);
    expect(json.plannedModes).toEqual(PLANNED_MODES);
    expect(json.skippedModes).toEqual([]);
    expect(Array.isArray(json.plan)).toBe(true);
    expect((json.plan as unknown[]).length).toBe(7);
  });

  it('writes no state file during a dry run', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    runCli(['--dry-run', '--state', statePath]);

    expect(existsSync(statePath)).toBe(false);
  });

  it('never creates the authority root during a dry run', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const authority = join(tmp, 'authority');
    runCli(['--dry-run', '--authority-root', authority, '--state', statePath]);

    expect(existsSync(authority)).toBe(false);
  });

  it('reports a mode whose projectable surface set is empty', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const { json } = runCli(['--dry-run', '--state', statePath]);

    const plan = json.plan as Record<string, unknown>[];
    const skillBenchmark = plan.find((entry) => entry.mode === 'skill-benchmark') as Record<string, unknown>;
    const deepReview = plan.find((entry) => entry.mode === 'deep-review') as Record<string, unknown>;

    expect(skillBenchmark.hasProjectableSurface).toBe(false);
    expect(skillBenchmark.projectableSurfaceIds).toEqual([]);
    expect(deepReview.hasProjectableSurface).toBe(true);
  });

  it('reports the two modes that share a surface prefix', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const { json } = runCli(['--dry-run', '--state', statePath]);

    const plan = json.plan as Record<string, unknown>[];
    const deepImprovementCommon = plan.find((entry) => entry.mode === 'deep-improvement-common') as Record<string, unknown>;
    const agentImprovement = plan.find((entry) => entry.mode === 'agent-improvement') as Record<string, unknown>;

    expect(deepImprovementCommon.sharedWith).toEqual(['agent-improvement']);
    expect(agentImprovement.sharedWith).toEqual(['deep-improvement-common']);
  });

  it('a dry run still succeeds with no runDirectory', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const { exitCode, json } = runCli(['--dry-run', '--state', statePath]);

    expect(exitCode).toBe(0);
    expect(json.ok).toBe(true);
    expect(json.dryRun).toBe(true);
  });

  it('refuses to continue a stopped run unless resuming is asked for', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const authority = join(tmp, 'authority');
    const runDir = join(tmp, 'run');
    // A stopped run needs a persisted failure to refuse past. A record that
    // cannot be read stops the first mode at the flip check and writes that
    // failure to the state file — the exact state the resume guard exists to
    // block a blind re-run over.
    mkdirSync(authority, { recursive: true });
    writeFileSync(join(authority, 'authority-deep-review.json'), '{', 'utf8');
    runCli(['--state', statePath, '--authority-root', authority, '--run-directory', runDir, '--census', CENSUS_PATH, '--continuity-id', 'lineage-alpha']);

    const { exitCode, json } = runCli(['--state', statePath, '--authority-root', authority, '--run-directory', runDir, '--census', CENSUS_PATH, '--continuity-id', 'lineage-alpha']);
    expect(exitCode).toBe(1);
    expect(json.code).toBe('RESUME_NOT_REQUESTED');
  });

  it('refuses to resume a run that never happened', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const authority = join(tmp, 'authority');
    const runDir = join(tmp, 'run');

    const { exitCode, json } = runCli(['--resume', '--state', statePath, '--authority-root', authority, '--run-directory', runDir, '--census', CENSUS_PATH, '--continuity-id', 'lineage-alpha']);
    expect(exitCode).toBe(1);
    expect(json.phase).toBe('resume');
    expect(json.code).toBe('NOTHING_TO_RESUME');
  });

  it('rejects an unrecognised flag', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const { exitCode, json } = runCli(['--bogus', '--state', statePath]);

    expect(exitCode).toBe(1);
    expect(json.phase).toBe('args');
    expect(json.code).toBe('UNKNOWN_ARGUMENT');
    expect(json.argument).toBe('bogus');
  });

  it('requires a state path', () => {
    const { exitCode, json } = runCli(['--dry-run']);

    expect(exitCode).toBe(1);
    expect(json.phase).toBe('args');
    expect(json.code).toBe('STATE_PATH_REQUIRED');
  });

  it('rejects a state flag with no value', () => {
    // Without this check the missing value parsed as the boolean true and
    // was then used as a filesystem path, and the run reported success.
    const { exitCode, json } = runCli(['--state', '--dry-run']);

    expect(exitCode).toBe(1);
    expect(json.phase).toBe('args');
    expect(json.code).toBe('ARG_VALUE_REQUIRED');
    expect(json.argument).toBe('state');
  });

  it('rejects a dry-run flag that swallowed a value', () => {
    // Without this check the flag parsed as a string, compared unequal to
    // true, and a request that said "change nothing" executed a real run
    // that persisted state.
    const tmp = makeTempDir();
    const swallowedPath = join(tmp, 'swallowed.json');
    const statePath = join(tmp, 'state.json');
    const { exitCode, json } = runCli(['--dry-run', swallowedPath, '--state', statePath]);

    expect(exitCode).toBe(1);
    expect(json.phase).toBe('args');
    expect(json.code).toBe('ARG_TAKES_NO_VALUE');
    expect(json.argument).toBe('dryRun');
    expect(existsSync(statePath)).toBe(false);
  });

  it('a non-dry run without --continuity-id fails with the required-argument code', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const authority = join(tmp, 'authority');
    const runDir = join(tmp, 'run');
    const { exitCode, json } = runCli(['--state', statePath, '--authority-root', authority, '--run-directory', runDir, '--census', CENSUS_PATH]);

    expect(exitCode).toBe(1);
    expect(json.phase).toBe('args');
    expect(json.code).toBe('CONTINUITY_ID_REQUIRED');
  });

  it('a dry run still succeeds without --continuity-id', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const { exitCode, json } = runCli(['--dry-run', '--state', statePath]);

    expect(exitCode).toBe(0);
    expect(json.ok).toBe(true);
    expect(json.dryRun).toBe(true);
  });
});

describe('pilot registry-direct flip (deep-research)', () => {
  it('writes new_authoritative_reversible with selectedWriter dark to disk after a pilot enablement step', async () => {
    const authorityRoot = makeTempDir();
    const runDir = makeTempDir();
    mkdirSync(join(runDir, 'deep-research-ledger'));
    mkdirSync(join(runDir, 'deep-research-effect-ledger'));

    const registry = new AuthorityRegistry(authorityRoot);

    const effectId = 'effect-done';
    const effectEvents = [
      {
        event: {
          effective: {
            envelope: {
              event_type: 'deep-loop.effect.intent-recorded',
              payload: { effect_id: effectId },
            },
          },
        },
      },
      {
        event: {
          effective: {
            envelope: {
              event_type: 'deep-loop.effect.confirmed',
              payload: { effect_id: effectId },
            },
          },
        },
      },
    ];
    const modeLedgerPort: LedgerReadPort = {
      async getVerifiedHead() {
        return { sequence: 7 };
      },
      async readVerifiedEvents() {
        return [];
      },
    };
    const effectLedgerPort: LedgerReadPort = {
      async getVerifiedHead() {
        return { sequence: 0 };
      },
      async readVerifiedEvents() {
        return effectEvents;
      },
    };

    const step = buildRunStep(
      registry as unknown as { read: (mode: string) => { state: string } },
      () => ({
        surfaceIds: ['surface-a'],
        projectableSurfaceIds: ['surface-a'],
        readers: [],
        hasProjectableSurface: true,
        sharedWith: [],
      }),
      runDir,
      CENSUS_PATH,
      'lineage-pilot',
      {
        modeLedger: () => modeLedgerPort,
        effectLedger: () => effectLedgerPort,
      },
    );

    const result = await step('deep-research');

    // The step must report success.
    expect(result.ok).toBe(true);
    expect(result.failedCheck).toBeNull();

    // Assert on the ON-DISK record, not on the step's ok flag alone.
    // The default record is legacy_authoritative at epoch 1; after the
    // flip it must be new_authoritative_reversible at epoch 2 with
    // selectedWriter 'dark'.
    const recordPath = join(authorityRoot, 'authority-deep-research.json');
    expect(existsSync(recordPath)).toBe(true);
    const onDisk = JSON.parse(readFileSync(recordPath, 'utf8')) as Record<string, unknown>;
    expect(onDisk.state).toBe('new_authoritative_reversible');
    expect(onDisk.epoch).toBe(2);
    expect(onDisk.selectedWriter).toBe('dark');

    // Also confirm the registry reads back the same record from disk.
    const reread = registry.read('deep-research');
    expect(reread.state).toBe('new_authoritative_reversible');
    expect(reread.epoch).toBe(2);
    expect(reread.selectedWriter).toBe('dark');
  });
});

// ───────────────────────────────────────────────────────────────────
// Shared helpers for the fleet-wide flip proofs
// ───────────────────────────────────────────────────────────────────

function makePassingLedgerPorts(): {
  modeLedger: () => LedgerReadPort;
  effectLedger: () => LedgerReadPort;
} {
  const effectId = 'effect-done';
  const effectEvents = [
    {
      event: {
        effective: {
          envelope: {
            event_type: 'deep-loop.effect.intent-recorded',
            payload: { effect_id: effectId },
          },
        },
      },
    },
    {
      event: {
        effective: {
          envelope: {
            event_type: 'deep-loop.effect.confirmed',
            payload: { effect_id: effectId },
          },
        },
      },
    },
  ];
  const modeLedgerPort: LedgerReadPort = {
    async getVerifiedHead() {
      return { sequence: 7 };
    },
    async readVerifiedEvents() {
      return [];
    },
  };
  const effectLedgerPort: LedgerReadPort = {
    async getVerifiedHead() {
      return { sequence: 0 };
    },
    async readVerifiedEvents() {
      return effectEvents;
    },
  };
  return { modeLedger: () => modeLedgerPort, effectLedger: () => effectLedgerPort };
}

function makeRunDirWithLedgers(runDir: string, modes: readonly string[]): void {
  for (const mode of modes) {
    mkdirSync(join(runDir, `${mode}-ledger`), { recursive: true });
    mkdirSync(join(runDir, `${mode}-effect-ledger`), { recursive: true });
  }
}

function makeStubSurfaceSet() {
  return () => ({
    surfaceIds: ['surface-a'],
    projectableSurfaceIds: ['surface-a'],
    readers: [],
    hasProjectableSurface: true,
    sharedWith: [],
  });
}

// ───────────────────────────────────────────────────────────────────
// All 8 modes in frozen order — on-disk proof
// ───────────────────────────────────────────────────────────────────

describe('fleet registry-direct flip (all 8 modes in frozen order)', () => {
  // Covers all 8 modes end-to-end: deep-research, deep-review,
  // deep-ai-council, deep-improvement-common, agent-improvement,
  // model-benchmark, skill-benchmark, deep-alignment.

  it('flips every mode in AUTHORITY_FLIP_MODE_ORDER to new_authoritative_reversible on disk', async () => {
    const authorityRoot = resolve(makeTempDir());
    const runDir = resolve(makeTempDir());
    const registry = new AuthorityRegistry(authorityRoot);
    const ledgerPorts = makePassingLedgerPorts();

    makeRunDirWithLedgers(runDir, AUTHORITY_FLIP_MODE_ORDER);

    const step = buildRunStep(
      registry as unknown as { read: (mode: string) => { state: string } },
      makeStubSurfaceSet(),
      runDir,
      CENSUS_PATH,
      'lineage-fleet-all',
      ledgerPorts,
    );

    for (const mode of AUTHORITY_FLIP_MODE_ORDER) {
      const result = await step(mode);
      expect(result.ok).toBe(true);
      expect(result.failedCheck).toBeNull();

      // Assert on the ON-DISK record, not on the step's ok flag alone.
      const recordPath = join(authorityRoot, `authority-${mode}.json`);
      expect(existsSync(recordPath)).toBe(true);
      const onDisk = JSON.parse(readFileSync(recordPath, 'utf8')) as Record<string, unknown>;
      expect(onDisk.state).toBe('new_authoritative_reversible');
      expect(onDisk.epoch).toBe(2);
      expect(onDisk.selectedWriter).toBe('dark');
    }
  });
});

// ───────────────────────────────────────────────────────────────────
// Order + stop-at-first-failure proof
// ───────────────────────────────────────────────────────────────────

describe('fleet registry-direct flip (order + stop-at-first-failure)', () => {
  it('stops at a mid-order flip failure and leaves later modes untouched on disk', async () => {
    const authorityRoot = resolve(makeTempDir());
    const runDir = resolve(makeTempDir());
    const statePath = resolve(join(authorityRoot, 'state.json'));
    const registry = new AuthorityRegistry(authorityRoot);
    const ledgerPorts = makePassingLedgerPorts();

    const fleetOrder = AUTHORITY_FLIP_MODE_ORDER.filter((m) => m !== 'deep-research');
    makeRunDirWithLedgers(runDir, fleetOrder);

    // Pre-write a shadowing record for deep-improvement-common (mid-order
    // in FLEET_MODE_ORDER) so prepareCutover finds a state that is neither
    // legacy_authoritative nor cutover_ready and throws CAS_CONFLICT. The
    // record must carry a valid recordDigest so the registry's integrity
    // verification passes.
    const failingMode = 'deep-improvement-common';
    const core = {
      schemaVersion: 1,
      mode: failingMode,
      state: 'shadowing',
      epoch: 1,
      selectedWriter: 'legacy',
      candidateSha: null,
      policyVersion: 0,
      cutoverCertificateDigest: null,
      lastTransitionDigest: null,
      updatedAt: '2026-08-09T00:00:00Z',
    };
    const prewritten = {
      ...core,
      recordDigest: sha256Bytes(canonicalBytes(core as never)),
    };
    writeFileSync(
      join(authorityRoot, `authority-${failingMode}.json`),
      JSON.stringify(prewritten),
      'utf8',
    );

    const step = buildRunStep(
      registry as unknown as { read: (mode: string) => { state: string } },
      makeStubSurfaceSet(),
      runDir,
      CENSUS_PATH,
      'lineage-fleet-stop',
      ledgerPorts,
    );

    const result = await runFleetEnablement({
      statePath,
      dryRun: false,
      runStep: step as unknown as (mode: never) => Promise<{ ok: boolean; failedCheck: string | null; reason: string | null }>,
    });

    // The run stopped at the failing mode.
    expect(result.failure).not.toBeNull();
    expect(result.failure!.mode).toBe(failingMode);
    expect(result.failure!.check).toBe('flip');

    // Modes before the failure flipped successfully on disk.
    const beforeFailure = fleetOrder.slice(0, fleetOrder.indexOf(failingMode));
    for (const mode of beforeFailure) {
      const recordPath = join(authorityRoot, `authority-${mode}.json`);
      expect(existsSync(recordPath)).toBe(true);
      const onDisk = JSON.parse(readFileSync(recordPath, 'utf8')) as Record<string, unknown>;
      expect(onDisk.state).toBe('new_authoritative_reversible');
      expect(onDisk.epoch).toBe(2);
      expect(onDisk.selectedWriter).toBe('dark');
    }

    // The failing mode's on-disk record is NOT advanced — it remains at
    // the pre-written shadowing state, not new_authoritative_reversible.
    const failingPath = join(authorityRoot, `authority-${failingMode}.json`);
    const failingOnDisk = JSON.parse(readFileSync(failingPath, 'utf8')) as Record<string, unknown>;
    expect(failingOnDisk.state).toBe('shadowing');
    expect(failingOnDisk.state).not.toBe('new_authoritative_reversible');

    // Later modes are untouched — no authority record on disk at all,
    // which means the registry default (legacy_authoritative) applies.
    const afterFailure = fleetOrder.slice(fleetOrder.indexOf(failingMode) + 1);
    for (const mode of afterFailure) {
      const recordPath = join(authorityRoot, `authority-${mode}.json`);
      expect(existsSync(recordPath)).toBe(false);
    }

    // The driver's own untouchedModes list matches the on-disk evidence.
    expect(result.untouchedModes).toEqual(afterFailure);
  });
});

// ───────────────────────────────────────────────────────────────────
// Negative control — disable only the compareAndSwap
// ───────────────────────────────────────────────────────────────────

describe('fleet registry-direct flip (negative control: CAS disabled)', () => {
  it('RED when CAS is disabled, GREEN after restore with process-trap guarantee', async () => {
    // Process-trap restore: if the test is interrupted (SIGINT/SIGTERM) or
    // exits unexpectedly, the CAS toggle must be restored to true so no
    // later test inherits a disabled CAS.
    const restoreCas = () => { __setCompareAndSwapEnabled(true); };
    process.on('exit', restoreCas);
    process.on('SIGINT', restoreCas);
    process.on('SIGTERM', restoreCas);

    try {
      // ── RED: disable only the compareAndSwap ──
      __setCompareAndSwapEnabled(false);

      const redRoot = resolve(makeTempDir());
      const redRunDir = resolve(makeTempDir());
      const redRegistry = new AuthorityRegistry(redRoot);
      const ledgerPorts = makePassingLedgerPorts();
      makeRunDirWithLedgers(redRunDir, AUTHORITY_FLIP_MODE_ORDER);

      const redStep = buildRunStep(
        redRegistry as unknown as { read: (mode: string) => { state: string } },
        makeStubSurfaceSet(),
        redRunDir,
        CENSUS_PATH,
        'lineage-fleet-red',
        ledgerPorts,
      );

      let redFailures = 0;
      for (const mode of AUTHORITY_FLIP_MODE_ORDER) {
        const result = await redStep(mode);
        if (!result.ok) {
          redFailures += 1;
        }

        // The on-disk record must NOT be new_authoritative_reversible.
        // prepareCutover ran (moving to cutover_ready) but the CAS was
        // skipped, so the post-flip re-read found the wrong state.
        const recordPath = join(redRoot, `authority-${mode}.json`);
        expect(existsSync(recordPath)).toBe(true);
        const onDisk = JSON.parse(readFileSync(recordPath, 'utf8')) as Record<string, unknown>;
        expect(onDisk.state).not.toBe('new_authoritative_reversible');
      }

      // Every mode must fail when the CAS is disabled.
      expect(redFailures).toBe(AUTHORITY_FLIP_MODE_ORDER.length);
      // eslint-disable-next-line no-console
      console.log(`NEGATIVE CONTROL RED: ${redFailures}/${AUTHORITY_FLIP_MODE_ORDER.length} modes failed (CAS disabled)`);

      // ── RESTORE: re-enable the CAS ──
      __setCompareAndSwapEnabled(true);

      // ── GREEN: fresh authority root, CAS restored ──
      const greenRoot = resolve(makeTempDir());
      const greenRunDir = resolve(makeTempDir());
      const greenRegistry = new AuthorityRegistry(greenRoot);
      makeRunDirWithLedgers(greenRunDir, AUTHORITY_FLIP_MODE_ORDER);

      const greenStep = buildRunStep(
        greenRegistry as unknown as { read: (mode: string) => { state: string } },
        makeStubSurfaceSet(),
        greenRunDir,
        CENSUS_PATH,
        'lineage-fleet-green',
        ledgerPorts,
      );

      let greenSuccesses = 0;
      for (const mode of AUTHORITY_FLIP_MODE_ORDER) {
        const result = await greenStep(mode);
        if (result.ok) {
          greenSuccesses += 1;
        }

        const recordPath = join(greenRoot, `authority-${mode}.json`);
        expect(existsSync(recordPath)).toBe(true);
        const onDisk = JSON.parse(readFileSync(recordPath, 'utf8')) as Record<string, unknown>;
        expect(onDisk.state).toBe('new_authoritative_reversible');
        expect(onDisk.epoch).toBe(2);
        expect(onDisk.selectedWriter).toBe('dark');
      }

      expect(greenSuccesses).toBe(AUTHORITY_FLIP_MODE_ORDER.length);
      // eslint-disable-next-line no-console
      console.log(`NEGATIVE CONTROL GREEN: ${greenSuccesses}/${AUTHORITY_FLIP_MODE_ORDER.length} modes flipped (CAS restored)`);
    } finally {
      // Absolute restore — the toggle is always true when this test exits.
      __setCompareAndSwapEnabled(true);
      process.off('exit', restoreCas);
      process.off('SIGINT', restoreCas);
      process.off('SIGTERM', restoreCas);
    }
  });
});
