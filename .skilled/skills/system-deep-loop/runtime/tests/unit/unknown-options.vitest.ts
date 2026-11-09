import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

import { afterEach, describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';

const tempDirs: string[] = [];
const testDirectory = dirname(fileURLToPath(import.meta.url));
const scripts = [
  ['append-mode-event.cjs', '../../../runtime/scripts/append-mode-event.cjs'],
  ['fanout-run.cjs', '../../../runtime/scripts/fanout-run.cjs'],
  ['deep-research-reduce-state.cjs', '../../../deep-research/scripts/reduce-state.cjs'],
] as const;

afterEach(() => {
  for (const directory of tempDirs.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe('deep-loop CLI option validation', () => {
  it.each(scripts)('%s rejects an unknown option with a usage error', (_name, relativeScript) => {
    const cwd = mkdtempSync(join(tmpdir(), 'deep-loop-unknown-option-'));
    tempDirs.push(cwd);
    const script = resolve(testDirectory, relativeScript);
    const result = spawnSync(process.execPath, [script, '--bogus-option', 'x'], {
      cwd,
      encoding: 'utf8',
      timeout: 10000,
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.error).toBeUndefined();
    expect(result.status).not.toBe(0);
    expect(output).toContain('Unknown option: --bogus-option');
  });
});
