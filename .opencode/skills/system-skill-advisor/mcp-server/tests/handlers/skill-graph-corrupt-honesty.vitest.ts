// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Corruption Honesty Tests
// ───────────────────────────────────────────────────────────────
// A read-only status path must REPORT on-disk corruption, never
// quarantine the database as a side effect; and a corrupt-on-disk
// artifact must read as stale so advisor_rebuild repairs it instead
// of skipping on a 'live' generation counter.

import { existsSync, mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { afterEach, describe, expect, it } from 'vitest';

import { handleSkillGraphStatus } from '../../handlers/skill-graph/status.js';
import { readAdvisorStatus } from '../../handlers/advisor-status.js';
import { closeDb, DB_FILENAME } from '../../lib/skill-graph/skill-graph-db.js';

const GARBAGE = Buffer.from('this is plainly not a sqlite database file, only garbage bytes '.repeat(4));

const ADVISOR_DB_RELATIVE_PATH = join(
  '.opencode', 'skills', 'system-skill-advisor', 'mcp-server', 'database', 'skill-graph.sqlite',
);

function parseData(response: { content: Array<{ text: string }> }): Record<string, unknown> {
  const parsed = JSON.parse(response.content[0].text) as { data?: Record<string, unknown> };
  return parsed.data ?? (parsed as Record<string, unknown>);
}

describe('skill graph status corruption honesty', () => {
  const priorDbDir = process.env.MK_SKILL_ADVISOR_DB_DIR;

  afterEach(() => {
    closeDb();
    if (priorDbDir === undefined) delete process.env.MK_SKILL_ADVISOR_DB_DIR;
    else process.env.MK_SKILL_ADVISOR_DB_DIR = priorDbDir;
  });

  it('reports corruption and leaves the file in place instead of quarantining it', async () => {
    const dbDir = mkdtempSync(join(tmpdir(), 'sg-corrupt-status-'));
    const dbPath = join(dbDir, DB_FILENAME);
    writeFileSync(dbPath, GARBAGE);
    process.env.MK_SKILL_ADVISOR_DB_DIR = dbDir;
    closeDb();

    const data = parseData(await handleSkillGraphStatus());

    expect(data.dbStatus).toBe('corrupt');
    expect(data.degraded).toBe(true);
    expect(data.requiredAction).toBe('advisor_rebuild');
    // The destructive recovery path must NOT have run: the file is untouched
    // at its original location (no `.corrupt` quarantine rename).
    expect(existsSync(dbPath)).toBe(true);
    expect(readFileSync(dbPath)).toEqual(GARBAGE);
  });
});

describe('advisor status corruption downgrades freshness', () => {
  afterEach(() => {
    closeDb();
  });

  function workspace(): string {
    const root = mkdtempSync(join(tmpdir(), 'advisor-corrupt-'));
    mkdirSync(join(root, '.opencode', 'skills', '.advisor-state'), { recursive: true });
    mkdirSync(join(root, '.opencode', 'skills', 'system-skill-advisor', 'mcp-server', 'database'), { recursive: true });
    mkdirSync(join(root, '.opencode', 'skills', 'alpha'), { recursive: true });
    writeFileSync(join(root, '.opencode', 'skills', 'alpha', 'graph-metadata.json'), '{"skill_id":"alpha"}\n', 'utf8');
    writeFileSync(join(root, '.opencode', 'skills', '.advisor-state', 'skill-graph-generation.json'), `${JSON.stringify({
      generation: 3,
      updatedAt: '2026-04-20T00:00:00.000Z',
      sourceSignature: null,
      reason: 'LIVE_FIXTURE',
      state: 'live',
    })}\n`, 'utf8');
    return root;
  }

  it('reads a corrupt-on-disk artifact as stale when integrity is checked', () => {
    const root = workspace();
    writeFileSync(join(root, ADVISOR_DB_RELATIVE_PATH), GARBAGE);

    const status = readAdvisorStatus({ workspaceRoot: root, checkArtifactIntegrity: true });

    expect(status.freshness).toBe('stale');
    expect((status.errors ?? []).some((message) => message.includes('integrity check failed'))).toBe(true);
  });

  it('does NOT probe (stays live, no cost) on the default read-style path', () => {
    const root = workspace();
    writeFileSync(join(root, ADVISOR_DB_RELATIVE_PATH), GARBAGE);

    // The recommend path omits checkArtifactIntegrity, so no quick_check runs
    // and a corrupt artifact is not downgraded here — repair is the rebuild
    // path's job, not a per-recommendation cost.
    const status = readAdvisorStatus({ workspaceRoot: root });

    expect(status.freshness).toBe('live');
    expect((status.errors ?? []).some((message) => message.includes('integrity check failed'))).toBe(false);
  });

  it('keeps a healthy generation live when the artifact opens cleanly', () => {
    const root = workspace();
    // A zero-byte file is a valid empty SQLite database (quick_check passes),
    // so a live generation with a non-corrupt artifact must stay live.
    writeFileSync(join(root, ADVISOR_DB_RELATIVE_PATH), '');

    const status = readAdvisorStatus({ workspaceRoot: root, checkArtifactIntegrity: true });

    expect(status.freshness).toBe('live');
  });
});
