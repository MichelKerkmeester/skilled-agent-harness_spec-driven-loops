---
title: "Tasks: Phase 13: live-hop-and-notice-reason"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "live hop and notice reason tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 13: live-hop-and-notice-reason

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
- [x] T002 Extend the two notice tests and see them fail on the current killer (`tests/killer.test.cjs`)
- [x] T010 Write the outside-loop conformance case and the Pi mirror and see all five fail on the current core (`tests/adapter-conformance.test.cjs`, `pi/session-relaunch.test.ts`)
- [x] T011 Write the shim tests for bash and zsh and see all 14 fail before the shim exists (`tests/skilled-loop-shell.test.cjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Timeout title and template-problem subtitle in the notice (`lib/killer.cjs`)
- [x] T004 Notice title and subtitle in the concern README (`.skilled/hooks/session-relaunch/README.md`)
- [x] T005 Timeout scenario title match and evidence (`manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md`)
- [x] T006 [P] Run one live Claude relaunch hop under `skilled-loop` in tmux and record the evidence (loop 26027, note done)
- [x] T012 Stop the nudge outside the loop in the shared decision (`lib/nudge.cjs`)
- [x] T013 Give the tests that relied on a nudge outside the loop a loop id, and rewrite the two OpenCode cases that tested the old outside-loop branch (`tests/*.test.cjs`, `.opencode/plugins/tests/session-relaunch.test.cjs`, `pi/session-relaunch.test.ts`)
- [x] T014 Build the shell shim from each runtime's `--help` (`.skilled/bin/skilled-loop-shell.sh`)
- [x] T015 Update every doc that describes starting the loop or the nudge (READMEs, feature catalog, playbooks, env reference, `/speckit:handoff`)
- [x] T016 [P] Run live hops through the shim in a repository that links `.skilled` (Claude, Codex, Pi, OpenCode and Hermes from AI Systems)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the gate from the final state (node 566/566, rc 0)
- [x] T008 Swap in the pre-phase killer and prove the notice tests red, then restore (2 of 2 failing; `cmp` clean)
- [x] T009 Run strict validation on this folder and the parent once the live hop is recorded
- [x] T017 Rerun the gate from the final state (node 584/584 rc 0, Pi 40/40 rc 0, `tsc` rc 0, shellcheck rc 0, drift guards 4/4)
- [x] T018 Swap in HEAD's `nudge.cjs` and plugin with the shim moved aside, prove the new tests red, then restore (5/5, 1/1 and 14/14 failing, `cmp` clean)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (the live hops)
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-004)
- [x] CHK-002 [P0] Technical approach defined in plan.md (affected-surfaces table)
- [x] CHK-003 [P1] Dependencies identified and available (`manualTemplateProblem`; the live hop's login and tmux were available)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (`node --check` rc 0, comment hygiene rc 0 with a planted-path negative control at rc 1, shellcheck rc 0 on the wrapper and the shim, drift guards 4/4)
- [x] CHK-011 [P0] No console errors or warnings (suite rc 0)
- [x] CHK-012 [P1] Error handling implemented (the `osascript` call stays inside its try block)
- [x] CHK-013 [P1] Code follows project patterns (the subtitle is escaped with `JSON.stringify`, as the command is)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (AC 8/8)
- [x] CHK-021 [P0] Manual testing complete (live hops for five runtimes plus the forced timeout)
- [x] CHK-022 [P1] Edge cases tested (usable template without a subtitle, template with no placeholder carrying one, an empty `SKILLED_LOOP_ID`, a nested directory, a directory with no `.skilled`, a set loop id, `--` before a dash prompt)
- [x] CHK-023 [P1] Error scenarios validated (`osacompile` accepts the title and subtitle line)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. The notice reason is instance-only.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. `rg -n "notifyManualClaim|osascript"` lists one caller and one `osascript` call.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. `rg -n "Session relaunch needs attention"` lists the killer and the Claude playbook scenario, both updated.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. The subtitle text passes through `JSON.stringify`; the no-op case is the test without a subtitle.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Two rows: template usable or unset, template unusable.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Both notice tests delete the process-wide template before running.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Pinned to `a4a4b25115` on `worktrees/158-open-items-live-hop-and-legacy-rows`; the live hops ran on main at `25bc7896fe`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (none in the diff)
- [x] CHK-031 [P0] Input validation implemented (the subtitle is quoted before AppleScript sees it)
- [x] CHK-032 [P1] Auth/authz working correctly (no auth surface changed)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate (the comment states why the reason rides in the subtitle)
- [x] CHK-042 [P2] README updated (if applicable): the concern README and the Claude playbook scenario
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (the red-swap copy lives in the session scratchpad)
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

**Verification Date**: 2026-10-20
<!-- /ANCHOR:summary -->

---
