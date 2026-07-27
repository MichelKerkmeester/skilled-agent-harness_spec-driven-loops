import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const pathsModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/system-spec-kit/shared/review-research-paths.cjs',
)) as {
  resolveArtifactRoot: (
    specFolder: string,
    mode?: 'review' | 'research',
    repoRoot?: string,
  ) => {
    rootDir: string;
    subfolder: string | null;
    artifactDir: string;
    artifactArchiveRoot: string;
  };
  getApprovedArtifactRoots: (repoRoot?: string) => string[];
  getRegisteredWorktreeRoots: (repoRoot?: string) => string[];
};

const tempDirs: string[] = [];

function writeFile(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function makeSpecFolder(rootPath: string, relativePath: string): string {
  const specFolder = path.join(rootPath, relativePath);
  writeFile(path.join(specFolder, 'spec.md'), `# ${path.basename(relativePath)}\n`);
  return specFolder;
}

function createPacket(
  specFolder: string,
  mode: 'review' | 'research',
  packetName: string,
  configSpecFolder: string,
): string {
  const packetDir = path.join(specFolder, mode, packetName);
  const configFile = mode === 'review' ? 'deep-review-config.json' : 'deep-research-config.json';

  writeFile(
    path.join(packetDir, configFile),
    `${JSON.stringify({ specFolder: configSpecFolder }, null, 2)}\n`,
  );

  return packetDir;
}

function makeWorkspaceFixture(): { rootSpec: string; childSpec: string; nestedSpec: string } {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'review-research-paths-'));
  tempDirs.push(workspaceRoot);

  const rootSpec = makeSpecFolder(workspaceRoot, '026-graph-and-context-optimization');
  const childSpec = makeSpecFolder(rootSpec, '013-sk-deep-refinement');
  const nestedSpec = makeSpecFolder(childSpec, '002-resource-map-deep-loop-integration');

  return { rootSpec, childSpec, nestedSpec };
}

afterEach(() => {
  vi.restoreAllMocks();
  while (tempDirs.length) {
    fs.rmSync(tempDirs.pop() as string, { recursive: true, force: true });
  }
});

describe('review-research path resolution', () => {
  it('approves spec roots from a bidirectionally registered linked worktree', () => {
    const repositoryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'registered-worktree-repo-'));
    const worktreeRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'registered-worktree-target-'));
    tempDirs.push(repositoryRoot, worktreeRoot);
    const registrationDir = path.join(repositoryRoot, '.git', 'worktrees', 'linked');

    writeFile(path.join(registrationDir, 'gitdir'), `${path.join(worktreeRoot, '.git')}\n`);
    writeFile(path.join(worktreeRoot, '.git'), `gitdir: ${registrationDir}\n`);

    expect(pathsModule.getRegisteredWorktreeRoots(repositoryRoot)).toEqual([
      fs.realpathSync(worktreeRoot),
    ]);
    expect(pathsModule.getApprovedArtifactRoots(repositoryRoot)).toContain(
      path.join(fs.realpathSync(worktreeRoot), '.opencode', 'specs'),
    );
  });

  it('rejects a worktree registration whose local backlink does not match', () => {
    const repositoryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'mismatched-worktree-repo-'));
    const worktreeRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'mismatched-worktree-target-'));
    tempDirs.push(repositoryRoot, worktreeRoot);
    const registrationDir = path.join(repositoryRoot, '.git', 'worktrees', 'linked');

    writeFile(path.join(registrationDir, 'gitdir'), `${path.join(worktreeRoot, '.git')}\n`);
    writeFile(
      path.join(worktreeRoot, '.git'),
      `gitdir: ${path.join(repositoryRoot, '.git', 'worktrees', 'other')}\n`,
    );

    expect(pathsModule.getRegisteredWorktreeRoots(repositoryRoot)).toEqual([]);
    expect(pathsModule.getApprovedArtifactRoots(repositoryRoot)).not.toContain(
      path.join(fs.realpathSync(worktreeRoot), '.opencode', 'specs'),
    );
  });

  it('uses the production resolver predicate to accept a registered worktree and reject a lookalike', () => {
    const repositoryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'resolver-worktree-repo-'));
    const worktreeRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'resolver-worktree-target-'));
    const lookalikeRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'resolver-worktree-lookalike-'));
    tempDirs.push(repositoryRoot, worktreeRoot, lookalikeRoot);
    const registrationDir = path.join(repositoryRoot, '.git', 'worktrees', 'linked');
    const approvedTemp = path.join(repositoryRoot, 'approved-temp');
    fs.mkdirSync(approvedTemp, { recursive: true });
    vi.spyOn(os, 'tmpdir').mockReturnValue(approvedTemp);
    writeFile(path.join(registrationDir, 'gitdir'), `${path.join(worktreeRoot, '.git')}\n`);
    writeFile(path.join(worktreeRoot, '.git'), `gitdir: ${registrationDir}\n`);
    const registeredSpec = makeSpecFolder(worktreeRoot, '.opencode/specs/001-registered');
    const lookalikeSpec = makeSpecFolder(lookalikeRoot, '.opencode/specs/001-lookalike');

    expect(pathsModule.resolveArtifactRoot(registeredSpec, 'research', repositoryRoot).artifactDir)
      .toBe(path.join(registeredSpec, 'research'));
    expect(() => pathsModule.resolveArtifactRoot(lookalikeSpec, 'research', repositoryRoot))
      .toThrow('outside the approved specs roots');
  });

  it('rejects a symlinked artifact directory before routing writes through it', () => {
    const { rootSpec } = makeWorkspaceFixture();
    const outsideDir = fs.mkdtempSync(path.join(os.tmpdir(), 'resolver-artifact-outside-'));
    tempDirs.push(outsideDir);
    fs.symlinkSync(outsideDir, path.join(rootSpec, 'research'));

    expect(() => pathsModule.resolveArtifactRoot(rootSpec, 'research'))
      .toThrow('research artifact root must be a real directory');
  });

  it('keeps root-spec research runs at the root spec folder', () => {
    const { rootSpec } = makeWorkspaceFixture();

    const resolved = pathsModule.resolveArtifactRoot(rootSpec, 'research');

    expect(resolved.rootDir).toBe(path.join(rootSpec, 'research'));
    expect(resolved.subfolder).toBeNull();
    expect(resolved.artifactDir).toBe(path.join(rootSpec, 'research'));
    expect(resolved.artifactArchiveRoot).toBe(path.join(rootSpec, 'research_archive'));
  });

  it('returns flat for child-phase first run when rootDir is empty', () => {
    const { childSpec } = makeWorkspaceFixture();

    const resolved = pathsModule.resolveArtifactRoot(childSpec, 'review');

    expect(resolved.rootDir).toBe(path.join(childSpec, 'review'));
    expect(resolved.subfolder).toBeNull();
    expect(resolved.artifactDir).toBe(path.join(childSpec, 'review'));
    expect(resolved.artifactArchiveRoot).toBe(path.join(childSpec, 'review-archive'));
  });

  it('returns flat for nested first run when rootDir is empty', () => {
    const { nestedSpec } = makeWorkspaceFixture();

    const resolved = pathsModule.resolveArtifactRoot(nestedSpec, 'research');

    expect(resolved.rootDir).toBe(path.join(nestedSpec, 'research'));
    expect(resolved.subfolder).toBeNull();
    expect(resolved.artifactDir).toBe(path.join(nestedSpec, 'research'));
    expect(resolved.artifactArchiveRoot).toBe(path.join(nestedSpec, 'research_archive'));
  });

  it('reuses flat artifact when its config matches the current child target', () => {
    const { childSpec } = makeWorkspaceFixture();

    // Simulate a prior run that wrote a flat config at rootDir
    writeFile(
      path.join(childSpec, 'research', 'deep-research-config.json'),
      `${JSON.stringify({ specFolder: childSpec }, null, 2)}\n`,
    );

    const resolved = pathsModule.resolveArtifactRoot(childSpec, 'research');

    expect(resolved.subfolder).toBeNull();
    expect(resolved.artifactDir).toBe(path.join(childSpec, 'research'));
  });

  it('reuses an existing pt-NN packet for the same child target instead of allocating a sibling', () => {
    const { childSpec } = makeWorkspaceFixture();

    createPacket(
      childSpec,
      'research',
      '013-sk-deep-refinement-pt-01',
      childSpec,
    );

    const resolved = pathsModule.resolveArtifactRoot(childSpec, 'research');

    expect(resolved.subfolder).toBe('013-sk-deep-refinement-pt-01');
    expect(resolved.artifactDir).toBe(
      path.join(childSpec, 'research', '013-sk-deep-refinement-pt-01'),
    );
  });

  it('allocates pt-NN when prior pt-NN folders exist for non-matching targets', () => {
    const { childSpec } = makeWorkspaceFixture();

    // A pt-NN packet exists but for a DIFFERENT target — the current run must branch
    createPacket(
      childSpec,
      'research',
      '013-sk-deep-refinement-pt-01',
      '/some/other/spec/folder',
    );

    const resolved = pathsModule.resolveArtifactRoot(childSpec, 'research');

    expect(resolved.subfolder).toBe('013-sk-deep-refinement-pt-02');
    expect(resolved.artifactDir).toBe(
      path.join(childSpec, 'research', '013-sk-deep-refinement-pt-02'),
    );
  });

  it('allocates pt-NN when a flat artifact exists for a different target', () => {
    const { childSpec } = makeWorkspaceFixture();

    // Flat config is for a different target — current run must branch into pt-NN
    writeFile(
      path.join(childSpec, 'research', 'deep-research-config.json'),
      `${JSON.stringify({ specFolder: '/some/other/spec/folder' }, null, 2)}\n`,
    );

    const resolved = pathsModule.resolveArtifactRoot(childSpec, 'research');

    expect(resolved.subfolder).toBe('013-sk-deep-refinement-pt-01');
    expect(resolved.artifactDir).toBe(
      path.join(childSpec, 'research', '013-sk-deep-refinement-pt-01'),
    );
  });
});
