import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

describe('Claude UserPromptSubmit shim', () => {
  it('returns valid JSON when stdin is invalid JSON', () => {
    const result = spawnSync(process.execPath, ['hooks/claude/user-prompt-submit.ts'], {
      cwd: import.meta.dirname.replace(/\/tests$/u, ''),
      input: '{not-json',
      encoding: 'utf8',
      timeout: 5000,
    });

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({});
  });
});
