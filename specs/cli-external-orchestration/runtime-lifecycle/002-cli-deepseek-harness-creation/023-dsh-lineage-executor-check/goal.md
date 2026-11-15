---
title: "Goal: Phase 23: dsh-lineage-executor-check"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "dsh lineage executor check goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/023-dsh-lineage-executor-check"
    last_updated_at: "2026-11-15T09:17:31Z"
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
# Goal: Phase 23: dsh-lineage-executor-check

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The post-dispatch gate checks a CLI fan-out lineage against the executor the fan-out runner recorded, and both executor checks accept the iteration's `iteration_start` row on any log.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A CLI lineage passes when its `invocation-metadata.json` names the kind its config names, and fails with `executor_missing` when the file is absent, unreadable, names no kind or names another kind |
| D2 | A native lineage and a lineage whose config has no executor block stay unchecked. No other lineage is exempt |
| D3 | `validateIterationOutputs` takes the executor from the `iteration_start` row of a log with no ledger, and nothing else in it changes |
| D4 | No new reason, no runner change and no changelog or version bump |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Each new case in `verify-iteration.vitest.ts` and `post-dispatch-validate.vitest.ts` fails with the two source files at `HEAD` and passes with the change
- [x] `verify-iteration.cjs` passes the real `dsh-1` lineage copy and fails the same copy with no metadata file with `executor_missing`
- [x] `npm run typecheck` exits 0 and `node scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK`
- [x] The full deep-loop suite shows no failure the baseline lacks
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
| Measure | Done | The script at `e263e5481e7` printed `OK` for the `dsh-1` copy, the same copy with no metadata file and the `deepseek-1` research copy |
| Build | Done | Two source files, two test files, two workflows and two regenerated contracts, as `implementation-summary.md` lists |
| Verify | Done | The new cases printed `4 failed \| 68 passed (72)` with the sources at `HEAD` and `72 passed` after. Typecheck exit 0, drift `OK commands=2`, full suite `3013 passed \| 9 skipped (3022)` against a baseline of `3010 passed \| 9 skipped (3019)` |
| Release and verify | Done | 2026-11-15: v2.0.2.0 written, contracts regenerated after the version bump, and the full suite printed 3013 passed and 9 skipped of 3022 with no failure |

### Deviations and findings

| Item | Note |
|------|------|
| The fail-first run copied the two source files aside instead of running `git stash` | Same effect with no stash entry to manage. Both files were restored from the copies and `git diff --stat` showed the change back in place |
<!-- /ANCHOR:log -->
