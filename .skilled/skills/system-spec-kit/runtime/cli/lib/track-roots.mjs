// ───────────────────────────────────────────────────────────────────
// MODULE: Track Roots
// ───────────────────────────────────────────────────────────────────
// A track root is a directory directly under specs/ that is named for its
// track rather than numbered like a packet and has no spec.md of its own. Its
// graph-metadata.json declares the track's packets in children_ids, and no
// packet rule ever reaches it: the validation orchestrator exempts tracks. The
// sweep that reports drift and the writer that repairs it share this module, so
// both judge a track, its packets and a match by the same rules.
//
// A track is read from the working tree or from a commit. The commit view
// exists for the pre-push gate: in a shared checkout the working tree carries
// other sessions' unfinished packets, and the pushed commit is what matters.
// ───────────────────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/** A packet folder name: three digits, optionally followed by -name or _name. */
export const SPEC_LEAF_SEGMENT_PATTERN = /^\d{3}(?:[-_].+)?$/;

const GRAPH_METADATA = 'graph-metadata.json';

function isCandidateTrackName(name) {
  return !name.startsWith('.') && name !== 'node_modules' && !SPEC_LEAF_SEGMENT_PATTERN.test(name);
}

// ───────────────────────────────────────────────────────────────────
// 1. WORKING-TREE VIEW
// ───────────────────────────────────────────────────────────────────

/**
 * List the track roots in a specs directory that carry a graph-metadata.json,
 * each with the raw metadata text (null when absent) and its packets on disk.
 * A symlinked track is followed and marked, since its files live elsewhere.
 */
export function readWorkingTreeTracks(specsRoot) {
  return fs.readdirSync(specsRoot, { withFileTypes: true })
    .map((entry) => entry.name)
    .filter(isCandidateTrackName)
    .sort()
    .flatMap((name) => {
      const trackPath = path.join(specsRoot, name);
      let stat;
      try {
        stat = fs.statSync(trackPath);
      } catch {
        return [];
      }
      if (!stat.isDirectory() || fs.existsSync(path.join(trackPath, 'spec.md'))) return [];
      const metadataPath = path.join(trackPath, GRAPH_METADATA);
      if (!fs.existsSync(metadataPath)) return [];
      // Real directories only, as in a commit, where a linked packet is a link
      // entry rather than a tree; the two views must count the same packets.
      const children = fs.readdirSync(trackPath, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && SPEC_LEAF_SEGMENT_PATTERN.test(entry.name))
        .map((entry) => entry.name)
        .sort();
      return [{
        name,
        metadataPath,
        rawMetadata: fs.readFileSync(metadataPath, 'utf8'),
        children,
        symlinked: fs.lstatSync(trackPath).isSymbolicLink(),
      }];
    });
}

// ───────────────────────────────────────────────────────────────────
// 2. COMMIT VIEW
// ───────────────────────────────────────────────────────────────────

// A push from a linked worktree runs its hooks with GIT_DIR exported and no
// GIT_WORK_TREE, and git then takes the -C directory itself for the top of the
// work tree, so specs/ would come back as the repository root. Resolving the
// repository from the path alone gives the same answer inside a hook and out.
const REPOSITORY_ENV_KEYS = ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_COMMON_DIR', 'GIT_INDEX_FILE', 'GIT_PREFIX'];

function gitEnv() {
  const env = { ...process.env };
  for (const key of REPOSITORY_ENV_KEYS) delete env[key];
  return env;
}

function lsTree(repoTop, rev, treePath) {
  const output = execFileSync('git', ['-C', repoTop, 'ls-tree', '-z', rev, `${treePath}/`], {
    encoding: 'utf8',
    env: gitEnv(),
    maxBuffer: 64 * 1024 * 1024,
  });
  return output.split('\0').filter(Boolean).map((line) => {
    const [meta, entryPath] = line.split('\t');
    const [mode, type, object] = meta.split(' ');
    return { mode, type, object, name: path.posix.basename(entryPath) };
  });
}

/**
 * List the track roots in a commit's specs directory, like the working-tree view.
 * A symlinked track is a single link entry in the commit, holding none of the
 * other repository's files, so it is reported as skipped rather than read.
 */
export function readCommitTracks(specsRoot, rev) {
  const repoTop = execFileSync('git', ['-C', specsRoot, 'rev-parse', '--show-toplevel'], { encoding: 'utf8', env: gitEnv() }).trim();
  const specsPath = path.relative(repoTop, specsRoot).split(path.sep).join('/');
  const entries = lsTree(repoTop, rev, specsPath);
  const tracks = [];
  const skipped = [];
  for (const entry of entries.filter((item) => isCandidateTrackName(item.name)).sort((a, b) => (a.name < b.name ? -1 : 1))) {
    if (entry.mode === '120000') {
      skipped.push(entry.name);
      continue;
    }
    if (entry.type !== 'tree') continue;
    const inside = lsTree(repoTop, rev, `${specsPath}/${entry.name}`);
    if (inside.some((item) => item.name === 'spec.md' && item.type === 'blob')) continue;
    const metadata = inside.find((item) => item.name === GRAPH_METADATA && item.type === 'blob');
    if (!metadata) continue;
    tracks.push({
      name: entry.name,
      metadataPath: `${specsPath}/${entry.name}/${GRAPH_METADATA}`,
      rawMetadata: execFileSync('git', ['-C', repoTop, 'cat-file', 'blob', metadata.object], { encoding: 'utf8', env: gitEnv() }),
      children: inside
        .filter((item) => item.type === 'tree' && SPEC_LEAF_SEGMENT_PATTERN.test(item.name))
        .map((item) => item.name)
        .sort(),
      symlinked: false,
    });
  }
  return { tracks, skipped };
}

// ───────────────────────────────────────────────────────────────────
// 3. COMPARISON
// ───────────────────────────────────────────────────────────────────

/** Parse a track's metadata, or return null when it is empty or not JSON. */
export function parseTrackMetadata(rawMetadata) {
  try {
    const parsed = JSON.parse(rawMetadata);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** The identity children_ids entries hang off: the declared packet_id, else the folder name. */
export function trackIdentity(metadata, trackName) {
  return typeof metadata.packet_id === 'string' && metadata.packet_id.trim() !== ''
    ? metadata.packet_id.trim()
    : trackName;
}

/**
 * Compare a track's declared children with its packets on disk. Entries under
 * another identity are foreign residue of an earlier name. A track matches only
 * when the two sets are equal and nothing foreign is declared; equal counts are
 * not enough, since a renamed packet leaves both counts where they were.
 */
export function compareTrackChildren(metadata, trackName, children) {
  const identity = trackIdentity(metadata, trackName);
  const entries = Array.isArray(metadata.children_ids) ? metadata.children_ids.map(String) : [];
  const own = entries.filter((entry) => entry.startsWith(`${identity}/`));
  const foreign = entries.filter((entry) => !entry.startsWith(`${identity}/`));
  const declared = own.map((entry) => entry.slice(identity.length + 1)).sort();
  const declaredSet = new Set(declared);
  const childSet = new Set(children);
  const extra = children.filter((name) => !declaredSet.has(name));
  const missing = declared.filter((name) => !childSet.has(name));
  return {
    identity,
    declared,
    foreign,
    extra,
    missing,
    matches: foreign.length === 0 && extra.length === 0 && missing.length === 0,
  };
}

/** The children_ids a track should declare: its packets on disk, sorted, under its identity. */
export function expectedChildrenIds(metadata, trackName, children) {
  const identity = trackIdentity(metadata, trackName);
  return [...children].sort().map((name) => `${identity}/${name}`);
}

/** Locate specs/ from an explicit path or by walking up from the working directory. */
export function resolveSpecsRoot(explicit, scriptName) {
  if (explicit) return path.resolve(explicit);
  let current = path.resolve(process.cwd());
  while (true) {
    const candidate = path.join(current, 'specs');
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) return candidate;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  process.stderr.write(`${scriptName}: no specs/ directory found from the working directory; pass --specs <dir>\n`);
  process.exit(2);
}
