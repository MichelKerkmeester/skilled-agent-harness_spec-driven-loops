#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Routing Shape Parity Test
// ───────────────────────────────────────────────────────────────────
'use strict';

/**
 * Holds the two routing-shape checks to one rule set.
 *
 * `package_skill.py --strict` and check 12b in `parent-skill-check.cjs` judge
 * the same SKILL.md against the same RS codes in two languages, so a rule read
 * differently by either one ships a tree that one gate reds and the other
 * greens. Each case here writes one temp skill that breaks the rule in exactly
 * one documented way, runs both checks over it, and demands the same code set
 * from both: a pointer line carrying a link to `./ROUTER.md` with a leading
 * `./` and any #anchor stripped, a heading line counted like any other body
 * line, bracket, titled, image, trailing-text, split-label, frontmatter-only and nested
 * targets refused, a sibling router that is missing, not a regular file or
 * outside the folder or a dangling link, a leftover router section and a machine block in the
 * routing prose, and the known-debt ledger that covers none of the last two.
 *
 * The fixture root is one hub, so the checker audits the case skill as a
 * declared packet, and it doubles as the skills root, so one ledger fixture
 * keys the same entry for both checks. Every case asserts the code set the
 * rule states and not only agreement, because two checks can agree on a wrong
 * answer.
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

const REPO_ROOT = path.join(__dirname, '..', '..', '..', '..', '..');
const PYTHON = '/usr/bin/python3';
const PACKAGE_SKILL = path.join(REPO_ROOT, '.skilled', 'skills', 'sk-doc', 'scripts', 'package_skill.py');
const CHECKER_PATH = path.join(__dirname, '..', 'parent-skill-check.cjs');

// The case skill is the hub's one declared packet, and also the skills-root key
// both checks resolve its ledger entry by.
const PACKET = 'case-skill';
const RS_FINDING = /routing shape RS-(\d{3})/g;

// ─────────────────────────────────────────────────────────────────────────────
// 3. FIXTURE DOCUMENTS
// ─────────────────────────────────────────────────────────────────────────────

// The routing prose both checks accept: five lines, no code, no machine block.
const CANON_PROSE = [
  'Routing line 1 names what selects this skill and what it loads first.',
  'Routing line 2 names a second trigger family the skill answers.',
  'Routing line 3 names the reference it opens for that family.',
  'Routing line 4 keeps this section prose only.',
  'Routing line 5 keeps the machine router in the sibling file.',
];

// A sibling router that carries the router the canon expects: the machine block
// the routing prose must not hold, under the heading the resolver reads.
const ROUTER_DOCUMENT = [
  '# Case Router',
  '',
  '## MACHINE ROUTER',
  '',
  '```python',
  "INTENT_SIGNALS = {'demo': ['demo task']}",
  '',
  "RESOURCE_MAP = {'demo': ['references/demo.md']}",
  '',
  "UNKNOWN_FALLBACK = {'load_level': 'UNKNOWN_FALLBACK'}",
  '',
  'def discover_markdown_resources():',
  '    return set()',
  '',
  'def _guard_in_skill(path):',
  '    return path',
  '```',
  '',
].join('\n');

function pointerLine(target) {
  return `Structured routing detail: [\`ROUTER.md\`](${target}).`;
}

/**
 * Build the case SKILL.md from the layout both checks require, so a case can
 * only fail on the routing-shape rule it changes.
 *
 * `pointer: null` writes no pointer line at all, `pointer` takes raw lines so a
 * case can split a label, and `pointerOnHeading` moves the link onto the SMART
 * ROUTING heading instead of the paragraph below it.
 */
function skillDocument({
  pointer = [pointerLine('./ROUTER.md')],
  pointerOnHeading = false,
  frontmatterLink = false,
  smartExtra = [],
  routerSection = null,
  routerSectionLast = true,
} = {}) {
  const frontmatter = [
    '---',
    `name: ${PACKET}`,
    'description: Parity fixture that validates one routing shape with real section text.',
  ];
  if (frontmatterLink) frontmatter.push('see: "Routing detail: [`ROUTER.md`](./ROUTER.md)"');
  frontmatter.push('allowed-tools: [Read, Write, Edit]', 'version: 1.0.0.0', '---');

  const heading = pointerOnHeading
    ? `## 2. SMART ROUTING [\`ROUTER.md\`](./ROUTER.md)`
    : '## 2. SMART ROUTING';
  const sections = [
    [
      '## 1. WHEN TO USE',
      '### Activation Triggers',
      'Use this skill when:',
      '- A demo task arrives with a concrete input.',
      '- A demo file needs a validated routing shape.',
      '### When NOT to Use',
      'Do not use this skill for:',
      '- Tasks outside the demo family.',
    ],
    [
      heading,
      '### Routing Signals',
      ...CANON_PROSE,
      '### Resource Domains',
      '- `references/` holds optional guidance.',
      ...smartExtra,
    ],
    [
      '## 3. HOW IT WORKS',
      '### Workflow',
      '1. Read the input the task names.',
      '2. Route it to the resource the routing prose names.',
      '3. Return the artifact the task asks for.',
      '### Output Contract',
      'Returns the validated artifact and the evidence that proves it.',
    ],
    [
      '## 4. RULES',
      '### ✅ ALWAYS',
      '- Keep the routing prose short and free of code.',
      '### ❌ NEVER',
      '- Put a machine block in the routing prose.',
      '### ⚠️ ESCALATE IF',
      '- The request matches no mode and no fallback applies.',
    ],
    [
      '## 5. REFERENCES',
      '### Core References',
      '- `references/demo.md` holds the demo guidance.',
      ...(pointer || []),
    ],
    ['## 6. SUCCESS CRITERIA', 'The task is complete when the artifact exists and validation passes.'],
    ['## 7. INTEGRATION POINTS', '### Inputs', '- The task description names the input it provides.'],
    ['## 8. RELATED RESOURCES', '- The hub `ROUTER.md` owns stage-two routing.'],
  ];
  if (routerSection !== null) {
    if (routerSectionLast) sections.push(routerSection);
    else sections.splice(sections.length - 1, 0, routerSection);
  }

  const body = sections.map((lines) => lines.join('\n')).join('\n\n');
  return `${frontmatter.join('\n')}\n\n# ${PACKET}\n\nRoutes one demo task family and validates its routing shape.\n\n${body}\n`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CASES
// ─────────────────────────────────────────────────────────────────────────────

const ROUTER_SECTION = ['## MACHINE ROUTER', '', 'The router belongs in the sibling file.', ''];
const PROSE_MACHINE_BLOCK = ['', '```python', "INTENT_SIGNALS = {'demo': ['demo task']}", '```'];

// `codes` is the set the rule states, `router` picks what sits at the sibling
// path, and `debt` writes a ledger entry for the case skill.
const CASES = [
  {
    name: 'a relative pointer to the sibling router',
    codes: [],
    strictPass: true,
  },
  {
    name: 'a bare pointer target',
    codes: [],
    skill: { pointer: [pointerLine('ROUTER.md')] },
  },
  {
    name: 'a pointer target with an anchor',
    codes: [],
    skill: { pointer: [pointerLine('./ROUTER.md#machine-router')] },
  },
  {
    name: 'a pointer on a heading line',
    codes: [],
    skill: { pointer: null, pointerOnHeading: true },
  },
  {
    name: 'an angle-bracket pointer target',
    codes: ['RS-005'],
    skill: { pointer: [pointerLine('<./ROUTER.md>')] },
  },
  {
    name: 'a pointer target with trailing text',
    codes: ['RS-005'],
    skill: { pointer: [pointerLine('./ROUTER.md extra words')] },
  },
  {
    name: 'a pointer target with a title',
    codes: ['RS-005'],
    skill: { pointer: [pointerLine('./ROUTER.md "router"')] },
  },
  {
    name: 'an image pointing at the sibling router',
    codes: ['RS-005'],
    skill: { pointer: ['Structured routing detail: ![router](./ROUTER.md).'] },
  },
  {
    name: 'a pointer label split across two lines',
    codes: ['RS-005'],
    skill: { pointer: ['Structured routing detail: [`ROUTER', '.md`](./ROUTER.md).'] },
  },
  {
    name: 'a link that lives only in the frontmatter',
    codes: ['RS-005'],
    skill: { pointer: null, frontmatterLink: true },
  },
  {
    name: 'a pointer to a router under a child folder',
    codes: ['RS-005'],
    skill: { pointer: [pointerLine('./child/ROUTER.md')] },
    files: { 'child/ROUTER.md': ROUTER_DOCUMENT },
  },
  {
    name: 'a pointer to a router under references',
    codes: ['RS-005'],
    skill: { pointer: [pointerLine('./references/ROUTER.md')] },
    files: { 'references/ROUTER.md': ROUTER_DOCUMENT },
  },
  {
    name: 'a skill with no pointer at all',
    codes: ['RS-005'],
    skill: { pointer: null },
  },
  {
    name: 'a skill with no sibling router',
    codes: ['RS-004', 'RS-005'],
    router: null,
  },
  {
    name: 'a sibling router that is a directory',
    codes: ['RS-004', 'RS-005'],
    router: 'directory',
  },
  {
    name: 'a sibling router that resolves outside the folder',
    codes: ['RS-004', 'RS-005'],
    router: 'outside',
  },
  {
    name: 'a machine block left in the routing prose',
    codes: ['RS-002'],
    skill: { smartExtra: PROSE_MACHINE_BLOCK },
  },
  {
    name: 'a machine router section left at the end',
    codes: ['RS-002'],
    skill: { routerSection: ROUTER_SECTION },
  },
  {
    name: 'a machine router section that is not last',
    codes: ['RS-002', 'RS-003'],
    skill: { routerSection: ROUTER_SECTION, routerSectionLast: false },
  },
  {
    name: 'a recorded skill with no sibling router',
    codes: [],
    router: null,
    debt: { lines: 0, words: 0, machineBlocks: 0, codes: ['RS-004', 'RS-005'] },
  },
  {
    name: 'a recorded skill whose sibling router is a directory',
    codes: ['RS-004'],
    router: 'directory',
    debt: { lines: 0, words: 0, machineBlocks: 0, codes: ['RS-004', 'RS-005'] },
  },
  {
    name: 'a sibling router that is a dangling symlink',
    codes: ['RS-004', 'RS-005'],
    router: 'dangling',
  },
  {
    name: 'a recorded skill whose sibling router is a dangling symlink',
    codes: ['RS-004'],
    router: 'dangling',
    debt: { lines: 0, words: 0, machineBlocks: 0, codes: ['RS-004', 'RS-005'] },
  },
  {
    name: 'a recorded skill whose sibling router resolves outside the folder',
    codes: ['RS-004'],
    router: 'outside',
    debt: { lines: 0, words: 0, machineBlocks: 0, codes: ['RS-004', 'RS-005'] },
  },
  {
    name: 'a recorded skill carrying a machine block in the routing prose',
    codes: ['RS-002'],
    skill: { smartExtra: PROSE_MACHINE_BLOCK },
    debt: { lines: 0, words: 0, machineBlocks: 1, codes: ['RS-002'] },
  },
  {
    name: 'a recorded skill whose router section is at the end',
    codes: [],
    skill: { routerSection: ROUTER_SECTION },
    debt: { lines: 0, words: 0, machineBlocks: 1, codes: ['RS-002'] },
  },
  {
    // The entry records both codes, and the section rule still fails: only a
    // section left at the end of SKILL.md is the shape debt may cover.
    name: 'a recorded skill whose router section is not last',
    codes: ['RS-002'],
    skill: { routerSection: ROUTER_SECTION, routerSectionLast: false },
    debt: { lines: 0, words: 0, machineBlocks: 1, codes: ['RS-002', 'RS-003'] },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. FIXTURE AND RUNNERS
// ─────────────────────────────────────────────────────────────────────────────

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/**
 * Write one case as a temp hub: a mode registry declares the case skill as the
 * hub's packet, and the hub folder is the skills root both checks key by.
 */
function buildFixture(fixtureRoot, testCase) {
  const skillDir = path.join(fixtureRoot, PACKET);
  fs.mkdirSync(skillDir, { recursive: true });
  fs.writeFileSync(path.join(skillDir, 'SKILL.md'), skillDocument(testCase.skill || {}));

  const router = testCase.router === undefined ? 'file' : testCase.router;
  if (router === 'file') {
    fs.writeFileSync(path.join(skillDir, 'ROUTER.md'), ROUTER_DOCUMENT);
  } else if (router === 'directory') {
    fs.mkdirSync(path.join(skillDir, 'ROUTER.md'));
  } else if (router === 'outside') {
    const shared = path.join(fixtureRoot, 'shared-router.md');
    fs.writeFileSync(shared, ROUTER_DOCUMENT);
    fs.symlinkSync(shared, path.join(skillDir, 'ROUTER.md'));
  } else if (router === 'dangling') {
    fs.symlinkSync(path.join(fixtureRoot, 'no-such-router.md'), path.join(skillDir, 'ROUTER.md'));
  }

  for (const [relative, content] of Object.entries(testCase.files || {})) {
    const target = path.join(skillDir, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }

  writeJson(path.join(fixtureRoot, 'mode-registry.json'), {
    skill: 'parity-hub',
    modes: [{ workflowMode: 'case', packet: PACKET }],
  });

  // A case without debt points at a file that is not there, so no live ledger
  // can decide its result.
  const ledger = path.join(fixtureRoot, testCase.debt ? 'routing-shape-known-debt.json' : 'absent-debt.json');
  if (testCase.debt) writeJson(ledger, { maxSmartRoutingLines: 12, debt: { [PACKET]: testCase.debt } });
  return { skillDir, ledger };
}

// The RS codes a run reports, deduplicated and sorted. The ledger's own advisory
// line reads "routing shape: known debt, ..." and carries no code, so a code in
// this set is always a finding.
function rsCodes(output) {
  return [...new Set([...output.matchAll(RS_FINDING)].map((match) => `RS-${match[1]}`))].sort();
}

function runPython(skillDir, ledger) {
  const result = spawnSync(PYTHON, [PACKAGE_SKILL, skillDir, '--check', '--strict'], {
    encoding: 'utf8',
    env: {
      ...process.env,
      ROUTING_SHAPE_DEBT_FILE: ledger,
      ROUTING_SHAPE_SKILLS_ROOT: path.dirname(skillDir),
    },
  });
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  assert.equal(result.error, undefined, `${PYTHON} could not run ${PACKAGE_SKILL}: ${result.error}`);
  return { codes: rsCodes(output), output };
}

function runChecker(fixtureRoot, ledger) {
  // The checker is a CLI with no exports, so 12b is reached the way a hub is
  // audited: over a fixture hub whose one declared packet is the case skill.
  const env = { ...process.env };
  delete env.PARENT_HUB_CHECK_STRICT;
  const result = spawnSync(process.execPath, [CHECKER_PATH, fixtureRoot], {
    encoding: 'utf8',
    env: { ...env, ROUTING_SHAPE_DEBT_FILE: ledger, ROUTING_SHAPE_SKILLS_ROOT: fixtureRoot },
  });
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  assert.match(
    output,
    /^(?:PASS|FAIL|INFO): 12b-routing-shape/m,
    `check 12b never reported on the fixture:\n${output}`,
  );
  return { codes: rsCodes(output), output };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. TESTS
// ─────────────────────────────────────────────────────────────────────────────

function testBothChecksReportTheSameCodes(testCase) {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'routing-shape-parity-'));
  try {
    const { skillDir, ledger } = buildFixture(fixtureRoot, testCase);
    const python = runPython(skillDir, ledger);
    const checker = runChecker(fixtureRoot, ledger);
    const context = `\n--- package_skill.py ---\n${python.output}\n--- parent-skill-check.cjs ---\n${checker.output}`;

    assert.deepEqual(
      python.codes,
      checker.codes,
      `${testCase.name}: the two checks disagree — package_skill.py reported `
        + `[${python.codes.join(', ')}] and 12b reported [${checker.codes.join(', ')}]${context}`,
    );
    assert.deepEqual(
      python.codes,
      [...testCase.codes].sort(),
      `${testCase.name}: package_skill.py reported [${python.codes.join(', ')}] `
        + `instead of [${[...testCase.codes].sort().join(', ')}]${context}`,
    );
    // The clean fixture has to pass the whole create-skill contract, not just
    // the routing shape, or every case below it would be judged on a document
    // that never reached that rule.
    if (testCase.strictPass) assert.match(python.output, /^Result: PASS$/m, `${testCase.name}${context}`);
  } finally {
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
}

for (const testCase of CASES) testBothChecksReportTheSameCodes(testCase);
console.log(`[routing-shape-parity] ${CASES.length} fixture(s) matched on both checks`);
