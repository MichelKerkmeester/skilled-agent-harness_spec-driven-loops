#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Session Reader Declarations
// ───────────────────────────────────────────────────────────────────
// Regenerates or checks the committed `.d.mts` declarations beside the session
// readers. TypeScript callers read the declaration, not the JavaScript, so a
// declaration left behind after a reader change hides the new shape. The
// compiler also refuses to overwrite an existing declaration in place, so a
// plain rebuild never refreshes one; this script deletes them first.
//
// A development tool only: no hook loads it, and it borrows the TypeScript
// compiler and Node types that the spec-kit skill installs.
//
// Usage: node session-reader-declarations.mjs [--check]
// Exit 0 current or rewritten, 1 a declaration is stale (with --check),
// 2 the compiler failed, 3 the compiler or Node types are not installed.

import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const HERE = dirname(fileURLToPath(import.meta.url));
const READERS_DIR = join(HERE, 'session-readers');
const SPEC_KIT_MODULES = join(HERE, '..', '..', 'skills', 'system-spec-kit', 'node_modules');
const TSC = join(SPEC_KIT_MODULES, 'typescript', 'bin', 'tsc');
const TYPE_ROOTS = join(SPEC_KIT_MODULES, '@types');

// The flags the committed declarations were built with. Strict mode keeps
// `string | undefined` where a value can be missing.
const TSC_FLAGS = [
  '--strict', '--allowJs', '--declaration', '--emitDeclarationOnly', '--declarationMap',
  '--module', 'nodenext', '--moduleResolution', 'nodenext', '--target', 'es2022',
  '--skipLibCheck', '--typeRoots', TYPE_ROOTS, '--types', 'node',
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function sources(dir) {
  return readdirSync(dir).filter((name) => name.endsWith('.mjs')).sort();
}

function declarations(dir) {
  return readdirSync(dir).filter((name) => name.endsWith('.d.mts') || name.endsWith('.d.mts.map')).sort();
}

// Relative names keep each source map's `sources` entry the bare file name, so
// a build in a temporary copy matches a build in place.
function emit(dir) {
  const result = spawnSync(process.execPath, [TSC, ...TSC_FLAGS, ...sources(dir)], { cwd: dir, encoding: 'utf8' });
  if (result.status !== 0) {
    process.stderr.write(`${result.stdout}${result.stderr}`);
    console.log('STATUS=ERROR session-reader-declarations: the compiler failed');
    process.exit(2);
  }
}

// Builds in a temporary copy so the compiler never writes declarations for the
// helpers beside this folder into the checkout. A reader may require such a
// helper, like the Cursor reader's `../hook-flags.cjs`, so the copy keeps that
// layout. Returns the temporary root and the folder holding the declarations.
function build() {
  const root = mkdtempSync(join(tmpdir(), 'session-reader-declarations-'));
  const scratch = join(root, 'session-readers');
  mkdirSync(scratch);
  for (const name of readdirSync(HERE).filter((entry) => /\.(c|m)?js$/.test(entry))) {
    copyFileSync(join(HERE, name), join(root, name));
  }
  for (const name of sources(READERS_DIR)) copyFileSync(join(READERS_DIR, name), join(scratch, name));
  emit(scratch);
  return { root, scratch };
}

function check() {
  const { root, scratch } = build();
  try {
    const expected = declarations(scratch);
    const committed = new Set(declarations(READERS_DIR));
    const problems = [];
    for (const name of expected) {
      if (!committed.has(name)) problems.push(`MISSING ${name}`);
      else if (readFileSync(join(scratch, name), 'utf8') !== readFileSync(join(READERS_DIR, name), 'utf8')) problems.push(`STALE ${name}`);
      committed.delete(name);
    }
    for (const name of committed) problems.push(`EXTRA ${name}`);

    for (const line of problems) console.log(line);
    if (problems.length > 0) {
      console.log(`STATUS=STALE session-reader-declarations: ${problems.length} file(s); run node .skilled/hooks/shared/session-reader-declarations.mjs`);
      process.exit(1);
    }
    console.log(`STATUS=OK session-reader-declarations: ${expected.length} file(s) current`);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function write() {
  const { root, scratch } = build();
  try {
    for (const name of declarations(READERS_DIR)) unlinkSync(join(READERS_DIR, name));
    const built = declarations(scratch);
    for (const name of built) copyFileSync(join(scratch, name), join(READERS_DIR, name));
    console.log(`STATUS=OK session-reader-declarations: wrote ${built.length} file(s)`);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAIN
// ─────────────────────────────────────────────────────────────────────────────

if (!existsSync(TSC) || !existsSync(join(TYPE_ROOTS, 'node'))) {
  console.log('STATUS=CANNOT_RUN session-reader-declarations: install the system-spec-kit dependencies first');
  process.exit(3);
}

if (process.argv.includes('--check')) check();
else write();
