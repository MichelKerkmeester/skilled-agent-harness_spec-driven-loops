// MODULE: Post-Dispatch Dispatch-Receipt Validator Tests
//
// Covers the receipt VALIDATOR side of post-dispatch-validate: when a dispatch
// opts into receipts, a structurally intact, intent-bound receipt pair is
// required before the state-log append is accepted. Missing receipts and
// intent/completion mismatches are each rejected with a distinct reason. A mac
// that fails to cryptographically correlate is downgraded to an advisory
// warning, not a blocking failure — the signing key cannot survive a real
// writer-process/validator-process boundary, so a mismatch means "different
// process," not "tampered" (see post-dispatch-validate.ts). A dispatch that
// does not opt into receipts keeps legacy behavior.

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

  it('accepts a receipt pair with a mismatched mac as an advisory warning, not a block (the mac cannot authenticate across a process boundary)', () => {
    withTempPaths((paths) => {
      const previousStateLogSize = seedValidIteration(paths);
      const dispatchId = 'test-i2-bbb222';
      const facts = buildReceiptFacts();
      writeReceipt(paths.receiptDir, dispatchId, 'intent', buildReceiptRecord('intent', dispatchId, facts));

      const mismatchedCompletion = buildReceiptRecord('completion', dispatchId, completionFacts(facts));
      mismatchedCompletion.mac = '0'.repeat(64); // structurally valid; does not recompute to a matching mac
      writeReceipt(paths.receiptDir, dispatchId, 'completion', mismatchedCompletion);

      const result = validateWithReceipt(paths, previousStateLogSize, dispatchId);
      expect(result.ok).toBe(true);
      if (result.ok) {
        const codes = (result.warnings ?? []).map((warning) => warning.code);
        expect(codes).toContain('dispatch_receipt_mac_uncorrelated');
      }
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

describe('post-dispatch-validate route-proof demotion on valid receipt', () => {
  type RouteProofLike = {
    mode: string;
    targetAgent: string;
    resolvedRoute: string;
    requireAgentDefinitionLoaded?: boolean;
  };

  const ROUTE_PROOF: RouteProofLike = {
    mode: 'research',
    targetAgent: 'deep-research',
    resolvedRoute: 'Resolved route: mode=research target_agent=deep-research',
    requireAgentDefinitionLoaded: true,
  };

  beforeEach(() => {
    __setRunMasterSecretForTesting(KNOWN_SECRET);
  });

  afterEach(() => {
    __setRunMasterSecretForTesting(undefined);
  });

  function seedIteration(paths: TempPaths, recordOverrides: Record<string, unknown> = {}): number {
    writeFileSync(paths.iterationFile, '# Iteration 1\n', 'utf8');
    writeFileSync(paths.stateLogPath, '{"type":"event"}\n', 'utf8');
    const previousStateLogSize = statSync(paths.stateLogPath).size;
    const record = {
      type: 'iteration',
      iteration: 1,
      newInfoRatio: 0.4,
      status: 'continue',
      focus: 'coverage',
      mode: 'research',
      ...recordOverrides,
    };
    writeFileSync(
      paths.stateLogPath,
      `${readFileSync(paths.stateLogPath, 'utf8')}${JSON.stringify(record)}\n`,
      'utf8',
    );
    return previousStateLogSize;
  }

  function writeValidReceipts(paths: TempPaths, dispatchId: string): void {
    const facts = buildReceiptFacts();
    writeReceipt(paths.receiptDir, dispatchId, 'intent', buildReceiptRecord('intent', dispatchId, facts));
    writeReceipt(
      paths.receiptDir,
      dispatchId,
      'completion',
      buildReceiptRecord('completion', dispatchId, completionFacts(facts)),
    );
  }

  function validate(
    paths: TempPaths,
    previousStateLogSize: number,
    dispatchId: string,
    options: { receipt: boolean; routeProof?: RouteProofLike },
  ) {
    return validateIterationOutputs({
      iterationFile: paths.iterationFile,
      stateLogPath: paths.stateLogPath,
      previousStateLogSize,
      requiredJsonlFields: ['type', 'iteration', 'newInfoRatio', 'status', 'focus'],
      routeProof: options.routeProof,
      ...(options.receipt ? { dispatchReceipt: { receiptDir: paths.receiptDir, dispatchId } } : {}),
    });
  }

  it('accepts an iteration omitting the model-written route-proof fields when a valid receipt is present', () => {
    withTempPaths((paths) => {
      const previousStateLogSize = seedIteration(paths);
      const dispatchId = 'route-demote-omit';
      writeValidReceipts(paths, dispatchId);

      const result = validate(paths, previousStateLogSize, dispatchId, { receipt: true, routeProof: ROUTE_PROOF });
      expect(result.ok).toBe(true);
      if (result.ok) {
        const codes = (result.warnings ?? []).map((warning) => warning.code);
        expect(codes).toContain('route_proof_missing');
      }
    });
  });

  it('warns instead of failing when model-written route-proof fields mismatch but a valid receipt is present', () => {
    withTempPaths((paths) => {
      const previousStateLogSize = seedIteration(paths, {
        target_agent: 'deep-review',
        agent_definition_loaded: false,
        resolved_route: 'Resolved route: mode=review target_agent=deep-review',
      });
      const dispatchId = 'route-demote-mismatch';
      writeValidReceipts(paths, dispatchId);

      const result = validate(paths, previousStateLogSize, dispatchId, { receipt: true, routeProof: ROUTE_PROOF });
      expect(result.ok).toBe(true);
      if (result.ok) {
        const codes = (result.warnings ?? []).map((warning) => warning.code);
        expect(codes).toContain('route_proof_mismatch');
      }
    });
  });

  it('still hard-fails on a mode mismatch even when a valid receipt is present', () => {
    withTempPaths((paths) => {
      const previousStateLogSize = seedIteration(paths, { mode: 'review' });
      const dispatchId = 'route-demote-mode';
      writeValidReceipts(paths, dispatchId);

      const result = validate(paths, previousStateLogSize, dispatchId, { receipt: true, routeProof: ROUTE_PROOF });
      expect(result).toMatchObject({
        ok: false,
        reason: 'route_proof_mismatch',
        details: expect.stringContaining("state_log.mode='review'"),
      });
    });
  });

  it('keeps the legacy hard failure for missing model-written fields when no receipt is configured', () => {
    withTempPaths((paths) => {
      const previousStateLogSize = seedIteration(paths);

      const result = validate(paths, previousStateLogSize, 'unused', { receipt: false, routeProof: ROUTE_PROOF });
      expect(result).toMatchObject({
        ok: false,
        reason: 'route_proof_missing',
        details: expect.stringContaining('target_agent'),
      });
    });
  });
});
