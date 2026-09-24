// ───────────────────────────────────────────────────────────────────
// MODULE: Sweep Track Roots
// ───────────────────────────────────────────────────────────────────
// Per-packet validation never reaches a track root: the orchestrator treats a
// spec-less directory directly under specs/ as a track and skips every packet
// rule, so a track's children_ids can drift from what is actually on disk with
// nothing else reporting it. This sweep walks every track root that carries a
// graph-metadata.json, compares the declared children_ids with the numbered
// child directories, and prints one line per track.
//
// A track matches only when the declared set equals the on-disk set and no entry
// hangs off another identity. Counting alone is not enough: a packet renamed on
// disk leaves both counts where they were.
//
// With --rev <commit> the sweep reads that commit instead of the working tree.
// The pre-push gate uses it, because a shared checkout carries other sessions'
// unfinished packets and only the pushed commit matters. A symlinked track is a
// single link in a commit, holding another repository's files, so --rev skips it.
//
// Read-only: it reports and never writes. refresh-track-roots.mjs --apply
// rewrites a drifted track's children_ids.
//
// Usage:
//   node .skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs [--specs <dir>] [--rev <commit>]
//
// Exit codes: 0 = every track's declared children match its packets,
//             1 = at least one track differs (or its metadata is unreadable),
//             2 = a rejected argument or a commit that cannot be read.
// ───────────────────────────────────────────────────────────────────

import {
  compareTrackChildren,
  parseTrackMetadata,
  readCommitTracks,
  readWorkingTreeTracks,
  resolveSpecsRoot,
} from '../lib/track-roots.mjs';

const SCRIPT = 'sweep-track-roots';

function parseArgs(argv) {
  const parsed = { specs: null, rev: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--specs' || arg === '--rev') {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith('--')) {
        process.stderr.write(`${SCRIPT}: ${arg} requires a value\n`);
        process.exit(2);
      }
      parsed[arg.slice(2)] = value;
      index += 1;
      continue;
    }
    process.stderr.write(`${SCRIPT}: unknown argument: ${arg}\n`);
    process.exit(2);
  }
  return parsed;
}

function main() {
  const { specs, rev } = parseArgs(process.argv.slice(2));
  const specsRoot = resolveSpecsRoot(specs, SCRIPT);

  let tracks;
  let skipped = [];
  if (rev) {
    try {
      ({ tracks, skipped } = readCommitTracks(specsRoot, rev));
    } catch (error) {
      process.stderr.write(`${SCRIPT}: cannot read specs/ at ${rev}: ${error instanceof Error ? error.message.split('\n')[0] : String(error)}\n`);
      process.exit(2);
    }
  } else {
    tracks = readWorkingTreeTracks(specsRoot);
  }

  if (skipped.length > 0) {
    process.stdout.write(`symlinked tracks skipped at ${rev}: ${skipped.join(', ')}\n`);
  }
  if (tracks.length === 0) {
    process.stdout.write(`${SCRIPT}: no track roots with graph-metadata.json found\n`);
    process.exit(0);
  }

  let drifted = 0;
  for (const track of tracks) {
    const metadata = parseTrackMetadata(track.rawMetadata);
    if (!metadata) {
      process.stdout.write(`${track.name}: declared=? actual=? (graph-metadata.json is unreadable)\n`);
      drifted += 1;
      continue;
    }

    const result = compareTrackChildren(metadata, track.name, track.children);
    const foreignNote = result.foreign.length > 0 ? ` foreign=${result.foreign.length}` : '';
    process.stdout.write(`${track.name}: declared=${result.declared.length} actual=${track.children.length}${foreignNote}\n`);
    if (result.foreign.length > 0) {
      process.stdout.write(`    foreign-identity entries (not counted as declared): ${result.foreign.join(', ')}\n`);
    }
    if (result.extra.length > 0) {
      process.stdout.write(`    on disk, not declared: ${result.extra.join(', ')}\n`);
    }
    if (result.missing.length > 0) {
      process.stdout.write(`    declared, not on disk: ${result.missing.join(', ')}\n`);
    }
    if (!result.matches) {
      drifted += 1;
    }
  }

  if (drifted > 0) {
    process.stdout.write(`\n${SCRIPT}: ${drifted} track root(s) drifted; rewrite them with refresh-track-roots.mjs --apply\n`);
    process.exit(1);
  }
  process.stdout.write(`\n${SCRIPT}: all track roots match their declared children\n`);
  process.exit(0);
}

main();
