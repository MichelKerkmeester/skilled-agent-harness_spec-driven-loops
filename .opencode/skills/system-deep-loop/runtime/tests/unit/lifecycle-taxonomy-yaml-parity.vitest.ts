import { describe, expect, it } from 'vitest';

import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const nodeRequire = createRequire(import.meta.url);

// The taxonomy module is the single source of truth for terminal stopReasons.
// The graph-backed command YAMLs (research, review) hand-maintain the
// same enum for emission-time rewriting, so they can silently drift. This guard
// asserts every enum the YAMLs declare equals the module's stopReason set.
const TAXONOMY = '../../lib/deep-loop/lifecycle-taxonomy.cjs';
const taxonomy = nodeRequire(TAXONOMY) as { STOP_REASONS: Record<string, string> };

const ASSETS = resolve(__dirname, '..', '..', '..', '..', '..', 'commands', 'deep', 'assets');

// The runtime-loop modes are the only ones that pin a userPaused-bearing enum in
// their YAML (the improvement-host modes validate via the journal instead).
const RUNTIME_LOOP_YAMLS = [
  'deep_research_auto.yaml',
  'deep_research_confirm.yaml',
  'deep_review_auto.yaml',
  'deep_review_confirm.yaml',
];

// Two declaration shapes coexist: a structured `stop_reasons_enum: [a, b, c]`
// array and a prose `STOP_REASONS enum: a, b, c.` clause. Both encode the same
// frozen set, so the guard reads both.
const ARRAY_ENUM_RE = /stop_reasons_enum:\s*\[([^\]]+)\]/g;
const PROSE_ENUM_RE = /STOP_REASONS enum:\s*([^.)\n]+)/g;

function splitTokens(raw: string): string[] {
  return raw
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);
}

interface EnumDecl {
  file: string;
  shape: 'array' | 'prose';
  tokens: string[];
}

function collectEnumDeclarations(): EnumDecl[] {
  const decls: EnumDecl[] = [];
  for (const file of RUNTIME_LOOP_YAMLS) {
    const text = readFileSync(resolve(ASSETS, file), 'utf8');
    for (const match of text.matchAll(ARRAY_ENUM_RE)) {
      decls.push({ file, shape: 'array', tokens: splitTokens(match[1]) });
    }
    for (const match of text.matchAll(PROSE_ENUM_RE)) {
      decls.push({ file, shape: 'prose', tokens: splitTokens(match[1]) });
    }
  }
  return decls;
}

describe('stop-reason enum parity (YAML <-> taxonomy module)', () => {
  const moduleReasons = Object.values(taxonomy.STOP_REASONS);
  const moduleSet = [...moduleReasons].sort();
  const declarations = collectEnumDeclarations();

  it('finds at least one declared enum in every runtime-loop YAML', () => {
    const filesWithEnum = new Set(declarations.map((decl) => decl.file));
    expect([...filesWithEnum].sort()).toEqual([...RUNTIME_LOOP_YAMLS].sort());
  });

  it('includes userPaused in the taxonomy module', () => {
    expect(moduleReasons).toContain('userPaused');
  });

  // Order differs by design: the module pins a contractual error-string order;
  // the YAMLs list their own order. Parity is membership, so compare as sets.
  it('every YAML enum declaration equals the taxonomy stopReason set', () => {
    expect(declarations.length).toBeGreaterThan(0);
    for (const decl of declarations) {
      expect(
        [...decl.tokens].sort(),
        `${decl.file} (${decl.shape}) drifted from lifecycle-taxonomy STOP_REASONS`,
      ).toEqual(moduleSet);
    }
  });
});
