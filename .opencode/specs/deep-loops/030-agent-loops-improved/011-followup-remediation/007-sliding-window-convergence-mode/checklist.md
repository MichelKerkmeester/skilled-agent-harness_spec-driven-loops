---
title: "Verification Checklist: Sliding-Window Convergence Mode"
description: "Level 3 verification checklist for the opt-in sliding-window convergence mode, mapping REQ-001 through REQ-004 to evidence-backed checks."
trigger_phrases:
  - "sliding window convergence checklist"
  - "verification checklist"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/011-followup-remediation/007-sliding-window-convergence-mode"
    last_updated_at: "2026-07-02T14:55:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Authored Level 3 checklist ahead of implementation dispatch"
    next_safe_action: "Fill Evidence lines during implementation verification"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-011-007-sliding-window"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Sliding-Window Convergence Mode

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

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
  - **Evidence**: spec.md REQ-001..REQ-004 grounded in the parent packet ADR with code line references
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: plan.md architecture section defines the opt-in parallel-path pattern and data flow
- [x] CHK-003 [P1] Implementation-level decisions recorded
  - **Evidence**: decision-record.md ADR-001 (parallel path), ADR-002 (N-back anchor), ADR-003 (dual telemetry)

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Comment hygiene clean on all modified files
  - **Evidence**:
- [ ] CHK-011 [P1] New code follows existing conventions in each file (cjs patterns in convergence.cjs, TS patterns in coverage-graph-signals.ts)
  - **Evidence**:
- [ ] CHK-012 [P1] Unknown `convergenceMode` values produce a clear error, not a silent default fallback
  - **Evidence**:

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] REQ-001: full existing deep-loop-runtime vitest suite passes with 0 new failures (default/off untouched)
  - **Evidence**:
- [ ] CHK-021 [P0] REQ-002: denominator-drag fixture proves late novelty suppressed under full-history but visible under the window
  - **Evidence**:
- [ ] CHK-022 [P0] REQ-003: slidingWindowSize validation rejects 0, negative, and non-integer values with a clear error
  - **Evidence**:
- [ ] CHK-023 [P1] Early-iteration clamp behavior fixture-tested (window equals full history until N snapshots exist)
  - **Evidence**:
- [ ] CHK-024 [P1] Mutation check: break the windowed calculation, confirm the drag fixture fails for the right reason, restore
  - **Evidence**:

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-060 [P0] The fix addresses the class of bug, not one instance: windowed mode is available to all three loop types through the shared convergence path
  - **Evidence**:
- [ ] CHK-061 [P1] No same-class siblings left behind: no other full-history-denominator calculation in deep-loop-runtime silently retains the drag bug unaddressed
  - **Evidence**:

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] Config input validated before use (window size, mode string); no unvalidated config reaches calculation code
  - **Evidence**:
- [x] CHK-031 [P2] No secrets, credentials, or external I/O involved in this change
  - **Evidence**: Pure calculation + config plumbing; no network, no credentials, N/A by construction

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] REQ-004: dual telemetry (full-history + windowed ratio) recorded in sliding-window mode
  - **Evidence**:
- [ ] CHK-041 [P1] implementation-summary.md written with final state and verification evidence
  - **Evidence**:
- [ ] CHK-042 [P1] tasks.md T001-T011 all marked with real completion state
  - **Evidence**:

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only the 3 in-scope code/test files plus this spec folder modified
  - **Evidence**:
- [x] CHK-051 [P2] No temp files outside scratch/
  - **Evidence**: No scratch usage planned; verify at close

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [ ] CHK-100 [P0] Implementation matches decision-record.md ADR-001 (parallel path, existing calculation untouched)
  - **Evidence**:
- [ ] CHK-101 [P1] Window anchoring matches ADR-002 (N-back snapshot, clamped early)
  - **Evidence**:
- [ ] CHK-102 [P1] Telemetry matches ADR-003 (both ratios in-mode, no new fields in default/off)
  - **Evidence**:

<!-- /ANCHOR:arch-verify -->
---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [ ] CHK-110 [P2] Full vitest suite runtime not materially regressed by the new fixtures
  - **Evidence**:

<!-- /ANCHOR:perf-verify -->
---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [ ] CHK-120 [P1] Rollback verified trivial: deleting the parallel path leaves default/off/max-iterations untouched
  - **Evidence**:
- [x] CHK-121 [P2] No feature flag needed: the mode is config-opt-in by construction
  - **Evidence**: convergenceMode is only active when explicitly configured; absence = current behavior

<!-- /ANCHOR:deploy-ready -->
---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P2] No regulatory, licensing, or data-privacy surface touched
  - **Evidence**: Pure internal calculation change; N/A by construction

<!-- /ANCHOR:compliance-verify -->
---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] spec.md, plan.md, tasks.md, decision-record.md and implementation-summary.md agree on final state with no contradictory completion claims
  - **Evidence**:

<!-- /ANCHOR:docs-verify -->
---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

- [ ] CHK-150 [P0] Orchestrator (Claude) independently re-verified the implementer's claims with real command output before completion was recorded
  - **Evidence**:

<!-- /ANCHOR:sign-off -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 3/7 |
| P1 Items | 10 | 1/10 |
| P2 Items | 4 | 3/4 |

**Verification Date**: pending implementation
**Verified By**: pending
**ADRs**: 3 documented (decision-record.md), all Accepted

<!-- /ANCHOR:summary -->
