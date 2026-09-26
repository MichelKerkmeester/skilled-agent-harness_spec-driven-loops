import type { SkillGroup, SkillManagerConfig, SkillRecord } from "./types.js";

/**
 * Convert a display name to the text-input shortcut form.
 * Spaces become underscores. Existing letters, numbers, dots, dashes and
 * underscores are preserved. Other punctuation is collapsed to underscores.
 */
export function shortcutName(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^A-Za-z0-9_.-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function eqShortcut(token: string, value: string): boolean {
  return token.toLowerCase() === shortcutName(value).toLowerCase();
}

export function findGroupByShortcut(token: string, groups: SkillGroup[]): SkillGroup | undefined {
  return groups.find((group) => eqShortcut(token, group.name));
}

export function findSkillByShortcut(token: string, skills: SkillRecord[]): SkillRecord | undefined {
  const lower = token.toLowerCase();
  return skills.find((skill) => skill.name.toLowerCase() === lower || eqShortcut(token, skill.name));
}

export interface ParsedShortcut {
  group: SkillGroup;
  skill?: SkillRecord;
  task?: string;
}

export type ShortcutParseResult =
  | { kind: "none" }
  | { kind: "error"; message: string }
  | { kind: "match"; value: ParsedShortcut };

/**
 * Parse /Group or /Group:Skill without registering one Pi command per group.
 * This keeps the aliases out of Pi's command registry and therefore out of
 * model prompt/context metadata. Only the selected skill bodies are injected.
 */
export function parseShortcut(
  text: string,
  groups: SkillGroup[],
  skills: SkillRecord[],
  config: SkillManagerConfig,
): ShortcutParseResult {
  const match = text.match(/^\/([^\s:]+)(?::([^\s]+))?(?:\s+([\s\S]*))?$/);
  if (!match) return { kind: "none" };

  const group = findGroupByShortcut(match[1], groups);
  if (!group || group.shortcutEnabled === false) return { kind: "none" };

  const task = match[3]?.trim() || undefined;
  if (!match[2]) return { kind: "match", value: { group, task } };

  const skill = findSkillByShortcut(match[2], skills);
  if (!skill) {
    return { kind: "error", message: `Skill "${match[2]}" was not found.` };
  }

  if (!(config.memberships[skill.name] ?? []).includes(group.id)) {
    return {
      kind: "error",
      message: `Skill "${skill.name}" is not a member of group "${group.name}".`,
    };
  }

  return { kind: "match", value: { group, skill, task } };
}

export interface ParsedSkillNamespaceShortcut {
  kind: "skill" | "group";
  skill?: SkillRecord;
  group?: SkillGroup;
  task?: string;
}

export type SkillNamespaceParseResult =
  | { kind: "none" }
  | { kind: "error"; message: string }
  | { kind: "match"; value: ParsedSkillNamespaceShortcut };

/**
 * Parse Pi's native-looking skill namespace form:
 *   /skill:Skill_Name [task]
 *   /skill:Group_Name [task]
 *
 * This is intercepted as raw input rather than registering commands for each
 * skill/group, so the aliases themselves add no idle model-context overhead.
 * If a token matches both a skill and a group we refuse to guess. When that
 * group has its optional short alias enabled, /Group_Name can disambiguate it.
 */
export function parseSkillNamespaceShortcut(
  text: string,
  groups: SkillGroup[],
  skills: SkillRecord[],
): SkillNamespaceParseResult {
  const match = text.match(/^\/skill:([^\s:]+)(?:\s+([\s\S]*))?$/i);
  if (!match) return { kind: "none" };

  const token = match[1];
  const task = match[2]?.trim() || undefined;
  const skill = findSkillByShortcut(token, skills);
  const group = findGroupByShortcut(token, groups);

  if (skill && group) {
    const groupHint = group.shortcutEnabled === false
      ? `The short group shortcut is disabled for "${group.name}"; use the Skill Orchestrator manager or rename one of the colliding entries.`
      : `Use /${shortcutName(group.name)} for the group.`;
    return {
      kind: "error",
      message: `"${token}" matches both skill "${skill.name}" and group "${group.name}". ${groupHint}`,
    };
  }
  if (skill) return { kind: "match", value: { kind: "skill", skill, task } };
  if (group) return { kind: "match", value: { kind: "group", group, task } };

  return { kind: "error", message: `No skill or group matched "${token}".` };
}
