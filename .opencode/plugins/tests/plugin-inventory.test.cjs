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
  const bridgeUrl = pathToFileURL(path.join(PLUGIN_DIR, 'lib', 'v2-bridge.js')).href;
  const bridge = await import(bridgeUrl);
  const manifest = readManifest();
  const inventory = readInventory();
  const known = new Set([
    ...Object.values(bridge.EVENT_ALIASES),
    ...Object.values(bridge.EVENT_MAPPINGS).map((mapping) => mapping.type),
    ...listedEvents(manifest).map((entry) => entry.event),
  ]);

  for (const stem of inventory.bridged) {
    for (const name of handledEventNames(readPluginSource(stem))) {
      assert.ok(
        known.has(name),
        `${stem}.js handles ${name}, which the bridge neither maps nor aliases and the manifest does not list`,
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
  const source = `if (type === 'a.one') {} if (event.type !== "b.two") {} if ('c.three' === eventType) {} switch (t) { case 'd.four': case "e.five": }`;

  assert.deepEqual(handledEventNames(source), ['a.one', 'b.two', 'c.three', 'd.four', 'e.five']);
});

test('unscannedEventChecks reports checks the scan cannot read', () => {
  const source = `if (eventType === SESSION_IDLE) {} if (eventType.endsWith('.x')) {} if (KNOWN.has(eventType)) {} if (type === 'a.b') {} if (type === undefined) {}`;

  assert.deepEqual(unscannedEventChecks(source), [
    '.has(eventType)',
    'eventType === SESSION_IDLE',
    'eventType.endsWith(',
  ]);
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
      unscannedEventChecks(readPluginSource(entry.file.replace(/\.js$/, ''))).includes(entry.check),
      `${entry.file} lists ${entry.check}, which is no longer in the file`,
    );
  }
});
