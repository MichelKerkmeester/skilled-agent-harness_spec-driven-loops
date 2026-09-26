import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const HOOK_ROOT = import.meta.dirname.replace(/\/tests$/u, '');
const STUB_MARKER = 'override-stub-ran';
const BUDGET_ENV = 'SPECKIT_CLAUDE_HOOK_TIMEOUT_MS';
const tempDirs: string[] = [];

function writeStub(
  source = `process.stdout.write(JSON.stringify({ marker: '${STUB_MARKER}' }));`,
): string {
  const dir = mkdtempSync(join(tmpdir(), 'shim-override-'));
  tempDirs.push(dir);
  const stub = join(dir, 'stub.js');
  writeFileSync(stub, `${source}\n`);
  return stub;
}

function runShim(env: NodeJS.ProcessEnv, cwd = HOOK_ROOT, inheritProcessEnv = true) {
  return spawnSync(process.execPath, [join(HOOK_ROOT, 'hooks/claude/user-prompt-submit.ts')], {
    cwd,
    input: JSON.stringify({ prompt: 'hello' }),
    encoding: 'utf8',
    timeout: 5000,
    env: inheritProcessEnv ? { ...process.env, ...env } : env,
  });
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('Claude UserPromptSubmit shim', () => {
  it('returns valid JSON when stdin is invalid JSON', () => {
    const result = spawnSync(process.execPath, ['hooks/claude/user-prompt-submit.ts'], {
      cwd: HOOK_ROOT,
      input: '{not-json',
      encoding: 'utf8',
      timeout: 5000,
    });

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({});
  });

  it('honors an absolute regular-file override', () => {
    const stub = writeStub();
    const result = runShim({ SPECKIT_USER_PROMPT_TARGET: stub });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain(STUB_MARKER);
  });

  it('sets the default child budget and preserves an operator-set budget', () => {
    const stub = writeStub(
      `process.stdout.write(JSON.stringify({ budget: process.env.${BUDGET_ENV} ?? null }));`,
    );
    const configuredResult = runShim({
      SPECKIT_USER_PROMPT_TARGET: stub,
      [BUDGET_ENV]: '1234',
    });

    expect(configuredResult.status).toBe(0);
    expect(JSON.parse(configuredResult.stdout)).toEqual({ budget: '1234' });

    const unsetBudgetEnv = { ...process.env };
    delete unsetBudgetEnv[BUDGET_ENV];
    const defaultResult = runShim({
      ...unsetBudgetEnv,
      SPECKIT_USER_PROMPT_TARGET: stub,
    }, HOOK_ROOT, false);

    expect(defaultResult.status).toBe(0);
    expect(JSON.parse(defaultResult.stdout)).toEqual({ budget: '2200' });
  });

  it('lets a slow child finish within the shim timeout', () => {
    const stub = writeStub(
      `Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, Number(process.env.${BUDGET_ENV} ?? 2500));\n` +
        `process.stdout.write(JSON.stringify({ marker: 'slow-stub-finished' }));`,
    );
    const unsetBudgetEnv = { ...process.env };
    delete unsetBudgetEnv[BUDGET_ENV];
    const result = runShim({
      ...unsetBudgetEnv,
      SPECKIT_USER_PROMPT_TARGET: stub,
    }, HOOK_ROOT, false);

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ marker: 'slow-stub-finished' });
  });

  it('ignores an override that is relative to the cwd', () => {
    const stub = writeStub();
    const result = runShim({ SPECKIT_USER_PROMPT_TARGET: 'stub.js' }, join(stub, '..'));

    expect(result.status).toBe(0);
    expect(result.stdout).not.toContain(STUB_MARKER);
  });

  it('ignores an override whose link target does not exist', () => {
    const stub = writeStub();
    const dangling = join(stub, '..', 'dangling.js');
    symlinkSync(join(stub, '..', 'missing.js'), dangling);
    const result = runShim({ SPECKIT_USER_PROMPT_TARGET: dangling });

    expect(result.status).toBe(0);
    expect(result.stdout).not.toContain(STUB_MARKER);
  });

  it('ignores an override that names a directory', () => {
    const stub = writeStub();
    const result = runShim({ SPECKIT_USER_PROMPT_TARGET: join(stub, '..') });

    expect(result.status).toBe(0);
    expect(result.stdout).not.toContain(STUB_MARKER);
  });
});
