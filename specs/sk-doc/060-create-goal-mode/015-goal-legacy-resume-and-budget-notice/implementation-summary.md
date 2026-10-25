---
title: "Implementation Summary"
description: "An older suppressed goal now resumes and the budget option says it ends nothing. The live autonomy run was a SKIP: the model provider returned a quota error."
trigger_phrases:
  - "goal legacy resume budget notice implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/015-goal-legacy-resume-and-budget-notice"
    last_updated_at: "2026-10-24T19:40:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Built resume and budget notice; live run skipped on a quota error"
    next_safe_action: "Rerun the live autonomy run with a model that has quota, then close AC-002"
    blockers: []
    key_files:
      - ".opencode/plugins/opencode-goal.js"
      - ".opencode/plugins/tests/opencode-goal-lifecycle.test.cjs"
      - ".opencode/plugins/tests/opencode-goal-capabilities.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-15-goal-legacy-resume-and-budget-notice"
      parent_session_id: null
    completion_pct: 85
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
| **Spec Folder** | 015-goal-legacy-resume-and-budget-notice |
| **Completed** | Not completed: AC-002, the live run, is a SKIP |
| **Level** | 2 |
| **Status** | In Progress |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/goal-opencode resume` now releases an active OpenCode goal that an older plugin version suppressed with a retired reason, and a recorded `--budget` prints one notice line. Limitation 2 in the phase 14 summary now names the cleanup that really exists. The live autonomy run did not happen: the model provider answered with a 402 quota error, so that part is a SKIP.

### Phase 15: goal-legacy-resume-and-budget-notice

You get a stuck goal that comes back with the normal resume command, a `notice=` line that says a budget is a reading only, and a correct limitation note. You do not yet get a live run of the autonomy switch past the old 8-turn cap.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/opencode-goal.js` | Modified | A retired-reason set, resume releasing an active goal suppressed for one of them, and the `notice=` line on `set` and `bind` when a budget is passed |
| `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` | Modified | Three tests: legacy-suppressed records resume and then continue, an unknown reason is left alone, a plain active goal still refuses resume |
| `.opencode/plugins/tests/opencode-goal-capabilities.test.cjs` | Modified | One test: the budget notice appears once on `set` with a budget, and not without one or on a re-set |
| `.skilled/hooks/goal/goal-plugin.md` | Modified | Resume wording, the `notice` output field and the budget sentence |
| `.skilled/commands/goal-opencode.md` | Modified | The budget notice and the resume wording |
| `specs/sk-doc/060-create-goal-mode/014-goal-no-budget-stop/implementation-summary.md` | Modified | Limitation 2 corrected |
| `scratch/live-run-skip.txt`, `scratch/plugin-harness-run.mjs`, `scratch/plugin-harness-output.txt`, `scratch/gate-summary.txt` | Created | The live-run SKIP record, a no-model plugin harness run and the gate totals |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The retired reasons come from the phase 14 diff: `auto_turn_cap_reached` and `wall_clock_cap_reached` were written while the goal stayed `active`, and `budget_exhausted` and `token budget reached` came with the old budget stop. Resume already handled the `budget_limited` status. The tests were written first and run against the unchanged plugin: the two behavior tests failed and the two guard tests passed by design (56 tests in the two files, 54 passed). Resume then got one extra allowance inside the existing locked status change, so it adds no read. The budget notice is built from the budget the caller passed, so a re-set that keeps a stored budget prints none.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `--budget` with a notice | The docs and playbooks still pass it, and a notice costs one line where removal breaks callers |
| Clear only a suppression with a retired reason | A pause the operator set on purpose must stay |
| Operator-default decision: keep `--budget` and print a notice | The open question is closed as "keep with notice", so no caller breaks and the operator is told once that the figure ends nothing |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test --test-reporter=tap .opencode/plugins/tests/opencode-goal-*.test.cjs` | Baseline 151 of 151, exit 0. Final 155 of 155, exit 0 (four new tests) |
| `node --test --test-reporter=tap .skilled/hooks/goal/lib/goal-core.test.cjs` | Baseline 87 of 87, exit 0. Final 87 of 87, exit 0 |
| Negative control, new tests against the unchanged plugin | The resume test and the budget notice test failed, as intended |
| `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` | Exit 0, all 4 guards passed, 10 non-blocking warnings |
| Live OpenCode run, autonomy on and off | SKIP. `opencode run` returned `provider.quota` 402 (`scratch/live-run-skip.txt`) |
| No-model plugin harness (`scratch/plugin-harness-output.txt`) | Autonomy on: 12 idle events, 12 `promptAsync` calls, `continuation_attempts=12`. Autonomy off: 3 idle events, 0 calls. Not a live run |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` | See the final report for the literal result line |
| `.opencode/plugins/tests/goal-doc-contract.test.cjs` | One test fails, and it failed before this phase: the goal-hook playbook states 152/152 where the suite had 151 and now has 155 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The live autonomy run is a SKIP.** The default model route returned a 402 daily-allowance error and no other model was substituted without approval, so AC-002 is Unmet. The harness run shows the counter at 12 with autonomy on, but it calls no model and so supports the claim without proving it.
2. **The goal-hook playbook states a stale suite count.** `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md` says 152/152 on three lines where the suite now reports 155. The file is outside this phase's list, so it is left for the operator.
3. **`--budget 0` is rejected, not recorded.** The plugin and the command doc fail it with `INVALID_TOKEN_BUDGET`, as before, so the edge case in the spec that says it is recorded with a notice does not hold.
4. **An unreadable record is not covered by a new test.** Resume reports it through the existing failure path, which this phase did not change.
<!-- /ANCHOR:limitations -->

---
