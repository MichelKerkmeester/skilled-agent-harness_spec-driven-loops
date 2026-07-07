---
title: "Feature Specification: Deferred WIP-Overlapping Findings [system-code-graph/007-code-graph-buildout/011-source-bug-and-misalignment-audit/003-deferred-wip-overlapping-findings/feature-specification]"
description: "7 audit findings deferred during remediation: each either overlaps the operator's active BUG-04/BUG-06 WIP or needs deeper design than a fast-agent pass produced. Reverted from the branch; remain open as documented findings."
trigger_phrases:
  - "code graph remediation deferred-wip-overlapping-findings"
  - "system-code-graph fix deferred wip-overlapping findings"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/011-source-bug-and-misalignment-audit/003-deferred-wip-overlapping-findings"
    last_updated_at: "2026-05-29T08:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded 7 deferred findings with reasons"
    next_safe_action: "Re-implement deferred findings after WIP settles"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Deferred WIP-Overlapping Findings

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-29 |
| **Branch** | `cg-remediation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A subset of findings could not be safely auto-fixed: they edit files under active in-tree WIP, or their correct fix requires reconciling behavioral semantics (freshness sourcing, recovery no-op-vs-error) that interact with that WIP.

### Purpose
Track the deferred findings with the exact reason each was held back, so they can be re-done deliberately against a settled tree.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The findings listed in §4, sourced from the parent audit `../archive/review-report.md`.

### Out of Scope
- Merging into `main` (operator-gated; the live tree has active BUG-04/BUG-06 WIP).

### Findings

| Finding | Outcome / Reason |
|---------|------------------|
| CG-002 | Only PARTIALLY addressed by in-tree BUG-04 WIP: enum / minLength / additionalProperties are enforced before dispatch, but NUMERIC RANGES (min/max) are still NOT enforced — so CG-002 is not fully closed. Fast-fix only changed the error message and broke a test — reverted. |
| CG-006 | scan freshness gating on scanPromotable: correct in intent but the readiness-mock + status flow rely on the old value; needs reconciliation with BUG-06. |
| CG-007 | Read-path setLastGitHead removal is right in principle but the existing freshness flow RELIES on the read path recording HEAD; removing it makes status report stale. Needs scan-side HEAD recording first. |
| CG-008 | Candidate-manifest source change lives in ensure-ready.ts (active BUG-06 WIP file); deferred to avoid conflicting with in-flight work. |
| CG-009 | Recovery confirm-gate; bundled in apply-orchestrator with CG-010, reverted together. |
| CG-010 | rollback-failed status is OVER-BROAD: recovery-procedures returns status:ok with restored:false for the genuine no-op case (nothing to restore), and status:failed only when a restore was attempted and errored. The original fix's `restored !== true` check was too broad — it flagged the status:ok/restored:false no-op as a failure. Correct fix needs recovery-procedures to distinguish the no-op (status ok, restored false) from an errored rollback (status failed) — which is why it remains deferred. |
| CG-037 | apply dry-run rollback target; bundled with apply-orchestrator revert. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Changes scoped + verified | Typecheck clean; full suite shows zero regressions vs B0 baseline |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Each finding traceable to parent review-report | CG-IDs map to `../archive/review-report.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Outcome recorded per finding (§4) with evidence on branch `cg-remediation`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | operator BUG-04/BUG-06 WIP | overlaps these files | branch isolation; merge when WIP settles |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
