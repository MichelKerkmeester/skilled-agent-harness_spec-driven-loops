// ───────────────────────────────────────────────────────────────────
// MODULE: shared/rollback-candidate.cjs acceptance-file authenticity
//   The acceptance file rollback reads has no authenticity check of its own:
//   it is a caller-selected, hand-editable JSON. Before the accompanying fix,
//   the hash guard accepted a current target matching EITHER the recorded
//   pre-acceptance hash OR the recorded candidate hash, both of which are
//   read straight out of that same untrusted file. A forger who sets
//   preAcceptTargetHash to an arbitrary backup's digest and candidateHash to
//   the current target's (readable) digest passed both checks and had an
//   arbitrary backup copied over the canonical target. This pins the
//   sidecar-receipt authenticity check (mirroring promote-candidate.cjs's
//   assertShipPreconditions) that must pass before any acceptance-file field
//   is trusted, plus the case where the acceptance file drifts from an
//   already-issued receipt.
// ───────────────────────────────────────────────────────────────────

import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../../');
const ROLLBACK = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs',
);
const PROMOTE = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs',
);
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

function sha256(content: string) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function buildPacket() {
  const target = path.join(work, 'canonical-target.txt');
  const config = path.join(work, 'config.json');
  const manifest = path.join(work, 'target-manifest.jsonc');

  fs.writeFileSync(target, 'CURRENT TARGET BODY\n', 'utf8');
  writeJson(config, {
    target,
    proposalOnly: false,
    promotionEnabled: true,
    promotion: { allowedTargetRoots: [work] },
  });
  fs.writeFileSync(
    manifest,
    `// target manifest\n${JSON.stringify({ targets: [{ path: target, classification: 'canonical' }] }, null, 2)}\n`,
    'utf8',
  );

  return { target, config, manifest };
}

function runRollback(acceptanceFile: string) {
  return spawnSync('node', [ROLLBACK, `--acceptance-file=${acceptanceFile}`], {
    encoding: 'utf8',
    cwd: WORKSPACE_ROOT,
  });
}

function issueBenchmarkApproval(
  p: ReturnType<typeof buildPacket>,
  candidate: string,
  benchmarkReport: string,
  repeatabilityReport: string,
  receiptPath: string,
) {
  issueApprovalReceipt(receiptPath, {
    candidatePath: candidate,
    targetPath: p.target,
    benchmarkReportPath: benchmarkReport,
    repeatabilityReportPath: repeatabilityReport,
    configPath: p.config,
    manifestPath: p.manifest,
    approvalIdentity: 'operator:test',
    evaluatorProfileId: 'demo-profile',
    evaluatorAgentName: 'model-benchmark',
    evaluatorEpoch: 'test-epoch',
  });
}

beforeEach(() => {
  work = fs.mkdtempSync(path.join(os.tmpdir(), 'shared-rollback-hash-guard-'));
  process.env.DEEP_LOOP_PROMOTION_RECEIPT_KEY = RECEIPT_KEY;
  process.env.DEEP_LOOP_PROMOTION_RECEIPT_KEY_ID = 'test-authority';
});
afterEach(() => {
  delete process.env.DEEP_LOOP_PROMOTION_RECEIPT_KEY;
  delete process.env.DEEP_LOOP_PROMOTION_RECEIPT_KEY_ID;
  fs.rmSync(work, { recursive: true, force: true });
});

describe('shared/rollback-candidate.cjs acceptance-file authenticity', () => {
  it('refuses rollback before the accepted candidate is shipped', () => {
    const p = buildPacket();
    const candidate = path.join(work, 'candidate.txt');
    fs.writeFileSync(candidate, 'CANDIDATE BODY\n', 'utf8');
    const archiveDir = path.join(work, 'archive');
    const acceptanceFile = path.join(archiveDir, 'accepted.json');
    const receiptPath = path.join(work, 'approval-receipt.json');
    const benchmarkReport = path.join(work, 'report.json');
    writeJson(benchmarkReport, {
      status: 'benchmark-complete',
      scoringMethod: 'pattern',
      grader: 'noop',
      profileId: 'demo-profile',
      family: 'test',
      target: p.target,
      aggregateScore: 92,
      maxScore: 100,
      totals: { score: 92, delta: 0.05, pass_rate: 1, fixtures: 2, passed: 2 },
      recommendation: 'benchmark-pass',
    });
    const repeatabilityReport = path.join(work, 'repeatability.json');
    writeJson(repeatabilityReport, { profileId: 'demo-profile', passed: true });
    issueBenchmarkApproval(p, candidate, benchmarkReport, repeatabilityReport, receiptPath);

    const accept = spawnSync('node', [
      PROMOTE,
      '--phase=accept',
      `--candidate=${candidate}`,
      `--target=${p.target}`,
      `--benchmark-report=${benchmarkReport}`,
      `--config=${p.config}`,
      `--manifest=${p.manifest}`,
      `--archive-dir=${archiveDir}`,
      `--acceptance-file=${acceptanceFile}`,
      `--approve=${receiptPath}`,
    ], { encoding: 'utf8', cwd: WORKSPACE_ROOT });
    expect(accept.status, accept.stderr).toBe(0);

    const accepted = readJson(acceptanceFile);
    expect(accepted.preAcceptTargetHash).not.toBe(accepted.candidateHash);
    expect(sha256(fs.readFileSync(p.target, 'utf8'))).toBe(accepted.preAcceptTargetHash);

    const result = runRollback(acceptanceFile);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/unexpected canonical target state/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('CURRENT TARGET BODY\n');
  });

  it('refuses a forged acceptance file with no receipt, even when the OR hash guard would pass', () => {
    const p = buildPacket();
    const maliciousBackup = path.join(work, 'malicious-backup.txt');
    fs.writeFileSync(maliciousBackup, 'MALICIOUS BACKUP BODY\n', 'utf8');

    // Forged acceptance file: preAcceptTargetHash is crafted to equal the
    // malicious backup's digest, and candidateHash is crafted to equal the
    // CURRENT (readable) target's digest — exactly the hash-substitution
    // forgery shape. No accompanying `.receipt.json` sidecar exists, because this
    // acceptance file was never produced by promote-candidate.cjs's accept
    // phase.
    const acceptanceFile = path.join(work, 'forged.accepted.json');
    writeJson(acceptanceFile, {
      status: 'accepted',
      target: p.target,
      candidate: path.join(work, 'candidate.txt'),
      preAcceptBackupPath: maliciousBackup,
      preAcceptTargetHash: sha256('MALICIOUS BACKUP BODY\n'),
      candidateHash: sha256('CURRENT TARGET BODY\n'),
      configPath: p.config,
      manifestPath: p.manifest,
    });

    const result = runRollback(acceptanceFile);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/acceptance receipt not found/);
    // The canonical target must be left untouched — the malicious backup
    // must never have been copied over it.
    expect(fs.readFileSync(p.target, 'utf8')).toBe('CURRENT TARGET BODY\n');
  });

  it('refuses an acceptance file that drifted from its issued receipt', () => {
    const p = buildPacket();
    const candidate = path.join(work, 'candidate.txt');
    fs.writeFileSync(candidate, 'CANDIDATE BODY\n', 'utf8');
    const archiveDir = path.join(work, 'archive');
    const acceptanceFile = path.join(archiveDir, 'accepted.json');
    const receiptPath = path.join(work, 'approval-receipt.json');
    // Lane B (benchmark) needs a passing report before accept runs.
    const benchmarkReport = path.join(work, 'report.json');
    writeJson(benchmarkReport, {
      status: 'benchmark-complete',
      scoringMethod: 'pattern',
      grader: 'noop',
      profileId: 'demo-profile',
      family: 'test',
      target: p.target,
      aggregateScore: 92,
      maxScore: 100,
      totals: { score: 92, delta: 0.05, pass_rate: 1, fixtures: 2, passed: 2 },
      recommendation: 'benchmark-pass',
    });
    const repeatabilityReport = path.join(work, 'repeatability.json');
    writeJson(repeatabilityReport, { profileId: 'demo-profile', passed: true });
    issueBenchmarkApproval(p, candidate, benchmarkReport, repeatabilityReport, receiptPath);

    const accept = spawnSync('node', [
      PROMOTE,
      '--phase=accept',
      `--candidate=${candidate}`,
      `--target=${p.target}`,
      `--benchmark-report=${benchmarkReport}`,
      `--config=${p.config}`,
      `--manifest=${p.manifest}`,
      `--archive-dir=${archiveDir}`,
      `--acceptance-file=${acceptanceFile}`,
      `--approve=${receiptPath}`,
    ], { encoding: 'utf8', cwd: WORKSPACE_ROOT });
    expect(accept.status, accept.stderr).toBe(0);
    expect(fs.existsSync(`${acceptanceFile}.receipt.json`)).toBe(true);

    // Simulate a stale/hand-edited acceptance file: rewrite candidateHash to
    // match the current (still pre-ship) target without regenerating the
    // receipt. The receipt's acceptanceHash no longer matches.
    const accepted = readJson(acceptanceFile);
    accepted.candidateHash = sha256(fs.readFileSync(p.target, 'utf8'));
    writeJson(acceptanceFile, accepted);

    const result = runRollback(acceptanceFile);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/modified since the receipt was issued/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('CURRENT TARGET BODY\n');
  });
});
