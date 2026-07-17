// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Root Validation Matrix Tests
// ───────────────────────────────────────────────────────────────────

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { resolveSpecFolderCanonical } from '../core/spec-root-canonical-resolver.js';
import { classifySpecRootCollision } from '../core/spec-root-collision-classifier.js';
import {
  materializeRootFixture,
  R_FIXTURES,
} from '../core/spec-root-fixtures.js';
import { assertSpecWriteAllowed } from '../core/spec-root-write-guard.js';

import type { CollisionClass } from '../core/spec-root-collision-classifier.js';
import type {
  MaterializedRootFixture,
  RootFixtureId,
} from '../core/spec-root-fixtures.js';

interface ExpectedResult {
  readonly klass: CollisionClass;
  readonly decision: 'allow' | 'reject';
  readonly resolvedRoot: 'canonical' | 'legacy';
}

const EXPECTED_RESULTS: Record<RootFixtureId, ExpectedResult> = {
  R1: { klass: 'canonical-only', decision: 'allow', resolvedRoot: 'canonical' },
  R2: { klass: 'legacy-only', decision: 'allow', resolvedRoot: 'legacy' },
  R3: { klass: 'same-inode-alias', decision: 'allow', resolvedRoot: 'canonical' },
  R4: { klass: 'canonical-only', decision: 'allow', resolvedRoot: 'canonical' },
  R5: { klass: 'byte-identical-duplicate', decision: 'allow', resolvedRoot: 'canonical' },
  R6: { klass: 'divergent-duplicate', decision: 'reject', resolvedRoot: 'canonical' },
  R7: { klass: 'canonical-only', decision: 'allow', resolvedRoot: 'canonical' },
  R8: { klass: 'canonical-only', decision: 'allow', resolvedRoot: 'canonical' },
  R9: { klass: 'canonical-only', decision: 'allow', resolvedRoot: 'canonical' },
  R10: { klass: 'canonical-only', decision: 'allow', resolvedRoot: 'canonical' },
};

const materializedFixtures: MaterializedRootFixture[] = [];
const tempDirectories: string[] = [];

function getRoots(fixture: MaterializedRootFixture): {
  canonicalRoot: string;
  legacyRoot: string;
} {
  return {
    canonicalRoot: path.join(fixture.workspaceDir, '.opencode', 'specs'),
    legacyRoot: path.join(fixture.workspaceDir, 'specs'),
  };
}

function pathEntryExists(candidatePath: string): boolean {
  try {
    fs.lstatSync(candidatePath);
    return true;
  } catch (_error: unknown) {
    return false;
  }
}

function getOnlyPacketId(rootPath: string): string {
  const trackName = fs.readdirSync(rootPath)[0];
  const packetName = fs.readdirSync(path.join(rootPath, trackName))[0];
  return path.join(trackName, packetName);
}

function expectWriteAllowed(packetId: string, workspaceDir: string): void {
  const freezeDirectory = path.join(path.dirname(workspaceDir), 'freeze');
  fs.mkdirSync(freezeDirectory, { recursive: true });
  vi.stubEnv('SPEC_KIT_WRITER_FREEZE_DIR', freezeDirectory);
  expect(() => assertSpecWriteAllowed(packetId, workspaceDir)).not.toThrow();
}

afterEach(() => {
  for (const fixture of materializedFixtures.splice(0)) {
    fixture.cleanup();
  }
  for (const tempDirectory of tempDirectories.splice(0)) {
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  }
  vi.unstubAllEnvs();
});

describe('spec root source validation matrix', () => {
  it.each(R_FIXTURES)('$id: $name', (rootFixture) => {
    const fixture = materializeRootFixture(rootFixture);
    materializedFixtures.push(fixture);
    const expected = EXPECTED_RESULTS[rootFixture.id];
    const { canonicalRoot, legacyRoot } = getRoots(fixture);
    const freezeDirectory = path.join(fixture.tempDir, 'freeze');
    fs.mkdirSync(freezeDirectory);
    vi.stubEnv('SPEC_KIT_WRITER_FREEZE_DIR', freezeDirectory);

    const collision = classifySpecRootCollision(
      fixture.relativePacketId,
      fixture.physicalRoots,
    );

    expect(collision.klass).toBe(expected.klass);
    expect(collision.decision).toBe(expected.decision);

    const resolvedPacket = resolveSpecFolderCanonical(
      fixture.relativePacketId,
      fixture.workspaceDir,
    );
    const expectedRoot = expected.resolvedRoot === 'canonical' ? canonicalRoot : legacyRoot;
    expect(resolvedPacket).toBe(path.join(expectedRoot, fixture.relativePacketId));

    switch (rootFixture.id) {
      case 'R1':
        expect(pathEntryExists(legacyRoot)).toBe(false);
        break;
      case 'R2':
        expect(pathEntryExists(canonicalRoot)).toBe(false);
        break;
      case 'R3':
        expect(fs.realpathSync(legacyRoot)).toBe(fs.realpathSync(canonicalRoot));
        expect(resolvedPacket.startsWith(canonicalRoot)).toBe(true);
        break;
      case 'R4': {
        const legacyPacketId = getOnlyPacketId(legacyRoot);
        const legacyCollision = classifySpecRootCollision(
          legacyPacketId,
          fixture.physicalRoots,
        );
        expect(legacyCollision).toMatchObject({ klass: 'legacy-only', decision: 'allow' });
        expect(resolveSpecFolderCanonical(legacyPacketId, fixture.workspaceDir))
          .toBe(path.join(legacyRoot, legacyPacketId));
        break;
      }
      case 'R5':
        expect(resolvedPacket.startsWith(canonicalRoot)).toBe(true);
        expect(fs.existsSync(path.join(legacyRoot, fixture.relativePacketId))).toBe(true);
        break;
      case 'R6':
        expect(() => assertSpecWriteAllowed(
          fixture.relativePacketId,
          fixture.workspaceDir,
        )).toThrow(/collision class is divergent-duplicate/u);
        break;
      case 'R7':
        expect(fs.lstatSync(legacyRoot).isSymbolicLink()).toBe(true);
        expect(fs.existsSync(legacyRoot)).toBe(false);
        expect(fixture.physicalRoots.some((root) => root.kind === 'legacy')).toBe(false);
        expectWriteAllowed(fixture.relativePacketId, fixture.workspaceDir);
        expect(fs.existsSync(legacyRoot)).toBe(false);
        break;
      case 'R8': {
        const legacyPacketId = getOnlyPacketId(legacyRoot);
        expect(fs.realpathSync(legacyRoot)).not.toBe(fs.realpathSync(canonicalRoot));
        expect(resolveSpecFolderCanonical(legacyPacketId, fixture.workspaceDir))
          .toBe(path.join(legacyRoot, legacyPacketId));
        break;
      }
      case 'R9':
        expect(fs.lstatSync(legacyRoot).isFile()).toBe(true);
        expect(fixture.physicalRoots.some((root) => root.kind === 'legacy')).toBe(false);
        expectWriteAllowed(fixture.relativePacketId, fixture.workspaceDir);
        expect(fs.lstatSync(legacyRoot).isFile()).toBe(true);
        break;
      case 'R10': {
        const externalRoot = fs.realpathSync(legacyRoot);
        const externalPacket = path.join(externalRoot, fixture.relativePacketId, 'spec.md');
        const externalContent = fs.readFileSync(externalPacket, 'utf8');
        const relativeExternalRoot = path.relative(fixture.workspaceDir, externalRoot);
        expect(relativeExternalRoot.startsWith(`..${path.sep}`)).toBe(true);
        expect(fixture.physicalRoots.some((root) => root.kind === 'legacy')).toBe(false);
        expect(fs.readFileSync(path.join(resolvedPacket, 'spec.md'), 'utf8'))
          .not.toBe(externalContent);
        expect(() => assertSpecWriteAllowed(
          fixture.relativePacketId,
          fixture.workspaceDir,
        )).toThrow(/collision class is divergent-duplicate/u);
        expect(fs.readFileSync(externalPacket, 'utf8')).toBe(externalContent);
        break;
      }
    }
  });

  it('keeps unqualified guarded writes canonical when no alias exists', () => {
    const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-root-no-alias-'));
    tempDirectories.push(tempDirectory);
    const workspaceDir = path.join(tempDirectory, 'workspace');
    const packetId = 'system-speckit/001-no-alias';
    const canonicalPacket = path.join(workspaceDir, '.opencode', 'specs', packetId);
    const legacyRoot = path.join(workspaceDir, 'specs');
    const freezeDirectory = path.join(tempDirectory, 'freeze');
    fs.mkdirSync(canonicalPacket, { recursive: true });
    fs.mkdirSync(freezeDirectory);
    fs.writeFileSync(path.join(canonicalPacket, 'spec.md'), '# No alias\n', 'utf8');
    vi.stubEnv('SPEC_KIT_WRITER_FREEZE_DIR', freezeDirectory);

    const resolvedPacket = resolveSpecFolderCanonical(packetId, workspaceDir);
    assertSpecWriteAllowed(packetId, workspaceDir);
    fs.writeFileSync(path.join(resolvedPacket, 'implementation-summary.md'), '# Saved\n', 'utf8');

    expect(resolvedPacket).toBe(canonicalPacket);
    expect(fs.existsSync(path.join(canonicalPacket, 'implementation-summary.md'))).toBe(true);
    expect(pathEntryExists(legacyRoot)).toBe(false);
  });
});
