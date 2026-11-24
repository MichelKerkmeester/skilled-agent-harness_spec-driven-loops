// ───────────────────────────────────────────────────────────────
// MODULE: Skill Lifecycle Status Canonical Values
// ───────────────────────────────────────────────────────────────
// Shared lifecycle statuses for scorer validation and age-haircut types.
// The union and runtime predicate both derive from this tuple.

export const SKILL_LIFECYCLE_STATUS_VALUES = [
  'active',
  'deprecated',
  'archived',
  'future',
] as const;

export type SkillLifecycleStatus = (typeof SKILL_LIFECYCLE_STATUS_VALUES)[number];

export function isSkillLifecycleStatus(value: unknown): value is SkillLifecycleStatus {
  return typeof value === 'string'
    && (SKILL_LIFECYCLE_STATUS_VALUES as readonly string[]).includes(value);
}
