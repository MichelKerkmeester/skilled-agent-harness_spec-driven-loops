// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode V2 Registration Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { after, test } = require('node:test');

const { readInventory } = require('./helpers/plugin-inventory.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURE
// ─────────────────────────────────────────────────────────────────────────────

const TEST_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'v2-registration-'));
const GOAL_STATE_DIR = path.join(TEST_ROOT, 'goal-state');
const ORIGINAL_GOAL_STATE_DIR = process.env.OPENCODE_GOAL_STATE_DIR;

process.env.OPENCODE_GOAL_STATE_DIR = GOAL_STATE_DIR;

const PLUGIN_NAMES = readInventory().bridged;

const PLUGIN_DIR = path.resolve(__dirname, '..');
const WORKTREE_ROOT = path.resolve(__dirname, '..', '..', '..');

async function* emptyEventStream() {}

function createStubContext() {
  const registrations = [];
  const record = (registration) => (...args) => {
    registrations.push({ registration, args });
  };

  return {
    context: {
      location: { directory: WORKTREE_ROOT },
      tool: {
        hook: record('tool.hook'),
        transform: record('tool.transform'),
      },
      event: {
        subscribe(...args) {
          registrations.push({ registration: 'event.subscribe', args });
          return emptyEventStream();
        },
      },
      session: { hook: record('session.hook') },
    },
    registrations,
  };
}

after(() => {
  if (ORIGINAL_GOAL_STATE_DIR === undefined) {
    delete process.env.OPENCODE_GOAL_STATE_DIR;
  } else {
    process.env.OPENCODE_GOAL_STATE_DIR = ORIGINAL_GOAL_STATE_DIR;
  }
  fs.rmSync(TEST_ROOT, { recursive: true, force: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. REGISTRATION CASES
// ─────────────────────────────────────────────────────────────────────────────

test('the inventory names at least one bridged plugin', () => {
  assert.ok(PLUGIN_NAMES.length > 0);
});

for (const pluginName of PLUGIN_NAMES) {
  test(`${pluginName} registers v2 hooks`, async () => {
    const pluginUrl = pathToFileURL(path.join(PLUGIN_DIR, `${pluginName}.js`)).href;
    const plugin = (await import(pluginUrl)).default;

    assert.ok(
      plugin !== null && typeof plugin === 'object' && !Array.isArray(plugin),
      `${pluginName} default export must be a non-function object`,
    );
    assert.equal(
      Object.getPrototypeOf(plugin),
      Object.prototype,
      `${pluginName} default export must be a plain object`,
    );
    assert.equal(typeof plugin.id, 'string', `${pluginName} must have a string id`);
    assert.equal(typeof plugin.setup, 'function', `${pluginName} must have a setup function`);
    assert.equal(typeof plugin.server, 'function', `${pluginName} must have a server function`);

    const { context: stubCtx, registrations } = createStubContext();
    const cleanup = await plugin.setup(stubCtx);

    assert.ok(registrations.length > 0, `${pluginName} must register at least one v2 hook`);
    assert.equal(typeof cleanup, 'function', `${pluginName} setup must return a cleanup function`);
  });
}
