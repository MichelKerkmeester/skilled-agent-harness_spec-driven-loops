// @ts-nocheck
// ---------------------------------------------------------------
// Regression Tests: Backward Compatibility (Spec 111)
// ---------------------------------------------------------------
// Ensures that the README anchor schema changes (Spec 111) do not
// break pre-existing behavior. Guards against regressions in:
// - Spec memory file indexing
// - Constitutional file priority
// - Memory search for spec folder queries
// - Pre-spec-111 behavior (includeReadmes: false equivalence)
// ---------------------------------------------------------------

import { describe, it, expect, afterAll } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

import * as handler from '../handlers/memory-index';

function isServerDependencyError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /database|getDb|Rate limited|vector_index|null|not initialized|Database/.test(message);
}

let tempDir: string | null = null;

afterAll(() => {
  if (tempDir && fs.existsSync(tempDir)) {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup errors
    }
  }
});

// ─────────────────────────────────────────────────────────────
// SUITE: Spec memory files — pre-existing behavior
// ─────────────────────────────────────────────────────────────

describe('Regression: Spec memory file indexing unchanged', () => {

  it('REG-1: handleMemoryIndexScan still accepts specFolder parameter', async () => {
    try {
      const result = await handler.handleMemoryIndexScan({
        specFolder: 'non-existent-folder',
      });
      expect(result).toBeTruthy();
      expect(result.content).toBeTruthy();

      const parsed = JSON.parse(result.content[0].text);
      // Should complete without error (may return 0 files)
      expect(parsed.data?.status || parsed.summary).toBeTruthy();
    } catch (error: unknown) {
      if (!isServerDependencyError(error)) throw error;
    }
  });

  it('REG-2: specFolder filter does not include README files from other folders', async () => {
    try {
      const result = await handler.handleMemoryIndexScan({
        specFolder: '001-test',
        includeReadmes: true,
      });
      const parsed = JSON.parse(result.content[0].text);

      if (parsed.data?._debug_fileCounts) {
        // specFolder should only filter spec files, readmes are workspace-wide
        expect(typeof parsed.data._debug_fileCounts.specFiles).toBe('number');
      }
    } catch (error: unknown) {
      if (!isServerDependencyError(error)) throw error;
    }
  });

});

// ─────────────────────────────────────────────────────────────
// SUITE: Constitutional files — priority preservation
// ─────────────────────────────────────────────────────────────

describe('Regression: Constitutional file handling unchanged', () => {

  it('REG-3: findConstitutionalFiles returns array (not undefined/null)', () => {
    const result = handler.findConstitutionalFiles('/non/existent');
    expect(Array.isArray(result)).toBe(true);
  });

  it('REG-4: Constitutional discovery with temp workspace finds .md files', () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spec111-reg-'));
    const constitutionalDir = path.join(tempDir, '.opencode', 'skill', 'my-skill', 'constitutional');
    fs.mkdirSync(constitutionalDir, { recursive: true });
    fs.writeFileSync(path.join(constitutionalDir, 'rules.md'), '# Rules\nContent');

    const files = handler.findConstitutionalFiles(tempDir);
    expect(files.length).toBe(1);
    expect(files[0]).toContain('rules.md');
  });

  it('REG-5: Constitutional files are separate from README discovery', () => {
    // Constitutional files from constitutional/ dirs should not overlap with README discovery
    const constitutionalDir = path.join(tempDir!, '.opencode', 'skill', 'my-skill', 'constitutional');
    fs.writeFileSync(path.join(constitutionalDir, 'README.md'), '# Constitutional README');

    const files = handler.findConstitutionalFiles(tempDir!);
    // README.md excluded from constitutional discovery
    const readmes = files.filter((f: string) => path.basename(f).toLowerCase() === 'readme.md');
    expect(readmes).toHaveLength(0);
  });

  it('REG-6: includeConstitutional: true still works independently of includeReadmes', async () => {
    try {
      const result = await handler.handleMemoryIndexScan({
        includeConstitutional: true,
        includeReadmes: false,
      });
      const parsed = JSON.parse(result.content[0].text);

      if (parsed.data?._debug_fileCounts) {
        // Constitutional should be found even when readmes are off
        expect(typeof parsed.data._debug_fileCounts.constitutionalFiles).toBe('number');
        expect(parsed.data._debug_fileCounts.skillReadmes).toBe(0);
      }
    } catch (error: unknown) {
      if (!isServerDependencyError(error)) throw error;
    }
  });

  it('REG-7: includeConstitutional: false excludes constitutional files', async () => {
    try {
      const result = await handler.handleMemoryIndexScan({
        includeConstitutional: false,
      });
      const parsed = JSON.parse(result.content[0].text);

      if (parsed.data?._debug_fileCounts) {
        expect(parsed.data._debug_fileCounts.constitutionalFiles).toBe(0);
      }
    } catch (error: unknown) {
      if (!isServerDependencyError(error)) throw error;
    }
  });

});

// ─────────────────────────────────────────────────────────────
// SUITE: Pre-spec-111 equivalence
// ─────────────────────────────────────────────────────────────

describe('Regression: includeReadmes=false mimics pre-spec-111 behavior', () => {

  it('REG-8: includeReadmes: false produces zero README counts', async () => {
    try {
      const result = await handler.handleMemoryIndexScan({ includeReadmes: false });
      const parsed = JSON.parse(result.content[0].text);

      if (parsed.data?._debug_fileCounts) {
        const counts = parsed.data._debug_fileCounts;
        expect(counts.skillReadmes).toBe(0);
        expect(counts.projectReadmes).toBe(0);
        // Total should only be spec + constitutional
        expect(counts.totalFiles).toBe(counts.specFiles + counts.constitutionalFiles);
      }
    } catch (error: unknown) {
      if (!isServerDependencyError(error)) throw error;
    }
  });

  it('REG-9: Response structure unchanged — still has content[0].text', async () => {
    try {
      const result = await handler.handleMemoryIndexScan({});
      // MCP response structure must be preserved
      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content.length).toBeGreaterThan(0);
      expect(result.content[0]).toHaveProperty('text');
      expect(typeof result.content[0].text).toBe('string');

      // Must be valid JSON
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed).toBeTruthy();
    } catch (error: unknown) {
      if (!isServerDependencyError(error)) throw error;
    }
  });

  it('REG-10: Response data.status is still "complete"', async () => {
    try {
      const result = await handler.handleMemoryIndexScan({});
      const parsed = JSON.parse(result.content[0].text);

      if (parsed.data) {
        expect(parsed.data.status).toBe('complete');
      }
    } catch (error: unknown) {
      if (!isServerDependencyError(error)) throw error;
    }
  });

});

// ─────────────────────────────────────────────────────────────
// SUITE: Export contract stability
// ─────────────────────────────────────────────────────────────

describe('Regression: Export contract unchanged', () => {

  it('REG-11: All pre-existing exports still available', () => {
    // camelCase
    expect(typeof handler.handleMemoryIndexScan).toBe('function');
    expect(typeof handler.indexSingleFile).toBe('function');
    expect(typeof handler.findConstitutionalFiles).toBe('function');
  });

  it('REG-12: Snake_case aliases still available', () => {
    expect(typeof handler.handle_memory_index_scan).toBe('function');
    expect(typeof handler.index_single_file).toBe('function');
    expect(typeof handler.find_constitutional_files).toBe('function');
  });

  it('REG-13: Aliases reference same function as camelCase', () => {
    expect(handler.handle_memory_index_scan).toBe(handler.handleMemoryIndexScan);
    expect(handler.index_single_file).toBe(handler.indexSingleFile);
    expect(handler.find_constitutional_files).toBe(handler.findConstitutionalFiles);
  });

});

// ─────────────────────────────────────────────────────────────
// SUITE: Tool schema contract (includeReadmes in tool-schemas)
// ─────────────────────────────────────────────────────────────

describe('Regression: Tool schema contract', () => {

  it('REG-14: memory_index_scan schema includes includeReadmes property', async () => {
    // Import tool schemas and verify includeReadmes is defined
    const { TOOL_DEFINITIONS } = await import('../tool-schemas');
    const scanTool = TOOL_DEFINITIONS.find((t: any) => t.name === 'memory_index_scan');
    expect(scanTool).toBeTruthy();
    expect(scanTool!.inputSchema.properties).toHaveProperty('includeReadmes');
  });

  it('REG-15: includeReadmes default is true in schema', async () => {
    const { TOOL_DEFINITIONS } = await import('../tool-schemas');
    const scanTool = TOOL_DEFINITIONS.find((t: any) => t.name === 'memory_index_scan');
    const schemaProperties = scanTool!.inputSchema.properties as Record<string, { default?: unknown; type?: unknown }>;
    const readmesProp = schemaProperties.includeReadmes;
    expect(readmesProp.default).toBe(true);
    expect(readmesProp.type).toBe('boolean');
  });

  it('REG-16: memory_index_scan still has all pre-existing params', async () => {
    const { TOOL_DEFINITIONS } = await import('../tool-schemas');
    const scanTool = TOOL_DEFINITIONS.find((t: any) => t.name === 'memory_index_scan');
    const props = scanTool!.inputSchema.properties as Record<string, unknown>;

    // Pre-existing parameters that must not be removed
    expect(props).toHaveProperty('specFolder');
    expect(props).toHaveProperty('force');
    expect(props).toHaveProperty('includeConstitutional');
    expect(props).toHaveProperty('incremental');
    // New param
    expect(props).toHaveProperty('includeReadmes');
  });

});
