// ───────────────────────────────────────────────────────────────────
// MODULE: Advisor Name Mention Scoring
// ───────────────────────────────────────────────────────────────────

import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { buildExecutorAliasTable, resolveExecutorDelegation } from '../lib/scorer/executor-delegation.js';
import { scoreExplicitLane } from '../lib/scorer/lanes/explicit.js';
import { createFixtureProjection } from '../lib/scorer/projection.js';
import type { SkillProjection } from '../lib/scorer/types.js';
import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';

function skill(overrides: Partial<SkillProjection> & Pick<SkillProjection, 'id'>): SkillProjection {
  return {
    id: overrides.id,
    kind: 'skill',
    family: 'system',
    category: 'test',
    name: overrides.id,
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: `.skilled/skills/${overrides.id}/graph-metadata.json`,
    lifecycleStatus: 'active',
    ...Object.fromEntries(Object.entries(overrides).filter(([key]) => key !== 'id')),
  };
}

function findWorkspaceRoot(): string {
  const start = dirname(fileURLToPath(import.meta.url));
  const sentinel = '.skilled/skills/system-spec-kit/SKILL.md';
  const candidate = findAdvisorWorkspaceRoot(start, { maxDepth: 12, sentinel });
  if (!existsSync(resolve(candidate, sentinel))) {
    throw new Error('Unable to locate workspace root.');
  }
  return candidate;
}

// The fixture keeps only the vocabulary the cases exercise: a bare skill-name
// keyword, a short generic keyword, a hyphenated keyword, and a doc skill whose
// changelog keyword makes the doc-file-target suppression observable.
const PROJECTION = createFixtureProjection([
  skill({ id: 'sk-code', keywords: ['sk-code', 'code', 'two-axis'] }),
  skill({ id: 'system-spec-kit', keywords: ['spec-kit'] }),
  skill({ id: 'sk-doc', keywords: ['changelog'] }),
]);

function evidenceFor(skillId: string, prompt: string): readonly string[] {
  const match = scoreExplicitLane(prompt, PROJECTION).find((entry) => entry.skillId === skillId);
  return match?.evidence ?? [];
}

describe('advisor name mention scoring', () => {
  it('keeps a skill name inside a path token from scoring that skill', () => {
    const evidence = evidenceFor(
      'system-spec-kit',
      'Add a trap to .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh',
    );

    expect(evidence.some((item) => item.startsWith('explicit:'))).toBe(false);
    expect(evidence).not.toContain('author:spec-kit');

    // Control on the same skill: a bare mention does score, so the emptiness
    // above is the path exclusion, not a fixture that cannot match at all.
    expect(evidenceFor('system-spec-kit', 'use system-spec-kit to review this'))
      .toContain('explicit:system-spec-kit');
  });

  it('keeps a skill named only as a doc-file target out of the author evidence', () => {
    const prompt = 'Update the sk-code SKILL.md headline to clarify the two-axis model';
    const evidence = evidenceFor('sk-code', prompt);

    expect(evidence.some((item) => item.startsWith('explicit:'))).toBe(false);
    expect(evidence.some((item) => item.startsWith('author:'))).toBe(false);
    expect(evidenceFor('sk-doc', prompt)).toContain('write-doc-surface');
  });

  it('keeps a changelog mode phrase from reading as a doc-file target', () => {
    const prompt = 'Create a changelog entry for sk-git with the sk-doc changelog mode.';
    const evidence = evidenceFor('sk-doc', prompt);

    expect(evidence).toContain('explicit:sk-doc');
    // The own-doc-target rule suppresses author phrases; changelog surviving
    // shows the mention named the tool doing the writing, not a file.
    expect(evidence).toContain('author:changelog');
  });

  it('keeps a changelog.md target from scoring the named skill', () => {
    const prompt = 'Update the sk-doc changelog.md entry';
    const evidence = evidenceFor('sk-doc', prompt);

    expect(evidence.some((item) => item.startsWith('explicit:'))).toBe(false);
    // Control on the case above: without the doc-target rule this projection
    // emits author:changelog for sk-doc, so the absence here is suppression.
    expect(evidence).not.toContain('author:changelog');
  });

  it('keeps a bare skill name as direct explicit evidence', () => {
    const match = scoreExplicitLane('use sk-code to implement this helper', PROJECTION)
      .find((entry) => entry.skillId === 'sk-code');

    expect(match?.evidence).toContain('explicit:sk-code');
    expect(match?.score).toBe(1);
  });

  it('does not boost the code skill from a generic research token', () => {
    const evidence = evidenceFor('sk-code', 'report findings as a research summary');

    expect(evidence).not.toContain('token:findings');

    // Control on the same lane: a token with a real boost does emit token
    // evidence, so the absence above is the missing boost, not a dead token path.
    expect(evidenceFor('sk-code', 'add a vitest test')).toContain('token:vitest');
  });

  it('keeps a project path frame from lifting cli-opencode as an executor', () => {
    const table = buildExecutorAliasTable(PROJECTION, findWorkspaceRoot());

    // Positive control: a live alias table, so the null below is the negative
    // guard doing its job rather than an empty alias table passing vacuously.
    expect(resolveExecutorDelegation('use cli-opencode for this task', table)?.executorSkillId)
      .toBe('cli-opencode');

    const promptLower = 'when type is cli-opencode, inspect .skilled/skills/system-deep-loop/runtime/lib/x.ts';
    expect(table.negativeGuard.test(promptLower)).toBe(true);
    expect(resolveExecutorDelegation(promptLower, table)).toBeNull();
  });
});
