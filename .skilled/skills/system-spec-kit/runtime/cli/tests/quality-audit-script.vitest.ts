// ───────────────────────────────────────────────────────────────────
// MODULE: Quality Audit Script Tests
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const SCRIPT = path.resolve(__dirname, '..', 'spec', 'quality-audit.sh');
const tempDirs: string[] = [];

function run(args: string[]) {
  return spawnSync('bash', [SCRIPT, ...args], { encoding: 'utf8' });
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

describe('quality-audit.sh', () => {
  it('reports an empty root as a clean audit in text and JSON modes', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'quality-audit-'));
    tempDirs.push(root);

    const text = run(['--root', root]);
    expect(text.status).toBe(0);
    expect(text.stdout).toContain('No spec folders found');

    const json = run(['--json', '--root', root]);
    expect(json.status).toBe(0);
    expect(JSON.parse(json.stdout)).toMatchObject({ total: 0, pass: 0, warn: 0, fail: 0 });
  });

  it('rejects an unknown option with the misuse exit code', () => {
    const result = run(['--bogus']);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Unknown option '--bogus'");
  });
});
