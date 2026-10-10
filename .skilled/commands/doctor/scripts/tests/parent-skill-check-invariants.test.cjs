#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Parent Skill Check Invariants Test
// ───────────────────────────────────────────────────────────────────
'use strict';

/**
 * Pins the verdict of every invariant parent-skill-check.cjs reports. Each
 * case starts from one canon-clean two-mode hub built in a temp dir, injects
 * a single defect, and asserts the checker reports that invariant id. The
 * leaf-manifest (10a-10d) and root-router (12a) chains have their own suites;
 * this file carries one failing case for each so every id is pinned here too.
 *
 * Run: node .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { test, after } = require('node:test');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CHECKER_PATH = path.join(__dirname, '..', 'parent-skill-check.cjs');
const REAL_SK_DOC_ROOT = path.join(__dirname, '..', '..', '..', '..', 'skills', 'sk-doc');
const REAL_GENERATOR_PATH = path.join(REAL_SK_DOC_ROOT, 'sk-create-skill', 'scripts', 'generate-leaf-manifest.cjs');
const REAL_ADVISOR_DRIFT_GUARD = '.skilled/skills/system-skill-advisor/runtime/tests/routing-registry-drift-guard.vitest.ts';

const MODE_A = 'demo-alpha';
const MODE_B = 'demo-beta';
const VERSION = '1.0.0.0';
const READ_ONLY_SURFACE = Object.freeze({
  allowed: ['Read'], forbidden: ['Write', 'Edit', 'Task'], mutatesWorkspace: false, bashAllowlist: [],
});

const tempRoots = [];
after(() => {
  for (const root of tempRoots) fs.rmSync(root, { recursive: true, force: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. FIXTURE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function editJson(hubRoot, rel, edit) {
  const file = path.join(hubRoot, rel);
  const data = readJson(file);
  const replaced = edit(data);
  writeJson(file, replaced === undefined ? data : replaced);
}

function makeMode(workflowMode, packet, alias) {
  return {
    workflowMode,
    packetKind: 'workflow',
    backendKind: 'template-scaffold',
    toolSurface: { ...READ_ONLY_SURFACE, allowed: [...READ_ONLY_SURFACE.allowed], forbidden: [...READ_ONLY_SURFACE.forbidden] },
    packet,
    packetSkillName: packet,
    grandfatheredFolderMismatch: false,
    aliases: [alias],
    command: null,
    advisorRouting: { routingClass: 'metadata' },
  };
}

function hubSkillMd({ allowedTools = 'Read', rows = null } = {}) {
  const tableRows = rows || [
    `| **${MODE_A}** | does the alpha thing | \`pkg-alpha/\` | routes via aliases |`,
    `| **${MODE_B}** | does the beta thing | \`pkg-beta/\` | routes via aliases |`,
  ];
  return [
    '---',
    'name: demo-hub',
    `version: ${VERSION}`,
    `allowed-tools: [${allowedTools}]`,
    '---',
    '# demo-hub',
    '',
    '| Mode | Use it for | Packet | Command |',
    '|------|------------|--------|---------|',
    ...tableRows,
    '',
  ].join('\n');
}

function stage1Router() {
  return [
    '---',
    'title: demo-hub Surface Router',
    `version: ${VERSION}`,
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

function writePacket(hubRoot, packet, leaf) {
  const dir = path.join(hubRoot, packet);
  fs.mkdirSync(path.join(dir, 'changelog'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'references'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'SKILL.md'), `---\nname: ${packet}\n---\n# ${packet}\n`);
  fs.writeFileSync(path.join(dir, 'README.md'), `# ${packet}\n`);
  fs.writeFileSync(path.join(dir, 'changelog', 'CHANGELOG.md'), '# Changelog\n');
  fs.writeFileSync(path.join(dir, 'references', leaf), `# ${leaf}\n`);
}

function regenerateManifest(hubRoot) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const generator = require(REAL_GENERATOR_PATH);
  fs.writeFileSync(path.join(hubRoot, 'leaf-manifest.json'), generator.buildManifestBytes(hubRoot));
}

// A complete canon-clean hub: every invariant passes, so a single injected
// defect shows up as exactly that invariant's finding.
function buildHub(hubName = 'demo-hub') {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'parent-skill-check-invariants-'));
  tempRoots.push(fixtureRoot);
  const hubRoot = path.join(fixtureRoot, hubName);
  fs.mkdirSync(hubRoot);

  writeJson(path.join(hubRoot, 'graph-metadata.json'), { skill_id: hubName, family: 'sk-hub' });
  writeJson(path.join(hubRoot, 'mode-registry.json'), {
    skill: hubName,
    version: VERSION,
    resourceContractVersion: 1,
    modes: [makeMode(MODE_A, 'pkg-alpha', 'alpha thing'), makeMode(MODE_B, 'pkg-beta', 'beta thing')],
  });
  writeJson(path.join(hubRoot, 'hub-router.json'), {
    version: VERSION,
    routerSignals: {
      [MODE_A]: { classes: ['demo'], resources: [] },
      [MODE_B]: { classes: ['demo'], resources: [] },
    },
    vocabularyClasses: { demo: { keywords: ['alpha thing', 'beta thing'] } },
    routerPolicy: {
      defaultMode: MODE_A,
      defaultResource: [],
      tieBreak: [MODE_A, MODE_B],
      outcomes: { single: true, orderedBundle: true, defer: true },
      bundleRules: [],
    },
  });
  writeJson(path.join(hubRoot, 'description.json'), {
    name: hubName, description: 'fixture hub', version: VERSION, keywords: ['fixture', 'pkg-alpha', 'pkg-beta'],
  });
  writeJson(path.join(hubRoot, 'command-metadata.json'), []);
  fs.writeFileSync(path.join(hubRoot, 'SKILL.md'), hubSkillMd());
  fs.writeFileSync(path.join(hubRoot, 'ROUTER.md'), stage1Router());
  fs.mkdirSync(path.join(hubRoot, 'changelog'));
  fs.writeFileSync(path.join(hubRoot, 'changelog', `v${VERSION}.md`), '# Changelog\n');
  fs.mkdirSync(path.join(hubRoot, 'manual-testing-playbook'));
  fs.mkdirSync(path.join(hubRoot, 'benchmark'));
  writePacket(hubRoot, 'pkg-alpha', 'alpha.md');
  writePacket(hubRoot, 'pkg-beta', 'beta.md');
  regenerateManifest(hubRoot);
  return hubRoot;
}

// Adds a read-only surface packet plus the surface-axis extension and the
// surfaceBundle outcome, so surface-only invariants have a clean baseline.
function addSurfaceMode(hubRoot) {
  const surface = makeMode('demo-surface', 'pkg-surface', 'surface thing');
  surface.packetKind = 'surface';
  surface.backendKind = 'evidence-base';
  editJson(hubRoot, 'mode-registry.json', (r) => {
    r.modes.push(surface);
    r.extensions = { 'surface-axis': {} };
  });
  editJson(hubRoot, 'hub-router.json', (r) => {
    r.routerSignals['demo-surface'] = { classes: ['demo'], resources: [] };
    r.vocabularyClasses.demo.keywords.push('surface thing');
    r.routerPolicy.tieBreak.push('demo-surface');
    r.routerPolicy.outcomes.surfaceBundle = true;
  });
  editJson(hubRoot, 'description.json', (d) => { d.keywords.push('pkg-surface'); });
  fs.writeFileSync(path.join(hubRoot, 'SKILL.md'), hubSkillMd({
    rows: [
      `| **${MODE_A}** | alpha | \`pkg-alpha/\` | routes via aliases |`,
      `| **${MODE_B}** | beta | \`pkg-beta/\` | routes via aliases |`,
      '| **demo-surface** | evidence | `pkg-surface/` | routes via aliases |',
    ],
  }));
  writePacket(hubRoot, 'pkg-surface', 'surface.md');
  regenerateManifest(hubRoot);
}

// Adds a transport packet plus the transport-axis extension that lists it.
function addTransportMode(hubRoot) {
  const transport = makeMode('demo-transport', 'pkg-transport', 'transport thing');
  transport.packetKind = 'transport';
  transport.backendKind = 'external-cli';
  editJson(hubRoot, 'mode-registry.json', (r) => {
    r.modes.push(transport);
    r.extensions = { 'transport-axis': { transports: ['demo-transport'] } };
  });
  editJson(hubRoot, 'hub-router.json', (r) => {
    r.routerSignals['demo-transport'] = { classes: ['demo'], resources: [] };
    r.vocabularyClasses.demo.keywords.push('transport thing');
    r.routerPolicy.tieBreak.push('demo-transport');
  });
  editJson(hubRoot, 'description.json', (d) => { d.keywords.push('pkg-transport'); });
  fs.writeFileSync(path.join(hubRoot, 'SKILL.md'), hubSkillMd({
    rows: [
      `| **${MODE_A}** | alpha | \`pkg-alpha/\` | routes via aliases |`,
      `| **${MODE_B}** | beta | \`pkg-beta/\` | routes via aliases |`,
      '| **demo-transport** | bridge | `pkg-transport/` | routes via aliases |',
    ],
  }));
  writePacket(hubRoot, 'pkg-transport', 'transport.md');
  regenerateManifest(hubRoot);
}

// A python3 stand-in on PATH so the advisor cross-check runs against a known
// answer instead of the live advisor. The script argument is ignored.
function python3Stub(body) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'parent-skill-check-python-'));
  tempRoots.push(dir);
  const stub = path.join(dir, 'python3');
  fs.writeFileSync(stub, `#!/bin/sh\n${body}\n`);
  fs.chmodSync(stub, 0o755);
  return `${dir}${path.delimiter}/usr/bin${path.delimiter}/bin`;
}

function makeLexical(hubRoot, legacyAdvisorId, extraRegistry = {}) {
  editJson(hubRoot, 'mode-registry.json', (r) => {
    r.modes[0].advisorRouting = { routingClass: 'lexical', legacyAdvisorId };
    Object.assign(r, extraRegistry);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RUNNER
// ─────────────────────────────────────────────────────────────────────────────

// The checker exits the process, so it runs as a child. The strict switch is
// removed from the inherited environment so every case sees the default.
function runChecker(target, envOverrides = {}) {
  const env = { ...process.env };
  delete env.PARENT_HUB_CHECK_STRICT;
  const result = spawnSync(process.execPath, [CHECKER_PATH, target], {
    encoding: 'utf8',
    env: { ...env, ...envOverrides },
  });
  return { status: result.status, output: `${result.stdout || ''}${result.stderr || ''}` };
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function assertLine(output, verdict, id, detail) {
  const pattern = new RegExp(`^${verdict}: ${escapeRegExp(id)}:${detail ? `.*${detail}` : ''}`, 'm');
  assert.match(output, pattern, `expected "${verdict}: ${id}:${detail ? ` ...${detail}` : ''}" in:\n${output}`);
}

function assertNoStackTrace(output) {
  assert.doesNotMatch(output, /^\s+at .+:\d+:\d+\)?$/m, `checker printed a stack trace:\n${output}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. TESTS: BASELINE AND EXIT CODES
// ─────────────────────────────────────────────────────────────────────────────

test('clean fixture passes every invariant and exits 0', () => {
  const hub = buildHub();
  const { status, output } = runChecker(hub);
  assert.equal(status, 0, output);
  assert.doesNotMatch(output, /^(FAIL|WARN): /m);
  for (const id of ['1a', '1b', '1c', '2a', '2b', '3a', '3b', '3c', '3d', '3d-canon', '3d-name',
    '3d-files', '3d-alias', '3e', '3j', '5a', '5b', '5c', '5d', '5e', '5f', '5g', '5h', '5i', '5k-alias', '5k-packet', '6a', '6b',
    '6c', '7a', '8a', '8b', '9a', '9b', '10a-manifest-source', '10b-byte-drift', '10c-target-collision',
    '10d-reachability', '11a-class', '12a-router-contract', '13a-version', '13b-version']) {
    assertLine(output, 'PASS', id);
  }
});

test('missing hub directory exits 2', () => {
  const { status, output } = runChecker(path.join(os.tmpdir(), 'parent-skill-check-no-such-hub-xyz'));
  assert.equal(status, 2, output);
  assert.match(output, /ERROR: parent skill directory not found/);
});

test('STRICT=0 downgrades advisory findings to WARN and exits 0', () => {
  const hub = buildHub();
  fs.rmSync(path.join(hub, 'benchmark'), { recursive: true });
  const { status, output } = runChecker(hub, { PARENT_HUB_CHECK_STRICT: '0' });
  assertLine(output, 'WARN', '9b');
  assert.equal(status, 0, output);
});

test('STRICT=0 keeps hard failures as FAIL', () => {
  const hub = buildHub();
  editJson(hub, 'graph-metadata.json', (g) => { g.family = 'not-a-family'; });
  const { status, output } = runChecker(hub, { PARENT_HUB_CHECK_STRICT: '0' });
  assertLine(output, 'FAIL', '1c');
  assert.equal(status, 1, output);
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. TESTS: FAILING CASE PER INVARIANT
// ─────────────────────────────────────────────────────────────────────────────

// Each case: the invariant id, a one-line defect, the mutation, and an
// optional detail the FAIL line must carry. Exit status must be 1.
const FAILING_CASES = [
  ['1a', 'no graph-metadata.json', (h) => fs.rmSync(path.join(h, 'graph-metadata.json')), 'no graph-metadata'],
  ['1b', 'skill_id differs from the directory', (h) => editJson(h, 'graph-metadata.json', (g) => { g.skill_id = 'other'; })],
  ['1c', 'family outside the allowed set', (h) => editJson(h, 'graph-metadata.json', (g) => { g.family = 'nope'; })],
  ['2a', 'nested graph-metadata.json in a packet', (h) => writeJson(path.join(h, 'pkg-alpha', 'graph-metadata.json'), {})],
  ['2b', 'nested description.json in a packet', (h) => writeJson(path.join(h, 'pkg-alpha', 'description.json'), {})],
  ['3a', 'mode-registry.json missing', (h) => fs.rmSync(path.join(h, 'mode-registry.json')), 'missing'],
  ['3a', 'mode-registry.json is not JSON', (h) => fs.writeFileSync(path.join(h, 'mode-registry.json'), '{'), 'not valid JSON'],
  ['3b', 'empty modes array', (h) => editJson(h, 'mode-registry.json', (r) => { r.modes = []; })],
  ['3c', 'packet directory missing', (h) => fs.rmSync(path.join(h, 'pkg-beta'), { recursive: true }), 'not an existing'],
  ['3c', 'packet escapes the hub', (h) => editJson(h, 'mode-registry.json', (r) => { r.modes[1].packet = '../pkg-beta'; }), 'direct child'],
  ['3d', 'missing backendKind', (h) => editJson(h, 'mode-registry.json', (r) => { delete r.modes[0].backendKind; }), 'backendKind'],
  ['3d', 'invalid packetKind', (h) => editJson(h, 'mode-registry.json', (r) => { r.modes[0].packetKind = 'bogus'; }), 'packetKind'],
  ['3d', 'malformed toolSurface', (h) => editJson(h, 'mode-registry.json', (r) => { r.modes[0].toolSurface = {}; }), 'toolSurface'],
  ['3d-name', 'folder differs from packetSkillName', (h) => editJson(h, 'mode-registry.json', (r) => { r.modes[0].packetSkillName = 'renamed'; })],
  ['3d-name-frontmatter', 'packet frontmatter name differs', (h) => fs.writeFileSync(path.join(h, 'pkg-alpha', 'SKILL.md'), '---\nname: other\n---\n')],
  ['3d-files', 'packet README.md missing', (h) => fs.rmSync(path.join(h, 'pkg-alpha', 'README.md')), 'README.md'],
  ['3d-alias', 'alias duplicated across modes', (h) => editJson(h, 'mode-registry.json', (r) => { r.modes[1].aliases = ['alpha thing']; })],
  ['3e', 'invalid routingClass', (h) => editJson(h, 'mode-registry.json', (r) => { r.modes[0].advisorRouting.routingClass = 'bogus'; })],
  ['3f', 'surface-axis declared without a surface', (h) => editJson(h, 'mode-registry.json', (r) => { r.extensions = { 'surface-axis': {} }; })],
  ['3g', 'surface packet with a mutating backend', (h) => {
    addSurfaceMode(h);
    editJson(h, 'mode-registry.json', (r) => { r.modes[2].backendKind = 'template-scaffold'; });
  }, 'evidence-base'],
  ['3h', 'transport packet missing from transports[]', (h) => {
    addTransportMode(h);
    editJson(h, 'mode-registry.json', (r) => { r.extensions['transport-axis'].transports = []; });
  }, 'transports'],
  ['3i', 'Write grant on a non-mutating mode', (h) => {
    editJson(h, 'mode-registry.json', (r) => { r.modes[0].toolSurface.allowed.push('Write'); r.modes[0].toolSurface.forbidden = []; });
    fs.writeFileSync(path.join(h, 'SKILL.md'), hubSkillMd({ allowedTools: 'Read, Write' }));
  }, 'grants Write'],
  ['3j', 'hub over-grants a tool', (h) => fs.writeFileSync(path.join(h, 'SKILL.md'), hubSkillMd({ allowedTools: 'Read, Task' })), 'no mode declares'],
  ['4a', 'lexical mode with no drift guard', (h) => makeLexical(h, 'demo-legacy'), 'no driftGuard'],
  ['4a', 'declared drift guard missing on disk', (h) => makeLexical(h, 'demo-legacy', {
    advisorRoutingContract: { driftGuard: 'no/such/drift-guard.vitest.ts' },
  }), 'missing'],
  ['5a', 'hub-router.json missing', (h) => fs.rmSync(path.join(h, 'hub-router.json')), 'missing'],
  ['5b', 'stray router signal', (h) => editJson(h, 'hub-router.json', (r) => { r.routerSignals.ghost = { classes: [] }; }), 'ghost'],
  ['5c', 'undefined vocabulary class', (h) => editJson(h, 'hub-router.json', (r) => { r.routerSignals[MODE_A].classes = ['nope']; }), 'nope'],
  ['5d', 'router resource missing on disk', (h) => editJson(h, 'hub-router.json', (r) => { r.routerSignals[MODE_A].resources = ['gone.md']; }), 'gone.md'],
  ['5e', 'tieBreak misses a mode', (h) => editJson(h, 'hub-router.json', (r) => { r.routerPolicy.tieBreak = [MODE_A]; })],
  ['5f', 'bundle rule names an unknown mode', (h) => editJson(h, 'hub-router.json', (r) => { r.routerPolicy.bundleRules = [{ whenPrimary: 'ghost' }]; }), 'ghost'],
  ['5g', 'base outcome missing', (h) => editJson(h, 'hub-router.json', (r) => { delete r.routerPolicy.outcomes.defer; }), 'defer'],
  ['5h', 'defaultMode not registered', (h) => editJson(h, 'hub-router.json', (r) => { r.routerPolicy.defaultMode = 'ghost'; }), 'ghost'],
  ['5i', 'workflow mode ordered after a surface', (h) => {
    addSurfaceMode(h);
    editJson(h, 'hub-router.json', (r) => { r.routerPolicy.tieBreak = [MODE_A, 'demo-surface', MODE_B]; });
  }],
  ['5j', 'stray command-subworkflow signal', (h) => editJson(h, 'hub-router.json', (r) => {
    r.commandSubworkflowSignals = { ghost: { ownerMode: MODE_A, command: '/demo:ghost' } };
  }), 'ghost'],
  ['5k-alias', 'registry alias absent from its signal vocabulary', (h) => editJson(h, 'mode-registry.json', (r) => { r.modes[0].aliases.push('yagni'); }), 'yagni'],
  ['5k-packet', 'packet name absent from description keywords', (h) => editJson(h, 'description.json', (d) => { d.keywords = d.keywords.filter((k) => k !== 'pkg-alpha'); }), 'pkg-alpha'],
  ['6a', 'unregistered child directory', (h) => fs.mkdirSync(path.join(h, 'stray-dir')), 'stray-dir'],
  ['6b', 'mode missing from the mode table', (h) => fs.writeFileSync(path.join(h, 'SKILL.md'), hubSkillMd({
    rows: [`| **${MODE_A}** | alpha | \`pkg-alpha/\` | routes via aliases |`],
  })), MODE_B],
  ['6c', 'mode row hides a registered command', (h) => editJson(h, 'mode-registry.json', (r) => { r.modes[0].command = '/demo:alpha'; }), MODE_A],
  ['7a', 'hub changelog missing', (h) => fs.rmSync(path.join(h, 'changelog'), { recursive: true }), 'no changelog'],
  ['7a', 'symlinked changelog entry', (h) => fs.symlinkSync(path.join(h, 'changelog', `v${VERSION}.md`), path.join(h, 'changelog', 'linked.md')), 'symlinked'],
  ['8a', 'description.json missing', (h) => fs.rmSync(path.join(h, 'description.json')), 'missing'],
  ['8b', 'description.json duplicates registry modes', (h) => editJson(h, 'description.json', (d) => { d.modes = ['x']; }), 'modes'],
  ['9a', 'playbook missing', (h) => fs.rmSync(path.join(h, 'manual-testing-playbook'), { recursive: true })],
  ['9b', 'benchmark missing', (h) => fs.rmSync(path.join(h, 'benchmark'), { recursive: true })],
  ['10a-manifest-source', 'leaf-manifest.json is not JSON', (h) => fs.writeFileSync(path.join(h, 'leaf-manifest.json'), '{'), 'malformed'],
  ['10b-byte-drift', 'leaf added after generation', (h) => fs.writeFileSync(path.join(h, 'pkg-alpha', 'references', 'extra.md'), '# x\n'), 'stale'],
  ['10c-target-collision', 'alias claims an on-disk composite', (h) => writeJson(path.join(h, 'leaf-aliases.json'), [
    { workflowMode: MODE_A, leafResourceId: 'references/alpha.md', diskPath: 'pkg-alpha/references/alpha.md' },
  ]), 'duplicate'],
  ['10d-reachability', 'manifest names an unregistered mode', (h) => editJson(h, 'mode-registry.json', (r) => { r.modes.pop(); }), MODE_B],
  ['11a-class', 'generated leaf-manifest.json missing', (h) => fs.rmSync(path.join(h, 'leaf-manifest.json')), 'MISSING_GENERATED_FILE'],
  ['12a-router-contract', 'root ROUTER.md missing', (h) => fs.rmSync(path.join(h, 'ROUTER.md')), 'RRC-001'],
  ['13a-version', 'description.json version differs', (h) => editJson(h, 'description.json', (d) => { d.version = '1.0.0.9'; }), 'description.json'],
  ['13a-version', 'SKILL.md has no four-part version', (h) => fs.writeFileSync(path.join(h, 'SKILL.md'),
    hubSkillMd().replace(`version: ${VERSION}`, 'version: 1.0')), 'no four-part'],
  ['13b-version', 'newer changelog entry than SKILL.md', (h) => fs.writeFileSync(path.join(h, 'changelog', 'v1.0.0.1.md'), '# x\n'), 'v1.0.0.1'],
];

for (const [id, defect, mutate, detail] of FAILING_CASES) {
  test(`${id} fails: ${defect}`, () => {
    const hub = buildHub();
    mutate(hub);
    const { status, output } = runChecker(hub);
    assertLine(output, 'FAIL', id, detail);
    assert.equal(status, 1, output);
  });
}

test('5k-canary fails when a routerSignals mode is never the expected route of a canary case', () => {
  const hub = buildHub('sk-code');
  const { status, output } = runChecker(hub);
  assertLine(output, 'FAIL', '5k-canary', MODE_A);
  assert.equal(status, 1, output);
});

test('5k warns, and does not fail, on alias drift that another hub already carries', () => {
  const hub = buildHub('sk-design');
  editJson(hub, 'mode-registry.json', (r) => { r.modes[0].aliases.push('yagni'); });
  const { output } = runChecker(hub);
  assertLine(output, 'WARN', '5k-alias', 'yagni');
  assert.doesNotMatch(output, /^FAIL: 5k-alias:/m);
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. TESTS: ADVISOR CROSS-CHECK (4b/4c, python3 stubbed on PATH)
// ─────────────────────────────────────────────────────────────────────────────

test('4b passes when the advisor map equals the lexical projection', () => {
  const hub = buildHub('system-deep-loop');
  makeLexical(hub, 'demo-legacy');
  const pathEnv = python3Stub(`echo '{"DEEP_ROUTING_MODE_BY_KEY": {"demo-legacy": "${MODE_A}"}}'`);
  const { output } = runChecker(hub, { PATH: pathEnv });
  assertLine(output, 'PASS', '4a', escapeRegExp(REAL_ADVISOR_DRIFT_GUARD));
  assertLine(output, 'PASS', '4b');
});

test('4b fails when the advisor map disagrees with the lexical projection', () => {
  const hub = buildHub('system-deep-loop');
  makeLexical(hub, 'demo-legacy');
  const pathEnv = python3Stub('echo \'{"DEEP_ROUTING_MODE_BY_KEY": {"demo-legacy": "elsewhere"}}\'');
  const { status, output } = runChecker(hub, { PATH: pathEnv });
  assertLine(output, 'FAIL', '4b', 'DEEP_ROUTING_MODE_BY_KEY');
  assert.equal(status, 1, output);
});

test('4c warns when a lexical id is absent from the advisor map', () => {
  const hub = buildHub();
  makeLexical(hub, 'demo-legacy', { advisorRoutingContract: { driftGuard: REAL_ADVISOR_DRIFT_GUARD } });
  const pathEnv = python3Stub('echo \'{"DEEP_ROUTING_MODE_BY_KEY": {}}\'');
  const { output } = runChecker(hub, { PATH: pathEnv });
  assertLine(output, 'WARN', '4c', 'INERT');
});

test('4c passes when every lexical id is wired into the advisor map', () => {
  const hub = buildHub();
  makeLexical(hub, 'demo-legacy', { advisorRoutingContract: { driftGuard: REAL_ADVISOR_DRIFT_GUARD } });
  const pathEnv = python3Stub('echo \'{"DEEP_ROUTING_MODE_BY_KEY": {"demo-legacy": "x"}}\'');
  const { output } = runChecker(hub, { PATH: pathEnv });
  assertLine(output, 'PASS', '4c');
});

test('no stack trace on any characterised failure', () => {
  const hub = buildHub();
  fs.writeFileSync(path.join(hub, 'mode-registry.json'), '{');
  fs.writeFileSync(path.join(hub, 'hub-router.json'), '{');
  const { output } = runChecker(hub);
  assertNoStackTrace(output);
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. TESTS: REGRESSIONS
// ─────────────────────────────────────────────────────────────────────────────

const IS_ROOT = typeof process.getuid === 'function' && process.getuid() === 0;

test('13a fails when a follower carries a version that is not four-part', () => {
  const hub = buildHub();
  editJson(hub, 'description.json', (d) => { d.version = '0.0.0'; });
  const { status, output } = runChecker(hub);
  assertLine(output, 'FAIL', '13a-version', 'description.json');
  assert.doesNotMatch(output, /^PASS: 13a-version/m);
  assert.equal(status, 1, output);
});

test('1b fails when graph-metadata.json is JSON null', () => {
  const hub = buildHub();
  fs.writeFileSync(path.join(hub, 'graph-metadata.json'), 'null');
  const { status, output } = runChecker(hub);
  assertLine(output, 'FAIL', '1b', 'object');
  assert.equal(status, 1, output);
});

test('3a fails when mode-registry.json is JSON null', () => {
  const hub = buildHub();
  fs.writeFileSync(path.join(hub, 'mode-registry.json'), 'null');
  const { status, output } = runChecker(hub);
  assertLine(output, 'FAIL', '3a', 'object');
  assert.doesNotMatch(output, /^PASS: 3a/m);
  assert.equal(status, 1, output);
});

test('5a and 8a fail when hub-router.json and description.json are JSON null', () => {
  const hub = buildHub();
  fs.writeFileSync(path.join(hub, 'hub-router.json'), 'null');
  fs.writeFileSync(path.join(hub, 'description.json'), 'null');
  const { status, output } = runChecker(hub);
  assertLine(output, 'FAIL', '5a', 'object');
  assertLine(output, 'FAIL', '8a', 'object');
  assert.doesNotMatch(output, /^PASS: 5a/m);
  assertNoStackTrace(output);
  assert.equal(status, 1, output);
});

test('a null entry in modes[] is a 3d FAIL, not a crash', () => {
  const hub = buildHub();
  editJson(hub, 'mode-registry.json', (r) => { r.modes.push(null); });
  const { status, output } = runChecker(hub);
  assertLine(output, 'FAIL', '3d', 'not an object');
  assertNoStackTrace(output);
  assert.equal(status, 1, output);
});

test('a string toolSurface.allowed on a surface packet is a FAIL, not a crash', () => {
  const hub = buildHub();
  addSurfaceMode(hub);
  editJson(hub, 'mode-registry.json', (r) => { r.modes[2].toolSurface.allowed = 'Read'; });
  const { status, output } = runChecker(hub);
  assertLine(output, 'FAIL', '3d', 'toolSurface');
  assertNoStackTrace(output);
  assert.equal(status, 1, output);
});

test('a non-string leaf in leaf-manifest.json is a 10a FAIL, not a crash', () => {
  const hub = buildHub();
  editJson(hub, 'leaf-manifest.json', (m) => { m.modes[0].leaves.push(42); });
  const { status, output } = runChecker(hub);
  assertLine(output, 'FAIL', '10a-manifest-source', 'leaves');
  assertNoStackTrace(output);
  assert.equal(status, 1, output);
});

test('a changelog that is a regular file fails 7a and does not crash 13b', () => {
  const hub = buildHub();
  fs.rmSync(path.join(hub, 'changelog'), { recursive: true });
  fs.writeFileSync(path.join(hub, 'changelog'), 'not a directory\n');
  const { status, output } = runChecker(hub);
  assertLine(output, 'FAIL', '7a', 'not a directory');
  assert.doesNotMatch(output, /^PASS: 13b-version/m);
  assertNoStackTrace(output);
  assert.equal(status, 1, output);
});

test('an unexpected throw prints a FAIL line and exits 2', { skip: IS_ROOT && 'root ignores file modes' }, () => {
  const hub = buildHub();
  const skillFile = path.join(hub, 'pkg-alpha', 'SKILL.md');
  fs.chmodSync(skillFile, 0o000);
  try {
    const { status, output } = runChecker(hub);
    assert.match(output, /^FAIL: parent-skill-check could not finish/m, output);
    assertNoStackTrace(output);
    assert.equal(status, 2, output);
  } finally {
    fs.chmodSync(skillFile, 0o644);
  }
});

test('an unreadable hub directory exits 2', { skip: IS_ROOT && 'root ignores file modes' }, () => {
  const hub = buildHub();
  fs.chmodSync(hub, 0o000);
  try {
    const { status, output } = runChecker(hub);
    assert.match(output, /ERROR: parent skill directory is not readable/, output);
    assert.equal(status, 2, output);
  } finally {
    fs.chmodSync(hub, 0o755);
  }
});

test('3f fails when transports[] lists a mode that is not a registered transport', () => {
  const hub = buildHub();
  addTransportMode(hub);
  editJson(hub, 'mode-registry.json', (r) => { r.extensions['transport-axis'].transports.push(MODE_A, 'ghost'); });
  const { status, output } = runChecker(hub);
  assertLine(output, 'FAIL', '3f', `${MODE_A}.*ghost|ghost.*${MODE_A}`);
  assert.doesNotMatch(output, /^PASS: 3f/m);
  assert.equal(status, 1, output);
});

test('3d fails when a mode has no packetSkillName', () => {
  const hub = buildHub();
  editJson(hub, 'mode-registry.json', (r) => { delete r.modes[0].packetSkillName; });
  const { status, output } = runChecker(hub);
  assertLine(output, 'FAIL', '3d', 'packetSkillName');
  assert.equal(status, 1, output);
});

test('3d fails when a mode has no aliases array', () => {
  const hub = buildHub();
  editJson(hub, 'mode-registry.json', (r) => { delete r.modes[1].aliases; });
  const { status, output } = runChecker(hub);
  assertLine(output, 'FAIL', '3d', 'aliases');
  assert.equal(status, 1, output);
});

test('3d-alias warns on an alias that is not lowercase', () => {
  const hub = buildHub();
  editJson(hub, 'mode-registry.json', (r) => { r.modes[0].aliases = ['Alpha Thing']; });
  const { status, output } = runChecker(hub);
  assertLine(output, 'WARN', '3d-alias', 'lowercase');
  assert.equal(status, 0, output);
});

test('3d fails when runtimeLoopType appears on a hub without the runtime-loop extension', () => {
  const hub = buildHub();
  editJson(hub, 'mode-registry.json', (r) => { r.modes[0].runtimeLoopType = 'research'; });
  const { status, output } = runChecker(hub);
  assertLine(output, 'FAIL', '3d', 'runtime-loop');
  assert.equal(status, 1, output);
});

test('3c fails for a packet of "." and for a nested packet path', () => {
  for (const packet of ['.', 'pkg-alpha/references']) {
    const hub = buildHub();
    editJson(hub, 'mode-registry.json', (r) => { r.modes[0].packet = packet; });
    const { status, output } = runChecker(hub);
    assertLine(output, 'FAIL', '3c', 'direct child');
    assert.equal(status, 1, `${packet}:\n${output}`);
  }
});

test('6c checks the row owned by the mode, not the first row that mentions it', () => {
  const hub = buildHub();
  editJson(hub, 'mode-registry.json', (r) => { r.modes[1].command = '/demo:beta'; });
  fs.writeFileSync(path.join(hub, 'SKILL.md'), hubSkillMd({
    rows: [
      `| **${MODE_A}** | alpha, see also ${MODE_B} via \`/demo:beta\` | \`pkg-alpha/\` | routes via aliases |`,
      `| **${MODE_B}** | beta | \`pkg-beta/\` | routes via aliases |`,
    ],
  }));
  const { status, output } = runChecker(hub);
  assertLine(output, 'FAIL', '6c', MODE_B);
  assert.equal(status, 1, output);
});

test('6c does not accept a longer command that merely contains the registered one', () => {
  const hub = buildHub();
  editJson(hub, 'mode-registry.json', (r) => { r.modes[0].command = '/demo:alpha'; });
  fs.writeFileSync(path.join(hub, 'SKILL.md'), hubSkillMd({
    rows: [
      `| **${MODE_A}** | alpha | \`pkg-alpha/\` | \`/demo:alpha-two\` |`,
      `| **${MODE_B}** | beta | \`pkg-beta/\` | routes via aliases |`,
    ],
  }));
  const { status, output } = runChecker(hub);
  assertLine(output, 'FAIL', '6c', MODE_A);
  assert.equal(status, 1, output);
});

test('6c accepts a mode documented only inside a neighbouring row that shows its command', () => {
  const hub = buildHub();
  editJson(hub, 'mode-registry.json', (r) => { r.modes[1].command = '/demo:beta'; });
  fs.writeFileSync(path.join(hub, 'SKILL.md'), hubSkillMd({
    rows: [`| **${MODE_A}** | alpha, plus the ${MODE_B} lane | \`pkg-alpha/\` | \`/demo:beta\` |`],
  }));
  const { output } = runChecker(hub);
  assertLine(output, 'PASS', '6c');
});

test('3f prints no PASS after its own soft failure', () => {
  const hub = buildHub();
  addSurfaceMode(hub);
  editJson(hub, 'mode-registry.json', (r) => { r.extensions = { 'transform-verbs': {} }; });
  const { status, output } = runChecker(hub);
  assertLine(output, 'FAIL', '3f', 'surface-axis');
  assert.doesNotMatch(output, /^PASS: 3f/m);
  assert.equal(status, 1, output);
});

test('13b prints no PASS when the changelog directory is missing', () => {
  const hub = buildHub();
  fs.rmSync(path.join(hub, 'changelog'), { recursive: true });
  const { output } = runChecker(hub);
  assertLine(output, 'FAIL', '7a');
  assert.doesNotMatch(output, /^PASS: 13b-version/m);
});

test('3h and 3i print PASS lines on a clean transport hub', () => {
  const hub = buildHub();
  addTransportMode(hub);
  const { status, output } = runChecker(hub);
  assertLine(output, 'PASS', '3h');
  assertLine(output, 'PASS', '3i');
  assert.equal(status, 0, output);
});

// Binds MODE_A to /demo:alpha, whose command file carries `allowedToolsLine`
// as frontmatter, and runs the checker against that commands tree.
function runWithBoundCommand(allowedToolsLine) {
  const hub = buildHub();
  const commandsDir = path.join(path.dirname(hub), 'commands');
  fs.mkdirSync(path.join(commandsDir, 'demo'), { recursive: true });
  fs.writeFileSync(path.join(commandsDir, 'demo', 'alpha.md'), `---\ndescription: demo\n${allowedToolsLine}\n---\n# alpha\n`);
  editJson(hub, 'mode-registry.json', (r) => { r.modes[0].command = '/demo:alpha'; });
  fs.writeFileSync(path.join(hub, 'SKILL.md'), hubSkillMd({
    rows: [
      `| **${MODE_A}** | alpha | \`pkg-alpha/\` | \`/demo:alpha\` |`,
      `| **${MODE_B}** | beta | \`pkg-beta/\` | routes via aliases |`,
    ],
  }));
  return runChecker(hub, { PARENT_HUB_CHECK_COMMANDS_DIR: commandsDir });
}

test('3k fails when a bracketed command grants tools beyond its mode', () => {
  const { status, output } = runWithBoundCommand('allowed-tools: [Read, Write]');
  assertLine(output, 'FAIL', '3k', 'Write');
  assert.equal(status, 1, output);
});

test('3k fails when a bare-list command grants a tool beyond its mode', () => {
  const { status, output } = runWithBoundCommand('allowed-tools: Read, Edit');
  assertLine(output, 'FAIL', '3k', 'Edit');
  assert.equal(status, 1, output);
});

test('3k passes when a bare-list command adds only TodoWrite', () => {
  const { status, output } = runWithBoundCommand('allowed-tools: Read, TodoWrite');
  assertLine(output, 'PASS', '3k', '1 bound command');
  assert.equal(status, 0, output);
});

test('3k reads a YAML block-sequence tool list', () => {
  const { status, output } = runWithBoundCommand('allowed-tools:\n  - Read\n  - Write');
  assertLine(output, 'FAIL', '3k', 'Write');
  assert.equal(status, 1, output);
});

test('4b fails when python3 exits non-zero', () => {
  const hub = buildHub('system-deep-loop');
  makeLexical(hub, 'demo-legacy');
  const { status, output } = runChecker(hub, { PATH: python3Stub('exit 1') });
  assertLine(output, 'FAIL', '4b', 'could not dump');
  assert.equal(status, 1, output);
});

test('4b fails when python3 is not on PATH', () => {
  const hub = buildHub('system-deep-loop');
  makeLexical(hub, 'demo-legacy');
  const emptyBin = fs.mkdtempSync(path.join(os.tmpdir(), 'parent-skill-check-nopython-'));
  tempRoots.push(emptyBin);
  const { status, output } = runChecker(hub, { PATH: emptyBin });
  assertLine(output, 'FAIL', '4b', 'could not dump');
  assert.equal(status, 1, output);
});

test('colour output on a TTY uses real escape sequences', { skip: !['darwin', 'linux'].includes(process.platform) && 'needs script(1)' }, () => {
  const hub = buildHub();
  const args = process.platform === 'darwin'
    ? ['-q', '/dev/null', process.execPath, CHECKER_PATH, hub]
    : ['-qec', `"${process.execPath}" "${CHECKER_PATH}" "${hub}"`, '/dev/null'];
  // script(1) needs a non-pipe stdin before it will allocate the pseudo-terminal.
  const result = spawnSync('script', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (result.error) return;
  assert.match(result.stdout, /\x1b\[32mPASS\x1b\[0m: 1a:/);
});
