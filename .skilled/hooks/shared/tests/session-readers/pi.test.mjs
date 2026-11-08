// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Reader Tests
// ───────────────────────────────────────────────────────────────────
// A Pi session resolves from the live branch when it is the current session,
// and from disk only by an exact header id whose cwd is the caller's project.
// Separator flattening means a project-key collision is possible, so the cwd
// is part of the identity.

import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

import { capabilities, readSession } from '../../session-readers/index.mjs';
import { piProjectDirectory } from '../../session-readers/pi.mjs';
import { DECOY, piSession, SESSION, T0 } from './fixtures.mjs';
import { withTempAsync } from './helpers.mjs';

// The fixtures build store folders with the reader's own key helper, so this
// pins the helper to a folder name a real Pi install wrote.
test('the project folder name matches the one Pi writes', () => {
  assert.equal(
    piProjectDirectory('/Users/michelkerkmeester/MEGA/Development/Skilled'),
    '--Users-michelkerkmeester-MEGA-Development-Skilled--',
  );
});

test('an older session resolves by header id and matching cwd', async () => {
  await withTempAsync('pi-reader', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    const fixture = piSession({ root, projectDir });
    const result = await readSession({ runtime: 'pi', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, true);
    assert.equal(result.source.locatorKind, capabilities.pi.locatorKind);
    assert.equal(result.source.mode, 'disk');
    assert.deepEqual(result.items.map((item) => item.role), ['user', 'assistant', 'toolResult', 'assistant']);
    assert.equal(result.items[2].toolCallId, 'pi-call-1');
  });
});

test('the current session resolves from the live branch without a disk read', async () => {
  const branch = [
    { type: 'message', id: 'live-u1', timestamp: '2026-11-07T12:00:00.000Z', message: { role: 'user', content: [{ type: 'text', text: 'Hello.' }] } },
    { type: 'message', id: 'live-a1', timestamp: '2026-11-07T12:00:01.000Z', message: { role: 'assistant', content: [{ type: 'text', text: 'Hi.' }] } },
  ];
  const sessionManager = {
    getSessionId: () => SESSION,
    getBranch: () => branch,
    getSessionFile: () => '/live/session.jsonl',
  };
  const result = await readSession({ runtime: 'pi', sessionId: SESSION, sessionManager });
  assert.equal(result.ok, true);
  assert.equal(result.source.locatorKind, capabilities.pi.locatorKind);
  assert.equal(result.source.mode, 'live');
  assert.equal(result.items.length, 2);
});

test('a project-key collision is rejected by the header cwd', async () => {
  await withTempAsync('pi-collision', async (root) => {
    const projectDir = join(root, 'a', 'b');
    const otherDir = join(root, 'a-b');
    mkdirSync(projectDir, { recursive: true });
    mkdirSync(otherDir, { recursive: true });

    const fixture = piSession({ root, projectDir, headerCwd: otherDir });
    const result = await readSession({ runtime: 'pi', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'session_mismatch');
  });
});

test('two session files with one id are refused as session_ambiguous', async () => {
  await withTempAsync('pi-ambiguous', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    const fixture = piSession({ root, projectDir });
    piSession({ root, projectDir, createdAt: T0 - 1000 });
    const result = await readSession({ runtime: 'pi', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'session_ambiguous');
  });
});

test('an absent id is a session_not_found even when a newer session exists', async () => {
  await withTempAsync('pi-absent', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    piSession({ root, projectDir, sessionId: DECOY });
    const piRoot = join(root, 'pi', 'sessions');
    const result = await readSession({ runtime: 'pi', sessionId: SESSION, piRoot, projectDir });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'session_not_found');
  });
});

test('a missing store is a store_unreadable', async () => {
  await withTempAsync('pi-unreadable', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    const result = await readSession({
      runtime: 'pi',
      sessionId: SESSION,
      piRoot: join(root, 'missing-pi-store'),
      projectDir,
    });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'store_unreadable');
  });
});
