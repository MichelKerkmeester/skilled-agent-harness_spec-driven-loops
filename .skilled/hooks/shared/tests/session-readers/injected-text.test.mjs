// ───────────────────────────────────────────────────────────────────
// MODULE: Injected User Text Tests
// ───────────────────────────────────────────────────────────────────
// Every runtime injects harness context alongside operator prompts. A reader
// may drop that injected content, but only where the store or a known tag says
// it is injected; operator text that merely opens with '<' must survive.

import assert from 'node:assert/strict';
import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'node:test';

import { readSession } from '../../session-readers/index.mjs';
import {
  codexSession,
  devinSession,
  dshSession,
  NOW,
  opencodeSession,
  piSession,
  SESSION,
  T0,
} from './fixtures.mjs';
import { withTempAsync, writeJson } from './helpers.mjs';

function appendJsonLines(filePath, rows) {
  appendFileSync(filePath, rows.map((row) => `${JSON.stringify(row)}\n`).join(''));
}

test('Codex keeps operator text that opens with a tag and drops only injected context', async () => {
  await withTempAsync('codex-injected-text', async (root) => {
    const fixture = codexSession({ root });
    appendJsonLines(fixture.filePath, [
      {
        timestamp: NOW,
        type: 'response_item',
        payload: {
          type: 'message',
          id: 'codex-environment',
          role: 'user',
          content: [{ type: 'input_text', text: '<environment_context>\n<cwd>/workspace</cwd>\n</environment_context>' }],
        },
      },
      {
        timestamp: NOW,
        type: 'response_item',
        payload: {
          type: 'message',
          id: 'codex-instructions',
          role: 'user',
          content: [{ type: 'input_text', text: '<user_instructions>Attached instructions.</user_instructions>' }],
        },
      },
      {
        timestamp: NOW,
        type: 'response_item',
        payload: {
          type: 'message',
          id: 'codex-permissions',
          role: 'user',
          content: [{ type: 'input_text', text: '<permissions instructions>Sandboxed.</permissions instructions>' }],
        },
      },
      {
        timestamp: NOW,
        type: 'response_item',
        payload: {
          type: 'message',
          id: 'codex-div',
          role: 'user',
          content: [{ type: 'input_text', text: '<div>hello</div>' }],
        },
      },
    ]);

    const result = await readSession({ runtime: 'codex', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, true);
    const ids = result.items.map((item) => item.id);
    assert.equal(ids.includes('codex-environment'), false);
    assert.equal(ids.includes('codex-instructions'), false);
    assert.equal(ids.includes('codex-permissions'), false);
    assert.equal(result.items.find((item) => item.id === 'codex-div')?.content[0].text, '<div>hello</div>');
  });
});

test('Pi keeps operator text that opens with a tag and ignores custom messages', async () => {
  await withTempAsync('pi-injected-text', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    const fixture = piSession({ root, projectDir });
    appendJsonLines(fixture.filePath, [
      {
        type: 'custom_message',
        customType: 'session-start-context',
        id: 'pi-context',
        timestamp: NOW,
        content: '<system-reminder>injected</system-reminder>',
      },
      {
        type: 'message',
        id: 'pi-div',
        timestamp: NOW,
        message: { role: 'user', content: [{ type: 'text', text: '<div>hello</div>' }] },
      },
    ]);

    const result = await readSession({ runtime: 'pi', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, true);
    assert.equal(result.items.some((item) => item.id === 'pi-context'), false);
    assert.equal(result.items.find((item) => item.id === 'pi-div')?.content[0].text, '<div>hello</div>');
  });
});

test('Devin keeps an operator step that opens with a tag and ignores system steps in a transcript-only store', async () => {
  await withTempAsync('devin-injected-text', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    const fixture = devinSession({ root, projectDir, withSessionsRow: false });
    const transcript = JSON.parse(readFileSync(fixture.filePath, 'utf8'));
    transcript.steps.push(
      { step_id: 90, timestamp: NOW, source: 'system', message: '<system>injected</system>' },
      { step_id: 91, timestamp: NOW, source: 'user', message: '<div>hello</div>' },
    );
    writeJson(fixture.filePath, transcript);

    const result = await readSession({ runtime: 'devin', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, true);
    assert.equal(result.items.some((item) => item.id === 'devin-90'), false);
    assert.equal(result.items.find((item) => item.id === 'devin-91')?.content[0].text, '<div>hello</div>');
  });
});

test('DSH keeps an operator message that opens with a tag and ignores injected source kinds', async () => {
  await withTempAsync('dsh-injected-text', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    const fixture = dshSession({ root, projectDir });
    appendJsonLines(fixture.filePath, [
      {
        type: 'user/message',
        seq: 5,
        data: {
          role: 'user',
          id: 'dsh-injected',
          source: { kind: 'repo-guards' },
          content: [{ type: 'text', text: '<system>injected</system>' }],
        },
      },
      {
        type: 'user/message',
        seq: 6,
        data: {
          role: 'user',
          id: 'dsh-div',
          source: { kind: 'user' },
          content: [{ type: 'text', text: '<div>hello</div>' }],
        },
      },
    ]);

    const result = await readSession({ runtime: 'dsh', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, true);
    assert.equal(result.items.some((item) => item.id === 'dsh-injected'), false);
    assert.equal(result.items.find((item) => item.id === 'dsh-div')?.content[0].text, '<div>hello</div>');
  });
});

test('OpenCode keeps an operator row that opens with a tag and ignores synthetic rows', async () => {
  await withTempAsync('opencode-injected-text', async (root) => {
    const fixture = opencodeSession({ root });
    const database = new DatabaseSync(fixture.dbPath);
    try {
      const insert = database.prepare(
        'INSERT INTO session_message (id, session_id, type, seq, data) VALUES (?, ?, ?, ?, ?)',
      );
      insert.run(
        'oc-synthetic',
        SESSION,
        'synthetic',
        3,
        JSON.stringify({ text: '<system>injected</system>', time: { created: T0 + 3000 } }),
      );
      insert.run(
        'oc-div',
        SESSION,
        'user',
        4,
        JSON.stringify({ text: '<div>hello</div>', time: { created: T0 + 4000 } }),
      );
    } finally {
      database.close();
    }

    const result = await readSession({ runtime: 'opencode', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, true);
    assert.equal(result.items.some((item) => item.id === 'oc-synthetic'), false);
    assert.equal(result.items.find((item) => item.id === 'oc-div')?.content[0].text, '<div>hello</div>');
  });
});
