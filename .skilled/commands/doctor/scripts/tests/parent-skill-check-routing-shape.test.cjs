#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Parent Skill Check Routing Shape Test
// ───────────────────────────────────────────────────────────────────
'use strict';

/**
 * Covers the routing-shape check (12b-routing-shape) in
 * parent-skill-check.cjs: a canon-shaped hub and packet pass at exit 0, each
 * of the four RS codes fails at exit 1 on its own, and the known-debt ledger
 * tolerates a recorded shape while still failing one that grew past a recorded
 * limit or raised a code its entry never recorded. Machine-block detection is
 * pinned separately: an indented router, a router nested in a longer fence, the
 * fallback checklist, and a heading inside a fence. The checker resolves its
 * contract libraries from the repository root, so the temp fixtures are
 * audited against the same code as a live hub, and the ledger and skills-root
 * overrides keep the live ledger out of every case.
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

// N prose lines, so a fixture can sit at or past the line budget. Each line
// stays short so a line-budget fixture never also trips the word cap.
function smartLines(count) {
  return Array.from(
    { length: count },
    (_, index) => `Routing line ${index + 1} names the packet and what it loads.`,
  );
}

// N prose lines of exactly `words` tokens each, so a fixture can sit past the
// word cap while staying inside the line budget.
function wordySmartLines(count, words) {
  const tail = Array.from({ length: words - 1 }, (_, index) => `token${index + 1}`);
  return Array.from({ length: count }, (_, index) => [`line${index + 1}`, ...tail].join(' '));
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

const CANON_APPENDIX_BLOCK = ['INTENT_SIGNALS = {}', '', 'RESOURCE_MAP = {}'];

// A packet SKILL.md in the routing canon: short prose, then the machine block
// in the final `## MACHINE ROUTER` section. The knobs build each defect.
function packetSkillMd(name, {
  smart = CANON_SMART_LINES,
  smartBlock = null,
  appendix = true,
  appendixBlock = CANON_APPENDIX_BLOCK,
  trailingH2 = false,
} = {}) {
  const lines = ['---', `name: ${name}`, '---', `# ${name}`, '', '## 2. SMART ROUTING', '', ...smart, ''];
  if (smartBlock !== null) lines.push('```python', ...smartBlock, '```', '');
  if (appendix) {
    lines.push('## MACHINE ROUTER', '', '```python', ...appendixBlock, '```', '');
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

// The ledger path is always overridden to a file that does not exist, and an
// inherited skills root is cleared, so no case can pass or fail because of the
// live ledger or a stray environment variable.
function runChecker(hubRoot, envOverrides = {}) {
  const env = { ...process.env };
  delete env.PARENT_HUB_CHECK_STRICT;
  delete env.ROUTING_SHAPE_SKILLS_ROOT;
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

function testOverWordCapSmartRoutingFailsRS001() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: wordySmartLines(10, 20) }),
  });
  const result = runChecker(hubRoot);
  assertOnlyRoutingShapeFailure(result.stdout, 'RS-001: SMART ROUTING section has 200 words \\(max 180\\)');
  assert.equal(result.status, 1, `expected a packet over the word cap to exit 1:\n${result.stdout}`);
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
// 7. TESTS: MACHINE-BLOCK DETECTION
// ─────────────────────────────────────────────────────────────────────────────

// Four-space indentation is a code block in markdown, so a router written that
// way is machine data even without a fence.
const INDENTED_ROUTER_LINES = ['    INTENT_SIGNALS = {}', '    RESOURCE_MAP = {}'];

// The outer four-backtick fence makes the inner three-backtick block text, so
// the whole construct is one machine block opened by the outer fence.
const FOUR_TICK_WRAPPED_ROUTER = [
  'Prose names the packet and the references it loads.',
  '',
  '````markdown',
  '```python',
  'INTENT_SIGNALS = {}',
  '```',
  '````',
];

// A heading inside a four-backtick fence is template text, not a section, so
// the real appendix stays the last H2.
const FENCED_HEADING_ROUTER = [
  'Prose names the packet and the references it loads.',
  '',
  '````markdown',
  '```',
  '## MACHINE ROUTER',
  '```',
  '````',
];

function testIndentedRouterInSmartRoutingFailsRS002() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: [...CANON_SMART_LINES, ...INDENTED_ROUTER_LINES] }),
  });
  const result = runChecker(hubRoot);
  assertOnlyRoutingShapeFailure(result.stdout, 'RS-002: machine router block at line \\d+ is outside a final');
  assert.equal(result.status, 1, `expected an unfenced router outside the appendix to exit 1:\n${result.stdout}`);
}

function testFourTickFencedRouterFailsRS002AtOpeningFence() {
  const packet = packetSkillMd(PACKET_A, { smart: FOUR_TICK_WRAPPED_ROUTER });
  const openingLine = packet.split('\n').indexOf('````markdown') + 1;
  const hubRoot = buildCleanFixture({ packetASkill: packet });
  const result = runChecker(hubRoot);
  assertOnlyRoutingShapeFailure(result.stdout, `RS-002: machine router block at line ${openingLine} is outside a final`);
  assert.equal(result.status, 1, `expected a router inside a nested fence to exit 1:\n${result.stdout}`);
}

function testUnknownFallbackChecklistIsAMachineBlock() {
  const misplaced = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smartBlock: ['UNKNOWN_FALLBACK_CHECKLIST = []'], appendix: false }),
  });
  const misplacedResult = runChecker(misplaced);
  assertOnlyRoutingShapeFailure(misplacedResult.stdout, 'RS-002: machine router block at line \\d+ is outside a final');
  assert.equal(misplacedResult.status, 1, `expected the checklist outside the appendix to exit 1:\n${misplacedResult.stdout}`);

  const placed = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { appendixBlock: ['UNKNOWN_FALLBACK_CHECKLIST = []'] }),
  });
  const placedResult = runChecker(placed);
  assertRoutingShapePass(placedResult.stdout);
  assert.equal(failLines(placedResult.stdout).length, 0, `expected the checklist in the appendix to raise no finding:\n${placedResult.stdout}`);
  assert.equal(placedResult.status, 0, `expected the checklist in the appendix to exit 0:\n${placedResult.stdout}`);
}

function testFencedHeadingIsNotASection() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: FENCED_HEADING_ROUTER }),
  });
  const result = runChecker(hubRoot);
  assertRoutingShapePass(result.stdout);
  assert.equal(failLines(result.stdout).length, 0, `expected a fenced heading to raise no finding:\n${result.stdout}`);
  assert.equal(result.status, 0, `expected a fenced heading to exit 0:\n${result.stdout}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. TESTS: KNOWN DEBT
// ─────────────────────────────────────────────────────────────────────────────

// The fixture skills root is the directory holding the hub, so the hub and its
// packets key by their paths inside it.
function writeDebt(hubRoot, recorded) {
  const file = path.join(path.dirname(hubRoot), 'routing-shape-known-debt.json');
  writeJson(file, {
    description: 'fixture ledger',
    maxSmartRoutingLines: 12,
    debt: { [`${HUB_NAME}/${PACKET_A}`]: recorded },
  });
  return file;
}

// A complete debt entry. Every limit is stated even when a fixture exercises
// only one, because an entry missing a field is ignored by design.
function debtEntry({ lines = 0, words = 0, machineBlocks = 0, codes = [] } = {}) {
  return { lines, words, machineBlocks, codes };
}

function runWithDebt(hubRoot, debtFile) {
  return runChecker(hubRoot, {
    ROUTING_SHAPE_DEBT_FILE: debtFile,
    ROUTING_SHAPE_SKILLS_ROOT: path.dirname(hubRoot),
  });
}

function testRecordedDebtToleratesOldShape() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: smartLines(13) }),
  });
  const debtFile = writeDebt(hubRoot, debtEntry({ lines: 13, codes: ['RS-001'] }));
  const result = runWithDebt(hubRoot, debtFile);
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
  const debtFile = writeDebt(hubRoot, debtEntry({ lines: 13, codes: ['RS-001'] }));
  const result = runWithDebt(hubRoot, debtFile);
  assertOnlyRoutingShapeFailure(
    result.stdout,
    'RS-001: SMART ROUTING section has 14 lines \\(max 12\\) \\(grew past its recorded known debt of 13 lines\\)',
  );
  assert.doesNotMatch(result.stdout, /^PASS: 12b-routing-shape:/m);
  assert.equal(result.status, 1, `expected debt growth to exit 1:\n${result.stdout}`);
}

function testRecordedWordDebtToleratesOverCapShape() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: wordySmartLines(10, 20) }),
  });
  const debtFile = writeDebt(hubRoot, debtEntry({ words: 200, codes: ['RS-001'] }));
  const result = runWithDebt(hubRoot, debtFile);
  assert.match(
    result.stdout,
    new RegExp(`^INFO: 12b-routing-shape: ${HUB_NAME}/${PACKET_A}: routing shape: known debt, RS-001 \\(migrate to the routing canon\\)$`, 'm'),
    `expected the known-debt advisory:\n${result.stdout}`,
  );
  assertRoutingShapePass(result.stdout, 1);
  assert.equal(result.status, 0, `expected a recorded word count to exit 0:\n${result.stdout}`);
}

function testWordDebtGrowthFailsRS001() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: wordySmartLines(10, 20) }),
  });
  const debtFile = writeDebt(hubRoot, debtEntry({ words: 190, codes: ['RS-001'] }));
  const result = runWithDebt(hubRoot, debtFile);
  assertOnlyRoutingShapeFailure(
    result.stdout,
    'RS-001: SMART ROUTING section has 200 words \\(max 180\\) \\(grew past its recorded known debt of 190 words\\)',
  );
  assert.equal(result.status, 1, `expected word growth to exit 1:\n${result.stdout}`);
}

function testKnownDebtListsEachCodeOnce() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: [...smartLines(13), ...wordySmartLines(10, 20)] }),
  });
  const debtFile = writeDebt(hubRoot, debtEntry({ lines: 23, words: 330, codes: ['RS-001'] }));
  const result = runWithDebt(hubRoot, debtFile);
  assert.match(
    result.stdout,
    new RegExp(`^INFO: 12b-routing-shape: ${HUB_NAME}/${PACKET_A}: routing shape: known debt, RS-001 \\(migrate to the routing canon\\)$`, 'm'),
    `expected one entry per tolerated code:\n${result.stdout}`,
  );
  assertRoutingShapePass(result.stdout, 1);
  assert.equal(result.status, 0, `expected both recorded limits to be tolerated:\n${result.stdout}`);
}

function testStaleDebtEntryIsReported() {
  const hubRoot = buildCleanFixture();
  const debtFile = writeDebt(hubRoot, debtEntry({ lines: 13, codes: ['RS-001'] }));
  const result = runWithDebt(hubRoot, debtFile);
  assert.match(
    result.stdout,
    new RegExp(`^INFO: 12b-routing-shape: ${HUB_NAME}/${PACKET_A}: routing shape: known-debt entry is stale; remove ${HUB_NAME}/${PACKET_A}$`, 'm'),
    `expected the stale-entry advisory:\n${result.stdout}`,
  );
  assertRoutingShapePass(result.stdout);
  assert.equal(result.status, 0, `expected a stale entry to exit 0:\n${result.stdout}`);
}

function testLedgerWordCapOverrideApplies() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: wordySmartLines(10, 20) }),
  });
  const debtFile = path.join(path.dirname(hubRoot), 'routing-shape-known-debt.json');
  writeJson(debtFile, { description: 'fixture ledger', maxSmartRoutingWords: 250, debt: {} });
  const result = runWithDebt(hubRoot, debtFile);
  assertRoutingShapePass(result.stdout);
  assert.equal(failLines(result.stdout).length, 0, `expected no FAIL lines:\n${result.stdout}`);
  assert.equal(result.status, 0, `expected a raised word cap to exit 0:\n${result.stdout}`);
}

function testRecordedLengthDebtDoesNotCoverOwnRouter() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: smartLines(13) }),
    packetARouter: ['---', 'title: packet router', '---', '# packet router', ''].join('\n'),
  });
  const debtFile = writeDebt(hubRoot, debtEntry({ lines: 13, codes: ['RS-001'] }));
  const result = runWithDebt(hubRoot, debtFile);
  assertOnlyRoutingShapeFailure(
    result.stdout,
    'RS-004: mode packet carries its own ROUTER\\.md.*\\(not recorded in its known debt\\)',
  );
  assert.match(
    result.stdout,
    new RegExp(`^INFO: 12b-routing-shape: ${HUB_NAME}/${PACKET_A}: routing shape: known debt, RS-001 \\(migrate to the routing canon\\)$`, 'm'),
    `expected the recorded length to stay tolerated:\n${result.stdout}`,
  );
  assert.equal(result.status, 1, `expected an unrecorded RS-004 to exit 1:\n${result.stdout}`);
}

function testRecordedMachineBlockDebtToleratesOne() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smartBlock: ['INTENT_SIGNALS = {}'], appendix: false }),
  });
  const debtFile = writeDebt(hubRoot, debtEntry({ machineBlocks: 1, codes: ['RS-002'] }));
  const result = runWithDebt(hubRoot, debtFile);
  assert.match(
    result.stdout,
    new RegExp(`^INFO: 12b-routing-shape: ${HUB_NAME}/${PACKET_A}: routing shape: known debt, RS-002 \\(migrate to the routing canon\\)$`, 'm'),
    `expected the known-debt advisory:\n${result.stdout}`,
  );
  assertRoutingShapePass(result.stdout, 1);
  assert.equal(result.status, 0, `expected one recorded machine block to exit 0:\n${result.stdout}`);
}

function testMachineBlockDebtGrowthFailsRS002() {
  const twoMachineBlocks = [
    'Short routing prose names the packet and what it loads first.',
    '',
    '```python',
    'INTENT_SIGNALS = {}',
    '```',
    '',
    '```python',
    'RESOURCE_MAP = {}',
    '```',
  ];
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: twoMachineBlocks }),
  });
  const debtFile = writeDebt(hubRoot, debtEntry({ machineBlocks: 1, codes: ['RS-002'] }));
  const result = runWithDebt(hubRoot, debtFile);
  const lines = failLines(result.stdout);
  assert.equal(lines.length, 2, `expected two RS-002 FAIL lines, got:\n${result.stdout}`);
  for (const line of lines) {
    assert.match(line, /^FAIL: 12b-routing-shape: demo-hub\/create-skill: routing shape RS-002: /, line);
    assert.match(line, / \(grew past its recorded known debt of 1 machine block\(s\)\)$/, line);
  }
  assert.doesNotMatch(result.stdout, /^PASS: 12b-routing-shape:/m);
  assert.equal(result.status, 1, `expected machine-block debt growth to exit 1:\n${result.stdout}`);
}

function testDebtOutsideSkillsRootStillFails() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: smartLines(13) }),
  });
  const debtFile = writeDebt(hubRoot, debtEntry({ lines: 13, codes: ['RS-001'] }));
  const outsideRoot = path.join(path.dirname(hubRoot), 'other-skills-root');
  fs.mkdirSync(outsideRoot);
  const result = runChecker(hubRoot, {
    ROUTING_SHAPE_DEBT_FILE: debtFile,
    ROUTING_SHAPE_SKILLS_ROOT: outsideRoot,
  });
  assertOnlyRoutingShapeFailure(result.stdout, 'RS-001: SMART ROUTING section has 13 lines \\(max 12\\)');
  assert.match(result.stdout, /^FAIL: 12b-routing-shape: demo-hub\/create-skill: /m);
  assert.doesNotMatch(result.stdout, /known debt/, `a skill outside the skills root is never debt:\n${result.stdout}`);
  assert.equal(result.status, 1, `expected a skill outside the skills root to exit 1:\n${result.stdout}`);
}

function testInvalidLedgerFailsRecordedPacket() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: smartLines(13) }),
  });
  const debtFile = path.join(path.dirname(hubRoot), 'routing-shape-known-debt.json');
  fs.writeFileSync(debtFile, '{ "debt": ');
  const result = runWithDebt(hubRoot, debtFile);
  assertOnlyRoutingShapeFailure(result.stdout, 'RS-001: SMART ROUTING section has 13 lines \\(max 12\\)');
  assert.doesNotMatch(result.stdout, /known debt/, `an unreadable ledger records no debt:\n${result.stdout}`);
  assert.equal(result.status, 1, `expected an unreadable ledger to exit 1:\n${result.stdout}`);
}

function testLegacyIntegerLedgerEntryIsIgnored() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: smartLines(13) }),
  });
  const debtFile = path.join(path.dirname(hubRoot), 'routing-shape-known-debt.json');
  writeJson(debtFile, {
    description: 'fixture ledger',
    maxSmartRoutingLines: 12,
    debt: { [`${HUB_NAME}/${PACKET_A}`]: 13 },
  });
  const result = runWithDebt(hubRoot, debtFile);
  assertOnlyRoutingShapeFailure(result.stdout, 'RS-001: SMART ROUTING section has 13 lines \\(max 12\\)');
  assert.doesNotMatch(result.stdout, /known debt/, `an entry of the wrong shape records no debt:\n${result.stdout}`);
  assert.equal(result.status, 1, `expected an ignored legacy entry to exit 1:\n${result.stdout}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. RUN
// ─────────────────────────────────────────────────────────────────────────────

testCanonShapedHubAndPacketsPass();
testOverBudgetSmartRoutingFailsRS001();
testOverWordCapSmartRoutingFailsRS001();
testMachineBlockInsideSmartRoutingFailsRS002();
testMachineRouterNotLastFailsRS003();
testPacketOwnRouterFailsRS004();
testIndentedRouterInSmartRoutingFailsRS002();
testFourTickFencedRouterFailsRS002AtOpeningFence();
testUnknownFallbackChecklistIsAMachineBlock();
testFencedHeadingIsNotASection();
testRecordedDebtToleratesOldShape();
testDebtGrowthFailsRS001();
testRecordedWordDebtToleratesOverCapShape();
testWordDebtGrowthFailsRS001();
testKnownDebtListsEachCodeOnce();
testStaleDebtEntryIsReported();
testLedgerWordCapOverrideApplies();
testRecordedLengthDebtDoesNotCoverOwnRouter();
testRecordedMachineBlockDebtToleratesOne();
testMachineBlockDebtGrowthFailsRS002();
testDebtOutsideSkillsRootStillFails();
testInvalidLedgerFailsRecordedPacket();
testLegacyIntegerLedgerEntryIsIgnored();
console.log('[parent-skill-check] routing-shape fixtures passed');
