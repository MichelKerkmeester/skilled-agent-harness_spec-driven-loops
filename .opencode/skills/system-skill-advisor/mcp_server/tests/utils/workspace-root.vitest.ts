// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Workspace-Root Resolver Tests
// ───────────────────────────────────────────────────────────────
// Guards the sentinel-not-found fallback: the resolver must never hand back a
// directory inside a specs/ packet tree, because the advisor writes runtime
// state under whatever root it returns and would otherwise leak a stray
// `.opencode/skills/.advisor-state/...` tree into spec folders.

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
    mkdirp(join(repo, '.opencode', 'skills', 'system-spec-kit'));
    writeFileSync(join(repo, SENTINEL), '# sentinel', 'utf8');
    const seat = mkdirp(join(repo, '.opencode', 'specs', 'pkg', '027-x', 'seat'));

    expect(findAdvisorWorkspaceRoot(seat)).toBe(resolve(repo));
  });
});

describe('findAdvisorWorkspaceRoot — fallback never lands inside a specs/ tree', () => {
  it('hoists above a canonical .opencode/specs/ subtree when no sentinel is reachable', () => {
    const repo = makeTmpRoot();
    const seat = mkdirp(join(repo, '.opencode', 'specs', 'system-spec-kit', '027-x', 'seat'));

    // No sentinel anywhere under `repo`, so the walk-up exhausts and falls back.
    expect(findAdvisorWorkspaceRoot(seat)).toBe(resolve(repo));
  });

  it('hoists above a bare specs/ alias subtree when no sentinel is reachable', () => {
    const repo = makeTmpRoot();
    const seat = mkdirp(join(repo, 'specs', 'feature', 'seat'));

    expect(findAdvisorWorkspaceRoot(seat)).toBe(resolve(repo));
  });

  it('never returns a path containing a specs segment for a packet-nested start', () => {
    const repo = makeTmpRoot();
    const seat = mkdirp(join(repo, '.opencode', 'specs', 'track', 'nnn-name', 'research', 'iter-001'));

    const resolved = findAdvisorWorkspaceRoot(seat);
    expect(resolved.split(sep)).not.toContain('specs');
  });
});

describe('findAdvisorWorkspaceRoot — non-specs paths keep prior fallback', () => {
  it('returns the start dir for an ordinary path with no sentinel and no specs segment', () => {
    const root = makeTmpRoot();
    const nested = mkdirp(join(root, 'some', 'nested', 'dir'));

    expect(findAdvisorWorkspaceRoot(nested)).toBe(resolve(nested));
  });
});
