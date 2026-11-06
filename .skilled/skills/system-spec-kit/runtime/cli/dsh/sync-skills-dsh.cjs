// ───────────────────────────────────────────────────────────────────
// MODULE: Sync DSH Skills
// ───────────────────────────────────────────────────────────────────

'use strict';

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');
const { findRepoRoot } = require('@spec-kit/shared/workspace/repo-root.mjs');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const REPO_ROOT = findRepoRoot(__dirname);
const SOURCE_DIR = path.resolve(
  process.env.DSH_SKILLS_SOURCE_DIR || path.join(REPO_ROOT, '.skilled', 'skills'),
);
const OUTPUT_DIR = path.resolve(
  process.env.DSH_SKILLS_OUTPUT_DIR || path.join(REPO_ROOT, '.dsh', 'skills'),
);
const EXCLUDED_DIRECTORIES = new Set([
  'node_modules',
  'dist',
  '.state',
  'scratch',
  'benchmark',
  'fixtures',
  'z_archive',
]);
const LOCAL_PREFIX = 'local-';
const DSH_DESCRIPTION_LIMIT = 500;

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

/** Parses the supported command-line options. */
function parseArguments(argv) {
  if (argv.length === 0) return { check: false };
  if (argv.length === 1 && argv[0] === '--check') return { check: true };
  throw new Error('Usage: node sync-skills-dsh.cjs [--check]');
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function pathLabel(filePath) {
  const relativePath = path.relative(REPO_ROOT, filePath);
  if (
    relativePath
    && relativePath !== '..'
    && !relativePath.startsWith('..' + path.sep)
    && !path.isAbsolute(relativePath)
  ) {
    return toPosix(relativePath);
  }
  return filePath;
}

function sourceRelativePath(directory, filePath) {
  return toPosix(path.relative(directory, filePath));
}

/** Lists skill metadata files while recording source exclusions. */
function listSkillFiles(directory) {
  if (!fs.existsSync(directory)) return { files: [], exclusions: [] };

  const root = path.resolve(directory);
  const files = [];
  const exclusions = [];
  const recordExclusion = (filePath, reason) => {
    exclusions.push({ path: pathLabel(filePath), reason });
  };

  const walk = (current, ancestors) => {
    const realCurrent = fs.realpathSync(current);
    if (ancestors.has(realCurrent)) {
      recordExclusion(current, 'symbolic link would create a directory cycle');
      return;
    }

    const nextAncestors = new Set(ancestors);
    nextAncestors.add(realCurrent);
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolutePath = path.join(current, entry.name);
      if (current === root && entry.name.startsWith(LOCAL_PREFIX)) {
        recordExclusion(absolutePath, 'top-level operator-private local-* entry');
        continue;
      }

      let stat;
      try {
        stat = fs.statSync(absolutePath);
      } catch (error) {
        if (entry.isSymbolicLink() && error.code === 'ENOENT') {
          recordExclusion(absolutePath, 'symbolic link target does not exist');
          continue;
        }
        throw error;
      }

      if (stat.isDirectory()) {
        if (EXCLUDED_DIRECTORIES.has(entry.name)) {
          recordExclusion(absolutePath, 'excluded directory name: ' + entry.name);
          continue;
        }
        walk(absolutePath, nextAncestors);
        continue;
      }

      if (stat.isFile() && entry.name === 'SKILL.md') {
        files.push(sourceRelativePath(root, absolutePath));
      }
    }
  };

  walk(root, new Set());
  files.sort();
  exclusions.sort((left, right) => left.path.localeCompare(right.path));
  return { files, exclusions };
}

/** Splits skill frontmatter from the body without changing either section. */
function splitFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return { frontmatter: null, body: content };
  return {
    frontmatter: match[1],
    body: content.slice(match[0].length),
  };
}

/** Reads the skill name and description needed to create a DSH link. */
function readSkillMetadata(content, sourcePath) {
  const parts = splitFrontmatter(content);
  if (parts.frontmatter === null) {
    return { name: '', description: '', body: parts.body };
  }

  let metadata;
  try {
    metadata = yaml.load(parts.frontmatter);
  } catch (error) {
    throw new Error('invalid YAML frontmatter in ' + pathLabel(sourcePath) + ': ' + error.message);
  }

  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return { name: '', description: '', body: parts.body };
  }

  return {
    name: typeof metadata.name === 'string' ? metadata.name.trim() : '',
    description: typeof metadata.description === 'string' ? metadata.description : '',
    body: parts.body,
  };
}

function assertSafeSkillName(name, sourcePath) {
  if (
    name === '.'
    || name === '..'
    || name !== path.posix.basename(name)
    || name.includes('/')
    || name.includes('\\')
  ) {
    throw new Error('skill name "' + name + '" in ' + pathLabel(sourcePath) + ' is not a safe directory name');
  }
}

/** Builds the expected DSH links from valid, non-local skill sources. */
function buildExpectedLinks() {
  const { files, exclusions } = listSkillFiles(SOURCE_DIR);
  if (files.length === 0) {
    throw new Error('no skill sources found in ' + SOURCE_DIR);
  }
  const expected = new Map();
  const warnings = [];

  for (const relativePath of files) {
    const sourcePath = path.join(SOURCE_DIR, relativePath);
    const sourceDirectory = path.dirname(sourcePath);
    const content = fs.readFileSync(sourcePath, 'utf8');
    const metadata = readSkillMetadata(content, sourcePath);
    if (!metadata.name || !metadata.description.trim()) {
      warnings.push({
        path: pathLabel(sourcePath),
        message: 'missing required name or description frontmatter, skipped',
      });
      continue;
    }

    assertSafeSkillName(metadata.name, sourcePath);
    if (metadata.name.startsWith(LOCAL_PREFIX)) {
      exclusions.push({
        path: pathLabel(sourcePath),
        reason: 'frontmatter name uses the reserved operator-private local-* prefix',
      });
      continue;
    }

    if (metadata.description.length > DSH_DESCRIPTION_LIMIT) {
      warnings.push({
        path: pathLabel(sourcePath),
        message: 'skill "' + metadata.name + '" description has '
          + metadata.description.length + ' characters and dsh truncates descriptions at '
          + DSH_DESCRIPTION_LIMIT,
      });
    }

    if (expected.has(metadata.name)) {
      throw new Error(
        'duplicate skill name "' + metadata.name + '" in '
          + pathLabel(expected.get(metadata.name).sourcePath)
          + ' and ' + pathLabel(sourcePath),
      );
    }

    const linkTarget = toPosix(path.relative(OUTPUT_DIR, sourceDirectory));
    if (path.isAbsolute(linkTarget)) {
      throw new Error('cannot create a relative skill link for ' + pathLabel(sourcePath));
    }
    expected.set(metadata.name, { sourcePath, sourceDirectory, linkTarget });
  }

  exclusions.sort((left, right) => left.path.localeCompare(right.path));
  return { expected, exclusions, warnings };
}

function listOutputEntries() {
  if (!fs.existsSync(OUTPUT_DIR)) return [];
  return fs.readdirSync(OUTPUT_DIR, { withFileTypes: true })
    .map((entry) => entry.name)
    .sort();
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

function reportInputs({ expected, exclusions, warnings }) {
  const protectedOutputs = listOutputEntries()
    .filter((name) => name.startsWith(LOCAL_PREFIX))
    .map((name) => ({
      path: pathLabel(path.join(OUTPUT_DIR, name)),
      reason: 'reserved operator-private output, preserved by the generator',
    }));

  console.log('[dsh-skill-sync] LINKS: ' + expected.size);
  for (const exclusion of [...exclusions, ...protectedOutputs]) {
    console.log('[dsh-skill-sync] EXCLUDED ' + exclusion.path + ': ' + exclusion.reason);
  }
  for (const warning of warnings) {
    console.warn('[dsh-skill-sync] WARN ' + warning.path + ': ' + warning.message);
  }
}

function removeEntry(entryPath) {
  let stat;
  try {
    stat = fs.lstatSync(entryPath);
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }

  if (stat.isDirectory() && !stat.isSymbolicLink()) {
    fs.rmSync(entryPath, { recursive: true, force: true });
  } else {
    fs.unlinkSync(entryPath);
  }
}

function assertOutputDirectorySafe() {
  try {
    const stat = fs.lstatSync(OUTPUT_DIR);
    if (stat.isSymbolicLink()) {
      throw new Error('refusing to write through a symbolic link at ' + OUTPUT_DIR);
    }
    if (!stat.isDirectory()) {
      throw new Error('output path is not a directory: ' + OUTPUT_DIR);
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

function checkOutputs(expected) {
  const existing = new Set(listOutputEntries());
  const drift = [];

  for (const [name, { linkTarget }] of expected) {
    const targetPath = path.join(OUTPUT_DIR, name);
    let stat;
    try {
      stat = fs.lstatSync(targetPath);
    } catch (error) {
      if (error.code === 'ENOENT') {
      drift.push('MISSING ' + pathLabel(targetPath));
        continue;
      }
      throw error;
    }

    existing.delete(name);
    if (!stat.isSymbolicLink() || toPosix(fs.readlinkSync(targetPath)) !== linkTarget) {
      drift.push('STALE ' + pathLabel(targetPath));
    }
  }

  for (const name of [...existing].sort()) {
    if (name.startsWith(LOCAL_PREFIX)) continue;
    drift.push('EXTRA ' + pathLabel(path.join(OUTPUT_DIR, name)));
  }

  if (drift.length > 0) {
    console.error('[dsh-skill-sync] Drift detected:');
    for (const item of drift) console.error('[dsh-skill-sync] ' + item);
    console.error(
      '[dsh-skill-sync] FAIL: ' + drift.length + ' drift item(s); run without --check to regenerate',
    );
    return 1;
  }

  console.log('[dsh-skill-sync] PASS: ' + expected.size + ' skill links are in sync.');
  return 0;
}

function writeOutputs(expected) {
  assertOutputDirectorySafe();
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let pruned = 0;
  for (const name of listOutputEntries()) {
    if (name.startsWith(LOCAL_PREFIX) || expected.has(name)) continue;
    removeEntry(path.join(OUTPUT_DIR, name));
    pruned += 1;
  }

  let written = 0;
  for (const [name, { linkTarget }] of expected) {
    const targetPath = path.join(OUTPUT_DIR, name);
    let stat = null;
    try {
      stat = fs.lstatSync(targetPath);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }

    if (stat && stat.isSymbolicLink() && toPosix(fs.readlinkSync(targetPath)) === linkTarget) {
      continue;
    }
    if (stat) removeEntry(targetPath);
    fs.symlinkSync(linkTarget, targetPath, 'dir');
    written += 1;
  }

  console.log(
    '[dsh-skill-sync] Wrote ' + written + ' of ' + expected.size + ' links; pruned ' + pruned + '.',
  );
}

/** Runs the skill link sync in check or write mode. */
function sync(options) {
  const { expected, exclusions, warnings } = buildExpectedLinks();
  reportInputs({ expected, exclusions, warnings });
  if (options.check) return checkOutputs(expected);
  writeOutputs(expected);
  return 0;
}

// ───────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ───────────────────────────────────────────────────────────────────

if (require.main === module) {
  try {
    process.exitCode = sync(parseArguments(process.argv.slice(2)));
  } catch (error) {
    console.error('[dsh-skill-sync] ERROR: ' + error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  sync,
  parseArguments,
  listSkillFiles,
  splitFrontmatter,
  readSkillMetadata,
  buildExpectedLinks,
};
