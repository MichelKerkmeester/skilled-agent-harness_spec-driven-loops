// ───────────────────────────────────────────────────────────────────
// MODULE: Fetched-Text Injection Screen Tests
// ───────────────────────────────────────────────────────────────────
// Every case injects a `classify` seam, so no test spawns a process or
// reaches a backend. Sectioning is observed through the stdin each call
// received and through the returned counts.
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { INSTRUCTION } from '../../../skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs';
import { screenText } from './classifier-screen-fetched-text.mjs';

const GATE = { path: '/stub/jev', provider: 'official' };

// One successful call body carrying a probability.
function body(noul) {
  return { code: 0, stdout: `${JSON.stringify({ answers: { answer: { noul } } })}\n`, stderr: '', timedOut: false };
}

// One successful call whose body cannot be read.
function unreadable() {
  return { code: 0, stdout: 'not json', stderr: '', timedOut: false };
}

// A classify stub that answers in call order from a script, recording the
// options each call received. Past the end of the script it answers unreadable.
function scripted(answers) {
  const calls = [];
  return {
    calls,
    classify: async (options) => {
      calls.push(options);
      return answers[calls.length - 1] ?? unreadable();
    },
  };
}

// One in-band section: a heading plus four body lines.
function page(heading, bodyLines) {
  return [heading, ...bodyLines].join('\n');
}

const ONE_SECTION = page('# Example', ['a1', 'a2', 'a3', 'a4']);

test('a section whose two answers mean 0.75 is flagged', async () => {
  const stub = scripted([body(0.8), body(0.7)]);
  const result = await screenText(ONE_SECTION, { env: {}, gate: GATE, classify: stub.classify });

  assert.deepEqual(result, { checked: 1, flagged: [{ heading: '# Example', mean: 0.75, position: 1 }], unchecked: 0, unmeasured: 0 });
  assert.equal(stub.calls.length, 2);
  assert.equal(stub.calls[0].file, GATE.path);
  assert.deepEqual(stub.calls[0].args, ['noul', '--provider', 'official', '-q', INSTRUCTION]);
  assert.equal(stub.calls[0].stdin, ONE_SECTION);
});

test('answers on opposite sides of the flag line earn a third call that joins the mean', async () => {
  const stub = scripted([body(0.2), body(0.9), body(0.8)]);
  const result = await screenText(ONE_SECTION, { env: {}, gate: GATE, classify: stub.classify });

  assert.equal(stub.calls.length, 3);
  assert.equal(result.checked, 1);
  assert.equal(result.unmeasured, 0);
  assert.equal(result.flagged.length, 1);
  assert.equal(result.flagged[0].mean.toFixed(2), '0.63');
});

test('an unreadable answer of the pair leaves the section unmeasured and unflagged', async () => {
  const stub = scripted([unreadable(), body(0.9)]);
  const result = await screenText(ONE_SECTION, { env: {}, gate: GATE, classify: stub.classify });

  assert.deepEqual(result, { checked: 0, flagged: [], unchecked: 0, unmeasured: 1 });
  // One readable answer is not a pair, so no third call is started.
  assert.equal(stub.calls.length, 2);
});

test('a required third answer that cannot be read leaves the section unmeasured', async () => {
  const stub = scripted([body(0.4), body(0.8), unreadable()]);
  const result = await screenText(ONE_SECTION, { env: {}, gate: GATE, classify: stub.classify });

  // The pair straddles the flag line and would mean 0.60, but the third
  // answer it requires never arrived, so nothing is decided.
  assert.deepEqual(result, { checked: 0, flagged: [], unchecked: 0, unmeasured: 1 });
  assert.equal(stub.calls.length, 3);
});

test('a straddling pair that outlasts the budget is unmeasured', async () => {
  let order = 0;
  const classify = async () => {
    const seat = order;
    order += 1;
    await new Promise((resolve) => setTimeout(resolve, 20));
    return seat === 0 ? body(0.4) : body(0.8);
  };
  const result = await screenText(ONE_SECTION, { env: {}, gate: GATE, classify, budgetMs: 5 });

  assert.deepEqual(result, { checked: 0, flagged: [], unchecked: 0, unmeasured: 1 });
  assert.equal(order, 2);
});

test('empty and whitespace-only text makes no call', async () => {
  const stub = scripted([]);
  for (const text of ['', '   \n\n\t\n', '\n\n']) {
    const result = await screenText(text, { env: {}, gate: GATE, classify: stub.classify });
    assert.deepEqual(result, { checked: 0, flagged: [], unchecked: 0, unmeasured: 0 });
  }
  assert.equal(stub.calls.length, 0);
});

test('twenty sections screen twelve and leave eight unchecked', async () => {
  const sections = Array.from({ length: 20 }, (_, index) => page(`# H${index}`, ['a1', 'a2', 'a3', 'a4']));
  const stub = scripted(Array.from({ length: 24 }, () => body(0.1)));
  const result = await screenText(sections.join('\n'), { env: {}, gate: GATE, classify: stub.classify });

  assert.deepEqual(result, { checked: 12, flagged: [], unchecked: 8, unmeasured: 0 });
  assert.equal(stub.calls.length, 24);
});

test('a short section merges into the next and the last short section into the previous', async () => {
  const text = ['# A', 'a1', '# B', 'b1', 'b2', 'b3', 'b4', 'b5', '# C', 'c1'].join('\n');
  const stub = scripted([body(0.1), body(0.1)]);
  const result = await screenText(text, { env: {}, gate: GATE, classify: stub.classify });

  assert.deepEqual(result, { checked: 1, flagged: [], unchecked: 0, unmeasured: 0 });
  assert.equal(stub.calls.length, 2);
  assert.equal(stub.calls[0].stdin, text);
  assert.equal(result.flagged.length, 0);
});

test('a section over sixty lines is cut into sixty-line pieces', async () => {
  const text = page('# Big', Array.from({ length: 124 }, (_, index) => `line ${index + 1}`));
  const stub = scripted(Array.from({ length: 6 }, () => body(0.1)));
  const result = await screenText(text, { env: {}, gate: GATE, classify: stub.classify });

  assert.equal(result.checked, 3);
  assert.equal(stub.calls.length, 6);
  assert.deepEqual(
    [...new Set(stub.calls.map((call) => call.stdin.split('\n').length))].sort((left, right) => left - right),
    [5, 60],
  );
  assert.equal(result.flagged.length, 0);
});

test('a whitespace-only section is dropped instead of screened', async () => {
  const text = `\n\n\n\n\n\n${page('# H', ['h1', 'h2', 'h3', 'h4'])}`;
  const stub = scripted([body(0.1), body(0.1)]);
  const result = await screenText(text, { env: {}, gate: GATE, classify: stub.classify });

  assert.deepEqual(result, { checked: 1, flagged: [], unchecked: 0, unmeasured: 0 });
  assert.equal(stub.calls.length, 2);
  assert.ok(stub.calls[0].stdin.startsWith('# H'));
});

test('a spent budget leaves every remaining section unchecked', async () => {
  const stub = scripted([]);
  const result = await screenText(ONE_SECTION, { env: {}, gate: GATE, classify: stub.classify, budgetMs: 0 });

  assert.deepEqual(result, { checked: 0, flagged: [], unchecked: 1, unmeasured: 0 });
  assert.equal(stub.calls.length, 0);
});
