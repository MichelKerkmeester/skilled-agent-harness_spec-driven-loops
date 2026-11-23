// ───────────────────────────────────────────────────────────────────
// MODULE: Overlay Engine JSON Formatting Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// A json-entry overlay writes each value the way the file around it is written:
// at the nesting depth of the key or item it lands on, with the file's own
// indent unit and line endings. A file written by JSON.stringify therefore stays
// byte-identical to JSON.stringify of the result, whatever each operation added
// or replaced, and a second apply changes nothing.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const {
  createSyncFixture,
  readJson,
  sha256,
  writeFile,
  writeManifest,
} = require('./overlay-engine-fixtures.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// The bytes JSON.stringify writes for a document, with the given line ending.
function canonical(value, unit, eol) {
  return JSON.stringify(value, null, unit).split('\n').join(eol) + eol;
}

const FORMATS = [
  { label: 'two spaces, LF', unit: '  ', eol: '\n' },
  { label: 'four spaces, LF', unit: '    ', eol: '\n' },
  { label: 'tabs, LF', unit: '\t', eol: '\n' },
  { label: 'two spaces, CRLF', unit: '  ', eol: '\r\n' },
  { label: 'four spaces, CRLF', unit: '    ', eol: '\r\n' },
];

function seedDocument() {
  return {
    name: 'widget',
    edges: {
      depends_on: [{ target: 'alpha', weight: 1 }],
      prerequisite_for: [],
      meta: { tags: ['x'] },
    },
    items: [{ id: 'a', opts: { on: true } }],
    settings: { inner: { flag: false } },
  };
}

// One operation of each kind that serializes a value, both adding and replacing.
function entrySet({ dependsWeight = 2, extraValue = { deep: [1, { a: 2 }] } } = {}) {
  return {
    target: 'doc.json',
    style: { indent: 2, primitiveArrays: 'multiline' },
    operations: [
      {
        op: 'set',
        path: ['edges', 'prerequisite_for'],
        value: [{ target: 'sk-git', weight: 0.7, nested: { list: [1, 2] } }],
      },
      { op: 'set', path: ['edges', 'added'], value: { k: ['v'] } },
      { op: 'set', path: ['settings', 'inner'], value: { flag: true, deep: { arr: [{ a: 1 }] } } },
      {
        op: 'appendItems',
        path: ['edges', 'depends_on'],
        identityKey: 'target',
        items: [{ target: 'beta', weight: dependsWeight, extra: { x: [1] } }],
      },
      { op: 'appendItems', path: ['edges', 'meta', 'tags'], items: ['y', 'z'] },
      {
        op: 'insertItems',
        path: ['items'],
        identityKey: 'id',
        before: { id: 'a' },
        items: [{ id: 'z', opts: { on: false } }],
      },
      {
        op: 'setKeyOnItem',
        path: ['items'],
        identityKey: 'id',
        match: { id: 'a' },
        key: 'opts',
        value: { on: false, more: [1] },
      },
      {
        op: 'setKeyOnItem',
        path: ['items'],
        identityKey: 'id',
        match: { id: 'a' },
        key: 'added',
        value: { q: [{ r: 1 }] },
      },
      { op: 'insertObjectKeys', path: ['settings'], entries: [{ key: 'extra', value: extraValue }] },
      { op: 'insertObjectKeys', path: [], beforeKey: 'items', entries: [{ key: 'beforeItems', value: { a: [1] } }] },
    ],
  };
}

// The document the entry set above describes, in the key order the file ends with.
function expectedDocument({ dependsWeight = 2, extraValue = { deep: [1, { a: 2 }] } } = {}) {
  return {
    name: 'widget',
    edges: {
      depends_on: [
        { target: 'alpha', weight: 1 },
        { target: 'beta', weight: dependsWeight, extra: { x: [1] } },
      ],
      prerequisite_for: [{ target: 'sk-git', weight: 0.7, nested: { list: [1, 2] } }],
      meta: { tags: ['x', 'y', 'z'] },
      added: { k: ['v'] },
    },
    beforeItems: { a: [1] },
    items: [
      { id: 'z', opts: { on: false } },
      { id: 'a', opts: { on: false, more: [1] }, added: { q: [{ r: 1 }] } },
    ],
    settings: { inner: { flag: true, deep: { arr: [{ a: 1 }] } }, extra: extraValue },
  };
}

function addDocOverlay(fixture, seedBytes, spec) {
  writeFile(fixture.tree, 'doc.json', seedBytes);
  writeFile(fixture.overlayDir, 'json/doc.json', JSON.stringify(spec, null, 2) + '\n');
  fixture.manifest.overlays.push({
    id: 'doc-entries',
    scope: 'json-entry',
    source: 'json/doc.json',
    destination: 'doc.json',
    pinnedSha256: sha256(Buffer.from(seedBytes)),
  });
  writeManifest(fixture);
}

function readDoc(fixture) {
  return fs.readFileSync(path.join(fixture.tree, 'doc.json'), 'utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS
// ─────────────────────────────────────────────────────────────────────────────

for (const format of FORMATS) {
  test(`every json-entry operation writes at its nesting depth (${format.label})`, (t) => {
    const fixture = createSyncFixture(t);
    addDocOverlay(fixture, canonical(seedDocument(), format.unit, format.eol), entrySet());

    const applied = fixture.run(['apply']);
    assert.equal(applied.code, 0, applied.output);
    assert.equal(readDoc(fixture), canonical(expectedDocument(), format.unit, format.eol));

    assert.equal(fixture.run(['apply']).output.trim(), '0 changed');
    const status = fixture.run(['status']);
    assert.equal(status.code, 0, status.output);

    // An entry set that changes an item and a key it already wrote rewrites them
    // in place, at the same depth.
    const changed = { dependsWeight: 3, extraValue: { deep: [2], more: { b: [true] } } };
    writeFile(fixture.overlayDir, 'json/doc.json', JSON.stringify(entrySet(changed), null, 2) + '\n');
    const rewritten = fixture.run(['apply']);
    assert.equal(rewritten.code, 0, rewritten.output);
    assert.equal(readDoc(fixture), canonical(expectedDocument(changed), format.unit, format.eol));
    assert.equal(fixture.run(['apply']).output.trim(), '0 changed');
    assert.equal(fixture.run(['status']).code, 0);
  });
}

test('a set value an earlier engine wrote flush-left is rewritten at its depth on the next apply', (t) => {
  const fixture = createSyncFixture(t);
  const seedBytes = '{\n  "edges": {\n    "prerequisite_for": [],\n    "kept": true\n  }\n}\n';
  const spec = {
    target: 'doc.json',
    style: { indent: 2, primitiveArrays: 'multiline' },
    operations: [{ op: 'set', path: ['edges', 'prerequisite_for'], value: [{ target: 'sk-git', weight: 0.7 }] }],
  };
  addDocOverlay(fixture, seedBytes, spec);
  const seeded = fixture.run(['apply']);
  assert.equal(seeded.code, 0, seeded.output);

  // The bytes the engine wrote before it read the key's depth, accepted as its own.
  const flushLeft = '{\n  "edges": {\n    "prerequisite_for": [\n  {\n    "target": "sk-git",\n' +
    '    "weight": 0.7\n  }\n],\n    "kept": true\n  }\n}\n';
  writeFile(fixture.tree, 'doc.json', flushLeft);
  const state = readJson(fixture.statePath);
  state.files['doc.json'] = sha256(Buffer.from(flushLeft));
  fs.writeFileSync(fixture.statePath, JSON.stringify(state, null, 2) + '\n');

  const reapplied = fixture.run(['apply']);
  assert.equal(reapplied.code, 0, reapplied.output);
  const expected = { edges: { prerequisite_for: [{ target: 'sk-git', weight: 0.7 }], kept: true } };
  assert.equal(readDoc(fixture), canonical(expected, '  ', '\n'));
  assert.equal(fixture.run(['apply']).output.trim(), '0 changed');
  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
});

test('an equal set value in bytes the engine did not write keeps its own layout', (t) => {
  const fixture = createSyncFixture(t);
  const seedBytes = '{\n  "edges": {\n    "prerequisite_for": [{"target": "sk-git", "weight": 0.7}],\n' +
    '    "kept": true\n  }\n}\n';
  const spec = {
    target: 'doc.json',
    style: { indent: 2, primitiveArrays: 'multiline' },
    operations: [{ op: 'set', path: ['edges', 'prerequisite_for'], value: [{ target: 'sk-git', weight: 0.7 }] }],
  };
  addDocOverlay(fixture, seedBytes, spec);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(readDoc(fixture), seedBytes);
  // Once the state accepts these bytes and records the set, they still stand.
  assert.equal(fixture.run(['apply']).output.trim(), '0 changed');
  assert.equal(readDoc(fixture), seedBytes);
  assert.equal(fixture.run(['status']).code, 0);
});

test('the indent unit is the shallowest indent, even when the first indented line sits deeper', () => {
  const engine = require('../overlay-engine.cjs');
  const text = '{"x": {\n    "y": 1\n  },\n  "z": 1\n}\n';
  const spec = {
    style: { indent: 2, primitiveArrays: 'multiline' },
    operations: [{ op: 'set', path: ['z'], value: { a: [1, { b: 2 }] } }],
  };
  const output = engine.applyJsonOperations(text, spec, { canReplaceExisting: true });
  const value = JSON.stringify({ a: [1, { b: 2 }] }, null, '  ').split('\n').join('\n  ');
  assert.equal(output, `{"x": {\n    "y": 1\n  },\n  "z": ${value}\n}\n`);
});

test('a file with mixed line endings gets the ending most of its lines use', () => {
  const engine = require('../overlay-engine.cjs');
  const text = '{\r\n  "x": 1,\n  "z": 2\n}\n';
  const spec = {
    style: { indent: 2, primitiveArrays: 'multiline' },
    operations: [{ op: 'set', path: ['z'], value: { a: 1 } }],
  };
  const output = engine.applyJsonOperations(text, spec, { canReplaceExisting: true });
  assert.equal(output, '{\r\n  "x": 1,\n  "z": {\n    "a": 1\n  }\n}\n');
});
