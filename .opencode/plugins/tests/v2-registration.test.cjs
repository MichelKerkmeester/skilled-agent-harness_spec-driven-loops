// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode V2 Registration Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test } = require('node:test');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURE
// ─────────────────────────────────────────────────────────────────────────────

const PLUGIN_NAMES = [
  'classifier-injection-screen',
  'cli-dispatch-audit',
  'codex-hooks-watchdog',
  'mcp-route-guard',
  'session-cleanup',
  'sk-code-post-edit-quality',
  'sk-git-message-gate',
  'sk-git-preflight-advisory',
  'system-deep-loop-guard',
  'system-dist-freshness-guard',
  'system-speckit-completion',
];

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

// ─────────────────────────────────────────────────────────────────────────────
// 3. REGISTRATION CASES
// ─────────────────────────────────────────────────────────────────────────────

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
