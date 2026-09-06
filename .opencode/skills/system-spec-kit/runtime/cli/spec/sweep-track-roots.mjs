#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Sweep Track Roots
// ───────────────────────────────────────────────────────────────────
// Per-packet validation never reaches a track root: the orchestrator treats a
// spec-less directory directly under specs/ as a track and skips every packet
// rule, so a track's generated children_ids can drift from what is actually on
// disk with nothing ever reporting it. This sweep walks every track root that
// carries a graph-metadata.json (a directory directly under specs/ with no
// spec.md of its own), compares the declared children_ids against the on-disk
// numbered child directories, and prints one line per track with both counts.
//
// Counting uses the writer's own spec-leaf convention (three digits optionally
// followed by -name or _name), so "actual" here is what a refresh of that
// track root would derive — the same standard the per-packet child-drift rule
// applies to packets.
//
// Read-only: it reports counts and mismatches and never writes metadata.
// Reconciling a drifted track root is an operator decision (a regenerate pass
// over the track's graph-metadata), not a side effect of a diagnostic.
//
// Usage:
//   node .opencode/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs [--specs <dir>]
//
// Exit codes: 0 = every track's declared and actual counts agree,
//             1 = at least one track differs (or metadata was unreadable).
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';

const SPEC_LEAF_SEGMENT_PATTERN = /^\d{3}(?:[-_].+)?$/;

function parseArgs(argv) {
  const parsed = { specs: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--specs') {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith('--')) {
        process.stderr.write('sweep-track-roots: --specs requires a directory path\n');
        process.exit(2);
      }
      parsed.specs = value;
      index += 1;
      continue;
    }
    process.stderr.write(`sweep-track-roots: unknown argument: ${arg}\n`);
    process.exit(2);
  }
  return parsed;
}

function resolveSpecsRoot(explicit) {
  if (explicit) return path.resolve(explicit);
  let current = path.resolve(process.cwd());
  while (true) {
    const candidate = path.join(current, 'specs');
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) return candidate;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  process.stderr.write('sweep-track-roots: no specs/ directory found from the working directory; pass --specs <dir>\n');
  process.exit(2);
}

// A track sits directly inside the specs root, is named for the track rather
// than numbered like a packet, and has no spec of its own — the same shape the
// validation orchestrator exempts from per-packet rules.
function isTrackRoot(specsRoot, entryName) {
  const trackPath = path.join(specsRoot, entryName);
  if (!fs.statSync(trackPath).isDirectory()) return false;
  if (/^\d{3}(?:[-_].+)?$/.test(entryName)) return false;
  return !fs.existsSync(path.join(trackPath, 'spec.md'));
}

function listOnDiskChildren(trackPath) {
  return fs.readdirSync(trackPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && SPEC_LEAF_SEGMENT_PATTERN.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

function main() {
  const { specs } = parseArgs(process.argv.slice(2));
  const specsRoot = resolveSpecsRoot(specs);

  const trackNames = fs.readdirSync(specsRoot, { withFileTypes: true })
    .map((entry) => entry.name)
    .filter((name) => {
      if (name.startsWith('.') || name === 'node_modules') return false;
      if (!isTrackRoot(specsRoot, name)) return false;
      return fs.existsSync(path.join(specsRoot, name, 'graph-metadata.json'));
    })
    .sort();

  if (trackNames.length === 0) {
    process.stdout.write('sweep-track-roots: no track roots with graph-metadata.json found\n');
    process.exit(0);
  }

  let drifted = 0;
  for (const track of trackNames) {
    const trackPath = path.join(specsRoot, track);
    let metadata = null;
    try {
      metadata = JSON.parse(fs.readFileSync(path.join(trackPath, 'graph-metadata.json'), 'utf8'));
    } catch {
      process.stdout.write(`${track}: declared=? actual=? (graph-metadata.json is unreadable)\n`);
      drifted += 1;
      continue;
    }

    const identity = typeof metadata.packet_id === 'string' && metadata.packet_id.trim() !== ''
      ? metadata.packet_id.trim()
      : track;
    const entries = Array.isArray(metadata.children_ids) ? metadata.children_ids : [];
    const declaredNames = entries
      .filter((entry) => String(entry).startsWith(`${identity}/`))
      .map((entry) => String(entry).slice(identity.length + 1))
      .sort();
    const foreignCount = entries.length - declaredNames.length;
    const onDisk = listOnDiskChildren(trackPath);

    process.stdout.write(`${track}: declared=${declaredNames.length} actual=${onDisk.length}${foreignCount > 0 ? ` foreign=${foreignCount}` : ''}\n`);
    if (foreignCount > 0) {
      const foreign = entries.filter((entry) => !String(entry).startsWith(`${identity}/`));
      process.stdout.write(`    foreign-identity entries (not counted as declared): ${foreign.join(', ')}\n`);
    }

    const declaredSet = new Set(declaredNames);
    const onDiskSet = new Set(onDisk);
    const extra = onDisk.filter((name) => !declaredSet.has(name));
    const missing = declaredNames.filter((name) => !onDiskSet.has(name));
    if (extra.length > 0) {
      process.stdout.write(`    on disk, not declared: ${extra.join(', ')}\n`);
    }
    if (missing.length > 0) {
      process.stdout.write(`    declared, not on disk: ${missing.join(', ')}\n`);
    }
    // One track counts once, whatever combination of mismatches it carries.
    if (foreignCount > 0 || declaredNames.length !== onDisk.length) {
      drifted += 1;
    }
  }

  if (drifted > 0) {
    process.stdout.write(`\nsweep-track-roots: ${drifted} track root(s) drifted; counts above are report-only, reconcile via a graph-metadata regeneration pass\n`);
    process.exit(1);
  }
  process.stdout.write('\nsweep-track-roots: all track roots match their declared children\n');
  process.exit(0);
}

main();
