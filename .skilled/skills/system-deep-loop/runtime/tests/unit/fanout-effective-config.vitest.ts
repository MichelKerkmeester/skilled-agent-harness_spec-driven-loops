// ───────────────────────────────────────────────────────────────
// MODULE: Fan-out effective_config truth per executor kind
// ───────────────────────────────────────────────────────────────
// What a preview prints as a lineage's permission flag, sandbox enforcement
// and effort must match the command its builder emits, kind by kind.

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const here = fileURLToPath(new URL('.', import.meta.url));
const runtimeRoot = resolve(here, '..', '..');
const requireCjs = createRequire(import.meta.url);
const { buildLineageCommand } = requireCjs(resolve(runtimeRoot, 'scripts', 'fanout-run.cjs')) as {
  buildLineageCommand: (
    lineage: Record<string, unknown>,
    prompt: string,
    resolvedSandbox: string,
    resolvedPermission: string,
    options?: Record<string, unknown>,
  ) => { args: string[]; effectiveConfig: Record<string, unknown> };
};

const tempDirs: string[] = [];
afterEach(() => {
  while (tempDirs.length > 0) rmSync(tempDirs.pop() as string, { recursive: true, force: true });
});

function makeTempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

function stubEnv(): NodeJS.ProcessEnv {
  const binDir = makeTempDir('fanout-effective-config-bin-');
  const versions: Record<string, string> = { opencode: '2.3.2', dsh: '0.2.2-rc.3' };
  for (const name of ['codex', 'claude', 'opencode', 'cursor-agent', 'devin', 'pi', 'dsh']) {
    const probe = versions[name]
      ? `if [ "$1" = "--version" ]; then echo ${versions[name]}; exit 0; fi\n`
      : '';
    writeFileSync(join(binDir, name), `#!/bin/sh\n${probe}exit 0\n`, { mode: 0o755 });
  }
  return { ...process.env, PATH: `${binDir}:${process.env.PATH ?? ''}` };
}

function dshRepo(): string {
  const repoRoot = makeTempDir('fanout-effective-config-dsh-');
  const patchDir = join(repoRoot, '.dsh', 'patches');
  mkdirSync(patchDir, { recursive: true });
  for (const name of [
    'route-llmgateway-deepseek.patch.yml',
    'route-opencode-go-deepseek.patch.yml',
    'lineage.patch.yml',
    'guards.patch.yml',
  ]) {
    writeFileSync(join(patchDir, name), 'patch: true\n');
  }
  return repoRoot;
}

function truth(built: { effectiveConfig: Record<string, unknown> }) {
  const { permissionMode, sandboxEnforcement, effortApplied } = built.effectiveConfig;
  return { permissionMode, sandboxEnforcement, effortApplied };
}

describe('fanout-run.cjs — effective_config reports what each command enforces', () => {
  it('pins the permission flag, sandbox enforcement and effort per executor kind', () => {
    const env = stubEnv();
    const opts = { env, executableVersion: 'stub 1.0.0', directoryRoot: process.cwd() };
    const dshOpts = { ...opts, repoRoot: dshRepo(), lineageDir: makeTempDir('fanout-effective-config-lineage-') };
    const cases: Array<[string, Record<string, unknown>, string, string, Record<string, unknown>, Record<string, unknown>]> = [
      ['codex confined', { kind: 'cli-codex' }, 'workspace-write', 'acceptEdits', opts,
        { permissionMode: null, sandboxEnforcement: 'preventive', effortApplied: 'flag' }],
      ['codex unconfined', { kind: 'cli-codex' }, 'danger-full-access', 'bypassPermissions', opts,
        { permissionMode: null, sandboxEnforcement: 'none', effortApplied: 'flag' }],
      ['claude default', { kind: 'cli-claude-code' }, 'workspace-write', 'acceptEdits', opts,
        { permissionMode: 'acceptEdits', sandboxEnforcement: 'preventive', effortApplied: 'none' }],
      ['claude bypass with effort', { kind: 'cli-claude-code', reasoningEffort: 'medium' },
        'danger-full-access', 'bypassPermissions', opts,
        { permissionMode: 'bypassPermissions', sandboxEnforcement: 'none', effortApplied: 'flag' }],
      ['opencode', { kind: 'cli-opencode', model: 'llmgateway/deepseek-v4.1-flash-1017' },
        'danger-full-access', 'acceptEdits', opts,
        { permissionMode: null, sandboxEnforcement: 'none', effortApplied: 'flag' }],
      ['cursor confined', { kind: 'cli-cursor' }, 'workspace-write', 'acceptEdits', opts,
        { permissionMode: null, sandboxEnforcement: 'preventive', effortApplied: 'none' }],
      // Plan mode is an approval mode; the OS sandbox flag is not passed on this branch.
      ['cursor read-only', { kind: 'cli-cursor' }, 'read-only', 'plan',
        {
          ...opts,
          readRoot: process.cwd(),
          env: { ...env, DEEP_LOOP_CURSOR_NEUTRAL_WORKSPACE: makeTempDir('fanout-effective-config-cursor-') },
        },
        { permissionMode: null, sandboxEnforcement: 'compensating', effortApplied: 'none' }],
      ['cursor unconfined', { kind: 'cli-cursor' }, 'danger-full-access', 'bypassPermissions', opts,
        { permissionMode: null, sandboxEnforcement: 'none', effortApplied: 'none' }],
      ['devin read-only', { kind: 'cli-devin' }, 'read-only', 'plan', opts,
        { permissionMode: 'auto', sandboxEnforcement: 'compensating', effortApplied: 'none' }],
      ['devin write', { kind: 'cli-devin' }, 'workspace-write', 'acceptEdits', opts,
        { permissionMode: 'dangerous', sandboxEnforcement: 'none', effortApplied: 'none' }],
      ['pi read-only', { kind: 'cli-pi', reasoningEffort: 'high', model: 'minimax-m3' }, 'read-only', 'plan', opts,
        { permissionMode: null, sandboxEnforcement: 'compensating', effortApplied: 'flag' }],
      ['pi write', { kind: 'cli-pi', model: 'minimax-m3' }, 'workspace-write', 'acceptEdits', opts,
        { permissionMode: null, sandboxEnforcement: 'none', effortApplied: 'none' }],
      ['dsh write', { kind: 'cli-deepseek-harness' }, 'workspace-write', 'acceptEdits', dshOpts,
        { permissionMode: 'workspace-write', sandboxEnforcement: 'preventive', effortApplied: 'baked' }],
      ['dsh read-only', { kind: 'cli-deepseek-harness' }, 'read-only', 'plan', dshOpts,
        { permissionMode: 'read-only', sandboxEnforcement: 'preventive', effortApplied: 'baked' }],
    ];
    for (const [name, lineage, sandbox, permission, options, expected] of cases) {
      const built = buildLineageCommand(lineage, 'prompt text', sandbox, permission, options);
      expect({ name, ...truth(built) }).toEqual({ name, ...expected });
    }
  });

  // A native lineage has no command to report: OpenCode 2 run cannot start the
  // registered command its adapter needed, so the builder refuses it.
  it('builds no command and reports no effective config for a native lineage', () => {
    const opts = { env: stubEnv(), executableVersion: 'stub 1.0.0', directoryRoot: process.cwd() };
    for (const [sandbox, permission] of [['read-only', 'plan'], ['workspace-write', 'acceptEdits']]) {
      expect(() => buildLineageCommand({ kind: 'native' }, 'prompt text', sandbox, permission, opts))
        .toThrow(/native fan-out lineages are not supported/);
    }
  });

  it('prints the permission value the command passes, never the Claude resolution for another kind', () => {
    const env = stubEnv();
    const built = buildLineageCommand(
      { kind: 'cli-devin' }, 'prompt text', 'read-only', 'plan', { env, executableVersion: 'stub 1.0.0' },
    );
    const flagIndex = built.args.indexOf('--permission-mode');
    expect(built.effectiveConfig.permissionMode).toBe(built.args[flagIndex + 1]);
  });
});
