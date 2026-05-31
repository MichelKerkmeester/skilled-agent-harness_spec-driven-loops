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
  it('runs scenarios 403/404/407/410 against the real mk-spec-memory and mk-code-index daemons with no connection or scenario failures (tolerates a live-owner skip)', async () => {
    await execFileAsync('node', [HARNESS, '--no-stderr-log', '--scenarios', '403,404,407,410'], {
      cwd: REPO_ROOT,
      timeout: 180_000,
      maxBuffer: 1024 * 1024,
    });

    expect(fs.existsSync(TSV_PATH)).toBe(true);
    const tsv = fs.readFileSync(TSV_PATH, 'utf8');
    const rows = tsv
      .trim()
      .split('\n')
      .slice(1)
      .map((line) => {
        const [scenario, verdict] = line.split('\t');
        return { scenario, verdict };
      });

    // A `runner:<name>` row is a shared-daemon client diagnostic. A FAIL means a client could not
    // connect for a reason the harness could not explain — a real substrate failure that must not
    // occur. A SKIP means a live operator daemon legitimately holds the single-writer lease while
    // bridging is disabled, so the harness could not spawn a dedicated child; that is expected
    // during an interactive session and is tolerated. The runner starts two real daemons
    // (mk-spec-memory and mk-code-index), so a connect failure on either surfaces here.
    const diagnostics = rows.filter((row) => row.scenario.startsWith('runner:'));
    const failedConnections = diagnostics.filter((row) => row.verdict === 'FAIL');
    expect(failedConnections, `shared-daemon connection failures: ${JSON.stringify(failedConnections)}`).toHaveLength(0);
    const skippedConnections = diagnostics.filter((row) => row.verdict === 'SKIP');

    // Exactly the four requested scenarios should have produced verdict rows.
    const scenarioRows = rows.filter((row) => !row.scenario.startsWith('runner:'));
    expect(scenarioRows).toHaveLength(4);
    expect(new Set(scenarioRows.map((row) => row.scenario))).toEqual(new Set(['403', '404', '407', '410']));

    // The runner starts the mk-code-index daemon alongside mk-spec-memory, so the Code-Graph-backed
    // scenarios (403, 404 and 407) execute against it rather than SKIPping — provided the code-graph
    // DB is populated. No scenario may FAIL; SKIP is still tolerated as a fallback (e.g. an empty
    // graph, a code-graph client that cannot start, or a live-owner connection skip), and PARTIAL
    // is tolerated.
    for (const { scenario, verdict } of scenarioRows) {
      expect(['PASS', 'SKIP', 'PARTIAL'], `${scenario} verdict ${verdict} must not be FAIL`).toContain(verdict);
    }

    // The memory-backed scenario (410) must actually run against the daemon — this guards against an
    // all-SKIP false green when the daemon connects but silently exposes no tools. The guard only
    // applies when the memory daemon actually connected; a tolerated live-owner skip legitimately
    // forces 410 to SKIP too, so it is exempted in that case.
    const memoryOwnerSkipped = skippedConnections.some((row) => row.scenario === 'runner:mk-spec-memory');
    if (!memoryOwnerSkipped) {
      const memoryScenario = scenarioRows.find((row) => row.scenario === '410');
      expect(['PASS', 'PARTIAL'], '410 (memory) should run, not SKIP/FAIL').toContain(memoryScenario?.verdict);
    }
  }, 240_000);
});
