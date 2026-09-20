---
title: "Claudian Reference Docs — Research-to-Edit Synthesis"
description: "Fresh-eyes synthesis turning the Claudian deep-research findings into a prioritized, evidence-cited doc-improvement plan for the shipped mcp-obsidian reference set. Read-only on shipped docs; this is the only authored artifact."
contextType: "research"
version: "0.1.0.0"
trigger_phrases: []
---

# Claudian Reference Docs — Research-to-Edit Synthesis

Fresh reviewer, no prior context. Inputs read in full:

- Research: `specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/002-claudian/research/research.md` (sources: cloned `YishenTu/claudian` v2.2.4 repo + compiled `main.js` v2.2.4, file:line citations throughout).
- Shipped docs (all read):
  - `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/claudian/claudian.md` (index)
  - `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/claudian/data-model.md`
  - `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/claudian/workflows.md`
  - `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/claudian/troubleshooting.md`
  - `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/plugins/claudian.md`

---

## Verdict

The shipped docs are broadly sound on plugin identity and the provider-native operating model, but they contain **two P0 factual errors about where Claudian stores state and what it does with `.claude/mcp.json`**. Most damaging: the docs instruct operators to *author/merge* `.claude/mcp.json` to add an MCP server, while the research shows Claudian **actively deletes** that exact file at storage init and its own AGENTS.md forbids reading, writing, injecting, or migrating it — so following the shipped MCP recipe produces a file Claudian removes. The docs also place `claudian-settings.json` under `.claude/` (which the research shows is the *legacy* path; the current path is `.claudian/`). Both errors are the docs' own load-bearing claims, not `VERIFY`-hedged uncertainty. Beyond corrections, the research resolves nearly every `VERIFY` flag the docs left open (settings schema, command/skill validation rules), which the shipped set can now promote from "verify against a live install" to documented fact.

**The mcp.json write-vs-delete error is CONFIRMED by the research** (concrete source, and the research explicitly names `data-model.md §5` / `workflows.md §5` as the docs to correct).

---

## Prioritized Edit Table

Rank: **P0** = factual/correctness error > **P1** = missing content the research now supplies > **P2** = polish.

| # | Pri | Target file | Section / anchor | Change | Research evidence |
| --- | --- | --- | --- | --- | --- |
| 1 | **P0** | `references/plugins/claudian/data-model.md` | §5 MCP SERVER CONFIGURATION (whole section + the `<vault>/.claude/mcp.json` code block) | Reverse the core claim. Claudian does **not** author `.claude/mcp.json`; it **deletes** it at storage init and forbids touching it. Remove the "add a server by writing its entry into `.claude/mcp.json`" instruction and the code example. State that for the Claude Code provider, MCP is wired at runtime (ACP session, `mcpServers: []` observed), not by a Claudian-authored on-disk file. Mark the positive "where MCP actually goes" as still-VERIFY (see VERIFY resolution below) rather than substituting a new confident file path. | research §2: `deleteLegacyMcpConfig()` removes `.claude/mcp.json` at storage init — `src/providers/claude/storage/LegacyMcpConfigCleanup.ts:3-8`; AGENTS.md "no other Claudian code may read, write, inject, or migrate that path" — `src/providers/claude/AGENTS.md:35`; MCP via ACP `mcpServers: []` — `src/providers/opencode/execution/OpencodeAcpSessionKernel.ts:288,303`. Research explicitly flags `data-model.md §5` as stale. |
| 2 | **P0** | `references/plugins/claudian/workflows.md` | §5 CONNECT AN MCP SERVER (whole recipe: Steps, Before/After `.claude/mcp.json` code blocks, `mcp_declared_provider_native` checkpoint) | Same reversal. The recipe currently tells operators to back up and merge into `<vault>/.claude/mcp.json` — a file Claudian deletes. Rewrite so it does not author that path; if MCP-adding for Claude Code has no supported on-disk recipe, say so plainly rather than shipping a destructive one. | research §2 (same sources as #1); research explicitly flags `workflows.md §5` as stale. |
| 3 | **P0** | `feature-catalog/plugins/claudian.md` | §2 HOW IT WORKS — the clause "provider-native MCP declarations (`.claude/mcp.json` for Claude Code)" | Delete or correct the `.claude/mcp.json` reference; it repeats the deleted-file error at the catalog level. | research §2 (same sources as #1). |
| 4 | **P0** | `references/plugins/claudian/data-model.md` | §1 OVERVIEW → Storage model table, two rows: "Claudian settings" (`<vault>/.claude/claudian-settings.json`) and "MCP servers" (`.claude/mcp.json`) | Fix both paths. Claudian settings current path is `<vault>/.claudian/claudian-settings.json`; `<vault>/.claude/claudian-settings.json` is the **legacy/migration** path. The "MCP servers" row's `.claude/mcp.json` is the deleted file — correct per #1. | research §1: current `<vault>/.claudian/claudian-settings.json`, legacy `<vault>/.claude/claudian-settings.json` — `src/core/bootstrap/storagePaths.ts:1-4`. research §2 for the MCP row. |
| 5 | **P0** | `references/plugins/claudian/data-model.md` | §4 PROVIDER (CLI) CONFIGURATION — item 1 ("Claudian persists these in `<vault>/.claude/claudian-settings.json`") | Change the path to `<vault>/.claudian/claudian-settings.json` (current), noting `.claude/claudian-settings.json` as the legacy location Claudian migrates from. Drop the "VERIFY exact keys" hedge — keys are now known (see #7). | research §1 — `storagePaths.ts:1-4` (path); §1 schema table for keys. |
| 6 | **P0** | `references/plugins/claudian/workflows.md` | §2 REGISTER A PROVIDER CLI — step 4 ("Claudian persists the choice in `<vault>/.claude/claudian-settings.json`") | Same path correction to `.claudian/claudian-settings.json` (current) with `.claude/…` as legacy. | research §1 — `storagePaths.ts:1-4`. |
| 7 | **P1** | `references/plugins/claudian/data-model.md` | New/expanded subsection under §1 or §4 for `.claudian/claudian-settings.json` | Add the full `ClaudianSettings` schema and defaults (the research captured all keys: `userName`, `permissionMode` default `'yolo'`, `model` default `'haiku'`, `providerConfigs`, `settingsProvider` default `'claude'`, keyboard nav defaults `{w,s,i}`, `chatViewPlacement`, collab keys, etc.). This is the largest missing-content gap and the docs currently only gesture at "the exact keys VERIFY". | research §1 full schema table — `ClaudianSettings` `src/core/types/settings.ts:127-201`; defaults `src/app/settings/defaultSettings.ts:7-68`. |
| 8 | **P1** | `references/plugins/claudian/data-model.md` | §6 THE OTHER `.claude/` ARTIFACTS — `.claude/projects/`, `.claude/sessions` row | Correct the sessions path lifecycle: `.claude/sessions` is **legacy**; current session state is `.claudian/sessions`, with `.inputs.json` / `.deleted.json` ledger suffixes. Docs currently present `.claude/sessions` as the live location. | research §7: `.claude/sessions` (legacy) → `.claudian/sessions` (current) — `src/core/bootstrap/storagePaths.ts:6-12`. |
| 9 | **P1** | `references/plugins/claudian/data-model.md` | §2 SLASH COMMANDS (currently marks filename→command mapping and frontmatter as VERIFY) | Promote from VERIFY to documented: file is `.claude/commands/<safeName>.md`, `safeName` = name with non-`[a-zA-Z0-9_/-]` → `-`; reversible command-ID encoding (`cmd-` prefix, dashes→`-_`, slashes→`--`); frontmatter keys `name`, `description`, `argument-hint`, `allowed-tools`, `model`, `disable-model-invocation`, `user-invocable`, `context: 'fork'`, `agent`, `hooks`; kebab-case canonical, camelCase back-compat. | research §4 — `src/providers/claude/storage/SlashCommandStorage.ts:5,59-62,75-89`; `src/utils/slashCommand.ts:59-152`. |
| 10 | **P1** | `references/plugins/claudian/data-model.md` + `workflows.md` | data-model §3 REUSABLE SKILLS; workflows §3 (skill authoring) — both mark frontmatter/folder contract as VERIFY | Promote to documented: `SKILL.md` frontmatter requires `name` (MUST equal the containing folder name) + `description`; name = lowercase letters/digits, single hyphens, ≤64 chars, not YAML-reserved; description ≤1024 non-empty; body non-empty. This turns the current "author to the CLI's real schema, VERIFY first" into an actionable rule. | research §5 — `src/providers/claude/storage/SkillStorage.ts:5,17-18`; `src/core/skills/AgentSkillCodec.ts:39-55`; `src/core/skills/validateAgentSkill.ts:4-52`. |
| 11 | **P1** | `references/plugins/claudian/data-model.md` | New note in §1 storage table (Provider CLI config row) or §4 | Document the **narrow write scope** of `.claude/settings.json`: Claudian merges only `$schema`, `permissions`, and `enabledPlugins`, preserving unknown Claude Code fields; plugin enablement is dual-written to `enabledPlugins` + `PluginManager`. Prevents readers assuming Claudian rewrites the whole settings file. | research §3 — `src/providers/claude/storage/CCSettingsStorage.ts:63-88`; permission shape `src/providers/claude/types/settings.ts:24-58`; `claude/AGENTS.md:36`. |
| 12 | **P2** | `references/plugins/claudian/data-model.md` | §4 provider table (Codex/OpenCode/Grok/Pi rows) | Add the per-provider Claudian-side default config bags now known: claude (`defaultModel='opus'`, `safeMode='acceptEdits'`, `enabled=true`), codex (`enabled=false`, `safeMode='workspace-write'`), grok/opencode/pi (`enabled=false`, plus opencode `OPENCODE_ENABLE_EXA=1`, pi `toolMode='all'`). Note these are Claudian's provider-settings defaults, not each CLI's own on-disk config. | research §6 — `src/providers/defaultProviderConfigs.ts:8-15`; `claude/settings.ts:22-34`; `codex/settings.ts:105-119`; `grok/settings.ts:34-45`; `opencode/settings.ts:38-47`; `pi/settings.ts:27-36`. |
| 13 | **P2** | `references/plugins/claudian/claudian.md` (index) + `feature-catalog/plugins/claudian.md` | Index §3 "Data contract" pointer; catalog §2 | Once §5/§4 are corrected, re-read these summaries for any lingering "MCP declaration lives on disk" implication and align wording. Low risk once #1–#6 land. | Consequential to #1–#6; no new source needed. |

---

## VERIFY-Flag Resolution

Each `VERIFY` the shipped docs left open, with the research answer or STILL-UNRESOLVED.

| Shipped VERIFY (location) | Resolution | Source |
| --- | --- | --- |
| data-model §1 table — Claudian settings "VERIFY exact keys" | RESOLVED — full `ClaudianSettings` schema + defaults captured; also correct the path to `.claudian/`. | research §1 — `settings.ts:127-201`, `defaultSettings.ts:7-68`, `storagePaths.ts:1-4` |
| data-model §1 table — MCP servers "VERIFY exact shape" | RESOLVED (moot) — premise is wrong: no such Claudian-authored file; `.claude/mcp.json` is deleted. | research §2 — `LegacyMcpConfigCleanup.ts:3-8`, `AGENTS.md:35` |
| data-model §2 — slash command filename→command + frontmatter "VERIFY" | RESOLVED — `safeName` rule, reversible `cmd-` ID encoding, full frontmatter key list. | research §4 — `SlashCommandStorage.ts:5,59-62,75-89`, `slashCommand.ts:59-152` |
| data-model §3 / workflows §3 — skill frontmatter + folder contract "VERIFY" | RESOLVED — `name`==folder, `name`+`description` required, validation rules. | research §5 — `SkillStorage.ts`, `AgentSkillCodec.ts:39-55`, `validateAgentSkill.ts:4-52` |
| data-model §4 / workflows §2 — claudian-settings.json "keys VERIFY" | RESOLVED — schema known (per §1); also a path correction, not just a key fill-in. | research §1 |
| data-model §4 table — Codex `config.toml` "VERIFY path" | STILL-UNRESOLVED — research covers Claudian's *provider-settings* defaults (§6) but not Codex's own on-disk `config.toml` path/schema. | research §6 gives Codex Claudian-side defaults only (`codex/settings.ts:105-119`); TOML file path not in research |
| data-model §4 table — OpenCode "other config native, VERIFY" | STILL-UNRESOLVED for the CLI-native on-disk layout; Claudian-side OpenCode defaults known. | research §6 — `opencode/settings.ts:38-47` (Claudian side only) |
| data-model §4 table — Grok "VERIFY against provider CLI docs" | STILL-UNRESOLVED for CLI-native config; Claudian-side Grok defaults known. | research §6 — `grok/settings.ts:34-45` (Claudian side only) |
| data-model §4 table — Pi "VERIFY against provider CLI docs" | STILL-UNRESOLVED for CLI-native config; Claudian-side Pi defaults known. | research §6 — `pi/settings.ts:27-36` (Claudian side only) |
| data-model §5 / workflows §5 — MCP JSON/TOML shape "VERIFY against CLI docs" | RESOLVED to a correction — do not author `.claude/mcp.json`. The correct *positive* MCP-add mechanism for the Claude Code provider on disk is NOT positively established by this research (ACP evidence is from the OpenCode kernel). Mark the replacement path as STILL-VERIFY, do not swap in a new confident path. | research §2 — delete confirmed; positive Claude-provider mechanism not pinned |
| index §1 — "exact on-disk config paths and file shapes … VERIFY" (blanket) | PARTIALLY RESOLVED — Claude Code settings/commands/skills/claudian-settings now documented; Codex TOML and Grok/Pi CLI-native layouts remain VERIFY. | research §1,§3,§4,§5 (resolved) vs §6 gaps (unresolved) |
| research §7 rec 5 / troubleshooting §10 — live `.claudian/` vs `.claude/` on-disk state | STILL-UNRESOLVED — requires an operator check against the live vault; not derivable from repo/`main.js`. | research §7 (flagged as pending operator step) |

---

## Do-NOT-Change (Confirmed Correct)

- **Plugin identity block** — `YishenTu/claudian`, manifest id `realclaudian`, folder `.obsidian/plugins/realclaudian/`, installed **v2.2.4**, `minAppVersion 1.13.0`, `isDesktopOnly: true`. CONFIRMED: research manifest == v2.2.4 (research §opening line). Index §1 and troubleshooting §4/§6 are correct.
- **The five providers** — claude, codex, grok, opencode, pi. CONFIRMED — research §6, `src/providers/defaultProviderConfigs.ts:8-15`. Docs list exactly these. Keep.
- **Skills = folder-per-skill `skills/<name>/SKILL.md`** and **commands = one file per command `commands/<name>.md`**. CONFIRMED — research §4, §5. The docs' base structure is right; edits #9/#10 *add* the validation detail, they do not overturn the structure.
- **The "MCP is provider-native, not a Claudian registry" principle** (index guardrail, catalog §4, troubleshooting). The general principle survives; only the specific `.claude/mcp.json`-is-the-file instantiation is wrong. Keep the principle, fix the file path.
- **Provider-CLI-prerequisite / provider-CLI-auth model** (troubleshooting §3/§5, index §1): "Claudian shells out to an installed, authenticated CLI; holds no key of its own." Not contradicted by research. Keep.
- **Desktop-only guardrail; the three-name confusion (`realclaudian` vs ClaudianIA vs Claudian Plus); store-discoverability issue #912.** Not addressed by the research, not contradicted. Keep as-is (these remain doc-sourced, not research-confirmed — do not upgrade their confidence on the strength of this research).

---

## CONFIRMED vs INFERRED

**CONFIRMED (research cites a concrete repo/`main.js` source):**

- Claudian deletes `.claude/mcp.json` at storage init and forbids touching it. `LegacyMcpConfigCleanup.ts:3-8`, `AGENTS.md:35`.
- Current settings path `.claudian/claudian-settings.json`; legacy `.claude/claudian-settings.json`. `storagePaths.ts:1-4`.
- Full `ClaudianSettings` schema + defaults. `settings.ts:127-201`, `defaultSettings.ts:7-68`.
- Sessions: `.claude/sessions` (legacy) → `.claudian/sessions` (current). `storagePaths.ts:6-12`.
- `.claude/settings.json` write scope = `$schema` + `permissions` + `enabledPlugins` only. `CCSettingsStorage.ts:63-88`.
- Slash-command `safeName` rule + reversible `cmd-` encoding + frontmatter keys. `SlashCommandStorage.ts`, `slashCommand.ts:59-152`.
- Skill `name`==folder + validation rules. `AgentSkillCodec.ts:39-55`, `validateAgentSkill.ts:4-52`.
- Five providers + Claudian-side default config bags. `defaultProviderConfigs.ts:8-15` and per-provider `settings.ts`.
- Installed version v2.2.4 (manifest == repo == compiled `main.js`).

**INFERRED (reviewer's logical consequence, no direct source — flag before acting):**

- *Following the shipped MCP recipe is actively harmful, not merely stale:* writing `.claude/mcp.json` per workflows §5 produces a file Claudian deletes at init, so the server never loads. This is a strong inference from the CONFIRMED delete behavior, but the research did not test the end-to-end operator flow.
- *The correct positive place to declare MCP for the Claude Code provider in Claudian.* The research's `mcpServers: []` / ACP evidence is from the **OpenCode** provider kernel (`OpencodeAcpSessionKernel.ts`), so it does not directly establish the Claude-provider MCP-add path. Treat "here is where MCP actually goes for Claude Code" as UNRESOLVED — correct the wrong path first; do not replace it with a second unverified confident claim.
- *User-level `~/.claude/` scope behavior* (docs describe user-level vs vault-level). The research evidence is vault-level (`.claudian/`, `.claude/`); it neither confirms nor denies the user-level scope model. Leave the docs' scope model in place but do not upgrade its confidence on this research.
