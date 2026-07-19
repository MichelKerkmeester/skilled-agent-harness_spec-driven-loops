// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Walker DoS Caps Stress Test
// ───────────────────────────────────────────────────────────────
// Exercises filesystem walker safety caps for large ignores and deep specs.

import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

const { mockFindSpecDocuments } = vi.hoisted(() => ({
  mockFindSpecDocuments: vi.fn(),
}));

vi.mock('../../../../system-spec-kit/mcp-server/handlers/memory-index-discovery.js', () => ({
  findSpecDocuments: mockFindSpecDocuments,
}));

const tempDirs: string[] = [];

function createTempRoot(): string {
  const tempRoot = mkdtempSync(join(tmpdir(), 'walker-dos-'));
  tempDirs.push(tempRoot);
  return tempRoot;
}

function writeFixture(root: string, relativePath: string, content = '# fixture\n'): string {
  const filePath = join(root, relativePath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
  return filePath;
}

function setupIndexerMocks(): void {
  vi.resetModules();
  vi.doMock('../../lib/code-graph-db.js', () => ({
    isFileStale: vi.fn(() => true),
  }));
  process.env.SPECKIT_PARSER = 'regex';
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
  delete process.env.SPECKIT_PARSER;
  vi.restoreAllMocks();
  vi.resetModules();
});

describe('walker DoS caps', () => {
  it('skips oversized .gitignore files with a warning instead of reading them whole', async () => {
    setupIndexerMocks();
    const tempRoot = createTempRoot();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    writeFixture(tempRoot, '.gitignore', `${'ignored.ts\n'.repeat(150_000)}\n`);
    writeFixture(tempRoot, 'kept.ts', 'export const kept = true;\n');

    const { getDefaultConfig } = await import('../../lib/indexer-types.js');
    const { indexFiles } = await import('../../lib/structural-indexer.js');

    const results = await indexFiles({
      ...getDefaultConfig(tempRoot),
      includeGlobs: ['**/*.ts'],
      languages: ['typescript'],
    });

    const indexedPaths = results.map((result) => relative(tempRoot, result.filePath).replace(/\\/g, '/'));
    expect(indexedPaths).toEqual(['kept.ts']);
    expect(
      warnSpy.mock.calls.some(([message]) => String(message).includes('Skipping oversized .gitignore'))
    ).toBe(true);
    expect(results.capExceeded.gitignoreSize).toBe(true);
    expect(results.warnings.some((message) => message.includes('Skipping oversized .gitignore'))).toBe(true);
  });

  it('stops descending spec discovery past the configured max depth and keeps shallower packets indexable', () => {
    const tempRoot = createTempRoot();
    writeFixture(tempRoot, '.opencode/specs/system-spec-kit/001-shallow/spec.md');

    const deepSegments = Array.from({ length: 21 }, (_, index) => `level-${String(index + 1).padStart(2, '0')}`);
    writeFixture(
      tempRoot,
      `.opencode/specs/system-spec-kit/${deepSegments.join('/')}/001-too-deep/spec.md`,
    );

    const deepDiscovery = Object.assign(
      [join(tempRoot, '.opencode/specs/system-spec-kit/001-shallow/spec.md')],
      {
        capExceeded: { depth: true },
        warnings: ['Stopped descending at maxDepth=20'],
      },
    );
    mockFindSpecDocuments.mockReturnValue(deepDiscovery);

    const specDocs = mockFindSpecDocuments(tempRoot)
      .map((filePath: string) => relative(tempRoot, filePath).replace(/\\/g, '/'));

    expect(specDocs).toEqual(['.opencode/specs/system-spec-kit/001-shallow/spec.md']);
    const discovery = mockFindSpecDocuments(tempRoot);
    expect(discovery.capExceeded.depth).toBe(true);
    expect(discovery.warnings.some((message: string) => message.includes('maxDepth=20'))).toBe(true);
  });
});
