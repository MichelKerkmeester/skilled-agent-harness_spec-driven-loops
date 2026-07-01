// ───────────────────────────────────────────────────────────────────
// MODULE: promote-candidate 2-runtime mirror-sync gate
//   The pre-mutation mirror-sync gate must verify the runtime mirrors against
//   the CURRENT canonical body (the state being replaced), not the candidate.
//   Comparing against the candidate flags every real body change as drift and
//   blocks legitimate in-sync promotions. These tests pin both directions:
//   an in-sync mirror set must promote; a genuinely drifted mirror must block.
// ───────────────────────────────────────────────────────────────────

import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../../');
const SCRIPTS = path.join(WORKSPACE_ROOT, '.opencode/skills/deep-loop-workflows/deep-improvement/scripts');
const PROMOTE = path.join(SCRIPTS, 'shared/promote-candidate.cjs');

const AGENT_NAME = 'mirror-sync-promote-fixture';

// Body shared by all in-sync mirrors and the current canonical target.
const CURRENT_BODY = `# Demo Agent

Proposal-only agent body for the mirror sync regression.

## 1. CORE WORKFLOW

Read first, verify runtime mirrors, then report structured evidence.
`;

// The improvement under promotion: same agent, a changed body. Because it
// differs from the in-sync mirrors, a gate that compares mirrors against the
// candidate (the bug) would wrongly see drift on every runtime.
const CANDIDATE_BODY = `# Demo Agent

Proposal-only agent body for the mirror sync regression.

## 1. CORE WORKFLOW

Read first, verify runtime mirrors, then report structured evidence with a confidence score.
`;

function canonicalMd(body: string): string {
  return `---\nname: ${AGENT_NAME}\ndescription: Demo agent\n---\n\n${body}`;
}

let work: string;

function writeFile(relativePath: string, content: string): void {
  const filePath = path.join(work, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function writeJson(relativePath: string, value: unknown): void {
  writeFile(relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

/**
 * Lay down an agent-definition promotion packet inside a hermetic repo-root.
 * Both runtime mirrors land in-sync with the current canonical body; the
 * caller can override the Claude mirror to simulate genuine drift.
 */
function buildAgentPacket(opts: { driftClaudeBody?: string } = {}) {
  const target = path.join(work, `.opencode/agents/${AGENT_NAME}.md`);
  const candidate = path.join(work, 'staged-candidate.md');
  const benchmarkReport = path.join(work, 'benchmark-outputs/report.json');
  const repeatability = path.join(work, 'benchmark-outputs/repeatability.json');
  const config = path.join(work, 'model-benchmark-config.json');
  const manifest = path.join(work, 'target_manifest.jsonc');
  const archiveDir = path.join(work, 'archive');

  // Canonical target = the opencode mirror (current in-sync body).
  writeFile(`.opencode/agents/${AGENT_NAME}.md`, canonicalMd(CURRENT_BODY));
  // Claude mirror: in-sync by default, or a drifted body when requested.
  writeFile(`.claude/agents/${AGENT_NAME}.md`, canonicalMd(opts.driftClaudeBody || CURRENT_BODY));

  // The staged candidate is a real agent body change.
  writeFile('staged-candidate.md', canonicalMd(CANDIDATE_BODY));

  writeJson('benchmark-outputs/report.json', {
    status: 'benchmark-complete',
    scoringMethod: 'pattern',
    grader: 'noop',
    profileId: 'demo-profile',
    family: 'test',
    target,
    aggregateScore: 92,
    maxScore: 100,
    totals: { score: 92, delta: 0.05, pass_rate: 1, fixtures: 2, passed: 2 },
    recommendation: 'benchmark-pass',
  });

  writeJson('benchmark-outputs/repeatability.json', { profileId: 'demo-profile', passed: true });

  writeJson('model-benchmark-config.json', {
    target,
    targetProfile: 'demo-profile',
    proposalOnly: false,
    promotionEnabled: true,
    branchPreservationPolicy: 'preserve-on-failure',
    scoring: { thresholdDelta: 1 },
  });

  writeFile(
    'target_manifest.jsonc',
    `// agent target manifest\n${JSON.stringify({ targets: [{ path: target, classification: 'canonical' }] }, null, 2)}\n`,
  );

  return { target, candidate, benchmarkReport, config, manifest, archiveDir };
}

function runPromote(p: ReturnType<typeof buildAgentPacket>) {
  // cwd = the hermetic repo-root so isAgentDefinitionTarget() resolves the
  // target as `.opencode/agents/...` and verifyMirrorSync() reads mirrors from
  // this temp tree (repoRoot = process.cwd()).
  return spawnSync(
    'node',
    [
      PROMOTE,
      `--candidate=${p.candidate}`,
      `--target=${p.target}`,
      `--benchmark-report=${p.benchmarkReport}`,
      `--config=${p.config}`,
      `--manifest=${p.manifest}`,
      `--archive-dir=${p.archiveDir}`,
      '--approve',
    ],
    { encoding: 'utf8', cwd: work },
  );
}

// realpathSync resolves the macOS /var -> /private/var symlink so the temp
// root matches the spawned child's process.cwd(); otherwise path.relative()
// yields a ../ path and isAgentDefinitionTarget() never fires.
beforeEach(() => { work = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'promote-mirror-'))); });
afterEach(() => { fs.rmSync(work, { recursive: true, force: true }); });

describe('promote-candidate 2-runtime mirror-sync gate', () => {
  it('promotes a candidate when every runtime mirror is in sync with the current canonical', () => {
    const p = buildAgentPacket();
    const result = runPromote(p);

    expect(result.status, result.stderr).toBe(0);
    const out = JSON.parse(result.stdout);
    expect(out.status).toBe('promoted');
    // The candidate body actually landed on the canonical target.
    expect(fs.readFileSync(p.target, 'utf8')).toBe(canonicalMd(CANDIDATE_BODY));
  });

  it('blocks promotion when a runtime mirror has drifted from the current canonical', () => {
    const p = buildAgentPacket({
      driftClaudeBody: `# Demo Agent\n\nManually edited claude mirror body that no longer matches.\n`,
    });
    const result = runPromote(p);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/mirror sync verification failed|MIRROR_SYNC_GATE_FAILED/i);
    // Canonical target is untouched — the drift gate fired before any mutation.
    expect(fs.readFileSync(p.target, 'utf8')).toBe(canonicalMd(CURRENT_BODY));
  });
});
