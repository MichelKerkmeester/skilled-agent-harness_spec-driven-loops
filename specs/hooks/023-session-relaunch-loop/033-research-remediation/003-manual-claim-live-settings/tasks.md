---
title: "Tasks: Phase 3: manual-claim-live-settings"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "manual claim live settings tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: manual-claim-live-settings

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

- [x] T001 Confirm phases 001 and 004 are Complete (`../001-model-effort-atomic-replay/`, `../004-manual-claim-goal-binding/`). Both spec.md files read Status Complete
- [x] T002 Record baseline pass and fail counts of both test commands in plan.md §5. Node 915 of 915, vitest 59 of 59 (`scratch/baseline-suite.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write failing tests "manual command carries the live model and effort" (AC-001), "Cursor manual command carries the live Cursor model" (AC-002) and "manual command after a model-switching hop carries the current hop's model" (AC-005), and see them fail. Add "manual command keeps the launch model for an invalid live model" (AC-004) as a regression guard: it passes today and must pass before and after (`.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`)
- [x] T004 Add a helper that rebuilds the template and the conflict check from the consumed live model and effort with `model_is_valid`, phase 001's single effort-rule function and `shell_quote_argument`, inside a command substitution so the `launch_arguments` reset never reaches the current shell (`.skilled/bin/skilled-loop`). Done as `read_consumed_live_settings` and `apply_consumed_live_settings`
- [x] T005 Call the helper before every post-consume `print_manual_command`, at `:711`, `:717`, `:726`, `:746`, `:876` and `:889` (`.skilled/bin/skilled-loop`). The helper runs inside `print_manual_command`, so all seven calls, the withdrawn decline's among them, use it
- [x] T006 After the live settings block (about `:828`) and before `build_relaunch_arguments "$launch_prompt"` (about `:829`), rebuild the template from the current settings, re-export `SKILLED_LOOP_MANUAL_TEMPLATE` and recompute `manual_template_conflict`, so the next hop's in-session hop-cap command (`session-relaunch.cjs:516`) is current too (`.skilled/bin/skilled-loop`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run both test commands; new tests pass, the AC-004 guard still passes, existing manual command tests pass unedited. Node 920 of 921 (the one failure is phase 006's CLI test), vitest 59 of 59 (`scratch/final-suite.txt`)
- [x] T008 No live proof required; note that in implementation-summary.md
- [x] T009 Mark acceptance-criteria.md rows with evidence and update spec, plan and tasks
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every acceptance-criteria.md row Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md section 4, REQ-001 to REQ-006
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md section 3, the hop path and the print path
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: phases 001 and 004 Complete; `live_model_voids_launch_effort` takes the live provider as its fifth argument
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `bash -n` exit 0 and `shellcheck -S warning` exit 0 on skilled-loop
- [x] CHK-011 [P0] No console errors or warnings. Evidence: full node suite 920 of 921 with the one failure owned by phase 006, vitest 59 of 59; the print path adds no warning lines
- [x] CHK-012 [P1] Error handling implemented. Evidence: `read_consumed_live_settings` resets all three values when the record is empty or the read fails, so the current template stands
- [x] CHK-013 [P1] Code follows project patterns. Evidence: same inline `node -e` and NUL-separated read shape the decision reader uses; `model_is_valid`, `effort_is_valid` and `live_model_voids_launch_effort` reused
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md AC-001 to AC-005 Met
- [x] CHK-021 [P0] Manual testing complete. Evidence: stub-runtime tests drive the real wrapper; no live proof required by plan.md section 5
- [x] CHK-022 [P1] Edge cases tested. Evidence: invalid live model, live placeholder, a later decline with no live values after a switching hop, Cursor bracketed model
- [x] CHK-023 [P1] Error scenarios validated. Evidence: empty consumed record (consume of no record) falls back to the current hop's template, covered by the switching-hop test
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.. Evidence: `cross-consumer`: the wrapper's prints and the CLI hop-cap print and killer notice read the same exported template
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.. Evidence: `scratch/inventories.txt`: the template is produced only at startup and on each hop, and the per-print local override
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.. Evidence: `scratch/inventories.txt`: consumers are `print_manual_command` (seven calls) and the core reads in `relaunch-core.cjs`; the README sentence that says the first launch builds the template is now stale and outside this phase
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.. Evidence: a live model with a leading dash and one holding the placeholder are tested; no path or redaction change
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.. Evidence: axes: path (hop re-export, per-print rebuild) by live value (valid model and effort, invalid model, placeholder model, none) by runtime (Claude, Cursor): five rows tested
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.. Evidence: each sandbox deletes the inherited `SKILLED_LOOP_*` values, and every rebuild runs in a subshell so the next relaunch's settings stay untouched (the existing relaunch argv tests, which run through the hop re-export, pass unedited)
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.. Evidence: working tree on HEAD `65f37f5d70`, uncommitted; files listed in implementation-summary.md
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: none added
- [x] CHK-031 [P0] Input validation implemented. Evidence: live values pass `model_is_valid` or `effort_is_valid` before they reach the template; quoting stays with `shell_quote_argument`
- [x] CHK-032 [P1] Auth/authz working correctly. Evidence: not applicable, local tooling with no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: deviations recorded in implementation-summary.md Key Decisions and Known Limitations
- [x] CHK-041 [P1] Code comments adequate. Evidence: comments state the why only, no spec or phase ids
- [x] CHK-042 [P2] README updated (if applicable). Evidence: not updated: README line 17 is outside this phase's write scope, named in implementation-summary.md
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: evidence under `scratch/`
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: only evidence files remain in scratch/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---



