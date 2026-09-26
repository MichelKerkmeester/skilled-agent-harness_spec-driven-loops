// Remove what a build regenerates and nothing else, and say what was freed.
//
// A day of rebuilding leaves `target/debug/deps` holding every object a
// changed crate ever produced and `target/*/incremental` holding the caches
// behind them; the tree passed 15 GB twice and stopped a release mid-gate
// with ENOSPC both times. Nothing here is a source file or a stored run:
// incremental caches, output for targets other than the host (a cross-check
// that was tried once), and the scratch work the fixture gates leave behind.
// `cargo clean` remains the tool for the rest, and release:check runs it.
import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const repository = resolve(import.meta.dirname, '..');
const target = resolve(repository, 'target');

// Allocated size, the way `du` counts: blocks rather than logical length, and
// a hard-linked file once (cargo hard-links artifacts out of deps/).
function size(path) {
  let total = 0;
  const seen = new Set();
  // A single file is a size of its own: `readdirSync` refuses one, so without
  // this every artifact removed below is counted as nothing and a sweep that
  // freed gigabytes reports having freed none.
  try {
    const stat = statSync(path);
    if (stat.isFile()) {
      return stat.blocks !== undefined && stat.blocks > 0 ? stat.blocks * 512 : stat.size;
    }
  } catch {
    return 0;
  }
  const pending = [path];
  while (pending.length > 0) {
    const current = pending.pop();
    let entries;
    try {
      entries = readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const child = resolve(current, entry.name);
      if (entry.isDirectory()) pending.push(child);
      else if (entry.isFile()) {
        try {
          const stat = statSync(child);
          if (stat.nlink > 1) {
            if (seen.has(stat.ino)) continue;
            seen.add(stat.ino);
          }
          total += stat.blocks !== undefined && stat.blocks > 0 ? stat.blocks * 512 : stat.size;
        } catch {
          // Removed underneath us; a sweep is best-effort.
        }
      }
    }
  }
  return total;
}

const gigabytes = (bytes) => `${(bytes / 1024 ** 3).toFixed(2)} GB`;

// Artifacts in `deps` that a later build has already replaced.
//
// Cargo names each build of a crate with a hash of what went into it and never
// removes the one it stopped using, so a week of changing one crate leaves a
// copy of it per change -- six of `libsupercov_engine.rlib` at 266 MB each was
// what prompted this. Only the newest of each name survives here, and only
// once it has been superseded for a day: several current artifacts of one
// crate are ordinary -- a different feature set, a test build beside a lib one
// -- and they are all written by the same build, so an age this side of it
// cannot mistake one for stale.
//
// Nothing here is unsafe to remove at any age. Cargo checks that an artifact
// it considers fresh is still on disk and rebuilds it when it is not, so the
// most this can cost is the compile it saves next time -- which is the whole
// bargain of a cache.
const SUPERSEDED_AFTER_DAYS = 1;

function supersededArtifacts(deps) {
  const groups = new Map();
  let entries;
  try {
    entries = readdirSync(deps, { withFileTypes: true });
  } catch {
    return [];
  }
  for (const entry of entries) {
    // `libfoo-9a8092c517e.rlib`, `foo-6761aaa9ef8`, `foo-6761aaa9ef8.d`, and
    // the `.dSYM` bundles that are directories rather than files.
    const named = entry.name.match(/^(.*?)-([0-9a-f]{8,20})(\..*)?$/);
    if (!named) continue;
    const key = `${named[1]}${named[3] ?? ''}`;
    const path = resolve(deps, entry.name);
    let modified;
    try {
      modified = statSync(path).mtimeMs;
    } catch {
      continue;
    }
    groups.set(key, [...(groups.get(key) ?? []), { path, modified }]);
  }
  const stale = Date.now() - SUPERSEDED_AFTER_DAYS * 24 * 60 * 60 * 1000;
  const superseded = [];
  for (const [key, builds] of groups) {
    if (builds.length < 2) continue;
    builds.sort((a, b) => b.modified - a.modified);
    // `slice(1)` is what makes this safe to say: the newest build of a name is
    // never removed, whatever its age.
    for (const build of builds.slice(1)) {
      if (build.modified < stale) superseded.push({ path: build.path, key });
    }
  }
  return superseded;
}

const candidates = [];
if (existsSync(target)) {
  for (const profile of readdirSync(target, { withFileTypes: true })) {
    if (!profile.isDirectory()) continue;
    const incremental = resolve(target, profile.name, 'incremental');
    if (existsSync(incremental)) candidates.push({ path: incremental, why: `${profile.name} incremental cache` });
    for (const { path, key } of supersededArtifacts(resolve(target, profile.name, 'deps'))) {
      candidates.push({ path, why: `${profile.name} superseded ${key}`, quiet: true });
    }
    // Output for another target triple: a cross-check tried once, never the host's build.
    if (/^(aarch64|x86_64|i686|arm|armv7|riscv64gc|s390x|powerpc64le|loongarch64)-[a-z0-9_]+-[a-z0-9_-]+$/.test(profile.name)) {
      candidates.push({ path: resolve(target, profile.name), why: `output for target ${profile.name}` });
    }
  }
}
const fixtures = resolve(repository, 'tests/fixtures');
if (existsSync(fixtures)) {
  for (const fixture of readdirSync(fixtures, { withFileTypes: true })) {
    if (!fixture.isDirectory()) continue;
    for (const scratch of ['.supercov/work', '.supercov/workspaces', '.supercov/cache']) {
      const path = resolve(fixtures, fixture.name, scratch);
      if (existsSync(path)) candidates.push({ path, why: `${fixture.name} ${scratch}` });
    }
  }
}

let freed = 0;
// A superseded artifact per line would be hundreds of lines saying the same
// thing, so they are counted rather than named.
let superseded = { count: 0, bytes: 0 };
for (const { path, why, quiet } of candidates) {
  const bytes = size(path);
  rmSync(path, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
  freed += bytes;
  if (quiet) {
    superseded = { count: superseded.count + 1, bytes: superseded.bytes + bytes };
    continue;
  }
  console.log(`[sweep] removed ${why} (${gigabytes(bytes)})`);
}
if (superseded.count > 0) {
  console.log(
    `[sweep] removed ${superseded.count} artifact(s) a later build replaced (${gigabytes(superseded.bytes)})`,
  );
}
const remaining = existsSync(target) ? size(target) : 0;
console.log(`[sweep] freed ${gigabytes(freed)}; target is ${gigabytes(remaining)} (cargo clean removes the rest)`);
