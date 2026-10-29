#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Parent Skill Check Routing Shape Test
// ───────────────────────────────────────────────────────────────────
'use strict';

/**
 * Covers the routing-shape check (12b-routing-shape) in parent-skill-check.cjs:
 * a canon-shaped hub and packet pass at exit 0, and each rule fails on its own
 * fixture — short routing prose past its budget (RS-001), a machine-router
 * section or a stray router block left in SKILL.md (RS-002), a section that is
 * not last (RS-003), a sibling ROUTER.md that is missing, not a regular file or
 * outside the skill folder (RS-004) and a body carrying no working pointer to
 * it (RS-005). The pointer is one line holding a link whose target is exactly
 * `ROUTER.md` once a leading `./` and any #anchor are stripped, so a heading
 * line counts, while an angle-bracket target, trailing text, a label split
 * across lines, a link that lives only in the frontmatter and a nested target
 * do not. The known-debt ledger tolerates a recorded shape while still failing
 * one that grew past a recorded limit, one that raised a code its entry never
 * recorded, a machine block left in the routing prose and a ROUTER.md that is
 * not a missing regular file, and a packet with no router file is tolerated by
 * check 12a only when its entry records RS-004. The checker
 * resolves its contract libraries from the repository root, so the temp
 * fixtures are audited against the same code as a live hub, and the ledger and
 * skills-root overrides keep the live ledger out of every case.
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

// The pointer every SKILL.md in the canon carries: a relative markdown link to
// the router file in its own folder.
function pointerLine(target) {
  return `Read [\`ROUTER.md\`](${target}) before loading packet-local resources.`;
}

const CANON_SMART_LINES = [
  'This packet handles the workflow its mode registers.',
  'The hub `ROUTER.md` selects it from surface intent.',
  'Load only the references this packet declares before acting.',
  'Machine-readable signals live in that file, never here.',
  'A request that matches no mode falls back to UNKNOWN_FALLBACK.',
  'Keep this section prose only: no code block belongs here.',
];

const CANON_ROUTER_BLOCK = ['INTENT_SIGNALS = {}', '', 'RESOURCE_MAP = {}'];

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

// A hub SKILL.md in the routing canon: short SMART ROUTING prose and one link
// to the root router. The router itself lives in the sibling file.
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

// One `## MACHINE ROUTER` section as a fixture writes it: the heading, then the
// machine block unless `block` is null, so a prose-only section is one argument.
function routerSection({ heading = '## MACHINE ROUTER', block = CANON_ROUTER_BLOCK } = {}) {
  return { heading, block };
}

// A packet SKILL.md in the routing canon: short prose, the pointer, and no
// router section. The knobs build each defect.
function packetSkillMd(name, {
  smart = CANON_SMART_LINES,
  pointer = true,
  pointerTarget = './ROUTER.md',
  pointerLines = null,
  pointerOnHeading = false,
  frontmatterLink = false,
  routerSections = [],
  trailingH2 = false,
} = {}) {
  const frontmatter = ['---', `name: ${name}`];
  // Frontmatter metadata loads with the skill, so a link there points at the
  // router without ever being the body's pointer.
  if (frontmatterLink) frontmatter.push('see: "Routing detail: [`ROUTER.md`](./ROUTER.md)"');
  frontmatter.push('---');
  const heading = pointerOnHeading
    ? `## 2. SMART ROUTING [\`ROUTER.md\`](${pointerTarget})`
    : '## 2. SMART ROUTING';
  const lines = [...frontmatter, `# ${name}`, '', heading, '', ...smart, ''];
  if (pointer) lines.push(...(pointerLines || [pointerLine(pointerTarget)]), '');
  for (const section of routerSections) {
    lines.push(section.heading, '');
    if (section.block !== null) lines.push('```python', ...section.block, '```', '');
  }
  if (trailingH2) lines.push('## 3. HOW IT WORKS', '', 'The packet body follows the router.', '');
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
    'title: demo-hub Surface Router — stage1-only',
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

// A packet owns no mode registry to stage against, so its router is active and
// maps the leaves its mode loads. The paths are the hub-qualified ones the leaf
// manifest registers, which is the same grammar the hub's own router uses.
function packetRouter(name, leaf) {
  return [
    '---',
    `title: ${name} packet router`,
    'version: 1.0.0.0',
    'router_state: active',
    'skill_pointer: SKILL.md',
    '---',
    '',
    `# ${name} Packet Router`,
    '',
    '## 1. OVERVIEW',
    '',
    `Second-layer router for the ${name} packet. The hub registry picks the mode;`,
    'this file maps its intent to the leaves it loads.',
    '',
    '## 2. INTENT MODEL',
    '',
    '- **alpha leaves** — the resources an alpha request loads.',
    '',
    '## 3. MACHINE-READABLE ROUTER',
    '',
    '```python',
    'DEFAULT_RESOURCE = []',
    '',
    'INTENT_SIGNALS = {',
    '    "ALPHA": {"weight": 4, "keywords": ["alpha intent"]},',
    '}',
    '',
    'RESOURCE_MAP = {',
    `    "ALPHA": ["${name}/references/${leaf}"],`,
    '}',
    '```',
    '',
  ].join('\n');
}

// Both packets carry their own router by default: a skill with no router file
// is the defect under test, not the baseline.
function buildCleanFixture({
  hubSkill = canonHubSkillMd(),
  packetASkill = packetSkillMd(PACKET_A),
  packetBSkill = packetSkillMd(PACKET_B),
  packetARouter = packetRouter(PACKET_A, 'hello.md'),
  packetBRouter = packetRouter(PACKET_B, 'world.md'),
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
    { dir: path.join(hubRoot, PACKET_B), skill: packetBSkill, leaf: 'world.md', router: packetBRouter },
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

function routingShapeFailLines(stdout) {
  return failLines(stdout).filter((line) => line.startsWith('FAIL: 12b-routing-shape: '));
}

// A missing router file fails 12a as well, so each routing-shape case names the
// one 12b line it is about instead of counting every FAIL in the run.
function assertOnlyRoutingShapeFailure(stdout, code) {
  const lines = routingShapeFailLines(stdout);
  assert.equal(lines.length, 1, `expected exactly one 12b FAIL line, got:\n${stdout}`);
  assert.match(lines[0], new RegExp(code), `expected ${code} in "${lines[0]}"`);
}

function assertRoutingShapePass(stdout, knownDebt = 0) {
  assert.match(
    stdout,
    new RegExp(`^PASS: 12b-routing-shape: hub and 2 packet\\(s\\) follow the routing canon \\(${knownDebt} known debt\\)$`, 'm'),
    `expected the 12b PASS line:\n${stdout}`,
  );
}

function assertPacketRouterPass(stdout, label) {
  assert.match(
    stdout,
    new RegExp(`^PASS: 12a-router-contract: ${label}: ROUTER\\.md conforms to the two-state contract \\(active\\)$`, 'm'),
    `expected a 12a PASS line for ${label}:\n${stdout}`,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. TESTS: POSITIVE
// ─────────────────────────────────────────────────────────────────────────────

function testCanonShapedHubAndPacketsPass() {
  const hubRoot = buildCleanFixture();
  const result = runChecker(hubRoot);
  assertRoutingShapePass(result.stdout);
  assertPacketRouterPass(result.stdout, `${HUB_NAME}/${PACKET_A}`);
  assertPacketRouterPass(result.stdout, `${HUB_NAME}/${PACKET_B}`);
  assert.equal(failLines(result.stdout).length, 0, `expected no FAIL lines:\n${result.stdout}`);
  assert.equal(result.status, 0, `expected a canon-shaped fixture to exit 0:\n${result.stdout}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. TESTS: NEGATIVES (one rule per fixture)
// ─────────────────────────────────────────────────────────────────────────────

function testOverBudgetSmartRoutingFailsRS001() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: smartLines(13) }),
  });
  const result = runChecker(hubRoot);
  assertOnlyRoutingShapeFailure(result.stdout, 'RS-001: SMART ROUTING section has 14 lines \\(max 12\\)');
  assert.equal(result.status, 1, `expected an over-budget packet to exit 1:\n${result.stdout}`);
}

function testOverWordCapSmartRoutingFailsRS001() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: wordySmartLines(10, 20) }),
  });
  const result = runChecker(hubRoot);
  assertOnlyRoutingShapeFailure(result.stdout, 'RS-001: SMART ROUTING section has 206 words \\(max 180\\)');
  assert.equal(result.status, 1, `expected a packet over the word cap to exit 1:\n${result.stdout}`);
}

function testMachineRouterSectionFailsRS002() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { routerSections: [routerSection()] }),
  });
  const result = runChecker(hubRoot);
  assertOnlyRoutingShapeFailure(result.stdout, "RS-002: '## MACHINE ROUTER' section at line \\d+ belongs in the sibling ROUTER\\.md");
  assert.equal(result.status, 1, `expected a router section left in SKILL.md to exit 1:\n${result.stdout}`);
}

// Prose alone is still a second home for the router, so the section's body
// cannot decide whether the rule applies.
function testProseOnlyMachineRouterSectionFailsRS002() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { routerSections: [routerSection({ block: null })] }),
  });
  const result = runChecker(hubRoot);
  assertOnlyRoutingShapeFailure(result.stdout, "RS-002: '## MACHINE ROUTER' section at line \\d+ belongs in the sibling ROUTER\\.md");
  assert.equal(result.status, 1, `expected a prose-only router section to exit 1:\n${result.stdout}`);
}

function testNumberedMachineRouterSectionFailsRS002() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { routerSections: [routerSection({ heading: '## 3. MACHINE ROUTER' })] }),
  });
  const result = runChecker(hubRoot);
  assertOnlyRoutingShapeFailure(result.stdout, "RS-002: '## MACHINE ROUTER' section at line \\d+ belongs in the sibling ROUTER\\.md");
  assert.equal(result.status, 1, `expected a numbered router section to exit 1:\n${result.stdout}`);
}

// One missing file breaks two rules: the router is absent, and the pointer to
// it resolves nowhere. Both lines name the packet.
function testMissingPacketRouterFailsRS004() {
  const hubRoot = buildCleanFixture({ packetARouter: null });
  const result = runChecker(hubRoot);
  const lines = routingShapeFailLines(result.stdout);
  assert.equal(lines.length, 2, `expected the router and pointer findings, got:\n${result.stdout}`);
  assert.match(lines[0], new RegExp(`^FAIL: 12b-routing-shape: ${HUB_NAME}/${PACKET_A}: routing shape RS-004: no sibling ROUTER\\.md beside SKILL\\.md`), lines[0]);
  assert.match(lines[1], new RegExp(`^FAIL: 12b-routing-shape: ${HUB_NAME}/${PACKET_A}: routing shape RS-005: the link to '\\./ROUTER\\.md' does not resolve to a file inside the skill folder`), lines[1]);
  assert.match(result.stdout, new RegExp(`^FAIL: 12a-router-contract: ${HUB_NAME}/${PACKET_A}: RRC-001 — `, 'm'));
  assert.equal(result.status, 1, `expected a packet-owned router to be required:\n${result.stdout}`);
}

// A router reached through a link that leaves the folder is a foreign file: the
// escape and the pointer that leads out of the folder are both reported, even
// though the file reads as a valid router.
function testEscapedRouterFailsRS004() {
  const hubRoot = buildCleanFixture();
  const packetDir = path.join(hubRoot, PACKET_A);
  const outside = path.join(path.dirname(hubRoot), 'outside-router.md');
  fs.writeFileSync(outside, packetRouter(PACKET_A, 'hello.md'));
  fs.rmSync(path.join(packetDir, 'ROUTER.md'));
  fs.symlinkSync(outside, path.join(packetDir, 'ROUTER.md'));

  const result = runChecker(hubRoot);
  const lines = routingShapeFailLines(result.stdout);
  assert.equal(lines.length, 2, `expected the escape and pointer findings, got:\n${result.stdout}`);
  assert.match(lines[0], /routing shape RS-004: sibling ROUTER\.md resolves outside the skill folder \(/, lines[0]);
  assert.match(lines[0], /outside-router\.md/, 'the escape names where the file went');
  assert.match(lines[1], /routing shape RS-005: the link to '\.\/ROUTER\.md' does not resolve to a file inside the skill folder/, lines[1]);
  assert.equal(result.status, 1, `expected a router outside the skill folder to exit 1:\n${result.stdout}`);
}

// A path that is not a regular file reads as no router at all: the pointer has
// nothing to open, so the file and its pointer are both reported.
function testRouterDirectoryFailsRS004() {
  const hubRoot = buildCleanFixture();
  const routerPath = path.join(hubRoot, PACKET_A, 'ROUTER.md');
  fs.rmSync(routerPath);
  fs.mkdirSync(routerPath);

  const result = runChecker(hubRoot);
  const lines = routingShapeFailLines(result.stdout);
  assert.equal(lines.length, 2, `expected the file and pointer findings, got:\n${result.stdout}`);
  assert.match(lines[0], /routing shape RS-004: sibling ROUTER\.md is not a regular file, so the skill owns no router it can read$/, lines[0]);
  assert.match(lines[1], /routing shape RS-005: the link to '\.\/ROUTER\.md' does not resolve to a file inside the skill folder$/, lines[1]);
  assert.equal(result.status, 1, `expected a router directory to exit 1:\n${result.stdout}`);
}

function testMissingPointerFailsRS005() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { pointer: false }),
  });
  const result = runChecker(hubRoot);
  assertOnlyRoutingShapeFailure(result.stdout, 'RS-005: no relative markdown link to the sibling ROUTER\\.md');
  assert.equal(result.status, 1, `expected a SKILL.md with no pointer to exit 1:\n${result.stdout}`);
}

// The parent's router resolves on disk, but a path out of the folder is not
// this skill's pointer, so the skill carries no pointer at all.
function testPointerOutsideThePacketIsNotAPointer() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { pointerTarget: '../ROUTER.md' }),
  });
  const result = runChecker(hubRoot);
  assertOnlyRoutingShapeFailure(result.stdout, 'RS-005: no relative markdown link to the sibling ROUTER\.md');
  assert.equal(result.status, 1, `expected a pointer out of the folder to exit 1:\n${result.stdout}`);
}

// A pointer on a heading line is still a pointer: the rule reads the body line
// by line and never asks what else that line carries.
function testPointerOnAHeadingLineCounts() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { pointer: false, pointerOnHeading: true }),
  });
  const result = runChecker(hubRoot);
  assertRoutingShapePass(result.stdout);
  assert.equal(failLines(result.stdout).length, 0, `expected a heading-line pointer to raise no finding:\n${result.stdout}`);
  assert.equal(result.status, 0, `expected a heading-line pointer to exit 0:\n${result.stdout}`);
}

// A nested target names another folder's router, so it is no pointer to this
// skill's own file even when that nested file exists.
function testPointerToANestedRouterIsNotAPointer() {
  for (const target of ['./child/ROUTER.md', './references/ROUTER.md']) {
    const hubRoot = buildCleanFixture({
      packetASkill: packetSkillMd(PACKET_A, { pointerTarget: target }),
    });
    const nested = path.join(hubRoot, PACKET_A, target.slice(2));
    fs.mkdirSync(path.dirname(nested), { recursive: true });
    fs.writeFileSync(nested, '## MACHINE ROUTER\n');

    const result = runChecker(hubRoot);
    assertOnlyRoutingShapeFailure(result.stdout, 'RS-005: no relative markdown link to the sibling ROUTER\.md');
    assert.equal(result.status, 1, `expected ${target} to be no pointer:\n${result.stdout}`);
  }
}

// The link form is exact: an angle-bracket target, a target followed by text, a
// label split across two lines and a link that lives only in the frontmatter
// all fail to name the file.
function testNonPointerLinkFormsFailRS005() {
  const fixtures = [
    { label: 'an angle-bracket target', options: { pointerTarget: '<./ROUTER.md>' } },
    { label: 'text after the target', options: { pointerLines: [pointerLine('./ROUTER.md extra words')] } },
    {
      label: 'a label split across lines',
      options: { pointerLines: ['Structured routing detail: [`ROUTER', '.md`](./ROUTER.md).'] },
    },
    { label: 'a link only in the frontmatter', options: { pointer: false, frontmatterLink: true } },
  ];
  for (const fixture of fixtures) {
    const hubRoot = buildCleanFixture({ packetASkill: packetSkillMd(PACKET_A, fixture.options) });
    const result = runChecker(hubRoot);
    assertOnlyRoutingShapeFailure(result.stdout, 'RS-005: no relative markdown link to the sibling ROUTER\.md');
    assert.equal(result.status, 1, `expected ${fixture.label} to exit 1:\n${result.stdout}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. TESTS: SECTION AND BLOCK DETECTION
// ─────────────────────────────────────────────────────────────────────────────

// A heading inside a four-backtick fence is template text, not a section, so
// the real router file stays the only router.
const FENCED_HEADING_LINES = [
  'Prose names the packet and the references it loads.',
  '',
  '````markdown',
  '```',
  '## MACHINE ROUTER',
  '```',
  '````',
];

// Four-space indentation is a code block in markdown, so a router written that
// way declares routing without the heading.
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

function testFencedHeadingIsNotASection() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: FENCED_HEADING_LINES }),
  });
  const result = runChecker(hubRoot);
  assertRoutingShapePass(result.stdout);
  assert.equal(failLines(result.stdout).length, 0, `expected a fenced heading to raise no finding:\n${result.stdout}`);
  assert.equal(result.status, 0, `expected a fenced heading to exit 0:\n${result.stdout}`);
}

// A router written as an indented block declares routing in SKILL.md without
// the heading, so the block is the finding.
function testIndentedRouterInSmartRoutingFailsRS002() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: [...CANON_SMART_LINES, ...INDENTED_ROUTER_LINES] }),
  });
  const result = runChecker(hubRoot);
  assertOnlyRoutingShapeFailure(result.stdout, "RS-002: machine router block at line \\d+ is outside any '## MACHINE ROUTER' section");
  assert.equal(result.status, 1, `expected an unfenced router to exit 1:\n${result.stdout}`);
}

function testFourTickFencedRouterFailsRS002AtOpeningFence() {
  const packet = packetSkillMd(PACKET_A, { smart: FOUR_TICK_WRAPPED_ROUTER });
  const openingLine = packet.split('\n').indexOf('````markdown') + 1;
  const hubRoot = buildCleanFixture({ packetASkill: packet });
  const result = runChecker(hubRoot);
  assertOnlyRoutingShapeFailure(result.stdout, `RS-002: machine router block at line ${openingLine} is outside any`);
  assert.equal(result.status, 1, `expected a router inside a nested fence to exit 1:\n${result.stdout}`);
}

function testUnknownFallbackChecklistIsAMachineBlock() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: [...CANON_SMART_LINES, 'UNKNOWN_FALLBACK_CHECKLIST = []'] }),
  });
  const result = runChecker(hubRoot);
  assertOnlyRoutingShapeFailure(result.stdout, 'RS-002: machine router block at line \\d+ is outside any');
  assert.equal(result.status, 1, `expected the checklist in the routing prose to exit 1:\n${result.stdout}`);
}

// The section is a finding wherever it sits, and a section that is not last is
// reported on its own because a later H2 would be read as router text.
function testMachineRouterNotLastFailsRS003() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { routerSections: [routerSection()], trailingH2: true }),
  });
  const result = runChecker(hubRoot);
  const lines = routingShapeFailLines(result.stdout);
  assert.equal(lines.length, 2, `expected the section and position findings, got:\n${result.stdout}`);
  assert.match(lines[0], /routing shape RS-002: '## MACHINE ROUTER' section at line \d+/, lines[0]);
  assert.match(lines[1], /routing shape RS-003: '## MACHINE ROUTER' is not the last H2 section/, lines[1]);
  assert.equal(result.status, 1, `expected a non-final MACHINE ROUTER to exit 1:\n${result.stdout}`);
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
  const debtFile = writeDebt(hubRoot, debtEntry({ lines: 14, codes: ['RS-001'] }));
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
  const debtFile = writeDebt(hubRoot, debtEntry({ lines: 14, codes: ['RS-001'] }));
  const result = runWithDebt(hubRoot, debtFile);
  assertOnlyRoutingShapeFailure(
    result.stdout,
    'RS-001: SMART ROUTING section has 15 lines \\(max 12\\) \\(grew past its recorded known debt of 14 lines\\)',
  );
  assert.doesNotMatch(result.stdout, /^PASS: 12b-routing-shape:/m);
  assert.equal(result.status, 1, `expected debt growth to exit 1:\n${result.stdout}`);
}

function testRecordedWordDebtToleratesOverCapShape() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: wordySmartLines(10, 20) }),
  });
  const debtFile = writeDebt(hubRoot, debtEntry({ words: 206, codes: ['RS-001'] }));
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
  const debtFile = writeDebt(hubRoot, debtEntry({ words: 200, codes: ['RS-001'] }));
  const result = runWithDebt(hubRoot, debtFile);
  assertOnlyRoutingShapeFailure(
    result.stdout,
    'RS-001: SMART ROUTING section has 206 words \\(max 180\\) \\(grew past its recorded known debt of 200 words\\)',
  );
  assert.equal(result.status, 1, `expected word growth to exit 1:\n${result.stdout}`);
}

function testKnownDebtListsEachCodeOnce() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: [...smartLines(13), ...wordySmartLines(10, 20)] }),
  });
  const debtFile = writeDebt(hubRoot, debtEntry({ lines: 24, words: 336, codes: ['RS-001'] }));
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
  const debtFile = writeDebt(hubRoot, debtEntry({ lines: 14, codes: ['RS-001'] }));
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

// A recorded section count is the whole test for RS-002, because the rule
// counts sections rather than their contents.
function testRecordedSectionDebtToleratesOne() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { routerSections: [routerSection()] }),
  });
  const debtFile = writeDebt(hubRoot, debtEntry({ machineBlocks: 1, codes: ['RS-002'] }));
  const result = runWithDebt(hubRoot, debtFile);
  assert.match(
    result.stdout,
    new RegExp(`^INFO: 12b-routing-shape: ${HUB_NAME}/${PACKET_A}: routing shape: known debt, RS-002 \\(migrate to the routing canon\\)$`, 'm'),
    `expected the known-debt advisory:\n${result.stdout}`,
  );
  assertRoutingShapePass(result.stdout, 1);
  assert.equal(result.status, 0, `expected one recorded router section to exit 0:\n${result.stdout}`);
}

// One recorded section is tolerated, and the machine block beside it is not:
// the ledger records the router a skill has not moved yet, never a copy of that
// router left behind in the routing prose.
function testRecordedSectionToleratesTheSectionButNotTheBlock() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, {
      smart: [...CANON_SMART_LINES, 'INTENT_SIGNALS = {}'],
      routerSections: [routerSection()],
    }),
  });
  const debtFile = writeDebt(hubRoot, debtEntry({ machineBlocks: 1, codes: ['RS-002'] }));
  const result = runWithDebt(hubRoot, debtFile);
  assertOnlyRoutingShapeFailure(
    result.stdout,
    "RS-002: machine router block at line \\d+ is outside any .* \\(a recorded RS-002 tolerates only a trailing '## MACHINE ROUTER' section\\)",
  );
  assert.match(
    result.stdout,
    new RegExp(`^INFO: 12b-routing-shape: ${HUB_NAME}/${PACKET_A}: routing shape: known debt, RS-002 \\(migrate to the routing canon\\)$`, 'm'),
    `expected the recorded section to stay tolerated:\n${result.stdout}`,
  );
  assert.doesNotMatch(result.stdout, /^PASS: 12b-routing-shape:/m);
  assert.equal(result.status, 1, `expected the block beside the section to exit 1:\n${result.stdout}`);
}

// A missing router is the shape an RS-004 entry records. A directory in the
// file's place is a router that exists and still cannot be read, so no entry
// covers it, while the recorded pointer code still covers the link it kept.
function testRecordedRS004DoesNotCoverARouterDirectory() {
  const hubRoot = buildCleanFixture();
  const routerPath = path.join(hubRoot, PACKET_A, 'ROUTER.md');
  fs.rmSync(routerPath);
  fs.mkdirSync(routerPath);
  const debtFile = writeDebt(hubRoot, debtEntry({ codes: ['RS-004', 'RS-005'] }));
  const result = runWithDebt(hubRoot, debtFile);
  assertOnlyRoutingShapeFailure(
    result.stdout,
    'RS-004: sibling ROUTER\\.md is not a regular file, so the skill owns no router it can read \\(a recorded RS-004 tolerates only a missing ROUTER\\.md\\)',
  );
  assert.match(
    result.stdout,
    new RegExp(`^INFO: 12b-routing-shape: ${HUB_NAME}/${PACKET_A}: routing shape: known debt, RS-005 \\(migrate to the routing canon\\)$`, 'm'),
    `expected the recorded pointer code to stay tolerated:\n${result.stdout}`,
  );
  assert.equal(result.status, 1, `expected a recorded RS-004 to leave a directory failing:\n${result.stdout}`);
}

// A router reached through a link that leaves the folder is never migration
// debt, because the entry records a file the skill has not moved, not one it
// borrows from elsewhere.
function testRecordedRS004DoesNotCoverAnEscapingRouter() {
  const hubRoot = buildCleanFixture();
  const packetDir = path.join(hubRoot, PACKET_A);
  const outside = path.join(path.dirname(hubRoot), 'debt-outside-router.md');
  fs.writeFileSync(outside, packetRouter(PACKET_A, 'hello.md'));
  fs.rmSync(path.join(packetDir, 'ROUTER.md'));
  fs.symlinkSync(outside, path.join(packetDir, 'ROUTER.md'));
  const debtFile = writeDebt(hubRoot, debtEntry({ codes: ['RS-004', 'RS-005'] }));

  const result = runWithDebt(hubRoot, debtFile);
  assertOnlyRoutingShapeFailure(
    result.stdout,
    'RS-004: sibling ROUTER\\.md resolves outside the skill folder \\(.*debt-outside-router\\.md\\) \\(a recorded RS-004 tolerates only a missing ROUTER\\.md\\)',
  );
  assert.equal(result.status, 1, `expected a recorded RS-004 to leave an escape failing:\n${result.stdout}`);
}

// Recording one code cannot excuse another: the entry lists RS-002 and RS-004,
// so the broken pointer it never recorded is still a failure.
function testRecordedCodesDoNotCoverAnUnrecordedRule() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { routerSections: [routerSection()] }),
    packetARouter: null,
  });
  const debtFile = writeDebt(hubRoot, debtEntry({ machineBlocks: 1, codes: ['RS-002', 'RS-004'] }));
  const result = runWithDebt(hubRoot, debtFile);
  assertOnlyRoutingShapeFailure(result.stdout, "RS-005: the link to '\\./ROUTER\\.md' does not resolve to a file inside the skill folder");
  assert.match(
    result.stdout,
    new RegExp(`^INFO: 12b-routing-shape: ${HUB_NAME}/${PACKET_A}: routing shape: known debt, RS-002, RS-004 \\(migrate to the routing canon\\)$`, 'm'),
    `expected the recorded codes to stay tolerated:\n${result.stdout}`,
  );
  assert.match(result.stdout, new RegExp(`^INFO: 12a-router-contract: ${HUB_NAME}/${PACKET_A}: ROUTER\\.md: known debt, RS-004 `, 'm'));
  assert.equal(result.status, 1, `expected an unrecorded RS-005 to exit 1:\n${result.stdout}`);
}

// The unmoved packet shape: a router section in SKILL.md, no router file and no
// pointer. Recorded for all three codes, it must pass both checks.
function testRecordedOldShapePacketPassesBothChecks() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { pointer: false, routerSections: [routerSection()] }),
    packetARouter: null,
  });
  const debtFile = writeDebt(hubRoot, debtEntry({ machineBlocks: 1, codes: ['RS-002', 'RS-004', 'RS-005'] }));
  const result = runWithDebt(hubRoot, debtFile);
  assert.match(
    result.stdout,
    new RegExp(`^INFO: 12b-routing-shape: ${HUB_NAME}/${PACKET_A}: routing shape: known debt, RS-002, RS-004, RS-005 \\(migrate to the routing canon\\)$`, 'm'),
    `expected every recorded code to be tolerated:\n${result.stdout}`,
  );
  assert.match(result.stdout, new RegExp(`^INFO: 12a-router-contract: ${HUB_NAME}/${PACKET_A}: ROUTER\\.md: known debt, RS-004 `, 'm'));
  assertRoutingShapePass(result.stdout, 1);
  assert.equal(failLines(result.stdout).length, 0, `expected no FAIL lines:\n${result.stdout}`);
  assert.equal(result.status, 0, `expected a recorded old-shape packet to exit 0:\n${result.stdout}`);
}

// The hub root is a skill too, so removing its router file is the same defect.
function testHubWithoutRouterFailsRS004() {
  const hubRoot = buildCleanFixture();
  fs.rmSync(path.join(hubRoot, 'ROUTER.md'));
  const result = runChecker(hubRoot);
  const lines = routingShapeFailLines(result.stdout);
  assert.equal(lines.length, 2, `expected the router and pointer findings, got:\n${result.stdout}`);
  assert.match(lines[0], /^FAIL: 12b-routing-shape: demo-hub: routing shape RS-004: no sibling ROUTER\.md beside SKILL\.md/, lines[0]);
  assert.match(lines[1], /^FAIL: 12b-routing-shape: demo-hub: routing shape RS-005: the link to '\.\/ROUTER\.md' does not resolve to a file inside the skill folder/, lines[1]);
  assert.match(result.stdout, /^FAIL: 12a-router-contract: RRC-001 — /m);
  assert.equal(result.status, 1, `expected a hub without a router to exit 1:\n${result.stdout}`);
}

function testDebtOutsideSkillsRootStillFails() {
  const hubRoot = buildCleanFixture({
    packetASkill: packetSkillMd(PACKET_A, { smart: smartLines(13) }),
  });
  const debtFile = writeDebt(hubRoot, debtEntry({ lines: 14, codes: ['RS-001'] }));
  const outsideRoot = path.join(path.dirname(hubRoot), 'other-skills-root');
  fs.mkdirSync(outsideRoot);
  const result = runChecker(hubRoot, {
    ROUTING_SHAPE_DEBT_FILE: debtFile,
    ROUTING_SHAPE_SKILLS_ROOT: outsideRoot,
  });
  assertOnlyRoutingShapeFailure(result.stdout, 'RS-001: SMART ROUTING section has 14 lines \\(max 12\\)');
  assert.match(result.stdout, new RegExp(`^FAIL: 12b-routing-shape: ${HUB_NAME}/${PACKET_A}: `, 'm'));
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
  assertOnlyRoutingShapeFailure(result.stdout, 'RS-001: SMART ROUTING section has 14 lines \\(max 12\\)');
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
  assertOnlyRoutingShapeFailure(result.stdout, 'RS-001: SMART ROUTING section has 14 lines \\(max 12\\)');
  assert.doesNotMatch(result.stdout, /known debt/, `an entry of the wrong shape records no debt:\n${result.stdout}`);
  assert.equal(result.status, 1, `expected an ignored legacy entry to exit 1:\n${result.stdout}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. RUN
// ─────────────────────────────────────────────────────────────────────────────

testCanonShapedHubAndPacketsPass();
testOverBudgetSmartRoutingFailsRS001();
testOverWordCapSmartRoutingFailsRS001();
testMachineRouterSectionFailsRS002();
testProseOnlyMachineRouterSectionFailsRS002();
testNumberedMachineRouterSectionFailsRS002();
testMissingPacketRouterFailsRS004();
testEscapedRouterFailsRS004();
testMissingPointerFailsRS005();
testPointerOutsideThePacketIsNotAPointer();
testPointerOnAHeadingLineCounts();
testPointerToANestedRouterIsNotAPointer();
testNonPointerLinkFormsFailRS005();
testRouterDirectoryFailsRS004();
testFencedHeadingIsNotASection();
testIndentedRouterInSmartRoutingFailsRS002();
testFourTickFencedRouterFailsRS002AtOpeningFence();
testUnknownFallbackChecklistIsAMachineBlock();
testMachineRouterNotLastFailsRS003();
testRecordedDebtToleratesOldShape();
testDebtGrowthFailsRS001();
testRecordedWordDebtToleratesOverCapShape();
testWordDebtGrowthFailsRS001();
testKnownDebtListsEachCodeOnce();
testStaleDebtEntryIsReported();
testLedgerWordCapOverrideApplies();
testRecordedSectionDebtToleratesOne();
testRecordedSectionToleratesTheSectionButNotTheBlock();
testRecordedRS004DoesNotCoverARouterDirectory();
testRecordedRS004DoesNotCoverAnEscapingRouter();
testRecordedCodesDoNotCoverAnUnrecordedRule();
testRecordedOldShapePacketPassesBothChecks();
testHubWithoutRouterFailsRS004();
testDebtOutsideSkillsRootStillFails();
testInvalidLedgerFailsRecordedPacket();
testLegacyIntegerLedgerEntryIsIgnored();
console.log('[parent-skill-check] routing-shape fixtures passed');
