// @ts-nocheck
import { describe, it, expect } from 'vitest';
import * as mod from '../lib/parsing/memory-parser';

// ---------------------------------------------------------------
// TEST: MEMORY PARSER - README & isProjectReadme COVERAGE
// Covers: isMemoryFile (README paths), extractSpecFolder (README paths),
//         isProjectReadme, README_EXCLUDE_PATTERNS behavior
// Context: Spec 111 (README Anchor Schema) added README indexing
// ---------------------------------------------------------------

describe('MEMORY PARSER - README INDEXING', () => {

  // ─── 1. isMemoryFile: README paths ──────────────────────────

  describe('isMemoryFile - skill README recognition', () => {
    it('R01: accepts skill README.md', () => {
      expect(mod.isMemoryFile('/project/.opencode/skill/my-skill/README.md')).toBe(true);
    });

    it('R02: accepts skill readme.md (lowercase)', () => {
      expect(mod.isMemoryFile('/project/.opencode/skill/my-skill/readme.md')).toBe(true);
    });

    it('R03: accepts nested skill README', () => {
      expect(mod.isMemoryFile('/project/.opencode/skill/my-skill/subdir/README.md')).toBe(true);
    });

    it('R03b: accepts skill README.txt', () => {
      expect(mod.isMemoryFile('/project/.opencode/skill/my-skill/README.txt')).toBe(true);
    });

    it('R04: rejects skill constitutional README.md', () => {
      expect(mod.isMemoryFile('/project/.opencode/skill/my-skill/constitutional/README.md')).toBe(false);
    });

    it('R05: accepts non-README .md in constitutional dir', () => {
      expect(mod.isMemoryFile('/project/.opencode/skill/my-skill/constitutional/rules.md')).toBe(true);
    });
  });

  describe('isMemoryFile - project README recognition', () => {
    it('R06: accepts top-level project README.md', () => {
      expect(mod.isMemoryFile('/project/README.md')).toBe(true);
    });

    it('R07: accepts code-folder README.md', () => {
      expect(mod.isMemoryFile('/project/src/components/README.md')).toBe(true);
    });

    it('R07b: accepts code-folder README.txt', () => {
      expect(mod.isMemoryFile('/project/src/components/README.txt')).toBe(true);
    });

    it('R08: rejects README.md in node_modules', () => {
      expect(mod.isMemoryFile('/project/node_modules/some-pkg/README.md')).toBe(false);
    });

    it('R09: rejects README.md in .git directory', () => {
      expect(mod.isMemoryFile('/project/.git/README.md')).toBe(false);
    });

    it('R10: rejects README.md in dist/', () => {
      expect(mod.isMemoryFile('/project/dist/README.md')).toBe(false);
    });

    it('R11: rejects README.md in build/', () => {
      expect(mod.isMemoryFile('/project/build/README.md')).toBe(false);
    });

    it('R12: rejects README.md in .next/', () => {
      expect(mod.isMemoryFile('/project/.next/README.md')).toBe(false);
    });

    it('R13: rejects README.md in coverage/', () => {
      expect(mod.isMemoryFile('/project/coverage/README.md')).toBe(false);
    });

    it('R14: rejects README.md in vendor/', () => {
      expect(mod.isMemoryFile('/project/vendor/lib/README.md')).toBe(false);
    });

    it('R15: rejects README.md in __pycache__/', () => {
      expect(mod.isMemoryFile('/project/__pycache__/README.md')).toBe(false);
    });

    it('R16: rejects README.md in .pytest_cache/', () => {
      expect(mod.isMemoryFile('/project/.pytest_cache/README.md')).toBe(false);
    });

    it('R17: rejects README.md in .opencode/skill/ (excluded by pattern)', () => {
      // .opencode/skill/ is in the exclude list but skill READMEs are
      // caught by the isSkillReadme branch first, so a README that is
      // NOT under .opencode/skill/ should still work as a project README
      // However a project-readme-only check should fail for skill paths
      expect(mod.isProjectReadme('/project/.opencode/skill/my-skill/README.md')).toBe(false);
    });
  });

  describe('isMemoryFile - non-README edge cases', () => {
    it('R18: rejects non-.md file even in skill dir', () => {
      expect(mod.isMemoryFile('/project/.opencode/skill/my-skill/config.json')).toBe(false);
    });

    it('R19: rejects CHANGELOG.md (not README)', () => {
      expect(mod.isMemoryFile('/project/CHANGELOG.md')).toBe(false);
    });

    it('R20: rejects file named readme-extra.md', () => {
      // Only exact "readme.md" or "readme.txt" should match
      expect(mod.isMemoryFile('/project/readme-extra.md')).toBe(false);
    });

    it('R21: handles Windows backslash paths for skill README', () => {
      expect(mod.isMemoryFile('C:\\project\\.opencode\\skill\\my-skill\\README.md')).toBe(true);
    });

    it('R22: handles Windows backslash paths for project README', () => {
      expect(mod.isMemoryFile('C:\\project\\src\\README.md')).toBe(true);
    });
  });

  // ─── 2. extractSpecFolder: README paths ─────────────────────

  describe('extractSpecFolder - skill README paths', () => {
    it('R23: returns skill:SKILL-NAME for skill README', () => {
      const result = mod.extractSpecFolder('/project/.opencode/skill/system-spec-kit/README.md');
      expect(result).toBe('skill:system-spec-kit');
    });

    it('R24: returns skill:SKILL-NAME for nested skill README', () => {
      const result = mod.extractSpecFolder('/project/.opencode/skill/sk-code--web/references/README.md');
      expect(result).toBe('skill:sk-code--web');
    });

    it('R25: returns skill:SKILL-NAME with Windows backslashes', () => {
      const result = mod.extractSpecFolder('C:\\project\\.opencode\\skill\\my-skill\\README.md');
      expect(result).toBe('skill:my-skill');
    });

    it('R26: returns skill:SKILL-NAME case-insensitive readme match', () => {
      const result = mod.extractSpecFolder('/project/.opencode/skill/my-tool/readme.md');
      expect(result).toBe('skill:my-tool');
    });

    it('R26b: returns skill:SKILL-NAME for README.txt', () => {
      const result = mod.extractSpecFolder('/project/.opencode/skill/my-tool/README.txt');
      expect(result).toBe('skill:my-tool');
    });
  });

  describe('extractSpecFolder - project README paths', () => {
    it('R27: returns project-readmes for top-level README', () => {
      const result = mod.extractSpecFolder('/project/README.md');
      expect(result).toBe('project-readmes');
    });

    it('R28: returns project-readmes for code-folder README', () => {
      const result = mod.extractSpecFolder('/project/src/components/README.md');
      expect(result).toBe('project-readmes');
    });

    it('R28b: returns project-readmes for code-folder README.txt', () => {
      const result = mod.extractSpecFolder('/project/src/components/README.txt');
      expect(result).toBe('project-readmes');
    });
  });

  describe('extractSpecFolder - standard memory paths (regression)', () => {
    it('R29: still works for standard specs memory path', () => {
      const result = mod.extractSpecFolder('/project/specs/003-auth/memory/session.md');
      expect(result).toBe('003-auth');
    });

    it('R30: still works for nested sub-folder memory path', () => {
      const result = mod.extractSpecFolder('/project/specs/003-auth/001-login/memory/context.md');
      expect(result).toBe('003-auth/001-login');
    });

    it('R31: handles UNC paths', () => {
      const result = mod.extractSpecFolder('//server/share/specs/005-deploy/memory/note.md');
      expect(result).toBe('005-deploy');
    });

    it('R32: handles Windows UNC backslash paths', () => {
      const result = mod.extractSpecFolder('\\\\server\\share\\specs\\005-deploy\\memory\\note.md');
      expect(result).toBe('005-deploy');
    });
  });

  // ─── 3. isProjectReadme ─────────────────────────────────────

  describe('isProjectReadme', () => {
    it('R33: accepts top-level README.md', () => {
      expect(mod.isProjectReadme('/project/README.md')).toBe(true);
    });

    it('R34: accepts nested code-folder README.md', () => {
      expect(mod.isProjectReadme('/project/packages/core/README.md')).toBe(true);
    });

    it('R35: accepts README.md with mixed case path', () => {
      expect(mod.isProjectReadme('/Project/Src/README.md')).toBe(true);
    });

    it('R36: rejects non-readme.md filename', () => {
      expect(mod.isProjectReadme('/project/CONTRIBUTING.md')).toBe(false);
    });

    it('R37: accepts readme.txt', () => {
      expect(mod.isProjectReadme('/project/readme.txt')).toBe(true);
    });

    it('R38: rejects node_modules README', () => {
      expect(mod.isProjectReadme('/project/node_modules/pkg/README.md')).toBe(false);
    });

    it('R39: rejects .git README', () => {
      expect(mod.isProjectReadme('/project/.git/README.md')).toBe(false);
    });

    it('R40: rejects .opencode/skill/ README', () => {
      expect(mod.isProjectReadme('/project/.opencode/skill/foo/README.md')).toBe(false);
    });

    it('R41: rejects dist/ README', () => {
      expect(mod.isProjectReadme('/project/dist/README.md')).toBe(false);
    });

    it('R42: rejects build/ README', () => {
      expect(mod.isProjectReadme('/project/build/README.md')).toBe(false);
    });

    it('R43: rejects .next/ README', () => {
      expect(mod.isProjectReadme('/project/.next/static/README.md')).toBe(false);
    });

    it('R44: rejects coverage/ README', () => {
      expect(mod.isProjectReadme('/project/coverage/lcov/README.md')).toBe(false);
    });

    it('R45: rejects vendor/ README', () => {
      expect(mod.isProjectReadme('/project/vendor/github.com/pkg/README.md')).toBe(false);
    });

    it('R46: rejects __pycache__ README', () => {
      expect(mod.isProjectReadme('/project/src/__pycache__/README.md')).toBe(false);
    });

    it('R47: rejects .pytest_cache README', () => {
      expect(mod.isProjectReadme('/project/.pytest_cache/v/README.md')).toBe(false);
    });

    it('R48: handles Windows backslash paths', () => {
      expect(mod.isProjectReadme('C:\\project\\src\\README.md')).toBe(true);
    });

    it('R49: rejects Windows node_modules path', () => {
      expect(mod.isProjectReadme('C:\\project\\node_modules\\pkg\\README.md')).toBe(false);
    });

    it('R50: exclude patterns are case-insensitive', () => {
      // node_modules contains lowercase; path has same case
      expect(mod.isProjectReadme('/project/Node_Modules/pkg/README.md')).toBe(false);
    });
  });

  // ─── 4. README_EXCLUDE_PATTERNS integration ─────────────────

  describe('README_EXCLUDE_PATTERNS coverage', () => {
    // Each pattern from the source should exclude the path from project README
    const excludedPaths = [
      { pattern: 'node_modules', path: '/p/node_modules/x/README.md' },
      { pattern: '.git/',        path: '/p/.git/README.md' },
      { pattern: '.opencode/skill/', path: '/p/.opencode/skill/foo/README.md' },
      { pattern: 'dist/',        path: '/p/dist/README.md' },
      { pattern: 'build/',       path: '/p/build/out/README.md' },
      { pattern: '.next/',       path: '/p/.next/server/README.md' },
      { pattern: 'coverage/',    path: '/p/coverage/README.md' },
      { pattern: 'vendor/',      path: '/p/vendor/README.md' },
      { pattern: '__pycache__',  path: '/p/__pycache__/README.md' },
      { pattern: '.pytest_cache', path: '/p/.pytest_cache/README.md' },
    ];

    for (const { pattern, path: testPath } of excludedPaths) {
      it(`R51-${pattern}: excludes "${pattern}" from project READMEs`, () => {
        expect(mod.isProjectReadme(testPath)).toBe(false);
      });
    }

    it('R52: non-excluded path is accepted as project README', () => {
      expect(mod.isProjectReadme('/project/lib/utils/README.md')).toBe(true);
    });
  });
});
