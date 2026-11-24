// ───────────────────────────────────────────────────────────────
// MODULE: Scorer Predicate Parity Tests
// ───────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { promptPolicyTokens } from '../lib/prompt-policy.js';
import * as fusion from '../lib/scorer/fusion.js';
import { createFixtureProjection } from '../lib/scorer/projection.js';
import type { SkillProjection } from '../lib/scorer/types.js';

interface PredicateCase {
  readonly id: string;
  readonly prompt: string;
  readonly typedSlashCommand: boolean;
  readonly meaningfulTokens: number;
  readonly lowInformation: boolean;
}

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE = JSON.parse(readFileSync(
  resolve(HERE, 'fixtures/scorer-predicate-cases.json'),
  'utf8',
)) as { readonly cases: readonly PredicateCase[] };
const predicates = fusion as unknown as {
  readonly hasTypedSlashCommand?: (promptLower: string) => boolean;
  readonly isLowInformationPrompt?: (prompt: string) => boolean;
};

function skill(overrides: Partial<SkillProjection> & Pick<SkillProjection, 'id'>): SkillProjection {
  const { id, ...rest } = overrides;
  return {
    id,
    kind: 'skill',
    family: 'system',
    category: 'test',
    name: id,
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: `.skilled/skills/${id}/graph-metadata.json`,
    lifecycleStatus: 'active',
    ...rest,
  };
}

describe('shared scorer predicate cases', () => {
  it.each(FIXTURE.cases)('$id', (testCase) => {
    expect(predicates.hasTypedSlashCommand?.(testCase.prompt.toLowerCase()))
      .toBe(testCase.typedSlashCommand);
    expect(promptPolicyTokens(testCase.prompt).meaningful.length)
      .toBe(testCase.meaningfulTokens);
    expect(predicates.isLowInformationPrompt?.(testCase.prompt))
      .toBe(testCase.lowInformation);
  });
});

describe('scorer predicates preserve route intent', () => {
  it('does not treat path and and/or slashes as typed commands', () => {
    const projection = createFixtureProjection([
      skill({
        id: 'beta-skill',
        keywords: ['widget audit flow'],
        intentSignals: ['widget audit flow'],
      }),
      skill({
        id: 'alpha-command',
        kind: 'command',
        keywords: ['widget audit flow'],
        intentSignals: ['widget audit flow'],
      }),
    ], []);

    for (const prompt of [
      'widget audit flow for src/a.ts',
      'widget audit flow and/or more',
    ]) {
      const result = fusion.scoreAdvisorPrompt(prompt, {
        workspaceRoot: process.cwd(),
        projection,
        includeAllCandidates: true,
      });
      expect(result.topSkill).toBe('beta-skill');
    }

    const typed = fusion.scoreAdvisorPrompt('/alpha:run widget audit flow', {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
    });
    expect(typed.topSkill).toBe('alpha-command');
  });

  it('abstains on stop-word-padded prompts without changing longer prompts', () => {
    const projection = createFixtureProjection([
      skill({ id: 'alpha', keywords: ['widget'] }),
      skill({ id: 'beta', keywords: ['widget'] }),
    ], []);

    const padded = fusion.scoreAdvisorPrompt('widget it to me please', {
      workspaceRoot: process.cwd(),
      projection,
    });
    expect(padded.topSkill).toBeNull();

    const longer = fusion.scoreAdvisorPrompt('widget gadget sprocket gizmo', {
      workspaceRoot: process.cwd(),
      projection,
    });
    expect(longer.topSkill).toBe('alpha');
  });
});
