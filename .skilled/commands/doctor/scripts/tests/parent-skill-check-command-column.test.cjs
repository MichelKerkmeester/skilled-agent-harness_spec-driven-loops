#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ parent-skill-check-command-column.test: coverage for check 6c            ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Covers check 6c in parent-skill-check.cjs: the hub SKILL.md mode table's
 * Command column against the `command` field mode-registry.json declares for
 * that same mode. Check 6b already proves a mode is MENTIONED somewhere in
 * the table. 6c is the accuracy half 6b explicitly disclaims: a row that
 * names its mode but shows a stale or missing command while the registry
 * declares a real one still passed 6b and must not also pass 6c.
 *
 * Mirrors the leaf-manifest and root-router test files' fixture pattern:
 * a temp two-mode hub, one contract library copy at the sibling sk-doc
 * topology the checker resolves libraries from, and no live hub is touched.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATHS
// ─────────────────────────────────────────────────────────────────────────────

const CHECKER_PATH = path.join(__dirname, '..', 'parent-skill-check.cjs');
const REAL_SK_DOC_ROOT = path.join(__dirname, '..', '..', '..', '..', 'skills', 'sk-doc');
const REAL_GENERATOR_PATH = path.join(REAL_SK_DOC_ROOT, 'sk-create-skill', 'scripts', 'generate-leaf-manifest.cjs');
const REAL_CONTRACT_LIB_PATH = path.join(REAL_SK_DOC_ROOT, 'sk-create-skill', 'scripts', 'lib', 'leaf-resource-contract.cjs');
const REAL_ROOT_CONTRACT_LIB_PATH = path.join(REAL_SK_DOC_ROOT, 'sk-create-skill', 'scripts', 'lib', 'skill-root-metadata-contract.cjs');
const REAL_ROOT_ROUTER_CONTRACT_LIB_PATH = path.join(REAL_SK_DOC_ROOT, 'sk-create-skill', 'scripts', 'lib', 'root-router-contract.cjs');
const REAL_S_CLASS_DEFAULTS_PATH = path.join(REAL_SK_DOC_ROOT, 'sk-create-skill', 'scripts', 'lib', 's-class-config-defaults.json');

const MODE_A = 'demo-alpha';
const MODE_B = 'demo-beta';
const COMMAND_A = '/demo:alpha';

// ─────────────────────────────────────────────────────────────────────────────
// 3. FIXTURE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

function makeTempHubDir() {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'parent-skill-check-command-column-'));
  const hubRoot = path.join(fixtureRoot, 'demo-hub');
  fs.mkdirSync(hubRoot);
  return hubRoot;
}

// The generator/library resolve from the sibling sk-doc hub, matching the real
// multi-hub layout while keeping each fixture isolated.
function installContractLibrary(hubRoot) {
  const scriptsDir = path.join(path.dirname(hubRoot), 'sk-doc', 'sk-create-skill', 'scripts');
  const libDir = path.join(scriptsDir, 'lib');
  fs.mkdirSync(libDir, { recursive: true });
  fs.copyFileSync(REAL_GENERATOR_PATH, path.join(scriptsDir, 'generate-leaf-manifest.cjs'));
  fs.copyFileSync(REAL_CONTRACT_LIB_PATH, path.join(libDir, 'leaf-resource-contract.cjs'));
  fs.copyFileSync(REAL_ROOT_CONTRACT_LIB_PATH, path.join(libDir, 'skill-root-metadata-contract.cjs'));
  fs.copyFileSync(REAL_ROOT_ROUTER_CONTRACT_LIB_PATH, path.join(libDir, 'root-router-contract.cjs'));
  fs.copyFileSync(REAL_S_CLASS_DEFAULTS_PATH, path.join(libDir, 's-class-config-defaults.json'));
}

function writePacketCompanions(packetDir, packetSkillName) {
  fs.mkdirSync(path.join(packetDir, 'changelog'), { recursive: true });
  fs.writeFileSync(path.join(packetDir, 'SKILL.md'), `---\nname: ${packetSkillName}\n---\n# ${packetSkillName}\n`);
  fs.writeFileSync(path.join(packetDir, 'README.md'), `# ${packetSkillName}\n`);
  fs.writeFileSync(path.join(packetDir, 'changelog', 'CHANGELOG.md'), '# Changelog\n');
}

function baseRegistry() {
  const toolSurface = { allowed: ['Read'], forbidden: ['Write', 'Edit', 'Task'], mutatesWorkspace: false, bashAllowlist: [] };
  return {
    skill: 'demo-hub',
    resourceContractVersion: 1,
    modes: [
      {
        workflowMode: MODE_A,
        packetKind: 'workflow',
        backendKind: 'template-scaffold',
        toolSurface,
        packet: 'create-skill',
        packetSkillName: 'create-skill',
        grandfatheredFolderMismatch: false,
        command: COMMAND_A,
        advisorRouting: { routingClass: 'metadata' },
      },
      {
        workflowMode: MODE_B,
        packetKind: 'workflow',
        backendKind: 'template-scaffold',
        toolSurface,
        packet: 'pkg-two',
        packetSkillName: 'pkg-two',
        grandfatheredFolderMismatch: false,
        // No command: this mode routes by alias only, so its table row is free
        // to say so and 6c must not demand a literal command for it.
        advisorRouting: { routingClass: 'metadata' },
      },
    ],
  };
}

function baseHubRouter() {
  return {
    routerSignals: {
      [MODE_A]: { classes: ['demo'], resources: [] },
      [MODE_B]: { classes: ['demo'], resources: [] },
    },
    vocabularyClasses: { demo: {} },
    routerPolicy: {
      tieBreak: [MODE_A, MODE_B],
      defaultMode: MODE_A,
      outcomes: { single: true, orderedBundle: true, defer: true },
      bundleRules: [],
    },
  };
}

// The hub SKILL.md carries a real mode table (two rows) so 6b/6c actually
// engage. A table-less SKILL.md skips both checks by design.
function hubSkillMd(commandCellForModeA) {
  return [
    '---',
    'name: demo-hub',
    'allowed-tools: [Read]',
    '---',
    '# demo-hub',
    '',
    '| Mode | Use it for | Packet | Command |',
    '|------|------------|--------|---------|',
    `| **${MODE_A}** | does the alpha thing | \`create-skill/\` | ${commandCellForModeA} |`,
    `| **${MODE_B}** | does the beta thing | \`pkg-two/\` | — (routes via aliases) |`,
    '',
  ].join('\n');
}

// A complete, canon-clean two-mode hub with a fresh, byte-consistent
// leaf-manifest.json and a real mode table, so PARENT_HUB_CHECK_STRICT=1 finds
// nothing from the pre-existing checks and only 6c is under test.
// `commandCellForModeA` lets a case corrupt just that one cell.
function buildCleanFixture(commandCellForModeA) {
  const hubRoot = makeTempHubDir();
  const basename = path.basename(hubRoot);

  fs.writeFileSync(path.join(hubRoot, 'graph-metadata.json'), JSON.stringify({ skill_id: basename, family: 'sk-hub' }, null, 2));
  writeJson(path.join(hubRoot, 'mode-registry.json'), baseRegistry());
  writeJson(path.join(hubRoot, 'hub-router.json'), baseHubRouter());
  writeJson(path.join(hubRoot, 'description.json'), { name: basename, description: 'fixture hub', version: '0.0.0', keywords: ['fixture'] });
  writeJson(path.join(hubRoot, 'command-metadata.json'), []);
  fs.writeFileSync(path.join(hubRoot, 'SKILL.md'), hubSkillMd(commandCellForModeA));
  fs.writeFileSync(path.join(hubRoot, 'ROUTER.md'), [
    '---',
    'title: demo-hub Surface Router — stage-one only',
    'version: 1.0.0.0',
    'router_state: stage1-only',
    'skill_pointer: SKILL.md',
    '---',
    '# demo-hub Surface Router',
    '```python',
    'DEFAULT_RESOURCE = []',
    '',
    'INTENT_SIGNALS = {}',
    '',
    'RESOURCE_MAP = {}',
    '',
    'SHARED_CONTROL_RESOURCES = []',
    '```',
    '',
  ].join('\n'));
  fs.mkdirSync(path.join(hubRoot, 'changelog'), { recursive: true });
  fs.writeFileSync(path.join(hubRoot, 'changelog', 'CHANGELOG.md'), '# Changelog\n');
  fs.mkdirSync(path.join(hubRoot, 'manual-testing-playbook'), { recursive: true });
  fs.mkdirSync(path.join(hubRoot, 'benchmark'), { recursive: true });

  const packetA = path.join(hubRoot, 'create-skill');
  const packetB = path.join(hubRoot, 'pkg-two');
  fs.mkdirSync(path.join(packetA, 'references'), { recursive: true });
  fs.mkdirSync(path.join(packetB, 'references'), { recursive: true });
  fs.writeFileSync(path.join(packetA, 'references', 'hello.md'), '# hello\n');
  fs.writeFileSync(path.join(packetB, 'references', 'world.md'), '# world\n');
  writePacketCompanions(packetA, 'create-skill');
  writePacketCompanions(packetB, 'pkg-two');

  installContractLibrary(hubRoot);

  const generatorPath = path.join(path.dirname(hubRoot), 'sk-doc', 'sk-create-skill', 'scripts', 'generate-leaf-manifest.cjs');
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const generator = require(generatorPath);
  fs.writeFileSync(path.join(hubRoot, 'leaf-manifest.json'), generator.buildManifestBytes(hubRoot));

  return hubRoot;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RUNNER
// ─────────────────────────────────────────────────────────────────────────────

// parent-skill-check.cjs calls process.exit() unconditionally, so it must run
// as a child process rather than be require()'d in-process. PASS/INFO go to
// stdout and FAIL/WARN go to stderr, so both are combined for assertions.
function runChecker(hubRoot, envOverrides) {
  const result = spawnSync(process.execPath, [CHECKER_PATH, hubRoot], {
    encoding: 'utf8',
    env: { ...process.env, ...envOverrides },
  });
  return { status: result.status, stdout: `${result.stdout || ''}${result.stderr || ''}` };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. TESTS
// ─────────────────────────────────────────────────────────────────────────────

function testMatchingCommandPasses6c() {
  const hubRoot = buildCleanFixture(`\`${COMMAND_A}\``);
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assert.match(result.stdout, /PASS: 6c: every mode-table row whose registry entry declares a command/);
  assert.doesNotMatch(result.stdout, /FAIL: 6c/);
  assert.equal(result.status, 0, `expected a canon-clean fixture to exit 0:\n${result.stdout}`);
}

function testDashInsteadOfDeclaredCommandFails6c() {
  // A hub can legitimately show the generic "routes via aliases" dash for a
  // mode the registry routes by alias. Here the registry declares a real
  // command instead, so the dash is stale and must fail.
  const hubRoot = buildCleanFixture('— (routes via aliases)');
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assert.match(result.stdout, new RegExp(`FAIL: 6c:.*${MODE_A.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  assert.match(result.stdout, /hiding a working command/);
  assert.notEqual(result.status, 0);
}

function testWrongCommandFails6c() {
  // A row that names a command, just not the registered one, must also fail.
  // 6c checks the string matches, not merely that the cell is non-empty.
  const hubRoot = buildCleanFixture('`/demo:wrong`');
  const result = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assert.match(result.stdout, new RegExp(`FAIL: 6c:.*${MODE_A.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  assert.notEqual(result.status, 0);
}

function testRemovingTheModeRowFailsThenRestoringPasses() {
  // The literal "remove one mode row, watch it go red, restore it, watch it
  // pass" cycle: deleting the row entirely is caught by 6b (presence), and
  // 6c has nothing left to mismatch once the row is gone.
  const hubRoot = buildCleanFixture(`\`${COMMAND_A}\``);
  const skillMdPath = path.join(hubRoot, 'SKILL.md');
  const original = fs.readFileSync(skillMdPath, 'utf8');
  const withRowRemoved = original.split('\n').filter((line) => !line.includes(`**${MODE_A}**`)).join('\n');
  fs.writeFileSync(skillMdPath, withRowRemoved);

  const removedResult = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assert.match(removedResult.stdout, new RegExp(`FAIL: 6b:.*${MODE_A.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  assert.notEqual(removedResult.status, 0);

  fs.writeFileSync(skillMdPath, original);
  const restoredResult = runChecker(hubRoot, { PARENT_HUB_CHECK_STRICT: '1' });
  assert.match(restoredResult.stdout, /PASS: 6b:/);
  assert.match(restoredResult.stdout, /PASS: 6c:/);
  assert.equal(restoredResult.status, 0, `expected the restored row to pass again:\n${restoredResult.stdout}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. RUN
// ─────────────────────────────────────────────────────────────────────────────

testMatchingCommandPasses6c();
testDashInsteadOfDeclaredCommandFails6c();
testWrongCommandFails6c();
testRemovingTheModeRowFailsThenRestoringPasses();
console.log('[parent-skill-check] command-column (6c) coverage passed');
