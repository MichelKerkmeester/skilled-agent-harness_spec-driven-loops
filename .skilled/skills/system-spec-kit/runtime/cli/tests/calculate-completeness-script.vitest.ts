// ───────────────────────────────────────────────────────────────────
// MODULE: Calculate Completeness Script Tests
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const SCRIPT = path.resolve(__dirname, '..', 'spec', 'calculate-completeness.sh');
const tempDirs: string[] = [];

function run(args: string[]) {
  return spawnSync('bash', [SCRIPT, ...args], { encoding: 'utf8' });
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

describe('calculate-completeness.sh', () => {
  it('counts unfilled placeholders in a packet and reports partial completion', () => {
    const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'completeness-'));
    tempDirs.push(folder);
    fs.writeFileSync(path.join(folder, 'spec.md'), '# Spec\n\nFilled line.\n\n[TODO: fill this in]\n');

    const result = run(['--json', folder]);
    expect(result.status).toBe(0);
    const report = JSON.parse(result.stdout);
    expect(report.files_analyzed).toBe(1);
    expect(report.total_placeholders).toBe(1);
    expect(report.overall_completion).toBeLessThan(100);
  });

  it('fails with a non-zero status when the spec folder does not exist', () => {
    const result = run([path.join(os.tmpdir(), 'completeness-missing-' + process.pid)]);
    expect(result.status).not.toBe(0);
  });
});
