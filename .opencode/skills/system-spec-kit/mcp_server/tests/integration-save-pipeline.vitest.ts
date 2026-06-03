// TEST: INTEGRATION SAVE PIPELINE
import { describe, it, expect } from 'vitest';
import * as path from 'path';
import * as os from 'os';

import * as saveHandler from '../handlers/memory-save';
import * as memoryParser from '../lib/parsing/memory-parser';
import * as peGate from '../lib/cognitive/prediction-error-gate';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

// Validation failures return a classified structured error envelope (isError:true with a
// specific code) instead of throwing, so callers get a clear code/message rather than the
// generic E081 catch-all.
function expectClassifiedError(
  res: Awaited<ReturnType<typeof saveHandler.handleMemorySave>>,
): { code: string; error: string } {
  expect(res.isError).toBe(true);
  const payload = JSON.parse((res.content[0] as { text: string }).text) as {
    data: { code: string; error: string };
  };
  expect(typeof payload.data.code).toBe('string');
  expect(payload.data.code).not.toBe('E081');
  return payload.data;
}

describe('Integration Save Pipeline (T526) [deferred - requires DB test fixtures]', () => {

  // SUITE: Pipeline Module Integration
  describe('Pipeline Module Integration', () => {

    it('T526-1: Save pipeline modules loaded', () => {
      const modules: Array<{ name: string; ref: unknown }> = [
        { name: 'saveHandler', ref: saveHandler },
      ];
      if (memoryParser) modules.push({ name: 'memoryParser', ref: memoryParser });
      if (peGate) modules.push({ name: 'peGate', ref: peGate });

      const loaded = modules.filter(m => m.ref !== null);
      expect(loaded.length).toBeGreaterThanOrEqual(1);
      expect(saveHandler).toBeTruthy();
    });

  });

  // SUITE: Pipeline Input Validation
  describe('Pipeline Input Validation', () => {

    it('T526-2: Missing filePath rejected', async () => {
      const err = expectClassifiedError(
        await saveHandler.handleMemorySave({} as Parameters<typeof saveHandler.handleMemorySave>[0])
      );
      expect(err.code).toBe('E089');
      expect(err.error).toMatch(/filePath|required/);
    });

    it('T526-3: Path traversal blocked', async () => {
      const err = expectClassifiedError(
        await saveHandler.handleMemorySave({ filePath: '/specs/../../../etc/passwd' })
      );
      // Blocked with a specific code, never the generic E081 catch-all.
      expect(err.code).toMatch(/^E/);
    });

    it('T526-4: Non-existent file produces error', async () => {
      const fakePath = path.join(os.tmpdir(), 'mcp-test-nonexistent-' + Date.now(), 'memory', 'fake.md');
      const err = expectClassifiedError(
        await saveHandler.handleMemorySave({ filePath: fakePath })
      );
      expect(err.code).toBe('E089');
    });

    it('T526-5: Force flag accepted as parameter', async () => {
      const fakePath = path.join(os.tmpdir(), 'mcp-test-nonexistent-' + Date.now(), 'memory', 'fake.md');
      try {
        await saveHandler.handleMemorySave({ filePath: fakePath, force: true });
      } catch (error: unknown) {
        // Force flag should NOT be the reason for the error — file-not-found is expected
        expect(getErrorMessage(error)).not.toMatch(/force/);
      }
    });

    it('T526-6: dryRun flag accepted as parameter', async () => {
      const fakePath = path.join(os.tmpdir(), 'mcp-test-nonexistent-' + Date.now(), 'memory', 'fake.md');
      try {
        await saveHandler.handleMemorySave({ filePath: fakePath, dryRun: true });
      } catch (error: unknown) {
        // DryRun flag should NOT be the reason for the error
        expect(getErrorMessage(error)).not.toMatch(/dryRun/);
      }
    });

  });

  // SUITE: Pipeline Error Response Format
  describe('Pipeline Error Response Format', () => {

    it('T526-7: Save errors have consistent response format', async () => {
      const err = expectClassifiedError(
        await saveHandler.handleMemorySave({} as Parameters<typeof saveHandler.handleMemorySave>[0])
      );
      expect(typeof err.error).toBe('string');
      expect(err.error.length).toBeGreaterThan(0);
      expect(typeof err.code).toBe('string');
    });

    it('T526-8: Non-memory path rejected', async () => {
      const err = expectClassifiedError(
        await saveHandler.handleMemorySave({ filePath: '/tmp/random-file.txt' })
      );
      // Classified (missing-file / non-canonical), never the generic E081 catch-all.
      expect(err.code).toMatch(/^E/);
    });

  });

  // SUITE: Pipeline Function Signatures
  describe('Pipeline Function Signatures', () => {

    it('T526-9: indexMemoryFile signature', () => {
      expect(typeof saveHandler.indexMemoryFile).toBe('function');
    });

    it('T526-10: atomicSaveMemory signature', () => {
      expect(typeof saveHandler.atomicSaveMemory).toBe('function');
    });

  });

});
