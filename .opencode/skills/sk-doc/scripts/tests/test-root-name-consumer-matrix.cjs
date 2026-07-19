#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const REPO = path.resolve(__dirname, '..', '..', '..', '..', '..');
const LOADER_PATH = path.join(REPO, '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs');
const GENERATOR_PATH = path.join(REPO, '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs');
const POST_ROUTER_PATH = path.join(REPO, '.opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs');
const LEAF_GENERATOR_PATH = path.join(REPO, '.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs');
const LEAF_CONTRACT_PATH = path.join(REPO, '.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs');
const TOPOLOGY_PATH = path.join(REPO, '.opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs');
const FRONTMATTER_PATH = path.join(REPO, '.opencode/skills/sk-doc/shared/scripts/frontmatter-version.mjs');
const DRIFT_PATH = path.join(REPO, '.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs');

const loader = require(LOADER_PATH);
const generator = require(GENERATOR_PATH);
const postRouter = require(POST_ROUTER_PATH);
const leafGenerator = require(LEAF_GENERATOR_PATH);
const leafContract = require(LEAF_CONTRACT_PATH);
const topology = require(TOPOLOGY_PATH);
const drift = require(DRIFT_PATH);

let passes = 0;

function check(label, fn) {
  fn();
  passes += 1;
  process.stdout.write(`PASS ${label}\n`);
}

function tempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function writeScenario(skillRoot, rootName) {
  const category = path.join(skillRoot, rootName, 'routing');
  fs.mkdirSync(category, { recursive: true });
  fs.writeFileSync(path.join(category, 'route.md'), [
    '---',
    'id: RT-001',
    'expected_intent: ROUTE',
    'expected_resources: []',
    '---',
    '',
    'Prompt: Route this request.',
    '',
  ].join('\n'));
}

function loadTyped(rootName) {
  const skillRoot = tempDir('root-matrix-loader-');
  writeScenario(skillRoot, rootName);
  const result = loader.loadPlaybookScenarios({ skillRoot });
  return { shape: result.shape, ids: result.scenarios.map((scenario) => scenario.scenarioId) };
}

function frontmatterClass(rootName) {
  const fixture = tempDir('root-matrix-frontmatter-');
  const skillRoot = path.join(fixture, 'skills', 'sample');
  const leaf = path.join(skillRoot, rootName, 'routing', 'route.md');
  fs.mkdirSync(path.dirname(leaf), { recursive: true });
  fs.writeFileSync(path.join(skillRoot, 'SKILL.md'), '---\nname: sample\nversion: 1.0.0.0\n---\n');
  fs.writeFileSync(leaf, '---\nversion: 1.0.0.0\n---\n');
  const pathsFile = path.join(fixture, 'paths.txt');
  const manifestBase = path.join(fixture, 'manifest');
  fs.writeFileSync(pathsFile, `${leaf}\n`);
  const result = spawnSync(process.execPath, [FRONTMATTER_PATH, 'compute', '--paths', pathsFile, '--skills-root', path.join(fixture, 'skills'), '--manifest-out', manifestBase], {
    cwd: REPO,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(fs.readFileSync(`${manifestBase}.json`, 'utf8'))[0].fileClass;
}

function run() {
  check('Lane C loads the canonical root and refuses the legacy underscore root', () => {
    assert.doesNotThrow(() => loadTyped('manual-testing-playbook'));
    const skillRoot = tempDir('root-matrix-legacy-');
    writeScenario(skillRoot, 'manual_testing_playbook');
    assert.throws(() => loader.loadPlaybookScenarios({ skillRoot }), { code: 'UNSUPPORTED_PLAYBOOK_ROOT' });
  });
  check('Lane C refuses a missing playbook root', () => {
    assert.throws(() => loader.loadPlaybookScenarios({ skillRoot: tempDir('root-matrix-missing-') }), { code: 'MISSING_PLAYBOOK_ROOT' });
  });
  check('Lane C refuses an unsupported playbook root', () => {
    const skillRoot = tempDir('root-matrix-unsupported-');
    fs.mkdirSync(path.join(skillRoot, 'manual_testing_playbook_v2'));
    assert.throws(() => loader.loadPlaybookScenarios({ skillRoot }), { code: 'UNSUPPORTED_PLAYBOOK_ROOT' });
  });
  check('Lane C refuses a legacy underscore root beside the canonical root', () => {
    const skillRoot = tempDir('root-matrix-coexist-');
    fs.mkdirSync(path.join(skillRoot, 'manual_testing_playbook'));
    fs.mkdirSync(path.join(skillRoot, 'manual-testing-playbook'));
    assert.throws(() => loader.loadPlaybookScenarios({ skillRoot }), { code: 'UNSUPPORTED_PLAYBOOK_ROOT' });
  });
  check('Lane C refuses an unsupported root index', () => {
    const skillRoot = tempDir('root-matrix-index-');
    const playbook = path.join(skillRoot, 'manual-testing-playbook');
    fs.mkdirSync(playbook);
    fs.writeFileSync(path.join(playbook, 'manual_testing_playbook_v2.md'), '# unsupported\n');
    assert.throws(() => loader.loadPlaybookScenarios({ skillRoot }), { code: 'UNSUPPORTED_PLAYBOOK_INDEX' });
  });
  check('Lane C generator refuses before staging', () => {
    const skillRoot = tempDir('root-matrix-generator-');
    fs.mkdirSync(path.join(skillRoot, 'manual-testing-playbook-next'));
    assert.throws(() => generator.analyzeCoverage(skillRoot), { code: 'UNSUPPORTED_PLAYBOOK_ROOT' });
  });
  check('post-edit router canonicalizes the hyphen root and rejects the underscore alias', () => {
    assert.equal(postRouter.canonicalSkillScopeSubtree('feature-catalog'), 'feature-catalog');
    assert.equal(postRouter.canonicalSkillScopeSubtree('manual-testing-playbook'), 'manual-testing-playbook');
    assert.equal(postRouter.canonicalSkillScopeSubtree('feature_catalog'), null);
    assert.equal(postRouter.canonicalSkillScopeSubtree('manual_testing_playbook'), null);
  });
  check('post-edit router returns null for an unsupported root', () => {
    assert.equal(postRouter.canonicalSkillScopeSubtree('feature_catalog_v2'), null);
  });
  check('leaf generator refuses an unsupported configured root before emission', () => {
    const skillRoot = tempDir('root-matrix-leaf-generator-');
    fs.writeFileSync(path.join(skillRoot, 'leaf-manifest.config.json'), JSON.stringify({ workflowMode: 'X', leafRoots: ['feature_catalog_v2'] }));
    assert.throws(() => leafGenerator.buildManifestBytes(skillRoot), { code: 'UNSUPPORTED_LEAF_ROOT' });
    assert.equal(fs.existsSync(path.join(skillRoot, 'leaf-manifest.json')), false);
  });
  check('leaf contract resolves the hyphen root and rejects the underscore alias', () => {
    assert.equal(leafContract.canonicalPackageRoot('feature-catalog'), 'feature-catalog');
    assert.equal(leafContract.canonicalPackageRoot('manual-testing-playbook'), 'manual-testing-playbook');
    assert.equal(leafContract.canonicalPackageRoot('feature_catalog'), null);
    assert.equal(leafContract.canonicalPackageRoot('manual_testing_playbook'), null);
  });
  check('leaf contract rejects unsupported roots and accepts Windows separators', () => {
    assert.equal(leafContract.canonicalPackageRoot('manual_testing-playbook'), null);
    assert.equal(leafContract.normalizeLeafResourceId('feature-catalog\\routing\\route.md'), 'feature-catalog/routing/route.md');
    assert.throws(() => leafContract.normalizeLeafResourceId('feature_catalog\\routing\\route.md'), { code: 'OUT_OF_ROOT' });
    assert.throws(() => leafContract.normalizeLeafResourceId('feature_catalog_v2/routing/route.md'), { code: 'OUT_OF_ROOT' });
  });
  check('topology boundary refuses an unsupported playbook root', () => {
    assert.throws(() => topology.assertPlaybookBoundary('/tmp/manual_testing_playbook_v2'), { code: 'UNSUPPORTED_PLAYBOOK_ROOT' });
  });
  check('topology auto-resolution fails closed on a legacy underscore sibling', () => {
    const skillRoot = tempDir('root-matrix-topo-coexist-');
    fs.mkdirSync(path.join(skillRoot, 'manual-testing-playbook'));
    fs.mkdirSync(path.join(skillRoot, 'manual_testing_playbook'));
    assert.throws(() => topology.resolvePlaybookBoundary(skillRoot), { code: 'UNSUPPORTED_PLAYBOOK_ROOT' });
  });
  check('topology boundary accepts both recognized roots', () => {
    assert.doesNotThrow(() => topology.assertPlaybookBoundary('/tmp/manual-testing-playbook'));
    assert.doesNotThrow(() => topology.assertPlaybookBoundary('/tmp/manual-testing-playbook'));
  });
  check('frontmatter engine classifies the canonical root', () => {
    assert.equal(frontmatterClass('feature-catalog'), 'feature-catalog');
  });
  check('frontmatter engine refuses an unsupported explicit root', () => {
    const fixture = tempDir('root-matrix-frontmatter-bad-');
    const leaf = path.join(fixture, 'skills', 'sample', 'feature_catalog_v2', 'routing', 'route.md');
    fs.mkdirSync(path.dirname(leaf), { recursive: true });
    fs.writeFileSync(leaf, '---\nversion: 1.0.0.0\n---\n');
    const pathsFile = path.join(fixture, 'paths.txt');
    fs.writeFileSync(pathsFile, `${leaf}\n`);
    const result = spawnSync(process.execPath, [FRONTMATTER_PATH, 'compute', '--paths', pathsFile, '--skills-root', path.join(fixture, 'skills')], { cwd: REPO, encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /unsupported catalog\/playbook root/);
  });
  check('contract drift classifies only the two registered forms', () => {
    assert.equal(drift.canonicalNonAuthorityPackageRoot('x/feature-catalog/a.md'), 'feature-catalog');
    assert.equal(drift.canonicalNonAuthorityPackageRoot('x\\feature-catalog\\a.md'), 'feature-catalog');
    assert.equal(drift.canonicalNonAuthorityPackageRoot('x/manual-testing-playbook/a.md'), 'manual-testing-playbook');
    assert.equal(drift.canonicalNonAuthorityPackageRoot('x/manual_testing-playbook/a.md'), null);
  });

  process.stdout.write(`JS_MATRIX_PASS=${passes}\n`);
  process.stdout.write('MATRIX_ROWS=2,3,4,6,7,8,9,14\n');
  return 0;
}

try {
  process.exitCode = run();
} catch (error) {
  process.stderr.write(`FAIL ${error.stack || error}\n`);
  process.exitCode = 1;
}
