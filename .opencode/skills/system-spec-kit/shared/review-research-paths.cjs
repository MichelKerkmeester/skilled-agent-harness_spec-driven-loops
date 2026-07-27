// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Review Research Paths                                                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const MODE_CONFIG_FILE = {
  research: 'deep-research-config.json',
  review: 'deep-review-config.json',
  alignment: 'deep-alignment-config.json',
};

const MODE_STATE_FILE = {
  research: 'deep-research-state.jsonl',
  review: 'deep-review-state.jsonl',
  alignment: 'deep-alignment-state.jsonl',
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Allocate the next artifact subfolder name under an artifact root directory
 * using the {phaseSlug}-pt-{NN} naming convention.
 *
 * The phase slug is the FULL first-segment folder name under the spec tree
 * root (e.g. "019-system-hardening").  NN is a two-digit zero-padded counter:
 * 1 + the number of existing pt-folders whose slug prefix matches the requested
 * phase, so repeated calls produce sequential names without any stored counter.
 *
 * @param {string} rootDir   - Absolute path to the artifact root (research/ or review/)
 * @param {string} phaseSlug - Full phase folder name (e.g. "019-system-hardening")
 * @returns {string} Subfolder name, e.g. "019-system-hardening-pt-03"
 */
function allocateShortSubfolder(rootDir, phaseSlug) {
  let existingCount = 0;

  if (fs.existsSync(rootDir)) {
    const prefix = `${phaseSlug}-pt-`;
    existingCount = fs.readdirSync(rootDir).filter(
      (entry) => entry.startsWith(prefix),
    ).length;
  }

  const nn = String(existingCount + 1).padStart(2, '0');
  return `${phaseSlug}-pt-${nn}`;
}

function normalizeSpecFolderReference(specFolder) {
  if (!specFolder) {
    return null;
  }

  const normalized = String(specFolder)
    .trim()
    .replace(/\\/g, '/')
    .replace(/\/+$/g, '');

  if (!normalized) {
    return null;
  }

  const opencodeSpecsMarker = '/.opencode/specs/';
  const specsMarker = '/specs/';
  const opencodeIndex = normalized.lastIndexOf(opencodeSpecsMarker);
  if (opencodeIndex !== -1) {
    return normalized.slice(opencodeIndex + opencodeSpecsMarker.length);
  }

  const specsIndex = normalized.lastIndexOf(specsMarker);
  if (specsIndex !== -1) {
    return normalized.slice(specsIndex + specsMarker.length);
  }

  return normalized
    .replace(/^\.\/+/, '')
    .replace(/^\.opencode\/specs\//, '')
    .replace(/^specs\//, '');
}

function findAncestorSpecFolder(specFolder) {
  let current = path.resolve(specFolder);

  while (true) {
    const parent = path.dirname(current);

    if (parent === current || path.basename(parent) === 'specs') {
      return null;
    }

    if (fs.existsSync(path.join(parent, 'spec.md'))) {
      return parent;
    }

    current = parent;
  }
}

function readPacketSpecFolder(packetDir, mode) {
  const configPath = path.join(packetDir, MODE_CONFIG_FILE[mode]);
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return normalizeSpecFolderReference(config.specFolder);
    } catch (_error) {
      // Fall through to state log probing.
    }
  }

  const stateLogPath = path.join(packetDir, MODE_STATE_FILE[mode]);
  if (!fs.existsSync(stateLogPath)) {
    return null;
  }

  try {
    const lines = fs.readFileSync(stateLogPath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      if (!line.trim()) {
        continue;
      }
      const parsed = JSON.parse(line);
      return normalizeSpecFolderReference(parsed.specFolder);
    }
  } catch (_error) {
    return null;
  }

  return null;
}

function listPacketDirectories(rootDir) {
  if (!fs.existsSync(rootDir)) {
    return [];
  }

  return fs.readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /-pt-\d+$/.test(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));
}

function findExistingPacket(rootDir, specFolder, mode) {
  const targetSpecFolder = normalizeSpecFolderReference(specFolder);

  if (!targetSpecFolder) {
    return null;
  }

  const matches = [];
  for (const packetName of listPacketDirectories(rootDir)) {
    const packetDir = path.join(rootDir, packetName);
    if (readPacketSpecFolder(packetDir, mode) === targetSpecFolder) {
      matches.push(packetName);
    }
  }

  return matches.at(-1) || null;
}

// SCRIPT_DIR: .opencode/skills/system-spec-kit/shared -> repo root is 4 levels
// up. Mirrors the REPO_ROOT convention already used by
// scripts/migrate-deep-loop-local-owner.cjs, so this stays a portable,
// __dirname-relative anchor rather than a hardcoded absolute path.
const REPO_ROOT = path.resolve(__dirname, '../../../../');

/**
 * Canonicalize a path via realpath when possible, falling back to the plain
 * resolved value when the path does not exist yet or cannot be canonicalized.
 * Needed because macOS aliases `os.tmpdir()` under `/var/...` while
 * `fs.realpathSync()` resolves it to `/private/var/...` — reducer unit tests
 * use both forms depending on whether they realpath their own fixture root.
 */
function canonicalizeForContainment(target) {
  try {
    return fs.realpathSync(target);
  } catch (_error) {
    return path.resolve(target);
  }
}

/** Prefix-match containment: true iff `candidate` is `root` itself or a descendant of it. */
function isWithinRoot(root, candidate) {
  if (candidate === root) {
    return true;
  }
  const prefix = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
  return candidate.startsWith(prefix);
}

function readRegisteredWorktreeRoot(registrationDir) {
  try {
    const gitdirRecord = path.join(registrationDir, 'gitdir');
    if (!fs.lstatSync(gitdirRecord).isFile()) {
      return null;
    }

    const linkedGitFile = path.resolve(
      registrationDir,
      fs.readFileSync(gitdirRecord, 'utf8').trim(),
    );
    if (path.basename(linkedGitFile) !== '.git' || !fs.lstatSync(linkedGitFile).isFile()) {
      return null;
    }

    const backlinkMatch = fs.readFileSync(linkedGitFile, 'utf8').trim().match(/^gitdir:\s*(.+)$/);
    if (!backlinkMatch) {
      return null;
    }

    const backlink = canonicalizeForContainment(
      path.resolve(path.dirname(linkedGitFile), backlinkMatch[1]),
    );
    if (backlink !== canonicalizeForContainment(registrationDir)) {
      return null;
    }

    return canonicalizeForContainment(path.dirname(linkedGitFile));
  } catch (_error) {
    return null;
  }
}

function getRegisteredWorktreeRoots(repoRoot = REPO_ROOT) {
  const registrationsRoot = path.join(repoRoot, '.git', 'worktrees');
  try {
    if (!fs.lstatSync(registrationsRoot).isDirectory()) {
      return [];
    }
  } catch (_error) {
    return [];
  }

  const canonicalRegistrationsRoot = canonicalizeForContainment(registrationsRoot);
  return fs.readdirSync(registrationsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort((left, right) => left.name.localeCompare(right.name, undefined, { numeric: true }))
    .flatMap((entry) => {
      const registrationDir = path.join(registrationsRoot, entry.name);
      if (!isWithinRoot(canonicalRegistrationsRoot, canonicalizeForContainment(registrationDir))) {
        return [];
      }
      const worktreeRoot = readRegisteredWorktreeRoot(registrationDir);
      return worktreeRoot ? [worktreeRoot] : [];
    });
}

/**
 * Allowed roots for resolveArtifactRoot() writes: this repo's two spec-folder
 * roots (.opencode/specs, specs — the convention also used by
 * normalizeSpecFolderReference() above and by migrate-deep-loop-local-owner.cjs),
 * plus the OS temp dir. The temp dir is included because the reducer unit test
 * suites (both here and under system-deep-loop/runtime) deliberately build
 * isolated fixture trees under `os.tmpdir()` rather than the live repo tree —
 * matching the same os.tmpdir()-as-allowed-root convention already used by
 * shared/ipc/socket-server.ts's allowedSocketRoots().
 */
function getApprovedArtifactRoots(repoRoot = REPO_ROOT) {
  const roots = new Set();
  for (const repositoryRoot of [repoRoot, ...getRegisteredWorktreeRoots(repoRoot)]) {
    roots.add(path.join(repositoryRoot, '.opencode', 'specs'));
    roots.add(canonicalizeForContainment(path.join(repositoryRoot, '.opencode', 'specs')));
    roots.add(path.join(repositoryRoot, 'specs'));
    roots.add(canonicalizeForContainment(path.join(repositoryRoot, 'specs')));
  }
  roots.add(path.resolve(os.tmpdir()));
  roots.add(canonicalizeForContainment(os.tmpdir()));
  return [...roots];
}

function isWithinApprovedArtifactRoot(resolvedSpecFolder, repoRoot = REPO_ROOT) {
  const candidate = canonicalizeForContainment(resolvedSpecFolder);
  return getApprovedArtifactRoots(repoRoot).some((root) => isWithinRoot(root, candidate));
}

function assertSafeArtifactDirectory(specRoot, candidate, label) {
  if (!fs.existsSync(candidate)) {
    return;
  }

  const stat = fs.lstatSync(candidate);
  if (stat.isSymbolicLink() || !stat.isDirectory()) {
    throw new Error(`resolveArtifactRoot: ${label} must be a real directory: ${candidate}`);
  }

  const canonicalRoot = canonicalizeForContainment(specRoot);
  const canonicalCandidate = canonicalizeForContainment(candidate);
  if (!isWithinRoot(canonicalRoot, canonicalCandidate)) {
    throw new Error(`resolveArtifactRoot: ${label} resolves outside the spec folder: ${candidate}`);
  }
}

/**
 * Resolve the canonical artifact directory for review or research output.
 *
 * Conventions (post-028 contract fix):
 *   - Root specs ALWAYS use flat: {spec_folder}/{mode}/
 *   - Child phases use FLAT-FIRST:
 *       (a) First run with empty {mode}/ directory → flat (subfolder=null)
 *       (b) Continuation when flat artifact's config matches current target → reuse flat
 *       (c) Existing pt-NN packet matches current target → reuse pt-NN
 *       (d) Prior content exists for non-matching target → allocate pt-NN
 *
 * Subfolder naming convention (when pt-NN allocation kicks in): {phaseSlug}-pt-{NN}
 *   - phaseSlug: the FULL immediate child phase segment under the spec tree
 *     root (e.g. "019-system-hardening")
 *   - NN: sequential two-digit counter scoped to that phase within the
 *     artifact root directory; allocated by counting existing same-prefix
 *     entries at call time
 *
 * Example:
 *   - root spec run → {spec_folder}/research/
 *   - child phase first run → {spec_folder}/research/   (flat, no pt-NN wrapper)
 *   - child phase second run with prior content for different target → {spec_folder}/research/{phaseSlug}-pt-NN/
 *   - child phase same-target continuation → reuses prior flat or pt-NN
 *
 * @param {string} specFolder - Absolute or relative path to the target spec folder
 * @param {'review'|'research'|'context'|'alignment'} [mode='review'] - Which artifact type to resolve
 *
 * @returns {{
 *   rootDir: string,
 *   subfolder: string|null,
 *   artifactDir: string,
 *   artifactArchiveRoot: string
 * }} Resolved packet root plus canonical packet/archive directories
 */
function resolveArtifactRoot(specFolder, mode = 'review', repoRoot = REPO_ROOT) {
  // Workflow write-authority: reject specFolder values that contain
  // shell metacharacters or quote characters. The YAML workflow interpolates
  // {spec_folder} into a `node -e` shell command; without this guard, a
  // malicious specFolder containing single-quotes / semicolons / backticks /
  // $ / | / & / < / > could break out of the shell-quoted argument and
  // execute arbitrary code in the Node process or shell.
  if (typeof specFolder !== 'string' || specFolder.length === 0) {
    throw new Error(`resolveArtifactRoot: specFolder must be a non-empty string`);
  }
  if (/['"`$;|&<>\\]/.test(specFolder)) {
    throw new Error(
      `resolveArtifactRoot: specFolder contains forbidden shell metacharacter(s); refusing to proceed`,
    );
  }

  const resolved = path.resolve(specFolder);

  // Containment: refuse to hand back an artifact root outside the workspace's
  // legitimate spec-folder roots (or the OS temp dir used by reducer unit
  // tests — see getApprovedArtifactRoots()). Without this, a relative
  // traversal (e.g. "../../etc") or an absolute path elsewhere on disk with
  // no forbidden shell metacharacters would sail past the guard above and
  // route workflow writes outside the intended packet.
  if (!isWithinApprovedArtifactRoot(resolved, repoRoot)) {
    throw new Error(
      `resolveArtifactRoot: specFolder resolves outside the approved specs roots (.opencode/specs, specs) or the OS temp dir; refusing to proceed: ${resolved}`,
    );
  }

  const rootDir = path.join(resolved, mode);
  const artifactArchiveRoot = path.join(resolved, mode === 'review' ? 'review-archive' : `${mode}_archive`);
  const ancestorSpecFolder = findAncestorSpecFolder(resolved);
  assertSafeArtifactDirectory(resolved, rootDir, `${mode} artifact root`);
  assertSafeArtifactDirectory(resolved, artifactArchiveRoot, `${mode} archive root`);

  function finalize(result) {
    assertSafeArtifactDirectory(resolved, result.artifactDir, `${mode} artifact directory`);
    assertSafeArtifactDirectory(resolved, result.artifactArchiveRoot, `${mode} artifact archive directory`);
    return result;
  }

  // ROOT spec: always flat
  if (!ancestorSpecFolder) {
    return finalize({
      rootDir,
      subfolder: null,
      artifactDir: rootDir,
      artifactArchiveRoot,
    });
  }

  // CHILD phase: prefer existing pt-NN packet for current target if any
  const existingPacket = findExistingPacket(rootDir, resolved, mode);
  if (existingPacket) {
    return finalize({
      rootDir,
      subfolder: existingPacket,
      artifactDir: path.join(rootDir, existingPacket),
      artifactArchiveRoot: path.join(artifactArchiveRoot, existingPacket),
    });
  }

  // CHILD phase: check for flat artifact at rootDir
  const targetSpecFolder = normalizeSpecFolderReference(resolved);
  const flatConfigPath = path.join(rootDir, MODE_CONFIG_FILE[mode]);
  const flatStateLogPath = path.join(rootDir, MODE_STATE_FILE[mode]);
  const hasFlatArtifact = fs.existsSync(flatConfigPath) || fs.existsSync(flatStateLogPath);

  if (hasFlatArtifact) {
    const flatSpecFolder = readPacketSpecFolder(rootDir, mode);
    if (flatSpecFolder === null || flatSpecFolder === targetSpecFolder) {
      // Flat artifact matches current target (or its config is unreadable but rootDir is owned by this target's path) → reuse flat
      return finalize({
        rootDir,
        subfolder: null,
        artifactDir: rootDir,
        artifactArchiveRoot,
      });
    }
    // Flat artifact is for a different target — fall through to allocate pt-NN
  }

  const ptFolders = listPacketDirectories(rootDir);
  const hasPtFolders = ptFolders.length > 0;

  // CHILD phase first run: empty rootDir → flat
  if (!hasFlatArtifact && !hasPtFolders) {
    return finalize({
      rootDir,
      subfolder: null,
      artifactDir: rootDir,
      artifactArchiveRoot,
    });
  }

  // CHILD phase: prior content exists (flat for different target, or pt-NN folders)
  // and no matching packet for current target → allocate next pt-NN
  const subfolder = allocateShortSubfolder(rootDir, path.basename(resolved));
  return finalize({
    rootDir,
    subfolder,
    artifactDir: path.join(rootDir, subfolder),
    artifactArchiveRoot: path.join(artifactArchiveRoot, subfolder),
  });
}

module.exports = {
  resolveArtifactRoot,
  allocateShortSubfolder,
  getApprovedArtifactRoots,
  getRegisteredWorktreeRoots,
  isWithinApprovedArtifactRoot,
  normalizeSpecFolderReference,
};
