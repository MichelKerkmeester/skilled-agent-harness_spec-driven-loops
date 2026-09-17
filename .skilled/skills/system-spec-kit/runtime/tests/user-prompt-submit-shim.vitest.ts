import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const HOOK_ROOT = import.meta.dirname.replace(/\/tests$/u, '');
const STUB_MARKER = 'override-stub-ran';
const tempDirs: string[] = [];

function writeStub(): string {
  const dir = mkdtempSync(join(tmpdir(), 'shim-override-'));
  tempDirs.push(dir);
  const stub = join(dir, 'stub.js');
  writeFileSync(stub, `process.stdout.write(JSON.stringify({ marker: '${STUB_MARKER}' }));\n`);
  return stub;
}

function runShim(env: Record<string, string>, cwd = HOOK_ROOT) {
  return spawnSync(process.execPath, [join(HOOK_ROOT, 'hooks/claude/user-prompt-submit.ts')], {
    cwd,
    input: JSON.stringify({ prompt: 'hello' }),
    encoding: 'utf8',
    timeout: 5000,
    env: { ...process.env, ...env },
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
