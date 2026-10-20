// ───────────────────────────────────────────────────────────────────
// MODULE: Plugin Inventory Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { after, test } = require('node:test');
const { pathToFileURL } = require('node:url');

const {
  PLUGIN_DIR,
  handledEventNames,
  readInventory,
  readManifest,
  unscannedEventChecks,
} = require('./helpers/plugin-inventory.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TEST_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'plugin-inventory-'));
const GOAL_STATE_DIR = path.join(TEST_ROOT, 'goal-state');
const ORIGINAL_GOAL_STATE_DIR = process.env.OPENCODE_GOAL_STATE_DIR;

process.env.OPENCODE_GOAL_STATE_DIR = GOAL_STATE_DIR;

after(() => {
  if (ORIGINAL_GOAL_STATE_DIR === undefined) {
    delete process.env.OPENCODE_GOAL_STATE_DIR;
  } else {
    process.env.OPENCODE_GOAL_STATE_DIR = ORIGINAL_GOAL_STATE_DIR;
  }
  fs.rmSync(TEST_ROOT, { recursive: true, force: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

async function* emptyEventStream() {}

function createV2Context() {
  const directory = fs.mkdtempSync(path.join(TEST_ROOT, 'project-'));
  return {
    location: { directory },
    tool: {
      hook: () => ({ dispose() {} }),
      transform: () => ({ dispose() {} }),
    },
    event: { subscribe: () => emptyEventStream() },
    session: { hook: () => ({ dispose() {} }) },
  };
}

function readPluginSource(stem) {
  return fs.readFileSync(path.join(PLUGIN_DIR, `${stem}.js`), 'utf8');
}

function listedEvents(manifest) {
  return [
    ...manifest.events.passThrough,
    ...manifest.events.notDelivered,
    ...manifest.events.unverified,
  ];
}

async function loadBridge() {
  return import(pathToFileURL(path.join(PLUGIN_DIR, 'lib', 'v2-bridge.js')).href);
}

function knownEventNames(bridge, manifest) {
  return new Set([
    ...Object.values(bridge.EVENT_ALIASES),
    ...Object.values(bridge.EVENT_MAPPINGS).map((mapping) => mapping.type),
    ...listedEvents(manifest).map((entry) => entry.event),
  ]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. INVENTORY CASES
// ─────────────────────────────────────────────────────────────────────────────

test('the plugin folder matches the inventory manifest', () => {
  const inventory = readInventory();
  assert.deepEqual(inventory.problems, []);
});

test('readInventory reports an unlisted file, a missing manifest file and a bridged exception', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'plugin-inventory-probe-'));
  try {
    fs.mkdirSync(path.join(tempDir, 'tests'), { recursive: true });
    fs.writeFileSync(
      path.join(tempDir, 'tests', 'plugin-inventory.json'),
      JSON.stringify({
        nativeDual: [
          { file: 'gone.js', reason: 'x' },
          { file: 'both.js', reason: 'x' },
        ],
        skippedHooks: [],
        events: { passThrough: [], notDelivered: [], unverified: [] },
      }),
      'utf8',
    );
    fs.writeFileSync(path.join(tempDir, 'probe.js'), 'export default {};\n', 'utf8');
    fs.writeFileSync(
      path.join(tempDir, 'both.js'),
      "export default dualPlugin('both', f);\n",
      'utf8',
    );

    const inventory = readInventory(tempDir);
    const expected = [
      'probe.js is not bridged and not listed as a native-dual exception',
      'gone.js is listed as native-dual but has no file',
      'both.js is bridged and also listed as native-dual',
    ];

    assert.equal(inventory.problems.length, 3);
    for (const message of expected) {
      assert.equal(
        inventory.problems.filter((problem) => problem === message).length,
        1,
        message,
      );
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. BRIDGE COVERAGE CASES
// ─────────────────────────────────────────────────────────────────────────────

test('every bridged plugin maps all of its hooks', async () => {
  const manifest = readManifest();
  const inventory = readInventory();

  for (const stem of inventory.bridged) {
    const pluginUrl = pathToFileURL(path.join(PLUGIN_DIR, `${stem}.js`)).href;
    const plugin = (await import(pluginUrl)).default;
    const cleanup = await plugin.setup(createV2Context());
    const expectedKeys = manifest.skippedHooks
      .filter((entry) => entry.file === `${stem}.js`)
      .map((entry) => entry.key)
      .sort();

    try {
      assert.deepEqual([...cleanup.skippedKeys], expectedKeys, `${stem}.js unmapped hooks`);
    } finally {
      await cleanup();
    }
  }
});

test('every handled event name reaches v2 plugins or is listed', async () => {
  const bridge = await loadBridge();
  const manifest = readManifest();
  const inventory = readInventory();
  const known = knownEventNames(bridge, manifest);

  for (const stem of inventory.bridged) {
    for (const name of handledEventNames(readPluginSource(stem))) {
      assert.ok(
        known.has(name),
        `${stem}.js handles ${name}, which the bridge neither maps nor aliases and the manifest does not list`,
      );
    }
  }
});

test('every event an unscanned check covers reaches v2 plugins or is listed', async () => {
  const bridge = await loadBridge();
  const manifest = readManifest();
  const known = knownEventNames(bridge, manifest);

  for (const entry of manifest.unscannedEventChecks) {
    for (const name of entry.events ?? []) {
      assert.ok(
        known.has(name),
        `${entry.file} ${entry.check} covers ${name}, which the bridge neither maps nor aliases and the manifest does not list`,
      );
    }
  }
});

test('every listed event is still handled by a plugin', () => {
  const manifest = readManifest();
  const inventory = readInventory();
  const handled = new Set();

  for (const stem of inventory.bridged) {
    for (const name of handledEventNames(readPluginSource(stem))) handled.add(name);
  }

  for (const entry of listedEvents(manifest)) {
    assert.ok(
      handled.has(entry.event),
      `${entry.event} is listed in the manifest but no bridged plugin handles it`,
    );
  }
});

test('every listed skipped hook names a bridged plugin', () => {
  const manifest = readManifest();
  const inventory = readInventory();

  for (const entry of manifest.skippedHooks) {
    const stem = entry.file.replace(/\.js$/, '');
    assert.ok(
      inventory.bridged.includes(stem),
      `${entry.file} lists a skipped hook but is not a bridged plugin`,
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. EVENT SCAN CASES
// ─────────────────────────────────────────────────────────────────────────────

test('handledEventNames reads both quote styles, both orders and case labels', () => {
  const source = `if (type === 'a.one') {} if (event.type !== "b.two") {} if ('c.three' === eventType) {} if (type === \`f.six\`) {} switch (eventType) { case 'd.four': case "e.five": } if (event['type'] === 'j.one') {} if (event?.["type"] !== 'j.two') {} // if (type === 'g.seven') {}`;

  assert.deepEqual(handledEventNames(source), [
    'a.one',
    'b.two',
    'c.three',
    'd.four',
    'e.five',
    'f.six',
    'j.one',
    'j.two',
  ]);
});

// An escaped name is decoded, not compared as written.
test('handledEventNames reads an escaped event name as the name it spells', () => {
  assert.deepEqual(handledEventNames(`if (event.type === "session\\u002ebogus") {}`), ['session.bogus']);
});

// Comment and string text is data, never a check.
test('comment and string text is never read as an event check', () => {
  const source = `const note = "case 'session.bogus':"; const doc = \`if (type === 'z.one') {}\`; // case 'x.y':\n/* if (type === 'w.two') {} */`;
  assert.deepEqual(handledEventNames(source), []);
  assert.deepEqual(unscannedEventChecks(source), []);
});

// A case label counts only under a switch on the event type.
test('a case label counts only under a switch on the event type', () => {
  const source = `switch (mode) { case 'session.bogus': } switch (event.type) { case 'session.idle': }`;
  assert.deepEqual(handledEventNames(source), ['session.idle']);
});

// A collection that changes after it is built is not trusted.
test('a collection that is changed after it is built is reported, not trusted', () => {
  const source =
    `const EVENTS = ['session.idle']; EVENTS.push('session.bogus'); if (EVENTS.includes(eventType)) {}\n` +
    `const KNOWN = new Set(['session.created']); KNOWN.add('session.bogus'); if (KNOWN.has(eventType)) {}\n` +
    `const SHARED = ['session.deleted']; register(SHARED); if (SHARED.includes(eventType)) {}`;
  assert.deepEqual(handledEventNames(source), []);
  assert.deepEqual(unscannedEventChecks(source), [
    'EVENTS.includes(eventType)',
    'KNOWN.has(eventType)',
    'SHARED.includes(eventType)',
  ]);
});

// An alias declared from the event type reads like the type itself.
test('an alias of the event type is read like the type itself', () => {
  assert.deepEqual(
    handledEventNames(`const t = event.type; if (t === 'a.alias') {} const { type: kind } = event; if (kind === 'b.alias') {}`),
    ['a.alias', 'b.alias'],
  );
});

// A write through an allow-listed member still changes the collection.
test('a write through a collection member makes the collection untrusted', () => {
  const source =
    `const A = ['session.idle']; A.length = 0; if (A.includes(eventType)) {}\n` +
    `const B = new Set(['session.created']); B.has = () => true; if (B.has(eventType)) {}`;
  assert.deepEqual(handledEventNames(source), []);
  assert.deepEqual(unscannedEventChecks(source), ['A.includes(eventType)', 'B.has(eventType)']);
});

// A shadowed or reassigned name no longer carries the event type.
test('an alias that is shadowed or reassigned is not an alias', () => {
  const source =
    `const t = event.type; function f(t) { if (t === 'x.shadow') {} }\n` +
    `let k = event.type; k = other; if (k === 'x.reassigned') {}`;
  assert.deepEqual(handledEventNames(source), []);
});

// Destructuring binds the type field in parameters and in defaults too.
test('a destructured type field is read in parameters and with defaults', () => {
  const source =
    `function onEvent({ type: kind }) { if (kind === 'p.param') {} }\n` +
    `const { type: name = 'none' } = event; if (name === 'p.default') {}`;
  assert.deepEqual(handledEventNames(source), ['p.default', 'p.param']);
});

// A local Set or Object must not be mistaken for the built-in that builds a literal collection.
test('a local Set or Object is not trusted to build a literal collection', () => {
  const source =
    `const Set = class { has() { return false; } }; const S = new Set(['s.one']); if (S.has(eventType)) {}\n` +
    `function g(Object) { const F = Object.freeze(['s.two']); if (F.includes(eventType)) {} }`;
  assert.deepEqual(handledEventNames(source), []);
  assert.deepEqual(unscannedEventChecks(source), ['F.includes(eventType)', 'S.has(eventType)']);
});

// A parameter binding hides the outer collection at the check, so its receiver is unresolved.
test('a same-named parameter does not stand in for an outer collection', () => {
  const source = `const KNOWN = new Set(['o.outer']); function f(KNOWN) { if (KNOWN.has(eventType)) {} }`;
  assert.deepEqual(handledEventNames(source), []);
  assert.deepEqual(unscannedEventChecks(source), ['KNOWN.has(eventType)']);
});

// A parameter elsewhere is a different binding, so the outer alias still reads true.
test('an unrelated same-named parameter does not cancel an outer alias', () => {
  const source = `const t = event.type; if (t === 'o.alias') {} function f(t) { return t; }`;
  assert.deepEqual(handledEventNames(source), ['o.alias']);
});

// Writing the alias in a loop means it no longer holds the event type at the check.
test('a for-of loop that writes an alias cancels it', () => {
  const source = `let kind = event.type; for (kind of others) {} if (kind === 'o.loop') {}`;
  assert.deepEqual(handledEventNames(source), []);
});

// A member the collection kind does not have cannot cover the events it lists.
test('a membership method that does not fit the collection is reported', () => {
  const source = `const A = ['m.array']; if (A.has(eventType)) {} const S = new Set(['m.set']); if (S.includes(eventType)) {}`;
  assert.deepEqual(handledEventNames(source), []);
  assert.deepEqual(unscannedEventChecks(source), ['A.has(eventType)', 'S.includes(eventType)']);
});

// A helper that receives the type inside a test decides a branch the scan cannot read.
test('a helper that receives the event type inside a test is reported', () => {
  const source = `if (isKnown(eventType)) {} const ok = !matches(event.type) ? 1 : 2; log(eventType);`;
  assert.deepEqual(unscannedEventChecks(source), ['isKnown(eventType)', 'matches(event.type)']);
});

// A type passed through a call in a comparison, switch or membership check still selects events.
test('a wrapped event type is reported in comparisons, switches and membership checks', () => {
  const source =
    `const KNOWN = new Set(['w.one']); if (KNOWN.has(normalize(eventType))) {}\n` +
    `if (normalize(event.type) === 'w.two') {}\n` +
    `switch (eventType.trim()) { case 'w.three': }`;
  assert.deepEqual(handledEventNames(source), []);
  assert.deepEqual(unscannedEventChecks(source), [
    'KNOWN.has(normalize(eventType))',
    "normalize(event.type) === 'w.two'",
    'switch (eventType.trim())',
  ]);
});

// Only the global undefined means no event; a parameter of that name is an ordinary operand.
test('a shadowed undefined is not read as the no-event sentinel', () => {
  const source = `function f(undefined) { if (eventType === undefined) {} } if (type === undefined) {}`;
  assert.deepEqual(unscannedEventChecks(source), ['eventType === undefined']);
});

// A wrapper call around the type does not hide it from the helper-call rule.
test('a helper that receives a wrapped event type inside a test is reported', () => {
  const source = `if (isKnown(normalize(eventType))) {} if (isString(typeof eventType)) {} log(normalize(eventType));`;
  assert.deepEqual(unscannedEventChecks(source), ['isKnown(normalize(eventType))']);
});

// A helper result stored in a name still receives the type when that name decides an if.
test('a stored helper result that decides an if is reported', () => {
  const source = `const ok = isKnown(eventType); if (ok) {}`;
  assert.deepEqual(unscannedEventChecks(source), ['isKnown(eventType)']);
});

// The stored value passes through a logical expression and a reassignment before it decides a loop.
test('a stored helper result behind a logical expression that decides a loop is reported', () => {
  const source = `let seen; seen = await matches(event.type); const go = seen && ready; while (go) {}`;
  assert.deepEqual(unscannedEventChecks(source), ['matches(event.type)']);
});

// A stored result that is only passed along or returned never decides a branch.
test('a stored helper result that never decides a branch is not reported', () => {
  const source = `function run() { const label = describe(eventType); log(label); const n = count(type); return n; }`;
  assert.deepEqual(unscannedEventChecks(source), []);
});

// A read inside a nested function decides that function's branch, so the helper call is reported.
test('a stored helper result read inside a nested function is reported', () => {
  const source = `const hit = check(eventType); function later() { if (hit) {} }`;
  assert.deepEqual(unscannedEventChecks(source), ['check(eventType)']);
});

// A stored helper result that decides a switch discriminant is reported.
test('a stored helper result that decides a switch is reported', () => {
  const source = `const k = classify(eventType); switch (k) { case 1: }`;
  assert.deepEqual(unscannedEventChecks(source), ['classify(eventType)']);
});

// A method that hands the collection to a callback can let that callback change it.
test('a callback method that can reach the collection makes it untrusted', () => {
  const source = `const A = ['c.one']; A.forEach((value, index, all) => { all.length = 0; }); if (A.includes(eventType)) {}`;
  assert.deepEqual(handledEventNames(source), []);
  assert.deepEqual(unscannedEventChecks(source), ['A.includes(eventType)']);
});

// A computed key whose value is statically `type` names the same field as a plain one.
test('a computed static type key is read as the type field', () => {
  const source = `const { ['type']: kind } = event; if (kind === 'c.computed') {}`;
  assert.deepEqual(handledEventNames(source), ['c.computed']);
});

// A parameter is not the event type when every call passes something else.
test('a type-named parameter is not the event type when its calls pass no event type', () => {
  const source = `function format(type) { if (type === 'a.b') {} } format('json'); format(mode);`;
  assert.deepEqual(handledEventNames(source), []);
});

// A parameter that receives the event type in its call still selects events.
test('a type-named parameter that receives the event type reads as the type', () => {
  const source = `function route(type) { if (type === 'r.one') {} } route(event.type);`;
  assert.deepEqual(handledEventNames(source), ['r.one']);
});

// A function with no calls might be called anywhere, so its parameter keeps reading as the type.
test('a type-named parameter of an uncalled function still reads as the type', () => {
  const source = `function lone(type) { if (type === 'r.two') {} }`;
  assert.deepEqual(handledEventNames(source), ['r.two']);
});

// An escaping function can be called anywhere, so its parameter keeps reading as the type.
test('a type-named parameter of an escaping function still reads as the type', () => {
  const source = `function sent(type) { if (type === 'r.three') {} } sent('x'); register(sent);`;
  assert.deepEqual(handledEventNames(source), ['r.three']);
});

// A defaulted parameter is still direct, and a call that omits it passes no event type.
test('a defaulted type-named parameter is not the event type when its call omits it', () => {
  const source = `const pick = (kindType = 'none') => { if (kindType === 'r.four') {} }; pick();`;
  assert.deepEqual(handledEventNames(source), []);
});

// A parameter passed to another type-named parameter is resolved through its own call.
test('a type-named parameter passed to another type-named parameter is resolved', () => {
  const source = `function a(type) { return b(type); } function b(type) { if (type === 'r.five') {} } a(event.type);`;
  assert.deepEqual(handledEventNames(source), ['r.five']);
});

// A recursive call cannot prove the value is not the event type, so the guard fails closed.
test('a type-named parameter that only reaches itself still reads as the type', () => {
  const source = `function loop(type) { if (type === 'r.six') {} loop(type); }`;
  assert.deepEqual(handledEventNames(source), ['r.six']);
});

// A key and a member property are names, not values, so neither carries the event type.
test('a type-named object key and member property are not event values', () => {
  const source = `const result = evaluate({ subagentType: args.subagentType }); if (result.ok) {}`;
  assert.deepEqual(unscannedEventChecks(source), []);
});

// A shorthand property passes its value, so the event type inside it is still read.
test('a shorthand type-named property passes the event type', () => {
  const source = `const seen = isKnown({ eventType }); if (seen) {}`;
  assert.deepEqual(unscannedEventChecks(source), ['isKnown({ eventType })']);
});

// A source the parser cannot read fails loudly instead of passing empty.
test('a source the parser cannot read fails instead of passing empty', () => {
  assert.throws(() => handledEventNames('if (type === '));
});

test('handledEventNames reads names from a resolved collection', () => {
  const source = `const KNOWN = new Set(['h.one', "h.two"]); if (KNOWN.has(eventType)) {} if (['i.one'].includes(eventType)) {} if (new Set(["i.two"]).has(eventType)) {}`;

  assert.deepEqual(handledEventNames(source), ['h.one', 'h.two', 'i.one', 'i.two']);
  assert.deepEqual(unscannedEventChecks(source), []);
});

test('unscannedEventChecks reports checks the scan cannot read', () => {
  const source = `if (eventType === SESSION_IDLE) {} if (eventType === EVENTS.IDLE) {} if (eventType.endsWith('.x')) {} if (eventType.toLowerCase() === 'a.c') {} if (KNOWN.has(eventType)) {} if (OTHER.has(eventType)) {} if (getKnown().has(eventType)) {} if (eventType === \`x.\${y}\`) {} if (type === 'a.b') {} if (type === undefined) {} if (SESSION_IDLE === eventType) {} switch (eventType) { case EVENTS.IDLE: }`;

  assert.deepEqual(unscannedEventChecks(source), [
    'KNOWN.has(eventType)',
    'OTHER.has(eventType)',
    'SESSION_IDLE === eventType',
    'case EVENTS.IDLE:',
    'eventType === EVENTS.IDLE',
    'eventType === SESSION_IDLE',
    'eventType === `x.${y}`',
    "eventType.endsWith('.x')",
    "eventType.toLowerCase() === 'a.c'",
    'getKnown().has(eventType)',
  ]);
});

test('unscannedEventChecks fails closed on forms it cannot resolve', () => {
  const source =
    `if (eventType === (x ? 'z.c' : 'z.d')) {}      // comparison whose operand is not a single literal\n` +
    `switch (eventType) { case getName(): }          // case label that is not a literal\n` +
    `if (eventType in HANDLERS) {}                   // \`in\` test\n` +
    `HANDLERS[eventType]?.()                         // index lookup\n` +
    `if (event['type'] === getName()) {}             // bracket key whose operand is not a literal`;

  assert.deepEqual(unscannedEventChecks(source), [
    'HANDLERS[eventType]',
    'case getName():',
    "eventType === (x ? 'z.c' : 'z.d')",
    'eventType in HANDLERS',
    "event['type'] === getName()",
  ]);
  assert.deepEqual(handledEventNames(source), []);
});

test('every unscanned event check is listed', () => {
  const manifest = readManifest();
  const inventory = readInventory();
  const listed = manifest.unscannedEventChecks;

  for (const stem of inventory.bridged) {
    for (const check of unscannedEventChecks(readPluginSource(stem))) {
      assert.ok(
        listed.some((entry) => entry.file === `${stem}.js` && entry.check === check),
        `${stem}.js has an event check the scan cannot read: ${check}; list it in unscannedEventChecks with a reason`,
      );
    }
  }

  for (const entry of listed) {
    assert.ok(
      Array.isArray(entry.events) && entry.events.length > 0,
      `${entry.file} lists ${entry.check} without the event names it covers`,
    );
    assert.ok(
      unscannedEventChecks(readPluginSource(entry.file.replace(/\.js$/, ''))).includes(entry.check),
      `${entry.file} lists ${entry.check}, which is no longer in the file`,
    );
  }
});
