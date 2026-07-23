#!/usr/bin/env node
'use strict';

// Durable guard: no runtime code may require or import from `.opencode/specs`.
//
// The compiled-routing runtime once read its resolver, engine, and bundles from
// the mutable spec tree, so a single spec renumber could sever routing fleet-wide.
// That closure was promoted to a stable runtime path. This check keeps it there:
// it fails if any scanned runtime file requires/imports a target that resolves
// under `.opencode/specs`, or embeds the compiled-routing spec-tree path in a
// require/import-adjacent literal, so the coupling cannot silently return.
//
// The single sanctioned exception is the build bridge that copies the authored
// source out of the spec tree into the runtime location; it references spec
// paths as data (fs copy), never as a module import.
//
// Usage:
//   check-no-spec-imports.cjs            scan the default runtime dirs
//   check-no-spec-imports.cjs <dir...>   scan explicit dirs (used by fixtures)
// Exit 0 = clean, 1 = at least one violation (each named on stderr).

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SPECS_ROOT = path.join(REPO_ROOT, '.opencode', 'specs');

// Runtime directories that must never import from the spec tree.
const DEFAULT_ROOTS = [path.join(REPO_ROOT, '.opencode', 'bin')];

// The promoted closure is generated (byte copies of the authored source) and is
// intentionally the runtime's own copy, not a spec import; skip it.
const EXCLUDED_DIRS = new Set(['node_modules', 'dist', 'compiled-routing', 'fixtures']);

// The build bridge legitimately reads the authored source from the spec tree to
// copy it into the runtime location, and this guard itself names the spec path
// as a detection pattern. Both reference spec paths as data, never as imports.
// The compiled-routing foundation vitest deliberately requires the spec-tree
// resolver twin to assert byte-identity with the promoted runtime copy; that
// coupling is test-only (never on the serving path) and self-policing (the
// require fails loudly if the twin path moves), so the durable guard excludes it.
const ALLOWLIST_BASENAMES = new Set([
  'compiled-route-sync.cjs',
  'check-no-spec-imports.cjs',
  'compiled-routing-foundation.vitest.ts',
]);

const SCANNABLE = new Set(['.cjs', '.mjs', '.js', '.ts', '.tsx']);

// The compiled-routing spec tree, matched even when a path is split across
// segments (the exact shape of the coupling this guard removed).
const COMPILED_ROUTING_SPEC_FRAGMENT = 'specs/sk-doc/019-skill-routing-refactor';

const IMPORT_PATTERNS = [
  /\brequire\(\s*['"]([^'"]+)['"]\s*\)/g,
  /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  /\bimport\b[^'"]*?\bfrom\s*['"]([^'"]+)['"]/g,
  /\bexport\b[^'"]*?\bfrom\s*['"]([^'"]+)['"]/g,
];

function walk(dir, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), out);
    } else if (entry.isFile() && SCANNABLE.has(path.extname(entry.name))) {
      out.push(path.join(dir, entry.name));
    }
  }
}

function underSpecs(abs) {
  const rel = path.relative(SPECS_ROOT, abs);
  return rel === '' || (Boolean(rel) && !rel.startsWith('..') && !path.isAbsolute(rel));
}

function targetResolvesUnderSpecs(fileDir, target) {
  if (target.includes('.opencode/specs')) return true;
  if (!target.startsWith('.')) return false; // bare module id, not a path import
  const resolved = path.resolve(fileDir, target);
  return underSpecs(resolved);
}

function scanFile(file) {
  const violations = [];
  if (ALLOWLIST_BASENAMES.has(path.basename(file))) return violations;
  let source;
  try { source = fs.readFileSync(file, 'utf8'); } catch { return violations; }
  const lines = source.split('\n');
  const fileDir = path.dirname(file);

  lines.forEach((line, index) => {
    for (const pattern of IMPORT_PATTERNS) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(line)) !== null) {
        const target = match[1];
        if (targetResolvesUnderSpecs(fileDir, target)) {
          violations.push({ file, line: index + 1, target, reason: 'import/require resolves under .opencode/specs' });
        }
      }
    }
    // Catch a spec-tree path reconstructed from a string literal even when it is
    // fed to a dynamic require via a variable (the original coupling's shape).
    if (line.includes(COMPILED_ROUTING_SPEC_FRAGMENT) || line.includes('.opencode/specs')) {
      if (/\b(require|import)\b/.test(line) || /['"][^'"]*specs\/sk-doc\/019-skill-routing-refactor/.test(line)) {
        violations.push({ file, line: index + 1, target: line.trim().slice(0, 120), reason: 'compiled-routing spec-tree path literal in runtime code' });
      }
    }
  });
  return violations;
}

function main() {
  const argv = process.argv.slice(2);
  const roots = argv.length > 0 ? argv.map((d) => path.resolve(d)) : DEFAULT_ROOTS;
  const files = [];
  for (const root of roots) walk(root, files);

  const violations = [];
  for (const file of files) violations.push(...scanFile(file));

  if (violations.length > 0) {
    process.stderr.write('FAIL: runtime code imports from .opencode/specs:\n');
    for (const v of violations) {
      process.stderr.write(`  ${path.relative(REPO_ROOT, v.file)}:${v.line} -> ${v.target} (${v.reason})\n`);
    }
    process.exit(1);
  }
  process.stdout.write(`ok: no spec-tree imports in ${files.length} runtime file(s) across ${roots.length} dir(s)\n`);
}

if (require.main === module) main();

module.exports = { scanFile, walk, targetResolvesUnderSpecs };
