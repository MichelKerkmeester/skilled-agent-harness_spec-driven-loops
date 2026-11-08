// ───────────────────────────────────────────────────────────────────
// MODULE: Cursor Capability Gate Tests
// ───────────────────────────────────────────────────────────────────
// Cursor has no confirmed capture point, so the read is gated before the store
// is touched. The switch is read through the shared flag resolver, which means
// the environment and the operator config file both work.

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { capabilities, readSession } from '../../session-readers/index.mjs';
import { SESSION } from './fixtures.mjs';
import { trackFileOpens } from './helpers.mjs';

test('the capability table marks Cursor gated with a reason', () => {
  assert.equal(capabilities.cursor.status, 'gated');
  assert.equal(typeof capabilities.cursor.reason, 'string');
  assert.deepEqual(
    Object.keys(capabilities),
    ['claude', 'codex', 'pi', 'opencode', 'devin', 'dsh', 'cursor'],
  );
});

test('an unset switch returns capability_gated before any file read', async () => {
  const tracker = trackFileOpens();
  try {
    const result = await readSession({
      runtime: 'cursor',
      sessionId: SESSION,
      env: {},
      config: {},
    });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'capability_gated');
    assert.deepEqual(tracker.opened, []);
  } finally {
    tracker.restore();
  }
});

test('an enabled switch passes the gate but has no reader until delivery is proven', async () => {
  const result = await readSession({
    runtime: 'cursor',
    sessionId: SESSION,
    env: { SYSTEM_SESSION_READERS_CURSOR_ENABLED: '1' },
    config: {},
  });
  assert.equal(result.ok, false);
  assert.equal(result.code, 'locator_unavailable');
});

test('the operator config file can enable the switch when the environment is silent', async () => {
  const result = await readSession({
    runtime: 'cursor',
    sessionId: SESSION,
    env: {},
    config: { SYSTEM_SESSION_READERS_CURSOR_ENABLED: 'yes' },
  });
  assert.equal(result.ok, false);
  assert.equal(result.code, 'locator_unavailable');
});
