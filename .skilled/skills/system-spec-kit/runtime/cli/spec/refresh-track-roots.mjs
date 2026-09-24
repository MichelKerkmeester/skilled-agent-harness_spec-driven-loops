// ───────────────────────────────────────────────────────────────────
// MODULE: Refresh Track Roots
// ───────────────────────────────────────────────────────────────────
// Rewrites each track root's children_ids to the numbered packets on disk, the
// repair sweep-track-roots.mjs reports the need for. Only children_ids changes:
// every other field, its key order and the file's two-space format stay as they
// were, and a track that already matches is not rewritten at all. Entries for
// packets no longer on disk and entries under an earlier identity are dropped,
// because a track's children are exactly the packet folders it holds.
//
// Dry by default: it prints what each track would gain and lose. --apply writes.
// A track whose graph-metadata.json is empty or not JSON is reported and left
// alone, since rewriting one field of a record that cannot be read would mean
// inventing the rest of it.
//
// create.sh runs this with --track after scaffolding a packet into a track, so
// a new packet is declared the moment it exists.
//
// Usage:
//   node .skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs [--specs <dir>] [--track <name>]... [--apply]
//
// Exit codes: 0 = nothing left to change (after --apply: every change written),
//             1 = changes pending (dry run only),
//             2 = a rejected argument, an unknown track or unreadable metadata.
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import {
  compareTrackChildren,
  expectedChildrenIds,
  parseTrackMetadata,
  readWorkingTreeTracks,
  resolveSpecsRoot,
} from '../lib/track-roots.mjs';

const SCRIPT = 'refresh-track-roots';

function parseArgs(argv) {
  const parsed = { specs: null, tracks: [], apply: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--apply') {
      parsed.apply = true;
      continue;
    }
    if (arg === '--specs' || arg === '--track') {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith('--')) {
        process.stderr.write(`${SCRIPT}: ${arg} requires a value\n`);
        process.exit(2);
      }
      if (arg === '--specs') parsed.specs = value;
      else parsed.tracks.push(value);
      index += 1;
      continue;
    }
    process.stderr.write(`${SCRIPT}: unknown argument: ${arg}\n`);
    process.exit(2);
  }
  return parsed;
}

function describeChange(result) {
  const parts = [];
  if (result.extra.length > 0) parts.push(`add ${result.extra.join(', ')}`);
  const removed = [...result.missing, ...result.foreign];
  if (removed.length > 0) parts.push(`remove ${removed.join(', ')}`);
  return parts.join('; ');
}

function main() {
  const { specs, tracks: wanted, apply } = parseArgs(process.argv.slice(2));
  const specsRoot = resolveSpecsRoot(specs, SCRIPT);
  const tracks = readWorkingTreeTracks(specsRoot);

  const unknown = wanted.filter((name) => !tracks.some((track) => track.name === name));
  if (unknown.length > 0) {
    process.stderr.write(`${SCRIPT}: not a track root with graph-metadata.json: ${unknown.join(', ')}\n`);
    process.exit(2);
  }

  let pending = 0;
  let failed = 0;
  for (const track of tracks) {
    if (wanted.length > 0 && !wanted.includes(track.name)) continue;
    const metadata = parseTrackMetadata(track.rawMetadata);
    if (!metadata) {
      process.stdout.write(`${track.name}: graph-metadata.json is unreadable, not written\n`);
      failed += 1;
      continue;
    }
    const result = compareTrackChildren(metadata, track.name, track.children);
    if (result.matches) {
      process.stdout.write(`${track.name}: up to date\n`);
      continue;
    }
    const change = describeChange(result);
    if (!apply) {
      process.stdout.write(`${track.name}: ${change}\n`);
      pending += 1;
      continue;
    }
    const next = { ...metadata, children_ids: expectedChildrenIds(metadata, track.name, track.children) };
    try {
      fs.writeFileSync(track.metadataPath, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
      process.stdout.write(`${track.name}: ${change} (written)\n`);
    } catch (error) {
      process.stdout.write(`${track.name}: write failed: ${error instanceof Error ? error.message : String(error)}\n`);
      failed += 1;
    }
  }

  if (failed > 0) process.exit(2);
  process.exit(pending > 0 ? 1 : 0);
}

main();
