#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { validatePackage } = require('../validate-playbook-package.cjs');

const validatorPath = path.resolve(__dirname, '..', 'validate-playbook-package.cjs');
const fixtureSource = path.join(__dirname, 'fixtures', 'clean-package');
const repoRoot = path.resolve(__dirname, '../../../../../..');
const manifestPath = path.resolve(__dirname, '..', '..', 'playbook-corpus-manifest.json');

function copyFixture(label, mutate) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), `playbook-${label}-`));
  const packageRoot = path.join(tempRoot, 'package');
  fs.cpSync(fixtureSource, packageRoot, { recursive: true });
  if (mutate) mutate(packageRoot);
  return packageRoot;
}

function scenarioPath(packageRoot) {
  return path.join(packageRoot, 'scenarios', 'clean-scenario.md');
}

function rootPath(packageRoot) {
  return path.join(packageRoot, 'manual-testing-playbook.md');
}

function readScenario(packageRoot) {
  return fs.readFileSync(scenarioPath(packageRoot), 'utf8');
}

function writeScenario(packageRoot, text) {
  fs.writeFileSync(scenarioPath(packageRoot), text);
}

function runCli(packageRoot, extra = []) {
  return spawnSync(process.execPath, [
    validatorPath,
    '--package', packageRoot,
    '--repo-root', repoRoot,
    '--skills-root', path.join(repoRoot, '.opencode', 'skills'),
    '--manifest', manifestPath,
    ...extra,
  ], { encoding: 'utf8' });
}

function codes(packageRoot) {
  const result = runCli(packageRoot, ['--format', 'json']);
  const report = JSON.parse(result.stdout);
  return { result, report, codes: report.packages.flatMap((pkg) => pkg.violations.map((item) => item.code)) };
}

function expectViolation(label, mutate, code) {
  const packageRoot = copyFixture(label, mutate);
  const outcome = codes(packageRoot);
  assert.strictEqual(outcome.result.status, 1, `${label} should exit 1\n${outcome.result.stdout}\n${outcome.result.stderr}`);
  assert(outcome.codes.includes(code), `${label} should report ${code}; got ${outcome.codes.join(', ')}`);
  return outcome;
}

function expectClean(label, mutate) {
  const packageRoot = copyFixture(label, mutate);
  const outcome = codes(packageRoot);
  assert.strictEqual(outcome.result.status, 0, `${label} should exit 0\n${outcome.result.stdout}\n${outcome.result.stderr}`);
  return outcome;
}

function run() {
  const positive = expectClean('positive');
  const sectionOrder = expectViolation('section-order', (root) => writeScenario(root, readScenario(root).replace('## 2. SCENARIO CONTRACT', '## 9. WRONG ORDER').replace('## 3. TEST EXECUTION', '## 2. SCENARIO CONTRACT').replace('## 9. WRONG ORDER', '## 3. TEST EXECUTION')), 'SECTION_ORDER_MISMATCH');
  expectViolation('section-five', (root) => writeScenario(root, readScenario(root).replace(/\n## 5\. SOURCE METADATA[\s\S]*$/, '\n')), 'SECTION_5_MISSING');
  expectViolation('frontmatter-version', (root) => writeScenario(root, readScenario(root).replace('version: 1.0.0.0', 'version: 1.0.0')), 'FRONTMATTER_VERSION_INVALID');
  expectViolation('frontmatter-description', (root) => writeScenario(root, readScenario(root).replace('description: "A clean fixture for the operator-scenario validator."\n', '')), 'FRONTMATTER_DESCRIPTION_MISSING');

  const requiredMutations = [
    ['required-feature-id', (text) => text.replace(/id: FX-001\n/, '').replace(/FX-001/g, 'Scenario'), 'REQUIRED_FEATURE_ID'],
    ['required-prompt', (text) => text.replace(/- Operator prompt:[^\n]*\n/, '').replace(/\| FX-001 \|[^\n]*\| `Run the fixture contract and report the observed result\.` \|/, '| FX-001 | Clean operator scenario | Prove the fixture contract | |'), 'REQUIRED_PROMPT'],
    ['required-command', (text) => text.replace(/### Exact Command Sequence[\s\S]*?### Expected Signals/, '### Expected Signals').replace(/Exact Command Sequence/g, 'Observed Steps'), 'REQUIRED_COMMAND_SEQUENCE'],
    ['required-signals', (text) => text.replace(/### Expected Signals[\s\S]*?### Evidence/, '### Evidence').replace(/Expected Signals/gi, 'Observed Signals'), 'REQUIRED_EXPECTED_SIGNALS'],
    ['required-evidence', (text) => text.replace(/### Evidence[\s\S]*?### Pass \/ Fail Criteria/, '### Pass / Fail Criteria').replace(/Evidence/g, 'Artifacts'), 'REQUIRED_EVIDENCE'],
    ['required-pass-fail', (text) => text.replace(/### Pass \/ Fail Criteria[\s\S]*?### Failure Triage/, '### Failure Triage').replace(/pass/gi, 'outcome').replace(/fail/gi, 'error'), 'REQUIRED_PASS_FAIL'],
    ['required-triage', (text) => text.replace(/### Failure Triage[\s\S]*?\n\| Feature ID/, '\n| Feature ID').replace(/Failure Triage/g, 'Triage'), 'REQUIRED_FAILURE_TRIAGE'],
  ];
  const required = requiredMutations.map(([label, mutate, code]) => expectViolation(label, (root) => writeScenario(root, mutate(readScenario(root))), code));

  expectViolation('conditional-user-request', (root) => {
    let text = readScenario(root).replace('id: FX-001', 'id: FX-001\nrequires_realistic_user_request: true');
    text = text.replace(/- Operator prompt:[^\n]*\n/, '- Operator prompt: `Clarify user intent before executing.`\n');
    writeScenario(root, text);
  }, 'CONDITIONAL_REALISTIC_USER_REQUEST');
  expectViolation('conditional-table-prompt', (root) => writeScenario(root, readScenario(root).replace('| FX-001 | Clean operator scenario | Prove the fixture contract | `Run the fixture contract and report the observed result.` |', '| FX-001 | Clean operator scenario | Prove the fixture contract | |')), 'CONDITIONAL_TABLE_PROMPT');
  expectViolation('conditional-catalog-link', (root) => writeScenario(root, readScenario(root).replace('- Root playbook:', '- Catalog link applies: yes\n- Root playbook:').replace('feature-catalog', 'catalog')), 'CONDITIONAL_CATALOG_LINK');

  expectViolation('forbidden-verdict', (root) => writeScenario(root, `${readScenario(root)}\nScenario verdict: PARTIAL\n`), 'FORBIDDEN_VERDICT');
  expectViolation('bare-skip', (root) => writeScenario(root, `${readScenario(root)}\nScenario verdict: SKIP\n`), 'SKIP_BLOCKER_MISSING');
  expectViolation('bad-filename', (root) => {
    fs.renameSync(scenarioPath(root), path.join(root, 'scenarios', '01-clean-scenario.md'));
  }, 'FILENAME_NOT_KEBAB');
  expectViolation('duplicate-id', (root) => {
    fs.copyFileSync(scenarioPath(root), path.join(root, 'scenarios', 'other-scenario.md'));
    fs.appendFileSync(rootPath(root), '\n- [FX-001 duplicate](scenarios/other-scenario.md)\n');
  }, 'DUPLICATE_FEATURE_ID');
  expectViolation('index-orphan', (root) => fs.writeFileSync(rootPath(root), fs.readFileSync(rootPath(root), 'utf8').replace('- [FX-001](scenarios/clean-scenario.md)\n', '')), 'INDEX_ORPHAN_FILE');
  expectViolation('index-phantom', (root) => fs.writeFileSync(rootPath(root), fs.readFileSync(rootPath(root), 'utf8').replace('scenarios/clean-scenario.md', 'scenarios/missing-scenario.md')), 'INDEX_PHANTOM_FILE');

  const census = expectClean('census-warning', (root) => fs.appendFileSync(rootPath(root), '\nThis package provides 9 deterministic scenarios across 4 categories.\n'));
  assert(census.report.packages[0].warnings.some((warning) => warning.code === 'CENSUS_MISMATCH'), 'census mismatch should be a warning');
  expectViolation('missing-path', (root) => writeScenario(root, `${readScenario(root)}\nMissing source: [not-here](../assets/not-here.md)\n`), 'PATH_MISSING');
  expectViolation('outside-path', (root) => writeScenario(root, `${readScenario(root)}\nOutside source: [outside](../../../../etc/passwd)\n`), 'PATH_OUTSIDE_REPO');
  expectViolation('case-path', (root) => writeScenario(root, `${readScenario(root)}\nCase check: [root](../MANUAL-TESTING-PLAYBOOK.md)\n`), 'PATH_CASE_MISMATCH');
  expectViolation('developer-path', (root) => writeScenario(root, `${readScenario(root)}\nObserved path: /Users/operator/project/output.txt\n`), 'DEVELOPER_ABSOLUTE_PATH');
  expectViolation('dated-transcript', (root) => writeScenario(root, `${readScenario(root)}\nRun result on 2026-08-02: PASS\n`), 'BAKED_RUN_TRANSCRIPT');
  expectViolation('placeholder', (root) => writeScenario(root, readScenario(root).replace(/[\s\S]*?---\n\n# FX-001/, (match) => match.split('\n').slice(0, 8).join('\n') + '\n\n# Retired Backend Scenario').replace(/## 1\. OVERVIEW[\s\S]*$/, 'This placeholder remains only to keep the directory stable; no execution contract remains.')), 'PLACEHOLDER_SCENARIO');

  const strictNegative = copyFixture('strict-negative', (root) => writeScenario(root, `${readScenario(root)}\nScenario verdict: PARTIAL\n`));
  const noStrict = runCli(strictNegative, ['--no-strict']);
  assert.strictEqual(noStrict.status, 0, '--no-strict should report without failing');
  const missingRoot = spawnSync(process.execPath, [validatorPath, '--package', path.join(os.tmpdir(), 'missing-playbook-root')], { encoding: 'utf8' });
  assert.strictEqual(missingRoot.status, 2, 'missing package root should be usage/boundary rc 2');

  const routingRoot = copyFixture('routing-exclusion', (root) => {
    const routingDir = path.join(root, 'routing-gold');
    fs.mkdirSync(routingDir);
    fs.writeFileSync(path.join(routingDir, 'typed-gold.md'), 'not an operator scenario');
    const signatureDir = path.join(root, 'routing-signature');
    fs.mkdirSync(signatureDir);
    fs.writeFileSync(path.join(signatureDir, 'typed-signature.md'), `---
id: RG-001
expected_workflow_mode: quality
expected_leaf_resources:
  - workflow_mode: quality
    leaf_resource_id: references/example.md
---

# Typed routing gold
`);
  });
  const routingReport = validatePackage({
    playbookRoot: routingRoot,
    repoRoot: routingRoot,
    skillsRoot: routingRoot,
    manifest: { routingGoldRoots: [path.join(routingRoot, 'routing-gold')], warnPackages: [] },
  });
  assert.strictEqual(routingReport.status, 'PASS', 'routing-gold tree should be excluded from operator checks');
  assert.strictEqual(routingReport.derivedCensus.routingGoldFilesExcluded, 2, 'manifest and signature exclusions should be visible in derived census');
  assert.strictEqual(routingReport.derivedCensus.operatorScenarioFiles, 1, 'signature-bearing file should be skipped from operator audit');

  console.log(`fixture suite: PASS (${required.length + 26} negative/positive assertions)`);
  console.log(`clean: ${positive.report.packages[0].status}; section-order: ${sectionOrder.report.packages[0].status}`);
  console.log('strict default: rc=1 on seeded violation; --no-strict: rc=0; boundary: rc=2');
}

run();
