import * as path from "node:path";
import * as os from "node:os";
import { shortcutName } from "./shortcuts.ts";
import type { SkillManagerConfig, SkillGroup } from "./types.js";

export const GLOBAL_CONFIG_PATH = path.join(os.homedir(), ".pi", "agent", "skill-manager.json");

const FORBIDDEN_SCOPE_NAME_CHARS = /[\u0000-\u001F\u007F\u2028\u2029]/;
const MAX_SCOPE_NAME_LENGTH = 128;
const MAX_SCOPE_DESCRIPTION_LENGTH = 1024;
const UNSAFE_DISPLAY_CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u2028\u2029]/g;

export function validateScopeDisplayName(value: string, kind: "Group" | "Profile"): string {
  const trimmed = value.trim();
  if (!trimmed) throw new Error(`${kind} name is required`);
  if (trimmed.length > MAX_SCOPE_NAME_LENGTH) {
    throw new Error(`${kind} name must be ${MAX_SCOPE_NAME_LENGTH} characters or fewer`);
  }
  if (FORBIDDEN_SCOPE_NAME_CHARS.test(trimmed)) {
    throw new Error(`${kind} name cannot contain control characters or line breaks`);
  }
  return trimmed;
}

/**
 * Descriptions are configuration metadata shown in terminal UI. Normalize them
 * to one safe line so hand-edited JSON cannot inject terminal control sequences
 * or create multiline autocomplete/selector entries.
 */
export function normalizeScopeDescription(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(UNSAFE_DISPLAY_CONTROL_CHARS, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_SCOPE_DESCRIPTION_LENGTH);
}

export const DEFAULT_CONFIG: SkillManagerConfig = {
  version: 1,
  groups: [],
  memberships: {},
  autoload: {},
  ignoreAutoDetected: {},
  catalogDescriptionMax: 160,
  tokenSaverEnabled: false,
};

function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function sanitizeStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return [...new Set(v.filter((x): x is string => typeof x === "string").map((x) => x.trim()).filter(Boolean))];
}

function assertUsableGroup(group: Pick<SkillGroup, "id" | "name">, seenIds: Set<string>, seenShortcuts: Map<string, string>): void {
  if (!group.id) throw new Error("Group id is required");
  validateScopeDisplayName(group.name, "Group");
  if (group.id === "__all") throw new Error('Group id "__all" is reserved by Skill Orchestrator');
  if (seenIds.has(group.id)) throw new Error(`Duplicate group id: ${group.id}`);
  const token = shortcutName(group.name);
  if (!token) throw new Error(`Group "${group.name}" does not produce a usable slash shortcut`);
  const key = token.toLowerCase();
  const existing = seenShortcuts.get(key);
  if (existing) throw new Error(`Groups "${existing}" and "${group.name}" map to the same slash shortcut /${token}`);
  seenIds.add(group.id);
  seenShortcuts.set(key, group.name);
}

export function validateGroupName(
  name: string,
  existingGroups: ReadonlyArray<SkillGroup>,
  excludeGroupId?: string,
): string {
  const trimmedName = validateScopeDisplayName(name, "Group");
  const token = shortcutName(trimmedName);
  if (!token) throw new Error("Group name must contain at least one letter, number, dot, dash, or underscore");
  const conflict = existingGroups.find((group) =>
    group.id !== excludeGroupId
    && shortcutName(group.name).toLowerCase() === token.toLowerCase(),
  );
  if (conflict) {
    throw new Error(`Group "${trimmedName}" conflicts with "${conflict.name}" because both use /${token}`);
  }
  return trimmedName;
}

export function normalizeConfig(raw: unknown): SkillManagerConfig {
  if (!isObject(raw)) throw new Error("Config root must be a JSON object");
  if (raw.version !== undefined && raw.version !== 1) throw new Error(`Unsupported config version: ${String(raw.version)}`);

  const groupsRaw = Array.isArray(raw.groups) ? raw.groups : [];
  const seenIds = new Set<string>();
  const seenShortcuts = new Map<string, string>();
  const groups: SkillGroup[] = [];
  for (const item of groupsRaw) {
    if (!isObject(item)) continue;
    const id = typeof item.id === "string" ? item.id.trim() : "";
    const name = typeof item.name === "string" ? item.name.trim() : "";
    if (!id && !name) continue;
    const description = normalizeScopeDescription(item.description);
    const shortcutEnabled = item.shortcutEnabled === undefined ? true : item.shortcutEnabled === true;
    const candidate: SkillGroup = {
      id,
      name,
      description,
      shortcutEnabled,
      order: Number.isFinite(item.order) ? Number(item.order) : groups.length * 10 + 10,
    };
    assertUsableGroup(candidate, seenIds, seenShortcuts);
    groups.push(candidate);
  }
  groups.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

  const validGroupIds = new Set(groups.map((group) => group.id));
  const mapOfArrays = (v: unknown, filterGroupIds = false): Record<string, string[]> => {
    if (!isObject(v)) return {};
    const out: Record<string, string[]> = {};
    for (const [k, value] of Object.entries(v)) {
      const key = k.trim();
      if (!key) continue;
      let arr = sanitizeStringArray(value);
      if (filterGroupIds) arr = arr.filter((id) => validGroupIds.has(id));
      if (arr.length) out[key] = arr;
    }
    return out;
  };

  return {
    version: 1,
    groups,
    memberships: mapOfArrays(raw.memberships, true),
    autoload: mapOfArrays(raw.autoload),
    ignoreAutoDetected: mapOfArrays(raw.ignoreAutoDetected),
    // skill_search is intentionally bounded. 0 means names only.
    catalogDescriptionMax: Number.isFinite(raw.catalogDescriptionMax)
      ? Math.max(0, Math.min(240, Math.trunc(Number(raw.catalogDescriptionMax))))
      : 160,
    tokenSaverEnabled: raw.tokenSaverEnabled === true,
  };
}

export function createSkillGroup(
  name: string,
  description: string,
  shortcutEnabled: boolean,
  existingGroups: ReadonlyArray<SkillGroup>,
): SkillGroup {
  const trimmedName = validateGroupName(name, existingGroups);
  const id = slugifyGroupId(trimmedName, existingGroups.map((group) => group.id));
  if (id === "__all") throw new Error('Group id "__all" is reserved by Skill Orchestrator');
  const order = Math.max(0, ...existingGroups.map((group) => group.order)) + 10;
  return {
    id,
    name: trimmedName,
    description: normalizeScopeDescription(description),
    shortcutEnabled,
    order,
  };
}

export function slugifyGroupId(name: string, existing: Iterable<string>): string {
  const used = new Set(existing);
  const base = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "group";
  let id = base;
  let n = 2;
  while (used.has(id) || id === "__all") id = `${base}-${n++}`;
  return id;
}
