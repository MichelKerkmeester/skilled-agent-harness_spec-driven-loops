// -----------------------------------------------------------------------------
// MODULE: Spec Root Fixtures
// -----------------------------------------------------------------------------

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import type {
  CollisionClass,
  PhysicalRoot,
} from './spec-root-collision-classifier.js';

/** Identifier for one root-state validation cell. */
export type RootFixtureId =
  | 'R1'
  | 'R2'
  | 'R3'
  | 'R4'
  | 'R5'
  | 'R6'
  | 'R7'
  | 'R8'
  | 'R9'
  | 'R10';

/** Expected state and classifier assertion for one root fixture. */
export interface RootFixture {
  readonly id: RootFixtureId;
  readonly name: string;
  readonly setup: string;
  readonly expectedClass?: CollisionClass;
  readonly expectedDecision: 'allow' | 'reject' | 'n/a';
}

/** Temporary filesystem state and classifier input produced from a root fixture. */
export interface MaterializedRootFixture {
  readonly fixture: RootFixture;
  readonly tempDir: string;
  readonly workspaceDir: string;
  readonly relativePacketId: string;
  readonly physicalRoots: PhysicalRoot[];
  cleanup(): void;
}

/** Expected outcomes for the complete root-resolution validation matrix. */
export const R_FIXTURES = [
  {
    id: 'R1',
    name: 'canonical-only packet',
    setup:
      'Only the canonical root contains the packet; canonical is active and implicit writes target it.',
    expectedClass: 'canonical-only',
    expectedDecision: 'allow',
  },
  {
    id: 'R2',
    name: 'legacy-only packet',
    setup:
      'Only the legacy root contains the packet; read fallback is allowed while implicit writes remain blocked by migration policy.',
    expectedClass: 'legacy-only',
    expectedDecision: 'allow',
  },
  {
    id: 'R3',
    name: 'valid relative root alias',
    setup:
      'The legacy root is a relative alias of the canonical root; both spellings resolve to one inode and canonical identity wins.',
    expectedClass: 'same-inode-alias',
    expectedDecision: 'allow',
  },
  {
    id: 'R4',
    name: 'independent roots with unique packets',
    setup:
      'Independent roots contain different packet IDs; canonical is active and enumeration may read both roots.',
    expectedDecision: 'n/a',
  },
  {
    id: 'R5',
    name: 'byte-identical duplicate packet',
    setup:
      'Independent roots contain byte-identical copies of the same packet; classify identical and prefer canonical without a move.',
    expectedClass: 'byte-identical-duplicate',
    expectedDecision: 'allow',
  },
  {
    id: 'R6',
    name: 'divergent duplicate packet',
    setup:
      'Independent roots contain divergent copies of the same packet; report both paths and reject implicit orchestration.',
    expectedClass: 'divergent-duplicate',
    expectedDecision: 'reject',
  },
  {
    id: 'R7',
    name: 'dangling legacy alias',
    setup:
      'The legacy alias target is missing; reject the alias, keep canonical active, and do not materialize a legacy root.',
    expectedDecision: 'n/a',
  },
  {
    id: 'R8',
    name: 'distinct plain legacy directory',
    setup:
      'Canonical and legacy are independent directories; implicit access stays canonical and explicit migration reads stay bounded.',
    expectedDecision: 'n/a',
  },
  {
    id: 'R9',
    name: 'plain file at legacy root',
    setup:
      'The legacy root path is a plain file; reject it as a root and keep canonical active.',
    expectedDecision: 'n/a',
  },
  {
    id: 'R10',
    name: 'misdirected external legacy alias',
    setup:
      'The legacy alias points outside the workspace; reject it and prevent read or write leakage.',
    expectedDecision: 'n/a',
  },
] as const satisfies readonly RootFixture[];

const RELATIVE_PACKET_ID = 'system-speckit/001-root-fixture';
const OTHER_PACKET_ID = 'system-speckit/002-other-fixture';
const PACKET_CONTENT = '# Root fixture\n\nStable fixture content.\n';

function createPacket(rootPath: string, packetId: string, content: string): void {
  const packetPath = path.join(rootPath, packetId);
  fs.mkdirSync(packetPath, { recursive: true });
  fs.writeFileSync(path.join(packetPath, 'spec.md'), content, 'utf8');
}

/** Materializes one root state entirely beneath a new operating-system temp directory. */
export function materializeRootFixture(fixture: RootFixture): MaterializedRootFixture {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-root-fixture-'));
  const workspaceDir = path.join(tempDir, 'workspace');
  const canonicalRoot = path.join(workspaceDir, '.opencode', 'specs');
  const legacyRoot = path.join(workspaceDir, 'specs');
  const physicalRoots: PhysicalRoot[] = [];

  fs.mkdirSync(workspaceDir, { recursive: true });

  const addCanonicalRoot = (): void => {
    fs.mkdirSync(canonicalRoot, { recursive: true });
    physicalRoots.push({ rootPath: canonicalRoot, kind: 'canonical' });
  };
  const addLegacyRoot = (): void => {
    fs.mkdirSync(legacyRoot, { recursive: true });
    physicalRoots.push({ rootPath: legacyRoot, kind: 'legacy' });
  };

  try {
    switch (fixture.id) {
      case 'R1':
        addCanonicalRoot();
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        break;
      case 'R2':
        addLegacyRoot();
        createPacket(legacyRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        break;
      case 'R3':
        addCanonicalRoot();
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        fs.symlinkSync(path.join('.opencode', 'specs'), legacyRoot, 'dir');
        physicalRoots.push({ rootPath: legacyRoot, kind: 'legacy' });
        break;
      case 'R4':
        addCanonicalRoot();
        addLegacyRoot();
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        createPacket(legacyRoot, OTHER_PACKET_ID, PACKET_CONTENT);
        break;
      case 'R5':
        addCanonicalRoot();
        addLegacyRoot();
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        createPacket(legacyRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        break;
      case 'R6':
        addCanonicalRoot();
        addLegacyRoot();
        createPacket(
          canonicalRoot,
          RELATIVE_PACKET_ID,
          `${PACKET_CONTENT}Canonical copy.\n`,
        );
        createPacket(legacyRoot, RELATIVE_PACKET_ID, `${PACKET_CONTENT}Legacy copy.\n`);
        break;
      case 'R7':
        addCanonicalRoot();
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        fs.symlinkSync('missing-specs', legacyRoot, 'dir');
        break;
      case 'R8':
        addCanonicalRoot();
        addLegacyRoot();
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        createPacket(legacyRoot, OTHER_PACKET_ID, PACKET_CONTENT);
        break;
      case 'R9':
        addCanonicalRoot();
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        fs.writeFileSync(legacyRoot, '.opencode/specs\n', 'utf8');
        break;
      case 'R10': {
        addCanonicalRoot();
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        const externalRoot = path.join(tempDir, 'external-specs');
        createPacket(
          externalRoot,
          RELATIVE_PACKET_ID,
          'External packet must remain isolated.\n',
        );
        fs.symlinkSync(path.relative(workspaceDir, externalRoot), legacyRoot, 'dir');
        break;
      }
    }
  } catch (error: unknown) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    throw error;
  }

  return {
    fixture,
    tempDir,
    workspaceDir,
    relativePacketId: RELATIVE_PACKET_ID,
    physicalRoots,
    cleanup: () => fs.rmSync(tempDir, { recursive: true, force: true }),
  };
}
