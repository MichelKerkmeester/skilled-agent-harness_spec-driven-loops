import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { handleMemorySearch } from '../../../../../../skills/system-spec-kit/mcp_server/handlers/memory-search.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_PATH = path.join(__dirname, 'end-to-end-smoke.md');

function parseResponseText(response: unknown): string {
  const content = (response as { content?: Array<{ text?: string }> }).content;
  return content?.[0]?.text ?? JSON.stringify(response, null, 2);
}

function safeJson(text: string): Record<string, unknown> | null {
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return null;
  }
}

const query = 'node llama cpp evaluation parity default flip Memory MCP';
const started = performance.now();
const response = await handleMemorySearch({
  query,
  intent: 'understand',
  limit: 5,
  includeContent: false,
  includeTrace: true,
  bypassCache: true,
  enableDedup: false,
});
const latencyMs = Number((performance.now() - started).toFixed(3));
const text = parseResponseText(response);
const json = safeJson(text);
const data = json?.data as Record<string, unknown> | undefined;
const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
const pass = results.length > 0 && results.some((row) => {
  const joined = JSON.stringify(row).toLowerCase();
  return joined.includes('llama') || joined.includes('embedding') || joined.includes('memory mcp') || joined.includes('default');
});

const lines = [
  '# End-to-end smoke',
  '',
  `Provider override: ${process.env.EMBEDDINGS_PROVIDER ?? 'unset'}`,
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
  '## Raw Response Shape',
  '',
  '```json',
  JSON.stringify({
    isError: (response as { isError?: boolean }).isError ?? false,
    topLevelKeys: json ? Object.keys(json) : [],
    dataKeys: data ? Object.keys(data) : [],
  }, null, 2),
  '```',
  '',
);

fs.writeFileSync(OUT_PATH, `${lines.join('\n')}\n`);
console.log(JSON.stringify({
  provider: process.env.EMBEDDINGS_PROVIDER ?? 'unset',
  query,
  latency_ms: latencyMs,
  result_count: results.length,
  pass,
}, null, 2));

if (!pass) {
  process.exitCode = 1;
}
