import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = resolve(TEST_DIR, '../../../../../');

const REPLAY_HELPER = join(
  WORKSPACE_ROOT,
  '.opencode/skills/deep-ai-council/scripts/replay-graph-from-artifacts.cjs',
);
const TEST_COUNCIL_MATRIX = join(
  WORKSPACE_ROOT,
  '.opencode/skills/system-spec-kit/scripts/test-council-matrix.sh',
);

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length) {
    const dir = tempDirs.pop()!;
    rmSync(dir, { recursive: true, force: true });
  }
});

function makeTempSpecFolder(scenarioId: string): { repoRoot: string; specFolder: string } {
  const repoRoot = mkdtempSync(join(tmpdir(), `${scenarioId.toLowerCase()}-replay-`));
  tempDirs.push(repoRoot);
  // The helper walks up looking for `.opencode/` as the repo-root signal.
  mkdirSync(join(repoRoot, '.opencode'), { recursive: true });
  const specFolderRel = `.opencode/specs/sandbox/${scenarioId.toLowerCase()}`;
  mkdirSync(join(repoRoot, specFolderRel, 'ai-council'), { recursive: true });
  return { repoRoot, specFolder: specFolderRel };
}

describe('council helper script smoke coverage', () => {
  it('replay-graph-from-artifacts.cjs derives an upsert payload from a synthetic ai-council-state.jsonl', () => {
    const { repoRoot, specFolder } = makeTempSpecFolder('DAC-REPLAY');
    const jsonlPath = join(repoRoot, specFolder, 'ai-council/ai-council-state.jsonl');
    // Minimal but realistic event stream: round_started -> seat_emitted -> round_complete
    // with one CLAIM, one EVIDENCE supporting it, and a DECISION naming the supported claim.
    const events = [
      { event: 'session_started', session_id: 'replay-run-01' },
      { event: 'round_started', session_id: 'replay-run-01', round_id: 1 },
      { event: 'seat_emitted', session_id: 'replay-run-01', round_id: 1, seat_id: 'seat-a', claims: [{ id: 'c1', name: 'Plan A' }] },
      { event: 'seat_emitted', session_id: 'replay-run-01', round_id: 1, seat_id: 'seat-b', evidence: [{ id: 'e1', name: 'Bench result' }] },
      { event: 'round_complete', session_id: 'replay-run-01', round_id: 1, decisions: [{ id: 'd1', name: 'Adopt Plan A' }] },
    ];
    writeFileSync(jsonlPath, events.map((e) => JSON.stringify(e)).join('\n') + '\n');

    const result = spawnSync(
      'node',
      [REPLAY_HELPER, '--spec-folder', specFolder, '--session-id', 'replay-run-01', '--dry-run'],
      { cwd: repoRoot, encoding: 'utf8' },
    );

    expect(result.status, `helper stderr: ${result.stderr}`).toBe(0);
    const payload = JSON.parse(result.stdout);

    expect(payload.specFolder).toBe(specFolder);
    expect(payload.sessionId).toBe('replay-run-01');
    expect(Array.isArray(payload.nodes)).toBe(true);
    expect(Array.isArray(payload.edges)).toBe(true);

    const nodeKinds = new Set(payload.nodes.map((n: { kind: string }) => n.kind));
    // The helper must derive a SESSION, at least one ROUND, at least one SEAT, plus the graph items from events.
    expect(nodeKinds.has('SESSION')).toBe(true);
    expect(nodeKinds.has('ROUND')).toBe(true);
    expect(nodeKinds.has('SEAT')).toBe(true);
    // At least one of the event-carried items shows up as its own node.
    const eventDerivedKinds = ['CLAIM', 'EVIDENCE', 'DECISION'].filter((k) => nodeKinds.has(k));
    expect(eventDerivedKinds.length, `expected CLAIM/EVIDENCE/DECISION among ${[...nodeKinds].join(',')}`)
      .toBeGreaterThan(0);
  });

  it('test-council-matrix.sh exists, is executable, and wires vitest + sk-doc + strict spec validation', () => {
    expect(existsSync(TEST_COUNCIL_MATRIX), TEST_COUNCIL_MATRIX).toBe(true);
    const mode = statSync(TEST_COUNCIL_MATRIX).mode;
    expect(mode & 0o100, 'owner-execute bit on test-council-matrix.sh').not.toBe(0);

    const body = readFileSync(TEST_COUNCIL_MATRIX, 'utf8');
    // The runner must chain the three verification stages — drift between this shape
    // and the runner's actual behavior breaks the council gate silently.
    expect(body, 'set -euo pipefail').toContain('set -euo pipefail');
    expect(body, 'invokes test:council vitest').toMatch(/test:council/);
    expect(body, 'invokes sk-doc quick_validate').toContain('quick_validate.py');
    expect(body, 'invokes strict spec validate').toMatch(/validate\.sh.*--strict/);
  });

});
