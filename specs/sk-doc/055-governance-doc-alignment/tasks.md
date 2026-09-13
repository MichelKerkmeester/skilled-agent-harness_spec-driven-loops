---
title: "Tasks: Governance documentation alignment: 006-resume queue plus router and root-doc research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Governance documentation alignment: 006-resume queue plus router and root-doc research

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
| `Evidence:` | The receipt that proves the task done, every task carries one |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: 006-Resume (Stream A)

- [ ] T001 [P0] Repair 006's derived metadata with the --apply loop over the packet and its nine children (`specs/sk-communication/006-sk-communication-clarity`) (REQ-001)
  - Evidence: the repair output lists ten folders, `failed=0`, the parent's stale graph metadata re-derived and applied
- [ ] T002 [P0] Hold 006 to recursive strict validation (`specs/sk-communication/006-sk-communication-clarity`) (REQ-001, SC-001)
  - Evidence: ten RESULT: PASSED lines, Errors: 0, output and exit status both read, no pipe over the exit
- [ ] T003 [P0] Confirm whether the 006 decision record ratifies the wording standard's base-plus-supplement shape (`002-synthesis-and-decisions/decision-record.md`) (REQ-005 gate)
  - Evidence: the ratifying ADR named with its line, or the ratification appended as a recorded decision
- [ ] T004 [B] Correct the two stale items, the 006 phase-map row for phase 002 and the 007 ratification wording at both references (`006/spec.md`, `006/007-wording-standard-restructure/spec.md`) (REQ-005)
  - Evidence: two diffs, one clause each, the phase-map row records the decision record's existence, blocked until T003 confirms the ratification state
- [ ] T005 [P0] Identify the pre-swarm commit for the twelve rewritten files (006's history) (REQ-002)
  - Evidence: the commit hash recorded, all twelve rewritten files listed at it
- [ ] T006 [P0] Dispatch the read-only verification review of the twelve files against the pre-swarm baseline (contract: one dispatch, review persona, `read,grep,find,ls`, plan.md section 8) (REQ-002)
  - Evidence: stdout and stderr captured to files, success classified from the output text, the wrapper's zero cross-checked against the artifacts, any SIGTERM 143 noted
- [ ] T007 [P0] Reconcile the swarm's reported claims with the review's verdicts and record the outcome (this packet's `implementation-summary.md`) (REQ-002, SC-003)
  - Evidence: twelve verdicts, every reported line count and content change confirmed or refuted with a receipt
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Governance Research (Streams B and C)

Note: T009 and T010 run as the two lineages of ONE fan-out invocation, under the plan.md section 8 contract. Each brief carries the shared preamble, the inlined persona and the named target files. Note: the `route_proof_missing` gate failure is expected on every research iteration, it is deterministic and says nothing about the findings.

- [ ] T008 [P0] Run the dispatch preflight: `command -v pi`, the two ALWAYS-loads read, the credential observed inside the dispatched child, the roster mapping re-read from the enforcement file
  - Evidence: the four preflight receipts recorded in the dispatch log, the enforced model reads `llmgateway/glm-5.3-flash` with the effort pin at `max`
- [ ] T009 [P] [P0] Run the router alignment lineage, 3 iterations, briefed to its named files, the 11 rule files, the router, the 5 recently edited rules (`research/router-alignment/`) (REQ-003)
  - Evidence: 3 iteration files, 3 deltas, the reducer reports 3, every finding cites the commit it read
- [ ] T010 [P] [P0] Run the root-doc lineage, 5 iterations, the not-reality and redundant-detail failure classes kept apart (`research/root-doc-staleness/`) (REQ-004)
  - Evidence: 5 iterations, 5 deltas, every redundancy finding names its discrimination case, case-one findings quote the delegate's own line
- [ ] T011 [P0] Write both syntheses (`research.md` in both research folders) (REQ-003, REQ-004)
  - Evidence: both syntheses non-empty, consistent with their deltas, the receipts name the model and effort behind each iteration
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Acting On Findings and Closure

- [ ] T012 [P1] Record the sequencing question's answer in this packet's continuity, `answered_questions`, and the implementation summary (SC-004)
  - Evidence: the recorded answer, either before or after 006's phase 003, with the deciding reason, blocked until the operator answers
- [ ] T013 [B] [P1] Act on both streams' adopted findings (`AGENTS.md`, `REPO RULES.md`, `repo-rules/`) (REQ-006)
  - Evidence: each action cites its finding, redundancy findings cite their case and, for case one, the delegate's own line, blocked until T011 delivers both syntheses and T012 records the sequencing answer
- [ ] T014 [P0] From the final state, re-run the whole gate: `validate.sh` on this packet, strictly (`specs/sk-doc/055-governance-doc-alignment`)
  - Evidence: RESULT: PASSED, Errors: 0, output and exit status both read
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] 055 validates under `validate.sh --strict` with RESULT: PASSED
- [ ] Every acceptance-criteria row reads Met, Waived or Superseded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, whose section 8 owns the dispatch contract
- **Acceptance criteria**: See `acceptance-criteria.md`, the document that decides closure
- **Source**: the 006 clarity handover, section 3.2, at `../../sk-communication/006-sk-communication-clarity/handover.md`
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
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-13
<!-- /ANCHOR:summary -->
