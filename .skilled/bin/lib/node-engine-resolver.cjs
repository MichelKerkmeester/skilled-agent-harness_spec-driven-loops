// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIB: Node Engine Resolver                                                ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const NODE_BINARY_NAMES = Object.freeze(['node', 'node.exe']);

// Asking an interpreter for its own version is the last rung of the version
// ladder, reached only when neither the candidate path nor its symlink target
// carries one. It executes a binary, so it stays bounded: a fixed argument
// list, no shell, ignored input, a short timeout, and a cap on how many
// distinct interpreters may be asked during one enumeration.
const INTERPRETER_PROBE_TIMEOUT_MS = 2000;
const INTERPRETER_PROBE_MAX_BUFFER = 64 * 1024;
const INTERPRETER_PROBE_LIMIT = 16;
const VERSION_COMPONENT_PATTERN = '(?:0|[1-9]\\d*)';
const VERSION_TOKEN_PATTERN = [
  `(?:${VERSION_COMPONENT_PATTERN}`,
  `|${VERSION_COMPONENT_PATTERN}\\.${VERSION_COMPONENT_PATTERN}`,
  `\\.${VERSION_COMPONENT_PATTERN})`,
].join('');
const COMPARATOR_RANGE_PATTERN = new RegExp(
  `^>=(${VERSION_TOKEN_PATTERN})\\s+<(${VERSION_TOKEN_PATTERN})$`,
);
const MAJOR_RANGE_PATTERN = /^(0|[1-9]\d*)$/;
const VERSION_PATTERN = /^v?(0|[1-9]\d*)(?:\.(0|[1-9]\d*)(?:\.(0|[1-9]\d*))?)?$/;

const VERSION_MANAGER_LAYOUTS = Object.freeze([
  Object.freeze({
    name: 'nvm',
    rootParts: ['.nvm', 'versions', 'node'],
    binaryParts: ['bin', 'node'],
  }),
  Object.freeze({
    name: 'fnm',
    rootParts: ['.fnm', 'node-versions'],
    binaryParts: ['installation', 'bin', 'node'],
  }),
  Object.freeze({
    name: 'volta',
    rootParts: ['.volta', 'tools', 'image', 'node'],
    binaryParts: ['bin', 'node'],
  }),
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. VERSION AND RANGE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseNodeVersion(value, options = {}) {
  if (typeof value !== 'string') return null;

  const match = VERSION_PATTERN.exec(value.trim());
  if (!match) return null;
  if (match[2] === undefined && options.allowMajorShorthand === false) return null;
  if (match[2] !== undefined && match[3] === undefined) return null;

  const version = {
    major: Number.parseInt(match[1], 10),
    minor: Number.parseInt(match[2] ?? '0', 10),
    patch: Number.parseInt(match[3] ?? '0', 10),
  };
  return Object.values(version).every(Number.isSafeInteger) ? version : null;
}

function compareNodeVersions(left, right) {
  if (left.major !== right.major) return left.major - right.major;
  if (left.minor !== right.minor) return left.minor - right.minor;
  return left.patch - right.patch;
}

function incrementMajorVersion(version) {
  if (version.major === Number.MAX_SAFE_INTEGER) return null;
  return { major: version.major + 1, minor: 0, patch: 0 };
}

function parseNodeEngineRange(range) {
  if (typeof range !== 'string') return null;

  const normalizedRange = range.trim();
  const majorMatch = MAJOR_RANGE_PATTERN.exec(normalizedRange);
  if (majorMatch) {
    const lowerBound = parseNodeVersion(`${majorMatch[1]}.0.0`, {
      allowMajorShorthand: false,
    });
    const upperBound = lowerBound ? incrementMajorVersion(lowerBound) : null;
    return upperBound ? { lowerBound, upperBound } : null;
  }

  const comparatorMatch = COMPARATOR_RANGE_PATTERN.exec(normalizedRange);
  if (!comparatorMatch) return null;

  const lowerBound = parseNodeVersion(comparatorMatch[1], { allowMajorShorthand: true });
  const upperBound = parseNodeVersion(comparatorMatch[2], { allowMajorShorthand: true });
  if (!lowerBound || !upperBound || compareNodeVersions(lowerBound, upperBound) >= 0) {
    return null;
  }
  return { lowerBound, upperBound };
}

function isNodeVersionInRange(version, range) {
  return compareNodeVersions(version, range.lowerBound) >= 0
    && compareNodeVersions(version, range.upperBound) < 0;
}

function parseVersionFromPath(candidatePath) {
  if (typeof candidatePath !== 'string') return null;

  const segments = candidatePath.split(/[\\/]/).filter(Boolean).reverse();
  for (const segment of segments) {
    const version = parseNodeVersion(segment, { allowMajorShorthand: false });
    if (version) return version;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. HOST ACCESS AND CANDIDATE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function createDefaultHostAccess() {
  const environment = process.env;
  return {
    environment,
    homeDirectory: os.homedir(),
    listDirectory: (directoryPath) => fs.readdirSync(directoryPath, { withFileTypes: true }),
    pathEntries: (environment.PATH ?? '').split(path.delimiter).filter(Boolean),
    probeVersion: (interpreterPath) => execFileSync(interpreterPath, ['-v'], {
      encoding: 'utf8',
      maxBuffer: INTERPRETER_PROBE_MAX_BUFFER,
      shell: false,
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: INTERPRETER_PROBE_TIMEOUT_MS,
      windowsHide: true,
    }),
    readFile: (filePath) => fs.readFileSync(filePath, 'utf8'),
    realPath: (filePath) => fs.realpathSync(filePath),
    runningInterpreter: {
      path: process.execPath,
      version: process.versions.node,
    },
  };
}

function normalizeHostAccess(suppliedHost = {}) {
  const defaults = createDefaultHostAccess();
  const environment = suppliedHost.environment ?? suppliedHost.env ?? defaults.environment;
  const homeDirectory = suppliedHost.homeDirectory
    ?? environment.HOME
    ?? defaults.homeDirectory;
  const runningInterpreter = suppliedHost.runningInterpreter ?? {
    path: suppliedHost.runningInterpreterPath ?? defaults.runningInterpreter.path,
    version: suppliedHost.runningInterpreterVersion,
  };
  const pathEntries = suppliedHost.pathEntries
    ?? suppliedHost.searchPath
    ?? (environment.PATH ?? '').split(path.delimiter).filter(Boolean);

  return {
    environment,
    homeDirectory,
    listDirectory: suppliedHost.listDirectory ?? defaults.listDirectory,
    pathEntries: Array.isArray(pathEntries)
      ? pathEntries
      : String(pathEntries).split(path.delimiter),
    probeVersion: suppliedHost.probeVersion ?? defaults.probeVersion,
    readFile: suppliedHost.readFile ?? defaults.readFile,
    realPath: suppliedHost.realPath ?? defaults.realPath,
    runningInterpreter,
  };
}

function candidateFromPath(candidatePath, suppliedVersion, source) {
  if (typeof candidatePath !== 'string' || candidatePath.length === 0) return null;

  const version = suppliedVersion === undefined
    ? parseVersionFromPath(candidatePath)
    : parseNodeVersion(String(suppliedVersion), { allowMajorShorthand: false });
  if (!version) return null;

  return { path: candidatePath, source, version };
}

function entryName(entry) {
  if (typeof entry === 'string') return entry;
  return entry && typeof entry.name === 'string' ? entry.name : null;
}

function isDirectoryEntry(entry) {
  return typeof entry === 'string'
    || typeof entry?.isDirectory !== 'function'
    || entry.isDirectory();
}

// A search-path entry is a candidate when it is anything other than a
// directory. Requiring the opposite silently discards every real interpreter,
// because a directory listing with file types reports a binary as not a
// directory; only a listing of bare strings would pass such a test.
function isInterpreterEntry(entry) {
  if (typeof entry === 'string') return true;
  if (typeof entry?.isDirectory !== 'function') return true;
  return !entry.isDirectory();
}

function readDirectory(listDirectory, directoryPath) {
  try {
    const entries = listDirectory(directoryPath);
    return Array.isArray(entries) ? entries : [];
  } catch {
    return [];
  }
}

function managerRoot(homeDirectory, environment, layout) {
  const variableNames = { nvm: 'NVM_DIR', fnm: 'FNM_DIR', volta: 'VOLTA_HOME' };
  const override = environment[variableNames[layout.name]];
  if (override) {
    if (layout.name === 'nvm') return path.join(override, 'versions', 'node');
    if (layout.name === 'fnm') return path.join(override, 'node-versions');
    return path.join(override, 'tools', 'image', 'node');
  }
  return path.join(homeDirectory, ...layout.rootParts);
}

function addCandidate(candidateMap, candidate) {
  if (!candidate) return;

  const previous = candidateMap.get(candidate.path);
  if (!previous || compareNodeVersions(candidate.version, previous.version) > 0) {
    candidateMap.set(candidate.path, candidate);
  }
}

function resolveRealPath(host, candidatePath) {
  try {
    const resolved = host.realPath(candidatePath);
    return typeof resolved === 'string' && resolved.length > 0 ? resolved : null;
  } catch {
    return null;
  }
}

function probeInterpreterVersion(host, interpreterPath, probeBudget) {
  if (probeBudget.answers.has(interpreterPath)) {
    return probeBudget.answers.get(interpreterPath);
  }
  if (probeBudget.remaining <= 0) return null;
  probeBudget.remaining -= 1;

  let version = null;
  try {
    version = parseNodeVersion(String(host.probeVersion(interpreterPath) ?? '').trim(), {
      allowMajorShorthand: false,
    });
  } catch {
    version = null;
  }
  probeBudget.answers.set(interpreterPath, version);
  return version;
}

// Widening cost: the candidate's own path, then the path it links to, then the
// interpreter itself. Version managers name the version in the path, so the
// cheap rung answers for them; a package-manager or installer layout that does
// not is why the later rungs exist.
function searchPathCandidateVersion(host, candidatePath, probeBudget) {
  const fromCandidatePath = parseVersionFromPath(candidatePath);
  if (fromCandidatePath) return { source: 'PATH', version: fromCandidatePath };

  const realPath = resolveRealPath(host, candidatePath);
  if (realPath && realPath !== candidatePath) {
    const fromRealPath = parseVersionFromPath(realPath);
    if (fromRealPath) return { source: 'PATH-link', version: fromRealPath };
  }

  const probed = probeInterpreterVersion(host, realPath ?? candidatePath, probeBudget);
  return probed ? { source: 'PATH-probe', version: probed } : null;
}

function enumerateSearchPathCandidates(host, candidateMap, probeBudget) {
  for (const directoryPath of host.pathEntries) {
    if (typeof directoryPath !== 'string' || directoryPath.length === 0) continue;
    for (const entry of readDirectory(host.listDirectory, directoryPath)) {
      const name = entryName(entry);
      if (!name || !NODE_BINARY_NAMES.includes(name) || !isInterpreterEntry(entry)) continue;

      const candidatePath = path.join(directoryPath, name);
      const resolved = searchPathCandidateVersion(host, candidatePath, probeBudget);
      if (!resolved) continue;
      addCandidate(candidateMap, {
        path: candidatePath,
        source: resolved.source,
        version: resolved.version,
      });
    }
  }
}

function enumerateManagerCandidates(host, candidateMap) {
  const roots = new Set();
  for (const layout of VERSION_MANAGER_LAYOUTS) {
    const root = managerRoot(host.homeDirectory, host.environment, layout);
    if (roots.has(root)) continue;
    roots.add(root);

    for (const entry of readDirectory(host.listDirectory, root)) {
      const versionDirectory = entryName(entry);
      if (!versionDirectory || !isDirectoryEntry(entry)) continue;
      const version = parseNodeVersion(versionDirectory, { allowMajorShorthand: false });
      if (!version) continue;
      addCandidate(
        candidateMap,
        candidateFromPath(
          path.join(root, versionDirectory, ...layout.binaryParts),
          versionDirectory,
          layout.name,
        ),
      );
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Enumerate Node interpreter paths visible to the host.
 *
 * The running interpreter and the version-manager layouts declare their version
 * in the path, so they cost a directory read. A search-path candidate that
 * declares none is asked for its version directly, under the probe budget.
 *
 * @param {Object} [suppliedHost] - Host access and lookup configuration.
 * @returns {Array<Object>} Candidate records with path, version, and source.
 */
function enumerateNodeCandidates(suppliedHost = {}) {
  const host = normalizeHostAccess(suppliedHost);
  const candidateMap = new Map();
  const running = host.runningInterpreter ?? {};
  const probeBudget = { answers: new Map(), remaining: INTERPRETER_PROBE_LIMIT };

  addCandidate(candidateMap, candidateFromPath(
    running.path,
    running.version,
    'running-interpreter',
  ));
  enumerateSearchPathCandidates(host, candidateMap, probeBudget);
  enumerateManagerCandidates(host, candidateMap);

  return [...candidateMap.values()].sort((left, right) => (
    compareNodeVersions(right.version, left.version)
    || left.path.localeCompare(right.path)
  ));
}

function readManifestRange(manifestPath, readFile) {
  if (typeof manifestPath !== 'string' || manifestPath.length === 0) {
    return { reason: 'missing-manifest', range: null, parsedRange: null };
  }

  let manifest;
  try {
    manifest = JSON.parse(readFile(manifestPath));
  } catch {
    return { reason: 'unreadable-manifest', range: null, parsedRange: null };
  }

  const range = manifest?.engines?.node;
  if (typeof range !== 'string') {
    return { reason: 'missing-range', range: null, parsedRange: null };
  }

  const parsedRange = parseNodeEngineRange(range);
  if (!parsedRange) return { reason: 'unsupported-range', range, parsedRange: null };
  return { reason: null, range, parsedRange };
}

function selectNodeCandidate(candidates, parsedRange) {
  return candidates.find(
    (candidate) => isNodeVersionInRange(candidate.version, parsedRange),
  ) ?? null;
}

/**
 * Resolve the highest host interpreter satisfying the manifest's Node range.
 *
 * Only full comparator ranges (`>=A.B.C <X.Y.Z`) and major shorthand (`A`) are
 * supported. Unsupported syntax fails closed because an approximate match could
 * load a native module with an incompatible V8 ABI.
 *
 * @param {Object} options - Manifest path and optional injected host access.
 * @param {string} options.manifestPath - Package manifest to read.
 * @param {Object} [options.host] - Injected host access for deterministic tests.
 * @returns {{path: string|null, range: string|null, reason: string|null}} Resolution result.
 */
function resolveNodeInterpreter(options = {}) {
  const suppliedHost = options.host ?? options;
  const host = normalizeHostAccess(suppliedHost);
  const manifest = readManifestRange(options.manifestPath, host.readFile);
  if (manifest.reason) {
    return { path: null, range: manifest.range, reason: manifest.reason };
  }

  const candidate = selectNodeCandidate(
    enumerateNodeCandidates(host),
    manifest.parsedRange,
  );
  return {
    path: candidate?.path ?? null,
    range: manifest.range,
    reason: candidate ? null : 'unsatisfied',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  enumerateNodeCandidates,
  isNodeVersionInRange,
  parseNodeEngineRange,
  parseNodeVersion,
  resolveNodeInterpreter,
};
