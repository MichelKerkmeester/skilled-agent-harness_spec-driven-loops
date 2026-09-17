import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const {
  issueReceipt,
  readVerifiedReceipt,
} = require('../promotion-receipts.cjs') as {
  issueReceipt: (filePath: string, payload: Record<string, unknown>) => Record<string, unknown>;
  readVerifiedReceipt: (filePath: string, expectedType: string) => Record<string, unknown>;
};

const RECEIPT_KEY = 'test-only-promotion-authority-key-32-bytes-minimum';
let work: string;

beforeEach(() => {
  work = mkdtempSync(join(tmpdir(), 'promotion-receipts-'));
  process.env.DEEP_LOOP_PROMOTION_RECEIPT_KEY = RECEIPT_KEY;
  process.env.DEEP_LOOP_PROMOTION_RECEIPT_KEY_ID = 'test-authority';
});

afterEach(() => {
  delete process.env.DEEP_LOOP_PROMOTION_RECEIPT_KEY;
  delete process.env.DEEP_LOOP_PROMOTION_RECEIPT_KEY_ID;
  rmSync(work, { recursive: true, force: true });
});

function approvalPayload(): Record<string, unknown> {
  return {
    receiptType: 'promotion-approval',
    receiptId: 'approval-001',
    issuedAt: '2026-08-15T00:00:00.000Z',
    authority: {
      approvalIdentity: 'operator:test',
      evaluatorProfileId: 'authority-profile',
      evaluatorAgentName: 'authority-agent',
      evaluatorEpoch: 'epoch-7',
    },
    binding: {
      candidate: { path: '/candidate.md', hash: 'a'.repeat(64) },
      target: { path: '/target.md', preimageHash: 'b'.repeat(64) },
      score: { path: '/score.json', hash: 'c'.repeat(64), inputHash: 'd'.repeat(64) },
      benchmarkReport: { path: '/report.json', hash: 'e'.repeat(64) },
      repeatabilityReport: { path: '/repeatability.json', hash: 'f'.repeat(64) },
      config: { path: '/config.json', hash: '1'.repeat(64) },
      manifest: { path: '/manifest.jsonc', hash: '2'.repeat(64) },
    },
  };
}

describe('promotion receipt authority', () => {
  it('authenticates the decided authority fields and evidence bindings', () => {
    const receiptPath = join(work, 'approval.json');
    issueReceipt(receiptPath, approvalPayload());

    expect(readVerifiedReceipt(receiptPath, 'promotion-approval')).toMatchObject({
      authority: {
        approvalIdentity: 'operator:test',
        evaluatorProfileId: 'authority-profile',
        evaluatorAgentName: 'authority-agent',
        evaluatorEpoch: 'epoch-7',
      },
      authentication: { scheme: 'hmac-sha256', keyId: 'test-authority' },
    });
  });

  it('fails closed when a signed receipt is modified', () => {
    const receiptPath = join(work, 'approval.json');
    issueReceipt(receiptPath, approvalPayload());
    const receipt = JSON.parse(readFileSync(receiptPath, 'utf8'));
    receipt.binding.target.path = '/other-target.md';
    writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');

    expect(() => readVerifiedReceipt(receiptPath, 'promotion-approval')).toThrow(/authentication failed/);
  });

  it('uses exclusive creation so an issued receipt cannot be replaced', () => {
    const receiptPath = join(work, 'approval.json');
    issueReceipt(receiptPath, approvalPayload());

    expect(() => issueReceipt(receiptPath, approvalPayload())).toThrow(/already exists/);
  });

  it('rejects missing evaluator epoch before issuing a receipt', () => {
    const receiptPath = join(work, 'approval.json');
    const payload = approvalPayload();
    delete (payload.authority as Record<string, unknown>).evaluatorEpoch;

    expect(() => issueReceipt(receiptPath, payload)).toThrow(/evaluatorEpoch/);
    expect(() => readFileSync(receiptPath)).toThrow();
  });
});
