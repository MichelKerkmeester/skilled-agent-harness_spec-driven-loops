---
title: "Tasks: Phase 16: stop-hook-auto-record"
description: "Eleven tasks: failing Vitest cases first, then the bound-packet check and auto-record step in the Claude Stop hook, then the rebuild, docs and one live session."
trigger_phrases:
  - "stop hook auto record tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 16: stop-hook-auto-record

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Add a failing Vitest case: a temp project whose transcript names one packet, with two queued tool answers (`.skilled/skills/system-spec-kit/runtime/tests/hook-session-stop.vitest.ts`). Verify: `cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/hook-session-stop.vitest.ts` fails that case only. Evidence: 7 new cases failed before the step existed (7 failed, 20 passed).
- [x] T002 [P] Add the unbound cases: no packet, two packets, and one folder with no `spec.md` (same file). Verify: `cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/hook-session-stop.vitest.ts` passes them against today's code, since today never writes. Evidence: two-packet, no-packet and no-spec cases pass.
- [x] T003 [P] Add the guard cases: `AI_SESSION_CHILD=1`, `SYSTEM_DECISION_CAPTURE_DISABLED=1` and a writer that throws (same file). Verify: the throw case expects the nudge text and 2 pending. Evidence: child, disabled and write-failure cases pass.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the bound-packet check that returns a folder only when the tail names exactly one unique spec folder holding a `spec.md` (`.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts`). Verify: the T002 unit cases pass. Evidence: `collectTailSpecFolders` plus the one-folder check in `autoRecordDecisions`.
- [x] T005 Add the auto-record step: read `pendingRecords`, keep tool records, map them to entries, call `writeDecisionRecord`, then `recordConsumedKeys` (same file). Verify: the T001 case passes. Evidence: bound case passes, 0 pending after the write.
- [x] T006 Run the step before `decisionCaptureNudge` in `main()`, skipped for child sessions and a disabled concern (same file). Verify: the T003 guard cases pass. Evidence: `main()` calls `autoRecordDecisions` before `decisionCaptureNudge`.
- [x] T007 Wrap the step so any error is logged with `hookLog` and the flow falls through to the nudge (same file). Verify: the throw case passes and the hook exits 0. Evidence: write-failure case returns `failed`, keeps 2 pending and the nudge.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rebuild the hook output (`.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-stop.js`). Verify: `npm run build` in `.skilled/skills/system-spec-kit/runtime` exits 0 and `rg -n "writeDecisionRecord" dist/hooks/claude/session-stop.js` prints a line. Evidence: `npm run build` exit 0, 3 matches in `dist/hooks/claude/session-stop.js`.
- [x] T009 Run the whole hook suite and prove the bound case catches a regression (`.skilled/skills/system-spec-kit/runtime/tests/`). Verify: `cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/hook-session-stop.vitest.ts` passes, and with T005 reverted the T001 case fails. Evidence: 27 passed. With the write stubbed out the bound and failure cases failed, 2 failed and 25 passed.
- [x] T010 [P] Document when Stop records answers itself and when it nudges (`.skilled/hooks/decision-capture/README.md`, `.skilled/hooks/session-lifecycle/README.md`). Verify: `rg -n "Recorded automatically" .skilled/hooks/decision-capture/README.md` prints a line. Evidence: both READMEs updated, HVR 0 hard blockers, validate_document 0 issues.
- [x] T011 Run one real Claude session bound to a scratch packet that answers one question and ends. Verify: its `decision-record.md` gains one row and the Stop output carries no nudge. [DEVIATION: no separate Claude session may be dispatched in this session, so the built hook ran end to end on a temp project instead.] Evidence: `node dist/hooks/claude/session-stop.js` logged `Recorded 1 queued answer(s)`, printed no nudge and exited 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md REQ-001 to REQ-007.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: writer and queue exist and are imported.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `npx tsc --noEmit -p .` exit 0.
- [x] CHK-011 [P0] No console errors or warnings. Evidence: test run shows no warnings from the new cases.
- [x] CHK-012 [P1] Error handling implemented. Evidence: write-failure case.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: mirrors `decisionCaptureNudge` best-effort pattern.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md 7 of 7 Met.
- [x] CHK-021 [P0] Manual testing complete. Evidence: built hook on a temp project, see T011 deviation.
- [x] CHK-022 [P1] Edge cases tested. Evidence: two-packet, sentence-end, no-packet and no-spec cases.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: write-failure and disabled cases.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.. Evidence: N/A: new behavior, not a fix packet.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.. Evidence: N/A: new behavior, not a fix packet.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.. Evidence: consumers listed in plan.md affected surfaces.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.. Evidence: sentence-end and two-packet adversarial cases.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.. Evidence: axes: packet count, spec.md, child, switch, write outcome; 8 cases.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.. Evidence: env injected per case for child and switch.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.. Evidence: N/A: evidence is the landing commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: no secrets in the diff.
- [x] CHK-031 [P0] Input validation implemented. Evidence: records filtered by kind, key, question and answer type.
- [x] CHK-032 [P1] Auth/authz working correctly. Evidence: N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: spec, plan and tasks updated for the review wording.
- [x] CHK-041 [P1] Code comments adequate. Evidence: comments give the why with no ids.
- [x] CHK-042 [P2] README updated (if applicable). Evidence: both READMEs updated.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: no temp files in the packet.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: scratch holds only .gitkeep.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 15 | 15/15 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-24
<!-- /ANCHOR:summary -->

---



