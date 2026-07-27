// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Workspace-Root Resolver Tests
// ───────────────────────────────────────────────────────────────
// Guards the sentinel-not-found fallback. The resolver must never hand back a
// directory inside an `.opencode/` tree, because the advisor writes runtime
// state under whatever root it returns; a root inside `.opencode/` materializes
// a nested tree that then satisfies every future walk-up, making the leak
// permanent.
//
// These tests assert the BOUNDARY, not a list of known-bad subtrees. An earlier
// version asserted only that the fallback avoided `specs/`, so leaks into
// `skills/` were never in scope and went unnoticed.

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';

import { afterAll, describe, expect, it } from 'vitest';

import { findAdvisorWorkspaceRoot } from '../../lib/utils/workspace-root.js';

const SENTINEL = '.opencode/skills/system-spec-kit/SKILL.md';
const tmpRoots: string[] = [];

function makeTmpRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'advisor-workspace-root-'));
  tmpRoots.push(root);
  return root;
}

function mkdirp(dir: string): string {
  mkdirSync(dir, { recursive: true });
  return dir;
}

afterAll(() => {
  for (const root of tmpRoots) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('findAdvisorWorkspaceRoot — sentinel walk-up', () => {
  it('returns the directory that holds the sentinel (happy path)', () => {
    const repo = makeTmpRoot();
    const seat = mkdirp(join(repo, '.opencode', 'skills', 'sk-doc', 'create-diff'));
    mkdirp(join(repo, '.opencode', 'skills', 'system-spec-kit'));
    writeFileSync(join(repo, SENTINEL), '# sentinel\n');
    expect(findAdvisorWorkspaceRoot(seat)).toBe(resolve(repo));
  });
});

describe('findAdvisorWorkspaceRoot — fallback never lands inside an .opencode tree', () => {
  const nested = [
    ['skills', join('.opencode', 'skills', 'system-spec-kit')],
    ['skills, deep', join('.opencode', 'skills', 'sk-doc', 'create-diff', 'scripts')],
    ['mcp-server', join('.opencode', 'skills', 'system-skill-advisor', 'mcp-server')],
    ['specs', join('.opencode', 'specs', 'system-speckit', '028-x')],
    ['commands', join('.opencode', 'commands', 'deep', 'assets')],
    ['bin', join('.opencode', 'bin', 'lib')],
    ['plugins', join('.opencode', 'plugins', 'tests')],
  ] as const;

  for (const [label, rel] of nested) {
    it(`hoists above .opencode for a start under ${label}`, () => {
      const repo = makeTmpRoot();
      expect(findAdvisorWorkspaceRoot(mkdirp(join(repo, rel)))).toBe(resolve(repo));
    });
  }

  it('hoists above the OUTERMOST .opencode when a leak already nested one inside another', () => {
    const repo = makeTmpRoot();
    const seat = mkdirp(join(repo, '.opencode', 'skills', 'sk-doc', '.opencode', 'skills'));
    expect(findAdvisorWorkspaceRoot(seat)).toBe(resolve(repo));
  });

  it('never returns a path containing an .opencode segment, for any nested start', () => {
    const repo = makeTmpRoot();
    for (const [, rel] of nested) {
      expect(findAdvisorWorkspaceRoot(mkdirp(join(repo, rel))).split(sep)).not.toContain('.opencode');
    }
  });
});

describe('findAdvisorWorkspaceRoot — ordinary paths keep prior fallback', () => {
  it('returns the start dir for a path with no sentinel and no .opencode segment', () => {
    const repo = makeTmpRoot();
    const plain = mkdirp(join(repo, 'src', 'lib'));
    expect(findAdvisorWorkspaceRoot(plain)).toBe(resolve(plain));
  });
});
