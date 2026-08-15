// ───────────────────────────────────────────────────────────────────
// MODULE: CLI Adapter Stress Fixture
// ───────────────────────────────────────────────────────────────────

import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

import { spawnCjs, type SpawnCjsResult } from '../../../helpers/spawn-cjs';

export const ADAPTER_KINDS = [
  'cli-opencode',
  'cli-pi',
  'cli-claude-code',
  'cli-devin',
  'cli-cursor',
] as const;

export type AdapterKind = typeof ADAPTER_KINDS[number];

const BINARY_BY_KIND: Record<AdapterKind, string> = {
  'cli-opencode': 'opencode',
  'cli-pi': 'pi',
  'cli-claude-code': 'claude',
  'cli-devin': 'devin',
  'cli-cursor': 'cursor-agent',
};

const SHIM_BY_KIND: Record<AdapterKind, string> = {
  'cli-opencode': 'opencode-shim.cjs',
  'cli-pi': 'pi-shim.cjs',
  'cli-claude-code': 'claude-code-shim.cjs',
  'cli-devin': 'devin-shim.cjs',
  'cli-cursor': 'cursor-shim.cjs',
};

export const MODEL_BY_KIND: Record<AdapterKind, string> = {
  'cli-opencode': 'anthropic/claude-opus-4-8',
  'cli-pi': 'gpt-5.6-luna',
  'cli-claude-code': 'claude-opus-4-8',
  'cli-devin': 'glm-5-2',
  'cli-cursor': 'composer-2.5',
};

export interface AdapterShimCapture {
  readonly kind: AdapterKind;
  readonly pid: number;
  readonly cwd: string;
  readonly args: readonly string[];
  readonly stdin: string;
  readonly env: Readonly<Record<string, string | null>>;
  readonly childPid?: number;
  readonly grandchildPid?: number;
}

export interface AdapterShimFixture {
  readonly kind: AdapterKind;
  readonly root: string;
  readonly binDir: string;
  readonly capturePath: string;
  readonly pidPath: string;
  readonly env: NodeJS.ProcessEnv;
  cleanup(): void;
}

export interface FanoutRunFixture {
  readonly result: SpawnCjsResult;
  readonly baseArtifactDir: string;
  readonly lineageDir: string;
}

const fanoutScript = resolve(import.meta.dirname, '../../../../scripts/fanout-run.cjs');

export function createAdapterShim(kind: AdapterKind, mode: string): AdapterShimFixture {
  const root = mkdtempSync(join(tmpdir(), `${kind}-stress-`));
  const binDir = join(root, 'bin');
  const capturePath = join(root, 'capture.jsonl');
  const pidPath = join(root, 'pids.json');
  const shimDir = join(dirname(import.meta.filename), '..', 'shims');
  mkdirSync(binDir, { recursive: true });
  mkdirSync(join(root, 'home'), { recursive: true });
  writeFileSync(join(root, 'home', '.cli-adapter-control.json'), JSON.stringify({
    mode,
    capturePath,
    pidPath,
  }), 'utf8');
  copyFileSync(join(shimDir, SHIM_BY_KIND[kind]), join(binDir, BINARY_BY_KIND[kind]));
  copyFileSync(join(shimDir, 'adapter-shim-core.cjs'), join(binDir, 'adapter-shim-core.cjs'));
  chmodSync(join(binDir, BINARY_BY_KIND[kind]), 0o755);
  return {
    kind,
    root,
    binDir,
    capturePath,
    pidPath,
    env: {
      ...process.env,
      HOME: join(root, 'home'),
      PATH: `${binDir}:${process.env.PATH ?? ''}`,
      CLI_ADAPTER_SHIM_MODE: mode,
      CLI_ADAPTER_SHIM_CAPTURE: capturePath,
      CLI_ADAPTER_SHIM_PID_FILE: pidPath,
      MK_SPEC_GATE_ENFORCE: '0',
      AI_SESSION_CHILD: '1',
    },
    cleanup: () => rmSync(root, { recursive: true, force: true }),
  };
}

export function readAdapterCaptures(fixture: AdapterShimFixture): readonly AdapterShimCapture[] {
  if (!existsSync(fixture.capturePath)) return [];
  return readFileSync(fixture.capturePath, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as AdapterShimCapture);
}

export function readRecordedPids(fixture: AdapterShimFixture): Readonly<Record<string, number>> {
  if (!existsSync(fixture.pidPath)) return {};
  return JSON.parse(readFileSync(fixture.pidPath, 'utf8')) as Record<string, number>;
}

export async function runAdapterFanout(
  fixture: AdapterShimFixture,
  options: {
    readonly label?: string;
    readonly mode?: string;
    readonly sandboxMode?: string;
    readonly iterations?: number;
    readonly timeoutSeconds?: number;
    readonly maxCostUnitsPerLineage?: number;
    readonly costUnitsPerIteration?: number;
    readonly count?: number;
    readonly concurrency?: number;
    readonly includeTransport?: boolean;
    readonly extraEnv?: NodeJS.ProcessEnv;
  } = {},
): Promise<FanoutRunFixture> {
  const label = options.label ?? 'adapter';
  const specFolder = `specs/${fixture.kind}-${options.mode ?? 'stress'}`;
  const baseArtifactDir = join(fixture.root, specFolder, 'research', 'artifacts');
  const configDir = '.claude-stress';
  mkdirSync(baseArtifactDir, { recursive: true });
  mkdirSync(join(fixture.root, configDir), { recursive: true });

  const executor: Record<string, unknown> = {
    label,
    kind: fixture.kind,
    model: MODEL_BY_KIND[fixture.kind],
    iterations: options.iterations ?? 1,
    timeoutSeconds: options.timeoutSeconds ?? 5,
    count: options.count ?? 1,
  };
  if (fixture.kind === 'cli-claude-code') executor.configDir = configDir;
  if (fixture.kind === 'cli-opencode' || fixture.kind === 'cli-pi' || fixture.kind === 'cli-claude-code') {
    executor.reasoningEffort = 'high';
  }
  if (fixture.kind !== 'cli-pi' && options.sandboxMode) {
    executor.sandboxMode = options.sandboxMode;
  }

  const fanoutConfig = JSON.stringify({
    executors: [executor],
    concurrency: options.concurrency ?? 1,
    maxRetries: 0,
    ...(options.maxCostUnitsPerLineage === undefined
      ? {}
      : { maxCostUnitsPerLineage: options.maxCostUnitsPerLineage }),
    ...(options.costUnitsPerIteration === undefined
      ? {}
      : { costUnitsPerIteration: options.costUnitsPerIteration }),
  });
  const env = {
    ...fixture.env,
    ...options.extraEnv,
    PATH: options.includeTransport === false
      ? '/usr/bin:/bin'
      : fixture.env.PATH,
  };
  const result = await spawnCjs(fanoutScript, [
    '--spec-folder', specFolder,
    '--loop-type', 'research',
    '--fanout-config-json', fanoutConfig,
    '--base-artifact-dir', baseArtifactDir,
  ], {
    cwd: fixture.root,
    env,
    timeoutMs: 12_000,
  });
  return {
    result,
    baseArtifactDir,
    lineageDir: join(baseArtifactDir, 'lineages', label),
  };
}

export function adapterBinary(kind: AdapterKind): string {
  return BINARY_BY_KIND[kind];
}

export function preflightAdapterLive(kind: AdapterKind, env: NodeJS.ProcessEnv): {
  readonly ready: boolean;
  readonly reason: string | null;
} {
  const flag = `DEEP_LOOP_${kind.replaceAll('-', '_').toUpperCase()}_LIVE`;
  if (env[flag] !== '1') {
    return { ready: false, reason: `live probe disabled: set ${flag}=1` };
  }
  const binary = BINARY_BY_KIND[kind];
  const available = spawnSync('/bin/sh', ['-c', `command -v ${binary} >/dev/null 2>&1`], {
    env,
    stdio: 'ignore',
    timeout: 1_000,
  });
  if (available.status !== 0) {
    return { ready: false, reason: `dependency missing: command -v ${binary} failed` };
  }
  return { ready: true, reason: null };
}
