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
// A declared sub-track is a direct child of a track with description.json
// level "sub-track" and no spec.md of its own. It behaves like a track root
// inside its parent: its identity is "<track>/<sub>", its metadata declares
// its immediate numbered packets, and its parent's children_ids lists it by
// folder name. An archive folder (z_*) is never read, and a symlinked
// sub-track is skipped, because its files belong to another repository. A
// non-numbered folder without the declaration is reported and never promoted.
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
const DESCRIPTION = 'description.json';
const SUB_TRACK_LEVEL = 'sub-track';

function isCandidateTrackName(name) {
  return !name.startsWith('.') && name !== 'node_modules' && !SPEC_LEAF_SEGMENT_PATTERN.test(name);
}

function isArchiveName(name) {
  return name.startsWith('z_');
}

function isSubTrackCandidateName(name) {
  return isCandidateTrackName(name) && !isArchiveName(name);
}

function compareNames(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function byFolderName(a, b) {
  return compareNames(a.name, b.name);
}

// ───────────────────────────────────────────────────────────────────
// 1. DECLARED SUB-TRACKS
// ───────────────────────────────────────────────────────────────────

function parseObject(raw) {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function readOptionalText(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function isDeclaredSubTrack(description) {
  return description !== null && description.level === SUB_TRACK_LEVEL;
}

function numberedChildren(directory) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && SPEC_LEAF_SEGMENT_PATTERN.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

// ───────────────────────────────────────────────────────────────────
// 2. WORKING-TREE VIEW
// ───────────────────────────────────────────────────────────────────

/**
 * List the track roots in a specs directory that carry a graph-metadata.json,
 * each with the raw metadata text (null when absent) and its packets on disk.
 * A declared sub-track is listed after its track as an entry of its own. The
 * result also carries the advisory diagnostics for undeclared folders and
 * skipped symlinked sub-tracks; they never affect a caller's exit code.
 * A symlinked track is followed and marked, since its files live elsewhere.
 */
export function readWorkingTreeTracks(specsRoot) {
  const tracks = [];
  const diagnostics = [];
  const roots = fs.readdirSync(specsRoot, { withFileTypes: true })
    .map((entry) => entry.name)
    .filter(isCandidateTrackName)
    .sort();

  for (const name of roots) {
    const trackPath = path.join(specsRoot, name);
    let stat;
    try {
      stat = fs.statSync(trackPath);
    } catch {
      continue;
    }
    if (!stat.isDirectory() || fs.existsSync(path.join(trackPath, 'spec.md'))) continue;
    const metadataPath = path.join(trackPath, GRAPH_METADATA);
    if (!fs.existsSync(metadataPath)) continue;

    const track = {
      name,
      metadataPath,
      rawMetadata: fs.readFileSync(metadataPath, 'utf8'),
      children: numberedChildren(trackPath),
      symlinked: fs.lstatSync(trackPath).isSymbolicLink(),
    };
    tracks.push(track);

    const containers = fs.readdirSync(trackPath, { withFileTypes: true })
      .filter((entry) => isSubTrackCandidateName(entry.name))
      .sort(byFolderName);
    for (const entry of containers) {
      const id = `${name}/${entry.name}`;
      if (entry.isSymbolicLink()) {
        diagnostics.push(`${id}: symlinked folder skipped, not followed`);
        continue;
      }
      // Real directories only, as in a commit, where a file or a link is not
      // a container. A folder that does not declare itself stays a diagnostic.
      if (!entry.isDirectory()) continue;
      const subPath = path.join(trackPath, entry.name);
      // A commit stores a linked description as its link text, which never parses,
      // so a link is refused here too and both views reach the same answer.
      const descriptionPath = path.join(subPath, DESCRIPTION);
      const linkedDescription = fs.lstatSync(descriptionPath, { throwIfNoEntry: false })?.isSymbolicLink() === true;
      const description = linkedDescription ? null : parseObject(readOptionalText(descriptionPath) ?? '');
      if (!isDeclaredSubTrack(description)) {
        diagnostics.push(`${id}: undeclared folder ignored`);
        continue;
      }
      if (fs.existsSync(path.join(subPath, 'spec.md'))) {
        diagnostics.push(`${id}: declared folder has spec.md and cannot be a sub-track`);
        continue;
      }
      track.children.push(entry.name);
      tracks.push({
        name: id,
        metadataPath: path.join(subPath, GRAPH_METADATA),
        rawMetadata: readOptionalText(path.join(subPath, GRAPH_METADATA)),
        children: numberedChildren(subPath),
        symlinked: false,
      });
    }
    track.children.sort(compareNames);
  }

  tracks.sort(byFolderName);
  tracks.diagnostics = diagnostics.sort(compareNames);
  return tracks;
}

// ───────────────────────────────────────────────────────────────────
// 3. COMMIT VIEW
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

function readBlob(repoTop, object) {
  return execFileSync('git', ['-C', repoTop, 'cat-file', 'blob', object], { encoding: 'utf8', env: gitEnv() });
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

function numberedTreeChildren(entries) {
  return entries
    .filter((item) => item.type === 'tree' && SPEC_LEAF_SEGMENT_PATTERN.test(item.name))
    .map((item) => item.name)
    .sort();
}

/**
 * List the track roots in a commit's specs directory, like the working-tree view.
 * A symlinked track is a single link entry in the commit, holding none of the
 * other repository's files, so it is reported as skipped rather than read. A
 * symlinked sub-track is skipped the same way, with a diagnostic, so both views
 * agree on what a track holds.
 */
export function readCommitTracks(specsRoot, rev) {
  const repoTop = execFileSync('git', ['-C', specsRoot, 'rev-parse', '--show-toplevel'], { encoding: 'utf8', env: gitEnv() }).trim();
  const specsPath = path.relative(repoTop, specsRoot).split(path.sep).join('/');
  const entries = lsTree(repoTop, rev, specsPath);
  const tracks = [];
  const skipped = [];
  const diagnostics = [];

  for (const entry of entries.filter((item) => isCandidateTrackName(item.name)).sort(byFolderName)) {
    if (entry.mode === '120000') {
      skipped.push(entry.name);
      continue;
    }
    if (entry.type !== 'tree') continue;
    const inside = lsTree(repoTop, rev, `${specsPath}/${entry.name}`);
    if (inside.some((item) => item.name === 'spec.md' && item.type === 'blob')) continue;
    const metadata = inside.find((item) => item.name === GRAPH_METADATA && item.type === 'blob');
    if (!metadata) continue;

    const track = {
      name: entry.name,
      metadataPath: `${specsPath}/${entry.name}/${GRAPH_METADATA}`,
      rawMetadata: readBlob(repoTop, metadata.object),
      children: numberedTreeChildren(inside),
      symlinked: false,
    };
    tracks.push(track);

    const containers = inside.filter((item) => isSubTrackCandidateName(item.name)).sort(byFolderName);
    for (const sub of containers) {
      const id = `${entry.name}/${sub.name}`;
      if (sub.mode === '120000') {
        diagnostics.push(`${id}: symlinked folder skipped, not followed`);
        continue;
      }
      if (sub.type !== 'tree') continue;
      const subInside = lsTree(repoTop, rev, `${specsPath}/${entry.name}/${sub.name}`);
      const description = subInside.find((item) => item.name === DESCRIPTION && item.type === 'blob');
      const declared = isDeclaredSubTrack(description ? parseObject(readBlob(repoTop, description.object)) : null);
      if (!declared) {
        diagnostics.push(`${id}: undeclared folder ignored`);
        continue;
      }
      if (subInside.some((item) => item.name === 'spec.md' && item.type === 'blob')) {
        diagnostics.push(`${id}: declared folder has spec.md and cannot be a sub-track`);
        continue;
      }
      track.children.push(sub.name);
      const subMetadata = subInside.find((item) => item.name === GRAPH_METADATA && item.type === 'blob');
      tracks.push({
        name: id,
        metadataPath: `${specsPath}/${entry.name}/${sub.name}/${GRAPH_METADATA}`,
        rawMetadata: subMetadata ? readBlob(repoTop, subMetadata.object) : null,
        children: numberedTreeChildren(subInside),
        symlinked: false,
      });
    }
    track.children.sort(compareNames);
  }

  tracks.sort(byFolderName);
  diagnostics.sort(compareNames);
  return { tracks, skipped, diagnostics };
}

// ───────────────────────────────────────────────────────────────────
// 4. COMPARISON
// ───────────────────────────────────────────────────────────────────

/** Parse a track's metadata, or return null when it is empty or not JSON. */
export function parseTrackMetadata(rawMetadata) {
  return parseObject(rawMetadata);
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
