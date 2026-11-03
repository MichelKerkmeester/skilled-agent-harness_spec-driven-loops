#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Playbook Package Validator Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  validatePackage,
  parseConversationScript,
  CONVERSATION_FENCE_INFO,
} = require('../validate-playbook-package.cjs');

const validatorPath = path.resolve(__dirname, '..', 'validate-playbook-package.cjs');
const fixtureSource = path.join(__dirname, 'fixtures', 'clean-package');
const conversationFixtureSource = path.join(__dirname, 'fixtures', 'conversation-package');
const repoRoot = path.resolve(__dirname, '../../../../../..');
const manifestPath = path.resolve(__dirname, '..', '..', 'playbook-corpus-manifest.json');

function copyFixture(label, mutate, source = fixtureSource) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), `playbook-${label}-`));
  const packageRoot = path.join(tempRoot, 'package');
  fs.cpSync(source, packageRoot, { recursive: true });
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

function conversationScenarioPath(packageRoot) {
  return path.join(packageRoot, 'scenarios', 'conversation-scenario.md');
}

function readConversationScenario(packageRoot) {
  return fs.readFileSync(conversationScenarioPath(packageRoot), 'utf8');
}

function writeConversationScenario(packageRoot, text) {
  fs.writeFileSync(conversationScenarioPath(packageRoot), text);
}

/**
 * Find the JSON body bounds while leaving the surrounding markdown fences intact.
 *
 * @param {string} text - Scenario markdown that contains one conversation block.
 * @returns {{bodyStart: number, contentEnd: number}} Body offsets in the source.
 */
function conversationBlockBounds(text) {
  const fence = '\x60'.repeat(3);
  const opening = `${fence}${CONVERSATION_FENCE_INFO}\n`;
  const openingStart = text.indexOf(opening);
  if (openingStart < 0) throw new Error('conversation fixture block is missing');
  const bodyStart = openingStart + opening.length;
  const contentEnd = text.indexOf(`\n${fence}`, bodyStart);
  if (contentEnd < 0) throw new Error('conversation fixture block is missing');
  return { bodyStart, contentEnd };
}

/**
 * Parse the JSON payload from a conversation fixture.
 *
 * @param {string} packageRoot - Fixture package root.
 * @returns {Object} Parsed conversation script.
 */
function readConversationScript(packageRoot) {
  const text = readConversationScenario(packageRoot);
  const { bodyStart, contentEnd } = conversationBlockBounds(text);
  return JSON.parse(text.slice(bodyStart, contentEnd));
}

/**
 * Replace the JSON body while preserving its markdown fences.
 *
 * @param {string} packageRoot - Fixture package root.
 * @param {string} content - Replacement JSON source.
 * @returns {void}
 */
function writeConversationBlock(packageRoot, content) {
  const text = readConversationScenario(packageRoot);
  const { bodyStart, contentEnd } = conversationBlockBounds(text);
  writeConversationScenario(packageRoot, text.slice(0, bodyStart) + content + text.slice(contentEnd));
}

/**
 * Return a fixture mutator that edits and rewrites its parsed conversation script.
 *
 * @param {(script: Object) => void} mutate - Change the parsed fixture script.
 * @returns {(packageRoot: string) => void} Fixture mutator.
 */
function mutateConversationScript(mutate) {
  return (packageRoot) => {
    const script = readConversationScript(packageRoot);
    mutate(script);
    writeConversationBlock(packageRoot, JSON.stringify(script, null, 2));
  };
}

function runCli(packageRoot, extra = []) {
  return spawnSync(process.execPath, [
    validatorPath,
    '--package', packageRoot,
    '--repo-root', repoRoot,
    '--skills-root', path.join(repoRoot, '.skilled', 'skills'),
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

function conversationOutcome(label, mutate) {
  const packageRoot = copyFixture(label, mutate, conversationFixtureSource);
  return codes(packageRoot);
}

/**
 * Assert that one invalid script reports the requested field path.
 *
 * @param {string} label - Temporary fixture label.
 * @param {(packageRoot: string) => void} mutate - Invalidating fixture mutation.
 * @param {string} pathFragment - Expected diagnostic path prefix.
 * @returns {number} Number of assertions performed.
 */
function expectConversationPath(label, mutate, pathFragment) {
  const outcome = conversationOutcome(label, mutate);
  let assertions = 0;
  assertions += 1;
  assert.strictEqual(
    outcome.result.status,
    1,
    label + ' should exit 1\n' + outcome.result.stdout + '\n' + outcome.result.stderr,
  );
  assertions += 1;
  assert(outcome.codes.includes('CONVERSATION_SCRIPT_INVALID'), label + ' should report CONVERSATION_SCRIPT_INVALID');
  const findings = outcome.report.packages.flatMap((pkg) => pkg.violations)
    .filter((item) => item.code === 'CONVERSATION_SCRIPT_INVALID');
  assertions += 1;
  assert(
    findings.some((item) => item.message.startsWith(pathFragment + ':')),
    label + ' should name ' + pathFragment + '; got ' + findings.map((item) => item.message).join(' | '),
  );
  return assertions;
}

/**
 * Guard the three behaviours added when the corpus was brought to zero.
 *
 * Each is a relaxation or a widening of what the grader accepts, and a grader that accepts
 * too much reports a clean corpus it never actually checked. The suite passed before these
 * behaviours existed and would keep passing if they silently regressed, so the assertions
 * below pin both halves: the false positive stays fixed, and the real defect stays caught.
 */
function runContractRegressions() {
  // Emphasis tolerance: a bold marker is still a marker...
  expectClean('bold markers accepted', (packageRoot) => {
    writeScenario(packageRoot, readScenario(packageRoot)
      .replace(/^Prompt:/im, '**Prompt**:')
      .replace(/^Evidence:/im, '**Evidence**:'));
  });

  // ...but emphasis must not become a way to satisfy a marker that is absent.
  // The fixture states its prompt twice — a label line and a table column — and either
  // satisfies the contract, so a negative case has to remove both.
  expectViolation('missing prompt still caught with emphasis support', (packageRoot) => {
    writeScenario(packageRoot, readScenario(packageRoot)
      .replace(/^-\s*Operator prompt:.*$/im, '- Operator note: none')
      .replace(/Exact Prompt/g, 'Sample Input'));
  }, 'REQUIRED_PROMPT');

  // A label line inside a config sample is not a command sequence.
  expectViolation('config-sample command line is not a command sequence', (packageRoot) => {
    const text = readScenario(packageRoot)
      .replace(/^#{2,4}\s+(?:exact )?commands?(?: sequence)?.*$/gim, '### Steps')
      .replace(/Exact Command Sequence/g, 'Observed Steps');
    writeScenario(packageRoot, `${text}\n\n\`\`\`yaml\ncommand: ./run.sh\n\`\`\`\n`);
  }, 'REQUIRED_COMMAND_SEQUENCE');

  // Fenced code is not scanned for links...
  expectClean('bracket-call syntax in a fence is not a link', (packageRoot) => {
    writeScenario(packageRoot, `${readScenario(packageRoot)}\n\n\`\`\`js\nhooks['tool.execute.before']({ a: 1 });\n\`\`\`\n`);
  });

  // ...and an indent-mismatched closer must not swallow the prose after it.
  expectViolation('broken link after an indent-mismatched fence closer is caught', (packageRoot) => {
    writeScenario(packageRoot,
      `${readScenario(packageRoot)}\n\n\`\`\`bash\necho one\n  \`\`\`\n` +
      `See [missing](./does-not-exist-zzz.md).\n\n\`\`\`bash\necho two\n\`\`\`\n`);
  }, 'PATH_MISSING');

  // Discovery must reach a packet-owned root, which lives beside its hub's, not inside it.
  // A one-level scan once found 14 roots where 41 existed, and a root that is not scanned
  // cannot fail — so this asserts coverage, not correctness of any single package.
  const nested = fs.mkdtempSync(path.join(os.tmpdir(), 'playbook-nested-'));
  const skillsRoot = path.join(nested, 'skills');
  fs.cpSync(fixtureSource, path.join(skillsRoot, 'hub', 'packet', 'manual-testing-playbook'), { recursive: true });
  fs.cpSync(fixtureSource, path.join(skillsRoot, 'gold', 'manual-testing-playbook'), { recursive: true });
  const nestedManifest = path.join(nested, 'manifest.json');
  fs.writeFileSync(nestedManifest, JSON.stringify({
    version: 1,
    defaultContract: 'operator-scenario',
    routingGoldRoots: ['skills/gold/manual-testing-playbook'],
    warnPackages: [],
  }));
  const discovered = spawnSync(process.execPath, [
    validatorPath, '--skills-root', skillsRoot, '--repo-root', nested,
    '--manifest', nestedManifest, '--no-strict', '--format', 'json',
  ], { encoding: 'utf8' });
  assert(discovered.stdout, `nested discovery probe produced no output: ${discovered.stderr}`);
  const found = JSON.parse(discovered.stdout).packages.map((entry) => entry.package);
  assert(found.includes('hub/packet'), `packet-owned root must be discovered; found ${found.join(', ') || 'none'}`);

  // An absent warnPackages key means nothing is grandfathered.
  assert.strictEqual(
    require('../validate-playbook-package.cjs').WARN_PACKAGE_IDS.length, 0,
    'WARN_PACKAGE_IDS must stay empty so deleting the manifest key cannot restore a backlog',
  );

  console.log('contract regressions: PASS (8 assertions)');
}

function run() {
  const positive = expectClean('positive');
  const sectionOrder = expectViolation('section-order', (root) => writeScenario(root, readScenario(root).replace('## 2. SCENARIO CONTRACT', '## 9. WRONG ORDER').replace('## 3. TEST EXECUTION', '## 2. SCENARIO CONTRACT').replace('## 9. WRONG ORDER', '## 3. TEST EXECUTION')), 'SECTION_ORDER_MISMATCH');
  expectViolation('section-five', (root) => writeScenario(root, readScenario(root).replace(/\n## 5\. SOURCE METADATA[\s\S]*$/, '\n')), 'SECTION_5_MISSING');
  expectClean('frontmatter-version-absent', (root) => writeScenario(root, readScenario(root).replace(/^version: .*\n/m, '')));
  expectViolation('frontmatter-description', (root) => writeScenario(root, readScenario(root).replace('description: "A clean fixture for the operator-scenario validator."\n', '')), 'FRONTMATTER_DESCRIPTION_MISSING');
  const backtick = expectClean('backtick-path-report-only', (root) => writeScenario(root, `${readScenario(root)}\nRead \`.skilled/commands/create/diagram.md\` and \`.skilled/skills/sk-doc/SKILL.md:1\`, then \`./clean-scenario.md\` and \`scenarios/clean-scenario.md\`; skip \`<skill>/references/x.md\`, \`/tmp/out.json\` and \`scripts/*.sh\`.\n`));
  const backtickWarnings = backtick.report.packages.flatMap((pkg) => pkg.warnings).filter((item) => item.code === 'BACKTICK_PATH_UNRESOLVED');
  assert.deepStrictEqual(backtickWarnings.map((item) => item.message.split(': ').pop()), ['.skilled/commands/create/diagram.md']);
  const installed = expectClean('backtick-installed-release-state', (root) => writeScenario(root, `${readScenario(root)}\nRecord \`.skilled/release/base.json\`, \`.skilled/release/runs/.doctor-update.last-run.json\` and \`.skilled/skills/.state/doctor-update/base.json\`, but not \`.skilled/releases/base.json\`.\n`));
  assert.deepStrictEqual(installed.report.packages.flatMap((pkg) => pkg.warnings).filter((item) => item.code === 'BACKTICK_PATH_UNRESOLVED').map((item) => item.message.split(': ').pop()), ['.skilled/releases/base.json']);
  const linked = expectClean('backtick-dangling-symlink', (root) => {
    fs.symlinkSync(path.join(root, 'missing-build-output.js'), path.join(root, 'scenarios', 'linked-plugin.js'));
    writeScenario(root, `${readScenario(root)}\nLoad \`scenarios/linked-plugin.js\` but not \`scenarios/unlinked-plugin.js\`.\n`);
  });
  assert.deepStrictEqual(linked.report.packages.flatMap((pkg) => pkg.warnings).filter((item) => item.code === 'BACKTICK_PATH_UNRESOLVED').map((item) => item.message.split(': ').pop()), ['scenarios/unlinked-plugin.js']);
  const rooted = expectClean('backtick-root-file', (root) => fs.appendFileSync(rootPath(root), '\nRead `.skilled/skills/sk-doc/SKILL.md` but not `.skilled/commands/create/missing-root.md`.\n'));
  assert.deepStrictEqual(rooted.report.packages.flatMap((pkg) => pkg.warnings).filter((item) => item.code === 'BACKTICK_PATH_UNRESOLVED').map((item) => `${item.file}: ${item.message.split(': ').pop()}`), ['manual-testing-playbook.md: .skilled/commands/create/missing-root.md']);

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

  console.log(`fixture suite: PASS (${required.length + 28} negative/positive assertions)`);
  console.log(`clean: ${positive.report.packages[0].status}; section-order: ${sectionOrder.report.packages[0].status}`);
  console.log('strict default: rc=1 on seeded violation; --no-strict: rc=0; boundary: rc=2');
}

function runCentralPackageDiscoveryRegression() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'playbook-central-'));
  try {
    const skillsRoot = path.join(tempRoot, '.skilled', 'skills');
    const centralRoot = path.join(tempRoot, '.skilled', 'manual-testing-playbook');
    const goldRoot = path.join(skillsRoot, 'gold', 'manual-testing-playbook');
    fs.cpSync(fixtureSource, centralRoot, { recursive: true });
    fs.cpSync(fixtureSource, goldRoot, { recursive: true });
    const centralManifest = path.join(tempRoot, 'manifest.json');
    fs.writeFileSync(centralManifest, JSON.stringify({
      version: 1,
      defaultContract: 'operator-scenario',
      routingGoldRoots: ['.skilled/skills/gold/manual-testing-playbook'],
      warnPackages: [],
    }));
    const args = [
      '--repo-root', tempRoot,
      '--skills-root', skillsRoot,
      '--manifest', centralManifest,
      '--no-strict',
      '--format', 'json',
    ];
    const discovered = spawnSync(process.execPath, [validatorPath, ...args], { encoding: 'utf8' });
    assert.strictEqual(discovered.status, 0, `central discovery should exit 0\n${discovered.stdout}\n${discovered.stderr}`);
    const roots = JSON.parse(discovered.stdout).packages.map((entry) => entry.playbookRoot);
    assert(roots.includes('.skilled/manual-testing-playbook'), `central root must be discovered; found ${roots.join(', ')}`);

    const selected = spawnSync(process.execPath, [
      validatorPath,
      '--package', '.skilled/manual-testing-playbook',
      ...args,
    ], { encoding: 'utf8' });
    assert.strictEqual(selected.status, 0, `central package filter should exit 0\n${selected.stdout}\n${selected.stderr}`);
    assert.deepStrictEqual(
      JSON.parse(selected.stdout).packages.map((entry) => entry.playbookRoot),
      ['.skilled/manual-testing-playbook'],
      'repo-root-relative central package filter should select only the central root',
    );
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
  console.log('central package discovery regression: PASS (2 assertions)');
}

function unsyncedWarnings(outcome) {
  return outcome.report.packages[0].warnings.filter((warning) => warning.code === 'PROMPT_UNSYNCED');
}

function expectUnsynced(label, mutate, count, where) {
  const outcome = expectClean(label, mutate);
  const found = unsyncedWarnings(outcome);
  assert.strictEqual(found.length, count, `${label} should raise ${count} PROMPT_UNSYNCED warning(s); got ${JSON.stringify(found)}`);
  if (where) assert(found.every((warning) => warning.message.endsWith(where)), `${label} should name ${where}; got ${JSON.stringify(found)}`);
}

/**
 * Pin the prompt synchronization warning in both directions.
 *
 * A copy that says something else must be reported wherever it lives, and a copy that
 * differs only in presentation must not be, or the warning stops meaning anything. The
 * root summary is found by walking out from the link, so the suite also pins that an
 * index section linking several scenarios is never read as one scenario's summary.
 */
function runPromptSyncRegressions() {
  const summary = (prompt) => `\n## FX-001 summary\n\nPrompt: \`${prompt}\`\n\n> Feature file: [FX-001](scenarios/clean-scenario.md)\n`;
  const chain = (turnOne) => `### Conversation Chain\n\n| Turn | Exact User Input | Expected Assistant Behavior |\n|---|---|---|\n| 1 | \`${turnOne}\` | Run it. |\n| 2 | \`Report the result.\` | Report it. |\n\n## 3. TEST EXECUTION`;
  const prompt = 'Run the fixture contract and report the observed result.';

  expectUnsynced('prompt sync clean fixture', null, 0);
  expectUnsynced('prompt sync table differs', (root) => writeScenario(root, readScenario(root)
    .replace(`| \`${prompt}\` |`, '| `Run a different contract.` |')), 1, "the execution table's Exact Prompt");
  expectUnsynced('prompt sync root summary agrees', (root) => fs.appendFileSync(rootPath(root), summary(prompt)), 0);
  expectUnsynced('prompt sync root summary differs', (root) => fs.appendFileSync(rootPath(root), summary('Run a different contract.')), 1, 'the root summary prompt');
  expectUnsynced('prompt sync turn 1 agrees', (root) => writeScenario(root, readScenario(root).replace('## 3. TEST EXECUTION', chain(prompt))), 0);
  expectUnsynced('prompt sync turn 1 differs', (root) => writeScenario(root, readScenario(root).replace('## 3. TEST EXECUTION', chain('Run a different contract.'))), 1, "the conversation chain's Turn 1 input");
  expectUnsynced('prompt sync presentation only', (root) => {
    writeScenario(root, readScenario(root)
      .replace(`- Operator prompt: \`${prompt}\``, `- **Operator prompt:** ${prompt}`)
      .replace(`| \`${prompt}\` |`, `| "Run the \`fixture\` contract and report the observed result." |`));
    fs.appendFileSync(rootPath(root), summary(`"${prompt}"`));
  }, 0);
  expectUnsynced('prompt sync index section is not a summary', (root) => {
    fs.writeFileSync(path.join(root, 'scenarios', 'second-scenario.md'), readScenario(root).replace(/FX-001/g, 'FX-002'));
    fs.writeFileSync(rootPath(root), fs.readFileSync(rootPath(root), 'utf8')
      .replace('- [FX-001](scenarios/clean-scenario.md)\n', '- [FX-001](scenarios/clean-scenario.md)\n- [FX-002](scenarios/second-scenario.md)\n\nPrompt: `Run a different contract.`\n'));
  }, 0);

  console.log('prompt sync regressions: PASS (8 assertions)');
}

/**
 * Exercise malformed, valid and edge-case conversation scripts through the CLI.
 *
 * @returns {void}
 */
function runConversationRegressions() {
  let assertions = 0;

  function assertStatus(outcome, expected, label) {
    assertions += 1;
    assert.strictEqual(
      outcome.result.status,
      expected,
      label + ' should exit ' + expected + '\n' + outcome.result.stdout + '\n' + outcome.result.stderr,
    );
  }

  function assertHasCode(outcome, code, label) {
    assertions += 1;
    assert(outcome.codes.includes(code), label + ' should report ' + code + '; got ' + outcome.codes.join(', '));
  }

  function assertLacksCode(outcome, code, label) {
    assertions += 1;
    assert(!outcome.codes.includes(code), label + ' should not report ' + code + '; got ' + outcome.codes.join(', '));
  }

  function assertWarningCount(outcome, expected, label) {
    assertions += 1;
    const warnings = unsyncedWarnings(outcome);
    assert.strictEqual(warnings.length, expected, label + ' should raise ' + expected + ' PROMPT_UNSYNCED warning(s); got ' + JSON.stringify(warnings));
  }

  function assertWarningMessageIncludes(outcome, fragment, label) {
    assertions += 1;
    const warnings = unsyncedWarnings(outcome);
    assert(warnings.some((warning) => warning.message.includes(fragment)), label + ' should mention ' + fragment);
  }

  function assertDeepEqual(actual, expected, label) {
    assertions += 1;
    assert.deepStrictEqual(actual, expected, label);
  }

  const contractPrompt = 'Run the fixture contract and report the observed result.';
  const invalidShapes = [
    ['invalid JSON block', (root) => writeConversationBlock(root, '{not json'), '(block)'],
    ['second conversation block', (root) => fs.appendFileSync(
      conversationScenarioPath(root),
      '\n' + '\x60'.repeat(3) + CONVERSATION_FENCE_INFO + '\n{}\n' + '\x60'.repeat(3) + '\n',
    ), '(block)'],
    ['empty root object', (root) => writeConversationBlock(root, '{}'), 'turns'],
    ['empty turns', mutateConversationScript((script) => { script.turns = []; }), 'turns'],
    ['unknown root key', mutateConversationScript((script) => { script.extra = true; }), 'extra'],
    ['non-boolean trust_hooks', mutateConversationScript((script) => { script.trust_hooks = 'yes'; }), 'trust_hooks'],
    ['unknown turn key', mutateConversationScript((script) => { script.turns[0].extra = true; }), 'turns[0].extra'],
    ['unknown question key', mutateConversationScript((script) => {
      script.turns[0].questions = [{ match: 'continue', answer: { reply: 'Continue.' }, extra: true }];
    }), 'turns[0].questions[0].extra'],
    ['unknown answer key', mutateConversationScript((script) => {
      script.turns[0].questions = [{ match: 'continue', answer: { reply: 'Continue.', extra: true } }];
    }), 'turns[0].questions[0].answer.extra'],
    ['send and action together', mutateConversationScript((script) => {
      script.turns[0].action = 'restart';
    }), 'turns[0]'],
    ['unsupported action', mutateConversationScript((script) => {
      script.turns.push({ id: 'bad-action', action: 'pause', check: 'test -f out.txt' });
    }), 'turns[1].action'],
    ['send with newline', mutateConversationScript((script) => {
      script.turns[0].send = contractPrompt + '\nAgain.';
    }), 'turns[0].send'],
    ['first behavior is an action', mutateConversationScript((script) => {
      script.turns[0] = { id: 'first-action', action: 'compact', check: 'test -f out.txt' };
    }), 'turns[0].action'],
    ['negative delay', mutateConversationScript((script) => { script.turns[0].delay_ms = -1; }), 'turns[0].delay_ms'],
    ['descending delay range', mutateConversationScript((script) => {
      script.turns[0].delay_ms = [5, 2];
    }), 'turns[0].delay_ms'],
    ['zero timeout', mutateConversationScript((script) => { script.turns[0].timeout_ms = 0; }), 'turns[0].timeout_ms'],
    ['invalid retry', mutateConversationScript((script) => { script.turns[0].retry = 2; }), 'turns[0].retry'],
    ['duplicate turn id', mutateConversationScript((script) => {
      script.turns[0].id = 'same-id';
      script.turns.push({ id: 'same-id', check: 'test -f out.txt' });
    }), 'turns[1].id'],
    ['question missing match', mutateConversationScript((script) => {
      script.turns[0].questions = [{ answer: { reply: 'Continue.' } }];
    }), 'turns[0].questions[0].match'],
    ['invalid question pattern', mutateConversationScript((script) => {
      script.turns[0].questions = [{ match: '(', answer: { reply: 'Continue.' } }];
    }), 'turns[0].questions[0].match'],
    ['answer has select and reply', mutateConversationScript((script) => {
      script.turns[0].questions = [{ match: 'continue', answer: { select: ['Continue'], reply: 'Continue.' } }];
    }), 'turns[0].questions[0].answer'],
    ['empty selection', mutateConversationScript((script) => {
      script.turns[0].questions = [{ match: 'continue', answer: { select: [] } }];
    }), 'turns[0].questions[0].answer.select'],
    ['multiple labels without multi', mutateConversationScript((script) => {
      script.turns[0].questions = [{ match: 'continue', answer: { select: ['Yes', 'No'] } }];
    }), 'turns[0].questions[0].answer.select'],
    ['multi beside reply', mutateConversationScript((script) => {
      script.turns[0].questions = [{ match: 'continue', answer: { reply: 'Continue.', multi: true } }];
    }), 'turns[0].questions[0].answer.multi'],
    ['turn missing check', mutateConversationScript((script) => { delete script.turns[0].check; }), 'turns[0].check'],
    ['unsupported runtime', mutateConversationScript((script) => { script.runtimes = ['cursor']; }), 'runtimes[0]'],
  ];

  for (const [label, mutate, pathFragment] of invalidShapes) {
    assertions += expectConversationPath(label, mutate, pathFragment);
  }

  const emptyQuestionMatch = conversationOutcome('empty question match', mutateConversationScript((script) => {
    script.turns[0].questions = [{ match: '', answer: { reply: 'Continue.' } }];
  }));
  assertStatus(emptyQuestionMatch, 1, 'empty question match');
  assertHasCode(emptyQuestionMatch, 'CONVERSATION_SCRIPT_INVALID', 'empty question match');
  const emptyMatchFindings = emptyQuestionMatch.report.packages.flatMap((pkg) => pkg.violations)
    .filter((item) => item.code === 'CONVERSATION_SCRIPT_INVALID');
  assertions += 1;
  assert(
    emptyMatchFindings.some((item) => item.message === 'turns[0].questions[0].match: must be a non-empty string'),
    'empty question match should use the non-empty string finding',
  );

  const unclosedConversation = conversationOutcome('unclosed conversation fence', (root) => {
    const text = readConversationScenario(root);
    const closing = `\n${'\x60'.repeat(3)}\n`;
    const closingIndex = text.lastIndexOf(closing);
    if (closingIndex < 0) throw new Error('conversation fixture closing fence is missing');
    writeConversationScenario(root, `${text.slice(0, closingIndex)}\n`);
  });
  assertStatus(unclosedConversation, 1, 'unclosed conversation fence');
  assertHasCode(unclosedConversation, 'CONVERSATION_SCRIPT_INVALID', 'unclosed conversation fence');
  const unclosedFindings = unclosedConversation.report.packages.flatMap((pkg) => pkg.violations)
    .filter((item) => item.code === 'CONVERSATION_SCRIPT_INVALID');
  assertions += 1;
  assert(
    unclosedFindings.some((item) => item.message.includes('block has no closing fence')),
    'an unclosed conversation block should report its missing fence',
  );

  const clean = conversationOutcome('conversation-package-clean');
  assertStatus(clean, 0, 'conversation package as-is');
  assertLacksCode(clean, 'CONVERSATION_SCRIPT_INVALID', 'conversation package as-is');
  assertWarningCount(clean, 0, 'conversation package as-is');

  const trustHooksTrue = conversationOutcome('conversation-trust-hooks-true', mutateConversationScript((script) => {
    script.trust_hooks = true;
  }));
  assertStatus(trustHooksTrue, 0, 'boolean trust_hooks');
  assertLacksCode(trustHooksTrue, 'CONVERSATION_SCRIPT_INVALID', 'boolean trust_hooks');

  const validEdges = [
    ['check-only first turn followed by send', mutateConversationScript((script) => {
      script.turns = [
        { id: 'baseline', check: 'test -f out.txt' },
        { id: 'send', send: contractPrompt, check: 'test -s out.txt' },
      ];
    })],
    ['ascending delay range', mutateConversationScript((script) => { script.turns[0].delay_ms = [3000, 8000]; })],
    ['multi-select answer', mutateConversationScript((script) => {
      script.turns[0].questions = [{
        match: 'continue',
        answer: { select: ['Yes', 'No'], multi: true },
      }];
    })],
    ['retry once', mutateConversationScript((script) => { script.turns[0].retry = 1; })],
    ['plain JSON fence is ignored', (root) => fs.appendFileSync(
      conversationScenarioPath(root),
      '\n' + '\x60'.repeat(3) + 'json\nnot a conversation script\n' + '\x60'.repeat(3) + '\n',
    )],
  ];

  for (const [label, mutate] of validEdges) {
    assertStatus(conversationOutcome(label, mutate), 0, label);
  }

  const masked = conversationOutcome('conversation-block-masking', mutateConversationScript((script) => {
    script.turns[0].check = 'grep -q BLOCKED out.txt || echo SKIP; ls /Users/x';
  }));
  assertStatus(masked, 0, 'conversation check text is masked');
  assertLacksCode(masked, 'FORBIDDEN_VERDICT', 'conversation check text is masked');
  assertLacksCode(masked, 'SKIP_BLOCKER_MISSING', 'conversation check text is masked');
  assertLacksCode(masked, 'DEVELOPER_ABSOLUTE_PATH', 'conversation check text is masked');

  const proseVerdict = conversationOutcome('conversation-prose-verdict', (root) => {
    fs.appendFileSync(conversationScenarioPath(root), '\nThe observed status is BLOCKED.\n');
  });
  assertStatus(proseVerdict, 1, 'BLOCKED outside a conversation block');
  assertHasCode(proseVerdict, 'FORBIDDEN_VERDICT', 'BLOCKED outside a conversation block');

  const promptMatches = conversationOutcome('conversation-prompt-sync-equal');
  assertStatus(promptMatches, 0, 'conversation first send matches contract prompt');
  assertWarningCount(promptMatches, 0, 'conversation first send matches contract prompt');

  const promptDiffers = conversationOutcome('conversation-prompt-sync-different', mutateConversationScript((script) => {
    script.turns[0].send = 'Run a different contract.';
  }));
  assertStatus(promptDiffers, 0, 'conversation first send differs from contract prompt');
  assertWarningCount(promptDiffers, 1, 'conversation first send differs from contract prompt');
  assertWarningMessageIncludes(
    promptDiffers,
    "the conversation script's first send",
    'conversation prompt sync warning',
  );

  assertDeepEqual(
    parseConversationScript('Ordinary scenario text without a conversation block.'),
    { script: null, findings: [], block: null },
    'parseConversationScript should return the empty result when no block exists',
  );

  console.log('conversation script regressions: PASS (' + assertions + ' assertions)');
}

// A report larger than one pipe buffer must still arrive whole. The live corpus no longer prints
// that much, so a seeded package carries enough unresolved paths to exceed the buffer.
function runPipedReportRegression() {
  const packageRoot = copyFixture('piped-report', (root) => writeScenario(root, `${readScenario(root)}\n${Array.from({ length: 1500 }, (_, index) => `\`missing/drift-${index}.md\``).join('\n')}\n`));
  const seeded = runCli(packageRoot, ['--strict']);
  assert(seeded.stdout.length > 65536, `seeded report should exceed one pipe buffer; got ${seeded.stdout.length} bytes`);
  assert(/\nexit=\d+\n$/.test(seeded.stdout), 'piped seeded report must end with its exit line');
  console.log('piped report regression: PASS (2 assertions)');
}

run();
runContractRegressions();
runCentralPackageDiscoveryRegression();
runPromptSyncRegressions();
runPipedReportRegression();
runConversationRegressions();
