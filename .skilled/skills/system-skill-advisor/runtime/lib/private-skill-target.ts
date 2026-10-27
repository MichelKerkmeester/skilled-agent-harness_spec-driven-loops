// ───────────────────────────────────────────────────────────────
// MODULE: Private Skill Target Containment
// ───────────────────────────────────────────────────────────────
// A `local-*` skill may be linked into the skills tree from a private checkout.
// Following the link is safe only when its resolved target stays inside a
// directory the operator has declared trusted. The rule itself lives in the
// plain CommonJS sibling, so readers outside this TypeScript runtime load the
// same copy on every supported Node version; this module gives it types.

import privateSkillTarget from './private-skill-target.cjs';

interface PrivateSkillTargetRule {
  PRIVATE_SKILL_ROOTS_ENV: string;
  isTrustedPrivateSkillLink(entryPath: string, skillsRoot: string): boolean;
  createPrivateSkillLinkCheck(skillsRoot: string): (entryPath: string) => boolean;
}

const rule: PrivateSkillTargetRule = privateSkillTarget;

/** Environment variable naming extra trusted roots, joined by the platform path delimiter. */
export const PRIVATE_SKILL_ROOTS_ENV: string = rule.PRIVATE_SKILL_ROOTS_ENV;

/**
 * True when a top-level `local-*` entry resolves to a directory inside a trusted root.
 * @param entryPath - The skills-root entry to resolve.
 * @param skillsRoot - The skills root the entry was listed from.
 * @returns Whether the entry's real target is a directory inside a trusted root.
 */
export function isTrustedPrivateSkillLink(entryPath: string, skillsRoot: string): boolean {
  return rule.isTrustedPrivateSkillLink(entryPath, skillsRoot);
}

/**
 * Return a per-scan check that resolves the trusted roots at most once, and only
 * when a `local-*` link is actually met, because one scan checks many entries.
 * @param skillsRoot - The skills root the scan lists.
 * @returns A check that reports whether one entry resolves inside a trusted root.
 */
export function createPrivateSkillLinkCheck(skillsRoot: string): (entryPath: string) => boolean {
  return rule.createPrivateSkillLinkCheck(skillsRoot);
}
