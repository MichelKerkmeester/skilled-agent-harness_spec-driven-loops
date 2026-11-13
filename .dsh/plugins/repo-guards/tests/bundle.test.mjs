// ───────────────────────────────────────────────────────────────────
// MODULE: Repo Guards Tests - Bundle (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Covers what lives in the bundle itself: the guards and lineage patches, the
// lineage-leaf plugin, the advisor row flag in apply, and the adapter links.

import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { isLineageLeaf } from '../adapters/session-role.mjs';
import { apply } from '../index.mjs';
import { apply as applyLineageLeaf, name as lineageLeafName } from '../lineage-leaf.mjs';

const LEAF_MARKER = Symbol.for('skilled.repo-guards.lineage-leaf');

function readPatch(fileName) {
  return readFileSync(fileURLToPath(new URL(`../../../patches/${fileName}`, import.meta.url)), 'utf8');
}

test('the guards patch turns the advisor on and only the lineage patch marks a fan-out leaf', () => {
  assert.match(readPatch('guards.patch.yml'), /promptAdvisor:\s*true/);
  const lineage = readPatch('lineage.patch.yml');
  assert.match(lineage, /id:\s*repo-guards-lineage-leaf/);
  assert.match(lineage, /name:\s*\.\.\/plugins\/repo-guards\/lineage-leaf\.mjs/);
  assert.doesNotMatch(readPatch('guards.patch.yml'), /lineage-leaf/);
});

test('the lineage patch also turns off the native goal tools a leaf cannot use', () => {
  const lineage = readPatch('lineage.patch.yml');
  assert.match(lineage, /- id:\s*tool-goal\s*\n\s*disabled:\s*true/);
  assert.match(lineage, /- id:\s*goal-round-driver\s*\n\s*disabled:\s*true/);
  assert.match(lineage, /- id:\s*command-goal\s*\n\s*disabled:\s*true/);
});

test('the lineage leaf plugin marks the process as a fan-out leaf', () => {
  const previous = globalThis[LEAF_MARKER];
  try {
    globalThis[LEAF_MARKER] = undefined;
    assert.equal(isLineageLeaf(), false);
    assert.equal(lineageLeafName, 'repo-guards-lineage-leaf');
    applyLineageLeaf();
    assert.equal(isLineageLeaf(), true);
  } finally {
    globalThis[LEAF_MARKER] = previous;
  }
});

test('prompt advisor stays on unless its row flag is false', () => {
  const preStepCount = (config) => {
    const registrations = [];
    const ctx = {
      on(name) { registrations.push(name); },
      logger: { warn() {}, error() {} },
    };
    apply(ctx, config);
    return registrations.filter((name) => name === 'agent/pre-step').length;
  };
  assert.equal(preStepCount({ adapters: { promptAdvisor: true } }), preStepCount());
  assert.equal(preStepCount({ adapters: { promptAdvisor: false } }), preStepCount() - 1);
});

test('every adapter loads the harness message helpers through the anchored loader', () => {
  const adapterDir = fileURLToPath(new URL('../adapters/', import.meta.url));
  const bare = readdirSync(adapterDir)
    .filter((file) => file.endsWith('.mjs') && file !== 'dsh-llm.mjs')
    .filter((file) => readFileSync(path.join(adapterDir, file), 'utf8').includes("import('@deepseek-ai/dsh-llm')"));
  assert.deepEqual(bare, []);
});
