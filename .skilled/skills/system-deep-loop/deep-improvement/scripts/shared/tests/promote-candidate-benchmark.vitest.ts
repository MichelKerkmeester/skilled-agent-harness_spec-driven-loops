// ───────────────────────────────────────────────────────────────────
// MODULE: promote-candidate benchmark-mode promotion
//   Lane B (model-benchmark) produces report.json with status=benchmark-complete
//   and never a scored agent file. promote-candidate.cjs must promote on benchmark
//   evidence alone when --score is omitted, and refuse a non-passing report.
//   Lane A (agent) byte-behavior must stay unchanged.
// ───────────────────────────────────────────────────────────────────

import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../../');
const SCRIPTS = path.join(WORKSPACE_ROOT, '.opencode/skills/system-deep-loop/deep-improvement/scripts');
const PROMOTE = path.join(SCRIPTS, 'shared/promote-candidate.cjs');
const ROLLBACK = path.join(SCRIPTS, 'shared/rollback-candidate.cjs');
const require = createRequire(import.meta.url);
const { issueApprovalReceipt } = require('../promotion-receipts.cjs') as {
  issueApprovalReceipt: (filePath: string, options: Record<string, unknown>) => void;
};
const RECEIPT_KEY = 'test-only-promotion-authority-key-32-bytes-minimum';

let work: string;

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function readJson(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath: string) {
  return fs.readFileSync(filePath, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

// A target that is NOT an agent-definition file (not under .opencode/agents/),
// so the 4-runtime mirror-sync gate is skipped and the test stays focused on the
// Lane B promotion gates.
function buildBenchmarkPacket(opts: { recommendation: string; aggregateScore: number; reportExtras?: Record<string, unknown> }) {
  const candidate = path.join(work, 'candidate.txt');
  const target = path.join(work, 'canonical-target.txt');
  const benchmarkReport = path.join(work, 'benchmark-outputs/report.json');
  const repeatability = path.join(work, 'benchmark-outputs/repeatability.json');
  const config = path.join(work, 'model-benchmark-config.json');
  const manifest = path.join(work, 'target-manifest.jsonc');
  const archiveDir = path.join(work, 'archive');
  const eventLog = path.join(work, 'promotion-events.jsonl');

  fs.mkdirSync(work, { recursive: true });
  fs.writeFileSync(candidate, 'CANDIDATE BODY\n', 'utf8');
  fs.writeFileSync(target, 'ORIGINAL TARGET BODY\n', 'utf8');

  writeJson(benchmarkReport, {
    status: 'benchmark-complete',
    scoringMethod: 'pattern',
    grader: 'noop',
    profileId: 'demo-profile',
    family: 'test',
    target,
    aggregateScore: opts.aggregateScore,
    maxScore: 100,
    totals: { score: opts.aggregateScore, delta: 0.05, pass_rate: 1, fixtures: 2, passed: 2 },
    recommendation: opts.recommendation,
    ...(opts.reportExtras || {}),
  });

  writeJson(repeatability, { profileId: 'demo-profile', passed: true });

  writeJson(config, {
    target,
    targetProfile: 'demo-profile',
    proposalOnly: false,
    promotionEnabled: true,
    branchPreservationPolicy: 'preserve-on-failure',
    scoring: { thresholdDelta: 1 },
    // This fixture's canonical target intentionally lives outside the repo
    // tree (in a hermetic tmpdir), so it must be explicitly allowlisted for
    // the write-boundary containment check in promote-candidate.cjs /
    // rollback-candidate.cjs.
    promotion: { allowedTargetRoots: [work] },
  });

  // .jsonc manifest with a single canonical target equal to the requested target.
  fs.writeFileSync(
    manifest,
    `// benchmark target manifest\n${JSON.stringify({ targets: [{ path: target, classification: 'canonical' }] }, null, 2)}\n`,
    'utf8',
  );

  return { candidate, target, benchmarkReport, repeatability, config, manifest, archiveDir, eventLog };
}

function runPromote(p: ReturnType<typeof buildBenchmarkPacket>, extraArgs: string[] = []) {
  const receiptPath = path.join(work, 'approval-receipt.json');
  if (!fs.existsSync(receiptPath)) {
    issueApprovalReceipt(receiptPath, {
      candidatePath: p.candidate,
      targetPath: p.target,
      benchmarkReportPath: p.benchmarkReport,
      repeatabilityReportPath: p.repeatability,
      configPath: p.config,
      manifestPath: p.manifest,
      approvalIdentity: 'operator:test',
      evaluatorProfileId: 'demo-profile',
      evaluatorAgentName: 'model-benchmark',
      evaluatorEpoch: 'test-epoch',
    });
  }
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
      `--approve=${receiptPath}`,
      ...extraArgs,
    ],
    { encoding: 'utf8', cwd: WORKSPACE_ROOT },
  );
}

function runPromoteArgs(args: string[]) {
  return spawnSync('node', [PROMOTE, ...args], { encoding: 'utf8', cwd: WORKSPACE_ROOT });
}

function issueBenchmarkReceipt(
  p: ReturnType<typeof buildBenchmarkPacket>,
  overrides: Partial<Record<'candidatePath' | 'targetPath', string>> = {},
) {
  const receiptPath = path.join(work, 'approval-receipt.json');
  issueApprovalReceipt(receiptPath, {
    candidatePath: overrides.candidatePath || p.candidate,
    targetPath: overrides.targetPath || p.target,
    benchmarkReportPath: p.benchmarkReport,
    repeatabilityReportPath: p.repeatability,
    configPath: p.config,
    manifestPath: p.manifest,
    approvalIdentity: 'operator:test',
    evaluatorProfileId: 'demo-profile',
    evaluatorAgentName: 'model-benchmark',
    evaluatorEpoch: 'test-epoch',
  });
}

function runShip(acceptanceFile: string, extraArgs: string[] = []) {
  const receiptPath = path.join(work, 'approval-receipt.json');
  return runPromoteArgs([
    `--phase=ship`,
    `--acceptance-file=${acceptanceFile}`,
    `--approve=${receiptPath}`,
    ...extraArgs,
  ]);
}

function runRollback(acceptanceFile: string, extraArgs: string[] = []) {
  return spawnSync(
    'node',
    [ROLLBACK, `--acceptance-file=${acceptanceFile}`, ...extraArgs],
    { encoding: 'utf8', cwd: WORKSPACE_ROOT },
  );
}

beforeEach(() => {
  work = fs.mkdtempSync(path.join(os.tmpdir(), 'promote-bench-'));
  process.env.DEEP_LOOP_PROMOTION_RECEIPT_KEY = RECEIPT_KEY;
  process.env.DEEP_LOOP_PROMOTION_RECEIPT_KEY_ID = 'test-authority';
});
afterEach(() => {
  delete process.env.DEEP_LOOP_PROMOTION_RECEIPT_KEY;
  delete process.env.DEEP_LOOP_PROMOTION_RECEIPT_KEY_ID;
  fs.rmSync(work, { recursive: true, force: true });
});

describe('promote-candidate benchmark mode', () => {
  it('promotes from a benchmark-complete + benchmark-pass report with NO --score (Lane B)', () => {
    const p = buildBenchmarkPacket({ recommendation: 'benchmark-pass', aggregateScore: 92 });
    const result = runPromote(p);

    expect(result.status, result.stderr).toBe(0);
    const out = JSON.parse(result.stdout);
    expect(out.status).toBe('promoted');
    expect(out.mode).toBe('benchmark');
    expect(out.aggregateScore).toBe(92);
    expect(out.recommendation).toBe('benchmark-pass');
    // Candidate content actually landed on the canonical target.
    expect(fs.readFileSync(p.target, 'utf8')).toBe('CANDIDATE BODY\n');
    // A backup of the original target was written to the archive dir.
    const backups = fs.readdirSync(p.archiveDir).filter((f) => f.endsWith('.bak'));
    expect(backups.length).toBe(1);
  });

  it('rejects a stale approval receipt after the candidate bytes change', () => {
    const p = buildBenchmarkPacket({ recommendation: 'benchmark-pass', aggregateScore: 92 });
    issueBenchmarkReceipt(p);
    fs.writeFileSync(p.candidate, 'CANDIDATE CHANGED AFTER APPROVAL\n', 'utf8');

    const result = runPromote(p);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/approval receipt candidate binding/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');
  });

  it('rejects an approval receipt issued for a different candidate', () => {
    const p = buildBenchmarkPacket({ recommendation: 'benchmark-pass', aggregateScore: 92 });
    const otherCandidate = path.join(work, 'other-candidate.txt');
    fs.writeFileSync(otherCandidate, 'OTHER CANDIDATE\n', 'utf8');
    issueBenchmarkReceipt(p, { candidatePath: otherCandidate });

    const result = runPromote(p);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/approval receipt candidate binding/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');
  });

  it('rejects an approval receipt issued for a different target', () => {
    const p = buildBenchmarkPacket({ recommendation: 'benchmark-pass', aggregateScore: 92 });
    const otherTarget = path.join(work, 'other-target.txt');
    fs.writeFileSync(otherTarget, 'OTHER TARGET\n', 'utf8');
    issueBenchmarkReceipt(p, { targetPath: otherTarget });

    const result = runPromote(p);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/approval receipt target binding/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');
  });

  it('refuses a non-passing benchmark report (recommendation=benchmark-fail) and leaves target untouched', () => {
    const p = buildBenchmarkPacket({ recommendation: 'benchmark-fail', aggregateScore: 92 });
    const result = runPromote(p);

    expect(result.status, result.stderr).toBe(1);
    expect(result.stderr).toMatch(/benchmark recommendation is benchmark-fail/);
    // Target unchanged.
    expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');
  });

  it('refuses when the aggregate score is below the benchmark aggregate gate', () => {
    const p = buildBenchmarkPacket({ recommendation: 'benchmark-pass', aggregateScore: 50 });
    const result = runPromote(p);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/benchmark aggregate 50 below gate/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');
  });

  it.each([undefined, null, '92'] as const)('rejects an absent or non-numeric benchmark aggregate %j', (aggregateScore) => {
    const p = buildBenchmarkPacket({
      recommendation: 'benchmark-pass',
      aggregateScore: aggregateScore as unknown as number,
    });
    const result = runPromote(p);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/aggregate is not a finite number/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');
  });

  it('rejects an infinite benchmark aggregate', () => {
    const p = buildBenchmarkPacket({ recommendation: 'benchmark-pass', aggregateScore: 92 });
    const report = fs.readFileSync(p.benchmarkReport, 'utf8')
      .replace('"aggregateScore": 92', '"aggregateScore": 1e309');
    fs.writeFileSync(p.benchmarkReport, report, 'utf8');

    const result = runPromote(p);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/aggregate is not a finite number/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');
  });

  it.each([
    ['score', undefined],
    ['score', 'NaN'],
    ['score', 'Infinity'],
    ['delta', undefined],
    ['delta', 'NaN'],
    ['delta', 'Infinity'],
  ] as const)('rejects an absent or non-finite agent %s value %j', (field, value) => {
    const p = buildBenchmarkPacket({ recommendation: 'benchmark-pass', aggregateScore: 92 });
    const scorePath = path.join(work, 'score.json');
    const score: Record<string, unknown> = {
      status: 'scored',
      candidate: p.candidate,
      target: p.target,
      inputHash: 'a'.repeat(64),
      evaluatorProfileId: 'authority-profile',
      evaluatorAgentName: 'authority-agent',
      evaluatorEpoch: 'epoch-7',
      score: 100,
      delta: 5,
      recommendation: 'candidate-better',
      dimensions: ['structural', 'ruleCoherence', 'integration', 'outputQuality', 'systemFitness']
        .map((name) => ({ name, score: 100 })),
    };
    if (value === undefined) delete score[field];
    else score[field] = value;
    writeJson(scorePath, score);
    const receiptPath = path.join(work, 'agent-approval.json');
    issueApprovalReceipt(receiptPath, {
      candidatePath: p.candidate,
      targetPath: p.target,
      scorePath,
      benchmarkReportPath: p.benchmarkReport,
      repeatabilityReportPath: p.repeatability,
      configPath: p.config,
      manifestPath: p.manifest,
      approvalIdentity: 'operator:test',
      evaluatorProfileId: 'authority-profile',
      evaluatorAgentName: 'authority-agent',
      evaluatorEpoch: 'epoch-7',
    });

    const result = runPromoteArgs([
      `--candidate=${p.candidate}`,
      `--target=${p.target}`,
      `--score=${scorePath}`,
      `--benchmark-report=${p.benchmarkReport}`,
      `--config=${p.config}`,
      `--manifest=${p.manifest}`,
      `--archive-dir=${p.archiveDir}`,
      `--approve=${receiptPath}`,
    ]);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(new RegExp(`${field} is not a finite number`));
    expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');
  });

  it('refuses a benchmark report with a negative outcomeScoreDelta', () => {
    const p = buildBenchmarkPacket({
      recommendation: 'benchmark-pass',
      aggregateScore: 92,
      reportExtras: {
        outcomeScoreDelta: -0.25,
        fixtureDeltas: [
          { id: 'regressed', beforeScore: 93, afterScore: 92, delta: -1, helped: false, hurt: true },
        ],
      },
    });
    const result = runPromote(p, ['--allow-hurt-fixtures']);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/regression: outcomeScoreDelta < 0/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');
  });

  it('refuses a missing benchmark baseline unless explicitly overridden', () => {
    const p = buildBenchmarkPacket({
      recommendation: 'benchmark-pass',
      aggregateScore: 92,
      reportExtras: {
        outcomeScoreDelta: null,
        fixtureDeltas: [
          { id: 'no-baseline', beforeScore: null, afterScore: 92, delta: null, helped: false, hurt: false },
        ],
      },
    });
    const result = runPromote(p);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/outcomeScoreDelta is undefined/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');
  });

  it('requires --allow-hurt-fixtures for positive aggregate deltas with hurt fixtures', () => {
    const p = buildBenchmarkPacket({
      recommendation: 'benchmark-pass',
      aggregateScore: 92,
      reportExtras: {
        outcomeScoreDelta: 2,
        fixtureDeltaSummary: { total: 2, helped: 1, hurt: 1, unchanged: 0, missingBaseline: 0 },
        fixtureDeltas: [
          { id: 'helped', beforeScore: 80, afterScore: 90, delta: 10, helped: true, hurt: false },
          { id: 'hurt', beforeScore: 95, afterScore: 90, delta: -5, helped: false, hurt: true },
        ],
      },
    });

    const blocked = runPromote(p);
    expect(blocked.status).toBe(1);
    expect(blocked.stderr).toMatch(/hurt fixtures detected \(hurt\)/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');

    const allowed = runPromote(p, ['--allow-hurt-fixtures']);
    expect(allowed.status, allowed.stderr).toBe(0);
    const out = JSON.parse(allowed.stdout);
    expect(out.outcomeScoreDelta).toBe(2);
    expect(out.fixtureDeltaSummary.hurt).toBe(1);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('CANDIDATE BODY\n');
  });

  it('accepts a candidate without mutating the canonical target', () => {
    const p = buildBenchmarkPacket({ recommendation: 'benchmark-pass', aggregateScore: 92 });
    const acceptanceFile = path.join(p.archiveDir, 'accepted.json');
    const result = runPromote(p, [
      '--phase=accept',
      `--acceptance-file=${acceptanceFile}`,
      '--preserved-branch=preserved/test',
    ]);

    expect(result.status, result.stderr).toBe(0);
    const out = JSON.parse(result.stdout);
    expect(out.status).toBe('accepted');
    expect(out.acceptanceFile).toBe(acceptanceFile);
    expect(out.preservedBranch).toBe('preserved/test');
    expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');

    const acceptedState = readJson(acceptanceFile);
    expect(acceptedState.status).toBe('accepted');
    expect(fs.readFileSync(acceptedState.candidateSnapshotPath, 'utf8')).toBe('CANDIDATE BODY\n');
    expect(fs.readFileSync(acceptedState.preAcceptBackupPath, 'utf8')).toBe('ORIGINAL TARGET BODY\n');
  });

  it('ships an accepted snapshot and rolls back to the pre-acceptance target', () => {
    const p = buildBenchmarkPacket({ recommendation: 'benchmark-pass', aggregateScore: 92 });
    const acceptanceFile = path.join(p.archiveDir, 'accepted.json');
    const accepted = runPromote(p, [
      '--phase=accept',
      `--acceptance-file=${acceptanceFile}`,
      '--preserved-branch=preserved/test',
    ]);
    expect(accepted.status, accepted.stderr).toBe(0);

    fs.writeFileSync(p.candidate, 'CANDIDATE MUTATED AFTER ACCEPT\n', 'utf8');
    const shipped = runShip(acceptanceFile);

    expect(shipped.status, shipped.stderr).toBe(0);
    const shipOut = JSON.parse(shipped.stdout);
    expect(shipOut.status).toBe('shipped');
    expect(fs.readFileSync(p.target, 'utf8')).toBe('CANDIDATE BODY\n');

    const rolledBack = runRollback(acceptanceFile);
    expect(rolledBack.status, rolledBack.stderr).toBe(0);
    const rollbackOut = JSON.parse(rolledBack.stdout);
    expect(rollbackOut.status).toBe('rolled_back');
    expect(rollbackOut.preservedBranch).toBe('preserved/test');
    expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');
  });

  it('rejects a forged acceptance JSON that has no authenticated receipt', () => {
    const p = buildBenchmarkPacket({ recommendation: 'benchmark-pass', aggregateScore: 92 });
    issueBenchmarkReceipt(p);
    const forgedSnapshot = path.join(p.archiveDir, 'forged-snapshot.txt');
    const acceptanceFile = path.join(p.archiveDir, 'forged.accepted.json');
    fs.mkdirSync(p.archiveDir, { recursive: true });
    fs.writeFileSync(forgedSnapshot, 'FORGED CANDIDATE\n', 'utf8');
    writeJson(acceptanceFile, {
      status: 'accepted',
      target: p.target,
      candidate: p.candidate,
      candidateSnapshotPath: forgedSnapshot,
      candidateHash: '0'.repeat(64),
      preAcceptTargetHash: '1'.repeat(64),
      archiveDir: p.archiveDir,
      benchmarkReportPath: p.benchmarkReport,
      repeatabilityReportPath: p.repeatability,
      configPath: p.config,
      manifestPath: p.manifest,
    });

    const result = runShip(acceptanceFile);

    expect(result.status, result.stderr).toBe(1);
    expect(result.stderr).toMatch(/acceptance receipt is not authentic/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');
  });

  it('blocks rollback before ship and from unexpected target drift', () => {
    const p = buildBenchmarkPacket({ recommendation: 'benchmark-pass', aggregateScore: 92 });
    const acceptanceFile = path.join(p.archiveDir, 'accepted.json');
    const accepted = runPromote(p, [
      '--phase=accept',
      `--acceptance-file=${acceptanceFile}`,
      '--preserved-branch=preserved/test',
    ]);
    expect(accepted.status, accepted.stderr).toBe(0);

    const preShipRollback = runRollback(acceptanceFile);
    // Rollback is authorized only after the accepted candidate becomes the
    // canonical target; acceptance alone must not authorize restoration.
    expect(preShipRollback.status).toBe(1);
    expect(preShipRollback.stderr).toMatch(/unexpected canonical target state/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');

    fs.writeFileSync(p.target, 'UNEXPECTED TARGET BODY\n', 'utf8');
    const blockedRollback = runRollback(acceptanceFile);

    expect(blockedRollback.status).toBe(1);
    expect(blockedRollback.stderr).toMatch(/unexpected canonical target state/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('UNEXPECTED TARGET BODY\n');
  });

  it('blocks ship after canonical drift, restores the pre-acceptance target, and records a preserved-branch event', () => {
    const p = buildBenchmarkPacket({ recommendation: 'benchmark-pass', aggregateScore: 92 });
    const acceptanceFile = path.join(p.archiveDir, 'accepted.json');
    const accepted = runPromote(p, [
      '--phase=accept',
      `--acceptance-file=${acceptanceFile}`,
      '--preserved-branch=preserved/test',
    ]);
    expect(accepted.status, accepted.stderr).toBe(0);

    fs.writeFileSync(p.target, 'DRIFTED TARGET BODY\n', 'utf8');
    const blocked = runShip(acceptanceFile, [`--event-log=${p.eventLog}`]);

    expect(blocked.status).toBe(1);
    expect(blocked.stderr).toMatch(/canonical target changed after acceptance/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');

    const events = readJsonl(p.eventLog);
    expect(events).toHaveLength(1);
    expect(events[0].eventType).toBe('promotion_blocked_branch_preserved');
    expect(events[0].phase).toBe('ship');
    expect(events[0].preservedBranch).toBe('preserved/test');
    expect(events[0].details.errorType).toBe('canonical_target_changed');
  });
});

// The target===config.target / target===manifest canonical equality gates
// are necessary but not sufficient — they only prove internal consistency
// between args, config, and manifest, none of which are independently
// trustworthy. These tests pin the additional realpath-based containment
// check: even when every equality gate agrees, a target that resolves
// outside the allowed roots (and outside any explicit
// config.promotion.allowedTargetRoots allowlist) must be refused and must
// leave the canonical target untouched.
describe('promote-candidate / rollback-candidate write-boundary containment', () => {
  it('refuses to promote when the canonical target resolves outside the allowed roots, even though manifest/config agree', () => {
    const p = buildBenchmarkPacket({ recommendation: 'benchmark-pass', aggregateScore: 92 });
    // Strip the test-only allowlist the default fixture adds: the target
    // lives in a hermetic tmpdir outside .opencode/agents, .claude/agents,
    // and .opencode/skills, so without an explicit allowlist entry it must
    // be refused even though target===config.target and target===manifest
    // canonical target both still hold.
    const config = readJson(p.config);
    delete config.promotion;
    writeJson(p.config, config);

    const result = runPromote(p);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/resolves outside the allowed target roots/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');
  });

  it('refuses rollback under the same unauthorized-root condition', () => {
    const p = buildBenchmarkPacket({ recommendation: 'benchmark-pass', aggregateScore: 92 });
    const acceptanceFile = path.join(p.archiveDir, 'accepted.json');
    const accepted = runPromote(p, [
      '--phase=accept',
      `--acceptance-file=${acceptanceFile}`,
    ]);
    expect(accepted.status, accepted.stderr).toBe(0);

    // Strip the allowlist after acceptance so the ensuing rollback sees an
    // unauthorized target despite a valid, hash-verified acceptance record.
    const config = readJson(p.config);
    delete config.promotion;
    writeJson(p.config, config);

    const result = runRollback(acceptanceFile);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/resolves outside the allowed target roots/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');
  });

  it.each([
    ['candidate', (p: ReturnType<typeof buildBenchmarkPacket>, outside: string) => { p.candidate = path.join(outside, 'candidate.txt'); fs.writeFileSync(p.candidate, 'CANDIDATE BODY\n'); return []; }],
    ['archive directory', (p: ReturnType<typeof buildBenchmarkPacket>, outside: string) => { p.archiveDir = path.join(outside, 'archive'); return []; }],
    ['acceptance file', (_p: ReturnType<typeof buildBenchmarkPacket>, outside: string) => ['--phase=accept', `--acceptance-file=${path.join(outside, 'accepted.json')}`]],
    ['event log', (_p: ReturnType<typeof buildBenchmarkPacket>, outside: string) => [`--event-log=${path.join(outside, 'events.jsonl')}`]],
    ['state file', (_p: ReturnType<typeof buildBenchmarkPacket>, outside: string) => [`--state-file=${path.join(outside, 'state.json')}`]],
  ])('rejects an uncontained %s before creating output', (label, mutate) => {
    const p = buildBenchmarkPacket({ recommendation: 'benchmark-pass', aggregateScore: 92 });
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'promotion-outside-'));
    try {
      const extraArgs = mutate(p, outside);
      const result = runPromote(p, extraArgs);

      expect(result.status).toBe(1);
      expect(result.stderr).toMatch(/outside allowed roots/);
      expect(fs.readdirSync(outside)).toEqual(label === 'candidate' ? ['candidate.txt'] : []);
      expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });

  it('rejects a scored candidate whose identity fields are absent even when numeric gates pass', () => {
    const p = buildBenchmarkPacket({ recommendation: 'benchmark-pass', aggregateScore: 92 });
    const scorePath = path.join(work, 'score.json');
    const inputHash = 'a'.repeat(64);
    writeJson(scorePath, {
      status: 'scored',
      target: p.target,
      inputHash,
      evaluatorProfileId: 'authority-profile',
      evaluatorAgentName: 'authority-agent',
      evaluatorEpoch: 'epoch-7',
      score: 100,
      delta: 5,
      recommendation: 'candidate-better',
      dimensions: ['structural', 'ruleCoherence', 'integration', 'outputQuality', 'systemFitness']
        .map((name) => ({ name, score: 100 })),
    });
    const receiptPath = path.join(work, 'agent-approval.json');
    issueApprovalReceipt(receiptPath, {
      candidatePath: p.candidate,
      targetPath: p.target,
      scorePath,
      benchmarkReportPath: p.benchmarkReport,
      repeatabilityReportPath: p.repeatability,
      configPath: p.config,
      manifestPath: p.manifest,
      approvalIdentity: 'operator:test',
      evaluatorProfileId: 'authority-profile',
      evaluatorAgentName: 'authority-agent',
      evaluatorEpoch: 'epoch-7',
    });

    const result = runPromoteArgs([
      `--candidate=${p.candidate}`,
      `--target=${p.target}`,
      `--score=${scorePath}`,
      `--benchmark-report=${p.benchmarkReport}`,
      `--config=${p.config}`,
      `--manifest=${p.manifest}`,
      `--archive-dir=${p.archiveDir}`,
      `--approve=${receiptPath}`,
    ]);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/score\.candidate \(undefined\)/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('ORIGINAL TARGET BODY\n');
  });
});
