import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  attributeTerms,
  classifyLifecycle,
  classifySurface,
  globToRegExp,
  loadAllowlist,
  matchAllowlist,
  sweep,
} from '../retrieval/sweep-memory-residue.mjs';

const SCRIPT_PATH = fileURLToPath(new URL('../retrieval/sweep-memory-residue.mjs', import.meta.url));

const tempRoots = new Set<string>();

afterEach(() => {
  for (const dir of tempRoots) {
    fs.rmSync(dir, { force: true, recursive: true });
  }
  tempRoots.clear();
});

function makeTempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.add(dir);
  return dir;
}

function writeFile(root: string, relativePath: string, content: string): void {
  const absolute = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, content, 'utf8');
}

function writeAllowlist(root: string, entries: Array<{ pathPrefixOrGlob: string; reason: string }>): string {
  const allowlistPath = path.join(root, 'allowlist.json');
  fs.writeFileSync(allowlistPath, JSON.stringify({ entries }, null, 2), 'utf8');
  return allowlistPath;
}

/**
 * A tree with one hit of every class the sweep can report, plus one inside the
 * subsystem tree that must never reach the report at all.
 */
function makeFixtureTree(): { allowlistPath: string; root: string } {
  const root = makeTempDir('residue-sweep-');
  writeFile(root, '.opencode/commands/demo/run.md', 'Call memory_search before answering.\n');
  writeFile(root, 'specs/demo/research/notes.md', 'The old loop called memory_context here.\n');
  writeFile(root, 'docs/exempt-note.md', 'Historic note about memory_save.\n');
  writeFile(root, '.opencode/skills/system-spec-kit/mcp-server/handler.ts', 'export const tool = "memory_stats";\n');
  const allowlistPath = writeAllowlist(root, [
    { pathPrefixOrGlob: 'docs/exempt-note.md', reason: 'deliberate survivor for this fixture' },
  ]);
  return { allowlistPath, root };
}

function runCli(args: string[], env: NodeJS.ProcessEnv = {}) {
  return spawnSync(process.execPath, [SCRIPT_PATH, ...args], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
    maxBuffer: 64 * 1024 * 1024,
  });
}

// ───────────────────────────────────────────────────────────────
// Term attribution
// ───────────────────────────────────────────────────────────────

describe('attributeTerms', () => {
  it('reports every term a line names, not just the leftmost', () => {
    expect(attributeTerms('run memory_save then memory_context')).toEqual(['memory_context', 'memory_save']);
  });

  it('keeps a longer tool name from being counted as its own prefix', () => {
    expect(attributeTerms('poll memory_index_scan_status')).toEqual(['memory_index_scan_status']);
  });

  it('falls back to an explicit marker rather than dropping an unexplained hit', () => {
    expect(attributeTerms('nothing relevant here')).toEqual(['unattributed']);
  });
});

// ───────────────────────────────────────────────────────────────
// Classification
// ───────────────────────────────────────────────────────────────

describe('classifyLifecycle', () => {
  it('treats a recorded-evidence directory as historical', () => {
    expect(classifyLifecycle('specs/demo/research/notes.md')).toBe('historical');
    expect(classifyLifecycle('specs/demo/runs/iter-1.md')).toBe('historical');
  });

  it('treats a JSONL file as historical wherever it sits', () => {
    expect(classifyLifecycle('.opencode/state/session.jsonl')).toBe('historical');
  });

  it('treats an ordinary instruction path as live', () => {
    expect(classifyLifecycle('.opencode/commands/demo/run.md')).toBe('live');
  });
});

describe('classifySurface', () => {
  it.each([
    ['.env.example', 'env'],
    ['.opencode/skills/system-spec-kit/scripts/tests/x.vitest.ts', 'tests'],
    ['.opencode/hooks/session-prime.sh', 'hooks'],
    ['.opencode/plugins/demo.js', 'plugins'],
    ['.opencode/bin/demo.cjs', 'bin'],
    ['.claude/agents/code.md', 'agents'],
    ['.opencode/commands/demo/run.md', 'commands'],
    ['.claude/mcp.json', 'config'],
    ['opencode.json', 'config'],
    ['.opencode/skills/system-spec-kit/shared/embeddings.ts', 'code'],
    ['.opencode/skills/sk-code/SKILL.md', 'skills'],
    ['specs/demo/spec.md', 'docs'],
    ['specs/demo/evidence/out.json', 'other'],
  ])('routes %s to %s', (candidate, surface) => {
    expect(classifySurface(candidate)).toBe(surface);
  });
});

// ───────────────────────────────────────────────────────────────
// Allowlist
// ───────────────────────────────────────────────────────────────

describe('globToRegExp', () => {
  it('lets a leading double star match at any depth including none', () => {
    const regex = globToRegExp('**/changelog/**');
    expect(regex.test('changelog/v1.0.0.md')).toBe(true);
    expect(regex.test('.opencode/skills/demo/changelog/v1.0.0.md')).toBe(true);
    expect(regex.test('.opencode/skills/demo/changelog-notes.md')).toBe(false);
  });

  it('keeps a single star inside one path segment', () => {
    const regex = globToRegExp('**/CHANGELOG-*.md');
    expect(regex.test('docs/CHANGELOG-v4.md')).toBe(true);
    expect(regex.test('docs/CHANGELOG-v4/inner.md')).toBe(false);
  });
});

describe('loadAllowlist', () => {
  it('fails closed on an entry with no reason rather than dropping it', () => {
    const root = makeTempDir('residue-allowlist-');
    const allowlistPath = path.join(root, 'allowlist.json');
    fs.writeFileSync(allowlistPath, JSON.stringify({ entries: [{ pathPrefixOrGlob: 'a/' }] }), 'utf8');
    expect(() => loadAllowlist(allowlistPath)).toThrow(/no reason/);
  });

  it('matches a plain entry by prefix and a starred entry as a glob', () => {
    const root = makeTempDir('residue-allowlist-');
    const allowlistPath = writeAllowlist(root, [
      { pathPrefixOrGlob: 'specs/demo/', reason: 'packet docs' },
      { pathPrefixOrGlob: '**/changelog/**', reason: 'shipped record' },
    ]);
    const entries = loadAllowlist(allowlistPath);
    expect(matchAllowlist('specs/demo/spec.md', entries)?.reason).toBe('packet docs');
    expect(matchAllowlist('a/b/changelog/v1.md', entries)?.reason).toBe('shipped record');
    expect(matchAllowlist('specs/other/spec.md', entries)).toBeNull();
  });
});

// ───────────────────────────────────────────────────────────────
// Sweep over a fixture tree
// ───────────────────────────────────────────────────────────────

describe('sweep', () => {
  it('classifies live, historical and allowlisted hits and never sees the subsystem tree', async () => {
    const { allowlistPath, root } = makeFixtureTree();
    const report = await sweep({ allowlistPath, root });

    const byPath = new Map(report.records.map((record: any) => [record.path, record]));

    expect(byPath.get('.opencode/commands/demo/run.md')).toMatchObject({
      allowlistReason: null,
      class: 'live',
      surfaceType: 'commands',
      term: 'memory_search',
    });
    expect(byPath.get('specs/demo/research/notes.md')).toMatchObject({ class: 'historical', term: 'memory_context' });
    expect(byPath.get('docs/exempt-note.md')).toMatchObject({
      allowlistReason: 'deliberate survivor for this fixture',
      class: 'allowlisted',
    });
    expect(byPath.has('.opencode/skills/system-spec-kit/mcp-server/handler.ts')).toBe(false);

    expect(report.counts).toMatchObject({ allowlisted: 1, historical: 1, live: 1 });
    expect(report.liveBySurface.commands).toBe(1);
    expect(report.unparsedLines).toBe(0);
    expect(report.topLivePaths).toEqual([{ path: '.opencode/commands/demo/run.md', records: 1 }]);
  });

  it('refuses a root that is not a repository root instead of reporting a clean tree', async () => {
    const root = makeTempDir('residue-not-a-repo-');
    await expect(sweep({ root })).rejects.toThrow(/does not look like the repository root/);
  });
});

// ───────────────────────────────────────────────────────────────
// CLI contract
// ───────────────────────────────────────────────────────────────

describe('sweep CLI', () => {
  it('exits 1 while a live hit remains and emits parseable --json', () => {
    const { allowlistPath, root } = makeFixtureTree();
    const run = runCli(['--root', root, '--allowlist', allowlistPath, '--json']);

    expect(run.status).toBe(1);
    const report = JSON.parse(run.stdout);
    expect(report.counts.live).toBe(1);
    expect(report.records.map((record: any) => record.class).sort()).toEqual(['allowlisted', 'historical', 'live']);
  });

  it('exits 0 once nothing live remains and writes the report where asked', () => {
    const { allowlistPath, root } = makeFixtureTree();
    fs.rmSync(path.join(root, '.opencode/commands'), { force: true, recursive: true });
    const reportPath = path.join(root, 'out', 'residue.json');

    const run = runCli(['--root', root, '--allowlist', allowlistPath, '--report', reportPath]);

    expect(run.status).toBe(0);
    expect(run.stdout).toContain('live records by surface type');
    expect(JSON.parse(fs.readFileSync(reportPath, 'utf8')).counts.live).toBe(0);
  });

  it('exits 2 when ripgrep cannot be executed', () => {
    const { allowlistPath, root } = makeFixtureTree();
    const run = runCli(['--root', root, '--allowlist', allowlistPath], {
      SPECKIT_RG_BIN: path.join(root, 'no-such-ripgrep'),
    });

    expect(run.status).toBe(2);
    expect(run.stderr).not.toBe('');
  });

  it('exits 2 on an unknown argument rather than sweeping with a silent default', () => {
    const run = runCli(['--not-a-flag']);
    expect(run.status).toBe(2);
    expect(run.stderr).toContain('unknown argument');
  });
});
