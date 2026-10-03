// ───────────────────────────────────────────────────────────────
// MODULE: Skill-Graph Freshness Panel Fixtures
// ───────────────────────────────────────────────────────────────
// The freshness panel is consulted in /doctor runs to expose drift between the
// compiled JSON, the SQLite graph and the on-disk graph-metadata, but it had no
// test of its own: a change to its report shape or its root resolution could
// silently break the panel while every run still exited 0. This harness builds
// throwaway repo-shaped roots (a skills tree, an optional SQLite graph) and
// drives the panel through spawnSync against them, asserting the exact report
// lines and that the scan stays depth-1.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';

function repoRoot(): string {
  const start = dirname(fileURLToPath(import.meta.url));
  let dir = start;
  while (dir !== dirname(dir)) {
    if (existsSync(join(dir, '.git'))) return dir;
    dir = dirname(dir);
  }
  throw new Error(`repo root not found from ${start}`);
}

const SCRIPT_PATH = join(repoRoot(), '.skilled/commands/doctor/scripts/skill-graph-freshness.cjs');

const OLD_STAMP = '2026-01-01T00:00:00.000Z';
const NEW_STAMP = '2026-02-02T00:00:00.000Z';
const SCAN_RULE_LINE = '  scan rule                 : depth-1 only (direct children of .skilled/skills); nested folders are not read';

const roots: string[] = [];

function tempRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'skill-graph-freshness-'));
  roots.push(root);
  return root;
}

function writeSkill(root: string, id: string, family: string, derived: Record<string, string | null>): void {
  const dir = join(root, '.skilled/skills', id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'graph-metadata.json'), JSON.stringify({ skill_id: id, family, derived }, null, 2));
}

function writeCompiled(root: string, generatedAt: string, families: Record<string, string[]>): void {
  const dir = join(root, '.skilled/skills/system-skill-advisor/runtime/scripts');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'skill-graph.json'), JSON.stringify({ generated_at: generatedAt, families }, null, 2));
}

function writeCompiledRaw(root: string, body: string): void {
  const dir = join(root, '.skilled/skills/system-skill-advisor/runtime/scripts');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'skill-graph.json'), body);
}

function writeDb(dbDir: string, rows: ReadonlyArray<readonly [string, string]>): void {
  mkdirSync(dbDir, { recursive: true });
  const db = new Database(join(dbDir, 'skill-graph.sqlite'));
  try {
    db.exec('CREATE TABLE skill_nodes (id TEXT PRIMARY KEY, family TEXT)');
    const insert = db.prepare('INSERT INTO skill_nodes (id, family) VALUES (?, ?)');
    for (const [id, family] of rows) insert.run(id, family);
  } finally {
    db.close();
  }
}

interface PanelRun {
  readonly status: number | null;
  readonly output: string;
}

function runPanel(root: string, dbDir: string): PanelRun {
  const result = spawnSync(process.execPath, [SCRIPT_PATH], {
    encoding: 'utf8',
    env: { ...process.env, SKILL_GRAPH_FRESHNESS_ROOT: root, SYSTEM_SKILL_ADVISOR_DB_DIR: dbDir },
  });
  return { status: result.status, output: `${result.stdout ?? ''}${result.stderr ?? ''}` };
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('skill-graph freshness panel', () => {
  it('clean panel: compiled newer than every stamp, db matching, all diffs none', () => {
    const root = tempRoot();
    const dbDir = join(root, 'db');
    writeSkill(root, 'alpha', 'hub', { last_updated_at: OLD_STAMP });
    writeSkill(root, 'beta', 'hub', { last_updated_at: OLD_STAMP });
    writeCompiled(root, NEW_STAMP, { hub: ['alpha', 'beta'] });
    writeDb(dbDir, [['alpha', 'hub'], ['beta', 'hub']]);

    const { status, output } = runPanel(root, dbDir);

    expect(status, output).toBe(0);
    expect(output).toContain(SCAN_RULE_LINE);
    expect(output).toContain(`  STALE COMPILED: none (generated_at ${NEW_STAMP}, newest source stamp ${OLD_STAMP})`);
    expect(output).not.toContain('DEGRADED');
    expect(output).toContain('ZOMBIE (in SQLite, not on disk): none');
    expect(output).toContain('MISSING (on disk, not in SQLite): none');
    expect(output).toContain('FAMILY MISMATCH SQLite vs disk: none');
    expect(output).toContain('GHOST (in compiled json, not on disk): none');
    expect(output).toContain('FAMILY MISMATCH compiled vs disk: none');
    expect(output).toContain('NULL derived timestamp: none');
  });

  it('stale compiled graph names both timestamps and the newest source skill', () => {
    const root = tempRoot();
    const dbDir = join(root, 'db');
    writeSkill(root, 'alpha', 'hub', { last_updated_at: NEW_STAMP });
    writeSkill(root, 'beta', 'hub', { last_updated_at: OLD_STAMP });
    writeCompiled(root, OLD_STAMP, { hub: ['alpha', 'beta'] });
    writeDb(dbDir, [['alpha', 'hub'], ['beta', 'hub']]);

    const { status, output } = runPanel(root, dbDir);

    expect(status, output).toBe(0);
    expect(output).toContain(
      `  STALE COMPILED: skill-graph.json generated_at ${OLD_STAMP} is older than the newest source stamp ${NEW_STAMP} (alpha); regenerate the compiled graph`,
    );
  });

  it('absent database degrades the SQLite section instead of printing the zombie report', () => {
    const root = tempRoot();
    const emptyDbDir = join(root, 'db-empty');
    mkdirSync(emptyDbDir, { recursive: true });
    writeSkill(root, 'alpha', 'hub', { last_updated_at: OLD_STAMP });
    writeCompiled(root, NEW_STAMP, { hub: ['alpha'] });

    const { status, output } = runPanel(root, emptyDbDir);

    expect(status, output).toBe(0);
    // The empty db dir sits inside the fixture root, so the panel spells the
    // database path relative to that root rather than as an absolute path.
    expect(output).toContain(
      '  DEGRADED: SQLite skill-graph.sqlite absent at db-empty/skill-graph.sqlite; '
      + 'ZOMBIE, MISSING and FAMILY MISMATCH SQLite vs disk were not checked (compiled json vs disk only); run advisor_rebuild to build it',
    );
    expect(output).not.toContain('ZOMBIE (in SQLite, not on disk)');
  });

  it('disambiguates a family name that collides with a skill id in both mismatch reports', () => {
    const root = tempRoot();
    const dbDir = join(root, 'db');
    writeSkill(root, 'alpha', 'other', { last_updated_at: OLD_STAMP });
    writeCompiled(root, NEW_STAMP, { alpha: ['alpha'] });
    writeDb(dbDir, [['alpha', 'third']]);

    const { status, output } = runPanel(root, dbDir);

    expect(status, output).toBe(0);
    expect(output).toContain('FAMILY MISMATCH SQLite vs disk: skill alpha (family disk=other sqlite=third)');
    expect(output).toContain('FAMILY MISMATCH compiled vs disk: skill alpha (family disk=other compiled=alpha)');
  });

  it('unparseable compiled json degrades that section and still exits 0', () => {
    const root = tempRoot();
    const dbDir = join(root, 'db');
    writeSkill(root, 'alpha', 'hub', { last_updated_at: OLD_STAMP });
    writeCompiledRaw(root, '{ this is not json');
    writeDb(dbDir, [['alpha', 'hub']]);

    const { status, output } = runPanel(root, dbDir);

    expect(status, output).toBe(0);
    expect(output).toMatch(/DEGRADED: compiled skill-graph\.json unreadable \(/);
    expect(output).not.toContain('GHOST (in compiled json, not on disk)');
  });

  it('reads only depth-1 skill folders and never counts nested metadata', () => {
    const root = tempRoot();
    const dbDir = join(root, 'db');
    writeSkill(root, 'alpha', 'hub', { last_updated_at: OLD_STAMP });
    const nestedDir = join(root, '.skilled/skills/alpha/nested');
    mkdirSync(nestedDir, { recursive: true });
    writeFileSync(
      join(nestedDir, 'graph-metadata.json'),
      JSON.stringify({ skill_id: 'nested-skill', family: 'hub', derived: { last_updated_at: OLD_STAMP } }, null, 2),
    );
    writeCompiled(root, NEW_STAMP, { hub: ['alpha'] });
    writeDb(dbDir, [['alpha', 'hub']]);

    const { status, output } = runPanel(root, dbDir);

    expect(status, output).toBe(0);
    expect(output).toContain(SCAN_RULE_LINE);
    expect(output).toContain('on-disk graph-metadata    : 1 skills (source of truth)');
    expect(output).not.toContain('nested-skill');
  });
});
