#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ opencode-compat-layout.test — The shipped .opencode matches its manifest ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { describe, test } = require('node:test');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

// `.opencode` is a real directory of relative per-entry links onto `.skilled`, plus the
// few entries this runtime owns. A single whole-directory link, a link that points off
// the tree or a manifest row that no longer matches the disk each break something the
// resolver tests cannot see, because they build their own trees. This reads the shipped
// one, and takes the expected shape from the inventory table in SYNC.md, so the layout
// and its documentation fail together when either drifts.
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const COMPAT_ROOT = path.join(REPO_ROOT, '.opencode');
const MANIFEST_PATH = path.join(COMPAT_ROOT, 'SYNC.md');

// Written by the runtime at install time and never tracked, so a fresh checkout may lack them.
const INSTALL_TIME = new Set(['node_modules', '.gitignore', 'bun.lock']);

function readInventory() {
  const text = fs.readFileSync(MANIFEST_PATH, 'utf8');
  const section = text.split(/^## 2\. SURFACE INVENTORY$/m)[1].split(/^## 3\./m)[0];
  const rows = [];
  for (const line of section.split('\n')) {
    const cells = line.split('|').map((cell) => cell.trim());
    if (cells.length < 5 || !cells[1].startsWith('`')) continue;
    const names = [...cells[1].matchAll(/`([^`]+)`/g)].map((match) => match[1]);
    const source = (cells[3].match(/^`([^`]+)`$/) || [])[1] || null;
    for (const name of names) rows.push({ name, mechanism: cells[2], source });
  }
  return rows;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. LAYOUT
// ─────────────────────────────────────────────────────────────────────────────

describe('the shipped .opencode directory matches its sync manifest', () => {
  const inventory = readInventory();

  test('.opencode is a real directory, never one link to the whole tree', () => {
    assert.equal(fs.lstatSync(COMPAT_ROOT).isDirectory(), true);
    assert.ok(inventory.length >= 10, `inventory parsed only ${inventory.length} rows`);
  });

  test('every entry on disk is listed in the manifest', () => {
    const listed = new Set(inventory.map((row) => row.name));
    const unlisted = fs.readdirSync(COMPAT_ROOT).filter((name) => !listed.has(name));
    assert.deepEqual(unlisted, []);
  });

  for (const row of inventory) {
    const entry = path.join(COMPAT_ROOT, row.name);
    const optional = INSTALL_TIME.has(row.name);
    test(`${row.name}: ${row.mechanism}`, { skip: optional && !fs.existsSync(entry) ? 'written at install time' : false }, () => {
      const stat = fs.lstatSync(entry);
      if (row.mechanism === 'relative symlink') {
        assert.equal(stat.isSymbolicLink(), true, `${row.name} is not a link`);
        assert.equal(fs.readlinkSync(entry), row.source, `${row.name} points somewhere the manifest does not say`);
        assert.equal(row.source.startsWith('../.skilled/'), true, `${row.name} points off the source tree`);
        assert.equal(fs.existsSync(entry), true, `${row.name} does not resolve`);
      } else if (/authored here|real directory/.test(row.mechanism)) {
        assert.equal(stat.isDirectory(), true, `${row.name} is not a real directory`);
      } else {
        assert.equal(stat.isFile(), true, `${row.name} is not a real file`);
      }
    });
  }

  test('.skilled/plugins links back to the plugins authored here', () => {
    const link = path.join(REPO_ROOT, '.skilled', 'plugins');
    assert.equal(fs.lstatSync(link).isSymbolicLink(), true);
    assert.equal(fs.readlinkSync(link), '../.opencode/plugins');
    assert.equal(fs.realpathSync(link), fs.realpathSync(path.join(COMPAT_ROOT, 'plugins')));
  });

  test('package.json gives the plugins their module type and their SDK', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(COMPAT_ROOT, 'package.json'), 'utf8'));
    assert.equal(manifest.type, 'module');
    assert.ok(manifest.dependencies && manifest.dependencies['@opencode-ai/plugin'], 'no plugin SDK dependency');
  });

  const installed = fs.existsSync(path.join(COMPAT_ROOT, 'node_modules'));
  // The SDK exports ES modules only, so it is resolved the way a plugin imports it: as a
  // module whose own location is the plugins directory.
  test('a plugin resolves the SDK from beside it', { skip: installed ? false : 'run npm ci in .opencode first' }, () => {
    const probe = spawnSync(process.execPath, ['--input-type=module', '-e', "process.stdout.write(import.meta.resolve('@opencode-ai/plugin'))"], {
      cwd: path.join(COMPAT_ROOT, 'plugins'),
      encoding: 'utf8',
    });
    assert.equal(probe.status, 0, probe.stderr);
    const resolved = fs.realpathSync(new URL(probe.stdout).pathname);
    assert.equal(resolved.startsWith(fs.realpathSync(path.join(COMPAT_ROOT, 'node_modules')) + path.sep), true, resolved);
  });

  test('the MCP launcher opencode.json names resolves under the source tree', () => {
    const config = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'opencode.json'), 'utf8'));
    const named = JSON.stringify(config).match(/\.skilled\/bin\/[A-Za-z0-9._-]+/g) || [];
    assert.ok(named.length > 0, 'opencode.json names no launcher under .skilled/bin');
    for (const relative of new Set(named)) {
      assert.equal(fs.existsSync(path.join(REPO_ROOT, relative)), true, `${relative} does not resolve`);
    }
  });
});
