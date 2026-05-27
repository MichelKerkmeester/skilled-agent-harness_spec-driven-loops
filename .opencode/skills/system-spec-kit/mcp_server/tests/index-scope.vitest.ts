import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  EXCLUDED_FOR_CODE_GRAPH,
  EXCLUDED_FOR_MEMORY,
  isIndexableConstitutionalMemoryPath,
  shouldIndexForCodeGraph,
  shouldIndexForMemory,
} from '../lib/utils/index-scope.js';
import {
  findGraphMetadataFiles,
  findSpecDocuments,
} from '../handlers/memory-index-discovery.js';

const tempDirs: string[] = [];

function createTempRoot(): string {
  const tempRoot = mkdtempSync(join(tmpdir(), 'index-scope-'));
  tempDirs.push(tempRoot);
  return tempRoot;
}

function writeFixture(root: string, relativePath: string, content = '# fixture\n'): string {
  const filePath = join(root, relativePath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
  return filePath;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
  delete process.env.SPECKIT_PARSER;
  vi.resetModules();
  vi.restoreAllMocks();
});

describe('index-scope helper', () => {
  it('exports the expected memory and code-graph exclusion patterns', () => {
    // (commit b062b12b4) removed z_archive from EXCLUDED_FOR_MEMORY
    // z_archive content stays indexed and is deprioritized via ARCHIVE_MULTIPLIERS
    // in shared/scoring/folder-scoring.ts (0.1 multiplier).
    expect(EXCLUDED_FOR_MEMORY.length).toBeGreaterThanOrEqual(2);
    expect(EXCLUDED_FOR_CODE_GRAPH.length).toBeGreaterThanOrEqual(7);
  });

  it('rejects z_future and external for memory indexing; z_archive stays indexed', () => {
    expect(shouldIndexForMemory('/workspace/.opencode/specs/system-spec-kit/001-active/spec.md')).toBe(true);
    expect(shouldIndexForMemory('/workspace/.opencode/specs/system-spec-kit/z_future/001-research/spec.md')).toBe(false);
    expect(shouldIndexForMemory('/workspace/.opencode/specs/system-spec-kit/001-active/external/spec.md')).toBe(false);
    // z_archive is INDEXED (not excluded); decay is applied at scoring time, not at index time
    expect(shouldIndexForMemory('/workspace/.opencode/specs/system-spec-kit/z_archive/001-old/spec.md')).toBe(true);
  });

  it('rejects external plus existing default code-graph exclusions', () => {
    expect(shouldIndexForCodeGraph('/workspace/src/active.ts')).toBe(true);
    expect(shouldIndexForCodeGraph('/workspace/external/vendor.ts')).toBe(false);
    expect(shouldIndexForCodeGraph('/workspace/node_modules/pkg/index.ts')).toBe(false);
    expect(shouldIndexForCodeGraph('/workspace/.git/hooks/pre-commit')).toBe(false);
    expect(shouldIndexForCodeGraph('/workspace/dist/generated.js')).toBe(false);
    expect(shouldIndexForCodeGraph('/workspace/vendor/lib.ts')).toBe(false);
    expect(shouldIndexForCodeGraph('/workspace/z_future/idea.ts')).toBe(false);
  });

  it('accepts constitutional rule files but rejects constitutional README files', () => {
    expect(isIndexableConstitutionalMemoryPath('/workspace/.opencode/skills/system-spec-kit/constitutional/gate-enforcement.md')).toBe(true);
    expect(isIndexableConstitutionalMemoryPath('/workspace/.opencode/skills/system-spec-kit/constitutional/README.md')).toBe(false);
    expect(isIndexableConstitutionalMemoryPath('/workspace/.opencode/skills/system-spec-kit/constitutional/readme.MD')).toBe(false);
    expect(isIndexableConstitutionalMemoryPath('/workspace/.opencode/specs/system-spec-kit/001-active/spec.md')).toBe(false);
  });
});

describe('memory discovery respects index scope invariants', () => {
  it('skips z_future and external spec docs and graph metadata; discovers z_archive', () => {
    const tempRoot = createTempRoot();
    writeFixture(tempRoot, '.opencode/specs/system-spec-kit/001-active/spec.md');
    writeFixture(tempRoot, '.opencode/specs/system-spec-kit/001-active/graph-metadata.json', '{"packet_id":"001-active"}\n');
    writeFixture(tempRoot, '.opencode/specs/system-spec-kit/z_future/001-future/spec.md');
    writeFixture(tempRoot, '.opencode/specs/system-spec-kit/z_future/001-future/graph-metadata.json', '{"packet_id":"001-future"}\n');
    writeFixture(tempRoot, '.opencode/specs/system-spec-kit/001-active/external/spec.md');
    writeFixture(tempRoot, '.opencode/specs/system-spec-kit/001-active/external/graph-metadata.json', '{"packet_id":"external"}\n');
    writeFixture(tempRoot, '.opencode/specs/system-spec-kit/z_archive/001-old/spec.md');
    writeFixture(tempRoot, '.opencode/specs/system-spec-kit/z_archive/001-old/graph-metadata.json', '{"packet_id":"001-old"}\n');

    const specDocs = findSpecDocuments(tempRoot).map(filePath => relative(tempRoot, filePath).replace(/\\/g, '/')).sort();
    const graphFiles = findGraphMetadataFiles(tempRoot).map(filePath => relative(tempRoot, filePath).replace(/\\/g, '/')).sort();

    // Z_archive content IS discovered post; deprioritization happens at scoring time via ARCHIVE_MULTIPLIERS
    expect(specDocs).toEqual([
      '.opencode/specs/system-spec-kit/001-active/spec.md',
      '.opencode/specs/system-spec-kit/z_archive/001-old/spec.md',
    ]);
    expect(graphFiles).toEqual([
      '.opencode/specs/system-spec-kit/001-active/graph-metadata.json',
      '.opencode/specs/system-spec-kit/z_archive/001-old/graph-metadata.json',
    ]);
  });
});

describe('code-graph scope policy helper', () => {
  it('skips external and z_future paths before code-graph scanning', () => {
    const tempRoot = createTempRoot();
    const activeFile = writeFixture(tempRoot, 'active.ts', 'export const active = true;\n');
    const externalFile = writeFixture(tempRoot, 'external/vendor.ts', 'export const external = true;\n');
    const futureFile = writeFixture(tempRoot, 'z_future/future.ts', 'export const future = true;\n');

    const indexedPaths = [activeFile, externalFile, futureFile]
      .filter((filePath) => shouldIndexForCodeGraph(filePath))
      .map((filePath) => relative(tempRoot, filePath).replace(/\\/g, '/'));
    expect(indexedPaths).toEqual(['active.ts']);
  });
});
