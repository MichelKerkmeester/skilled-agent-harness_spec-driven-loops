#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ mcp-installers.test — The two MCP installers stand alone and agree       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { describe, test } = require('node:test');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

// Each installer used to live in a shared folder of install scripts with one helper
// library between them. Each now ships inside its own skill with its own copy of that
// library, so an installer must run from a checkout that holds nothing but its package,
// and the two copies must not quietly diverge.
const SKILLS = path.resolve(__dirname, '..', '..', 'skills');
const INSTALLERS = [
  { name: 'Code Mode', dir: path.join(SKILLS, 'mcp-code-mode', 'scripts') },
  { name: 'Chrome DevTools', dir: path.join(SKILLS, 'mcp-tooling', 'mcp-chrome-devtools', 'scripts') },
];
const RETIRED_NAMES = ['install-code-mode.sh', 'install-chrome-devtools.sh', 'install-all.sh'];

function isolatedCopy(installer, withHelper = true) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-installer-'));
  fs.copyFileSync(path.join(installer.dir, 'install.sh'), path.join(root, 'install.sh'));
  if (withHelper) fs.copyFileSync(path.join(installer.dir, '_utils.sh'), path.join(root, '_utils.sh'));
  return root;
}

function help(root) {
  return spawnSync('bash', ['install.sh', '--help'], { cwd: root, encoding: 'utf8' });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('the MCP installers', () => {
  test('both copies of the helper library are identical', () => {
    const [first, second] = INSTALLERS.map((installer) => fs.readFileSync(path.join(installer.dir, '_utils.sh')));
    assert.equal(
      first.equals(second),
      true,
      `${INSTALLERS[0].dir}/_utils.sh and ${INSTALLERS[1].dir}/_utils.sh differ; change both copies together`,
    );
  });

  for (const installer of INSTALLERS) {
    test(`${installer.name}: help runs from a checkout holding only the package`, () => {
      const root = isolatedCopy(installer);
      try {
        const run = help(root);
        assert.equal(run.status, 0, run.stderr);
        const text = `${run.stdout}${run.stderr}`;
        for (const retired of RETIRED_NAMES) assert.equal(text.includes(retired), false, `help names retired ${retired}`);
      } finally {
        fs.rmSync(root, { recursive: true, force: true });
      }
    });

    test(`${installer.name}: a missing helper library fails loudly`, () => {
      const root = isolatedCopy(installer, false);
      try {
        assert.notEqual(help(root).status, 0);
      } finally {
        fs.rmSync(root, { recursive: true, force: true });
      }
    });
  }
});
