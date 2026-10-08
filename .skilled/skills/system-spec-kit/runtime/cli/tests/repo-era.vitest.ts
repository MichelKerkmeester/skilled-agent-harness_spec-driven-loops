// ───────────────────────────────────────────────────────────────────
// MODULE: Repository Era Report Tests
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { buildReport, classifyRepo } from '../spec/repo-era.mjs';

const temporaryRoots: string[] = [];

function makeTemporaryRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-repo-era-'));
  temporaryRoots.push(root);
  return root;
}

function writeDocument(
  name: string,
  marker: string | null,
  options: { frontmatter?: boolean; body?: string } = {},
): string {
  const frontmatter = options.frontmatter === false ? '' : '---\ntitle: Fixture document\n---\n';
  const templateMarker = marker
    ? `<!-- SPECKIT_TEMPLATE_SOURCE: ${marker} -->\n`
    : '';
  return `${frontmatter}${templateMarker}# ${name}\n${options.body ?? ''}`;
}

function writePacket(
  root: string,
  relativeDirectory: string,
  options: {
    level?: string;
    status?: string;
    missingFrontmatter?: string[];
    markerOverrides?: Record<string, string | null>;
    extraDocuments?: Record<string, string | null>;
    metadata?: 'valid' | 'stub' | 'missing';
  } = {},
): string {
  const directory = path.join(root, relativeDirectory);
  fs.mkdirSync(directory, { recursive: true });

  const level = options.level ?? '1';
  const status = options.status ?? 'Planned';
  const documents: Record<string, string | null> = {
    'spec.md': 'spec-core | v2.2',
    'plan.md': 'plan-core | v2.2',
    'tasks.md': 'tasks-core | v2.2',
    ...options.markerOverrides,
    ...options.extraDocuments,
  };

  for (const [name, marker] of Object.entries(documents)) {
    const body = name === 'spec.md'
      ? `<!-- SPECKIT_LEVEL: ${level} -->\n| **Level** | ${level} |\n| **Status** | ${status} |\n`
      : name === 'tasks.md' && status === 'Complete'
        ? '- [x] Fixture task completed\n'
        : '';
    const text = writeDocument(name, marker, {
      frontmatter: !options.missingFrontmatter?.includes(name),
      body,
    });
    fs.writeFileSync(path.join(directory, name), text, 'utf8');
  }

  if (options.metadata !== 'missing') {
    const packetPath = relativeDirectory.replace(/^\.opencode\//, '');
    const metadata = options.metadata === 'stub'
      ? {
          packet_id: packetPath,
          spec_folder: packetPath,
          derived: { status: 'stub' },
        }
      : {
          packet_id: packetPath,
          spec_folder: packetPath,
          derived: {
            trigger_phrases: ['fixture packet'],
            key_topics: ['fixture'],
            entities: [],
            source_docs: ['spec.md', 'plan.md', 'tasks.md'],
          },
        };
    fs.writeFileSync(path.join(directory, 'graph-metadata.json'), JSON.stringify(metadata), 'utf8');
  }
  return directory;
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('repository era report', () => {
  it('counts unique packets, excludes artifacts, and includes archived packets', () => {
    const root = makeTemporaryRoot();
    const ignoredPath = 'specs/fixture-track/001-packet/ignored/007-copy/';
    const ignored = new Set([ignoredPath]);

    for (let number = 1; number <= 19; number += 1) {
      const id = `${String(number).padStart(3, '0')}-packet`;
      const options = number === 2
        ? { missingFrontmatter: ['plan.md'] }
        : number === 3
          ? { markerOverrides: { 'tasks.md': null } }
          : number === 4
            ? { markerOverrides: { 'tasks.md': 'tasks-core | v1.0' } }
            : number === 5
              ? { metadata: 'missing' as const }
              : number === 6
                ? { metadata: 'stub' as const }
                : number === 7
                  ? { level: '2', status: 'Complete' }
                  : {};
      const directory = writePacket(root, `specs/fixture-track/${id}`, options);

      if (number === 8) {
        writePacket(root, `specs/fixture-track/${id}`, {
          extraDocuments: {
            'alias-a.md': 'impl-summary-core | v2.2',
            'alias-b.md': 'implementation-summary-core | v2.2',
            'alias-c.md': 'implementation-summary | v2.2',
            'resource-map-old.md': 'resource-map | v1.1',
            'resource-map-legacy.md': 'resource-map | v2.2',
          },
        });
      }

      if (number === 10) {
        fs.writeFileSync(
          path.join(directory, 'description.json'),
          JSON.stringify({ specFolder: '.opencode/specs/fixture-track/010-packet' }),
          'utf8',
        );
      }
    }

    writePacket(root, 'specs/z_archive/archive-track/020-archived-packet');
    writePacket(root, 'specs/fixture-track/z_archive/021-track-archived-packet');
    writePacket(root, 'specs/fixture-track/001-packet/z_archive/022-nested-archived-packet');
    writePacket(root, 'specs/fixture-track/001-packet/research/002-containment-copy');
    writePacket(root, 'specs/fixture-track/001-packet/research/lineages/003-lineage-copy');
    writePacket(root, 'specs/fixture-track/001-packet/review/004-review-copy');
    writePacket(root, 'specs/fixture-track/001-packet/context/005-context-copy');
    writePacket(root, 'specs/fixture-track/001-packet/scratch/006-scratch-copy');
    writePacket(root, ignoredPath.slice(0, -1));
    writePacket(root, 'specs/z_archive/00-changelog/008-changelog-copy');

    const result = classifyRepo(root, { ignored });
    const packetPaths = result.packets.map((packet) => packet.path);
    const excludedPaths = result.excluded.map((entry) => entry.path);
    const packetFor = (id: string) => result.packets.find(
      (packet) => packet.path.endsWith(`/${id}`),
    );
    const report = buildReport(result);
    const hasExcludedCopy = packetPaths.some((packetPath) => (
      /(?:containment|lineage|review|context|scratch|ignored|changelog)-copy/.test(packetPath)
    ));
    const missingFrontmatter = packetFor('002-packet')?.documents
      .find((document) => document.name === 'plan.md')?.frontmatter;
    const markerlessTask = packetFor('003-packet')?.documents
      .find((document) => document.name === 'tasks.md')?.templateMarker.status;
    const legacyTask = packetFor('004-packet')?.documents
      .find((document) => document.name === 'tasks.md')?.templateMarker.status;

    expect(result.packets).toHaveLength(22);
    expect(packetPaths).toContain('specs/z_archive/archive-track/020-archived-packet');
    expect(packetPaths).toContain('specs/fixture-track/z_archive/021-track-archived-packet');
    expect(packetPaths).toContain('specs/fixture-track/001-packet/z_archive/022-nested-archived-packet');
    expect(
      packetPaths.filter((packetPath) => packetPath === 'specs/fixture-track/001-packet'),
    ).toHaveLength(1);
    expect(hasExcludedCopy).toBe(false);
    expect(excludedPaths).toContain('specs/fixture-track/001-packet/research');
    expect(excludedPaths).toContain('specs/fixture-track/001-packet/research/lineages');
    expect(excludedPaths).toContain('specs/fixture-track/001-packet/review');
    expect(excludedPaths).toContain('specs/fixture-track/001-packet/context');
    expect(excludedPaths).toContain('specs/fixture-track/001-packet/scratch');
    expect(excludedPaths).toContain('specs/fixture-track/001-packet/ignored/007-copy');
    expect(excludedPaths).toContain('specs/z_archive/00-changelog');
    expect(result.layout).toEqual({
      v3: true,
      v4: true,
      kind: 'both',
      provenance: { source: 'description-residue', residueCount: 1 },
    });
    expect(missingFrontmatter).toBe(false);
    expect(markerlessTask).toBe('none');
    expect(legacyTask).toBe('legacy');
    expect(packetFor('005-packet')?.generatedMetadata.status).toBe('missing');
    expect(packetFor('006-packet')?.generatedMetadata.status).toBe('stub');
    expect(packetFor('007-packet')?.levelDocuments.status).toBe('mismatch');
    expect(report.signals.frontmatter.missing).toBeGreaterThan(0);
    expect(report.signals.templateMarkers.new).toBeGreaterThan(0);
    expect(report.signals.templateMarkers.legacy).toBeGreaterThan(0);
    expect(report.signals.templateMarkers.none).toBeGreaterThan(0);
    expect(report.signals.generatedMetadata.present).toBeGreaterThan(0);
    expect(report.signals.generatedMetadata.stub).toBeGreaterThan(0);
    expect(report.signals.generatedMetadata.missing).toBeGreaterThan(0);
    expect(report.signals.levelDocuments.mismatch).toBeGreaterThan(0);
    expect(report.totals.frontmatter).toBe(
      report.signals.frontmatter.present + report.signals.frontmatter.missing,
    );
    expect(report.totals.templateMarkers).toBe(
      report.signals.templateMarkers.new
        + report.signals.templateMarkers.legacy
        + report.signals.templateMarkers.none,
    );
  });

  it('normalizes drifting headers and makes report totals agree with packet tallies', () => {
    const root = makeTemporaryRoot();
    const packetDirectory = writePacket(root, 'specs/fixture-track/001-aliases', {
      extraDocuments: {
        'alias-a.md': 'impl-summary-core | v2.2',
        'alias-b.md': 'implementation-summary-core | v2.2',
        'alias-c.md': 'implementation-summary | v2.2',
        'resource-map-old.md': 'resource-map | v1.1',
        'resource-map-legacy.md': 'resource-map | v2.2',
      },
    });
    const classification = classifyRepo(root);
    const packet = classification.packets.find(
      (candidate) => candidate.directory === packetDirectory,
    );
    const report = buildReport(classification);
    const documents = classification.packets.flatMap((candidate) => candidate.documents);
    const aliases = packet?.documents
      .filter((document) => document.templateMarker.canonical === 'implementation-summary')
      .map((document) => document.templateMarker.source);
    const currentResourceMap = packet?.documents
      .find((document) => document.name === 'resource-map-old.md')?.templateMarker.status;
    const legacyResourceMap = packet?.documents
      .find((document) => document.name === 'resource-map-legacy.md')?.templateMarker.status;

    expect(aliases).toEqual([
      'impl-summary-core',
      'implementation-summary-core',
      'implementation-summary',
    ]);
    expect(currentResourceMap).toBe('new');
    expect(legacyResourceMap).toBe('legacy');
    expect(
      report.signals.frontmatter.present + report.signals.frontmatter.missing,
    ).toBe(documents.length);
    expect(
      report.signals.templateMarkers.new
        + report.signals.templateMarkers.legacy
        + report.signals.templateMarkers.none,
    ).toBe(documents.length);
    expect(
      report.signals.generatedMetadata.present
        + report.signals.generatedMetadata.stub
        + report.signals.generatedMetadata.missing,
    ).toBe(classification.packets.length);
    expect(
      report.signals.levelDocuments.match
        + report.signals.levelDocuments.mismatch
        + report.signals.levelDocuments.unknown,
    ).toBe(classification.packets.length);
    expect(report.totals).toEqual({
      packets: classification.packets.length,
      documents: documents.length,
      frontmatter: documents.length,
      templateMarkers: documents.length,
      generatedMetadata: classification.packets.length,
      levelDocuments: classification.packets.length,
    });
  });

  it('distinguishes v3 and v4 roots and flags a level document-set mismatch', () => {
    const v3Root = makeTemporaryRoot();
    const v3Directory = writePacket(v3Root, '.opencode/specs/legacy-track/001-old-packet');
    const v3 = classifyRepo(v3Root);
    const v3FromSpecRoot = classifyRepo(path.join(v3Root, '.opencode', 'specs'));

    expect(v3.layout).toEqual({
      v3: true,
      v4: false,
      kind: 'v3',
      provenance: { source: 'legacy-root', residueCount: 0 },
    });
    expect(v3.packets[0]?.directory).toBe(v3Directory);
    expect(v3FromSpecRoot.packets).toHaveLength(1);

    const v4Root = makeTemporaryRoot();
    writePacket(v4Root, 'specs/fixture-track/001-complete-without-summary', {
      level: '2',
      status: 'Complete',
    });
    const v4 = classifyRepo(v4Root);
    const v4FromSpecRoot = classifyRepo(path.join(v4Root, 'specs'));

    expect(v4.layout).toEqual({
      v3: false,
      v4: true,
      kind: 'v4',
      provenance: { source: null, residueCount: 0 },
    });
    expect(v4FromSpecRoot.packets).toHaveLength(1);
    expect(v4.packets[0]?.levelDocuments.status).toBe('mismatch');
    expect(v4.packets[0]?.levelDocuments.missing).toContain('implementation-summary.md');
  });

  it('ignores prose mentions of the legacy root when detecting layout residue', () => {
    const root = makeTemporaryRoot();
    const packetDirectory = writePacket(root, 'specs/fixture-track/001-prose-only');
    fs.writeFileSync(
      path.join(packetDirectory, 'description.json'),
      JSON.stringify({
        specFolder: 'fixture-track/001-prose-only',
        description: 'The old .opencode/specs path was migrated.',
      }),
      'utf8',
    );

    expect(classifyRepo(root).layout).toEqual({
      v3: false,
      v4: true,
      kind: 'v4',
      provenance: { source: null, residueCount: 0 },
    });
  });

  it('uses the YAML frontmatter level when marker and metadata table are absent', () => {
    const root = makeTemporaryRoot();
    const packetDirectory = writePacket(root, 'specs/fixture-track/001-yaml-level');
    fs.writeFileSync(
      path.join(packetDirectory, 'spec.md'),
      '---\ntitle: Fixture document\nlevel: 2\n---\n# Fixture\n',
      'utf8',
    );

    const packet = classifyRepo(root).packets[0];

    expect(packet?.levelDocuments.level).toBe('2');
    expect(packet?.levelDocuments.status).toBe('match');
  });

  it('checks phase parents against the lean trio instead of their declared level', () => {
    const root = makeTemporaryRoot();
    const parentDirectory = writePacket(root, 'specs/fixture-track/030-parent', {
      level: '2',
    });
    fs.writeFileSync(
      path.join(parentDirectory, 'description.json'),
      JSON.stringify({ specFolder: 'specs/fixture-track/030-parent' }),
      'utf8',
    );
    fs.unlinkSync(path.join(parentDirectory, 'plan.md'));
    fs.unlinkSync(path.join(parentDirectory, 'tasks.md'));
    writePacket(root, 'specs/fixture-track/030-parent/001-child');

    const result = classifyRepo(root);
    const parent = result.packets.find(
      (packet) => packet.path === 'specs/fixture-track/030-parent',
    );

    expect(parent?.levelDocuments).toEqual({
      level: '2',
      status: 'match',
      required: ['spec.md', 'description.json', 'graph-metadata.json'],
      missing: [],
    });
  });
});
