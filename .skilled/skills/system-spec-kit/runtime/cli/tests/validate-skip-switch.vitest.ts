// ───────────────────────────────────────────────────────────────────
// MODULE: validate.sh Off Switch
// ───────────────────────────────────────────────────────────────────
// Proves the spec-doc off switch reads the environment before hook-flags.env,
// and that a skipped run still hands a JSON caller a report it can parse. An
// empty stdout there is what used to block every commit that staged a spec doc.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const validateScript = path.resolve(__dirname, '..', 'spec', 'validate.sh');
const created: string[] = [];

afterEach(() => {
  while (created.length) {
    const dir = created.pop();
    if (dir) fs.rmSync(dir, { recursive: true, force: true });
  }
});

function tempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-skip-switch-'));
  created.push(dir);
  return dir;
}

// Every run starts from a clean slate: neither switch inherited from the shell,
// and HOOK_FLAGS_CONFIG pointed away from the operator's own hook-flags.env.
function run(args: string[], env: Record<string, string> = {}): { status: number | null; stdout: string; stderr: string } {
  const childEnv: NodeJS.ProcessEnv = { ...process.env };
  for (const key of ['SPECKIT_SKIP_VALIDATION', 'SPECKIT_VALIDATION', 'SPECKIT_JSON', 'SPECKIT_QUIET']) delete childEnv[key];
  childEnv.HOOK_FLAGS_CONFIG = path.join(tempDir(), 'absent.env');
  Object.assign(childEnv, env);
  const result = spawnSync('bash', [validateScript, ...args], { env: childEnv, encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function savedFlags(line: string): string {
  const file = path.join(tempDir(), 'hook-flags.env');
  fs.writeFileSync(file, `# saved choices\n${line}\n`);
  return file;
}

describe('validate.sh off switch', () => {
  it('skips with a report a JSON caller can parse when the environment turns it on', () => {
    const folder = tempDir();
    const result = run([folder, '--json'], { SPECKIT_SKIP_VALIDATION: '1' });
    expect(result.status).toBe(0);
    const report = JSON.parse(result.stdout);
    expect(report).toMatchObject({ skipped: true, passed: true, summary: { errors: 0, warnings: 0 } });
    expect(report.entries).toEqual([expect.objectContaining({ rule: 'VALIDATION_SKIPPED', status: 'info' })]);
    expect(result.stderr).toContain('SPECKIT_SKIP_VALIDATION is on in the environment');
  });

  it('reads the switch from hook-flags.env when the environment leaves it unset', () => {
    const flags = savedFlags('SPECKIT_SKIP_VALIDATION="yes"');
    const result = run([tempDir(), '--json'], { HOOK_FLAGS_CONFIG: flags });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout).skipped).toBe(true);
    expect(result.stderr).toContain(`SPECKIT_SKIP_VALIDATION is on in ${flags}`);
  });

  it('validates when the environment answers 0, empty or a value outside the truthy set', () => {
    const flags = savedFlags('SPECKIT_SKIP_VALIDATION=1');
    for (const value of ['0', '', 'skip']) {
      // An empty folder fails FILE_EXISTS, so a run that validated exits 2.
      const result = run([tempDir(), '--json'], { HOOK_FLAGS_CONFIG: flags, SPECKIT_SKIP_VALIDATION: value });
      expect(result.status, `SPECKIT_SKIP_VALIDATION=${JSON.stringify(value)}`).toBe(2);
      expect(JSON.parse(result.stdout).skipped).toBeUndefined();
    }
  });

  it('sends SPECKIT_VALIDATION=false through the same report', () => {
    const result = run([tempDir(), '--json'], { SPECKIT_VALIDATION: 'false' });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({ skipped: true, passed: true });
    expect(result.stderr).toContain('SPECKIT_VALIDATION is false');
  });

  it('keeps stdout empty in text mode, still prints help and still rejects a missing folder', () => {
    const on = { SPECKIT_SKIP_VALIDATION: 'on' };
    const text = run([tempDir()], on);
    expect(text.status).toBe(0);
    expect(text.stdout).toBe('');

    const help = run(['--help'], on);
    expect(help.status).toBe(0);
    expect(help.stdout).toContain('SPECKIT_SKIP_VALIDATION');

    const missing = run([path.join(tempDir(), 'no-such-folder'), '--json'], on);
    expect(missing.status).toBe(3);
    expect(missing.stdout).toBe('');
  });
});
