---
title: "Tasks: Phase 9: research-fixes-and-core-consolidation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "research fixes and core consolidation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: research-fixes-and-core-consolidation

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

- [x] T001 Scaffold the phase folder with `create.sh --phase --parent` (this folder)
- [x] T002 Confirm each research finding against its file and line (`../research/research.md`, section 1)
- [x] T003 Write the failing tests first and prove them red on the pre-phase sources (49 node and 3 Pi failures, AC-001)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `noteState`, `resolveKillerTarget`, the incomplete-record decline and spaced-key updates, B1, A1, D1 and D2 (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`)
- [x] T005 Add `CLI_COMMAND`, `normalizeSpecFolder`, `specFolderInput`, `seedInstructions` and `nudgeDecision`, print an unknown folder empty and skip chmod on a linked directory, C1, C2, C3 and L1 (`.skilled/hooks/session-relaunch/lib/nudge.cjs`)
- [x] T006 Walk the Claude settings up to the repository root, E1 (`.skilled/hooks/session-relaunch/lib/context-usage.cjs`)
- [x] T007 Report the note state from consume, keep a valid answer from a broken note and require a real handoffs directory, D3, L3 and L1 (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`)
- [x] T008 Relaunch only an open note and decline an incomplete record with the runtime's exit code, L3, L2 and D1 (`.skilled/bin/skilled-loop`)
- [x] T009 Resolve the Claude kill target before arming and guard background tasks on every path, A1 and B4 (`.skilled/hooks/session-relaunch/claude/stop-arm.mjs`)
- [x] T010 Move the Claude, Codex, Hermes, Pi and OpenCode nudge paths onto the shared helpers, F1 and B1 (`claude/context-nudge.mjs`, `codex/shared.mjs`, `hermes/context-nudge.mjs`, `pi/session-relaunch.ts`, `.opencode/plugins/session-relaunch.js`)
- [x] T011 Add the conformance table and its Pi mirror, B3 (`tests/adapter-conformance.test.cjs`, `pi/session-relaunch.test.ts`)
- [x] T012 Correct the doc drift G1 to G5, G7, C2, C3 and L4 (session-relaunch READMEs, `handoff.md`, `ENV-REFERENCE.md`, the catalog entry, `../spec.md`, `../goal.md`)
- [x] T013 Verify G6 against the later live runs and record what is closed (`../002-pi-opencode-adapters/implementation-summary.md`)
- [x] T014 Bring the parent spec and goal to nine phases (`../spec.md`, `../goal.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run the full gate from the final state (rc 0, node 510/510, Pi 34/34; drift 4/4 run separately)
- [x] T016 Run recursive strict validation on the parent (ten RESULT: PASSED)
- [x] T017 Run comment hygiene on the changed code and tests (rc 0)
- [x] T018 Validate the touched docs with `validate_document.py` (rc 0 each) and scan the changed prose with `hvr_scan.py` (no hard blockers)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (red swap on the pre-phase sources, then byte-for-byte restore)
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-005)
- [x] CHK-002 [P0] Technical approach defined in plan.md (affected-surfaces table)
- [x] CHK-003 [P1] Dependencies identified and available (the research verification table, `ps`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (drift guards 4/4, shellcheck rc 0, tsc rc 0)
- [x] CHK-011 [P0] No console errors or warnings (suites rc 0; drift warnings are in unrelated spec scratch files)
- [x] CHK-012 [P1] Error handling implemented (an unresolved kill target leaves the record pending; a failed consume stops the hop with the manual command)
- [x] CHK-013 [P1] Code follows project patterns (Node built-ins only, comment hygiene rc 0)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (AC 7/7)
- [x] CHK-021 [P0] Manual testing complete (red swap and restore)
- [x] CHK-022 [P1] Edge cases tested (spaced key, line break in a folder, linked parent directory, `.git` file in a worktree, CLAUDE_PID outside the loop)
- [x] CHK-023 [P1] Error scenarios validated (missing, broken and claimed notes; unparseable consume output; no process below the loop)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. A1, B4, D1, D2 and E1 are instance-only; C1, C2, C3 and B1 are cross-consumer; D3, L2 and L3 are class-of-bug across consume and the wrapper; L1 is a path guard.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. A search for `CLI_COMMAND = ` lists only `nudge.cjs`; every adapter seed path calls `seedInstructions`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. See plan.md, Affected Surfaces; the consume `note` field has one reader, `skilled-loop`.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. The path guard has a linked-leaf and a linked-parent case; the folder normalizer has traversal, line-break and non-packet cases; the frontmatter fix has the spaced key.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Seven conformance cases by four node adapters is 28 rows, plus 7 in the Pi mirror.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Adapter sandboxes now delete `SYSTEM_SPEC_FOLDER`; the conformance suite restores every key it sets for the in-process plugin.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Pinned to the phase 009 commit on `worktrees/148-session-relaunch-deep-review`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (no credentials in the diff)
- [x] CHK-031 [P0] Input validation implemented (spec folders normalized before any frontmatter write)
- [x] CHK-032 [P1] Auth/authz working correctly (linked handoffs directory refused; kill target must descend from the loop)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate (each new decision states why)
- [x] CHK-042 [P2] README updated (if applicable): the concern README and the tests README
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (run scratch lives in the session scratchpad)
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-19
<!-- /ANCHOR:summary -->

---
