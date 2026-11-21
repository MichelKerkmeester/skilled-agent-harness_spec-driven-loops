// ───────────────────────────────────────────────────────────────────
// MODULE: Overlay Engine README Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// A README.md or README.markdown in the overlay folder either ships, because the
// manifest reaches it, or only documents the folder. These tests pin both roles:
// the docs leg of `status --audit` that reports missing and rejected READMEs
// without changing the result, and every engine command leaving a
// documentation-only README alone.
// Each scenario runs with the overlay folder inside the tree and beside it.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { spawnSync } = require('node:child_process');

const {
  DEFAULT_OVERLAY_FOLDER,
  createWorkspace,
  readJson,
  runEngine,
  sha256,
  writeFile,
  writeManifest,
} = require('./overlay-engine-fixtures.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURE
// ─────────────────────────────────────────────────────────────────────────────

const REAL_SK_DOC = path.resolve(__dirname, '..', '..', '..', '..', 'skills', 'sk-doc');
const SIBLING_FOLDER = 'overlays';
const PLACEMENTS = [
  { name: 'an in-tree overlay folder', options: {}, label: DEFAULT_OVERLAY_FOLDER },
  { name: 'a sibling overlay folder', options: { siblingOverlayFolder: SIBLING_FOLDER }, label: '../' + SIBLING_FOLDER },
];
const GIT_CONFIG = [
  '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid',
  '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', '-c', 'init.defaultBranch=main',
  '-c', 'core.excludesFile=/dev/null',
];

const VALID_README = '---\ntitle: "Widgets"\ndescription: "Widget folder."\n---\n\n# Widgets\n\n' +
  '> Holds widgets.\n\n---\n\n## 1. OVERVIEW\n\nThis folder holds widgets.\n';
// sk-doc rejects this one twice: a lower-case H2 and no overview section.
const TWO_ERROR_README = '---\ntitle: x\n---\n# A\n# B\n## 1. stuff\n';
const FRAGMENT = '\n<!-- BEGIN B -->\nblock\n<!-- END B -->\n';
const MARKED_BASE = '# H\n';

// The READMEs that only document the overlay folder, and the ones an entry ships.
const DOC_ONLY = ['README.md', 'files/README.md', 'skillsrc/README.md', 'skillsrc/other/README.md'];
const SHIPPING = ['notes/README.md', 'bundle/README.md', 'bundle/inner/README.md', 'skillsrc/guide/README.md',
  'mark/README.md'];
const FOLDERS = ['', 'bundle', 'bundle/inner', 'empty', 'files', 'mark', 'notes', 'skillsrc', 'skillsrc/guide',
  'skillsrc/other'];

function git(cwd, args) {
  const result = spawnSync('git', [...GIT_CONFIG, '-C', cwd, ...args], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error('git ' + args.join(' ') + ': ' + result.stderr);
  return result.stdout.trim();
}

function docOnlyBytes(relativePath) {
  return `documentation only: ${relativePath}\n`;
}

/**
 * Build a tree whose overlay folder holds a README of each role: one an entry
 * names as its source, ones inside a directory entry and inside a skill-root
 * replace folder, and documentation-only ones beside and inside entry folders.
 * @param {object} t The node:test context.
 * @param {object} [options] Workspace options passed to `createWorkspace`.
 * @param {{withReadmes?: boolean}} [shape] `withReadmes: false` writes no README at all.
 * @returns {object} Fixture paths, its manifest and a `run` helper.
 */
function createReadmeFixture(t, options = {}, shape = {}) {
  const fixture = createWorkspace(t, 'overlay-engine-readmes-', options);
  const { overlayDir, tree } = fixture;
  const withReadmes = shape.withReadmes !== false;
  const pinned = Buffer.from('pinned\n');

  writeFile(overlayDir, 'files/guarded.txt', 'overlay guarded\n');
  writeFile(tree, 'guarded.txt', pinned);
  writeFile(overlayDir, 'bundle/a.md', 'bundle a\n');
  writeFile(overlayDir, 'skillsrc/SKILL.md', 'overlay skill\n');
  writeFile(overlayDir, 'skillsrc/guide/g.md', 'guide\n');
  fs.mkdirSync(path.join(overlayDir, 'skillsrc', 'other'), { recursive: true });
  fs.mkdirSync(path.join(overlayDir, 'empty'), { recursive: true });
  writeFile(tree, 'skill/SKILL.md', 'old skill\n');
  writeFile(overlayDir, 'mark/base.md', MARKED_BASE);
  writeFile(tree, 'marked.md', MARKED_BASE);
  const overlays = [
    { id: 'guarded', scope: 'file', source: 'files/guarded.txt', destination: 'guarded.txt', pinnedSha256: sha256(pinned) },
    { id: 'bundle', scope: 'directory', source: 'bundle/', destination: 'bundle-live' },
    {
      id: 'skill',
      scope: 'skill-root',
      source: './skillsrc',
      destination: 'skill',
      replace: ['SKILL.md', 'guide'],
      remove: [],
      retained: [],
    },
  ];
  if (withReadmes) {
    for (const relativePath of DOC_ONLY) writeFile(overlayDir, relativePath, docOnlyBytes(relativePath));
    writeFile(overlayDir, 'notes/README.md', 'shipped notes\n');
    writeFile(overlayDir, 'bundle/README.md', 'bundle readme\n');
    writeFile(overlayDir, 'bundle/inner/README.md', 'bundle inner readme\n');
    writeFile(overlayDir, 'skillsrc/guide/README.md', 'guide readme\n');
    writeFile(overlayDir, 'mark/README.md', FRAGMENT);
    overlays.push({ id: 'notes', scope: 'file', source: 'notes/README.md', destination: 'NOTES.md' });
    overlays.push({
      id: 'marked',
      scope: 'marked-section',
      source: 'mark/README.md',
      fragment: 'mark/README.md',
      base: 'mark/base.md',
      destination: 'marked.md',
      beginMarker: '<!-- BEGIN B -->',
      endMarker: '<!-- END B -->',
      pinnedSha256: sha256(Buffer.from(MARKED_BASE)),
    });
  }
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: 'pin-one' },
    layoutLinks: [],
    overlays,
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  fixture.manifestPath = path.join(overlayDir, 'overlay-manifest.json');
  fixture.run = (args, cwd = fixture.workspace, env = process.env) => runEngine([...args, '--root', tree], cwd, env);
  return fixture;
}

// Point the tree at the real sk-doc skill, so the docs leg runs the real validator.
function linkRealValidator(fixture) {
  fs.mkdirSync(path.join(fixture.tree, '.skilled', 'skills'), { recursive: true });
  fs.symlinkSync(REAL_SK_DOC, path.join(fixture.tree, '.skilled', 'skills', 'sk-doc'));
}

function auditJson(fixture, env) {
  const result = fixture.run(['status', '--audit', '--json'], fixture.workspace, env);
  return { ...result, report: JSON.parse(result.stdout) };
}

function resultLine(output) {
  const match = output.match(/^RESULT: \S+$/m);
  return match ? match[0] : null;
}

/**
 * Every file below a folder with its bytes hashed, links by their target.
 * @param {string} root Folder to describe.
 * @param {(relativePath: string) => boolean} [skip] Paths to leave out.
 * @returns {Map<string, string>} One record per path.
 */
function digest(root, skip = () => false) {
  const rows = new Map();
  const walk = (dir) => {
    for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
      const absolute = path.join(dir, dirent.name);
      const relative = path.relative(root, absolute).split(path.sep).join('/');
      if (skip(relative)) continue;
      const stats = fs.lstatSync(absolute);
      if (stats.isSymbolicLink()) rows.set(relative, '-> ' + fs.readlinkSync(absolute));
      else if (stats.isDirectory()) walk(absolute);
      else rows.set(relative, sha256(fs.readFileSync(absolute)));
    }
  };
  walk(root);
  return rows;
}

function overlayDigest(fixture) {
  return digest(fixture.overlayDir, (relative) => relative === 'sync-state.json' || relative === '.build-lock');
}

// The tree without the overlay folder, so an in-tree folder is not read as output.
function treeDigest(fixture) {
  const overlay = path.relative(fixture.tree, fixture.overlayDir).split(path.sep).join('/');
  return digest(fixture.tree, (relative) => relative === overlay || relative.startsWith(overlay + '/'));
}

function treeReadmes(fixture) {
  return [...treeDigest(fixture).keys()].filter((relative) => path.posix.basename(relative) === 'README.md').sort();
}

function assertNamesNoDocOnlyReadme(output, label) {
  for (const relativePath of DOC_ONLY) {
    const lines = output.split('\n').filter((line) => !line.startsWith('DOCS ') &&
      (line.includes(label + '/' + relativePath) || line.includes(' ' + relativePath)));
    assert.deepEqual(lines, [], `a line names the documentation-only ${relativePath}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. THE DOCS LEG OF STATUS --AUDIT
// ─────────────────────────────────────────────────────────────────────────────

for (const placement of PLACEMENTS) {
  test(`the docs leg classifies each README by the entry that reaches it, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options);
    const { report } = auditJson(fixture);
    assert.deepEqual(Object.keys(report.docs), ['isValidated', 'skipped', 'folders', 'readmes', 'shipping', 'docOnly', 'findings']);
    assert.equal(report.docs.folders, FOLDERS.length);
    assert.equal(report.docs.readmes, DOC_ONLY.length + SHIPPING.length);
    assert.equal(report.docs.shipping, SHIPPING.length);
    assert.equal(report.docs.docOnly, DOC_ONLY.length);
  });

  test(`a skill-root README ships only on a path its replace list names, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options);
    const before = auditJson(fixture).report.docs;
    // Naming the folder in replace hands its README to the overlay.
    // The trailing slash is read the way apply reads the folder.
    fixture.manifest.overlays.find((entry) => entry.id === 'skill').replace.push('other/');
    writeManifest(fixture);
    const after = auditJson(fixture).report.docs;
    assert.equal(after.shipping, before.shipping + 1);
    assert.equal(after.docOnly, before.docOnly - 1);
  });

  test(`a README the retained list keeps inside a replaced folder is documentation only, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options);
    const before = auditJson(fixture).report.docs;
    // A retained path inside a replaced folder keeps the vendor's live bytes,
    // so the overlay folder's copy at that path is never applied.
    writeFile(fixture.tree, 'skill/guide/README.md', 'vendor guide readme\n');
    fixture.manifest.overlays.find((entry) => entry.id === 'skill').retained.push({ path: 'guide/README.md' });
    writeManifest(fixture);
    const after = auditJson(fixture).report.docs;
    assert.equal(after.shipping, before.shipping - 1);
    assert.equal(after.docOnly, before.docOnly + 1);
    const applied = fixture.run(['apply']);
    assert.equal(applied.code, 0, applied.output);
    assert.equal(fs.readFileSync(path.join(fixture.tree, 'skill', 'guide', 'README.md'), 'utf8'), 'vendor guide readme\n');
    // Re-classifying it must not make a status check read the kept copy as drift.
    const status = fixture.run(['status', '--audit']);
    assert.equal(status.code, 0, status.output);
  });

  test(`a replace folder named with a trailing slash still keeps the retained README apply leaves alone, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options);
    writeFile(fixture.tree, 'skill/guide/README.md', 'vendor guide readme\n');
    const skill = fixture.manifest.overlays.find((entry) => entry.id === 'skill');
    skill.replace = skill.replace.map((item) => (item === 'guide' ? 'guide/' : item));
    skill.retained.push({ path: 'guide/README.md' });
    writeManifest(fixture);
    const applied = fixture.run(['apply']);
    assert.equal(applied.code, 0, applied.output);
    // The docs leg calls this README documentation only, so apply must keep the vendor's bytes.
    assert.equal(fs.readFileSync(path.join(fixture.tree, 'skill', 'guide', 'README.md'), 'utf8'), 'vendor guide readme\n');
  });

  test(`status --audit prints one missing-readme line per folder without one, after the audit and before checked=, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options);
    fs.rmSync(path.join(fixture.overlayDir, 'README.md'));
    const result = fixture.run(['status', '--audit']);
    const lines = result.stdout.trimEnd().split('\n');
    const docsLines = lines.filter((line) => line.startsWith('DOCS'));
    assert.deepEqual(docsLines, [
      `DOCS     missing-readme ${placement.label}`,
      `DOCS     missing-readme ${placement.label}/empty`,
      'DOCS     skipped: no sk-doc validator at .skilled/skills/sk-doc/scripts/validate_document.py',
    ]);
    // The pin has no checkout, so the audit skips itself and the docs leg still runs.
    const order = ['AUDIT    skipped: no upstream checkout at the pin', 'audit=0', docsLines[0], 'docs=2'];
    const at = order.map((line) => lines.indexOf(line));
    assert.ok(at.every((index) => index >= 0), result.stdout);
    assert.deepEqual([...at].sort((left, right) => left - right), at, result.stdout);
    assert.ok(lines.findIndex((line) => line.startsWith('checked=')) > lines.indexOf('docs=2'), result.stdout);
  });

  test(`the real sk-doc validator names a rejected README and passes a valid one, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options);
    linkRealValidator(fixture);
    writeFile(fixture.overlayDir, 'README.md', TWO_ERROR_README);
    writeFile(fixture.overlayDir, 'files/README.md', VALID_README);
    const result = fixture.run(['status', '--audit']);
    assert.match(result.stdout, new RegExp('^DOCS     invalid-readme ' + placement.label.replace(/\./g, '\\.') +
      '/README\\.md: \\S.* \\(\\+1 more\\)$', 'm'));
    assert.doesNotMatch(result.stdout, /invalid-readme .*files\/README\.md/);
    assert.doesNotMatch(result.stdout, /^DOCS     skipped/m);

    const { report } = auditJson(fixture);
    assert.equal(report.docs.isValidated, true);
    assert.equal(report.docs.skipped, null);
    const invalid = report.docs.findings.find((finding) => finding.path === placement.label + '/README.md');
    assert.equal(invalid.kind, 'invalid-readme');
    assert.equal(invalid.errors.length, 2);
    // Every other README in the fixture fails sk-doc too, so each is named once.
    const named = report.docs.findings.filter((finding) => finding.kind === 'invalid-readme').map((finding) => finding.path);
    assert.equal(named.length, new Set(named).size);
    assert.ok(!named.includes(placement.label + '/files/README.md'));
  });

  test(`a missing python3 prints one skipped line and keeps the missing-readme findings, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options);
    linkRealValidator(fixture);
    writeFile(fixture.overlayDir, 'README.md', TWO_ERROR_README);
    const emptyPath = fs.mkdtempSync(path.join(os.tmpdir(), 'overlay-engine-no-python-'));
    t.after(() => fs.rmSync(emptyPath, { recursive: true, force: true }));
    const env = { ...process.env, PATH: emptyPath };
    const result = fixture.run(['status', '--audit'], fixture.workspace, env);
    const docsLines = result.stdout.split('\n').filter((line) => line.startsWith('DOCS'));
    assert.deepEqual(docsLines, [
      `DOCS     missing-readme ${placement.label}/empty`,
      'DOCS     skipped: python3 is not on PATH, so no README was validated',
    ]);
    assert.match(result.stdout, /^docs=1$/m);
    const { report } = auditJson(fixture, env);
    assert.equal(report.docs.isValidated, false);
    assert.match(report.docs.skipped, /python3/);
  });

  test(`the docs walk skips the run folders, dot folders and node_modules, and never follows a link, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options);
    for (const folder of ['repin-runs/r1', 'relayout-runs/r2', '.hidden/deep', 'node_modules/pkg', 'files/node_modules/x',
      'files/.cache']) {
      fs.mkdirSync(path.join(fixture.overlayDir, folder), { recursive: true });
    }
    // Only the top-level run folders are the engine's; a nested one is content.
    fs.mkdirSync(path.join(fixture.overlayDir, 'files', 'repin-runs'), { recursive: true });
    const outside = path.join(fixture.workspace, 'outside-folder');
    fs.mkdirSync(path.join(outside, 'deeper'), { recursive: true });
    fs.symlinkSync(outside, path.join(fixture.overlayDir, 'linked'));
    fs.symlinkSync('..', path.join(fixture.overlayDir, 'files', 'loop'));
    const { report } = auditJson(fixture);
    assert.deepEqual(report.docs.findings.map((finding) => finding.path), [
      `${placement.label}/empty`,
      `${placement.label}/files/repin-runs`,
    ]);
    assert.equal(report.docs.folders, FOLDERS.length + 1);
  });

  test(`--json carries the docs key under --audit only, with findings sorted by path, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options);
    for (const folder of ['zeta', 'alpha/beta', 'Upper']) fs.mkdirSync(path.join(fixture.overlayDir, folder), { recursive: true });
    const plain = JSON.parse(fixture.run(['status', '--json']).stdout);
    assert.equal(Object.hasOwn(plain, 'docs'), false);
    const { report } = auditJson(fixture);
    const paths = report.docs.findings.map((finding) => finding.path);
    assert.deepEqual(paths, [...paths].sort((left, right) => (left < right ? -1 : left > right ? 1 : 0)));
    assert.deepEqual(report.docs.findings.find((finding) => finding.path.endsWith('/zeta')),
      { kind: 'missing-readme', path: `${placement.label}/zeta` });
    const keys = Object.keys(report);
    assert.equal(keys.indexOf('docs'), keys.indexOf('audit') + 1);
  });

  test(`the docs leg never changes RESULT or the exit code, with ${placement.name}`, (t) => {
    // An adopter with no READMEs at all: every folder is a finding, and the run still passes.
    const fixture = createReadmeFixture(t, placement.options, { withReadmes: false });
    assert.equal(fixture.run(['apply']).code, 0);
    const passing = fixture.run(['status']);
    const passingAudit = fixture.run(['status', '--audit']);
    assert.equal(passing.code, 0, passing.output);
    assert.equal(passingAudit.code, passing.code, passingAudit.output);
    assert.equal(resultLine(passingAudit.stdout), resultLine(passing.stdout));
    assert.equal(resultLine(passingAudit.stdout), 'RESULT: PASSED');
    assert.equal(auditJson(fixture).report.result, 'PASSED');

    fs.writeFileSync(path.join(fixture.tree, 'guarded.txt'), 'edited in place\n');
    const failing = fixture.run(['status']);
    const failingAudit = fixture.run(['status', '--audit']);
    assert.equal(failing.code, 1, failing.output);
    assert.equal(failingAudit.code, failing.code, failingAudit.output);
    assert.equal(resultLine(failingAudit.stdout), resultLine(failing.stdout));
    assert.equal(auditJson(fixture).report.result, 'FAILED');
  });

  test(`a folder the docs walk cannot read changes neither RESULT nor the exit code, with ${placement.name}`, (t) => {
    if (typeof process.getuid === 'function' && process.getuid() === 0) {
      t.skip('root reads a folder whatever its mode');
      return;
    }
    const fixture = createReadmeFixture(t, placement.options, { withReadmes: false });
    assert.equal(fixture.run(['apply']).code, 0);
    const locked = path.join(fixture.overlayDir, 'empty');
    // The mode is restored before the workspace cleanup the fixture registered first.
    fs.chmodSync(locked, 0o000);
    let plain;
    let audit;
    try {
      plain = fixture.run(['status']);
      audit = fixture.run(['status', '--audit']);
    } finally {
      fs.chmodSync(locked, 0o755);
    }
    assert.equal(plain.code, 0, plain.output);
    assert.equal(audit.code, plain.code, audit.output);
    assert.equal(resultLine(audit.stdout), resultLine(plain.stdout));
    assert.doesNotMatch(audit.stdout, /\/empty$/m);
  });

  test(`a folder whose path is too long to read changes neither RESULT nor the exit code, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options, { withReadmes: false });
    assert.equal(fixture.run(['apply']).code, 0);
    const baseFolders = auditJson(fixture).report.docs.folders;
    // Each folder is created with a short name and renamed from the bottom up, so
    // every call stays short while the deepest path outgrows what a call accepts.
    const depth = 17;
    const longName = 'n'.repeat(250);
    const top = path.join(fixture.overlayDir, 'deep');
    const chain = (count, last) => path.join(top, ...Array(count).fill('a'), ...(last ? [last] : []));
    fs.mkdirSync(chain(depth), { recursive: true });
    for (let level = depth; level >= 1; level -= 1) fs.renameSync(chain(level), chain(level - 1, longName));
    let plain;
    let audit;
    let report;
    try {
      plain = fixture.run(['status']);
      audit = fixture.run(['status', '--audit']);
      report = auditJson(fixture).report;
    } finally {
      // Renamed back from the top down, so the fixture cleanup removes short paths.
      for (let level = 1; level <= depth; level += 1) fs.renameSync(chain(level - 1, longName), chain(level));
    }
    assert.equal(plain.code, 0, plain.output);
    assert.equal(audit.code, plain.code, audit.output);
    assert.equal(resultLine(audit.stdout), resultLine(plain.stdout));
    // The folders past the limit are left out of the count.
    assert.ok(report.docs.folders > baseFolders && report.docs.folders < baseFolders + 1 + depth, String(report.docs.folders));
  });

  test(`a validator that does not finish is killed and its README reported, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options, { withReadmes: false });
    writeFile(fixture.tree, '.skilled/skills/sk-doc/scripts/validate_document.py', 'import time\ntime.sleep(5)\n');
    writeFile(fixture.overlayDir, 'README.md', VALID_README);
    const env = { ...process.env, OVERLAY_DOCS_VALIDATOR_TIMEOUT_MS: '500' };
    const startedAt = Date.now();
    const result = fixture.run(['status', '--audit'], fixture.workspace, env);
    assert.ok(Date.now() - startedAt < 4000, 'the validator was not killed at the timeout');
    assert.match(result.stdout, new RegExp('^DOCS     invalid-readme ' + placement.label.replace(/\./g, '\\.') +
      '/README\\.md: the validator did not finish in 0\\.5s$', 'm'));
    assert.equal(result.code, fixture.run(['status']).code, result.output);
  });

  test(`relayout names a documentation-only README that sits at a layout path, and moves nothing, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options);
    fixture.manifest.overlays.find((entry) => entry.id === 'notes').destination = 'README.md';
    writeManifest(fixture);
    writeFile(fixture.overlayDir, 'root/README.md', docOnlyBytes('root/README.md'));
    const overlayBefore = overlayDigest(fixture);
    const relayout = fixture.run(['apply', '--relayout']);
    assert.equal(relayout.code, 2, relayout.output);
    assert.ok(relayout.stdout.split('\n').includes(`refuse: a documentation-only README sits at ${placement.label}/root/README.md: ` +
      'merge it into the overlay copy or move it, then relayout'), relayout.stdout);
    assert.deepEqual(overlayDigest(fixture), overlayBefore);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 4. DOCUMENTATION-ONLY READMES ACROSS THE ENGINE COMMANDS
  // ───────────────────────────────────────────────────────────────────────────

  test(`apply ships only the READMEs an entry reaches, and status names no other, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options);
    const overlayBefore = overlayDigest(fixture);
    const applied = fixture.run(['apply']);
    assert.equal(applied.code, 0, applied.output);
    assert.deepEqual(treeReadmes(fixture), ['bundle-live/README.md', 'bundle-live/inner/README.md', 'skill/guide/README.md']);
    assert.equal(fs.readFileSync(path.join(fixture.tree, 'NOTES.md'), 'utf8'), 'shipped notes\n');
    const docOnlyHashes = new Set(DOC_ONLY.map((relativePath) => sha256(Buffer.from(docOnlyBytes(relativePath)))));
    assert.deepEqual([...treeDigest(fixture).values()].filter((hash) => docOnlyHashes.has(hash)), []);
    assert.deepEqual(overlayDigest(fixture), overlayBefore);

    const status = fixture.run(['status', '--audit']);
    assert.equal(status.code, 0, status.output);
    assertNamesNoDocOnlyReadme(status.stdout, placement.label);
    assertNamesNoDocOnlyReadme(fixture.run(['status', '--json']).stdout, placement.label);
  });

  test(`capture never writes into a documentation-only README, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options);
    assert.equal(fixture.run(['apply']).code, 0);
    const before = overlayDigest(fixture);
    writeFile(fixture.tree, 'skill/README.md', 'a live README the skill-root entry keeps as found\n');
    const kept = fixture.run(['apply', '--capture', path.join(fixture.tree, 'skill', 'README.md')]);
    assert.notEqual(kept.code, 0, kept.output);
    assert.deepEqual(overlayDigest(fixture), before);

    writeFile(fixture.tree, 'skill/guide/README.md', 'guide readme, edited live\n');
    const captured = fixture.run(['apply', '--capture', path.join(fixture.tree, 'skill', 'guide', 'README.md')]);
    assert.equal(captured.code, 0, captured.output);
    const after = overlayDigest(fixture);
    for (const relativePath of DOC_ONLY) assert.equal(after.get(relativePath), before.get(relativePath));
    assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'skillsrc/guide/README.md'), 'utf8'), 'guide readme, edited live\n');
  });

  test(`the guard allows a documentation-only README and pre-commit never names one, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options);
    fixture.manifest.strictWrites = true;
    writeManifest(fixture);
    assert.equal(fixture.run(['apply']).code, 0);
    for (const relativePath of DOC_ONLY) {
      const guard = fixture.run(['--guard', path.join(fixture.overlayDir, ...relativePath.split('/'))]);
      assert.equal(guard.code, 0, guard.output);
      assert.match(guard.stdout, /^allow$/m);
    }
    // One unowned vendored change, so the commit check has something it does refuse.
    writeFile(fixture.tree, '.skilled/stray.md', 'stray\n');
    git(fixture.workspace, ['init', '-q']);
    git(fixture.workspace, ['add', '-A']);
    const preCommit = fixture.run(['pre-commit'], fixture.tree);
    assert.equal(preCommit.code, 1, preCommit.output);
    assert.match(preCommit.stdout, /\.skilled\/stray\.md/);
    assert.doesNotMatch(preCommit.stdout, /README/);
  });

  test(`relayout moves the sources and leaves each documentation-only README beside them, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options);
    assert.equal(fixture.run(['apply']).code, 0);
    const status = fixture.run(['status']);
    const layoutLines = status.stdout.split('\n').filter((line) => line.startsWith('LAYOUT'));
    assert.ok(layoutLines.length > 0, status.stdout);
    assertNamesNoDocOnlyReadme(layoutLines.join('\n'), placement.label);

    const relayout = fixture.run(['apply', '--relayout']);
    assert.equal(relayout.code, 0, relayout.output);
    const moved = relayout.stdout.split('\n').filter((line) => line.startsWith('moved '));
    assert.ok(moved.length > 0, relayout.stdout);
    assertNamesNoDocOnlyReadme(moved.join('\n'), placement.label);
    // The file entry moved out of files/, and the README that documents it stayed.
    assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'files/README.md'), 'utf8'), docOnlyBytes('files/README.md'));
    assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'README.md'), 'utf8'), docOnlyBytes('README.md'));
  });

  test(`adopt refuses to make a documentation-only README the source of a file entry, and writes nothing, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options);
    writeFile(fixture.overlayDir, 'framework/skills/new/README.md', 'documents the new skill folder\n');
    const manifestBefore = fs.readFileSync(fixture.manifestPath);
    const overlayBefore = overlayDigest(fixture);
    const treeBefore = treeDigest(fixture);
    const adopted = fixture.run(['apply', '--adopt', '.skilled/skills/new/README.md'], fixture.tree);
    assert.equal(adopted.code, 2, adopted.output);
    assert.match(adopted.stdout, new RegExp('^refuse: ' + placement.label.replace(/\./g, '\\.') +
      '/framework/skills/new/README\\.md is a documentation-only README', 'm'));
    assert.deepEqual(fs.readFileSync(fixture.manifestPath), manifestBefore);
    assert.deepEqual(overlayDigest(fixture), overlayBefore);
    assert.deepEqual(treeDigest(fixture), treeBefore);
  });

  test(`adopt refuses a folder that would ship a documentation-only README inside it, and writes nothing, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options);
    writeFile(fixture.overlayDir, 'framework/skills/new/SKILL.md', 'new skill\n');
    writeFile(fixture.overlayDir, 'framework/skills/new/README.md', 'documents the new skill folder\n');
    writeFile(fixture.overlayDir, 'framework/skills/new/refs/README.md', 'documents its references\n');
    const manifestBefore = fs.readFileSync(fixture.manifestPath);
    const overlayBefore = overlayDigest(fixture);
    const treeBefore = treeDigest(fixture);
    const adopted = fixture.run(['apply', '--adopt', '.skilled/skills/new'], fixture.tree);
    assert.equal(adopted.code, 2, adopted.output);
    assert.match(adopted.stdout, /directory entry and ship the documentation-only README .*framework\/skills\/new\/README\.md and 1 more/);
    assert.deepEqual(fs.readFileSync(fixture.manifestPath), manifestBefore);
    assert.deepEqual(overlayDigest(fixture), overlayBefore);
    assert.deepEqual(treeDigest(fixture), treeBefore);
  });

  test(`adopt still takes a file whose folder holds a documentation-only README, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options);
    writeFile(fixture.overlayDir, 'framework/skills/new/SKILL.md', 'new skill\n');
    writeFile(fixture.overlayDir, 'framework/skills/new/README.md', 'documents the new skill folder\n');
    const adopted = fixture.run(['apply', '--adopt', '.skilled/skills/new/SKILL.md'], fixture.tree);
    assert.equal(adopted.code, 0, adopted.output);
    const entry = readJson(fixture.manifestPath).overlays.find((item) => item.destination === '.skilled/skills/new/SKILL.md');
    assert.equal(entry.scope, 'file');
    assert.equal(fs.existsSync(path.join(fixture.tree, '.skilled/skills/new/README.md')), false);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 5. README.MARKDOWN
  // ───────────────────────────────────────────────────────────────────────────

  test(`a README.markdown is the folder's README, counted by the docs leg and shipped only when an entry reaches it, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options);
    writeFile(fixture.overlayDir, 'empty/README.markdown', docOnlyBytes('empty/README.markdown'));
    writeFile(fixture.overlayDir, 'files/README.markdown', docOnlyBytes('files/README.markdown'));
    writeFile(fixture.overlayDir, 'bundle/README.markdown', 'bundle markdown readme\n');
    const { report } = auditJson(fixture);
    assert.equal(report.docs.folders, FOLDERS.length);
    assert.equal(report.docs.readmes, DOC_ONLY.length + SHIPPING.length + 3);
    assert.equal(report.docs.shipping, SHIPPING.length + 1);
    assert.equal(report.docs.docOnly, DOC_ONLY.length + 2);
    assert.deepEqual(report.docs.findings.filter((finding) => finding.kind === 'missing-readme'), []);

    const overlayBefore = overlayDigest(fixture);
    const applied = fixture.run(['apply']);
    assert.equal(applied.code, 0, applied.output);
    assert.equal(fs.readFileSync(path.join(fixture.tree, 'bundle-live/README.markdown'), 'utf8'), 'bundle markdown readme\n');
    const docOnlyHashes = new Set(['empty/README.markdown', 'files/README.markdown']
      .map((relativePath) => sha256(Buffer.from(docOnlyBytes(relativePath)))));
    assert.deepEqual([...treeDigest(fixture).values()].filter((hash) => docOnlyHashes.has(hash)), []);
    assert.deepEqual(overlayDigest(fixture), overlayBefore);
  });

  test(`the real sk-doc validator passes a README.markdown in a commands folder and validates a README.md beside it, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options);
    linkRealValidator(fixture);
    writeFile(fixture.overlayDir, 'framework/commands/only/README.markdown', VALID_README);
    writeFile(fixture.overlayDir, 'framework/commands/both/README.markdown', VALID_README);
    // sk-doc reads a README.md under a commands folder as a command document.
    writeFile(fixture.overlayDir, 'framework/commands/both/README.md', VALID_README);
    const { report } = auditJson(fixture);
    assert.equal(report.docs.isValidated, true);
    const at = (relative) => report.docs.findings.filter((finding) => finding.path === `${placement.label}/${relative}`);
    for (const folder of ['framework/commands/only', 'framework/commands/both']) assert.deepEqual(at(folder), [], folder);
    assert.deepEqual(at('framework/commands/only/README.markdown'), []);
    assert.deepEqual(at('framework/commands/both/README.markdown'), []);
    assert.equal(at('framework/commands/both/README.md').length, 1);
    assert.equal(at('framework/commands/both/README.md')[0].kind, 'invalid-readme');
    const result = fixture.run(['status', '--audit']);
    assert.match(result.stdout, new RegExp('^DOCS     invalid-readme ' + placement.label.replace(/\./g, '\\.') +
      '/framework/commands/both/README\\.md: \\S', 'm'));
    assert.doesNotMatch(result.stdout, /README\.markdown/);
  });

  test(`adopt refuses a documentation-only README.markdown as a file source or inside a folder, and writes nothing, with ${placement.name}`, (t) => {
    const fixture = createReadmeFixture(t, placement.options);
    writeFile(fixture.overlayDir, 'framework/skills/new/SKILL.md', 'new skill\n');
    writeFile(fixture.overlayDir, 'framework/skills/new/README.markdown', 'documents the new skill folder\n');
    const manifestBefore = fs.readFileSync(fixture.manifestPath);
    const overlayBefore = overlayDigest(fixture);
    const treeBefore = treeDigest(fixture);
    const asFile = fixture.run(['apply', '--adopt', '.skilled/skills/new/README.markdown'], fixture.tree);
    assert.equal(asFile.code, 2, asFile.output);
    assert.match(asFile.stdout, new RegExp('^refuse: ' + placement.label.replace(/\./g, '\\.') +
      '/framework/skills/new/README\\.markdown is a documentation-only README', 'm'));
    const asFolder = fixture.run(['apply', '--adopt', '.skilled/skills/new'], fixture.tree);
    assert.equal(asFolder.code, 2, asFolder.output);
    assert.match(asFolder.stdout, /directory entry and ship the documentation-only README .*framework\/skills\/new\/README\.markdown;/);
    assert.deepEqual(fs.readFileSync(fixture.manifestPath), manifestBefore);
    assert.deepEqual(overlayDigest(fixture), overlayBefore);
    assert.deepEqual(treeDigest(fixture), treeBefore);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. REPIN --STAGE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build an upstream repository with two commits and a tree at the first, whose
 * overlay folder holds documentation-only READMEs beside one file entry.
 * @param {object} t The node:test context.
 * @param {object} options Workspace options passed to `createWorkspace`.
 * @returns {object} Fixture paths and a `repin` helper.
 */
function createStageFixture(t, options) {
  const fixture = createWorkspace(t, 'overlay-engine-readme-stage-', options);
  const { workspace, tree, overlayDir } = fixture;
  const upstream = path.join(workspace, 'upstream');
  fs.mkdirSync(upstream);
  git(upstream, ['init', '-q']);
  writeFile(upstream, '.skilled/skills/hub/SKILL.md', 'skill v1\n');
  writeFile(upstream, '.skilled/skills/hub/fix.md', 'fix v1\n');
  git(upstream, ['add', '-A']);
  git(upstream, ['commit', '-q', '-m', 'old']);
  const oldCommit = git(upstream, ['rev-parse', 'HEAD']);
  writeFile(upstream, '.skilled/skills/hub/SKILL.md', 'skill v2\n');
  git(upstream, ['add', '-A']);
  git(upstream, ['commit', '-q', '-m', 'new']);
  const newCommit = git(upstream, ['rev-parse', 'HEAD']);

  writeFile(tree, '.skilled/skills/hub/SKILL.md', 'skill v1\n');
  writeFile(tree, '.skilled/skills/hub/fix.md', 'fix v1\n');
  writeFile(overlayDir, 'framework/skills/hub/fix.md', 'fix project\n');
  for (const relativePath of ['README.md', 'framework/README.md', 'framework/skills/README.md', 'framework/skills/hub/README.md']) {
    writeFile(overlayDir, relativePath, docOnlyBytes(relativePath));
  }
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: oldCommit },
    layoutLinks: [],
    overlays: [{
      id: 'hub-fix',
      scope: 'file',
      source: 'framework/skills/hub/fix.md',
      destination: '.skilled/skills/hub/fix.md',
      pinnedSha256: sha256(Buffer.from('fix v1\n')),
    }],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  fixture.run = (args, root = tree) => runEngine([...args, '--root', root], workspace);
  fixture.repin = (extra) => fixture.run(['repin', '--upstream', upstream, '--to', newCommit, ...extra]);
  assert.equal(fixture.run(['apply']).code, 0);
  return fixture;
}

for (const placement of PLACEMENTS) {
  test(`repin --stage puts no documentation-only README into the staged vendored tree, with ${placement.name}`, (t) => {
    const fixture = createStageFixture(t, placement.options);
    const stageDir = path.join(fixture.workspace, 'stage');
    const staged = fixture.repin(['--stage', stageDir]);
    assert.equal(staged.code, 0, staged.output);
    assert.doesNotMatch(staged.stdout, /README/);
    const stagedRoot = placement.options.siblingOverlayFolder ? path.join(stageDir, 'tree') : stageDir;
    const vendored = [...digest(path.join(stagedRoot, '.skilled')).keys()];
    assert.deepEqual(vendored.filter((relative) => path.posix.basename(relative) === 'README.md'), []);
    assert.equal(fs.readFileSync(path.join(stagedRoot, '.skilled/skills/hub/SKILL.md'), 'utf8'), 'skill v2\n');
    assert.equal(fs.readFileSync(path.join(stagedRoot, '.skilled/skills/hub/fix.md'), 'utf8'), 'fix project\n');
    const stagedStatus = fixture.run(['status'], stagedRoot);
    assert.equal(stagedStatus.code, 0, stagedStatus.output);
    assert.doesNotMatch(stagedStatus.stdout, /README/);
  });
}
