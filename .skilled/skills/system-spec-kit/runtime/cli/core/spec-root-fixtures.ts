// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Root Fixtures
// ───────────────────────────────────────────────────────────────────

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

/**
 * Where a workspace keeps its source tree: a real `.opencode/`, a real `.skilled/`, or a
 * real `.skilled/` with `.opencode` linked to it.
 */
export type SourceRootLayout = 'today' | 'skilled-only' | 'whole-link';

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
export function materializeRootFixture(
  fixture: RootFixture,
  layout: SourceRootLayout = 'today',
): MaterializedRootFixture {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-root-fixture-'));
  const workspaceDir = path.join(tempDir, 'workspace');
  const canonicalRoot = path.join(workspaceDir, 'specs');
  // Root enumeration knows the legacy root by its one `.opencode/specs` spelling. Under
  // a `.skilled` tree the entry is written inside `.skilled`, so only an `.opencode` link
  // exposes it as the legacy root, and a `.skilled`-only workspace lists none. Path
  // containment can still follow the entry into the canonical root.
  const legacyRoot = path.join(workspaceDir, '.opencode', 'specs');
  const sourceRootDir = path.join(workspaceDir, layout === 'today' ? '.opencode' : '.skilled');
  const legacyEntry = path.join(sourceRootDir, 'specs');
  const legacyVisible = layout !== 'skilled-only';
  const physicalRoots: PhysicalRoot[] = [];

  const addCanonicalRoot = (): void => {
    fs.mkdirSync(canonicalRoot, { recursive: true });
    physicalRoots.push({ rootPath: canonicalRoot, kind: 'canonical' });
  };
  const addLegacyRoot = (): void => {
    fs.mkdirSync(legacyEntry, { recursive: true });
    if (legacyVisible) physicalRoots.push({ rootPath: legacyRoot, kind: 'legacy' });
  };

  // Setup that can fail, such as a denied symlink, runs inside the guard that removes
  // the temporary directory.
  try {
    fs.mkdirSync(workspaceDir, { recursive: true });
    // The legacy entry nests one level deeper than canonicalRoot, so pre-create its
    // parent: fixtures that write directly at the entry (a symlink or a plain file, not
    // addLegacyRoot()'s directory) never fail on a missing intermediate directory.
    fs.mkdirSync(sourceRootDir, { recursive: true });
    if (layout === 'whole-link') {
      fs.symlinkSync('.skilled', path.join(workspaceDir, '.opencode'), 'dir');
    }
    switch (fixture.id) {
      case 'R1':
        addCanonicalRoot();
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        break;
      case 'R2':
        addLegacyRoot();
        createPacket(legacyEntry, RELATIVE_PACKET_ID, PACKET_CONTENT);
        break;
      case 'R3':
        addCanonicalRoot();
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        fs.symlinkSync(path.join('..', 'specs'), legacyEntry, 'dir');
        if (legacyVisible) physicalRoots.push({ rootPath: legacyRoot, kind: 'legacy' });
        break;
      case 'R4':
        addCanonicalRoot();
        addLegacyRoot();
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        createPacket(legacyEntry, OTHER_PACKET_ID, PACKET_CONTENT);
        break;
      case 'R5':
        addCanonicalRoot();
        addLegacyRoot();
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        createPacket(legacyEntry, RELATIVE_PACKET_ID, PACKET_CONTENT);
        break;
      case 'R6':
        addCanonicalRoot();
        addLegacyRoot();
        createPacket(
          canonicalRoot,
          RELATIVE_PACKET_ID,
          `${PACKET_CONTENT}Canonical copy.\n`,
        );
        createPacket(legacyEntry, RELATIVE_PACKET_ID, `${PACKET_CONTENT}Legacy copy.\n`);
        break;
      case 'R7':
        addCanonicalRoot();
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        fs.symlinkSync('missing-specs', legacyEntry, 'dir');
        break;
      case 'R8':
        addCanonicalRoot();
        addLegacyRoot();
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        createPacket(legacyEntry, OTHER_PACKET_ID, PACKET_CONTENT);
        break;
      case 'R9':
        addCanonicalRoot();
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        fs.writeFileSync(legacyEntry, '.opencode/specs\n', 'utf8');
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
        fs.symlinkSync(path.relative(path.dirname(legacyEntry), externalRoot), legacyEntry, 'dir');
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
