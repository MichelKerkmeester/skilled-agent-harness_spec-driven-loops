---
title: "Iteration 1: Map real claudian-settings.json / mcp.json / commands / skills schemas from source and compiled plugin"
trigger_phrases: []
---
# Iteration 1: Map real claudian-settings.json / mcp.json / commands / skills schemas from source and compiled plugin

## Focus

Resolve the VERIFY-flagged unknowns in `references/plugins/claudian/` by reading (a) the four existing reference docs, (b) the cloned `YishenTu/claudian` repository source (TypeScript, manifest `2.2.4`), and (c) the installed compiled `main.js` v2.2.4 in the operator's vault. Goal: produce byte-level schemas for `claudian-settings.json`, `mcp.json` wiring, provider config, and commands/skills files, and surface the gotchas the current docs miss.

## Actions Taken

1. Read all four existing reference docs: `claudian.md`, `data-model.md`, `workflows.md`, `troubleshooting.md`.
2. Located the installed plugin at `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Michel Kerkmeester/.obsidian/plugins/realclaudian/` (manifest `id=realclaudian`, `version=2.2.4`, `isDesktopOnly=true`, `minAppVersion=1.13.0` — all confirmed consistent with the shipped docs).
3. Cloned `https://github.com/YishenTu/claudian` (depth 1) — repo `manifest.json` is also `2.2.4`, so repo HEAD == installed version.
4. Confirmed via grep against compiled `main.js` (5,083,703 bytes) that the new/legacy path strings exist in the installed binary, not just the repo: `.claudian/`, `.claude/mcp.json`, `.claude/claudian-settings.json`.
5. Read the authoritative schema + storage sources: `src/core/types/settings.ts`, `src/app/settings/defaultSettings.ts`, `src/core/bootstrap/storagePaths.ts`, `src/providers/claude/storage/{SkillStorage,SlashCommandStorage,CCSettingsStorage,LegacyMcpConfigCleanup}.ts`, `src/core/skills/{AgentSkillCodec,validateAgentSkill}.ts`, `src/utils/slashCommand.ts`, `src/providers/{claude,codex,grok,opencode,pi}/settings.ts`, `src/providers/claude/types/settings.ts`, `src/providers/claude/AGENTS.md`.

## Findings

1. **Claudian settings path migrated to `.claudian/`.** The current path is `<vault>/.claudian/claudian-settings.json`; `<vault>/.claude/claudian-settings.json` is the LEGACY path. The reference docs only document the legacy `.claude/claudian-settings.json` path. `[SOURCE: claudian-repo/src/core/bootstrap/storagePaths.ts:1-4]` Confirmed in installed binary: `main.js` contains both `.claudian/` and `.claude/claudian-settings.json`. `[SOURCE: main.js grep: .claudian/ present; .claude/claudian-settings.json present]`

2. **Complete `claudian-settings.json` schema (all keys + types + defaults).** The `ClaudianSettings` interface lists every key; `DEFAULT_CLAUDIAN_SETTINGS` gives defaults. See the full field inventory below. `[SOURCE: claudian-repo/src/core/types/settings.ts:127-201]` `[SOURCE: claudian-repo/src/app/settings/defaultSettings.ts:7-68]`
   - Identity/security: `userName` (''), `permissionMode` (`'yolo'` | `'plan'` | `'normal'`, default `yolo`).
   - Model/thinking: `model` ('haiku'), `thinkingBudget` ('off'), `effortLevel` (DEFAULT_REASONING_VALUE), `serviceTier` ('default'), `enableAutoTitleGeneration` (true), `titleGenerationLocale` (''), `titleGenerationModel` ('').
   - Content: `excludedTags` ([]), `mediaFolder` (''), `systemPrompt` (''), `persistentExternalContextPaths` ([]).
   - Environment: `sharedEnvironmentVariables` (''), `envSnippets` ([]), `customContextLimits` ({}), `customModelAliases` ({}).
   - UI: `keyboardNavigation` ({scrollUpKey:'w', scrollDownKey:'s', focusInputKey:'i'}), `requireCommandOrControlEnterToSend` (false).
   - i18n: `locale` ('en').
   - Provider-owned: `providerConfigs` (a `ProviderConfigMap` — opaque per-provider bags keyed by provider id), `settingsProvider` ('claude'), `lastSelectedChatModel` (null), `savedProviderModel/Effort/ServiceTier/ThinkingBudget/PermissionMode` (each `Partial<Record<string,string>>`), `pendingProviderSessionInvalidations` ({}).
   - State: `lastCustomModel` ('').
   - UI prefs: `maxWarmAgentProcesses` (5), `enableAutoScroll` (true), `deferMathRenderingDuringStreaming` (true), `expandFileEditsByDefault` (false), `chatViewPlacement` ('right-sidebar' | 'left-sidebar' | 'main-tab'), `enableDualPane` (true), `dualPaneSide` ('right'), `restoreTabsOnStartup` (true), `collabEnabled` (false), `collabProjectsFolder` (default collab folder), `collabGitPath` (''), `sessionManagerOrganization` ('list' | 'linked-content'), `sessionManagerSort` ('last-updated' | 'created'), `pinnedLinkedContentPaths` ([]).
   - Commands: `hiddenProviderCommands` (a `Record<string,string[]>`).
   - The interface also allows `[key: string]: unknown` extension fields.

3. **Claudian does NOT write `mcp.json` — it deletes it as legacy cleanup.** `deleteLegacyMcpConfig()` unconditionally deletes `.claude/mcp.json`. `[SOURCE: claudian-repo/src/providers/claude/storage/LegacyMcpConfigCleanup.ts:3-8]` The Claude provider's AGENTS.md is explicit: "Claude Code owns MCP configuration… the composition root invokes the Claude-owned legacy cleanup to delete `.claude/mcp.json`; no other Claudian code may read, write, inject, or migrate that path." `[SOURCE: claudian-repo/src/providers/claude/AGENTS.md:35]` MCP is now wired via the ACP (Agent Client Protocol) session, with `mcpServers: []` passed into session init. `[SOURCE: claudian-repo/src/providers/opencode/execution/OpencodeAcpSessionKernel.ts:288,303]` `[SOURCE: claudian-repo/src/providers/grok/execution/GrokExecutionSession.ts:633,658]` **This directly contradicts the shipped docs**, which state Claudian writes MCP entries into `.claude/mcp.json`.

4. **Claudian writes `.claude/settings.json` but ONLY for permissions and plugin enablement.** `CCSettingsStorage.save()` merges into existing `.claude/settings.json`, preserving unknown CC fields, and sets only `$schema`, `permissions`, and `enabledPlugins`. `[SOURCE: claudian-repo/src/providers/claude/storage/CCSettingsStorage.ts:12-88]` `$schema` = `https://json.schemastore.org/claude-code-settings.json`. `CCPermissions` = `{ allow?, deny?, ask?, defaultMode?, additionalDirectories? }` where each of allow/deny/ask is `PermissionRule[]` (strings like `"Bash(git *)"`, `"Read(*.md)"`) and `defaultMode` is `'acceptEdits' | 'auto' | 'bypassPermissions' | 'default' | 'dontAsk' | 'plan'`. `[SOURCE: claudian-repo/src/providers/claude/types/settings.ts:24-58]` Plugin enablement is dual-written to `.claude/settings.json` `enabledPlugins` and `PluginManager.plugins[].enabled`. `[SOURCE: claudian-repo/src/providers/claude/AGENTS.md:36]`

5. **Slash command file schema and reversible ID encoding.** Commands live one-per-file at `.claude/commands/<safeName>.md`; `safeName` is the command name with any char outside `[a-zA-Z0-9_/-]` replaced by `-`. `[SOURCE: claudian-repo/src/providers/claude/storage/SlashCommandStorage.ts:5,59-62]` The internal ID is a reversible encoding of the relative path: dashes → `-_`, slashes → `--`, prefixed `cmd-` (e.g. `a/b.md` → `cmd-a--b`). `[SOURCE: claudian-repo/src/providers/claude/storage/SlashCommandStorage.ts:75-89]` Frontmatter keys written/read: `name`, `description`, `argument-hint`, `allowed-tools` (list), `model`, `disable-model-invocation` (bool), `user-invocable` (bool), `context` (`'fork'`), `agent`, `hooks` (JSON). Kebab-case is the file format; camelCase aliases are accepted for back-compat. `[SOURCE: claudian-repo/src/utils/slashCommand.ts:59-152]`

6. **Skill file schema.** Skills live at `.claude/skills/<name>/SKILL.md`. `[SOURCE: claudian-repo/src/providers/claude/storage/SkillStorage.ts:5,17-18]` `SKILL.md` MUST start with YAML frontmatter containing a string `name` and string `description`, and `name` MUST equal the containing folder name. `[SOURCE: claudian-repo/src/core/skills/AgentSkillCodec.ts:39-55]` Name validation: lowercase letters/digits separated by single hyphens, ≤64 chars, not a YAML reserved word (`true/false/null/yes/no/on/off`). Description ≤1024 chars, non-empty. Instructions (body after frontmatter) must be non-empty. `[SOURCE: claudian-repo/src/core/skills/validateAgentSkill.ts:4-52]`

7. **Provider configs: five providers, opaque per-provider bags.** Providers = `claude` (default `settingsProvider`), `codex`, `grok`, `opencode`, `pi`. Each provider's defaults are seeded into `providerConfigs` at first save. `[SOURCE: claudian-repo/src/providers/defaultProviderConfigs.ts:8-15]` Provider defaults differ per provider and are NOT interchangeable (the docs already warn this):
   - Claude: `enabled=true`, `safeMode='acceptEdits'`, `cliPath=''`, `cliPathsByHost={}`, `loadUserSettings=true`, `enableChrome=false`, `enableBangBash=false`, `customModels=''`, `defaultModel='opus'`, `lastModel='haiku'`, `modelEnvironmentType=''`, `titleModelEnvironmentType=''`, `environmentVariables=''`, `environmentHash=''`. `[SOURCE: claudian-repo/src/providers/claude/settings.ts:22-34]`
   - Codex: `enabled=false`, `safeMode='workspace-write'`, `reasoningSummary='detailed'`, `enableUltraEffort=false`, plus model-catalog and WSL/host-scoped fields. `[SOURCE: claudian-repo/src/providers/codex/settings.ts:105-119]`
   - Grok: `enabled=false`, `planBasePermissionMode='normal'`, plus host-scoped `catalogsByHost`. `[SOURCE: claudian-repo/src/providers/grok/settings.ts:34-45]`
   - OpenCode: `enabled=false`, `environmentVariables='OPENCODE_ENABLE_EXA=1'`, `selectedMode=''`, `visibleModels=[]`. `[SOURCE: claudian-repo/src/providers/opencode/settings.ts:38-47]`
   - Pi: `enabled=false`, `toolMode='all'`, `visibleModels=[]`. `[SOURCE: claudian-repo/src/providers/pi/settings.ts:27-36]`

8. **Storage-path migration gotcha (v2.2.4).** Sessions also moved: `.claude/sessions` (legacy) → `.claudian/sessions` (current), with `.inputs.json` and `.deleted.json` ledger suffixes. `[SOURCE: claudian-repo/src/core/bootstrap/storagePaths.ts:6-12]` An AI operating at the file layer must prefer `.claudian/` for Claudian-owned state and treat `.claude/*` as Claude Code's own (native) layout, not Claudian's.

## Ruled Out

- Reading only the compiled `main.js` (5 MB, minified) as the sole source — the unminified TypeScript repo at the same version is the cleaner, equally-authoritative source; `main.js` grep was used to confirm the same strings are present in the shipped binary, not to extract schemas.
- Treating the repo README as a schema source — it documents the auto-detect-first provider flow but not the on-disk JSON shapes; schemas had to come from `src/`.

## Dead Ends

- None. The repo source (TypeScript, manifest 2.2.4 == installed) resolved every VERIFY-flagged unknown directly. No approach was exhausted this iteration.

## Edge Cases

- Ambiguous input: none — the focus (map schemas vs VERIFY unknowns) was unambiguous.
- Contradictory evidence: **significant** — the shipped `data-model.md`/`workflows.md` claim Claudian writes MCP entries into `.claude/mcp.json`, but `LegacyMcpConfigCleanup.ts` + `claude/AGENTS.md:35` show v2.2.4 DELETES that file and wires MCP via ACP sessions. Both claims are cited; the source code is the better-supported side (byte-level, same version). Marked unresolved in docs (docs are stale), resolved in source.
- Missing dependencies: none — repo cloned cleanly, installed plugin located.
- Partial success: none — full coverage achieved.

## Sources Consulted

- `claudian-repo/src/core/types/settings.ts:120-201` (ClaudianSettings schema)
- `claudian-repo/src/app/settings/defaultSettings.ts:7-68` (defaults)
- `claudian-repo/src/core/bootstrap/storagePaths.ts:1-12` (path migration)
- `claudian-repo/src/providers/claude/storage/LegacyMcpConfigCleanup.ts:1-9` (mcp.json deletion)
- `claudian-repo/src/providers/claude/AGENTS.md:34-39` (MCP ownership + settings merge scope)
- `claudian-repo/src/providers/claude/storage/CCSettingsStorage.ts:12-88` (.claude/settings.json merge)
- `claudian-repo/src/providers/claude/types/settings.ts:24-78` (CCPermissions/CCSettings)
- `claudian-repo/src/providers/claude/storage/SlashCommandStorage.ts:5-95` (command paths + ID encoding)
- `claudian-repo/src/providers/claude/storage/SkillStorage.ts:5-60` (skill paths)
- `claudian-repo/src/core/skills/AgentSkillCodec.ts:39-109` (SKILL.md frontmatter)
- `claudian-repo/src/core/skills/validateAgentSkill.ts:4-52` (skill validation)
- `claudian-repo/src/utils/slashCommand.ts:59-152` (command serialize/parse)
- `claudian-repo/src/providers/defaultProviderConfigs.ts:8-15` (provider list)
- `claudian-repo/src/providers/{claude,codex,grok,opencode,pi}/settings.ts` (per-provider defaults)
- Installed `main.js` v2.2.4 (grep: `.claudian/`, `.claude/mcp.json`, `.claude/claudian-settings.json` present)
- Installed `manifest.json` (id `realclaudian`, v2.2.4, `isDesktopOnly:true`)

## Assessment

- New information ratio: **0.81** (5 fully-new findings + 3 partially-new; no +0.10 simplicity bonus because the contradiction was resolved with external source evidence, not pure synthesis)
- Questions addressed: all 5 remaining key questions.
- Questions answered: 5/5 (complete schema of claudian-settings.json; mcp.json management; provider configs; commands/skills schemas; gotchas/undocumented behaviors).

## Reflection

- What worked and why: cloning the repo at the exact installed version (2.2.4) and reading the unminified TypeScript storage/types modules gave byte-level, citable schemas; cross-checking `main.js` via grep proved the same strings exist in the shipped binary. The source-first approach resolved every VERIFY flag in one pass.
- What did not work and why: nothing failed; the repo README was confirmed to be non-authoritative for on-disk JSON shapes (as the docs suspected), which is why schema extraction was routed to `src/`.
- What I would do differently: next iteration should reconcile the contradiction between the shipped docs and source (specifically the `mcp.json` write-vs-delete inversion) into concrete doc-edit recommendations, and verify the `.claudian/` vs `.claude/` migration behavior in the live vault's actual on-disk files.

## Recommended Next Focus

Reconcile the discovered schema facts against the four shipped reference docs and produce concrete, line-targeted doc updates: (1) correct `data-model.md` §5 and `workflows.md` §5 to state Claudian deletes `.claude/mcp.json` and wires MCP via ACP, not by writing that file; (2) add the full `claudian-settings.json` schema + defaults and the `.claudian/` (current) vs `.claude/claudian-settings.json` (legacy) path split; (3) document the command ID reversible encoding and skill `name`-must-match-folder + lowercase-hyphen validation; (4) record the narrow `.claude/settings.json` write scope (permissions + plugin enablement only). Also verify the operator vault's actual on-disk `.claudian/` vs `.claude/` state as a live confirmation.
