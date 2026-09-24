#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Phase System Tests                                            ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Validate phase recommendation and phase-map append workflows.   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const __dirname = path.dirname(__filename);

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..', '..');
const SKILL_ROOT = path.join(REPO_ROOT, '.skilled', 'skills', 'system-spec-kit');
const CREATE_SCRIPT = path.join(SKILL_ROOT, 'runtime', 'cli', 'spec', 'create.sh');
const RECOMMEND_SCRIPT = path.join(SKILL_ROOT, 'runtime', 'cli', 'spec', 'recommend-level.sh');

// create.sh takes its root from `git rev-parse --show-toplevel` in the working
// directory, so every call runs inside a throwaway repository instead of the
// checkout. It also reads its templates relative to that root, so the sandbox
// gets a copy.
const SANDBOX_REPO = createSandboxRepo('speckit-phase-system-');
const ALLOWED_SPECS_ROOT = path.join(SANDBOX_REPO, 'specs');

function createSandboxRepo(prefix) {
  const repo = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), prefix)));
  execFileSync('git', ['init', '--quiet'], { cwd: repo });
  const sandboxSkill = path.join(repo, '.skilled', 'skills', 'system-spec-kit');
  fs.cpSync(path.join(SKILL_ROOT, 'templates'), path.join(sandboxSkill, 'templates'), { recursive: true });
  fs.mkdirSync(path.join(sandboxSkill, 'runtime', 'cli', 'templates'), { recursive: true });
  fs.copyFileSync(
    path.join(SKILL_ROOT, 'runtime', 'cli', 'templates', 'inline-gate-renderer.sh'),
    path.join(sandboxSkill, 'runtime', 'cli', 'templates', 'inline-gate-renderer.sh')
  );
  return repo;
}

let passed = 0;
let failed = 0;

function pass(message) {
  passed += 1;
  console.log(`PASS: ${message}`);
}

function fail(message) {
  failed += 1;
  console.log(`FAIL: ${message}`);
}

function assertEqual(actual, expected, message) {
  if (actual === expected) {
    pass(message);
  } else {
    fail(`${message} (expected=${expected}, actual=${actual})`);
  }
}

function assertTrue(condition, message) {
  if (condition) {
    pass(message);
  } else {
    fail(message);
  }
}

function runBash(scriptPath, args) {
  return execFileSync('bash', [scriptPath, ...args], {
    cwd: SANDBOX_REPO,
    encoding: 'utf-8',
  });
}

// Parsed strictly: in --json mode stdout must hold the payload and nothing else,
// so a status line printed ahead of it fails here.
function parseJsonOutput(raw) {
  try {
    return JSON.parse(raw);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse JSON output: ${msg}\nRaw output:\n${raw}`);
  }
}

function createTempSpecFolder(prefix) {
  fs.mkdirSync(ALLOWED_SPECS_ROOT, { recursive: true });
  return fs.mkdtempSync(path.join(ALLOWED_SPECS_ROOT, prefix));
}

function testRecommendLevelPhaseFixtures() {
  const fixtures = [
    {
      name: 'below-threshold-no-phase',
      args: ['--loc', '120', '--files', '4', '--recommend-phases', '--json'],
      expected: { recommended: false, phaseScore: 0, suggestedCount: 0 },
    },
    {
      name: 'threshold-hit-level-gate-blocks',
      args: ['--loc', '700', '--files', '16', '--architectural', '--recommend-phases', '--json'],
      expected: { recommended: false, phaseScore: 20, suggestedCount: 0 },
    },
    {
      name: 'above-threshold-two-phase',
      args: ['--loc', '700', '--files', '16', '--architectural', '--api', '--db', '--recommend-phases', '--json'],
      expected: { recommended: true, phaseScore: 30, suggestedCount: 2 },
    },
    {
      name: 'extreme-scale-four-phase',
      args: ['--loc', '2100', '--files', '31', '--architectural', '--api', '--db', '--recommend-phases', '--json'],
      expected: { recommended: true, phaseScore: 50, suggestedCount: 4 },
    },
    {
      name: 'no-risk-factors-level-gate',
      args: ['--loc', '900', '--files', '16', '--architectural', '--recommend-phases', '--json'],
      expected: { recommended: false, phaseScore: 30, suggestedCount: 0 },
    },
  ];

  for (const fixture of fixtures) {
    const raw = runBash(RECOMMEND_SCRIPT, fixture.args);
    const result = parseJsonOutput(raw);

    assertEqual(
      result.recommended_phases,
      fixture.expected.recommended,
      `recommend-level ${fixture.name}: recommended_phases`
    );
    assertEqual(
      result.phase_score,
      fixture.expected.phaseScore,
      `recommend-level ${fixture.name}: phase_score`
    );
    assertEqual(
      result.suggested_phase_count,
      fixture.expected.suggestedCount,
      `recommend-level ${fixture.name}: suggested_phase_count`
    );
  }
}

function countOccurrences(haystack, needle) {
  let offset = 0;
  let count = 0;
  while (true) {
    const idx = haystack.indexOf(needle, offset);
    if (idx === -1) return count;
    count += 1;
    offset = idx + needle.length;
  }
}

function testCreatePhaseParentAppendMode() {
  const parent = createTempSpecFolder('200-parent-phase-test-');
  try {
    fs.mkdirSync(path.join(parent, 'memory'), { recursive: true });
    fs.mkdirSync(path.join(parent, 'scratch'), { recursive: true });
    fs.writeFileSync(path.join(parent, 'spec.md'), '# Parent\n');
    fs.writeFileSync(path.join(parent, 'plan.md'), '# Plan\n');

    const firstRaw = runBash(CREATE_SCRIPT, [
      '--phase',
      '--parent', parent,
      '--phases', '2',
      '--phase-names', 'foundation,implementation',
      '--skip-branch',
      '--json',
      'Phase append test',
    ]);
    const first = parseJsonOutput(firstRaw);

    assertTrue(first.PHASE_MODE === true, 'create.sh parent mode: PHASE_MODE true');
    assertEqual(first.PHASE_COUNT, 2, 'create.sh parent mode: first append phase count');
    assertTrue(fs.existsSync(path.join(parent, '001-foundation', 'spec.md')), 'create.sh parent mode: 001-foundation created');
    assertTrue(fs.existsSync(path.join(parent, '002-implementation', 'spec.md')), 'create.sh parent mode: 002-implementation created');

    const secondRaw = runBash(CREATE_SCRIPT, [
      '--phase',
      '--parent', parent,
      '--phases', '1',
      '--phase-names', 'stabilization',
      '--skip-branch',
      '--json',
      'Phase append test',
    ]);
    const second = parseJsonOutput(secondRaw);

    assertEqual(second.PHASE_COUNT, 1, 'create.sh parent mode: second append phase count');
    assertTrue(fs.existsSync(path.join(parent, '003-stabilization', 'spec.md')), 'create.sh parent mode: 003-stabilization created');

    const parentSpec = fs.readFileSync(path.join(parent, 'spec.md'), 'utf-8');
    const phaseMapCount = countOccurrences(parentSpec, '<!-- ANCHOR:phase-map -->');
    assertEqual(phaseMapCount, 1, 'create.sh parent mode: phase-map section not duplicated');
    // A blank line ends a markdown table, so the new row has to follow the
    // last existing row directly to render inside the map.
    assertTrue(
      parentSpec.includes(
        '| 2 | 002-implementation/ | [Phase 2 scope] | Pending |\n| 3 | 003-stabilization/ | [Phase 3 scope] | Pending |'
      ),
      'create.sh parent mode: appended phase row continues the phase-map table'
    );
    assertTrue(
      parentSpec.includes('| 002-implementation | 003-stabilization | [Criteria TBD] | [Verification TBD] |'),
      'create.sh parent mode: append updates handoff rows for new phase transition'
    );
    assertTrue(
      !parentSpec.includes('| (single phase - no handoffs) | | | |'),
      'create.sh parent mode: append removes single-phase placeholder handoff row'
    );

    const childSpec = fs.readFileSync(path.join(parent, '003-stabilization', 'spec.md'), 'utf-8');
    assertTrue(childSpec.includes('| **Phase** | 3 of 3 |'), 'create.sh parent mode: absolute phase numbering in child header');
    assertTrue(childSpec.includes('| **Predecessor** | 002-implementation |'), 'create.sh parent mode: predecessor links to prior phase');
  } finally {
    fs.rmSync(parent, { recursive: true, force: true });
  }
}

function main() {
  try {
    testRecommendLevelPhaseFixtures();
    testCreatePhaseParentAppendMode();
  } finally {
    fs.rmSync(SANDBOX_REPO, { recursive: true, force: true });
  }

  console.log(`\nResult: passed=${passed} failed=${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
