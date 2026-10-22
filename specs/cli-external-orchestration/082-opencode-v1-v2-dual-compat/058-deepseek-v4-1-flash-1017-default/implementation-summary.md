---
title: "Implementation Summary"
description: "LLM Gateway's newest DeepSeek flash is the 2026-10-17 release under its own id, and DeepSeek's provider route for the older id is listed as deactivating on 2026-10-24. Pi, Hermes and both OpenCode versions now default to deepseek-v4.1-flash-1017 through llmgateway at the max tier, the older literal stays pinnable for the 2026-09-10 build, Pi's own default and its pi-blackhole worker model moved with it, and twelve revert proofs plus live runs on all four hosts show no default can slip back unnoticed."
trigger_phrases:
  - "deepseek v4 1 flash 1017 default implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/058-deepseek-v4-1-flash-1017-default"
    last_updated_at: "2026-10-22T22:10:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded Pi default and blackhole move"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - "specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/058-deepseek-v4-1-flash-1017-default/scratch/revert-proofs.txt"
      - "specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/058-deepseek-v4-1-flash-1017-default/scratch/live/llmgateway-deepseek-by-created.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "058-deepseek-v4-1-flash-1017-default"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which DeepSeek flash id the framework defaults to: deepseek-v4.1-flash-1017, the 2026-10-17 release, through llmgateway, with the 2026-09-10 literal kept as a pin"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 058-deepseek-v4-1-flash-1017-default |
| **Status** | Complete |
| **Completed** | 2026-10-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The default DeepSeek model is now the release that is actually newest. LLM Gateway lists `deepseek-v4.1-flash-1017`, created 2026-10-17, above the 2026-09-10 `deepseek-v4.1-flash` this repo had been defaulting to, and llmgateway's docs list DeepSeek's own provider route for that older id as "Deactivating on Oct 24, 2026". Pi, Hermes and both OpenCode versions now default to the new id through llmgateway, at the max tier, while the older literal keeps its own route and its own roster row so a run can still pin the September build.

### Phase 58: deepseek-v4-1-flash-1017-default

One literal names one model, so the new id got a literal rather than a rewrite of the old one. `deepseek-v4.1-flash-1017` joins both bare-literal rosters, maps to `llmgateway` in the provider map, and becomes `PI_DEFAULT_MODEL` and `HERMES_DEFAULT_MODEL`. OpenCode reaches the same release through `llmgateway/deepseek-v4.1-flash-1017`, `--variant max` on OpenCode 1 and `#max` on OpenCode 2, and `opencode.json` names it in the top-level model and in both agent models.

The older literal was deliberately not replaced. `deepseek-v4.1-flash` stays on both rosters as a non-default row, stays in the `llmgateway` provider map, and still builds `llmgateway/deepseek-v4.1-flash` when a lineage pins it. That keeps the 2026-09-10 build reproducible without giving it a second default. Both literals sit in the max-pin regex, which is written twice on purpose: `isFlashMaxPinnedModel` in `executor-config.ts` and a plain duplicated function in `fanout-run.cjs`, because the command builders in that file are synchronous.

Pi needed a registration, not just a default. `.pi/models.json` gained a `llmgateway` entry mirroring the older entry's 1.05M context window, 384K output limit, per-token cost, thinking-level map and `"compat": {"supportsDeveloperRole": false}` block, and `.pi/settings.json` gained the qualified name in `enabledModels`.

The operator then widened the scope: the new id is now Pi's own default too. `.pi/settings.json` moves `defaultModel` from `gpt-6-luna` to `deepseek-v4.1-flash-1017` and puts `llmgateway/deepseek-v4.1-flash-1017` first in `enabledModels`, every earlier entry kept, while `defaultProvider` stays `llmgateway` and `defaultThinkingLevel` stays `xhigh`. `.pi/pi-blackhole-config.json` moves its worker model from `openai` / `gpt-6-luna` / `medium` to `llmgateway` / `deepseek-v4.1-flash-1017` / `high`, which the -1017 thinking-level map carries as a real `high`. `xhigh` is `null` in that map, so Pi's `clampThinkingLevel` rounds a run that names no model up to `max`; that is the tier the flash max-pin policy wants anyway, and the operator was told rather than left to discover it.

The docs followed in one pass: the three CLI skills with their rosters and playbooks, `.pi/custom-providers.md` now describing four llmgateway models, the prompt-improver agent and its three mirrors, sk-prompt, the deep research and review presentations with their compiled contracts, the council seat doc, and the playbook scenario runner. The Hermes skill mirrors were regenerated rather than hand-edited. Dated records keep the id they used.

The rebase is part of the delivery. Main retired the Cline provider and MiMo v2.6 during this phase, across `b1f6c78482`, `aee462fe02` and `b7b3dec9de`. This phase was rebased onto that work, keeps those removals, and re-adds neither, so the rosters hold 10 cli-pi ids and 7 cli-hermes ids with the new DeepSeek id among them.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modified | Both rosters gain the literal, both bare defaults move, and the max-pin regex accepts the new id |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | The mirrored allowlists, `PI_MODEL_PROVIDERS`, both defaults, `OPENCODE_DEFAULT_MODEL` and the mirrored max-pin function |
| `opencode.json` | Modified | The top-level model and both agent models name the new id, each agent keeping `variant: max` |
| `.pi/models.json` | Modified | A `llmgateway` entry for the new id, mirroring the older entry's limits, cost and compat block |
| `.pi/settings.json` | Modified | `defaultModel` moves to `deepseek-v4.1-flash-1017` and that id takes the first `enabledModels` slot, every earlier entry kept; `defaultProvider` stays `llmgateway` and `defaultThinkingLevel` stays `xhigh` |
| `.pi/pi-blackhole-config.json` | Modified | The worker model moves to `llmgateway` / `deepseek-v4.1-flash-1017` / `high` |
| `.pi/custom-providers.md` | Modified | Four llmgateway models, the new default route, the older release as a pin, and the compat block on both DeepSeek entries |
| `.skilled/skills/cli-external-orchestration/cli-opencode/` | Modified | Default row, older non-default row, every dispatch shape on both versions, the playbooks and the scenario runner |
| `.skilled/skills/cli-external-orchestration/cli-pi/` | Modified | The new default row, the older release row, the provider notes, the `pi-tools.md` dispatch default that used to name `google`, and the allowlist smoke command |
| `.skilled/skills/cli-external-orchestration/cli-hermes/` | Modified | The seven-id closed roster, the new default, the catalog rows and the dispatch examples |
| `.skilled/skills/cli-external-orchestration/README.md`, `graph-metadata.json` | Modified | The packet summary line and its trigger text |
| `.skilled/agents/prompt-improver.md`, `.pi/agents/prompt-improver.md`, `.claude/agents/prompt-improver.md`, `.codex/agents/prompt-improver.toml` | Modified | The model the prompt-improver agent pins |
| `.skilled/skills/sk-prompt/SKILL.md` | Modified | The model its dispatch examples name |
| `.skilled/commands/deep/assets/deep-research-presentation.txt`, `deep-review-presentation.txt`, `compiled/*.contract.markdown` | Modified | The presented default model and the compiled contracts that carry it |
| `.skilled/skills/system-deep-loop/deep-ai-council/references/patterns/seat-diversity-patterns.md` | Modified | The council seat's model row |
| `.hermes/skills/cli-opencode/SKILL.md`, `.hermes/skills/cli-hermes/SKILL.md`, `.hermes/skills/sk-prompt/SKILL.md`, `.hermes/skills/agent-prompt-improver/SKILL.md` | Modified | The regenerated Hermes mirrors |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modified | The roster and default assertions, the models.json registration test and the max-pin cases |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modified | The provider map, both defaults, the pinned argument list and the older-literal case |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts` | Modified | The default id it expects in a built dispatch |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs` | Modified | `opencode.json` held to the default in every model field, and the older id held as a non-default roster row |
| `scratch/revert-proofs.txt` | Created | The twelve revert proofs |
| `scratch/live/` | Created | The catalog evidence and the live runs on each host |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Created | This phase's packet, filled from the scaffold |
| `../spec.md` | Modified | The phase map row for 058 and the handoff row for 058 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change was found before it was made. The gateway listing sorted by created date, `opencode models --refresh` on OpenCode 1 and `opencode2 models` on OpenCode 2 all agreed on the new id and on where it sits above the older release, and llmgateway's docs supplied the 2026-10-24 deactivation note that turned a preference into a reason. `scratch/live/llmgateway-deepseek-by-created.txt` is that evidence, and the operator approved the switch on 2026-10-22.

Then the value moved in one direction: runtime first, so the tests and the configs could be held to it, then the configs, then the docs. The tests were extended before the docs, which is why each doc claim already had an assertion behind it.

A green suite does not prove a default is held, so each new assertion was proved by reverting its value and reading the failure. Twelve proofs are in `scratch/revert-proofs.txt`: reverting the `opencode.json` default, removing the older roster row, reverting the roster default, dropping the `.pi/models.json` entry, reverting the max-pin regex, dropping the fan-out provider mapping, removing the older literal from the Pi allowlist, reverting the fan-out OpenCode default, and four for the widened scope that revert the settings default model, the first `enabledModels` slot, the blackhole model, and the blackhole thinking level alone. Each failed on its own value and nowhere else.

The live pass is what the tests could not say. Pi ran at `--thinking max` and `high` with the qualified id, and its JSON reply named model `deepseek-v4.1-flash-1017`, provider `llmgateway` and the matching thinking level; `pi --list-models` lists the id. OpenCode 1 ran pinned at `--variant max` and unpinned, and its session export shows modelID `deepseek-v4.1-flash-1017` with providerID `llmgateway`. OpenCode 2 ran `--standalone -m llmgateway/deepseek-v4.1-flash-1017#max`. The capture proxy recorded request model `deepseek-v4.1-flash-1017` on both versions, which is the only view of what was actually sent. An unpinned fan-out on Pi, OpenCode 1, OpenCode 2 and Hermes each built the -1017 id and exited 0. Every run in `scratch/live/` exited 0 and replied OK.

The widened scope was proved the same way, and the clamp is what makes it work. A `pi -ne -p "Reply with exactly: OK" --mode text --offline` run with no `--model`, from the worktree with a scratch agent dir linking the worktree's settings and models, replied OK and exited 0; the JSON form names provider `llmgateway`, model `deepseek-v4.1-flash-1017` and thinking level `max`, because `xhigh` is `null` in the -1017 map and `clampThinkingLevel` rounds it up (`scratch/live/pi-nomodel.*`). With the blackhole extension active (`PI_BLACKHOLE_PASSIVE` unset, only `PI_BLACKHOLE_OBSERVE_AFTER_TOKENS=1000` so the observer fires inside a short run) and the traffic going through a capture proxy, six session requests recorded model `deepseek-v4.1-flash-1017` at `reasoning_effort` `max`, and the observation-agent request recorded the same model at `high` (`scratch/live/pi-blackhole-active.*`, `pi-blackhole-active.session-models.txt`). The unpinned OpenCode fan-out was re-run on both versions and the proxy recorded `deepseek-v4.1-flash-1017` for each.

Two limits on that proof are recorded below rather than papered over. A plain `pi` run in a worktree reads the main checkout's `.pi/models.json` through a symlink, so the trials used a scratch `PI_CODING_AGENT_DIR`; and the repo dispatch guard forbids an ad-hoc unpinned `opencode run`, so OpenCode 2's config default was proved through the fan-out runtime and the capture proxy.

The change was reviewed read-only by DeepSeek on the combined diff, then again on the settings and blackhole change. The first pass returned PASS. The second returned FAIL with two P1s and two P2s: the DeepSeek effort rows in `.pi/custom-providers.md` and `providers-and-models.md` said `xhigh` folds into `high` without adding that Pi rounds it up to `max`, a blackhole compaction-model sentence was stale, and `pi-tools.md` still told dispatches to default to `google`. All four were fixed and a third pass returned PASS, leaving three P2s as notes: the settings test checks only `enabledModels[0]`, the 2026-10-24 deactivation date comes from llmgateway's docs and is not in the `/v1/models` payload, and the operator's global blackhole config links to the main checkout and changes when this lands.

The suites ran baseline first, then at the final gate. The deep-loop vitest floor went from 2799 passed / 8 skipped to 2804 passed / 8 skipped across 167 files, and the cli-opencode script tests from 22 to 24. At the final gate on the rebased commit the battery unit tests passed 55/55, the config-shape tests 6/6, the Hermes sync tests 4/4, the playbook validator passed every package, and 082 validated recursively with every folder PASSED. The commit landed on main as `5b5f56720f`, and all 19 CI workflow runs on it succeeded.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Give the new id its own literal instead of resolving it through the older one | One literal names one model. A literal that silently meant two releases would make a pinned run unreproducible and a roster row ambiguous |
| Keep `deepseek-v4.1-flash` selectable rather than replacing it | A run that must reproduce the 2026-09-10 build still needs the old route, and removal buys nothing while the `llmgateway` route serves it |
| Move the default rather than the provider | The new id is served by the same `llmgateway` route, so the change is one id, not a new provider block, key or compat rule |
| Add a `.pi/models.json` entry mirroring the older one | Pi's picker and `--list-models` read the provider block, so a default with no entry would look absent while dispatching fine |
| Move Pi's `defaultModel` to the new id, on the operator's widened scope | The operator asked for it after the first pass: the new id is now Pi's default and the pi-blackhole worker model as well as the DeepSeek route. `.pi/settings.json` and `.pi/pi-blackhole-config.json` both move, and the picker order follows so the enabled list and the default agree |
| Leave `defaultThinkingLevel` at `xhigh` and let the clamp land on `max` | The -1017 map marks `xhigh` `null`, so Pi rounds a no-model run up to `max`, which is the tier the flash max-pin policy wants. Lowering the setting would change every route's default to fix one model's ladder, and the clamp already resolves it |
| Put both literals in the max-pin regex | An unpinned run has to land on the top tier on the new route as it did on the old one, and a regex that matched only the old literal would quietly drop the pin |
| Duplicate the max-pin function in `fanout-run.cjs` | The command builders there are synchronous and the regex has to run inside them, so the plain copy is the shape that file already uses |
| Prove each new assertion by reverting its value | A passing test can pass for the wrong reason. A revert proof shows the assertion is the thing holding the value |
| Keep main's Cline and MiMo retirements through the rebase | They landed while this phase was open. Re-adding either would restore a provider the repo just removed, for no reason this change needs |
| Prove OpenCode 2's config default through the fan-out and the proxy | The dispatch guard forbids an ad-hoc unpinned `opencode run`. The proxy records the model actually sent, which is the fact the bare run was wanted for |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Gateway catalog and both model lists | PASS: `deepseek-v4.1-flash-1017` is the 2026-10-17 release, listed above the 2026-09-10 `deepseek-v4.1-flash`, on the catalog and on `opencode models --refresh` and `opencode2 models` (`scratch/live/llmgateway-deepseek-by-created.txt`) |
| Revert proofs | PASS: twelve proofs, each failing on the value it reverted and on nothing else (`scratch/revert-proofs.txt`) |
| Pi live, `--thinking max` and `high` | PASS: both exit 0 and reply, JSON names model `deepseek-v4.1-flash-1017`, provider `llmgateway` and the matching thinking level; `pi --list-models` lists the id (`scratch/live/`) |
| OpenCode 1 live, pinned and unpinned | PASS: both exit 0 and reply, session export shows modelID `deepseek-v4.1-flash-1017` and providerID `llmgateway` (`scratch/live/`) |
| OpenCode 2 live, `--standalone -m …#max` | PASS: exit 0 and a reply (`scratch/live/`) |
| Capture proxy | PASS: request model recorded as `deepseek-v4.1-flash-1017` on both OpenCode versions (`scratch/live/`) |
| Unpinned fan-out on all four hosts | PASS: Pi, OpenCode 1, OpenCode 2 and Hermes each built the -1017 id and exited 0 (`scratch/live/`) |
| Roster counts after the rebase | PASS: 10 cli-pi ids and 7 cli-hermes ids, with neither the Cline provider nor MiMo v2.6 present |
| Pi live, no `--model` | PASS: text run replied OK, exit 0; JSON names provider `llmgateway`, model `deepseek-v4.1-flash-1017` and thinking level `max` (`scratch/live/pi-nomodel.*`) |
| Pi live, blackhole active | PASS: six session requests at `deepseek-v4.1-flash-1017` / `reasoning_effort` `max` and the observation-agent request at the same model / `high` (`scratch/live/pi-blackhole-active.*`) |
| Deep-loop vitest, baseline then final | PASS: 2799 passed / 8 skipped then 2804 passed / 8 skipped (167 files); the executor-config suite holds the settings and blackhole assertions |
| cli-opencode script tests, baseline then final | PASS: 22 then 24 |
| Revert proofs for the widened scope | PASS: four new proofs, each one failed and 107 passed (`scratch/revert-proofs.txt`) |
| Review passes | PASS: PASS on the combined diff, FAIL with two P1s and two P2s on the settings/blackhole change, all four fixed, then PASS with three P2 notes |
| CI on main | All 19 workflow runs on `5b5f56720f` succeeded (run ids 39858029173 to 39858029728), and the trigger-index rebuild it triggered landed as `798a4665f7` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A plain `pi` run inside a worktree does not see the new id until it is on main.** Pi reads `~/.pi/agent/models.json`, which is a symlink to the main checkout's `.pi/models.json`, so a worktree's own block is never read by a bare `pi`. The worktree trials used a scratch `PI_CODING_AGENT_DIR` that links every entry back to `~/.pi/agent` except `models.json`. The operator's global blackhole config links to the main checkout in the same way, so its worker model changes when this lands rather than when the branch is read. On main the symlink target is the file this phase edits, so the limitation ends at the push.
2. **OpenCode 2's config default was not proved with a bare unpinned run.** The repo's dispatch guard forbids an ad-hoc unpinned `opencode run`, so the config default was proved through the fan-out runtime and the capture proxy instead. The proxy shows the request model is the new id; what it does not show is a plain `opencode2 run` reading `opencode.json`, because that command cannot be issued here.
3. **The Cline provider and MiMo v2.6 retirement landed during this phase.** The rebase keeps it and this phase re-adds neither, so the roster counts in the tests carry another change's removals as well as this one's addition. A reader comparing counts with a pre-rebase branch will see two causes, not one.
4. **The settings test checks only `enabledModels[0]`.** It holds the default and the first slot, not the order of the entries behind it. A reviewer's note, left as a note: the full list is not asserted, because every earlier entry was kept rather than reordered.
5. **The 2026-10-24 deactivation date is llmgateway's docs, not the `/v1/models` payload.** The catalog lists the ids and creation dates but carries no retirement field, so the date is sourced from the provider's documentation and a doc claim rather than an API fact.
<!-- /ANCHOR:limitations -->

---
