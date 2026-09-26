import { Type } from "typebox";
import type { ExtensionAPI, ExtensionCommandContext } from "@earendil-works/pi-coding-agent";
import { GLOBAL_CONFIG_PATH } from "./config.js";
import { containsPotentialNativeSkillCatalog, isModelVisibleSkill, toSkillRecords, toSkillRecordsFromCommands, mergeSkillRecords, replaceNativeSkillCatalog } from "./catalog.js";
import { readSkillBody, loadSkill, renderLoadedBundle } from "./skill-io.js";
import { resolveDependencyGraph, detectDependencies } from "./dependencies.js";
import { SkillManagerOverlay, type UiResult } from "./ui.js";
import { formatQueueNotification } from "./notifications.js";
import { parseShortcut, parseSkillNamespaceShortcut } from "./shortcuts.js";
import { createSkillOrchestratorAutocompleteProvider } from "./autocomplete.js";
import { rankSkillRecordsBySearch } from "./search.js";
import type { DependencyResolution, SkillManagerConfig, SkillRecord } from "./types.js";
import {
  formatScopeNotification,
  globalFallbackRecords,
  groupMemberRecords,
  renderScopeCatalog,
  resolveSkillScope,
  type ActiveSkillScope,
} from "./scope.js";
import { PROFILES_DIR, SkillProfileStore, type ProfileMutationResult } from "./profiles.js";
import {
  TOKEN_RETRIEVE_TOOL,
  TOKEN_TOOL_SEARCH_TOOL,
  TOKEN_SAVER_GUIDANCE,
  TokenSaverEngine,
  clampRoutineProviderEffort,
  compactProviderToolDescriptions,
  isRoutineToolContinuation,
  rankDeferredTools,
  sanitizeToolMetadataText,
  updateRoutineContinuationState,
  type RoutineContinuationState,
} from "./token-saver.js";
import * as path from "node:path";

function skillMap(records: SkillRecord[]): Map<string, SkillRecord> {
  return new Map(records.map((s) => [s.name, s]));
}

interface MultiRootBundle {
  roots: string[];
  order: string[];
  text: string;
  missing: string[];
  cycles: string[][];
}

async function loadRoots(roots: string[], records: SkillRecord[], config: SkillManagerConfig): Promise<MultiRootBundle> {
  const map = skillMap(records);
  const uniqueRoots = [...new Set(roots)];
  for (const root of uniqueRoots) {
    if (!map.has(root)) throw new Error(`Unknown skill: ${root}`);
  }

  const order: string[] = [];
  const seen = new Set<string>();
  const missing = new Set<string>();
  const cycles: string[][] = [];

  for (const root of uniqueRoots) {
    const graph: DependencyResolution = await resolveDependencyGraph(root, map, config, readSkillBody);
    for (const name of graph.order) {
      if (!seen.has(name)) {
        seen.add(name);
        order.push(name);
      }
    }
    for (const name of graph.missing) missing.add(name);
    cycles.push(...graph.cycles);
  }

  const loaded = [];
  const autoDependencyNames = [...map.values()].filter(isModelVisibleSkill).map((record) => record.name);
  for (const name of order) {
    const record = map.get(name);
    if (record) loaded.push(await loadSkill(record, autoDependencyNames, config));
  }

  return {
    roots: uniqueRoots,
    order,
    text: renderLoadedBundle(uniqueRoots, loaded, { missing: [...missing], cycles }),
    missing: [...missing],
    cycles,
  };
}

async function loadBundle(root: string, records: SkillRecord[], config: SkillManagerConfig) {
  return loadRoots([root], records, config);
}

function queueBundleForNextTurn(pi: ExtensionAPI, bundle: MultiRootBundle): void {
  pi.sendMessage(
    {
      customType: "skill-orchestrator",
      content: bundle.text,
      display: true,
      details: { roots: bundle.roots, loaded: bundle.order, missing: bundle.missing, cycles: bundle.cycles },
    },
    { deliverAs: "nextTurn" },
  );
}

async function computeAutoDeps(records: SkillRecord[]): Promise<Record<string, string[]>> {
  const names = records.filter(isModelVisibleSkill).map((s) => s.name);
  const out: Record<string, string[]> = {};
  for (const s of records) {
    try {
      out[s.name] = detectDependencies(await readSkillBody(s), s.name, names);
    } catch {
      out[s.name] = [];
    }
  }
  return out;
}

function currentRecords(ctx: { getSystemPromptOptions(): any }): SkillRecord[] {
  return toSkillRecords(ctx.getSystemPromptOptions()?.skills ?? []);
}

function extensionContextRecords(pi: ExtensionAPI, cached: SkillRecord[]): SkillRecord[] {
  // Event/tool ExtensionContext intentionally does not expose
  // getSystemPromptOptions(). Pi does expose its current command catalogue,
  // and skill command sourceInfo.path points at the underlying SKILL.md.
  // Merge those records with the before_agent_start cache so raw-input
  // shortcuts and the model-facing skill tool work without relying on a
  // command-only context API.
  return mergeSkillRecords(cached, toSkillRecordsFromCommands(pi.getCommands()));
}


export default function (pi: ExtensionAPI) {
  const profileStore = new SkillProfileStore();
  let profileState = profileStore.load();
  let configState: { config: SkillManagerConfig; error?: string } = { config: profileState.config, error: profileState.error };
  let warnedConfig = false;
  let warnedCatalogStrip = false;
  let autocompleteRecords: SkillRecord[] = [];
  const fallbackRootNames = new Set<string>();
  let activeScope: ActiveSkillScope = {
    kind: "profile",
    profileId: profileState.activeProfile.id,
    profileName: profileState.activeProfile.name,
  };
  const tokenSaver = new TokenSaverEngine();
  let routineContinuation: RoutineContinuationState = "none";
  const deferredToolNames = new Set<string>();
  const alwaysActiveToolNames = new Set([
    "read", "bash", "edit", "write", "grep", "find", "ls", "powershell",
    "skill", "skill_search", TOKEN_RETRIEVE_TOOL, TOKEN_TOOL_SEARCH_TOOL,
  ]);

  const restoreDeferredTools = (): void => {
    if (!deferredToolNames.size) return;
    const available = new Set(pi.getAllTools().map((tool) => tool.name));
    const active = new Set(pi.getActiveTools());
    for (const name of deferredToolNames) if (available.has(name)) active.add(name);
    deferredToolNames.clear();
    pi.setActiveTools([...active]);
  };

  const restoreTokenSaverToolState = (): void => {
    const available = new Set(pi.getAllTools().map((tool) => tool.name));
    const active = new Set(pi.getActiveTools());
    for (const name of deferredToolNames) if (available.has(name)) active.add(name);
    deferredToolNames.clear();
    active.delete(TOKEN_RETRIEVE_TOOL);
    active.delete(TOKEN_TOOL_SEARCH_TOOL);
    pi.setActiveTools([...active]);
  };

  const syncTokenSaverToolAvailability = (resetDeferral = false): void => {
    if (resetDeferral) restoreDeferredTools();
    const active = new Set(pi.getActiveTools());

    if (!configState.config.tokenSaverEnabled) {
      restoreTokenSaverToolState();
      return;
    }

    // Headroom-style tool-schema deferral. Keep Pi's core working tools and
    // Orchestrator's small discovery/recovery surface active. Move other
    // currently active schemas behind token_tool_search until they are needed.
    for (const name of active) {
      if (alwaysActiveToolNames.has(name)) continue;
      deferredToolNames.add(name);
      active.delete(name);
    }
    active.add(TOKEN_RETRIEVE_TOOL);
    active.add(TOKEN_TOOL_SEARCH_TOOL);
    pi.setActiveTools([...active]);
  };

  const activateProfileScope = (): void => {
    fallbackRootNames.clear();
    activeScope = {
      kind: "profile",
      profileId: profileState.activeProfile.id,
      profileName: profileState.activeProfile.name,
    };
  };

  const applyProfileMutation = (result: ProfileMutationResult): ProfileMutationResult => {
    if (result.ok) {
      const tokenSaverChanged = configState.config.tokenSaverEnabled !== result.config.tokenSaverEnabled;
      fallbackRootNames.clear();
      profileState = {
        config: result.config,
        activeProfile: result.profile,
        profiles: result.profiles,
      };
      configState = { config: result.config };
      if (tokenSaverChanged) {
        tokenSaver.resetSession();
        routineContinuation = "none";
      }
      syncTokenSaverToolAvailability();
    }
    return result;
  };

  const applyProfileSelection = (result: ProfileMutationResult): ProfileMutationResult => {
    const applied = applyProfileMutation(result);
    if (applied.ok) {
      tokenSaver.resetSession();
      routineContinuation = "none";
      syncTokenSaverToolAvailability(true);
      activateProfileScope();
    }
    return applied;
  };

  pi.on("session_start", async (_event, ctx) => {
    profileState = profileStore.load();
    configState = { config: profileState.config, error: profileState.error };
    warnedConfig = false;
    warnedCatalogStrip = false;
    tokenSaver.resetSession();
    routineContinuation = "none";
    deferredToolNames.clear();
    activateProfileScope();
    syncTokenSaverToolAvailability();
    autocompleteRecords = extensionContextRecords(pi, []);
    if (ctx.mode === "tui") {
      // Pi clears extension UI wrappers during session replacement/reload.
      // Register once for this fresh session every time session_start fires;
      // do not persist an "installed" flag across reloads.
      ctx.ui.addAutocompleteProvider((current) =>
        createSkillOrchestratorAutocompleteProvider(
          current,
          () => ({ config: configState.config, records: autocompleteRecords }),
          () =>
            pi
              .getCommands()
              .filter((command) => command.source === "skill")
              .map((command) => ({ name: command.name, description: command.description })),
          () => profileState.profiles,
        ),
      );
    }
    if (configState.error && !warnedConfig) {
      ctx.ui.notify(
        `Skill Orchestrator profile/config error: ${configState.error}. Using safe in-memory defaults without overwriting your files.`,
        "error",
      );
      warnedConfig = true;
    }
  });

  pi.on("session_shutdown", async () => {
    try {
      restoreTokenSaverToolState();
    } finally {
      deferredToolNames.clear();
      routineContinuation = "none";
      tokenSaver.resetSession();
    }
  });

  pi.on("before_agent_start", async (event, _ctx) => {
    const rawSkills = event.systemPromptOptions?.skills ?? [];
    const records = toSkillRecords(rawSkills);
    autocompleteRecords = records;

    const scope = resolveSkillScope(
      activeScope,
      configState.config,
      records,
      profileState.activeProfile,
    );
    // True lazy discovery: Pi may keep every installed skill in its TUI command
    // catalogue for /skill: autocomplete, but the model must never receive the
    // native all-skill name/description/location block while Skill Orchestrator
    // is active. Strip every safely recognized Pi-style catalogue rather than
    // assuming there is exactly one or that another extension did not prepend
    // unrelated XML.
    const baseScopeStub = renderScopeCatalog(scope, configState.config);
    const scopeStub = configState.config.tokenSaverEnabled
      ? `${baseScopeStub}\n\n${TOKEN_SAVER_GUIDANCE}`
      : baseScopeStub;
    const stripped = replaceNativeSkillCatalog(event.systemPrompt, records, scopeStub);
    if (stripped !== event.systemPrompt) {
      warnedCatalogStrip = false;
      if (configState.config.tokenSaverEnabled) tokenSaver.observePromptPrefix(stripped);
      return { systemPrompt: stripped };
    }

    if (containsPotentialNativeSkillCatalog(event.systemPrompt, records)) {
      if (!warnedCatalogStrip) {
        _ctx.ui.notify(
          "Skill Orchestrator could not safely remove Pi's native skill catalog. This turn may include eager skill metadata in model context; no Pi settings were changed.",
          "error",
        );
        warnedCatalogStrip = true;
      }
      if (configState.config.tokenSaverEnabled) tokenSaver.observePromptPrefix(event.systemPrompt);
      return undefined;
    }

    // Custom prompts or another extension may already omit Pi's native skill
    // block. Add only the constant-size Orchestrator scope stub in that case.
    const finalPrompt = `${event.systemPrompt}\n\n${scopeStub}`;
    if (configState.config.tokenSaverEnabled) tokenSaver.observePromptPrefix(finalPrompt);
    return { systemPrompt: finalPrompt };
  });

  pi.on("input", async (event, ctx) => {
    if (event.source === "extension") return { action: "continue" as const };
    routineContinuation = "none";
    if (configState.config.tokenSaverEnabled) tokenSaver.setQuery(event.text);

    // Profile namespace: /skill-profile:Profile_Name. The profile list is
    // surfaced by the editor autocomplete provider without registering one
    // Pi command per profile.
    const profileMatch = event.text.trim().match(/^\/skill-profile:([^\s]+)$/i);
    if (profileMatch) {
      const result = applyProfileSelection(profileStore.switchProfile(profileMatch[1] ?? ""));
      if (result.ok === false) {
        ctx.ui.notify(result.error, "error");
        return { action: "handled" as const };
      }
      ctx.ui.notify(
        `Activated skill profile "${result.profile.name}"${result.profile.description ? ` — ${result.profile.description}` : ""}. Skills remain lazy-loaded.`,
        "info",
      );
      return { action: "handled" as const };
    }

    const records = extensionContextRecords(pi, autocompleteRecords);
    autocompleteRecords = records;

    // Pi-native namespace: /skill:Skill_Name or /skill:Group_Name.
    // These forms are parsed from raw input and are NOT registered as one
    // command per skill/group, so they add no idle context-window overhead.
    const namespaced = parseSkillNamespaceShortcut(event.text, configState.config.groups, records);
    if (namespaced.kind === "error") {
      ctx.ui.notify(namespaced.message, "error");
      return { action: "handled" as const };
    }
    if (namespaced.kind === "match") {
      const { task } = namespaced.value;
      try {
        if (namespaced.value.kind === "skill" && namespaced.value.skill) {
          const skill = namespaced.value.skill;
          const bundle = await loadBundle(skill.name, records, configState.config);
          ctx.ui.notify(formatQueueNotification(`skill "${skill.name}"`, bundle).replace(/^Queued /, "Loaded "), "info");
          return {
            action: "transform" as const,
            text: `${bundle.text}\n\n${task ? `User task / arguments:\n${task}` : `The user explicitly selected skill ${skill.name}. Apply it to the user's current task/context.`}`,
          };
        }

        if (namespaced.value.kind === "group" && namespaced.value.group) {
          const group = namespaced.value.group;
          const members = groupMemberRecords(group.id, configState.config, records);
          if (!members.length) {
            ctx.ui.notify(`Group "${group.name}" has no skills.`, "warning");
            return { action: "handled" as const };
          }
          fallbackRootNames.clear();
          activeScope = {
            kind: "group",
            profileId: profileState.activeProfile.id,
            groupId: group.id,
            groupName: group.name,
          };
          const scope = resolveSkillScope(activeScope, configState.config, records, profileState.activeProfile);
          ctx.ui.notify(formatScopeNotification(scope), "info");
          if (!task) return { action: "handled" as const };
          return { action: "transform" as const, text: task };
        }
      } catch (err) {
        ctx.ui.notify(err instanceof Error ? err.message : String(err), "error");
        return { action: "handled" as const };
      }
    }

    // Group shortcuts are intercepted as raw input instead of being registered as
    // one Pi command per group. That keeps the aliases out of the command registry
    // and adds no idle model-context cost. Examples:
    //   /Code_Review
    //   /Code_Review:architecture-review
    const shortcut = parseShortcut(event.text, configState.config.groups, records, configState.config);
    if (shortcut.kind === "none") return { action: "continue" as const };
    if (shortcut.kind === "error") {
      ctx.ui.notify(shortcut.message, "error");
      return { action: "handled" as const };
    }

    const { group, skill, task } = shortcut.value;

    if (!skill) {
      const members = groupMemberRecords(group.id, configState.config, records);
      if (!members.length) {
        ctx.ui.notify(`Group "${group.name}" has no skills.`, "warning");
        return { action: "handled" as const };
      }
      fallbackRootNames.clear();
      activeScope = {
        kind: "group",
        profileId: profileState.activeProfile.id,
        groupId: group.id,
        groupName: group.name,
      };
      const scope = resolveSkillScope(activeScope, configState.config, records, profileState.activeProfile);
      ctx.ui.notify(formatScopeNotification(scope), "info");
      if (!task) return { action: "handled" as const };
      return { action: "transform" as const, text: task };
    }

    try {
      const bundle = await loadBundle(skill.name, records, configState.config);
      const label = `skill "${skill.name}" from group "${group.name}"`;
      ctx.ui.notify(formatQueueNotification(label, bundle).replace(/^Queued /, "Loaded "), "info");
      return {
        action: "transform" as const,
        text: `${bundle.text}\n\n${task ? `User task / arguments:\n${task}` : `The user explicitly selected ${skill.name} from group ${group.name}. Apply it to the user's current task/context.`}`,
      };
    } catch (err) {
      ctx.ui.notify(err instanceof Error ? err.message : String(err), "error");
      return { action: "handled" as const };
    }
  });

  pi.on("tool_result", async (event) => {
    if (!configState.config.tokenSaverEnabled) {
      routineContinuation = "none";
      return undefined;
    }

    const textForRoutine = event.content
      .filter((item): item is { type: "text"; text: string } => item.type === "text")
      .map((item) => item.text)
      .join("\n");
    routineContinuation = updateRoutineContinuationState(
      routineContinuation,
      isRoutineToolContinuation(event.toolName, event.input, textForRoutine, event.isError),
    );

    if (["skill", "skill_search", TOKEN_RETRIEVE_TOOL, TOKEN_TOOL_SEARCH_TOOL].includes(event.toolName)) return undefined;
    let changed = false;
    const content = event.content.map((item) => {
      if (item.type !== "text") return item;
      const result = tokenSaver.compress(event.toolName, event.input, item.text, event.isError);
      if (!result.changed) return item;
      changed = true;
      return { ...item, text: result.text };
    });
    return changed ? { content } : undefined;
  });

  pi.on("before_provider_request", async (event) => {
    if (!configState.config.tokenSaverEnabled) return undefined;

    let payload = event.payload;
    let changed = false;

    // Shorten only top-level tool descriptions. Parameter schemas and their
    // descriptions remain untouched so call semantics stay exact.
    const schemaResult = compactProviderToolDescriptions(payload);
    if (schemaResult.changed) {
      payload = schemaResult.payload;
      changed = true;
      tokenSaver.recordToolDescriptionSavings(schemaResult.savedChars);
    }

    if (routineContinuation === "eligible") {
      const effortResult = clampRoutineProviderEffort(payload);
      if (effortResult.changed) {
        payload = effortResult.payload;
        changed = true;
      }
    }
    routineContinuation = "none";
    return changed ? payload : undefined;
  });

  pi.registerTool({
    name: TOKEN_TOOL_SEARCH_TOOL,
    label: "Find Deferred Tool",
    description: "Search tool metadata that Token Saver deferred to keep unused tool schemas out of model context. Matching tools are activated for the current session.",
    promptSnippet: "token_tool_search — find and activate a deferred non-core tool only when the active tools cannot do the task",
    promptGuidelines: [
      "Use token_tool_search only when the active tools cannot perform the required capability.",
      "Search with a concise capability description. Use the activated tool instead of repeatedly searching for it.",
    ],
    parameters: Type.Object({
      query: Type.String({ minLength: 1, description: "Capability or tool behavior needed for the current task" }),
      limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 5, description: "Maximum matching tools to activate (default 3)" })),
    }),
    async execute(_id, params) {
      const all = pi.getAllTools();
      const pool = all.filter((tool) => deferredToolNames.has(tool.name));
      const matches = rankDeferredTools(pool, params.query, params.limit ?? 3);
      if (!matches.length) {
        tokenSaver.recordToolSearch(0);
        return {
          content: [{ type: "text" as const, text: `No deferred tool matched: ${params.query}.` }],
          details: { query: params.query, matches: [], activated: [] },
        };
      }

      const active = new Set(pi.getActiveTools());
      const activated: string[] = [];
      for (const tool of matches) {
        if (!active.has(tool.name)) {
          active.add(tool.name);
          activated.push(tool.name);
        }
        deferredToolNames.delete(tool.name);
      }
      pi.setActiveTools([...active]);
      tokenSaver.recordToolSearch(activated.length);
      const lines = matches.map((tool, index) => {
        const name = sanitizeToolMetadataText(tool.name, 120) || "(unnamed tool)";
        const description = sanitizeToolMetadataText(tool.description, 180);
        return `${index + 1}. ${name}${description ? `: ${description}` : ""}`;
      });
      return {
        content: [{ type: "text" as const, text: [`Activated ${activated.length || matches.length} matching tool(s):`, ...lines, "Use the best matching activated tool for the task."].join("\n") }],
        details: { query: params.query, matches: matches.map((tool) => tool.name), activated },
      };
    },
  });

  pi.registerTool({
    name: TOKEN_RETRIEVE_TOOL,
    label: "Retrieve Full Tool Output",
    description: "Retrieve an exact line range from a tool result that Token Saver compacted. Use only when the compacted result does not contain a detail needed for the current task.",
    promptSnippet: "token_retrieve — recover exact omitted lines from a compacted tool result",
    promptGuidelines: [
      "Use token_retrieve only when a compacted tool result is missing information required for the task.",
      "Prefer a small line range. Continue with nextStartLine only when more of the original is necessary.",
    ],
    parameters: Type.Object({
      id: Type.String({ minLength: 1, description: "Recovery id shown as full=<id> in a token-saver marker" }),
      startLine: Type.Optional(Type.Integer({ minimum: 1, description: "1-based first line to retrieve (default 1)" })),
      maxLines: Type.Optional(Type.Integer({ minimum: 1, maximum: 1000, description: "Maximum lines to return (default 240)" })),
    }),
    async execute(_id, params) {
      const result = tokenSaver.retrieve(params.id, params.startLine ?? 1, params.maxLines ?? 240);
      if (!result) {
        return {
          content: [{ type: "text" as const, text: `Token Saver recovery id not found: ${params.id}. The in-memory entry may have been evicted, cleared, or discarded by a Pi restart, reload, resume, new session, or fork.` }],
          details: { id: params.id },
          isError: true,
        };
      }
      const header = `[token-retrieve ${result.id}: lines ${result.startLine}-${result.endLine} of ${result.totalLines}${result.hasMore ? `; nextStartLine=${result.nextStartLine}` : ""}]`;
      return {
        content: [{ type: "text" as const, text: `${header}\n${result.text}` }],
        details: result,
      };
    },
  });

  pi.registerTool({
    name: "skill_search",
    label: "Find Skill",
    description: "Search lazy skill metadata without loading any SKILL.md body. Search the active profile/group first; when it has no appropriate skill, use the global fallback search to find a few outside-scope candidates without changing the active scope.",
    promptSnippet: "skill_search — lazily find a few relevant skill candidates without loading their bodies",
    promptGuidelines: [
      "Search the active scope first. If its returned candidates are not appropriate, call skill_search again with scope `global`.",
      "Global fallback searches only metadata outside the active restrictive scope, returns a small subset, and does not change the active group/profile.",
      "Search results are metadata only. Choose one appropriate result, then call the skill tool with its exact name. Never enumerate or load an entire scope.",
    ],
    parameters: Type.Object({
      query: Type.String({ minLength: 1, description: "Concise task, capability, or workflow to search for" }),
      limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 8, description: "Maximum matches to return (default 5)" })),
      scope: Type.Optional(Type.Union([
        Type.Literal("active"),
        Type.Literal("global"),
      ], { description: "Search the active scope first; use global only when the active scope has no appropriate candidate" })),
    }),
    async execute(_id, params, _signal, _onUpdate, _ctx) {
      const records = extensionContextRecords(pi, autocompleteRecords);
      autocompleteRecords = records;
      const active = resolveSkillScope(activeScope, configState.config, records, profileState.activeProfile);
      const limit = params.limit ?? 5;
      const requestedScope = params.scope ?? "active";
      fallbackRootNames.clear();
      const maxDescription = Math.max(0, Math.min(240, configState.config.catalogDescriptionMax));
      const compactDescription = (description: string) => {
        const flat = description.replace(/\s+/g, " ").trim();
        if (maxDescription === 0) return "";
        if (flat.length <= maxDescription) return flat;
        return `${flat.slice(0, Math.max(1, maxDescription - 1)).trimEnd()}…`;
      };
      const renderMatches = (heading: string, matches: SkillRecord[], finalLine: string) => {
        const lines = matches.map((record, index) => {
          const description = compactDescription(record.description);
          return `${index + 1}. ${record.name}${description ? `: ${description}` : ""}`;
        });
        return [heading, ...lines, finalLine].join("\n");
      };
      const authorizeFallback = (matches: SkillRecord[]) => {
        fallbackRootNames.clear();
        for (const record of matches) fallbackRootNames.add(record.name);
      };

      if (requestedScope === "global") {
        const pool = globalFallbackRecords(active, records);
        const matches = rankSkillRecordsBySearch(pool, params.query, limit);
        authorizeFallback(matches);
        if (!pool.length) {
          return {
            content: [{ type: "text" as const, text: `No outside-scope skills are available for global fallback from the active ${active.label}.` }],
            details: { activeScope: active.label, searchScope: "global", query: params.query, matches: [] },
          };
        }
        if (!matches.length) {
          return {
            content: [{ type: "text" as const, text: `No global fallback skill matched: ${params.query}. The active ${active.label} remains unchanged.` }],
            details: { activeScope: active.label, searchScope: "global", query: params.query, matches: [] },
          };
        }
        return {
          content: [{
            type: "text" as const,
            text: renderMatches(
              `Global fallback skill matches outside the active ${active.label}:`,
              matches,
              "Choose only the best matching skill and call `skill` with its exact name. The active scope remains unchanged.",
            ),
          }],
          details: { activeScope: active.label, searchScope: "global", query: params.query, matches: matches.map((record) => record.name) },
        };
      }

      const matches = rankSkillRecordsBySearch(active.records, params.query, limit);
      if (matches.length) {
        return {
          content: [{
            type: "text" as const,
            text: renderMatches(
              `Skill matches in ${active.label}:`,
              matches,
              "Choose only the best matching skill and call `skill` with its exact name. If none is appropriate, call `skill_search` again with scope `global`.",
            ),
          }],
          details: { activeScope: active.label, searchScope: "active", query: params.query, matches: matches.map((record) => record.name) },
        };
      }

      // Zero matching active-scope candidates is an unambiguous reason to broaden
      // discovery, so perform one small global fallback search automatically. This
      // still keeps the complete global catalog outside the prompt.
      if (active.restricted) {
        const fallbackMatches = rankSkillRecordsBySearch(globalFallbackRecords(active, records), params.query, limit);
        authorizeFallback(fallbackMatches);
        if (fallbackMatches.length) {
          return {
            content: [{
              type: "text" as const,
              text: renderMatches(
                `No matching skill was found in the active ${active.label}. Global fallback matches:`,
                fallbackMatches,
                "Choose only the best matching fallback and call `skill` with its exact name. The active scope remains unchanged.",
              ),
            }],
            details: { activeScope: active.label, searchScope: "global-fallback", query: params.query, matches: fallbackMatches.map((record) => record.name) },
          };
        }
      }

      const empty = active.records.length === 0;
      return {
        content: [{
          type: "text" as const,
          text: empty
            ? `No automatic skill candidates are configured in the active ${active.label}, and no global fallback matched: ${params.query}.`
            : `No matching skills found in the active ${active.label} or global fallback for: ${params.query}.`,
        }],
        details: { activeScope: active.label, searchScope: "active", query: params.query, matches: [] },
      };
    },
  });

  pi.registerTool({
    name: "skill",
    label: "Load Skill",
    description: "Load one exact lazy skill selected from the active Skill Orchestrator scope or from a prior global fallback search. Recursive dependencies are resolved automatically regardless of group/profile membership.",
    promptSnippet: "skill — load one exact lazy skill and its dependency closure",
    promptGuidelines: [
      "Use skill_search to discover a small matching subset when you do not already know the exact skill name.",
      "Prefer the active scope. An outside-scope root is allowed only after skill_search surfaced it through global fallback; loading it does not change the active group/profile.",
      "Load only the one root skill needed for the task. Its recursive dependencies may be outside the active scope and are loaded only when required.",
    ],
    parameters: Type.Object({ name: Type.String({ description: "Exact installed skill name returned by skill_search or explicitly selected by the user" }) }),
    async execute(_id, params, _signal, _onUpdate, _ctx) {
      const records = extensionContextRecords(pi, autocompleteRecords);
      autocompleteRecords = records;
      try {
        const requested = records.find((record) => record.name === params.name);
        if (requested && !isModelVisibleSkill(requested)) {
          return {
            content: [{ type: "text" as const, text: `Skill load blocked: "${params.name}" is marked disable-model-invocation and must be selected explicitly by the user with /skill:${params.name}.` }],
            details: { root: params.name, manualOnly: true },
            isError: true,
          };
        }
        const active = resolveSkillScope(activeScope, configState.config, records, profileState.activeProfile);
        const inActiveScope = active.allowedNames.has(params.name);
        const authorizedFallback = fallbackRootNames.has(params.name);
        if (active.restricted && !inActiveScope && !authorizedFallback) {
          return {
            content: [{
              type: "text" as const,
              text: `Skill load blocked: "${params.name}" is outside the active ${active.label} and has not been surfaced by a global fallback search. Search the active scope first, then use skill_search with scope \`global\` if no active candidate is appropriate.`,
            }],
            details: { root: params.name, activeScope: active.label, fallbackAuthorized: false },
            isError: true,
          };
        }
        const bundle = await loadBundle(params.name, records, configState.config);
        return {
          content: [{ type: "text" as const, text: bundle.text }],
          details: {
            roots: bundle.roots,
            loaded: bundle.order,
            missing: bundle.missing,
            cycles: bundle.cycles,
            selection: authorizedFallback && !inActiveScope ? "global-fallback" : "active-scope",
            activeScope: active.label,
          },
        };
      } catch (err) {
        return {
          content: [{ type: "text" as const, text: `Skill load failed: ${err instanceof Error ? err.message : String(err)}` }],
          details: { root: params.name },
          isError: true,
        };
      }
    },
  });

  const openManager = async (ctx: ExtensionCommandContext) => {
    if (ctx.mode !== "tui") {
      ctx.ui.notify("/skill requires Pi's TUI.", "warning");
      return;
    }
    const records = mergeSkillRecords(currentRecords(ctx), extensionContextRecords(pi, autocompleteRecords));
    autocompleteRecords = records;
    if (!records.length) {
      ctx.ui.notify("No Pi skills are currently discovered.", "warning");
      return;
    }
    // Dependency inspection reads skill files for the manager UI only. Never
    // perform that potentially expensive scan in non-TUI modes where the
    // manager cannot be displayed.
    const autoDeps = await computeAutoDeps(records);

    let requestRender = () => {};
    const result = await ctx.ui.custom<UiResult>((tui, theme, _keys, done) => {
      const saveConfigNow = (nextConfig: SkillManagerConfig) => {
        const result = applyProfileMutation(profileStore.saveActiveConfig(nextConfig));
        return result.ok === true
          ? { ok: true as const }
          : { ok: false as const, error: result.error };
      };
      const profileActions = {
        listProfiles: () => profileState.profiles,
        getActiveProfile: () => profileState.activeProfile,
        createProfile: (name: string, description: string) => applyProfileSelection(profileStore.createProfile(name, description)),
        switchProfile: (id: string) => applyProfileSelection(profileStore.switchProfile(id)),
        updateProfile: (id: string, name: string, description: string) =>
          applyProfileMutation(profileStore.updateProfile(id, name, description)),
        deleteProfile: (id: string) => {
          const deletingActive = profileState.activeProfile.id === id;
          const result = applyProfileMutation(profileStore.deleteProfile(id));
          if (result.ok && deletingActive) activateProfileScope();
          return result;
        },
      };
      const comp = new SkillManagerOverlay(
        theme,
        records,
        configState.config,
        autoDeps,
        done,
        () => requestRender(),
        saveConfigNow,
        profileActions,
      );
      requestRender = () => tui.requestRender();
      return comp;
    }, { overlay: true, overlayOptions: { anchor: "center", width: 94, margin: 1 } });

    if (!result || result.action === "cancel") return;

    if (result.action === "scope") {
      fallbackRootNames.clear();
      if (result.groupId === null) {
        activeScope = { kind: "all" };
      } else {
        const group = result.config.groups.find((candidate) => candidate.id === result.groupId);
        if (!group) {
          ctx.ui.notify(`Group scope "${result.label}" no longer exists.`, "warning");
          return;
        }
        activeScope = {
          kind: "group",
          profileId: profileState.activeProfile.id,
          groupId: group.id,
          groupName: group.name,
        };
      }
      const scope = resolveSkillScope(activeScope, result.config, records, profileState.activeProfile);
      ctx.ui.notify(formatScopeNotification(scope), "info");
      return;
    }

    if (result.action === "load") {
      try {
        const bundle = await loadRoots(result.skills, records, result.config);
        queueBundleForNextTurn(pi, bundle);
        ctx.ui.setEditorText(`${ctx.ui.getEditorText?.() ?? ""}`);

        ctx.ui.notify(formatQueueNotification(result.label, bundle), "info");
      } catch (err) {
        ctx.ui.notify(err instanceof Error ? err.message : String(err), "error");
      }
    }
  };

  pi.registerCommand("skill", {
    description: "Open the Skill Orchestrator manager",
    handler: async (_args, ctx) => openManager(ctx),
  });
  pi.registerCommand("skill-manager", {
    description: "Open the Skill Orchestrator manager",
    handler: async (_args, ctx) => openManager(ctx),
  });
  pi.registerCommand("skill-profile", {
    description: "Open the Skill Orchestrator profile selector; use /skill-profile:<Profile_Name> to switch directly",
    handler: async (args, ctx) => {
      if (args.trim()) {
        ctx.ui.notify(
          "Direct profile switching uses colon syntax: /skill-profile:<Profile_Name>",
          "warning",
        );
        return;
      }

      const options = profileState.profiles.map((profile) =>
        `${profile.active ? "● " : "  "}${profile.name}${profile.description ? ` — ${profile.description}` : ""}`,
      );
      const selected = await ctx.ui.select("Activate Skill Profile", options);
      if (!selected) return;
      const selectedIndex = options.indexOf(selected);
      if (selectedIndex < 0) return;
      const result = applyProfileSelection(profileStore.switchProfile(profileState.profiles[selectedIndex].id));
      if (result.ok === false) {
        ctx.ui.notify(result.error, "error");
        return;
      }
      ctx.ui.notify(
        `Activated skill profile "${result.profile.name}"${result.profile.description ? ` — ${result.profile.description}` : ""}. Skills remain lazy-loaded.`,
        "info",
      );
    },
  });

  pi.registerCommand("token-saver", {
    description: "Toggle or inspect optional Headroom/RTK-style token savings: /token-saver [on|off|status|stats|clear]",
    handler: async (args, ctx) => {
      const action = args.trim().toLowerCase();
      if (["status", "stats"].includes(action)) {
        const stats = tokenSaver.stats();
        ctx.ui.notify(
          action === "status"
            ? `Token Saver is ${configState.config.tokenSaverEnabled ? "ON" : "OFF"} for profile "${profileState.activeProfile.name}". Session savings: ~${stats.estimatedTokensSaved} tokens across ${stats.compressions} compacted tool results.`
            : [
                `Token Saver: ${configState.config.tokenSaverEnabled ? "ON" : "OFF"}`,
                `Compactions: ${stats.compressions} (${stats.cacheHits} cached repeats)`,
                `Retrievals: ${stats.retrievals}`,
                `Characters: ${stats.originalChars} → ${stats.compressedChars} (saved ${stats.savedChars})`,
                `Estimated input tokens saved: ~${stats.estimatedTokensSaved}`,
                `Recovery cache: ${stats.storedEntries} entries / ${stats.storedChars} chars`,
                `Prompt prefix drift: ${stats.prefixChanges} changes across ${stats.prefixObservations} observations`,
                `Deferred tool search: ${stats.toolSearches} searches / ${stats.toolsActivated} tools activated`,
                `Tool-description characters saved on provider requests: ${stats.toolDescriptionCharsSaved}`,
                `Currently deferred tool schemas: ${deferredToolNames.size}`,
                `Strategies: ${Object.entries(stats.byStrategy).map(([name, value]) => `${name}=${value.count}`).join(", ") || "none"}`,
              ].join("\n"),
          "info",
        );
        return;
      }
      if (action === "clear") {
        tokenSaver.clear();
        routineContinuation = "none";
        syncTokenSaverToolAvailability(true);
        ctx.ui.notify("Token Saver session cache, deferred-tool state, and savings counters cleared. The on/off setting was not changed.", "info");
        return;
      }
      if (action && action !== "on" && action !== "off") {
        ctx.ui.notify("Usage: /token-saver [on|off|status|stats|clear]. With no argument, the command toggles the current profile setting.", "warning");
        return;
      }

      const enabled = action === "on" ? true : action === "off" ? false : !configState.config.tokenSaverEnabled;
      if (enabled === configState.config.tokenSaverEnabled) {
        ctx.ui.notify(`Token Saver is already ${enabled ? "ON" : "OFF"} for profile "${profileState.activeProfile.name}".`, "info");
        return;
      }
      const result = applyProfileMutation(profileStore.saveActiveConfig({ ...configState.config, tokenSaverEnabled: enabled }));
      if (result.ok === false) {
        ctx.ui.notify(result.error, "error");
        return;
      }
      tokenSaver.resetSession();
      routineContinuation = "none";
      ctx.ui.notify(
        enabled
          ? `Token Saver ON for profile "${profileState.activeProfile.name}". Large tool outputs will be compacted with bounded in-memory recovery while the recovery entry exists.`
          : `Token Saver OFF for profile "${profileState.activeProfile.name}". Tool outputs will pass through unchanged.`,
        "info",
      );
    },
  });

  pi.registerCommand("skill-config", {
    description: "Show the Skill Orchestrator profile configuration paths",
    handler: async (_args, ctx) => ctx.ui.notify(
      `Manager: ${GLOBAL_CONFIG_PATH}\nActive profile: ${path.join(PROFILES_DIR, `${profileState.activeProfile.id}.json`)}`,
      "info",
    ),
  });
}
