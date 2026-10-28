#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Parent Skill Check Routing Shape Test
// ───────────────────────────────────────────────────────────────────
'use strict';

/**
 * Covers the routing-shape check (12b-routing-shape) in
 * parent-skill-check.cjs: a canon-shaped hub and packet pass at exit 0, each
 * of the four RS codes fails at exit 1 on its own, and the known-debt ledger
 * tolerates a recorded shape while still failing one that grew past it. The
 * checker resolves its contract libraries from the repository root, so the
 * temp fixtures are audited against the same code as a live hub, and the
 * ledger override keeps the live ledger out of every case.
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
// 2. PATHS AND CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CHECKER_PATH = path.join(__dirname, '..', 'parent-skill-check.cjs');
const REAL_SK_DOC_ROOT = path.join(__dirname, '..', '..', '..', '..', 'skills', 'sk-doc');
const REAL_GENERATOR_PATH = path.join(REAL_SK_DOC_ROOT, 'sk-create-skill', 'scripts', 'generate-leaf-manifest.cjs');

const HUB_NAME = 'demo-hub';
const MODE_A = 'demo-alpha';
const MODE_B = 'demo-beta';
const PACKET_A = 'create-skill';
const PACKET_B = 'pkg-two';

const CANON_SMART_LINES = [
  'This packet handles the workflow its mode registers.',
  'The hub `ROUTER.md` selects it from surface intent.',
  'Load the references this packet declares before acting.',
  'The packet keeps no router of its own; the hub root owns it.',
  'Machine-readable signals, when this packet needs them, sit in the',
  'final `MACHINE ROUTER` section so the prose stays short.',
  'A request that matches no mode falls back to UNKNOWN_FALLBACK.',
  'Keep this section prose only: no code block belongs here.',
];

// Every temp fixture root this run creates, removed when the process exits.
const FIXTURE_ROOTS = [];
process.on('exit', () => {
  for (const root of FIXTURE_ROOTS) fs.rmSync(root, { recursive: true, force: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. FIXTURE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function writeJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

function makeTempHubDir() {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'parent-skill-check-routing-shape-'));
  FIXTURE_ROOTS.push(fixtureRoot);
  const hubRoot = path.join(fixtureRoot, HUB_NAME);
  fs.mkdirSync(hubRoot);
  return hubRoot;
}

// N prose lines, so a fixture can sit at or past the line budget.
function smartLines(count) {
  return Array.from(
    { length: count },
    (_, index) => `Routing line ${index + 1} names what selects this packet and what it loads first.`,
  );
}

function canonHubSkillMd() {
  return [
    '---',
    `name: ${HUB_NAME}`,
    'version: 1.0.0.0',
    'allowed-tools: [Read]',
    '---',
    `# ${HUB_NAME}`,
    '',
    '## 2. SMART ROUTING',
    '',
    'The advisor routes a prompt to this hub identity, and the hub reads',
    '`mode-registry.json` to pick the mode. Stage two lives in root',
    '[`ROUTER.md`](./ROUTER.md).',
    '',
  ].join('\n');
}

// A packet SKILL.md in the routing canon: short prose, then the machine block
// in the final `## MACHINE ROUTER` section. The knobs build each defect.
function packetSkillMd(name, {
  smart = CANON_SMART_LINES,
  smartBlock = null,
  appendix = true,
  trailingH2 = false,
} = {}) {
  const lines = ['---', `name: ${name}`, '---', `# ${name}`, '', '## 2. SMART ROUTING', '', ...smart, ''];
  if (smartBlock !== null) lines.push('```python', ...smartBlock, '```', '');
  if (appendix) {
    lines.push('## MACHINE ROUTER', '', '```python', 'INTENT_SIGNALS = {}', '', 'RESOURCE_MAP = {}', '```', '');
    if (trailingH2) lines.push('## 3. HOW IT WORKS', '', 'The packet body follows the router.', '');
  }
  return lines.join('\n');
}

function baseRegistry() {
  const toolSurface = { allowed: ['Read'], forbidden: ['Write', 'Edit', 'Task'], mutatesWorkspace: false, bashAllowlist: [] };
  return {
    skill: HUB_NAME,
    resourceContractVersion: 1,
    modes: [
      {
        workflowMode: MODE_A,
        packetKind: 'workflow',
        backendKind: 'template-scaffold',
        toolSurface,
        packet: PACKET_A,
        packetSkillName: PACKET_A,
        aliases: ['alpha thing'],
        grandfatheredFolderMismatch: false,
        advisorRouting: { routingClass: 'metadata' },
      },
      {
        workflowMode: MODE_B,
        packetKind: 'workflow',
        backendKind: 'template-scaffold',
        toolSurface,
        packet: PACKET_B,
        packetSkillName: PACKET_B,
        aliases: ['beta thing'],
        grandfatheredFolderMismatch: false,
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
    vocabularyClasses: { demo: { keywords: ['alpha thing', 'beta thing'] } },
    routerPolicy: {
      tieBreak: [MODE_A, MODE_B],
      defaultMode: MODE_A,
      outcomes: { single: true, orderedBundle: true, defer: true },
      bundleRules: [],
    },
  };
}

function stage1Router() {
  return [
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
  ].join('\n');
}

function buildCleanFixture({
  hubSkill = canonHubSkillMd(),
  packetASkill = packetSkillMd(PACKET_A),
  packetBSkill = packetSkillMd(PACKET_B),
  packetARouter = null,
} = {}) {
  const hubRoot = makeTempHubDir();
  const basename = path.basename(hubRoot);

  fs.writeFileSync(path.join(hubRoot, 'graph-metadata.json'), JSON.stringify({ skill_id: basename, family: 'sk-hub' }, null, 2));
  writeJson(path.join(hubRoot, 'mode-registry.json'), baseRegistry());
  writeJson(path.join(hubRoot, 'hub-router.json'), baseHubRouter());
  writeJson(path.join(hubRoot, 'description.json'), {
    name: basename, description: 'fixture hub', version: '1.0.0.0', keywords: ['fixture', PACKET_A, PACKET_B],
  });
  writeJson(path.join(hubRoot, 'command-metadata.json'), []);
  fs.writeFileSync(path.join(hubRoot, 'SKILL.md'), hubSkill);
  fs.writeFileSync(path.join(hubRoot, 'ROUTER.md'), stage1Router());
  fs.mkdirSync(path.join(hubRoot, 'changelog'), { recursive: true });
  fs.writeFileSync(path.join(hubRoot, 'changelog', 'CHANGELOG.md'), '# Changelog\n');
  fs.mkdirSync(path.join(hubRoot, 'manual-testing-playbook'), { recursive: true });
  fs.mkdirSync(path.join(hubRoot, 'benchmark'), { recursive: true });

  const packets = [
    { dir: path.join(hubRoot, PACKET_A), skill: packetASkill, leaf: 'hello.md', router: packetARouter },
    { dir: path.join(hubRoot, PACKET_B), skill: packetBSkill, leaf: 'world.md', router: null },
  ];
  for (const packet of packets) {
    fs.mkdirSync(path.join(packet.dir, 'references'), { recursive: true });
    fs.writeFileSync(path.join(packet.dir, 'references', packet.leaf), `# ${packet.leaf}\n`);
    fs.writeFileSync(path.join(packet.dir, 'SKILL.md'), packet.skill);
    fs.writeFileSync(path.join(packet.dir, 'README.md'), `# ${path.basename(packet.dir)}\n`);
    fs.mkdirSync(path.join(packet.dir, 'changelog'), { recursive: true });
    fs.writeFileSync(path.join(packet.dir, 'changelog', 'CHANGELOG.md'), '# Changelog\n');
    if (packet.router !== null) fs.writeFileSync(path.join(packet.dir, 'ROUTER.md'), packet.router);
  }

  // eslint-disable-next-line global-require, import/no-dynamic-require
  const generator = require(REAL_GENERATOR_PATH);
  fs.writeFileSync(path.join(hubRoot, 'leaf-manifest.json'), generator.buildManifestBytes(hubRoot));

  return hubRoot;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RUNNER
// ─────────────────────────────────────────────────────────────────────────────

// The ledger path is always overridden to a file that does not exist, so no
// case can pass or fail because of the live ledger's contents.
function runChecker(hubRoot, envOverrides = {}) {
  const env = { ...process.env };
  delete env.PARENT_HUB_CHECK_STRICT;
  env.ROUTING_SHAPE_DEBT_FILE = path.join(path.dirname(hubRoot), 'absent-routing-shape-debt.json');
  const result = spawnSync(process.execPath, [CHECKER_PATH, hubRoot], {
    encoding: 'utf8',
    env: { ...env, ...envOverrides },
  });
  return { status: result.status, stdout: `${result.stdout || ''}${result.stderr || ''}` };
}

// The checker's closing summary is also a FAIL line, so it is not a finding.
function failLines(stdout) {
  return stdout.split('\n')
    .filter((line) => line.startsWith('FAIL: ') && !line.startsWith('FAIL: parent-skill-check '));
}

function assertOnlyRoutingShapeFailure(stdout, code) {
  const lines = failLines(stdout);
  assert.equal(lines.length, 1, `expected exactly one FAIL line, got:\n${stdout}`);
  assert.match(lines[0], /^FAIL: 12b-routing-shape: /, `expected the FAIL to be 12b-routing-shape:\n${stdout}`);
  assert.match(lines[0], new RegExp(code), `expected ${code} in "${lines[0]}"`);
}

function assertRoutingShapePass(stdout, knownDebt = 0) {
  assert.match(
    stdout,
    new RegExp(`^PASS: 12b-routing-shape: hub and 2 packet\\(s\\) follow the routing canon \\(${knownDebt} known debt\\)$`, 'm'),
    `expected the 12b PASS line:\n${stdout}`,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. TESTS: POSITIVE
// ─────────────────────────────────────────────────────────────────────────────

function testCanonShapedHubAndPacketsPass() {
  const hubRoot = buildCleanFixture();
  const result = runChecker(hubRoot);
  assertRoutingShapePass(result.stdout);
  assert.equal(failLines(result.stdout).length, 0, `expected no FAIL lines:\n${result.stdout}`);
  assert.equal(result.status, 0, `expected a canon-shaped fixture to exit 0:\n${result.stdout}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. TESTS: NEGATIVES (one code per fixture)
// ─────────────────────────────────────────────────────────────────────────────

function testOverBudgetSmartRoutingFailsRS001() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: smartLines(13) }),
  });
  const result = runChecker(hubRoot);
  assertOnlyRoutingShapeFailure(result.stdout, 'RS-001: SMART ROUTING section has 13 lines \\(max 12\\)');
  assert.equal(result.status, 1, `expected an over-budget packet to exit 1:\n${result.stdout}`);
}

function testMachineBlockInsideSmartRoutingFailsRS002() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smartBlock: ['INTENT_SIGNALS = {}'], appendix: false }),
  });
  const result = runChecker(hubRoot);
  assertOnlyRoutingShapeFailure(result.stdout, "RS-002: machine router block at line \\d+ is outside a final '## MACHINE ROUTER' section");
  assert.equal(result.status, 1, `expected a machine block outside the appendix to exit 1:\n${result.stdout}`);
}

function testMachineRouterNotLastFailsRS003() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { trailingH2: true }),
  });
  const result = runChecker(hubRoot);
  assertOnlyRoutingShapeFailure(result.stdout, "RS-003: '## MACHINE ROUTER' is not the last H2 section");
  assert.equal(result.status, 1, `expected a non-final MACHINE ROUTER to exit 1:\n${result.stdout}`);
}

function testPacketOwnRouterFailsRS004() {
  const hubRoot = buildCleanFixture({
    packetARouter: ['---', 'title: packet router', '---', '# packet router', ''].join('\n'),
  });
  const result = runChecker(hubRoot);
  assertOnlyRoutingShapeFailure(result.stdout, 'RS-004: mode packet carries its own ROUTER\\.md');
  assert.equal(result.status, 1, `expected a packet-owned ROUTER.md to exit 1:\n${result.stdout}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. TESTS: KNOWN DEBT
// ─────────────────────────────────────────────────────────────────────────────

function writeDebt(hubRoot, recorded) {
  const file = path.join(path.dirname(hubRoot), 'routing-shape-known-debt.json');
  writeJson(file, {
    description: 'fixture ledger',
    maxSmartRoutingLines: 12,
    debt: { [`${HUB_NAME}/${PACKET_A}`]: recorded },
  });
  return file;
}

function testRecordedDebtToleratesOldShape() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: smartLines(13) }),
  });
  const debtFile = writeDebt(hubRoot, 13);
  const result = runChecker(hubRoot, { ROUTING_SHAPE_DEBT_FILE: debtFile });
  assert.match(
    result.stdout,
    new RegExp(`^INFO: 12b-routing-shape: ${HUB_NAME}/${PACKET_A}: routing shape: known debt, RS-001 \\(migrate to the routing canon\\)$`, 'm'),
    `expected the known-debt advisory:\n${result.stdout}`,
  );
  assertRoutingShapePass(result.stdout, 1);
  assert.equal(failLines(result.stdout).length, 0, `expected no FAIL lines:\n${result.stdout}`);
  assert.equal(result.status, 0, `expected a recorded debt shape to exit 0:\n${result.stdout}`);
}

function testDebtGrowthFailsRS001() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: smartLines(14) }),
  });
  const debtFile = writeDebt(hubRoot, 13);
  const result = runChecker(hubRoot, { ROUTING_SHAPE_DEBT_FILE: debtFile });
  assertOnlyRoutingShapeFailure(
    result.stdout,
    'RS-001: SMART ROUTING section has 14 lines \\(max 12\\) \\(grew past its recorded known debt of 13\\)',
  );
  assert.doesNotMatch(result.stdout, /^PASS: 12b-routing-shape:/m);
  assert.equal(result.status, 1, `expected debt growth to exit 1:\n${result.stdout}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. RUN
// ─────────────────────────────────────────────────────────────────────────────

testCanonShapedHubAndPacketsPass();
testOverBudgetSmartRoutingFailsRS001();
testMachineBlockInsideSmartRoutingFailsRS002();
testMachineRouterNotLastFailsRS003();
testPacketOwnRouterFailsRS004();
testRecordedDebtToleratesOldShape();
testDebtGrowthFailsRS001();
console.log('[parent-skill-check] routing-shape fixtures passed');
