// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Route Exclusions Tests
// ───────────────────────────────────────────────────────────────
//
// Proves the operator-adjustable routing-exclusion denylist: an excluded id is
// non-routable at both wired seams (the id predicate the fusion loop consults
// and the path-based filterDefaultRoutable), a non-excluded id is unaffected,
// missing/empty/malformed config is fail-safe (empty set, no throw), and a
// present local override fully replaces the committed list.

import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  getRouteExcludedSkillIds,
  isRouteExcludedSkillId,
  loadRouteExclusionsFromDir,
  resetRouteExclusionsCache,
} from '../lib/routing/route-exclusions.js';
import { filterDefaultRoutable } from '../lib/lifecycle/archive-handling.js';

const COMMITTED_FILE = 'route-exclusions.json';
const LOCAL_FILE = 'route-exclusions.local.json';

function makeTempDir(): string {
  return mkdtempSync(join(tmpdir(), 'route-exclusions-'));
}

describe('route-exclusions loader', () => {
  const tempDirs: string[] = [];

  function scratchDir(): string {
    const dir = makeTempDir();
    tempDirs.push(dir);
    return dir;
  }

  beforeEach(() => {
    // The committed-default assertions must see the real config/ dir, so clear
    // any env override and the module cache before each test.
    delete process.env.SPECKIT_ADVISOR_ROUTE_EXCLUSIONS_DIR;
    resetRouteExclusionsCache();
  });

  afterEach(() => {
    delete process.env.SPECKIT_ADVISOR_ROUTE_EXCLUSIONS_DIR;
    resetRouteExclusionsCache();
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir && existsSync(dir)) rmSync(dir, { recursive: true, force: true });
    }
  });

  it('excludes sk-communication by committed default and leaves other skills routable', () => {
    expect(isRouteExcludedSkillId('sk-communication')).toBe(true);
    expect(getRouteExcludedSkillIds().has('sk-communication')).toBe(true);
    // A representative active skill is untouched by the denylist.
    expect(isRouteExcludedSkillId('sk-code')).toBe(false);
    expect(isRouteExcludedSkillId('sk-design')).toBe(false);
  });

  it('drops an excluded id at the path-based route-policy seam and keeps others', () => {
    const entries = [
      { sourcePath: '.opencode/skills/sk-code/graph-metadata.json', skillId: 'sk-code' },
      { sourcePath: '.opencode/skills/sk-communication/graph-metadata.json', skillId: 'sk-communication' },
      { sourcePath: '.opencode/skills/z_archive/old/graph-metadata.json', skillId: 'old' },
    ];
    // sk-communication is dropped by the exclusion; z_archive is dropped by
    // lifecycle; only the active, non-excluded sk-code survives.
    expect(filterDefaultRoutable(entries).map((entry) => entry.skillId)).toEqual(['sk-code']);
  });

  it('returns an empty set for a directory with no config files (missing is safe)', () => {
    const dir = scratchDir();
    expect(loadRouteExclusionsFromDir(dir).size).toBe(0);
  });

  it('returns an empty set for an empty committed list', () => {
    const dir = scratchDir();
    writeFileSync(join(dir, COMMITTED_FILE), JSON.stringify({ excludedSkillIds: [] }), 'utf8');
    expect(loadRouteExclusionsFromDir(dir).size).toBe(0);
  });

  it('reads the committed list from a directory when no local override exists', () => {
    const dir = scratchDir();
    writeFileSync(join(dir, COMMITTED_FILE), JSON.stringify({ excludedSkillIds: ['sk-communication'] }), 'utf8');
    expect([...loadRouteExclusionsFromDir(dir)]).toEqual(['sk-communication']);
  });

  it('does not throw and yields an empty set for malformed JSON', () => {
    const dir = scratchDir();
    writeFileSync(join(dir, COMMITTED_FILE), 'not-json {{{', 'utf8');
    expect(() => loadRouteExclusionsFromDir(dir)).not.toThrow();
    expect(loadRouteExclusionsFromDir(dir).size).toBe(0);
  });

  it('ignores non-string and empty-string entries in the list', () => {
    const dir = scratchDir();
    writeFileSync(
      join(dir, COMMITTED_FILE),
      JSON.stringify({ excludedSkillIds: ['sk-communication', '', 42, null, 'sk-x'] }),
      'utf8',
    );
    expect([...loadRouteExclusionsFromDir(dir)].sort()).toEqual(['sk-communication', 'sk-x']);
  });

  it('lets a present local override fully replace the committed list', () => {
    const dir = scratchDir();
    writeFileSync(join(dir, COMMITTED_FILE), JSON.stringify({ excludedSkillIds: ['sk-communication'] }), 'utf8');
    writeFileSync(join(dir, LOCAL_FILE), JSON.stringify({ excludedSkillIds: ['sk-other'] }), 'utf8');
    const resolved = loadRouteExclusionsFromDir(dir);
    expect(resolved.has('sk-other')).toBe(true);
    expect(resolved.has('sk-communication')).toBe(false);
  });

  it('lets an empty local override re-enable every skill despite a committed list', () => {
    const dir = scratchDir();
    writeFileSync(join(dir, COMMITTED_FILE), JSON.stringify({ excludedSkillIds: ['sk-communication'] }), 'utf8');
    writeFileSync(join(dir, LOCAL_FILE), JSON.stringify({ excludedSkillIds: [] }), 'utf8');
    expect(loadRouteExclusionsFromDir(dir).size).toBe(0);
  });

  it('honors the env-directory override through the cached runtime accessor', () => {
    const dir = scratchDir();
    writeFileSync(join(dir, COMMITTED_FILE), JSON.stringify({ excludedSkillIds: ['sk-env'] }), 'utf8');
    process.env.SPECKIT_ADVISOR_ROUTE_EXCLUSIONS_DIR = dir;
    resetRouteExclusionsCache();
    expect(isRouteExcludedSkillId('sk-env')).toBe(true);
    expect(isRouteExcludedSkillId('sk-communication')).toBe(false);
  });
});
