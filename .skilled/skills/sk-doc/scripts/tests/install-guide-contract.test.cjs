'use strict';

// Install guides are validated per skill, and nothing authors them centrally any more.
// Two things keep that true. Every surviving INSTALL-GUIDE.md must pass the install-guide
// document class, because a guide that fails it was invisible while nothing swept the
// corpus. And the retired authoring route must not come back through any surface that
// routes to it, the central folder it wrote into included, while the document class
// that validates the surviving guides stays available.

const assert = require('node:assert/strict');
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const SK_DOC = path.resolve(__dirname, '..', '..');
const SOURCE_ROOT = path.resolve(SK_DOC, '..', '..');
const REPO_ROOT = path.resolve(SOURCE_ROOT, '..');
const VALIDATOR = path.join(SK_DOC, 'scripts', 'validate_document.py');
const RETIRED_ROUTE = /install[ _-]?guide|installation guide/i;

// The surfaces a request passes through on its way to an authoring mode: the hub's
// router and registry, the command catalog, the compiled route manifest, the README
// mode itself and the create command that dispatches to it.
const ROUTING_SURFACES = [
  'skills/sk-doc/command-metadata.json',
  'skills/sk-doc/mode-registry.json',
  'skills/sk-doc/hub-router.json',
  'skills/sk-doc/ROUTER.md',
  'skills/sk-doc/leaf-aliases.json',
  'skills/sk-doc/sk-create-readme/SKILL.md',
  'bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json',
  'commands/create/readme.md',
  'commands/create/README.txt',
  'commands/create/assets/create-readme-auto.yaml',
  'commands/create/assets/create-readme-confirm.yaml',
];

function trackedInstallGuides() {
  const listed = execFileSync('git', ['-C', REPO_ROOT, 'ls-files', '--', '*INSTALL-GUIDE.md'], { encoding: 'utf8' });
  return listed.split('\n').filter((file) => file && !file.startsWith('specs/') && !file.includes('/z_archive/'));
}

test('every tracked install guide passes the install-guide document class', () => {
  const guides = trackedInstallGuides();
  assert.ok(guides.length > 0, 'no install guides found; the corpus sweep itself is broken');
  const failing = guides.filter((guide) => {
    const run = spawnSync('python3', [VALIDATOR, path.join(REPO_ROOT, guide), '--type', 'install_guide'], { encoding: 'utf8' });
    return run.status !== 0;
  });
  assert.deepEqual(failing, []);
});

test('no routing surface offers the retired install-guide authoring route', () => {
  for (const relative of ROUTING_SURFACES) {
    const file = path.join(SOURCE_ROOT, relative);
    assert.equal(fs.existsSync(file), true, `${relative} is gone; update this contract to the surface that replaced it`);
    const hit = fs.readFileSync(file, 'utf8').split('\n').findIndex((line) => RETIRED_ROUTE.test(line));
    assert.equal(hit, -1, `${relative}:${hit + 1} routes to install-guide authoring again`);
  }
});

test('the central install-guide folder stays retired under both source-root names', () => {
  for (const name of ['.skilled', '.opencode']) {
    const retired = path.join(REPO_ROOT, name, 'install-guides');
    assert.equal(fs.existsSync(retired) || isLink(retired), false, `${name}/install-guides exists again`);
  }
});

test('the validator still offers the install-guide document class the surviving guides need', () => {
  const run = spawnSync('python3', [VALIDATOR, '--help'], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /install_guide/);
});

function isLink(file) {
  try {
    return fs.lstatSync(file).isSymbolicLink();
  } catch {
    return false;
  }
}
