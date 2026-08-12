#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Directive Lifecycle Negative Controls
// ───────────────────────────────────────────────────────────────

import {
  mkdtempSync,
  readdirSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const moduleUrl = pathToFileURL(join(
  process.cwd(),
  '.opencode/skills/system-skill-advisor/mcp-server/dist/hooks/lib/directive-lifecycle.js',
)).href;
const lifecycle = await import(moduleUrl);

const HEAD = 'Advisor: live; use sk-code 0.91/0.23 pass.';
const DIRECTIVES = '\nDirectives:\n- Comment hygiene\n- Governor\n- Proof over appearance';
const FULL = `${HEAD}${DIRECTIVES}`;

function deliverySequence(sizes) {
  const state = new lifecycle.InMemoryDirectiveLifecycleStore();
  return sizes.map((transcriptBytes) => lifecycle.decideDirectiveLifecycleDelivery(FULL, {
    state,
    sessionId: 's1',
    sessionConfirmed: true,
    transcriptPath: transcriptBytes === null ? null : '/sessions/s1.jsonl',
    transcriptBytes,
  }).suppressed ? 'route-only' : 'full');
}

function generationSequence() {
  const state = new lifecycle.InMemoryDirectiveLifecycleStore();
  const first = lifecycle.decideDirectiveLifecycleDelivery(FULL, {
    state,
    sessionId: 's1',
    sessionConfirmed: true,
    transcriptPath: '/sessions/s1.jsonl',
    transcriptBytes: 100,
  });
  const repeat = lifecycle.decideDirectiveLifecycleDelivery(FULL, {
    state,
    sessionId: 's1',
    sessionConfirmed: true,
    transcriptPath: '/sessions/s1.jsonl',
    transcriptBytes: 200,
  });
  if (typeof state.advanceGeneration !== 'function') {
    return [first.suppressed, repeat.suppressed, 'missing-generation-api'];
  }
  state.advanceGeneration();
  const afterReset = lifecycle.decideDirectiveLifecycleDelivery(FULL, {
    state,
    sessionId: 's1',
    sessionConfirmed: true,
    transcriptPath: '/sessions/s1.jsonl',
    transcriptBytes: 300,
  });
  return [first.suppressed, repeat.suppressed, afterReset.suppressed];
}

function symlinkEscapeCreated() {
  const base = mkdtempSync(join(tmpdir(), 'directive-store-base-'));
  const outside = mkdtempSync(join(tmpdir(), 'directive-store-outside-'));
  try {
    symlinkSync(outside, join(base, 'directive-lifecycle'), 'dir');
    const store = new lifecycle.FileDirectiveLifecycleStore({ baseDir: base });
    store.set('s1', {
      directives: DIRECTIVES,
      transcriptPath: '/sessions/s1.jsonl',
      transcriptBytes: 100,
    });
    return readdirSync(outside, { recursive: true }).some((entry) => String(entry).endsWith('.json'));
  } finally {
    rmSync(base, { recursive: true, force: true });
    rmSync(outside, { recursive: true, force: true });
  }
}

const observed = {
  growthThenShrink: deliverySequence([5_000, 10_000, 7_000]),
  unknownStats: deliverySequence([null, null]),
  knownThenMissingPath: (() => {
    const state = new lifecycle.InMemoryDirectiveLifecycleStore();
    const first = lifecycle.decideDirectiveLifecycleDelivery(FULL, {
      state,
      sessionId: 's1',
      sessionConfirmed: true,
      transcriptPath: '/sessions/s1.jsonl',
      transcriptBytes: 100,
    });
    const second = lifecycle.decideDirectiveLifecycleDelivery(FULL, {
      state,
      sessionId: 's1',
      sessionConfirmed: true,
      transcriptPath: null,
      transcriptBytes: null,
    });
    return [first.suppressed ? 'route-only' : 'full', second.suppressed ? 'route-only' : 'full'];
  })(),
  generationReset: generationSequence(),
  symlinkEscapeCreated: symlinkEscapeCreated(),
};

const expected = {
  growthThenShrink: ['full', 'route-only', 'full'],
  unknownStats: ['full', 'full'],
  knownThenMissingPath: ['full', 'full'],
  generationReset: [false, true, false],
  symlinkEscapeCreated: false,
};

const checks = Object.fromEntries(Object.keys(expected).map((key) => [
  key,
  JSON.stringify(observed[key]) === JSON.stringify(expected[key]),
]));
const passed = Object.values(checks).every(Boolean);
process.stdout.write(`${JSON.stringify({ expected, observed, checks, passed }, null, 2)}\n`);
process.exit(passed ? 0 : 1);
