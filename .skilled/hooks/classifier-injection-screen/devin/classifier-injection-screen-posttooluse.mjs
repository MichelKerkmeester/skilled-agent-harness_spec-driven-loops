#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin PostToolUse Injection Screen
// ───────────────────────────────────────────────────────────────────
// PostToolUse(webfetch) injection screen for Devin CLI -- the Devin sibling of the
// Claude WebFetch screen.
//
// Fetched web text is untrusted input, and a page can try to issue orders to
// the agent that reads it. This adapter takes the text Devin just fetched,
// screens it with the measured question, and adds one advisory line naming how
// many sections read as instructions and where the strongest one sits.
//
// ADVISORY ONLY -- it never blocks, never denies and never exits non-zero; the
// fetch result reaches the model either way. FAILS OPEN -- a missing payload, a
// parse error, an absent jev CLI or a failed screen exits 0 with no output, so a
// bug here can never break a real fetch.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import process from 'node:process';
import { isHookEnabled } from '../../shared/hook-flags.mjs';
import { readStdin } from '../../shared/hook-adapter-shared.cjs';
import { fetchedText, screenAdvisory } from '../lib/classifier-injection-advisory.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function done() {
  // No output + exit 0 -> the fetch result reaches the model unchanged.
  process.exit(0);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  if (!isHookEnabled('injection-screen')) return done(); // kill-switch: full no-op

  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return done(); // no/invalid payload -> fail open
  }

  // Devin's hook payload names its fetch tool `webfetch` and carries the page
  // text in `tool_response.output`.
  if (payload?.tool_name !== 'webfetch') return done();

  const advisory = await screenAdvisory(fetchedText(payload?.tool_response), { env: process.env });
  if (advisory === null) return done();

  // The advisory must reach the runtime whole, so its write callback owns the
  // exit instead of racing process.exit against the flush.
  process.stdout.write(`${JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext: advisory,
    },
  })}\n`, () => process.exit(0));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => done());
