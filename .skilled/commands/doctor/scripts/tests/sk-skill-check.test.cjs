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
  runCheck,
  runFleet,
} = require('../sk-skill-check.cjs');
const surface = require('../lib/sk-skill-surface.cjs');

const REPO_ROOT = path.resolve(__dirname, '../../../../..');
const FIXTURE_ROOT = path.join(__dirname, 'fixtures', 'sk-skill-check');
const SKILLS_DIR = path.join(FIXTURE_ROOT, 'skills');
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
} = {}) {
  const invocations = [];
  const context = surface.createContext({
    repoRoot: REPO_ROOT,
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
