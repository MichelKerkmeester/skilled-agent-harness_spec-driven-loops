// ───────────────────────────────────────────────────────────────────
// MODULE: External CLI Provider Transport Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';

import {
  createChildProcessCliRunner,
  createExternalCliTransport,
  defaultChildProcessSpawn,
  defaultComposePrompt,
} from '../../src/transports/index.js';

import type {
  CliRunner,
  SpawnImpl,
  SpawnRequest,
} from '../../src/transports/index.js';
import type { ProviderWireRequest } from '../../src/providers/index.js';

function makeRequest(overrides: Partial<ProviderWireRequest> = {}): ProviderWireRequest {
  return {
    endpoint: 'https://external-cli.invalid/devin',
    providerId: 'external-cli-devin',
    modelId: 'gemini-3-7-flash-high',
    protocol: 'openai-chat-completions',
    credentialReference: 'none:cli',
    body: {
      model: 'gemini-3-7-flash-high',
      messages: [
        { role: 'system', content: 'SYS' },
        { role: 'user', content: 'USER' },
      ],
    },
    signal: new AbortController().signal,
    ...overrides,
  };
}

describe('createExternalCliTransport', () => {
  it('dispatches the resolved engine and returns an OpenAI-chat response on success', async () => {
    const runner = vi.fn<CliRunner>(async () => ({ status: 'ok', text: 'REWRITE' }));
    const transport = createExternalCliTransport({ runner });

    const result = await transport(makeRequest());

    expect(result).toEqual({
      status: 200,
      body: { choices: [{ finish_reason: 'stop', message: { content: 'REWRITE' } }] },
    });
    expect(runner).toHaveBeenCalledWith(
      expect.objectContaining({
        engine: 'devin',
        model: 'gemini-3-7-flash-high',
        systemInstruction: 'SYS',
        userText: 'USER',
      }),
    );
  });

  it('fails closed with 400 when the provider id carries no engine', async () => {
    const runner = vi.fn<CliRunner>(async () => ({ status: 'ok', text: 'x' }));
    const transport = createExternalCliTransport({ runner });

    const result = await transport(makeRequest({ providerId: 'mystery-provider' }));

    expect(result).toEqual({ status: 400, body: null });
    expect(runner).not.toHaveBeenCalled();
  });

  it('fails closed with 400 when no user message is present', async () => {
    const runner = vi.fn<CliRunner>(async () => ({ status: 'ok', text: 'x' }));
    const transport = createExternalCliTransport({ runner });

    const result = await transport(makeRequest({
      body: { model: 'm', messages: [{ role: 'system', content: 'only system' }] },
    }));

    expect(result).toEqual({ status: 400, body: null });
    expect(runner).not.toHaveBeenCalled();
  });

  it('returns 499 without dispatching when the request is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();
    const runner = vi.fn<CliRunner>(async () => ({ status: 'ok', text: 'x' }));
    const transport = createExternalCliTransport({ runner });

    const result = await transport(makeRequest({ signal: controller.signal }));

    expect(result).toEqual({ status: 499, body: null });
    expect(runner).not.toHaveBeenCalled();
  });

  it('maps a CLI error, empty output, or thrown runner to the fail-closed 502 response', async () => {
    const failing = createExternalCliTransport({
      runner: async () => ({ status: 'error', text: '' }),
    });
    const empty = createExternalCliTransport({
      runner: async () => ({ status: 'ok', text: '   ' }),
    });
    const thrown = createExternalCliTransport({
      runner: async () => {
        throw new Error('spawn failure');
      },
    });

    expect(await failing(makeRequest())).toEqual({ status: 502, body: null });
    expect(await empty(makeRequest())).toEqual({ status: 502, body: null });
    expect(await thrown(makeRequest())).toEqual({ status: 502, body: null });
  });

  it('honors a custom engine resolver', async () => {
    const runner = vi.fn<CliRunner>(async () => ({ status: 'ok', text: 'ok' }));
    const transport = createExternalCliTransport({
      runner,
      resolveEngine: () => 'codex',
    });

    await transport(makeRequest({ providerId: 'anything' }));

    expect(runner).toHaveBeenCalledWith(expect.objectContaining({ engine: 'codex' }));
  });
});

describe('createChildProcessCliRunner', () => {
  const invocation = {
    engine: 'devin',
    model: 'gemini-3-7-flash-high',
    systemInstruction: 'SYS',
    userText: 'USER',
    signal: new AbortController().signal,
  } as const;

  it('appends the composed prompt as the final argument for a prompt-arg command', async () => {
    const spawnImpl = vi.fn<SpawnImpl>(async () => ({
      code: 0,
      stdout: 'OUT',
      stderr: '',
      timedOut: false,
    }));
    const runner = createChildProcessCliRunner({
      resolveCommand: () => ({ command: 'devin', args: ['-p', '--model', 'm'], input: 'prompt-arg' }),
      spawnImpl,
    });

    const result = await runner(invocation);

    expect(result).toEqual({ status: 'ok', text: 'OUT' });
    expect(spawnImpl).toHaveBeenCalledWith(
      expect.objectContaining({
        command: 'devin',
        args: ['-p', '--model', 'm', 'SYS\n\nUSER'],
        input: null,
      }),
    );
  });

  it('delivers the composed prompt on stdin for a stdin command', async () => {
    const spawnImpl = vi.fn<SpawnImpl>(async () => ({
      code: 0,
      stdout: 'OUT',
      stderr: '',
      timedOut: false,
    }));
    const runner = createChildProcessCliRunner({
      resolveCommand: () => ({ command: 'codex', args: ['exec'], input: 'stdin' }),
      spawnImpl,
    });

    await runner(invocation);

    expect(spawnImpl).toHaveBeenCalledWith(
      expect.objectContaining({ command: 'codex', args: ['exec'], input: 'SYS\n\nUSER' }),
    );
  });

  it('returns an error result when the engine is unknown', async () => {
    const spawnImpl = vi.fn<SpawnImpl>();
    const runner = createChildProcessCliRunner({ resolveCommand: () => null, spawnImpl });

    const result = await runner(invocation);

    expect(result).toEqual({ status: 'error', text: '' });
    expect(spawnImpl).not.toHaveBeenCalled();
  });

  it('returns an error result on a non-zero exit code or a timeout', async () => {
    const nonZero = createChildProcessCliRunner({
      resolveCommand: () => ({ command: 'devin', args: [], input: 'stdin' }),
      spawnImpl: async () => ({ code: 1, stdout: 'partial', stderr: 'boom', timedOut: false }),
    });
    const timedOut = createChildProcessCliRunner({
      resolveCommand: () => ({ command: 'devin', args: [], input: 'stdin' }),
      spawnImpl: async () => ({ code: null, stdout: '', stderr: '', timedOut: true }),
    });

    expect(await nonZero(invocation)).toEqual({ status: 'error', text: '' });
    expect(await timedOut(invocation)).toEqual({ status: 'error', text: '' });
  });

  it('returns an error result when the spawn boundary throws', async () => {
    const runner = createChildProcessCliRunner({
      resolveCommand: () => ({ command: 'devin', args: [], input: 'stdin' }),
      spawnImpl: async () => {
        throw new Error('spawn crash');
      },
    });

    expect(await runner(invocation)).toEqual({ status: 'error', text: '' });
  });
});

describe('defaultComposePrompt', () => {
  const base = {
    engine: 'devin',
    model: 'm',
    userText: 'USER',
    signal: new AbortController().signal,
  } as const;

  it('joins the system instruction and user text', () => {
    expect(defaultComposePrompt({ ...base, systemInstruction: 'SYS' })).toBe('SYS\n\nUSER');
  });

  it('returns only the user text when the system instruction is blank', () => {
    expect(defaultComposePrompt({ ...base, systemInstruction: '   ' })).toBe('USER');
  });
});

describe('defaultChildProcessSpawn (real subprocess)', () => {
  const isAlive = (pid: number): boolean => {
    try {
      process.kill(pid, 0);
      return true;
    } catch {
      return false;
    }
  };
  const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
  const request = (overrides: Partial<SpawnRequest>): SpawnRequest => ({
    command: '/bin/sh',
    args: [],
    env: {},
    input: null,
    signal: new AbortController().signal,
    timeoutMs: 5_000,
    ...overrides,
  });

  it.skipIf(process.platform === 'win32')(
    'captures stdout and closes stdin so a stdin reader reaches EOF',
    async () => {
      const outcome = await defaultChildProcessSpawn(
        request({ args: ['-c', 'cat; printf DONE'], input: 'HELLO' }),
      );

      expect(outcome.timedOut).toBe(false);
      expect(outcome.code).toBe(0);
      expect(outcome.stdout).toBe('HELLODONE');
    },
  );

  it.skipIf(process.platform === 'win32')(
    'kills the whole process group on timeout so a forked helper does not survive',
    async () => {
      const outcome = await defaultChildProcessSpawn(
        request({ args: ['-c', 'sleep 10 & echo $!; sleep 10'], timeoutMs: 400 }),
      );

      expect(outcome.timedOut).toBe(true);
      const helperPid = Number(outcome.stdout.trim());
      expect(Number.isInteger(helperPid)).toBe(true);
      await delay(300);
      expect(isAlive(helperPid)).toBe(false);
    },
  );

  it.skipIf(process.platform === 'win32')(
    'kills the whole process group on abort so a forked helper does not survive',
    async () => {
      const controller = new AbortController();
      const pending = defaultChildProcessSpawn(
        request({ args: ['-c', 'sleep 10 & echo $!; sleep 10'], signal: controller.signal }),
      );
      await delay(300);
      controller.abort();

      const outcome = await pending;
      const helperPid = Number(outcome.stdout.trim());
      expect(Number.isInteger(helperPid)).toBe(true);
      await delay(300);
      expect(isAlive(helperPid)).toBe(false);
    },
  );
});
