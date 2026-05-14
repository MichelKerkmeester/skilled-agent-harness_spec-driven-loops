import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);

function findRepoRoot(metaUrl: string): string {
  let current = path.dirname(fileURLToPath(metaUrl));
  while (current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, '.opencode/skills/system-spec-kit/mcp_server/package.json'))) {
      return current;
    }
    current = path.dirname(current);
  }
  throw new Error('Could not locate repo root from substrate stress test');
}

const REPO_ROOT = findRepoRoot(import.meta.url);
const HARNESS = path.join(
  REPO_ROOT,
  '.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs',
);
const TSV_PATH = path.join(
  REPO_ROOT,
  '_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.summary.tsv',
);

describe('substrate stress harness (045 promoted)', () => {
  it('runs scenarios 403/404/407/410 through two real MCP daemons and all PASS', async () => {
    await execFileAsync('node', [HARNESS, '--no-stderr-log', '--scenarios', '403,404,407,410'], {
      cwd: REPO_ROOT,
      timeout: 180_000,
      maxBuffer: 1024 * 1024,
    });

    expect(fs.existsSync(TSV_PATH)).toBe(true);
    const tsv = fs.readFileSync(TSV_PATH, 'utf8');
    const rows = tsv.trim().split('\n').slice(1);
    expect(rows).toHaveLength(4);

    for (const row of rows) {
      const [scenario, verdict] = row.split('\t');
      expect(verdict, `${scenario} verdict should be PASS`).toBe('PASS');
    }
  }, 240_000);
});
