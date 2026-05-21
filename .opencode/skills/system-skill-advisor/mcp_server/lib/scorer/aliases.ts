// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Skill Alias Groups
// ───────────────────────────────────────────────────────────────

const RAW_ALIAS_GROUPS: Readonly<Record<string, readonly string[]>> = Object.freeze({
  'create:agent': ['command-create-agent', '/create:agent', 'create:agent'],
  'create:testing-playbook': [
    'command-create-testing-playbook',
    '/create:testing-playbook',
    'create:testing-playbook',
  ],
  'memory:save': ['command-memory-save', '/memory:save', 'memory:save'],
  'deep-research': [
    'command-spec-kit-deep-research',
    '/spec_kit:deep-research',
    'spec_kit:deep-research',
    'deep-research',
    'sk-deep-research',
  ],
  'deep-review': [
    'command-spec-kit-deep-review',
    '/spec_kit:deep-review',
    'spec_kit:deep-review',
    'deep-review',
    'sk-deep-review',
  ],
  'sk-ai-council': [
    '@sk-ai-council',
    'sk-ai-council',
    'deep ai council',
    'ai council',
    'planning council',
    'council deliberation',
    'multi-ai-council',
  ],
});

export const SKILL_ALIAS_GROUPS: Readonly<Record<string, readonly string[]>> = RAW_ALIAS_GROUPS;

const ALIAS_TO_CANONICAL = new Map<string, string>(
  Object.entries(RAW_ALIAS_GROUPS).flatMap(([canonical, aliases]) => [
    [canonical, canonical] as const,
    ...aliases.map((alias) => [alias, canonical] as const),
  ]),
);

export function canonicalSkillId(skillId: string): string {
  return ALIAS_TO_CANONICAL.get(skillId) ?? skillId;
}

export function skillMatchesAlias(actual: string, expected: string): boolean {
  return canonicalSkillId(actual) === canonicalSkillId(expected);
}

export function skillInAliasSet(actual: string, expected: readonly string[]): boolean {
  return expected.some((candidate) => skillMatchesAlias(actual, candidate));
}
