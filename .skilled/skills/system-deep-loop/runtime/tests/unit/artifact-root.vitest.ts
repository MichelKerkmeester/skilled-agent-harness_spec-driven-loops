import { afterEach, describe, expect, it } from 'vitest';

import { createRequire } from 'node:module';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const nodeRequire = createRequire(import.meta.url);

const RUNTIME_ARTIFACT_ROOT = '../../lib/deep-loop/artifact-root.cjs';
const SPEC_KIT_ORIGINAL = '../../../../system-spec-kit/shared/review-research-paths.cjs';

type ArtifactRootResult = {
  rootDir: string;
  subfolder: string | null;
  artifactDir: string;
  artifactArchiveRoot: string;
};

const runtime = nodeRequire(RUNTIME_ARTIFACT_ROOT) as {
  resolveArtifactRoot: (specFolder: string, mode?: string) => ArtifactRootResult;
  allocateShortSubfolder: (rootDir: string, phaseSlug: string) => string;
  normalizeSpecFolderReference: (specFolder: string) => string | null;
};
const original = nodeRequire(SPEC_KIT_ORIGINAL) as typeof runtime;

const tempDirs: string[] = [];

function makeTemp(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('artifact-root re-export (promoted seam)', () => {
  it('exposes the identical contract functions, not copies', () => {
    expect(runtime.resolveArtifactRoot).toBe(original.resolveArtifactRoot);
    expect(runtime.allocateShortSubfolder).toBe(original.allocateShortSubfolder);
    expect(runtime.normalizeSpecFolderReference).toBe(original.normalizeSpecFolderReference);
  });

  it('rejects empty and shell-metacharacter spec folders', () => {
    expect(() => runtime.resolveArtifactRoot('', 'research')).toThrow(/non-empty string/);
    expect(() => runtime.resolveArtifactRoot('bad;rm -rf', 'research')).toThrow(/forbidden shell metacharacter/);
  });

  it('golden: a root spec resolves flat', () => {
    const root = makeTemp('artifact-root-spec-');
    const result = runtime.resolveArtifactRoot(root, 'research');
    expect(result.subfolder).toBeNull();
    expect(result.artifactDir).toBe(join(root, 'research'));
    expect(result.rootDir).toBe(join(root, 'research'));
  });

  it('golden: a child phase first run resolves flat', () => {
    const work = makeTemp('artifact-root-child-');
    const parent = join(work, 'specs', '019-parent');
    mkdirSync(parent, { recursive: true });
    writeFileSync(join(parent, 'spec.md'), '# parent\n', 'utf8');
    const child = join(parent, '001-child');
    mkdirSync(child, { recursive: true });

    const result = runtime.resolveArtifactRoot(child, 'review');
    expect(result.subfolder).toBeNull();
    expect(result.artifactDir).toBe(join(child, 'review'));
  });

  it('golden: a child phase with prior pt content allocates the next pt-NN', () => {
    const work = makeTemp('artifact-root-pt-');
    const parent = join(work, 'specs', '019-parent');
    mkdirSync(parent, { recursive: true });
    writeFileSync(join(parent, 'spec.md'), '# parent\n', 'utf8');
    const child = join(parent, '001-child');
    const rootDir = join(child, 'research');
    // Pre-existing packet folder for a different (unreadable) target.
    mkdirSync(join(rootDir, '001-child-pt-01'), { recursive: true });

    const result = runtime.resolveArtifactRoot(child, 'research');
    expect(result.subfolder).toBe('001-child-pt-02');
    expect(result.artifactDir).toBe(join(rootDir, '001-child-pt-02'));
  });

  it('allocateShortSubfolder counts same-prefix entries', () => {
    const rootDir = makeTemp('artifact-alloc-');
    mkdirSync(join(rootDir, '019-x-pt-01'));
    mkdirSync(join(rootDir, '019-x-pt-02'));
    expect(runtime.allocateShortSubfolder(rootDir, '019-x')).toBe('019-x-pt-03');
  });
});
