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

function invoke(tempRoot, command, skillRoot, extra = [], contextOverride = null) {
  let stdout = '';
  let stderr = '';
  const exitCode = convert.runConvert([command, skillRoot, ...extra], {
    context: contextOverride || makeContext(tempRoot),
    stdout: { write: (chunk) => { stdout += chunk; } },
    stderr: { write: (chunk) => { stderr += chunk; } },
  });
  return { exitCode, stdout, stderr };
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

test('usage errors print the complete usage message', () => {
  let stderr = '';
  const result = convert.runConvert([], {
    context: surface.createContext({ repoRoot: REPO_ROOT, skillsDir: REPO_ROOT, cwd: REPO_ROOT }),
    stdout: { write() {} },
    stderr: { write: (text) => { stderr += text; } },
  });
  assert.equal(result, 2);
  assert.match(stderr, /Usage: sk-skill-convert\.cjs plan <skill-name-or-path>/);
  assert.match(stderr, /sk-skill-convert\.cjs apply <skill-name-or-path> \[--apply\]/);
  assert.match(stderr, /plan is read-only/);
});
