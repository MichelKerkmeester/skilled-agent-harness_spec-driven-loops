# Changelog digest: cli-external-orchestration

Skill path: `.opencode/skills/cli-external-orchestration/`. Versions covered: v1.0.0.0 through v1.4.5.0 (all 10 entries in the changelog directory, oldest to newest). Dates: only the later entries carry explicit dates in their prose, spanning 2026-08-14 (v1.4.0.0 roster verification) to 2026-08-27 (v1.4.5.0 Cline route verification). Entries v1.0.0.0 through v1.3.0.0 carry no dates.

---

## Per version, newest first

### v1.4.5.0 (`v1.4.5.0.md`)

Turned the cli-pi and cli-opencode model rosters into closed rosters. Both skills now say outright that any model not in the roster is forbidden to dispatch, via a callout in section 2 of each `references/providers-and-models.md` plus a one-line rule at each `SKILL.md` front door. The two modes are not equal in how the rule is backed. cli-pi is genuinely enforced, because the deep-loop fan-out rejects off-roster ids through `isPiModelAllowed` over `PI_SUPPORTED_MODELS` in `executor-config.ts` and its mirror in `fanout-run.cjs`, though the `pi` binary itself is a passthrough with no allowlist so direct invocations rely on discipline. cli-opencode has no code-enforced allowlist at all, so its closed roster is a discipline rule only. The entry also documents that GLM-5.3-Flash is not reachable through cli-opencode's Cline route, because opencode's `cline-pass` adapter errors on every id form and lists only `glm-5.3` without the flash suffix, verified 2026-08-27. No models were added or removed here.

### v1.4.4.0 (`v1.4.4.0.md`)

REMOVED Ox Alpha from cli-opencode and cli-pi, retiring both the OpenRouter stealth route `stealth/ox-alpha` and the Cline route `x-ai/ox-alpha`, with Z.AI GLM-5.3-Flash routed in its place on every surface. BREAKING for anyone naming an Ox Alpha id, since the two literals were dropped from `PI_SUPPORTED_MODELS` and `PI_ALLOWED_MODELS`. The CLI OpenRouter allowlist was reduced to exactly three models: `deepseek/deepseek-v4-flash-latest`, `z-ai/glm-5.3-flash`, and `google/gemini-3.7-flash`. GLM-5.3-Flash was also registered on opencode-go and on the Cline provider, and `isFlashMaxPinnedModel` was extended to match it. BREAKING change of default: `.pi/settings.json` repointed `defaultModel` to `z-ai/glm-5.3-flash` and swapped the `enabledModels` ids. Gemini 3.7 Flash dispatches at its top tier of high and is intentionally not caught by the flash max pin, because it has no max tier. Guard tests reported 203 passed and 0 failed.

### v1.4.3.0 (`v1.4.3.0.md`)

Changed a dispatch default: DeepSeek V4 Flash is now pinned to its max thinking tier across the external CLI fan-out and is never dispatched below max. The fan-out command builders force the pin even when a lineage names a lower effort or none, emitting `--thinking max` on cli-pi and `--variant max` on cli-opencode, with a new `isFlashMaxPinnedModel` predicate as the single source of truth. The devin `deepseek-v4-flash-max` uid is deliberately excluded because it already bakes the tier into the id. The entry also corrected catalogs that had wrongly described Flash as a non-reasoning model whose `--variant` flag was ignored. Raw `pi` and `opencode` binary calls outside the fan-out are unaffected, because the pin lives in the fan-out builders.

### v1.4.2.0 (`v1.4.2.0.md`)

REMOVED `shared/references/smart-routing.md` and moved the hub's second-stage surface router to a first-class root `ROUTER.md`, per the two-state root-router document standard. The moved path matters for anything that referenced the old file, and `hub-router.json` `routerPolicy.defaultResource` was repointed from the legacy path to `ROUTER.md`, with `mode-registry.json` left in the fallback list. The machine-readable `INTENT_SIGNALS` and `RESOURCE_MAP` block was carried over byte-identical. The empty `shared/` tree was deleted afterward. SKILL.md, README.md, and description.json were all aligned to version 1.4.2.0. Routing behavior itself was explicitly unchanged, including the same tieBreak order and the same default mode.

### v1.4.1.0 (`v1.4.1.0.md`)

Added Gemini 3.7 Flash High to the enforced rosters of cli-cursor and cli-devin, confirmed present in live CLI listings and dispatch-tested end to end on 2026-08-15. cli-cursor gained `gemini-3.7-flash-high` as its first Gemini id, growing from 20 to 21 ids, and cli-devin gained `gemini-3-7-flash-high`, taking its curated scope from five families to six. The cli-devin routing description in `shared/references/smart-routing.md` was updated to name Gemini. A roster-count honesty sweep corrected the stale counts in the touched docs and rewrote the blanket out-of-scope wording so the docs no longer contradict the newly in-scope Gemini id. New ids landed in both the `executor-config.ts` arrays and their `fanout-run.cjs` mirrors together.

### v1.4.0.0 (`v1.4.0.0.md`)

Expanded three mode rosters with live-verified additions confirmed in CLI listings on 2026-08-14. cli-cursor gained `gpt-5.6-luna-max` and `gpt-5.6-luna-max-fast`, its first GPT-5.6 persona, moving from 18 to 20 ids. cli-devin gained four ids across the DeepSeek and GPT-5.6 families, growing from four curated families to five. cli-opencode documented `opencode-go/glm-5.3` as documentation only, because cli-opencode has no code-enforced allowlist. The routing description in `shared/references/smart-routing.md` was updated, and a roster-count honesty sweep fixed stale counts including two pre-existing wrong claims of 10 left over from before the Cursor roster reached 18.

### v1.3.0.0 (`v1.3.0.0.md`)

Documentation-only release. The skill README was rewritten purpose-first on the refined standalone template, opening with a one-line pitch and a problem-first overview, carrying six mode pointers in a roster table and keeping routing facts in a how-it-works section. Frontmatter moved from 1.2.0.0 to 1.3.0.0. Routing behavior, the six mode packets, and their dispatch contracts were untouched, and no SKILL.md content moved. Notable as the first entry that describes the hub as carrying six modes.

### v1.2.0.0 (`v1.2.0.0.md`)

Restored `cli-codex` as a third nested workflow mode alongside cli-opencode and cli-claude-code, reversing an earlier deprecation. It was registered in `mode-registry.json` and `hub-router.json` at field parity with the existing modes so the advisor and the executor-delegation scorer route it through the single hub identity. The mode is availability-gated and fails closed, checking `command -v codex` before advertising or dispatching and refusing the route when the binary is absent. Execution delegates to the audited deep-loop runtime `codex exec` on Codex CLI 0.144.1 rather than a second adapter. The fail-closed gate was proven against the real runtime with `codex` shadowed out of PATH.

### v1.1.0.0 (`v1.1.0.0.md`)

RENAME of the parent hub directory and the public advisor identity from `cli-external` to `cli-external-orchestration`. Hub metadata, advisor integration, hooks, commands, tests, and live documentation were all repointed to the new identity. The nested `cli-opencode` and `cli-claude-code` packet names and behavior were left unchanged. Verified by an advisor routing projection drift check reporting fresh, a passing prompt quality-card synchronization guard, and direct executor delegation still resolving cli-opencode as the top recommendation.

### v1.0.0.0 (`v1.0.0.0.md`)

Created the parent hub, then named `cli-external`, as one advisor identity routing to two workflow modes, cli-opencode and cli-claude-code, through `mode-registry.json` and `hub-router.json`. RENAME and moved path: both skills were relocated with `git mv` from top-level `cli-opencode/*` and `cli-claude-code/*` into `cli-external/cli-opencode/*` and `cli-external/cli-claude-code/*`. BREAKING for advisor consumers, because both children's independent `graph-metadata.json` identities were dissolved into one hub identity with `skill_id: cli-external` and `family: cli`, folding the union of their edges, domains, and intent signals. No command was created for the hub or either mode, so both stay advisor-routed and cross-skill-referenced only. `executor-delegation.ts` was rewritten to source its executor alias table from the hub's `mode-registry.json` `packetSkillName` values instead of the top-level family projection filter, so delegation prompts never resolve to the non-executor hub identity. The fail-open PreToolUse dispatch-preflight hook, the CLI-dispatch skill-preload path template, the reciprocal sk-prompt advisor edge, and other live referrers were repointed at the nested layout.

---

## Facts the v4 draft gets wrong or misses

- Draft line 176 overstates roster enforcement. It says every CLI kind carries an enforced model allowlist so an off-roster id fails at dispatch. `v1.4.5.0.md` states the opposite for cli-opencode, which has no code-enforced allowlist, where `--model provider/id` is free-form and the fan-out does not gate opencode ids, making its closed roster a discipline rule rather than a runtime gate. The same entry notes cli-pi is enforced only in the fan-out, because the `pi` binary is a passthrough with no allowlist. `v1.4.0.0.md` says the same about cli-opencode independently.
- The draft never mentions the hub rename. `v1.1.0.0.md` records the hub directory and public advisor identity changing from `cli-external` to `cli-external-orchestration`. The draft uses only the new name (line 201) and gives a reader with a v3-era reference no way to know the old identity is gone.
- The draft never mentions the router file move. `v1.4.2.0.md` records `shared/references/smart-routing.md` being deleted, replaced by a root `ROUTER.md`, with `hub-router.json` `routerPolicy.defaultResource` repointed and the whole `shared/` tree removed. Anything referencing the old path breaks, and this is not in the draft's removed-surfaces section (line 227) or its migration list (line 445).
- The draft never mentions the Ox Alpha retirement. `v1.4.4.0.md` records both Ox Alpha routes being removed from cli-opencode and cli-pi and replaced by GLM-5.3-Flash, plus the `.pi/settings.json` `defaultModel` being repointed to `z-ai/glm-5.3-flash`. That is a changed default and a removed surface, and neither the retired-surfaces section (line 227) nor the changed-defaults list (line 446) carries it.
- Draft line 218 is incomplete on DeepSeek V4 Flash. It says Flash is on the roster through a flat-price gateway, but omits the operator policy in `v1.4.3.0.md` that Flash is pinned to max thinking and is never dispatched below max, with the fan-out forcing the tier even when a lineage names a lower effort. That is a changed dispatch default a reader would want.
- The draft misses the OpenRouter allowlist narrowing. `v1.4.4.0.md` fixes the CLI OpenRouter allowlist at exactly three models across both CLIs. The draft has no line stating this bound.
- Draft line 201's claim that the six CLI skills live under one hub is right at the end state but flattens the sequence. `v1.0.0.0.md` shows the hub created with two modes, `v1.2.0.0.md` adds cli-codex as the third, and only `v1.3.0.0.md` describes six. The draft's phrasing at line 197 that six separate skills became one hub is not what any single entry records.
- Draft line 207 says Codex and Devin are back and Cursor and Pi are new. `v1.2.0.0.md` confirms the cli-codex restoration and its fail-closed `command -v codex` gate. The Devin, Cursor, and Pi additions are not recorded in any of these 10 hub entries, so the draft's claim is unverified from this changelog and would need the per-mode changelogs to confirm.

---

## Current version and identity

The `SKILL.md` frontmatter declares `version: 1.4.2.0`. That is stale against the changelog directory, which carries three later entries, v1.4.3.0, v1.4.4.0, and v1.4.5.0. `description.json` also reads 1.4.2.0, and `mode-registry.json` reads 1.2.0.2 on its own separate version line.

The skill is a **hub** (a parent hub, in this repo's terms). Its root holds `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json`, and `ROUTER.md`, which is the hub-only metadata set. The six modes are nested directories beneath it: `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, and `cli-pi`. The frontmatter description confirms it, calling itself a parent hub for external CLI dispatch that routes to six workflow modes through `mode-registry.json` and holds no per-mode logic.
