---
title: "Implementation Summary"
description: "Pi no longer carries the undated 2026-09-10 DeepSeek V4.1 Flash: the id is gone from `.pi/models.json` and from both cli-pi allowlists, so the runtime registers only the dated 2026-10-17 release and a lineage pinned to the old id is rejected before dispatch. Hermes and OpenCode keep the old id on purpose, and updated tests with a revert proof hold the removal."
trigger_phrases:
  - "drop old deepseek from pi implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/065-drop-old-deepseek-from-pi"
    last_updated_at: "2026-10-23T05:20:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Pushed the change, confirmed CI and recorded pi --list-models from the main checkout"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-065-drop-old-deepseek-from-pi"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 065-drop-old-deepseek-from-pi |
| **Status** | Complete |
| **Completed** | 2026-10-23 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Pi now carries one DeepSeek V4.1 Flash release, the dated 2026-10-17 `deepseek-v4.1-flash-1017`. The undated 2026-09-10 id is gone from `.pi/models.json` and from both cli-pi allowlists, so a lineage pinned to it fails at command construction with a message that names the id, rather than reaching the gateway and failing at request time. Hermes and OpenCode still carry the old id on purpose.

### Phase 65: drop-old-deepseek-from-pi

Commit `052d1e2e1e` had already taken `deepseek-v4.1-flash` out of `.pi/settings.json` `enabledModels`, which removed it from the picker, but the model object stayed in the `llmgateway` provider block in `.pi/models.json`. That left a split state: the roster looked retired while `--model llmgateway/deepseek-v4.1-flash` could still pin it. The operator asked to remove it from `models.json` as well, which is this phase.

The `llmgateway` block now registers three models, `deepseek-v4.1-flash-1017`, `glm-5.3-flash` and `gpt-6-luna`. `PI_SUPPORTED_MODELS` in `executor-config.ts` and `PI_ALLOWED_MODELS` plus `PI_MODEL_PROVIDERS` in `fanout-run.cjs` drop the bare id, so `isPiModelAllowed('deepseek-v4.1-flash')` is false and `buildPiLineageCommand` throws "cli-pi model 'deepseek-v4.1-flash' is not in the enforced allowlist". The comments in both files now explain that the undated September literal is not registered in `.pi/models.json`, so Pi cannot run it and it stays off the roster.

The removal stops at Pi. `HERMES_ALLOWED_MODELS` keeps the old id because Hermes reaches the gateway through its own provider block in `~/.hermes/config.yaml`, which passes any gateway id through and does not depend on Pi. OpenCode keeps it because `llmgateway` is native there. The three roster docs now say the same: Pi no longer carries the old id, and a run that must reproduce the 2026-09-10 release goes through OpenCode or Hermes.

The tests move with the roster. `executor-config`, `fanout-run`, `combo-matrix` and `orchestrate-session-cli` use `-1017` in their cli-pi cases, a new check asserts cli-pi rejects the old id, and another asserts `.pi/models.json` does not register it. Restoring the old id in the config and the rosters fails 5 tests, so the removal is held by checks rather than by convention.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/models.json` | Modified | Deleted the `deepseek-v4.1-flash` object from the `llmgateway` provider block |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modified | Dropped the bare id from `PI_SUPPORTED_MODELS` and reworded the DeepSeek comments |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | Dropped the bare id from `PI_ALLOWED_MODELS` and `PI_MODEL_PROVIDERS`, kept `HERMES_ALLOWED_MODELS` unchanged and reworded the comments |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modified | Removed the old id from the expected roster and added the rejection and `models.json` checks |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modified | Replaced the old-id dispatch test with an allowlist-rejection test and moved the provider map and effort tests to `-1017` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts` | Modified | Moved the cli-pi representative command to `llmgateway/deepseek-v4.1-flash-1017` |
| `.skilled/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts` | Modified | Moved the cli-pi case to `deepseek-v4.1-flash-1017` |
| `.skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modified | Said Pi carries three llmgateway rows and pointed the 2026-09-10 release at OpenCode or Hermes |
| `.pi/custom-providers.md` | Modified | Updated the roster count, picker note, model table, thinking note and removal steps |
| `.skilled/changelog/skilled/v4.0.0.13.md` | Modified | Said the older id stays selectable on OpenCode and Hermes while Pi no longer carries it, with each runtime's pin form |
| `.skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/supported-model-allowlist-smoke.md` | Modified | Counted nine roster ids instead of ten and dropped the undated id from the evidence list |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modified | This phase's packet, filled from the scaffold |
| `../spec.md` | Modified | The phase map row for 065 and the 064 to 065 handoff row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash 1017 through cli-pi wrote the test changes at max thinking and the doc changes at high thinking, then fixed the review findings the same way, including the Hermes roster docblock and test name. The orchestrator made the runtime roster deletions, the first comment rewording and the `models.json` deletion by hand as mechanical edits, because those are short, reviewable removals rather than open-ended design work. A separate read-only DeepSeek session reviewed the diff: round 1 failed with two P1 findings (cli-pi docs still presenting the undated literal as a live Pi route, and the PI-017 playbook still counting ten ids) and four P2 wording findings; round 2 passed with one P2 about a stale sentence in the opencode-go row, which was fixed. Luna was not used.

The revert proof and the suite reruns hold the change. Restoring the old id in `.pi/models.json` and the rosters fails 5 tests, which shows the new checks reject the split state rather than merely documenting it. An unpinned `pi` run reached `-1017` and exited 0, and the fan-out command builder rejected a lineage pinned to the old id on the real `pi` path. `pi --list-models` reads the main checkout's `.pi/models.json` through the global symlink, so that proof was taken after the push: the main checkout at `8d13b357a9` lists only the three registered llmgateway rows.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delete the entry from `.pi/models.json` rather than only from `enabledModels` | The earlier commit already hid the id from the picker, but the registered object still allowed `--model` to pin it; the operator asked for the registration itself to go |
| Drop the bare id from both `PI_SUPPORTED_MODELS` and `PI_ALLOWED_MODELS` | The TypeScript config and the synchronous CommonJS duplicate must stay fail-closed together, or one path accepts an id the other refuses |
| Drop the `PI_MODEL_PROVIDERS` mapping as well | A bare literal with no provider mapping cannot compose a selector; removing it makes the allowlist the one place that decides, and the rejection message names the id |
| Keep the old id in `HERMES_ALLOWED_MODELS` | Hermes reaches the gateway through its own provider block, which passes any gateway id through, so it does not depend on Pi's roster |
| Keep the old id on OpenCode | `llmgateway` is native there, so OpenCode can still reproduce the 2026-09-10 release without Pi |
| Point the docs at OpenCode or Hermes instead of leaving the old id described as pinnable | A reader who needs the September release needs a route that still exists, and Pi no longer has one |
| Move the cli-pi test cases to `-1017` instead of deleting them | The command shape still needs coverage, and the dated literal is the route the default uses |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Revert proof: old id restored in `.pi/models.json` and the rosters | FAIL 5 tests, which proves the new checks bite; a sixth failure came from the revert script duplicating a Hermes id and is not counted |
| `pi --list-models` shows no undated llmgateway DeepSeek row after the main checkout updates | PASS: on the main checkout at `8d13b357a9`, `pi --list-models` lists three llmgateway rows, `deepseek-v4.1-flash-1017`, `glm-5.3-flash` and `gpt-6-luna`, with no undated DeepSeek row, exit 0 (`scratch/live/list-models.txt`) |
| An unpinned `pi` run uses `deepseek-v4.1-flash-1017` and exits 0 | PASS: JSON events report `model: deepseek-v4.1-flash-1017` on `llmgateway`, reply OK, exit 0 (`scratch/live/unpinned-run.jsonl`) |
| A fan-out cli-pi lineage pinned to the old id is rejected | PASS: `buildLineageCommand` throws "cli-pi model 'deepseek-v4.1-flash' is not in the enforced allowlist" with the nine allowed ids; `-1017` builds its `pi` command (`scratch/live/fanout-pin-rejection.txt`) |
| Suite counts from the four updated suites and any suite the rosters touch | PASS: deep-loop runtime 2807 passed and 8 skipped of 2815 in 167 files (the 062 baseline was 2806 and 8 of 2814; the one extra is the new rejection test); deep-ai-council 120 of 120 before and after; config-shape, battery and cli-opencode script tests 85 of 85 before and after; playbook fleet `--strict` PASS before and after, cli-pi 35 scenarios and 0 violations |
| Changelog validator and link guard | PASS: `validate_document.py` 0 issues on the v4.0.0.13 changelog; link guard 0 broken across 7793 files |
| Read-only DeepSeek review | Round 1 FAIL (2 P1, 4 P2, all fixed); round 2 PASS with 1 P2, fixed |
| Commit, push and CI green on the pushed commit | PASS: 17 of 17 workflows green on `8d13b357a9`, including Deep-Loop Runtime Tests `39909844320`, OpenCode Dual-Version Battery `39909844429`, Spec-Kit Check `39909844384`, Playbook Operator Contract `39909844592` and Trigger Index Rebuild `39909844393`; the index rebuild `c33ff8840a` had 13 succeeded, Trigger Index Rebuild skipped and Spec-Kit Check `39910111430` green |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`pi --list-models` reads the main checkout.** Pi's global `models.json` is a symlink to the main checkout's file, so the picker proof can only be taken once a push lands there.
2. **The old id still exists outside Pi.** Hermes and OpenCode keep `deepseek-v4.1-flash` on purpose, so a reader who sees the id elsewhere is not looking at a missed removal.
3. **Two timing-sensitive deep-loop tests fail under load.** Running the baseline and the after-suite at the same time failed `deep-research-ledger-schema` (a 30 s timeout) on both trees and `branch-leases-waves` on the after tree; the after-suite run alone passed every file. Neither test reads a model roster.
<!-- /ANCHOR:limitations -->

---
