---
title: "Feature Specification: 028 Review Remediation Phase Parent"
description: "Phase parent for the six-child 028 review-remediation track, with four executed scopes and two pending remediation contracts."
trigger_phrases:
  - "028 review remediation"
  - "memory search intelligence review remediation"
  - "deep review remediation phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/006-review-remediation"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reconciled the review-remediation parent to the six-child executed and pending state"
    next_safe_action: "Execute 002 and finalize 004 in their owning child phases"
    blockers: []
    key_files:
      - "spec.md"
      - "001-eval-benchmark-fidelity/spec.md"
      - "002-memory-schema-and-concurrency/spec.md"
      - "003-doc-accuracy/spec.md"
      - "004-p2-triage/spec.md"
      - "005-env-documentation-audit/spec.md"
      - "006-review-record-packet-type/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-006-review-remediation-parent"
      parent_session_id: null
    completion_pct: 67
    open_questions: []
    answered_questions:
      - "001, 003, 005 and 006 executed their scopes."
      - "002 and 004 remain pending remediation contracts."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: 028 Review Remediation Phase Parent

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | in_progress|
| **Created** | 2026-06-19 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/028-memory-search-intelligence` |
| **Source Review** | `../archive/review-report.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The original source-review context closed with a NOT CONVERGED verdict: 0 P0, 6 confirmed P1 and 91 P2. That source review remains the frozen input for the first four remediation families, but the track has since progressed. Phases 001 and 003 executed their source-review remediation scopes, phases 002 and 004 remain pending contracts, and phases 005 and 006 later shipped the ENV-documentation audit/remediation and marker-gated review packet type work.

### Purpose
Keep the parent as the six-child review-remediation rollup. The child folders own implementation detail, evidence and verification; `../changelog/006-review-remediation/changelog-006-root.md` is the current status source and `../archive/review-report.md` is source-review context for the first four children.

> **Phase-parent note:** This spec.md is the only authored document at this parent level. Detailed planning, tasks and checklists live in the child phase folders listed below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The six-child review-remediation roster and current status.
- Executed state for 001 eval-benchmark fidelity, 003 doc accuracy, 005 ENV-documentation audit and 006 review-record packet type.
- Pending state for 002 memory schema and concurrency and 004 P2 triage.
- Source-review context for the original P1/P2 finding families.

### Out of Scope
- Executing any code fix at the parent level.
- Touching the concurrent session's files (`shared/algorithms/rrf-fusion.ts`, deep-research assets, `.opencode/commands/*`, `.gitignore`).
- Editing packet 030 or any sibling 028 child outside the cited findings.
- Re-deriving the review verdict (the report is the frozen source of truth for this remediation).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Maintain | parent | Six-child current-state roster |
| `description.json` | Generator-owned | parent | Search metadata for this phase parent |
| `graph-metadata.json` | Generator-owned | parent | Child identity and phase graph metadata |
| `001-eval-benchmark-fidelity/spec.md` | Executed | 001 | P1-1 + P1-3 eval-driver fidelity remediation scope |
| `002-memory-schema-and-concurrency/spec.md` | Absorbed → 016/008+009 | 002 | P1-2/P1-4/P1-5 verify-first-then-close (already correct in live code; verified + tested by phases 008/009) |
| `003-doc-accuracy/spec.md` | Executed | 003 | P1-6 + the iteration-9 doc staleness cluster remediation scope |
| `004-p2-triage/spec.md` | Absorbed → 016 | 004 | 91-item P2 map reconstructed + dispositioned in 016 phase 013 (frozen per-item source was unrecoverable) |
| `005-env-documentation-audit/spec.md` | Executed | 005 | ENV-documentation review and remediation |
| `006-review-record-packet-type/spec.md` | Executed | 006 | Marker-gated review packet type validation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation detail lives inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-eval-benchmark-fidelity/` | Corrected the per-flag benchmark driver to production routing, dropped the no-op trigger-ablation row and re-ran criterion 4 | Shipped |
| 002 | `002-memory-schema-and-concurrency/` | Derived-id split, in-lock embedding and retention spare-axis fixes | ABSORBED → 016 phases 008/009 (verify-first-then-close, closed 2026-07-04) |
| 003 | `003-doc-accuracy/` | Reclassified the shipped-default-off rollup and reconciled timeline, before-vs-after and benchmark-status staleness | Shipped, parent-dispatched scope |
| 004 | `004-p2-triage/` | 91 P2 grouped into 15 lens families | ABSORBED → 016 (P2 map reconstructed + dispositioned in phase 013, closed 2026-07-04) |
| 005 | `005-env-documentation-audit/` | ENV-documentation deep review and remediation across stale dist, flag defaults and structure gaps | Complete |
| 006 | `006-review-record-packet-type/` | Marker-gated review packet type that validates lean review records without the full Level 1 doc set | Complete |

### Source-Review Context

The old deep-review detail is source-review context for the first four children, not the current parent status. That source review was NOT CONVERGED and required a clean re-review after the confirmed P1 fixes and fix-now P2 set closed. The current rollup records that 001 and 003 executed, 002 and 004 remain pending, and 005 and 006 completed later scoped work.

### Phase Transition Rules

- Children 001, 003, 005 and 006 are executed scopes.
- Children 002 and 004 remain pending remediation contracts.
- A separate seat executes each remaining fix inside one child phase at a time.
- Parent status follows the per-child changelog rollup.
- The concurrent session's files and packet 030 remain out of scope.
- After 002 executes and 004 closes its fix-now set, re-run `/deep:review` on 028 until a clean round before closing the source-review remediation loop.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| parent | child | Select one pending finding family or inspect an executed child | Child `spec.md` and changelog cite scope, evidence and status |
| child | re-review | All cited findings in a pending child are fixed | `validate.sh <child> --strict` exits 0 and the child's verification commands pass |
| re-review | parent | Deep review re-run surfaces zero new P0/P1 | A clean `/deep:review` round on 028 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Two seat confidence caveats carry from the review and must be reconfirmed against the broader codebase during phase 002 / 004 execution: the lineage stale-key re-root coverage gap (`memory-lineage-state.vitest.ts`) and the `codeGraphEdgeBitemporalReadsEnabled` zero-callers claim were both scoped to `lib/` only.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Source review**: `../archive/review-report.md`
- **Packet parent**: `../spec.md`
- **Graph metadata**: `graph-metadata.json`
- **Child phases**: `001-eval-benchmark-fidelity/` through `006-review-record-packet-type/`
