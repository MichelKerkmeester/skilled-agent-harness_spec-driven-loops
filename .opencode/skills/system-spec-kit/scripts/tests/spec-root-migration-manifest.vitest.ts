// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Root Migration Manifest Tests
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { buildMigrationManifest } from '../core/spec-root-migration-manifest.js';

// ───────────────────────────────────────────────────────────────────
// 1. TEST HELPERS
// ───────────────────────────────────────────────────────────────────

const temporaryDirectories: string[] = [];

function createWorkspace(): string {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-root-manifest-'));
  temporaryDirectories.push(tempDirectory);
  const workspacePath = path.join(tempDirectory, 'workspace');
  fs.mkdirSync(workspacePath);
  return workspacePath;
}

function createPacket(
  rootPath: string,
  relativePacketId: string,
  files: Record<string, string>,
): void {
  const packetPath = path.join(rootPath, relativePacketId);
  fs.mkdirSync(packetPath, { recursive: true });

  for (const [relativePath, content] of Object.entries(files)) {
    const filePath = path.join(packetPath, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 2. TEST CASES
// ───────────────────────────────────────────────────────────────────

describe('buildMigrationManifest', () => {
  it('enumerates canonical packets when the legacy root is missing', () => {
    const workspacePath = createWorkspace();
    const canonicalRoot = path.join(workspacePath, '.opencode', 'specs');
    createPacket(canonicalRoot, 'track/002-description-only', {
      'description.json': '{"title":"Description only"}\n',
    });
    createPacket(canonicalRoot, 'track/001-with-spec', {
      'nested/evidence.txt': 'evidence\n',
      'spec.md': '# Packet\n',
    });

    const manifest = buildMigrationManifest(workspacePath);

    expect(manifest.entries.map((entry) => entry.relativePacketId)).toEqual([
      'track/001-with-spec',
      'track/002-description-only',
    ]);
    expect(manifest.entries.every((entry) => entry.klass === 'canonical-only')).toBe(true);
    expect(manifest.entries.every((entry) => entry.decision === 'allow')).toBe(true);
    expect(manifest.entries.every((entry) => /^[a-f0-9]{64}$/u.test(entry.fileSetHash)))
      .toBe(true);
    expect(manifest.entries[0].roots).toEqual([canonicalRoot]);
    expect(manifest.divergentCount).toBe(0);
  });

  it('classifies the union of packet identities across independent roots', () => {
    const workspacePath = createWorkspace();
    const canonicalRoot = path.join(workspacePath, '.opencode', 'specs');
    const legacyRoot = path.join(workspacePath, 'specs');
    const sharedFiles = { 'notes/a.txt': 'same\n', 'spec.md': '# Same\n' };

    createPacket(canonicalRoot, 'track/001-canonical', { 'spec.md': '# Canonical\n' });
    createPacket(legacyRoot, 'track/002-legacy', { 'spec.md': '# Legacy\n' });
    createPacket(canonicalRoot, 'track/003-identical', sharedFiles);
    createPacket(legacyRoot, 'track/003-identical', sharedFiles);
    createPacket(canonicalRoot, 'track/004-divergent', { 'spec.md': '# Canonical\n' });
    createPacket(legacyRoot, 'track/004-divergent', { 'spec.md': '# Legacy\n' });

    const manifest = buildMigrationManifest(workspacePath);

    expect(manifest.entries.map((entry) => [
      entry.relativePacketId,
      entry.klass,
      entry.decision,
    ])).toEqual([
      ['track/001-canonical', 'canonical-only', 'allow'],
      ['track/002-legacy', 'legacy-only', 'allow'],
      ['track/003-identical', 'byte-identical-duplicate', 'allow'],
      ['track/004-divergent', 'divergent-duplicate', 'reject'],
    ]);
    expect(manifest.entries[2].roots).toEqual([canonicalRoot, legacyRoot]);
    expect(manifest.divergentCount).toBe(1);
  });

  it('produces stable content hashes independent of root spelling and directory order', () => {
    const workspacePath = createWorkspace();
    const canonicalRoot = path.join(workspacePath, '.opencode', 'specs');
    const legacyRoot = path.join(workspacePath, 'specs');
    const files = {
      'nested/z.txt': 'last\n',
      'nested/a.txt': 'first\n',
      'spec.md': '# Stable\n',
    };

    createPacket(canonicalRoot, 'track/001-canonical', files);
    createPacket(legacyRoot, 'track/002-legacy', files);

    const firstManifest = buildMigrationManifest(workspacePath);
    const secondManifest = buildMigrationManifest(workspacePath);

    expect(firstManifest).toEqual(secondManifest);
    expect(firstManifest.entries[0].fileSetHash).toBe(firstManifest.entries[1].fileSetHash);

    fs.writeFileSync(
      path.join(legacyRoot, 'track/002-legacy', 'nested', 'a.txt'),
      'changed\n',
      'utf8',
    );
    const changedManifest = buildMigrationManifest(workspacePath);
    expect(changedManifest.entries[1].fileSetHash).not.toBe(firstManifest.entries[1].fileSetHash);
  });

  it('classifies a workspace-relative root alias without duplicate entries', () => {
    const workspacePath = createWorkspace();
    const canonicalRoot = path.join(workspacePath, '.opencode', 'specs');
    const legacyRoot = path.join(workspacePath, 'specs');
    createPacket(canonicalRoot, 'track/001-alias', { 'spec.md': '# Alias\n' });
    fs.symlinkSync(path.join('.opencode', 'specs'), legacyRoot, 'dir');

    const manifest = buildMigrationManifest(workspacePath);

    expect(manifest.entries).toHaveLength(1);
    expect(manifest.entries[0]).toMatchObject({
      relativePacketId: 'track/001-alias',
      klass: 'same-inode-alias',
      roots: [canonicalRoot, legacyRoot],
      decision: 'allow',
    });
    expect(manifest.divergentCount).toBe(0);
  });

  it('rejects an existing root that resolves outside the workspace', () => {
    const workspacePath = createWorkspace();
    const canonicalRoot = path.join(workspacePath, '.opencode', 'specs');
    const externalRoot = path.join(path.dirname(workspacePath), 'external-specs');
    createPacket(canonicalRoot, 'track/001-canonical', { 'spec.md': '# Canonical\n' });
    createPacket(externalRoot, 'track/002-external', { 'spec.md': '# External\n' });
    fs.symlinkSync(externalRoot, path.join(workspacePath, 'specs'), 'dir');

    expect(() => buildMigrationManifest(workspacePath)).toThrow(
      'Spec root resolves outside the workspace',
    );
  });
});
