// ───────────────────────────────────────────────────────────────────
// MODULE: Shared CommonJS Hook Adapter Helpers
// ───────────────────────────────────────────────────────────────────
// Keeps stdin collection and fail-open JSON parsing byte-identical across
// every CommonJS runtime hook adapter that previously repeated this
// boilerplate inline (task-dispatch-guard.cjs, mcp-route-guard.cjs).

'use strict';

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function parseJsonFailOpen(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

module.exports = { readStdin, parseJsonFailOpen };
