import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { deriveGraphMetadata } from '../../mcp-server/lib/graph/graph-metadata-parser.js';

const createdRoots = new Set<string>();

// The derivation locates the repository root by walking up to `specs/`, so the
// fixture has to reproduce that shape for repo-relative candidates to resolve.
function makeRepo(): { repoRoot: string; specFolder: string } {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'graph-key-files-'));
  createdRoots.add(repoRoot);
  fs.mkdirSync(path.join(repoRoot, '.opencode'), { recursive: true });
  const specFolder = path.join(repoRoot, 'specs', 'system-spec-kit', '901-key-files');
  fs.mkdirSync(specFolder, { recursive: true });
  return { repoRoot, specFolder };
}

function writeSpec(specFolder: string, declared: string[], body = ''): void {
  fs.writeFileSync(
    path.join(specFolder, 'spec.md'),
    [
      '---',
      'title: "Key Files"',
      'description: "Fixture for key file derivation."',
      'trigger_phrases: ["key files"]',
      'importance_tier: "normal"',
      'contextType: "general"',
      '_memory:',
      '  continuity:',
      '    key_files:',
      ...declared.map((entry) => `      - "${entry}"`),
      '---',
      '',
      '# Key Files',
      '',
      body,
    ].join('\n'),
    'utf-8',
  );
}

function keyFiles(specFolder: string): string[] {
  return deriveGraphMetadata(specFolder, null, {})?.derived?.key_files ?? [];
}

afterEach(() => {
  for (const root of createdRoots) fs.rmSync(root, { recursive: true, force: true });
  createdRoots.clear();
});

describe('derived key files', () => {
  // The noise filter rejects bare filenames because a name mentioned in prose is
  // usually a false positive. A frontmatter entry is a declaration, not a guess.
  it('keeps a declared bare filename that resolves to a real file', () => {
    const { repoRoot, specFolder } = makeRepo();
    fs.writeFileSync(path.join(repoRoot, 'AGENTS.md'), '# Agents\n', 'utf-8');
    writeSpec(specFolder, ['AGENTS.md']);

    expect(keyFiles(specFolder)).toContain('AGENTS.md');
  });

  it('keeps a declared file that has no extension', () => {
    const { repoRoot, specFolder } = makeRepo();
    const hookDir = path.join(repoRoot, '.opencode', 'scripts');
    fs.mkdirSync(hookDir, { recursive: true });
    fs.writeFileSync(path.join(hookDir, 'pre-push'), '#!/bin/sh\n', 'utf-8');
    writeSpec(specFolder, ['.opencode/scripts/pre-push']);

    expect(keyFiles(specFolder)).toContain('.opencode/scripts/pre-push');
  });

  // Existence on disk is what stands between a declaration and junk, so a
  // declaration that resolves to nothing must not reach the graph.
  it('drops a declared entry that resolves to nothing', () => {
    const { specFolder } = makeRepo();
    writeSpec(specFolder, ['NOT_A_REAL_FILE.md', 'this is prose, not a path']);

    const result = keyFiles(specFolder);
    expect(result).not.toContain('NOT_A_REAL_FILE.md');
    expect(result).not.toContain('this is prose, not a path');
  });

  // The same bare name carries no declaration when it only appears in prose, so
  // the filter that exists for guesses still applies to it.
  it('does not promote a bare filename that only appears in prose', () => {
    const { repoRoot, specFolder } = makeRepo();
    fs.writeFileSync(path.join(repoRoot, 'AGENTS.md'), '# Agents\n', 'utf-8');
    writeSpec(specFolder, [], 'This packet edits AGENTS.md in passing.');

    expect(keyFiles(specFolder)).not.toContain('AGENTS.md');
  });

  it('resolves a repository-relative declaration from a packet at the specs root', () => {
    const { repoRoot, specFolder } = makeRepo();
    const libDir = path.join(repoRoot, '.opencode', 'skills', 'demo');
    fs.mkdirSync(libDir, { recursive: true });
    fs.writeFileSync(path.join(libDir, 'SKILL.md'), '# Demo\n', 'utf-8');
    writeSpec(specFolder, ['.opencode/skills/demo/SKILL.md']);

    expect(keyFiles(specFolder)).toContain('.opencode/skills/demo/SKILL.md');
  });

  it("puts the packet's own documents first, since the list is capped", () => {
    const { repoRoot, specFolder } = makeRepo();
    fs.writeFileSync(path.join(repoRoot, 'AGENTS.md'), '# Agents\n', 'utf-8');
    writeSpec(specFolder, ['AGENTS.md']);

    expect(keyFiles(specFolder)[0]).toBe('spec.md');
  });
});
