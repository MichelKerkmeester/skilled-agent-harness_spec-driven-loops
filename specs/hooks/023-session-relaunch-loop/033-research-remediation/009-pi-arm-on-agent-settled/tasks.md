---
title: "Tasks: Phase 9: pi-arm-on-agent-settled"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "pi arm on agent settled tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: pi-arm-on-agent-settled

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

- [ ] T001 Capture the baseline of both test commands to `scratch/` (`plan.md` section 5)
- [ ] T002 Confirm `.pi/extensions/session-relaunch.ts` is a symlink, not a copy
- [ ] T003 [P] Read the Pi 1.4.0 `agent_settled` emit (`agent-session.js:1471` calling `_emitAgentSettled` at `:683-690`) and the follow-up continuation (`:1562-1564`), and record in `implementation-summary.md` that the held nudge stays on `agent_end`
- [ ] T012 [P] Run `rg -n "'agent_end'" .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` and sort each hit into "arm: add agent_settled" or "nudge: leave", saved to `scratch/agent-end-inventory.txt`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Write the failing test "arms on agent_settled and not on agent_end" and see it red (`.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts`)
- [ ] T005 Write the failing test "a continuation before agent_settled leaves the record armed" and see it red (same file)
- [ ] T013 Write the test "agent_settled with aborted: true leaves the record pending" and see it red (same file)
- [ ] T014 Write the test "agent_end alone sends the held nudge as a follow-up and leaves the record pending", which checks the held-nudge decision (same file)
- [ ] T006 Declare an `AgentSettledRegistrar` with an `{ aborted?: boolean }` event, as `AgentStartRegistrar` is declared (`session-relaunch.ts:143-159`); register `agent_settled`, move `armRelaunch` there, skip it when `aborted`; update the doc comment at `:462` to list `agent_settled` (`.skilled/hooks/session-relaunch/pi/session-relaunch.ts`)
- [ ] T007 Keep only the held nudge on `agent_end` (same file)
- [ ] T015 Rename the log event `agent-end-arm-error` to `agent-settled-arm-error` at `session-relaunch.ts:323` and in the assertions at `session-relaunch.test.ts:553,591`
- [ ] T008 Update every "arm" hit from the T012 inventory to fire `agent_settled` where it expects an arm; leave the "nudge" hits on `agent_end` (test file)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Rerun both test commands and `npx tsc -p tsconfig.pi.json`, and compare with the baseline
- [ ] T010 No-regression check: run one live Pi 1.4.0 hop with the 031 harness. AC-002 is the proof of the change; this run shows the hop still works. From the repository root, build the sandbox from the working tree and run the harness:
  ```bash
  H=specs/hooks/023-session-relaunch-loop
  SB="${TMPDIR:-/tmp}/sb009p"
  OUT="$PWD/$H/033-research-remediation/009-pi-arm-on-agent-settled/scratch/pi-settled-live"
  bash "$H/028-goal-rebind-live-proof-and-docs/scratch/harness/build-sandbox.sh" pi "$SB" 1200 "$PWD"
  GOAL_HARNESS="$PWD/$H/028-goal-rebind-live-proof-and-docs/scratch/harness" \
    bash "$H/031-relaunch-model-and-effort/scratch/harness/run-pi-effort.sh" pi "$SB" "$OUT" settled
  ```
  Pass when `$OUT/relaunch-record-armed.json` holds `"status":"armed"` and `$OUT/note-final.md` shows `status: claimed` or `status: done`, meaning the receiver claimed the note. Remove `$SB` afterwards
- [ ] T011 Update README lines about 138 and 223 to name `agent_settled` as Pi's arm event; leave line about 126, which describes the held nudge on `agent_end` (`.skilled/hooks/session-relaunch/README.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | [X] | [ ]/[X] |
| P1 Items | [Y] | [ ]/[Y] |
| P2 Items | [Z] | [ ]/[Z] |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---



