// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Stress Fixture
// ───────────────────────────────────────────────────────────────────

import {
  chmodSync,
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

export interface CodexShimFixture {
  readonly root: string;
  readonly binDir: string;
  readonly capturePath: string;
  readonly pidPath: string;
  readonly reapCapturePath: string;
  readonly env: NodeJS.ProcessEnv;
  cleanup(): void;
}

export interface CodexShimCapture {
  readonly pid: number;
  readonly cwd: string;
  readonly args: readonly string[];
  readonly stdin: string;
  readonly env: {
    readonly AI_SESSION_CHILD: string | null;
    readonly MK_SPEC_GATE_ENFORCE: string | null;
    readonly MK_SPEC_GATE_DISABLED: string | null;
  };
  readonly childPid?: number;
  readonly grandchildPid?: number;
}

export function createCodexShim(mode: string): CodexShimFixture {
  const root = mkdtempSync(join(tmpdir(), 'cli-codex-stress-'));
  const binDir = join(root, 'bin');
  const capturePath = join(root, 'capture.json');
  const pidPath = join(root, 'pids.json');
  const reapCapturePath = join(root, 'reap-invocations.jsonl');
  mkdirSync(binDir, { recursive: true });
  const source = join(dirname(import.meta.filename), '..', 'shims', 'codex-shim.cjs');
  const executable = join(binDir, 'codex');
  const pkillExecutable = join(binDir, 'pkill');
  copyFileSync(source, executable);
  copyFileSync(source, pkillExecutable);
  chmodSync(executable, 0o755);
  chmodSync(pkillExecutable, 0o755);
  return {
    root,
    binDir,
    capturePath,
    pidPath,
    reapCapturePath,
    env: {
      ...process.env,
      PATH: `${binDir}:${process.env.PATH ?? ''}`,
      CLI_ADAPTER_SHIM_MODE: mode,
      CLI_ADAPTER_SHIM_CAPTURE: capturePath,
      CLI_ADAPTER_SHIM_PID_FILE: pidPath,
      CLI_ADAPTER_REAP_CAPTURE: reapCapturePath,
    },
    cleanup: () => rmSync(root, { recursive: true, force: true }),
  };
}

export function readCodexCapture(fixture: CodexShimFixture): CodexShimCapture {
  return JSON.parse(readFileSync(fixture.capturePath, 'utf8')) as CodexShimCapture;
}

export function withProcessEnv<T>(env: NodeJS.ProcessEnv, operation: () => T): T {
  const before = { ...process.env };
  for (const key of Object.keys(process.env)) delete process.env[key];
  Object.assign(process.env, env);
  try {
    return operation();
  } finally {
    for (const key of Object.keys(process.env)) delete process.env[key];
    Object.assign(process.env, before);
  }
}

export function writeExpectedLineageArtifacts(root: string, iterations = 1): readonly string[] {
  const paths = [join(root, 'research.md'), join(root, 'logs', 'fanout-lineage.out')];
  mkdirSync(join(root, 'iterations'), { recursive: true });
  mkdirSync(join(root, 'logs'), { recursive: true });
  writeFileSync(paths[0], '# Research\n', 'utf8');
  writeFileSync(paths[1], 'FANOUT_LINEAGE_COMPLETE:fixture\n', 'utf8');
  for (let index = 1; index <= iterations; index += 1) {
    const iterationPath = join(root, 'iterations', `iteration-${String(index).padStart(3, '0')}.md`);
    writeFileSync(iterationPath, `# Iteration ${index}\n`, 'utf8');
    paths.push(iterationPath);
  }
  return paths;
}
