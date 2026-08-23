---
title: "Claudian Reference Docs — Research Synthesis"
description: "Progressive synthesis of findings for the Claudian (realclaudian) file-layer reference docs optimization."
contextType: "research"
version: "0.1.0.0"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/002-claudian"
    last_updated_at: "2026-08-22T09:30:00Z"
    last_updated_by: "claude"
    recent_action: "Synthesized Claudian research findings"
    next_safe_action: "Apply recs in a later phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-006-002-claudian"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Claudian Reference Docs — Research Synthesis

Progressive synthesis (iteration 1). Sources: cloned `YishenTu/claudian` repo (TypeScript, manifest `2.2.4` == installed version) and the installed compiled `main.js` v2.2.4.

## Resolved Schema Facts

### 1. Claudian settings file — `.claudian/claudian-settings.json` (NOT `.claude/`)

- **Current path**: `<vault>/.claudian/claudian-settings.json`
- **Legacy path**: `<vault>/.claude/claudian-settings.json` (migration seam)
- Source: `src/core/bootstrap/storagePaths.ts:1-4`

Full schema (`ClaudianSettings`, `src/core/types/settings.ts:127-201`) with defaults (`src/app/settings/defaultSettings.ts:7-68`):

| Key | Type | Default |
| --- | --- | --- |
| `userName` | string | `''` |
| `permissionMode` | `'yolo' \| 'plan' \| 'normal'` | `'yolo'` |
| `model` | string | `'haiku'` |
| `thinkingBudget` | string | `'off'` |
| `effortLevel` | string | DEFAULT_REASONING_VALUE |
| `serviceTier` | string | `'default'` |
| `enableAutoTitleGeneration` | boolean | `true` |
| `titleGenerationLocale` | string | `''` |
| `titleGenerationModel` | string | `''` |
| `excludedTags` | string[] | `[]` |
| `mediaFolder` | string | `''` |
| `systemPrompt` | string | `''` |
| `persistentExternalContextPaths` | string[] | `[]` |
| `sharedEnvironmentVariables` | string | `''` |
| `envSnippets` | EnvSnippet[] | `[]` |
| `customContextLimits` | Record<string,number> | `{}` |
| `customModelAliases` | Record<string,string> | `{}` |
| `keyboardNavigation` | {scrollUpKey,scrollDownKey,focusInputKey} | `{w,s,i}` |
| `requireCommandOrControlEnterToSend` | boolean | `false` |
| `locale` | string | `'en'` |
| `providerConfigs` | ProviderConfigMap (per-provider opaque bags) | seeded defaults |
| `settingsProvider` | string (provider id) | `'claude'` |
| `lastSelectedChatModel` | {providerId,model} \| null | `null` |
| `savedProvider{Model,Effort,ServiceTier,ThinkingBudget,PermissionMode}` | Partial<Record<string,string>> | `{}` |
| `pendingProviderSessionInvalidations` | Partial<Record<string,number>> | `{}` |
| `lastCustomModel` | string | `''` |
| `maxWarmAgentProcesses` | number | `5` |
| `enableAutoScroll` / `deferMathRenderingDuringStreaming` | boolean | `true` |
| `expandFileEditsByDefault` | boolean | `false` |
| `chatViewPlacement` | `'right-sidebar'\|'left-sidebar'\|'main-tab'` | `'right-sidebar'` |
| `enableDualPane` / `restoreTabsOnStartup` | boolean | `true` |
| `dualPaneSide` | `'left'\|'right'` | `'right'` |
| `collabEnabled` | boolean | `false` |
| `collabProjectsFolder` / `collabGitPath` | string | default / `''` |
| `sessionManagerOrganization` / `sessionManagerSort` | enum | `'list'` / `'last-updated'` |
| `pinnedLinkedContentPaths` | string[] | `[]` |
| `hiddenProviderCommands` | Record<string,string[]> | defaults |

### 2. MCP wiring — Claudian DELETES `.claude/mcp.json`, does not write it

- `deleteLegacyMcpConfig()` removes `.claude/mcp.json` at storage init. Source: `src/providers/claude/storage/LegacyMcpConfigCleanup.ts:3-8`.
- AGENTS.md: "no other Claudian code may read, write, inject, or migrate that path." Source: `src/providers/claude/AGENTS.md:35`.
- MCP is wired via ACP sessions (`mcpServers: []`). Source: `src/providers/opencode/execution/OpencodeAcpSessionKernel.ts:288,303`.
- **The shipped `data-model.md` §5 / `workflows.md` §5 claim Claudian writes `.claude/mcp.json` — this is stale and must be corrected.**

### 3. `.claude/settings.json` — Claudian writes only permissions + plugin enablement

- `CCSettingsStorage.save()` merges into existing `.claude/settings.json`, preserving unknown CC fields, setting `$schema`, `permissions`, `enabledPlugins`. Source: `src/providers/claude/storage/CCSettingsStorage.ts:63-88`.
- `$schema` = `https://json.schemastore.org/claude-code-settings.json`.
- `permissions` = `{ allow?, deny?, ask?, defaultMode?, additionalDirectories? }`; allow/deny/ask are `PermissionRule[]` strings (`"Bash(git *)"`); `defaultMode` ∈ `{acceptEdits, auto, bypassPermissions, default, dontAsk, plan}`. Source: `src/providers/claude/types/settings.ts:24-58`.
- Plugin enablement dual-written to `.claude/settings.json` `enabledPlugins` + `PluginManager.plugins[].enabled`. Source: `claude/AGENTS.md:36`.

### 4. Slash commands — `.claude/commands/<safeName>.md`

- One file per command; `safeName` = name with non-`[a-zA-Z0-9_/-]` → `-`. Source: `src/providers/claude/storage/SlashCommandStorage.ts:5,59-62`.
- Reversible ID encoding: dashes → `-_`, slashes → `--`, prefixed `cmd-` (`a/b.md` → `cmd-a--b`). Source: `SlashCommandStorage.ts:75-89`.
- Frontmatter keys: `name`, `description`, `argument-hint`, `allowed-tools` (list), `model`, `disable-model-invocation` (bool), `user-invocable` (bool), `context` (`'fork'`), `agent`, `hooks` (JSON). Kebab-case is canonical; camelCase accepted for back-compat. Source: `src/utils/slashCommand.ts:59-152`.

### 5. Skills — `.claude/skills/<name>/SKILL.md`

- Folder-per-skill, `SKILL.md` inside. Source: `src/providers/claude/storage/SkillStorage.ts:5,17-18`.
- Frontmatter requires string `name` (MUST equal containing folder name) + string `description`. Source: `src/core/skills/AgentSkillCodec.ts:39-55`.
- Name validation: lowercase letters/digits separated by single hyphens, ≤64 chars, not YAML-reserved (`true/false/null/yes/no/on/off`); description ≤1024 non-empty; body non-empty. Source: `src/core/skills/validateAgentSkill.ts:4-52`.

### 6. Providers — five, opaque per-provider config bags

- `claude` (default), `codex`, `grok`, `opencode`, `pi`. Source: `src/providers/defaultProviderConfigs.ts:8-15`.
- Claude defaults: `enabled=true`, `safeMode='acceptEdits'`, `defaultModel='opus'`, `lastModel='haiku'`, `loadUserSettings=true`, `enableChrome=false`, `enableBangBash=false`. Source: `src/providers/claude/settings.ts:22-34`.
- Codex defaults: `enabled=false`, `safeMode='workspace-write'`, `reasoningSummary='detailed'`, `enableUltraEffort=false`. Source: `src/providers/codex/settings.ts:105-119`.
- Grok defaults: `enabled=false`, `planBasePermissionMode='normal'`. Source: `src/providers/grok/settings.ts:34-45`.
- OpenCode defaults: `enabled=false`, `environmentVariables='OPENCODE_ENABLE_EXA=1'`. Source: `src/providers/opencode/settings.ts:38-47`.
- Pi defaults: `enabled=false`, `toolMode='all'`. Source: `src/providers/pi/settings.ts:27-36`.

### 7. Storage migration gotchas (v2.2.4)

- Sessions: `.claude/sessions` (legacy) → `.claudian/sessions` (current), with `.inputs.json` / `.deleted.json` ledger suffixes. Source: `src/core/bootstrap/storagePaths.ts:6-12`.
- Operate on `.claudian/` for Claudian-owned state; treat `.claude/*` as Claude Code's native layout.

## Pending doc-update recommendations (iteration 2)

1. Correct `data-model.md` §5 and `workflows.md` §5: Claudian deletes `.claude/mcp.json` and wires MCP via ACP — not by writing that file.
2. Add the full `claudian-settings.json` schema + defaults and the `.claudian/` (current) vs `.claude/claudian-settings.json` (legacy) split to `data-model.md` §1/§4.
3. Document the command ID reversible encoding and skill `name`-must-match-folder + lowercase-hyphen validation.
4. Record the narrow `.claude/settings.json` write scope (permissions + plugin enablement only).
5. Verify the operator vault's live `.claudian/` vs `.claude/` on-disk state.
