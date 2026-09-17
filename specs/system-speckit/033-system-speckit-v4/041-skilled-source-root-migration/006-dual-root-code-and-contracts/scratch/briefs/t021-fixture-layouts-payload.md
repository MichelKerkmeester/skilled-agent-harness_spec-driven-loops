## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-fixtures.ts`

OLD:

~~~~text
}

/** Temporary filesystem state and classifier input produced from a root fixture. */
~~~~

NEW:

~~~~text
}

/**
 * Where a workspace keeps its source tree: a real `.opencode/`, a real `.skilled/`, or a
 * real `.skilled/` with `.opencode` linked to it.
 */
export type SourceRootLayout = 'today' | 'skilled-only' | 'whole-link';

/** Temporary filesystem state and classifier input produced from a root fixture. */
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-fixtures.ts`

OLD:

~~~~text
/** Materializes one root state entirely beneath a new operating-system temp directory. */
export function materializeRootFixture(fixture: RootFixture): MaterializedRootFixture {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-root-fixture-'));
  const workspaceDir = path.join(tempDir, 'workspace');
  const canonicalRoot = path.join(workspaceDir, 'specs');
  const legacyRoot = path.join(workspaceDir, '.opencode', 'specs');
  const physicalRoots: PhysicalRoot[] = [];

  fs.mkdirSync(workspaceDir, { recursive: true });
  // legacyRoot now nests one level deeper (.opencode/specs) than canonicalRoot
  // (specs) -- pre-create its parent so fixtures that write directly at
  // legacyRoot (a symlink or a plain file, not addLegacyRoot()'s directory)
  // never fail on a missing intermediate directory.
  fs.mkdirSync(path.dirname(legacyRoot), { recursive: true });

  const addCanonicalRoot = (): void => {
~~~~

NEW:

~~~~text
/** Materializes one root state entirely beneath a new operating-system temp directory. */
export function materializeRootFixture(
  fixture: RootFixture,
  layout: SourceRootLayout = 'today',
): MaterializedRootFixture {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-root-fixture-'));
  const workspaceDir = path.join(tempDir, 'workspace');
  const canonicalRoot = path.join(workspaceDir, 'specs');
  // Resolvers know the legacy root by its one `.opencode/specs` spelling. Under a
  // `.skilled` tree the entry is written inside `.skilled`, so only an `.opencode` link
  // can expose it, and a `.skilled`-only workspace has no legacy root to report.
  const legacyRoot = path.join(workspaceDir, '.opencode', 'specs');
  const sourceRootDir = path.join(workspaceDir, layout === 'today' ? '.opencode' : '.skilled');
  const legacyEntry = path.join(sourceRootDir, 'specs');
  const legacyVisible = layout !== 'skilled-only';
  const physicalRoots: PhysicalRoot[] = [];

  fs.mkdirSync(workspaceDir, { recursive: true });
  // The legacy entry nests one level deeper than canonicalRoot, so pre-create its
  // parent: fixtures that write directly at the entry (a symlink or a plain file, not
  // addLegacyRoot()'s directory) never fail on a missing intermediate directory.
  fs.mkdirSync(sourceRootDir, { recursive: true });
  if (layout === 'whole-link') {
    fs.symlinkSync('.skilled', path.join(workspaceDir, '.opencode'), 'dir');
  }

  const addCanonicalRoot = (): void => {
~~~~

## Edit 3

File: `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-fixtures.ts`

OLD:

~~~~text
  const addLegacyRoot = (): void => {
    fs.mkdirSync(legacyRoot, { recursive: true });
    physicalRoots.push({ rootPath: legacyRoot, kind: 'legacy' });
  };
~~~~

NEW:

~~~~text
  const addLegacyRoot = (): void => {
    fs.mkdirSync(legacyEntry, { recursive: true });
    if (legacyVisible) physicalRoots.push({ rootPath: legacyRoot, kind: 'legacy' });
  };
~~~~

## Edit 4

File: `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-fixtures.ts`

OLD:

~~~~text
        addLegacyRoot();
        createPacket(legacyRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        break;
~~~~

NEW:

~~~~text
        addLegacyRoot();
        createPacket(legacyEntry, RELATIVE_PACKET_ID, PACKET_CONTENT);
        break;
~~~~

## Edit 5

File: `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-fixtures.ts`

OLD:

~~~~text
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        fs.symlinkSync(path.join('..', 'specs'), legacyRoot, 'dir');
        physicalRoots.push({ rootPath: legacyRoot, kind: 'legacy' });
        break;
~~~~

NEW:

~~~~text
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        fs.symlinkSync(path.join('..', 'specs'), legacyEntry, 'dir');
        if (legacyVisible) physicalRoots.push({ rootPath: legacyRoot, kind: 'legacy' });
        break;
~~~~

## Edit 6

File: `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-fixtures.ts`

OLD:

~~~~text
        addLegacyRoot();
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        createPacket(legacyRoot, OTHER_PACKET_ID, PACKET_CONTENT);
        break;
      case 'R5':
~~~~

NEW:

~~~~text
        addLegacyRoot();
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        createPacket(legacyEntry, OTHER_PACKET_ID, PACKET_CONTENT);
        break;
      case 'R5':
~~~~

## Edit 7

File: `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-fixtures.ts`

OLD:

~~~~text
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        createPacket(legacyRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        break;
~~~~

NEW:

~~~~text
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        createPacket(legacyEntry, RELATIVE_PACKET_ID, PACKET_CONTENT);
        break;
~~~~

## Edit 8

File: `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-fixtures.ts`

OLD:

~~~~text
        );
        createPacket(legacyRoot, RELATIVE_PACKET_ID, `${PACKET_CONTENT}Legacy copy.\n`);
        break;
~~~~

NEW:

~~~~text
        );
        createPacket(legacyEntry, RELATIVE_PACKET_ID, `${PACKET_CONTENT}Legacy copy.\n`);
        break;
~~~~

## Edit 9

File: `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-fixtures.ts`

OLD:

~~~~text
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        fs.symlinkSync('missing-specs', legacyRoot, 'dir');
        break;
~~~~

NEW:

~~~~text
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        fs.symlinkSync('missing-specs', legacyEntry, 'dir');
        break;
~~~~

## Edit 10

File: `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-fixtures.ts`

OLD:

~~~~text
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        createPacket(legacyRoot, OTHER_PACKET_ID, PACKET_CONTENT);
        break;
~~~~

NEW:

~~~~text
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        createPacket(legacyEntry, OTHER_PACKET_ID, PACKET_CONTENT);
        break;
~~~~

## Edit 11

File: `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-fixtures.ts`

OLD:

~~~~text
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        fs.writeFileSync(legacyRoot, '.opencode/specs\n', 'utf8');
        break;
~~~~

NEW:

~~~~text
        createPacket(canonicalRoot, RELATIVE_PACKET_ID, PACKET_CONTENT);
        fs.writeFileSync(legacyEntry, '.opencode/specs\n', 'utf8');
        break;
~~~~

## Edit 12

File: `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-fixtures.ts`

OLD:

~~~~text
        );
        fs.symlinkSync(path.relative(path.dirname(legacyRoot), externalRoot), legacyRoot, 'dir');
        break;
~~~~

NEW:

~~~~text
        );
        fs.symlinkSync(path.relative(path.dirname(legacyEntry), externalRoot), legacyEntry, 'dir');
        break;
~~~~
