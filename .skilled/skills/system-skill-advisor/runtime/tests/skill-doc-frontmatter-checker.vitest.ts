// -----------------------------------------------------------------------------
// MODULE: Skill Doc Frontmatter Checker Tests
// -----------------------------------------------------------------------------
// Runs the CI frontmatter checker against a throwaway skills tree. The checker
// reads system-spec-kit's shared value list, so an alias such as `review` must
// pass and a value outside the list must still fail.

import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const CHECKER = path.resolve(import.meta.dirname, '..', 'scripts', 'check-skill-doc-frontmatter.mjs');

const roots: string[] = [];

function docBlock(contextType: string, tier: string): string {
  return [
    '---',
    'title: "Example"',
    'description: "Example doc."',
    'trigger_phrases:',
    '  - "first phrase"',
    '  - "second phrase"',
    '  - "third phrase"',
    `importance_tier: "${tier}"`,
    `contextType: "${contextType}"`,
    '---',
    '# Example',
    '',
  ].join('\n');
}

function makeTree(docs: Record<string, string>): string {
  const root = mkdtempSync(path.join(tmpdir(), 'skill-doc-fm-'));
  roots.push(root);
  const refs = path.join(root, '.skilled', 'skills', 'demo-skill', 'references');
  mkdirSync(refs, { recursive: true });
  for (const [name, body] of Object.entries(docs)) writeFileSync(path.join(refs, name), body);
  return root;
}

function runChecker(root: string): { code: number; out: string } {
  try {
    const out = execFileSync('node', [CHECKER, root, '--coverage'], { encoding: 'utf8' });
    return { code: 0, out };
  } catch (error) {
    const failed = error as { status?: number; stdout?: string };
    return { code: failed.status ?? -1, out: failed.stdout ?? '' };
  }
}

afterEach(() => {
  while (roots.length > 0) rmSync(roots.pop() as string, { recursive: true, force: true });
});

describe('check-skill-doc-frontmatter shared value list', () => {
  it('accepts canonical values and aliases', () => {
    const root = makeTree({
      'canonical.md': docBlock('planning', 'normal'),
      'alias.md': docBlock('review', 'high'),
    });
    const result = runChecker(root);
    expect(result.code).toBe(0);
    expect(result.out).toContain('violations=0');
  });

  it('fails a value outside the shared list', () => {
    const root = makeTree({ 'outlier.md': docBlock('architecture', 'normal') });
    const result = runChecker(root);
    expect(result.code).toBe(1);
    expect(result.out).toContain('contextType "architecture" not in');
  });
});
