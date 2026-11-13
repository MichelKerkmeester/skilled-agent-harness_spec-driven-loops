// ───────────────────────────────────────────────────────────────────
// MODULE: Claude Reader Tests
// ───────────────────────────────────────────────────────────────────
// The parent transcript is the session the hook payload names. A subagent
// transcript is a child conversation under the same project, so it is refused
// rather than reported as the parent.

import assert from 'node:assert/strict';
import { appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

import { readSession } from '../../session-readers/index.mjs';
import { loadClaudeSession } from '../../session-readers/claude.mjs';
import { claudeSession, DECOY, NOW, SESSION } from './fixtures.mjs';
import { trackFileOpens, withTemp, withTempAsync, writeJsonl } from './helpers.mjs';

const BRIEF = 'Advisor: live; use sk-doc → /create:readme (start) 0.82/0.12 pass.';

test('a parent transcript resolves by its recorded session id', () => {
  withTemp('claude-reader', (root) => {
    const fixture = claudeSession({ root });
    return readSession({ runtime: 'claude', sessionId: SESSION, ...fixture.options }).then((result) => {
      assert.equal(result.ok, true);
      assert.equal(result.source.runtime, 'claude');
      assert.equal(result.source.locatorKind, 'transcript_path');
      assert.deepEqual(result.items.map((item) => item.role), ['user', 'assistant', 'toolResult', 'assistant']);
      assert.equal(result.items[2].toolCallId, 'claude-call-1');
    });
  });
});

test('a user message that carries text and a tool result keeps both entries', async () => {
  await withTempAsync('claude-mixed', async (root) => {
    const fixture = claudeSession({ root, resultText: 'Stop, use the other file.' });
    const result = await readSession({ runtime: 'claude', sessionId: SESSION, ...fixture.options });

    assert.equal(result.ok, true);
    assert.deepEqual(result.items.map((item) => item.role), ['user', 'assistant', 'toolResult', 'user', 'assistant']);

    const correction = result.items.find((item) => item.id === 'claude-u2');
    assert.equal(correction?.content[0]?.text, 'Stop, use the other file.');

    const toolResult = result.items.find((item) => item.role === 'toolResult');
    assert.equal(toolResult?.content[0]?.text, 'file contents');
    assert.notEqual(toolResult.id, correction.id);
  });
});

test('a transcript outside the store is refused without reading it', async () => {
  await withTempAsync('claude-outside', async (root) => {
    const fixture = claudeSession({ root });
    const outside = writeJsonl(join(root, 'outside-claude.jsonl'), [
      {
        type: 'user',
        uuid: 'outside-u1',
        sessionId: SESSION,
        timestamp: NOW,
        message: { role: 'user', content: [{ type: 'text', text: 'outside the store' }] },
      },
    ]);

    const tracker = trackFileOpens();
    try {
      const result = await readSession({
        runtime: 'claude',
        sessionId: SESSION,
        claudeRoot: fixture.root,
        transcriptPath: outside,
      });
      assert.equal(result.ok, false);
      assert.equal(result.code, 'session_mismatch');
      assert.equal(tracker.opened.includes(outside), false, 'the outside path was opened before the refusal');
    } finally {
      tracker.restore();
    }
  });
});

test('a subagent transcript is refused as the parent session', () => {
  withTemp('claude-subagent', (root) => {
    const fixture = claudeSession({ root, subagents: true });
    return readSession({ runtime: 'claude', sessionId: SESSION, ...fixture.options }).then((result) => {
      assert.equal(result.ok, false);
      assert.equal(result.code, 'session_mismatch');
    });
  });
});

test('a transcript that declares another session is a session_mismatch', () => {
  withTemp('claude-mismatch', (root) => {
    const fixture = claudeSession({ root, headerId: DECOY });
    return readSession({ runtime: 'claude', sessionId: SESSION, ...fixture.options }).then((result) => {
      assert.equal(result.ok, false);
      assert.equal(result.code, 'session_mismatch');
    });
  });
});

test('a missing transcript_path is a locator_unavailable', async () => {
  const result = await readSession({ runtime: 'claude', sessionId: SESSION });
  assert.equal(result.ok, false);
  assert.equal(result.code, 'locator_unavailable');
});

test('an absent transcript is a session_not_found when the store is present', () => {
  withTemp('claude-absent', (root) => {
    const fixture = claudeSession({ root });
    const missing = join(fixture.root, SESSION, 'not-written-yet.jsonl');
    return readSession({
      runtime: 'claude',
      sessionId: SESSION,
      claudeRoot: fixture.root,
      transcriptPath: missing,
    }).then((result) => {
      assert.equal(result.ok, false);
      assert.equal(result.code, 'session_not_found');
    });
  });
});

test('an unreadable store is reported without throwing', () => {
  withTemp('claude-unreadable', (root) => {
    return readSession({
      runtime: 'claude',
      sessionId: SESSION,
      claudeRoot: join(root, 'missing-store'),
      transcriptPath: join(root, 'missing-store', `${SESSION}.jsonl`),
    }).then((result) => {
      assert.equal(result.ok, false);
      assert.equal(result.code, 'store_unreadable');
    });
  });
});

test('a local command report stays out of the history and the typed command stays in', async () => {
  await withTempAsync('claude-local-command', async (root) => {
    const fixture = claudeSession({ root });
    appendFileSync(fixture.filePath, [
      { type: 'user', uuid: 'claude-cmd', sessionId: SESSION, timestamp: NOW, message: { role: 'user', content: '<command-name>/compact</command-name>' } },
      { type: 'user', uuid: 'claude-out', sessionId: SESSION, timestamp: NOW, message: { role: 'user', content: '<local-command-stdout>Compacted PreCompact hook completed</local-command-stdout>' } },
    ].map((entry) => `${JSON.stringify(entry)}\n`).join(''));

    const result = await readSession({ runtime: 'claude', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, true);
    const ids = result.items.map((item) => item.id);
    assert.equal(ids.includes('claude-cmd'), true);
    assert.equal(ids.includes('claude-out'), false);
  });
});

test('a hook additional context attachment is returned as injected text', () => {
  withTemp('claude-injected', (root) => {
    const plain = claudeSession({ root: join(root, 'plain') });
    const contextual = claudeSession({ root: join(root, 'context') });
    appendFileSync(contextual.filePath, `${JSON.stringify({
      type: 'attachment',
      attachment: {
        type: 'hook_additional_context',
        hookEvent: 'UserPromptSubmit',
        content: [BRIEF],
      },
    })}\n`);

    const plainLoaded = loadClaudeSession({ sessionId: SESSION, ...plain.options });
    const contextualLoaded = loadClaudeSession({ sessionId: SESSION, ...contextual.options });

    assert.equal(plainLoaded.ok, true);
    assert.equal(contextualLoaded.ok, true);
    assert.deepEqual(contextualLoaded.injected, [{ source: 'hook_additional_context', text: BRIEF }]);
    assert.equal(contextualLoaded.records.length, plainLoaded.records.length);
  });
});
