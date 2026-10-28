// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Repository Config Discovery and Merge
// ───────────────────────────────────────────────────────────────────
'use strict';

// The config file's whole lifecycle below trust: which source discovery picked, what the
// file says, how the repository layer merges over the shipped defaults, and the draft
// init writes from the manifests a repository carries. Only the repository layer may name
// a check that runs, and a command read from a manifest comes back as a suggestion with
// the entry that would enable it.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const { REPOSITORY_PATTERN, currentRepository, repositoryMatches } = require('../../../shared/scripts/lib/repository-identity.cjs');

const {
  CONFIG_CANDIDATES, GIT_CONFIG_KEY, LEGACY_CONFIG_FILE, declaredRepository,
  fileScopedGitValue, refuseNamedLegacyPath, repoConfigTarget,
} = require('./quality-config-trust.cjs');

const {
  ConfigError, FILES_TOKEN, SENSOR_KINDS, displayPath, isInside, isPlainObject, issue,
  lstatOrNull,
  parseConfigJson, readJsonQuiet, readTextQuiet, realOrSelf, statOrNull, validateConfig,
} = require('./quality-config-schema.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The skill root comes from this file's real path, so a repository that reaches
// the hub through a link still reads the hub's own assets.
const QUALITY_ROOT = path.resolve(path.dirname(fs.realpathSync(__filename)), '..', '..');
const TEMPLATE_PATH = path.join(QUALITY_ROOT, 'assets', 'quality-config.template.json');

// A script that rewrites files is a fixer, and a gate never runs one.
const FIXER_FLAG = /(?:^|\s)--(?:fix|write)\b/;
const SUGGESTED_SCRIPTS = Object.freeze(['typecheck', 'lint', 'format:check']);

// ─────────────────────────────────────────────────────────────────────────────
// 3. DISCOVERY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pick the one repository config source, most explicit first: --config relative to
 * the working directory, the file-scoped git config value relative to the root, then the
 * config the skill folder carries, at the first candidate that exists. A named path that
 * points nowhere is a broken install, never a fall back to the next source, and a path
 * inside the old root-level location is refused with CONFIG_LEGACY_LOCATION, whether
 * discovery found it or a source named it, so a stale copy cannot be read in silence.
 *
 * `value` is the git config value discovery read, verbatim, and null for every other
 * source. A trust decision needs it, because whether that value sits in the repository's
 * own .git/config is a different question from which scope git labels it with.
 *
 * `ignored` is set only when the candidate exists and names another repository. It holds
 * the path, the repository the file declares and the one read here, so a caller can report
 * why a committed config applied to nothing.
 *
 * @param {Object} options - cliPath, cwd, root, git and env.
 * @returns {{source:string, path:string|null, scope:string|null, value:string|null, ignored?:Object}}
 *   source is cli, git-config, repo or none, and scope is the git config scope that
 *   supplied it.
 */
function discoverConfig({ cliPath = null, cwd, root, git, env = process.env }) {
  if (cliPath) {
    const file = path.resolve(cwd, cliPath);
    if (!statOrNull(file)) {
      throw new ConfigError('CONFIG_PATH_MISSING', `--config names ${file}, which does not exist`, { source: 'cli', path: file, scope: null });
    }
    refuseNamedLegacyPath(file, root, 'cli', null);
    return { source: 'cli', path: file, scope: null, value: null };
  }
  if (git) {
    const configured = fileScopedGitValue(root, env);
    if (configured) {
      const file = path.resolve(root, configured.value);
      if (!statOrNull(file)) {
        throw new ConfigError('CONFIG_PATH_MISSING', `git config ${GIT_CONFIG_KEY} names ${file}, which does not exist`,
          { source: 'git-config', path: file, scope: configured.scope });
      }
      refuseNamedLegacyPath(file, root, 'git-config', configured.scope);
      return { source: 'git-config', path: file, scope: configured.scope, value: configured.value };
    }
  }
  const legacy = path.join(root, LEGACY_CONFIG_FILE);
  if (lstatOrNull(legacy)) {
    throw new ConfigError('CONFIG_LEGACY_LOCATION', `${LEGACY_CONFIG_FILE} is no longer read: move it to ${repoConfigTarget(root)}`,
      { source: 'repo', path: legacy, scope: null });
  }
  const file = CONFIG_CANDIDATES.map((candidate) => path.join(root, candidate)).find((candidate) => lstatOrNull(candidate));
  if (!file) return { source: 'none', path: null, scope: null, value: null };
  const declared = declaredRepository(file);
  const namesRepository = typeof declared === 'string' && REPOSITORY_PATTERN.test(declared.trim());
  // An absent field applies everywhere. A value the pattern refuses is a config fault rather
  // than another repository, so it stays a repository source and validation names the field.
  if (declared === undefined || !namesRepository) return { source: 'repo', path: file, scope: null, value: null };
  const current = currentRepository({ root, env }).identity;
  if (repositoryMatches(declared, current)) return { source: 'repo', path: file, scope: null, value: null };
  return { source: 'none', path: null, scope: null, value: null, ignored: { path: file, repository: declared, current } };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MERGE
// ─────────────────────────────────────────────────────────────────────────────

function normalizeCommand(entry, index, kind) {
  const severity = entry.severity || 'P1';
  return {
    id: entry.id || `generated-${index + 1}`,
    kind,
    argv: [...entry.argv],
    languages: kind === 'check' && Array.isArray(entry.languages) ? [...entry.languages] : null,
    paths: Array.isArray(entry.paths) ? [...entry.paths] : null,
    cwd: entry.cwd || '.',
    requires: entry.requires || entry.argv[0],
    severity,
    required: typeof entry.required === 'boolean' ? entry.required : severity === 'P0',
    timeoutSec: entry.timeoutSec || null,
  };
}

/**
 * Merge the repository layer over the base layer. Only the repository layer declares
 * checks. Lists append, sensors merge per sensor, and nothing the base layer holds can
 * be removed.
 *
 * @param {Object} defaults - The parsed quality-defaults.json.
 * @param {Object|null} repo - The validated repository config, or null.
 * @returns {Object} exclude, sensors, checklists, generated, checks and commentHygiene.
 */
function mergeConfig(defaults, repo) {
  const layer = repo || {};
  const hygiene = layer.commentHygiene || {};
  const sensors = {};
  for (const name of Object.keys(SENSOR_KINDS)) {
    const base = (defaults.sensors && defaults.sensors[name]) || {};
    const own = (layer.sensors && layer.sensors[name]) || {};
    sensors[name] = { ...base, ...own, exclude: [...(base.exclude || []), ...(own.exclude || [])] };
    if (SENSOR_KINDS[name] === 'exact') delete sensors[name].enabled;
  }
  return {
    exclude: [...(defaults.exclude || []), ...(layer.exclude || [])],
    sensors,
    checklists: [
      ...(defaults.checklists || []).map((row) => ({ ...row, layer: 'defaults' })),
      ...(layer.checklists || []).map((row) => ({ ...row, layer: 'repo' })),
    ],
    generated: [
      ...(defaults.generated || []).map((row) => ({ ...row, layer: 'defaults' })),
      ...(layer.generated || []).map((row, index) => ({ ...normalizeCommand(row, index, 'generated'), layer: 'repo' })),
    ],
    checks: (layer.checks || []).map((entry, index) => normalizeCommand(entry, index, 'check')),
    commentHygiene: {
      ticketPrefixes: [...(hygiene.ticketPrefixes || [])],
      extraPatterns: [...(hygiene.extraPatterns || [])],
      // The checker compares extensions in lower case, so the runner reads them the same way.
      extensions: Object.fromEntries(Object.entries(hygiene.extensions || {}).map(([ext, family]) => [ext.toLowerCase(), family])),
      exclude: [...(hygiene.exclude || [])],
      // Written bare and once each, the form the checker's --disable-rule takes. A
      // validated config names only core rules, so every entry resolves.
      disableRules: [...new Set((hygiene.disableRules || []).map((entry) => entry.slice(entry.indexOf('.') + 1)))],
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. LOAD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Discover, read, validate and merge in one call, the way the runner and the doctor
 * both need it. Discovery faults throw. Parse and schema faults come back in errors,
 * and merged is null whenever errors is not empty.
 *
 * @param {Object} options - cliPath, cwd, root, git, env, defaults and builtinIds.
 * @returns {{source:string, path:string|null, scope:string|null, display:string|null, bytes:number|null, raw:*, errors:Object[], merged:Object|null, ignored?:Object}}
 */
function loadConfig({ cliPath = null, cwd, root, git, env = process.env, defaults, builtinIds = [] }) {
  const found = discoverConfig({ cliPath, cwd, root, git, env });
  const base = { source: found.source, scope: found.scope, path: found.path, value: found.value, display: displayPath(found.path, root), bytes: null, raw: null, errors: [] };
  // Only a config that named another repository carries this, so a reader sees why a committed
  // file applied to nothing rather than reading the run as unconfigured.
  if (found.ignored) base.ignored = found.ignored;
  if (!found.path) return { ...base, merged: mergeConfig(defaults, null) };
  // The committed file is the one source no operator named, so it must be this
  // repository's own content. A link that leads out of the repository is refused.
  if (found.source === 'repo' && !isInside(realOrSelf(found.path), realOrSelf(root))) {
    return { ...base, errors: [issue('', `${base.display} resolves to ${realOrSelf(found.path)}, outside the repository`)], merged: null };
  }
  const stat = statOrNull(found.path);
  if (!stat || !stat.isFile()) {
    return { ...base, errors: [issue('', `${base.display} is not a regular file`)], merged: null };
  }
  let text;
  try {
    text = fs.readFileSync(found.path, 'utf8');
  } catch (error) {
    return { ...base, errors: [issue('', `cannot read ${base.display}: ${error.message}`)], merged: null };
  }
  const bytes = Buffer.byteLength(text);
  let raw;
  try {
    raw = parseConfigJson(text);
  } catch (error) {
    return { ...base, bytes, errors: [issue('', `does not parse as JSON: ${error.message}`)], merged: null };
  }
  const errors = validateConfig(raw, { builtinIds });
  return { ...base, bytes, raw, errors, merged: errors.length > 0 ? null : mergeConfig(defaults, raw) };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SUGGESTIONS
// ─────────────────────────────────────────────────────────────────────────────

function suggestion(source, reason, entry) {
  return { id: entry.id, source, reason, entry };
}

/**
 * Read the manifests at the repository root and return the checks they imply. Nothing
 * here runs: each suggestion carries the config entry that would enable it, and a
 * script that runs tests or rewrites files is never suggested.
 *
 * @param {string} root - Repository root.
 * @returns {Array<{id:string, source:string, reason:string, entry:Object}>} The suggestions.
 */
function readSuggestions(root) {
  const out = [];
  const pkg = readJsonQuiet(path.join(root, 'package.json'));
  if (pkg && isPlainObject(pkg.scripts)) {
    for (const name of SUGGESTED_SCRIPTS) {
      const body = pkg.scripts[name];
      if (typeof body !== 'string' || FIXER_FLAG.test(body)) continue;
      out.push(suggestion('package.json', `package.json defines a ${name} script`, {
        id: name.replace(/[^a-z0-9-]/g, '-'), argv: ['npm', 'run', name], languages: ['javascript', 'typescript'],
        requires: 'npm', severity: 'P1', required: false,
      }));
    }
  }
  const pyproject = readTextQuiet(path.join(root, 'pyproject.toml'));
  if (pyproject !== null) {
    if (/^\s*\[tool\.ruff[\].]/m.test(pyproject)) {
      out.push(suggestion('pyproject.toml', 'pyproject.toml configures ruff', {
        id: 'ruff', argv: ['ruff', 'check', FILES_TOKEN], languages: ['python'], requires: 'ruff', severity: 'P1', required: false,
      }));
    }
    if (/^\s*\[tool\.mypy[\].]/m.test(pyproject)) {
      out.push(suggestion('pyproject.toml', 'pyproject.toml configures mypy', {
        id: 'mypy', argv: ['mypy', FILES_TOKEN], languages: ['python'], requires: 'mypy', severity: 'P1', required: false,
      }));
    }
  }
  if (fs.existsSync(path.join(root, 'Cargo.toml'))) {
    for (const verb of ['check', 'clippy']) {
      out.push(suggestion('Cargo.toml', 'Cargo.toml defines a Rust package', {
        id: `cargo-${verb}`, argv: ['cargo', verb], languages: ['rust'], cwd: 'package', requires: 'cargo', severity: 'P1', required: false,
      }));
    }
  }
  if (fs.existsSync(path.join(root, 'go.mod'))) {
    out.push(suggestion('go.mod', 'go.mod defines a Go module', {
      id: 'go-vet', argv: ['go', 'vet', './...'], languages: ['go'], cwd: 'package', requires: 'go', severity: 'P1', required: false,
    }));
  }
  let workflows = [];
  try {
    workflows = fs.readdirSync(path.join(root, '.github', 'workflows')).filter((name) => /\.ya?ml$/i.test(name));
  } catch {
    workflows = [];
  }
  if (workflows.length > 0) {
    out.push(suggestion('.github/workflows', 'the repository has GitHub Actions workflows', {
      id: 'actionlint', argv: ['actionlint', FILES_TOKEN], paths: ['.github/workflows/**'], requires: 'actionlint', severity: 'P1', required: false,
    }));
  }
  for (const name of ['GNUmakefile', 'makefile', 'Makefile']) {
    const text = readTextQuiet(path.join(root, name));
    if (text !== null && /^lint\s*:(?!=)/m.test(text)) {
      out.push(suggestion(name, `${name} defines a lint target`, {
        id: 'make-lint', argv: ['make', 'lint'], paths: ['**'], requires: 'make', severity: 'P1', required: false,
      }));
      break;
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. TEMPLATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The config init writes: the shipped template with every suggestion entered as a
 * check that is not required, so an absent tool warns instead of blocking.
 *
 * @param {string} root - Repository root.
 * @returns {{config:Object, suggestions:Object[]}} The config to write and what filled it.
 */
function initialConfig(root) {
  const template = JSON.parse(fs.readFileSync(TEMPLATE_PATH, 'utf8'));
  const suggestions = readSuggestions(root);
  return { config: { ...template, checks: suggestions.map((item) => ({ ...item.entry, required: false })) }, suggestions };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  TEMPLATE_PATH,
  discoverConfig,
  initialConfig,
  loadConfig,
  mergeConfig,
  readSuggestions,
};
