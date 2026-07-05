---
title: "Tasks: Phase 23: p2-hardening"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal plugin p2 hardening tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/023-p2-hardening"
    last_updated_at: "2026-07-04T09:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored tasks from spec and plan"
    next_safe_action: "Dispatch implementation to cli-opencode executor"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-023-p2-hardening-20260704"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 23: p2-hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run `node --test .opencode/plugins/tests/*.test.cjs` fresh; paste baseline pass/fail counts

  Evidence:
  ```text
  1..104
  # tests 104
  # pass 104
  # fail 0
  # duration_ms 2296.4665
  ```

- [x] T002 `rg -n "startedAtMs|activeWallMs|maxWallMs" .opencode/plugins/mk-goal.js` and `rg -n "markGoalStatus\(|resumeGoal\(" .opencode/plugins/mk-goal.js .opencode/plugins/tests`; paste the wall-time read sites and every status call site so the F024/F019 changes account for all of them

  Evidence:
  ```text
  249:    maxWallMs: normalizePositiveInt(
  250:      options.maxWallMs,
  1032:    startedAtMs: Number.isFinite(rawGoal.startedAtMs) ? Math.max(0, Math.trunc(rawGoal.startedAtMs)) : createdAtMs,
  1411:    startedAtMs: timestamp,
  1993:  if (timestamp - goal.startedAtMs >= options.maxWallMs) return 'wall_clock_cap_reached';
  2320:  const wallElapsedMs = Math.max(0, nowMs(options) - goal.startedAtMs);
  2321:  const remainingWallMs = Math.max(0, options.maxWallMs - wallElapsedMs);
  2340:    `max_wall_ms=${options.maxWallMs}`,
  .opencode/plugins/mk-goal.js:1500:async function markGoalStatus(sessionID, status, rawOptions = {}) {
  .opencode/plugins/mk-goal.js:1530:async function resumeGoal(sessionID, rawOptions = {}) {
  .opencode/plugins/mk-goal.js:1531:  return markGoalStatus(sessionID, 'active', {
  .opencode/plugins/mk-goal.js:1543:  return resumeGoal(normalizedSessionID, rawOptions);
  .opencode/plugins/mk-goal.js:2437:      const goal = await markGoalStatus(sessionID, 'complete', options);
  .opencode/plugins/mk-goal.js:2441:      const goal = await markGoalStatus(sessionID, 'paused', {
  .opencode/plugins/mk-goal.js:2448:      const goal = await resumeGoal(sessionID, options);
  .opencode/plugins/tests/mk-goal-supervisor.test.cjs:418:  const pausedResult = await helpers.markGoalStatus(pausedGoal.sessionId, 'paused', { stateDir, nowMs: 2000 });
  .opencode/plugins/tests/mk-goal-supervisor.test.cjs:426:  const completeResult = await helpers.markGoalStatus(completeGoal.sessionId, 'complete', { stateDir, nowMs: 4000 });
  .opencode/plugins/tests/mk-goal-supervisor.test.cjs:430:    helpers.markGoalStatus(completeGoal.sessionId, 'active', { stateDir, nowMs: 5000 }),
  .opencode/plugins/tests/mk-goal-supervisor.test.cjs:434:    helpers.markGoalStatus(completeGoal.sessionId, 'paused', { stateDir, nowMs: 6000 }),
  ```

- [x] T003 `rg -n "statSync" .opencode/plugins/mk-goal.js`; paste the current call/import sites for F021

  Evidence:
  ```text
  13:import { statSync } from 'node:fs';
  2057:      if (statSync(resolvedDirectory).isDirectory()) directory = resolvedDirectory;
  ```
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [REQ-001] Write the wall-clock resume-after-gap regression test (create goal, advance injected clock near cap, pause, advance clock well past cap, resume, assert NOT `wall_clock_cap_reached` and remaining wall budget reflects only pre-pause active time); run against CURRENT code and paste the RED failure

  RED evidence:
  ```text
  not ok 18 - paused wall-clock time is not charged after resume
  Expected values to be strictly equal:
  + actual - expected
  + 'suppressed'
  - 'fired'
  ```

- [x] T005 [REQ-001] Implement `activeWallMs` accounting: accumulate `now - startedAtMs` into `activeWallMs` on transition to `paused`; rebase `startedAtMs = now - (activeWallMs || 0)` on transition back to `active`; default `activeWallMs` to 0 in `readGoal` normalization (migration-safe). Paste the GREEN run

  GREEN evidence:
  ```text
  ok 18 - paused wall-clock time is not charged after resume
  1..84
  # tests 84
  # pass 84
  # fail 0
  ```

- [x] T006 [REQ-002] Write the budget-recovery tests: (a) raise budget then resume a `budget_limited` goal ends `active`; (b) resume without raising budget stays `budget_limited`/rejected. Run against CURRENT code, paste the RED failure

  RED evidence:
  ```text
  not ok 27 - budget-limited goals resume only after the budget is raised
  'STATUS=FAIL ACTION=resume ERROR="Cannot transition goal status from budget_limited to active"\n' +
    'code=INVALID_STATUS_TRANSITION'
  ```

- [x] T007 [REQ-002] Implement guarded recovery: add `active` to `STATUS_TRANSITIONS.budget_limited` and `budget_limited` to `resumeGoal.allowedFrom`, but reject/return-unchanged when the source is `budget_limited` and `budgetWasCrossed(tokensUsed, tokenBudget)` is still true. Paste the GREEN run

  GREEN evidence:
  ```text
  ok 27 - budget-limited goals resume only after the budget is raised
  1..84
  # tests 84
  # pass 84
  # fail 0
  ```

- [x] T008 [REQ-004] Write per-delimiter role-neutralization tests (`system = ...`, `developer -> ...`, `assistant → ...`, plus the existing colon case, plus a non-role `=`/`->` control). Run against CURRENT code, paste the RED failure

  RED evidence:
  ```text
  not ok 69 - non-colon role delimiters are sanitized without changing ordinary operators
  The input did not match the regular expression /system-role: do X/.
  objective: system = do X
  ```

- [x] T009 [REQ-004] Widen the role-label delimiter class in `sanitizeInlineText` from `:` to `(?::|=|->|→)`, keeping the role allowlist and rewrite target unchanged. Paste the GREEN run

  GREEN evidence:
  ```text
  ok 69 - non-colon role delimiters are sanitized without changing ordinary operators
  1..84
  # tests 84
  # pass 84
  # fail 0
  ```

- [x] T010 [P] [REQ-003] Extend `redactEvidence` with Google API key, PEM private-key block, and length/entropy-gated generic hex/base64 patterns (PEM rule before line-collapsing). Add a table test: each new format redacted; a short commit sha and ordinary prose are NOT over-redacted

  Evidence: `verifier evidence redacts common key blocks and high-entropy secrets conservatively` passed in the targeted 84/84 run and final 110/110 run.

- [x] T011 [P] [REQ-005] In `retryAfterDeadlineFromValue`, apply the `>1e12 ⇒ absolute` branch only when `unit` is null/unknown; honor `unit='s'` (delta seconds) and `unit='ms'` strictly. Add the `unit='s'` large-value test; confirm existing cases unchanged

  Evidence: pre-fix failed with actual `1000000000001` vs expected `1000000000006000`; post-fix `retry-after parsing honors explicit units before epoch heuristics` passed in targeted 84/84 and final 110/110.

- [x] T012 [P] [REQ-006] Make `buildPromptAsyncOptions` async, replace `statSync(...).isDirectory()` with `await stat(...)` in try/catch, `await` it at the call site, drop the unused `statSync` import; run the existing continuation tests

  Evidence: `rg -n "statSync" .opencode/plugins/mk-goal.js` produced no output; continuation tests passed in targeted 84/84 and final 110/110.

- [x] T013 [P] [REQ-007] Surface the caught errors in `appendGoalJsonl` and `sweepOrphanedActiveStates` under `MK_GOAL_DEBUG` via a direct `process.stderr` write (NOT through `appendGoalJsonl`); keep silent no-throw behavior when debug is off. Add an unwritable-dir fixture test toggling `MK_GOAL_DEBUG`

  Evidence: pre-fix fault-injection failed with empty stderr; post-fix `debug mode surfaces swallowed append and orphan sweep errors without throwing` passed in targeted 84/84 and final 110/110.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Fresh full-suite run; paste output; confirm zero regressions vs T001 baseline plus the new passing tests

  Evidence:
  ```text
  Baseline: # tests 104, # pass 104, # fail 0
  Final:    # tests 110, # pass 110, # fail 0
  Delta:    +6 tests, +0 failures
  ```

- [x] T015 Confirm each RED/GREEN pair (T004/T005, T006/T007, T008/T009) genuinely failed on pre-fix code; paste the RED excerpts

  Evidence: T004, T006, and T008 include the pre-fix RED excerpts for the three mandatory RED/GREEN fixes.

- [x] T016 `rg -n "statSync" .opencode/plugins/mk-goal.js` shows no continuation-path call (REQ-006); paste result

  Evidence:
  ```text
  (no output)
  ```

- [x] T017 `node --check` on `mk-goal.js` and every touched test file; `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh .opencode/plugins/mk-goal.js`; `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/plugins`; paste results

  Evidence:
  ```text
  node --check .opencode/plugins/mk-goal.js: no output
  node --check .opencode/plugins/tests/mk-goal-continuation.test.cjs: no output
  node --check .opencode/plugins/tests/mk-goal-lifecycle.test.cjs: no output
  node --check .opencode/plugins/tests/mk-goal-state.test.cjs: no output
  node --check .opencode/plugins/tests/mk-goal-supervisor.test.cjs: no output
  python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh .opencode/plugins/mk-goal.js: no output
  [alignment-drift] PASS
  Scanned files: 18
  Findings: 0
  Errors: 0
  Warnings: 0
  Violations: 0
  ```

- [x] T018 Update `checklist.md` per-REQ rows with evidence; write `implementation-summary.md`; set this phase's spec.md Status to Complete; run `SPECKIT_VALIDATE_LEGACY=1 bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/032-goal-opencode-plugin/023-p2-hardening --strict` (Errors: 0; benign ANCHORS_VALID warning expected)

  Evidence: checklist.md updated; implementation-summary.md created; spec.md status set to Complete. Strict validation ran and reported the expected benign ANCHORS_VALID warning plus `GENERATED_METADATA_INTEGRITY: graph-metadata.json SOURCE_FINGERPRINT_MISMATCH`; generated metadata is outside the approved write paths and is orchestrator-owned post-dispatch.

  Validation output excerpt:
  ```text
  ✓ FILE_EXISTS: All required files present for Level 2
  ✓ TEMPLATE_HEADERS: All template headers match in 5 file(s)
  ⚠ ANCHORS_VALID: 2 non-blocking anchor deviation(s) in 5 file(s)
  ✗ GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
      - graph-metadata.json: SOURCE_FINGERPRINT_MISMATCH: source_fingerprint does not match a re-derive of the current source docs, the stored derived fields may be stale
  Summary: Errors: 1  Warnings: 2
  RESULT: FAILED
  ```
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Finding source**: `../review/review-report.md` section 10 and `../review/lineages/kimi-review/review-report.md`
<!-- /ANCHOR:cross-refs -->
