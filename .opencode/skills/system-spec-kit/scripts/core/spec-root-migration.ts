// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Root Migration
// ───────────────────────────────────────────────────────────────────

import * as fs from 'node:fs';
import * as path from 'node:path';
import { randomUUID } from 'node:crypto';

import { classifySpecRootCollision } from './spec-root-collision-classifier.js';

import type { PhysicalRoot } from './spec-root-collision-classifier.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Options for one legacy-to-canonical migration run. */
export interface MigrationOptions {
  readonly quarantinePath: string;
}

/** Packet identities affected or deferred by one migration run. */
export interface MigrationResult {
  moved: string[];
  quarantined: string[];
  deferredDivergent: string[];
}

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function isMissingPathError(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

function pathExists(targetPath: string): boolean {
  try {
    fs.lstatSync(targetPath);
    return true;
  } catch (error: unknown) {
    if (isMissingPathError(error)) return false;
    throw error;
  }
}

function isWithinPath(parentPath: string, candidatePath: string): boolean {
  const relativePath = path.relative(parentPath, candidatePath);
  return relativePath === ''
    || (!relativePath.startsWith(`..${path.sep}`)
      && relativePath !== '..'
      && !path.isAbsolute(relativePath));
}

function assertWorkspaceDirectory(workspacePath: string): string {
  const resolvedWorkspace = path.resolve(workspacePath);
  const stats = fs.statSync(resolvedWorkspace);
  if (!stats.isDirectory()) {
    throw new Error(`Workspace is not a directory: ${resolvedWorkspace}`);
  }
  return resolvedWorkspace;
}

function inspectPhysicalRoot(rootPath: string, workspacePath: string): boolean {
  try {
    const stats = fs.statSync(rootPath);
    if (!stats.isDirectory()) {
      throw new Error(`Spec root is not a directory: ${rootPath}`);
    }

    const realWorkspace = fs.realpathSync(workspacePath);
    const realRoot = fs.realpathSync(rootPath);
    if (!isWithinPath(realWorkspace, realRoot)) {
      throw new Error(`Spec root resolves outside the workspace: ${rootPath}`);
    }
    return true;
  } catch (error: unknown) {
    if (isMissingPathError(error)) return false;
    throw error;
  }
}

function toPacketId(relativePath: string): string {
  return relativePath.split(path.sep).join('/');
}

function fromPacketId(packetId: string): string {
  return path.join(...packetId.split('/'));
}

function collectPacketIds(rootPath: string): string[] {
  if (!pathExists(rootPath)) return [];

  const packetIds: string[] = [];

  const visit = (directoryPath: string, relativePath: string): void => {
    const dirents = fs.readdirSync(directoryPath, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name));
    const hasPacketMarker = relativePath !== '' && dirents.some((dirent) => (
      dirent.name === 'spec.md' && (dirent.isFile() || dirent.isSymbolicLink())
    ));

    if (hasPacketMarker) {
      packetIds.push(toPacketId(relativePath));
      return;
    }

    for (const dirent of dirents) {
      if (!dirent.isDirectory()) continue;
      const childRelativePath = path.join(relativePath, dirent.name);
      visit(path.join(directoryPath, dirent.name), childRelativePath);
    }
  };

  visit(rootPath, '');
  return packetIds;
}

function directoriesMatch(leftPath: string, rightPath: string): boolean {
  const leftStats = fs.lstatSync(leftPath);
  const rightStats = fs.lstatSync(rightPath);

  if (leftStats.isFile() && rightStats.isFile()) {
    return fs.readFileSync(leftPath).equals(fs.readFileSync(rightPath));
  }
  if (leftStats.isSymbolicLink() && rightStats.isSymbolicLink()) {
    return fs.readlinkSync(leftPath) === fs.readlinkSync(rightPath);
  }
  if (!leftStats.isDirectory() || !rightStats.isDirectory()) return false;

  const leftNames = fs.readdirSync(leftPath).sort();
  const rightNames = fs.readdirSync(rightPath).sort();
  if (leftNames.length !== rightNames.length) return false;

  return leftNames.every((name, index) => (
    name === rightNames[index]
    && directoriesMatch(path.join(leftPath, name), path.join(rightPath, name))
  ));
}

function copyDirectoryVerified(sourcePath: string, destinationPath: string): void {
  if (pathExists(destinationPath)) {
    throw new Error(`Refusing to overwrite existing path: ${destinationPath}`);
  }

  const parentPath = path.dirname(destinationPath);
  const temporaryPath = path.join(
    parentPath,
    `.${path.basename(destinationPath)}.incoming-${randomUUID()}`,
  );
  fs.mkdirSync(parentPath, { recursive: true });

  try {
    fs.cpSync(sourcePath, temporaryPath, {
      recursive: true,
      errorOnExist: true,
      force: false,
      preserveTimestamps: true,
      verbatimSymlinks: true,
    });
    if (!directoriesMatch(sourcePath, temporaryPath)) {
      throw new Error(`Copied directory did not verify byte-for-byte: ${sourcePath}`);
    }
    fs.renameSync(temporaryPath, destinationPath);
  } catch (error: unknown) {
    fs.rmSync(temporaryPath, { recursive: true, force: true });
    throw error;
  }
}

function moveDirectoryVerified(sourcePath: string, destinationPath: string): void {
  if (pathExists(destinationPath)) {
    throw new Error(`Refusing to overwrite existing path: ${destinationPath}`);
  }
  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });

  try {
    fs.renameSync(sourcePath, destinationPath);
  } catch (error: unknown) {
    if (!(error instanceof Error) || !('code' in error) || error.code !== 'EXDEV') {
      throw error;
    }

    copyDirectoryVerified(sourcePath, destinationPath);
    try {
      fs.rmSync(sourcePath, { recursive: true });
    } catch (removeError: unknown) {
      fs.rmSync(destinationPath, { recursive: true, force: true });
      throw removeError;
    }
  }
}

function assertQuarantineLocation(
  quarantinePath: string,
  canonicalRoot: string,
  legacyRoot: string,
): string {
  const resolvedQuarantine = path.resolve(quarantinePath);
  if (
    isWithinPath(canonicalRoot, resolvedQuarantine)
    || isWithinPath(legacyRoot, resolvedQuarantine)
  ) {
    throw new Error('Quarantine must be outside both spec roots');
  }
  return resolvedQuarantine;
}

// ───────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Moves legacy-only packets to the canonical root after preserving verified originals. */
export function migrateLegacyOnlyToCanonical(
  workspacePath: string,
  opts: MigrationOptions,
): MigrationResult {
  const workspace = assertWorkspaceDirectory(workspacePath);
  const canonicalRoot = path.join(workspace, '.opencode', 'specs');
  const legacyRoot = path.join(workspace, 'specs');
  const quarantineRoot = assertQuarantineLocation(
    opts.quarantinePath,
    canonicalRoot,
    legacyRoot,
  );
  const hasCanonicalRoot = inspectPhysicalRoot(canonicalRoot, workspace);
  const hasLegacyRoot = inspectPhysicalRoot(legacyRoot, workspace);
  const physicalRoots: PhysicalRoot[] = [
    { rootPath: canonicalRoot, kind: 'canonical' },
    { rootPath: legacyRoot, kind: 'legacy' },
  ];

  const packetIds = [
    ...new Set([
      ...(hasCanonicalRoot ? collectPacketIds(canonicalRoot) : []),
      ...(hasLegacyRoot ? collectPacketIds(legacyRoot) : []),
    ]),
  ].sort();
  const result: MigrationResult = {
    moved: [],
    quarantined: [],
    deferredDivergent: [],
  };

  for (const packetId of packetIds) {
    const classification = classifySpecRootCollision(packetId, physicalRoots);
    if (classification.klass === 'divergent-duplicate') {
      result.deferredDivergent.push(packetId);
      continue;
    }
    if (classification.klass !== 'legacy-only') continue;

    const relativePacketPath = fromPacketId(packetId);
    const legacyPacketPath = path.join(legacyRoot, relativePacketPath);
    const canonicalPacketPath = path.join(canonicalRoot, relativePacketPath);
    const quarantinePacketPath = path.join(quarantineRoot, relativePacketPath);

    copyDirectoryVerified(legacyPacketPath, quarantinePacketPath);
    result.quarantined.push(packetId);
    moveDirectoryVerified(legacyPacketPath, canonicalPacketPath);
    result.moved.push(packetId);
  }

  return result;
}

/** Restores quarantined packets to the legacy root and removes their migrated copies. */
export function restoreFromQuarantine(
  quarantinePath: string,
  workspacePath: string,
): void {
  const workspace = assertWorkspaceDirectory(workspacePath);
  const canonicalRoot = path.join(workspace, '.opencode', 'specs');
  const legacyRoot = path.join(workspace, 'specs');
  const quarantineRoot = assertQuarantineLocation(
    quarantinePath,
    canonicalRoot,
    legacyRoot,
  );

  if (!pathExists(quarantineRoot) || !fs.statSync(quarantineRoot).isDirectory()) {
    throw new Error(`Quarantine is not a directory: ${quarantineRoot}`);
  }

  for (const packetId of collectPacketIds(quarantineRoot)) {
    const relativePacketPath = fromPacketId(packetId);
    const quarantinePacketPath = path.join(quarantineRoot, relativePacketPath);
    const legacyPacketPath = path.join(legacyRoot, relativePacketPath);
    const canonicalPacketPath = path.join(canonicalRoot, relativePacketPath);

    copyDirectoryVerified(quarantinePacketPath, legacyPacketPath);
    if (!directoriesMatch(quarantinePacketPath, legacyPacketPath)) {
      throw new Error(`Restored directory did not verify byte-for-byte: ${packetId}`);
    }
    if (pathExists(canonicalPacketPath)) {
      fs.rmSync(canonicalPacketPath, { recursive: true });
    }
  }
}
