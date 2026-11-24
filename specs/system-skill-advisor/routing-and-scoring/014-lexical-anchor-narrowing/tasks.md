---
title: "Tasks: Narrow the advisor's shared lexical anchor so two generic words no longer lift a skill to the task-intent floor"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "lexical anchor narrowing tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Narrow the advisor's shared lexical anchor so two generic words no longer lift a skill to the task-intent floor

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`R` is `.skilled/skills/system-skill-advisor/runtime`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Baseline the ratchet and the five probes on HEAD. Verify: probes match `spec.md`. Evidence: identical lines; metrics full 161, unknown 14.
- [x] T002 Trace each probe lift to its anchor clause (temporary trace in `$R/lib/scorer/fusion.ts`, removed). Verify: a clause per lift. Evidence: the attribution table in `implementation-summary.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Candidate A: sharing-capped anchor, anchored direct lift, literal id-noun companion (`$R/lib/scorer/fusion.ts`, `lanes/lexical.ts`, `scoring-constants.ts`). Verify: probes, ratchet, suite. Evidence: probes pass, ratchet unchanged, 7 pinned tests move.
- [x] T004 Candidate B: A without the direct-lift rule. Verify: same. Evidence: 4 pinned tests move.
- [x] T005 Candidate C: sharing counted over skills only. Verify: same. Evidence: probes pass, 5 pinned tests move.
- [B] T006 Land a rule that holds every pin. Blocked: no candidate does (Q012).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Restore the advisor source and rebuild `dist`. Verify: `git status` under `$R`. Evidence: no change.
- [ ] T008 Replay the browser hub after a landed rule. Verify: only MBU-PB-04 fails. Waits on T006.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision**: See `decision-record.md` (Q012)
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-003.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: sections 1 to 4.
- [x] CHK-003 [P1] Dependencies identified. Evidence: the pinned slices named in `spec.md` risks.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Each candidate typechecked. Evidence: `npm run typecheck` printed no error.
- [x] CHK-011 [P0] No trace code left. Evidence: the advisor source is at HEAD.
- [ ] CHK-012 [P1] A landed rule carries its why in comments. Waits on T006.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Blocked: no rule landed.
- [x] CHK-021 [P0] Manual testing complete for each candidate. Evidence: probe files per variant.
- [x] CHK-022 [P1] Edge cases tested. Evidence: the doctor prompt that must keep its lift.
- [x] CHK-023 [P1] Failure scenarios found. Evidence: the moved pinned rows per candidate.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: no code landed.
- [x] CHK-031 [P0] Input handling: N/A. Scoring rule only.
- [x] CHK-032 [P1] Auth and authz: N/A.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree. Evidence: all three name the block.
- [x] CHK-041 [P1] Findings recorded. Evidence: `implementation-summary.md`.
- [ ] CHK-042 [P2] Advisor changelog. Waits on a landed rule.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch only. Evidence: probe harness in the session scratchpad; candidate C source in `scratch/` on purpose.
- [x] CHK-051 [P1] Session scratch cleaned of trace edits. Evidence: advisor source at HEAD.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 7/8 |
| P1 Items | 9 | 8/9 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-24
<!-- /ANCHOR:summary -->
