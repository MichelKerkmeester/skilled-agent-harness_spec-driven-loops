---
title: "Goal: Phase 22: dsh-verify-iteration-executor"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "dsh verify iteration executor goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/022-dsh-verify-iteration-executor"
    last_updated_at: "2026-11-15T08:30:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 22: dsh-verify-iteration-executor

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The post-dispatch gate every review and research iteration runs fails a non-native iteration that names no executor and passes every iteration where no executor row is written by design.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The operator asked on 2026-11-15 to make the executed post-dispatch gate check executor identity, reusing the existing `executor_missing` reason |
| D2 | The gate reads the executor kind from the run config beside the state log, so no workflow passes a new argument |
| D3 | An executor on the iteration record or on an `iteration_start` or `iteration` row of the same iteration passes, on a log with a ledger and on one without |
| D4 | Native runs, runs with no config or no executor block and fan-out lineages are not checked |
| D5 | `validateIterationOutputs` does not change |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/verify-iteration.vitest.ts` prints `Tests  39 passed (39)`, and `8 failed | 31 passed (39)` with `verify-iteration.cjs` at `HEAD`
- [x] `verify-iteration.cjs --loop-type review` on a scratch copy of the phase 019 review folder exits 0
- [x] `npm run typecheck` in the same folder exits 0 and `node scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`
- [x] The full deep-loop suite fails no test in a file this phase changed or that loads a changed module, and any other failure passes when its file runs alone
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Measure | Done | The script at `e70f6d44267` printed `OK` for the real 019 copy, the stripped copy and all five 006 iterations |
| Build | Done | One script, one test file, four workflows and two regenerated contracts, as `implementation-summary.md` lists |
| Verify | Done | Each new case failed on the old script and passed after. The full suite went from 2990 to 2998 passed with 9 skipped and no failure |
| Release and verify | Done | 2026-11-15: v1.6.30.0 written, contracts regenerated after the version bump, the 019 review copy passes the gate and fails with executor_missing once its executor is removed, and the full suite printed 2998 passed and 9 skipped of 3007 with no failure |
| Merge with the workflow consolidation | Done | 2026-11-15: origin/main merged the auto and confirm workflows into deep-review.yaml and deep-research.yaml and released v2.0.0.0. The executor_missing note carried into both files through rename detection, the release moved to v2.0.1.0 and the two contracts were regenerated |

### Deviations and findings

| Item | Note |
|------|------|
| The first baseline run was discarded | Source edits landed while it ran, so a second run with every changed file at `HEAD` is the recorded baseline |
| The no-ledger rule differs from the documented validator | Phase 021 kept the documented validator strict on a log with no ledger. This gate runs before the post-dispatch patch, so on such a log the pre-dispatch `iteration_start` row is the only executor record at gate time and has to count |
| The 006 review fails all five iterations | Its iterations ran before the executor audit landed, so none names an executor. The gate runs on each new iteration, so this only shows if an old iteration is checked again |
<!-- /ANCHOR:log -->
