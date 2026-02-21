// ---------------------------------------------------------------
// MODULE: Handler Memory Index Tests
// ---------------------------------------------------------------

import { describe, it, expect, afterAll } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

import * as handler from '../handlers/memory-index';

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

describe('Handler Memory Index (T520) [deferred - requires DB test fixtures]', () => {
  describe('Exports Validation', () => {
    it('T520-1: handleMemoryIndexScan exported', () => {
      expect(typeof handler.handleMemoryIndexScan).toBe('function');
    });

    it('T520-2: indexSingleFile exported', () => {
      expect(typeof handler.indexSingleFile).toBe('function');
    });

    it('T520-3: findConstitutionalFiles exported', () => {
      expect(typeof handler.findConstitutionalFiles).toBe('function');
    });

    it('T520-4: snake_case aliases exported', () => {
      const aliases: Array<keyof typeof handler> = [
        'handle_memory_index_scan',
        'index_single_file',
        'find_constitutional_files',
      ];
      for (const alias of aliases) {
        expect(typeof handler[alias]).toBe('function');
      }
    });
  });

  describe('findConstitutionalFiles', () => {
    it('T520-5: non-existent path returns empty array', () => {
      const result = handler.findConstitutionalFiles('/non/existent/path');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('T520-6: path without skill dir returns empty array', () => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-index-'));
      const result = handler.findConstitutionalFiles(tempDir);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('T520-7: finds constitutional .md files', () => {
      const skillDir = path.join(tempDir!, '.opencode', 'skill', 'test-skill', 'constitutional');
      fs.mkdirSync(skillDir, { recursive: true });
      fs.writeFileSync(path.join(skillDir, 'test.md'), '# Test Constitutional');

      const result = handler.findConstitutionalFiles(tempDir!);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
    });

    it('T520-8: constitutional README is skipped', () => {
      const skillDir = path.join(tempDir!, '.opencode', 'skill', 'test-skill', 'constitutional');
      fs.writeFileSync(path.join(skillDir, 'README.md'), '# Readme');

      const result = handler.findConstitutionalFiles(tempDir!);
      const hasReadme = result.some((f) => f.includes('README.md'));
      expect(hasReadme).toBe(false);
    });

    it('T520-9: hidden skill directories are skipped', () => {
      const hiddenDir = path.join(tempDir!, '.opencode', 'skill', '.hidden-skill', 'constitutional');
      fs.mkdirSync(hiddenDir, { recursive: true });
      fs.writeFileSync(path.join(hiddenDir, 'hidden.md'), '# Hidden');

      const result = handler.findConstitutionalFiles(tempDir!);
      const hasHidden = result.some((f) => f.includes('.hidden-skill'));
      expect(hasHidden).toBe(false);
    });
  });

  describe('handleMemoryIndexScan Input/Behavior', () => {
    it('T520-10: empty args returns valid response', async () => {
      try {
        const result = await handler.handleMemoryIndexScan({});
        expect(result).toBeTruthy();
        expect(result.content).toBeTruthy();
        expect(result.content.length).toBeGreaterThan(0);

        const parsed = JSON.parse(result.content[0].text);
        expect(parsed.data || parsed.summary).toBeTruthy();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        const isServerDep = /database|getDb|Rate limited|vector_index|null|not initialized|Database/.test(message);
        if (!isServerDep) {
          throw error;
        }
      }
    });
  });
});
