// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Root Collision Classifier
// ───────────────────────────────────────────────────────────────────

import * as fs from 'node:fs';
import * as path from 'node:path';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export type PhysicalRoot = { rootPath: string; kind: 'canonical' | 'legacy' };
export type CollisionClass =
  | 'canonical-only'
  | 'legacy-only'
  | 'same-inode-alias'
  | 'byte-identical-duplicate'
  | 'divergent-duplicate';
export type CollisionResult = {
  klass: CollisionClass;
  presentRoots: string[];
  decision: 'allow' | 'reject';
};

type PresentPacket = {
  packetPath: string;
  rootPath: string;
  kind: PhysicalRoot['kind'];
  stats: fs.BigIntStats;
};

type ManifestEntry = {
  relativePath: string;
  kind: 'file' | 'symlink';
  content: Buffer;
};

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function resolvePacketPath(relativePacketId: string, rootPath: string): string | null {
  const resolvedRoot = path.resolve(rootPath);
  const packetPath = path.resolve(resolvedRoot, relativePacketId);
  const relativePath = path.relative(resolvedRoot, packetPath);

  if (relativePath.startsWith(`..${path.sep}`) || relativePath === '..' || path.isAbsolute(relativePath)) {
    return null;
  }

  return packetPath;
}

function getPresentPackets(
  relativePacketId: string,
  physicalRoots: PhysicalRoot[],
): PresentPacket[] {
  const packets: PresentPacket[] = [];

  for (const root of physicalRoots) {
    const packetPath = resolvePacketPath(relativePacketId, root.rootPath);
    if (packetPath === null) continue;

    try {
      const stats = fs.statSync(packetPath, { bigint: true });
      if (stats.isDirectory()) {
        packets.push({ packetPath, rootPath: root.rootPath, kind: root.kind, stats });
      }
    } catch (_error: unknown) {
      // Unavailable roots do not suppress a packet that is present under another root.
    }
  }

  return packets;
}

function haveSameInode(packets: PresentPacket[]): boolean {
  if (packets.length < 2) return false;

  const first = packets[0].stats;
  return packets.every((packet) => (
    packet.stats.dev === first.dev && packet.stats.ino === first.ino
  ));
}

function readManifest(
  packetPath: string,
  currentPath = '',
  entries: ManifestEntry[] = [],
): ManifestEntry[] {
  const directoryPath = path.join(packetPath, currentPath);
  const dirents = fs.readdirSync(directoryPath, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name));

  for (const dirent of dirents) {
    const relativePath = path.join(currentPath, dirent.name);
    const entryPath = path.join(packetPath, relativePath);

    if (dirent.isDirectory()) {
      readManifest(packetPath, relativePath, entries);
    } else if (dirent.isFile()) {
      entries.push({ relativePath, kind: 'file', content: fs.readFileSync(entryPath) });
    } else if (dirent.isSymbolicLink()) {
      entries.push({
        relativePath,
        kind: 'symlink',
        content: Buffer.from(fs.readlinkSync(entryPath)),
      });
    } else {
      throw new Error(`Unsupported filesystem entry: ${entryPath}`);
    }
  }

  return entries;
}

function manifestsMatch(left: ManifestEntry[], right: ManifestEntry[]): boolean {
  if (left.length !== right.length) return false;

  return left.every((entry, index) => {
    const candidate = right[index];
    return candidate !== undefined
      && entry.relativePath === candidate.relativePath
      && entry.kind === candidate.kind
      && entry.content.equals(candidate.content);
  });
}

function haveIdenticalFileSets(packets: PresentPacket[]): boolean {
  try {
    const firstManifest = readManifest(packets[0].packetPath);
    return packets.slice(1).every((packet) => (
      manifestsMatch(firstManifest, readManifest(packet.packetPath))
    ));
  } catch (_error: unknown) {
    // Comparison failures cannot safely establish equivalence.
    return false;
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Classify a packet identity across canonical and legacy physical roots. */
export function classifySpecRootCollision(
  relativePacketId: string,
  physicalRoots: PhysicalRoot[],
): CollisionResult {
  const packets = getPresentPackets(relativePacketId, physicalRoots);
  const presentRoots = packets.map((packet) => packet.rootPath);
  const hasCanonical = packets.some((packet) => packet.kind === 'canonical');
  const hasLegacy = packets.some((packet) => packet.kind === 'legacy');

  if (hasCanonical && !hasLegacy) {
    return { klass: 'canonical-only', presentRoots, decision: 'allow' };
  }
  if (hasLegacy && !hasCanonical) {
    return { klass: 'legacy-only', presentRoots, decision: 'allow' };
  }
  if (haveSameInode(packets)) {
    return { klass: 'same-inode-alias', presentRoots, decision: 'allow' };
  }
  if (packets.length >= 2 && haveIdenticalFileSets(packets)) {
    return { klass: 'byte-identical-duplicate', presentRoots, decision: 'allow' };
  }

  // An absent or unreadable packet has no allowed winner in the public result model.
  return { klass: 'divergent-duplicate', presentRoots, decision: 'reject' };
}
