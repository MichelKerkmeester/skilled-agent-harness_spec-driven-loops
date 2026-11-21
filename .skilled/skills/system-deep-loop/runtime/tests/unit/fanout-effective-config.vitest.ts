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
const { buildLineageCommand, finishedLineageMismatch } = requireCjs(resolve(runtimeRoot, 'scripts', 'fanout-run.cjs')) as {
  buildLineageCommand: (
    lineage: Record<string, unknown>,
    prompt: string,
    resolvedSandbox: string,
    resolvedPermission: string,
    options?: Record<string, unknown>,
  ) => { args: string[]; effectiveConfig: Record<string, unknown>; invocationFingerprint: string };
  finishedLineageMismatch: (input: Record<string, unknown>) => string | null;
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
        { permissionMode: 'acceptEdits', sandboxEnforcement: 'compensating', effortApplied: 'none' }],
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

  // devin and pi run a write lineage with the same unconfined command as full access, so the
  // report must say full access and keep the mode that was asked for.
  it('reports a devin or pi write request as the unconfined mode it runs', () => {
    const opts = { env: stubEnv(), executableVersion: 'stub 1.0.0' };
    for (const lineage of [{ kind: 'cli-devin' }, { kind: 'cli-pi', model: 'minimax-m3' }]) {
      const write = buildLineageCommand(lineage, 'prompt text', 'workspace-write', 'acceptEdits', opts);
      const full = buildLineageCommand(lineage, 'prompt text', 'danger-full-access', 'bypassPermissions', opts);
      expect(write.args).toEqual(full.args);
      expect({ kind: lineage.kind, ...write.effectiveConfig }).toMatchObject({
        kind: lineage.kind,
        sandboxMode: 'danger-full-access',
        sandboxWidenedFrom: 'workspace-write',
        sandboxEnforcement: 'none',
      });
      expect(full.effectiveConfig.sandboxMode).toBe('danger-full-access');
      expect(full.effectiveConfig).not.toHaveProperty('sandboxWidenedFrom');
    }

    const codex = buildLineageCommand({ kind: 'cli-codex' }, 'prompt text', 'workspace-write', 'acceptEdits', opts);
    expect(codex.effectiveConfig).toMatchObject({ sandboxMode: 'workspace-write', sandboxEnforcement: 'preventive' });
    expect(codex.effectiveConfig).not.toHaveProperty('sandboxWidenedFrom');
  });

  // The widened label is a report of the same command, so it must not move a lineage's identity:
  // the fingerprint still tells the request apart, and a lineage that finished under the old
  // label resumes while a real change of requested mode is still refused.
  it('keeps a widened devin or pi write lineage resumable under its old label and identity', () => {
    const opts = { env: stubEnv(), executableVersion: 'stub 1.0.0' };
    const resume = (prior: Record<string, unknown>, current: Record<string, unknown>) => {
      const lineageDir = makeTempDir('fanout-effective-config-resume-');
      writeFileSync(join(lineageDir, 'invocation-metadata.json'), JSON.stringify({ effectiveConfig: prior }), 'utf8');
      return finishedLineageMismatch({ loopType: 'research', lineageDir, label: 'seat-a', binding: 'topic', effectiveConfig: current });
    };
    for (const kind of ['cli-devin', 'cli-pi']) {
      const write = buildLineageCommand({ kind }, 'prompt text', 'workspace-write', 'acceptEdits', opts);
      const full = buildLineageCommand({ kind }, 'prompt text', 'danger-full-access', 'acceptEdits', opts);
      expect(write.invocationFingerprint, kind).not.toBe(full.invocationFingerprint);

      const { sandboxWidenedFrom: _widened, ...oldLabel } = write.effectiveConfig;
      expect(resume({ ...oldLabel, sandboxMode: 'workspace-write' }, write.effectiveConfig), kind).toBeNull();
      expect(resume({ ...oldLabel, sandboxMode: 'read-only' }, write.effectiveConfig), kind)
        .toMatch(/different executor[^\n]*sandboxMode "read-only" -> "workspace-write"/);
    }

    const dsh = buildLineageCommand(
      { kind: 'cli-deepseek-harness' }, 'prompt text', 'danger-full-access', 'bypassPermissions',
      { ...opts, repoRoot: dshRepo(), lineageDir: makeTempDir('fanout-effective-config-lineage-') },
    );
    const { sandboxNarrowedFrom: _narrowed, ...dshOld } = dsh.effectiveConfig;
    expect(resume(dsh.effectiveConfig, dsh.effectiveConfig)).toBeNull();
    expect(resume({ ...dshOld, sandboxMode: 'danger-full-access' }, dsh.effectiveConfig)).toBeNull();
  });

  // The dispatch never passes dsh danger-full-access, so a full-access request runs as
  // workspace-write; the report must say what runs and that the request was narrowed.
  it('reports a dsh full-access request as narrowed to the workspace-write it runs', () => {
    const opts = {
      env: stubEnv(),
      executableVersion: 'stub 1.0.0',
      repoRoot: dshRepo(),
      lineageDir: makeTempDir('fanout-effective-config-lineage-'),
    };
    const narrowed = buildLineageCommand(
      { kind: 'cli-deepseek-harness' }, 'prompt text', 'danger-full-access', 'bypassPermissions', opts,
    );
    expect(narrowed.args[narrowed.args.indexOf('--permission-mode') + 1]).toBe('workspace-write');
    expect(narrowed.effectiveConfig).toMatchObject({
      sandboxMode: 'workspace-write',
      sandboxNarrowedFrom: 'danger-full-access',
      permissionMode: 'workspace-write',
      sandboxEnforcement: 'preventive',
    });

    const asked = buildLineageCommand(
      { kind: 'cli-deepseek-harness' }, 'prompt text', 'workspace-write', 'acceptEdits', opts,
    );
    expect(asked.effectiveConfig.sandboxMode).toBe('workspace-write');
    expect(asked.effectiveConfig).not.toHaveProperty('sandboxNarrowedFrom');
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
