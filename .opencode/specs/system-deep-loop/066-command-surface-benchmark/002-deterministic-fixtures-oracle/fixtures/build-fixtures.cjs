#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Deterministic Command Fixture Builder                         ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Materialize command trees from one clean base and named edits.  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PHASE_ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(__dirname, 'mutation-manifest.json');
const CORPUS_ROOT = path.join(__dirname, 'corpus');

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function resolveInsidePhase(relativePath) {
  const resolved = path.resolve(PHASE_ROOT, relativePath);
  const relative = path.relative(PHASE_ROOT, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Path escapes fixture package: ${relativePath}`);
  }
  return resolved;
}

function applyMutation(fixtureRoot, mutation) {
  const target = path.resolve(fixtureRoot, mutation.target);
  const relative = path.relative(fixtureRoot, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Mutation target escapes fixture tree: ${mutation.target}`);
  }

  if (mutation.operation === 'removeFile') {
    if (!fs.existsSync(target)) {
      throw new Error(`Cannot remove missing fixture file: ${mutation.target}`);
    }
    fs.rmSync(target);
    return;
  }

  if (mutation.operation === 'addFile') {
    if (fs.existsSync(target)) {
      throw new Error(`Cannot add existing fixture file: ${mutation.target}`);
    }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, mutation.content, 'utf8');
    return;
  }

  if (!fs.existsSync(target)) {
    throw new Error(`Mutation target does not exist: ${mutation.target}`);
  }

  if (mutation.operation === 'appendText') {
    fs.appendFileSync(target, mutation.text, 'utf8');
    return;
  }

  if (mutation.operation === 'replaceText') {
    const source = fs.readFileSync(target, 'utf8');
    const matches = source.split(mutation.from).length - 1;
    if (matches !== 1) {
      throw new Error(
        `Expected one replacement match in ${mutation.target}; found ${matches}`,
      );
    }
    fs.writeFileSync(target, source.replace(mutation.from, mutation.to), 'utf8');
    return;
  }

  throw new Error(`Unsupported mutation operation: ${mutation.operation}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const baseRoot = resolveInsidePhase(manifest.cleanBase.source);

  if (!fs.existsSync(baseRoot)) {
    throw new Error(`Clean fixture base is missing: ${manifest.cleanBase.source}`);
  }

  fs.rmSync(CORPUS_ROOT, { recursive: true, force: true });

  for (const fixture of manifest.fixtures) {
    const outputRoot = resolveInsidePhase(fixture.output);
    fs.mkdirSync(path.dirname(outputRoot), { recursive: true });
    fs.cpSync(baseRoot, outputRoot, { recursive: true, preserveTimestamps: false });
    for (const mutation of fixture.mutations) {
      applyMutation(outputRoot, mutation);
    }
  }

  const publicCount = manifest.fixtures.filter(
    (fixture) => fixture.classification === 'public' && fixture.kind === 'defect',
  ).length;
  const heldOutCount = manifest.fixtures.filter(
    (fixture) => fixture.classification === 'held-out',
  ).length;
  console.log(
    `[fixture-builder] Materialized ${manifest.fixtures.length} trees ` +
      `(${publicCount} public defects, ${heldOutCount} held-out, 1 clean).`,
  );
}

main();
