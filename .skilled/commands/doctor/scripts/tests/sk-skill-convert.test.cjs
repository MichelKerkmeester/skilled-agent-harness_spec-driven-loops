'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const { test } = require('node:test');

const surface = require('../lib/sk-skill-surface.cjs');
const transforms = require('../lib/sk-skill-convert-transforms.cjs');
const convert = require('../sk-skill-convert.cjs');

const REPO_ROOT = surface.findRepoRoot(__dirname);
const PRE_MOVE_REF = 'ca10a236d2^';
const POST_MOVE_REF = 'ca10a236d2';
const FIXTURE_ROOT = path.join(__dirname, 'fixtures', 'sk-skill-convert');
const ROUTED_RESOURCES = [
  'assets/commit-message-template.md',
  'assets/pr-template.md',
  'assets/worktree-checklist.md',
  'references/commit-workflows.md',
  'references/finish-workflows.md',
  'references/github-mcp-integration.md',
  'references/gitkraken-mcp-integration.md',
  'references/quick-reference.md',
  'references/shared-patterns.md',
  'references/worktree-workflows.md',
];
const PLAIN_PHRASES = [
  'lantern sample review',
  'inspect lantern records',
  'compare field marks',
  'read observation notes',
  'choose lantern path',
  'review sample evidence',
  'verify record clarity',
  'route lantern requests',
];

function environment() {
  return { ...process.env, PYTHONDONTWRITEBYTECODE: '1', PYTHON: process.env.PYTHON || 'python3' };
}

function makeTempRoot(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sk-skill-convert-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

function fixtureSkillsDir(tempRoot) {
  return path.join(tempRoot, '.skilled', 'skills');
}

function makeContext(tempRoot) {
  return surface.createContext({
    repoRoot: REPO_ROOT,
    skillsDir: fixtureSkillsDir(tempRoot),
    cwd: REPO_ROOT,
    python: process.env.PYTHON || 'python3',
    env: environment(),
  });
}

function invokeArgs(tempRoot, args, contextOverride = null) {
  let stdout = '';
  let stderr = '';
  const exitCode = convert.runConvert(args, {
    context: contextOverride || makeContext(tempRoot),
    stdout: { write: (chunk) => { stdout += chunk; } },
    stderr: { write: (chunk) => { stderr += chunk; } },
  });
  return { exitCode, stdout, stderr };
}

function invoke(tempRoot, command, skillRoot, extra = [], contextOverride = null) {
  return invokeArgs(tempRoot, [command, skillRoot, ...extra], contextOverride);
}

function phraseArgs(phrases = PLAIN_PHRASES) {
  return phrases.flatMap((phrase) => ['--approved-phrase', phrase]);
}

function copyPlainSource(destination) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(path.join(FIXTURE_ROOT, 'plain', 'before'), destination, { recursive: true });
}

// A stand-in advisor that answers the scan and the reach probes, and logs every
// argv so a case can prove which child processes ran.
const CONVERT_ADVISOR_STUB = `'use strict';
const fs = require('node:fs');
const path = require('node:path');
const repoRoot = path.resolve(__dirname, '..', '..');
const argv = process.argv.slice(2);
fs.appendFileSync(path.join(repoRoot, 'advisor-calls.log'), JSON.stringify(argv) + '\\n');
if (argv[0] === 'skill_graph_scan') {
  process.stdout.write('scan complete\\n');
  process.exit(0);
}
if (argv[0] === 'advisor_recommend') {
  const prompt = JSON.parse(argv[2]).prompt;
  const scenario = JSON.parse(process.env.CONVERT_TEST_SCENARIO || '{}');
  process.stdout.write(JSON.stringify({
    data: {
      trustState: { state: 'live', generation: 3 },
      effectiveThresholds: { confidenceThreshold: 0.8 },
      recommendations: scenario[prompt] || [],
    },
  }));
  process.exit(0);
}
process.stderr.write('unexpected advisor command: ' + argv[0] + '\\n');
process.exit(2);
`;

// The real compiler writes beside itself and reads the skills root three levels
// up, so the stand-in derives both from its own path the same way.
const CONVERT_COMPILER_STUB = `#!/usr/bin/env python3
import glob
import json
import os
from datetime import datetime, timezone

here = os.path.dirname(os.path.realpath(__file__))
skills = os.path.abspath(os.path.join(here, '..', '..', '..'))
signals = {}
families = {}
for meta_path in sorted(glob.glob(os.path.join(skills, '*', 'graph-metadata.json'))):
    with open(meta_path, encoding='utf-8') as handle:
        data = json.load(handle)
    families.setdefault(data.get('family', 'system'), []).append(data['skill_id'])
    signals[data['skill_id']] = list(dict.fromkeys(data.get('intent_signals', [])))
graph = {
    'schema_version': 1,
    'generated_at': datetime.now(timezone.utc).isoformat(),
    'skill_count': len(signals),
    'families': families,
    'adjacency': {},
    'signals': signals,
    'conflicts': [],
    'hub_skills': [],
    'topology_warnings': {},
}
with open(os.path.join(here, 'skill-graph.json'), 'w', encoding='utf-8') as handle:
    json.dump(graph, handle)
print('Compiled skill-graph.json: %d skills' % len(signals))
`;

const CONVERT_HERMES_STUB = `'use strict';
const fs = require('node:fs');
const path = require('node:path');
const argv = process.argv.slice(2);
if (!argv.includes('--check')) {
  const output = process.env.HERMES_SKILLS_OUTPUT_DIR || path.join(process.cwd(), '.hermes', 'skills');
  fs.mkdirSync(output, { recursive: true });
}
process.stdout.write(argv.includes('--check') ? 'PASS: in sync\\n' : 'SYNCED\\n');
process.exit(0);
`;

// A conversion writes a skill root, a compiled graph, a Hermes copy and a
// changelog link, so a case that lets the integration rows run owns a whole
// temporary repository: the advisor, the compiler and the Hermes sync are
// stand-ins inside it, and nothing outside it is read as the repo root.
function makeIntegrationContext(tempRoot) {
  writeTree(tempRoot, {
    '.skilled/bin/skill-advisor.cjs': CONVERT_ADVISOR_STUB,
    '.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py': CONVERT_COMPILER_STUB,
    '.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs': CONVERT_HERMES_STUB,
  });
  fs.chmodSync(path.join(tempRoot, '.skilled', 'bin', 'skill-advisor.cjs'), 0o755);
  // The check's preflight resolves the shared package from the Hermes sync path,
  // so the temporary repository carries the same link its own runtime would.
  const sharedLink = path.join(
    tempRoot, '.skilled', 'skills', 'system-spec-kit', 'node_modules', '@spec-kit', 'shared',
  );
  fs.mkdirSync(path.dirname(sharedLink), { recursive: true });
  fs.symlinkSync(path.join(REPO_ROOT, '.skilled', 'skills', 'system-spec-kit', 'shared'), sharedLink, 'dir');
  const scripts = path.join(REPO_ROOT, '.skilled', 'skills', 'sk-doc', 'sk-create-skill', 'scripts');
  const scenario = {};
  for (const phrase of PLAIN_PHRASES) scenario[phrase] = [{ skillId: 'brindle-lantern', confidence: 0.95 }];
  return surface.createContext({
    repoRoot: tempRoot,
    skillsDir: fixtureSkillsDir(tempRoot),
    cwd: REPO_ROOT,
    python: process.env.PYTHON || 'python3',
    env: {
      ...environment(),
      CONVERT_TEST_SCENARIO: JSON.stringify(scenario),
      HERMES_SKILLS_OUTPUT_DIR: path.join(tempRoot, 'hermes-out'),
    },
    paths: {
      packageSkill: path.join(scripts, 'package_skill.py'),
      rootMetadata: path.join(scripts, 'ci-skill-root-metadata.cjs'),
      regenerateDerived: makeTemporaryDerivedGenerator(tempRoot),
      advisor: path.join(tempRoot, '.skilled', 'bin', 'skill-advisor.cjs'),
      skillGraphCompiler: path.join(
        tempRoot, '.skilled', 'skills', 'system-skill-advisor', 'runtime', 'scripts', 'skill_graph_compiler.py',
      ),
      skillGraphJson: path.join(
        tempRoot, '.skilled', 'skills', 'system-skill-advisor', 'runtime', 'scripts', 'skill-graph.json',
      ),
      hermesSync: path.join(
        tempRoot, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli', 'hermes', 'sync-skills-hermes.cjs',
      ),
      regressionCorpus: path.join(tempRoot, 'no-framework-corpus.jsonl'),
      resolver: path.join(
        REPO_ROOT, '.skilled', 'skills', 'sk-code', 'sk-code-skilled', 'assets', 'scripts', 'router-file-resolver.cjs',
      ),
      routerReplay: path.join(
        REPO_ROOT, '.skilled', 'skills', 'sk-code', 'sk-code-skilled', 'assets', 'scripts', 'router-replay-lib.cjs',
      ),
    },
  });
}

function makeTemporaryDerivedGenerator(tempRoot) {
  const directory = path.join(tempRoot, '.skilled', 'skills', 'sk-doc', 'sk-create-skill', 'scripts');
  fs.mkdirSync(directory, { recursive: true });
  const source = path.join(REPO_ROOT, '.skilled', 'skills', 'sk-doc', 'sk-create-skill', 'scripts', 'regenerate-skill-derived.cjs');
  const destination = path.join(directory, 'regenerate-skill-derived.cjs');
  fs.copyFileSync(source, destination);
  return destination;
}

function writeOldSkill(skillRoot, name = path.basename(skillRoot), extra = '', description = 'A short skill description.') {
  fs.mkdirSync(skillRoot, { recursive: true });
  const source = [
    '---',
    `name: ${name}`,
    `description: ${description}`,
    'allowed-tools: Read, Grep',
    '---',
    '',
    `# ${name}`,
    '',
    '## SMART ROUTING',
    '',
    'Use the route that matches the request.',
    '',
    '## MACHINE ROUTER',
    '',
    '```python',
    'INTENT_SIGNALS = {"PRIMARY": {"keywords": ["example"]}}',
    'RESOURCE_MAP = {"PRIMARY": ["references/guide.md"]}',
    'DEFAULT_RESOURCE = "references/guide.md"',
    '```',
    '',
    extra,
  ].join('\n');
  fs.writeFileSync(path.join(skillRoot, 'SKILL.md'), source);
  fs.mkdirSync(path.join(skillRoot, 'references'), { recursive: true });
  fs.writeFileSync(path.join(skillRoot, 'references', 'guide.md'), '# Guide\n');
  return source;
}

function writeRouterMdSkill(skillRoot, name = path.basename(skillRoot), options = {}) {
  const description = options.description || 'A short skill description.';
  const source = writeOldSkill(skillRoot, name, '', description);
  const allowedTools = options.allowedTools || 'allowed-tools: Read, Grep';
  const withFrontmatter = source.replace('allowed-tools: Read, Grep', allowedTools);
  const versioned = options.version
    ? withFrontmatter.replace(allowedTools, `version: ${options.version}\n${allowedTools}`)
    : withFrontmatter;
  const routerStart = versioned.indexOf('\n## MACHINE ROUTER\n');
  assert.notEqual(routerStart, -1);
  const skillText = `${versioned.slice(0, routerStart)}\n`;
  fs.writeFileSync(path.join(skillRoot, 'SKILL.md'), skillText);
  fs.writeFileSync(path.join(skillRoot, 'ROUTER.md'), [
    `# ${name} Router`,
    '',
    '## 3. MACHINE ROUTER',
    '',
    '```python',
    'INTENT_SIGNALS = {"PRIMARY": {"keywords": ["example"]}}',
    'RESOURCE_MAP = {"PRIMARY": ["references/guide.md"]}',
    'DEFAULT_RESOURCE = "references/guide.md"',
    '```',
    '',
  ].join('\n'));
  return skillText;
}

function copyPreMoveFixture(destination) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(path.join(FIXTURE_ROOT, 'source', 'sk-git'), destination, { recursive: true });
}

function hashTree(root) {
  const hash = crypto.createHash('sha256');
  const walk = (directory, relative = '') => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const absolute = path.join(directory, entry.name);
      const childRelative = path.join(relative, entry.name);
      if (entry.isDirectory() && !entry.isSymbolicLink()) {
        hash.update(`dir:${childRelative}\n`);
        walk(absolute, childRelative);
      } else if (entry.isSymbolicLink()) {
        hash.update(`link:${childRelative}:${fs.readlinkSync(absolute)}\n`);
      } else {
        hash.update(`file:${childRelative}\n`);
        hash.update(fs.readFileSync(absolute));
      }
    }
  };
  walk(root);
  return hash.digest('hex');
}

function semanticProjection(parsed) {
  return {
    intentSignals: parsed.intentSignals,
    resourceMap: parsed.resourceMap,
    defaultResource: parsed.defaultResource,
    defaultResourceSemantics: parsed.defaultResourceSemantics,
    parseable: parsed.parseable,
  };
}

function machineBody(text) {
  const match = /^##\s+(?:\d+\.\s+)?MACHINE ROUTER\s*\r?\n/m.exec(text);
  assert.ok(match, 'machine router heading exists');
  return text.slice(match.index + match[0].length);
}

function frontmatterLine(text, key) {
  const match = new RegExp(`^${key}:.*$`, 'm').exec(text);
  assert.ok(match, `${key} frontmatter line exists`);
  return match[0];
}

function invokeStrictPackageCheck(skillRoot) {
  const script = path.join(REPO_ROOT, '.skilled', 'skills', 'sk-doc', 'sk-create-skill', 'scripts', 'package_skill.py');
  return spawnSync(process.env.PYTHON || 'python3', [script, skillRoot, '--check', '--strict'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    env: environment(),
  });
}

function gitShow(reference, repositoryPath) {
  return execFileSync('git', [
    '-c', 'core.fsmonitor=false', 'show', `${reference}:${repositoryPath}`,
  ], { cwd: REPO_ROOT, env: environment(), encoding: 'utf8' });
}

function hasGitObject(reference) {
  const result = spawnSync('git', [
    '-c', 'core.fsmonitor=false', 'cat-file', '-e', reference,
  ], { cwd: REPO_ROOT, env: environment(), encoding: 'utf8' });
  return result.status === 0;
}

test('pure transforms preserve metadata, split tools at top-level commas, and move machine content intact', () => {
  const source = [
    '---',
    'name: example-skill',
    'description: "Two spaces  and punctuation: preserved."',
    'allowed-tools: Read, Bash(git status) # existing permissions',
    '---',
    '',
    '# Example Skill',
    '',
    '## SMART ROUTING',
    '',
    '```python',
    'INTENT_SIGNALS = {"SECONDARY": {"keywords": ["second"]}}',
    '```',
    '',
    '## MACHINE ROUTER',
    '',
    '```python',
    'INTENT_SIGNALS = {"PRIMARY": {"keywords": ["first"]}}',
    '```',
    '',
  ].join('\n');
  const template = [
    '---',
    'title: "{{SKILL_TITLE}} Router"',
    'description: "Sibling router for {{SKILL_NAME}}"',
    '---',
    '',
    '# {{SKILL_TITLE}} Router',
    '',
    '## 3. MACHINE ROUTER',
    '',
    'The machine router for {{SKILL_NAME}}.',
    '',
    '```python',
    'INTENT_SIGNALS = {"PLACEHOLDER": {}}',
    '```',
  ].join('\n');
  const normalized = transforms.normalizeSkillFrontmatter(source);
  assert.equal(frontmatterLine(normalized.text, 'name'), frontmatterLine(source, 'name'));
  assert.equal(frontmatterLine(normalized.text, 'description'), frontmatterLine(source, 'description'));
  assert.match(normalized.text, /^version: 1\.0\.0\.0$/m);
  assert.match(normalized.text, /^allowed-tools: # existing permissions$/m);
  assert.match(normalized.text, /^  - "Read"$/m);
  assert.match(normalized.text, /^  - "Bash\(git status\)"$/m);
  const existingVersion = transforms.normalizeSkillFrontmatter(source.replace(
    'allowed-tools:',
    'version: 2.4.6.8\nallowed-tools:',
  ));
  assert.match(existingVersion.text, /^version: 2\.4\.6\.8$/m);
  assert.equal((existingVersion.text.match(/^version:/gm) || []).length, 1);

  const nestedCommas = transforms.normalizeSkillFrontmatter(source.replace(
    'allowed-tools: Read, Bash(git status) # existing permissions',
    'allowed-tools: Read, Bash(git log, git show)',
  ));
  assert.match(nestedCommas.text, /^  - "Read"$/m);
  assert.match(nestedCommas.text, /^  - "Bash\(git log, git show\)"$/m);
  assert.throws(
    () => transforms.normalizeSkillFrontmatter(source.replace(
      'allowed-tools: Read, Bash(git status) # existing permissions',
      'allowed-tools: [Read, Bash(git log, git show]',
    )),
    { code: 'ALLOWED_TOOLS_AMBIGUOUS' },
  );

  const flowLine = 'allowed-tools: [Read, Bash]  # preserve spacing';
  const flowSource = source.replace(
    'allowed-tools: Read, Bash(git status) # existing permissions',
    flowLine,
  ).replace('name: example-skill', 'version: 1.2.3.4\nname: example-skill');
  const flowNormalized = transforms.normalizeSkillFrontmatter(flowSource);
  assert.equal(flowNormalized.text, flowSource);
  assert.equal(flowNormalized.allowedToolsChanged, false);

  const moved = transforms.moveLegacyRouter(normalized.text, template, 'example-skill');
  assert.equal((moved.skillMd.match(/\[ROUTER\.md\]\(\.\/ROUTER\.md\)/g) || []).length, 1);
  assert.ok(moved.routerMd.includes('INTENT_SIGNALS = {"SECONDARY": {"keywords": ["second"]}}'));
  assert.ok(moved.routerMd.includes('INTENT_SIGNALS = {"PRIMARY": {"keywords": ["first"]}}'));
  assert.ok(!moved.skillMd.includes('INTENT_SIGNALS = {"SECONDARY": {"keywords": ["second"]}}'));
  assert.ok(!/^## MACHINE ROUTER/m.test(moved.skillMd));
});

test('move removes a dangling trailing horizontal rule', () => {
  const source = [
    '---', 'name: rule-case', 'description: short', 'allowed-tools: Read', '---', '',
    '# Rule Case', '', '## SMART ROUTING', '', 'Route by intent.', '',
    '## MACHINE ROUTER', '', '```python',
    'INTENT_SIGNALS = {"PRIMARY": {"keywords": ["example"]}}', '```', '', '---', '',
  ].join('\n');
  const template = [
    '## MACHINE ROUTER', '', '```python', 'INTENT_SIGNALS = {}', '```',
  ].join('\n');
  const moved = transforms.moveLegacyRouter(source, template, 'rule-case');
  assert.doesNotMatch(moved.skillMd, /(?:\r?\n)[ \t]*---[ \t]*(?:\r?\n)*$/);
});

test('golden fixture conversion preserves routing bytes, passes strict validation, and is idempotent', (t) => {
  const tempRoot = makeTempRoot(t);
  const skillRoot = path.join(fixtureSkillsDir(tempRoot), 'sk-git');
  copyPreMoveFixture(skillRoot);
  const beforeSkill = fs.readFileSync(path.join(skillRoot, 'SKILL.md'), 'utf8');
  const expectedRouter = fs.readFileSync(path.join(FIXTURE_ROOT, 'expected', 'ROUTER.md'), 'utf8');
  const routerReplay = require(path.join(REPO_ROOT, '.skilled', 'skills', 'sk-code', 'sk-code-skilled', 'assets', 'scripts', 'router-replay-lib.cjs'));
  const beforeParse = routerReplay.parseRouter(null, skillRoot);

  const plan = invoke(tempRoot, 'plan', skillRoot);
  assert.equal(plan.exitCode, 0, plan.stderr);
  assert.match(plan.stdout, /Overwrite: .*SKILL\.md/);
  assert.match(plan.stdout, /Create: .*ROUTER\.md/);
  assert.match(plan.stdout, /\[TODO: Name the request signals/);
  assert.match(plan.stdout, /\[TODO: Write one bullet per/);
  assert.match(plan.stdout, /\[TODO: Keep this section and the machine block/);
  assert.match(plan.stdout, /pseudocode sit in the final `MACHINE ROUTER` section of this file/);
  assert.ok(!fs.existsSync(path.join(fixtureSkillsDir(tempRoot), '.state')));
  assert.equal(fs.readFileSync(path.join(skillRoot, 'SKILL.md'), 'utf8'), beforeSkill);
  assert.ok(!fs.existsSync(path.join(skillRoot, 'ROUTER.md')));

  const gatedApply = invoke(tempRoot, 'apply', skillRoot);
  assert.equal(gatedApply.exitCode, 0, gatedApply.stderr);
  assert.match(gatedApply.stdout, /Apply gate: no writes without --apply/);
  assert.equal(fs.readFileSync(path.join(skillRoot, 'SKILL.md'), 'utf8'), beforeSkill);
  assert.ok(!fs.existsSync(path.join(skillRoot, 'ROUTER.md')));

  const applied = invoke(tempRoot, 'apply', skillRoot, ['--apply']);
  assert.equal(applied.exitCode, 0, applied.stderr);
  assert.match(applied.stdout, /router semantics match the snapshot/i);
  assert.match(applied.stdout, /inline -> ROUTER\.md/);
  const afterSkill = fs.readFileSync(path.join(skillRoot, 'SKILL.md'), 'utf8');
  const routerMd = fs.readFileSync(path.join(skillRoot, 'ROUTER.md'), 'utf8');
  assert.equal(frontmatterLine(afterSkill, 'name'), frontmatterLine(beforeSkill, 'name'));
  assert.equal(frontmatterLine(afterSkill, 'description'), frontmatterLine(beforeSkill, 'description'));
  assert.equal(machineBody(routerMd), machineBody(expectedRouter));
  assert.equal(machineBody(routerMd).slice(-machineBody(beforeSkill).length), machineBody(beforeSkill));

  const afterParse = routerReplay.parseRouter(null, skillRoot);
  assert.deepEqual(routerReplay.parseRouter(beforeSkill), routerReplay.parseRouter(routerMd));
  assert.deepEqual(semanticProjection(afterParse), semanticProjection(beforeParse));
  assert.equal(beforeParse.routerSource, 'inline');
  assert.equal(afterParse.routerSource, 'ROUTER.md');

  const strict = invokeStrictPackageCheck(skillRoot);
  assert.equal(strict.status, 0, `${strict.stdout}\n${strict.stderr}`);
  assert.match(strict.stdout, /Result: PASS/);
  assert.doesNotMatch(`${strict.stdout}\n${strict.stderr}`, /RS-002|RS-004|RS-005/);

  const stateRoot = path.join(fixtureSkillsDir(tempRoot), '.state', 'doctor-sk-skill', 'sk-git');
  const backupDirs = fs.readdirSync(stateRoot);
  assert.equal(backupDirs.length, 1);
  const backupRoot = path.join(stateRoot, backupDirs[0]);
  assert.equal(fs.readFileSync(path.join(backupRoot, 'SKILL.md'), 'utf8'), beforeSkill);
  assert.deepEqual(fs.readdirSync(path.join(backupRoot, 'before')).sort(), ['SKILL.md']);

  const beforeSecondApply = hashTree(fixtureSkillsDir(tempRoot));
  const second = invoke(tempRoot, 'apply', skillRoot, ['--apply']);
  assert.equal(second.exitCode, 0, second.stderr);
  assert.match(second.stdout, /Writes: none/);
  assert.equal(hashTree(fixtureSkillsDir(tempRoot)), beforeSecondApply);
});

test('fixture source matches the available pre-move Git tree and expected router matches the post-move file', (t) => {
  if (!hasGitObject(PRE_MOVE_REF)) {
    t.skip(`Git history object ${PRE_MOVE_REF} is unavailable in this shallow checkout.`);
    return;
  }
  const fixtureSkillRoot = path.join(FIXTURE_ROOT, 'source', 'sk-git');
  assert.equal(
    fs.readFileSync(path.join(fixtureSkillRoot, 'SKILL.md'), 'utf8'),
    gitShow(PRE_MOVE_REF, '.skilled/skills/sk-git/SKILL.md'),
  );
  for (const resource of ROUTED_RESOURCES) {
    assert.equal(
      fs.readFileSync(path.join(fixtureSkillRoot, resource), 'utf8'),
      gitShow(PRE_MOVE_REF, `.skilled/skills/sk-git/${resource}`),
      resource,
    );
  }
  assert.equal(
    fs.readFileSync(path.join(FIXTURE_ROOT, 'expected', 'ROUTER.md'), 'utf8'),
    gitShow(POST_MOVE_REF, '.skilled/skills/sk-git/ROUTER.md'),
  );
});

test('four-part versions add no plan step and shorter versions show the padded value', (t) => {
  const tempRoot = makeTempRoot(t);
  const shortRoot = path.join(fixtureSkillsDir(tempRoot), 'short-version');
  writeRouterMdSkill(shortRoot, 'short-version', { version: '1.2' });
  const shortPlan = invoke(tempRoot, 'plan', shortRoot);
  assert.equal(shortPlan.exitCode, 0, shortPlan.stderr);
  assert.match(shortPlan.stdout, /Pad version 1\.2 to 1\.2\.0\.0\./);

  const fullRoot = path.join(fixtureSkillsDir(tempRoot), 'full-version');
  writeRouterMdSkill(fullRoot, 'full-version', { version: '1.2.3.4', allowedTools: 'allowed-tools: [Read, Bash]' });
  const fullPlan = invoke(tempRoot, 'plan', fullRoot);
  assert.equal(fullPlan.exitCode, 0, fullPlan.stderr);
  assert.doesNotMatch(fullPlan.stdout, /\b(?:Pad|Add) version\b/i);
  assert.match(fullPlan.stdout, /Writes: none/);
});

test('an existing ROUTER.md still receives frontmatter normalization without a second router', (t) => {
  const tempRoot = makeTempRoot(t);
  const skillRoot = path.join(fixtureSkillsDir(tempRoot), 'router-already-moved');
  const original = writeRouterMdSkill(skillRoot);
  const routerFile = path.join(skillRoot, 'ROUTER.md');
  const originalRouter = fs.readFileSync(routerFile, 'utf8');

  const plan = invoke(tempRoot, 'plan', skillRoot);
  assert.equal(plan.exitCode, 0, plan.stderr);
  assert.match(plan.stdout, /Add version: 1\.0\.0\.0\./);
  assert.doesNotMatch(plan.stdout, /Create: .*ROUTER\.md/);
  assert.equal(fs.readFileSync(path.join(skillRoot, 'SKILL.md'), 'utf8'), original);

  const applied = invoke(tempRoot, 'apply', skillRoot, ['--apply']);
  assert.equal(applied.exitCode, 0, applied.stderr);
  assert.match(fs.readFileSync(path.join(skillRoot, 'SKILL.md'), 'utf8'), /^version: 1\.0\.0\.0$/m);
  assert.equal(fs.readFileSync(routerFile, 'utf8'), originalRouter);
  const before = path.join(fixtureSkillsDir(tempRoot), '.state', 'doctor-sk-skill', 'router-already-moved');
  const backupDirectory = path.join(before, fs.readdirSync(before)[0]);
  assert.deepEqual(fs.readdirSync(path.join(backupDirectory, 'before')).sort(), ['ROUTER.md', 'SKILL.md']);
});

test('apply never replaces an existing ROUTER.md without a router declaration', (t) => {
  const tempRoot = makeTempRoot(t);
  const skillRoot = path.join(fixtureSkillsDir(tempRoot), 'no-replace');
  writeOldSkill(skillRoot);
  const routerFile = path.join(skillRoot, 'ROUTER.md');
  const sentinel = '# reviewed router file\n';
  fs.writeFileSync(routerFile, sentinel);
  const result = invoke(tempRoot, 'apply', skillRoot, ['--apply']);
  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /ROUTER\.md already exists/);
  assert.equal(fs.readFileSync(routerFile, 'utf8'), sentinel);
  assert.ok(!fs.existsSync(path.join(fixtureSkillsDir(tempRoot), '.state')));
});

test('a failed parser proof restores SKILL.md and removes the newly created router', (t) => {
  const tempRoot = makeTempRoot(t);
  const skillRoot = path.join(fixtureSkillsDir(tempRoot), 'rollback-proof');
  const original = writeOldSkill(skillRoot);
  const context = makeContext(tempRoot);
  const parseRouter = require(context.paths.routerReplay).parseRouter;
  context.routerParser = (skillMdText, root) => {
    const parsed = parseRouter(skillMdText, root);
    if (typeof root === 'string' && path.basename(root) !== 'before') return { ...parsed, resourceMap: { FORCED: [] } };
    return parsed;
  };

  const result = invoke(tempRoot, 'apply', skillRoot, ['--apply'], context);
  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /ROUTER_SEMANTICS_CHANGED/);
  assert.equal(fs.readFileSync(path.join(skillRoot, 'SKILL.md'), 'utf8'), original);
  assert.ok(!fs.existsSync(path.join(skillRoot, 'ROUTER.md')));
  const backupRoot = path.join(fixtureSkillsDir(tempRoot), '.state', 'doctor-sk-skill', 'rollback-proof');
  const backupDirs = fs.readdirSync(backupRoot);
  assert.equal(backupDirs.length, 1);
  assert.equal(fs.readFileSync(path.join(backupRoot, backupDirs[0], 'SKILL.md'), 'utf8'), original);
});

test('ROUTER_CONTENT_CHANGED removes a newly created backup when apply wrote nothing', (t) => {
  const tempRoot = makeTempRoot(t);
  const skillRoot = path.join(fixtureSkillsDir(tempRoot), 'content-changed');
  const originalSkill = writeRouterMdSkill(skillRoot);
  const originalRouter = fs.readFileSync(path.join(skillRoot, 'ROUTER.md'), 'utf8');
  const context = makeContext(tempRoot);
  const plan = convert.buildPlan(skillRoot, context);
  const parseRouter = require(context.paths.routerReplay).parseRouter;
  context.routerParser = (skillMdText, root) => {
    const parsed = parseRouter(skillMdText, root);
    if (skillMdText === plan.nextSkill) return { ...parsed, resourceMap: { CHANGED: [] } };
    return parsed;
  };

  assert.throws(() => convert.applyPlan(plan, context), { code: 'ROUTER_CONTENT_CHANGED' });
  const backupBase = path.join(fixtureSkillsDir(tempRoot), '.state', 'doctor-sk-skill', 'content-changed');
  assert.equal(fs.existsSync(backupBase), false);
  assert.equal(fs.readFileSync(path.join(skillRoot, 'SKILL.md'), 'utf8'), originalSkill);
  assert.equal(fs.readFileSync(path.join(skillRoot, 'ROUTER.md'), 'utf8'), originalRouter);
});

test('a pre-write router creation failure removes its empty backup', (t) => {
  const tempRoot = makeTempRoot(t);
  const skillRoot = path.join(fixtureSkillsDir(tempRoot), 'write-failure');
  const original = writeOldSkill(skillRoot);
  const context = makeContext(tempRoot);
  const plan = convert.buildPlan(skillRoot, context);
  const fileSystem = Object.create(context.fs);
  fileSystem.openSync = () => {
    const error = new Error('blocked router create');
    error.code = 'EACCES';
    throw error;
  };
  context.fs = fileSystem;

  assert.throws(() => convert.applyPlan(plan, context), { code: 'APPLY_FAILED' });
  const backupBase = path.join(fixtureSkillsDir(tempRoot), '.state', 'doctor-sk-skill', 'write-failure');
  assert.equal(fs.existsSync(backupBase), false);
  assert.equal(fs.readFileSync(path.join(skillRoot, 'SKILL.md'), 'utf8'), original);
  assert.equal(fs.existsSync(path.join(skillRoot, 'ROUTER.md')), false);
});

test('each preflight refusal has a distinct code and hub-router.json is sufficient on its own', (t) => {
  const tempRoot = makeTempRoot(t);
  const skillsDir = fixtureSkillsDir(tempRoot);
  const cases = [];

  const dual = path.join(skillsDir, 'dual');
  writeOldSkill(dual);
  fs.writeFileSync(path.join(dual, 'ROUTER.md'), [
    '## 3. MACHINE ROUTER', '',
    'INTENT_SIGNALS = {"PRIMARY": {"keywords": ["conflict"]}}',
    'RESOURCE_MAP = {"PRIMARY": ["references/guide.md"]}',
  ].join('\n'));
  cases.push({ root: dual, code: 'DUAL_DECLARATION' });

  for (const [name, declaration] of [['only-mode-registry', 'mode-registry.json'], ['only-hub-router', 'hub-router.json']]) {
    const root = path.join(skillsDir, name);
    writeOldSkill(root);
    fs.writeFileSync(path.join(root, declaration), '{}\n');
    cases.push({ root, code: 'HUB_DECLARATION' });
  }

  const nested = path.join(skillsDir, 'nested-hub');
  writeOldSkill(nested);
  writeOldSkill(path.join(nested, 'child'), 'child');
  cases.push({ root: nested, code: 'NESTED_PACKETS' });

  const local = path.join(skillsDir, 'local-private');
  writeOldSkill(local, 'local-private');
  cases.push({ root: local, code: 'RESERVED_PREFIX', privatePath: true });

  const persona = path.join(skillsDir, 'agent-persona');
  writeOldSkill(persona, 'agent-persona');
  cases.push({ root: persona, code: 'PERSONA_PREFIX' });

  const collision = path.join(skillsDir, 'collision-source');
  writeOldSkill(collision, 'shared-name');
  writeOldSkill(path.join(skillsDir, 'another-root'), 'shared-name');
  cases.push({ root: collision, code: 'NAME_COLLISION' });

  const description = path.join(skillsDir, 'long-description');
  writeRouterMdSkill(description, 'long-description', { description: 'd'.repeat(131) });
  cases.push({ root: description, code: 'DESCRIPTION_TOO_LONG' });

  const badKebab = path.join(skillsDir, 'bad_name');
  writeOldSkill(badKebab, 'bad_name');
  cases.push({ root: badKebab, code: 'NAME_NOT_KEBAB' });

  for (const item of cases) {
    const before = hashTree(skillsDir);
    const context = makeContext(tempRoot);
    let reads = 0;
    if (item.privatePath) {
      const fileSystem = Object.create(context.fs);
      fileSystem.readFileSync = (...args) => {
        reads += 1;
        return fs.readFileSync(...args);
      };
      context.fs = fileSystem;
    }
    const result = invoke(tempRoot, 'plan', item.root, [], context);
    assert.equal(result.exitCode, 1, result.stderr);
    assert.match(result.stderr, new RegExp(`^${item.code}:`));
    if (item.privatePath) assert.equal(reads, 0);
    assert.equal(hashTree(skillsDir), before);
  }
});

test('the nested-packet walk finds packets under local, benchmark, fixture, scratch, and symlink directories', (t) => {
  const tempRoot = makeTempRoot(t);
  const skillsDir = fixtureSkillsDir(tempRoot);
  const nestedFolders = ['local-example', 'benchmark', 'fixtures', 'scratch'];
  const cases = [];
  for (const folder of nestedFolders) {
    const root = path.join(skillsDir, `nested-${folder.replace(/[^a-z]+/g, '-')}`);
    writeOldSkill(root);
    writeOldSkill(path.join(root, folder, 'child'), 'child');
    cases.push(root);
  }

  const symlinkRoot = path.join(skillsDir, 'nested-symlink');
  writeOldSkill(symlinkRoot);
  const target = path.join(tempRoot, 'symlink-target');
  writeOldSkill(path.join(target, 'child'), 'child');
  fs.symlinkSync(target, path.join(symlinkRoot, 'linked'), 'dir');
  cases.push(symlinkRoot);

  for (const root of cases) {
    const result = invoke(tempRoot, 'plan', root);
    assert.equal(result.exitCode, 1, result.stderr);
    assert.match(result.stderr, /^NESTED_PACKETS:/);
  }

  const ignoredRoot = path.join(skillsDir, 'nested-skip-directories');
  writeOldSkill(ignoredRoot);
  writeOldSkill(path.join(ignoredRoot, '.git', 'embedded'), 'embedded');
  writeOldSkill(path.join(ignoredRoot, 'node_modules', 'embedded'), 'embedded');
  const ignoredResult = invoke(tempRoot, 'plan', ignoredRoot);
  assert.doesNotMatch(ignoredResult.stderr, /^NESTED_PACKETS:/);
});

test('transform refusal codes survive plan handling and missing prerequisites retain exit code 2', (t) => {
  const tempRoot = makeTempRoot(t);
  const ambiguous = path.join(fixtureSkillsDir(tempRoot), 'ambiguous-tools');
  writeRouterMdSkill(ambiguous, 'ambiguous-tools', { allowedTools: 'allowed-tools: Read, Bash(git log, git show' });
  const refusal = invoke(tempRoot, 'plan', ambiguous);
  assert.equal(refusal.exitCode, 1);
  assert.match(refusal.stderr, /^ALLOWED_TOOLS_AMBIGUOUS:/);

  const missingResolverRoot = path.join(fixtureSkillsDir(tempRoot), 'missing-resolver');
  writeOldSkill(missingResolverRoot);
  const context = makeContext(tempRoot);
  context.paths.resolver = path.join(tempRoot, 'missing-resolver.cjs');
  const missing = invoke(tempRoot, 'plan', missingResolverRoot, [], context);
  assert.equal(missing.exitCode, 2);
  assert.match(missing.stderr, /^ROUTER_RESOLVER_MISSING:/);
});

test('plain resource transforms harvest links in order, add metadata, and rewrite kebab paths', () => {
  const body = [
    '---', 'name: sample-skill', 'description: short', '---', '',
    'Read [Field Notes](<references/Field Notes.md>) first.',
    'Then [Second Guide](references/Second_Guide.md).',
  ].join('\n');
  assert.deepEqual(transforms.harvestReferenceLinks(body), [
    'references/Field Notes.md',
    'references/Second_Guide.md',
  ]);
  const renames = transforms.resourceRenameMap([
    'references/Field Notes.md',
    'references/Second_Guide.md',
  ]);
  assert.deepEqual([...renames], [
    ['references/Field Notes.md', 'references/field-notes.md'],
    ['references/Second_Guide.md', 'references/second-guide.md'],
  ]);
  const rewritten = transforms.rewriteResourceLinks(body, renames);
  assert.match(rewritten, /references\/field-notes\.md/);
  assert.match(rewritten, /references\/second-guide\.md/);
  const resource = transforms.addResourceFrontmatter('# Field Notes\nA useful field note.\n', 'references/field-notes.md', PLAIN_PHRASES);
  assert.match(resource, /^title: "Field Notes"$/m);
  assert.match(resource, /^description: "A useful field note\."$/m);
  assert.match(resource, /^contextType: reference$/m);
  assert.match(resource, /^version: 1\.0\.0\.0$/m);
});

test('plain plan proposes permission tools and refuses fewer than eight approved phrases', (t) => {
  const tempRoot = makeTempRoot(t);
  const sourceRoot = path.join(FIXTURE_ROOT, 'plain', 'before');
  const seven = invokeArgs(tempRoot, [
    'plan', sourceRoot,
    ...phraseArgs(PLAIN_PHRASES.slice(0, 7)),
  ]);
  assert.equal(seven.exitCode, 1);
  assert.match(seven.stderr, /^INTENT_SIGNALS_BELOW_FLOOR:/);
  assert.match(seven.stderr, /Suggested phrases:/);
  t.diagnostic(`7 approved phrases plan exit ${seven.exitCode}: ${seven.stderr.trim()}`);

  const plan = invokeArgs(tempRoot, ['plan', sourceRoot, ...phraseArgs()]);
  assert.equal(plan.exitCode, 0, plan.stderr);
  assert.match(plan.stdout, /approval required; propose \["Read","Grep","Glob"\]/);
  assert.match(plan.stdout, /RESOURCE_MAP order: \["references\/field-notes\.md"\]/);
  assert.match(plan.stdout, /--allowed-tool values/);
  assert.ok(!plan.stdout.includes('allowed-tools: ["Read","Grep","Glob"]\n'));

  const unapprovedApply = invokeArgs(tempRoot, [
    'apply', sourceRoot,
    ...phraseArgs(),
    '--agent-output', path.join(FIXTURE_ROOT, 'plain', 'after'),
    '--apply',
  ]);
  assert.equal(unapprovedApply.exitCode, 1);
  assert.match(unapprovedApply.stderr, /^ALLOWED_TOOLS_APPROVAL_REQUIRED:/);
  assert.ok(!fs.existsSync(path.join(fixtureSkillsDir(tempRoot), 'brindle-lantern')));

  const sourceWithScripts = path.join(tempRoot, 'outside-with-scripts');
  copyPlainSource(sourceWithScripts);
  fs.mkdirSync(path.join(sourceWithScripts, 'scripts'), { recursive: true });
  fs.writeFileSync(path.join(sourceWithScripts, 'scripts', 'inspect.js'), 'module.exports = true;\n');
  const scriptsPlan = invokeArgs(tempRoot, ['plan', sourceWithScripts, ...phraseArgs()]);
  assert.equal(scriptsPlan.exitCode, 0, scriptsPlan.stderr);
  assert.match(scriptsPlan.stdout, /propose \["Read","Grep","Glob","Bash"\]/);
});

test('plain apply stages a copy, preserves the source, generates metadata, and passes the strict gates', (t) => {
  const tempRoot = makeTempRoot(t);
  const sourceRoot = path.join(tempRoot, 'plain-source');
  copyPlainSource(sourceRoot);
  fs.mkdirSync(path.join(sourceRoot, 'manual-testing-playbook'), { recursive: true });
  fs.writeFileSync(path.join(sourceRoot, 'manual-testing-playbook', 'operator-note.txt'), 'keep this source file\n');
  const sourceBefore = hashTree(sourceRoot);
  const afterSkill = path.join(FIXTURE_ROOT, 'plain', 'after');
  const context = makeIntegrationContext(tempRoot);
  let scaffoldTempParent = null;
  const originalRunCommand = context.runCommand;
  context.runCommand = (command, args, options) => {
    const pathIndex = args.indexOf('--path');
    if (args.some((argument) => path.basename(argument) === 'init_skill.py') && pathIndex !== -1) {
      scaffoldTempParent = args[pathIndex + 1];
    }
    return originalRunCommand(command, args, options);
  };
  const decisions = [
    ...phraseArgs(),
    '--allowed-tool', 'Read',
    '--allowed-tool', 'Grep',
    '--allowed-tool', 'Glob',
    '--agent-output', afterSkill,
  ];
  const plan = invokeArgs(tempRoot, ['plan', sourceRoot, ...decisions], context);
  assert.equal(plan.exitCode, 0, plan.stderr);
  assert.match(plan.stdout, /Rename references\/Field Notes\.md to references\/field-notes\.md/);
  assert.match(plan.stdout, /Copy: .*plain-source -> .*brindle-lantern/);
  assert.match(plan.stdout, /allowed-tools: \["Read","Grep","Glob"\]/);
  assert.match(plan.stdout, /Integration plan: brindle-lantern/);
  assert.match(plan.stdout, /I6 changelog: Create .*changelog\/v1\.0\.0\.0\.md/);
  assert.ok(!fs.existsSync(path.join(fixtureSkillsDir(tempRoot), 'brindle-lantern')));

  const applied = invokeArgs(tempRoot, ['apply', sourceRoot, ...decisions, '--apply'], context);
  assert.equal(applied.exitCode, 0, `${applied.stdout}\n${applied.stderr}`);
  assert.match(applied.stdout, /preservation and the format gates passed/i);
  assert.match(applied.stdout, /Result: PASS/);
  // The command log the result prints is the proof both later steps really ran.
  assert.match(applied.stdout, /ci-skill-root-metadata\.cjs --fix .*\(exit 0\)/);
  assert.match(applied.stdout, /validate_skill_package\.py .*\(exit 0\)/);
  // Each integration row reports its own result beside the writes it recorded.
  for (const id of ['I1', 'I2', 'I3', 'I4', 'I5', 'I6']) {
    assert.match(applied.stdout, new RegExp(`^${id} `, 'm'), `the result omits row ${id}`);
  }
  assert.match(applied.stdout, /I1 advisor discovery: scanned/);
  assert.match(applied.stdout, /I2 compiled skill graph: recompiled/);
  assert.match(applied.stdout, /I5 runtime mirrors: Hermes synced and checked/);
  assert.equal(hashTree(sourceRoot), sourceBefore);
  assert.ok(scaffoldTempParent);
  assert.ok(!fs.existsSync(scaffoldTempParent));

  const skillRoot = path.join(fixtureSkillsDir(tempRoot), 'brindle-lantern');
  assert.ok(fs.existsSync(path.join(skillRoot, 'SKILL.md')));
  assert.ok(fs.existsSync(path.join(skillRoot, 'ROUTER.md')));
  assert.ok(fs.existsSync(path.join(skillRoot, 'references', 'field-notes.md')));
  assert.equal(
    fs.readFileSync(path.join(skillRoot, 'manual-testing-playbook', 'operator-note.txt'), 'utf8'),
    'keep this source file\n',
  );
  assert.ok(!fs.existsSync(path.join(skillRoot, 'references', 'Field Notes.md')));
  assert.match(fs.readFileSync(path.join(skillRoot, 'SKILL.md'), 'utf8'), /references\/field-notes\.md/);
  assert.match(fs.readFileSync(path.join(skillRoot, 'SKILL.md'), 'utf8'), /^allowed-tools:\n  - "Read"$/m);
  const router = fs.readFileSync(path.join(skillRoot, 'ROUTER.md'), 'utf8');
  assert.match(router, /"PRIMARY": \{"weight": 4, "keywords": \[/);
  assert.ok(router.indexOf('lantern sample review') < router.indexOf('route lantern requests'));
  assert.match(router, /"references\/field-notes\.md"/);

  // A converted root ends reachable: the compiled graph is current, the Hermes
  // copy is in sync and the changelog index resolves to the skill's own folder.
  const freshness = spawnSync(process.execPath, [
    path.join(REPO_ROOT, '.skilled', 'commands', 'doctor', 'scripts', 'skill-graph-freshness.cjs'), '--strict',
  ], {
    cwd: tempRoot,
    encoding: 'utf8',
    env: {
      ...environment(),
      SKILL_GRAPH_FRESHNESS_ROOT: tempRoot,
      SYSTEM_SKILL_ADVISOR_DB_DIR: path.join(tempRoot, 'no-database'),
    },
  });
  assert.equal(freshness.status, 0, `${freshness.stdout}\n${freshness.stderr}`);
  assert.match(freshness.stdout, /STALE COMPILED: none/);
  t.diagnostic(`skill-graph-freshness.cjs --strict exit ${freshness.status}: ${freshness.stdout.trim()}`);

  const hermesCheck = spawnSync(process.execPath, [
    path.join(tempRoot, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli', 'hermes', 'sync-skills-hermes.cjs'),
    '--check',
  ], { cwd: tempRoot, encoding: 'utf8', env: environment() });
  assert.equal(hermesCheck.status, 0, `${hermesCheck.stdout}\n${hermesCheck.stderr}`);
  assert.match(hermesCheck.stdout, /PASS: in sync/);
  t.diagnostic(`sync-skills-hermes.cjs --check exit ${hermesCheck.status}: ${hermesCheck.stdout.trim()}`);

  const changelogIndex = path.join(tempRoot, '.skilled', 'changelog', 'brindle-lantern');
  assert.equal(fs.readlinkSync(changelogIndex), '../skills/brindle-lantern/changelog');
  assert.ok(fs.statSync(changelogIndex).isDirectory());
  assert.ok(fs.existsSync(path.join(changelogIndex, 'v1.0.0.0.md')));
  t.diagnostic(`readlink .skilled/changelog/brindle-lantern: ${fs.readlinkSync(changelogIndex)}`);

  const scriptsRoot = path.join(REPO_ROOT, '.skilled', 'skills', 'sk-doc', 'sk-create-skill', 'scripts');
  const strict = spawnSync(process.env.PYTHON || 'python3', [
    path.join(scriptsRoot, 'package_skill.py'), skillRoot, '--check', '--strict',
  ], { cwd: REPO_ROOT, encoding: 'utf8', env: environment() });
  assert.equal(strict.status, 0, `${strict.stdout}\n${strict.stderr}`);
  assert.match(strict.stdout, /Result: PASS/);
  t.diagnostic(`package_skill.py --check --strict exit ${strict.status}: ${strict.stdout.trim()}`);

  const rootMetadata = spawnSync('node', [
    path.join(scriptsRoot, 'ci-skill-root-metadata.cjs'),
    '--skills-dir', fixtureSkillsDir(tempRoot),
    '--skill', 'brindle-lantern',
  ], { cwd: tempRoot, encoding: 'utf8', env: environment() });
  assert.equal(rootMetadata.status, 0, `${rootMetadata.stdout}\n${rootMetadata.stderr}`);
  t.diagnostic(`ci-skill-root-metadata.cjs --skill brindle-lantern exit ${rootMetadata.status}: ${rootMetadata.stdout.trim()}`);

  // The undo list names every write the integration rows recorded: the staged
  // root and the folders this run created are removed, and no line asks version
  // control to restore a path that was never tracked here.
  assert.match(applied.stdout, /^Undo:$/m);
  assert.ok(applied.stdout.includes(`  rm "${changelogIndex}"`), applied.stdout);
  assert.ok(applied.stdout.includes(`  rm "${context.paths.skillGraphJson}"`), applied.stdout);
  assert.ok(applied.stdout.includes(`  rm -r "${skillRoot}"`), applied.stdout);
  assert.ok(applied.stdout.includes(`  rm -r "${path.join(tempRoot, 'hermes-out')}"`), applied.stdout);
  assert.ok(!/git -c core\.fsmonitor=false restore/.test(applied.stdout), applied.stdout);

  const snapshot = applied.stdout.match(/^Snapshot: (.+)$/m);
  assert.ok(snapshot, applied.stdout);
  const preserveContext = { ...context, cwd: skillRoot };
  const preserved = invokeArgs(tempRoot, [
    'preserve', '--snapshot', snapshot[1],
  ], preserveContext);
  assert.equal(preserved.exitCode, 0, preserved.stderr);
  assert.match(preserved.stdout, /Preservation PASS/);
  t.diagnostic(`preserve --snapshot exit ${preserved.exitCode}: ${preserved.stdout.trim()}`);
});

test('plain staging refuses an existing target without changing either folder', (t) => {
  const tempRoot = makeTempRoot(t);
  const sourceRoot = path.join(FIXTURE_ROOT, 'plain', 'before');
  const sourceBefore = hashTree(sourceRoot);
  const targetRoot = path.join(fixtureSkillsDir(tempRoot), 'brindle-lantern');
  fs.mkdirSync(targetRoot, { recursive: true });
  const sentinel = path.join(targetRoot, 'reviewed.txt');
  fs.writeFileSync(sentinel, 'keep existing target\n');
  const result = invokeArgs(tempRoot, ['apply', sourceRoot, ...phraseArgs(), '--apply']);
  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /^TARGET_EXISTS:/);
  assert.equal(fs.readFileSync(sentinel, 'utf8'), 'keep existing target\n');
  assert.equal(hashTree(sourceRoot), sourceBefore);
});

test('a failing strict package check stops before the second package validator', (t) => {
  const tempRoot = makeTempRoot(t);
  const sourceRoot = path.join(FIXTURE_ROOT, 'plain', 'before');
  const invalidAgentRoot = path.join(tempRoot, 'invalid-agent-output');
  fs.cpSync(path.join(FIXTURE_ROOT, 'plain', 'after'), invalidAgentRoot, { recursive: true });
  const invalidSkill = path.join(invalidAgentRoot, 'SKILL.md');
  fs.writeFileSync(
    invalidSkill,
    fs.readFileSync(invalidSkill, 'utf8').replace(/^## RULES\s*$/m, ''),
  );
  const context = makeContext(tempRoot);
  context.paths.regenerateDerived = makeTemporaryDerivedGenerator(tempRoot);
  const invokedCommands = [];
  const originalRunCommand = context.runCommand;
  context.runCommand = (command, args, options) => {
    invokedCommands.push({ command, args });
    return originalRunCommand(command, args, options);
  };
  const result = invokeArgs(tempRoot, [
    'apply', sourceRoot,
    ...phraseArgs(),
    '--allowed-tool', 'Read',
    '--allowed-tool', 'Grep',
    '--allowed-tool', 'Glob',
    '--agent-output', invalidAgentRoot,
    '--apply',
  ], context);
  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /^STRICT_PACKAGE_FAILED:/);
  const validateScript = path.join(REPO_ROOT, '.skilled', 'skills', 'sk-doc', 'sk-create-skill', 'scripts', 'validate_skill_package.py');
  assert.ok(!invokedCommands.some((entry) => entry.args.includes(validateScript)));
  // A format gate that fails never reaches the integration rows: no scan, no
  // compile and no Hermes sync is spawned by the run.
  const integrationSpawns = invokedCommands.filter((entry) => (
    /skill-advisor\.cjs|skill_graph_compiler\.py|sync-skills-hermes\.cjs/.test([entry.command, ...entry.args].join(' '))
  ));
  assert.deepEqual(integrationSpawns, []);
});

test('plain conversion and preserve stop at a dropped source body line', (t) => {
  const tempRoot = makeTempRoot(t);
  const sourceRoot = path.join(FIXTURE_ROOT, 'plain', 'before');
  const sourceBefore = hashTree(sourceRoot);
  const decisions = [
    ...phraseArgs(),
    '--allowed-tool', 'Read',
    '--allowed-tool', 'Grep',
    '--allowed-tool', 'Glob',
    '--agent-output', path.join(FIXTURE_ROOT, 'plain', 'dropped', 'SKILL.md'),
  ];
  const context = makeContext(tempRoot);
  const invokedCommands = [];
  const originalRunCommand = context.runCommand;
  context.runCommand = (command, args, options) => {
    invokedCommands.push({ command, args });
    return originalRunCommand(command, args, options);
  };
  const result = invokeArgs(tempRoot, ['apply', sourceRoot, ...decisions, '--apply'], context);
  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /^PRESERVATION_FAILED:/);
  assert.match(result.stderr, /Read the field notes before choosing a review path/);
  // The check stops at the preservation proof, so nothing after it writes: no scaffolder, no
  // generator and no post-strict validator ever runs. The read-only preflight
  // probes on the source are expected and stay out of this filter.
  const writesDisk = invokedCommands.filter((entry) => (
    entry.args.some((argument) => /init_skill\.py$|validate_skill_package\.py$/.test(argument))
    || entry.args.includes('--fix')
    || entry.args.includes('--write')
  ));
  assert.deepEqual(writesDisk, []);
  // A failed run leaves the skills root as it found it: no staged copy, an
  // untouched outside source, and the snapshot retained beside the backup.
  const staged = path.join(fixtureSkillsDir(tempRoot), 'brindle-lantern');
  assert.ok(!fs.existsSync(staged));
  assert.equal(hashTree(sourceRoot), sourceBefore);
  const backupRoot = path.join(fixtureSkillsDir(tempRoot), '.state', 'doctor-sk-skill', 'brindle-lantern');
  const backupDirectories = fs.readdirSync(backupRoot);
  assert.equal(backupDirectories.length, 1);
  assert.equal(
    fs.readFileSync(path.join(backupRoot, backupDirectories[0], 'before', 'SKILL.md'), 'utf8'),
    fs.readFileSync(path.join(sourceRoot, 'SKILL.md'), 'utf8'),
  );

  const snapshot = path.join(tempRoot, 'snapshot');
  const droppedTarget = path.join(tempRoot, 'dropped-target');
  fs.mkdirSync(snapshot, { recursive: true });
  fs.mkdirSync(droppedTarget, { recursive: true });
  fs.copyFileSync(path.join(sourceRoot, 'SKILL.md'), path.join(snapshot, 'SKILL.md'));
  fs.copyFileSync(
    path.join(FIXTURE_ROOT, 'plain', 'dropped', 'SKILL.md'),
    path.join(droppedTarget, 'SKILL.md'),
  );
  const preserve = invokeArgs(tempRoot, ['preserve', '--snapshot', snapshot, droppedTarget]);
  assert.equal(preserve.exitCode, 1);
  assert.match(preserve.stderr, /Read the field notes before choosing a review path/);
  t.diagnostic(`dropped-line preserve exit ${preserve.exitCode}: ${preserve.stderr.trim()}`);
});

test('long descriptions get a separate proposed trim and block apply before the format gate without approval', (t) => {
  const tempRoot = makeTempRoot(t);
  const sourceRoot = path.join(tempRoot, 'long-description');
  copyPlainSource(sourceRoot);
  const skillFile = path.join(sourceRoot, 'SKILL.md');
  const longDescription = 'Helps inspect detailed lantern sample records and decide whether the evidence supports a clear and carefully documented review of every observed field mark before a final path is selected.';
  const original = fs.readFileSync(skillFile, 'utf8');
  fs.writeFileSync(skillFile, original.replace(/^description:.*$/m, `description: ${longDescription}`));

  const plan = invokeArgs(tempRoot, ['plan', sourceRoot, ...phraseArgs()]);
  assert.equal(plan.exitCode, 0, plan.stderr);
  assert.match(plan.stdout, /Proposed description trim \(approve with --description-trim\):/);

  const apply = invokeArgs(tempRoot, [
    'apply', sourceRoot,
    ...phraseArgs(),
    '--allowed-tool', 'Read',
    '--allowed-tool', 'Grep',
    '--allowed-tool', 'Glob',
    '--agent-output', path.join(FIXTURE_ROOT, 'plain', 'after'),
    '--apply',
  ]);
  assert.equal(apply.exitCode, 1);
  assert.match(apply.stderr, /^DESCRIPTION_TRIM_REQUIRED:/);
  assert.ok(!fs.existsSync(path.join(fixtureSkillsDir(tempRoot), 'brindle-lantern')));

  const approvedTrim = 'Review lantern samples and confirm the evidence.';
  const context = makeIntegrationContext(tempRoot);
  const approved = invokeArgs(tempRoot, [
    'apply', sourceRoot,
    ...phraseArgs(),
    '--allowed-tool', 'Read',
    '--allowed-tool', 'Grep',
    '--allowed-tool', 'Glob',
    '--description-trim', approvedTrim,
    '--agent-output', path.join(FIXTURE_ROOT, 'plain', 'after'),
    '--apply',
  ], context);
  assert.equal(approved.exitCode, 0, `${approved.stdout}\n${approved.stderr}`);
  assert.match(fs.readFileSync(path.join(fixtureSkillsDir(tempRoot), 'brindle-lantern', 'SKILL.md'), 'utf8'), new RegExp(`^description: "${approvedTrim}"$`, 'm'));
});

test('usage errors print the complete usage message', () => {
  let stderr = '';
  const result = convert.runConvert([], {
    context: surface.createContext({ repoRoot: REPO_ROOT, skillsDir: REPO_ROOT, cwd: REPO_ROOT }),
    stdout: { write() {} },
    stderr: { write: (text) => { stderr += text; } },
  });
  assert.equal(result, 2);
  assert.match(stderr, /Usage: sk-skill-convert\.cjs plan <skill-name-or-path>/);
  assert.match(stderr, /sk-skill-convert\.cjs apply <skill-name-or-path> .*\[--apply\]/);
  assert.match(stderr, /plan is read-only/);
});

// A plan is self-contained: rendering it must not need a caller to patch a field
// the builder forgot, so the backup base belongs to the plan itself.
test('a plan carries its own backup base so the printed plan renders without patching', (t) => {
  const tempRoot = makeTempRoot(t);
  const skillRoot = path.join(fixtureSkillsDir(tempRoot), 'plan-backup-base');
  writeOldSkill(skillRoot);
  const context = makeContext(tempRoot);

  const plan = convert.buildPlan(skillRoot, context);
  assert.equal(
    plan.backupBase,
    path.join(fixtureSkillsDir(tempRoot), '.state', 'doctor-sk-skill', 'plan-backup-base'),
  );
  assert.match(convert.renderPlan(plan), /^Backup existing files under: .*plan-backup-base/m);
});

// A version field with no value is a version problem. Reporting it as a malformed
// tool list sends the operator to the wrong line of the frontmatter.
test('a blank version is refused as a version problem rather than a tool-list problem', () => {
  const source = (versionLine) => [
    '---',
    'name: blank-version',
    'description: short',
    versionLine,
    'allowed-tools: Read',
    '---',
    '',
    '# Blank Version',
    '',
    '## SMART ROUTING',
    '',
    'Route by intent.',
    '',
    '## MACHINE ROUTER',
    '',
    '```python',
    'INTENT_SIGNALS = {"PRIMARY": {"keywords": ["example"]}}',
    '```',
    '',
  ].join('\n');

  for (const versionLine of ['version:', 'version: null', 'version: ~']) {
    assert.throws(
      () => transforms.normalizeSkillFrontmatter(source(versionLine)),
      { code: 'VERSION_INVALID' },
      versionLine,
    );
  }
});

// The fixture is the pre-move sk-git folder, so its folder name is part of the
// package contract the strict gate enforces.
function prepareFixtureSkill(tempRoot) {
  const skillRoot = path.join(fixtureSkillsDir(tempRoot), 'sk-git');
  copyPreMoveFixture(skillRoot);
  return skillRoot;
}

function rewriteSkill(skillRoot, replace, replacement) {
  const skillFile = path.join(skillRoot, 'SKILL.md');
  const text = fs.readFileSync(skillFile, 'utf8');
  assert.ok(text.includes(replace), `SKILL.md carries ${JSON.stringify(replace)}`);
  fs.writeFileSync(skillFile, text.replace(replace, replacement));
}

function assertStrictRoutingShape(skillRoot) {
  const strict = invokeStrictPackageCheck(skillRoot);
  assert.equal(strict.status, 0, `${strict.stdout}\n${strict.stderr}`);
  assert.match(strict.stdout, /Result: PASS/);
  assert.doesNotMatch(`${strict.stdout}\n${strict.stderr}`, /RS-002|RS-005/);
}

// The strict gate flags a machine block anywhere above the machine-router section,
// not only in SMART ROUTING and not only for the three map heads. Convert has to
// move every block the gate would flag, or the two disagree about one skill.
test('converted skills carry no machine block the strict gate would flag', (t) => {
  const helperTempRoot = makeTempRoot(t);
  const helperRoot = prepareFixtureSkill(helperTempRoot);
  rewriteSkill(
    helperRoot,
    'The tables and the pseudocode sit in the final `MACHINE ROUTER` section of this file.',
    [
      '```python',
      'def discover_markdown_resources() -> set[str]:',
      '    return {path.name for path in RESOURCE_BASES}',
      '```',
    ].join('\n'),
  );
  assert.match(fs.readFileSync(path.join(helperRoot, 'SKILL.md'), 'utf8'), /def discover_markdown_resources/);
  assert.notEqual(invokeStrictPackageCheck(helperRoot).status, 0, 'the injected helper trips the gate');

  const helperApply = invoke(helperTempRoot, 'apply', helperRoot, ['--apply']);
  assert.equal(helperApply.exitCode, 0, helperApply.stderr);
  const helperSkill = fs.readFileSync(path.join(helperRoot, 'SKILL.md'), 'utf8');
  const helperRouter = fs.readFileSync(path.join(helperRoot, 'ROUTER.md'), 'utf8');
  assert.doesNotMatch(helperSkill, /def discover_markdown_resources/);
  assert.match(helperRouter, /def discover_markdown_resources/);
  assertStrictRoutingShape(helperRoot);

  const strayTempRoot = makeTempRoot(t);
  const strayRoot = prepareFixtureSkill(strayTempRoot);
  rewriteSkill(
    strayRoot,
    '## 9. MACHINE ROUTER',
    [
      '```python',
      'RESOURCE_MAP = {"STRAY": ["references/quick-reference.md"]}',
      '```',
      '',
      '## 9. MACHINE ROUTER',
    ].join('\n'),
  );
  assert.match(fs.readFileSync(path.join(strayRoot, 'SKILL.md'), 'utf8'), /RESOURCE_MAP = \{"STRAY"/);
  assert.notEqual(invokeStrictPackageCheck(strayRoot).status, 0, 'the injected map trips the gate');

  const strayApply = invoke(strayTempRoot, 'apply', strayRoot, ['--apply']);
  assert.equal(strayApply.exitCode, 0, strayApply.stderr);
  const straySkill = fs.readFileSync(path.join(strayRoot, 'SKILL.md'), 'utf8');
  const strayRouter = fs.readFileSync(path.join(strayRoot, 'ROUTER.md'), 'utf8');
  assert.doesNotMatch(straySkill, /RESOURCE_MAP = \{"STRAY"/);
  assert.ok(strayRouter.indexOf('RESOURCE_MAP = {"STRAY"') < strayRouter.indexOf('INTENT_SIGNALS = {'));
  assert.match(straySkill, /\[ROUTER\.md\]\(\.\/ROUTER\.md\)/);
  assertStrictRoutingShape(strayRoot);
});

// RS-005 asks for a pointer the document really makes. A sample inside a fence and
// a pattern inside inline code are the document talking about the link, so neither
// may stand in for the pointer convert is supposed to add.
test('a router link inside a fence or inline code does not stand in for the pointer', (t) => {
  const cases = [
    [
      'fenced-link',
      'The tables and the pseudocode sit in the final `MACHINE ROUTER` section of this file.',
      ['```markdown', 'See [ROUTER.md](./ROUTER.md) for the machine tables.', '```'].join('\n'),
    ],
    [
      'inline-code-link',
      'The tables and the pseudocode sit in the final `MACHINE ROUTER` section of this file.',
      'The pointer line reads `[ROUTER.md](./ROUTER.md)` once the move is done.',
    ],
  ];

  for (const [name, replace, replacement] of cases) {
    const tempRoot = makeTempRoot(t);
    const skillRoot = prepareFixtureSkill(tempRoot);
    rewriteSkill(skillRoot, replace, replacement);

    const plan = invoke(tempRoot, 'plan', skillRoot);
    assert.equal(plan.exitCode, 0, plan.stderr);
    assert.match(plan.stdout, /Overwrite: .*SKILL\.md/);

    const applied = invoke(tempRoot, 'apply', skillRoot, ['--apply']);
    assert.equal(applied.exitCode, 0, applied.stderr);
    const skillText = fs.readFileSync(path.join(skillRoot, 'SKILL.md'), 'utf8');
    const pointerLines = skillText.split('\n')
      .filter((line) => line.trim() === 'The machine router lives in [ROUTER.md](./ROUTER.md).');
    assert.equal(pointerLines.length, 1, name);
    assertStrictRoutingShape(skillRoot);
  }
});

// A refusal is only actionable when its code names the one condition that stopped
// the run, so every preflight refusal owns a code of its own.
test('each preflight refusal reports its own code', async (t) => {
  const tempRoot = makeTempRoot(t);
  const skillsDir = fixtureSkillsDir(tempRoot);
  const codes = [];

  await t.test('NOT_DIRECT_CHILD', () => {
    const nestedRoot = path.join(skillsDir, 'nested-parent', 'child');
    writeOldSkill(nestedRoot, 'child');
    const result = invoke(tempRoot, 'plan', nestedRoot);
    assert.equal(result.exitCode, 1, result.stderr);
    assert.match(result.stderr, /^NOT_DIRECT_CHILD:/);
    codes.push('NOT_DIRECT_CHILD');
  });

  await t.test('SKILL_UNREADABLE', () => {
    const skillRoot = path.join(skillsDir, 'unreadable');
    writeOldSkill(skillRoot);
    const context = makeContext(tempRoot);
    const fileSystem = Object.create(context.fs);
    fileSystem.readFileSync = (file, ...rest) => {
      if (path.basename(file) === 'SKILL.md') {
        const error = new Error('permission denied');
        error.code = 'EACCES';
        throw error;
      }
      return context.fs.readFileSync(file, ...rest);
    };
    context.fs = fileSystem;
    const result = invoke(tempRoot, 'plan', skillRoot, [], context);
    assert.equal(result.exitCode, 1, result.stderr);
    assert.match(result.stderr, /^SKILL_UNREADABLE:/);
    codes.push('SKILL_UNREADABLE');
  });

  await t.test('DESCRIPTION_MISSING', () => {
    const skillRoot = path.join(skillsDir, 'no-description');
    writeOldSkill(skillRoot, 'no-description');
    const skillFile = path.join(skillRoot, 'SKILL.md');
    fs.writeFileSync(skillFile, fs.readFileSync(skillFile, 'utf8')
      .replace('description: A short skill description.\n', ''));
    const result = invoke(tempRoot, 'plan', skillRoot);
    assert.equal(result.exitCode, 1, result.stderr);
    assert.match(result.stderr, /^DESCRIPTION_MISSING:/);
    codes.push('DESCRIPTION_MISSING');
  });

  await t.test('NO_MACHINE_ROUTER', () => {
    const skillRoot = path.join(skillsDir, 'routerless');
    const source = writeOldSkill(skillRoot, 'routerless');
    const routerStart = source.indexOf('\n## MACHINE ROUTER\n');
    assert.notEqual(routerStart, -1);
    fs.writeFileSync(path.join(skillRoot, 'SKILL.md'), `${source.slice(0, routerStart)}\n`);
    const result = invoke(tempRoot, 'plan', skillRoot);
    assert.equal(result.exitCode, 1, result.stderr);
    assert.match(result.stderr, /^NO_MACHINE_ROUTER:/);
    codes.push('NO_MACHINE_ROUTER');
  });

  await t.test('ROUTER_EXISTS', () => {
    const skillRoot = path.join(skillsDir, 'undeclared-router');
    writeOldSkill(skillRoot);
    fs.writeFileSync(path.join(skillRoot, 'ROUTER.md'), '# Notes\n\nNothing machine-readable here.\n');
    const result = invoke(tempRoot, 'plan', skillRoot);
    assert.equal(result.exitCode, 1, result.stderr);
    assert.match(result.stderr, /^ROUTER_EXISTS:/);
    codes.push('ROUTER_EXISTS');
  });

  await t.test('INPUT_KIND_UNSUPPORTED', () => {
    const skillRoot = path.join(skillsDir, 'unexpected-kind');
    writeOldSkill(skillRoot);
    const context = makeContext(tempRoot);
    // The guard exists for a check that classifies a skill differently from the resolver,
    // which no on-disk shape produces, so the report is supplied rather than built.
    const checker = require('../sk-skill-check.cjs');
    const original = checker.runCheck;
    checker.runCheck = (argv, options) => {
      options.stdout.write(JSON.stringify({ inputKind: 'unclassified', rows: [] }));
      return 0;
    };
    t.after(() => { checker.runCheck = original; });
    const result = invoke(tempRoot, 'plan', skillRoot, [], context);
    assert.equal(result.exitCode, 1, result.stderr);
    assert.match(result.stderr, /^INPUT_KIND_UNSUPPORTED:/);
    codes.push('INPUT_KIND_UNSUPPORTED');
  });

  assert.equal(new Set(codes).size, 6);
});

// Two declarations that disagree is a fault to report, and the report is only
// useful when the operator can see both sides of it.
test('a router file that declares nothing is refused with both declarations printed', (t) => {
  const tempRoot = makeTempRoot(t);
  const skillRoot = path.join(fixtureSkillsDir(tempRoot), 'undeclared-both');
  writeOldSkill(skillRoot, 'undeclared-both');
  const routerFile = path.join(skillRoot, 'ROUTER.md');
  const routerText = '# Undeclared Both Router\n\nThe tables were listed here once.\n';
  fs.writeFileSync(routerFile, routerText);

  const result = invoke(tempRoot, 'plan', skillRoot);
  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /^ROUTER_EXISTS:/);
  assert.match(result.stderr, /ROUTER\.md/);
  assert.match(result.stderr, /The tables were listed here once\./);
  assert.match(result.stderr, /INTENT_SIGNALS = \{"PRIMARY"/);
  assert.equal(fs.readFileSync(routerFile, 'utf8'), routerText);
  assert.doesNotMatch(fs.readFileSync(path.join(skillRoot, 'SKILL.md'), 'utf8'), /ROUTER\.md\]\(\.\//);
});

// A run that wrote files owes the operator a way back that does not depend on
// remembering which files it touched.
test('a write prints the undo commands and the check rerun command', (t) => {
  const tempRoot = makeTempRoot(t);
  const skillRoot = path.join(fixtureSkillsDir(tempRoot), 'undo-print');
  const original = writeOldSkill(skillRoot, 'undo-print');

  const applied = invoke(tempRoot, 'apply', skillRoot, ['--apply']);
  assert.equal(applied.exitCode, 0, applied.stderr);
  assert.equal(applied.stdout.split('Conversion plan: undo-print').length - 1, 1);
  const backupDir = /^Backup: (.+)$/m.exec(applied.stdout)[1];
  // The converter resolves the skill root, so its undo commands quote the resolved path.
  const resolvedRoot = fs.realpathSync(skillRoot);
  assert.match(applied.stdout, /^Undo:$/m);
  assert.ok(applied.stdout.includes(
    `  cp "${path.join(backupDir, 'SKILL.md')}" "${path.join(resolvedRoot, 'SKILL.md')}"`,
  ), applied.stdout);
  assert.ok(applied.stdout.includes(`  rm "${path.join(resolvedRoot, 'ROUTER.md')}"`), applied.stdout);
  assert.match(applied.stdout, /^Check: node ".*sk-skill-check\.cjs" check ".*undo-print"$/m);
  assert.equal(fs.readFileSync(path.join(backupDir, 'SKILL.md'), 'utf8'), original);
});

// ─────────────────────────────────────────────────────────────────────────────
// PRESERVATION AND LINK-PROOF CASES
// ─────────────────────────────────────────────────────────────────────────────

function writeTree(root, files) {
  for (const [relative, text] of Object.entries(files)) {
    const target = path.join(root, ...relative.split('/'));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, text);
  }
}

function plainSkillText(name, body) {
  return ['---', `name: ${name}`, 'description: A short plain skill description.', '---', '', body].join('\n');
}

// A source tree with one link where the review expects a real file.
function plainSourceWithSymlink(tempRoot, linkTarget) {
  const sourceRoot = path.join(tempRoot, 'symlinked-source');
  copyPlainSource(sourceRoot);
  const target = path.join(sourceRoot, 'references', 'Field Notes.md');
  fs.unlinkSync(target);
  fs.symlinkSync(linkTarget, target);
  return sourceRoot;
}

test('a symlink in a plain source tree is refused before staging and the outside file is unchanged', (t) => {
  const tempRoot = makeTempRoot(t);
  const outsideRoot = path.join(tempRoot, 'outside');
  fs.mkdirSync(outsideRoot, { recursive: true });
  const outsideSkill = path.join(outsideRoot, 'SKILL.md');
  const outsideText = fs.readFileSync(path.join(FIXTURE_ROOT, 'plain', 'before', 'SKILL.md'), 'utf8');
  fs.writeFileSync(outsideSkill, outsideText);

  const linkedSkillRoot = path.join(tempRoot, 'linked-skill-source');
  fs.mkdirSync(path.join(linkedSkillRoot, 'references'), { recursive: true });
  fs.copyFileSync(
    path.join(FIXTURE_ROOT, 'plain', 'before', 'references', 'Field Notes.md'),
    path.join(linkedSkillRoot, 'references', 'Field Notes.md'),
  );
  fs.symlinkSync(outsideSkill, path.join(linkedSkillRoot, 'SKILL.md'));

  const decisions = [
    ...phraseArgs(),
    '--allowed-tool', 'Read',
    '--agent-output', path.join(FIXTURE_ROOT, 'plain', 'after'),
  ];
  const plan = invokeArgs(tempRoot, ['plan', linkedSkillRoot, ...decisions]);
  assert.equal(plan.exitCode, 1, plan.stdout);
  assert.match(plan.stderr, /^SOURCE_SYMLINK:/);

  const applied = invokeArgs(tempRoot, ['apply', linkedSkillRoot, ...decisions, '--apply']);
  assert.equal(applied.exitCode, 1, applied.stdout);
  assert.match(applied.stderr, /^SOURCE_SYMLINK:/);
  assert.equal(fs.readFileSync(outsideSkill, 'utf8'), outsideText, 'the run wrote through the symlink');
  assert.ok(!fs.existsSync(path.join(fixtureSkillsDir(tempRoot), 'brindle-lantern')));

  const outsideResource = path.join(outsideRoot, 'Field Notes.md');
  const outsideResourceText = fs.readFileSync(
    path.join(FIXTURE_ROOT, 'plain', 'before', 'references', 'Field Notes.md'),
    'utf8',
  );
  fs.writeFileSync(outsideResource, outsideResourceText);
  const linkedResourceRoot = plainSourceWithSymlink(tempRoot, outsideResource);
  const resourceRun = invokeArgs(tempRoot, ['apply', linkedResourceRoot, ...decisions, '--apply']);
  assert.equal(resourceRun.exitCode, 1, resourceRun.stdout);
  assert.match(resourceRun.stderr, /^SOURCE_SYMLINK:/);
  assert.equal(fs.readFileSync(outsideResource, 'utf8'), outsideResourceText);
  assert.ok(!fs.existsSync(path.join(fixtureSkillsDir(tempRoot), 'brindle-lantern')));
});

test('a hash line inside a fence is preserved body text and matches only a fenced line', (t) => {
  const source = plainSkillText('fenced-heading', [
    '# Fenced Heading',
    '',
    'Run the sample twice before comparing marks.',
    '',
    '```sh',
    '# select the field notes for this review',
    'echo done',
    '```',
    '',
  ].join('\n'));
  const preserved = transforms.bodyLinesToPreserve(source);
  assert.ok(preserved.includes('# select the field notes for this review'), JSON.stringify(preserved));
  assert.ok(!preserved.includes('# Fenced Heading'), JSON.stringify(preserved));

  const tempRoot = makeTempRoot(t);
  const snapshot = path.join(tempRoot, 'snapshot');
  const target = path.join(tempRoot, 'fenced-target');
  writeTree(snapshot, { 'SKILL.md': source });
  writeTree(target, {
    'SKILL.md': source.replace('# select the field notes for this review\n', ''),
  });
  const dropped = invokeArgs(tempRoot, ['preserve', '--snapshot', snapshot, target]);
  assert.equal(dropped.exitCode, 1, dropped.stdout);
  assert.match(dropped.stderr, /select the field notes for this review/);

  writeTree(target, {
    'SKILL.md': source.replace(
      '# select the field notes for this review',
      '# select the field notes for the other review',
    ),
  });
  const altered = invokeArgs(tempRoot, ['preserve', '--snapshot', snapshot, target]);
  assert.equal(altered.exitCode, 1, altered.stdout);
  assert.match(altered.stderr, /select the field notes for this review/);
});

test('resource links in definitions, HTML attributes and inline code are rewritten to the kebab name', () => {
  const body = [
    '---', 'name: link-forms', 'description: short', '---', '',
    'Read [inline](<references/Field Notes.md>) and [bare](references/Second_Guide.md).',
    '',
    '[notes]: <references/Field Notes.md>',
    '[guide]: references/Second_Guide.md "Second guide"',
    '',
    '<a href="references/Field Notes.md">notes</a> and <img src="references/Second_Guide.md">',
    '',
    'Load `references/Field Notes.md` before the review.',
    '',
    'An unrelated link [site](https://example.com/references/Field%20Notes.md).',
  ].join('\n');
  const renames = transforms.resourceRenameMap(['references/Field Notes.md', 'references/Second_Guide.md']);
  const rewritten = transforms.rewriteResourceLinks(body, renames);

  assert.ok(!rewritten.includes('Field Notes.md'), rewritten);
  assert.ok(!rewritten.includes('Second_Guide.md'), rewritten);
  assert.match(rewritten, /\[notes\]: <references\/field-notes\.md>/);
  assert.match(rewritten, /\[guide\]: references\/second-guide\.md "Second guide"/);
  assert.match(rewritten, /<a href="references\/field-notes\.md">/);
  assert.match(rewritten, /<img src="references\/second-guide\.md">/);
  assert.match(rewritten, /`references\/field-notes\.md`/);
  assert.match(rewritten, /https:\/\/example\.com\/references\/Field%20Notes\.md/);
});

test('apply refuses a staged tree that still names an old resource path', (t) => {
  const tempRoot = makeTempRoot(t);
  const sourceRoot = path.join(tempRoot, 'plain-source');
  copyPlainSource(sourceRoot);
  const agentRoot = path.join(tempRoot, 'stale-agent');
  fs.cpSync(path.join(FIXTURE_ROOT, 'plain', 'after'), agentRoot, { recursive: true });
  fs.appendFileSync(
    path.join(agentRoot, 'SKILL.md'),
    '\nThe old notes file was references/Field Notes.md.\n',
  );
  const context = makeContext(tempRoot);
  context.paths.regenerateDerived = makeTemporaryDerivedGenerator(tempRoot);

  const result = invokeArgs(tempRoot, [
    'apply', sourceRoot,
    ...phraseArgs(),
    '--allowed-tool', 'Read',
    '--agent-output', agentRoot,
    '--apply',
  ], context);
  assert.equal(result.exitCode, 1, result.stdout);
  assert.match(result.stderr, /^RESOURCE_LINK_STALE:/);
  assert.ok(!fs.existsSync(path.join(fixtureSkillsDir(tempRoot), 'brindle-lantern')));
});

test('the committed plain after-copy names no old resource path', () => {
  const after = fs.readFileSync(path.join(FIXTURE_ROOT, 'plain', 'after', 'SKILL.md'), 'utf8');
  assert.ok(!after.includes('Field Notes.md'), after);
  assert.match(after, /references\/field-notes\.md/);
});

test('the plain plan and apply run the interpreter the context configures', (t) => {
  const tempRoot = makeTempRoot(t);
  const callLog = path.join(tempRoot, 'interpreter-calls.log');
  const wrapper = path.join(tempRoot, 'python-wrapper.sh');
  const realPython = process.env.PYTHON || 'python3';
  fs.writeFileSync(wrapper, [
    '#!/bin/sh',
    `printf '%s\\n' "$*" >> "${callLog}"`,
    `exec "${realPython}" "$@"`,
    '',
  ].join('\n'));
  fs.chmodSync(wrapper, 0o755);

  const context = surface.createContext({
    repoRoot: REPO_ROOT,
    skillsDir: fixtureSkillsDir(tempRoot),
    cwd: REPO_ROOT,
    python: wrapper,
    env: environment(),
  });
  const plan = invokeArgs(tempRoot, ['plan', path.join(FIXTURE_ROOT, 'plain', 'before'), ...phraseArgs()], context);
  assert.equal(plan.exitCode, 0, plan.stderr);
  assert.ok(fs.existsSync(callLog), 'the plain plan never ran the configured interpreter');
  assert.ok(fs.readFileSync(callLog, 'utf8').trim().length > 0, 'the configured interpreter logged no call');
});

test('preservation compares link targets verbatim, allowing only the planned rename map', (t) => {
  const tempRoot = makeTempRoot(t);
  const source = plainSkillText('link-targets', [
    '# Link Targets',
    '',
    'See [field notes](<references/Field Notes.md>) before proceeding.',
    '',
  ].join('\n'));
  const snapshot = path.join(tempRoot, 'snapshot');
  const target = path.join(tempRoot, 'target');
  writeTree(snapshot, { 'SKILL.md': source });

  writeTree(target, {
    'SKILL.md': source.replace('references/Field Notes.md', 'references/other-notes.md'),
  });
  const repointed = invokeArgs(tempRoot, ['preserve', '--snapshot', snapshot, target]);
  assert.equal(repointed.exitCode, 1, repointed.stdout);
  assert.match(repointed.stderr, /field notes/);

  writeTree(target, { 'SKILL.md': source.replace('references/Field Notes.md', 'references/field-notes.md') });
  const renamed = invokeArgs(tempRoot, ['preserve', '--snapshot', snapshot, target]);
  assert.equal(renamed.exitCode, 0, renamed.stderr);
});

// A reference definition names the same document as an inline link, so the
// planned rename has to canonicalize its target too. Every other form already
// goes through that canonicalization, which is why only the definition failed.
test('preservation canonicalizes a reference definition target through the planned rename map', (t) => {
  const tempRoot = makeTempRoot(t);
  const header = [
    '---', 'name: definition-target', 'description: A short plain skill description.', '---', '',
    '# Definition Target', '', '## Purpose', '',
  ].join('\n');
  const source = [
    `${header}Read [notes](<references/Field Notes.md>) and \`references/Field Notes.md\` now.`,
    '',
    '<a href="references/Field Notes.md">notes</a>',
    '',
    '[notes]: <references/Field Notes.md>',
    '',
  ].join('\n');
  const snapshot = path.join(tempRoot, 'snapshot');
  const target = path.join(tempRoot, 'target');
  writeTree(snapshot, { 'SKILL.md': source });

  const kebab = source.split('references/Field Notes.md').join('references/field-notes.md');
  writeTree(target, { 'SKILL.md': kebab });
  const accepted = invokeArgs(tempRoot, ['preserve', '--snapshot', snapshot, target]);
  assert.equal(accepted.exitCode, 0, accepted.stderr);

  const repointed = path.join(tempRoot, 'repointed');
  writeTree(repointed, {
    'SKILL.md': kebab.replace('[notes]: <references/field-notes.md>', '[notes]: <references/other.md>'),
  });
  const refused = invokeArgs(tempRoot, ['preserve', '--snapshot', snapshot, repointed]);
  assert.equal(refused.exitCode, 1, refused.stdout);
  assert.match(refused.stderr, /\[notes\]: <references\/field-notes\.md>/);
});

// A plan that renamed nothing is the one case where the check has to derive the
// kebab name itself. When the plan named a rename, a spelling it never chose is
// a path the staged tree does not hold, so accepting it would hide a dead link.
test('preservation accepts a derived kebab target only when the plan renamed nothing', () => {
  const renames = transforms.resourceRenameMap(['references/Field Notes.md']);
  const canonical = transforms.normalizePreservationLine('[x](<references/field-notes.md>)', renames);
  assert.equal(
    transforms.normalizePreservationLine('[x](<references/Field Notes.md>)', renames),
    canonical,
  );
  for (const spelling of ['references/field notes.md', 'references/Field-Notes.md', 'references/Field_Notes.md']) {
    assert.notEqual(
      transforms.normalizePreservationLine(`[x](<${spelling}>)`, renames),
      canonical,
      `${spelling} was accepted although the plan renamed only the source spelling`,
    );
  }
  assert.equal(
    transforms.normalizePreservationLine('[x](<references/Field Notes.md>)', new Map()),
    canonical,
    'a map with no renames still has to derive the kebab name',
  );
});

test('preservation does not let a copied reference line stand in for a dropped SKILL.md line', (t) => {
  const tempRoot = makeTempRoot(t);
  const source = plainSkillText('reference-pool', [
    '# Reference Pool',
    '',
    'The shared observation line.',
    '',
    'The skill-only observation line.',
    '',
  ].join('\n'));
  const sharedReference = '# Shared Notes\n\nThe shared observation line.\n';
  const snapshot = path.join(tempRoot, 'snapshot');
  const target = path.join(tempRoot, 'target');
  writeTree(snapshot, { 'SKILL.md': source, 'references/shared.md': sharedReference });
  writeTree(target, {
    'SKILL.md': source.replace('The shared observation line.\n\n', ''),
    'references/shared.md': sharedReference,
  });
  const dropped = invokeArgs(tempRoot, ['preserve', '--snapshot', snapshot, target]);
  assert.equal(dropped.exitCode, 1, dropped.stdout);
  assert.match(dropped.stderr, /The shared observation line/);

  const movedSnapshot = path.join(tempRoot, 'moved-snapshot');
  const movedTarget = path.join(tempRoot, 'moved-target');
  writeTree(movedSnapshot, {
    'SKILL.md': plainSkillText('moved-line', '# Moved Line\n\nA line that moved into a reference.\n'),
  });
  writeTree(movedTarget, {
    'SKILL.md': plainSkillText('moved-line', '# Moved Line\n'),
    'references/moved.md': '# Moved Notes\n\nA line that moved into a reference.\n',
  });
  const moved = invokeArgs(tempRoot, ['preserve', '--snapshot', movedSnapshot, movedTarget]);
  assert.equal(moved.exitCode, 0, moved.stderr);
});

test('preservation matches prose only against prose and fenced lines only against fenced lines', (t) => {
  const tempRoot = makeTempRoot(t);
  const header = '---\nname: line-kinds\ndescription: A short plain skill description.\n---\n\n# Line Kinds\n\n';
  const source = `${header}Keep the sample record beside its observation.\n\n\`\`\`text\nA fenced sample line.\n\`\`\`\n`;
  const snapshot = path.join(tempRoot, 'snapshot');
  writeTree(snapshot, { 'SKILL.md': source });

  const fencedTarget = path.join(tempRoot, 'fenced-target');
  writeTree(fencedTarget, {
    'SKILL.md': `${header}\`\`\`text\nKeep the sample record beside its observation.\n\`\`\`\n\n\`\`\`text\nA fenced sample line.\n\`\`\`\n`,
  });
  const movedIntoFence = invokeArgs(tempRoot, ['preserve', '--snapshot', snapshot, fencedTarget]);
  assert.equal(movedIntoFence.exitCode, 1, movedIntoFence.stdout);
  assert.match(movedIntoFence.stderr, /Keep the sample record beside its observation/);

  const commentTarget = path.join(tempRoot, 'comment-target');
  writeTree(commentTarget, {
    'SKILL.md': `${header}<!-- Keep the sample record beside its observation. -->\n\n\`\`\`text\nA fenced sample line.\n\`\`\`\n`,
  });
  const movedIntoComment = invokeArgs(tempRoot, ['preserve', '--snapshot', snapshot, commentTarget]);
  assert.equal(movedIntoComment.exitCode, 1, movedIntoComment.stdout);
  assert.match(movedIntoComment.stderr, /Keep the sample record beside its observation/);

  const proseTarget = path.join(tempRoot, 'prose-target');
  writeTree(proseTarget, {
    'SKILL.md': `${header}Keep the sample record beside its observation.\n\nA fenced sample line.\n`,
  });
  const fencedIntoProse = invokeArgs(tempRoot, ['preserve', '--snapshot', snapshot, proseTarget]);
  assert.equal(fencedIntoProse.exitCode, 1, fencedIntoProse.stdout);
  assert.match(fencedIntoProse.stderr, /A fenced sample line/);
});

test('a realigned table row still counts as the same preserved line', (t) => {
  const tempRoot = makeTempRoot(t);
  const source = plainSkillText('table-rows', [
    '# Table Rows',
    '',
    '| Mark | Verdict |',
    '|------|---------|',
    '| one | clear |',
    '',
  ].join('\n'));
  const snapshot = path.join(tempRoot, 'snapshot');
  const target = path.join(tempRoot, 'target');
  writeTree(snapshot, { 'SKILL.md': source });
  writeTree(target, {
    'SKILL.md': source.replace('| Mark | Verdict |', '| Mark    |   Verdict |')
      .replace('| one | clear |', '|  one  |  clear  |'),
  });
  const result = invokeArgs(tempRoot, ['preserve', '--snapshot', snapshot, target]);
  assert.equal(result.exitCode, 0, result.stderr);
  assert.match(result.stdout, /Preservation PASS/);
});

// An older Skilled skill can carry a description over the budget or no
// allowed-tools field at all. Both are fields an operator may approve, and an
// approval is a value, not a directive for the workflow to overwrite SKILL.md
// before a backup exists.
test('an approved description trim is its own plan line and the backup restores the original text', (t) => {
  const tempRoot = makeTempRoot(t);
  const skillRoot = path.join(fixtureSkillsDir(tempRoot), 'trim-approved');
  const original = writeRouterMdSkill(skillRoot, 'trim-approved', { description: 'd'.repeat(131) });

  const refused = invoke(tempRoot, 'plan', skillRoot);
  assert.equal(refused.exitCode, 1, refused.stdout);
  assert.match(refused.stderr, /^DESCRIPTION_TOO_LONG:/);

  const trim = 'Review lantern samples and confirm the evidence.';
  const plan = invoke(tempRoot, 'plan', skillRoot, ['--description-trim', trim]);
  assert.equal(plan.exitCode, 0, plan.stderr);
  assert.match(plan.stdout, new RegExp(`Set description: ${JSON.stringify(trim).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  assert.match(plan.stdout, /Overwrite: .*SKILL\.md/);
  assert.equal(fs.readFileSync(path.join(skillRoot, 'SKILL.md'), 'utf8'), original);

  const overLong = invoke(tempRoot, 'plan', skillRoot, ['--description-trim', 'd'.repeat(131)]);
  assert.equal(overLong.exitCode, 1, overLong.stdout);
  assert.match(overLong.stderr, /^DESCRIPTION_TOO_LONG:/);

  const applied = invoke(tempRoot, 'apply', skillRoot, ['--description-trim', trim, '--apply']);
  assert.equal(applied.exitCode, 0, `${applied.stdout}\n${applied.stderr}`);
  assert.match(fs.readFileSync(path.join(skillRoot, 'SKILL.md'), 'utf8'), new RegExp(`^description: ${JSON.stringify(trim)}$`, 'm'));

  const backupRoot = path.join(fixtureSkillsDir(tempRoot), '.state', 'doctor-sk-skill', 'trim-approved');
  const backupDirectory = path.join(backupRoot, fs.readdirSync(backupRoot)[0]);
  const backupFile = path.join(backupDirectory, 'SKILL.md');
  assert.equal(fs.readFileSync(backupFile, 'utf8'), original);
  const resolvedRoot = fs.realpathSync(skillRoot);
  assert.ok(
    applied.stdout.includes(`  cp "${backupFile}" "${path.join(resolvedRoot, 'SKILL.md')}"`),
    applied.stdout,
  );
  t.diagnostic(`approved description trim apply exit ${applied.exitCode}`);
});

// A missing permitted-tool grant is a decision the operator has not made yet,
// not a malformed file: the plan prints the list it proposes so the question has
// something to offer, and the apply refuses until a flag supplies one.
test('a skill that declares no allowed-tools gets a plan that proposes a list and writes nothing', (t) => {
  const tempRoot = makeTempRoot(t);
  const skillRoot = path.join(fixtureSkillsDir(tempRoot), 'tools-undeclared');
  const original = writeOldSkill(skillRoot, 'tools-undeclared');
  const skillFile = path.join(skillRoot, 'SKILL.md');
  fs.writeFileSync(skillFile, original.replace(/^allowed-tools:.*\r?\n/m, ''));
  const withoutField = fs.readFileSync(skillFile, 'utf8');

  const plan = invoke(tempRoot, 'plan', skillRoot);
  assert.equal(plan.exitCode, 0, plan.stderr);
  assert.match(plan.stdout, /^allowed-tools: approval required; propose \["Read","Grep","Glob"\]$/m);
  assert.match(plan.stdout, /^No allowed-tools field will be written until approved/m);
  assert.equal(fs.readFileSync(skillFile, 'utf8'), withoutField);
  assert.ok(!fs.existsSync(path.join(skillRoot, 'ROUTER.md')));

  const unapproved = invoke(tempRoot, 'apply', skillRoot, ['--apply']);
  assert.equal(unapproved.exitCode, 1, unapproved.stdout);
  assert.match(unapproved.stderr, /^ALLOWED_TOOLS_APPROVAL_REQUIRED:/);
  assert.equal(fs.readFileSync(skillFile, 'utf8'), withoutField);
  assert.ok(!fs.existsSync(path.join(skillRoot, 'ROUTER.md')), 'the refused apply created ROUTER.md');
  assert.ok(
    !fs.existsSync(path.join(fixtureSkillsDir(tempRoot), '.state', 'doctor-sk-skill', 'tools-undeclared')),
    'the refused apply took a backup',
  );
  t.diagnostic(`zero-declaration apply refusal exit ${unapproved.exitCode}`);
});

test('the proposed allowed-tools list offers Bash only when the skill ships scripts', (t) => {
  const tempRoot = makeTempRoot(t);
  const skillRoot = path.join(fixtureSkillsDir(tempRoot), 'tools-with-scripts');
  const original = writeOldSkill(skillRoot, 'tools-with-scripts');
  const skillFile = path.join(skillRoot, 'SKILL.md');
  fs.writeFileSync(skillFile, original.replace(/^allowed-tools:.*\r?\n/m, ''));
  fs.mkdirSync(path.join(skillRoot, 'scripts'), { recursive: true });
  fs.writeFileSync(path.join(skillRoot, 'scripts', 'collect.sh'), '#!/bin/sh\n');

  const plan = invoke(tempRoot, 'plan', skillRoot);
  assert.equal(plan.exitCode, 0, plan.stderr);
  assert.match(plan.stdout, /^allowed-tools: approval required; propose \["Read","Grep","Glob","Bash"\]$/m);
});

test('the approved allowed-tools list is written only when the flag names it', (t) => {
  const tempRoot = makeTempRoot(t);
  const skillRoot = path.join(fixtureSkillsDir(tempRoot), 'tools-approved');
  const original = writeOldSkill(skillRoot, 'tools-approved');
  const skillFile = path.join(skillRoot, 'SKILL.md');
  fs.writeFileSync(skillFile, original.replace(/^allowed-tools:.*\r?\n/m, ''));
  const withoutField = fs.readFileSync(skillFile, 'utf8');

  const plan = invoke(tempRoot, 'plan', skillRoot, ['--allowed-tools', 'Read, Grep, Glob']);
  assert.equal(plan.exitCode, 0, plan.stderr);
  assert.match(plan.stdout, /Set allowed-tools: \["Read","Grep","Glob"\]/);
  assert.ok(!plan.stdout.includes('approval required'), plan.stdout);
  assert.equal(fs.readFileSync(skillFile, 'utf8'), withoutField);

  const applied = invoke(tempRoot, 'apply', skillRoot, ['--allowed-tools', 'Read, Grep, Glob', '--apply']);
  assert.equal(applied.exitCode, 0, `${applied.stdout}\n${applied.stderr}`);
  const written = fs.readFileSync(skillFile, 'utf8');
  assert.match(written, /^allowed-tools:\n  - "Read"\n  - "Grep"\n  - "Glob"$/m);
  assert.equal((written.match(/^allowed-tools:/gm) || []).length, 1);

  const backupRoot = path.join(fixtureSkillsDir(tempRoot), '.state', 'doctor-sk-skill', 'tools-approved');
  const backupDirectory = path.join(backupRoot, fs.readdirSync(backupRoot)[0]);
  assert.equal(fs.readFileSync(path.join(backupDirectory, 'SKILL.md'), 'utf8'), withoutField);
  t.diagnostic(`approved allowed-tools apply exit ${applied.exitCode}`);
});

// Two declarations are the file's own contradiction rather than a decision the
// operator has not made, so the refusal names the duplication it found.
test('a skill that declares allowed-tools twice is refused with a message that says so', (t) => {
  const tempRoot = makeTempRoot(t);
  const skillRoot = path.join(fixtureSkillsDir(tempRoot), 'tools-duplicate');
  const original = writeOldSkill(skillRoot, 'tools-duplicate');
  const skillFile = path.join(skillRoot, 'SKILL.md');
  const duplicated = original.replace(/^(allowed-tools:.*)$/m, '$1\n$1');
  fs.writeFileSync(skillFile, duplicated);

  const refused = invoke(tempRoot, 'plan', skillRoot);
  assert.equal(refused.exitCode, 1, refused.stdout);
  assert.match(refused.stderr, /^ALLOWED_TOOLS_DUPLICATE:/);
  assert.match(refused.stderr, /declares allowed-tools twice/);
  assert.equal(fs.readFileSync(skillFile, 'utf8'), duplicated);
});

test('the plain path accepts the comma form of the allowed-tools approval', (t) => {
  const tempRoot = makeTempRoot(t);
  const sourceRoot = path.join(FIXTURE_ROOT, 'plain', 'before');
  const plan = invokeArgs(tempRoot, [
    'plan', sourceRoot,
    ...phraseArgs(),
    '--allowed-tools', 'Read, Grep, Glob',
  ]);
  assert.equal(plan.exitCode, 0, plan.stderr);
  assert.match(plan.stdout, /allowed-tools: \["Read","Grep","Glob"\]/);
  assert.ok(!plan.stdout.includes('No allowed-tools field will be written'));
});

// A tool's own parentheses can hold a comma, so the list split has to ignore a
// comma inside them while the single-tool flag never splits at all.
test('a tool whose parentheses hold a comma survives both approval forms', (t) => {
  const tempRoot = makeTempRoot(t);
  const sourceRoot = path.join(FIXTURE_ROOT, 'plain', 'before');
  const typed = 'Bash(git log, git show)';

  const commaList = invokeArgs(tempRoot, [
    'plan', sourceRoot,
    ...phraseArgs(),
    '--allowed-tools', `Read,${typed}`,
  ]);
  assert.equal(commaList.exitCode, 0, commaList.stderr);
  assert.ok(
    commaList.stdout.includes(`allowed-tools: ${JSON.stringify(['Read', typed])}`),
    commaList.stdout,
  );

  const repeated = invokeArgs(tempRoot, [
    'plan', sourceRoot,
    ...phraseArgs(),
    '--allowed-tool', typed,
  ]);
  assert.equal(repeated.exitCode, 0, repeated.stderr);
  assert.ok(
    repeated.stdout.includes(`allowed-tools: ${JSON.stringify([typed])}`),
    repeated.stdout,
  );

  const unbalanced = invokeArgs(tempRoot, [
    'plan', sourceRoot,
    ...phraseArgs(),
    '--allowed-tools', 'Read,Bash(git log',
  ]);
  assert.equal(unbalanced.exitCode, 2, unbalanced.stdout);
  assert.match(unbalanced.stderr, /^ALLOWED_TOOLS_AMBIGUOUS:/);
});

// An overwrite is not the same promise as a creation: a created path is
// removed, a path that existed is copied back from the backup the run made, and
// an untracked path is never handed to version control.
test('the undo removes the staged root and recreates an overwritten target from its backup', (t) => {
  const tempRoot = makeTempRoot(t);
  const sourceRoot = path.join(tempRoot, 'plain-source');
  copyPlainSource(sourceRoot);
  const context = makeIntegrationContext(tempRoot);
  const compiled = context.paths.skillGraphJson;
  fs.mkdirSync(path.dirname(compiled), { recursive: true });
  fs.writeFileSync(compiled, 'PRE-RUN GRAPH\n');

  const applied = invokeArgs(tempRoot, [
    'apply', sourceRoot,
    ...phraseArgs(),
    '--allowed-tool', 'Read',
    '--agent-output', path.join(FIXTURE_ROOT, 'plain', 'after'),
    '--apply',
  ], context);
  assert.equal(applied.exitCode, 0, `${applied.stdout}\n${applied.stderr}`);

  const stagedRoot = path.join(fixtureSkillsDir(tempRoot), 'brindle-lantern');
  const undo = applied.stdout.slice(applied.stdout.indexOf('Undo:'));
  assert.ok(undo.includes(`  rm -r "${stagedRoot}"`), undo);
  assert.ok(!/git -c core\.fsmonitor=false restore/.test(undo), undo);
  assert.ok(!undo.includes('plain-source"'), undo);

  const restored = /^ {2}cp "([^"]+)" "(.+)"$/m.exec(undo);
  assert.ok(restored, undo);
  assert.equal(restored[2], compiled, 'the copied-back path is not the overwritten target');
  assert.equal(fs.readFileSync(restored[1], 'utf8'), 'PRE-RUN GRAPH\n');

  const checkLine = undo.split('\n').find((line) => line.startsWith('Check: '));
  assert.ok(checkLine, undo);
  assert.ok(checkLine.includes(`check "${stagedRoot}"`), checkLine);
});
