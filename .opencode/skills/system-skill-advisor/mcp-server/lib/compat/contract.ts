// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor Compat Contract
// ───────────────────────────────────────────────────────────────

export const SKILL_ADVISOR_COMPAT_CONTRACT = {
  statusValues: ['ok', 'skipped', 'degraded', 'fail_open'] as const,
  disabledEnv: 'SPECKIT_SKILL_ADVISOR_HOOK_DISABLED',
  forceLocalEnv: 'SPECKIT_SKILL_ADVISOR_FORCE_LOCAL',
  defaults: {
    confidenceThreshold: 0.8,
    uncertaintyThreshold: 0.35,
  },
} as const;

export type SkillAdvisorCompatStatus = (typeof SKILL_ADVISOR_COMPAT_CONTRACT.statusValues)[number];

function parseFloatEnv(key: string): number | null {
  const raw = process.env[key];
  if (raw === undefined) return null;
  const parsed = parseFloat(raw);
  if (isNaN(parsed)) return null;
  return parsed;
}

export function resolvedConfidenceThreshold(): number {
  const env = parseFloatEnv('SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD');
  if (env !== null && env >= 0 && env <= 1) return env;
  return SKILL_ADVISOR_COMPAT_CONTRACT.defaults.confidenceThreshold;
}

export function resolvedUncertaintyThreshold(): number {
  const env = parseFloatEnv('SPECKIT_ADVISOR_UNCERTAINTY_THRESHOLD');
  if (env !== null && env >= 0 && env <= 1) return env;
  return SKILL_ADVISOR_COMPAT_CONTRACT.defaults.uncertaintyThreshold;
}
