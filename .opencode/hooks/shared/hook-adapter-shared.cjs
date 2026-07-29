// ───────────────────────────────────────────────────────────────────
// MODULE: Shared CommonJS Hook Adapter Helpers
// ───────────────────────────────────────────────────────────────────
// Keeps stdin collection and fail-open JSON parsing byte-identical across
// every CommonJS runtime hook adapter under .opencode/hooks/. A
// second, independent ESM sibling lives at
// system-spec-kit/mcp-server/hooks/lib/hook-adapter-shared.mjs for that
// skill's own spec-gate-enforce.mjs adapters, which are not part of the
// fully-portable set -- keeping this copy local means every adapter under
// hooks/ has zero dependency outside this tree.

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
