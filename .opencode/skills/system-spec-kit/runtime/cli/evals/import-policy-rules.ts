// ───────────────────────────────────────────────────────────────────
// MODULE: Import Policy Rules
// ───────────────────────────────────────────────────────────────────
// Shared detection rules for prohibited cli -> internal runtime imports.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import * as path from 'path';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const PROHIBITED_PACKAGE_IMPORTS = [
  '@spec-kit/runtime/lib',
  '@spec-kit/runtime/core',
  '@spec-kit/runtime/handlers',
];

// cli/ now nests inside runtime/, so a bare escape (no explicit "runtime/"
// segment) reads differently by how many levels it climbs: one level up from
// any cli/<subdir>/file.ts still lands inside cli/'s own lib or core, but a
// second level escapes cli/ entirely into runtime/'s lib or core. handlers/
// and shared/ have no same-named directory inside cli/, so any climb that
// reaches either is unambiguous at one level. An explicit "runtime/" segment
// is still prohibited at any depth, since spelling it out only serves to
// re-enter runtime/ (or its dist symlink) directly.
const RELATIVE_INTERNAL_RUNTIME_IMPORT_RE =
  /^\.\.(?:\/\.\.)*\/runtime\/(?:lib|core|handlers)(?:$|\/)|^\.\.(?:\/\.\.)*\/(?:handlers|shared)(?:$|\/)|^\.\.\/\.\.(?:\/\.\.)*\/(?:lib|core)(?:$|\/)/;

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function normalizeRelativeImportPath(importPath: string): string {
  if (!importPath.startsWith('.')) {
    return importPath;
  }

  // Normalize Windows backslashes before POSIX normalization
  const normalizedPath = path.posix.normalize(importPath.replace(/\\/g, '/'));

  if (normalizedPath === '.') {
    return './';
  }

  if (normalizedPath === '..' || normalizedPath.startsWith('../')) {
    return normalizedPath;
  }

  return normalizedPath.startsWith('./') ? normalizedPath : `./${normalizedPath}`;
}

/**
 * Normalize package-scoped import paths that contain `..` traversal segments.
 * E.g., `@spec-kit/runtime/api/../lib/foo` → `@spec-kit/runtime/lib/foo`
 */
function normalizePackageImportPath(importPath: string): string {
  if (importPath.startsWith('.') || !importPath.includes('..')) {
    return importPath;
  }
  // Split into segments and collapse '..' traversals
  const segments = importPath.split('/');
  const resolved: string[] = [];
  for (const segment of segments) {
    if (segment === '..' && resolved.length > 0) {
      resolved.pop();
    } else {
      resolved.push(segment);
    }
  }
  return resolved.join('/');
}

// ───────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ───────────────────────────────────────────────────────────────────

/** Returns whether the import path violates the evaluation policy rules. */
export function isProhibitedImportPath(importPath: string): boolean {
  const normalizedImportPath = normalizeRelativeImportPath(importPath);
  const normalizedPackagePath = normalizePackageImportPath(normalizedImportPath);

  return PROHIBITED_PACKAGE_IMPORTS.some((baseImport) => (
    normalizedPackagePath === baseImport || normalizedPackagePath.startsWith(`${baseImport}/`)
  )) || RELATIVE_INTERNAL_RUNTIME_IMPORT_RE.test(normalizedPackagePath);
}
