#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: generate-leaf-manifest-stale-message.test
// ───────────────────────────────────────────────────────────────────
'use strict';

/**
 * Covers the stale-manifest diagnostic: a committed manifest that has drifted
 * from its corpus must name the added and removed leaves and print the exact
 * regeneration command, so an author can see which file moved instead of
 * diffing two digests by hand.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const GENERATOR = path.join(__dirname, '..', 'generate-leaf-manifest.cjs');
const generator = require('../generate-leaf-manifest.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

function writeFile(root, relativePath, content) {
  const full = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

// A standalone skill is its own packet, so one config plus its declared leaf
// roots is enough for the generator and the checker to agree on one corpus.
function writeStandaloneSkill(skillDir) {
  writeFile(skillDir, 'leaf-manifest.config.json', `${JSON.stringify({
    workflowMode: 'stale-message-probe',
    packet: '.',
    leafRoots: ['references', 'assets'],
  }, null, 2)}\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CASES
// ─────────────────────────────────────────────────────────────────────────────

test('stale check names the added and removed leaves and prints the fix command', () => {
  const skillDir = fs.mkdtempSync(path.join(os.tmpdir(), 'leaf-stale-message-'));
  try {
    writeStandaloneSkill(skillDir);
    writeFile(skillDir, 'references/kept.md', '# kept\n');
    writeFile(skillDir, 'references/removed.md', '# removed\n');
    // Commit the manifest while the corpus is still complete, so the two
    // mutations below are the only drift the check can report.
    fs.writeFileSync(path.join(skillDir, 'leaf-manifest.json'), generator.buildManifestBytes(skillDir));
    fs.rmSync(path.join(skillDir, 'references/removed.md'));
    writeFile(skillDir, 'references/added.md', '# added\n');

    const res = spawnSync(process.execPath, [GENERATOR, '--check', skillDir], { encoding: 'utf8' });

    assert.equal(res.status, 1, res.stderr);
    assert.match(
      res.stderr,
      /  added:   stale-message-probe:references\/added\.md\n  removed: stale-message-probe:references\/removed\.md/,
    );
    assert.match(res.stderr, /^Fix: node .*generate-leaf-manifest\.cjs --write .+$/m);
    assert.ok(res.stderr.includes(`--write ${skillDir}`), res.stderr);
  } finally {
    fs.rmSync(skillDir, { recursive: true, force: true });
  }
});
