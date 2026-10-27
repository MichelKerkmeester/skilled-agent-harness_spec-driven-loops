---
title: "Tasks: Phase 24: typed-command-ambiguity"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "typed command ambiguity tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 24: typed-command-ambiguity

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

- [x] T001 Reproduce the flag on the typed prompt. Verify: the live probe printed `ambiguous: true`, system-deep-loop 0.564694 over system-spec-kit 0.564693.
- [x] T002 Get an independent design review with measurements. Verify: the Opus high review scored 261 labelled prompts: 110 flagged, 202 correct, and option (d) at 78 flagged, 202 correct, 0 top changes.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Record the typed-command seed that held a skill down as `heldBelow` (`$R/lib/scorer/fusion.ts`, `types.ts`), and skip that pair in the cluster (`ambiguity.ts`). Verify: `typed-command-routing.vitest.ts` failed 2 of 8 before, 8 of 8 after.
- [x] T004 [P] Mark floored confidence as `confidenceFloored` in `confidenceFor` (`fusion.ts`, `types.ts`). Verify: `npm run typecheck` exits 0.
- [x] T005 [P] Let a floored member cluster on the score margin alone when the top is not floored, and add `wideAmbiguityMembers` (`ambiguity.ts`). Verify: with the exception switched off, `advisor-quality-049-003.vitest.ts` prints `1 failed | 17 passed (18)`; with it on, it passes.
- [x] T006 Point the low-info abstention at `wideAmbiguityMembers` (`fusion.ts`). Verify: the harness shows 0 top changes over 261 prompts.
- [x] T007 [P] Make the brief trust the scorer's boolean and name a cluster member after "vs" (`$R/lib/render.ts`, `skill-advisor-brief.ts`). Verify: `advisor-renderer.vitest.ts` passes its new precomputed and "vs" cases.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun the 261-prompt harness on the real build. Verify: flags 110 to 78, correct 202 to 202, top changes 0, and the typed prompt reads `ambiguous false`.
- [x] T009 Run the P0 regression set and the Python twin. Verify: `overall_pass: true` with no failures, and `pass=85, fail=0`.
- [x] T010 Run the full advisor suite and the live probe. Verify: 0 failed files, and the probe prints `ambiguous: false`.
- [x] T011 Validate the packet. Verify: `validate.sh --strict --recursive` on packet 054 prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every row of `acceptance-criteria.md` is Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design review**: the Opus high measurement, recorded in `implementation-summary.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md: REQ-001 to REQ-003.
- [x] CHK-002 [P0] Technical approach defined in plan.md: option (d) from the Opus high review.
- [x] CHK-003 [P1] Dependencies identified: the advisor runtime build, rebuilt before the harness and probes.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `npm run typecheck` and `npm run build` exit 0 in the advisor runtime.
- [x] CHK-011 [P0] No new warning: the build prints no TypeScript error.
- [x] CHK-012 [P1] An older payload without `ambiguous` or the new fields still renders: the brief re-derives when the flag is missing.
- [x] CHK-013 [P1] Comments carry the reason and no packet, phase or finding id.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met.
- [x] CHK-021 [P0] Manual check: the 261-prompt harness on the real build gives 202 correct, 0 top changes, 78 flags.
- [x] CHK-022 [P1] Edge cases tested: both floored, floored within the score margin, a held member, the wide set.
- [x] CHK-023 [P1] Error scenario: the low-info abstention still sees a floored skill, so it cannot top an under-specified prompt.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding class: `class-of-bug`, a floor counted as a tie for every task prompt.
- [x] CHK-FIX-002 [P0] Same-class producers: every floor branch in `confidenceFor` sets the mark; the adjacent-confidence uncertainty bump (`fusion.ts`) shares the noise and is recorded as a limitation.
- [x] CHK-FIX-003 [P0] Consumers: scorer flag, brief renderer, hook CLI fallback, brief builder and the low-info abstention; the Python twin path re-derives and is recorded.
- [x] CHK-FIX-004 [P0] N/A: no path, parser or redaction change.
- [x] CHK-FIX-005 [P1] Matrix: top floored or not, by member floored or not, by score gap inside or outside 0.05.
- [x] CHK-FIX-006 [P1] N/A: the change reads no process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the diff from `67de07d7ff` to this phase's commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: the diff adds none.
- [x] CHK-031 [P0] N/A: no new input; the new fields are optional and typed.
- [x] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same three parts: held pair, floor exception, brief.
- [x] CHK-041 [P1] Code comments say why a floor is not a tie and why the brief trusts the scorer.
- [x] CHK-042 [P2] README: N/A, no README describes these internals.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files stayed in the session scratchpad.
- [x] CHK-051 [P1] `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->
