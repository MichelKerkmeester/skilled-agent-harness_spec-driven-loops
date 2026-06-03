// ───────────────────────────────────────────────────────────────────
// MODULE: Matrix Adapter Common — Error-Path Tests
// ───────────────────────────────────────────────────────────────────
//
// Verifies that the child-process 'error' event handler in runCliAdapter
// correctly distinguishes infrastructure errors (BLOCKED) from unexpected
// spawn errors (FAIL). This is the path through SPAWN_BLOCKED_CODES.

import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:child_process', () => ({ spawn: vi.fn() }));

import { runCliAdapter } from '../matrix_runners/adapter-common.js';
import { MockChildProcess, baseInput, spawnMock } from './matrix-adapter-test-utils.js';

/** Build a minimal RunCliAdapterInput for tests. */
function makeArgs(signal = 'MATRIX_CELL_PASS') {
  return {
    adapterName: 'test-adapter',
    input: baseInput(signal),
    invocation: {
      command: 'fake-cli',
      args: ['--prompt', 'test'],
    },
  } as const;
}

/** Emit a child 'error' event after spawn returns the mock child. */
function mockSpawnWithError(errnoCode: string): MockChildProcess {
  const child = new MockChildProcess();
  spawnMock().mockReturnValue(child as never);
  setTimeout(() => {
    const err = Object.assign(new Error(`mock error: ${errnoCode}`), { code: errnoCode });
    child.emit('error', err);
  }, 0);
  return child;
}

describe('runCliAdapter — child error-path status classification', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('emits FAIL for unexpected spawn errors (EPIPE is not in SPAWN_BLOCKED_CODES)', async () => {
    mockSpawnWithError('EPIPE');
    const result = await runCliAdapter(makeArgs());

    expect(result.status).toBe('FAIL');
    expect(result.evidence.exitCode).toBe(-1);
    expect(result.reason).toMatch(/EPIPE/);
  });

  it('emits BLOCKED for ENOENT (no executable at that path)', async () => {
    mockSpawnWithError('ENOENT');
    const result = await runCliAdapter(makeArgs());

    expect(result.status).toBe('BLOCKED');
    expect(result.evidence.exitCode).toBe(-1);
    expect(result.reason).toMatch(/ENOENT/);
  });

  it('emits BLOCKED for EACCES (permission denied)', async () => {
    mockSpawnWithError('EACCES');
    const result = await runCliAdapter(makeArgs());

    expect(result.status).toBe('BLOCKED');
  });

  it('emits BLOCKED for EAGAIN (resource temporarily unavailable)', async () => {
    mockSpawnWithError('EAGAIN');
    const result = await runCliAdapter(makeArgs());

    expect(result.status).toBe('BLOCKED');
  });

  it('emits BLOCKED for ENOSPC (no space left on device)', async () => {
    mockSpawnWithError('ENOSPC');
    const result = await runCliAdapter(makeArgs());

    expect(result.status).toBe('BLOCKED');
  });

  it('emits FAIL for unknown error codes (ECONNRESET)', async () => {
    mockSpawnWithError('ECONNRESET');
    const result = await runCliAdapter(makeArgs());

    expect(result.status).toBe('FAIL');
  });
});
