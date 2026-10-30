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
  const runtimeCli = path.join(repoRoot, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli');
  return {
    skillsDir: path.join(repoRoot, '.skilled', 'skills'),
    packageSkill: path.join(createSkillScripts, 'package_skill.py'),
    rootMetadata: path.join(createSkillScripts, 'ci-skill-root-metadata.cjs'),
    regenerateDerived: path.join(createSkillScripts, 'regenerate-skill-derived.cjs'),
    resolver: path.join(routerScripts, 'router-file-resolver.cjs'),
    routerReplay: path.join(routerScripts, 'router-replay-lib.cjs'),
    advisor: path.join(repoRoot, '.skilled', 'bin', 'skill-advisor.cjs'),
    advisorScorer: path.join(advisorScripts, 'skill_advisor.py'),
    compiledRoute: path.join(repoRoot, '.skilled', 'bin', 'compiled-route.cjs'),
    parentSkillCheck: path.join(skilledScripts, 'parent-skill-check.cjs'),
    commandTreeParity: path.join(runtimeCli, 'validate-command-tree-parity.sh'),
    codexPromptSync: path.join(runtimeCli, 'codex', 'sync-prompts.cjs'),
    piPromptSync: path.join(runtimeCli, 'pi', 'sync-prompts-pi.cjs'),
    skillGraphCompiler: path.join(advisorScripts, 'skill_graph_compiler.py'),
    regressionCorpus: path.join(advisorScripts, 'fixtures', 'skill-advisor-regression-cases.jsonl'),
    goldenCorpus: path.join(advisorScripts, 'fixtures', 'gate2-golden-prompts.jsonl'),
    regressionRunner: path.join(advisorScripts, 'skill_advisor_regression.py'),
    skillGraphJson: path.join(advisorScripts, 'skill-graph.json'),
    graphFreshness: path.join(skilledScripts, 'skill-graph-freshness.cjs'),
    hermesSync: path.join(runtimeCli, 'hermes', 'sync-skills-hermes.cjs'),
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
    // A caller that names the repository pins every repository-relative read to
    // it, so only a context that inherited its root follows the target instead.
    repoRootExplicit: Boolean(options.repoRoot),
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

// A skill root belongs to the repository whose .skilled/skills holds it. Every
// repository-relative path a check reads — the skills root it is classified
// against, the changelog index, the runtime mirrors, and a validator that resolves
// key files from its own location — belongs to that repository too, so a target
// from a second Skilled checkout is judged against that checkout rather than
// against the one the command happened to run from.
function skillRepositoryRoot(skillRoot, fileSystem = fs) {
  let current = realPath(path.resolve(skillRoot), fileSystem);
  while (current !== path.dirname(current)) {
    if (path.basename(current) === 'skills'
        && path.basename(path.dirname(current)) === '.skilled') {
      return path.dirname(path.dirname(current));
    }
    current = path.dirname(current);
  }
  return null;
}

// The owning repository ships some of the tools a row runs and not others. A tool
// it does not ship keeps running from the checker's own checkout, and the borrowed
// keys stay recorded so the report can say which tool answered from where.
function rerootContext(context, repoRoot) {
  const ownerPaths = pathsFor(repoRoot);
  const paths = {};
  const borrowedPaths = [];
  for (const [key, value] of Object.entries(ownerPaths)) {
    const shipped = context.fs.existsSync(value);
    paths[key] = shipped ? value : context.paths[key];
    if (!shipped && context.paths[key]) borrowedPaths.push(key);
  }
  return {
    ...context,
    repoRoot,
    paths,
    skillsDir: paths.skillsDir,
    borrowedPaths,
  };
}

// Returns the context the report should read, plus the owning repository when it
// differed. A target outside any .skilled/skills, a target in the checker's own
// repository and a caller-named repository all keep the context they arrived with.
function contextForSkillTarget(skillRoot, context) {
  if (context.repoRootExplicit) return { context, repository: null };
  const owner = skillRepositoryRoot(skillRoot, context.fs);
  // Both sides are compared as real paths so one repository reached through two
  // spellings of its own path is not mistaken for a second one.
  const ownRoot = realPath(path.resolve(context.repoRoot), context.fs);
  if (!owner || owner === ownRoot) return { context, repository: null };
  return { context: rerootContext(context, owner), repository: owner };
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
// 6. HUB GAP PROBES
// ─────────────────────────────────────────────────────────────────────────────

// A parent hub root carries at least one of these. A skill root carrying neither
// is a standalone skill with no mode to integrate into, which is why the report
// refuses it rather than describing an empty table as a pass.
const HUB_REGISTRY_FILES = ['mode-registry.json', 'hub-router.json'];
const FULL_INVENTORY_KEY = 'FULL_INVENTORY';
const PARENT_SKILL_CHECK_TIMEOUT_MS = 120000;
const MIRROR_CHECK_TIMEOUT_MS = 120000;
// parent-skill-check writes one verdict line per invariant: PASS and INFO to
// stdout, FAIL and WARN to stderr. A reader that watched one stream would miss
// half the verdicts, so both are parsed.
const INVARIANT_LINE = /^(PASS|FAIL|WARN|INFO): ([A-Za-z0-9-]+): (.*)$/;

function firstLineOf(value) {
  return String(value || '').split(/\r?\n/).find((line) => line.trim()) || '';
}

function isDirectory(candidate, fileSystem = fs) {
  try {
    return fileSystem.statSync(candidate).isDirectory();
  } catch {
    return false;
  }
}

function readTextFile(filePath, fileSystem = fs) {
  try {
    return fileSystem.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

// Resolve a hub name or path the same way a skill target resolves, then prove it
// is a hub. A private root is refused because every gate skips those roots: a
// report on one could only pass by being invisible.
function resolveHubTarget(input, context) {
  if (typeof input !== 'string' || input.trim() === '') {
    throw new CheckError('USAGE', 'Option --into-hub needs a hub name or path.');
  }
  const value = input.trim();
  const candidates = path.isAbsolute(value)
    ? [value]
    : [
      path.join(context.skillsDir, value),
      path.resolve(context.cwd, value),
      path.resolve(context.repoRoot, value),
    ];
  const found = candidates.find((candidate) => isDirectory(candidate, context.fs));
  if (!found) {
    throw new CheckError('HUB_NOT_FOUND', `No hub directory was found for "${value}".`);
  }
  const root = realPath(found, context.fs);
  if (isReservedSkillName(path.basename(root))) {
    throw new CheckError(
      'PRIVATE_ROOT_REFUSED',
      'A private root is refused because every gate skips the roots carrying its prefix.',
    );
  }
  if (!HUB_REGISTRY_FILES.some((file) => context.fs.existsSync(path.join(root, file)))) {
    throw new CheckError(
      'HUB_NOT_A_HUB',
      `"${value}" carries neither mode-registry.json nor hub-router.json, so it is not a parent hub.`,
    );
  }
  return { root, name: path.basename(root) };
}

function parseInvariantLines(stdout, stderr) {
  const entries = [];
  for (const line of `${stdout || ''}\n${stderr || ''}`.split(/\r?\n/)) {
    const match = INVARIANT_LINE.exec(line.trim());
    if (match) entries.push({ status: match[1], id: match[2], message: match[3] });
  }
  return entries;
}

function runParentSkillCheck(hubRoot, context) {
  const result = runChild(context, process.execPath, [context.paths.parentSkillCheck, hubRoot], {
    timeoutMs: PARENT_SKILL_CHECK_TIMEOUT_MS,
  });
  const code = result && Number.isInteger(result.code) ? result.code : null;
  const reason = result && result.error ? result.error : firstLineOf(result && result.stderr);
  return {
    code,
    entries: parseInvariantLines(result && result.stdout, result && result.stderr),
    // Exit 2 is the checker's own error (not a hub, unreadable, or unfinished),
    // never a verdict on the hub.
    ran: code === 0 || code === 1,
    reason,
  };
}

// Patterns match an exact invariant id, or a prefix when they end in `*`.
function invariantFailures(entries, patterns) {
  const matches = (id) => patterns.some((pattern) => (pattern.endsWith('*')
    ? id.startsWith(pattern.slice(0, -1))
    : id === pattern));
  return (Array.isArray(entries) ? entries : [])
    .filter((entry) => (entry.status === 'FAIL' || entry.status === 'WARN') && matches(entry.id));
}

// A confirming PASS is the only proof that the hub-wide checker reached the invariant
// a row depends on. A checker that stops earlier prints no FAIL either, so a row that
// only looked for failures would read that silence as a pass.
function invariantPasses(entries, pattern) {
  const matches = (id) => (pattern.endsWith('*') ? id.startsWith(pattern.slice(0, -1)) : id === pattern);
  return (Array.isArray(entries) ? entries : [])
    .some((entry) => entry.status === 'PASS' && matches(entry.id));
}

// Brace-matched body of a `NAME = { ... }` declaration, the same shape the
// router-replay parser reads. A prose mention without an assignment is skipped.
function pythonDictBody(text, name) {
  const start = String(text || '').indexOf(`${name} = {`);
  if (start === -1) return null;
  const from = text.indexOf('{', start);
  let depth = 0;
  for (let index = from; index < text.length; index += 1) {
    const character = text[index];
    if (character === '{') depth += 1;
    else if (character === '}') {
      depth -= 1;
      if (depth === 0) return text.slice(from + 1, index);
    }
  }
  return null;
}

function dictKeys(body) {
  if (!body) return [];
  return [...new Set([...body.matchAll(/["']([A-Z0-9_]+)["']\s*:/g)].map((match) => match[1]))];
}

function quotedStrings(segment) {
  return [...String(segment || '').matchAll(/["']([^"']+)["']/g)].map((match) => match[1]);
}

function resourceLists(body) {
  const lists = {};
  if (!body) return lists;
  const entry = /["']([A-Z0-9_]+)["']\s*:\s*\[([^\]]*)\]/g;
  let match;
  while ((match = entry.exec(body)) !== null) lists[match[1]] = quotedStrings(match[2]);
  return lists;
}

// The stage-two declaration at the hub root: INTENT_SIGNALS and RESOURCE_MAP, plus
// the optional FULL_INVENTORY block only a full-toolkit hub carries.
function readHubStageTwo(hubRoot, context) {
  const text = readTextFile(path.join(hubRoot, 'ROUTER.md'), context.fs);
  if (text === null) {
    return {
      present: false,
      intentKeys: [],
      resourceKeys: [],
      resources: {},
      pathCount: 0,
      fullInventoryPresent: false,
      fullInventoryPaths: [],
    };
  }
  const intentBody = pythonDictBody(text, 'INTENT_SIGNALS') ?? pythonDictBody(text, 'INTENT_MODEL');
  const resourceBody = pythonDictBody(text, 'RESOURCE_MAP');
  const resources = resourceLists(resourceBody);
  const intentKeys = dictKeys(intentBody);
  const resourceKeys = dictKeys(resourceBody).filter((key) => key !== 'FULL_INVENTORY' || key in resources);
  return {
    present: true,
    intentKeys,
    resourceKeys,
    resources,
    pathCount: Object.values(resources).reduce((total, paths) => total + paths.length, 0),
    fullInventoryPresent: /["']FULL_INVENTORY["']\s*:/.test(text),
    fullInventoryPaths: Array.isArray(resources.FULL_INVENTORY) ? resources.FULL_INVENTORY : [],
  };
}

function modePacketName(mode) {
  if (mode && typeof mode.packet === 'string' && mode.packet) return mode.packet;
  return mode && typeof mode.workflowMode === 'string' ? mode.workflowMode : null;
}

function findHubMode(modes, subjectName, subjectRoot) {
  const list = (Array.isArray(modes) ? modes : []).filter((mode) => mode && typeof mode === 'object');
  // Two modes can register one packet, so a subject named by its workflowMode is that
  // mode: the packet fallback would answer with whichever mode the registry lists first.
  const named = subjectName ? list.find((mode) => mode.workflowMode === subjectName) : null;
  if (named) return named;
  const candidates = new Set([subjectName, subjectRoot ? path.basename(subjectRoot) : null].filter(Boolean));
  return list.find((mode) => (
    candidates.has(mode.workflowMode)
    || (typeof mode.packet === 'string' && candidates.has(mode.packet))
  )) || null;
}

// The mode's authored phrases: its router-signal vocabulary classes, its advisor
// aliases and its own id. One of them is also the phrase every replay uses, so
// stage-one selection and the advisor projection are asked the same question.
function hubModeVocabulary(mode, hubRouter) {
  if (!mode) return { keywords: [], phrase: null };
  const signal = hubRouter && hubRouter.routerSignals && hubRouter.routerSignals[mode.workflowMode];
  const classes = signal && Array.isArray(signal.classes) ? signal.classes : [];
  const vocabularyClasses = hubRouter && hubRouter.vocabularyClasses ? hubRouter.vocabularyClasses : {};
  const keywords = [];
  for (const name of classes) {
    const entry = vocabularyClasses[name];
    if (entry && Array.isArray(entry.keywords)) keywords.push(...entry.keywords);
  }
  const routing = mode.advisorRouting && typeof mode.advisorRouting === 'object' ? mode.advisorRouting : {};
  if (Array.isArray(routing.legacyAliases)) keywords.push(...routing.legacyAliases);
  keywords.push(mode.workflowMode);
  const unique = [...new Set(keywords.filter((keyword) => typeof keyword === 'string' && keyword))];
  // A bare alias replays fine at stage one but can fail to surface the hub at the
  // advisor, so the probe asks with the first natural request phrase and falls
  // back through a plain alias to the mode id.
  const natural = (keyword) => keyword.includes(' ') && !keyword.startsWith('/') && !keyword.startsWith('@');
  const named = (keyword) => !keyword.startsWith('/') && !keyword.startsWith('@');
  const phrase = unique.find(natural) || unique.find(named) || unique[0] || null;
  return { keywords: unique, phrase };
}

function runCompiledRoute(hubId, prompt, context) {
  const result = runChild(
    context,
    process.execPath,
    [context.paths.compiledRoute, '--hub', hubId, '--prompt', prompt],
  );
  const code = result && Number.isInteger(result.code) ? result.code : null;
  if (code !== 0) {
    return {
      state: 'error',
      code,
      targets: [],
      detail: `compiled-route.cjs could not run${result && result.error ? `: ${result.error}` : '.'}`,
    };
  }
  const payload = parseJsonOutput(result);
  if (!payload || typeof payload !== 'object') {
    return { state: 'error', code, targets: [], detail: 'compiled-route.cjs returned output that is not a decision.' };
  }
  if (payload.servingAuthority === 'legacy') {
    return { state: 'legacy', code, targets: [], detail: 'Compiled routing is not serving this hub.' };
  }
  const targets = Array.isArray(payload.targets)
    ? payload.targets.filter((target) => target && typeof target === 'object')
    : [];
  return {
    state: typeof payload.action === 'string' ? payload.action : 'error',
    code,
    targets,
    detail: `Action: ${payload.action || 'none'}.`,
  };
}

function runAdvisorProjection(prompt, context) {
  if (!prompt) return { state: 'error', ids: new Set(), detail: 'No mode phrase was available to score.' };
  try {
    ensurePython(context);
  } catch (error) {
    return { state: 'error', ids: new Set(), detail: firstLineOf(error && error.message) };
  }
  const result = runChild(
    context,
    context.python,
    [context.paths.advisorScorer, prompt, '--threshold', '0.5'],
    { timeoutMs: ADVISOR_TIMEOUT_MS },
  );
  const code = result && Number.isInteger(result.code) ? result.code : null;
  // Exit 75 is the backend reporting itself unavailable: the probe ran, so the
  // row is UNKNOWN, never a pass and never a finding.
  if (code === 75) {
    return { state: 'unavailable', ids: new Set(), detail: 'The advisor backend reported itself unavailable (exit 75); no verdict was inferred.' };
  }
  if (code !== 0) {
    const reason = result && result.error ? `: ${result.error}` : firstLineOf(result && result.stderr);
    return { state: 'error', ids: new Set(), detail: `skill_advisor.py could not run${reason ? `: ${reason}` : '.'}` };
  }
  const payload = parseJsonOutput(result);
  const entries = Array.isArray(payload)
    ? payload
    : payload && Array.isArray(payload.recommendations)
      ? payload.recommendations
      : payload && payload.data && Array.isArray(payload.data.recommendations)
        ? payload.data.recommendations
        : null;
  if (!entries) {
    return { state: 'error', ids: new Set(), detail: 'skill_advisor.py returned output that is not a recommendation list.' };
  }
  const ids = new Set();
  for (const entry of entries) {
    if (!entry || typeof entry !== 'object') continue;
    // Only the recommended skill identity is a hit. A mode or workflowMode field rides
    // along on another hub's recommendation and would name a mode it cannot serve.
    if (typeof entry.skill === 'string' && entry.skill) ids.add(entry.skill);
  }
  return { state: 'ok', ids, count: entries.length, detail: `The scorer returned ${entries.length} recommendation(s).` };
}

function runMirrorChecks(context) {
  const checks = [
    { label: 'command-tree parity', command: 'bash', args: [context.paths.commandTreeParity] },
    { label: 'Codex prompt sync', command: process.execPath, args: [context.paths.codexPromptSync, '--check'] },
    { label: 'Pi prompt sync', command: process.execPath, args: [context.paths.piPromptSync, '--check'] },
  ];
  const entries = checks.map(({ label, command, args }) => {
    const result = runChild(context, command, args, { timeoutMs: MIRROR_CHECK_TIMEOUT_MS });
    const code = result && Number.isInteger(result.code) ? result.code : null;
    return {
      label,
      code,
      reason: result && result.error ? result.error : firstLineOf((result && (result.stderr || result.stdout)) || ''),
    };
  });
  return {
    entries,
    drifted: entries.filter((entry) => entry.code === 1),
    broken: entries.filter((entry) => entry.code !== 0 && entry.code !== 1),
  };
}

function stageTwoIntentProbe({ mode, stageTwo, parsedRouter }) {
  if (!stageTwo.present) {
    return { status: 'FINDING', detail: 'The hub has no ROUTER.md, so stage two declares no intent map.' };
  }
  if (stageTwo.intentKeys.length === 0 || stageTwo.resourceKeys.length === 0) {
    return { status: 'FINDING', detail: 'ROUTER.md declares no INTENT_SIGNALS and RESOURCE_MAP pair to route on.' };
  }
  const strayIntents = stageTwo.intentKeys.filter((key) => !stageTwo.resourceKeys.includes(key));
  const strayResources = stageTwo.resourceKeys.filter((key) => !stageTwo.intentKeys.includes(key));
  if (strayIntents.length || strayResources.length) {
    const parts = [];
    if (strayIntents.length) parts.push(`no RESOURCE_MAP entry for ${strayIntents.join(', ')}`);
    if (strayResources.length) parts.push(`no INTENT_SIGNALS entry for ${strayResources.join(', ')}`);
    return { status: 'FINDING', detail: `INTENT_SIGNALS and RESOURCE_MAP keys differ: ${parts.join('; ')}.` };
  }
  if (!mode) {
    return {
      status: 'PASS',
      detail: `${stageTwo.intentKeys.length} stage-two intent(s) map ${stageTwo.pathCount} resource path(s), and the two key sets match.`,
    };
  }
  const packet = modePacketName(mode);
  const prefixes = [...new Set([packet, mode.workflowMode].filter(Boolean))];
  const underMode = (entry) => prefixes.some((prefix) => entry === prefix || entry.startsWith(`${prefix}/`));
  // The full-toolkit intent loads every leaf the hub owns, so it says nothing about
  // whether this mode's own stage-two intent reaches its packet and must not stand in
  // for one that does not.
  const ownIntent = (key) => key !== FULL_INVENTORY_KEY;
  const textHits = stageTwo.resourceKeys.filter((key) => ownIntent(key)
    && (stageTwo.resources[key] || []).some(underMode));
  const replayMap = parsedRouter && parsedRouter.resourceMap ? parsedRouter.resourceMap : {};
  const replayHits = Object.keys(replayMap).filter((key) => ownIntent(key)
    && (replayMap[key] || []).some(underMode));
  if (textHits.length === 0 && replayHits.length === 0) {
    return {
      status: 'FINDING',
      detail: `No stage-two intent loads ${packet}/ leaves, so the mode is selected and loads nothing.`,
    };
  }
  const intents = textHits.length ? textHits : replayHits;
  return {
    status: 'PASS',
    detail: `Stage-two intent(s) ${intents.join(', ')} load ${packet}/ leaves, and the two key sets match.`,
  };
}

function stageTwoInventoryProbe({ mode, stageTwo }) {
  if (!stageTwo.present || !stageTwo.fullInventoryPresent) {
    return { status: 'N/A', detail: 'The hub defines no FULL_INVENTORY block, so there is no full-toolkit intent to extend.' };
  }
  if (stageTwo.fullInventoryPaths.length === 0) {
    return { status: 'FINDING', detail: 'FULL_INVENTORY is declared but lists no resource paths.' };
  }
  if (!mode) {
    return { status: 'PASS', detail: `FULL_INVENTORY lists ${stageTwo.fullInventoryPaths.length} resource path(s).` };
  }
  const packet = modePacketName(mode);
  const prefixes = [...new Set([packet, mode.workflowMode].filter(Boolean))];
  const hits = stageTwo.fullInventoryPaths.filter((entry) => (
    prefixes.some((prefix) => entry === prefix || entry.startsWith(`${prefix}/`))
  ));
  if (hits.length === 0) {
    return { status: 'FINDING', detail: `FULL_INVENTORY omits the mode's ${packet}/ leaves, so the full-toolkit intent silently skips it.` };
  }
  return { status: 'PASS', detail: `FULL_INVENTORY carries ${hits.length} ${packet}/ path(s).` };
}

function hubVocabularyProbe({ mode, vocabulary, graphMetadata }) {
  if (!graphMetadata || typeof graphMetadata !== 'object') {
    return { status: 'FINDING', detail: 'graph-metadata.json is missing or unreadable, so the hub carries no advisor vocabulary.' };
  }
  const signals = Array.isArray(graphMetadata.intent_signals) ? graphMetadata.intent_signals : [];
  const derived = graphMetadata.derived && Array.isArray(graphMetadata.derived.trigger_phrases)
    ? graphMetadata.derived.trigger_phrases
    : [];
  if (signals.length === 0) {
    return { status: 'FINDING', detail: 'graph-metadata.json carries no intent_signals, so the advisor has nothing to surface the hub on.' };
  }
  if (!mode) {
    return {
      status: 'PASS',
      detail: `graph-metadata.json carries ${signals.length} intent signal(s) and ${derived.length} derived trigger phrase(s).`,
    };
  }
  const phrases = [...signals, ...derived].map((entry) => String(entry).toLowerCase());
  const keywords = vocabulary ? vocabulary.keywords : [];
  // A phrase only counts where it stands as its own token sequence: a substring test
  // would let a short keyword match inside an unrelated word.
  const hits = keywords.filter((keyword) => {
    const lowered = String(keyword).toLowerCase();
    return lowered.length > 0 && phrases.some((phrase) => modeTokenPattern(lowered).test(phrase));
  });
  if (hits.length === 0) {
    return {
      status: 'FINDING',
      detail: `None of the mode's ${keywords.length} phrase(s) appear in the hub's advisor vocabulary, so the advisor never surfaces the hub for its requests.`,
    };
  }
  return {
    status: 'PASS',
    detail: `${hits.length} of the mode's ${keywords.length} phrase(s) appear in the hub's advisor vocabulary, such as "${hits[0]}".`,
  };
}

// A hub states its size in prose, as "fifteen workflow modes across fourteen packets"
// does. That paired statement is a promise about the registry, so it is compared rather
// than trusted. A bare "one mode with no signal" describes a subset, so only the paired
// form is read as a total.
const COUNT_WORDS = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
};

function statedModePacketPairs(text) {
  const pairs = [];
  const words = Object.keys(COUNT_WORDS).join('|');
  const value = (raw) => (/^\d+$/.test(raw) ? Number(raw) : COUNT_WORDS[raw.toLowerCase()]);
  const pattern = new RegExp(
    `\\b(\\d+|${words})\\s+(?:[a-z-]+\\s+)?modes?\\s+across\\s+(\\d+|${words})\\s+packets?\\b`,
    'gi',
  );
  for (const match of String(text || '').matchAll(pattern)) {
    const modes = value(match[1]);
    const packetTotal = value(match[2]);
    if (Number.isInteger(modes) && Number.isInteger(packetTotal)) pairs.push({ modes, packets: packetTotal });
  }
  return pairs;
}

function hubModeTableProbe({ skillText, modeIds, packets, subject }) {
  if (typeof skillText !== 'string' || skillText === '') {
    return { status: 'FINDING', detail: 'The hub carries no readable SKILL.md, so an agent that loads the hub cannot see its modes.' };
  }
  const rows = modeTableRows(skillText);
  if (rows.length === 0) {
    return { status: 'FINDING', detail: 'The hub SKILL.md documents no modes in a table.' };
  }
  const named = (token) => rows.some((row) => modeTokenPattern(token).test(row));
  const absent = modeIds.filter((id) => !named(id));
  if (subject && !modeIds.includes(subject) && !named(subject)) {
    return { status: 'FINDING', detail: `${subject} is not named in the hub SKILL.md mode table.` };
  }
  if (absent.length) {
    return { status: 'FINDING', detail: `Registered mode(s) absent from the SKILL.md mode table: ${absent.join(', ')}.` };
  }
  const packetCount = Array.isArray(packets) ? packets.length : null;
  const statedPairs = statedModePacketPairs(skillText);
  const mismatches = [];
  for (const pair of statedPairs) {
    if (pair.modes !== modeIds.length || (packetCount !== null && pair.packets !== packetCount)) {
      const declared = packetCount === null
        ? `${modeIds.length} modes`
        : `${modeIds.length} modes across ${packetCount} packets`;
      mismatches.push(`states ${pair.modes} modes across ${pair.packets} packets but the registry declares ${declared}`);
    }
  }
  if (mismatches.length) {
    return { status: 'FINDING', detail: `The hub SKILL.md and mode-registry.json disagree: ${mismatches.join('; ')}.` };
  }
  const stated = statedPairs.length
    ? ` Its stated counts match the registry (${modeIds.length} modes across ${packetCount} packet(s)).`
    : '';
  return {
    status: 'PASS',
    detail: `The SKILL.md mode table names all ${modeIds.length} registered mode(s)${subject ? `, including ${subject}` : ''}.${stated}`,
  };
}

function hubDescriptionProbe({ description, subject }) {
  if (!description || typeof description !== 'object') {
    return { status: 'FINDING', detail: 'description.json is missing or unreadable, so the hub advertises no surface.' };
  }
  const missing = ['name', 'description', 'version', 'keywords'].filter((field) => !(field in description));
  if (missing.length || !Array.isArray(description.keywords)) {
    return { status: 'FINDING', detail: `description.json is missing field(s): ${missing.join(', ') || 'keywords is not a list'}.` };
  }
  const keywords = description.keywords;
  if (!subject) {
    return { status: 'PASS', detail: `description.json carries ${keywords.length} advertised keyword(s) and all four required fields.` };
  }
  const inKeywords = keywords.some((keyword) => modeTokenPattern(subject).test(String(keyword)));
  const inDescription = modeTokenPattern(subject).test(String(description.description || ''));
  if (!inKeywords && !inDescription) {
    return { status: 'FINDING', detail: `${subject} appears in neither the description.json keywords nor its description.` };
  }
  return {
    status: 'PASS',
    detail: `${subject} appears in the description.json ${inKeywords ? 'keywords' : 'description'}.`,
  };
}

// Only a table whose header names a mode axis documents modes; another table on the
// page lists terms, vocabulary or commands, and counting its rows would report coverage
// the hub does not have. A two-axis hub documents its surface and transport packets in
// their own table beside the mode table, so those headers count as mode axes too.
const AXIS_TABLE_HEADERS = new Set(['mode', 'surface', 'transport']);

function modeTableRows(source) {
  const isRow = (line) => line.trimStart().startsWith('|');
  const cells = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|')
    .map((cell) => cell.replace(/[*`]/g, '').trim().toLowerCase());
  const isRule = (line) => cells(line).every((cell) => /^:?-+:?$/.test(cell));
  const rows = [];
  let fenced = false;
  let header = null;
  for (const line of String(source || '').split('\n')) {
    if (/^\s*```/.test(line)) {
      fenced = !fenced;
      header = null;
      continue;
    }
    if (fenced) continue;
    if (!isRow(line)) {
      header = null;
      continue;
    }
    if (header === null) {
      header = cells(line);
      continue;
    }
    if (header.some((cell) => AXIS_TABLE_HEADERS.has(cell)) && !isRule(line)) rows.push(line);
  }
  return rows;
}

function modeTokenPattern(token) {
  const escaped = String(token).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^A-Za-z0-9_-])${escaped}([^A-Za-z0-9_-]|$)`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. INTEGRATION SPAWN WRAPPERS
// ─────────────────────────────────────────────────────────────────────────────

// A skill's conversion ends by wiring it into surfaces no create script owns. Each
// surface is a separate process with its own exit protocol, so the mapping from a
// finished process to a written result stays here rather than in the caller.
function pythonCommand(context) {
  if (context.python) return context.python;
  const fromEnv = context.env && context.env.PYTHON;
  return fromEnv || 'python3';
}

function runAdvisorScan(context) {
  return runChild(context, process.execPath, [context.paths.advisor, 'skill_graph_scan', '--trusted']);
}

function runSkillGraphCompiler(context) {
  return runChild(context, pythonCommand(context), [context.paths.skillGraphCompiler, '--export-json']);
}

// Hermes keeps generated copies by frontmatter name while every other runtime
// links the skills root whole, so it is the only mirror with a write to run and a
// drift check to read back.
function runHermesSync(context, { check = false } = {}) {
  const args = [context.paths.hermesSync];
  if (check) args.push('--check');
  return runChild(context, process.execPath, args);
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  ADVISOR_TIMEOUT_MS,
  CheckError,
  createContext,
  ensurePreconditions,
  ensurePython,
  findRepoRoot,
  isReservedSkillName,
  classifyInput,
  classifyLocation,
  changelogStatus,
  checkSlugDefaults,
  collectSkillFiles,
  contextForSkillTarget,
  countRegressionCases,
  extractRootMetadata,
  findHubMode,
  hubDescriptionProbe,
  hubModeTableProbe,
  hubModeVocabulary,
  hubVocabularyProbe,
  invariantFailures,
  invariantPasses,
  mapValidatorExit,
  metadataTarget,
  modePacketName,
  parseInvariantLines,
  parseJsonOutput,
  readHubStageTwo,
  readJsonFile,
  readSkillFields,
  readTextFile,
  resolveHubTarget,
  resolveSkillTarget,
  rootMetadataInvocation,
  runAdvisorProjection,
  runChild,
  runCompiledRoute,
  runMirrorChecks,
  runParentSkillCheck,
  safeSkillName,
  skillRepositoryRoot,
  stageTwoIntentProbe,
  stageTwoInventoryProbe,
  inspectCollisions,
  pythonCommand,
  runAdvisorScan,
  runHermesSync,
  runSkillGraphCompiler,
};
