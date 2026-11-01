// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Root Resolution Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// A vendored framework copy can sit one folder below another repository's git
// root. These cases prove each doctor script reads the copy it was launched
// from, rather than the enclosing repository the old `.git` and `.opencode`
// walks returned. The fixture copies the scripts from this working tree at run
// time, so the same suite is red against the walk-up code and green once the
// scripts delegate to the shared sentinel resolver.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATHS AND FIXTURE
// ─────────────────────────────────────────────────────────────────────────────

const SCRIPTS_DIR = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(SCRIPTS_DIR, '../../../..');
const SKILLS_SOURCE = path.join(REPO_ROOT, '.skilled', 'skills');
const SKILL_DOC_LIB = path.join(
    SKILLS_SOURCE, 'sk-doc', 'sk-create-skill', 'scripts', 'lib',
);

// A stamp no checkout carries, so the panel's compiled-graph line proves which
// tree it read instead of matching a value the enclosing repository also has.
const FIXTURE_STAMP = '2026-11-01T00:00:00.000Z';
const DECOY_OPENCODE = '.opencode';

const tempParent = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-root-'));
const fixture = path.join(tempParent, 'enclosing');
const copyRoot = path.join(fixture, 'nested');
const linkRoot = path.join(tempParent, 'linked');
const linkedSkills = path.join(linkRoot, '.skilled');

function writeFixture(relative, contents) {
    const target = path.join(fixture, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, contents);
}

function copyFixture(relative, source) {
    const target = path.join(fixture, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
}

function scriptIn(root, name) {
    return path.join(root, '.skilled', 'commands', 'doctor', 'scripts', name);
}

function runScript(name, args, options = {}) {
    return spawnSync(process.execPath, [scriptIn(options.root || copyRoot, name), ...args], {
        cwd: options.cwd || copyRoot,
        encoding: 'utf8',
        env: options.env || process.env,
    });
}

// Ambient overrides could point a child at another tree, which would make a
// green result prove nothing about the root the script resolved for itself.
function isolatedEnv(overrides = {}) {
    const env = { ...process.env, ...overrides };
    for (const name of [
        'SKILL_GRAPH_FRESHNESS_ROOT',
        'SYSTEM_SKILL_ADVISOR_DB_DIR',
        'PARENT_HUB_CHECK_COMMANDS_DIR',
        'ROUTING_SHAPE_SKILLS_ROOT',
        'PARENT_HUB_CHECK_STRICT',
    ]) {
        if (!(name in overrides)) delete env[name];
    }
    return env;
}

function buildFixture() {
    fs.mkdirSync(fixture, { recursive: true });
    execFileSync('git', ['init', '--quiet'], { cwd: fixture, stdio: 'ignore' });
    // A decoy source-root name with no sentinel: the resolver must prefer the
    // copy that actually holds one, not the nearest directory wearing the name.
    fs.mkdirSync(path.join(fixture, DECOY_OPENCODE), { recursive: true });

    const skills = path.join(copyRoot, '.skilled', 'skills');
    writeFixture('nested/.skilled/skills/system-spec-kit/SKILL.md', '# System Spec Kit\n');
    copyFixture(
        'nested/.skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs',
        path.join(SKILLS_SOURCE, 'system-spec-kit', 'shared', 'workspace', 'repo-root.mjs'),
    );

    // The parent-hub check requires this library at module scope, so a missing
    // copy is the module-load failure the decoy case must not produce.
    fs.cpSync(SKILL_DOC_LIB, path.join(skills, 'sk-doc', 'sk-create-skill', 'scripts', 'lib'), {
        recursive: true,
    });
    copyFixture(
        'nested/.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs',
        path.join(SKILL_DOC_LIB, '..', 'generate-leaf-manifest.cjs'),
    );

    writeFixture('nested/.skilled/skills/sk-code/SKILL.md', '# sk-code\n');
    writeFixture(
        'nested/.skilled/skills/sk-code/mode-registry.json',
        JSON.stringify({ skill: 'sk-code', modes: [] }, null, 2),
    );
    writeFixture(
        'nested/.skilled/skills/sk-code/hub-router.json',
        JSON.stringify({ skill: 'sk-code' }, null, 2),
    );
    writeFixture('nested/.skilled/skills/sk-code-terraform/SKILL.md', '# sk-code-terraform\n');

    for (const skillId of ['system-deep-loop', 'alpha-skill', 'beta-skill']) {
        const family = skillId === 'system-deep-loop' ? 'deep-loop' : 'system';
        writeFixture(`nested/.skilled/skills/${skillId}/SKILL.md`, `# ${skillId}\n`);
        writeFixture(
            `nested/.skilled/skills/${skillId}/graph-metadata.json`,
            JSON.stringify({
                skill_id: skillId,
                family,
                intent_signals: [],
                derived: { last_updated_at: '2026-10-31T00:00:00.000Z' },
            }, null, 2),
        );
    }
    writeFixture(
        'nested/.skilled/skills/system-deep-loop/mode-registry.json',
        JSON.stringify({ skill: 'system-deep-loop', modes: [] }, null, 2),
    );
    writeFixture(
        'nested/.skilled/skills/system-deep-loop/hub-router.json',
        JSON.stringify({ skill: 'system-deep-loop' }, null, 2),
    );
    writeFixture(
        'nested/.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json',
        JSON.stringify({
            generated_at: FIXTURE_STAMP,
            families: { 'deep-loop': ['system-deep-loop'], system: ['alpha-skill', 'beta-skill'] },
            signals: { 'system-deep-loop': [], 'alpha-skill': [], 'beta-skill': [] },
        }, null, 2),
    );

    for (const name of [
        'sk-skill-check.cjs',
        'skill-graph-freshness.cjs',
        'parent-skill-check.cjs',
        'lib/sk-skill-surface.cjs',
    ]) {
        copyFixture(`nested/.skilled/commands/doctor/scripts/${name}`, path.join(SCRIPTS_DIR, name));
    }

    fs.mkdirSync(linkRoot, { recursive: true });
    execFileSync('git', ['init', '--quiet'], { cwd: linkRoot, stdio: 'ignore' });
    fs.symlinkSync(path.join(REPO_ROOT, '.skilled'), linkedSkills, 'dir');
}

test.before(buildFixture);

test.after(() => {
    fs.rmSync(tempParent, { recursive: true, force: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. FIXTURE
// ─────────────────────────────────────────────────────────────────────────────

test('fixture: a framework copy one folder below a git root with a decoy .opencode', () => {
    assert.ok(fs.existsSync(path.join(fixture, '.git')), 'the enclosing folder is a git root');
    assert.ok(fs.existsSync(path.join(fixture, 'nested')), 'the copy sits one folder below it');
    assert.ok(
        fs.existsSync(path.join(copyRoot, '.skilled', 'skills', 'system-spec-kit', 'SKILL.md')),
        'the copy holds the sentinel the resolver walks for',
    );
    assert.ok(
        fs.existsSync(path.join(
            copyRoot, '.skilled', 'skills', 'system-spec-kit', 'shared', 'workspace', 'repo-root.mjs',
        )),
        'the copy carries the shared resolver the scripts load',
    );
    assert.ok(
        !fs.existsSync(path.join(fixture, DECOY_OPENCODE, 'skills', 'system-spec-kit', 'SKILL.md')),
        'the decoy source-root name carries no sentinel',
    );
    assert.ok(
        fs.existsSync(path.join(copyRoot, '.skilled', 'skills', 'sk-code', 'mode-registry.json')),
        'the fixture hub is a registered hub',
    );
    assert.ok(
        fs.existsSync(scriptIn(copyRoot, 'sk-skill-check.cjs')),
        'the fixture runs copies of the working-tree scripts',
    );
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. NESTED COPY CASES
// ─────────────────────────────────────────────────────────────────────────────

test('nested hub: sk-skill-check reports the hub inside the nested copy', () => {
    const result = runScript(
        'sk-skill-check.cjs',
        ['check', 'sk-code-terraform', '--into-hub', 'sk-code', '--json'],
        { cwd: copyRoot, env: isolatedEnv() },
    );
    const report = JSON.parse(result.stdout);
    // The enclosing repository has no `sk-code` hub, so this value is only
    // reachable when the script resolved the copy it was launched from.
    assert.equal(report.hubPath, '.skilled/skills/sk-code');
    assert.doesNotMatch(result.stderr, /HUB_NOT_FOUND/);
});

test('nested freshness: the panel reads the compiled stamp of the nested copy', () => {
    const result = runScript('skill-graph-freshness.cjs', [], {
        cwd: copyRoot,
        env: isolatedEnv(),
    });
    const output = `${result.stdout}${result.stderr}`;
    assert.doesNotMatch(output, /panel error/);
    assert.match(output, new RegExp(FIXTURE_STAMP.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.equal(result.status, 0);
});

test('nested parent: parent-skill-check resolves the copy past the decoy', () => {
    const result = runScript('parent-skill-check.cjs', [], {
        cwd: copyRoot,
        env: isolatedEnv(),
    });
    const output = `${result.stdout}${result.stderr}`;
    // The child reports paths from its own real path, so the macOS `/var` to
    // `/private/var` spelling of the temporary folder must be resolved here too.
    const expected = fs.realpathSync(
        path.join(copyRoot, '.skilled', 'skills', 'system-deep-loop'),
    );
    assert.match(output, new RegExp(`Resolved:\\s+${expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
    assert.doesNotMatch(output, /Cannot find module/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. UNCHANGED LAYOUTS
// ─────────────────────────────────────────────────────────────────────────────

test('baseline layout: the Skilled checkout resolves to itself', () => {
    const hub = runScript(
        'sk-skill-check.cjs',
        ['check', 'sk-code-skilled', '--into-hub', 'sk-code', '--json'],
        { root: REPO_ROOT, cwd: REPO_ROOT, env: isolatedEnv() },
    );
    assert.equal(JSON.parse(hub.stdout).hubPath, '.skilled/skills/sk-code');

    const panel = runScript('skill-graph-freshness.cjs', [], {
        root: REPO_ROOT,
        cwd: REPO_ROOT,
        env: isolatedEnv(),
    });
    assert.doesNotMatch(`${panel.stdout}${panel.stderr}`, /panel error/);
    assert.equal(panel.status, 0);

    const parent = runScript('parent-skill-check.cjs', ['.skilled/skills/sk-code'], {
        root: REPO_ROOT,
        cwd: REPO_ROOT,
        env: isolatedEnv(),
    });
    assert.match(`${parent.stdout}${parent.stderr}`, /0 warnings/);
});

test('baseline layout: a linked .skilled resolves the shared checkout', () => {
    const hub = runScript(
        'sk-skill-check.cjs',
        ['check', 'sk-code-skilled', '--into-hub', 'sk-code', '--json'],
        { root: linkRoot, cwd: linkRoot, env: isolatedEnv() },
    );
    assert.equal(JSON.parse(hub.stdout).hubPath, '.skilled/skills/sk-code');

    const panel = runScript('skill-graph-freshness.cjs', [], {
        root: linkRoot,
        cwd: linkRoot,
        env: isolatedEnv(),
    });
    assert.doesNotMatch(`${panel.stdout}${panel.stderr}`, /panel error/);
    assert.equal(panel.status, 0);

    const parent = runScript('parent-skill-check.cjs', ['.skilled/skills/sk-code'], {
        root: linkRoot,
        cwd: linkRoot,
        env: isolatedEnv(),
    });
    assert.match(`${parent.stdout}${parent.stderr}`, /0 warnings/);

    // The documented override still outranks the resolver, so a fixture can
    // point the panel at a tree that is not the one its script lives in.
    const overridden = runScript('skill-graph-freshness.cjs', [], {
        root: linkRoot,
        cwd: linkRoot,
        env: isolatedEnv({ SKILL_GRAPH_FRESHNESS_ROOT: copyRoot }),
    });
    assert.match(`${overridden.stdout}${overridden.stderr}`, new RegExp(FIXTURE_STAMP.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.doesNotMatch(`${overridden.stdout}${overridden.stderr}`, /panel error/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. RESOLVER UNIT CASES
// ─────────────────────────────────────────────────────────────────────────────

test('resolver unit: a nested path resolves the folder holding its framework copy', () => {
    const { findRepoRoot } = require(path.join(SCRIPTS_DIR, 'lib', 'sk-skill-surface.cjs'));
    const start = path.join(copyRoot, '.skilled', 'commands', 'doctor', 'scripts');
    assert.equal(findRepoRoot(start), copyRoot);
});

test('resolver unit: a path with no sentinel hoists above its source tree', () => {
    const { findRepoRoot } = require(path.join(SCRIPTS_DIR, 'lib', 'sk-skill-surface.cjs'));
    const loose = path.join(fixture, 'loose');
    const start = path.join(loose, '.skilled', 'commands');
    fs.mkdirSync(start, { recursive: true });
    assert.equal(findRepoRoot(start), loose);
});
