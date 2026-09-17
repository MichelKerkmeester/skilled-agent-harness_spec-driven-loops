// MODULE: Executor Audit Dispatch Receipts + Key-Containment Tests

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { chmodSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

import {
  __getRunMasterSecretForTesting,
  __setRunMasterSecretForTesting,
  buildExecutorDispatchEnv,
  runAuditedExecutorCommand,
} from '../lib/deep-loop/executor-audit.js';
import { deriveReceiptKey, verifyReceipt } from '../lib/deep-loop/receipt-crypto.js';
import type { ExecutorConfig } from '../lib/deep-loop/executor-config.js';

const NODE = process.execPath;
const IS_ROOT = typeof process.getuid === 'function' && process.getuid() === 0;

function makeExecutor(): ExecutorConfig {
  return {
    kind: 'cli-opencode',
    model: null,
    configDir: null,
    reasoningEffort: null,
    serviceTier: null,
    sandboxMode: null,
    timeoutSeconds: 60,
    governor: null,
  };
}

function cleanGuardEnv(): Record<string, string | undefined> {
  // Minimal, controlled env so the recursion guard and the dispatched child are
  // deterministic and never inherit whatever launched the test runner.
  return {
    PATH: process.env.PATH,
    HOME: process.env.HOME,
    TMPDIR: process.env.TMPDIR,
  };
}

function tmpDir(): string {
  return mkdtempSync(join(tmpdir(), 'receipt-'));
}

describe('executor-audit dispatch receipts', () => {
  let dir: string;
  let receiptDir: string;
  let stateLogPath: string;

  beforeEach(() => {
    __setRunMasterSecretForTesting(undefined);
    dir = tmpDir();
    receiptDir = join(dir, 'receipts');
    stateLogPath = join(dir, 'state.jsonl');
    writeFileSync(stateLogPath, '', 'utf8');
  });

  afterEach(() => {
    __setRunMasterSecretForTesting(undefined);
    rmSync(dir, { recursive: true, force: true });
  });

  it('writes INTENT (no child id) and COMPLETION (with child facts), both verifiable under the derived key', () => {
    const dispatchId = 'dispatch-i1-deadbeef';
    runAuditedExecutorCommand({
      command: NODE,
      args: ['-e', 'process.exit(0)'],
      cwd: dir,
      timeoutSeconds: 10,
      stateLogPath,
      executor: makeExecutor(),
      iteration: 1,
      guardContext: { env: cleanGuardEnv(), ancestryCmdlines: [], statePaths: [] },
      receiptDir,
      dispatchId,
    });

    const secret = __getRunMasterSecretForTesting();
    const key = deriveReceiptKey(secret, dispatchId);

    const intentPath = join(receiptDir, `dispatch-${dispatchId}.intent.json`);
    const completionPath = join(receiptDir, `dispatch-${dispatchId}.completion.json`);
    expect(existsSync(intentPath)).toBe(true);
    expect(existsSync(completionPath)).toBe(true);

    const intent = JSON.parse(readFileSync(intentPath, 'utf8'));
    const completion = JSON.parse(readFileSync(completionPath, 'utf8'));

    expect(intent.phase).toBe('intent');
    expect(intent.dispatchId).toBe(dispatchId);
    expect(intent.facts.childPid).toBeUndefined();

    expect(completion.phase).toBe('completion');
    expect(completion.dispatchId).toBe(dispatchId);
    expect(completion.facts.childPid).toEqual(expect.any(Number));
    expect(completion.facts.exitStatus).toBe(0);

    // Both receipts verify under the derived key (resume re-verify path).
    expect(verifyReceipt(intent, intent.mac, key)).toBe(true);
    expect(verifyReceipt(completion, completion.mac, key)).toBe(true);
  });

  it('does not write receipts when receiptDir is omitted (opt-in, backward compatible)', () => {
    runAuditedExecutorCommand({
      command: NODE,
      args: ['-e', 'process.exit(0)'],
      cwd: dir,
      timeoutSeconds: 10,
      stateLogPath,
      executor: makeExecutor(),
      iteration: 1,
      guardContext: { env: cleanGuardEnv(), ancestryCmdlines: [], statePaths: [] },
    });

    expect(existsSync(receiptDir)).toBe(false);
    // State log stays empty of receipt-write events.
    expect(readFileSync(stateLogPath, 'utf8')).toBe('');
  });

  const writeFailureTest = IS_ROOT ? it.skip : it;
  writeFailureTest('emits a distinct dispatch_receipt_write_failed event (not missing) when the receipt dir is unwritable', () => {
    const ro = mkdtempSync(join(tmpdir(), 'ro-'));
    chmodSync(ro, 0o500); // read + execute, no write
    const unwritableReceiptDir = join(ro, 'receipts');

    try {
      runAuditedExecutorCommand({
        command: NODE,
        args: ['-e', 'process.exit(0)'],
        cwd: dir,
        timeoutSeconds: 10,
        stateLogPath,
        executor: makeExecutor(),
        iteration: 2,
        guardContext: { env: cleanGuardEnv(), ancestryCmdlines: [], statePaths: [] },
        receiptDir: unwritableReceiptDir,
        dispatchId: 'dispatch-i2-cafef00d',
      });

      const lines = readFileSync(stateLogPath, 'utf8').split('\n').filter((line) => line.trim() !== '');
      const events = lines.map((line) => JSON.parse(line) as Record<string, unknown>);

      const writeFailures = events.filter((event) => event.event === 'dispatch_receipt_write_failed');
      expect(writeFailures.length).toBeGreaterThan(0);
      // The class is distinct from a 'missing' receipt the validator would report.
      expect(writeFailures[0]?.reason).toBe('dispatch_receipt_write_failed');
      // No receipt files were produced.
      expect(existsSync(unwritableReceiptDir)).toBe(false);
    } finally {
      chmodSync(ro, 0o700);
      rmSync(ro, { recursive: true, force: true });
    }
  });
});

describe('executor-audit key containment (GAP-23 guarantee)', () => {
  const KNOWN_SECRET = 'CONTAINMENT-SECRET-SENTINEL-aa11bb22cc33';

  afterEach(() => {
    __setRunMasterSecretForTesting(undefined);
  });

  it('the run-master secret never appears in the built dispatch env (allowlist never admits it)', () => {
    process.env.__LEAK_PROBE = KNOWN_SECRET;
    try {
      const env = buildExecutorDispatchEnv(makeExecutor(), {
        ...cleanGuardEnv(),
        __LEAK_PROBE: KNOWN_SECRET,
      } as Record<string, string | undefined>);

      // The secret-bearing key is not on the allowlist, so it cannot transit.
      expect(env.__LEAK_PROBE).toBeUndefined();
      expect(JSON.stringify(env)).not.toContain(KNOWN_SECRET);
    } finally {
      delete process.env.__LEAK_PROBE;
    }
  });

  it('the run-master secret and derived key never reach the child argv/env (end-to-end)', () => {
    __setRunMasterSecretForTesting(KNOWN_SECRET);

    const dir = tmpDir();
    const stateLogPath = join(dir, 'state.jsonl');
    writeFileSync(stateLogPath, '', 'utf8');
    const receiptDir = join(dir, 'receipts');
    const dispatchId = 'dispatch-i3-leakcheck';

    const derivedKey = deriveReceiptKey(KNOWN_SECRET, dispatchId);

    // Child dumps every value it can see: its argv and its full env. If the
    // engine ever interpolated the secret or derived key into the command/env,
    // it would appear in this dump.
    const dumpScript =
      "process.stdout.write(JSON.stringify({argv:process.argv,envVals:Object.values(process.env)}))";

    const writes: string[] = [];
    const spy = vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
      if (typeof chunk === 'string') writes.push(chunk);
      else if (Buffer.isBuffer(chunk)) writes.push(chunk.toString('utf8'));
      return true;
    });

    try {
      runAuditedExecutorCommand({
        command: NODE,
        args: ['-e', dumpScript],
        cwd: dir,
        timeoutSeconds: 10,
        stateLogPath,
        executor: makeExecutor(),
        iteration: 3,
        guardContext: { env: cleanGuardEnv(), ancestryCmdlines: [], statePaths: [] },
        receiptDir,
        dispatchId,
      });

      const childDump = writes.find((chunk) => chunk.includes('"argv"')) ?? writes.join('');
      const parsed = JSON.parse(childDump) as { argv: string[]; envVals: string[] };
      const childVisible = JSON.stringify(parsed);

      expect(childVisible).not.toContain(KNOWN_SECRET);
      expect(childVisible).not.toContain(derivedKey);
      // Receipts were still produced and verify under the held key (the held key
      // is real to the engine, just unreachable to the child).
      const completionPath = join(receiptDir, `dispatch-${dispatchId}.completion.json`);
      expect(existsSync(completionPath)).toBe(true);
      const completion = JSON.parse(readFileSync(completionPath, 'utf8'));
      expect(verifyReceipt(completion, completion.mac, derivedKey)).toBe(true);
    } finally {
      spy.mockRestore();
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
