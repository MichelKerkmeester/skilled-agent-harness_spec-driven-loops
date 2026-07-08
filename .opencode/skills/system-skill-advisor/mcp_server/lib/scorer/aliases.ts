// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Skill Alias Groups
// ───────────────────────────────────────────────────────────────

export const BASE_ALIAS_GROUPS: Readonly<Record<string, readonly string[]>> = Object.freeze({
  'create:agent': ['command-create-agent', '/create:agent', 'create:agent'],
  'create:manual-testing-playbook': [
    'command-create-manual-testing-playbook',
    '/create:manual-testing-playbook',
    'create:manual-testing-playbook',
  ],
  'memory:save': ['command-memory-save', '/memory:save', 'memory:save'],
  'deep-model-benchmark': [
    'command-spec-kit-deep-model-benchmark',
    '/deep:model-benchmark',
    'deep-model-benchmark',
    'sk-deep-model-benchmark',
  ],
});

// BEGIN GENERATED DEEP ROUTING PROJECTION
/** Hash of the generated deep-loop routing projection embedded below. */
export const DEEP_ROUTING_PROJECTION_HASH = 'sha256:26638486adc5b54900221c2b16014d6aa4367311e7b422c905654493031500e6';

const GENERATED_DEEP_ALIAS_GROUPS: Readonly<Record<string, readonly string[]>> = Object.freeze({
  'deep-ai-council': [
    '@deep-ai-council',
    'deep-ai-council',
    'deep ai council',
    'ai council',
    'planning council',
    'council deliberation',
    'multi-ai-council',
  ],
  'deep-improvement': [
    'command-spec-kit-deep-agent-improvement',
    '/deep:start-agent-improvement-loop',
    'deep-agent-improvement',
    'sk-deep-agent-improvement',
  ],
  'deep-research': [
    'command-spec-kit-deep-research',
    '/deep:research',
    'spec_kit:deep-research',
    'deep-research',
    'sk-deep-research',
  ],
  'deep-review': [
    'command-spec-kit-deep-review',
    '/deep:review',
    'spec_kit:deep-review',
    'deep-review',
    'sk-deep-review',
  ],
});

export const DEEP_MODE_BY_CANONICAL: Readonly<Record<string, string>> = Object.freeze({
  'deep-ai-council': 'ai-council',
  'deep-improvement': 'agent-improvement',
  'deep-research': 'research',
  'deep-review': 'review',
});
// END GENERATED DEEP ROUTING PROJECTION

const RAW_ALIAS_GROUPS: Readonly<Record<string, readonly string[]>> = Object.freeze({
  ...BASE_ALIAS_GROUPS,
  ...GENERATED_DEEP_ALIAS_GROUPS,
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
// The active legacy deep-loop modes (deep-research, deep-review,
// deep-ai-council, deep-improvement) are folded into one public skill,
// system-deep-loop, discriminated by workflowMode (see
// system-deep-loop/mode-registry.json). canonicalSkillId above is
// deliberately UNCHANGED: an alias still resolves to its mode-level legacy id
// (e.g. 'spec_kit:deep-review' -> 'deep-review') so existing callers and the
// alias contract keep working. This layer adds the SECOND projection — legacy
// mode-level id -> (merged skill, workflowMode) — that routers use to land on
// system-deep-loop with the right mode once the old skill nodes leave the
// graph.
//
// The removed standalone context route is intentionally absent from
// DEEP_MODE_BY_CANONICAL and no longer appears in active registry routing.
// Use @context for retrieval and research/review bounded snapshots for loops.
export const MERGED_DEEP_SKILL_ID = 'system-deep-loop';

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

const PROMPT_ALIAS_ENTRIES = Array.from(ALIAS_TO_MODE.entries())
  .sort((left, right) => right[0].length - left[0].length || left[0].localeCompare(right[0]));

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function promptContainsAlias(promptLower: string, alias: string): boolean {
  const normalized = alias.toLowerCase();
  if (!normalized) return false;
  if (/^[a-z0-9][a-z0-9 -]*[a-z0-9]$/u.test(normalized)) {
    return new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalized)}([^a-z0-9]|$)`, 'u').test(promptLower);
  }
  return promptLower.includes(normalized);
}

/**
 * Resolve any deep-loop alias (or mode-level legacy id) to its workflowMode, or
 * null when the id is not a folded deep-loop mode.
 */
export function modeForAlias(skillId: string): string | null {
  return ALIAS_TO_MODE.get(skillId) ?? ALIAS_TO_MODE.get(canonicalSkillId(skillId)) ?? null;
}

/**
 * Resolve a deep-loop workflowMode when a prompt directly names a generated
 * alias. Returns null for broad merged-skill prompts that require hub routing.
 */
export function modeForPromptAlias(prompt: string): string | null {
  const promptLower = prompt.toLowerCase();
  for (const [alias, mode] of PROMPT_ALIAS_ENTRIES) {
    if (promptContainsAlias(promptLower, alias)) return mode;
  }
  return null;
}

/**
 * Resolve any deep-loop alias to the merged skill id (system-deep-loop) when
 * it names a folded mode, else fall back to the plain canonical id. Non-deep
 * skills are returned unchanged.
 */
export function mergedSkillForAlias(skillId: string): string {
  return modeForAlias(skillId) !== null ? MERGED_DEEP_SKILL_ID : canonicalSkillId(skillId);
}
