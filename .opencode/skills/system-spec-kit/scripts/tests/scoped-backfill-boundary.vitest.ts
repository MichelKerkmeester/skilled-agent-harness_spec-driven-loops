import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  generateFolderDescriptions,
  isGeneratedMetadataZExclusionEnabled,
} from '../../mcp_server/lib/search/folder-discovery.js';
import { isExcludedFromGeneratedMetadata, shouldIndexForMemory } from '../../mcp_server/lib/utils/index-scope.js';
import { planBackfill, runBackfill } from '../graph/backfill-graph-metadata.js';

const createdRoots = new Set<string>();

function writePacket(specFolder: string, title: string, summary: string): void {
  fs.mkdirSync(specFolder, { recursive: true });
  fs.writeFileSync(path.join(specFolder, 'spec.md'), [
    '---',
    `title: "${title}"`,
    `description: "${summary}"`,
    'trigger_phrases: ["graph metadata", "scoped boundary"]',
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
}

function createSpecTree(): { repoRoot: string; specsRoot: string } {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'scoped-backfill-'));
  createdRoots.add(repoRoot);

  const specsRoot = path.join(repoRoot, '.opencode', 'specs');
  writePacket(
    path.join(specsRoot, 'system-spec-kit', '910-target-packet'),
    'Target Packet',
    'Refresh a single packet through the scoped backfill boundary.',
  );
  writePacket(
    path.join(specsRoot, 'system-spec-kit', '911-sibling-packet'),
    'Sibling Packet',
    'A sibling packet that a scoped run must never dirty.',
  );

  return { repoRoot, specsRoot };
}

afterEach(() => {
  delete process.env.SPECKIT_GENERATED_METADATA_Z_EXCLUSION;
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('scoped backfill boundary', () => {
  it('refreshes only the targeted packet and touches no sibling by default', () => {
    const { specsRoot } = createSpecTree();
    const target = path.join(specsRoot, 'system-spec-kit', '910-target-packet');
    const sibling = path.join(specsRoot, 'system-spec-kit', '911-sibling-packet');

    const plan = planBackfill([target]);
    expect(plan.ok).toBe(true);
    if (!plan.ok) return;
    expect(plan.options.specFolder).toBe(target);

    const summary = runBackfill(plan.options);
    expect(summary.scope).toBe('scoped');
    expect(summary.totalSpecFolders).toBe(1);
    expect(summary.created).toBe(1);

    expect(fs.existsSync(path.join(target, 'graph-metadata.json'))).toBe(true);
    expect(fs.existsSync(path.join(sibling, 'graph-metadata.json'))).toBe(false);
  });

  it('accepts --spec-folder as the scoped target', () => {
    const { specsRoot } = createSpecTree();
    const target = path.join(specsRoot, 'system-spec-kit', '910-target-packet');

    const plan = planBackfill(['--spec-folder', target]);
    expect(plan.ok).toBe(true);
    if (!plan.ok) return;
    expect(plan.options.specFolder).toBe(target);
  });

  it('rejects a missing target without --all', () => {
    const plan = planBackfill(['--dry-run']);
    expect(plan.ok).toBe(false);
    if (plan.ok) return;
    expect(plan.error).toContain('target spec folder is required');
  });

  it('rejects an unknown argument', () => {
    const plan = planBackfill(['--bogus']);
    expect(plan.ok).toBe(false);
    if (plan.ok) return;
    expect(plan.error).toContain('unknown argument');
  });

  it('rejects a target that resolves outside a supported specs root', () => {
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'scoped-backfill-outside-'));
    createdRoots.add(outside);
    const stray = path.join(outside, '910-stray-packet');
    writePacket(stray, 'Stray Packet', 'A packet that does not sit under any specs root.');

    const plan = planBackfill([stray]);
    expect(plan.ok).toBe(false);
    if (plan.ok) return;
    expect(plan.error).toContain('outside a supported specs root');
  });

  it('keeps the broad walk behind --all', () => {
    const { specsRoot } = createSpecTree();

    const plan = planBackfill(['--all', '--dry-run', '--root', specsRoot]);
    expect(plan.ok).toBe(true);
    if (!plan.ok) return;
    expect(plan.options.specFolder).toBeUndefined();

    const summary = runBackfill(plan.options);
    expect(summary.scope).toBe('all');
    expect(summary.totalSpecFolders).toBe(2);
  });

  it('cannot combine --all with a target', () => {
    const { specsRoot } = createSpecTree();
    const target = path.join(specsRoot, 'system-spec-kit', '910-target-packet');

    const plan = planBackfill(['--all', target]);
    expect(plan.ok).toBe(false);
    if (plan.ok) return;
    expect(plan.error).toContain('cannot combine --all');
  });
});

describe('per-folder failure isolation', () => {
  it('reports a corrupt folder failed while every healthy folder still refreshes', () => {
    const { specsRoot } = createSpecTree();
    const corrupt = path.join(specsRoot, 'system-spec-kit', '910-target-packet');
    // A directory where graph-metadata.json should be makes the refresh throw.
    fs.mkdirSync(path.join(corrupt, 'graph-metadata.json'), { recursive: true });

    const summary = runBackfill({ dryRun: false, root: specsRoot });
    expect(summary.scope).toBe('all');
    expect(summary.failed).toHaveLength(1);
    expect(summary.failed[0].specFolder).toBe(corrupt);

    // The healthy sibling still got its graph-metadata.json.
    const sibling = path.join(specsRoot, 'system-spec-kit', '911-sibling-packet');
    expect(fs.existsSync(path.join(sibling, 'graph-metadata.json'))).toBe(true);
  });
});

describe('authoritative z_* exclusion helper', () => {
  it('flags every z_* segment for generated metadata while memory keeps z_archive', () => {
    expect(isExcludedFromGeneratedMetadata('/specs/system-spec-kit/z_future/001-x/graph-metadata.json')).toBe(true);
    expect(isExcludedFromGeneratedMetadata('/specs/system-spec-kit/z_archive/001-x/graph-metadata.json')).toBe(true);
    expect(isExcludedFromGeneratedMetadata('/specs/system-spec-kit/910-active/graph-metadata.json')).toBe(false);

    // The two policies do not collide: z_archive stays searchable in memory.
    expect(shouldIndexForMemory('/specs/system-spec-kit/z_archive/001-x/spec.md')).toBe(true);
    expect(shouldIndexForMemory('/specs/system-spec-kit/z_future/001-x/spec.md')).toBe(false);
  });

  it('refuses a z_* prefixed folder in the description scanner by default', () => {
    const { specsRoot } = createSpecTree();
    writePacket(
      path.join(specsRoot, 'system-spec-kit', 'z_future', '001-staging-packet'),
      'Staging Packet',
      'A z_future staging packet that must never enter the descriptions cache.',
    );

    expect(isGeneratedMetadataZExclusionEnabled()).toBe(true);
    const cache = generateFolderDescriptions([specsRoot]);
    const folders = cache.folders.map((folder) => folder.specFolder);
    expect(folders.some((folder) => folder.includes('z_future'))).toBe(false);
    expect(folders.some((folder) => folder.includes('910-target-packet'))).toBe(true);
  });

  it('restores the prior scanner behavior when the flag is toggled off', () => {
    const { specsRoot } = createSpecTree();
    writePacket(
      path.join(specsRoot, 'system-spec-kit', 'z_future', '001-staging-packet'),
      'Staging Packet',
      'A z_future staging packet admitted only when the exclusion is disabled.',
    );

    process.env.SPECKIT_GENERATED_METADATA_Z_EXCLUSION = 'false';
    expect(isGeneratedMetadataZExclusionEnabled()).toBe(false);
    const cache = generateFolderDescriptions([specsRoot]);
    const folders = cache.folders.map((folder) => folder.specFolder);
    expect(folders.some((folder) => folder.includes('z_future'))).toBe(true);
  });
});
