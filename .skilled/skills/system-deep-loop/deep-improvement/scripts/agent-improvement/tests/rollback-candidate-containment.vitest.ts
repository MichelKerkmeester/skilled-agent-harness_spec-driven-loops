// ───────────────────────────────────────────────────────────────────
// MODULE: agent-improvement/rollback-candidate.cjs write-boundary containment
//   The target===config.target / target===manifest canonical equality gates
//   only prove internal consistency between args, config, and manifest —
//   none of which are independently trustworthy. This pins the additional
//   realpath-based containment check added as defense-in-depth: a target
//   that resolves outside the allowed roots (and outside any explicit
//   config.promotion.allowedTargetRoots allowlist) must be refused, even
//   when every equality gate agrees, and the target file must be left
//   untouched.
// ───────────────────────────────────────────────────────────────────

import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../../');
const ROLLBACK = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs',
);
const require = createRequire(import.meta.url);
const { issueReceipt } = require('../../shared/promotion-receipts.cjs') as {
  issueReceipt: (filePath: string, payload: Record<string, unknown>) => void;
};
const RECEIPT_KEY = 'test-only-promotion-authority-key-32-bytes-minimum';

let work: string;

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function buildPacket(target: string) {
  const backup = path.join(work, 'backup.txt');
  const configPath = path.join(work, 'config.json');
  const manifestPath = path.join(work, 'target-manifest.jsonc');

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, 'CURRENT TARGET BODY\n', 'utf8');
  fs.writeFileSync(backup, 'BACKUP TARGET BODY\n', 'utf8');
  writeJson(configPath, { target });
  fs.writeFileSync(
    manifestPath,
    `// agent target manifest\n${JSON.stringify({ targets: [{ path: target, classification: 'canonical' }] }, null, 2)}\n`,
    'utf8',
  );

  const evidencePaths = ['report.json', 'repeatability.json', 'score.json'].map((name) => path.join(work, name));
  for (const evidencePath of evidencePaths) writeJson(evidencePath, { inputHash: 'a'.repeat(64) });
  return { target, backup, configPath, manifestPath, evidencePaths };
}

function sha256File(filePath: string): string {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function issueRollbackReceipt(p: ReturnType<typeof buildPacket>): string {
  const [benchmarkReport, repeatabilityReport, score] = p.evidencePaths;
  const acceptanceState = path.join(work, 'acceptance.json');
  writeJson(acceptanceState, { status: 'accepted' });
  const receiptPath = path.join(work, 'acceptance.receipt.json');
  issueReceipt(receiptPath, {
    receiptType: 'promotion-acceptance',
    receiptId: 'rollback-authority',
    issuedAt: '2026-08-15T00:00:00.000Z',
    authority: {
      approvalIdentity: 'operator:test',
      evaluatorProfileId: 'authority-profile',
      evaluatorAgentName: 'authority-agent',
      evaluatorEpoch: 'epoch-7',
    },
    binding: {
      candidate: { path: p.target, hash: sha256File(p.target) },
      target: { path: p.target, preimageHash: sha256File(p.backup) },
      score: { path: score, hash: sha256File(score), inputHash: 'a'.repeat(64) },
      benchmarkReport: { path: benchmarkReport, hash: sha256File(benchmarkReport) },
      repeatabilityReport: { path: repeatabilityReport, hash: sha256File(repeatabilityReport) },
      config: { path: p.configPath, hash: sha256File(p.configPath) },
      manifest: { path: p.manifestPath, hash: sha256File(p.manifestPath) },
    },
    acceptance: {
      state: { path: acceptanceState, hash: sha256File(acceptanceState) },
      candidateSnapshot: { path: p.target, hash: sha256File(p.target) },
      preAcceptBackup: { path: p.backup, hash: sha256File(p.backup) },
    },
  });
  return receiptPath;
}

function runRollback(p: ReturnType<typeof buildPacket>) {
  const receiptPath = issueRollbackReceipt(p);
  return spawnSync(
    'node',
    [
      ROLLBACK,
      `--target=${p.target}`,
      `--backup=${p.backup}`,
      `--config=${p.configPath}`,
      `--manifest=${p.manifestPath}`,
      `--receipt=${receiptPath}`,
    ],
    { encoding: 'utf8', cwd: WORKSPACE_ROOT },
  );
}

beforeEach(() => {
  work = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-rollback-containment-'));
  process.env.DEEP_LOOP_PROMOTION_RECEIPT_KEY = RECEIPT_KEY;
  process.env.DEEP_LOOP_PROMOTION_RECEIPT_KEY_ID = 'test-authority';
});
afterEach(() => {
  delete process.env.DEEP_LOOP_PROMOTION_RECEIPT_KEY;
  delete process.env.DEEP_LOOP_PROMOTION_RECEIPT_KEY_ID;
  fs.rmSync(work, { recursive: true, force: true });
});

describe('agent-improvement/rollback-candidate.cjs write-boundary containment', () => {
  it('refuses to roll back when the target resolves outside the allowed roots, even though manifest/config agree', () => {
    // Target lives in a hermetic tmpdir outside .opencode/agents,
    // .claude/agents, and .opencode/skills, so it is unauthorized by
    // default — target===config.target and target===manifest canonical
    // target both still hold.
    const p = buildPacket(path.join(work, 'canonical-target.txt'));

    const result = runRollback(p);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/resolves outside the allowed target roots/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('CURRENT TARGET BODY\n');
  });

  it('rolls back when the target resolves under an explicit config.promotion.allowedTargetRoots entry', () => {
    const p = buildPacket(path.join(work, 'canonical-target.txt'));
    const config = JSON.parse(fs.readFileSync(p.configPath, 'utf8'));
    config.promotion = { allowedTargetRoots: [work] };
    writeJson(p.configPath, config);

    const result = runRollback(p);

    expect(result.status, result.stderr).toBe(0);
    const out = JSON.parse(result.stdout);
    expect(out.status).toBe('rolled_back');
    expect(fs.readFileSync(p.target, 'utf8')).toBe('BACKUP TARGET BODY\n');
  });

  it('rejects a backup whose bytes no longer match the authenticated rollback binding', () => {
    const p = buildPacket(path.join(work, 'canonical-target.txt'));
    const config = JSON.parse(fs.readFileSync(p.configPath, 'utf8'));
    config.promotion = { allowedTargetRoots: [work] };
    writeJson(p.configPath, config);
    const receiptPath = issueRollbackReceipt(p);
    fs.writeFileSync(p.backup, 'REPLACED BACKUP BODY\n', 'utf8');

    const result = spawnSync('node', [
      ROLLBACK,
      `--target=${p.target}`,
      `--backup=${p.backup}`,
      `--config=${p.configPath}`,
      `--manifest=${p.manifestPath}`,
      `--receipt=${receiptPath}`,
    ], { encoding: 'utf8', cwd: WORKSPACE_ROOT });

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/backup hash does not match authenticated receipt/);
    expect(fs.readFileSync(p.target, 'utf8')).toBe('CURRENT TARGET BODY\n');
  });
});
