// ───────────────────────────────────────────────────────────────────
// MODULE: Ask Surface Core Tests
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const core = require('./ask-surface-core.cjs');

const here = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(here, '..', 'fixtures');

for (const file of readdirSync(fixtureDir).filter((name) => name.endsWith('.json'))) {
  test(`fixture ${file} returns its expected verdict`, () => {
    const fixture = JSON.parse(readFileSync(path.join(fixtureDir, file), 'utf8'));
    const result = core.evaluateTurn(fixture);
    assert.equal(result.verdict, fixture.expected, `${file}: ${result.reason}`);
  });
}

test('detectProseMenu reports the labels and the question', () => {
  const menu = core.detectProseMenu('Which one?\nA) First\nB) Second');
  assert.deepEqual(menu, { labels: ['A', 'B'], question: 'Which one?' });
});

test('a menu followed by a long closing section does not count as closing the message', () => {
  const text = ['Which one?', 'A) First', 'B) Second', '', ...Array.from({ length: 8 }, (_, i) => `Line ${i}.`)].join('\n');
  assert.equal(core.detectProseMenu(text), null);
});

test('options out of sequence do not form a menu', () => {
  assert.equal(core.detectProseMenu('Which one?\nA) First\nC) Third'), null);
});

test('empty and non-string input never fires', () => {
  assert.equal(core.evaluateTurn({ lastMessage: '', askToolCalled: false }).verdict, 'pass');
  assert.equal(core.evaluateTurn({ lastMessage: undefined, askToolCalled: false }).verdict, 'pass');
});

test('repromptFor names the runtime tool, and both Pi tools', () => {
  assert.match(core.repromptFor('claude'), /`AskUserQuestion`/);
  assert.match(core.repromptFor('pi'), /`ask_user_question` or `question`/);
  assert.match(core.repromptFor('unknown'), /your question tool/);
});

test('recordFire appends one line per fire and never throws', (t) => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'ask-surface-fires-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  assert.equal(core.recordFire(dir, { runtime: 'pi', mode: 'reprompt' }), true);
  assert.equal(core.recordFire(dir, { runtime: 'pi', mode: 'reprompt' }), true);
  const lines = readFileSync(path.join(dir, '.skilled/skills/.state/ask-surface/fires.jsonl'), 'utf8').trim().split('\n');
  assert.equal(lines.length, 2);
  assert.equal(core.recordFire('', { runtime: 'pi', mode: 'reprompt' }), false);
});

test('markTurn is true once per turn key, then false', (t) => {
  const base = mkdtempSync(path.join(os.tmpdir(), 'ask-surface-core-'));
  t.after(() => rmSync(base, { recursive: true, force: true }));
  assert.equal(core.markTurn('/repo', 'session-1:turn-1', base), true);
  assert.equal(core.markTurn('/repo', 'session-1:turn-1', base), false);
  assert.equal(core.markTurn('/repo', 'session-1:turn-2', base), true);
});
