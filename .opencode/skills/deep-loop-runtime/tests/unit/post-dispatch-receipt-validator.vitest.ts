// MODULE: Post-Dispatch Dispatch-Receipt Validator Tests
//
// Covers the receipt VALIDATOR side of post-dispatch-validate: when a dispatch
// opts into receipts, a valid engine-signed receipt pair is required before the
// state-log append is accepted. Forged MACs, missing receipts, and
// intent/completion mismatches are each rejected with a distinct reason. A
// dispatch that does not opt into receipts keeps legacy behavior.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { __getRunMasterSecretForTesting, __setRunMasterSecretForTesting } from '../../lib/deep-loop/executor-audit.js';
import { deriveReceiptKey, signReceipt } from '../../lib/deep-loop/receipt-crypto.js';
import { validateIterationOutputs } from '../../lib/deep-loop/post-dispatch-validate.js';

const KNOWN_SECRET = 'post-dispatch-receipt-validator-known-secret';

type ReceiptPhase = 'intent' | 'completion';

function buildReceiptFacts(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    command: '/usr/bin/false',
    args: ['--mode', 'research'],
    cwd: '/workspace',
    executor: { kind: 'cli-opencode', model: null },
    iteration: 1,
    ...overrides,
  };
}

// Build a structurally-correct, validly-signed receipt record for the given
// phase under the currently-installed run-master secret. The validator re-reads
// the same in-process secret, so receipts it builds and receipts the validator
// checks share one key.
function buildReceiptRecord(
  phase: ReceiptPhase,
  dispatchId: string,
  facts: Record<string, unknown>,
): Record<string, unknown> {
  const key = deriveReceiptKey(__getRunMasterSecretForTesting(), dispatchId);
  const unsigned = {
    version: 1,
    type: 'dispatch_receipt',
    phase,
    dispatchId,
    issuedAt: '2026-07-03T00:00:00.000Z',
    facts,
  };
  return { ...unsigned, mac: signReceipt(unsigned, key) };
}

function receiptPath(receiptDir: string, dispatchId: string, phase: ReceiptPhase): string {
  return join(receiptDir, `dispatch-${dispatchId}.${phase}.json`);
}

function writeReceipt(
  receiptDir: string,
  dispatchId: string,
  phase: ReceiptPhase,
  record: Record<string, unknown>,
): void {
  mkdirSync(receiptDir, { recursive: true });
  writeFileSync(receiptPath(receiptDir, dispatchId, phase), `${JSON.stringify(record)}\n`, 'utf8');
}

function completionFacts(facts: Record<string, unknown>): Record<string, unknown> {
  return {
    ...facts,
    childPid: 4242,
    exitStatus: 0,
    signal: null,
    sessionId: null,
  };
}

type TempPaths = {
  tempDir: string;
  iterationFile: string;
  stateLogPath: string;
  receiptDir: string;
};

function withTempPaths(run: (paths: TempPaths) => void): void {
  const tempDir = mkdtempSync(join(tmpdir(), 'post-dispatch-receipt-validator-'));
  try {
    run({
      tempDir,
      iterationFile: join(tempDir, 'iteration-001.md'),
      stateLogPath: join(tempDir, 'state.jsonl'),
      receiptDir: join(tempDir, 'receipts'),
    });
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

// Seed a schema-valid iteration record + non-empty iteration file so the
// validator reaches the dispatch-receipt gate (everything before it passes).
function seedValidIteration(paths: TempPaths): number {
  writeFileSync(paths.iterationFile, '# Iteration 1\n', 'utf8');
  writeFileSync(paths.stateLogPath, '{"type":"event"}\n', 'utf8');
  const previousStateLogSize = statSync(paths.stateLogPath).size;
  const record = {
    type: 'iteration',
    iteration: 1,
    newInfoRatio: 0.4,
    status: 'continue',
    focus: 'coverage',
  };
  writeFileSync(
    paths.stateLogPath,
    `${readFileSync(paths.stateLogPath, 'utf8')}${JSON.stringify(record)}\n`,
    'utf8',
  );
  return previousStateLogSize;
}

function validateWithReceipt(paths: TempPaths, previousStateLogSize: number, dispatchId: string) {
  return validateIterationOutputs({
    iterationFile: paths.iterationFile,
    stateLogPath: paths.stateLogPath,
    previousStateLogSize,
    requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
    dispatchReceipt: { receiptDir: paths.receiptDir, dispatchId },
  });
}

describe('post-dispatch-validate dispatch receipts', () => {
  beforeEach(() => {
    __setRunMasterSecretForTesting(KNOWN_SECRET);
  });

  afterEach(() => {
    __setRunMasterSecretForTesting(undefined);
  });

  it('accepts the state-log append when a valid intent + completion receipt pair exists', () => {
    withTempPaths((paths) => {
      const previousStateLogSize = seedValidIteration(paths);
      const dispatchId = 'test-i1-aaa111';
      const facts = buildReceiptFacts();
      writeReceipt(paths.receiptDir, dispatchId, 'intent', buildReceiptRecord('intent', dispatchId, facts));
      writeReceipt(
        paths.receiptDir,
        dispatchId,
        'completion',
        buildReceiptRecord('completion', dispatchId, completionFacts(facts)),
      );

      expect(validateWithReceipt(paths, previousStateLogSize, dispatchId)).toEqual({ ok: true });
    });
  });

  it('rejects a present-but-forged receipt MAC as dispatch_receipt_invalid_mac (distinct from missing)', () => {
    withTempPaths((paths) => {
      const previousStateLogSize = seedValidIteration(paths);
      const dispatchId = 'test-i2-bbb222';
      const facts = buildReceiptFacts();
      writeReceipt(paths.receiptDir, dispatchId, 'intent', buildReceiptRecord('intent', dispatchId, facts));

      const forgedCompletion = buildReceiptRecord('completion', dispatchId, completionFacts(facts));
      forgedCompletion.mac = '0'.repeat(64); // same length, different content
      writeReceipt(paths.receiptDir, dispatchId, 'completion', forgedCompletion);

      const result = validateWithReceipt(paths, previousStateLogSize, dispatchId);
      expect(result).toMatchObject({
        ok: false,
        reason: 'dispatch_receipt_invalid_mac',
        details: expect.stringContaining('completion receipt MAC verification failed'),
      });
    });
  });

  it('rejects a missing receipt (no intent file) as dispatch_receipt_missing', () => {
    withTempPaths((paths) => {
      const previousStateLogSize = seedValidIteration(paths);
      const dispatchId = 'test-i3-ccc333';
      // No receipt files written at all.

      const result = validateWithReceipt(paths, previousStateLogSize, dispatchId);
      expect(result).toMatchObject({
        ok: false,
        reason: 'dispatch_receipt_missing',
        details: expect.stringContaining('intent receipt missing'),
      });
    });
  });

  it('rejects a missing completion receipt as dispatch_receipt_missing even when intent exists', () => {
    withTempPaths((paths) => {
      const previousStateLogSize = seedValidIteration(paths);
      const dispatchId = 'test-i4-ddd444';
      const facts = buildReceiptFacts();
      writeReceipt(paths.receiptDir, dispatchId, 'intent', buildReceiptRecord('intent', dispatchId, facts));
      // Completion omitted on purpose.

      const result = validateWithReceipt(paths, previousStateLogSize, dispatchId);
      expect(result).toMatchObject({
        ok: false,
        reason: 'dispatch_receipt_missing',
        details: expect.stringContaining('completion receipt missing'),
      });
    });
  });

  it('rejects a completion that does not bind to its intent as dispatch_receipt_intent_mismatch', () => {
    withTempPaths((paths) => {
      const previousStateLogSize = seedValidIteration(paths);
      const dispatchId = 'test-i5-eee555';
      const intentFacts = buildReceiptFacts({ command: '/usr/bin/intended' });
      // Same dispatchId + valid MAC, but a different intended command: a
      // countersign of a different dispatch.
      const completionRecord = buildReceiptRecord(
        'completion',
        dispatchId,
        completionFacts(buildReceiptFacts({ command: '/usr/bin/subverted' })),
      );
      writeReceipt(paths.receiptDir, dispatchId, 'intent', buildReceiptRecord('intent', dispatchId, intentFacts));
      writeReceipt(paths.receiptDir, dispatchId, 'completion', completionRecord);

      const result = validateWithReceipt(paths, previousStateLogSize, dispatchId);
      expect(result).toMatchObject({
        ok: false,
        reason: 'dispatch_receipt_intent_mismatch',
        details: expect.stringContaining('completion does not bind to intent'),
      });
    });
  });

  it('imposes no receipt requirement when dispatchReceipt is omitted (backward compatible)', () => {
    withTempPaths((paths) => {
      const previousStateLogSize = seedValidIteration(paths);

      const result = validateIterationOutputs({
        iterationFile: paths.iterationFile,
        stateLogPath: paths.stateLogPath,
        previousStateLogSize,
        requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
      });
      expect(result).toEqual({ ok: true });
    });
  });
});
