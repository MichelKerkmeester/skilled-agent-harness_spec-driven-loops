// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Adapter Tests - Overlay Guard (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Each test runs the real plugin from a copy of it placed inside a vendored
// fixture tree, with a real overlay manifest and the real overlay engine, so the
// refusal matched here is the line an agent receives rather than a stub of it.

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const HOOK_SOURCE = path.resolve(HERE, '..');
const SHARED_SOURCE = path.resolve(HOOK_SOURCE, '..', 'shared');
const REPO_ROOT = path.resolve(HOOK_SOURCE, '..', '..', '..');
const PLUGIN_DIR = path.join(REPO_ROOT, '.opencode', 'plugins');
const ENGINE_SOURCE = path.join(REPO_ROOT, '.skilled', 'commands', 'doctor', 'scripts', 'overlay-engine.cjs');
const ENGINE_RELATIVE = path.join('.skilled', 'commands', 'doctor', 'scripts', 'overlay-engine.cjs');
const OWNED = path.posix.join('.skilled', 'owned', 'target.txt');
const NEW_FILE = path.posix.join('.skilled', 'fresh', 'new.txt');
const OUTSIDE = 'notes.md';
const OVERLAY_SOURCE = 'files/owned.txt';
// The plugin logs under the tree's source root. A fixture's authored skill tree
// arrives as the .opencode link, so that is the source root it picks.
const LOG_RELATIVE = path.join('.opencode', 'logs', 'overlay-guard.log');
// Point the flag resolver at an absent config so nothing persisted on this
// machine can silence the guard and hide the refusal these tests assert on.
const ABSENT_FLAGS_CONFIG = path.join(os.tmpdir(), 'overlay-guard-opencode-absent-hook-flags.env');

const MANIFEST = {
  schemaVersion: 1,
  pin: { upstream: 'fixture', commit: 'pin-one' },
  overlays: [{ id: 'owned', scope: 'file', source: OVERLAY_SOURCE, destination: OWNED }],
};
const STRICT_MANIFEST = {
  ...MANIFEST,
  strictWrites: true,
  generated: ['.skilled/generated/**'],
};

const fixtures = [];
after(() => {
  for (const dir of fixtures) fs.rmSync(dir, { recursive: true, force: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// 1. HOOK FLAGS
// ─────────────────────────────────────────────────────────────────────────────

const ORIGINAL_FLAGS_CONFIG = process.env.HOOK_FLAGS_CONFIG;
const ORIGINAL_HOOKS_DISABLED = process.env.SYSTEM_HOOKS_DISABLED;
const ORIGINAL_GUARD_DISABLED = process.env.SYSTEM_OVERLAY_GUARD_DISABLED;

process.env.HOOK_FLAGS_CONFIG = ABSENT_FLAGS_CONFIG;
delete process.env.SYSTEM_HOOKS_DISABLED;
delete process.env.SYSTEM_OVERLAY_GUARD_DISABLED;

after(() => {
  for (const [key, value] of [
    ['HOOK_FLAGS_CONFIG', ORIGINAL_FLAGS_CONFIG],
    ['SYSTEM_HOOKS_DISABLED', ORIGINAL_HOOKS_DISABLED],
    ['SYSTEM_OVERLAY_GUARD_DISABLED', ORIGINAL_GUARD_DISABLED],
  ]) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

function writeFile(root, relative, text) {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
}

/**
 * A vendored tree with the engine, the hook tree, the plugin where OpenCode
 * loads it, and an overlay that owns one file.
 * @param {{overlays?: boolean, manifest?: object, manifestText?: string}} [options]
 *   `overlays: false` leaves out the setting and the folder, so the tree
 *   carries no manifest; `manifestText` writes that text verbatim instead of a
 *   serialised manifest, which is how a tree carries an unreadable one.
 * @returns {string} The tree root, realpath-resolved.
 */
function makeTree(options = {}) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'overlay-guard-opencode-')));
  fixtures.push(root);
  fs.mkdirSync(path.dirname(path.join(root, ENGINE_RELATIVE)), { recursive: true });
  fs.copyFileSync(ENGINE_SOURCE, path.join(root, ENGINE_RELATIVE));
  // The adapters find the tree root and the engine from their own location, so
  // the fixture carries the hook tree exactly as a vendoring project would.
  fs.cpSync(HOOK_SOURCE, path.join(root, '.skilled', 'hooks', 'overlay-guard'), { recursive: true });
  fs.cpSync(SHARED_SOURCE, path.join(root, '.skilled', 'hooks', 'shared'), { recursive: true });
  // OpenCode's own layout: real plugins in .opencode/plugins, and .opencode/hooks
  // one link back to the hook tree, which is what keeps the core's own idea of
  // the tree root pointing at this fixture.
  const pluginsDir = path.join(root, '.opencode', 'plugins');
  fs.mkdirSync(pluginsDir, { recursive: true });
  fs.copyFileSync(path.join(PLUGIN_DIR, 'overlay-guard.js'), path.join(pluginsDir, 'overlay-guard.js'));
  // The bridge, its type dependency and the shared root resolver stay where they
  // are installed, so the module graph resolves without a second copy of the
  // skill tree and node_modules.
  fs.symlinkSync(path.join(PLUGIN_DIR, 'lib'), path.join(pluginsDir, 'lib'), 'dir');
  fs.symlinkSync(path.join(REPO_ROOT, '.opencode', 'skills'), path.join(root, '.opencode', 'skills'), 'dir');
  fs.symlinkSync(path.join('..', '.skilled', 'hooks'), path.join(root, '.opencode', 'hooks'), 'dir');
  writeFile(root, OWNED, 'owned\n');
  if (options.overlays !== false) {
    writeFile(root, '.skilled-overlays.json', JSON.stringify({ overlayDir: 'skilled-overlays' }) + '\n');
    writeFile(root, path.join('skilled-overlays', OVERLAY_SOURCE), 'overlay version\n');
    const manifestText = options.manifestText ?? JSON.stringify(options.manifest ?? MANIFEST, null, 2) + '\n';
    writeFile(root, path.join('skilled-overlays', 'overlay-manifest.json'), manifestText);
  }
  return root;
}

/** The plugin's hooks, loaded from the copy the fixture would really load. */
async function loadHooks(root) {
  const pluginUrl = pathToFileURL(path.join(root, '.opencode', 'plugins', 'overlay-guard.js')).href;
  const plugin = (await import(pluginUrl)).default;
  return plugin.server({ directory: root });
}

/** A `tool.execute.before` call the way OpenCode hands one to a plugin. */
function fire(hooks, tool, args) {
  return hooks['tool.execute.before']({ tool, sessionID: 'fixture-session', callID: 'fixture-call' }, { args });
}

const REFUSAL = { message: /^refuse:/u };

// ─────────────────────────────────────────────────────────────────────────────
// 3. CASES
// ─────────────────────────────────────────────────────────────────────────────

test('a write tool naming an overlay-owned file is refused with the engine line', async () => {
  const hooks = await loadHooks(makeTree());
  await assert.rejects(fire(hooks, 'write', { filePath: OWNED }), {
    message: /^refuse: \.skilled\/owned\/target\.txt is owned by skilled-overlays\/files\/owned\.txt/u,
  });
});

test('with strictWrites on, a write tool naming a new unowned file under .skilled is refused', async () => {
  const hooks = await loadHooks(makeTree({ manifest: STRICT_MANIFEST }));
  await assert.rejects(fire(hooks, 'edit', { filePath: NEW_FILE }), {
    message: /is a new file in the vendored tree.* apply --adopt \.skilled\/fresh$/u,
  });
});

test('a write tool naming a file outside every vendored root is allowed', async () => {
  const hooks = await loadHooks(makeTree({ manifest: STRICT_MANIFEST }));
  await fire(hooks, 'write', { filePath: OUTSIDE });
});

test('a tool that writes no file is allowed without consulting the core', async () => {
  const hooks = await loadHooks(makeTree());
  // The same arguments through a write tool are refused on this very tree, so a
  // core that was consulted for the shell call would refuse it too.
  await assert.rejects(fire(hooks, 'write', { filePath: OWNED }), REFUSAL);
  await fire(hooks, 'bash', { filePath: OWNED });
});

test('a tree with no overlay manifest is left alone', async () => {
  const hooks = await loadHooks(makeTree({ overlays: false }));
  await fire(hooks, 'write', { filePath: OWNED });
});

test('an apply_patch call whose patch body names an overlay-owned file is refused with the engine line', async () => {
  const hooks = await loadHooks(makeTree());
  const patchText = '*** Begin Patch\n*** Update File: .skilled/owned/target.txt\n@@\n-owned\n+changed\n*** End Patch';
  await assert.rejects(fire(hooks, 'apply_patch', { patchText }), {
    message: /^refuse: \.skilled\/owned\/target\.txt is owned by skilled-overlays\/files\/owned\.txt/u,
  });
});

test('an apply_patch call whose patch body names only a file outside every vendored root is allowed', async () => {
  const hooks = await loadHooks(makeTree({ manifest: STRICT_MANIFEST }));
  await fire(hooks, 'apply_patch', { patchText: `*** Begin Patch\n*** Add File: ${OUTSIDE}\n+note\n*** End Patch` });
});

test('a write tool whose content looks like a patch naming an overlay-owned file is allowed', async () => {
  const hooks = await loadHooks(makeTree({ manifest: STRICT_MANIFEST }));
  const content = `*** Begin Patch\n*** Update File: ${OWNED}\n*** End Patch\n`;
  // The same body through a patch tool is refused on this very tree, so a
  // write tool that read its content as a patch would refuse the call below.
  await assert.rejects(fire(hooks, 'apply_patch', { patchText: content }), REFUSAL);
  await fire(hooks, 'write', { filePath: OUTSIDE, content });
});

test('a manifest the core cannot read allows the write and logs the reason once', async () => {
  const root = makeTree({ manifestText: '{"schemaVersion": 1,"overlays": [\n' });
  const hooks = await loadHooks(root);
  await fire(hooks, 'write', { filePath: OWNED });
  const lines = fs.readFileSync(path.join(root, LOG_RELATIVE), 'utf8').split('\n').filter(Boolean);
  assert.equal(lines.length, 1);
  assert.match(lines[0], /could not judge/u);
});
