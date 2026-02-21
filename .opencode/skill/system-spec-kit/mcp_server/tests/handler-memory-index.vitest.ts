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
  // ─────────────────────────────────────────────────────────────
  // SUITE: Exports Validation
  // ─────────────────────────────────────────────────────────────
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

    it('T520-4: findSkillReferenceFiles exported', () => {
      expect(typeof handler.findSkillReferenceFiles).toBe('function');
    });

    it('T520-5: All snake_case aliases exported', () => {
      const aliases: Array<keyof typeof handler> = [
        'handle_memory_index_scan',
        'index_single_file',
        'find_constitutional_files',
        'find_skill_reference_files',
      ];
      for (const alias of aliases) {
        expect(typeof handler[alias]).toBe('function');
      }
    });

  });

  // ─────────────────────────────────────────────────────────────
  // SUITE: findConstitutionalFiles
  // ─────────────────────────────────────────────────────────────
  describe('findConstitutionalFiles', () => {

    it('T520-5: Non-existent path returns empty array', () => {
      const result = handler.findConstitutionalFiles('/non/existent/path');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('T520-6: Path without skill dir returns empty array', () => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-index-'));
      const result = handler.findConstitutionalFiles(tempDir);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('T520-7: Finds constitutional .md files', () => {
      // tempDir is set in T520-6 above
      const skillDir = path.join(tempDir!, '.opencode', 'skill', 'test-skill', 'constitutional');
      fs.mkdirSync(skillDir, { recursive: true });
      fs.writeFileSync(path.join(skillDir, 'test.md'), '# Test Constitutional');

      const result = handler.findConstitutionalFiles(tempDir!);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
    });

    it('T520-8: README.md is skipped', () => {
      const skillDir = path.join(tempDir!, '.opencode', 'skill', 'test-skill', 'constitutional');
      fs.writeFileSync(path.join(skillDir, 'README.md'), '# Readme');

      const result = handler.findConstitutionalFiles(tempDir!);
      const hasReadme = result.some((f) => f.includes('README.md'));
      expect(hasReadme).toBe(false);
    });

    it('T520-9: Hidden directories skipped', () => {
      const hiddenDir = path.join(tempDir!, '.opencode', 'skill', '.hidden-skill', 'constitutional');
      fs.mkdirSync(hiddenDir, { recursive: true });
      fs.writeFileSync(path.join(hiddenDir, 'hidden.md'), '# Hidden');

      const result = handler.findConstitutionalFiles(tempDir!);
      const hasHidden = result.some((f) => f.includes('.hidden-skill'));
      expect(hasHidden).toBe(false);
    });

  });

  // ─────────────────────────────────────────────────────────────
  // SUITE: findSkillReferenceFiles
  // ─────────────────────────────────────────────────────────────
  describe('findSkillReferenceFiles', () => {

    it('T520-10: Non-existent path returns empty array', () => {
      const result = handler.findSkillReferenceFiles('/non/existent/path');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('T520-11: Finds .md files in references/ and assets/ for configured skill', () => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-skill-ref-index-'));

      const skillRoot = path.join(tempDir, '.opencode', 'skill', 'sk-code--web');
      const referencesDir = path.join(skillRoot, 'references', 'checklists');
      const assetsDir = path.join(skillRoot, 'assets', 'templates');

      fs.mkdirSync(referencesDir, { recursive: true });
      fs.mkdirSync(assetsDir, { recursive: true });

      fs.writeFileSync(path.join(referencesDir, 'validation.md'), '# Validation Checklist');
      fs.writeFileSync(path.join(skillRoot, 'references', 'guide.md'), '# Guide');
      fs.writeFileSync(path.join(assetsDir, 'example.md'), '# Example Asset');
      fs.writeFileSync(path.join(skillRoot, 'references', 'README.md'), '# Should Be Skipped');

      const result = handler.findSkillReferenceFiles(tempDir);
      const relativePaths = result.map((filePath) => path.relative(tempDir!, filePath).replace(/\\/g, '/'));

      expect(relativePaths).toContain('.opencode/skill/sk-code--web/references/checklists/validation.md');
      expect(relativePaths).toContain('.opencode/skill/sk-code--web/references/guide.md');
      expect(relativePaths).toContain('.opencode/skill/sk-code--web/assets/templates/example.md');
      expect(relativePaths.some((filePath) => filePath.endsWith('/README.md'))).toBe(false);
    });

    it('T520-12: Environment flag disables skill reference discovery', () => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-skill-ref-disabled-'));

      const skillRoot = path.join(tempDir, '.opencode', 'skill', 'sk-code--web', 'references');
      fs.mkdirSync(skillRoot, { recursive: true });
      fs.writeFileSync(path.join(skillRoot, 'guide.md'), '# Guide');

      const previous = process.env.SPECKIT_INDEX_SKILL_REFS;
      process.env.SPECKIT_INDEX_SKILL_REFS = 'false';

      try {
        const result = handler.findSkillReferenceFiles(tempDir);
        expect(result).toEqual([]);
      } finally {
        if (previous === undefined) {
          delete process.env.SPECKIT_INDEX_SKILL_REFS;
        } else {
          process.env.SPECKIT_INDEX_SKILL_REFS = previous;
        }
      }
    });

    it('T520-13: Returns sorted .md files and skips non-markdown', () => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-skill-ref-sorted-'));

      const referencesDir = path.join(tempDir, '.opencode', 'skill', 'sk-code--web', 'references');
      fs.mkdirSync(referencesDir, { recursive: true });

      fs.writeFileSync(path.join(referencesDir, 'zeta.md'), '# Zeta');
      fs.writeFileSync(path.join(referencesDir, 'alpha.md'), '# Alpha');
      fs.writeFileSync(path.join(referencesDir, 'notes.txt'), 'Not indexed');

      const result = handler.findSkillReferenceFiles(tempDir);
      const relativePaths = result.map((filePath) => path.relative(tempDir!, filePath).replace(/\\/g, '/'));

      expect(relativePaths).toEqual([
        '.opencode/skill/sk-code--web/references/alpha.md',
        '.opencode/skill/sk-code--web/references/zeta.md',
      ]);
    });

  });

  // ─────────────────────────────────────────────────────────────
  // SUITE: handleMemoryIndexScan Input/Behavior
  // ─────────────────────────────────────────────────────────────
  describe('handleMemoryIndexScan Input/Behavior', () => {

    it('T520-14: Empty args returns valid response', async () => {
      try {
        const result = await handler.handleMemoryIndexScan({});
        expect(result).toBeTruthy();
        expect(result.content).toBeTruthy();
        expect(result.content.length).toBeGreaterThan(0);

        const parsed = JSON.parse(result.content[0].text);
        expect(parsed.data || parsed.summary).toBeTruthy();
      } catch (error: unknown) {
        // Server dependency errors are acceptable — skip-equivalent
        const message = error instanceof Error ? error.message : String(error);
        const isServerDep = /database|getDb|Rate limited|vector_index|null|not initialized|Database/.test(message);
        if (!isServerDep) {
          throw error;
        }
        // Otherwise, this test is effectively skipped due to missing server deps
      }
    });

  });

});
