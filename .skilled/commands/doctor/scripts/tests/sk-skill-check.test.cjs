#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Skilled Skill Check Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURE PATHS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const {
  checkNamedSkill,
  directSkillRoots,
  parseArguments,
  renderFleetText,
  renderHubText,
  runCheck,
  runFleet,
  runHubGapReport,
} = require('../sk-skill-check.cjs');
const surface = require('../lib/sk-skill-surface.cjs');

const REPO_ROOT = path.resolve(__dirname, '../../../../..');
const FIXTURE_ROOT = path.join(__dirname, 'fixtures', 'sk-skill-check');
const SKILLS_DIR = path.join(FIXTURE_ROOT, 'skills');
// The workflow and the presentation are the route's own documentation of this
// engine's output, so the parity tests read them beside the engine that prints it.
const ASSETS_DIR = path.resolve(__dirname, '..', '..', 'assets');
const CHECK_YAML = fs.readFileSync(path.join(ASSETS_DIR, 'doctor-sk-skill-check.yaml'), 'utf8');
const PRESENTATION = fs.readFileSync(path.join(ASSETS_DIR, 'doctor-sk-skill-presentation.txt'), 'utf8');
const PREFIX = ['lo', 'cal', String.fromCharCode(45)].join('');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CHILD PROCESS AND CONTEXT FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

function makeContext({
  fileSystem = fs,
  resolverPath,
  preflight = false,
  python = 'python3',
  env = process.env,
  skillsDir = SKILLS_DIR,
  packageCode = 0,
  packageCodes = [],
  packageFailures = {},
  metadataCode = 0,
  metadataCodes = [],
  metadataFleetCode = 0,
  metadataFleetResults = [],
  derivedResults = [{ status: 'unchanged' }],
  derivedCode = 0,
  advisorCode = 75,
  advisorPayload = { status: 'unavailable', data: { recommendations: [] } },
  hermesCode = 0,
  hermesOutput = 'PASS: in sync\n',
  auditCode = 0,
  auditPayload = { items: [] },
  pythonProbeResult = { code: 0, stdout: '', stderr: '', error: null },
  explicitRepoRoot = true,
} = {}) {
  const invocations = [];
  const context = surface.createContext({
    // A caller that names the repository pins every read to it, so a test that
    // exercises the other repository's path leaves the option out as the CLI does.
    ...(explicitRepoRoot ? { repoRoot: REPO_ROOT } : {}),
    skillsDir,
    cwd: REPO_ROOT,
    fs: fileSystem,
    python,
    env,
    skipPreflight: !preflight,
    paths: resolverPath ? { resolver: resolverPath } : {},
  });
  context.runCommand = (command, args, options = {}) => {
    invocations.push({ command, args, options });
    const script = args[0] || '';
    if (command === context.python && script === '-c') return pythonProbeResult;
    if (script.endsWith('package_skill.py')) {
      const name = path.basename(args[1] || '');
      const result = packageFailures[name] || { code: packageCode, codes: packageCodes };
      const message = result.message || (result.code === 0
        ? 'Strict package validation passed.'
        : `Strict package validation found issues: ${(result.codes || []).join(', ')}`);
      return {
        code: result.code,
        stdout: JSON.stringify({
          valid: result.code === 0,
          message,
          warnings: result.warnings || [],
          path: args[1],
        }),
        stderr: '',
        error: null,
      };
    }
    if (script.endsWith('ci-skill-root-metadata.cjs')) {
      const skillIndex = args.indexOf('--skill');
      if (skillIndex === -1) {
        return {
          code: metadataFleetCode,
          stdout: JSON.stringify({ results: metadataFleetResults }),
          stderr: '',
          error: null,
        };
      }
      const name = args[skillIndex + 1];
      const skillClass = name === 'hub' ? 'H' : 'S';
      return {
        code: metadataCode,
        stdout: JSON.stringify({
          checked: 1,
          failed: metadataCode === 0 ? 0 : 1,
          byClass: { H: skillClass === 'H' ? [name] : [], S: skillClass === 'S' ? [name] : [] },
          results: [{
            skill: name,
            skillClass,
            status: metadataCode === 0 ? 'pass' : 'fail',
            violations: metadataCodes.map((code) => ({ code })),
            notes: [],
          }],
        }),
        stderr: '',
        error: null,
      };
    }
    if (script.endsWith('regenerate-skill-derived.cjs')) {
      const rootIndex = args.indexOf('--root');
      const name = path.basename(args[rootIndex + 1] || '');
      return {
        code: derivedCode,
        stdout: JSON.stringify({
          total: derivedResults.length,
          changed: 0,
          errored: derivedResults.filter((entry) => entry.status === 'error').length,
          results: derivedResults.map((entry) => ({ name, ...entry })),
        }),
        stderr: '',
        error: null,
      };
    }
    if (script.endsWith('skill_graph_compiler.py')) {
      return { code: 0, stdout: 'validation passed\n', stderr: '', error: null };
    }
    if (script.endsWith('skill-graph-freshness.cjs')) {
      return { code: 0, stdout: 'PASS\n', stderr: '', error: null };
    }
    if (script.endsWith('skill-advisor.cjs')) {
      return { code: advisorCode, stdout: JSON.stringify(advisorPayload), stderr: '', error: null };
    }
    if (script.endsWith('sync-skills-hermes.cjs')) {
      return { code: hermesCode, stdout: hermesOutput, stderr: '', error: null };
    }
    if (script.endsWith('audit_descriptions.py')) {
      return { code: auditCode, stdout: JSON.stringify(auditPayload), stderr: '', error: null };
    }
    throw new Error(`Unexpected child command: ${script}`);
  };
  return { context, invocations };
}

function reportFor(relativePath, options = {}) {
  const { context, invocations } = makeContext(options);
  const report = checkNamedSkill(path.join(FIXTURE_ROOT, relativePath), context);
  return { report, invocations };
}

function withChangelogLinks(links, fileSystem = fs) {
  const sourceDirectories = new Set(links.map(({ root }) => path.resolve(root, 'changelog')));
  const sourceByLink = new Map(links.map(({ root, link }) => (
    [path.resolve(link), path.resolve(root, 'changelog')]
  )));
  const releaseFiles = new Set([...sourceDirectories].map((directory) => (
    path.resolve(directory, 'v1.0.0.0.md')
  )));
  return new Proxy(fileSystem, {
    get(target, property) {
      if (property === 'statSync') {
        return (candidate, ...args) => (sourceDirectories.has(path.resolve(String(candidate)))
          ? { isDirectory: () => true }
          : target.statSync(candidate, ...args));
      }
      if (property === 'existsSync') {
        return (candidate, ...args) => (releaseFiles.has(path.resolve(String(candidate)))
          || target.existsSync(candidate, ...args));
      }
      if (property === 'realpathSync') {
        return (candidate, ...args) => {
          const resolved = path.resolve(String(candidate));
          if (sourceDirectories.has(resolved)) return resolved;
          if (sourceByLink.has(resolved)) return sourceByLink.get(resolved);
          return target.realpathSync(candidate, ...args);
        };
      }
      const value = Reflect.get(target, property, target);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
}

function withoutRuntimeMirrors() {
  const runtimeDirectories = new Set([
    path.resolve(REPO_ROOT, '.claude', 'skills'),
    path.resolve(REPO_ROOT, '.opencode', 'skills'),
    path.resolve(REPO_ROOT, '.pi', 'skills'),
    path.resolve(REPO_ROOT, '.devin', 'skills'),
  ]);
  return new Proxy(fs, {
    get(target, property) {
      if (property === 'existsSync') {
        return (candidate, ...args) => (runtimeDirectories.has(path.resolve(String(candidate)))
          ? false
          : target.existsSync(candidate, ...args));
      }
      const value = Reflect.get(target, property, target);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
}

function createTempSkills(names) {
  const scratchDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sk-skill-check-'));
  const skillsDir = path.join(scratchDir, 'skills');
  fs.mkdirSync(skillsDir);
  for (const name of names) {
    const skillDir = path.join(skillsDir, name);
    fs.mkdirSync(skillDir);
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), `---\nname: ${name}\ndescription: Temporary fixture.\n---\n`);
  }
  return { scratchDir, skillsDir, names };
}

function removeTempSkills(fixture) {
  fs.rmSync(fixture.scratchDir, { recursive: true, force: true });
}

function createPythonPathFixture({ secondExitCode = 0 } = {}) {
  const scratchDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sk-skill-check-'));
  const firstDir = path.join(scratchDir, 'first');
  const secondDir = path.join(scratchDir, 'second');
  const firstPath = path.join(firstDir, 'python3');
  const secondPath = path.join(secondDir, 'python3');
  fs.mkdirSync(firstDir);
  fs.mkdirSync(secondDir);
  fs.writeFileSync(firstPath, '#!/bin/sh\nexit 1\n');
  fs.writeFileSync(secondPath, `#!/bin/sh\nexit ${secondExitCode}\n`);
  fs.chmodSync(firstPath, 0o755);
  fs.chmodSync(secondPath, 0o755);
  return { scratchDir, firstDir, secondDir, firstPath, secondPath };
}

function createPythonProbeContext(fixture, { environmentPython } = {}) {
  const env = {
    ...process.env,
    PATH: [fixture.firstDir, fixture.firstDir, fixture.secondDir].join(path.delimiter),
  };
  delete env.PYTHON;
  const contextOptions = {
    repoRoot: REPO_ROOT,
    cwd: REPO_ROOT,
    env,
    moduleResolver: () => true,
  };
  if (environmentPython !== undefined) env.PYTHON = environmentPython;
  else contextOptions.python = null;

  const context = surface.createContext(contextOptions);
  const probes = [];
  context.runCommand = (command, args, options = {}) => {
    probes.push({ command, args, options });
    const result = spawnSync(command, args, {
      cwd: options.cwd,
      env: options.env,
      encoding: 'utf8',
      timeout: options.timeoutMs,
    });
    return {
      code: Number.isInteger(result.status) ? result.status : null,
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      error: result.error ? result.error.message : null,
    };
  };
  return { context, probes };
}

function removePythonPathFixture(fixture) {
  fs.rmSync(fixture.scratchDir, { recursive: true, force: true });
}

// A converted skill in a second Skilled repository: its own skills root, its own
// changelog index link and its own derived validator, whose repository root is the
// folder it was copied into. The validator is the shipped one, so a run that reads
// it proves the repository the row actually resolved its key files against.
function createConvertedRepo(skillName = 'fixture-cross-repo') {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sk-skill-check-'));
  const skillsDir = path.join(repoRoot, '.skilled', 'skills');
  const skillRoot = path.join(skillsDir, skillName);
  const changelogDir = path.join(skillRoot, 'changelog');
  fs.mkdirSync(changelogDir, { recursive: true });
  fs.writeFileSync(path.join(skillRoot, 'SKILL.md'), [
    '---',
    `name: ${skillName}`,
    'description: A converted skill that lives in a second Skilled repository.',
    'version: 1.0.0.0',
    'allowed-tools:',
    '  - "Read"',
    '---',
    '',
    `# ${skillName}`,
    '',
    'Load `references/field-notes.md` before choosing a review path.',
    '',
  ].join('\n'));
  fs.writeFileSync(path.join(skillRoot, 'ROUTER.md'), [
    '---',
    `title: "${skillName} Router"`,
    'description: "The sibling router the resolver reads."',
    'importance_tier: normal',
    'contextType: general',
    'version: 1.0.0.0',
    'router_state: active',
    'skill_pointer: SKILL.md',
    '---',
    '',
    '## 3. MACHINE ROUTER',
    '',
    '```python',
    'INTENT_SIGNALS = {',
    '    "PRIMARY": {"weight": 4, "keywords": ["cross repo review"]},',
    '}',
    '',
    'RESOURCE_MAP = {',
    '    "PRIMARY": ["references/field-notes.md"],',
    '}',
    '```',
    '',
  ].join('\n'));
  fs.writeFileSync(path.join(skillRoot, 'graph-metadata.json'), `${JSON.stringify({
    schema_version: 2,
    skill_id: skillName,
    family: 'sk-util',
    category: 'utility',
    intent_signals: ['cross repo review', 'read cross repo notes'],
    derived: {
      trigger_phrases: ['cross repo review', 'read cross repo notes'],
      key_topics: ['cross repo review'],
      key_files: [`.skilled/skills/${skillName}/SKILL.md`],
      entities: [{ name: skillName, kind: 'skill', path: `.skilled/skills/${skillName}/SKILL.md`, source: 'derived' }],
      source_docs: ['SKILL.md'],
      causal_summary: 'Reports a converted skill against the repository that owns it.',
    },
  }, null, 2)}\n`);
  fs.writeFileSync(path.join(changelogDir, 'v1.0.0.0.md'), [
    '---',
    `title: "${skillName} v1.0.0.0"`,
    'importance_tier: normal',
    'contextType: general',
    'version: 1.0.0.0',
    '---',
    '',
    'The conversion made this skill a standalone Skilled root.',
    '',
  ].join('\n'));
  const createSkillScripts = path.join(skillsDir, 'sk-doc', 'sk-create-skill', 'scripts');
  fs.mkdirSync(createSkillScripts, { recursive: true });
  fs.copyFileSync(
    path.join(REPO_ROOT, '.skilled', 'skills', 'sk-doc', 'sk-create-skill', 'scripts', 'regenerate-skill-derived.cjs'),
    path.join(createSkillScripts, 'regenerate-skill-derived.cjs'),
  );
  const changelogIndex = path.join(repoRoot, '.skilled', 'changelog');
  fs.mkdirSync(changelogIndex, { recursive: true });
  fs.symlinkSync(path.join('..', 'skills', skillName, 'changelog'), path.join(changelogIndex, skillName), 'dir');
  return { repoRoot, skillsDir, skillRoot, changelogDir };
}

function removeConvertedRepo(fixture) {
  fs.rmSync(fixture.repoRoot, { recursive: true, force: true });
}

function getRow(report, id) {
  return report.rows.find((entry) => entry.row === id);
}

function withPrivateName(filePath) {
  return new Proxy(fs, {
    get(target, property) {
      if (property === 'readFileSync') {
        return (candidate, ...args) => {
          const contents = target.readFileSync(candidate, ...args);
          if (path.resolve(String(candidate)) === path.resolve(filePath)) {
            return contents.replace('__PRIVATE_NAME_TOKEN__', `${PREFIX}fixture`);
          }
          return contents;
        };
      }
      const value = Reflect.get(target, property, target);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CLASSIFICATION AND ROW CONTRACT
// ─────────────────────────────────────────────────────────────────────────────

test('deep reports classify plain, pre-migration, canon, and dual declarations', () => {
  const cases = [
    ['skills/plain', 'plain', 'none'],
    ['skills/pre-migration', 'older-skilled', 'skill-md'],
    ['skills/canon', 'canon', 'router-md'],
    ['skills/dual', 'dual-declaration', 'dual-declaration'],
  ];
  for (const [fixture, kind, verdict] of cases) {
    const { report, invocations } = reportFor(fixture);
    assert.equal(report.inputKind, kind);
    assert.equal(getRow(report, 'C2').resolverVerdict, verdict);
    if (fixture === 'skills/dual') assert.equal(getRow(report, 'C2').status, 'FINDING');
    if (fixture === 'skills/pre-migration') assert.equal(getRow(report, 'C5').status, 'FINDING');
    assert.deepEqual(report.rows.map((entry) => entry.row), Array.from({ length: 13 }, (_, index) => `C${index + 1}`));
    assert.equal(getRow(report, 'C8').status, 'UNKNOWN');
    const advisorCalls = invocations.filter(({ args }) => args[0].endsWith('skill-advisor.cjs'));
    assert.ok(advisorCalls.length <= 3);
  }
});

test('outside-root and nested packet fixtures report their locations', () => {
  const outside = reportFor('outside-root', {
    auditPayload: {
      items: [{ surface: 'skill', name: 'fixture-outside-root', status: 'HARD-FAIL', length: 999 }],
    },
  });
  assert.equal(getRow(outside.report, 'C1').location, 'outside');
  assert.equal(getRow(outside.report, 'C1').status, 'INFO');
  assert.equal(getRow(outside.report, 'C3').status, 'PASS');
  assert.equal(getRow(outside.report, 'C4').status, 'PASS');
  assert.equal(getRow(outside.report, 'C8').status, 'INFO');
  assert.match(getRow(outside.report, 'C8').detail, /not in the repository advisor or corpus/i);
  assert.equal(getRow(outside.report, 'C9').status, 'INFO');
  assert.ok(getRow(outside.report, 'C9').mirrors.every((mirror) => mirror.endsWith(':not-included')));
  assert.equal(getRow(outside.report, 'C11').length, Array.from('A synthetic skill stored outside the direct skills root.').length);
  assert.equal(getRow(outside.report, 'C13').status, 'INFO');
  assert.match(getRow(outside.report, 'C13').detail, /not in the repository advisor or corpus/i);
  assert.ok(!outside.invocations.some(({ args }) => (
    args[0].endsWith('audit_descriptions.py')
    || args[0].endsWith('skill-advisor.cjs')
    || args[0].endsWith('sync-skills-hermes.cjs')
  )));

  const nested = reportFor('skills/nested-packets/hub/modes/fixture-nested-mode');
  assert.equal(getRow(nested.report, 'C1').location, 'nested');
  assert.equal(getRow(nested.report, 'C1').status, 'INFO');
  assert.equal(getRow(nested.report, 'C2').status, 'INFO');
  assert.equal(nested.report.inputKind, 'hub-packet');
});

// A skill can sit in a second Skilled repository. The skills root it is classified
// against, the changelog index and every validator that resolves repository-relative
// paths belong to the repository that owns the target, so a converted skill is judged
// by its own tree rather than by the checkout that happened to run the check.
test('a skill in another Skilled repository is judged against its own repository', () => {
  const fixture = createConvertedRepo();
  try {
    const { context } = makeContext({
      skillsDir: path.join(REPO_ROOT, '.skilled', 'skills'),
      explicitRepoRoot: false,
    });
    const ownerRoot = fs.realpathSync(fixture.repoRoot);
    const derivedRuns = [];
    const canned = context.runCommand;
    // The derived validator is not faked: it is the real one, and its repository
    // root is the folder it runs from, which is what the row has to get right.
    context.runCommand = (command, args, options = {}) => {
      const script = String(args[0] || '');
      if (!script.endsWith('regenerate-skill-derived.cjs')) return canned(command, args, options);
      derivedRuns.push(script);
      const result = spawnSync(command, args, {
        cwd: options.cwd,
        env: options.env,
        encoding: 'utf8',
        timeout: options.timeoutMs,
      });
      return {
        code: Number.isInteger(result.status) ? result.status : null,
        stdout: result.stdout || '',
        stderr: result.stderr || '',
        error: result.error ? result.error.message : null,
      };
    };

    const report = checkNamedSkill(path.join(fixture.skillsDir, 'fixture-cross-repo'), context);

    assert.equal(getRow(report, 'C1').location, 'direct');
    assert.equal(getRow(report, 'C1').status, 'PASS');
    assert.equal(getRow(report, 'C6').status, 'PASS', getRow(report, 'C6').detail);
    assert.equal(derivedRuns.length, 1);
    assert.equal(
      path.dirname(derivedRuns[0]),
      path.join(ownerRoot, '.skilled', 'skills', 'sk-doc', 'sk-create-skill', 'scripts'),
    );
    assert.equal(getRow(report, 'C10').status, 'PASS', getRow(report, 'C10').detail);
    for (const row of report.rows) {
      assert.ok(row.detail.includes(ownerRoot), `${row.row} names its repository: ${row.detail}`);
    }
    assert.equal(report.exitCode, 0, JSON.stringify(report.rows.filter((row) => row.status === 'FINDING')));
  } finally {
    removeConvertedRepo(fixture);
  }
});

test('a direct hub and its router packet are informational and use parent metadata', () => {
  const hub = reportFor('skills/hub');
  assert.equal(hub.report.inputKind, 'hub');
  assert.equal(getRow(hub.report, 'C1').status, 'INFO');
  assert.equal(getRow(hub.report, 'C2').status, 'INFO');
  assert.equal(getRow(hub.report, 'C4').metadataClass, 'H');
  assert.ok(hub.invocations.some(({ args }) => (
    args[0].endsWith('ci-skill-root-metadata.cjs') && args.includes('hub')
  )));

  const packet = reportFor('skills/hub/modes/sk-packet');
  assert.equal(packet.report.inputKind, 'hub-packet');
  assert.equal(getRow(packet.report, 'C1').status, 'INFO');
  assert.equal(getRow(packet.report, 'C2').status, 'INFO');
  assert.match(getRow(packet.report, 'C2').detail, /Resolver verdict: router-md/);
  assert.match(getRow(packet.report, 'C4').detail, /parent hub metadata/i);
});

test('changelog checks resolve standalone, hub-parent, and nested packet links', () => {
  const canonRoot = path.join(SKILLS_DIR, 'canon');
  const hubRoot = path.join(SKILLS_DIR, 'hub');
  const packetRoot = path.join(hubRoot, 'modes', 'sk-packet');
  const fileSystem = withChangelogLinks([
    { root: canonRoot, link: path.join(REPO_ROOT, '.skilled', 'changelog', 'fixture-canon') },
    { root: hubRoot, link: path.join(REPO_ROOT, '.skilled', 'changelog', 'hub', 'parent') },
    { root: packetRoot, link: path.join(REPO_ROOT, '.skilled', 'changelog', 'hub', 'packet') },
  ]);

  for (const target of ['skills/canon', 'skills/hub', 'skills/hub/modes/sk-packet']) {
    const { report } = reportFor(target, { fileSystem });
    assert.equal(getRow(report, 'C10').status, 'PASS', target);
  }
});

test('a router the replay reader cannot read is a fault only for a dual declaration and a hub', () => {
  const canonical = reportFor('skills/canon').report;
  assert.equal(getRow(canonical, 'C7').status, 'PASS');
  assert.match(getRow(canonical, 'C7').detail, /Parsed 1 intent signal groups and 1 resource-map entries/);
  assert.equal(getRow(canonical, 'C7').intentCount, 1);

  const modeTemplate = reportFor('skills/mode-template').report;
  assert.equal(getRow(modeTemplate, 'C7').status, 'INFO');
  assert.match(getRow(modeTemplate, 'C7').detail, /intent map whose keys the replay reader does not read/);

  const pseudocode = reportFor('skills/plain').report;
  assert.equal(getRow(pseudocode, 'C7').status, 'INFO');
  assert.match(getRow(pseudocode, 'C7').detail, /pseudocode alone/);

  const packet = reportFor('skills/nested-packets/hub/modes/fixture-nested-mode').report;
  assert.equal(packet.inputKind, 'hub-packet');
  assert.equal(getRow(packet, 'C7').status, 'INFO');

  const hub = reportFor('skills/hub').report;
  assert.equal(hub.inputKind, 'hub');
  assert.equal(getRow(hub, 'C7').status, 'FINDING');
  assert.match(getRow(hub, 'C7').detail, /hub's map is never relaxed/);

  const dual = reportFor('skills/dual').report;
  assert.equal(getRow(dual, 'C7').status, 'FINDING');
  assert.match(getRow(dual, 'C7').detail, /both declare a machine router/i);
});

test('reserved-prefix fixture is flagged without exposing its private name', () => {
  const skillFile = path.join(SKILLS_DIR, 'prefix-case', 'SKILL.md');
  const fileSystem = withPrivateName(skillFile);
  const { report } = reportFor('skills/prefix-case', { fileSystem });
  const serialized = JSON.stringify(report);
  assert.equal(report.skill, '[private skill]');
  assert.equal(getRow(report, 'C12').status, 'FINDING');
  assert.ok(!serialized.includes(`${PREFIX}fixture`));
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. JSON, FAILURE, AND PROBE CONTRACTS
// ─────────────────────────────────────────────────────────────────────────────

test('JSON mode emits all thirteen row objects and the text mode prints the deep report', () => {
  const canonRoot = path.join(SKILLS_DIR, 'canon');
  const fileSystem = withChangelogLinks([{
    root: canonRoot,
    link: path.join(REPO_ROOT, '.skilled', 'changelog', 'fixture-canon'),
  }], withoutRuntimeMirrors());
  const { context } = makeContext({ fileSystem });
  let jsonText = '';
  let jsonError = '';
  const jsonCode = runCheck(['check', 'canon', '--json'], {
    context,
    stdout: { write: (chunk) => { jsonText += chunk; } },
    stderr: { write: (chunk) => { jsonError += chunk; } },
  });
  const parsed = JSON.parse(jsonText);
  assert.equal(jsonCode, 0, JSON.stringify(parsed.rows.filter((entry) => entry.status === 'FINDING')));
  assert.equal(jsonError, '');
  assert.deepEqual(parsed.rows.map((entry) => entry.row), Array.from({ length: 13 }, (_, index) => `C${index + 1}`));
  assert.equal(parsed.findingCount, 0);
  assert.equal(parsed.unknownCount, 1);
  assert.equal(parsed.rows.find((entry) => entry.row === 'C8').status, 'UNKNOWN');

  let text = '';
  const textCode = runCheck(['check', 'canon'], {
    context,
    stdout: { write: (chunk) => { text += chunk; } },
    stderr: { write: () => {} },
  });
  assert.equal(textCode, 0);
  assert.match(text, /Skill check: fixture-canon \(canon\)/);
  assert.match(text, /C13\s+INFO\s+Regression coverage/);
  assert.match(text, /Result: NO FINDINGS \(1 UNKNOWN\)/);
});

test('an unavailable advisor stays UNKNOWN without counting as a finding', () => {
  const canonRoot = path.join(SKILLS_DIR, 'canon');
  const fileSystem = withChangelogLinks([{
    root: canonRoot,
    link: path.join(REPO_ROOT, '.skilled', 'changelog', 'fixture-canon'),
  }], withoutRuntimeMirrors());
  const { report, invocations } = reportFor('skills/canon', { fileSystem });
  assert.equal(getRow(report, 'C8').status, 'UNKNOWN');
  assert.equal(report.findingCount, 0, JSON.stringify(report.rows.filter((entry) => entry.status === 'FINDING')));
  assert.equal(report.unknownCount, 1);
  assert.equal(report.exitCode, 0);
  assert.equal(invocations.filter(({ args }) => args[0].endsWith('skill-advisor.cjs')).length, 3);
});

test('validator codes appear in both the deep text and JSON reports', () => {
  const options = {
    packageFailures: {
      plain: {
        code: 1,
        message: 'Strict package validation found RS-002 in the skill router.',
        warnings: ['RS-004: required router file is missing.'],
      },
    },
    metadataCode: 1,
    metadataCodes: ['RRC-001'],
  };
  let jsonText = '';
  const jsonCode = runCheck(['check', 'plain', '--json'], {
    context: makeContext(options).context,
    stdout: { write: (chunk) => { jsonText += chunk; } },
    stderr: { write: () => {} },
  });
  const parsed = JSON.parse(jsonText);
  assert.equal(jsonCode, 1);
  assert.deepEqual(getRow(parsed, 'C3').codes, ['RS-002', 'RS-004']);
  assert.deepEqual(getRow(parsed, 'C4').codes, ['RRC-001']);

  let text = '';
  const textCode = runCheck(['check', 'plain'], {
    context: makeContext(options).context,
    stdout: { write: (chunk) => { text += chunk; } },
    stderr: { write: () => {} },
  });
  assert.equal(textCode, 1);
  assert.match(text, /Format: .*Codes: RS-002, RS-004/);
  assert.match(text, /Root metadata: .*Codes: RRC-001/);
});

test('package failure without a code uses the first message line as detail', () => {
  const { report } = reportFor('skills/plain', {
    packageFailures: {
      plain: {
        code: 1,
        message: 'The skill description is missing.\nThe package cannot be installed.',
        warnings: [],
      },
    },
  });
  assert.equal(getRow(report, 'C3').detail, 'The skill description is missing.');
  assert.deepEqual(getRow(report, 'C3').codes, []);
});

test('fleet output covers one passing root and one finding root with a codes column', () => {
  const fixture = createTempSkills(['pass-root', 'finding-root']);
  try {
    const { context } = makeContext({
      skillsDir: fixture.skillsDir,
      packageFailures: { 'finding-root': { code: 1, codes: ['RS-008'] } },
      metadataFleetCode: 1,
      metadataFleetResults: [
        { skill: 'pass-root', skillClass: 'S', status: 'pass', violations: [] },
        { skill: 'finding-root', skillClass: 'S', status: 'fail', violations: [{ code: 'RRC-003' }] },
      ],
    });
    assert.deepEqual(directSkillRoots(fixture.skillsDir).map((root) => path.basename(root)), [
      'finding-root',
      'pass-root',
    ]);
    const report = runFleet(context);
    const text = renderFleetText(report);
    const lines = text.trimEnd().split('\n');
    assert.equal(report.count, 2);
    assert.equal(report.findingCount, 1);
    assert.equal(report.unknownCount, 0);
    assert.equal(report.exitCode, 1);
    assert.match(lines[1], /Skill\s+Format\s+Metadata\s+Codes\s+Verdict/);
    assert.equal(lines[1].indexOf('Format'), lines[2].indexOf('FINDING'));
    assert.ok(lines[1].indexOf('Format') >= 'finding-root'.length + 2);
    assert.match(text, /RRC-003, RS-008/);
    assert.match(text, /Roots: 2; result: FINDINGS \(1\)/);
  } finally {
    removeTempSkills(fixture);
  }
});

test('C6 reports generated content that would change', () => {
  const { report } = reportFor('skills/plain', { derivedResults: [{ status: 'would-change' }] });
  assert.equal(getRow(report, 'C6').status, 'FINDING');
  assert.match(getRow(report, 'C6').detail, /would change/);
});

test('C6 maps a skipped derived check to not applicable', () => {
  const { report } = reportFor('skills/plain', {
    derivedResults: [{ status: 'skipped', reason: 'no graph-metadata.json' }],
  });
  assert.equal(getRow(report, 'C6').status, 'INFO');
  assert.match(getRow(report, 'C6').detail, /not applicable: no graph-metadata\.json/i);
});

test('C6 maps a per-skill derived error row to a finding', () => {
  const { report } = reportFor('skills/plain', {
    derivedCode: 2,
    derivedResults: [{ status: 'error', errors: ['derived.trigger_phrases is missing'] }],
  });
  assert.equal(getRow(report, 'C6').status, 'FINDING');
  assert.match(getRow(report, 'C6').detail, /derived\.trigger_phrases is missing/);
  assert.equal(report.exitCode, 1);
});

test('advisor hits require a matching recommendation skill id', () => {
  const { report } = reportFor('skills/canon', {
    advisorCode: 0,
    advisorPayload: {
      status: 'ok',
      data: { recommendations: [{ skillId: 'another-skill' }] },
    },
  });
  assert.equal(getRow(report, 'C8').hits, 0);
});

test('advisor recommendations fall back to the top-level compatibility field', () => {
  const { report } = reportFor('skills/canon', {
    advisorCode: 0,
    advisorPayload: { recommendations: [{ skillId: 'fixture-canon' }] },
  });
  assert.equal(getRow(report, 'C8').hits, 3);
});

test('advisor recommendations in the live data envelope count matching hits', () => {
  const { report } = reportFor('skills/canon', {
    advisorCode: 0,
    advisorPayload: {
      status: 'ok',
      data: { recommendations: [{ skillId: 'fixture-canon' }] },
    },
  });
  assert.equal(getRow(report, 'C8').hits, 3);
});

test('C11 ignores a hard-failed description belonging to another skill', () => {
  const { report } = reportFor('skills/plain', {
    auditCode: 1,
    auditPayload: {
      hardFails: ['another-skill'],
      items: [
        { surface: 'skill', name: 'fixture-plain', status: 'OK', length: 100 },
        { surface: 'skill', name: 'another-skill', status: 'HARD-FAIL', length: 2000 },
      ],
    },
  });
  assert.equal(getRow(report, 'C11').status, 'PASS');
});

test('bare skill names resolve to one nested hub packet', () => {
  const fixture = createTempSkills([]);
  const packet = path.join(fixture.skillsDir, 'sk-code', 'sk-code-skilled');
  fs.mkdirSync(packet, { recursive: true });
  fs.writeFileSync(path.join(packet, 'SKILL.md'), '---\nname: sk-code-skilled\ndescription: Nested packet.\n---\n');
  try {
    const { context } = makeContext({ skillsDir: fixture.skillsDir });
    assert.equal(surface.resolveSkillTarget('sk-code-skilled', context), fs.realpathSync(packet));
  } finally {
    removeTempSkills(fixture);
  }
});

test('bare skill names report every match when direct and nested roots collide', () => {
  const fixture = createTempSkills(['duplicate-skill']);
  const packet = path.join(fixture.skillsDir, 'parent', 'duplicate-skill');
  fs.mkdirSync(packet, { recursive: true });
  fs.writeFileSync(path.join(packet, 'SKILL.md'), '---\nname: duplicate-skill\ndescription: Nested duplicate.\n---\n');
  try {
    const { context } = makeContext({ skillsDir: fixture.skillsDir });
    assert.throws(() => surface.resolveSkillTarget('duplicate-skill', context), (error) => (
      error.code === 'SKILL_NOT_FOUND'
      && error.message.includes('duplicate-skill')
      && error.message.includes('parent/duplicate-skill')
    ));
  } finally {
    removeTempSkills(fixture);
  }
});

test('Hermes drift in another skill does not fail the requested skill', () => {
  const unrelated = reportFor('skills/canon', {
    fileSystem: withoutRuntimeMirrors(),
    hermesCode: 1,
    hermesOutput: 'DRIFT another-skill\nFAIL: 1 drifted, 0 stale\n',
  });
  assert.equal(getRow(unrelated.report, 'C9').status, 'PASS');

  const matching = reportFor('skills/canon', {
    fileSystem: withoutRuntimeMirrors(),
    hermesCode: 1,
    hermesOutput: 'DRIFT fixture-canon\nFAIL: 1 drifted, 0 stale\n',
  });
  assert.equal(getRow(matching.report, 'C9').status, 'FINDING');
});

test('argument parse errors retain the usage code', () => {
  assert.throws(() => parseArguments(['--json', '--json']), (error) => error.code === 'USAGE');
  assert.throws(() => parseArguments(['one', 'two']), (error) => error.code === 'USAGE');
});

test('Python and PyYAML preconditions exit 2 with provision guidance and bytecode disabled', () => {
  const cases = [
    [
      { code: null, stdout: '', stderr: '', error: 'spawn python3 ENOENT' },
      'PYTHON_MISSING',
    ],
    [
      { code: 1, stdout: '', stderr: "ModuleNotFoundError: No module named 'yaml'", error: null },
      'PYYAML_MISSING',
    ],
  ];
  for (const [pythonProbeResult, expectedCode] of cases) {
    const { context, invocations } = makeContext({ preflight: true, pythonProbeResult });
    let stderr = '';
    const code = runCheck(['check', 'plain'], {
      context,
      stdout: { write: () => {} },
      stderr: { write: (chunk) => { stderr += chunk; } },
    });
    assert.equal(code, 2);
    assert.match(stderr, new RegExp(expectedCode));
    assert.match(stderr, /Provision: .+/);
    const probe = invocations.find(({ command, args }) => command === context.python && args[0] === '-c');
    assert.ok(probe);
    assert.equal(probe.options.env.PYTHONDONTWRITEBYTECODE, '1');
  }
});

test('unset PYTHON tries distinct PATH interpreters until one imports yaml', () => {
  const fixture = createPythonPathFixture();
  try {
    const { context, probes } = createPythonProbeContext(fixture);

    surface.ensurePreconditions(context, { requireRouter: false });

    assert.equal(context.python, fixture.secondPath);
    assert.deepEqual(probes.map(({ command }) => command), [fixture.firstPath, fixture.secondPath]);
    assert.ok(probes.every(({ options }) => options.env.PYTHONDONTWRITEBYTECODE === '1'));
  } finally {
    removePythonPathFixture(fixture);
  }
});

test('unset PYTHON reports every interpreter when none imports yaml', () => {
  const fixture = createPythonPathFixture({ secondExitCode: 1 });
  try {
    const { context, probes } = createPythonProbeContext(fixture);

    assert.throws(() => surface.ensurePreconditions(context, { requireRouter: false }), (error) => {
      assert.equal(error.code, 'PYYAML_MISSING');
      assert.ok(error.provision.includes(fixture.firstPath));
      assert.ok(error.provision.includes(fixture.secondPath));
      return true;
    });
    assert.deepEqual(probes.map(({ command }) => command), [fixture.firstPath, fixture.secondPath]);
  } finally {
    removePythonPathFixture(fixture);
  }
});

test('PYTHON uses only the configured interpreter even when PATH has another candidate', () => {
  const fixture = createPythonPathFixture();
  try {
    const { context, probes } = createPythonProbeContext(fixture, { environmentPython: fixture.firstPath });

    assert.throws(() => surface.ensurePreconditions(context, { requireRouter: false }), (error) => {
      assert.equal(error.code, 'PYYAML_MISSING');
      assert.equal(error.provision, `${fixture.firstPath} -m pip install PyYAML`);
      return true;
    });
    assert.deepEqual(probes.map(({ command }) => command), [fixture.firstPath]);
  } finally {
    removePythonPathFixture(fixture);
  }
});

test('empty PYTHON does not fall back to PATH discovery', () => {
  const fixture = createPythonPathFixture();
  try {
    const { context, probes } = createPythonProbeContext(fixture, { environmentPython: '' });

    assert.throws(() => surface.ensurePreconditions(context, { requireRouter: false }), (error) => {
      assert.equal(error.code, 'PYTHON_MISSING');
      assert.match(error.provision, /make python3 available on PATH/);
      return true;
    });
    assert.equal(probes.length, 0);
  } finally {
    removePythonPathFixture(fixture);
  }
});

test('every child process receives the no-bytecode environment', () => {
  const canonRoot = path.join(SKILLS_DIR, 'canon');
  const fileSystem = withChangelogLinks([{
    root: canonRoot,
    link: path.join(REPO_ROOT, '.skilled', 'changelog', 'fixture-canon'),
  }], withoutRuntimeMirrors());
  const { context, invocations } = makeContext({ fileSystem, preflight: true });
  let output = '';
  const code = runCheck(['check', 'canon', '--json'], {
    context,
    stdout: { write: (chunk) => { output += chunk; } },
    stderr: { write: () => {} },
  });
  const report = JSON.parse(output);
  assert.equal(code, 0, JSON.stringify(report.rows.filter((entry) => entry.status === 'FINDING')));
  assert.ok(invocations.length > 0);
  assert.ok(invocations.every(({ options }) => options.env.PYTHONDONTWRITEBYTECODE === '1'));
});

test('missing machine-router resolver exits 2 with a named cause and provision command', () => {
  const missing = path.join(FIXTURE_ROOT, 'missing-router-resolver.cjs');
  const { context } = makeContext({ resolverPath: missing, preflight: true });
  let stderr = '';
  const code = runCheck(['check', 'plain', '--json'], {
    context,
    stdout: { write: () => {} },
    stderr: { write: (chunk) => { stderr += chunk; } },
  });
  assert.equal(code, 2);
  assert.match(stderr, /ROUTER_RESOLVER_MISSING/);
  assert.match(stderr, /worktree-naming\.sh provision/);
});

test('missing shared parser and Hermes dependency exit 2 with their provision commands', () => {
  const failures = [
    ['@spec-kit/shared/frontmatter/parse-frontmatter.js', 'SHARED_NOT_BUILT', /worktree-naming\.sh provision/],
    ['@spec-kit/shared/workspace/repo-root.mjs', 'HERMES_SHARED_MISSING', /npm install --prefix/],
  ];
  for (const [missingModule, codeName, provision] of failures) {
    const { context } = makeContext({ preflight: true });
    context.moduleResolver = (specifier) => {
      if (specifier === missingModule) throw new Error('module unavailable');
      return '/fixture/dependency';
    };
    let stderr = '';
    const code = runCheck(['check', 'plain'], {
      context,
      stdout: { write: () => {} },
      stderr: { write: (chunk) => { stderr += chunk; } },
    });
    assert.equal(code, 2);
    assert.match(stderr, new RegExp(codeName));
    assert.match(stderr, provision);
  }
});

test('malformed frontmatter path segments are reported without probing outside the root', () => {
  const root = path.join(SKILLS_DIR, 'plain');
  const collision = surface.inspectCollisions('../outside-root', root, SKILLS_DIR);
  const badName = surface.changelogStatus(root, '../outside-root', '1.0.0.0', REPO_ROOT);
  const badVersion = surface.changelogStatus(root, 'fixture-plain', '../escape', REPO_ROOT);
  assert.equal(collision.status, 'FINDING');
  assert.equal(collision.collisionCount, 0);
  assert.equal(badName.status, 'FINDING');
  assert.equal(badVersion.status, 'FINDING');
});

test('reserved root paths are redacted and filtered validators remain UNKNOWN', () => {
  const scratchDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sk-skill-check-'));
  const alias = path.join(scratchDir, `${PREFIX}fixture`);
  const source = path.join(SKILLS_DIR, 'plain');
  try {
    fs.symlinkSync(source, alias, 'dir');
    const { context, invocations } = makeContext();
    const report = checkNamedSkill(alias, context);
    assert.equal(report.skill, '[private skill]');
    assert.equal(getRow(report, 'C4').status, 'UNKNOWN');
    assert.equal(getRow(report, 'C6').status, 'UNKNOWN');
    assert.equal(getRow(report, 'C12').status, 'FINDING');
    assert.ok(!JSON.stringify(report).includes(path.basename(alias)));
    assert.ok(!invocations.some(({ args }) => (
      args[0].endsWith('ci-skill-root-metadata.cjs')
      || args[0].endsWith('regenerate-skill-derived.cjs')
    )));
  } finally {
    fs.rmSync(scratchDir, { recursive: true, force: true });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. HUB GAP REPORT
// ─────────────────────────────────────────────────────────────────────────────

const HUB_FIXTURES = path.join(FIXTURE_ROOT, 'hubs');
const HUB_GAP_ROOT = path.join(HUB_FIXTURES, 'hub-gap');
const HUB_INVENTORY_ROOT = path.join(HUB_FIXTURES, 'hub-inventory');
const HUB_SHARED_ROOT = path.join(HUB_FIXTURES, 'hub-shared-packet');

// A clean parent-skill-check transcript. The hub fixtures answer the registry
// membership, signal, manifest and table rows from their own files, so the
// subprocess is only the hub-wide corroboration those rows fold in.
const CLEAN_PARENT_OUTPUT = [
  'PASS: 3a: mode-registry.json exists and parses as JSON',
  'PASS: 3b: mode-registry.json declares 2 modes',
  'PASS: 5b: routerSignals keys match the registry workflowMode set (2)',
  'PASS: 5e: routerPolicy.tieBreak covers every registered mode',
  'PASS: 5i: tieBreak orders workflow modes before surface/transport modes',
  'PASS: 5k-alias: every registry alias is a keyword of its routerSignal classes',
  'PASS: 6b: every registered mode (2) appears in the hub SKILL.md mode table',
  'PASS: 6c: every mode-table row whose registry entry declares a command shows that exact command',
  'PASS: 8a: description.json present with the required fields',
  'PASS: 8b: description.json carries no registry-owned duplicate keys',
  'PASS: 10a-manifest-source: leaf-manifest.json is present and well-formed',
  'PASS: 10b-byte-drift: committed leaf-manifest.json matches a fresh regeneration byte for byte',
].join('\n') + '\n';

function makeHubContext({
  routerTargets = {},
  parentCode = 0,
  parentOutput = CLEAN_PARENT_OUTPUT,
  parentError = '',
  realParentCheck = false,
  advisorCode = 0,
  advisorPayload = [],
  mirrorCodes = {},
} = {}) {
  const invocations = [];
  const context = surface.createContext({
    repoRoot: REPO_ROOT,
    skillsDir: SKILLS_DIR,
    cwd: REPO_ROOT,
    python: 'python3',
    skipPreflight: true,
  });
  const mirror = (key) => ({ code: mirrorCodes[key] || 0, stdout: '', stderr: '', error: null });
  context.runCommand = (command, args, options = {}) => {
    invocations.push({ command, args, options });
    const script = args[0] || '';
    if (command === context.python && script === '-c') {
      return { code: 0, stdout: '', stderr: '', error: null };
    }
    if (script.endsWith('parent-skill-check.cjs')) {
      if (!realParentCheck) return { code: parentCode, stdout: parentOutput, stderr: parentError, error: null };
      const child = spawnSync(process.execPath, args, {
        cwd: options.cwd,
        env: options.env,
        encoding: 'utf8',
        timeout: options.timeoutMs,
      });
      return {
        code: Number.isInteger(child.status) ? child.status : null,
        stdout: child.stdout || '',
        stderr: child.stderr || '',
        error: child.error ? child.error.message : null,
      };
    }
    if (script.endsWith('compiled-route.cjs')) {
      const hub = args[args.indexOf('--hub') + 1];
      const targets = (routerTargets[hub] || []).map((mode) => ({ workflowMode: mode }));
      return { code: 0, stdout: JSON.stringify({ hubId: hub, action: 'route', targets }), stderr: '', error: null };
    }
    if (script.endsWith('skill_advisor.py')) {
      return { code: advisorCode, stdout: JSON.stringify(advisorPayload), stderr: '', error: null };
    }
    if (script.endsWith('validate-command-tree-parity.sh')) return mirror('parity');
    if (script.endsWith('sync-prompts.cjs') || script.endsWith('sync-prompts-pi.cjs')) {
      return mirror(script.includes('sync-prompts-pi') ? 'pi' : 'codex');
    }
    throw new Error(`Unexpected child command: ${script}`);
  };
  return { context, invocations };
}

function getHubRow(report, id) {
  return report.rows.find((row) => row.row === id);
}

function copyHubFixture(source, { remove = [] } = {}) {
  const scratchDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sk-skill-check-'));
  const hubRoot = path.join(scratchDir, path.basename(source));
  fs.cpSync(source, hubRoot, { recursive: true });
  for (const name of remove) fs.rmSync(path.join(hubRoot, name), { force: true });
  return { scratchDir, hubRoot };
}

function parentOutputWithout(...needles) {
  return CLEAN_PARENT_OUTPUT
    .split('\n')
    .filter((line) => !needles.some((needle) => line.includes(needle)))
    .join('\n');
}

test('the hub gap report carries all eleven rows and finds the mode with no stage-one signal', () => {
  const { context } = makeHubContext({ routerTargets: { 'fixture-hub-gap': ['fixture-gap-mode'] } });
  const report = runHubGapReport({ target: 'fixture-gap-mute', intoHub: HUB_GAP_ROOT }, context);

  assert.equal(report.mode, 'hub');
  assert.equal(report.skill, 'fixture-gap-mute');
  assert.equal(report.hub, 'hub-gap');
  assert.deepEqual(report.rows.map((row) => row.row), Array.from({ length: 11 }, (_, index) => `H${index + 1}`));
  assert.ok(report.rows.every((row) => row.label && row.evidence), 'every row names a label and its evidence');

  assert.equal(getHubRow(report, 'H2').status, 'FINDING');
  assert.match(getHubRow(report, 'H2').detail, /routerSignals has no entry for fixture-gap-mute/);
  assert.equal(report.findingCount, 1);
  assert.equal(report.exitCode, 1);

  for (const id of ['H1', 'H3', 'H4', 'H6', 'H7', 'H8', 'H9', 'H11']) {
    assert.equal(getHubRow(report, id).status, 'PASS', id);
  }
  assert.equal(getHubRow(report, 'H5').status, 'N/A');
  assert.equal(getHubRow(report, 'H10').status, 'N/A');
});

test('the hub gap report passes the mode the hub signals, replaying it once', () => {
  const { context, invocations } = makeHubContext({
    routerTargets: { 'fixture-hub-gap': ['fixture-gap-mode'] },
  });
  const report = runHubGapReport({ target: 'fixture-gap-mode', intoHub: HUB_GAP_ROOT }, context);

  assert.equal(report.exitCode, 0);
  assert.equal(report.findingCount, 0);
  assert.equal(getHubRow(report, 'H2').status, 'PASS');
  assert.match(getHubRow(report, 'H2').detail, /"fixture gap request"/);
  assert.equal(getHubRow(report, 'H9').status, 'PASS');

  const compiled = invocations.filter(({ args }) => String(args[0]).endsWith('compiled-route.cjs'));
  assert.equal(compiled.length, 1);
  assert.deepEqual(compiled[0].args.slice(1), ['--hub', 'fixture-hub-gap', '--prompt', 'fixture gap request']);
  assert.equal(invocations.filter(({ args }) => String(args[0]).endsWith('parent-skill-check.cjs')).length, 1);
  assert.ok(!invocations.some(({ args }) => String(args[0]).endsWith('skill_advisor.py')));
  assert.ok(!invocations.some(({ command, args }) => command === context.python && args[0] === '-c'));
});

test('a full-toolkit hub fills the inventory row and the advisor row for a lexical mode', () => {
  const { context, invocations } = makeHubContext({
    routerTargets: { 'fixture-hub-inventory': ['fixture-inventory-mode'] },
    advisorPayload: [{ skill: 'fixture-inventory-mode', workflowMode: 'fixture-inventory-mode' }],
  });
  const report = runHubGapReport({ target: 'fixture-inventory-mode', intoHub: HUB_INVENTORY_ROOT }, context);

  assert.equal(report.routingClass, 'lexical');
  assert.equal(report.exitCode, 0);
  assert.equal(getHubRow(report, 'H5').status, 'PASS');
  assert.match(getHubRow(report, 'H5').detail, /FULL_INVENTORY carries 1 fixture-inventory-mode\/ path/);
  assert.equal(getHubRow(report, 'H10').status, 'PASS');
  assert.match(getHubRow(report, 'H10').detail, /surfaced fixture-inventory-mode/);

  const advisor = invocations.filter(({ args }) => String(args[0]).endsWith('skill_advisor.py'));
  assert.equal(advisor.length, 1);
  assert.deepEqual(advisor[0].args.slice(1), ['fixture inventory request', '--threshold', '0.5']);
});

test('advisor exit 75 leaves the projection row UNKNOWN and never a pass', () => {
  const { context } = makeHubContext({
    routerTargets: { 'fixture-hub-inventory': ['fixture-inventory-mode'] },
    advisorCode: 75,
    advisorPayload: { error: 'native advisor unavailable' },
  });
  const report = runHubGapReport({ target: 'fixture-inventory-mode', intoHub: HUB_INVENTORY_ROOT }, context);

  assert.equal(getHubRow(report, 'H10').status, 'UNKNOWN');
  assert.match(getHubRow(report, 'H10').detail, /exit 75/);
  assert.equal(report.unknownCount, 1);
  assert.equal(report.findingCount, 0);
  assert.equal(report.exitCode, 0);
  assert.deepEqual(report.unverified, []);
});

test('an advisor that returns no matching recommendation is a projection finding', () => {
  const { context } = makeHubContext({
    routerTargets: { 'fixture-hub-inventory': ['fixture-inventory-mode'] },
    advisorPayload: [{ skill: 'another-skill' }],
  });
  const report = runHubGapReport({ target: 'fixture-inventory-mode', intoHub: HUB_INVENTORY_ROOT }, context);

  assert.equal(getHubRow(report, 'H10').status, 'FINDING');
  assert.equal(report.exitCode, 1);
});

test('mirror drift is a finding and an unreadable mirror checker exits 2', () => {
  const drift = makeHubContext({
    routerTargets: { 'fixture-hub-gap': ['fixture-gap-mode'] },
    mirrorCodes: { parity: 1 },
  });
  const drifted = runHubGapReport({ target: 'fixture-gap-mode', intoHub: HUB_GAP_ROOT }, drift.context);
  assert.equal(getHubRow(drifted, 'H11').status, 'FINDING');
  assert.equal(drifted.exitCode, 1);

  const broken = makeHubContext({
    routerTargets: { 'fixture-hub-gap': ['fixture-gap-mode'] },
    mirrorCodes: { codex: 2 },
  });
  const unreadable = runHubGapReport({ target: 'fixture-gap-mode', intoHub: HUB_GAP_ROOT }, broken.context);
  assert.equal(getHubRow(unreadable, 'H11').status, 'UNKNOWN');
  assert.equal(unreadable.unverified.length, 1);
  assert.equal(unreadable.exitCode, 2);
});

test('parent-skill-check that cannot run leaves its rows UNKNOWN and exits 2', () => {
  const { context } = makeHubContext({
    routerTargets: { 'fixture-hub-gap': ['fixture-gap-mode'] },
    parentCode: 2,
    parentOutput: '',
    parentError: 'ERROR: parent skill directory not found\n',
  });
  const report = runHubGapReport({ target: 'fixture-gap-mode', intoHub: HUB_GAP_ROOT }, context);

  for (const id of ['H1', 'H3', 'H9']) {
    assert.equal(getHubRow(report, id).status, 'UNKNOWN', id);
  }
  assert.equal(getHubRow(report, 'H2').status, 'UNKNOWN');
  assert.equal(report.exitCode, 2);
  assert.ok(report.unverified.length >= 1);
});

test('the hub gap text carries every row, its evidence and the ungated-rows footer', () => {
  const { context } = makeHubContext({ routerTargets: { 'fixture-hub-gap': ['fixture-gap-mode'] } });
  const report = runHubGapReport({ target: 'fixture-gap-mute', intoHub: HUB_GAP_ROOT }, context);
  const text = renderHubText(report);

  for (let index = 1; index <= 11; index += 1) {
    assert.match(text, new RegExp(`^H${index}\\s`, 'm'));
  }
  assert.match(text, /^Hub gap report: fixture-gap-mute into hub-gap \(metadata\)$/m);
  assert.match(text, /^     Evidence: node .*parent-skill-check\.cjs /m);
  assert.match(text, /^Rows: 11; \d+ pass, 1 finding\(s\), 0 unknown, 2 n\/a$/m);
  assert.match(
    text,
    /^A green gate is not integration\. No CI gate covers rows H4, H5, H6, H8, H10; H7 is checked by name only\.$/m,
  );
  assert.match(text, /^Result: FINDINGS \(1\)$/m);
});

test('the hub gap argument parses its hub and rejects a missing or repeated hub', () => {
  assert.deepEqual(parseArguments(['fixture-gap-mode', '--into-hub', 'hub-gap']), {
    target: 'fixture-gap-mode',
    json: false,
    intoHub: 'hub-gap',
  });
  assert.equal(parseArguments(['--into-hub', 'hub-gap', '--json']).intoHub, 'hub-gap');
  assert.throws(() => parseArguments(['--into-hub']), (error) => error.code === 'USAGE');
  assert.throws(() => parseArguments(['--into-hub', '--json']), (error) => error.code === 'USAGE');
  assert.throws(
    () => parseArguments(['--into-hub', 'hub-gap', '--into-hub', 'hub-inventory']),
    (error) => error.code === 'USAGE',
  );
});

test('a path that is not a hub and a private hub name are refused with exit 2', () => {
  const { context } = makeHubContext({});
  let stderr = '';
  const run = (hubPath) => runCheck(['check', 'fixture-gap-mode', '--into-hub', hubPath], {
    context,
    stdout: { write: () => {} },
    stderr: { write: (chunk) => { stderr += chunk; } },
  });

  const notHub = run(path.join(SKILLS_DIR, 'plain'));
  assert.equal(notHub, 2);
  assert.match(stderr, /HUB_NOT_A_HUB/);

  const scratchDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sk-skill-check-'));
  const privateHub = path.join(scratchDir, `${PREFIX}hub`);
  fs.mkdirSync(privateHub);
  try {
    stderr = '';
    const refused = run(privateHub);
    assert.equal(refused, 2);
    assert.match(stderr, /PRIVATE_ROOT_REFUSED/);
    assert.ok(!stderr.includes(path.basename(privateHub)));
  } finally {
    fs.rmSync(scratchDir, { recursive: true, force: true });
  }
});

test('a WARN line on stderr reaches the row that owns its invariant', () => {
  const { context } = makeHubContext({
    routerTargets: { 'fixture-hub-gap': ['fixture-gap-mode'] },
    parentCode: 1,
    parentError: 'WARN: 5k-alias: registry alias is not a keyword of its routerSignal classes\n',
  });
  const report = runHubGapReport({ target: 'fixture-gap-mode', intoHub: HUB_GAP_ROOT }, context);

  assert.equal(getHubRow(report, 'H6').status, 'FINDING');
  assert.match(getHubRow(report, 'H6').detail, /5k-alias/);
  assert.equal(report.exitCode, 1);
});

test('the stage-two, vocabulary, table and description probes find a missing surface', () => {
  const stageTwo = {
    present: true,
    intentKeys: ['ALPHA', 'BETA'],
    resourceKeys: ['ALPHA'],
    resources: { ALPHA: ['fixture-gap-mode/leaf.md'] },
    pathCount: 1,
    fullInventoryPresent: false,
    fullInventoryPaths: [],
  };
  const uneven = surface.stageTwoIntentProbe({ mode: null, stageTwo, parsedRouter: null });
  assert.equal(uneven.status, 'FINDING');
  assert.match(uneven.detail, /no RESOURCE_MAP entry for BETA/);

  const evenStageTwo = {
    ...stageTwo,
    resourceKeys: ['ALPHA', 'BETA'],
    resources: { ALPHA: ['fixture-gap-mode/leaf.md'], BETA: ['fixture-gap-mode/other.md'] },
    pathCount: 2,
  };
  const unreached = surface.stageTwoIntentProbe({
    mode: { workflowMode: 'fixture-gap-mute', packet: 'fixture-gap-mute' },
    stageTwo: evenStageTwo,
    parsedRouter: null,
  });
  assert.equal(unreached.status, 'FINDING');
  assert.match(unreached.detail, /loads nothing/);

  const emptyInventory = surface.stageTwoInventoryProbe({
    mode: null,
    stageTwo: { ...stageTwo, fullInventoryPresent: true, fullInventoryPaths: [] },
  });
  assert.equal(emptyInventory.status, 'FINDING');

  const absentVocabulary = surface.hubVocabularyProbe({
    mode: { workflowMode: 'fixture-gap-mute' },
    vocabulary: { keywords: ['absent phrase'] },
    graphMetadata: { intent_signals: ['fixture gap request'] },
  });
  assert.equal(absentVocabulary.status, 'FINDING');

  const noMetadata = surface.hubVocabularyProbe({ mode: null, vocabulary: null, graphMetadata: null });
  assert.equal(noMetadata.status, 'FINDING');

  const silentTable = surface.hubModeTableProbe({
    skillText: '| Mode | Packet |\n|------|--------|\n| `fixture-gap-mode` | `fixture-gap-mode` |\n',
    modeIds: ['fixture-gap-mode', 'fixture-gap-mute'],
    subject: null,
  });
  assert.equal(silentTable.status, 'FINDING');
  assert.match(silentTable.detail, /fixture-gap-mute/);

  const absentDescription = surface.hubDescriptionProbe({
    description: { name: 'fixture-hub-gap', description: 'Invented hub.', version: '1.0.0.0', keywords: ['fixture-hub-gap'] },
    subject: 'fixture-gap-mute',
  });
  assert.equal(absentDescription.status, 'FINDING');
});

test('a hub whose hub-router.json is gone reports H2 and H3 as findings, never a pass by absence', () => {
  const copy = copyHubFixture(HUB_GAP_ROOT, { remove: ['hub-router.json'] });
  try {
    const { context, invocations } = makeHubContext({ realParentCheck: true });
    const report = runHubGapReport({ target: null, intoHub: copy.hubRoot }, context);

    // The real checker stops after 5a, so 5b, 5e and 5i are never printed. Those rows
    // used to read the silence as a pass; they must report the failure that stopped it.
    assert.equal(invocations.filter(({ args }) => String(args[0]).endsWith('parent-skill-check.cjs')).length, 1);
    for (const id of ['H2', 'H3']) {
      assert.equal(getHubRow(report, id).status, 'FINDING', `${id}: ${getHubRow(report, id).detail}`);
      assert.match(getHubRow(report, id).detail, /5a: hub-router\.json is missing/);
    }
    assert.deepEqual(report.unverified, []);
    assert.equal(report.exitCode, 1);
  } finally {
    fs.rmSync(copy.scratchDir, { recursive: true, force: true });
  }
});

test('a row whose confirming PASS line is absent stays UNKNOWN instead of passing', () => {
  const cases = [
    ['H1', ['3a:', '3b:'], '3a and 3b'],
    ['H2', ['5b:'], '5b'],
    ['H3', ['5e:', '5i:'], '5e and 5i'],
    ['H9', ['10a-manifest-source:', '10b-byte-drift:'], '10a-manifest-source and 10b-byte-drift'],
  ];
  for (const [id, removed, named] of cases) {
    const { context } = makeHubContext({
      routerTargets: { 'fixture-hub-gap': ['fixture-gap-mode'] },
      parentOutput: parentOutputWithout(...removed),
    });
    const report = runHubGapReport({ target: 'fixture-gap-mode', intoHub: HUB_GAP_ROOT }, context);
    const row = getHubRow(report, id);
    assert.equal(row.status, 'UNKNOWN', `${id}: ${row.detail}`);
    assert.match(row.detail, new RegExp(`no PASS for ${named}`));
    assert.ok(report.unverified.length >= 1, id);
    assert.equal(report.exitCode, 2, id);
  }
});

test('a stage-two intent that reaches the mode only through FULL_INVENTORY is a finding', () => {
  const packetLeaves = 'fixture-inventory-mode/references/fixture-inventory.md';
  const stageTwo = {
    present: true,
    intentKeys: ['INVENTORY', 'FULL_INVENTORY'],
    resourceKeys: ['INVENTORY', 'FULL_INVENTORY'],
    resources: {
      INVENTORY: ['notes/hub-level.md'],
      FULL_INVENTORY: [packetLeaves],
    },
    pathCount: 2,
    fullInventoryPresent: true,
    fullInventoryPaths: [packetLeaves],
  };
  const parsedRouter = {
    resourceMap: {
      INVENTORY: ['notes/hub-level.md'],
      FULL_INVENTORY: [packetLeaves],
    },
  };
  const probe = surface.stageTwoIntentProbe({
    mode: { workflowMode: 'fixture-inventory-mode', packet: 'fixture-inventory-mode' },
    stageTwo,
    parsedRouter,
  });
  assert.equal(probe.status, 'FINDING');
  assert.match(probe.detail, /loads nothing/);

  const ownIntent = surface.stageTwoIntentProbe({
    mode: { workflowMode: 'fixture-inventory-mode', packet: 'fixture-inventory-mode' },
    stageTwo: {
      ...stageTwo,
      resources: { ...stageTwo.resources, INVENTORY: [packetLeaves] },
    },
    parsedRouter: { resourceMap: { INVENTORY: [packetLeaves] } },
  });
  assert.equal(ownIntent.status, 'PASS');
  assert.match(ownIntent.detail, /INVENTORY/);
});

test('two modes that share one packet are reported as the mode that was named', () => {
  const define = (target) => makeHubContext({
    routerTargets: { 'fixture-hub-shared': ['fixture-shared-mode', 'fixture-shared-mode-parent'] },
  });

  const parent = runHubGapReport(
    { target: 'fixture-shared-mode-parent', intoHub: HUB_SHARED_ROOT },
    define().context,
  );
  assert.equal(parent.skill, 'fixture-shared-mode-parent');
  assert.match(getHubRow(parent, 'H1').detail, /Registered as fixture-shared-mode-parent/);
  assert.match(getHubRow(parent, 'H2').detail, /routerSignals covers fixture-shared-mode-parent/);
  assert.match(getHubRow(parent, 'H7').detail, /including fixture-shared-mode-parent/);
  assert.match(getHubRow(parent, 'H8').detail, /^fixture-shared-mode-parent appears/);
  assert.equal(parent.findingCount, 0, JSON.stringify(parent.rows.filter((row) => row.status === 'FINDING')));

  const base = runHubGapReport(
    { target: 'fixture-shared-mode', intoHub: HUB_SHARED_ROOT },
    define().context,
  );
  assert.equal(base.skill, 'fixture-shared-mode');
  assert.match(getHubRow(base, 'H1').detail, /Registered as fixture-shared-mode \(workflow\)/);
});

test('advisor vocabulary matches whole tokens, so a short phrase cannot match inside a word', () => {
  const mode = { workflowMode: 'fixture-go-mode' };
  const inside = surface.hubVocabularyProbe({
    mode,
    vocabulary: { keywords: ['go'] },
    graphMetadata: { intent_signals: ['google docs workflow'] },
  });
  assert.equal(inside.status, 'FINDING');

  const standalone = surface.hubVocabularyProbe({
    mode,
    vocabulary: { keywords: ['go'] },
    graphMetadata: { intent_signals: ['go to the docs'] },
  });
  assert.equal(standalone.status, 'PASS');
});

test('the mode table probe reads only the table whose header names Mode and checks the stated counts', () => {
  const decoy = [
    '| Term | Meaning |',
    '|------|---------|',
    '| `fixture-gap-mute` | A decoy row in a table that documents vocabulary |',
    '',
    '| Mode | Packet |',
    '|------|--------|',
    '| `fixture-gap-mode` | `fixture-gap-mode` |',
  ].join('\n');
  const absent = surface.hubModeTableProbe({
    skillText: decoy,
    modeIds: ['fixture-gap-mode', 'fixture-gap-mute'],
    packets: ['fixture-gap-mode', 'fixture-gap-mute'],
    subject: null,
  });
  assert.equal(absent.status, 'FINDING');
  assert.match(absent.detail, /fixture-gap-mute/);

  const matching = surface.hubModeTableProbe({
    skillText: 'Two modes across one packet.\n\n| Mode | Packet |\n|---|---|\n| `a-mode` | `a-packet` |\n| `b-mode` | `a-packet` |\n',
    modeIds: ['a-mode', 'b-mode'],
    packets: ['a-packet'],
    subject: null,
  });
  assert.equal(matching.status, 'PASS');
  assert.match(matching.detail, /2 modes/);
  assert.match(matching.detail, /1 packet/);

  const overstated = surface.hubModeTableProbe({
    skillText: 'Three modes across two packets.\n\n| Mode | Packet |\n|---|---|\n| `a-mode` | `a-packet` |\n| `b-mode` | `a-packet` |\n',
    modeIds: ['a-mode', 'b-mode'],
    packets: ['a-packet'],
    subject: null,
  });
  assert.equal(overstated.status, 'FINDING');
  assert.match(overstated.detail, /states 3 modes across 2 packets/);
  assert.match(overstated.detail, /the registry declares 2 modes across 1 packets?/);
});

test('a projection recommendation counts only when it names the hub or the mode legacy advisor id', () => {
  const { context } = makeHubContext({
    routerTargets: { 'fixture-hub-inventory': ['fixture-inventory-mode'] },
    advisorPayload: [{ skill: 'another-hub', workflowMode: 'fixture-inventory-mode', mode: 'fixture-inventory-mode' }],
  });
  const report = runHubGapReport({ target: 'fixture-inventory-mode', intoHub: HUB_INVENTORY_ROOT }, context);

  assert.equal(getHubRow(report, 'H10').status, 'FINDING');
  assert.match(getHubRow(report, 'H10').detail, /none named fixture-hub-inventory or fixture-inventory-mode/);
});

test('the hub gap text prints each unverified entry and INCOMPLETE when the table is unfinished', () => {
  const { context } = makeHubContext({
    routerTargets: { 'fixture-hub-gap': ['fixture-gap-mode'] },
    parentCode: 2,
    parentOutput: '',
    parentError: 'ERROR: parent skill directory not found\n',
  });
  const report = runHubGapReport({ target: 'fixture-gap-mode', intoHub: HUB_GAP_ROOT }, context);
  const text = renderHubText(report);

  assert.equal(report.exitCode, 2);
  assert.ok(report.unverified.length >= 1);
  for (const entry of report.unverified) {
    assert.ok(text.includes(`Unverified: ${entry}`), entry);
  }
  assert.match(text, /^Unverified: parent-skill-check\.cjs could not run/m);
  assert.match(text, /^Result: INCOMPLETE$/m);
  assert.doesNotMatch(text, /^Result: (PASS|FINDINGS|NO FINDINGS)/m);
});

test('the hub gap argument accepts the inline --into-hub=<hub> form', () => {
  assert.deepEqual(parseArguments(['fixture-gap-mode', '--into-hub=hub-gap']), {
    target: 'fixture-gap-mode',
    json: false,
    intoHub: 'hub-gap',
  });
  assert.equal(parseArguments(['--into-hub=hub-gap', '--json']).intoHub, 'hub-gap');
  assert.throws(() => parseArguments(['--into-hub=']), (error) => error.code === 'USAGE');
  assert.throws(() => parseArguments(['--into-hub=-hub']), (error) => error.code === 'USAGE');
  assert.throws(
    () => parseArguments(['--into-hub=hub-gap', '--into-hub=hub-inventory']),
    (error) => error.code === 'USAGE',
  );
});

test('the shipped hub and its mode report every applicable row present', () => {
  const context = surface.createContext({ repoRoot: REPO_ROOT, cwd: REPO_ROOT });
  const hubRoot = path.join(REPO_ROOT, '.skilled', 'skills', 'cli-classifier');
  const report = runHubGapReport({ target: 'cli-jev', intoHub: hubRoot }, context);

  assert.deepEqual(report.rows.map((row) => row.row), Array.from({ length: 11 }, (_, index) => `H${index + 1}`));
  assert.equal(report.findingCount, 0, JSON.stringify(report.rows.filter((row) => row.status === 'FINDING')));
  assert.equal(report.exitCode, 0);
  for (const id of ['H1', 'H2', 'H3', 'H4', 'H6', 'H7', 'H8', 'H9', 'H11']) {
    assert.equal(getHubRow(report, id).status, 'PASS', `${id}: ${getHubRow(report, id).detail}`);
  }
  assert.equal(getHubRow(report, 'H5').status, 'N/A');
  assert.equal(getHubRow(report, 'H10').status, 'N/A');
});

// A converter backup is a state record, not a skill root. Counting its copy of
// SKILL.md as a second declaration would make a converted skill look like a
// duplicate of itself to the check that runs after the conversion.
test('the shared skill scan skips state directories so a backup SKILL.md is not a duplicate name', () => {
  const scratchDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sk-skill-check-state-'));
  try {
    const skillsDir = path.join(scratchDir, 'skills');
    const skillRoot = path.join(skillsDir, 'state-skip');
    const source = [
      '---',
      'name: state-skip',
      'description: A short skill description.',
      '---',
      '',
      '# State Skip',
      '',
    ].join('\n');
    fs.mkdirSync(skillRoot, { recursive: true });
    fs.writeFileSync(path.join(skillRoot, 'SKILL.md'), source);

    const backup = path.join(skillsDir, '.state', 'doctor-sk-skill', 'state-skip', 'stamp');
    fs.mkdirSync(backup, { recursive: true });
    fs.writeFileSync(path.join(backup, 'SKILL.md'), source);

    assert.deepEqual(surface.collectSkillFiles(skillsDir), [path.join(skillRoot, 'SKILL.md')]);
    const collisions = surface.inspectCollisions('state-skip', skillRoot, skillsDir);
    assert.equal(collisions.status, 'PASS');
    assert.deepEqual(collisions.findings, []);
  } finally {
    fs.rmSync(scratchDir, { recursive: true, force: true });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. WORKFLOW AND PRESENTATION PARITY
// ─────────────────────────────────────────────────────────────────────────────

test('the check workflow names each deep row with the label the engine prints', () => {
  const { context } = makeContext();
  let text = '';
  runCheck(['check', 'canon'], {
    context,
    stdout: { write: (chunk) => { text += chunk; } },
    stderr: { write: () => {} },
  });
  const rows = text.split('\n')
    .map((line) => /^(C\d+)\s+(?:PASS|FINDING|UNKNOWN|INFO|N\/A)\s+([^:]+):/.exec(line))
    .filter(Boolean);
  assert.equal(rows.length, 13);
  for (const [, id, label] of rows) {
    assert.ok(CHECK_YAML.includes(`${id} ${label}`), `the workflow names ${id} ${label}`);
  }
});

test('the presentation documents the fleet result line the engine prints', () => {
  const passing = createTempSkills(['pass-root']);
  const finding = createTempSkills(['pass-root', 'finding-root']);
  try {
    const passText = renderFleetText(runFleet(makeContext({
      skillsDir: passing.skillsDir,
      metadataFleetResults: [{ skill: 'pass-root', skillClass: 'S', status: 'pass', violations: [] }],
    }).context));
    const findingText = renderFleetText(runFleet(makeContext({
      skillsDir: finding.skillsDir,
      packageFailures: { 'finding-root': { code: 1, codes: ['RS-008'] } },
      metadataFleetCode: 1,
      metadataFleetResults: [
        { skill: 'pass-root', skillClass: 'S', status: 'pass', violations: [] },
        { skill: 'finding-root', skillClass: 'S', status: 'fail', violations: [{ code: 'RRC-003' }] },
      ],
    }).context));
    assert.match(passText, /^Roots: 1; result: PASS$/m);
    assert.match(findingText, /^Roots: 2; result: FINDINGS \(1\)$/m);

    const verdicts = [passText, findingText].map((text) => /result: (\w+)/.exec(text)[1]);
    const documented = PRESENTATION.split('\n').find((line) => line.startsWith('Roots: [N]; result: '));
    assert.ok(documented, 'the presentation documents the engine fleet result line');
    for (const verdict of verdicts) {
      assert.ok(documented.includes(verdict), `the documented result line names ${verdict}`);
    }
    assert.ok(documented.includes('([N])'), 'the documented result line carries the finding count');
  } finally {
    removeTempSkills(passing);
    removeTempSkills(finding);
  }
});
