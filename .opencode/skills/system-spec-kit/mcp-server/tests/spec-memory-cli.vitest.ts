import { mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import net from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { StringDecoder } from 'node:string_decoder';

import { afterEach, describe, expect, it } from 'vitest';

import { TOOL_DEFINITIONS } from '../tool-schemas.js';
import { __testing, parseCliArgs, runSpecMemoryCli } from '../spec-memory-cli.js';

interface CapturedIo {
  readonly stdout: { write: (chunk: string) => boolean };
  readonly stderr: { write: (chunk: string) => boolean };
  readonly output: () => { stdout: string; stderr: string };
}

interface FakeDaemonOptions {
  readonly toolPayload?: unknown;
  readonly toolError?: { readonly code: number; readonly message: string };
  readonly protocolVersion?: string;
}

const tempDirs: string[] = [];
const originalSocketDir = process.env.SPECKIT_IPC_SOCKET_DIR;

function captureIo(): CapturedIo {
  let stdout = '';
  let stderr = '';
  return {
    stdout: {
      write(chunk: string): boolean {
        stdout += chunk;
        return true;
      },
    },
    stderr: {
      write(chunk: string): boolean {
        stderr += chunk;
        return true;
      },
    },
    output: () => ({ stdout, stderr }),
  };
}

function createSocketDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'spec-memory-cli-'));
  tempDirs.push(dir);
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  process.env.SPECKIT_IPC_SOCKET_DIR = dir;
  return dir;
}

async function startFakeDaemon(socketDir: string, options: FakeDaemonOptions = {}): Promise<{
  readonly server: net.Server;
  readonly socketPath: string;
  readonly calls: Array<Record<string, unknown>>;
}> {
  const socketPath = join(socketDir, 'daemon-ipc.sock');
  const calls: Array<Record<string, unknown>> = [];
  const server = net.createServer((socket) => {
    let buffer = '';
    const decoder = new StringDecoder('utf8');
    socket.on('data', (chunk) => {
      buffer += Buffer.isBuffer(chunk) ? decoder.write(chunk) : String(chunk ?? '');
      let newlineIndex = buffer.indexOf('\n');
      while (newlineIndex !== -1) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);
        newlineIndex = buffer.indexOf('\n');
        if (!line) continue;
        const request = JSON.parse(line) as Record<string, unknown>;
        calls.push(request);
        if (!Object.prototype.hasOwnProperty.call(request, 'id')) continue;
        const id = request.id;
        if (request.method === 'initialize') {
          socket.write(`${JSON.stringify({
            jsonrpc: '2.0',
            id,
            result: {
              protocolVersion: options.protocolVersion ?? '2025-06-18',
              capabilities: {},
              serverInfo: { name: 'fake-mk-spec-memory', version: '0.0.0' },
            },
          })}\n`);
          continue;
        }
        if (request.method === 'tools/call') {
          if (options.toolError) {
            socket.write(`${JSON.stringify({ jsonrpc: '2.0', id, error: options.toolError })}\n`);
            continue;
          }
          socket.write(`${JSON.stringify({
            jsonrpc: '2.0',
            id,
            result: {
              content: [{ type: 'text', text: JSON.stringify(options.toolPayload ?? { status: 'ok', summary: 'fake ok' }) }],
            },
          })}\n`);
        }
      }
    });
  });

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(socketPath, () => {
      server.off('error', reject);
      resolve();
    });
  });
  return { server, socketPath, calls };
}

async function closeServer(server: net.Server): Promise<void> {
  await new Promise<void>((resolve) => server.close(() => resolve()));
}

afterEach(() => {
  if (originalSocketDir === undefined) {
    delete process.env.SPECKIT_IPC_SOCKET_DIR;
  } else {
    process.env.SPECKIT_IPC_SOCKET_DIR = originalSocketDir;
  }
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('spec-memory daemon-backed CLI', () => {
  it('lists the canonical tool surface from TOOL_DEFINITIONS', async () => {
    const io = captureIo();

    const exitCode = await runSpecMemoryCli(['list-tools', '--format', 'json'], io);

    const parsed = JSON.parse(io.output().stdout) as { data: { count: number; tools: Array<{ name: string }> } };
    expect(exitCode).toBe(0);
    expect(parsed.data.count).toBe(TOOL_DEFINITIONS.length);
    expect(parsed.data.tools.map((tool) => tool.name)).toContain('memory_stats');
  });

  it('parses kebab flags against the selected tool schema', () => {
    const parsed = parseCliArgs([
      'memory_search',
      '--query',
      'gold query battery',
      '--include-content',
      '--limit',
      '3',
      '--session-id',
      'cli-session',
    ]);

    expect(parsed.command).toBe('memory_search');
    expect(parsed.sessionId).toBe('cli-session');
    expect(parsed.args).toMatchObject({
      query: 'gold query battery',
      includeContent: true,
      limit: '3',
    });
  });

  it('calls a live daemon over the IPC socket', async () => {
    const socketDir = createSocketDir();
    const daemon = await startFakeDaemon(socketDir, {
      toolPayload: { status: 'ok', summary: 'stats ok', data: { total: 1 } },
    });
    const io = captureIo();

    try {
      const exitCode = await runSpecMemoryCli(['memory_stats', '--format', 'json', '--timeout-ms', '1000'], io);
      const parsed = JSON.parse(io.output().stdout) as { status: string; summary: string };

      expect(exitCode).toBe(0);
      expect(parsed.status).toBe('ok');
      expect(parsed.summary).toBe('stats ok');
      expect(daemon.calls.some((call) => {
        const params = call.params as { name?: string } | undefined;
        return call.method === 'tools/call' && params?.name === 'memory_stats';
      })).toBe(true);
    } finally {
      await closeServer(daemon.server);
    }
  });

  it('renders memory_search text output with one minimal row per result and an omission notice', async () => {
    const socketDir = createSocketDir();
    const daemon = await startFakeDaemon(socketDir, {
      toolPayload: {
        summary: 'Found 2 memories',
        data: {
          results: [
            { title: 'Alpha', filePath: 'specs/a/spec.md', score: 0.91 },
            { title: 'Beta', file_path: 'specs/b/plan.md', similarity: 0.82 },
          ],
          graphContribution: { totalDelta: 1 },
        },
        meta: { tool: 'memory_search', tokenCount: 100, cacheHit: false },
      },
    });
    const io = captureIo();

    try {
      const exitCode = await runSpecMemoryCli([
        'memory_search',
        '--json',
        '{"query":"alpha"}',
        '--format',
        'text',
        '--timeout-ms',
        '1000',
      ], io);
      const output = io.output().stdout;

      expect(exitCode).toBe(0);
      expect(output).toContain('1. Alpha | specs/a/spec.md | score 0.910');
      expect(output).toContain('2. Beta | specs/b/plan.md | score 0.820');
      expect(output).toContain('detailed telemetry, routing blocks, snippets, and metadata are omitted');
    } finally {
      await closeServer(daemon.server);
    }
  });

  it('maps retryable backend JSON-RPC errors to exit 75', async () => {
    const socketDir = createSocketDir();
    const daemon = await startFakeDaemon(socketDir, {
      toolError: { code: -32001, message: 'backend recycled; retry' },
    });
    const io = captureIo();

    try {
      const exitCode = await runSpecMemoryCli(['memory_stats', '--format', 'json', '--timeout-ms', '1000'], io);
      const parsed = JSON.parse(io.output().stderr) as { exitCode: number; error: string };

      expect(exitCode).toBe(__testing.EXIT_RETRYABLE);
      expect(parsed.exitCode).toBe(__testing.EXIT_RETRYABLE);
      expect(parsed.error).toContain('backend recycled');
    } finally {
      await closeServer(daemon.server);
    }
  });

  it('exits 1 when the daemon returns a status:error payload inside a success envelope', async () => {
    const socketDir = createSocketDir();
    const daemon = await startFakeDaemon(socketDir, {
      toolPayload: { status: 'error', error: 'memory operation failed' },
    });
    const io = captureIo();

    try {
      const exitCode = await runSpecMemoryCli(['memory_stats', '--format', 'json', '--timeout-ms', '1000'], io);
      const parsed = JSON.parse(io.output().stdout) as { status: string };

      expect(exitCode).toBe(__testing.EXIT_RUNTIME);
      expect(parsed.status).toBe('error');
    } finally {
      await closeServer(daemon.server);
    }
  });

  it('still exits 0 on a status:ok payload', async () => {
    const socketDir = createSocketDir();
    const daemon = await startFakeDaemon(socketDir, {
      toolPayload: { status: 'ok', summary: 'all good' },
    });
    const io = captureIo();

    try {
      const exitCode = await runSpecMemoryCli(['memory_stats', '--format', 'json', '--timeout-ms', '1000'], io);
      expect(exitCode).toBe(0);
    } finally {
      await closeServer(daemon.server);
    }
  });

  it('fails closed on protocol-version drift', async () => {
    const socketDir = createSocketDir();
    const daemon = await startFakeDaemon(socketDir, {
      protocolVersion: '2099-01-01',
    });
    const io = captureIo();

    try {
      const exitCode = await runSpecMemoryCli(['memory_stats', '--format', 'json', '--timeout-ms', '1000'], io);
      const parsed = JSON.parse(io.output().stderr) as { exitCode: number; error: string };

      expect(exitCode).toBe(__testing.EXIT_PROTOCOL);
      expect(parsed.exitCode).toBe(__testing.EXIT_PROTOCOL);
      expect(parsed.error).toContain('protocol version');
    } finally {
      await closeServer(daemon.server);
    }
  });
});
