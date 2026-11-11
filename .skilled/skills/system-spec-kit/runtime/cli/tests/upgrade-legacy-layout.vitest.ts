// ───────────────────────────────────────────────────────────────────
// MODULE: Upgrade Legacy Spec Folders — layout planning
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { planLayoutMove } from '../spec/upgrade-legacy.mjs';

import { sandbox, copy, runUpgrade, makeLayoutRoot, runLayoutSteps, initLayoutRepo, fileContentDigests, treeFingerprint, setupSandbox, teardownSandbox } from './helpers/upgrade-legacy-harness';

beforeAll(setupSandbox, 180_000);
afterAll(teardownSandbox);

// ───────────────────────────────────────────────────────────────────
// planLayoutMove
// ───────────────────────────────────────────────────────────────────

// Each case builds its own root instead of reusing the shared sandbox: the map
// and the steps it prints act on whichever repository holds them, and the
// sandbox above already carries the state its own sweep tests left behind.

describe('planLayoutMove', () => {
  it('reports none without roots and v4 with a current root', () => {
    const empty = makeLayoutRoot();
    try {
      expect(planLayoutMove(empty)).toEqual({
        state: 'none', moves: [], alreadyMoved: [], collisions: [], steps: [],
      });
    } finally {
      fs.rmSync(empty, { recursive: true, force: true });
    }

    const current = makeLayoutRoot();
    try {
      fs.mkdirSync(path.join(current, 'specs/track/001-packet'), { recursive: true });
      fs.writeFileSync(path.join(current, 'specs/track/001-packet/spec.md'), '---\ntitle: "Packet"\n---\n');
      expect(planLayoutMove(current)).toEqual({
        state: 'v4', moves: [], alreadyMoved: [], collisions: [], steps: [],
      });

      fs.mkdirSync(path.join(current, '.opencode'));
      fs.symlinkSync('../specs', path.join(current, '.opencode/specs'));
      expect(planLayoutMove(current)).toEqual({
        state: 'v4', moves: [], alreadyMoved: [], collisions: [], steps: [],
      });
    } finally {
      fs.rmSync(current, { recursive: true, force: true });
    }
  }, 60_000);

  it('plans the v3 move with and without the specs symlink, and the steps leave v4', () => {
    const plain = makeLayoutRoot();
    try {
      fs.mkdirSync(path.join(plain, '.opencode/specs/track/001-packet'), { recursive: true });
      fs.writeFileSync(path.join(plain, '.opencode/specs/track/001-packet/spec.md'), '---\ntitle: "Packet"\n---\n');
      initLayoutRepo(plain);
      const plan = planLayoutMove(plain);
      expect(plan.state).toBe('v3');
      expect(plan.moves).toEqual([{ from: '.opencode/specs', to: 'specs' }]);
      expect(plan.alreadyMoved).toEqual([]);
      expect(plan.collisions).toEqual([]);
      expect(plan.steps).toEqual([
        { id: 'move-tree', argv: ['git', 'mv', '.opencode/specs', 'specs'] },
        { id: 'link-legacy-path', argv: ['ln', '-s', '../specs', '.opencode/specs'] },
      ]);
      runLayoutSteps(plain, plan.steps);
      expect(planLayoutMove(plain).state).toBe('v4');
      expect(fs.readlinkSync(path.join(plain, '.opencode/specs'))).toBe('../specs');
    } finally {
      fs.rmSync(plain, { recursive: true, force: true });
    }

    const linked = makeLayoutRoot();
    try {
      fs.mkdirSync(path.join(linked, '.opencode/specs/track/001-packet'), { recursive: true });
      fs.writeFileSync(path.join(linked, '.opencode/specs/track/001-packet/spec.md'), '---\ntitle: "Packet"\n---\n');
      fs.symlinkSync('.opencode/specs', path.join(linked, 'specs'));
      initLayoutRepo(linked);
      const plan = planLayoutMove(linked);
      expect(plan.state).toBe('v3');
      expect(plan.steps).toEqual([
        { id: 'remove-specs-link', argv: ['rm', '-f', 'specs'] },
        { id: 'move-tree', argv: ['git', 'mv', '.opencode/specs', 'specs'] },
        { id: 'link-legacy-path', argv: ['ln', '-s', '../specs', '.opencode/specs'] },
      ]);
      runLayoutSteps(linked, plan.steps);
      expect(planLayoutMove(linked).state).toBe('v4');
      expect(fs.readlinkSync(path.join(linked, '.opencode/specs'))).toBe('../specs');
    } finally {
      fs.rmSync(linked, { recursive: true, force: true });
    }
  }, 120_000);

  it('moves a partial tree without collisions, keeps every file digest and skips finder metadata', () => {
    const root = makeLayoutRoot();
    try {
      fs.mkdirSync(path.join(root, '.opencode/specs/legacy-track/001-old'), { recursive: true });
      fs.mkdirSync(path.join(root, 'specs/current-track/002-new'), { recursive: true });
      fs.writeFileSync(path.join(root, '.opencode/specs/legacy-track/001-old/spec.md'), 'legacy spec\n');
      fs.writeFileSync(path.join(root, '.opencode/specs/legacy-track/001-old/plan.md'), 'legacy plan\n');
      fs.writeFileSync(path.join(root, 'specs/current-track/002-new/spec.md'), 'current spec\n');
      fs.writeFileSync(path.join(root, '.opencode/specs/.DS_Store'), 'legacy root metadata\n');
      fs.writeFileSync(path.join(root, '.opencode/specs/legacy-track/.DS_Store'), 'legacy track metadata\n');
      fs.writeFileSync(path.join(root, 'specs/.DS_Store'), 'current root metadata\n');
      fs.writeFileSync(path.join(root, 'specs/current-track/.DS_Store'), 'current track metadata\n');
      expect(fs.existsSync(path.join(root, '.opencode/specs/.DS_Store'))).toBe(true);
      expect(fs.existsSync(path.join(root, 'specs/.DS_Store'))).toBe(true);

      const before = [...fileContentDigests(root, '.opencode/specs'), ...fileContentDigests(root, 'specs')].sort();
      const plan = planLayoutMove(root);
      expect(plan.state).toBe('partial');
      expect(plan.moves).toEqual([{ from: '.opencode/specs/legacy-track', to: 'specs/legacy-track' }]);
      expect(plan.alreadyMoved).toEqual(['specs/current-track']);
      expect(plan.collisions).toEqual([]);
      expect(plan.steps.map((step) => step.id)).toEqual([
        'move-1', 'remove-finder-metadata', 'remove-empty-legacy-dirs', 'remove-legacy-root', 'link-legacy-path',
      ]);

      runLayoutSteps(root, plan.steps);
      expect(planLayoutMove(root).state).toBe('v4');
      expect(fs.readlinkSync(path.join(root, '.opencode/specs'))).toBe('../specs');
      expect(fileContentDigests(root, 'specs')).toEqual(before);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }, 60_000);

  it('lists one collision per reason with from and to, and plans no steps', () => {
    const root = makeLayoutRoot();
    try {
      // The same packet name sits at track depth and at packet depth, so the
      // walk has to recurse to find what collides at each level.
      fs.mkdirSync(path.join(root, '.opencode/specs/Other-Track'), { recursive: true });
      fs.mkdirSync(path.join(root, 'specs/other-track'), { recursive: true });
      fs.mkdirSync(path.join(root, '.opencode/specs/case-track/Demo-Packet'), { recursive: true });
      fs.mkdirSync(path.join(root, 'specs/case-track/demo-packet'), { recursive: true });
      fs.mkdirSync(path.join(root, '.opencode/specs/mix-track/001-packet/001-child'), { recursive: true });
      fs.mkdirSync(path.join(root, 'specs/mix-track/001-packet/001-child'), { recursive: true });
      fs.writeFileSync(path.join(root, '.opencode/specs/mix-track/001-packet/spec.md'), 'legacy spec\n');
      fs.writeFileSync(path.join(root, 'specs/mix-track/001-packet/spec.md'), 'current spec\n');
      fs.writeFileSync(path.join(root, '.opencode/specs/mix-track/001-packet/001-child/spec.md'), 'legacy child\n');
      fs.writeFileSync(path.join(root, 'specs/mix-track/001-packet/001-child/spec.md'), 'current child\n');
      fs.writeFileSync(path.join(root, '.opencode/specs/mix-track/001-packet/plan.md'), 'legacy plan\n');
      fs.mkdirSync(path.join(root, 'specs/mix-track/001-packet/plan.md'));
      fs.writeFileSync(path.join(root, '.opencode/specs/mix-track/001-packet/notes.md'), 'legacy notes\n');
      fs.writeFileSync(path.join(root, 'specs/mix-track/001-packet/README.md'), 'current readme\n');

      const plan = planLayoutMove(root);
      expect(plan.state).toBe('partial');
      expect(plan.moves).toEqual([
        { from: '.opencode/specs/mix-track/001-packet/notes.md', to: 'specs/mix-track/001-packet/notes.md' },
      ]);
      expect(plan.alreadyMoved).toEqual(['specs/mix-track/001-packet/README.md']);
      expect(plan.collisions).toEqual([
        { from: '.opencode/specs/Other-Track', to: 'specs/other-track', reason: 'case-only-difference' },
        { from: '.opencode/specs/case-track/Demo-Packet', to: 'specs/case-track/demo-packet', reason: 'case-only-difference' },
        { from: '.opencode/specs/mix-track/001-packet/001-child/spec.md', to: 'specs/mix-track/001-packet/001-child/spec.md', reason: 'exists-in-both' },
        { from: '.opencode/specs/mix-track/001-packet/plan.md', to: 'specs/mix-track/001-packet/plan.md', reason: 'type-mismatch' },
        { from: '.opencode/specs/mix-track/001-packet/spec.md', to: 'specs/mix-track/001-packet/spec.md', reason: 'exists-in-both' },
      ]);
      expect(plan.steps).toEqual([]);
      for (const collision of plan.collisions) {
        expect(collision.from, JSON.stringify(collision)).toBeTruthy();
        expect(collision.to, JSON.stringify(collision)).toBeTruthy();
      }
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }

    const elsewhere = makeLayoutRoot();
    try {
      fs.mkdirSync(path.join(elsewhere, 'specs/track'), { recursive: true });
      fs.mkdirSync(path.join(elsewhere, 'elsewhere'));
      fs.mkdirSync(path.join(elsewhere, '.opencode'));
      fs.symlinkSync('../elsewhere', path.join(elsewhere, '.opencode/specs'));
      expect(planLayoutMove(elsewhere)).toEqual({
        state: 'partial',
        moves: [],
        alreadyMoved: [],
        collisions: [{ from: '.opencode/specs', to: 'specs', reason: 'unexpected-symlink' }],
        steps: [],
      });
    } finally {
      fs.rmSync(elsewhere, { recursive: true, force: true });
    }

    const notADirectory = makeLayoutRoot();
    try {
      fs.mkdirSync(path.join(notADirectory, '.opencode/specs/track'), { recursive: true });
      fs.writeFileSync(path.join(notADirectory, 'specs'), 'not a directory\n');
      expect(planLayoutMove(notADirectory)).toEqual({
        state: 'partial',
        moves: [],
        alreadyMoved: [],
        collisions: [{ from: '.opencode/specs', to: 'specs', reason: 'type-mismatch' }],
        steps: [],
      });
    } finally {
      fs.rmSync(notADirectory, { recursive: true, force: true });
    }
  }, 60_000);

  it('writes nothing while it plans', () => {
    const root = makeLayoutRoot();
    try {
      fs.mkdirSync(path.join(root, '.opencode/specs/track/001-packet'), { recursive: true });
      fs.mkdirSync(path.join(root, 'specs/track/002-packet'), { recursive: true });
      fs.writeFileSync(path.join(root, '.opencode/specs/track/001-packet/spec.md'), 'legacy spec\n');
      fs.writeFileSync(path.join(root, 'specs/track/002-packet/spec.md'), 'current spec\n');
      const before = treeFingerprint(root);
      planLayoutMove(root);
      expect(treeFingerprint(root)).toBe(before);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }, 60_000);

  it('serves --layout-map over the CLI and stays quiet when imported', () => {
    const mapped = runUpgrade(['--layout-map']);
    expect([0, 1]).toContain(mapped.status);
    const layout = JSON.parse(mapped.stdout);
    expect(['v3', 'partial', 'v4', 'none']).toContain(layout.state);
    expect(Array.isArray(layout.steps)).toBe(true);

    const rejected = runUpgrade(['--layout-map', '--apply']);
    expect(rejected.status, rejected.stdout + rejected.stderr).toBe(2);

    const link = path.join(sandbox, 'layout-map-link.mjs');
    fs.symlinkSync(path.join(copy, 'runtime/cli/spec/upgrade-legacy.mjs'), link);
    try {
      const throughLink = spawnSync(process.execPath, [link, '--layout-map'], { cwd: sandbox, encoding: 'utf8' });
      expect([0, 1]).toContain(throughLink.status);
      const linkedLayout = JSON.parse(throughLink.stdout);
      expect(['v3', 'partial', 'v4', 'none']).toContain(linkedLayout.state);
    } finally {
      fs.rmSync(link, { force: true });
    }

    const script = path.join(copy, 'runtime/cli/spec/upgrade-legacy.mjs');
    const probe = `import(${JSON.stringify(script)}).then((module) => console.log(typeof module.planLayoutMove))`;
    const imported = spawnSync(process.execPath, ['--input-type=module', '-e', probe], { cwd: sandbox, encoding: 'utf8' });
    expect(imported.status, imported.stdout + imported.stderr).toBe(0);
    expect(imported.stdout.trim()).toBe('function');
  }, 180_000);
});

describe('upgrade-legacy layout links', () => {
  it('plans no step through a .opencode link that leaves the repository', () => {
    const root = makeLayoutRoot();
    const outside = makeLayoutRoot();
    try {
      fs.mkdirSync(path.join(outside, 'opencode/specs/system/001-packet'), { recursive: true });
      fs.writeFileSync(path.join(outside, 'opencode/specs/system/001-packet/spec.md'), '# Outside packet\n');
      fs.writeFileSync(path.join(outside, 'opencode/specs/.DS_Store'), 'finder\n');
      fs.mkdirSync(path.join(root, 'specs/current/001-packet'), { recursive: true });
      fs.writeFileSync(path.join(root, 'specs/current/001-packet/spec.md'), '# Current packet\n');
      fs.symlinkSync(path.join(outside, 'opencode'), path.join(root, '.opencode'));
      const before = treeFingerprint(outside);

      const planned = planLayoutMove(root);
      for (const step of planned.steps) {
        spawnSync(step.argv[0], step.argv.slice(1), { cwd: root, encoding: 'utf8' });
      }

      expect(treeFingerprint(outside)).toBe(before);
      expect(planned.steps).toEqual([]);
      expect(planned.collisions).toEqual([{ from: '.opencode/specs', to: 'specs', reason: 'unexpected-symlink' }]);
    } finally {
      fs.rmSync(path.join(root, '.opencode'), { force: true });
      fs.rmSync(root, { recursive: true, force: true });
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });
});
