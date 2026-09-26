import type { AutocompleteItem, AutocompleteProvider, AutocompleteSuggestions } from "@earendil-works/pi-tui";
import type { SkillGroup, SkillManagerConfig, SkillRecord } from "./types.js";
import { findGroupByShortcut, shortcutName } from "./shortcuts.ts";

export interface SkillAutocompleteState {
  config: SkillManagerConfig;
  records: SkillRecord[];
}

export interface SkillCommandItem {
  name: string;
  description?: string;
}

export interface SkillProfileCompletionItem {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

function fuzzyTokenMatch(value: string, query: string): boolean {
  if (!query) return true;
  const haystack = value.toLowerCase();
  const needle = query.toLowerCase();
  if (haystack.includes(needle)) return true;

  let index = 0;
  for (const char of haystack) {
    if (char === needle[index]) index += 1;
    if (index >= needle.length) return true;
  }
  return false;
}

function groupMemberNames(groupId: string, config: SkillManagerConfig, records: SkillRecord[]): string[] {
  const configured = Object.entries(config.memberships)
    .filter(([, groupIds]) => groupIds.includes(groupId))
    .map(([skillName]) => skillName);

  // The JSON config is authoritative for group membership. Before record
  // metadata exists, retain configured names so completion works immediately
  // after save/reload. Once Pi has supplied records, do not suggest stale names
  // for skills that are no longer installed/discovered.
  const known = records.length ? new Set(records.map((record) => record.name)) : null;
  return configured.filter((name) => !known || known.has(name)).sort((a, b) => a.localeCompare(b));
}

function recordDescription(name: string, records: SkillRecord[]): string | undefined {
  return records.find((record) => record.name === name)?.description || undefined;
}

function singleLine(text: string): string {
  return text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u2028\u2029]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildPiSkillItems(
  typedSuffix: string,
  commands: readonly SkillCommandItem[],
): AutocompleteItem[] {
  return commands
    .map((command) => {
      const name = command.name.startsWith("skill:") ? command.name.slice("skill:".length) : command.name;
      return { name, command };
    })
    .filter(({ name }) => !!name && fuzzyTokenMatch(name, typedSuffix))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ name, command }) => ({
      value: `skill:${name}`,
      label: `skill:${name}`,
      ...(command.description ? { description: singleLine(command.description) } : {}),
    }));
}


export function buildSkillProfileNamespaceItems(
  typedSuffix: string,
  profiles: readonly SkillProfileCompletionItem[],
): AutocompleteItem[] {
  return profiles
    .map((profile) => ({ profile, token: shortcutName(profile.name) }))
    .filter(({ profile, token }) =>
      !typedSuffix
      || fuzzyTokenMatch(profile.name, typedSuffix)
      || fuzzyTokenMatch(token, typedSuffix),
    )
    .map(({ profile, token }) => ({
      value: `skill-profile:${token}`,
      label: `skill-profile:${token}`,
      description: `${profile.active ? "ACTIVE · " : ""}${singleLine(profile.description) || "Skill Orchestrator profile"}`,
    }));
}


export function buildTopLevelGroupItems(
  typedPrefix: string,
  groups: SkillGroup[],
  config: SkillManagerConfig,
  records: SkillRecord[],
): AutocompleteItem[] {
  return groups
    .filter((group) => group.shortcutEnabled !== false)
    .map((group) => {
      const token = shortcutName(group.name);
      const memberCount = groupMemberNames(group.id, config, records).length;
      const descriptionParts = [`Skill group · ${memberCount} skill${memberCount === 1 ? "" : "s"}`];
      if (group.description) descriptionParts.push(singleLine(group.description));
      return {
        token,
        item: {
          value: token,
          label: token,
          description: descriptionParts.join(" — "),
        } satisfies AutocompleteItem,
      };
    })
    .filter(({ token }) => fuzzyTokenMatch(token, typedPrefix))
    .sort((a, b) => a.token.localeCompare(b.token))
    .map(({ item }) => item);
}

export function buildSkillNamespaceGroupItems(
  typedSuffix: string,
  groups: SkillGroup[],
  config: SkillManagerConfig,
  records: SkillRecord[],
): AutocompleteItem[] {
  return groups
    .filter((group) => group.shortcutEnabled !== false)
    .map((group) => {
      const token = shortcutName(group.name);
      const memberCount = groupMemberNames(group.id, config, records).length;
      const descriptionParts = [`Group · ${memberCount} skill${memberCount === 1 ? "" : "s"}`];
      if (group.description) descriptionParts.push(singleLine(group.description));
      return {
        token,
        item: {
          value: `skill:${token}`,
          label: `skill:${token}`,
          description: descriptionParts.join(" — "),
        } satisfies AutocompleteItem,
      };
    })
    .filter(({ token }) => fuzzyTokenMatch(token, typedSuffix))
    .map(({ item }) => item);
}

export function buildGroupSkillItems(
  groupToken: string,
  typedSuffix: string,
  groups: SkillGroup[],
  config: SkillManagerConfig,
  records: SkillRecord[],
): AutocompleteItem[] {
  const group = findGroupByShortcut(groupToken, groups);
  if (!group || group.shortcutEnabled === false) return [];

  return groupMemberNames(group.id, config, records)
    .filter((name) => fuzzyTokenMatch(name, typedSuffix))
    .map((name) => {
      const description = recordDescription(name, records);
      return {
        value: `${shortcutName(group.name)}:${name}`,
        label: name,
        description: description ? singleLine(description) : undefined,
      };
    });
}

export function mergeAutocompleteItems(
  base: readonly AutocompleteItem[],
  extra: readonly AutocompleteItem[],
): AutocompleteItem[] {
  const out: AutocompleteItem[] = [];
  const seen = new Set<string>();
  for (const item of [...base, ...extra]) {
    const key = item.value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function textBeforeCursor(lines: string[], cursorLine: number, cursorCol: number): string {
  return (lines[cursorLine] ?? "").slice(0, cursorCol);
}

/**
 * Complete the editor-only /skill-profile: namespace without delegating to
 * Pi's generic slash completion. The canonical direct-switch syntax stays
 * colon-based (for example /skill-profile:Code_Review), while the extension's
 * input handler consumes it before ordinary skill/group shortcut parsing.
 */
export function applySkillProfileCompletion(
  lines: string[],
  cursorLine: number,
  cursorCol: number,
  item: AutocompleteItem,
  prefix: string,
): { lines: string[]; cursorLine: number; cursorCol: number } | null {
  if (!/^\/skill-profile:[^\s]*$/i.test(prefix)) return null;
  const valueMatch = item.value.match(/^skill-profile:(.+)$/i);
  if (!valueMatch) return null;

  const token = valueMatch[1];
  const currentLine = lines[cursorLine] ?? "";
  const prefixStart = Math.max(0, cursorCol - prefix.length);
  const beforePrefix = currentLine.slice(0, prefixStart);
  const afterCursor = currentLine.slice(cursorCol);
  const replacement = `${beforePrefix}/skill-profile:${token} ${afterCursor}`;
  const nextLines = [...lines];
  nextLines[cursorLine] = replacement;

  return {
    lines: nextLines,
    cursorLine,
    cursorCol: beforePrefix.length + "/skill-profile:".length + token.length + 1,
  };
}

/**
 * Complete extension-owned group entries without delegating them to Pi's
 * built-in slash-command completer. Pi's native completer only owns actual
 * registered commands/skills; handing it a synthetic group item can cause it
 * to apply the currently matching native skill instead.
 */
export function applySkillGroupCompletion(
  lines: string[],
  cursorLine: number,
  cursorCol: number,
  item: AutocompleteItem,
  prefix: string,
  groups: SkillGroup[],
  config: SkillManagerConfig,
  records: SkillRecord[],
): { lines: string[]; cursorLine: number; cursorCol: number } | null {
  const currentLine = lines[cursorLine] ?? "";
  const prefixStart = Math.max(0, cursorCol - prefix.length);
  const beforePrefix = currentLine.slice(0, prefixStart);
  const afterCursor = currentLine.slice(cursorCol);

  const skillNamespace = prefix.match(/^\/skill:[^\s]*$/i);
  const skillNamespaceValue = item.value.match(/^skill:(.+)$/i);
  if (skillNamespace && skillNamespaceValue) {
    const group = findGroupByShortcut(skillNamespaceValue[1], groups);
    if (group) {
      const token = shortcutName(group.name);
      const replacement = `${beforePrefix}/skill:${token} ${afterCursor}`;
      const nextLines = [...lines];
      nextLines[cursorLine] = replacement;
      return {
        lines: nextLines,
        cursorLine,
        cursorCol: beforePrefix.length + "/skill:".length + token.length + 1,
      };
    }
  }

  const topLevel = prefix.match(/^\/[^\s:]*$/);
  if (topLevel) {
    const group = findGroupByShortcut(item.value, groups);
    if (group && group.shortcutEnabled !== false) {
      const token = shortcutName(group.name);
      const replacement = `${beforePrefix}/${token} ${afterCursor}`;
      const nextLines = [...lines];
      nextLines[cursorLine] = replacement;
      return {
        lines: nextLines,
        cursorLine,
        cursorCol: beforePrefix.length + 1 + token.length + 1,
      };
    }
  }

  const scoped = prefix.match(/^\/([^\s:]+):[^\s]*$/);
  if (scoped && scoped[1].toLowerCase() !== "skill") {
    const group = findGroupByShortcut(scoped[1], groups);
    if (group && group.shortcutEnabled !== false) {
      const valueMatch = item.value.match(/^([^:]+):(.+)$/);
      if (valueMatch && findGroupByShortcut(valueMatch[1], groups)?.id === group.id) {
        const skillName = valueMatch[2];
        // Membership JSON is authoritative here. Completion must work even
        // before the first model turn has populated SkillRecord metadata.
        if ((config.memberships[skillName] ?? []).includes(group.id)) {
          const token = `${shortcutName(group.name)}:${skillName}`;
          const replacement = `${beforePrefix}/${token} ${afterCursor}`;
          const nextLines = [...lines];
          nextLines[cursorLine] = replacement;
          return {
            lines: nextLines,
            cursorLine,
            cursorCol: beforePrefix.length + 1 + token.length + 1,
          };
        }
      }
    }
  }

  return null;
}

/**
 * Wrap Pi's built-in autocomplete provider with Skill Orchestrator-only UI
 * completions. This does not register commands or add anything to the model
 * prompt; it only changes the editor's autocomplete suggestions.
 *
 * The wrapper deliberately adds "/" as a natural trigger. Pi's built-in slash
 * menu can close as soon as a typed /Group shortcut no longer matches a
 * registered command. Keeping slash-prefixed tokens active allows /Group:
 * to open our group-member completion menu even though /Group itself is a
 * lightweight input alias rather than a registered Pi command.
 */
export function createSkillOrchestratorAutocompleteProvider(
  current: AutocompleteProvider,
  getState: () => SkillAutocompleteState,
  getSkillCommands: () => readonly SkillCommandItem[] = () => [],
  getProfiles: () => readonly SkillProfileCompletionItem[] = () => [],
): AutocompleteProvider {
  const triggerCharacters = [...new Set([...(current.triggerCharacters ?? []), "/"])];
  const safeBaseSuggestions = async (
    lines: string[],
    cursorLine: number,
    cursorCol: number,
    options: Parameters<AutocompleteProvider["getSuggestions"]>[3],
  ): Promise<AutocompleteSuggestions | null> => {
    try {
      return await current.getSuggestions(lines, cursorLine, cursorCol, options);
    } catch {
      // Autocomplete is convenience UI. A native provider failure should not
      // crash the editor or prevent extension-owned group/profile completion.
      return null;
    }
  };

  return {
    triggerCharacters,

    async getSuggestions(lines, cursorLine, cursorCol, options): Promise<AutocompleteSuggestions | null> {
      const before = textBeforeCursor(lines, cursorLine, cursorCol);
      const state = getState();

      // Keep enabled short group aliases visible in Pi's ordinary slash menu.
      // This is UI-only autocomplete data: the groups are still not registered
      // as Pi commands and therefore add no model-context overhead. Keeping the
      // selected alias in the menu also prevents Pi from closing autocomplete
      // while the user types toward /Group_Name:skill.
      const topLevelMatch = before.match(/^\/([^\s:]*)$/);
      if (topLevelMatch) {
        const base = await safeBaseSuggestions(lines, cursorLine, cursorCol, options);
        const groups = buildTopLevelGroupItems(
          topLevelMatch[1] ?? "",
          state.config.groups,
          state.config,
          state.records,
        );
        const items = mergeAutocompleteItems(base?.items ?? [], groups);
        if (items.length === 0) return null;
        return { items, prefix: before };
      }

      // /skill-profile: shows saved profiles in the same colon-suffixed
      // style as Pi's /skill: commands. These are editor-only completions;
      // profiles are not registered one-by-one as commands.
      const profileNamespaceMatch = before.match(/^\/skill-profile:([^\s]*)$/i);
      if (profileNamespaceMatch) {
        const typedSuffix = profileNamespaceMatch[1] ?? "";
        const items = buildSkillProfileNamespaceItems(typedSuffix, [...getProfiles()]);
        return items.length > 0 ? { items, prefix: before } : null;
      }

      // /skill: must be complete and stable even when Pi's built-in provider is
      // temporarily missing entries. pi.getCommands() is the canonical command
      // catalogue and includes skill commands without loading skill bodies.
      const namespaceMatch = before.match(/^\/skill:([^\s]*)$/i);
      if (namespaceMatch) {
        const typedSuffix = namespaceMatch[1] ?? "";
        const base = await safeBaseSuggestions(lines, cursorLine, cursorCol, options);
        let commandItems: AutocompleteItem[] = [];
        try {
          commandItems = buildPiSkillItems(typedSuffix, getSkillCommands());
        } catch {
          // A stale/tearing-down Pi API must not break autocomplete. The native
          // provider and configured groups can still supply useful suggestions.
        }
        const groups = buildSkillNamespaceGroupItems(
          typedSuffix,
          state.config.groups,
          state.config,
          state.records,
        );
        const items = mergeAutocompleteItems(mergeAutocompleteItems(base?.items ?? [], commandItems), groups);
        if (items.length === 0) return null;
        return { items, prefix: before };
      }

      // /Group_Name: only shows skills assigned to that enabled group.
      const groupMatch = before.match(/^\/([^\s:]+):([^\s]*)$/);
      if (groupMatch && groupMatch[1].toLowerCase() !== "skill") {
        const group = findGroupByShortcut(groupMatch[1], state.config.groups);
        if (group && group.shortcutEnabled !== false) {
          const items = buildGroupSkillItems(
            groupMatch[1],
            groupMatch[2] ?? "",
            state.config.groups,
            state.config,
            state.records,
          );
          return items.length > 0 ? { items, prefix: before } : null;
        }
      }

      return safeBaseSuggestions(lines, cursorLine, cursorCol, options);
    },

    applyCompletion(lines, cursorLine, cursorCol, item, prefix) {
      const profileCompletion = applySkillProfileCompletion(lines, cursorLine, cursorCol, item, prefix);
      if (profileCompletion) return profileCompletion;
      const state = getState();
      const groupCompletion = applySkillGroupCompletion(
        lines,
        cursorLine,
        cursorCol,
        item,
        prefix,
        state.config.groups,
        state.config,
        state.records,
      );
      if (groupCompletion) return groupCompletion;
      return current.applyCompletion(lines, cursorLine, cursorCol, item, prefix);
    },

    ...(current.shouldTriggerFileCompletion
      ? {
          shouldTriggerFileCompletion(lines: string[], cursorLine: number, cursorCol: number) {
            return current.shouldTriggerFileCompletion!(lines, cursorLine, cursorCol);
          },
        }
      : {}),
  };
}
