#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Dist Freshness Utility
// ---------------------------------------------------------------
// Shared source-vs-dist staleness checks for local TypeScript build outputs,
// without rebuilding or blocking on checker bugs.
// ---------------------------------------------------------------
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const STALE_EXIT_CODE = 69;
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.mts', '.cts', '.json']);
const MANIFEST_BASENAMES = new Set(['package.json', 'tsconfig.json', 'tsconfig.build.json']);
const DEFAULT_EXCLUDED_SEGMENTS = new Set(['node_modules', 'dist']);

const WORKSPACE_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');

const DIST_PACKAGES = Object.freeze([
  {
    id: 'system-spec-kit/shared',
    name: '@spec-kit/shared',
    root: '.opencode/skills/system-spec-kit/shared',
    distEntries: { default: 'dist/tsconfig.tsbuildinfo' },
    rebuildCommand: 'cd .opencode/skills/system-spec-kit/shared && npm run build',
    sourceCandidates: ['.'],
  },
  {
    id: 'system-spec-kit/scripts',
    name: '@spec-kit/scripts',
    root: '.opencode/skills/system-spec-kit/scripts',
    distEntries: { default: 'dist/tsconfig.tsbuildinfo' },
    rebuildCommand: 'cd .opencode/skills/system-spec-kit/scripts && npm run build',
    sourceCandidates: ['.'],
    excludedSegments: ['tests', 'test-fixtures'],
  },
  {
    id: 'system-spec-kit/mcp_server',
    name: '@spec-kit/mcp-server',
    root: '.opencode/skills/system-spec-kit/mcp_server',
    distEntries: {
      default: 'dist/tsconfig.tsbuildinfo',
      'spec-memory-cli': 'dist/spec-memory-cli.js',
      'validation-orchestrator': 'dist/lib/validation/orchestrator.js',
    },
    rebuildCommand: 'cd .opencode/skills/system-spec-kit/mcp_server && npm run build',
    sourceCandidates: [
      'package.json',
      'tsconfig.json',
      'api',
      'configs',
      'core',
      'formatters',
      'handlers',
      'hooks',
      'lib',
      'matrix_runners',
      'schemas',
      'scripts',
      'tools',
      'utils',
      'cli.ts',
      'spec-memory-cli.ts',
      'context-server.ts',
      'startup-checks.ts',
      'tool-schemas.ts',
    ],
    entrySourceCandidates: {
      'spec-memory-cli': ['package.json', 'tsconfig.json', 'spec-memory-cli.ts', 'tool-schemas.ts', 'schemas'],
      'validation-orchestrator': [
        'package.json',
        'tsconfig.json',
        'lib/validation',
        'lib/templates',
        'lib/spec',
        'lib/graph',
        'lib/config',
        'lib/description',
      ],
    },
    excludedSegments: ['tests', 'stress_test', 'test-helpers'],
  },
  {
    id: 'mcp-code-mode/mcp_server',
    name: '@utcp/code-mode-mcp',
    root: '.opencode/skills/mcp-code-mode/mcp_server',
    distEntries: { default: 'dist/index.js' },
    rebuildCommand: 'cd .opencode/skills/mcp-code-mode/mcp_server && npm run build',
    sourceCandidates: ['package.json', 'tsconfig.json', 'index.ts'],
  },
  {
    id: 'system-skill-advisor/mcp_server',
    name: '@spec-kit/system-skill-advisor',
    root: '.opencode/skills/system-skill-advisor/mcp_server',
    distEntries: {
      default: 'dist/mcp_server/advisor-server.js',
      'skill-advisor-cli': 'dist/mcp_server/skill-advisor-cli.js',
    },
    rebuildCommand: 'cd .opencode/skills/system-skill-advisor/mcp_server && npm run build',
    sourceCandidates: [
      'package.json',
      'tsconfig.json',
      'tsconfig.build.json',
      '../hooks',
      'advisor-server.ts',
      'skill-advisor-cli.ts',
      'skill-advisor-cli-manifest.ts',
      'compat',
      'handlers',
      'lib',
      'schemas',
      'tools',
      'data',
    ],
    entrySourceCandidates: {
      'skill-advisor-cli': [
        'package.json',
        'tsconfig.json',
        'tsconfig.build.json',
        'skill-advisor-cli.ts',
        'skill-advisor-cli-manifest.ts',
        'schemas/advisor-tool-schemas.ts',
        'tools',
      ],
    },
    excludedSegments: ['tests', 'stress_test', 'bench', '__tests__'],
  },
  {
    id: 'system-code-graph/mcp_server',
    name: '@spec-kit/system-code-graph',
    root: '.opencode/skills/system-code-graph',
    distEntries: {
      default: 'mcp_server/dist/tsconfig.tsbuildinfo',
      'code-index-cli': 'mcp_server/dist/code-index-cli.js',
    },
    rebuildCommand: 'cd .opencode/skills/system-code-graph && npm run build',
    sourceCandidates: ['package.json', 'tsconfig.json', 'mcp_server'],
    entrySourceCandidates: {
      'code-index-cli': [
        'package.json',
        'tsconfig.json',
        'mcp_server/code-index-cli.ts',
        'mcp_server/code-index-cli-manifest.ts',
        'mcp_server/tool-schemas.ts',
      ],
    },
    sourceExtensions: ['.ts', '.tsx', '.mts', '.cts'],
    excludedSegments: ['tests', 'stress_test', '__tests__'],
  },
  {
    id: 'sk-design/design-md-generator/backend',
    name: 'design-system-extractor',
    root: '.opencode/skills/sk-design/design-md-generator/backend',
    distEntries: { default: 'dist/cli.js' },
    rebuildCommand: 'cd .opencode/skills/sk-design/design-md-generator/backend && npm run build',
    sourceCandidates: ['package.json', 'tsconfig.json', 'tsconfig.build.json', 'scripts'],
    excludedSegments: ['tests', 'output'],
  },
]);

function workspaceRootFromOptions(options = {}) {
  return path.resolve(options.workspaceRoot || WORKSPACE_ROOT);
}

function packageById(packageId) {
  return DIST_PACKAGES.find((pkg) => pkg.id === packageId) || null;
}

function packageRoot(workspaceRoot, pkg) {
  return path.resolve(workspaceRoot, pkg.root);
}

function normalizeEntryName(pkg, entryName = 'default') {
  if (pkg.distEntries[entryName]) return entryName;
  if (entryName === 'default') return 'default';
  return null;
}

function distEntryFor(pkg, root, entryName = 'default') {
  const normalizedEntry = normalizeEntryName(pkg, entryName);
  if (!normalizedEntry) return null;
  return path.join(root, pkg.distEntries[normalizedEntry]);
}

function shouldSkipPath(filePath, root, pkg) {
  const relative = path.relative(root, filePath);
  const segments = relative.split(path.sep);
  const excluded = new Set([...DEFAULT_EXCLUDED_SEGMENTS, ...(pkg.excludedSegments || [])]);
  return segments.some((segment) => excluded.has(segment));
}

function sourceExtensionsFor(pkg) {
  return new Set(pkg.sourceExtensions || [...SOURCE_EXTENSIONS]);
}

function isWatchedSourceFile(filePath, pkg) {
  return sourceExtensionsFor(pkg).has(path.extname(filePath)) || MANIFEST_BASENAMES.has(path.basename(filePath));
}

function sourceCandidatesFor(pkg, entryName) {
  return pkg.entrySourceCandidates?.[entryName] || pkg.sourceCandidates;
}

function collectSourceFiles(pkg, root, entryName) {
  const files = [];
  const missing = [];
  const visitedRealPaths = new Set();

  const visit = (candidate) => {
    if (!fs.existsSync(candidate)) {
      missing.push(candidate);
      return;
    }
    const realPath = fs.realpathSync(candidate);
    if (visitedRealPaths.has(realPath)) return;
    visitedRealPaths.add(realPath);
    const stat = fs.statSync(candidate);
    if (stat.isDirectory()) {
      if (shouldSkipPath(candidate, root, pkg)) return;
      for (const entry of fs.readdirSync(candidate)) {
        visit(path.join(candidate, entry));
      }
      return;
    }
    if (!stat.isFile() || shouldSkipPath(candidate, root, pkg)) return;
    if (isWatchedSourceFile(candidate, pkg)) files.push(candidate);
  };

  for (const candidate of sourceCandidatesFor(pkg, entryName)) {
    visit(path.resolve(root, candidate));
  }

  return { files, missing };
}

function hashSourceFiles(root, sources) {
  const hash = crypto.createHash('sha256');
  for (const filePath of [...sources].sort()) {
    hash.update(path.relative(root, filePath));
    hash.update('\0');
    hash.update(fs.readFileSync(filePath));
    hash.update('\0');
  }
  return hash.digest('hex');
}

function cachePathFor(root, distEntry, pkg, entryName) {
  const suffix = crypto.createHash('sha1').update(`${pkg.id}:${entryName}:${distEntry}`).digest('hex').slice(0, 12);
  const safeId = pkg.id.replace(/[^a-z0-9_-]+/gi, '-');
  return path.join(path.dirname(distEntry), `.dist-freshness-${safeId}-${suffix}.json`);
}

function readStoredSourceHash(cachePath) {
  try {
    const parsed = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    return typeof parsed?.sourceHash === 'string' ? parsed.sourceHash : null;
  } catch (_) {
    return null;
  }
}

function writeStoredSourceHash(cachePath, sourceHash) {
  try {
    fs.mkdirSync(path.dirname(cachePath), { recursive: true });
    const tempPath = `${cachePath}.${process.pid}.tmp`;
    fs.writeFileSync(tempPath, `${JSON.stringify({ version: 1, sourceHash })}\n`);
    fs.renameSync(tempPath, cachePath);
  } catch (_) {
    // Cache writes are an optimization; staleness detection remains conservative.
  }
}

function freshnessError(pkg, message, extra = {}) {
  return {
    packageId: pkg?.id || null,
    packageName: pkg?.name || null,
    status: 'error',
    stale: false,
    message,
    rebuildCommand: pkg?.rebuildCommand || null,
    ...extra,
  };
}

function checkPackageFreshness(packageId, options = {}) {
  const workspaceRoot = workspaceRootFromOptions(options);
  const pkg = packageById(packageId);
  if (!pkg) return freshnessError(null, `Unknown dist package: ${packageId}`);

  const root = packageRoot(workspaceRoot, pkg);
  if (!fs.existsSync(root)) {
    return freshnessError(pkg, `Watched package root is missing: ${root}`, { packageRoot: root });
  }

  const entryName = options.entry || 'default';
  const normalizedEntry = normalizeEntryName(pkg, entryName);
  if (!normalizedEntry) {
    return freshnessError(pkg, `Unknown dist entry "${entryName}" for ${pkg.id}`, { packageRoot: root });
  }

  const distEntry = distEntryFor(pkg, root, normalizedEntry);
  if (!distEntry || !fs.existsSync(distEntry)) {
    return {
      packageId: pkg.id,
      packageName: pkg.name,
      status: 'missing',
      stale: true,
      packageRoot: root,
      distEntry,
      entry: normalizedEntry,
      rebuildCommand: pkg.rebuildCommand,
      message: `${pkg.name} dist entry is missing: ${distEntry}. Run: ${pkg.rebuildCommand}`,
    };
  }

  if (options.allowStale) {
    return {
      packageId: pkg.id,
      packageName: pkg.name,
      status: 'fresh',
      stale: false,
      packageRoot: root,
      distEntry,
      entry: normalizedEntry,
      rebuildCommand: pkg.rebuildCommand,
      message: `${pkg.name} dist freshness check bypassed by caller option`,
    };
  }

  try {
    const { files, missing } = collectSourceFiles(pkg, root, normalizedEntry);
    if (missing.length > 0) {
      return freshnessError(
        pkg,
        `Watched source path is missing for ${pkg.id}: ${missing.map((item) => path.relative(workspaceRoot, item)).join(', ')}`,
        { packageRoot: root, distEntry, entry: normalizedEntry, missingSourcePaths: missing },
      );
    }
    if (files.length === 0) {
      return freshnessError(pkg, `No watched source files found for ${pkg.id}`, {
        packageRoot: root,
        distEntry,
        entry: normalizedEntry,
      });
    }

    const sourceHash = hashSourceFiles(root, files);
    const cachePath = cachePathFor(root, distEntry, pkg, normalizedEntry);
    if (readStoredSourceHash(cachePath) === sourceHash) {
      return {
        packageId: pkg.id,
        packageName: pkg.name,
        status: 'fresh',
        stale: false,
        packageRoot: root,
        distEntry,
        entry: normalizedEntry,
        rebuildCommand: pkg.rebuildCommand,
        sourceCount: files.length,
        message: `${pkg.name} dist is fresh`,
      };
    }

    let newestSourceFile = files[0];
    let newestSourceMtime = fs.statSync(newestSourceFile).mtimeMs;
    for (const filePath of files.slice(1)) {
      const fileMtime = fs.statSync(filePath).mtimeMs;
      if (fileMtime > newestSourceMtime) {
        newestSourceMtime = fileMtime;
        newestSourceFile = filePath;
      }
    }
    const distMtime = fs.statSync(distEntry).mtimeMs;
    if (newestSourceMtime > distMtime) {
      return {
        packageId: pkg.id,
        packageName: pkg.name,
        status: 'stale',
        stale: true,
        packageRoot: root,
        distEntry,
        entry: normalizedEntry,
        rebuildCommand: pkg.rebuildCommand,
        sourceCount: files.length,
        newestSourceMtime,
        newestSourceFile,
        distMtime,
        message: `${pkg.name} dist is stale. Run: ${pkg.rebuildCommand}`,
      };
    }

    writeStoredSourceHash(cachePath, sourceHash);
    return {
      packageId: pkg.id,
      packageName: pkg.name,
      status: 'fresh',
      stale: false,
      packageRoot: root,
      distEntry,
      entry: normalizedEntry,
      rebuildCommand: pkg.rebuildCommand,
      sourceCount: files.length,
      newestSourceMtime,
      newestSourceFile,
      distMtime,
      message: `${pkg.name} dist is fresh`,
    };
  } catch (error) {
    return freshnessError(pkg, `Dist freshness checker failed for ${pkg.id}: ${error.message}`, {
      packageRoot: root,
      distEntry,
      entry: normalizedEntry,
    });
  }
}

function checkAllFreshness(options = {}) {
  return DIST_PACKAGES.map((pkg) => checkPackageFreshness(pkg.id, options));
}

function sourceContainsFile(workspaceRoot, pkg, filePath) {
  const root = packageRoot(workspaceRoot, pkg);
  const absoluteFile = path.resolve(filePath);
  if (!fs.existsSync(root) || !isWatchedSourceFile(absoluteFile, pkg)) return false;
  if (shouldSkipPath(absoluteFile, root, pkg)) return false;
  return pkg.sourceCandidates.some((candidate) => {
    const candidatePath = path.resolve(root, candidate);
    if (!fs.existsSync(candidatePath)) return false;
    const stat = fs.statSync(candidatePath);
    if (stat.isDirectory()) {
      const relative = path.relative(candidatePath, absoluteFile);
      return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
    }
    return candidatePath === absoluteFile;
  });
}

function packageForSourceFile(filePath, options = {}) {
  const workspaceRoot = workspaceRootFromOptions(options);
  return DIST_PACKAGES.find((pkg) => sourceContainsFile(workspaceRoot, pkg, filePath)) || null;
}

function checkFileFreshness(filePath, options = {}) {
  const pkg = packageForSourceFile(filePath, options);
  if (!pkg) {
    return {
      packageId: null,
      packageName: null,
      status: 'unmatched',
      stale: false,
      filePath: path.resolve(filePath),
      message: 'Edited file is not under a watched dist-producing source tree',
    };
  }
  return { ...checkPackageFreshness(pkg.id, options), filePath: path.resolve(filePath) };
}

function formatWarning(result) {
  if (!result || !result.stale) return '';
  return `STALE DIST WARNING: ${result.packageName || result.packageId} -- run: ${result.rebuildCommand}`;
}

function parseArgs(argv) {
  const parsed = { positional: [], json: false, workspaceRoot: null, packageId: null, entry: null, filePath: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--json') parsed.json = true;
    else if (arg === '--workspace-root') parsed.workspaceRoot = argv[++index];
    else if (arg === '--package') parsed.packageId = argv[++index];
    else if (arg === '--entry') parsed.entry = argv[++index];
    else if (arg === '--file') parsed.filePath = argv[++index];
    else parsed.positional.push(arg);
  }
  return parsed;
}

function printResult(result, asJson) {
  if (asJson) {
    process.stdout.write(`${JSON.stringify(result)}\n`);
    return;
  }
  if (result.status === 'error') process.stderr.write(`DIST FRESHNESS CHECK ERROR: ${result.message}\n`);
  else if (Array.isArray(result.results)) {
    const stale = result.results.filter((item) => item.stale).map(formatWarning).filter(Boolean);
    process.stdout.write(stale.length > 0 ? `${stale.join('\n')}\n` : 'All watched dist outputs are fresh.\n');
  }
  else process.stdout.write(`${result.message}\n`);
}

function runCli() {
  const args = parseArgs(process.argv.slice(2));
  const command = args.positional[0] || 'check-all';
  const options = { workspaceRoot: args.workspaceRoot, entry: args.entry };
  let result;

  if (command === 'check') {
    if (!args.packageId) {
      process.stderr.write('Usage: dist-freshness.cjs check --package <package-id> [--entry <entry>] [--json]\n');
      process.exit(64);
    }
    result = checkPackageFreshness(args.packageId, options);
  } else if (command === 'check-file') {
    if (!args.filePath) {
      process.stderr.write('Usage: dist-freshness.cjs check-file --file <path> [--json]\n');
      process.exit(64);
    }
    result = checkFileFreshness(args.filePath, options);
  } else if (command === 'check-all') {
    const results = checkAllFreshness(options);
    const stale = results.filter((item) => item.stale);
    result = { status: stale.length > 0 ? 'stale' : 'fresh', stale: stale.length > 0, results };
  } else if (command === 'list') {
    result = { status: 'ok', packages: DIST_PACKAGES };
  } else {
    process.stderr.write(`Unknown dist freshness command: ${command}\n`);
    process.exit(64);
  }

  printResult(result, args.json);
  if (result.stale) process.exit(STALE_EXIT_CODE);
  process.exit(0);
}

if (require.main === module) runCli();

module.exports = {
  DIST_PACKAGES,
  STALE_EXIT_CODE,
  checkAllFreshness,
  checkFileFreshness,
  checkPackageFreshness,
  formatWarning,
  packageForSourceFile,
};
