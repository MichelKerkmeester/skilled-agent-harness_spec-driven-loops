// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Session Start Part Tests (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Covers the session-prime, startup-guard and dist parts of the session_start
// hook through injected runners, so no case spawns the real session-prime,
// session-cleanup or dist checker. The goal part and the spawned hook are
// covered by goal-vibe.test.mjs.

import assert from 'node:assert/strict';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { distFreshnessPart, sessionContextPart, startupGuardsPart } from './session-start.mjs';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');

// The shared session-cleanup plugin bounds each startup guard at 8000 ms and
// gives it 250 ms to die, so the outer spawn must wait longer than that.
const INNER_GUARD_BUDGET_MS = 8_250;

test('the session-prime part runs against the checkout with the payload session and source', () => {
  const calls = [];
  const text = sessionContextPart(
    { session_id: 'vibe-session-1', source: 'resume' },
    {
      run: (script, options) => { calls.push({ script, options }); return 'primed context'; },
      enabled: () => true,
    },
  );

  assert.equal(text, 'primed context');
  assert.equal(calls.length, 1);
  assert.match(calls[0].script, /session-prime\.js$/);
  assert.deepEqual(JSON.parse(calls[0].options.input), {
    session_id: 'vibe-session-1',
    cwd: REPO_ROOT,
    source: 'resume',
  });
});

test('the session-prime part defaults the source and stays silent when switched off', () => {
  let input = null;
  sessionContextPart({}, { run: (_, options) => { input = JSON.parse(options.input); return ''; }, enabled: () => true });
  assert.equal(input.source, 'startup');
  assert.equal(input.session_id, '');

  const text = sessionContextPart({ session_id: 's' }, {
    run: () => { throw new Error('a switched-off part must not run'); },
    enabled: () => false,
  });
  assert.equal(text, '');
});

test('the startup-guard part returns the warnings and outlasts the inner guard budget', () => {
  const calls = [];
  const reply = JSON.stringify({ hook_specific_output: { additional_context: 'guard warning' } });
  const text = startupGuardsPart('{"hook_event_name":"session_start"}', {
    run: (script, options) => { calls.push({ script, options }); return `${reply}\n`; },
  });

  assert.equal(text, 'guard warning');
  assert.match(calls[0].script, /session-cleanup\.mjs$/);
  assert.equal(calls[0].options.input, '{"hook_event_name":"session_start"}');
  assert.ok(
    calls[0].options.timeout > INNER_GUARD_BUDGET_MS,
    `outer budget ${calls[0].options.timeout} ms must exceed ${INNER_GUARD_BUDGET_MS} ms`,
  );
});

test('the startup-guard part is empty when the guards print nothing or no context', () => {
  assert.equal(startupGuardsPart('{}', { run: () => '' }), '');
  assert.equal(startupGuardsPart('{}', { run: () => '{"hook_specific_output":{}}' }), '');
});

test('the dist part returns the checker output and stays silent when switched off', () => {
  let timeout = null;
  const text = distFreshnessPart({
    run: (options) => { timeout = options.timeout; return 'STALE DIST WARNING'; },
    enabled: () => true,
  });
  assert.equal(text, 'STALE DIST WARNING');
  assert.ok(timeout > 0);

  assert.equal(distFreshnessPart({
    run: () => { throw new Error('a switched-off part must not run'); },
    enabled: () => false,
  }), '');
});
