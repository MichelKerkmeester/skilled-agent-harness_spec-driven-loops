---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "deterministic stop decision implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/001-deterministic-stop-decision"
    last_updated_at: "2026-11-14T14:03:38Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 001 with every acceptance row met"
    next_safe_action: "Implement phase 002, which derives the loop counters from the state log"
    packet_purpose: "Purpose: A runtime script computes the whole stop decision and its reason, and the workflows only branch on its output."
    blockers: []
    key_files:
      - "specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/001-deterministic-stop-decision/tasks.md"
      - "specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/001-deterministic-stop-decision/goal.md"
      - ".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs"
      - ".skilled/commands/deep/assets/deep-research-auto.yaml"
      - ".skilled/commands/deep/assets/deep-review-auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-deterministic-stop-decision"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "8530dc01-d681-4a14-8056-3f989bdfe568"
      workspace: "/Users/michelkerkmeester/worktrees/public/382-deep-loop-workflow-logic-hardening"
      savedAt: "2026-11-14T14:03:38Z"
      locatorKind: "transcript_path"
      version: 1
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-deterministic-stop-decision |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The deep-research and deep-review loops now get their stop decision from one script call. The same config, state log and registry always give the same decision and the same stop reason, in auto and confirm mode alike.

### Phase 1: deterministic-stop-decision

Before this phase the stop vote lived as prose in four workflow files, so the model running the loop did the arithmetic and could reach a different answer on the same state. `convergence.cjs --stop-decision` now computes the signals, the review thresholds, the research quality guards, the nine review legal-stop gates and the graph rule, and prints one `stop_decision` object. Each workflow calls it once per iteration and only branches on that object.

You get one stop-reason list of eight values, with the finer cause in `reasonDetail`. The review vote follows the configured `convergenceThreshold` instead of two fixed numbers. A missing graph decision blocks every non-terminal stop in both loops, and the iteration cap is decided before the claim-adjudication veto.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Modified | Six pure stop-decision functions and the `--stop-decision` mode that reads the config, state log and registry |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/lifecycle-taxonomy.cjs` | Modified | `maxDurationReached` joins the frozen stop reasons |
| `.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-research-confirm.yaml`, `deep-review-auto.yaml`, `deep-review-confirm.yaml` | Modified | The convergence step branches on `stop_decision`, the stuck counter follows `0.5 x convergenceThreshold`, and the divergent pivot receives `reason_detail` |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`, `deep-review.contract.markdown` | Modified | Rebuilt from the new workflow files |
| `.skilled/skills/system-deep-loop/deep-research/SKILL.md` | Modified | The stop-reason line names the eight frozen values |
| `runtime/tests/unit/stop-decision.vitest.ts` | Created | 61 pure-function cases |
| `runtime/tests/unit/stop-decision-yaml-contract.vitest.ts` | Created | 22 cases that pin the four convergence steps |
| `runtime/tests/integration/convergence-script.vitest.ts` | Modified | 12 command-line cases for `--stop-decision` |
| `runtime/tests/integration/review-depth-convergence.vitest.ts` | Modified | Two text checks removed, because the fallback gate rule left the workflow text |
| `runtime/tests/unit/lifecycle-taxonomy.vitest.ts` | Modified | Expects the eighth stop reason |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Each change was written as one literal brief and dispatched to DeepSeek V4.1 Flash at max effort through `opencode run` on the `llmgateway` provider, twelve dispatches in all. The orchestrating session read every diff and reran every check before a commit. Tests came first: the unit, command-line and contract tests each failed on the old tree before the code that makes them pass existed.

The work landed in four commits on branch `worktrees/382-deep-loop-workflow-logic-hardening`: `d71b104883` (the eighth stop reason), `d9a4cec88a` (the pure functions), `66a0247df0` (the script mode) and `95c295ac77` (the four workflows, the contract test and the rebuilt command contracts). Nothing is pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Extend `convergence.cjs` instead of adding a second script | One graph read per iteration stays one process per iteration |
| Fine causes travel in `reasonDetail` | The frozen stop-reason list stays at eight values while the divergent pivots still see `all_dimensions_clean` and `composite_converged` |
| The stuck count arrives as a `--stuck-count` flag for now | Nothing persists it yet. Phase 002 derives it from the state log and removes the flag |
| The fallback gate rule is tested by running the script | The rule moved out of the workflow text, so a text match on the workflow file could only pin a second copy that would drift |
| `sourceDiversity`, `focusAlignment` and `singleWeakSource` report `notEvaluated` when their input is absent | A guard with no input cannot fail a stop honestly, and it must not pass silently either |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Full runtime suite, `node_modules/.bin/vitest run --no-coverage` in the runtime folder | PASS: 175 test files, 2986 passed, 8 skipped, 0 failed. Baseline on `4fa6dc4778`: 173 files, 2891 passed, 0 failed. The 95 added tests are 61 unit, 12 command-line and 22 contract |
| The four phase test files plus the contract-drift, render and taxonomy files, after commit `95c295ac77` | PASS: 8 files, 170 passed |
| `npm run typecheck` in the runtime folder | PASS: exit 0 |
| `check-contract-drift.cjs` | PASS: `[CONTRACT DRIFT] OK commands=3` |
| `rg -n '0\.08\|0\.05\b\|Skip hard stops'` on the review workflows, `rg -n 'checkQualityGuards\|graph_decision is absent'` on the research workflows | PASS: both print nothing |
| `rg -c 'runtime/scripts/convergence\.cjs'` on the four workflows | PASS: 1 per file |
| `fanout-pool.vitest.ts` "does not orphan an exited-but-still-writing worker" | Failed once in an earlier full run, passed alone (42 of 42) and in the final full run. The phase changes no fan-out file. It is a timing-sensitive test with a 15 ms grace window |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The single-weak-source guard has no input.** No state doc or runtime file defines `sourceStrength`, so the guard reports `notEvaluated` and never blocks. It starts working when a field that marks a tentative source exists.
2. **The stuck count is not derived yet.** The workflows pass it as `--stuck-count`, held in orchestrator memory. Phase 002 replaces the flag with a count read from the state log.
3. **A research run with an empty graph runs to its cap.** A graph result of `CONTINUE` now vetoes `all_questions_answered`. `reasonDetail` names the cause on every iteration. `deep-research/references/convergence/convergence.md` §3 step 7 still says otherwise until phase 005 aligns it.
4. **The fallback gate is skipped when no coverage mode is recorded.** A registry with no `graphCoverageMode` leaves `graphlessFallbackGate` unevaluated instead of failed.
<!-- /ANCHOR:limitations -->

---


