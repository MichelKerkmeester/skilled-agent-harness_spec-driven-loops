// ───────────────────────────────────────────────────────────────────
// MODULE: Rust language vocabulary routing
// ───────────────────────────────────────────────────────────────────
// A Rust app or binding is often described by its crates and attributes rather than
// by a `.rs` path: "a clap cli", "the ratatui view", "the #[napi] export". The hub
// routes those words in two places, and both have to agree. The RUST intent in
// ROUTER.md decides that the Rust set is wanted, and the language detector in the
// replay library decides which language folders survive slicing. When a TypeScript
// file is also named, the detector alone keeps the Rust folders in, so each case
// below pairs the Rust word with `client.ts` to make a detector regression visible.
// Run from the repository root:
//   node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/rust-language-vocabulary.test.cjs

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const REPLAY_LIB = path.resolve(__dirname, '..', '..', 'assets', 'scripts', 'router-replay-lib.cjs');
const { loadSurfaceRouter, routeSkillResources } = require(REPLAY_LIB);

const HUB_ROOT = path.resolve(__dirname, '..', '..', '..');

function route(taskText) {
  const result = routeSkillResources({ skillRoot: HUB_ROOT, taskText });
  const count = (folder) => result.resources.filter((r) => r.includes(`/references/${folder}/`)).length;
  return { surface: result.surface, rust: count('rust'), typescript: count('typescript') };
}

test('the RUST keyword list parses whole, past the bracketed attributes', () => {
  const keywords = loadSurfaceRouter(HUB_ROOT).intentSignals.RUST.keywords;
  for (const word of ['#[napi]', '#[wasm_bindgen]', 'clap cli', 'ratatui', 'crossterm']) {
    assert.ok(keywords.includes(word), `RUST keywords lack ${word}: ${JSON.stringify(keywords)}`);
  }
});

for (const word of ['clap cli', 'clap::', 'ratatui', 'crossterm', '#[napi]', '#[wasm_bindgen]']) {
  test(`"${word}" keeps the Rust set beside a TypeScript file`, () => {
    const r = route(`Review the ${word} code in .skilled/tools/report next to client.ts.`);
    assert.equal(r.surface, 'SKILLED');
    assert.ok(r.rust > 0, `no Rust reference for ${word}`);
    assert.ok(r.typescript > 0, `no TypeScript reference for ${word}`);
  });
}

test('a path-less clap CLI loads the Rust set alone', () => {
  const r = route('In .skilled/tools/report I have a clap CLI that prints a report and exits with code 2 on error. Review it.');
  assert.equal(r.surface, 'SKILLED');
  assert.ok(r.rust > 0, 'no Rust reference for a clap CLI');
  assert.equal(r.typescript, 0);
});

test('the bare word clap does not pull the Rust set in', () => {
  const r = route('Review client.ts in .skilled/tools/report, which plays a clap sound on success.');
  assert.equal(r.rust, 0);
  assert.ok(r.typescript > 0);
});
