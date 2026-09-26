import { isModelVisibleSkill } from "./catalog.ts";
import type { SkillManagerConfig, SkillRecord } from "./types.js";

export type ActiveSkillScope =
  | { kind: "all" }
  | { kind: "profile"; profileId: string; profileName: string }
  | { kind: "group"; profileId: string; groupId: string; groupName: string };

export interface ResolvedSkillScope {
  kind: ActiveSkillScope["kind"];
  label: string;
  records: SkillRecord[];
  allowedNames: Set<string>;
  restricted: boolean;
  emptyProfileFallback: boolean;
}

function sorted(records: SkillRecord[]): SkillRecord[] {
  return [...records].sort((a, b) => a.name.localeCompare(b.name));
}

function quoteScopeName(value: string): string {
  // Scope names are user-controlled configuration. Keep them data-like in the
  // system prompt even if a hand-edited config contains punctuation. Config
  // validation rejects control characters; JSON quoting handles quotes and
  // backslashes without creating new prompt lines.
  return JSON.stringify(value);
}

export function groupMemberRecords(
  groupId: string,
  config: SkillManagerConfig,
  records: SkillRecord[],
): SkillRecord[] {
  return sorted(records.filter((record) => (config.memberships[record.name] ?? []).includes(groupId)));
}

export function profileMemberRecords(config: SkillManagerConfig, records: SkillRecord[]): SkillRecord[] {
  const groupIds = new Set(config.groups.map((group) => group.id));
  if (groupIds.size === 0) return [];
  return sorted(records.filter((record) =>
    isModelVisibleSkill(record)
    && (config.memberships[record.name] ?? []).some((groupId) => groupIds.has(groupId)),
  ));
}

export function globalFallbackRecords(
  scope: ResolvedSkillScope,
  records: SkillRecord[],
): SkillRecord[] {
  const all = sorted(records.filter(isModelVisibleSkill));
  if (!scope.restricted) return [];
  return all.filter((record) => !scope.allowedNames.has(record.name));
}

export function resolveSkillScope(
  scope: ActiveSkillScope,
  config: SkillManagerConfig,
  records: SkillRecord[],
  activeProfile: { id: string; name: string },
): ResolvedSkillScope {
  const all = sorted(records.filter(isModelVisibleSkill));

  if (scope.kind === "group" && scope.profileId === activeProfile.id) {
    const group = config.groups.find((candidate) => candidate.id === scope.groupId);
    if (group) {
      const members = groupMemberRecords(group.id, config, all);
      return {
        kind: "group",
        label: `group ${quoteScopeName(group.name)}`,
        records: members,
        allowedNames: new Set(members.map((record) => record.name)),
        restricted: true,
        emptyProfileFallback: false,
      };
    }
  }

  if (scope.kind === "all") {
    return {
      kind: "all",
      label: "all model-invokable installed skills",
      records: all,
      allowedNames: new Set(all.map((record) => record.name)),
      restricted: false,
      emptyProfileFallback: false,
    };
  }

  const candidates = profileMemberRecords(config, all);
  return {
    kind: "profile",
    label: `profile ${quoteScopeName(activeProfile.name)}`,
    records: candidates,
    allowedNames: new Set(candidates.map((record) => record.name)),
    // Profiles are true scopes. An empty profile intentionally exposes zero
    // automatic root candidates instead of falling back to every installed
    // skill and repopulating the model context with the global catalogue.
    restricted: candidates.length < all.length,
    emptyProfileFallback: false,
  };
}

export function renderScopeCatalog(
  scope: ResolvedSkillScope,
  _config: SkillManagerConfig,
): string {
  const count = scope.records.length;
  const noun = count === 1 ? "candidate" : "candidates";
  const verb = count === 1 ? "is" : "are";
  return [
    `# Skill Orchestrator — Active ${scope.label}`,
    `${count} lazy skill ${noun} ${verb} indexed outside the model context.`,
    "Installed skill names, descriptions, locations, and SKILL.md bodies are intentionally omitted from the system prompt.",
    "When a specialized workflow may help, call `skill_search` with a concise task/query. Search the active scope first. If none of its returned candidates is appropriate, use `skill_search` with scope `global` to lazily search outside the active scope without changing it.",
    "Then call `skill` with one exact returned name. Only that root skill and its recursive dependencies are loaded; do not enumerate or load an entire scope.",
  ].join("\n");
}

export function formatScopeNotification(scope: ResolvedSkillScope): string {
  const count = scope.records.length;
  const noun = count === 1 ? "candidate" : "candidates";
  return `Activated ${scope.label}: ${count} lazy skill ${noun} indexed out of context; no skill metadata or bodies injected.`;
}
