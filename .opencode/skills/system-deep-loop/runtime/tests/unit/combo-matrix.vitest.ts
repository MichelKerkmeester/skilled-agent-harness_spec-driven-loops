import { createRequire } from 'node:module';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  CURSOR_SUPPORTED_MODELS,
  DEVIN_SUPPORTED_MODELS,
  EXECUTOR_KINDS,
  PI_SUPPORTED_MODELS,
  type ExecutorKind,
} from '../../lib/deep-loop/executor-config';
import { runtimeRoot } from '../helpers/spawn-cjs';

const requireCjs = createRequire(import.meta.url);
const fanoutRunScript = resolve(runtimeRoot, 'scripts', 'fanout-run.cjs');
const { buildLineageCommand } = requireCjs(fanoutRunScript) as {
  buildLineageCommand: (
    lineage: { kind: ExecutorKind; model?: string },
    prompt: string,
    resolvedSandbox: SandboxMode,
    resolvedPermission: PermissionMode,
    options: {
      env?: NodeJS.ProcessEnv;
      loopType: 'research' | 'review';
      specFolder: string;
      lineageDir: string;
    },
  ) => {
    command: string;
    args: string[];
    input?: string;
    effectiveConfig: { kind: string };
  };
};

type SandboxMode = 'read-only' | 'workspace-write' | 'danger-full-access';
type PermissionMode = 'plan' | 'acceptEdits' | 'bypassPermissions';

const SANDBOX_MODES: readonly SandboxMode[] = [
  'read-only',
  'workspace-write',
  'danger-full-access',
];
const PERMISSION_BY_SANDBOX: Record<SandboxMode, PermissionMode> = {
  'read-only': 'plan',
  'workspace-write': 'acceptEdits',
  'danger-full-access': 'bypassPermissions',
};
const MATRIX_PROMPT = 'matrix prompt';
const MATRIX_OPTIONS = {
  loopType: 'review' as const,
  specFolder: 'specs/combo-matrix',
  lineageDir: '/tmp/combo-matrix',
};

const MODELS_BY_KIND: Record<ExecutorKind, readonly (string | undefined)[]> = {
  native: [undefined],
  'cli-codex': ['o4-mini', 'gpt-5.6-codex'],
  'cli-claude-code': ['claude-opus-4-8', 'claude-sonnet-4-6'],
  'cli-opencode': ['anthropic/claude-opus-4-8', 'opencode-go/glm-5.1'],
  'cli-cursor': CURSOR_SUPPORTED_MODELS,
  'cli-devin': DEVIN_SUPPORTED_MODELS,
  'cli-pi': PI_SUPPORTED_MODELS,
};

const COMMAND_BY_KIND: Record<ExecutorKind, string> = {
  native: 'opencode',
  'cli-codex': 'codex',
  'cli-claude-code': 'claude',
  'cli-opencode': 'opencode',
  'cli-cursor': 'cursor-agent',
  'cli-devin': 'devin',
  'cli-pi': 'pi',
};

const CREDENTIALS_GATED_KINDS = new Set<ExecutorKind>(EXECUTOR_KINDS);
const tempDirs: string[] = [];

function makeTempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

function writeStubBinary(binDir: string, name: string): string {
  const stubPath = join(binDir, name);
  writeFileSync(stubPath, '#!/bin/sh\nexit 0\n', { mode: 0o755 });
  return stubPath;
}

function installStubExecutors(names: readonly string[]): { env: NodeJS.ProcessEnv; restore: () => void } {
  const binDir = makeTempDir('combo-matrix-bin-');
  for (const name of names) writeStubBinary(binDir, name);

  const previousPath = process.env.PATH;
  process.env.PATH = `${binDir}${delimiter}${previousPath ?? ''}`;
  return {
    env: { ...process.env },
    restore: () => {
      if (previousPath === undefined) delete process.env.PATH;
      else process.env.PATH = previousPath;
    },
  };
}

function expectedRepresentativeArgs(kind: ExecutorKind, model: string | undefined): string[] {
  switch (kind) {
    case 'native': {
      const nativeInput = [
        ':auto "specs/combo-matrix" --spec-folder=specs/combo-matrix --max-iterations=12 --convergence=0.1 --stop-policy=convergence --fanout-lineage-artifact-dir=/tmp/combo-matrix --lineage-mode=auto',
        '',
        'PRE-BOUND SETUP ANSWERS:',
        'review_target: specs/combo-matrix',
        'review_target_type: spec-folder',
        'review_dimensions: all',
        'spec_folder: specs/combo-matrix',
        'execution_mode: AUTONOMOUS',
        'lineage_mode: auto',
        'maxIterations: 12',
        'convergenceThreshold: 0.1',
        'stop_policy: convergence',
        'config.fanout_lineage_artifact_dir: /tmp/combo-matrix',
      ].join('\n');
      return ['run', '--format', 'json', '--dangerously-skip-permissions', '--dir', process.cwd(), '--command', 'deep/review', nativeInput];
    }
    case 'cli-codex':
      return ['exec', '--model', model ?? '', '-c', 'model_reasoning_effort=medium', '-c', 'approval_policy=never', '--sandbox', 'read-only', '-'];
    case 'cli-claude-code':
      return ['-p', MATRIX_PROMPT, '--model', model ?? '', '--permission-mode', 'plan', '--output-format', 'text'];
    case 'cli-opencode':
      return ['run', '--model', model ?? '', '--format', 'json', '--dir', process.cwd(), MATRIX_PROMPT];
    case 'cli-cursor':
      return [
        '-p', MATRIX_PROMPT, '--output-format', 'text', '--model', model ?? '',
        '--mode', 'plan', '--trust',
        '--workspace', join(tmpdir(), 'deep-loop-cursor-neutral-workspace'), '--add-dir', process.cwd(),
      ];
    case 'cli-devin':
      return ['-p', MATRIX_PROMPT, '--model', model ?? '', '--permission-mode', 'auto'];
    case 'cli-pi':
      return ['-p', '--offline', '--model', 'deepseek/deepseek-v4-pro', '--tools', 'read,grep,find,ls', '--no-extensions', '--no-skills', '--no-prompt-templates', MATRIX_PROMPT];
  }
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('fanout-run.cjs — complete executor/model/sandbox construction matrix', () => {
  it('constructs every matrix combination, proves exact representative argv, and logs live skips', () => {
    const installed = installStubExecutors(Object.values(COMMAND_BY_KIND));
    const exercisedKinds = new Set<ExecutorKind>();
    const exercisedModelsByKind: Partial<Record<ExecutorKind, Set<string>>> = {};
    let constructedCombinations = 0;
    let liveDispatchSkips = 0;

    try {
      for (const kind of EXECUTOR_KINDS) {
        for (const model of MODELS_BY_KIND[kind]) {
          for (const sandbox of SANDBOX_MODES) {
            const lineage = model === undefined ? { kind } : { kind, model };
            const command = buildLineageCommand(
              lineage,
              MATRIX_PROMPT,
              sandbox,
              PERMISSION_BY_SANDBOX[sandbox],
              { env: installed.env, ...MATRIX_OPTIONS },
            );

            expect(command.command).toEqual(expect.any(String));
            expect(command.command.length).toBeGreaterThan(0);
            expect(command.args).toEqual(expect.any(Array));
            expect(command.args.length).toBeGreaterThan(0);
            expect(command.effectiveConfig.kind).toBe(kind);

            constructedCombinations += 1;
            exercisedKinds.add(kind);
            if (model !== undefined) {
              const exercisedModels = exercisedModelsByKind[kind] ?? new Set<string>();
              exercisedModels.add(model);
              exercisedModelsByKind[kind] = exercisedModels;
            }

            const modelLabel = model ?? '(none)';
            console.log(`[combo-matrix] constructed kind=${kind} model=${modelLabel} sandbox=${sandbox}`);
            if (CREDENTIALS_GATED_KINDS.has(kind)) {
              liveDispatchSkips += 1;
              console.log(`[combo-matrix] skipped live credentialed dispatch kind=${kind} model=${modelLabel} sandbox=${sandbox} reason=construction coverage only; credentials are intentionally not used`);
            }

            if (model === MODELS_BY_KIND[kind][0] && sandbox === SANDBOX_MODES[0]) {
              expect(command.command).toBe(COMMAND_BY_KIND[kind]);
              expect(command.args).toEqual(expectedRepresentativeArgs(kind, model));
            }
          }
        }
      }

      const expectedCombinationCount = EXECUTOR_KINDS.reduce(
        (total, kind) => total + MODELS_BY_KIND[kind].length * SANDBOX_MODES.length,
        0,
      );
      expect(constructedCombinations).toBe(expectedCombinationCount);
      expect(new Set(exercisedKinds)).toEqual(new Set(EXECUTOR_KINDS));
      expect([...exercisedModelsByKind['cli-cursor'] ?? []].sort()).toEqual([...CURSOR_SUPPORTED_MODELS].sort());
      expect([...exercisedModelsByKind['cli-devin'] ?? []].sort()).toEqual([...DEVIN_SUPPORTED_MODELS].sort());
      expect([...exercisedModelsByKind['cli-pi'] ?? []].sort()).toEqual([...PI_SUPPORTED_MODELS].sort());
      expect(liveDispatchSkips).toBe(expectedCombinationCount);

      console.log(`[combo-matrix] SUMMARY constructed=${constructedCombinations} liveCredentialedDispatch=SKIPPED outOfScope=true skipped=${liveDispatchSkips} credentialGatedKinds=${[...CREDENTIALS_GATED_KINDS].join(',')}`);
    } finally {
      installed.restore();
    }
  });

  it('fails closed for an out-of-roster cursor, devin, or pi model', () => {
    const installed = installStubExecutors(['cursor-agent', 'devin', 'pi']);
    try {
      for (const kind of ['cli-cursor', 'cli-devin', 'cli-pi'] as const) {
        expect(() => buildLineageCommand(
          { kind, model: 'not-a-real-model' },
          MATRIX_PROMPT,
          'workspace-write',
          'acceptEdits',
          { env: installed.env, ...MATRIX_OPTIONS },
        )).toThrow(/not in the enforced allowlist/);
      }
    } finally {
      installed.restore();
    }
  });
});
