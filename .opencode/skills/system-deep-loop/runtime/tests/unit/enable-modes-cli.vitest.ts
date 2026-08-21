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
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';
import { buildObservedClassificationManifest } from '../../lib/restart-observation/observed-classification.js';
import type {
  LedgerReadPort,
  ObserveRestartFactsOptions,
} from '../../lib/restart-observation/restart-facts-reader.js';

// The verdict-enforcement helper lives in the CLI script (one of the four
// files this change may touch). It is pure JS with no module-load side
// effects, so requiring it directly is safe and lets the regression test
// exercise the exact function buildRunStep calls after observation.
const requireFromTest = createRequire(import.meta.url);
const {
  buildRunStep,
  enforceObservedClassificationVerdict,
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
  enforceObservedClassificationVerdict: (built: unknown) => { ok: boolean; reason?: string };
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

  it('stops at the first failing mode and names it', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const authority = join(tmp, 'authority');
    const runDir = join(tmp, 'run');
    const { exitCode, json } = runCli(['--state', statePath, '--authority-root', authority, '--run-directory', runDir, '--census', CENSUS_PATH, '--continuity-id', 'lineage-alpha']);

    expect(exitCode).toBe(2);
    expect(json.ok).toBe(false);
    expect(json.phase).toBe('enablement');
    expect(json.code).toBe('MODE_STEP_FAILED');
    expect(json.statePath).toBe(statePath);

    const failure = json.failure as Record<string, unknown>;
    expect(failure.mode).toBe('deep-review');
    expect(failure.check).toBe('parity');
    expect(typeof failure.reason).toBe('string');
    expect(failure.reason as string).toContain('EFFECT_LEDGER_ABSENT');
  });

  it('a mode whose effect-ledger directory is absent produces a failed step whose reason contains EFFECT_LEDGER_ABSENT', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const authority = join(tmp, 'authority');
    const runDir = join(tmp, 'run');
    const { json } = runCli(['--state', statePath, '--authority-root', authority, '--run-directory', runDir, '--census', CENSUS_PATH, '--continuity-id', 'lineage-alpha']);

    const failure = json.failure as Record<string, unknown>;
    expect(failure.check).toBe('parity');
    expect(failure.reason as string).toContain('EFFECT_LEDGER_ABSENT');
  });

  it('the parity failure reason must not contain cutover_ready to catch check reordering', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const authority = join(tmp, 'authority');
    const runDir = join(tmp, 'run');
    const { json } = runCli(['--state', statePath, '--authority-root', authority, '--run-directory', runDir, '--census', CENSUS_PATH, '--continuity-id', 'lineage-alpha']);

    const failure = json.failure as Record<string, unknown>;
    expect(failure.check).toBe('parity');
    expect(failure.reason as string).toContain('EFFECT_LEDGER_ABSENT');
    expect(failure.reason as string).not.toContain('cutover_ready');
  });

  it('a step that fails observation writes no authority record', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const authority = join(tmp, 'authority');
    const runDir = join(tmp, 'run');
    runCli(['--state', statePath, '--authority-root', authority, '--run-directory', runDir, '--census', CENSUS_PATH, '--continuity-id', 'lineage-alpha']);

    const entries = readdirSync(authority);
    const authorityRecords = entries.filter((entry) => /^authority-.*\.json$/.test(entry));
    expect(authorityRecords).toEqual([]);
  });

  it('a dry run still succeeds with no runDirectory', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const { exitCode, json } = runCli(['--dry-run', '--state', statePath]);

    expect(exitCode).toBe(0);
    expect(json.ok).toBe(true);
    expect(json.dryRun).toBe(true);
  });

  it('leaves every later mode untouched when it stops', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const authority = join(tmp, 'authority');
    const runDir = join(tmp, 'run');
    const { json } = runCli(['--state', statePath, '--authority-root', authority, '--run-directory', runDir, '--census', CENSUS_PATH, '--continuity-id', 'lineage-alpha']);

    expect(json.completedModes).toEqual([]);
    expect(json.untouchedModes).toEqual(MODES_AFTER_DEEP_REVIEW);
  });

  it('writes no authority record when a step fails', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const authority = join(tmp, 'authority');
    const runDir = join(tmp, 'run');
    runCli(['--state', statePath, '--authority-root', authority, '--run-directory', runDir, '--census', CENSUS_PATH, '--continuity-id', 'lineage-alpha']);

    const entries = readdirSync(authority);
    const authorityRecords = entries.filter((entry) => /^authority-.*\.json$/.test(entry));
    expect(authorityRecords).toEqual([]);
  });

  it('persists the failure so a later run can see it', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const authority = join(tmp, 'authority');
    const runDir = join(tmp, 'run');
    runCli(['--state', statePath, '--authority-root', authority, '--run-directory', runDir, '--census', CENSUS_PATH, '--continuity-id', 'lineage-alpha']);

    const parsed = JSON.parse(readFileSync(statePath, 'utf8'));
    expect(parsed.version).toBe(1);
    expect(parsed.completedModes).toEqual([]);
    expect(parsed.failure.mode).toBe('deep-review');
  });

  it('refuses to continue a stopped run unless resuming is asked for', () => {
    const tmp = makeTempDir();
    const statePath = join(tmp, 'state.json');
    const authority = join(tmp, 'authority');
    const runDir = join(tmp, 'run');
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

  it('an empty classification row set fails the verdict naming that no rows were classified', () => {
    const verdict = enforceObservedClassificationVerdict({ manifest: { rows: [] } });

    expect(verdict.ok).toBe(false);
    expect(verdict.reason as string).toContain('no rows were classified');
  });

  it('a matched intent+confirmation ledger and a supplied continuity id pass the parity gate and proceed past it', async () => {
    // Before the fix buildRunStep hardcoded continuityId: null, so identity
    // coverage was always false and the verdict always failed; a run that
    // carried the identity could never pass the parity gate no matter how
    // clean the ledger. This test threads a real ledger through the exact
    // observation, evidence derivation, and verdict enforcement buildRunStep
    // uses, with the run's continuity identity supplied, and asserts the step
    // clears the gate and reaches the authority state check.
    const mode = 'deep-review';
    const runDir = mkdtempSync(join(tmpdir(), 'enable-modes-parity-'));
    temporaryDirectories.push(runDir);
    mkdirSync(join(runDir, `${mode}-ledger`));
    mkdirSync(join(runDir, `${mode}-effect-ledger`));

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
      { read: () => ({ state: 'cutover_ready' }) },
      () => ({
        surfaceIds: ['surface-a'],
        projectableSurfaceIds: ['surface-a'],
        readers: [],
        hasProjectableSurface: true,
        sharedWith: [],
      }),
      runDir,
      CENSUS_PATH,
      'lineage-alpha',
      {
        modeLedger: () => modeLedgerPort,
        effectLedger: () => effectLedgerPort,
      },
    );

    const result = await step(mode);

    // The parity gate passed (no 'parity' failure) and the step moved on to
    // the authority state check, which passes for a cutover_ready record.
    expect(result.ok).toBe(true);
    expect(result.failedCheck).toBeNull();
  });

  it('mkdir bypass: empty ledger directories cause EFFECT_LEDGER_EMPTY refusal and completedModes: []', async () => {
    const os = await import('node:os');
    const path = await import('node:path');
    const fs = await import('node:fs');

    const authorityRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'enable-modes-'));
    const runDir = fs.mkdtempSync(path.join(os.tmpdir(), 'enable-modes-run-'));
    const statePath = path.join(authorityRoot, 'state.json');

    try {
      // Write a valid cutover_ready authority record with a correct
      // recordDigest so the registry's integrity verification passes and
      // the step proceeds to the observation gate. An invalid record would
      // fail at the 'flip' check before observation runs, masking the
      // empty-ledger refusal this test exists to prove.
      const core = {
        schemaVersion: 1,
        mode: 'deep-review',
        state: 'cutover_ready',
        epoch: 1,
        selectedWriter: 'legacy',
        candidateSha: null,
        policyVersion: 0,
        cutoverCertificateDigest: null,
        lastTransitionDigest: null,
        updatedAt: '2026-08-09T00:00:00Z',
      };
      const record = {
        ...core,
        recordDigest: sha256Bytes(canonicalBytes(core as never)),
      };
      fs.writeFileSync(
        path.join(authorityRoot, 'authority-deep-review.json'),
        JSON.stringify(record),
        'utf8',
      );

      // Create empty ledger directories (the bypass attempt)
      fs.mkdirSync(path.join(runDir, 'deep-review-ledger'));
      fs.mkdirSync(path.join(runDir, 'deep-review-effect-ledger'));

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
      // The observation gate must run and refuse with EFFECT_LEDGER_EMPTY
      // because the ledger directories exist but contain no effect events.
      expect(failure.check).toBe('parity');
      expect(failure.reason as string).toContain('EFFECT_LEDGER_EMPTY');
      expect(result.json.completedModes).toEqual([]);
    } finally {
      fs.rmSync(authorityRoot, { recursive: true, force: true });
      fs.rmSync(runDir, { recursive: true, force: true });
    }
  });

  // The Hole B regression test. Before the fix, buildRunStep called
  // buildObservedClassificationManifest and discarded the returned manifest,
  // so the gate collapsed to "did reading throw" and a ledger whose evidence
  // was ambiguous read as clean. The fix captures the manifest and enforces
  // the reconstructed verdict on every row via enforceObservedClassificationVerdict.
  //
  // This test exercises that helper against a REAL manifest built from an
  // intent-only ledger (an intent recorded with no confirmation), rather than
  // by spawning the CLI subprocess. The CLI's effect ledger is constructed
  // with the authority registry as its event registry, which cannot decode
  // effect events, so observeRestartFacts always refuses before the verdict
  // check is reachable through the subprocess; the effect subsystem is not
  // yet wired. The verdict-enforcement helper is the exact function
  // buildRunStep calls once observation succeeds, so testing it here proves
  // the verdict is enforced rather than discarded — the defect Hole B names.
  describe('Hole B: observed classification verdict is enforced, not discarded', () => {
    function effectIntentEvent(effectId: string): unknown {
      return {
        event: {
          effective: {
            envelope: {
              event_type: 'deep-loop.effect.intent-recorded',
              payload: { effect_id: effectId },
            },
          },
        },
      };
    }

    function effectConfirmationEvent(effectId: string): unknown {
      return {
        event: {
          effective: {
            envelope: {
              event_type: 'deep-loop.effect.confirmed',
              payload: { effect_id: effectId },
            },
          },
        },
      };
    }

    function stubLedgerPort(headSequence: number, events: readonly unknown[]): LedgerReadPort {
      return {
        async getVerifiedHead() {
          return { sequence: headSequence };
        },
        async readVerifiedEvents() {
          return events;
        },
      };
    }

    const manifestTempRoots: string[] = [];

    function makeManifestRunDirectory(): string {
      const dir = mkdtempSync(join(tmpdir(), 'enable-modes-verdict-'));
      manifestTempRoots.push(dir);
      mkdirSync(join(dir, 'mode-ledger'));
      mkdirSync(join(dir, 'effect-ledger'));
      return dir;
    }

    async function buildManifestFromLedger(events: readonly unknown[]) {
      const runDirectory = makeManifestRunDirectory();
      const modeLedger = stubLedgerPort(7, []);
      const effectLedger = stubLedgerPort(0, events);
      const observation: ObserveRestartFactsOptions = {
        runDirectory,
        modeLedgerId: 'mode-ledger',
        effectLedgerId: 'effect-ledger',
        modeLedger: () => modeLedger,
        effectLedger: () => effectLedger,
        leases: [],
        continuityId: 'lineage-alpha',
      };
      const censusBytes = readFileSync(CENSUS_PATH);
      const census = JSON.parse(censusBytes.toString('utf8')) as { rows: { id: string; lifecycle: string; mutability: string }[] };
      return buildObservedClassificationManifest({
        observation,
        rows: census.rows.map((row) => ({
          rowId: row.id,
          lifecycle: row.lifecycle,
          mutability: row.mutability,
        })),
        classificationId: 'enablement-verdict-test',
        classifiedAt: '2026-08-21T00:00:00Z',
        classifierBuildId: 'enablement-check',
        censusBytes,
      });
    }

    afterEach(() => {
      while (manifestTempRoots.length > 0) {
        const dir = manifestTempRoots.pop() as string;
        rmSync(dir, { recursive: true, force: true });
      }
    });

    it('an intent-only ledger produces a FAILED verdict naming the unmet field (receiptCoverage)', async () => {
      // Before the fix this case returned ok: the manifest was built and
      // discarded, so the derivation's verified:false was never read. The
      // fix must turn that into a failure naming the specific unmet
      // condition so an operator sees receiptCoverage rather than a generic
      // refusal.
      const manifest = await buildManifestFromLedger([effectIntentEvent('effect-pending')]);
      const verdict = enforceObservedClassificationVerdict(manifest);

      expect(verdict.ok).toBe(false);
      expect(typeof verdict.reason).toBe('string');
      expect(verdict.reason as string).toContain('receiptCoverage');
    });

    it('the failed verdict has the shape buildRunStep turns into a no-authority-write step', async () => {
      // buildRunStep maps a failed verdict to { ok: false, failedCheck:
      // 'parity', surfaces: null }. A step that returns ok:false never
      // reaches the compare-and-swap, so no authority record is written —
      // the same guarantee the observation-refusal CLI tests above prove on
      // disk. This pins the shape the helper must produce so that wiring
      // remains fail-closed.
      const manifest = await buildManifestFromLedger([effectIntentEvent('effect-pending')]);
      const verdict = enforceObservedClassificationVerdict(manifest);

      expect(verdict.ok).toBe(false);
      // The helper returns the reason; buildRunStep wraps it with
      // failedCheck 'parity' and surfaces null. Asserting the reason is
      // present and non-empty is what gives the no-authority-write
      // guarantee its force: an empty reason would satisfy an absence
      // check by containing nothing.
      expect((verdict.reason ?? '').length).toBeGreaterThan(0);
    });

    it('an intent-plus-confirmation ledger produces a passing verdict', async () => {
      const manifest = await buildManifestFromLedger([
        effectIntentEvent('effect-done'),
        effectConfirmationEvent('effect-done'),
      ]);
      const verdict = enforceObservedClassificationVerdict(manifest);

      expect(verdict.ok).toBe(true);
      expect(verdict.reason).toBeUndefined();
    });
  });
});