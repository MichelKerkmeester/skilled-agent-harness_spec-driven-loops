#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Skilled Skill Surface Probes
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { createRequire } = require('node:module');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_TIMEOUT_MS = 30000;
const ADVISOR_TIMEOUT_MS = 10000;
const PYTHON_MISSING_PROVISION = 'Install Python 3 and make python3 available on PATH, or set PYTHON to its executable.';
// Assemble the reserved prefix so tracked source does not spell out a private skill name.
const RESERVED_PREFIX = ['lo', 'cal', String.fromCharCode(45)].join('');
const SHARED_PROVISION = 'bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .';
const HERMES_PROVISION = 'npm install --prefix .skilled/skills/system-spec-kit/runtime';
// `.state` holds converter backups and other run records. A backup copies SKILL.md
// verbatim, so walking it would read one skill's own backup as a second skill
// declaring the same name.
const SKIP_DIRECTORIES = new Set([
  '.git', '.state', 'benchmark', 'dist', 'fixtures', 'node_modules', 'scratch', 'z_archive',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. ERRORS AND PATHS
// ─────────────────────────────────────────────────────────────────────────────

class CheckError extends Error {
  constructor(code, message, provision = null) {
    super(message);
    this.name = 'CheckError';
    this.code = code;
    this.provision = provision;
  }
}

function pathsFor(repoRoot) {
  const createSkillScripts = path.join(
    repoRoot, '.skilled', 'skills', 'sk-doc', 'sk-create-skill', 'scripts',
  );
  const skilledScripts = path.join(repoRoot, '.skilled', 'commands', 'doctor', 'scripts');
  const routerScripts = path.join(
    repoRoot, '.skilled', 'skills', 'sk-code', 'sk-code-skilled', 'assets', 'scripts',
  );
  const advisorScripts = path.join(
    repoRoot, '.skilled', 'skills', 'system-skill-advisor', 'runtime', 'scripts',
  );
  return {
    skillsDir: path.join(repoRoot, '.skilled', 'skills'),
    packageSkill: path.join(createSkillScripts, 'package_skill.py'),
    rootMetadata: path.join(createSkillScripts, 'ci-skill-root-metadata.cjs'),
    regenerateDerived: path.join(createSkillScripts, 'regenerate-skill-derived.cjs'),
    resolver: path.join(routerScripts, 'router-file-resolver.cjs'),
    routerReplay: path.join(routerScripts, 'router-replay-lib.cjs'),
    advisor: path.join(repoRoot, '.skilled', 'bin', 'skill-advisor.cjs'),
    skillGraphCompiler: path.join(advisorScripts, 'skill_graph_compiler.py'),
    regressionCorpus: path.join(advisorScripts, 'fixtures', 'skill-advisor-regression-cases.jsonl'),
    goldenCorpus: path.join(advisorScripts, 'fixtures', 'gate2-golden-prompts.jsonl'),
    graphFreshness: path.join(skilledScripts, 'skill-graph-freshness.cjs'),
    hermesSync: path.join(
      repoRoot, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli', 'hermes',
      'sync-skills-hermes.cjs',
    ),
    auditDescriptions: path.join(skilledScripts, 'audit_descriptions.py'),
  };
}

function findRepoRoot(start = __dirname) {
  let current = path.resolve(start);
  while (current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, '.git'))) return current;
    current = path.dirname(current);
  }
  const result = spawnSync(
    'git',
    ['-c', 'core.fsmonitor=false', 'rev-parse', '--show-toplevel'],
    {
      cwd: start,
      encoding: 'utf8',
      timeout: DEFAULT_TIMEOUT_MS,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    },
  );
  if (result.status === 0 && result.stdout.trim()) return path.resolve(result.stdout.trim());
  return path.resolve(start);
}

function createContext(options = {}) {
  const repoRoot = path.resolve(options.repoRoot || findRepoRoot(options.startDir || __dirname));
  const paths = { ...pathsFor(repoRoot), ...(options.paths || {}) };
  const env = options.env || process.env;
  const python = options.python === undefined
    ? (Object.prototype.hasOwnProperty.call(env, 'PYTHON') ? env.PYTHON : null)
    : options.python;
  return {
    repoRoot,
    paths,
    skillsDir: path.resolve(options.skillsDir || paths.skillsDir),
    cwd: path.resolve(options.cwd || process.cwd()),
    python,
    env,
    fs: options.fs || fs,
    runCommand: options.runCommand || runProcess,
    moduleResolver: options.moduleResolver || resolveModuleFromFile,
    stdout: options.stdout || process.stdout,
    stderr: options.stderr || process.stderr,
    skipPreflight: options.skipPreflight === true,
  };
}

function resolveModuleFromFile(specifier, fromFile) {
  return createRequire(path.resolve(fromFile)).resolve(specifier);
}

function runProcess(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    env: options.env,
    encoding: 'utf8',
    timeout: options.timeoutMs || DEFAULT_TIMEOUT_MS,
    maxBuffer: 8 * 1024 * 1024,
  });
  return {
    code: Number.isInteger(result.status) ? result.status : null,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    error: result.error ? result.error.message : null,
  };
}

function runChild(context, command, args, options = {}) {
  const env = {
    ...(context.env || process.env),
    ...(options.env || {}),
    PYTHONDONTWRITEBYTECODE: '1',
  };
  return context.runCommand(command, args, {
    cwd: options.cwd || context.repoRoot,
    env,
    timeoutMs: options.timeoutMs || DEFAULT_TIMEOUT_MS,
  });
}

function python3ExecutablesOnPath(context) {
  const searchPath = context.env && context.env.PATH;
  if (typeof searchPath !== 'string') return [];

  const { fs: fileSystem } = context;
  const seen = new Set();
  const executables = [];
  for (const entry of searchPath.split(path.delimiter)) {
    const candidate = path.resolve(context.repoRoot, entry, 'python3');
    if (seen.has(candidate)) continue;
    seen.add(candidate);
    try {
      if (!fileSystem.statSync(candidate).isFile()) continue;
      fileSystem.accessSync(candidate, fileSystem.constants.X_OK);
      executables.push(candidate);
    } catch {
      continue;
    }
  }
  return executables;
}

function ensurePython(context) {
  if (context.python !== null && context.python !== undefined) {
    if (context.python === '') {
      throw new CheckError(
        'PYTHON_MISSING',
        'PYTHON is set but does not name an interpreter.',
        PYTHON_MISSING_PROVISION,
      );
    }
    const pythonProbe = runChild(context, context.python, ['-c', 'import yaml'], { timeoutMs: 5000 });
    if (!pythonProbe || !Number.isInteger(pythonProbe.code) || pythonProbe.error) {
      const reason = pythonProbe && pythonProbe.error ? `: ${pythonProbe.error}` : '.';
      throw new CheckError(
        'PYTHON_MISSING',
        `Python interpreter ${context.python} could not run${reason}`,
        PYTHON_MISSING_PROVISION,
      );
    }
    if (pythonProbe.code !== 0) {
      throw new CheckError(
        'PYYAML_MISSING',
        `Python interpreter ${context.python} cannot import yaml.`,
        `${context.python} -m pip install PyYAML`,
      );
    }
    return;
  }

  const interpreters = python3ExecutablesOnPath(context);
  if (interpreters.length === 0) {
    throw new CheckError(
      'PYTHON_MISSING',
      'Python interpreter python3 could not run: no executable was found on PATH.',
      PYTHON_MISSING_PROVISION,
    );
  }

  let runnableInterpreterFound = false;
  for (const interpreter of interpreters) {
    const pythonProbe = runChild(context, interpreter, ['-c', 'import yaml'], { timeoutMs: 5000 });
    if (!pythonProbe || !Number.isInteger(pythonProbe.code) || pythonProbe.error) continue;
    runnableInterpreterFound = true;
    if (pythonProbe.code === 0) {
      context.python = interpreter;
      return;
    }
  }

  if (!runnableInterpreterFound) {
    throw new CheckError(
      'PYTHON_MISSING',
      `Python interpreters found on PATH could not run: ${interpreters.join(', ')}.`,
      PYTHON_MISSING_PROVISION,
    );
  }

  throw new CheckError(
    'PYYAML_MISSING',
    `No python3 interpreter found on PATH can import yaml. Tried: ${interpreters.join(', ')}.`,
    `Install PyYAML for one of these interpreters:\n${interpreters.map((interpreter) => (
      `${interpreter} -m pip install PyYAML`
    )).join('\n')}`,
  );
}

function parseJsonOutput(result) {
  if (!result || typeof result.stdout !== 'string') return null;
  try {
    return JSON.parse(result.stdout);
  } catch {
    return null;
  }
}

function mapValidatorExit(result, { findingCodes = [1], unknownCodes = [] } = {}) {
  if (!result || !Number.isInteger(result.code)) return { status: 'ERROR', code: null };
  if (result.code === 0) return { status: 'PASS', code: result.code };
  if (unknownCodes.includes(result.code)) return { status: 'UNKNOWN', code: result.code };
  if (findingCodes.includes(result.code)) return { status: 'FINDING', code: result.code };
  return { status: 'ERROR', code: result.code };
}

function ensurePreconditions(context, { requireRouter = true } = {}) {
  const { fs: fileSystem, paths, moduleResolver } = context;
  ensurePython(context);
  if (requireRouter && !fileSystem.existsSync(paths.resolver)) {
    throw new CheckError(
      'ROUTER_RESOLVER_MISSING',
      'The sk-code machine-router resolver is missing.',
      SHARED_PROVISION,
    );
  }
  if (requireRouter && !fileSystem.existsSync(paths.routerReplay)) {
    throw new CheckError(
      'ROUTER_PARSER_MISSING',
      'The sk-code router parser is missing.',
      SHARED_PROVISION,
    );
  }

  try {
    moduleResolver('@spec-kit/shared/frontmatter/parse-frontmatter.js', paths.rootMetadata);
  } catch {
    throw new CheckError(
      'SHARED_NOT_BUILT',
      'The root metadata validator cannot load its built shared frontmatter parser.',
      SHARED_PROVISION,
    );
  }
  try {
    moduleResolver('@spec-kit/shared/workspace/repo-root.mjs', paths.hermesSync);
  } catch {
    throw new CheckError(
      'HERMES_SHARED_MISSING',
      'Hermes sync cannot load @spec-kit/shared.',
      HERMES_PROVISION,
    );
  }
}

function readJsonFile(filePath, fileSystem = fs) {
  try {
    return JSON.parse(fileSystem.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SKILL LOCATION AND CLASSIFICATION
// ─────────────────────────────────────────────────────────────────────────────

function hasSkillDocument(skillRoot, fileSystem = fs) {
  try {
    return fileSystem.statSync(path.join(skillRoot, 'SKILL.md')).isFile();
  } catch {
    return false;
  }
}

function resolveSkillTarget(input, context) {
  if (typeof input !== 'string' || input.trim() === '') {
    throw new CheckError('SKILL_NOT_FOUND', 'A skill name or path is required.');
  }
  const value = input.trim();
  const candidates = [];
  const isBareName = !path.isAbsolute(value) && !value.includes('/') && !value.includes('\\');
  if (isBareName) {
    const skillMatches = [];
    const directMatch = path.join(context.skillsDir, value);
    if (hasSkillDocument(directMatch, context.fs)) skillMatches.push(directMatch);
    try {
      const roots = context.fs.readdirSync(context.skillsDir, { withFileTypes: true });
      for (const root of roots) {
        if (!root.isDirectory()) continue;
        const nestedMatch = path.join(context.skillsDir, root.name, value);
        if (hasSkillDocument(nestedMatch, context.fs)) skillMatches.push(nestedMatch);
      }
    } catch {
      // Other path forms below can still resolve when the skills root is unavailable.
    }
    if (skillMatches.length > 1) {
      const matches = skillMatches.map((match) => path.relative(context.skillsDir, match));
      throw new CheckError(
        'SKILL_NOT_FOUND',
        `Multiple skills matched "${value}": ${matches.join(', ')}.`,
      );
    }
    if (skillMatches.length === 1) return realPath(skillMatches[0], context.fs);
  }
  candidates.push(path.resolve(context.cwd, value));
  candidates.push(path.resolve(context.repoRoot, value));

  for (const candidateValue of candidates) {
    const candidate = path.basename(candidateValue) === 'SKILL.md'
      ? path.dirname(candidateValue)
      : candidateValue;
    if (!hasSkillDocument(candidate, context.fs)) continue;
    try {
      return context.fs.realpathSync(candidate);
    } catch {
      return path.resolve(candidate);
    }
  }
  throw new CheckError('SKILL_NOT_FOUND', 'No SKILL.md was found for the requested name or path.');
}

function realPath(candidate, fileSystem = fs) {
  try {
    return fileSystem.realpathSync(candidate);
  } catch {
    return path.resolve(candidate);
  }
}

function classifyLocation(skillRoot, skillsDir, fileSystem = fs) {
  const target = realPath(skillRoot, fileSystem);
  const root = realPath(skillsDir, fileSystem);
  const relative = path.relative(root, target);
  if (!relative || relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) {
    return { kind: 'outside', relative: null };
  }
  const segments = relative.split(path.sep).filter(Boolean);
  return {
    kind: segments.length === 1 ? 'direct' : 'nested',
    relative,
  };
}

function nearestDirectSkillRoot(skillRoot, skillsDir) {
  const relative = path.relative(path.resolve(skillsDir), path.resolve(skillRoot));
  if (!relative || relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) {
    return null;
  }
  const first = relative.split(path.sep)[0];
  return path.join(skillsDir, first);
}

function readSkillFields(skillRoot, fileSystem = fs) {
  const skillFile = path.join(skillRoot, 'SKILL.md');
  let text;
  try {
    text = fileSystem.readFileSync(skillFile, 'utf8');
  } catch {
    return { text: null, fields: {} };
  }
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return { text, fields: {} };
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z0-9-]+):\s*(.*)$/);
    if (!field) continue;
    let value = field[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    fields[field[1]] = value;
  }
  return { text, fields };
}

function metadataTarget(skillRoot, location, skillsDir) {
  const name = location.kind === 'nested'
    ? path.basename(nearestDirectSkillRoot(skillRoot, skillsDir) || skillRoot)
    : path.basename(skillRoot);
  const root = location.kind === 'nested'
    ? skillsDir
    : location.kind === 'direct'
      ? skillsDir
      : path.dirname(skillRoot);
  return { name, skillsDir: root };
}

function classifyInput({ location, fields, resolverVerdict, metadataClass }) {
  if (location.kind === 'nested') return 'hub-packet';
  if (metadataClass === 'H') return 'hub';
  if (resolverVerdict === 'router-md') return 'canon';
  if (resolverVerdict === 'skill-md') return 'older-skilled';
  if (resolverVerdict === 'dual-declaration') return 'dual-declaration';
  if (resolverVerdict === 'none'
      && !Object.prototype.hasOwnProperty.call(fields, 'allowed-tools')
      && !Object.prototype.hasOwnProperty.call(fields, 'version')) return 'plain';
  return 'unclassified';
}

function isReservedSkillName(name) {
  return typeof name === 'string' && name.startsWith(RESERVED_PREFIX);
}

function safeSkillName(name) {
  if (typeof name !== 'string') return null;
  return isReservedSkillName(name) ? '[private skill]' : name;
}

function extractRootMetadata(data, name) {
  if (!data || typeof data !== 'object') return null;
  const result = Array.isArray(data.results)
    ? data.results.find((entry) => entry.skill === name)
    : null;
  const byClass = data.byClass || {};
  const skillClass = Array.isArray(byClass.H) && byClass.H.includes(name)
    ? 'H'
    : Array.isArray(byClass.S) && byClass.S.includes(name)
      ? 'S'
      : result && result.skillClass
        ? result.skillClass
        : null;
  return { result, skillClass };
}

function rootMetadataInvocation(skillRoot, location, context) {
  const target = metadataTarget(skillRoot, location, context.skillsDir);
  return {
    name: target.name,
    args: [
      context.paths.rootMetadata,
      '--skills-dir', target.skillsDir,
      '--skill', target.name,
      '--format', 'json',
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. NEW SURFACE PROBES
// ─────────────────────────────────────────────────────────────────────────────

function scaffoldIntentSignals(skillName) {
  return [
    skillName,
    skillName + ' skill',
    skillName + ' workflow',
    'how to use ' + skillName,
    'use ' + skillName,
    skillName + ' guide',
    skillName + ' reference',
    skillName + ' setup',
  ];
}

function checkSlugDefaults(skillName, graphMetadata) {
  if (!graphMetadata || !Array.isArray(graphMetadata.intent_signals)) {
    return { status: 'N/A', detail: 'No intent signal list is available.' };
  }
  const expected = scaffoldIntentSignals(graphMetadata.skill_id || skillName);
  const actual = graphMetadata.intent_signals;
  const isDefault = actual.length === expected.length
    && actual.every((signal, index) => signal === expected[index]);
  return {
    status: isDefault ? 'FINDING' : 'PASS',
    detail: isDefault
      ? 'The intent signals still match the scaffold defaults.'
      : 'The intent signals differ from the scaffold defaults.',
    expectedCount: expected.length,
    actualCount: actual.length,
  };
}

function collectSkillFiles(skillsDir, fileSystem = fs) {
  const found = [];
  const walk = (directory, isTop) => {
    let entries;
    try {
      entries = fileSystem.readdirSync(directory, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (isTop && entry.name.startsWith(RESERVED_PREFIX)) continue;
      const absolute = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        if (!SKIP_DIRECTORIES.has(entry.name)) walk(absolute, false);
      } else if (entry.isFile() && entry.name === 'SKILL.md') {
        found.push(absolute);
      }
    }
  };
  walk(skillsDir, true);
  return found.sort();
}

function inspectCollisions(skillName, skillRoot, skillsDir, fileSystem = fs) {
  const findings = [];
  if (typeof skillName !== 'string' || skillName.length === 0) {
    return { status: 'UNKNOWN', findings: ['skill name unavailable'] };
  }
  if (skillName !== path.basename(skillName) || skillName.includes('\\')
      || skillName === '.' || skillName === '..') {
    return {
      status: 'FINDING',
      findings: ['skill name is not a single path segment'],
      collisionCount: 0,
    };
  }
  if (isReservedSkillName(skillName) || isReservedSkillName(path.basename(skillRoot))) {
    findings.push('reserved name prefix');
  }
  if (skillName.startsWith('agent-')) findings.push('runtime persona prefix');

  const target = realPath(skillRoot, fileSystem);
  const matches = collectSkillFiles(skillsDir, fileSystem)
    .filter((file) => realPath(path.dirname(file), fileSystem) !== target)
    .filter((file) => readSkillFields(path.dirname(file), fileSystem).fields.name === skillName);
  if (matches.length) findings.push('another SKILL.md declares the same name');

  const directCandidate = path.join(skillsDir, skillName);
  if (fileSystem.existsSync(directCandidate) && realPath(directCandidate, fileSystem) !== target) {
    findings.push('another skill root already uses this name');
  }
  return {
    status: findings.length ? 'FINDING' : 'PASS',
    findings,
    collisionCount: matches.length,
  };
}

function changelogStatus(skillRoot, skillName, version, repoRoot, fileSystem = fs, options = {}) {
  if (typeof skillName !== 'string' || skillName !== path.basename(skillName)
      || skillName.includes('\\')
      || skillName === '.' || skillName === '..') {
    return { status: 'FINDING', detail: 'The skill name is not a single path segment.' };
  }
  const changelogDir = path.join(skillRoot, 'changelog');
  let changelogIsDirectory = false;
  try {
    changelogIsDirectory = fileSystem.statSync(changelogDir).isDirectory();
  } catch {
    changelogIsDirectory = false;
  }
  if (!changelogIsDirectory) {
    return { status: 'FINDING', detail: 'The skill changelog directory is missing.' };
  }
  if (typeof version !== 'string' || !/^\d+(?:\.\d+){3}$/.test(version)) {
    return { status: 'FINDING', detail: 'The skill version is missing or malformed.' };
  }
  const releaseFile = path.join(changelogDir, 'v' + version + '.md');
  if (!fileSystem.existsSync(releaseFile)) {
    return { status: 'FINDING', detail: 'The versioned changelog entry is missing.' };
  }
  const linkParts = options.location && options.location.kind === 'nested'
    ? [
      path.basename(nearestDirectSkillRoot(skillRoot, options.skillsDir) || skillRoot),
      skillName.startsWith('sk-') ? skillName.slice(3) : skillName,
    ]
    : options.inputKind === 'hub'
      ? [path.basename(skillRoot), 'parent']
      : [skillName];
  const link = path.join(repoRoot, '.skilled', 'changelog', ...linkParts);
  try {
    const resolved = fileSystem.realpathSync(link);
    const expected = fileSystem.realpathSync(changelogDir);
    if (resolved !== expected) return { status: 'FINDING', detail: 'The changelog index link points elsewhere.' };
  } catch {
    return { status: 'FINDING', detail: 'The changelog index link is missing or does not resolve.' };
  }
  return { status: 'PASS', detail: 'The versioned changelog and index link resolve.' };
}

function readJsonLines(filePath, fileSystem = fs) {
  let text;
  try {
    text = fileSystem.readFileSync(filePath, 'utf8');
  } catch (error) {
    return { rows: null, error: error.message };
  }
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      rows.push(JSON.parse(line));
    } catch (error) {
      return { rows: null, error: error.message };
    }
  }
  return { rows, error: null };
}

function countRegressionCases(skillName, paths, fileSystem = fs) {
  const sources = [
    { key: 'regressionCases', file: paths.regressionCorpus, fields: ['expected_top_any'] },
    { key: 'goldenPrompts', file: paths.goldenCorpus, fields: ['expectedSkillAny'] },
  ];
  const counts = {};
  for (const source of sources) {
    const loaded = readJsonLines(source.file, fileSystem);
    if (!loaded.rows) return { status: 'UNKNOWN', error: source.key };
    counts[source.key] = loaded.rows.filter((row) => (
      source.fields.some((field) => Array.isArray(row[field]) && row[field].includes(skillName))
    )).length;
  }
  return { status: 'INFO', counts, total: counts.regressionCases + counts.goldenPrompts };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  ADVISOR_TIMEOUT_MS,
  CheckError,
  createContext,
  ensurePreconditions,
  findRepoRoot,
  isReservedSkillName,
  classifyInput,
  classifyLocation,
  changelogStatus,
  checkSlugDefaults,
  collectSkillFiles,
  countRegressionCases,
  extractRootMetadata,
  mapValidatorExit,
  metadataTarget,
  parseJsonOutput,
  readJsonFile,
  readSkillFields,
  resolveSkillTarget,
  rootMetadataInvocation,
  runChild,
  safeSkillName,
  inspectCollisions,
};
