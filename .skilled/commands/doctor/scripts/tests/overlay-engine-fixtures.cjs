// ───────────────────────────────────────────────────────────────────
// MODULE: Overlay Engine Test Fixtures
// ───────────────────────────────────────────────────────────────────
'use strict';

// Builds throwaway vendored trees for the overlay engine suites. Each tree keeps
// its overlay folder inside the tree root, the way a project vendors Skilled, and
// the engine is run from its real location with --root pointing at the tree.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const ENGINE = path.resolve(__dirname, '..', 'overlay-engine.cjs');
const DEFAULT_OVERLAY_FOLDER = 'skilled-overlays';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function writeFile(root, relativePath, value) {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * Create an empty workspace holding a tree and that tree's overlay folder.
 * @param {object} t The node:test context, used to remove the workspace.
 * @param {string} prefix Temporary folder prefix.
 * @param {{overlayFolder?: string}} [options] A folder named by the setting file.
 * @returns {{workspace: string, tree: string, overlayDir: string, statePath: string,
 *   lockPath: string}}
 */
function createWorkspace(t, prefix, options = {}) {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rmSync(workspace, { recursive: true, force: true }));
  const tree = path.join(workspace, 'tree');
  const folder = options.overlayFolder || DEFAULT_OVERLAY_FOLDER;
  const overlayDir = path.join(tree, folder);
  fs.mkdirSync(overlayDir, { recursive: true });
  if (options.overlayFolder) {
    writeFile(tree, '.skilled-overlays.json', JSON.stringify({ overlayDir: folder }) + '\n');
  }
  return {
    workspace,
    tree,
    overlayDir,
    statePath: path.join(overlayDir, 'sync-state.json'),
    lockPath: path.join(overlayDir, '.build-lock'),
  };
}

function writeManifest(fixture) {
  writeFile(fixture.overlayDir, 'overlay-manifest.json', JSON.stringify(fixture.manifest, null, 2) + '\n');
}

/**
 * Run the engine and return its exit code and combined output.
 * @param {string[]} args Engine arguments.
 * @param {string} cwd Working folder for the run.
 * @returns {{code: number, output: string, stdout: string}}
 */
function runEngine(args, cwd) {
  const result = spawnSync(process.execPath, [ENGINE, ...args], { cwd, encoding: 'utf8' });
  if (result.error) throw result.error;
  return {
    code: result.status,
    output: (result.stdout || '') + (result.stderr || ''),
    stdout: result.stdout || '',
  };
}

/**
 * Build the shared fixture with one overlay of each destination-writing scope.
 * @param {object} t The node:test context.
 * @returns {object} Fixture paths, its manifest and a `run` helper.
 */
function createSyncFixture(t) {
  const fixture = createWorkspace(t, 'overlay-engine-sync-');
  const { overlayDir, tree } = fixture;

  const pinnedFile = Buffer.from('pinned file\n');
  writeFile(overlayDir, 'files/guarded.txt', 'overlay one\n');
  writeFile(tree, 'guarded.txt', pinnedFile);
  writeFile(overlayDir, 'directory-source/readme.md', 'directory one\n');
  writeFile(tree, 'directory-live/readme.md', 'directory one\n');

  const fragment = '\n<!-- BEGIN BLOCK -->\nold block\n<!-- END BLOCK -->\n';
  writeFile(overlayDir, 'marked/base.md', '# Header\n');
  writeFile(overlayDir, 'marked/block.md', fragment);
  writeFile(tree, 'marked.md', '# Header\n');

  const jsonOperations = {
    target: 'settings.json',
    style: { indent: 2, primitiveArrays: 'inline' },
    operations: [{
      op: 'insertObjectKeys',
      path: [],
      entries: [{ key: 'enabled', value: true }],
    }],
  };
  writeFile(overlayDir, 'json/entries.json', JSON.stringify(jsonOperations, null, 2) + '\n');
  writeFile(tree, 'settings.json', '{"name": "widget"}\n');

  writeFile(overlayDir, 'skill-root-source/SKILL.md', 'overlay skill\n');
  writeFile(overlayDir, 'skill-root-source/docs/readme.md', 'owned doc one\n');
  writeFile(tree, 'skill/SKILL.md', 'old skill\n');
  writeFile(tree, 'skill/docs/readme.md', 'old doc\n');
  writeFile(tree, 'skill/docs/vendor-guide.md', 'retained nested vendor file\n');
  writeFile(tree, 'skill/vendor.md', 'retained vendor file\n');

  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: 'pin-one' },
    layoutLinks: [],
    overlays: [
      {
        id: 'guarded-file',
        scope: 'file',
        source: 'files/guarded.txt',
        destination: 'guarded.txt',
        pinnedSha256: sha256(pinnedFile),
        mode: 420,
      },
      {
        id: 'directory-files',
        scope: 'directory',
        source: 'directory-source',
        destination: 'directory-live',
      },
      {
        id: 'marked-block',
        scope: 'marked-section',
        source: 'marked/block.md',
        base: 'marked/base.md',
        fragment: 'marked/block.md',
        destination: 'marked.md',
        beginMarker: '<!-- BEGIN BLOCK -->',
        endMarker: '<!-- END BLOCK -->',
        pinnedSha256: sha256(Buffer.from('# Header\n')),
        mode: 420,
      },
      {
        id: 'json-entry',
        scope: 'json-entry',
        source: 'json/entries.json',
        destination: 'settings.json',
        pinnedSha256: sha256(Buffer.from('{"name": "widget"}\n')),
      },
      {
        id: 'skill-root',
        scope: 'skill-root',
        source: 'skill-root-source',
        destination: 'skill',
        replace: ['SKILL.md', 'docs'],
        remove: [],
        retained: [{ path: 'vendor.md' }, { path: 'docs/vendor-guide.md' }],
      },
    ],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  fixture.run = (args, cwd = fixture.workspace) => runEngine([...args, '--root', tree], cwd);
  return fixture;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  DEFAULT_OVERLAY_FOLDER,
  ENGINE,
  createSyncFixture,
  createWorkspace,
  readJson,
  runEngine,
  sha256,
  writeFile,
  writeManifest,
};
