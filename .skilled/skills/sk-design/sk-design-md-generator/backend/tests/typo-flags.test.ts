// A misspelled long option must fail loudly instead of being skipped: a
// "--dryru" typo silently turns an intended dry run into a live extraction,
// and a swallowed --study-context read error hides that the study input the
// caller asked for was never read. These cases pin both refusals to the exact
// token the caller typed.

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { spawnSync } from 'child_process';
import { parseGuidedRunArgs } from '../scripts/guided-run';

const BACKEND_ROOT = path.resolve(__dirname, '..');
const WRITE_PROMPT_SCRIPT = path.join(BACKEND_ROOT, 'scripts', 'build-write-prompt.ts');
const STRIPE_TOKENS = path.resolve(__dirname, '..', '..', 'references', 'examples', 'stripe', 'tokens.json');
const SPAWN_TIMEOUT_MS = 120_000;

describe('long-option typos', () => {
  it('guided-run.ts rejects a misspelled --dryru instead of running a live extraction', () => {
    expect(() =>
      parseGuidedRunArgs(['node', 'guided-run.ts', 'https://example.com', '--output', '/tmp/typo-out', '--dryru']),
    ).toThrow('--dryru');
  });

  it('guided-run.ts still accepts the real --dry-run flag', () => {
    const options = parseGuidedRunArgs([
      'node',
      'guided-run.ts',
      'https://example.com',
      '--output',
      '/tmp/typo-out',
      '--dry-run',
    ]);
    expect(options.dryRun).toBe(true);
  });

  it('build-write-prompt.ts exits 1 and names an unreadable --study-context path', () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'typo-flags-'));
    try {
      const missingStudyContext = path.join(directory, 'nonexistent-typo-flags.json');
      const result = spawnSync(
        'npx',
        ['--yes', 'tsx', WRITE_PROMPT_SCRIPT, STRIPE_TOKENS, '--study-context', missingStudyContext],
        { cwd: BACKEND_ROOT, encoding: 'utf8', timeout: SPAWN_TIMEOUT_MS },
      );
      const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
      expect(result.status).toBe(1);
      expect(output).toContain(missingStudyContext);
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });
});
