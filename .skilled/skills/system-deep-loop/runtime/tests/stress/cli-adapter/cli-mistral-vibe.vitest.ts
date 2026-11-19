// ───────────────────────────────────────────────────────────────────
// MODULE: Mistral Vibe CLI Adapter Stress Tests
// ───────────────────────────────────────────────────────────────────

import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';

import { afterEach, describe, expect, it } from 'vitest';

import { runtimeRoot, spawnCjs } from '../../helpers/spawn-cjs';
import { defineAdapterStressSuite } from './fixtures/adapter-suite';
import { runBoundedProcess } from './fixtures/process-fixture';

const requireCjs = createRequire(import.meta.url);
const fanoutRun = requireCjs(resolve(runtimeRoot, 'scripts', 'fanout-run.cjs')) as {
  buildLineageCommand(
    lineage: { kind: string; model?: string },
    prompt: string,
    sandbox: string,
    permission: string,
    options: Record<string, unknown>,
  ): {
    command: string;
    args: string[];
    input?: string;
    cwd?: string;
    env?: Record<string, string>;
    effectiveConfig: Record<string, unknown>;
  };
  resolveVibeLineageOutcome(exitCode: number, lineageDir: string): 'success' | 'partial' | 'failure';
  validateVibeCompletion(exitCode: number, lineageDir: string): string | null;
};
const fanoutScript = resolve(runtimeRoot, 'scripts', 'fanout-run.cjs');
const shimSource = resolve(import.meta.dirname, 'shims', 'vibe-shim.cjs');

const PROMPT = 'hermetic vibe adapter prompt';
const MODEL = 'deepseek-flash';

interface VibeCapture {
  readonly kind: string;
  readonly pid: number;
  readonly cwd: string;
  readonly args: readonly string[];
  readonly env: Record<string, string | null>;
}

interface VibeFixture {
  readonly root: string;
  readonly lineageDir: string;
  readonly capturePath: string;
  readonly env: NodeJS.ProcessEnv;
  cleanup(): void;
}

const fixtures: VibeFixture[] = [];

function createVibeFixture(): VibeFixture {
  const root = mkdtempSync(join(tmpdir(), 'cli-mistral-vibe-stress-'));
  const binDir = join(root, 'bin');
  const lineageDir = join(root, 'lineage');
  const capturePath = join(root, 'capture.jsonl');
  mkdirSync(binDir, { recursive: true });
  mkdirSync(lineageDir, { recursive: true });
  mkdirSync(join(root, 'home'), { recursive: true });
  copyFileSync(shimSource, join(binDir, 'vibe'));
  copyFileSync(
    resolve(import.meta.dirname, '..', '..', 'helpers', 'completed-lineage-state.cjs'),
    join(binDir, 'completed-lineage-state.cjs'),
  );
  chmodSync(join(binDir, 'vibe'), 0o755);
  const fixture: VibeFixture = {
    root,
    lineageDir,
    capturePath,
    env: {
      ...process.env,
      HOME: join(root, 'home'),
      PATH: `${binDir}:${process.env.PATH ?? ''}`,
      MISTRAL_API_KEY: 'shim-mistral-token',
      VIBE_SHIM_CAPTURE: capturePath,
      SYSTEM_SPEC_GATE_ENFORCE: '0',
      AI_SESSION_CHILD: '1',
    },
    cleanup: () => rmSync(root, { recursive: true, force: true }),
  };
  fixtures.push(fixture);
  return fixture;
}

function buildVibeCommand(fixture: VibeFixture): ReturnType<typeof fanoutRun.buildLineageCommand> {
  return fanoutRun.buildLineageCommand(
    { kind: 'cli-mistral-vibe', model: MODEL },
    PROMPT,
    'workspace-write',
    'acceptEdits',
    {
      env: fixture.env,
      cwd: fixture.root,
      lineageDir: fixture.lineageDir,
      executableVersion: 'shim',
    },
  );
}

async function runVibe(
  fixture: VibeFixture,
  extraEnv: NodeJS.ProcessEnv = {},
): Promise<{
  built: ReturnType<typeof fanoutRun.buildLineageCommand>;
  status: number | null;
  timedOut: boolean;
  stdout: string;
  stderr: string;
}> {
  const built = buildVibeCommand(fixture);
  const result = await runBoundedProcess(built.command, built.args, {
    cwd: built.cwd ?? fixture.root,
    env: { ...fixture.env, ...built.env, ...extraEnv },
    timeoutMs: 5_000,
  });
  return { built, ...result };
}

function readCaptures(fixture: VibeFixture): readonly VibeCapture[] {
  if (!existsSync(fixture.capturePath)) return [];
  return readFileSync(fixture.capturePath, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as VibeCapture);
}

function exportPath(fixture: VibeFixture): string {
  return join(fixture.lineageDir, 'vibe-output', 'export.json');
}

function readExport(fixture: VibeFixture): Record<string, unknown> {
  return JSON.parse(readFileSync(exportPath(fixture), 'utf8')) as Record<string, unknown>;
}

afterEach(() => {
  for (const fixture of fixtures.splice(0)) fixture.cleanup();
});

defineAdapterStressSuite('cli-mistral-vibe');

describe('cli-mistral-vibe command and export contracts', () => {
  it('builds the shipped Vibe argv with a lineage-local home and prompt file', () => {
    const fixture = createVibeFixture();
    const built = buildVibeCommand(fixture);
    const lineageDir = realpathSync(fixture.lineageDir);
    const vibeHome = join(lineageDir, 'vibe-home');

    expect(built.command).toBe('vibe');
    expect(built.args).toEqual([
      '--prompt-file', join(lineageDir, 'vibe-prompt.txt'),
      '--output-dir', join(lineageDir, 'vibe-output'),
      '--trust',
      '--model', MODEL,
      '--auto-approve',
    ]);
    expect(built.cwd).toBe(lineageDir);
    // Vibe's home holds the model roster and the trust store, so it must stay inside the
    // lineage rather than reaching the operator's own ~/.vibe.
    expect(built.env).toEqual({ VIBE_HOME: vibeHome });
    expect(readFileSync(join(lineageDir, 'vibe-prompt.txt'), 'utf8')).toBe(PROMPT);
    expect(existsSync(join(vibeHome, 'config.toml'))).toBe(true);
    expect(readFileSync(join(vibeHome, 'trusted_folders.toml'), 'utf8')).toContain(lineageDir);
    // The lineage folder holds no project hooks file, so the guards load only from the home copy.
    expect(readFileSync(join(vibeHome, 'hooks.toml'), 'utf8')).not.toContain('$(');
    // Vibe exposes no confinement flag, so recording the requested sandbox as effective
    // would claim a boundary the process never had.
    expect(built.effectiveConfig).toMatchObject({
      kind: 'cli-mistral-vibe',
      model: MODEL,
      sandboxMode: null,
      permissionMode: null,
    });
  });

  it('records a clean exit with an export record as success', async () => {
    const fixture = createVibeFixture();
    const result = await runVibe(fixture);

    expect(result.status).toBe(0);
    expect(result.timedOut).toBe(false);
    expect(existsSync(exportPath(fixture))).toBe(true);
    expect(readExport(fixture)).toMatchObject({ exit_code: 0, outcome: 'finished' });
    expect(fanoutRun.resolveVibeLineageOutcome(0, fixture.lineageDir)).toBe('success');
    expect(fanoutRun.validateVibeCompletion(0, fixture.lineageDir)).toBeNull();

    const captures = readCaptures(fixture);
    expect(captures).toHaveLength(1);
    expect(captures[0].args).toEqual(result.built.args);
    expect(captures[0].cwd).toBe(realpathSync(fixture.lineageDir));
    expect(captures[0].env).toMatchObject({
      VIBE_HOME: join(realpathSync(fixture.lineageDir), 'vibe-home'),
      MISTRAL_API_KEY: 'shim-mistral-token',
    });
  });

  it('records exit 3 with an export record as partial rather than success', async () => {
    const fixture = createVibeFixture();
    const result = await runVibe(fixture, { VIBE_SHIM_EXIT: '3' });

    expect(result.status).toBe(3);
    expect(existsSync(exportPath(fixture))).toBe(true);
    expect(readExport(fixture)).toMatchObject({ exit_code: 3 });
    expect(fanoutRun.resolveVibeLineageOutcome(3, fixture.lineageDir)).toBe('partial');
    expect(fanoutRun.validateVibeCompletion(3, fixture.lineageDir)).toBe('reported a partial run (exit 3)');
    expect(fanoutRun.resolveVibeLineageOutcome(3, fixture.lineageDir)).not.toBe('success');
  });

  it('fails closed on exit 3 without an export record', async () => {
    const fixture = createVibeFixture();
    const result = await runVibe(fixture, { VIBE_SHIM_EXIT: '3', VIBE_SHIM_NO_EXPORT: '1' });

    expect(result.status).toBe(3);
    expect(existsSync(exportPath(fixture))).toBe(false);
    expect(fanoutRun.resolveVibeLineageOutcome(3, fixture.lineageDir)).toBe('failure');
    expect(fanoutRun.validateVibeCompletion(3, fixture.lineageDir))
      .toBe('exited with code 3 without an export.json record');
  });

  it('records a partial Vibe lineage through the fan-out scheduler without counting it as succeeded', async () => {
    const fixture = createVibeFixture();
    const specFolder = 'specs/cli-mistral-vibe-partial';
    const baseArtifactDir = join(fixture.root, specFolder, 'research', 'artifacts');
    mkdirSync(baseArtifactDir, { recursive: true });
    const fanoutConfig = JSON.stringify({
      executors: [{
        label: 'partial',
        kind: 'cli-mistral-vibe',
        model: MODEL,
        iterations: 1,
        timeoutSeconds: 5,
        count: 1,
      }],
      concurrency: 1,
      maxRetries: 0,
    });

    const result = await spawnCjs(fanoutScript, [
      '--spec-folder', specFolder,
      '--loop-type', 'research',
      '--fanout-config-json', fanoutConfig,
      '--base-artifact-dir', baseArtifactDir,
      '--allow-single-lineage',
    ], {
      cwd: fixture.root,
      env: { ...fixture.env, VIBE_SHIM_EXIT: '3' },
      timeoutMs: 20_000,
    });
    const payload = JSON.parse(result.stdout.split(/\r?\n/).filter(Boolean).at(-1) ?? '{}') as {
      results?: Array<{ status?: string; outcome?: string }>;
      summary?: { succeeded?: number; failed?: number };
    };

    expect(result.exitCode).not.toBe(0);
    expect(payload.results?.[0]).toMatchObject({ status: 'rejected', outcome: 'partial' });
    expect(payload.summary).toMatchObject({ succeeded: 0, failed: 1 });
    expect(existsSync(join(baseArtifactDir, 'lineages', 'partial', 'vibe-output', 'export.json'))).toBe(true);
    // The session-start hook names the packet from this marker, so it must survive the env allowlist.
    expect(realpathSync(readCaptures(fixture)[0].env.VIBE_SPEC_FOLDER ?? ''))
      .toBe(realpathSync(join(fixture.root, specFolder)));
    // Parallel lineages must not race the session-start dist self-heal into the checkout.
    expect(readCaptures(fixture)[0].env.SPECKIT_DIST_AUTO_REBUILD).toBe('0');
  });
});
