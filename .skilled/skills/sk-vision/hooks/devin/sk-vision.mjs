#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin Vision Injection Hook
// ───────────────────────────────────────────────────────────────────
// Devin registers project hooks in `.devin/hooks.v1.json` and delivers the
// payload on stdin. `UserPromptSubmit` accepts `additionalContext` in the
// `hookSpecificOutput` envelope, so a prompt naming an image can carry its
// own analysis into the same turn.
//
// This exists because Devin has no in-process plugin API and no command
// surface. Injecting the evidence is strictly stronger than instructing the
// model to go fetch it: the model cannot decline a block that is already in
// its context, and a text-only model has no other way to see the image.
//
// Every path fails open. A malformed payload, a disabled kill-switch, a
// prompt naming no image, or any runtime error all resolve to an empty
// object: never a block, never an error surfaced into the session. A vision
// helper that can break a turn is worse than one that stays quiet.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';

const require = createRequire(import.meta.url);
const { isHookEnabled } = require('../../../../hooks/shared/hook-flags.cjs');

const HERE = dirname(fileURLToPath(import.meta.url));
const EVIDENCE_ENTRY = resolve(HERE, '../../vision-runtime/dist/prompt-evidence.js');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function emit(payload) {
  process.stdout.write(JSON.stringify(payload));
  process.exit(0);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

/**
 * The evidence core ships as a build artifact, and `dist/` is gitignored, so a
 * fresh checkout reaches this hook before anything has been built. Resolving
 * lazily keeps that case a silent no-op instead of a stack trace every turn.
 */
async function loadEvidence() {
  if (!existsSync(EVIDENCE_ENTRY)) return null;
  const mod = await import(pathToFileURL(EVIDENCE_ENTRY).href);
  return typeof mod.evidenceForPrompt === 'function' ? mod.evidenceForPrompt : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return emit({});
  }

  if (!isHookEnabled('sk-vision')) return emit({});

  const prompt = typeof payload?.prompt === 'string' ? payload.prompt : '';
  if (!prompt) return emit({});

  const rawCwd = payload?.cwd ?? process.env.DEVIN_PROJECT_DIR;
  const cwd = typeof rawCwd === 'string' && rawCwd.trim() ? rawCwd : process.cwd();
  const eventName = typeof payload?.hook_event_name === 'string' && payload.hook_event_name
    ? payload.hook_event_name
    : 'UserPromptSubmit';

  try {
    const evidenceForPrompt = await loadEvidence();
    if (!evidenceForPrompt) return emit({});
    const block = await evidenceForPrompt(prompt, cwd);
    if (!block) return emit({});
    return emit({
      hookSpecificOutput: {
        hookEventName: eventName,
        additionalContext: block,
      },
    });
  } catch {
    return emit({});
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => emit({}));
