// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Root Migration Manifest
// ───────────────────────────────────────────────────────────────────

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { classifySpecRootCollision } from './spec-root-collision-classifier.js';

import type {
  CollisionClass,
  PhysicalRoot,
} from './spec-root-collision-classifier.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export type MigrationManifest = {
  entries: Array<{
    relativePacketId: string;
    klass: CollisionClass;
    fileSetHash: string;
    roots: string[];
    decision: 'allow' | 'reject';
  }>;
  divergentCount: number;
};

type PacketFile = {
  relativePath: string;
  kind: 'file' | 'symlink';
  content: Buffer;
};

type RootSnapshot = {
  packetHashes: Map<string, string>;
};

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

const PACKET_MARKERS = new Set(['description.json', 'spec.md']);

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function isMissingPathError(error: unknown): boolean {
  return error instanceof Error
    && 'code' in error
    && (error.code === 'ENOENT' || error.code === 'ENOTDIR');
}

function isWithin(parentPath: string, candidatePath: string): boolean {
  const relativePath = path.relative(parentPath, candidatePath);
  return relativePath === ''
    || (!relativePath.startsWith(`..${path.sep}`)
      && relativePath !== '..'
      && !path.isAbsolute(relativePath));
}

function inspectRoot(
  workspacePath: string,
  rootPath: string,
  kind: PhysicalRoot['kind'],
): PhysicalRoot | null {
  try {
    fs.lstatSync(rootPath);
  } catch (error: unknown) {
    if (isMissingPathError(error)) return null;
    throw error;
  }

  let stats: fs.Stats;
  let realRoot: string;
  try {
    stats = fs.statSync(rootPath);
    realRoot = fs.realpathSync(rootPath);
  } catch (error: unknown) {
    throw new Error(`Spec root is unavailable: ${rootPath}`, { cause: error });
  }

  if (!stats.isDirectory()) {
    throw new Error(`Spec root is not a directory: ${rootPath}`);
  }
  if (!isWithin(workspacePath, realRoot)) {
    throw new Error(`Spec root resolves outside the workspace: ${rootPath}`);
  }

  return { rootPath, kind };
}

function getPhysicalRoots(workspacePath: string): PhysicalRoot[] {
  const resolvedWorkspace = path.resolve(workspacePath);
  const workspaceStats = fs.statSync(resolvedWorkspace);
  if (!workspaceStats.isDirectory()) {
    throw new Error(`Workspace is not a directory: ${resolvedWorkspace}`);
  }

  const realWorkspace = fs.realpathSync(resolvedWorkspace);
  const candidates: PhysicalRoot[] = [
    { rootPath: path.join(resolvedWorkspace, '.opencode', 'specs'), kind: 'canonical' },
    { rootPath: path.join(resolvedWorkspace, 'specs'), kind: 'legacy' },
  ];

  return candidates.flatMap((candidate) => {
    const root = inspectRoot(realWorkspace, candidate.rootPath, candidate.kind);
    return root === null ? [] : [root];
  });
}

function normalizeRelativePath(relativePath: string): string {
  return relativePath.split(path.sep).join('/');
}

function readPacketFiles(
  packetPath: string,
  currentPath = '',
  files: PacketFile[] = [],
): PacketFile[] {
  const currentDirectory = path.join(packetPath, currentPath);
  const entries = fs.readdirSync(currentDirectory, { withFileTypes: true })
    .sort((left, right) => compareStrings(left.name, right.name));

  for (const entry of entries) {
    const relativePath = path.join(currentPath, entry.name);
    const entryPath = path.join(packetPath, relativePath);

    if (entry.isDirectory()) {
      readPacketFiles(packetPath, relativePath, files);
    } else if (entry.isFile()) {
      files.push({
        relativePath: normalizeRelativePath(relativePath),
        kind: 'file',
        content: fs.readFileSync(entryPath),
      });
    } else if (entry.isSymbolicLink()) {
      files.push({
        relativePath: normalizeRelativePath(relativePath),
        kind: 'symlink',
        content: Buffer.from(fs.readlinkSync(entryPath)),
      });
    } else {
      throw new Error(`Unsupported filesystem entry: ${entryPath}`);
    }
  }

  return files;
}

function updateFramed(hash: crypto.Hash, value: string | Buffer): void {
  const content = typeof value === 'string' ? Buffer.from(value) : value;
  const length = Buffer.allocUnsafe(8);
  length.writeBigUInt64BE(BigInt(content.length));
  hash.update(length);
  hash.update(content);
}

function hashPacket(packetPath: string): string {
  const hash = crypto.createHash('sha256');
  updateFramed(hash, 'spec-root-packet-file-set-v1');

  for (const file of readPacketFiles(packetPath)) {
    updateFramed(hash, file.relativePath);
    updateFramed(hash, file.kind);
    updateFramed(hash, file.content);
  }

  return hash.digest('hex');
}

function snapshotRoot(physicalRoot: PhysicalRoot): RootSnapshot {
  const packetHashes = new Map<string, string>();

  function walk(currentPath: string): void {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true })
      .sort((left, right) => compareStrings(left.name, right.name));
    const relativePacketId = normalizeRelativePath(
      path.relative(physicalRoot.rootPath, currentPath),
    );
    const isPacket = relativePacketId !== '' && entries.some((entry) => (
      PACKET_MARKERS.has(entry.name) && (entry.isFile() || entry.isSymbolicLink())
    ));

    if (isPacket) {
      packetHashes.set(relativePacketId, hashPacket(currentPath));
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(currentPath, entry.name));
      }
    }
  }

  walk(physicalRoot.rootPath);
  return { packetHashes };
}

function aggregateFileSetHash(relativePacketId: string, snapshots: RootSnapshot[]): string {
  const distinctHashes = [...new Set(snapshots.flatMap((snapshot) => {
    const packetHash = snapshot.packetHashes.get(relativePacketId);
    return packetHash === undefined ? [] : [packetHash];
  }))].sort(compareStrings);

  if (distinctHashes.length === 1) {
    return distinctHashes[0];
  }

  const hash = crypto.createHash('sha256');
  updateFramed(hash, 'spec-root-packet-hash-set-v1');
  for (const packetHash of distinctHashes) {
    updateFramed(hash, packetHash);
  }
  return hash.digest('hex');
}

// ───────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Build a deterministic, read-only packet manifest for both workspace roots. */
export function buildMigrationManifest(workspacePath: string): MigrationManifest {
  const physicalRoots = getPhysicalRoots(workspacePath);
  const snapshots = physicalRoots.map(snapshotRoot);
  const packetIds = [...new Set(snapshots.flatMap((snapshot) => (
    [...snapshot.packetHashes.keys()]
  )))].sort(compareStrings);

  const entries = packetIds.map((relativePacketId) => {
    const collision = classifySpecRootCollision(relativePacketId, physicalRoots);
    return {
      relativePacketId,
      klass: collision.klass,
      fileSetHash: aggregateFileSetHash(relativePacketId, snapshots),
      roots: collision.presentRoots,
      decision: collision.decision,
    };
  });

  return {
    entries,
    divergentCount: entries.filter((entry) => entry.klass === 'divergent-duplicate').length,
  };
}
