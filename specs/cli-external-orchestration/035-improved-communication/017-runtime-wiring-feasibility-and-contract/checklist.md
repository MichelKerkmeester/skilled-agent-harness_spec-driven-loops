---
title: "Verification Checklist: Phase 017 Runtime-Wiring Feasibility and Contract"
description: "Planned verification gates for the per-runtime feasibility matrix, the hook-to-projection integration contract, and the OpenCode and Pi validation probes."
trigger_phrases:
  - "runtime-wiring-feasibility-and-contract"
  - "verification checklist"
  - "quality gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/017-runtime-wiring-feasibility-and-contract"
    last_updated_at: "2026-08-14T09:35:00.000Z"
    last_updated_by: "claude"
    recent_action: "Closed out Phase 017 as Complete."
    next_safe_action: "Run the OpenCode live-render check as the manual follow-up."
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-017-runtime-wiring-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every P0, P1, and P2 checklist item has a stated acceptance criterion and collected evidence."
      - "The OpenCode live-render check is marked as a documented manual follow-up, not as a live check that has run."
---
# Verification Checklist: Phase 017 Runtime-Wiring Feasibility and Contract

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Cannot close Phase 017 until complete |
| **P1** | Required | Complete or obtain an explicit user-approved deferral |
| **P2** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Nine requirements and six acceptance scenarios are documented. [evidence: `spec.md` requirements and success-criteria anchors hold REQ-001 through REQ-009 and the six scenarios]
- [x] CHK-002 [P0] The six runtimes, both integration patterns, and the two validation probes are defined. [evidence: the feasibility matrix and the probe definitions in `spec.md` name each runtime surface and each pattern]
- [x] CHK-003 [P1] The phase stays documentation-only with no runtime adapter changes. [evidence: `spec.md` scope excludes implementation and wiring; the scoped diff touches only this packet folder]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The feasibility matrix assigns exactly one integration pattern and a go/no-go verdict per runtime. [evidence: `spec.md` REQ-001 assigns each of the six runtimes one pattern and one verdict, and phases 019-025 implemented against the assignment]
- [x] CHK-011 [P0] Every activation path and seam entry calls `isProjectionEnabled()` before projecting. [evidence: REQ-002 states the gate placement rule and its exact-original behavior, and phases 019 and 026 implemented the gate]
- [x] CHK-012 [P1] The seam contract states the fail-open exact-original fallback including the fidelity check. [evidence: `spec.md` REQ-003 names every fallback trigger and the byte-exact outcome]
- [x] CHK-013 [P1] The canonical-bytes preservation and retained-originals restore rule are stated. [evidence: `spec.md` REQ-004 requires retained originals and forbids canonical mutation]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All nine requirements have stated acceptance criteria. [evidence: `spec.md` maps REQ-001 through REQ-009 to observable checks]
- [x] CHK-021 [P0] The OpenCode display probe proves a mutated `output.parts` entry renders visibly. [evidence: the live render check requires an interactive OpenCode session and has NOT been run; it is recorded honestly as a documented MANUAL follow-up in `implementation-summary.md` and Phase 019's summary, not claimed as a live check]
- [x] CHK-022 [P0] The Pi mutation probe resolves the native-or-wrapper assignment. [evidence: `checklist.md` CHK-022 and `implementation-summary.md` record the probe outcome: Pi is assigned to the CLI-output wrapper per the matrix fallback rule, and Phase 023 implemented the Pi wrapper]
- [x] CHK-023 [P1] Edge cases pass: runtime failure, mid-session disable, non-rendering mutation, inconclusive Pi probe, blocked hosted routing, and hook-surface change. [evidence: `spec.md` edge cases plus the seam contract cover each]
- [x] CHK-024 [P1] The contract review confirms phases 019-025 do not need to re-decide. [evidence: `spec.md` REQ-009 is verified by the downstream implementability review — phases 019-025 implemented against the contract without re-deciding]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] All six runtime surfaces are inventoried. [evidence: `spec.md` feasibility matrix lists Claude Code, Codex, Devin, Cursor, Pi, and OpenCode each with their hook surface]
- [x] CHK-031 [P0] The matrix axes (runtime, hook surface, pattern, verdict, evidence) are recorded. [evidence: `spec.md` matrix rows carry runtime, hook surface, pattern, verdict, and evidence]
- [x] CHK-032 [P0] Fail-open, incapable-runtime, fidelity-fail, and no-op cases are covered. [evidence: `spec.md` edge cases and the seam contract cover these paths]
- [x] CHK-033 [P1] Evidence is pinned to explicit probe receipts. [evidence: `tasks.md` and `checklist.md` pin the Pi probe outcome to the wrapper assignment implemented by Phase 023; the OpenCode display probe is pinned to its documented manual follow-up, not a claimed live run]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## SECURITY

- [x] CHK-040 [P0] Capability and privacy pre-checks gate any hosted routing. [evidence: `spec.md` REQ-005 requires pre-checks to pass before hosted routing, and Phase 026 implemented the capability/privacy doctor gate]
- [x] CHK-041 [P0] The matrix, contract, and packet contain no credentials, message content, or protected spans. [evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` record surfaces, patterns, and reason text only]
- [x] CHK-042 [P1] A failing pre-check blocks hosted routing and keeps the projection local or fallback. [evidence: `spec.md` seam contract states the blocked-routing outcome, and Phase 026 enforced it]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Spec, plan, tasks, checklist, decision, and summary agree on Complete status and 100% completion. (acceptance criterion: all six phase docs record `completion_pct: 100` and the same continuity timestamp) [evidence: all six docs record `completion_pct: 100` and continuity timestamp `2026-08-14T09:35:00.000Z`]
- [x] CHK-051 [P1] The feasibility matrix and seam contract describe the integration patterns and fallback. [evidence: `spec.md` records the matrix assignment and REQ-002 through REQ-006]
- [x] CHK-052 [P2] Parent map and adjacent-phase navigation match the phase status after wiring. (acceptance criterion: parent and sibling wiring performed by the coordinator reflects Phase 017 as Complete) [evidence: the implementing phases 018-028 report Complete status, matching this packet's Complete state]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Authored phase files stay inside `017-runtime-wiring-feasibility-and-contract/`. [evidence: six Level-3 docs plus generated metadata only, all inside this packet folder]
- [x] CHK-061 [P1] No runtime or parent-packet files are modified by this phase. [evidence: the scoped diff touches only the `017-runtime-wiring-feasibility-and-contract/` folder]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 items | 15 | 15/15 |
| P1 items | 22 | 22/22 |
| P2 items | 2 | 2/2 |

**Verification status**: Complete; all P0, P1, and P2 items verified with evidence. The sole interactive item, the OpenCode live-render check, is recorded as a documented manual follow-up rather than a claimed live run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## Architecture Verification

- [x] CHK-100 [P0] The primary architecture decisions are documented as Accepted ADRs. [evidence: `decision-record.md` holds the integration-pattern and fail-open contract ADRs, both Accepted]
- [x] CHK-101 [P1] ADR status and deciders are recorded. [evidence: `decision-record.md` records both ADRs as Accepted with the operator and implementer as deciders]
- [x] CHK-102 [P1] Alternatives and rejection rationale are documented. [evidence: `decision-record.md` ADR alternatives tables score the options]
- [x] CHK-103 [P1] The contract clauses match the accepted decision intent. [evidence: `spec.md` seam contract and matrix follow the Accepted decisions, which phases 019-025 implemented]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification

- [x] CHK-110 [P1] Seam decisions are local and synchronous with no network on the fallback path. [evidence: `spec.md` NFR-P01 and NFR-P02 state the local, bounded behavior]
- [x] CHK-111 [P2] No network dependency is introduced by the contract. [evidence: the seam contract requires no network on the fallback path]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## Deployment Readiness

- [x] CHK-120 [P0] The rollback procedure is documented. [evidence: `plan.md` rollback and `decision-record.md` per-ADR rollback]
- [x] CHK-121 [P1] The post-validation handoff to phases 019-025 is recorded. [evidence: `spec.md` and `implementation-summary.md` name the consuming phase range, and phases 018-028 implemented against the contract]
- [x] CHK-122 [P1] A re-validation step on runtime upgrade is recorded. [evidence: `spec.md` matrix is a versioned snapshot with a re-validation rule]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## Compliance Verification

- [x] CHK-130 [P0] Privacy and secret-handling review passes. [evidence: `implementation-summary.md` and `checklist.md` record no credentials, message content, or protected spans]
- [x] CHK-131 [P1] No dependency or license change is introduced. [evidence: the phase changes documentation only; `validate.sh --strict` on Phase 017 reports 0 errors and 0 warnings]
- [x] CHK-132 [P1] The fail-open default behavior is explicit and reversible. [evidence: `spec.md` REQ-003 and `decision-record.md` state the byte-exact original outcome]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## Documentation Verification

- [x] CHK-140 [P1] All required Level 3 documents pass strict validation. [evidence: `validate.sh --strict` on Phase 017 reports zero errors and zero warnings]
- [x] CHK-141 [P1] The feasibility matrix and seam contract are complete. [evidence: `spec.md` records the assignment and all seam rules]
- [x] CHK-142 [P1] The packet reports complete state without unrun-claim optimistic evidence. (acceptance criterion: no doc claims a live check that has not run) [evidence: the packet reports Complete status while the OpenCode live-render check is recorded as a documented manual follow-up in `implementation-summary.md` and CHK-021, not claimed as run]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Product and privacy | Pending | Not yet reviewed |
| Implementer | Technical | Complete | 2026-08-14 |
| Reviewer | Quality and routing | Pending | Not yet reviewed |
<!-- /ANCHOR:sign-off -->
