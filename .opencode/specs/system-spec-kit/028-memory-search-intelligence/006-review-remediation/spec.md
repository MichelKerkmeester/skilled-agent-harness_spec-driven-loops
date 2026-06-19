---
title: "Feature Specification: 028 Review Remediation Phase Parent"
description: "Phase parent for remediating the 028 deep-review findings (0 P0, 6 P1, 91 P2, NOT CONVERGED)."
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
    recent_action: "Created review-remediation phase-parent scaffold from deep-review findings"
    next_safe_action: "Select a child phase and execute only that remediation scope"
    blockers: []
    key_files:
      - "spec.md"
      - "001-eval-benchmark-fidelity/spec.md"
      - "002-memory-schema-and-concurrency/spec.md"
      - "003-doc-accuracy/spec.md"
      - "004-p2-triage/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-006-review-remediation-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This scaffold plans remediation scope only."
      - "Code fixes are executed inside the child phases by separate seats."
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
| **Status** | Phase Parent |
| **Created** | 2026-06-19 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/028-memory-search-intelligence` |
| **Source Review** | `../review-report.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 028 deep review (tri-model 40-seat fan-out plus a 10-iteration lens deep-dive, claude adversarially verified) closed with a NOT CONVERGED verdict: 0 P0, 6 confirmed P1, and 91 P2. The single blocking class is benchmark fidelity, where the per-flag eval driver measures every flag on a non-representative all-channels path so the criterion-4 flip decision rests on the wrong data. Two concurrency races, one schema identity split, and a shipped-doc mislabel round out the P1 set. The findings need a bounded, per-family remediation plan so each fix has a clear target, a quoted source finding, and an explicit verification contract.

### Purpose
Turn the review-report findings into independently executable remediation phases without performing the fixes here. Each child phase owns one finding family, cites the exact `file:line` and quoted fix intent from `../review-report.md`, and records the checks that must pass when the fix runs. The parent records the convergence note and the per-child roster only.

> **Phase-parent note:** This spec.md is the only authored document at this parent level. Detailed planning, tasks, and checklists live in the child phase folders listed below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remediation planning for the 6 confirmed P1 findings, split into eval-benchmark fidelity, memory schema and concurrency, and doc accuracy.
- A scope-and-triage pass over the 91 P2 findings grouped by review lens, marking each group fix-now versus accept-as-is.
- Per-phase discovery, fix intent, and verification contracts quoted from `../review-report.md`.

### Out of Scope
- Executing any code fix at the parent level (the child phases own execution, dispatched to separate seats).
- Touching the concurrent session's files (`shared/algorithms/rrf-fusion.ts`, deep-research assets, `.opencode/commands/*`, `.gitignore`).
- Editing packet 030 or any sibling 028 child outside the cited findings.
- Re-deriving the review verdict (the report is the frozen source of truth for this remediation).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Create | parent | Root purpose, convergence note, child roster |
| `description.json` | Create | parent | Search metadata for this phase parent |
| `graph-metadata.json` | Create | parent | Child identity and phase graph metadata |
| `001-eval-benchmark-fidelity/spec.md` | Create | 001 | P1-1 + P1-3 eval-driver fidelity remediation scope |
| `002-memory-schema-and-concurrency/spec.md` | Create | 002 | P1-2 + P1-4 + P1-5 schema and concurrency remediation scope |
| `003-doc-accuracy/spec.md` | Create | 003 | P1-6 + the iteration-9 doc staleness cluster remediation scope |
| `004-p2-triage/spec.md` | Create | 004 | 91 P2 grouped by lens, fix-now versus accept-as-is triage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation detail lives inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-eval-benchmark-fidelity/` | P1-1 forceAllChannels + P1-3 trigger-ablation no-op; fix driver, re-run criterion-4 benchmark | PENDING |
| 002 | `002-memory-schema-and-concurrency/` | P1-2 derived-id split + P1-4 embedding-in-lock + P1-5 retention spare-only stale snapshot | PENDING |
| 003 | `003-doc-accuracy/` | P1-6 changelog shipped-vs-Planned mislabel + 12-strong doc staleness cluster | PENDING |
| 004 | `004-p2-triage/` | 91 P2 grouped by lens, each marked fix-now or accept-as-is (scope only) | PENDING |

### Convergence Note

The deep review verdict is **NOT CONVERGED**. The last three deep-dive iterations did not stop surfacing new P1 (the largest confirmed-P1 spike, 13, landed in the second-to-last iteration), so there is no clean trailing window. After phases 001-003 fix the confirmed P1 and phase 004 closes its fix-now P2 set, the deep review **MUST be re-run until a round surfaces zero new P0/P1**, then this remediation can be declared release-clean. A single clean round is the convergence gate; phase 001 also supersedes the prior criterion-4 measurement and must re-run that benchmark.

### Phase Transition Rules

- Each child phase starts PENDING and defines remediation scope only.
- A separate seat executes each fix inside one child phase at a time.
- Parent status changes only after the child's strict validation passes.
- The concurrent session's files and packet 030 remain out of scope.
- After 001-003 land, re-run `/deep:review` on 028 until a clean round before closing.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| parent | child | Select one PENDING finding family | Child `spec.md` cites the finding `file:line` and quoted fix intent |
| child | re-review | All cited findings in the child are fixed | `validate.sh <child> --strict` exits 0 and the child's verification commands pass |
| re-review | parent | Deep review re-run surfaces zero new P0/P1 | A clean `/deep:review` round on 028 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Two seat confidence caveats carry from the review and must be reconfirmed against the broader codebase during phase 002 / 004 execution: the lineage stale-key re-root coverage gap (`memory-lineage-state.vitest.ts`) and the `codeGraphEdgeBitemporalReadsEnabled` zero-callers claim were both scoped to `lib/` only.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Source review**: `../review-report.md`
- **Packet parent**: `../spec.md`
- **Graph metadata**: `graph-metadata.json`
- **Child phases**: `001-eval-benchmark-fidelity/` through `004-p2-triage/`
