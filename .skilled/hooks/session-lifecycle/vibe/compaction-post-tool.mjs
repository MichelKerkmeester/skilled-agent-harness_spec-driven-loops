#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Compaction Post-Tool Binding
// ───────────────────────────────────────────────────────────────────
// A headless turn can compact in the middle of its work, where no next turn
// start follows, so the same detector runs after a tool call. The journal's
// size decides whether the detector reads it at all: an unchanged size returns
// nothing, and a grown journal gets the one injection the watermark allows. The
// binding also carries the hand-over nudge, so a long headless turn hears it
// mid-turn. The entry is non-strict, so a failure here never blanks the tool
// result the model needs. Malformed input prints nothing and exits 0.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildPostToolPart } from './compaction-context.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const IS_CLI_ENTRY = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;
const HANDOVER_PART_URL = new URL(
  '../../session-handover/vibe/handover-parts.mjs',
  import.meta.url,
).href;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

async function readStdin() {
  process.stdin.setEncoding('utf8');
  let text = '';
  for await (const chunk of process.stdin) text += chunk;
  return text;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const stdinText = await readStdin();

  let payload;
  try {
    payload = JSON.parse(stdinText);
  } catch {
    return;
  }

  const texts = [];
  try {
    const compaction = buildPostToolPart(payload);
    if (compaction) texts.push(compaction);
  } catch {
    // A failing part contributes nothing; the other part still lands.
  }
  try {
    // Imported here so a load error costs the hand-over text alone.
    const { buildHandoverContextPart } = await import(HANDOVER_PART_URL);
    const handover = await buildHandoverContextPart(payload);
    if (handover) texts.push(handover);
  } catch {
    // A failing part contributes nothing; the other part still lands.
  }

  const text = texts.join('\n\n');
  if (!text) return;

  process.exitCode = 0;
  process.stdout.write(`${JSON.stringify({ hook_specific_output: { additional_context: text } })}\n`);
}

if (IS_CLI_ENTRY) {
  main().catch(() => {
    process.exitCode = 0;
  });
}
