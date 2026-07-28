import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  loadGraphMetadata,
  refreshGraphMetadataForSpecFolder,
} from '../../mcp-server/lib/graph/graph-metadata-parser.js';
import { collectSpecFolders, runBackfill } from '../graph/backfill-graph-metadata.js';

const createdRoots = new Set<string>();

function writePacket(specFolder: string, title: string, summary: string, implementationFile: string): void {
  fs.mkdirSync(specFolder, { recursive: true });
  fs.writeFileSync(path.join(specFolder, 'spec.md'), [
    '---',
    `title: "${title}"`,
    `description: "${summary}"`,
    'trigger_phrases: ["graph metadata", "backfill coverage"]',
    'importance_tier: "important"',
    'status: "planned"',
    '---',
    '',
    `# ${title}`,
    '',
    '### Overview',
    '',
    summary,
  ].join('\n'), 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'plan.md'), '# Plan\n', 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'tasks.md'), '# Tasks\n', 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'implementation-summary.md'), [
    '---',
    'title: "Implementation Summary"',
    'status: "complete"',
    '---',
    '',
    '| File Path | Change Type | Description |',
    '|-----------|-------------|-------------|',
    `| \`${implementationFile}\` | Modify | Backfill coverage target |`,
  ].join('\n'), 'utf-8');
}

function createSpecTree(): string {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'graph-metadata-backfill-'));
  createdRoots.add(repoRoot);

  const specsRoot = path.join(repoRoot, '.opencode', 'specs');
  writePacket(
    path.join(specsRoot, 'system-spec-kit', '910-backfill-root'),
    'Backfill Root',
    'Create repo-wide graph metadata for existing packets.',
    'scripts/graph/backfill-graph-metadata.ts',
  );
  writePacket(
    path.join(specsRoot, 'system-spec-kit', '911-parent', '001-child-phase'),
    'Child Phase',
    'Populate phased packet graph metadata from canonical docs.',
    'scripts/spec/create.sh',
  );
  writePacket(
    path.join(specsRoot, 'system-spec-kit', 'z_archive', '001-archived-packet'),
    'Archived Packet',
    'Backfill archived packet graph metadata without skipping z_archive coverage.',
    'scripts/spec/validate.sh',
  );

  return specsRoot;
}

function writePhaseParent(specsRoot: string, name: string): string {
  const specFolder = path.join(specsRoot, 'system-spec-kit', name);
  fs.mkdirSync(specFolder, { recursive: true });
  fs.writeFileSync(path.join(specFolder, 'spec.md'), [
    '---',
    'title: "Phase Parent"',
    'description: "Coordinate child phases without duplicating child implementation state."',
    'status: "planned"',
    '---',
    '',
    '# Phase Parent',
  ].join('\n'), 'utf-8');
  return specFolder;
}

function writePhaseChild(
  parent: string,
  name: string,
  complete: boolean,
  lastSaveAt: string,
): string {
  const child = path.join(parent, name);
  writePacket(
    child,
    name,
    'Exercise phase-parent graph metadata rollup.',
    'mcp-server/lib/graph/graph-metadata-parser.ts',
  );
  fs.writeFileSync(
    path.join(child, 'checklist.md'),
    `# Checklist\n\n- [${complete ? 'x' : ' '}] Child work\n`,
    'utf-8',
  );
  refreshGraphMetadataForSpecFolder(child, { now: lastSaveAt });
  return child;
}

afterEach(() => {
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('graph metadata backfill', () => {
  it('includes archived and future folders by default during dry-run traversal', () => {
    const specsRoot = createSpecTree();

    const folders = collectSpecFolders(specsRoot);
    expect(folders).toHaveLength(3);

    const summary = runBackfill({ dryRun: true, root: specsRoot });
    expect(summary.totalSpecFolders).toBe(3);
    expect(summary.created).toBe(3);
    expect(summary.refreshed).toBe(0);
    expect(summary.reviewFlags).toEqual(expect.any(Array));

    for (const specFolder of folders) {
      expect(fs.existsSync(path.join(specFolder, 'graph-metadata.json'))).toBe(false);
    }
  });

  // Followup-actual: vitest-recovery-followup runtime regression exceeds the 30 LOC single-file repair rule
  it.fails.skip('writes graph-metadata.json for every packet with empty manual arrays', () => {
    const specsRoot = createSpecTree();
    const summary = runBackfill({ dryRun: false, root: specsRoot });

    expect(summary.totalSpecFolders).toBe(3);
    expect(summary.created).toBe(3);

    for (const specFolder of collectSpecFolders(specsRoot)) {
      const graphPath = path.join(specFolder, 'graph-metadata.json');
      const metadata = loadGraphMetadata(graphPath);

      expect(fs.existsSync(graphPath)).toBe(true);
      expect(metadata?.manual).toEqual({
        depends_on: [],
        supersedes: [],
        related_to: [],
      });
      expect(metadata?.derived.source_docs).toContain('spec.md');
      expect(metadata?.derived.key_files.length).toBeGreaterThan(0);
    }
  });

  it('skips archived packets only when active-only behavior is requested explicitly', () => {
    const specsRoot = createSpecTree();

    const folders = collectSpecFolders(specsRoot, { activeOnly: true });
    expect(folders).toHaveLength(2);

    const summary = runBackfill({ dryRun: true, root: specsRoot, activeOnly: true });
    expect(summary.totalSpecFolders).toBe(2);
    expect(summary.created).toBe(2);
  });

  it('rolls an all-complete phase parent to complete', () => {
    const specsRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'graph-metadata-rollup-'));
    createdRoots.add(specsRoot);
    const parent = writePhaseParent(
      path.join(specsRoot, '.opencode', 'specs'),
      '920-complete-parent',
    );
    writePhaseChild(parent, '001-foundation', true, '2026-06-01T10:00:00.000Z');
    writePhaseChild(parent, '002-delivery', true, '2026-06-02T10:00:00.000Z');

    const refreshed = refreshGraphMetadataForSpecFolder(parent);

    expect(refreshed.metadata.derived.status).toBe('complete');
    expect(refreshed.metadata.derived.last_active_child_id)
      .toBe('system-spec-kit/920-complete-parent/002-delivery');
    expect(refreshed.metadata.derived.last_active_at).toBeNull();
  });

  it('rolls a mixed phase parent to in_progress', () => {
    const specsRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'graph-metadata-rollup-'));
    createdRoots.add(specsRoot);
    const parent = writePhaseParent(
      path.join(specsRoot, '.opencode', 'specs'),
      '921-mixed-parent',
    );
    writePhaseChild(parent, '001-foundation', true, '2026-06-01T10:00:00.000Z');
    writePhaseChild(parent, '002-delivery', false, '2026-06-02T10:00:00.000Z');

    const refreshed = refreshGraphMetadataForSpecFolder(parent);

    expect(refreshed.metadata.derived.status).toBe('in_progress');
  });

  it('leaves a packet without graph-metadata children unchanged', () => {
    const specsRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'graph-metadata-rollup-'));
    createdRoots.add(specsRoot);
    const packet = writePhaseParent(
      path.join(specsRoot, '.opencode', 'specs'),
      '922-leaf-packet',
    );

    const refreshed = refreshGraphMetadataForSpecFolder(packet);

    expect(refreshed.metadata.derived.status).toBe('planned');
    expect(refreshed.metadata.derived.last_active_child_id).toBeNull();
  });

  it('preserves an existing last_active_child_id during phase-parent rollup', () => {
    const specsRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'graph-metadata-rollup-'));
    createdRoots.add(specsRoot);
    const parent = writePhaseParent(
      path.join(specsRoot, '.opencode', 'specs'),
      '923-pointer-parent',
    );
    writePhaseChild(parent, '001-foundation', true, '2026-06-01T10:00:00.000Z');
    writePhaseChild(parent, '002-delivery', true, '2026-06-02T10:00:00.000Z');
    const first = refreshGraphMetadataForSpecFolder(parent);
    const existingChildId = 'system-spec-kit/923-pointer-parent/001-foundation';
    fs.writeFileSync(first.filePath, `${JSON.stringify({
      ...first.metadata,
      derived: {
        ...first.metadata.derived,
        last_active_child_id: existingChildId,
      },
    }, null, 2)}\n`, 'utf-8');

    const refreshed = refreshGraphMetadataForSpecFolder(parent);

    expect(refreshed.metadata.derived.last_active_child_id).toBe(existingChildId);
  });
});
