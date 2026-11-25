// ───────────────────────────────────────────────────────────────────
// MODULE: Overlay Engine removeItems Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// A `removeItems` operation deletes named items from an upstream array, so a
// project drops what it does not use without carrying the whole file. The rest
// of the file keeps its bytes, a second apply changes nothing, and a name the
// pinned copy does not hold is a note rather than a failure.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { spawnSync } = require('node:child_process');

const {
  ENGINE,
  createWorkspace,
  runEngine,
  sha256,
  writeFile,
  writeManifest,
} = require('./overlay-engine-fixtures.cjs');

const engine = require(ENGINE);

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const GIT_CONFIG = [
  '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid',
  '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', '-c', 'init.defaultBranch=main',
  '-c', 'core.excludesFile=/dev/null',
];

function git(cwd, args) {
  const result = spawnSync('git', [...GIT_CONFIG, '-C', cwd, ...args], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error('git ' + args.join(' ') + ': ' + result.stderr);
  return result.stdout.trim();
}

// The bytes JSON.stringify writes for a document, with the given line ending.
function canonical(value, unit, eol) {
  return JSON.stringify(value, null, unit).split('\n').join(eol) + eol;
}

const MANUALS = ['code-mode', 'notion', 'figma', 'obsidian', 'gitkraken', 'clickup', 'webflow'];
const DROPPED = ['notion', 'obsidian', 'gitkraken', 'webflow'];

// A document shaped like `.utcp_config.json`: keys before and after the array,
// and object items that each carry a `name`.
function utcpDocument(names) {
  return {
    load_variables_from: [{ variable_loader_type: 'dotenv', env_file_path: '.env' }],
    manual_call_templates: names.map((name) => ({
      name,
      call_template_type: 'mcp',
      config: { mcpServers: { [name]: { command: 'npx', args: ['-y', name] } } },
    })),
    tool_repository: { tool_repository_type: 'in_memory' },
  };
}

function removeManuals(items) {
  return { op: 'removeItems', path: ['manual_call_templates'], identityKey: 'name', items };
}

/**
 * Build a tree whose `.utcp_config.json` an upstream checkout holds at the pin,
 * with one json-entry overlay on it.
 * @param {object} t The node:test context.
 * @param {string} seed The pinned bytes of the file.
 * @param {object[]} operations The entry set's operations.
 * @returns {object} Fixture paths and helpers.
 */
function createUtcpFixture(t, seed, operations) {
  const fixture = createWorkspace(t, 'overlay-engine-remove-');
  const upstream = path.join(fixture.workspace, 'upstream');
  fs.mkdirSync(upstream);
  git(upstream, ['init', '-q']);
  writeFile(upstream, '.utcp_config.json', seed);
  git(upstream, ['add', '-A']);
  git(upstream, ['commit', '-q', '-m', 'pinned copy']);
  const commit = git(upstream, ['rev-parse', 'HEAD']);
  writeFile(fixture.tree, '.utcp_config.json', seed);
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', checkout: upstream, commit },
    repin: { rootFiles: ['.utcp_config.json'] },
    layoutLinks: [],
    overlays: [{
      id: 'utcp-config',
      scope: 'json-entry',
      source: 'json/utcp-config.json',
      destination: '.utcp_config.json',
      pinnedSha256: sha256(Buffer.from(seed)),
    }],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  fixture.writeOperations = (list) => writeFile(fixture.overlayDir, 'json/utcp-config.json', JSON.stringify({
    target: '.utcp_config.json',
    style: { indent: 2, primitiveArrays: 'inline' },
    operations: list,
  }, null, 2) + '\n');
  fixture.writeOperations(operations);
  fixture.run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);
  fixture.readLive = () => fs.readFileSync(path.join(fixture.tree, '.utcp_config.json'), 'utf8');
  return fixture;
}

function noteLines(output) {
  return output.split('\n').filter((line) => line.startsWith('NOTE'));
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('removeItems takes four manuals out of a utcp config and leaves the bytes JSON.stringify writes', (t) => {
  const seed = canonical(utcpDocument(MANUALS), '  ', '\n');
  const fixture = createUtcpFixture(t, seed, [removeManuals(DROPPED)]);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  const expected = canonical(utcpDocument(['code-mode', 'figma', 'clickup']), '  ', '\n');
  assert.equal(fixture.readLive(), expected);

  // The second apply finds every named item gone and has nothing to do.
  const again = fixture.run(['apply']);
  assert.equal(again.code, 0, again.output);
  assert.equal(again.output.trim(), '0 changed');
  assert.equal(fixture.readLive(), expected);

  // Status reads the result as the overlay's own output, and the audit agrees.
  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
  assert.match(status.output, /in-sync=1 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0/);
  assert.deepEqual(noteLines(status.output), []);
  const audit = fixture.run(['status', '--audit']);
  assert.equal(audit.code, 0, audit.output);
  assert.match(audit.output, /in-sync=1 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0/);
  assert.match(audit.stdout, /^RESULT: PASSED$/m);
  assert.deepEqual(noteLines(audit.output), []);
});

test('removeItems keeps a CRLF file with four-space indent in its own layout', (t) => {
  const seed = canonical(utcpDocument(MANUALS), '    ', '\r\n');
  const fixture = createUtcpFixture(t, seed, [removeManuals(DROPPED)]);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(fixture.readLive(), canonical(utcpDocument(['code-mode', 'figma', 'clickup']), '    ', '\r\n'));
  assert.equal(fixture.run(['apply']).output.trim(), '0 changed');
  assert.equal(fixture.run(['status']).code, 0);
});

const LAYOUTS = [
  { label: 'two spaces, LF', unit: '  ', eol: '\n' },
  { label: 'four spaces, CRLF', unit: '    ', eol: '\r\n' },
  { label: 'tabs, LF', unit: '\t', eol: '\n' },
];

const POSITIONS = [
  { label: 'the first item', remove: ['a'], keep: ['b', 'c', 'd'] },
  { label: 'a middle item', remove: ['c'], keep: ['a', 'b', 'd'] },
  { label: 'the last item', remove: ['d'], keep: ['a', 'b', 'c'] },
  { label: 'all but the last item', remove: ['a', 'b', 'c'], keep: ['d'] },
  { label: 'every item', remove: ['d', 'a', 'c', 'b'], keep: [] },
];

for (const layout of LAYOUTS) {
  for (const position of POSITIONS) {
    test(`removeItems of ${position.label} leaves valid JSON in the file's layout (${layout.label})`, () => {
      const text = canonical(utcpDocument(['a', 'b', 'c', 'd']), layout.unit, layout.eol);
      const spec = { operations: [removeManuals(position.remove)] };
      const output = engine.applyJsonOperations(text, spec, { canReplaceExisting: true });
      // An array left with no item is written `[]`, as JSON.stringify writes it.
      assert.equal(output, canonical(utcpDocument(position.keep), layout.unit, layout.eol));
      assert.equal(engine.applyJsonOperations(output, spec, { canReplaceExisting: true }), output);
    });
  }
}

test('removeItems without an identityKey removes plain values from an inline array', () => {
  const text = '{\n  "tags": ["a", "b", "c"],\n  "kept": true\n}\n';
  const spec = { operations: [{ op: 'removeItems', path: ['tags'], items: ['b', 'missing'] }] };
  assert.equal(engine.applyJsonOperations(text, spec, { canReplaceExisting: true }),
    '{\n  "tags": ["a", "c"],\n  "kept": true\n}\n');
});

test('a name the pinned copy does not hold is a status note, not a failure', (t) => {
  const seed = canonical(utcpDocument(MANUALS), '  ', '\n');
  const fixture = createUtcpFixture(t, seed, [removeManuals(['notion', 'absent'])]);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.deepEqual(JSON.parse(fixture.readLive()).manual_call_templates.map((item) => item.name),
    MANUALS.filter((name) => name !== 'notion'));

  // Only the name the pin never held is noted: "notion" is gone because the
  // overlay removed it, which is the operation working.
  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
  assert.deepEqual(noteLines(status.output), [
    'NOTE     utcp-config: removeItems of "absent" at manual_call_templates finds no such item in the pinned copy, ' +
      "so it removes nothing; drop it from the operation's items",
  ]);
});

test('a missing name is judged against the pinned copy the run reads, and only when one is readable', () => {
  const live = canonical(utcpDocument(['a', 'c']), '  ', '\n');
  const spec = { operations: [removeManuals(['b'])] };
  const warningsWith = (readUpstreamText) => {
    const warnings = [];
    engine.applyJsonOperations(live, spec, { canReplaceExisting: true, readUpstreamText, onWarning: (message) => warnings.push(message) });
    return warnings;
  };
  // The pin holds "b", so its absence from the live file is this operation's work.
  assert.deepEqual(warningsWith(() => canonical(utcpDocument(['a', 'b', 'c']), '  ', '\n')), []);
  // A new upstream commit that deleted "b" itself is reported, and the run goes on.
  assert.equal(warningsWith(() => live).length, 1);
  // Without a pinned copy there is nothing to judge the absence by.
  assert.deepEqual(warningsWith(() => null), []);
});

test('dropping a removeItems leaves the item removed and status names it through the cross-check', (t) => {
  const seed = canonical(utcpDocument(MANUALS), '  ', '\n');
  const fixture = createUtcpFixture(t, seed, [removeManuals(['notion'])]);
  assert.equal(fixture.run(['apply']).code, 0);
  const removed = fixture.readLive();

  fixture.writeOperations([]);
  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(applied.output.trim(), '0 changed');
  assert.equal(fixture.readLive(), removed);

  // The engine keeps no record of what a removeItems took out, so nothing
  // puts the item back; the cross-check against the pin is what names the gap,
  // at the first place the shorter array stops matching the pin's.
  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
  assert.deepEqual(noteLines(status.output), [
    'NOTE     cross-check .utcp_config.json: the live file differs from the entry set applied to the pinned copy ' +
      'at manual_call_templates.1.config.mcpServers.figma; no record covers that value, unless a regenerate step that leaves ' +
      '.utcp_config.json out of its outputs wrote it',
  ]);
});

test('an entry set that adds or writes into an item it also removes is refused and writes nothing', (t) => {
  const seed = canonical(utcpDocument(MANUALS), '  ', '\n');
  const fixture = createUtcpFixture(t, seed, [
    { op: 'appendItems', path: ['manual_call_templates'], identityKey: 'name', items: [{ name: 'linear' }] },
    removeManuals(['notion', 'linear']),
  ]);

  const applied = fixture.run(['apply']);
  assert.notEqual(applied.code, 0, applied.output);
  assert.match(applied.output, /removeItems and appendItems at manual_call_templates both name "linear"/);
  assert.equal(fixture.readLive(), seed);

  // A key written on an item the same set removes would leave the next apply no item to write it on.
  assert.throws(() => engine.applyJsonOperations(seed, { operations: [
    { op: 'setKeyOnItem', path: ['manual_call_templates'], identityKey: 'name', match: { name: 'notion' }, key: 'k', value: 1 },
    removeManuals(['notion']),
  ] }, { canReplaceExisting: true }), /removeItems and setKeyOnItem at manual_call_templates both name "notion"/);
});

test('removeItems refuses a path that is not an array, a bad item list, keyless items and a duplicated name', () => {
  const text = canonical(utcpDocument(['a', 'b']), '  ', '\n');
  const run = (operation, source = text) => engine.applyJsonOperations(source, { operations: [operation] },
    { canReplaceExisting: true });

  assert.throws(() => run({ op: 'removeItems', path: ['tool_repository'], identityKey: 'name', items: ['a'] }),
    /removeItems at tool_repository needs an array there, and the file holds an object/);
  assert.throws(() => run({ op: 'removeItems', path: ['manual_call_templates'], identityKey: 'name', items: [{ name: 'a' }] }),
    /removeItems at manual_call_templates lists \{"name":"a"\}; its items are the name values to remove/);
  assert.throws(() => run({ op: 'removeItems', path: ['manual_call_templates'], identityKey: 'name', items: [] }),
    /removeItems at manual_call_templates lists no items/);
  const mixed = '{\n  "list": [\n    {\n      "name": "a"\n    },\n    "b"\n  ]\n}\n';
  assert.throws(() => run({ op: 'removeItems', path: ['list'], identityKey: 'name', items: ['a'] }, mixed),
    /removeItems at list matches by name, but the array holds a string item/);
  const twice = canonical(utcpDocument(['a', 'b', 'a']), '  ', '\n');
  assert.throws(() => run({ op: 'removeItems', path: ['manual_call_templates'], identityKey: 'name', items: ['a'] }, twice),
    /removeItems of "a" at manual_call_templates matches 2 items/);
});

test('a keyed removeItems judges a missing name against a pinned copy that holds a keyless item', () => {
  // The live list is keyed, but the pin's list also held a plain string, which
  // carries no keys and so cannot carry the name; it is passed over, not read.
  const live = canonical(utcpDocument(['a', 'c']), '  ', '\n');
  const pinned = '{\n  "manual_call_templates": [\n    {\n      "name": "a"\n    },\n    "b",\n    [\n      "b"\n    ]\n  ]\n}\n';
  const warnings = [];
  const output = engine.applyJsonOperations(live, { operations: [removeManuals(['b'])] }, {
    canReplaceExisting: true,
    readUpstreamText: () => pinned,
    onWarning: (message) => warnings.push(message),
  });
  assert.equal(output, live);
  assert.deepEqual(warnings, [
    'removeItems of "b" at manual_call_templates finds no such item in the pinned copy, ' +
      "so it removes nothing; drop it from the operation's items",
  ]);
});

test('an insert anchored before an item the same entry set removes is refused and writes nothing', (t) => {
  const seed = canonical(utcpDocument(MANUALS), '  ', '\n');
  const fixture = createUtcpFixture(t, seed, [
    { op: 'insertItems', path: ['manual_call_templates'], identityKey: 'name', before: { name: 'notion' },
      items: [{ name: 'linear' }] },
    removeManuals(['notion']),
  ]);

  const applied = fixture.run(['apply']);
  assert.notEqual(applied.code, 0, applied.output);
  assert.match(applied.output,
    /removeItems and insertItems at manual_call_templates both name "notion"; one entry set cannot anchor an item before one it removes/);
  assert.match(applied.output, /Next: point the before anchor at an item the entry set keeps, or drop the item from one of the two operations in /);
  assert.equal(fixture.readLive(), seed);

  // An append names the same anchor and meets the same refusal.
  assert.throws(() => engine.applyJsonOperations(seed, { operations: [
    { op: 'appendItems', path: ['manual_call_templates'], identityKey: 'name', before: { name: 'figma' }, items: [{ name: 'x' }] },
    removeManuals(['figma']),
  ] }, { canReplaceExisting: true }), /removeItems and appendItems at manual_call_templates both name "figma"/);
});
