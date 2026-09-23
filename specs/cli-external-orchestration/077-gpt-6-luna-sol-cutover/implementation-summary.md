---
title: "Implementation Summary: GPT-6 Luna and Sol cutover with LLM Gateway Luna routes and Opus 5.5 in cli-claude-code"
description: "Every living dispatch surface for Codex, OpenCode, Pi and Hermes now names gpt-6-luna and gpt-6-sol, Pi and Hermes both reach GPT-6 Luna through LLM Gateway, and cli-claude-code names claude-opus-5-5 as its one Opus id."
trigger_phrases:
  - "gpt-6 cutover summary"
  - "luna sol gpt-6 shipped"
  - "llmgateway gpt-6-luna verified"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/077-gpt-6-luna-sol-cutover"
    last_updated_at: "2026-09-23T10:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built and verified Phase 5, the Xiaomi provider removal"
    next_safe_action: "None in this packet; follow-ons are listed under Known Limitations"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".pi/models.json"
      - ".pi/settings.json"
      - ".pi/pi-blackhole-config.json"
      - ".skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md"
      - ".skilled/skills/cli-external-orchestration/cli-hermes/references/providers-and-models.md"
      - ".skilled/skills/cli-external-orchestration/cli-claude-code/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "077-gpt-6-luna-sol-cutover"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Opus scope: every Opus id in cli-claude-code becomes claude-opus-5-5"
      - "Reach: extend like 076 to the deep-loop enforcement, cli-hermes and the pi fast-mode extension"
      - "Workspace: work on main"
      - "CX-002 checks the skill default, gpt-5.5, as SKILL.md says; gpt-6-luna is the fan-out fallback"
      - "gpt-6-astra stays off the Codex, OpenCode and Pi rosters for now"
      - "Xiaomi removal: Phase 5 of this packet, covering docs, config and the fan-out runtime"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: GPT-6 Luna and Sol cutover with LLM Gateway Luna routes and Opus 5.5 in cli-claude-code

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 077-gpt-6-luna-sol-cutover |
| **Completed** | 2026-09-23. Phases 1 to 3 landed in `f2a90d7ac5`; a fresh review reopened the packet the same day, and Phase 4 corrected what it found. Reopened again the same day for Phase 5, which moved MiMo to LLM Gateway only |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A dispatch that trusts these skills now reaches OpenAI's GPT-6 Luna and Sol instead of the 5.6 pair. The enforcement lists that decide whether a Pi, Hermes or Codex fan-out dispatch resolves moved in the same pass as the documents that describe them, so no runtime accepts an id another refuses.

### GPT-6 Luna and Sol across the cli skills

`gpt-6-luna` and `gpt-6-sol` replace `gpt-5.6-luna` and `gpt-5.6-sol` in cli-codex, cli-opencode, cli-pi and cli-hermes, including the `-fast` and `-pro` suffixes and the `openai/` and `openai-codex/` prefixes. The ids come from three live catalogs, not from the "6.0" the request used: Codex's model cache, `opencode models openai` and LLM Gateway's `/v1/models` all name `gpt-6-luna` and `gpt-6-sol`. The Cursor and Devin "GPT-5.6 Luna Max" personas are separate catalog ids and did not move, and `gpt-5.6-terra` keeps its id because Terra has no GPT-6 counterpart.

### Luna through LLM Gateway on Pi and Hermes

Pi gains `llmgateway/gpt-6-luna` beside its existing DevPass routes. It is direct-dispatch only, because the fan-out's bare `gpt-6-luna` literal maps to the `openai-codex` subscription route and one literal maps to one provider. Pi's bundled catalog listed no GPT-6 Luna or Sol id, and `pi update --models` fixed that: the refreshed catalog carries `openai-codex/gpt-6-luna` and `gpt-6-sol`, so `.pi/models.json` holds only the gateway entry and `pi --list-models gpt-6` shows all three new routes. On the operator's direction, `llmgateway/gpt-6-luna` is now Pi's default model at the global `xhigh`, pi-blackhole compacts with `openai-codex/gpt-6-luna` at `medium`, and `.pi/models.json` drops its redundant `xiaomi` block, because Pi's catalog already carries both MiMo ids. Hermes already sent its Luna and Sol through `llmgateway`, so the roster rename puts `gpt-6-luna` and `gpt-6-sol` there, and the closed roster stays at seven ids.

### One Opus id in cli-claude-code

cli-claude-code held no "opus 5.0" string. With the operator's choice of every Opus id, `claude-opus-4-8` and `claude-opus-4-6` both became `claude-opus-5-5`, and the two roster tables that listed them as separate rows now carry a single Opus 5.5 row.

### Phase 4: review remediation

A fresh Opus review of the pushed commits found no P0, two P1 and five P2 doc defects, and each one was re-checked before any edit. cli-opencode no longer presents `-pro` slugs, which `opencode models openai` does not serve, and its missing-default fallback names `openai/gpt-6-sol --variant high`. In cli-codex, the playbook sweep had made CX-001 and CX-002 call `gpt-6-luna` the documented default, and the CX-002 loop ran Luna twice and never Sol. Both scenarios again test `gpt-5.5` at `medium`, as `SKILL.md` says, and the loop runs Luna, Terra and Sol once each. Every cli-codex ceiling statement now gives `gpt-5.6-terra` the `ultra` ceiling Codex's model cache reports. On the Pi side, PI-017 expects the ten current ids and `deepseek-v4.1-flash` with source output re-captured, and the xiaomi section explains the picker change: the kept `.pi/settings.json` dropped `mimo-v2.6-pro-ultraspeed` from `enabledModels`, which scopes startup selection and cycling only, so the id still dispatches with an explicit `--model`. The DevPass `gpt-6-luna` row in `.pi/custom-providers.md` states one verification status. The five changelogs this packet released follow the changelog template at `HEAD` now, because sk-doc/057's rewrite is still uncommitted.

### Phase 5: MiMo through LLM Gateway only

On the operator's direction, Pi and OpenCode reach MiMo through LLM Gateway alone. The Pi fan-out now builds `llmgateway/mimo-v2.6-pro` for the bare `mimo-v2.6-pro` literal, where it built `xiaomi/mimo-v2.6-pro` before, and `mimo-v2.6-pro-ultraspeed` is off both allowlist copies, because the gateway serves no ultraspeed tier; a lineage naming it now fails before launch. cli-pi drops its `xiaomi` section, and `.pi/settings.json` drops the `xiaomi/` picker entry. cli-opencode drops both Xiaomi routes, the Direct API and the Token Plan, from its provider references, its auth pre-flight, its MiMo routing table and fallback prompts, its MiMo prompt template, its quality card and its variant playbook row. cli-hermes had defined its seven ids as Pi's roster minus ultraspeed; with ultraspeed gone from Pi, the seven are exactly Pi's bare literals, and the wording says so. sk-doc/057 landed while Phase 4 was closing, so every changelog of this packet, eleven in all, now follows its compact shape.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-codex/**` (29 docs) | Modified | GPT-6 ids and phrasing examples, version 1.9.1.0 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/**` (6 docs) | Modified | GPT-6 slug grid and a Pro-slug caveat, version 1.4.9.0 |
| `.skilled/skills/cli-external-orchestration/cli-pi/**` (3 docs) | Modified | `openai-codex` rows, the new `llmgateway/gpt-6-luna` row, version 1.5.7.0 |
| `.skilled/skills/cli-external-orchestration/cli-hermes/**` (4 docs) | Modified | Roster rows with an honest standing for the GPT-6 ids, version 1.0.2.0 |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/**` (10 docs) | Modified | `claude-opus-5-5` everywhere, merged roster rows, version 1.5.1.0 |
| Five `changelog/v*.md` files, one per skill | Created | Release notes for each bump |
| `.hermes/skills/{cli-codex,cli-opencode,cli-pi,cli-hermes,cli-claude-code}/SKILL.md` | Regenerated | Generated mirrors of the touched skills |
| `executor-config.ts`, `fanout-run.cjs`, `codex-dispatch.cjs` | Modified | Allowlists, mirrors, provider map and Codex defaults |
| Eight deep-loop test and fixture files | Modified | Expectations that pin the ids |
| `.pi/settings.json`, `.pi/models.json`, `.pi/custom-providers.md` | Modified | The three new Pi routes, the `llmgateway/gpt-6-luna` default, the removed `xiaomi` block, and their documentation |
| `.pi/pi-blackhole-config.json` | Modified | Compaction model `openai-codex/gpt-6-luna` at `medium` |
| `.pi/pi-fast-mode-w-subagent-support-config.json` and the extension's `src`, tests, README and playbook | Modified | Priority tier on the GPT-6 ids |
| cli-opencode `references/cli-reference.md`, `references/providers-and-models.md` | Modified (Phase 4) | No `-pro` slug, a served fallback, astra noted off-roster, version 1.4.10.0 |
| cli-codex `SKILL.md`, `README.md`, `references/providers-and-models.md`, `assets/prompt-templates.md` | Modified (Phase 4) | Terra ceiling `ultra`, version 1.9.2.0 |
| cli-codex playbook index, CX-001 and CX-002 | Modified (Phase 4) | `gpt-5.5` default and the Luna, Terra and Sol loop |
| cli-pi `references/providers-and-models.md`, PI-017 | Modified (Phase 4) | xiaomi picker note and the current allowlist, version 1.5.8.0 |
| `.pi/custom-providers.md` | Modified (Phase 4) | One verification status for DevPass `gpt-6-luna` |
| Three new changelogs; the five released ones | Created; restructured (Phase 4) | Phase 4 release notes; the five follow the template at `HEAD` |
| `.hermes/skills/{cli-codex,cli-opencode,cli-pi}/SKILL.md` | Regenerated (Phase 4) | Mirrors of the three bumped skills |
| `executor-config.ts`, `fanout-run.cjs` | Modified (Phase 5) | Ultraspeed off the Pi allowlist copies; `mimo-v2.6-pro` maps to `llmgateway` |
| `executor-config.vitest.ts`, `fanout-run.vitest.ts` | Modified (Phase 5) | Nine-id Pi roster, the gateway MiMo mapping, the Hermes roster wording |
| cli-pi `SKILL.md`, providers reference, PI-017 and the extension auto-discovery scenario | Modified (Phase 5) | No `xiaomi` provider; nine ids; version 1.5.9.0 |
| cli-opencode `SKILL.md`, README, both references, prompt templates, quality card, variant scenario | Modified (Phase 5) | No Xiaomi Direct or Token Plan route; version 1.4.11.0 |
| cli-hermes `SKILL.md` and playbook index | Modified (Phase 5) | Roster wording; version 1.0.3.0 |
| `.pi/settings.json`, `.pi/custom-providers.md` | Modified (Phase 5) | No `xiaomi/` picker entry; the gateway MiMo row is the fan-out route |
| Three new changelogs; the eight earlier ones | Created; reshaped (Phase 5) | All eleven follow the committed sk-doc/057 compact shape |
| `.hermes/skills/{cli-pi,cli-opencode,cli-hermes}/SKILL.md` | Regenerated (Phase 5) | Mirrors of the three bumped skills |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines came first: the six deep-loop runtime suites, typecheck, the council and model-benchmark suites, the pi extension suite, the drift-guard wrapper and the Hermes mirror check were each run and recorded before any edit. One `perl` pass then renamed the tokens over an enumerated list of 66 files, with a negative lookahead that skips `-max` and the `Luna Max` display form. The Luna Max persona counts were compared before and after and did not change. Hand edits followed wherever a token swap would have left something wrong: verification claims made about the 5.6 ids, the generic "GPT-5.6" prose around mixed Luna, Terra and Sol grids, the cli-claude-code roster rows that would have duplicated, and the new gateway rows. The Hermes mirror script rewrites every mirror, so after it ran, the three mirrors for untouched skills were restored from the index and only the five touched skills' mirrors kept their regeneration.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use `gpt-6-luna` and `gpt-6-sol`, not `gpt-6.0-*` | All three live catalogs name the ids without `.0`, and an id no catalog serves would fail at dispatch |
| Take the `openai-codex` GPT-6 ids from Pi's catalog, not `.pi/models.json` | The operator keeps `.pi/models.json` to the custom `llmgateway` and `cline-pass` providers; `pi update --models` brought both ids into the catalog, so the renamed `enabledModels` entry and the fan-out selector resolve without a manual entry |
| Default Pi to `llmgateway/gpt-6-luna` at `xhigh`, and pi-blackhole to `openai-codex/gpt-6-luna` at `medium` | Operator direction on 2026-09-23. The settings first held the Codex route at `medium`; a running Pi session then saved the gateway route at `xhigh`, and the operator kept that |
| Drop the `xiaomi` block from `.pi/models.json` | Pi's catalog already carries both MiMo ids with the same compat flags, so the block only overrode input types and the ultraspeed price |
| Keep `llmgateway/gpt-6-luna` out of the fan-out map | One literal maps to one provider, and the bare literal already belongs to the `openai-codex` subscription route |
| Restate the Hermes and Pi verification claims | "Probed live" was true of the 5.6 ids; the docs now say which GPT-6 routes passed a live smoke and which are only catalog-listed |
| Merge the Opus roster rows | Two rows with the same id would present one model as two |
| Leave `CLAUDE_DEFAULT_MODEL` on `claude-opus-4-8` | The operator scoped Opus to cli-claude-code, and the fan-out's family test accepts any `claude-opus-` id |
| CX-001 and CX-002 test `gpt-5.5`, not `gpt-6-luna` | Operator choice: `SKILL.md` is the authority for the skill default, and `gpt-6-luna` is only the fan-out's fallback, which CX-002 now names as outside its scope |
| Keep `gpt-6-astra` off every roster | Operator choice. Codex and OpenCode list it, and the cli-opencode and cli-codex notes say so, but adding a model is a roster change for its own packet |
| Restore only the default-asserting playbook lines from before the sweep | The sweep that broke CX-001 and CX-002 also standardized executor pins in other scenarios, and those pins are correct |
| Restructure the five released changelogs, not rewrite them | The template governs shape; what each release shipped stays as released, and the Phase 4 entries record what changed since |
| Remap the fan-out's MiMo literal to `llmgateway` and drop ultraspeed | Operator choice of docs, config and runtime. Docs without the runtime would say there is no Xiaomi route while fan-out still sent MiMo there |
| Prove the new MiMo route with a fan-out-built smoke, not a hand-typed command | The command came from `buildLineageCommand`, so the smoke tests the new provider map as well as the gateway |
| Leave the contract examples, council docs and benchmark profiles that name Xiaomi slugs | The operator named cli-pi and cli-opencode, and the compiled contracts need their own regeneration |
| Reshape the changelogs to sk-doc/057 again | 057 is now the committed template, and REQ-015 judges against the template committed at closure |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deep-loop runtime six suites | 391 passed, 1 skipped, exit 0 before and after (221 s, then 248 s) |
| `npm run typecheck` | Exit 0 before and after |
| Council `orchestrate-session-cli` | 20/21 before and after; the same pre-existing failure on a stale `deepseek-v4-flash` literal |
| Model-benchmark `remediation` | 34/35 before and after; the same pre-existing failure, same cause |
| Pi fast-mode extension | 77/77 before and after |
| `pi --list-models gpt-6` | PASS: `llmgateway/gpt-6-luna`, `openai-codex/gpt-6-luna`, `openai-codex/gpt-6-sol` listed after the catalog refresh, built-in `openai-codex` models still present |
| JSON parse of `.pi/settings.json`, `.pi/models.json` and `.pi/pi-blackhole-config.json` | PASS |
| One-turn live smokes | PASS: Pi `openai-codex/gpt-6-luna`, `openai-codex/gpt-6-sol`, `llmgateway/gpt-6-luna` ($0.0009), Hermes `gpt-6-luna`, Codex `gpt-6-luna` (16 s, 18,217 tokens) and OpenCode `openai/gpt-6-luna` (49 s, 19,612 tokens, repository file count unchanged) replied `OK`. Not run: the Codex, OpenCode and Hermes Sol routes, which the operator declined as too expensive. cli-claude-code refused inside Claude Code |
| Pi default model | PASS: a turn with no `--model` ran on `llmgateway/gpt-6-luna` and replied `OK`, after an earlier run on the then-default `openai-codex/gpt-6-luna` |
| Native Xiaomi route | PASS on retry: `xiaomi/mimo-v2.6-pro` replied `OK` ($0.0077) after the block removal. The first attempt exited 1 and its log was overwritten, so its cause is unknown. `pi --list-models mimo-v2.6` lists both ids under `xiaomi` |
| Residue scan over every in-scope path | PASS: one hit, the PI-017 captured-output cell kept as history |
| Luna Max persona counts | PASS: 26 files, 88 occurrences, identical before and after |
| `check-frontmatter-versions.sh` | PASS: 2,932 files, 2,923 ok, 9 without frontmatter skipped, exit 0 |
| `sync-skills-hermes.cjs --check` | 6 drifted before, 3 after; on the final recheck 2 remain, sk-design and deep-ai-council, both untouched by this packet |
| Drift-guard wrapper | Unchanged from baseline: rc 1 with the identical 9-error set and 16,569 warnings, none of the errors in a touched file, and the warning set in touched areas unchanged |
| Phase 4 catalog re-reads | `opencode models openai` lists `gpt-6-astra`, `gpt-6-luna` and `gpt-6-sol` with their `-fast` variants and no `-pro` slug. Codex's `models_cache.json` gives `gpt-5.6-terra`, `gpt-6-sol` and `gpt-6-astra` `low` to `ultra`, and `gpt-6-luna` `low` to `max` |
| Phase 4 finding checks | `git grep -nE 'gpt-6-(luna\|sol)-pro'` over the living cli docs, `.hermes` and `.pi`: no hit. The CX-002 loop is `for m in gpt-6-luna gpt-5.6-terra gpt-6-sol`, and step 4's `cli-codex-cx002-gpt-*.txt` glob matches its three outputs. No playbook line calls `gpt-6-luna` the default; the one regex hit is CX-016's executor pin. The five cli-codex Terra ceiling lines say `ultra`. `.pi/custom-providers.md:88` states one status. PI-017 names `deepseek-v4.1-flash` twice and the retired default nowhere |
| Phase 4 `check-frontmatter-versions.sh` | PASS: 2,932 files, 2,923 ok, 9 without frontmatter skipped, exit 0 |
| Phase 5 runtime suites and typecheck | Six suites 391 passed, 1 skipped, exit 0 (221 s), against a baseline taken just before the edit of 391 passed, 1 skipped, exit 0 (217 s); `npm run typecheck` exit 0 before and after |
| Phase 5 live smoke | PASS: the fan-out built `pi -p --offline --model llmgateway/mimo-v2.6-pro --thinking high` for the bare `mimo-v2.6-pro` literal, which exited 0 and replied `OK` in 11 s. The same builder refused `mimo-v2.6-pro-ultraspeed` before launch, listing the nine remaining ids |
| Phase 5 Xiaomi residue search | No `xiaomi/`, `xiaomi-token-plan-ams`, `'xiaomi'` or `### xiaomi` hit in cli-pi, cli-opencode, their mirrors, `.pi/settings.json` or the Pi fan-out code; the remaining Xiaomi mentions state that the routes were removed |
| Phase 5 changelog shape | sk-doc/057's `check-changelog-structure.py`: all eleven changelogs of this packet `RESULT: PASSED (0 violations)` |
| Phase 5 `check-frontmatter-versions.sh` and mirrors | Gate exit 0, 2,923 ok; `sync-skills-hermes.cjs --check` drifts only deep-ai-council, which this packet does not touch |
| Phase 4 `sync-skills-hermes.cjs --check` | 4 drifted after the bumps (cli-codex, cli-opencode, cli-pi, deep-ai-council); 1 after copying back the three regenerated mirrors, deep-ai-council, which this packet does not touch |
| `validate.sh --strict` | `RESULT: PASSED` after re-deriving the generated metadata |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

A fresh review after the push found two P1 and five P2 doc defects, and Phase 4 corrected all seven. What remains is below.

1. **The Sol routes outside Pi have no live round-trip.** Codex `gpt-6-sol`, OpenCode `openai/gpt-6-sol` and Hermes `gpt-6-sol` are catalog-listed only; the operator declined them as too expensive, and the Luna routes on the same runtimes passed. cli-claude-code refuses to dispatch from inside Claude Code, so `claude-opus-5-5` needs a smoke from another shell.
2. **PI-017's live smoke step was not re-run.** Its source inspection was re-captured on 2026-09-23; the credentialed dispatch it describes was left as it was.
3. **Pi's GPT-6 ids depend on a per-machine catalog refresh.** `openai-codex/gpt-6-luna` resolves because `pi update --models` refreshed `~/.pi/agent/models-store.json` here; a machine with an older catalog cannot resolve the pi-blackhole compaction model or the fan-out's `openai-codex/gpt-6-luna` until it runs the same refresh or Pi's bundled catalog ships the ids.
4. **Pi's default changed under a running Pi session.** `.pi/settings.json`, which `~/.pi/agent/settings.json` links to, was rewritten at 08:22 local while a Pi session was open. Pi saving its current model is the likely cause, not confirmed. A model switch in any open Pi session can change the repo default again. The kept file also dropped `xiaomi/mimo-v2.6-pro-ultraspeed` from `enabledModels`; the cli-pi xiaomi section now says how to reach it.
5. **The native Xiaomi values differed from the removed block.** Pi's catalog marked both MiMo ids image-capable and priced ultraspeed at $4.35 in and $8.70 out per million tokens, where the block said text-only and $1.305 and $2.61. Phase 5 took the `xiaomi` route off the roster, so this no longer affects any roster dispatch.
6. **Operator config outside the repo is unchanged.** `~/.codex/config.toml` still sets `model = "gpt-5.6-luna"`.
7. **Adjacent defects noticed, not fixed:** CX-002 checks the roster against `references/cli-reference.md` §5 and its "Supported Models table", but §5 has no such table and links to `providers-and-models.md`, where the roster lives; cli-codex describes `luna-impl` and `sol-verify` Codex profiles that exist in no config; cli-claude-code still names `claude-fable-5` while the current Fable id is `claude-fable-5-1`; `create.sh --track` wrote the new folder under `.opencode/specs/` instead of `specs/`; and two pre-existing test failures reject a stale `deepseek-v4-flash` literal.
8. **Xiaomi slugs outside cli-pi and cli-opencode stay.** The deep-research, deep-review and deep-ai-council command contracts cite `xiaomi-token-plan-ams/mimo-v2.5-pro` as a sample cli-opencode model id, the council seat-diversity doc uses `xiaomi/mimo-v2.6-pro`, three deep-improvement benchmark profiles pin the Token Plan route, and cli-claude-code's tool comparison counts OpenCode's providers. They were outside the operator's named scope, and the contracts are compiled artifacts that need their own regeneration. Pi's stored Xiaomi credential in `~/.pi/agent/auth.json` is operator config and was left alone.
9. **No OpenCode round-trip on the MiMo route is recorded.** The Pi smoke proves the gateway serves `mimo-v2.6-pro`, but OpenCode keeps its own credential store, and its providers reference says so.
10. **Adjacent defect found, not fixed: cli-opencode's auth pre-flight greps provider ids, but `opencode providers list` prints display names.** On this machine the `opencode-go` and `minimax-coding-plan` checks never match, so the pre-flight reports the configured default as missing. The new LLM Gateway check matches the display name, and the others need the same treatment in their own change.
<!-- /ANCHOR:limitations -->

---
