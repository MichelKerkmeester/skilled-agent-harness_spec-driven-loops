// ───────────────────────────────────────────────────────────────
// MODULE: Advisor State-Directory Containment
// ───────────────────────────────────────────────────────────────
// Regression guard for the stray `.state/advisor` / skill-graph DB leak: when a
// session runs from inside a specs/<packet> directory, the advisor must resolve
// its state paths to the REAL repo root, never to the packet subdir. The two
// path chokepoints (generation counter + skill-graph DB dir) and the hook entry
// point all route through findAdvisorWorkspaceRoot, so a subdir cwd can no
// longer materialize a nested state tree.

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';

import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';

import { getSkillGraphGenerationPath, publishSkillGraphGeneration, readSkillGraphGeneration } from '../lib/freshness/generation.js';
import { resolveSkillGraphDbDir } from '../lib/skill-graph/skill-graph-db.js';
import { workspaceRootFor } from '../../hooks/claude/user-prompt-submit.js';

const SENTINEL = '.skilled/skills/system-spec-kit/SKILL.md';
const tmpRoots: string[] = [];

// Build a throwaway repo (sentinel present) with a nested specs/<packet> dir,
// mirroring a real session whose cwd sits deep inside a spec packet.
function repoWithSpecDir(): { repo: string; specDir: string } {
  const repo = mkdtempSync(join(tmpdir(), 'advisor-containment-'));
  tmpRoots.push(repo);
  mkdirSync(join(repo, '.skilled', 'skills', 'system-spec-kit'), { recursive: true });
  writeFileSync(join(repo, SENTINEL), '# sentinel\n');
  const specDir = join(repo, 'specs', 'system-skill-advisor', '017-x', '001-y');
  mkdirSync(specDir, { recursive: true });
  return { repo: resolve(repo), specDir };
}

afterAll(() => {
  for (const root of tmpRoots) rmSync(root, { recursive: true, force: true });
});

beforeEach(() => {
  delete process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
});

describe('advisor state containment — generation counter path', () => {
  it('anchors a specs/<packet> root to the repo root, not the packet dir', () => {
    const { repo, specDir } = repoWithSpecDir();
    const path = getSkillGraphGenerationPath(specDir);
    expect(['.skilled', '.opencode'].some((root) => path.startsWith(join(repo, root) + sep))).toBe(true);
    expect(path).not.toContain(join('specs', 'system-skill-advisor'));
  });
});

describe('advisor state containment, generation under a DB dir override', () => {
  afterEach(() => {
    delete process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
  });

  it('resolves the generation file inside the override directory', () => {
    const { specDir } = repoWithSpecDir();
    const dbDir = mkdtempSync(join(tmpdir(), 'advisor-containment-db-'));
    tmpRoots.push(dbDir);
    process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = dbDir;
    expect(getSkillGraphGenerationPath(specDir)).toBe(join(resolve(dbDir), 'skill-graph-generation.json'));
  });

  it('publishes a sandboxed shutdown without touching the workspace generation file', () => {
    const { repo } = repoWithSpecDir();
    const liveFile = getSkillGraphGenerationPath(repo);
    mkdirSync(dirname(liveFile), { recursive: true });
    writeFileSync(liveFile, `${JSON.stringify({
      generation: 7,
      updatedAt: '2026-04-20T00:00:00.000Z',
      sourceSignature: null,
      reason: 'LIVE_FIXTURE',
      state: 'live',
    })}\n`, 'utf8');
    const liveBytes = readFileSync(liveFile, 'utf8');

    const dbDir = mkdtempSync(join(tmpdir(), 'advisor-containment-db-'));
    tmpRoots.push(dbDir);
    process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = dbDir;
    publishSkillGraphGeneration({ workspaceRoot: repo, reason: 'SIGTERM', state: 'unavailable' });

    expect(readFileSync(liveFile, 'utf8')).toBe(liveBytes);
    expect(readSkillGraphGeneration(repo)).toMatchObject({ generation: 1, state: 'unavailable', reason: 'SIGTERM' });

    delete process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
    expect(readSkillGraphGeneration(repo)).toMatchObject({ generation: 7, state: 'live' });
  });
});

describe('advisor state containment — skill-graph DB dir', () => {
  it('anchors a specs/<packet> baseRoot to the repo root', () => {
    const { repo, specDir } = repoWithSpecDir();
    const dir = resolveSkillGraphDbDir(specDir);
    expect(['.skilled', '.opencode'].some((root) => dir.startsWith(join(repo, root) + sep))).toBe(true);
    expect(dir).not.toContain(join('specs', 'system-skill-advisor'));
  });

  it('still honors an explicit DB dir override', () => {
    const { specDir } = repoWithSpecDir();
    process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = specDir;
    expect(resolveSkillGraphDbDir(specDir)).toBe(resolve(specDir));
  });
});

describe('advisor state containment — hook entry point', () => {
  it('workspaceRootFor anchors a specs/<packet> cwd to the repo root', () => {
    const { repo, specDir } = repoWithSpecDir();
    const resolveRoot = workspaceRootFor as unknown as (i: { cwd?: string }) => string;
    expect(resolveRoot({ cwd: specDir })).toBe(repo);
  });
});
