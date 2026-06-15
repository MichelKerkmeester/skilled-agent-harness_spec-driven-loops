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
    '/deep:start-research-loop',
    'spec_kit:deep-research',
    'deep-research',
    'sk-deep-research',
  ],
  'deep-review': [
    'command-spec-kit-deep-review',
    '/deep:start-review-loop',
    'spec_kit:deep-review',
    'deep-review',
    'sk-deep-review',
  ],
  'deep-improvement': [
    'command-spec-kit-deep-agent-improvement',
    '/deep:start-agent-improvement-loop',
    'deep-agent-improvement',
    'sk-deep-agent-improvement',
  ],
  'deep-model-benchmark': [
    'command-spec-kit-deep-model-benchmark',
    '/deep:start-model-benchmark-loop',
    'deep-model-benchmark',
    'sk-deep-model-benchmark',
  ],
  'deep-ai-council': [
    '@deep-ai-council',
    'deep-ai-council',
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

// ───────────────────────────────────────────────────────────────
// MODULE: Merged Deep-Loop Identity + Mode Layer
// ───────────────────────────────────────────────────────────────
//
// The five legacy deep-loop skills (deep-context, deep-research, deep-review,
// deep-ai-council, deep-improvement) are folded into one public skill,
// deep-loop-workflows, discriminated by workflowMode (see
// deep-loop-workflows/mode-registry.json). canonicalSkillId above is
// deliberately UNCHANGED: an alias still resolves to its mode-level legacy id
// (e.g. 'spec_kit:deep-review' -> 'deep-review') so existing callers and the
// alias contract keep working. This layer adds the SECOND projection — legacy
// mode-level id -> (merged skill, workflowMode) — that routers use to land on
// deep-loop-workflows with the right mode once the old skill nodes leave the
// graph.
//
// deep-context is intentionally absent from DEEP_MODE_BY_CANONICAL: it has no
// alias group here and stays metadata-routed (resolved from its
// graph-metadata.json), mirroring the Python advisor where DEEP_ROUTING_SKILLS
// excludes it. Its workflowMode ('context') still lives in the mode registry.
export const MERGED_DEEP_SKILL_ID = 'deep-loop-workflows';

// Legacy mode-level skill id -> registry workflowMode. deep-improvement maps to
// its Lane A default workflowMode ('agent-improvement'); the other improvement
// sub-lanes (model-benchmark, skill-benchmark, non-dev-ai-system-refine) keep
// their own command bridges and are not folded through this alias map.
const DEEP_MODE_BY_CANONICAL: Readonly<Record<string, string>> = Object.freeze({
  'deep-research': 'research',
  'deep-review': 'review',
  'deep-ai-council': 'ai-council',
  'deep-improvement': 'agent-improvement',
});

const ALIAS_TO_MODE = new Map<string, string>(
  Object.entries(RAW_ALIAS_GROUPS).flatMap(([canonical, aliases]) => {
    const mode = DEEP_MODE_BY_CANONICAL[canonical];
    if (!mode) return [];
    return [
      [canonical, mode] as const,
      ...aliases.map((alias) => [alias, mode] as const),
    ];
  }),
);

/**
 * Resolve any deep-loop alias (or mode-level legacy id) to its workflowMode, or
 * null when the id is not a folded deep-loop mode. deep-context returns null by
 * design (metadata-routed; not represented in the alias groups).
 */
export function modeForAlias(skillId: string): string | null {
  return ALIAS_TO_MODE.get(skillId) ?? ALIAS_TO_MODE.get(canonicalSkillId(skillId)) ?? null;
}

/**
 * Resolve any deep-loop alias to the merged skill id (deep-loop-workflows) when
 * it names a folded mode, else fall back to the plain canonical id. Non-deep
 * skills are returned unchanged.
 */
export function mergedSkillForAlias(skillId: string): string {
  return modeForAlias(skillId) !== null ? MERGED_DEEP_SKILL_ID : canonicalSkillId(skillId);
}
