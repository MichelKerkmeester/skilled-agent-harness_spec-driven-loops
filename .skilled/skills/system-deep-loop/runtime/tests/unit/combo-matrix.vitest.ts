// ───────────────────────────────────────────────────────────────────
// MODULE: Fanout Combo Matrix Tests
// ───────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { existsSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  CURSOR_SUPPORTED_MODELS,
  DEVIN_SUPPORTED_MODELS,
  EXECUTOR_KINDS,
  DSH_SUPPORTED_MODELS,
  PI_SUPPORTED_MODELS,
  VIBE_SUPPORTED_MODELS,
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
  'cli-deepseek-harness': DSH_SUPPORTED_MODELS,
  'cli-mistral-vibe': VIBE_SUPPORTED_MODELS,
};

const DSH_GUARDS_PATCH = resolve(runtimeRoot, '..', '..', '..', '..', '.dsh', 'patches', 'guards.patch.yml');

const COMMAND_BY_KIND: Record<ExecutorKind, string> = {
  native: 'opencode',
  'cli-codex': 'codex',
  'cli-claude-code': 'claude',
  'cli-opencode': 'opencode',
  'cli-cursor': 'cursor-agent',
  'cli-devin': 'devin',
  'cli-pi': 'pi',
  'cli-deepseek-harness': 'dsh',
  'cli-mistral-vibe': 'vibe',
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
  const script = name === 'opencode'
    ? '#!/bin/sh\nif [ "$1" = "--version" ]; then echo 2.3.2; exit 0; fi\nexit 0\n'
    : name === 'dsh'
      ? '#!/bin/sh\nif [ "$1" = "--version" ]; then echo 0.2.2-rc.3; exit 0; fi\nexit 0\n'
      : name === 'vibe'
        ? '#!/bin/sh\nif [ "$1" = "--version" ]; then echo 3.1.2; exit 0; fi\nexit 0\n'
        : '#!/bin/sh\nexit 0\n';
  writeFileSync(stubPath, script, { mode: 0o755 });
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

function expectedRepresentativeArgs(kind: ExecutorKind, model: string | undefined, sandbox: SandboxMode): string[] {
  switch (kind) {
    case 'native':
      throw new Error('a native lineage builds no fan-out command');
    case 'cli-codex':
      return ['exec', '--model', model ?? '', '-c', 'model_reasoning_effort=medium', '-c', 'approval_policy=never', '--sandbox', 'read-only', '-'];
    case 'cli-claude-code':
      return ['-p', MATRIX_PROMPT, '--model', model ?? '', '--permission-mode', 'plan', '--output-format', 'text'];
    case 'cli-opencode':
      return ['run', '--standalone', '-m', model ?? '', '--format', 'json', '--auto', MATRIX_PROMPT];
    case 'cli-cursor':
      return [
        '-p', MATRIX_PROMPT, '--output-format', 'text', '--model', model ?? '',
        '--mode', 'plan', '--trust',
        '--workspace', join(tmpdir(), 'deep-loop-cursor-neutral-workspace'), '--add-dir', process.cwd(),
      ];
    case 'cli-devin':
      return ['-p', MATRIX_PROMPT, '--model', model ?? '', '--permission-mode', 'auto', '--respect-workspace-trust', 'false'];
    case 'cli-pi':
      return ['-p', '--offline', '--model', 'llmgateway/deepseek-v4.1-flash-1017', '--tools', 'read,grep,find,ls', '--no-extensions', '--no-skills', '--no-prompt-templates', '--thinking', 'max', MATRIX_PROMPT];
    case 'cli-deepseek-harness':
      return [
        '--profile', 'headless', '--patch', resolve(runtimeRoot, '..', '..', '..', '..', '.dsh', 'patches', 'route-llmgateway-deepseek.patch.yml'),
        '--patch', resolve(runtimeRoot, '..', '..', '..', '..', '.dsh', 'patches', 'lineage.patch.yml'),
        // The builder mounts the guards patch only when the repository ships it.
        ...(existsSync(DSH_GUARDS_PATCH) ? ['--patch', DSH_GUARDS_PATCH] : []),
        '--json', '--permission-mode', 'read-only', '--approval-policy', 'never', '-',
      ];
    case 'cli-mistral-vibe':
      return [
        '--prompt-file', join(realpathSync(MATRIX_OPTIONS.lineageDir), 'vibe-prompt.txt'),
        '--output-dir', join(realpathSync(MATRIX_OPTIONS.lineageDir), 'vibe-output'),
        '--trust', '--model', model ?? '', '--auto-approve',
      ];
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
    let rejectedCombinations = 0;
    let liveDispatchSkips = 0;

    try {
      for (const kind of EXECUTOR_KINDS) {
        for (const model of MODELS_BY_KIND[kind]) {
          for (const sandbox of SANDBOX_MODES) {
            const lineage = model === undefined ? { kind } : { kind, model };
            const modelLabel = model ?? '(none)';

            // A native lineage has no fan-out adapter: OpenCode 2 run cannot start the
            // registered command that adapter needed, so every sandbox mode is refused.
            if (kind === 'native') {
              expect(() => buildLineageCommand(
                lineage,
                MATRIX_PROMPT,
                sandbox,
                PERMISSION_BY_SANDBOX[sandbox],
                { env: installed.env, ...MATRIX_OPTIONS },
              )).toThrow(/native fan-out lineages are not supported/);
              rejectedCombinations += 1;
              exercisedKinds.add(kind);
              console.log(`[combo-matrix] rejected kind=${kind} model=${modelLabel} sandbox=${sandbox} reason=native-lineage-refused`);
              continue;
            }

            // cli-opencode exposes no OS-level sandbox flag: only danger-full-access
            // (which makes no confinement claim) is honest to construct. read-only and
            // workspace-write must fail closed rather than silently dispatch unconfined.
            if (kind === 'cli-opencode' && sandbox !== 'danger-full-access') {
              expect(() => buildLineageCommand(
                lineage,
                MATRIX_PROMPT,
                sandbox,
                PERMISSION_BY_SANDBOX[sandbox],
                { env: installed.env, ...MATRIX_OPTIONS },
              )).toThrow(/cannot enforce sandbox mode/);
              rejectedCombinations += 1;
              exercisedKinds.add(kind);
              if (model !== undefined) {
                const exercisedModels = exercisedModelsByKind[kind] ?? new Set<string>();
                exercisedModels.add(model);
                exercisedModelsByKind[kind] = exercisedModels;
              }
              console.log(`[combo-matrix] rejected kind=${kind} model=${modelLabel} sandbox=${sandbox} reason=unenforceable-sandbox`);
              continue;
            }

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

            console.log(`[combo-matrix] constructed kind=${kind} model=${modelLabel} sandbox=${sandbox}`);
            if (CREDENTIALS_GATED_KINDS.has(kind)) {
              liveDispatchSkips += 1;
              console.log(`[combo-matrix] skipped live credentialed dispatch kind=${kind} model=${modelLabel} sandbox=${sandbox} reason=construction coverage only; credentials are intentionally not used`);
            }

            if (model === MODELS_BY_KIND[kind][0] && sandbox === SANDBOX_MODES[0] && !(kind === 'cli-opencode' && sandbox !== 'danger-full-access')) {
              expect(command.command).toBe(COMMAND_BY_KIND[kind]);
              expect(command.args).toEqual(expectedRepresentativeArgs(kind, model, sandbox));
            }
          }
        }
      }

      const expectedCombinationCount = EXECUTOR_KINDS.reduce(
        (total, kind) => total + MODELS_BY_KIND[kind].length * SANDBOX_MODES.length,
        0,
      );
      expect(constructedCombinations + rejectedCombinations).toBe(expectedCombinationCount);
      // Every cli-opencode model is rejected for both unenforceable sandbox modes, and a
      // native lineage is rejected for every sandbox mode.
      expect(rejectedCombinations).toBe(
        MODELS_BY_KIND['cli-opencode'].length * 2 + MODELS_BY_KIND.native.length * SANDBOX_MODES.length,
      );
      expect(new Set(exercisedKinds)).toEqual(new Set(EXECUTOR_KINDS));
      expect([...exercisedModelsByKind['cli-cursor'] ?? []].sort()).toEqual([...CURSOR_SUPPORTED_MODELS].sort());
      expect([...exercisedModelsByKind['cli-devin'] ?? []].sort()).toEqual([...DEVIN_SUPPORTED_MODELS].sort());
      expect([...exercisedModelsByKind['cli-pi'] ?? []].sort()).toEqual([...PI_SUPPORTED_MODELS].sort());
      expect(liveDispatchSkips).toBe(constructedCombinations);

      console.log(`[combo-matrix] SUMMARY constructed=${constructedCombinations} rejected=${rejectedCombinations} liveCredentialedDispatch=SKIPPED outOfScope=true skipped=${liveDispatchSkips} credentialGatedKinds=${[...CREDENTIALS_GATED_KINDS].join(',')}`);
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
