---
title: "Iteration 2: Reconcile schema facts against shipped docs + verify live vault .claudian/ vs .claude/ state"
trigger_phrases: []
---
# Iteration 2: Reconcile schema facts against shipped docs + verify live vault .claudian/ vs .claude/ state

## Focus

Reconcile the iteration-1 schema facts (from the `YishenTu/claudian` repo at the installed version 2.2.4) against the four shipped reference docs and produce concrete, line-targeted doc-update recommendations. Also verify the operator's actual on-disk `.claudian/` vs `.claude/` vault state as live confirmation of the path-migration behavior.

## Actions Taken

1. Re-read the four shipped reference docs with line numbers: `references/plugins/claudian/{claudian,data-model,workflows,troubleshooting}.md`.
2. Probed the operator vault root (`~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Michel Kerkmeester/`) for `.claudian/` and `.claude/` at vault level — direct `ls` of every path the docs claim (`.claude/`, `.claude/mcp.json`, `.claude/settings.json`, `.claude/commands/`, `.claude/skills/`, `.claudian/sessions/`).
3. Parsed the live `vault/.claudian/claudian-settings.json` (227,365 bytes) and compared its top-level keys against the extracted `ClaudianSettings` schema.
4. Probed user level: `~/.claude/` (full listing), `~/.claude/mcp.json`, `~/.claude/settings.json` (parsed for permissions/plugins scope), `~/.claudian/`.
5. Mapped every doc-vs-source divergence to a specific line and drafted a per-line correction for each.

## Findings

1. **Live vault confirms the migration: `.claudian/` exists, `.claude/` does not exist at vault level.** The vault contains `.claudian/claudian-settings.json` and `.claudian/opencode/metadata/`, and NO `.claude/` folder at all — every checked vault-level `.claude/*` path (`mcp.json`, `settings.json`, `commands/`, `skills/`) returns ENOENT. This is direct on-disk confirmation that v2.2.4 uses `.claudian/` as the Claudian-owned state root; the legacy `.claude/claudian-settings.json` path is not present in this vault. `[SOURCE: bash: ls "<vault>/.claudian/" → claudian-settings.json + opencode/; ls "<vault>/.claude/" → No such file or directory]`

2. **Live `claudian-settings.json` matches the extracted schema exactly.** The on-disk file has 45 top-level keys, all matching the `ClaudianSettings` interface keys mapped in iteration 1 (from `chatViewPlacement` through `userName`). `providerConfigs` is seeded with all five providers (`claude`, `codex`, `grok`, `opencode`, `pi`); `settingsProvider=claude`, `permissionMode=yolo`, `model=haiku` — exactly the documented defaults. `[SOURCE: bash: python3 json parse of vault/.claudian/claudian-settings.json — top-level keys + providerConfigs keys + selected values]`

3. **Provider-scoped runtime metadata lives under `.claudian/<provider>/metadata/` — a path the docs never mention.** `.claudian/opencode/metadata/` contains `config.json` (493 B) and `system.md` (2,430 B). Claudian keeps per-provider metadata under its own `.claudian/` root, not under `.claude/`. `[SOURCE: bash: ls -laR vault/.claudian/ — opencode/metadata/{config.json,system.md}]`

4. **User-level `~/.claude/` remains Claude Code's native layout; there is no `~/.claudian/`.** The home `.claude/` holds the full Claude Code tree (`sessions/`, `plans/`, `plugins/`, `projects/`, `skills/`, `settings.json`, `history.jsonl`, …). `~/.claude/mcp.json` does NOT exist — consistent with the legacy-cleanup deletion applying at user scope too (or the file never being authored there). `~/.claudian/` does not exist at user level → Claudian's settings are vault-scoped, while Claude Code's native config stays user-scoped. `[SOURCE: bash: ls ~/.claude/ (full native tree); ls ~/.claude/mcp.json → ENOENT; ls ~/.claudian/ → ENOENT]`

5. **Live `~/.claude/settings.json` exhibits exactly the narrow write scope `CCSettingsStorage.save()` implements.** The file contains `permissions` (`allow: []`, `defaultMode: "auto"`) and `enabledPlugins` (3 entries: `gitkraken-hooks@gitkraken`, `swift-lsp@claude-plugins-official`, `warp@claude-code-warp`) alongside Claude Code's own keys (`env`, `hooks`, `model`, `statusLine`, `theme`, `tui`, …) — merge-with-preservation, set-only-`$schema`/`permissions`/`enabledPlugins`, confirmed live. Note the two independent permission axes: Claudian's own `permissionMode` (default `yolo`, stored in `.claudian/claudian-settings.json`) is distinct from Claude Code's `settings.json` `permissions.defaultMode` (live value `auto`). `[SOURCE: bash: python3 json parse of ~/.claude/settings.json — top-level keys, permissions.defaultMode=auto, enabledPlugins entries]`

6. **Line-targeted doc-update recommendations** (per shipped file; research-only, not applied):

   - **`data-model.md`**
     - L32 (storage-model table, "Claudian settings" row): replace `<vault>/.claude/claudian-settings.json (observed)` with `<vault>/.claudian/claudian-settings.json` as current; mark `.claude/claudian-settings.json` legacy. Drop the "VERIFY exact keys" — keys are now byte-verified (45-key schema).
     - L36 (table, "MCP servers" row): `.claude/mcp.json (observed)` is WRONG for v2.2.4 — Claudian deletes that file. Replace with an ACP-wiring note (see L110-125).
     - L42 (scope model): add `.claudian/` as the vault-level Claudian-owned root alongside the provider-native `.claude/`/`.codex/` etc.
     - L47 (core contract, "Claudian owns no proprietary storage"): needs a caveat — Claudian DOES own `.claudian/` (settings, sessions, provider metadata). Commands/skills/config survive uninstall, but `claudian-settings.json` is Claudian's own, not the provider CLI's.
     - L55-67 (§2 Slash commands): resolve the VERIFY — document the full frontmatter key set (`name`, `description`, `argument-hint`, `allowed-tools`, `model`, `disable-model-invocation`, `user-invocable`, `context`, `agent`, `hooks`), the `safeName` derivation (chars outside `[a-zA-Z0-9_/-]` → `-`), and the reversible internal ID encoding (`cmd-` prefix, dash→`-_`, slash→`--`).
     - L71-88 (§3 Skills): resolve the VERIFY — document `name`-must-equal-folder-name, lowercase-letters-digits-single-hyphens, ≤64 chars, no YAML reserved words (`true/false/null/yes/no/on/off`), description ≤1024 non-empty, non-empty body.
     - L95 (§4): update the Claudian settings path to `.claudian/` and drop the VERIFY on keys.
     - L110-125 (§5 MCP server configuration): REWRITE — state that Claudian v2.2.4 DELETES `.claude/mcp.json` (`LegacyMcpConfigCleanup.ts`; "Claude Code owns MCP configuration… no other Claudian code may read, write, inject, or migrate that path") and wires MCP via ACP session init. The "write an entry into `.claude/mcp.json`" recipe is wrong for this version.
     - L138 (§6 table): `.claude/sessions` → note sessions moved to `.claudian/sessions`.
   - **`workflows.md`**
     - L35 (backup discipline): remove or annotate `mcp.json` from the backup list — Claudian deletes it; backing it up and restoring it fights the plugin's cleanup.
     - L50 (§2): path → `.claudian/claudian-settings.json`.
     - L118-149 (§5 CONNECT AN MCP SERVER): REWRITE — do not author vault-level `.claude/mcp.json` (v2.2.4 deletes it). Correct route: configure MCP in the provider CLI's own user-level config (e.g. `claude mcp add` / `~/.claude.json`), since Claude Code owns MCP configuration and the session init passes `mcpServers: []`.
   - **`claudian.md`**
     - L36 (§1 overview): add the `.claudian/` (current) vs `.claude/claudian-settings.json` (legacy) path split to the identity/context table.
     - L65 (guardrails): relax "never invent an exact key as verified fact" — the key set is now byte-verified from the repo source at the installed version plus the live vault; replace with a pointer to the verified schema.
   - **`troubleshooting.md`**
     - L30 (symptom table, "MCP tool not available"): update cause — v2.2.4 deletes vault-level `.claude/mcp.json`; MCP is wired via ACP, so a vault-level mcp.json authored by hand will disappear.
     - L43 and L111 (diagnosis/recovery): clarify "provider's native MCP config" means the user-level, CLI-owned config — never vault-level `.claude/mcp.json` (deleted by Claudian).
     - L126 (checkpoint `mcp_declared_provider_native`): redefine against the ACP reality (declared in the CLI's user-level config, not a file Claudian will delete).

## Questions Answered

None new this iteration — all 5 key questions were answered in iteration 1. This iteration produced the reconciliation deliverable and live confirmation those answers required.

## Questions Remaining

None.

## Ruled Out

- Editing the shipped reference docs — out of scope by dispatch constraint (research-only); all corrections above are emitted as recommendations for the workflow's later edit phase.
- Re-deriving schemas from the repo — already done in iteration 1 (BLOCKED approach per strategy: don't re-read `main.js`-only or README-only).

## Dead Ends

- None this iteration.

## Edge Cases

- Contradictory evidence: RESOLVED with live evidence. The shipped docs claim Claudian writes `.claude/mcp.json` and stores settings at `.claude/claudian-settings.json`; the source code says the opposite. The live vault now settles it: `.claude/` does not exist at vault level while `.claudian/` exists with the settings file, and `~/.claude/mcp.json` is absent. Source + live disk agree; the docs are the stale side.

## Sources Consulted

- `references/plugins/claudian/data-model.md` (lines 19, 32, 36, 42, 47, 55-67, 71-88, 95, 110-125, 138)
- `references/plugins/claudian/workflows.md` (lines 35, 50, 118-149)
- `references/plugins/claudian/claudian.md` (lines 36, 65)
- `references/plugins/claudian/troubleshooting.md` (lines 30, 43, 111, 126)
- Live vault: `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Michel Kerkmeester/.claudian/` (ls -laR; claudian-settings.json parsed — 45 keys, 5 providers)
- Live user scope: `~/.claude/` (ls -la; settings.json parsed — permissions + enabledPlugins among native keys; mcp.json ENOENT; ~/.claudian/ ENOENT)
- Iteration 1 findings (iterations/iteration-001.md) for the source-derived facts being reconciled

## Assessment

- New information ratio: **0.75** (3 of 6 findings fully new: live on-disk vault evidence as a new evidence class, the `.claudian/<provider>/metadata/` path, and the line-targeted reconciliation plan; 3 partially new live confirmations of source-mapped facts. No +0.10 simplicity bonus — the confirmation used new external evidence, not pure synthesis.)
- Questions addressed: none remaining (all 5 resolved in iteration 1).
- Questions answered: 0 new; reconciliation of all 5 answers against the shipped docs completed.

## Reflection

- What worked and why: probing the operator's real vault was cheap and decisive — one `ls` pass proved the migration (`.claudian/` present, `.claude/` absent) more convincingly than any amount of source reading. Parsing the live `claudian-settings.json` gave an independent second source for the 45-key schema.
- What did not work and why: nothing failed. The only limitation is that `.claudian/sessions/` does not exist yet in this vault (no sessions have been persisted), so the sessions-migration claim stays source-backed rather than live-verified.
- What I would do differently: next phase should hand the six line-targeted corrections to the doc-edit workflow (outside this research loop) rather than spend a further iteration re-verifying them.

## Recommended Next Focus

The research question is exhausted: all key questions answered (iter 1), all answers reconciled to line-level doc corrections and live-confirmed (iter 2). Recommend the workflow proceed to the doc-update phase applying the six line-targeted recommendation groups, with special attention to the two REWRITEs (`data-model.md` §5 and `workflows.md` §5 — the mcp.json write-vs-delete inversion) and the `troubleshooting.md` MCP-related rows, since those are factual inversions, not just missing detail.
