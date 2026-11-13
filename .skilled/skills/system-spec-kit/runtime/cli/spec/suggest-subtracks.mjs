// ───────────────────────────────────────────────────────────────────
// MODULE: Suggest Subtracks
// ───────────────────────────────────────────────────────────────────
// A track that grows flat becomes hard to read: unrelated subjects share one
// list, and nothing in the tree says which packet belongs with which. This tool
// proposes a regrouping from the words the packets already carry. It is advice,
// not a migration: it prints a mapping and never moves or writes a folder, so a
// person can review the proposal before anything changes.
//
// Two questions are answered. With no description, a flat track's packets are
// clustered by the words they share, and every cluster gets a proposed name.
// With a description, an already grouped track is scored against each declared
// sub-track, and the best fit is named only when enough of its words appear.
//
// Words shared by most packets describe the track as a whole, so they are
// dropped before clustering; otherwise every pair would look alike. A pair
// merges only on real overlap, and leftover packets join one remainder group
// rather than forcing a weak cluster.
//
// Read-only: it reads packet metadata and prints, never writes.
//
// Usage:
//   node .skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs --track <name> [--specs <dir>] [--threshold <n>] [--describe "<text>"]
//
// Exit codes: 0 = a proposal or an explained non-answer,
//             2 = a rejected argument, a missing value or a track that is absent.
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';

import {
  readWorkingTreeTracks,
  resolveSpecsRoot,
  trackLayout,
} from '../lib/track-roots.mjs';

const SCRIPT = 'suggest-subtracks';
const DEFAULT_THRESHOLD = 8;
const NUMBERED_PACKET = /^\d{3}(?:[-_].+)?$/;

// The words below say what every packet is rather than what a group is about,
// so they are ignored on both sides of a comparison.
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'into', 'that', 'this', 'are', 'was',
  'not', 'all', 'any', 'new', 'add', 'use', 'spec', 'specs', 'packet', 'phase',
]);

function fail(message) {
  process.stderr.write(`${SCRIPT}: ${message}\n`);
  process.exit(2);
}

function parseArgs(argv) {
  const parsed = { specs: null, track: null, threshold: DEFAULT_THRESHOLD, describe: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--specs' || arg === '--track' || arg === '--threshold' || arg === '--describe') {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith('--')) {
        fail(`${arg} requires a value`);
      }
      if (arg === '--threshold') {
        if (!/^\d+$/.test(value) || Number(value) < 1) {
          fail('--threshold must be a positive integer');
        }
        parsed.threshold = Number(value);
      } else {
        parsed[arg.slice(2)] = value;
      }
      index += 1;
      continue;
    }
    fail(`unknown argument: ${arg}`);
  }
  if (parsed.track === null) {
    fail('--track is required');
  }
  return parsed;
}

function compareNames(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function isDirectory(target) {
  try {
    return fs.statSync(target).isDirectory();
  } catch {
    return false;
  }
}

function readJson(filePath) {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function stringArray(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === 'string') : [];
}

// Splitting on everything that is not a letter or a digit keeps hyphenated and
// underscored labels comparable, and dropping short words removes noise.
function termsOf(strings) {
  const terms = new Set();
  for (const value of strings) {
    for (const word of value.toLowerCase().split(/[^a-z0-9]+/)) {
      if (word.length < 3 || STOP_WORDS.has(word)) continue;
      terms.add(word);
    }
  }
  return terms;
}

function packetTerms(packetPath) {
  const description = readJson(path.join(packetPath, 'description.json'));
  const metadata = readJson(path.join(packetPath, 'graph-metadata.json'));
  const derived = metadata && typeof metadata.derived === 'object' && metadata.derived !== null
    ? metadata.derived
    : null;
  return termsOf([
    ...stringArray(description?.keywords),
    ...stringArray(derived?.trigger_phrases),
    ...stringArray(derived?.key_topics),
  ]);
}

// A numbered folder counts as a packet only when it holds a spec, matching the
// shared track reader. The fallback exists for a track that has no metadata at
// its root and therefore never appears in that reader's result.
function readNumberedPackets(directory) {
  let entries;
  try {
    entries = fs.readdirSync(directory, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((entry) => entry.isDirectory() && NUMBERED_PACKET.test(entry.name))
    .filter((entry) => fs.existsSync(path.join(directory, entry.name, 'spec.md')))
    .map((entry) => entry.name)
    .sort(compareNames);
}

function trackChildren(specsRoot, track, tracks) {
  const entry = tracks.find((item) => item.name === track);
  return entry ? entry.children : readNumberedPackets(path.join(specsRoot, track));
}

function subTrackTerms(specsRoot, track, subTrack, tracks) {
  const subPath = path.join(specsRoot, track, subTrack);
  const description = readJson(path.join(subPath, 'description.json'));
  const terms = termsOf(stringArray(description?.keywords));
  const entry = tracks.find((item) => item.name === `${track}/${subTrack}`);
  const packets = entry ? trackLayout(entry.children).packets : readNumberedPackets(subPath);
  for (const packet of packets) {
    for (const term of packetTerms(path.join(subPath, packet))) terms.add(term);
  }
  return terms;
}

function jaccard(left, right) {
  if (left.size === 0 && right.size === 0) return 0;
  const [small, large] = left.size <= right.size ? [left, right] : [right, left];
  let shared = 0;
  for (const term of small) {
    if (large.has(term)) shared += 1;
  }
  return shared / (left.size + right.size - shared);
}

function renumbered(folder, index) {
  const match = /^\d{3}[-_](.+)$/.exec(folder);
  const number = String(index + 1).padStart(3, '0');
  return match ? `${number}-${match[1]}` : number;
}

function cluster(folders, termsByFolder) {
  const indexByName = new Map(folders.map((folder, index) => [folder, index]));
  const parent = folders.map((_, index) => index);

  const find = (index) => {
    let root = index;
    while (parent[root] !== root) root = parent[root];
    while (parent[index] !== root) {
      const next = parent[index];
      parent[index] = root;
      index = next;
    }
    return root;
  };

  const union = (left, right) => {
    const leftRoot = find(left);
    const rightRoot = find(right);
    if (leftRoot === rightRoot) return;
    // Always attach the larger index to the smaller one so the result does not
    // depend on which packet happened to be visited first.
    if (leftRoot < rightRoot) parent[rightRoot] = leftRoot;
    else parent[leftRoot] = rightRoot;
  };

  const pairs = [];
  for (let left = 0; left < folders.length; left += 1) {
    for (let right = left + 1; right < folders.length; right += 1) {
      pairs.push({
        left: folders[left],
        right: folders[right],
        similarity: jaccard(termsByFolder.get(folders[left]), termsByFolder.get(folders[right])),
      });
    }
  }
  pairs.sort((a, b) => b.similarity - a.similarity
    || compareNames(a.left, b.left)
    || compareNames(a.right, b.right));
  for (const pair of pairs) {
    if (pair.similarity >= 0.2) {
      union(indexByName.get(pair.left), indexByName.get(pair.right));
    }
  }

  const members = new Map();
  for (const folder of folders) {
    const root = find(indexByName.get(folder));
    if (!members.has(root)) members.set(root, []);
    members.get(root).push(folder);
  }
  return [...members.values()];
}

function nameGroups(groups, termsByFolder) {
  const used = new Set(groups.filter((group) => group.name !== null).map((group) => group.name));
  let nextGroup = 1;

  for (const group of groups) {
    if (group.name !== null) continue;
    const frequency = new Map();
    for (const folder of group.packets) {
      for (const term of termsByFolder.get(folder)) {
        frequency.set(term, (frequency.get(term) ?? 0) + 1);
      }
    }
    // A word must cover at least half the cluster to describe it. Ranking by
    // coverage first and alphabetically second keeps the name stable.
    const ranked = [...frequency]
      .filter(([, count]) => count * 2 >= group.packets.length)
      .sort((a, b) => b[1] - a[1] || compareNames(a[0], b[0]));
    let name = ranked.slice(0, 2).map(([term]) => term).join('-');

    if (name === '' || /^\d/.test(name)) {
      do {
        name = `group-${nextGroup}`;
        nextGroup += 1;
      } while (used.has(name));
    } else if (used.has(name)) {
      let suffix = 2;
      while (used.has(`${name}-${suffix}`)) suffix += 1;
      name = `${name}-${suffix}`;
    }
    group.name = name;
    used.add(name);
  }
}

function proposeRetroactive(specsRoot, track, layout, threshold) {
  if (layout.subTracks.length > 0) {
    process.stdout.write(`track ${track} is already grouped into sub-tracks; no map\n`);
    return;
  }

  const folders = [...layout.packets].sort(compareNames);
  if (folders.length < threshold) {
    process.stdout.write(`track ${track} has ${folders.length} live packets, below the threshold of ${threshold}; no map\n`);
    return;
  }

  const termsByFolder = new Map();
  for (const folder of folders) {
    termsByFolder.set(folder, packetTerms(path.join(specsRoot, track, folder)));
  }

  // A word in most packets describes the track, not a group inside it. Coverage
  // is compared as a ratio so the rule does not depend on any fixed count.
  const frequency = new Map();
  for (const terms of termsByFolder.values()) {
    for (const term of terms) {
      frequency.set(term, (frequency.get(term) ?? 0) + 1);
    }
  }
  for (const terms of termsByFolder.values()) {
    for (const term of [...terms]) {
      if ((frequency.get(term) ?? 0) * 5 > folders.length * 3) terms.delete(term);
    }
  }

  const clusters = cluster(folders, termsByFolder);
  const grouped = clusters
    .filter((members) => members.length >= 2)
    .sort((a, b) => compareNames(a[0], b[0]));
  const remainder = clusters
    .filter((members) => members.length === 1)
    .map((members) => members[0])
    .sort(compareNames);

  const groups = grouped.map((packets) => ({ packets: [...packets].sort(compareNames), name: null }));
  if (remainder.length > 0) {
    groups.push({ packets: remainder, name: 'general' });
  }
  if (groups.length < 2) {
    process.stdout.write(`track ${track}: no grouping found; no map\n`);
    return;
  }

  nameGroups(groups, termsByFolder);

  const mapping = [];
  for (const group of groups) {
    const ordered = [...group.packets].sort(compareNames);
    ordered.forEach((folder, index) => {
      mapping.push({
        from: `${track}/${folder}`,
        to: `${track}/${group.name}/${renumbered(folder, index)}`,
      });
    });
    process.stderr.write(`${SCRIPT}: ${track}/${group.name} <- ${ordered.join(', ')}\n`);
  }
  mapping.sort((a, b) => compareNames(a.from, b.from));
  process.stdout.write(`${JSON.stringify(mapping, null, 2)}\n`);
}

function proposePresent(specsRoot, track, layout, tracks, describe) {
  if (layout.subTracks.length === 0) {
    process.stdout.write(`track ${track} is flat; no sub-track to fit\n`);
    return;
  }

  const descriptionTerms = termsOf([describe]);
  if (descriptionTerms.size === 0) {
    process.stdout.write(`none fits: propose a new sub-track in ${track}\n`);
    return;
  }

  const subTracks = [...layout.subTracks].sort(compareNames);
  let best = null;
  for (const subTrack of subTracks) {
    const terms = subTrackTerms(specsRoot, track, subTrack, tracks);
    let matched = 0;
    for (const term of descriptionTerms) {
      if (terms.has(term)) matched += 1;
    }
    const score = matched / descriptionTerms.size;
    // The list is sorted, so a strict comparison keeps the alphabetically first
    // sub-track when two scores are equal.
    if (best === null || score > best.score) {
      best = { name: subTrack, score, matched };
    }
  }

  if (best !== null && best.matched >= 2 && best.score >= 0.2) {
    process.stdout.write(`best fit: ${track}/${best.name}\n`);
  } else {
    process.stdout.write(`none fits: propose a new sub-track in ${track}\n`);
  }
}

function main() {
  const { specs, track, threshold, describe } = parseArgs(process.argv.slice(2));
  const specsRoot = resolveSpecsRoot(specs, SCRIPT);
  const specsRootPath = path.resolve(specsRoot);
  const trackPath = path.resolve(specsRootPath, track);
  if (path.dirname(trackPath) !== specsRootPath || !isDirectory(trackPath)) {
    fail(`track ${track} does not exist`);
  }

  const tracks = readWorkingTreeTracks(specsRoot);
  const layout = trackLayout(trackChildren(specsRoot, track, tracks));
  if (describe === null) {
    proposeRetroactive(specsRoot, track, layout, threshold);
  } else {
    proposePresent(specsRoot, track, layout, tracks, describe);
  }
}

main();
