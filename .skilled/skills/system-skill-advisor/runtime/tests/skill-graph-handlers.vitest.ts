// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Graph Handlers
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleSkillGraphQuery } from '../handlers/skill-graph/query.js';
import { handleSkillGraphScan } from '../handlers/skill-graph/scan.js';
import { runWithCallerContext, type CallerContext } from '../lib/caller-context.js';
import { closeDb, getDb, indexSkillMetadata, initDb } from '../lib/skill-graph/skill-graph-db.js';
import { writeGraphMetadata } from './fixtures/skill-graph-db.js';

type HandlerResponse = { content: Array<{ type: string; text: string }> };

function parsePayload(result: HandlerResponse): Record<string, unknown> {
  return JSON.parse(result.content[0].text) as Record<string, unknown>;
}

function trustedCaller(): CallerContext & { readonly trusted: true } {
  return {
    sessionId: 'trusted-scan',
    transport: 'stdio',
    connectedAt: '2026-04-28T00:00:00.000Z',
    callerPid: 4242,
    trusted: true,
    metadata: { source: 'vitest', trusted: true },
  };
}

function assertNoInternalFields(value: unknown, path = 'root'): void {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNoInternalFields(entry, `${path}[${index}]`));
    return;
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    expect(Object.keys(record), path).not.toContain('sourcePath');
    expect(Object.keys(record), path).not.toContain('contentHash');
    for (const [key, nestedValue] of Object.entries(record)) {
      assertNoInternalFields(nestedValue, `${path}.${key}`);
    }
  }
}

describe('skill graph handlers', () => {
  afterEach(() => {
    closeDb();
    vi.restoreAllMocks();
  });

  it('redacts internal node fields from every query response shape', async () => {
    const root = mkdtempSync(join(tmpdir(), 'skill-graph-handlers-'));
    const skillRoot = join(root, 'skills');

    try {
      initDb(join(root, 'db'));
      writeGraphMetadata(skillRoot, 'alpha', {
        depends_on: [{ target: 'beta', weight: 0.8, context: 'alpha uses beta' }],
      });
      writeGraphMetadata(skillRoot, 'beta', {
        enhances: [{ target: 'alpha', weight: 0.5, context: 'beta complements alpha' }],
      });
      writeGraphMetadata(skillRoot, 'gamma');
      indexSkillMetadata(skillRoot);

      const queryResults = await Promise.all([
        handleSkillGraphQuery({ queryType: 'depends_on', skillId: 'alpha' }),
        handleSkillGraphQuery({ queryType: 'dependents', skillId: 'beta' }),
        handleSkillGraphQuery({ queryType: 'enhances', skillId: 'beta' }),
        handleSkillGraphQuery({ queryType: 'enhanced_by', skillId: 'alpha' }),
        handleSkillGraphQuery({ queryType: 'family_members', family: 'system' }),
        handleSkillGraphQuery({ queryType: 'transitive_path', sourceSkillId: 'alpha', targetSkillId: 'beta' }),
        handleSkillGraphQuery({ queryType: 'hub_skills', minInbound: 1 }),
        handleSkillGraphQuery({ queryType: 'orphans' }),
        handleSkillGraphQuery({ queryType: 'subgraph', skillId: 'alpha', depth: 2 }),
      ]);

      for (const result of queryResults) {
        const payload = parsePayload(result);
        expect(payload.status).toBe('ok');
        assertNoInternalFields(payload.data);
      }
    } finally {
      closeDb();
      rmSync(root, { recursive: true, force: true });
    }
  });

  // drift: verified against shipped behavior during Unit H
  it('preserves the live graph when a custom scan root contains no skills', async () => {
    const root = mkdtempSync(join(tmpdir(), 'skill-graph-handlers-'));
    const workspace = join(root, 'workspace');
    const skillRoot = join(workspace, '.skilled', 'skills');
    const emptyRoot = join(workspace, 'empty-skills');

    try {
      mkdirSync(emptyRoot, { recursive: true });
      vi.spyOn(process, 'cwd').mockReturnValue(workspace);
      initDb(join(root, 'db'));
      writeGraphMetadata(skillRoot, 'alpha');

      const firstScan = parsePayload(await runWithCallerContext(
        trustedCaller(),
        () => handleSkillGraphScan({}),
      ));
      expect(firstScan.status).toBe('ok');
      expect(getDb().prepare('SELECT id FROM skill_nodes').all()).toEqual([{ id: 'alpha' }]);

      const emptyScan = parsePayload(await runWithCallerContext(
        trustedCaller(),
        () => handleSkillGraphScan({ skillsRoot: 'empty-skills' }),
      ));

      expect(emptyScan.status).toBe('ok');
      expect(getDb().prepare('SELECT id FROM skill_nodes').all()).toEqual([{ id: 'alpha' }]);
      expect(emptyScan.data).toMatchObject({
        scannedFiles: 0,
        indexedFiles: 0,
        deletedNodes: 0,
      });
      expect(JSON.stringify(emptyScan.data)).toContain('EMPTY-SKILL-SCAN');
    } finally {
      closeDb();
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('keeps every skill and edge outside a one-skill scan root', async () => {
    const root = mkdtempSync(join(tmpdir(), 'skill-graph-handlers-'));
    const workspace = join(root, 'workspace');
    const skillRoot = join(workspace, '.skilled', 'skills');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      vi.spyOn(process, 'cwd').mockReturnValue(workspace);
      initDb(join(root, 'db'));
      writeGraphMetadata(skillRoot, 'alpha', {
        depends_on: [{ target: 'beta', weight: 0.8, context: 'alpha uses beta' }],
      });
      writeGraphMetadata(skillRoot, 'alpha-two', {
        depends_on: [{ target: 'alpha', weight: 0.85, context: 'alpha-two uses alpha' }],
      });
      writeGraphMetadata(skillRoot, 'beta', {
        enhances: [{ target: 'alpha', weight: 0.5, context: 'beta complements alpha' }],
      });
      writeGraphMetadata(skillRoot, 'gamma');

      const fullScan = parsePayload(await runWithCallerContext(
        trustedCaller(),
        () => handleSkillGraphScan({}),
      ));
      expect(fullScan.status).toBe('ok');
      expect(fullScan.data).toMatchObject({ indexedNodes: 4, indexedEdges: 3, rejectedEdges: 0 });
      expect(getDb().prepare(`
        SELECT source_id, target_id, edge_type, weight
        FROM skill_edges
        ORDER BY source_id, target_id, edge_type
      `).all()).toEqual([
        { source_id: 'alpha', target_id: 'beta', edge_type: 'depends_on', weight: 0.8 },
        { source_id: 'alpha-two', target_id: 'alpha', edge_type: 'depends_on', weight: 0.85 },
        { source_id: 'beta', target_id: 'alpha', edge_type: 'enhances', weight: 0.5 },
      ]);

      writeGraphMetadata(skillRoot, 'alpha', {
        depends_on: [{ target: 'beta', weight: 0.9, context: 'alpha uses beta' }],
      });
      const narrowScan = parsePayload(await runWithCallerContext(
        trustedCaller(),
        () => handleSkillGraphScan({ skillsRoot: '.skilled/skills/alpha' }),
      ));

      expect(narrowScan.status).toBe('ok');
      expect(narrowScan.data).toMatchObject({
        scannedFiles: 1,
        indexedFiles: 1,
        deletedNodes: 0,
        rejectedEdges: 0,
      });
      expect(getDb().prepare('SELECT id FROM skill_nodes ORDER BY id').all()).toEqual([
        { id: 'alpha' },
        { id: 'alpha-two' },
        { id: 'beta' },
        { id: 'gamma' },
      ]);
      expect(getDb().prepare(`
        SELECT source_id, target_id, edge_type, weight
        FROM skill_edges
        ORDER BY source_id, target_id, edge_type
      `).all()).toEqual([
        { source_id: 'alpha', target_id: 'beta', edge_type: 'depends_on', weight: 0.9 },
        { source_id: 'alpha-two', target_id: 'alpha', edge_type: 'depends_on', weight: 0.85 },
        { source_id: 'beta', target_id: 'alpha', edge_type: 'enhances', weight: 0.5 },
      ]);
      expect(warn).not.toHaveBeenCalled();
    } finally {
      closeDb();
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('deletes a removed skill only when the scan root covers its source', async () => {
    const root = mkdtempSync(join(tmpdir(), 'skill-graph-handlers-'));
    const workspace = join(root, 'workspace');
    const skillRoot = join(workspace, '.skilled', 'skills');

    try {
      vi.spyOn(process, 'cwd').mockReturnValue(workspace);
      initDb(join(root, 'db'));
      writeGraphMetadata(skillRoot, 'alpha');
      writeGraphMetadata(skillRoot, 'gamma', {
        depends_on: [{ target: 'alpha', weight: 0.8, context: 'gamma uses alpha' }],
      });

      const fullScan = parsePayload(await runWithCallerContext(
        trustedCaller(),
        () => handleSkillGraphScan({}),
      ));
      expect(fullScan.data).toMatchObject({ indexedNodes: 2, indexedEdges: 1, deletedNodes: 0 });
      rmSync(join(skillRoot, 'gamma'), { recursive: true, force: true });

      const narrowScan = parsePayload(await runWithCallerContext(
        trustedCaller(),
        () => handleSkillGraphScan({ skillsRoot: '.skilled/skills/alpha' }),
      ));
      expect(narrowScan.data).toMatchObject({ deletedNodes: 0 });
      expect(getDb().prepare('SELECT id FROM skill_nodes ORDER BY id').all()).toEqual([
        { id: 'alpha' },
        { id: 'gamma' },
      ]);
      expect(getDb().prepare('SELECT source_id, target_id FROM skill_edges').all()).toEqual([
        { source_id: 'gamma', target_id: 'alpha' },
      ]);

      const finalScan = parsePayload(await runWithCallerContext(
        trustedCaller(),
        () => handleSkillGraphScan({}),
      ));
      expect(finalScan.data).toMatchObject({ deletedNodes: 1 });
      expect(getDb().prepare('SELECT id FROM skill_nodes').all()).toEqual([{ id: 'alpha' }]);
      expect(getDb().prepare('SELECT COUNT(*) AS count FROM skill_edges').get()).toEqual({ count: 0 });
    } finally {
      closeDb();
      rmSync(root, { recursive: true, force: true });
    }
  });
});
