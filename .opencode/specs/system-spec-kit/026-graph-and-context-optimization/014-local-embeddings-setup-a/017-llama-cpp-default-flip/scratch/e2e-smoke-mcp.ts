import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_PATH = path.join(__dirname, 'end-to-end-smoke.md');
const query = 'node llama cpp evaluation parity default flip Memory MCP';

interface JsonRpcResponse {
  id?: number;
  result?: unknown;
  error?: unknown;
}

function waitForResponse(
  responses: JsonRpcResponse[],
  id: number,
  timeoutMs: number,
): Promise<JsonRpcResponse> {
  const existing = responses.find((response) => response.id === id);
  if (existing) {
    return Promise.resolve(existing);
  }
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const interval = setInterval(() => {
      const response = responses.find((candidate) => candidate.id === id);
      if (response) {
        clearInterval(interval);
        resolve(response);
        return;
      }
      if (Date.now() - started > timeoutMs) {
        clearInterval(interval);
        reject(new Error(`Timed out waiting for JSON-RPC response id ${id}`));
      }
    }, 25);
  });
}

function parseResultText(callResult: unknown): string {
  const content = (callResult as { content?: Array<{ text?: string }> }).content;
  return content?.[0]?.text ?? JSON.stringify(callResult, null, 2);
}

function parseResults(text: string): Array<Record<string, unknown>> {
  const envelope = JSON.parse(text) as Record<string, unknown>;
  const data = envelope.data as Record<string, unknown> | undefined;
  return Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
}

function resultLooksRelevant(row: Record<string, unknown>): boolean {
  const haystack = JSON.stringify(row).toLowerCase();
  return haystack.includes('llama') ||
    haystack.includes('embedding') ||
    haystack.includes('memory mcp') ||
    haystack.includes('node-llama-cpp');
}

const child = spawn('node', ['.opencode/bin/spec-kit-memory-launcher.cjs'], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    EMBEDDINGS_PROVIDER: 'llama-cpp',
  },
  stdio: ['pipe', 'pipe', 'pipe'],
});

const responses: JsonRpcResponse[] = [];
let stdoutBuffer = '';
let stderrBuffer = '';

child.stdout.setEncoding('utf8');
child.stdout.on('data', (chunk: string) => {
  stdoutBuffer += chunk;
  let newlineIndex = stdoutBuffer.indexOf('\n');
  while (newlineIndex >= 0) {
    const line = stdoutBuffer.slice(0, newlineIndex).trim();
    stdoutBuffer = stdoutBuffer.slice(newlineIndex + 1);
    if (line.startsWith('{')) {
      try {
        responses.push(JSON.parse(line) as JsonRpcResponse);
      } catch {
        // Non-JSON logs on stdout are ignored.
      }
    }
    newlineIndex = stdoutBuffer.indexOf('\n');
  }
});

child.stderr.setEncoding('utf8');
child.stderr.on('data', (chunk: string) => {
  stderrBuffer += chunk;
});

function send(payload: Record<string, unknown>): void {
  child.stdin.write(`${JSON.stringify(payload)}\n`);
}

try {
  send({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: '017-smoke',
        version: '1.0.0',
      },
    },
  });
  const initResponse = await waitForResponse(responses, 1, 30000);
  if (initResponse.error) {
    throw new Error(`initialize failed: ${JSON.stringify(initResponse.error)}`);
  }

  send({
    jsonrpc: '2.0',
    method: 'notifications/initialized',
    params: {},
  });

  const started = performance.now();
  send({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'memory_search',
      arguments: {
        query,
        intent: 'understand',
        limit: 5,
        includeContent: false,
        includeTrace: true,
        bypassCache: true,
        enableDedup: false,
      },
    },
  });
  const callResponse = await waitForResponse(responses, 2, 60000);
  const latencyMs = Number((performance.now() - started).toFixed(3));
  if (callResponse.error) {
    throw new Error(`memory_search failed: ${JSON.stringify(callResponse.error)}`);
  }

  const text = parseResultText(callResponse.result);
  const results = parseResults(text);
  const pass = results.length > 0 && results.some(resultLooksRelevant);

  const lines = [
    '# End-to-end smoke',
    '',
    'Path: JSON-RPC stdio call to `.opencode/bin/spec-kit-memory-launcher.cjs`',
    'Provider override: llama-cpp',
    `Query: ${query}`,
    `Latency: ${latencyMs}ms`,
    `Result count: ${results.length}`,
    `Smoke result: ${pass ? 'PASS' : 'FAIL'}`,
    '',
    '## Top Results',
    '',
  ];

  for (const [index, row] of results.slice(0, 5).entries()) {
    lines.push(
      `### ${index + 1}`,
      '',
      `ID: ${String(row.id ?? row.memoryId ?? row.memory_id ?? 'unknown')}`,
      `Title: ${String(row.title ?? 'untitled')}`,
      `Spec folder: ${String(row.specFolder ?? row.spec_folder ?? 'unknown')}`,
      `Score: ${String(row.score ?? row.finalScore ?? 'unknown')}`,
      '',
    );
  }

  lines.push(
    '## Runtime Notes',
    '',
    '```text',
    stderrBuffer.trim().split('\n').slice(-30).join('\n'),
    '```',
    '',
  );

  fs.writeFileSync(OUT_PATH, `${lines.join('\n')}\n`);
  console.log(JSON.stringify({
    provider: 'llama-cpp',
    query,
    latency_ms: latencyMs,
    result_count: results.length,
    pass,
  }, null, 2));

  if (!pass) {
    process.exitCode = 1;
  }
} finally {
  child.kill('SIGTERM');
}
