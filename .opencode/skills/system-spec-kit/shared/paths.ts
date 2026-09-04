// ---------------------------------------------------------------
// MODULE: Paths
// ---------------------------------------------------------------

import fs from 'fs';
import os from 'os';
import path from 'path';

import { getDbDir } from './config.js';
import { getStartupEmbeddingProfile } from './embeddings/factory.js';

function findUp(startDir: string, predicate: (dir: string) => boolean): string | undefined {
  let dir = startDir;
  while (true) {
    if (predicate(dir)) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
}

function hasPackageJson(dir: string): boolean {
  return fs.existsSync(path.join(dir, 'package.json'));
}

function hasWorkspaceDirectories(dir: string): boolean {
  return (
    fs.existsSync(path.join(dir, 'mcp-server')) &&
    fs.existsSync(path.join(dir, 'shared'))
  );
}

function findNearestSpecKitWorkspaceRoot(startDir: string): string | undefined {
  // Walk up to find the workspace root (package.json with "workspaces" field),
  // NOT individual @spec-kit/* packages. This ensures path validation uses the
  // monorepo root as the boundary, not a child package like shared/.
  return findUp(startDir, (dir) => {
    const packageJsonPath = path.join(dir, 'package.json');
    if (!fs.existsSync(packageJsonPath)) return false;
    try {
      const parsed = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as { workspaces?: unknown };
      return Array.isArray(parsed.workspaces);
    } catch { return false; }
  });
}

function isWithinDirectoryTree(candidatePath: string, rootPath: string): boolean {
  const relativePath = path.relative(rootPath, candidatePath);
  return relativePath === '' || (!relativePath.startsWith('..') && !path.isAbsolute(relativePath));
}

function resolveImportMetaRelativePackageRoot(): string {
  return path.resolve(import.meta.dirname, '..');
}

function resolveComparablePath(targetPath: string): string {
  const resolvedPath = path.resolve(targetPath);
  return fs.existsSync(resolvedPath) ? fs.realpathSync(resolvedPath) : resolvedPath;
}

function fallbackResolvedPath(label: 'package root' | 'database dir'): string {
  return label === 'package root'
    ? resolveImportMetaRelativePackageRoot()
    : path.join(resolveImportMetaRelativePackageRoot(), 'mcp-server', 'database');
}

function isTestContext(): boolean {
  if (process.env.VITEST === 'true'
    || process.env.NODE_ENV === 'test'
    || process.env.SPECKIT_TEST === 'true') {
    return true;
  }
  // Environment alone is not a reliable signal: a worker spawned without inheriting it would
  // read as production and quietly resolve the live database. The runner's own in-process
  // marker survives that gap, so an env hole cannot silently disable the isolation guard.
  return typeof (globalThis as Record<string, unknown>).__vitest_worker__ !== 'undefined';
}

function isProductionDatabaseDir(resolvedPath: string): boolean {
  const productionDatabaseDir = path.join(resolveImportMetaRelativePackageRoot(), 'mcp-server', 'database');
  return resolveComparablePath(resolvedPath) === resolveComparablePath(productionDatabaseDir);
}

function isTestTemporaryDatabaseDir(resolvedPath: string): boolean {
  return isTestContext()
    && isWithinDirectoryTree(resolveComparablePath(resolvedPath), resolveComparablePath(os.tmpdir()));
}

export class ProductionDatabaseResolutionError extends Error {
  readonly databaseDir: string;

  constructor(databaseDir: string) {
    super(`Refusing to resolve the production database directory in a test context: ${databaseDir}`);
    this.name = 'ProductionDatabaseResolutionError';
    this.databaseDir = databaseDir;
    Object.setPrototypeOf(this, ProductionDatabaseResolutionError.prototype);
  }
}

function assertDatabaseIsolation(resolvedPath: string): string {
  if (isTestContext() && isProductionDatabaseDir(resolvedPath)) {
    throw new ProductionDatabaseResolutionError(resolvedPath);
  }
  return resolvedPath;
}

function validateResolvedPath(label: 'package root' | 'database dir', resolvedPath: string): string {
  const workspaceRoot = findNearestSpecKitWorkspaceRoot(import.meta.dirname);
  if (
    !workspaceRoot
    || isWithinDirectoryTree(resolvedPath, workspaceRoot)
    || (label === 'database dir' && isTestTemporaryDatabaseDir(resolvedPath))
  ) {
    return label === 'database dir' ? assertDatabaseIsolation(resolvedPath) : resolvedPath;
  }

  console.warn(`[shared/paths] ${label} resolved outside @spec-kit workspace root (${workspaceRoot}); falling back to import.meta.dirname-relative resolution`);
  const fallback = fallbackResolvedPath(label);
  return label === 'database dir' ? assertDatabaseIsolation(fallback) : fallback;
}

/** Resolve the system-spec-kit package root from workspace markers or package metadata. */
export function resolvePackageRoot(): string {
  const fromWorkspaceDirs = findUp(import.meta.dirname, hasWorkspaceDirectories);
  if (fromWorkspaceDirs) {
    return validateResolvedPath('package root', fromWorkspaceDirs);
  }

  const fromWorkspaceDirsCwd = findUp(process.cwd(), hasWorkspaceDirectories);
  if (fromWorkspaceDirsCwd) {
    return validateResolvedPath('package root', fromWorkspaceDirsCwd);
  }

  const fromPackageJson = findUp(import.meta.dirname, hasPackageJson);
  if (fromPackageJson) {
    return validateResolvedPath('package root', fromPackageJson);
  }

  const fromCwd = findUp(process.cwd(), hasPackageJson);
  return validateResolvedPath('package root', fromCwd || resolveImportMetaRelativePackageRoot());
}

/**
 * Resolve the database directory the startup embedding profile derives its
 * database path from, honoring configured overrides. The retired spec-kit
 * memory server was this directory's original owner, which is why the override
 * env var is still spelled MEMORY_DB_PATH; the live caller is the skill-advisor
 * launcher, which points that var at its own database.
 */
export function resolveDatabaseDir(): string {
  const configuredDir = getDbDir();
  if (configuredDir) {
    return validateResolvedPath('database dir', path.resolve(process.cwd(), configuredDir));
  }
  return validateResolvedPath('database dir', path.join(resolvePackageRoot(), 'mcp-server', 'database'));
}

function resolveDerivedDbPath(databaseDir = resolveDatabaseDir()): string {
  return getStartupEmbeddingProfile().getDatabasePath(databaseDir);
}

/** Defines database path. */
export const DB_PATH: string = (() => {
  const configuredPath = process.env.MEMORY_DB_PATH?.trim();
  if (configuredPath) {
    const resolvedPath = path.resolve(process.cwd(), configuredPath);
    const validatedDir = validateResolvedPath('database dir', path.dirname(resolvedPath));
    return path.join(validatedDir, path.basename(resolvedPath));
  }

  return resolveDerivedDbPath();
})();
