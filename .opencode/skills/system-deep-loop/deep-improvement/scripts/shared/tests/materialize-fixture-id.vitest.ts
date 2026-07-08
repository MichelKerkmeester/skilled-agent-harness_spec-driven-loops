// ───────────────────────────────────────────────────────────────────
// MODULE: materialize-benchmark-fixtures hardening
//   first-writer fixture-id path traversal
//
// The materializer is the FIRST writer in the wired Lane B plan (loop-host
// runs materialize before run-benchmark). The basename-charset sanitizer was ported
// to run-benchmark.cjs but not the materializer, so a hostile fixture id like
// '../escaped' escaped outputsDir at materialization time. These tests pin the
// ported guard: a hostile id exits non-zero and writes nothing.
// ───────────────────────────────────────────────────────────────────

import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../../');
const SCRIPTS = path.join(WORKSPACE_ROOT, '.opencode/skills/system-deep-loop/deep-improvement/scripts');
const MATERIALIZE = path.join(SCRIPTS, 'shared/materialize-benchmark-fixtures.cjs');
const DEFAULT_PROFILE = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/default.json',
);

let work: string;

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function runMaterialize(profile: string, outDir: string) {
  return spawnSync('node', [MATERIALIZE, '--profile', profile, '--outputs-dir', outDir], {
    encoding: 'utf8',
    cwd: WORKSPACE_ROOT,
  });
}

beforeEach(() => {
  work = fs.mkdtempSync(path.join(os.tmpdir(), 'materialize-fixture-id-'));
});
afterEach(() => {
  fs.rmSync(work, { recursive: true, force: true });
});

describe('F017-P1-01 materializer fixture id path traversal', () => {
  // The fixture FILE name stays safe (so the materializer can read it); only
  // the in-file `id` is hostile, matching the run-benchmark traversal test.
  function profileWithFixtureId(id: string): string {
    const fixtureDir = path.join(work, 'fixtures');
    const profilePath = path.join(work, 'profile.json');
    writeJson(path.join(fixtureDir, 'evil.json'), {
      id,
      title: 'hostile',
      requiredHeadings: [],
      requiredPatterns: [],
      forbiddenPatterns: [],
      content: ['x'],
    });
    writeJson(profilePath, {
      profileId: 'hostile',
      family: 'test',
      targetPath: 'n/a',
      fixtureDir,
      fixtures: ['evil'],
      thresholdDelta: 0,
      benchmark: { requiredAggregateScore: 80, minimumFixtureScore: 70 },
    });
    return profilePath;
  }

  it("rejects a parent-traversal fixture id ('../escaped') and writes nothing outside outputsDir", () => {
    const profile = profileWithFixtureId('../escaped');
    const outDir = path.join(work, 'outputs');
    const r = runMaterialize(profile, outDir);

    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/unsafe fixture id/);
    // Nothing escaped: no escaped.md sibling of outputsDir was created.
    expect(fs.existsSync(path.join(work, 'escaped.md'))).toBe(false);
    // And nothing was written inside outputsDir either (fail before any write).
    const wrote = fs.existsSync(outDir) ? fs.readdirSync(outDir) : [];
    expect(wrote).toEqual([]);
  });

  it("rejects a separator-bearing fixture id ('a/b') and writes nothing", () => {
    const profile = profileWithFixtureId('a/b');
    const outDir = path.join(work, 'outputs');
    const r = runMaterialize(profile, outDir);

    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/unsafe fixture id/);
    // No 'a' directory or 'a/b.md' was created as a sibling of outputsDir.
    expect(fs.existsSync(path.join(work, 'a'))).toBe(false);
    const wrote = fs.existsSync(outDir) ? fs.readdirSync(outDir) : [];
    expect(wrote).toEqual([]);
  });

  it('aborts the whole batch when a later hostile id follows a safe one (no partial write)', () => {
    const fixtureDir = path.join(work, 'fixtures');
    const profilePath = path.join(work, 'profile.json');
    writeJson(path.join(fixtureDir, 'safe.json'), {
      id: 'safe',
      title: 'safe',
      content: ['ok'],
    });
    writeJson(path.join(fixtureDir, 'evil.json'), {
      id: '../escaped',
      title: 'hostile',
      content: ['x'],
    });
    writeJson(profilePath, {
      profileId: 'mixed',
      family: 'test',
      targetPath: 'n/a',
      fixtureDir,
      fixtures: ['safe', 'evil'],
      thresholdDelta: 0,
    });
    const outDir = path.join(work, 'outputs');
    const r = runMaterialize(profilePath, outDir);

    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/unsafe fixture id/);
    // The safe fixture must NOT have been written before the hostile one aborted.
    const wrote = fs.existsSync(outDir) ? fs.readdirSync(outDir) : [];
    expect(wrote).toEqual([]);
    expect(fs.existsSync(path.join(work, 'escaped.md'))).toBe(false);
  });

  it('still materializes a well-formed profile (no regression)', () => {
    const fx = path.join(work, 'fx');
    const r = runMaterialize(DEFAULT_PROFILE, fx);
    expect(r.status).toBe(0);
    const out = JSON.parse(r.stdout);
    expect(out.status).toBe('fixtures-materialized');
    const wrote = fs.readdirSync(fx).filter((f) => f.endsWith('.md'));
    expect(wrote.length).toBeGreaterThan(0);
  });
});
