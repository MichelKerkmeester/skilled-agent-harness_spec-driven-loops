// ───────────────────────────────────────────────────────────────────
// MODULE: Sub-Track Fixture Smoke Test
// ───────────────────────────────────────────────────────────────────
// The sub-track suites all build on one fixture, so a fixture that lost
// an entry would let every one of them pass for the wrong reason.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error -- plain ESM fixture helper without type declarations
import { buildSubtrackTree } from './fixtures/subtrack-tree.mjs';

let root: string;

beforeEach(() => {
  root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'subtrack-fixture-')));
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

describe('buildSubtrackTree', () => {
  it('creates the six entries the sub-track suites rely on', () => {
    const { specs, entries } = buildSubtrackTree(root);
    const rel = (p: string) => path.relative(specs, p);
    expect(rel(entries.flat)).toBe('demo/001-flat-probe');
    expect(rel(entries.sub)).toBe('demo/sub');
    expect(rel(entries.phase)).toBe('demo/sub/001-nested-probe/001-phase-one');
    expect(rel(entries.archive)).toBe('demo/sub/z_archive');
    expect(fs.existsSync(path.join(entries.loose, 'description.json'))).toBe(false);
    expect(fs.lstatSync(entries.linked).isSymbolicLink()).toBe(true);
    expect(JSON.parse(fs.readFileSync(path.join(entries.sub, 'description.json'), 'utf8')).level).toBe('sub-track');
  });

  it('leaves every children_ids list empty when declared is false', () => {
    const { entries, specs } = buildSubtrackTree(root, { declared: false });
    const children = (dir: string) => JSON.parse(fs.readFileSync(path.join(dir, 'graph-metadata.json'), 'utf8')).children_ids;
    expect(children(path.join(specs, 'demo'))).toEqual([]);
    expect(children(entries.sub)).toEqual([]);
  });
});
