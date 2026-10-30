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

test('an existing ROUTER.md still receives V2 frontmatter normalization without V3 creation', (t) => {
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

test('each V0 refusal has a distinct code and hub-router.json is sufficient on its own', (t) => {
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
  const context = makeContext(tempRoot);
  context.paths.regenerateDerived = makeTemporaryDerivedGenerator(tempRoot);
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
  assert.ok(!fs.existsSync(path.join(fixtureSkillsDir(tempRoot), 'brindle-lantern')));

  const applied = invokeArgs(tempRoot, ['apply', sourceRoot, ...decisions, '--apply'], context);
  assert.equal(applied.exitCode, 0, `${applied.stdout}\n${applied.stderr}`);
  assert.match(applied.stdout, /preservation and V8 format gates passed/i);
  assert.match(applied.stdout, /Result: PASS/);
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

  const scriptsRoot = path.join(REPO_ROOT, '.skilled', 'skills', 'sk-doc', 'sk-create-skill', 'scripts');
  const strict = spawnSync('/usr/bin/python3', [
    path.join(scriptsRoot, 'package_skill.py'), skillRoot, '--check', '--strict',
  ], { cwd: REPO_ROOT, encoding: 'utf8', env: environment() });
  assert.equal(strict.status, 0, `${strict.stdout}\n${strict.stderr}`);
  assert.match(strict.stdout, /Result: PASS/);
  t.diagnostic(`package_skill.py --check --strict exit ${strict.status}: ${strict.stdout.trim()}`);

  const rootMetadata = spawnSync('node', [
    path.join(scriptsRoot, 'ci-skill-root-metadata.cjs'),
    '--skills-dir', fixtureSkillsDir(tempRoot),
    '--skill', 'brindle-lantern',
  ], { cwd: REPO_ROOT, encoding: 'utf8', env: environment() });
  assert.equal(rootMetadata.status, 0, `${rootMetadata.stdout}\n${rootMetadata.stderr}`);
  t.diagnostic(`ci-skill-root-metadata.cjs --skill brindle-lantern exit ${rootMetadata.status}: ${rootMetadata.stdout.trim()}`);

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

test('plain V8 failure stops before the second package validator', (t) => {
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
  // The check stops at V4, so nothing after it writes: no scaffolder, no
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

test('long descriptions get a separate proposed trim and block apply before V8 without approval', (t) => {
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
  const context = makeContext(tempRoot);
  context.paths.regenerateDerived = makeTemporaryDerivedGenerator(tempRoot);
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
