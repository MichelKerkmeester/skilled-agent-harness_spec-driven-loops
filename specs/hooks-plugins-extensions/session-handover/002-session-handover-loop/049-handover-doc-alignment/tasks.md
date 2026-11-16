---
title: "Tasks: Hand-over doc alignment: fix the 58 findings of the doc alignment run and add vibe to the loop shell shim"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "handover doc alignment tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Hand-over doc alignment: fix the 58 findings of the doc alignment run and add vibe to the loop shell shim

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run the doc alignment on session-handover (`/local-doc-alignment session-handover`). Verify: `aggregate-findings.cjs` prints `findings=58 P0=1 P1=23 P2=34`.
- [x] T002 Create the worktree and this packet (`worktrees/424-handover-doc-alignment`). Verify: `git worktree list` shows 424.
- [x] T003 Split the findings by overlap with 411's rewrite. Verify: 13 findings in seven READMEs with 44 or more changed lines go to 411, 45 stay here.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add vibe to the shim and its suite (`.skilled/bin/skilled-loop-shell.sh`). Verify: shim suite prints `pass 37`, `fail 0`.
- [x] T005 Send the 13 overlapping findings to the 411 session. Verify: 411 replied that 10 were already fixed, 2 fixed in `0af73b5d4d5` and 1 waits on the shim.
- [x] T006 Merge main into 424 after 411 landed and rewrite the briefs for its renames. Verify: merge commit `e9ae420ec59`.
- [x] T007 Run the four doc briefs on DeepSeek V4.1 Flash max (G1 to G4). Verify: each lane prints `ok`, 26 files change, 3 findings left with reasons.
- [x] T008 Merge main again and resolve the version conflict to `1.3.9.0` as the operator chose. Verify: merge commit `4c5cf2e6cd4`.
- [x] T009 Review every changed line with a fresh Opus medium agent. Verify: it reports 1 P1 and 4 P2 and confirms the rest.
- [x] T010 Apply the review fixes through DeepSeek (G5). Verify: lane prints `ok` with no unapplied replacement; commit `cdfcfd079f1`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the hand-over suites on the final tree. Verify: 1041 of 1041 and OpenCode plugin 75 of 75.
- [x] T012 Run the drift guards and the mirror checks. Verify: all 4 guards pass, hook registrations and runtime mirrors in sync.
- [x] T013 Validate this packet. Verify: `validate.sh <packet> --strict` prints `RESULT: PASSED`.
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks: `bash -n` and `zsh -n` on the shim are clean
- [x] CHK-011 [P0] No console errors or warnings: the suites print `fail 0`
- [x] CHK-012 [P1] Error handling implemented: a non-session vibe command or flag runs vibe directly
- [x] CHK-013 [P1] Code follows project patterns: the vibe case mirrors the other runtimes and the wrapper's lists
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete: the Opus review read every changed line against the code
- [x] CHK-022 [P1] Edge cases tested: vibe pass-through for `-p`, `--prompt-file`, `mcp`, `config`, `update`, `--setup`
- [x] CHK-023 [P1] Error scenarios validated: removing vibe from the resolver fails the bash and zsh vibe cases
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: all are `instance-only` doc statements except the shim gap, a `cross-consumer` gap between the wrapper and the shim.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the review searched for every other shim function list and found three more, fixed in G5.
- [x] CHK-FIX-003 [P0] Consumer inventory completed: the shim's consumers are its suite and the docs that list its functions, all updated.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial cases: N/A, no such fix in this packet.
- [x] CHK-FIX-005 [P1] Matrix axes listed: runtime by launch form (interactive or pass-through) in the shim suite tables.
- [x] CHK-FIX-006 [P1] Hostile env variant executed: the Vibe adapter suite passes with and without `AI_SESSION_CHILD=1` (review).
- [x] CHK-FIX-007 [P1] Evidence pinned to commits `f3a2624d047`, `2a2965bcb38` and `cdfcfd079f1`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented: the shim still resolves only a trusted wrapper
- [x] CHK-032 [P1] Auth/authz working correctly: N/A, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate: the new shim comment states why the Vibe commands pass through
- [x] CHK-042 [P2] README updated: hand-over, bin, runtime and plugin READMEs
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: briefs and lane output live in the session scratchpad
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-16
<!-- /ANCHOR:summary -->

---
