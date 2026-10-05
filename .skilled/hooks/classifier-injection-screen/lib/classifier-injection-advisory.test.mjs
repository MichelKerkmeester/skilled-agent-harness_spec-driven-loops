// ───────────────────────────────────────────────────────────────────
// MODULE: Injection Screen Advisory Tests
// ───────────────────────────────────────────────────────────────────
// Every case injects the gate and screen seams, so no test spawns a process
// or reaches a backend. The hook switch and the delivery channel belong to
// the adapter and are checked by its own test.
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { advisoryLine, fetchedText, screenAdvisory } from './classifier-injection-advisory.mjs';

// One in-band page: a heading plus four body lines.
const PAGE = ['# Example page', 'First body line.', 'Second body line.', 'Third body line.', 'Fourth body line.'].join('\n');

// The text fields `fetchedText` reads from an object payload.
const TEXT_KEYS = ['result', 'content', 'text', 'output', 'markdown', 'body'];

// A ready seam that answers one verdict, recording the name and environment it was asked for.
function readyStub(ready) {
  const calls = [];
  return {
    calls,
    ready: (name, env) => {
      calls.push([name, env]);
      return { ready, name, reason: ready ? 'ready' : 'no credential' };
    },
  };
}

// A screen seam that answers one verdict, recording the text and options it received.
function screenStub(flagged = [], checked = 1) {
  const calls = [];
  return {
    calls,
    screen: async (text, options) => {
      calls.push({ text, options });
      return { checked, flagged, unchecked: 0, unmeasured: 0 };
    },
  };
}

test('a bare string reads as the fetched text', () => {
  assert.equal(fetchedText('fetched page'), 'fetched page');
});

test('a block array joins its text blocks and drops the blocks that carry none', () => {
  assert.equal(
    fetchedText(['first', { type: 'text', text: 'second' }, { type: 'image' }, 7]),
    'first\nsecond',
  );
});

test('every known text field of an object payload is read', () => {
  for (const key of TEXT_KEYS) {
    assert.equal(fetchedText({ [key]: PAGE }), PAGE, key);
  }
});

test('an object content block array is read when no text field is present', () => {
  const blocks = [
    { type: 'text', text: 'first' },
    { type: 'text', text: 'second' },
  ];
  assert.equal(fetchedText({ content: blocks }), 'first\nsecond');
});

test('a payload shape that carries no text reads as none', () => {
  for (const value of [null, 42, true, {}, { foo: 'bar' }, { content: 42 }, []]) {
    assert.equal(fetchedText(value), null, JSON.stringify(value));
  }
});

test('a gate that is not ready adds no advisory and screens nothing', async () => {
  const gate = readyStub(false);
  const screen = screenStub();
  const result = await screenAdvisory(PAGE, { env: {}, ready: gate.ready, screen: screen.screen });

  assert.equal(result, null);
  assert.deepEqual(gate.calls, [['injection-screen', {}]]);
  assert.equal(screen.calls.length, 0);
});

test('blank text adds no advisory and never asks the gate', async () => {
  for (const text of ['', '   \n\t\n']) {
    const gate = readyStub(true);
    const screen = screenStub();
    const result = await screenAdvisory(text, { env: {}, ready: gate.ready, screen: screen.screen });

    assert.equal(result, null);
    assert.equal(gate.calls.length, 0);
    assert.equal(screen.calls.length, 0);
  }
});

test('a ready gate with no flagged section adds no advisory', async () => {
  const gate = readyStub(true);
  const screen = screenStub([], 3);
  const result = await screenAdvisory(PAGE, { env: {}, ready: gate.ready, screen: screen.screen });

  assert.equal(result, null);
  assert.equal(screen.calls.length, 1);
  assert.equal(screen.calls[0].text, PAGE);
  // The screen seam receives the gate's own answer, so one readiness check serves both.
  assert.equal(screen.calls[0].options.gate.name, 'injection-screen');
  assert.equal(screen.calls[0].options.gate.ready, true);
  assert.equal(gate.calls.length, 1);
});

test('one flagged section returns exactly the advisory line', async () => {
  const flagged = [{ heading: '# Example page', mean: 0.83, position: 2 }];
  const gate = readyStub(true);
  const screen = screenStub(flagged, 3);
  const result = await screenAdvisory(PAGE, { env: {}, ready: gate.ready, screen: screen.screen });

  assert.equal(result, advisoryLine(flagged, 3));
  assert.ok(result.includes('1 of 3 sections'));
  assert.ok(result.includes('highest p=0.83 in section 2 of 3'));
});
