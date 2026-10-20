---
title: "Implementation Summary"
description: "The seven legacy research row kinds that were still pinned now migrate to their own stems and survive a projection replace, every row keeps its own timestamp, a mistyped field is refused by name, and the rejected-pattern halt names its gateway command."
trigger_phrases:
  - "legacy row migration implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-review-and-cli-lineage/012-legacy-row-migration"
    last_updated_at: "2026-10-20T08:00:00Z"
    last_updated_by: "leaf-worker"
    recent_action: "Closed the legacy row migration phase"
    next_safe_action: "Commit and merge worktree 158 to main"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-legacy-row-migration |
| **Completed** | 2026-10-20 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A ledger-backed research run no longer loses its pause, recovery, convergence-floor, override, trend and pivot rows at the next projection, and every projected row keeps the time it was written. An operator who hits a refusal or the rejected-pattern halt can act on the message alone.

### Phase 12: legacy-row-migration

Eleven research stems now carry the rows the upcaster used to pin: `user_paused`, `stuck_recovery`, `min_iterations_guard_pass`, `migration`, `novelty_signal_inert`, `trend_flatline`, `pivot_override_accepted` and the four pivot lifecycle rows. Each keeps the legacy row's own field names, and the projection writes the row back in its documented key order. Both research workflows now append the pause, recovery and guard rows through the gateway, and the confirm workflow appends the override row the same way. The migration row is now appended through the gateway too. The canonical-name step only detects a legacy alias, and a new step at the top of the iteration loop appends the row once per session, after session classification and the run opening, so the `log_only_bookkeeping` exception is gone. Every upcast arm takes the row's own UTC timestamp as the event time. A value of the wrong type is refused as `<kind>-fields-mistyped:<field>`, and that includes the config row's counts, topic and executor, which used to fall back to defaults. A count written as a plain digit string, which the workflow's config template can produce because it quotes the value, is carried as that number with a warning. The review workflows follow the same order. Their rehome step only moves legacy `scratch/` state. A resume or synthesis then sets the moved hand-written state log aside as `deep-review-state.legacy.jsonl`, opens the run from the moved config and replays its iteration rows through the gateway, and `deep_review.migration` is appended once right after the loop's lock refresh. The rejected-pattern halt and two reference docs give the gateway command for a removal or reset, in the snake_case names the code emits.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts`, `deep-research-ledger-schema.ts` | Modified | Stems, data types, census, rules, `findMistypedDeepResearchField` |
| `runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` | Modified | Translation, own timestamp, named mistyped refusal on every arm, config field check |
| `runtime/lib/legacy-projections/deep-research-contract.ts`, `runtime/lib/deep-research-reducers/deep-research-reducer.ts` | Modified | Projection arms, reducer no-op arms |
| `commands/deep/assets/deep-research-auto.yaml`, `deep-research-confirm.yaml`, compiled research contract | Modified | Gateway routing, migration step after classification, halt message |
| `deep-research/references/state/state-jsonl.md`, `deep-research/references/protocol/loop-protocol.md` | Modified | snake_case names, operator path, config field types, when the migration row is appended |
| `commands/deep/assets/deep-review-auto.yaml`, `deep-review-confirm.yaml`, compiled review contract, `deep-review/references/protocol/loop-protocol.md` | Modified | Move-only rehome, adoption of a moved state log, migration step after classification |
| Runtime tests: ledger schema, reduce state, bookkeeping emission, stem census, review run open | Modified | Failing-first tests, the census count |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One worker built it in worktree 158 in two rounds on phase 011's pattern. Each test was written first and seen failing for its own reason: pinned decisions, no mistyped refusal, the append time, the gateway refusing the lifecycle rows and a halt with no command. The second round closed two of the first round's limitations, and its tests failed on the migration row still being a `bookkeeping_log` directive and on a string `maxIterations` becoming 0. HEAD's sources were then swapped back in to confirm the new tests fail without the change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The migration row is appended at the top of the iteration loop, not where the alias is detected | Detection fires before session classification, and an append there creates the state log, which turns a fresh packet into a partial one that classifies as invalid. The loop runs after classification on a fresh run, a restart and a resume, and the run is open by then |
| A moved review log is adopted by replaying its iteration rows, not by teaching the gateway to accept it | The gateway's refusal of a hand-written config row guards every ledger-backed run. The review gateway already carries an iteration row whole, so a replay keeps those rows exactly, and the set-aside file keeps everything else |
| A digit-string config count converts, every other mistyped config field refuses | The workflow's config template quotes `maxIterations`, so a live run may hold `"10"`, which spells exactly one count. A silent default would open the run with a budget the operator never set |
| A timestamp that is not a UTC instant warns on the older arms and refuses on the field-for-field arms | The older arms accepted such rows before, so a refusal there would halt live runs. A field-for-field row cannot be written back without its own time |
| The trend advisories and pivot lifecycle rows are reserved, with no producer routed | The reducer keeps the advisories in its registry and the pivot writes its own council state log, so neither appends to the research state log |
| `state-jsonl.md` and `loop-protocol.md` change, the feature catalog does not | The upcaster's canonical names and the projection's default event names are snake_case, and camelCase is only the accepted legacy alias |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Related deep-loop sweep, widened with the review run-open, state, projections, deltas, ledger-schema and contract-compiler suites | PASS: 32 files, 578 passed, exit 0. The 26-file sweep before the review change passed 500/500. One earlier run of the same sweep had 2 timing failures in the untouched authorized ledger and fanout suites, which passed 222/222 on three isolated reruns |
| Full runtime suite (run once before the last test fix) | 165 of 167 files passed. 8 failures were a CLI test pinning the append time, since updated (30/30). 1 was a concurrency test in the untouched authorized ledger, 53/53 on three isolated reruns |
| `npm run typecheck` | PASS: exit 0 |
| Stem census | PASS: 86 registered, 23 spoken, 63 reserved, 0 violations |
| `runtime-bootstrap.test.cjs` | PASS: 9/9 |
| Comment hygiene on the changed code files | PASS: exit 0 |
| Red swap of the fourteen changed sources, workflows, contracts and docs | FAIL as intended: 38 tests across 6 files, every new one among them; restored, `cmp` identical 14/14 |
| `validate.sh --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A non-UTC timestamp on the older arms falls back to the append time.** The upcast result carries a warning, and the gateway CLI prints it.
2. **A moved review log keeps only its iteration rows in the state log.** Other legacy rows, such as `claim_adjudication`, have no review upcaster, so they stay only in `deep-review-state.legacy.jsonl` and the replay reports their count. The run open also needs the moved config to carry the fields `step_create_state_log` reads, such as `maxIterations`. A probe without it was refused with exit 1 and `Invalid closed-shape payload for deep_review.run_initialized`, so the run halts there.
3. **The config arm's blank or oversized topic is still left out rather than refused.** A string topic keeps that earlier fallback, so the projection uses the run id. Only a topic that is not a string is refused.
<!-- /ANCHOR:limitations -->

---
