#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Phase Validation Tests                                        ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Validate phase-level rules and recursive validation behavior.   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const SKILL_ROOT = path.join(REPO_ROOT, '.opencode', 'skill', 'system-spec-kit');
const CREATE_SCRIPT = path.join(SKILL_ROOT, 'scripts', 'spec', 'create.sh');
const RECOMMEND_SCRIPT = path.join(SKILL_ROOT, 'scripts', 'spec', 'recommend-level.sh');
const VALIDATE_SCRIPT = path.join(SKILL_ROOT, 'scripts', 'spec', 'validate.sh');
const FIXTURE_ROOT = path.join(SKILL_ROOT, 'scripts', 'tests', 'fixtures');

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

function runBash(scriptPath, args, cwd = REPO_ROOT) {
  return execFileSync('bash', [scriptPath, ...args], {
    cwd,
    encoding: 'utf-8',
  });
}

function runBashExpectFailure(scriptPath, args, cwd = REPO_ROOT) {
  try {
    runBash(scriptPath, args, cwd);
    return { code: 0, stdout: '', stderr: '' };
  } catch (error) {
    return {
      code: error.status || 1,
      stdout: error.stdout || '',
      stderr: error.stderr || '',
    };
  }
}

function parseJson(raw, message) {
  const trimmed = raw.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    // Some scripts may emit status lines before JSON payloads.
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');

    if (start !== -1 && end !== -1 && end > start) {
      const candidate = trimmed.slice(start, end + 1);
      try {
        return JSON.parse(candidate);
      } catch {
        // Fall through to detailed error.
      }
    }
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`${message}: ${reason}\nRaw output:\n${raw}`);
  }
}

function loadFixture(relativePath) {
  const fixturePath = path.join(FIXTURE_ROOT, relativePath, 'fixture.json');
  return JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));
}

function writeSpecBundle(folderPath, options = {}) {
  const {
    level = 1,
    includePhaseMap = false,
    parentSpecRef = null,
    predecessor = null,
    successor = null,
  } = options;

  fs.mkdirSync(folderPath, { recursive: true });
  fs.mkdirSync(path.join(folderPath, 'memory'), { recursive: true });
  fs.mkdirSync(path.join(folderPath, 'scratch'), { recursive: true });

  const phaseMapSection = includePhaseMap
    ? '\n## PHASE DOCUMENTATION MAP\n\n- 001-foundation\n'
    : '';
  const parentRefRow = parentSpecRef ? `| **Parent Spec** | ${parentSpecRef} |\n` : '';
  const predecessorRow = predecessor ? `| **Predecessor** | ${predecessor} |\n` : '';
  const successorRow = successor ? `| **Successor** | ${successor} |\n` : '';

  fs.writeFileSync(
    path.join(folderPath, 'spec.md'),
    [
      '# Test Spec',
      '',
      '| Field | Value |',
      '|-------|-------|',
      `| **Level** | ${level} |`,
      '| **Status** | Active |',
      parentRefRow + predecessorRow + successorRow,
      '## Problem Statement',
      '',
      'Validation fixture problem statement.',
      '',
      '## Requirements',
      '',
      '- Requirement A',
      '',
      '## Scope',
      '',
      '### In Scope',
      '- Fixture scope',
      phaseMapSection,
    ].join('\n')
  );

  fs.writeFileSync(path.join(folderPath, 'plan.md'), '# Plan\n\n## Approach\n\n- Validate phase workflows.\n');
  fs.writeFileSync(path.join(folderPath, 'tasks.md'), '# Tasks\n\n- [ ] Fixture task\n');
  fs.writeFileSync(path.join(folderPath, 'implementation-summary.md'), '# Summary\n\nPending.\n');

  if (level >= 2) {
    fs.writeFileSync(path.join(folderPath, 'checklist.md'), '# Checklist\n\n## P0\n\n- [ ] Item\n');
  }
  if (level >= 3) {
    fs.writeFileSync(path.join(folderPath, 'decision-record.md'), '# Decision Record\n\n## ADR-001\n\nContext.\n');
  }
}

function testPhaseDetectionFixtures() {
  const fixtureNames = [
    'phase-detection/below-threshold',
    'phase-detection/boundary',
    'phase-detection/above-threshold',
    'phase-detection/extreme-scale',
    'phase-detection/no-risk-factors',
  ];

  for (const fixtureName of fixtureNames) {
    const fixture = loadFixture(fixtureName);
    const raw = runBash(RECOMMEND_SCRIPT, fixture.args);
    const result = parseJson(raw, `recommend-level fixture parse failed (${fixtureName})`);

    assertEqual(
      result.recommended_phases,
      fixture.expected.recommended_phases,
      `${fixtureName}: recommended_phases`
    );
    assertEqual(result.phase_score, fixture.expected.phase_score, `${fixtureName}: phase_score`);
    assertEqual(
      result.suggested_phase_count,
      fixture.expected.suggested_phase_count,
      `${fixtureName}: suggested_phase_count`
    );
  }
}

function testPhaseDefaultsContracts() {
  const raw = runBash(RECOMMEND_SCRIPT, ['--loc', '700', '--files', '16', '--architectural', '--api', '--db', '--json']);
  const result = parseJson(raw, 'recommend-level default phase output parse failed');

  assertTrue(
    Object.prototype.hasOwnProperty.call(result, 'recommended_phases'),
    'recommend-level default-on: recommended_phases field present without --recommend-phases'
  );
  assertTrue(
    Object.prototype.hasOwnProperty.call(result, 'phase_score'),
    'recommend-level default-on: phase_score field present without --recommend-phases'
  );
  assertTrue(
    Object.prototype.hasOwnProperty.call(result, 'suggested_phase_count'),
    'recommend-level default-on: suggested_phase_count field present without --recommend-phases'
  );
}

function testPhaseCreationFixtures() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-phase-create-'));
  const scenarios = [
    'phase-2/single-phase',
    'phase-2/multi-phase',
    'phase-2/named-phases',
  ];

  for (const scenario of scenarios) {
    const fixture = loadFixture(scenario);
    const parentFolder = path.join(tempRoot, scenario.replace(/\//g, '-'));
    writeSpecBundle(parentFolder, { level: 1, includePhaseMap: true });

    const args = [
      '--phase',
      '--parent',
      parentFolder,
      '--phases',
      String(fixture.phases),
      '--phase-names',
      fixture.phase_names.join(','),
      '--skip-branch',
      '--json',
      'Fixture phase creation',
    ];

    const raw = runBash(CREATE_SCRIPT, args);
    const result = parseJson(raw, `create.sh fixture parse failed (${scenario})`);
    assertEqual(result.PHASE_MODE, true, `${scenario}: PHASE_MODE true`);
    assertEqual(result.PHASE_COUNT, fixture.phases, `${scenario}: PHASE_COUNT`);

    for (const expectedFolder of fixture.expect_folders) {
      assertTrue(
        fs.existsSync(path.join(parentFolder, expectedFolder, 'spec.md')),
        `${scenario}: creates ${expectedFolder}/spec.md`
      );
    }
  }

  const invalidFixture = loadFixture('phase-2/error-cases');
  const invalidResult = runBashExpectFailure(CREATE_SCRIPT, invalidFixture.invalid_args);
  assertTrue(invalidResult.code !== 0, 'phase-2/error-cases: invalid args return non-zero exit');
}

function buildPhaseValidationFixture(basePath, fixture) {
  if (fixture.scenario === 'flat') {
    writeSpecBundle(basePath, { level: 1, includePhaseMap: false });
    return;
  }

  writeSpecBundle(basePath, { level: 1, includePhaseMap: true });

  for (let index = 0; index < fixture.phase_names.length; index += 1) {
    const phaseName = fixture.phase_names[index];
    const phasePath = path.join(basePath, phaseName);

    if (fixture.empty_child && index === fixture.phase_names.length - 1) {
      fs.mkdirSync(phasePath, { recursive: true });
      continue;
    }

    const predecessor = index > 0 ? fixture.phase_names[index - 1] : null;
    const successor = index < fixture.phase_names.length - 1 ? fixture.phase_names[index + 1] : null;
    const level = fixture.mixed_levels ? Math.min(3, index + 1) : 1;

    writeSpecBundle(phasePath, {
      level,
      includePhaseMap: false,
      parentSpecRef: '../spec.md',
      predecessor,
      successor,
    });

    if (fixture.broken_links) {
      const childSpecPath = path.join(phasePath, 'spec.md');
      const childSpec = fs.readFileSync(childSpecPath, 'utf-8')
        .replace('| **Parent Spec** | ../spec.md |', '')
        .replace(`| **Predecessor** | ${predecessor} |`, predecessor ? '| **Predecessor** | N/A |' : '')
        .replace(`| **Successor** | ${successor} |`, successor ? '| **Successor** | N/A |' : '');
      fs.writeFileSync(childSpecPath, childSpec);
    }
  }
}

function testPhaseValidationFixtures() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-phase-validate-'));
  const scenarios = [
    'phase-validation/flat-spec',
    'phase-validation/one-phase',
    'phase-validation/three-phase',
    'phase-validation/mixed-levels',
    'phase-validation/empty-child',
    'phase-validation/broken-links',
  ];

  for (const scenario of scenarios) {
    const fixture = loadFixture(scenario);
    const fixturePath = path.join(tempRoot, scenario.replace(/\//g, '-'));
    buildPhaseValidationFixture(fixturePath, fixture);

    const rawOrError = runBashExpectFailure(VALIDATE_SCRIPT, [fixturePath, '--recursive', '--json']);
    const rawJson = rawOrError.code === 0 ? runBash(VALIDATE_SCRIPT, [fixturePath, '--recursive', '--json']) : rawOrError.stdout;
    const result = parseJson(rawJson, `validate.sh fixture parse failed (${scenario})`);

    if (fixture.scenario === 'flat') {
      assertEqual(result.phaseCount ?? 0, 0, `${scenario}: phaseCount=0`);
      continue;
    }

    assertEqual(result.phaseCount, fixture.phase_names.length, `${scenario}: phaseCount matches fixture`);
    assertTrue(Array.isArray(result.phases), `${scenario}: phases[] present in JSON output`);

    if (fixture.broken_links) {
      const phaseLinkResult = (result.results || []).find((entry) => entry.rule === 'PHASE_LINKS');
      assertTrue(
        !!phaseLinkResult && phaseLinkResult.status === 'warn',
        `${scenario}: PHASE_LINKS emits warning`
      );
    }

    if (fixture.empty_child) {
      assertTrue(result.summary.errors > 0, `${scenario}: empty child produces validation errors`);
    }

    if (!fixture.scenario.startsWith('flat')) {
      const autoRawOrError = runBashExpectFailure(VALIDATE_SCRIPT, [fixturePath, '--json']);
      const autoRawJson = autoRawOrError.code === 0
        ? runBash(VALIDATE_SCRIPT, [fixturePath, '--json'])
        : autoRawOrError.stdout;
      const autoResult = parseJson(autoRawJson, `validate.sh auto-recursive parse failed (${scenario})`);
      assertEqual(
        autoResult.phaseCount,
        fixture.phase_names.length,
        `${scenario}: validate.sh auto-enables recursive mode when phase children exist`
      );
    }
  }
}

function main() {
  testPhaseDetectionFixtures();
  testPhaseDefaultsContracts();
  testPhaseCreationFixtures();
  testPhaseValidationFixtures();

  console.log(`\nResult: passed=${passed} failed=${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
