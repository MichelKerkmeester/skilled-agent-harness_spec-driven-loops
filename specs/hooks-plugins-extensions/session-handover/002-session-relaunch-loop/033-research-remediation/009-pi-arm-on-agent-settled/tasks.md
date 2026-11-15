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

- [x] T001 Capture the baseline of both test commands to `scratch/` (`plan.md` section 5) (evidence: `scratch/baseline-vitest.txt` 54 pass exit 0, `scratch/baseline-node.txt` 892 pass exit 0, `scratch/baseline-tsc.txt` exit 0)
- [x] T002 Confirm `.pi/extensions/session-relaunch.ts` is a symlink, not a copy (evidence: `ls -l` shows `.pi/extensions/session-relaunch.ts -> ../../.skilled/hooks/session-relaunch/pi/session-relaunch.ts`)
- [x] T003 [P] Read the Pi 1.4.0 `agent_settled` emit (`agent-session.js:1471` calling `_emitAgentSettled` at `:683-690`) and the follow-up continuation (`:1562-1564`), and record in `implementation-summary.md` that the held nudge stays on `agent_end` (evidence: read in the installed 1.4.0 package; decision recorded in `implementation-summary.md`)
- [x] T012 [P] Run `rg -n "'agent_end'" .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` and sort each hit into "arm: add agent_settled" or "nudge: leave", saved to `scratch/agent-end-inventory.txt` (evidence: `scratch/agent-end-inventory.txt`, 16 arm and 20 nudge, 36 total)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the failing test "arms on agent_settled and not on agent_end" and see it red (`.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts`) (evidence: red in `scratch/red-before.txt`, green in `scratch/after-vitest.txt`)
- [x] T005 Write the failing test "a continuation before agent_settled leaves the record armed" and see it red (same file) (evidence: red in `scratch/red-before.txt`, green in `scratch/after-vitest.txt`)
- [x] T013 Write the test "agent_settled with aborted: true leaves the record pending" and see it red (same file) (evidence: red in `scratch/red-before.txt`, green in `scratch/after-vitest.txt`)
- [x] T014 Write the test "agent_end alone sends the held nudge as a follow-up and leaves the record pending", which checks the held-nudge decision (same file) (evidence: red in `scratch/red-before.txt`, green in `scratch/after-vitest.txt`)
- [x] T006 Declare an `AgentSettledRegistrar` with an `{ aborted?: boolean }` event, as `AgentStartRegistrar` is declared (`session-relaunch.ts:143-159`); register `agent_settled`, move `armRelaunch` there, skip it when `aborted`; update the doc comment at `:462` to list `agent_settled` (`.skilled/hooks/session-relaunch/pi/session-relaunch.ts`) (evidence: `tsc -p tsconfig.pi.json` exit 0, negative control in `scratch/tsc-negative-control.txt`)
- [x] T007 Keep only the held nudge on `agent_end` (same file) (evidence: `armRelaunch` is called only from the `agent_settled` handler, `scratch/inventories.txt`)
- [x] T015 Rename the log event `agent-end-arm-error` to `agent-settled-arm-error` at `session-relaunch.ts:323` and in the assertions at `session-relaunch.test.ts:553,591` (evidence: `scratch/inventories.txt`, no other file reads the name)
- [x] T008 Update every "arm" hit from the T012 inventory to fire `agent_settled` where it expects an arm; leave the "nudge" hits on `agent_end` (test file) (evidence: 16 arm hits now fire `agent_settled`, 20 nudge hits left on `agent_end`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun both test commands and `npx tsc -p tsconfig.pi.json`, and compare with the baseline (evidence: `scratch/after-vitest.txt`, `scratch/after-tsc.txt`, `scratch/after-node.txt`, `scratch/final-node.txt`)
- [x] T010 No-regression check: run one live Pi 1.4.0 hop with the 031 harness. AC-002 is the proof of the change; this run shows the hop still works. From the repository root, build the sandbox from the working tree and run the harness:
  ```bash
  H=specs/hooks/023-session-relaunch-loop
  SB="${TMPDIR:-/tmp}/sb009p"
  OUT="$PWD/$H/033-research-remediation/009-pi-arm-on-agent-settled/scratch/pi-settled-live"
  bash "$H/028-goal-rebind-live-proof-and-docs/scratch/harness/build-sandbox.sh" pi "$SB" 1200 "$PWD"
  GOAL_HARNESS="$PWD/$H/028-goal-rebind-live-proof-and-docs/scratch/harness" \
    bash "$H/031-relaunch-model-and-effort/scratch/harness/run-pi-effort.sh" pi "$SB" "$OUT" settled
  ```
  Pass when `$OUT/relaunch-record-armed.json` holds `"status":"armed"` and `$OUT/note-final.md` shows `status: claimed` or `status: done`, meaning the receiver claimed the note. Remove `$SB` afterwards (evidence: `scratch/pi-settled-live/`, armed and `status: done`, harness exit 0; run with `SB` resolved by `pwd -P` because the unresolved macOS `$TMPDIR` path made the first attempt stop at "no sender session id", see `scratch/pi-settled-live-attempt1/`; `$SB` removed)
- [x] T011 Update README lines about 138 and 223 to name `agent_settled` as Pi's arm event; leave line about 126, which describes the held nudge on `agent_end` (`.skilled/hooks/session-relaunch/README.md`) (evidence: `rg -n "agent_end|agent_settled" .skilled/hooks/session-relaunch/README.md` in `scratch/inventories.txt`)
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

- [x] CHK-001 [P0] Requirements documented in spec.md (evidence: spec.md section 4)
- [x] CHK-002 [P0] Technical approach defined in plan.md (evidence: plan.md section 3)
- [x] CHK-003 [P1] Dependencies identified and available (evidence: Pi 1.4.0 read in the installed package, harness scripts present)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (evidence: `tsc -p tsconfig.pi.json` exit 0)
- [x] CHK-011 [P0] No console errors or warnings (evidence: vitest 59/59 with no errors)
- [x] CHK-012 [P1] Error handling implemented (evidence: the handler swallows its own errors like every other Pi handler; spawn errors still logged)
- [x] CHK-013 [P1] Code follows project patterns (evidence: registrar declared as `AgentStartRegistrar` is)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (evidence: acceptance-criteria.md, 7 of 7 Met)
- [x] CHK-021 [P0] Manual testing complete (evidence: live hop, `scratch/pi-settled-live/`)
- [x] CHK-022 [P1] Edge cases tested (evidence: aborted settle and continuation tests)
- [x] CHK-023 [P1] Error scenarios validated (evidence: spawn-error tests on `agent_settled`)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. (evidence: class-of-bug: every Pi arm path, all moved)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. (evidence: `scratch/inventories.txt`, only the Pi extension arms on `agent_end`)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. (evidence: `scratch/inventories.txt` and `scratch/agent-end-inventory.txt`)
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. (evidence: not applicable, no security, path, parser or redaction change)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. (evidence: 36 test hits, 16 arm by 20 nudge)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. (evidence: tests set and restore `SKILLED_LOOP_ID` and the runtime dir per test)
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. (evidence: uncommitted working-tree diff of the three files; the orchestrator commits)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (evidence: none added)
- [x] CHK-031 [P0] Input validation implemented (evidence: `event?.aborted === true` guard, session id check)
- [x] CHK-032 [P1] Auth/authz working correctly (evidence: not applicable, no auth surface)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (evidence: tasks ticked, summary filled)
- [x] CHK-041 [P1] Code comments adequate (evidence: handler comments state the Pi event order)
- [x] CHK-042 [P2] README updated (if applicable) (evidence: README lines 138 and 223)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (evidence: evidence only under scratch/)
- [x] CHK-051 [P1] scratch/ cleaned before completion (evidence: sandbox and the tsc control copy removed; scratch holds evidence only)
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



