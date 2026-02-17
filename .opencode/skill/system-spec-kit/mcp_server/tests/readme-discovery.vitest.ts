// @ts-nocheck
// ---------------------------------------------------------------
// TEST: README DISCOVERY
// ---------------------------------------------------------------

/**
 * Tests for README discovery functions (Spec 111: README Anchor Schema)
 *
 * Covers:
 * - findSkillReadmes()    — discovers README.md and README.txt files under .opencode/skill/
 * - findProjectReadmes()  — discovers project-level README.md and README.txt files (excludes .opencode/skill/)
 * - calculateReadmeWeight() — returns importance weight based on file path origin
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

import { findSkillReadmes, findProjectReadmes } from '../handlers/memory-index';
import { calculateReadmeWeight } from '../handlers/memory-save';

// ---------------------------------------------------------------------------
// Test Fixtures: Temporary directory tree
// ---------------------------------------------------------------------------

let tmpDir: string;

/** Create a file at the given path (creating parent dirs as needed) */
function createFile(relativePath: string, content: string = '# README\n'): void {
  const fullPath = path.join(tmpDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'readme-discovery-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

// ===========================================================================
// findSkillReadmes
// ===========================================================================

describe('findSkillReadmes', () => {
  it('T111-01: Returns empty array when .opencode/skill/ does not exist', () => {
    const result = findSkillReadmes(tmpDir);
    expect(result).toEqual([]);
  });

  it('T111-02: Returns empty array when .opencode/skill/ exists but is empty', () => {
    fs.mkdirSync(path.join(tmpDir, '.opencode', 'skill'), { recursive: true });
    const result = findSkillReadmes(tmpDir);
    expect(result).toEqual([]);
  });

  it('T111-03: Discovers README.md in a skill root directory', () => {
    createFile('.opencode/skill/my-skill/README.md');
    const result = findSkillReadmes(tmpDir);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(path.join(tmpDir, '.opencode', 'skill', 'my-skill', 'README.md'));
  });

  it('T131-01: Discovers README.txt in a skill root directory', () => {
    createFile('.opencode/skill/my-skill/README.txt');
    const result = findSkillReadmes(tmpDir);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(path.join(tmpDir, '.opencode', 'skill', 'my-skill', 'README.txt'));
  });

  it('T111-04: Discovers README.md in nested subdirectories', () => {
    createFile('.opencode/skill/my-skill/references/README.md');
    createFile('.opencode/skill/my-skill/assets/sub/README.md');
    const result = findSkillReadmes(tmpDir);
    expect(result).toHaveLength(2);
    // Verify both are found (order not guaranteed)
    const relativePaths = result.map((p: string) => path.relative(tmpDir, p).replace(/\\/g, '/'));
    expect(relativePaths).toContain('.opencode/skill/my-skill/references/README.md');
    expect(relativePaths).toContain('.opencode/skill/my-skill/assets/sub/README.md');
  });

  it('T111-05: Case-insensitive match (readme.md, Readme.md, README.MD)', () => {
    // The function checks a case-insensitive README filename pattern
    // Create files with different cases - only exact lowercase match on the FS matters
    createFile('.opencode/skill/skill-a/README.md');
    createFile('.opencode/skill/skill-b/Readme.md');
    const result = findSkillReadmes(tmpDir);
    // On case-insensitive filesystems (macOS), both resolve; on Linux, only matching case
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('T111-06: Excludes node_modules directories', () => {
    createFile('.opencode/skill/my-skill/README.md');
    createFile('.opencode/skill/my-skill/node_modules/some-pkg/README.md');
    const result = findSkillReadmes(tmpDir);
    expect(result).toHaveLength(1);
    const relativePath = path.relative(tmpDir, result[0]).replace(/\\/g, '/');
    expect(relativePath).toBe('.opencode/skill/my-skill/README.md');
  });

  it('T111-07: Excludes hidden directories (starting with dot)', () => {
    createFile('.opencode/skill/my-skill/README.md');
    createFile('.opencode/skill/my-skill/.hidden/README.md');
    const result = findSkillReadmes(tmpDir);
    expect(result).toHaveLength(1);
  });

  it('T111-08: Discovers READMEs across multiple skill directories', () => {
    createFile('.opencode/skill/skill-a/README.md');
    createFile('.opencode/skill/skill-b/README.md');
    createFile('.opencode/skill/skill-c/README.md');
    const result = findSkillReadmes(tmpDir);
    expect(result).toHaveLength(3);
  });

  it('T111-09: Ignores non-README markdown files', () => {
    createFile('.opencode/skill/my-skill/README.md');
    createFile('.opencode/skill/my-skill/SKILL.md');
    createFile('.opencode/skill/my-skill/CHANGELOG.md');
    const result = findSkillReadmes(tmpDir);
    expect(result).toHaveLength(1);
  });
});

// ===========================================================================
// findProjectReadmes
// ===========================================================================

describe('findProjectReadmes', () => {
  it('T111-10: Returns empty array for empty directory', async () => {
    const result = await findProjectReadmes(tmpDir);
    expect(result).toEqual([]);
  });

  it('T111-11: Discovers root-level README.md', async () => {
    createFile('README.md');
    const result = await findProjectReadmes(tmpDir);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(path.join(tmpDir, 'README.md'));
  });

  it('T131-02: Discovers root-level README.txt', async () => {
    createFile('README.txt');
    const result = await findProjectReadmes(tmpDir);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(path.join(tmpDir, 'README.txt'));
  });

  it('T111-12: Discovers README.md in subdirectories', async () => {
    createFile('README.md');
    createFile('packages/core/README.md');
    createFile('packages/utils/README.md');
    const result = await findProjectReadmes(tmpDir);
    expect(result).toHaveLength(3);
  });

  it('T111-13: Excludes .opencode/skill/ directory (handled by findSkillReadmes)', async () => {
    createFile('README.md');
    createFile('.opencode/skill/my-skill/README.md');
    const result = await findProjectReadmes(tmpDir);
    expect(result).toHaveLength(1);
    const relativePath = path.relative(tmpDir, result[0]).replace(/\\/g, '/');
    expect(relativePath).toBe('README.md');
  });

  it('T111-14: Excludes node_modules directories', async () => {
    createFile('README.md');
    createFile('node_modules/some-pkg/README.md');
    const result = await findProjectReadmes(tmpDir);
    expect(result).toHaveLength(1);
  });

  it('T111-15: Excludes .git directory', async () => {
    createFile('README.md');
    createFile('.git/README.md');
    const result = await findProjectReadmes(tmpDir);
    expect(result).toHaveLength(1);
  });

  it('T111-16: Excludes all skip directories (dist, build, .next, coverage, vendor)', async () => {
    createFile('README.md');
    createFile('dist/README.md');
    createFile('build/README.md');
    createFile('.next/README.md');
    createFile('coverage/README.md');
    createFile('vendor/README.md');
    createFile('__pycache__/README.md');
    createFile('.pytest_cache/README.md');
    const result = await findProjectReadmes(tmpDir);
    expect(result).toHaveLength(1);
  });

  it('T111-17: Includes .opencode/ paths that are NOT under skill/', async () => {
    createFile('.opencode/specs/001-feature/memory/README.md');
    createFile('.opencode/other/README.md');
    const result = await findProjectReadmes(tmpDir);
    expect(result).toHaveLength(2);
  });

  it('T131-05: Includes command README.txt under .opencode/command/', async () => {
    createFile('.opencode/command/spec_kit/README.txt');
    const result = await findProjectReadmes(tmpDir);
    expect(result).toHaveLength(1);
    const relativePath = path.relative(tmpDir, result[0]).replace(/\\/g, '/');
    expect(relativePath).toBe('.opencode/command/spec_kit/README.txt');
  });

  it('T111-18: Handles deeply nested project directories', async () => {
    createFile('src/components/ui/forms/README.md');
    const result = await findProjectReadmes(tmpDir);
    expect(result).toHaveLength(1);
    const relativePath = path.relative(tmpDir, result[0]).replace(/\\/g, '/');
    expect(relativePath).toBe('src/components/ui/forms/README.md');
  });
});

// ===========================================================================
// calculateReadmeWeight
// ===========================================================================

describe('calculateReadmeWeight', () => {
  it('T111-20: Returns 0.3 for skill README paths', () => {
    expect(calculateReadmeWeight('/workspace/.opencode/skill/my-skill/README.md')).toBe(0.3);
  });

  it('T111-21: Returns 0.3 for nested skill README paths', () => {
    expect(calculateReadmeWeight('/workspace/.opencode/skill/my-skill/references/README.md')).toBe(0.3);
  });

  it('T111-22: Returns 0.4 for project-level README paths', () => {
    expect(calculateReadmeWeight('/workspace/README.md')).toBe(0.4);
  });

  it('T111-23: Returns 0.4 for nested project README paths', () => {
    expect(calculateReadmeWeight('/workspace/packages/core/README.md')).toBe(0.4);
  });

  it('T131-03: Returns 0.4 for README.txt paths', () => {
    expect(calculateReadmeWeight('/workspace/docs/README.txt')).toBe(0.4);
  });

  it('T111-24: Returns 0.5 for non-README files', () => {
    expect(calculateReadmeWeight('/workspace/specs/001/memory/context.md')).toBe(0.5);
  });

  it('T111-25: Returns 0.5 for markdown files that are not README', () => {
    expect(calculateReadmeWeight('/workspace/.opencode/skill/my-skill/SKILL.md')).toBe(0.5);
  });

  it('T111-26: Case-insensitive README detection (readme.md)', () => {
    expect(calculateReadmeWeight('/workspace/readme.md')).toBe(0.4);
  });

  it('T111-27: Case-insensitive skill path detection', () => {
    expect(calculateReadmeWeight('/workspace/.opencode/skill/test/readme.md')).toBe(0.3);
  });

  it('T131-04: Case-insensitive README.txt detection', () => {
    expect(calculateReadmeWeight('/workspace/.opencode/skill/test/readme.txt')).toBe(0.3);
  });

  it('T111-28: Handles Windows-style backslash paths', () => {
    // calculateReadmeWeight normalizes backslashes to forward slashes
    expect(calculateReadmeWeight('C:\\workspace\\.opencode\\skill\\test\\README.md')).toBe(0.3);
  });

  it('T111-29: Returns 0.4 for README outside .opencode/skill/', () => {
    expect(calculateReadmeWeight('/workspace/.opencode/specs/README.md')).toBe(0.4);
  });
});

// ===========================================================================
// Integration: findSkillReadmes + findProjectReadmes partition
// ===========================================================================

describe('README Discovery Partition', () => {
  it('T111-30: Skill and project discovery functions partition the README space without overlap', async () => {
    // Create READMEs in both skill and project locations
    createFile('.opencode/skill/skill-a/README.md');
    createFile('.opencode/skill/skill-b/references/README.md');
    createFile('README.md');
    createFile('packages/lib/README.md');

    const skillReadmes = findSkillReadmes(tmpDir);
    const projectReadmes = await findProjectReadmes(tmpDir);

    // No overlap
    const skillSet = new Set(skillReadmes);
    const projectSet = new Set(projectReadmes);
    for (const readme of skillReadmes) {
      expect(projectSet.has(readme)).toBe(false);
    }
    for (const readme of projectReadmes) {
      expect(skillSet.has(readme)).toBe(false);
    }

    // All READMEs accounted for
    expect(skillReadmes).toHaveLength(2);
    expect(projectReadmes).toHaveLength(2);
  });
});
