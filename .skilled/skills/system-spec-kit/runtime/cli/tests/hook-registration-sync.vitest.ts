// ───────────────────────────────────────────────────────────────────
// TEST: Hook registration synchronizer
// ───────────────────────────────────────────────────────────────────
// The registry must reproduce the committed registration files byte for byte,
// --check must report a hand-edited file and a missing Pi symlink, and write
// mode must restore a drifted file while leaving the settings file's other
// keys alone.

import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { afterAll, describe, expect, it } from 'vitest';

const SCRIPT = path.resolve(__dirname, '..', 'runtime-mirrors', 'sync-hook-registrations.cjs');
const REGISTRY = path.resolve(__dirname, '..', 'runtime-mirrors', 'hook-registry.json');
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..', '..');
const FILES = ['.claude/settings.json', '.codex/hooks.json', '.cursor/hooks.json', '.devin/hooks.v1.json'];

function run(root: string, ...args: string[]): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync('node', [SCRIPT, '--root', root, ...args], { encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

/** A copy of the repository's four registration files plus a Pi extensions directory whose symlinks all resolve. */
function seed(root: string): void {
  for (const file of FILES) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.copyFileSync(path.join(REPO_ROOT, file), path.join(root, file));
  }
  const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8')) as { hooks: Array<{ pi?: { extension?: string | null } }> };
  const extensionsDir = path.join(root, '.pi', 'extensions');
  const realDir = path.join(root, 'real');
  fs.mkdirSync(extensionsDir, { recursive: true });
  fs.mkdirSync(realDir, { recursive: true });
  for (const extension of new Set(registry.hooks.map((hook) => hook.pi?.extension).filter((value): value is string => Boolean(value)))) {
    fs.writeFileSync(path.join(realDir, extension), 'export default () => {};\n');
    fs.symlinkSync(path.join('..', '..', 'real', extension), path.join(extensionsDir, extension));
  }
}

describe('sync-hook-registrations.cjs', () => {
  const root = fs.mkdtempSync(path.join(tmpdir(), 'hook-registration-sync-'));
  afterAll(() => fs.rmSync(root, { recursive: true, force: true }));

  it('reproduces the committed registration files byte for byte', () => {
    expect(run(REPO_ROOT, '--check').status).toBe(0);
    seed(root);
    const before = Object.fromEntries(FILES.map((file) => [file, fs.readFileSync(path.join(root, file), 'utf8')]));
    const written = run(root);
    expect(written.status, written.stderr).toBe(0);
    for (const file of FILES) expect(fs.readFileSync(path.join(root, file), 'utf8'), file).toBe(before[file]);
    const check = run(root, '--check');
    expect(check.status, check.stderr).toBe(0);
    expect(check.stdout).toMatch(/PASS: 4 registration files/u);
  });

  it('reports a hand-edited registration file and restores it in write mode, keeping the other settings keys', () => {
    const settingsPath = path.join(root, '.claude', 'settings.json');
    const clean = fs.readFileSync(settingsPath, 'utf8');
    const settings = JSON.parse(clean) as { env?: Record<string, string>; hooks: Record<string, unknown[]> };
    settings.hooks.Stop = [];
    fs.writeFileSync(settingsPath, `${JSON.stringify(settings, null, 2)}\n`);
    const drifted = run(root, '--check');
    expect(drifted.status).toBe(1);
    expect(drifted.stderr).toMatch(/\.claude\/settings\.json: differs from the registry/u);

    expect(run(root).status).toBe(0);
    expect(fs.readFileSync(settingsPath, 'utf8')).toBe(clean);
    expect(JSON.parse(fs.readFileSync(settingsPath, 'utf8')).env).toEqual(JSON.parse(clean).env);
  });

  it('reports a Pi extension the registry names but the directory does not carry', () => {
    const link = path.join(root, '.pi', 'extensions', 'spec-gate-enforce.ts');
    fs.unlinkSync(link);
    const missing = run(root, '--check');
    expect(missing.status).toBe(1);
    expect(missing.stderr).toMatch(/spec-gate-enforce\.ts: missing/u);
    fs.symlinkSync(path.join('..', '..', 'real', 'spec-gate-enforce.ts'), link);
    fs.unlinkSync(path.join(root, 'real', 'spec-gate-enforce.ts'));
    const dangling = run(root, '--check');
    expect(dangling.status).toBe(1);
    expect(dangling.stderr).toMatch(/spec-gate-enforce\.ts: dangling/u);
  });

  it('renders each runtime in its own wrapper dialect from one binding', () => {
    const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8')) as { runtimes: Record<string, unknown>; hooks: Array<{ id: string; bindings: Record<string, Array<Record<string, unknown>>> }> };
    const enforce = registry.hooks.find((hook) => hook.id === 'spec-gate-enforce');
    expect(enforce).toBeDefined();
    for (const runtime of ['claude', 'codex', 'cursor', 'devin']) {
      expect(enforce!.bindings[runtime]?.length, runtime).toBeGreaterThan(0);
    }
    const bindingCount = registry.hooks.reduce((total, hook) => total + Object.values(hook.bindings).reduce((sum, list) => sum + list.length, 0), 0);
    expect(bindingCount).toBe(77);
  });
});
