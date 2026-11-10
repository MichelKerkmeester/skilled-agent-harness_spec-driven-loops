---
title: "Implementation Summary"
description: "Deep-loop counts and stop decisions now follow what ran: a redispatched iteration counts once, corrupt deltas fail closed, the state row keeps its focus, review closeout gets a bound readiness state, an unavailable executor halts the run instead of burning an iteration, confirm gates keep the lock, and bad fan-out or option input is refused up front."
trigger_phrases:
  - "deep loop state and stop policy implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/007-deep-loop-state-and-stop-policy"
    last_updated_at: "2026-11-09T00:00:00Z"
    last_updated_by: "remediation-orchestrator-a"
    recent_action: "Closed the phase with the final gate green and the review fixed"
    next_safe_action: "Start phase 008"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "orchestrator-a-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-deep-loop-state-and-stop-policy |
| **Completed** | 2026-11-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A deep loop now reports the iterations it actually ran. Replaying the reducer over child 004's log gives 20, not 22, and a run that resumes on a sparse legacy log numbers its next run past the highest existing one instead of colliding with it.

### Phase 7: deep-loop-state-and-stop-policy

The research reducer counts distinct runs, takes the highest run as the latest and refuses a corrupt delta row when existing state is required. The canonical state row keeps `focus`, `mode` and `answeredQuestions`. Review closeout receives a `release_readiness_state` derived just before it. An executor that fails on quota, capacity or auth halts the loop with the matched marker instead of writing an error iteration, and the research workflows check for it before the reducer can rewrite the state log. Confirm workflows refresh the packet lock after each operator gate. Fan-out refuses an uncapped max-iterations lineage before any spawn, and the reducer, the append gateway and the fan-out runner refuse unknown options.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Modified | Distinct-run counting, latest by run, fail-closed delta reads, unknown-option refusal |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modified | Review dashboard counts distinct runs |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/*.ts`, `lib/legacy-projections/deep-research-contract.ts` | Modified | Canonical iteration row keeps focus, mode, answeredQuestions |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modified | Executor-unavailable classifier and marker on `dispatch_failure` |
| `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs`, `fanout-run.cjs` | Modified | Unknown-option refusal; uncapped max-iterations rejected before dispatch |
| `.skilled/commands/deep/assets/deep-{research,review}-{auto,confirm}.yaml` | Modified | Distinct counts, next-run numbering, readiness binding, unavailable halt, gate lock refresh |
| `.skilled/commands/deep/assets/deep-ai-council-confirm.yaml` | Modified | Post-dispatch validation and gate lock refresh |
| `.skilled/commands/deep/assets/compiled/*.contract.markdown` | Regenerated | Digests of the edited YAMLs |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/*` | Modified/Created | Coverage for each fix, including the new `unknown-options.vitest.ts` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines ran first at the phase 006 commit. Luna workers made each fix one brief at a time, DeepSeek made two mechanical YAML edits and reviewed the diff. The review returned CONDITIONAL with one P1 and four P2; Luna fixed all five. The orchestrator regenerated the compiled contracts, then reran every baseline and the replay.

| Suite | Command | Baseline | Final |
|-------|---------|----------|-------|
| Runtime vitest | `npx vitest run --no-coverage` in `runtime/` | 173 files, 2853 passed, 8 skipped | 174 files, 2880 passed, 8 skipped, exit 0 |
| Council vitest | `npx vitest run --no-coverage` in `deep-ai-council/` | 118 passed | 118 passed, exit 0 |
| Node script tests | `node --test` on the two reducer `.test.cjs` files | 2 of 2 | 2 of 2, exit 0 |
| Spec-kit contract tests | four deep contract files in `system-spec-kit/runtime/cli` | 24 passed | 24 passed, exit 0 |
| Reducer replay | `replay-reducer.sh` on temp copies | 20, 11, 26, 22, 22 | 20, 11, 26, 20, 22 |
| Contract drift | `check-contract-drift.cjs` | n/a | `OK commands=3`, exit 0 |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep stop policy in the YAML (ADR-001) | The YAML implements it correctly; moving it is a refactor with no defect behind it |
| Number the next run as `max(highest_run, iteration_count) + 1` | Legacy logs have sparse run numbers, so a plain distinct count would reuse an existing run on resume |
| Scan stderr plus only error-shaped stdout tail lines for outage markers | A review leaf's report can name quota or auth words as findings, which must not halt the loop |
| Check executor-unavailable before the research reducer runs | The reducer can refresh the state-log projection and drop the `dispatch_failure` row |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Runtime vitest | PASS: 174 files, 2880 passed, 8 skipped |
| Council vitest | PASS: 118 passed |
| Node script tests | PASS: 2 of 2 |
| Spec-kit contract tests | PASS: 24 passed |
| Reducer replay | PASS: 004 reports 20; the other four unchanged |
| YAML parse (js-yaml) of five deep YAMLs | PASS |
| Contract drift | PASS: `OK commands=3` |
| Comment hygiene scan of added lines | PASS: only test fixture paths match |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Resume bookkeeping still reports the distinct count.** `continuedFromRun` and `continuedFromRunId` are written before `highest_run` is bound, so on a sparse legacy log they name the distinct count, not the last run number. The loop itself numbers the next run correctly.
2. **Outage text printed as plain stdout prose is no longer classified.** A CLI that reports a quota error only on stdout without an error word or an error JSON line falls back to an ordinary error iteration.
3. **The `if_other_failure` error row shares the ephemeral state-log risk.** It predates this phase and was left as is (D-10).
<!-- /ANCHOR:limitations -->

---
