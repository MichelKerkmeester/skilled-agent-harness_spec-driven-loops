// ───────────────────────────────────────────────────────────────────
// MODULE: Shared ESM Hook Adapter Helpers
// ───────────────────────────────────────────────────────────────────
// Keeps stdin collection and fail-open JSON parsing byte-identical across
// every ESM runtime hook adapter that previously repeated this boilerplate
// inline (Claude/Codex/Devin/Cursor spec-gate-enforce.mjs).

export async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

export function parseJsonFailOpen(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
