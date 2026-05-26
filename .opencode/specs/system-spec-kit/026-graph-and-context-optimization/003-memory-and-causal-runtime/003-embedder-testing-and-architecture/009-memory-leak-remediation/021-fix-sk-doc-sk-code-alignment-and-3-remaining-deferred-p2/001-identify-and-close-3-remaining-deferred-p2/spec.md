---
title: "Spec: Identify and Close 3 Remaining Deferred P2 Findings"
description: "Level 2 child phase that systematically identifies the 3 P2 findings still NOT closed after arcs 017/005 + 020/001-006, then closes them or documents DEFERRED-AGAIN with explicit ADR."
trigger_phrases:
  - "021 001 identify deferred p2"
  - "find 3 remaining sidecar p2"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/001-identify-and-close-3-remaining-deferred-p2"
    last_updated_at: "2026-05-23T13:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Scaffold spec for codex-driven identification+closure"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high fast to do the checklist sweep"
    blockers: []
    key_files:
      - "../015-deep-research-drift-and-simplification/research/findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-2026-05-23"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Spec: Identify and Close 3 Remaining Deferred P2 Findings

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent** | `../spec.md` (021 phase parent) |
| **Handoff Criteria** | 3 P2 findings reconciled (CLOSED or DEFERRED-AGAIN ADR); 68 = 65 + 3 math verified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 015 investigation found 68 P2 findings. Arcs 017/005 (cleanup sweep) + 020/001-006 (deferred-P2 remediation) closed 65. Three remain. Their exact IDs are not pre-confirmed — explorer's high-confidence guess is F103 + F104 + one of F106/F107/F108 but codex must verify before any code touched.

### Purpose
Systematic checklist sweep across every child packet of arc 009/015-019 + 020. For each P2 ID in the 015 registry: mark CLOSED if it appears in any child's checklist with closure evidence; otherwise DEFERRED. Total must reconcile to 68. Close the 3 deferred (or ADR-escalate to DEFERRED-AGAIN with the F99 criterion).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read every P2 entry in `../../015-deep-research-drift-and-simplification/research/findings-registry.json`.
- Sweep every child checklist + decision-record under `../../016/`, `../../017/`, `../../018/`, `../../019/`, `../../020/`.
- Emit a reconciliation CSV at `<this-folder>/scratch/p2-closure-tally.csv`: `{id, severity, status, last-mention-path, latest-commit-sha}`.
- Close the 3 unfinished P2 (likely scope: 1-2 launcher files + 1-2 barrel exports).
- Per-finding ADR in `decision-record.md` documenting the closure rationale.

### Out of Scope
- Re-opening already-CLOSED findings.
- Touching P0 or P1 findings (already 100% closed).
- Refactor beyond the 3 identified findings.

### Files to Change
| File | Change | Reason |
|---|---|---|
| `<this-folder>/scratch/p2-closure-tally.csv` | Create | Reconciliation evidence |
| TBD (depends on which 3 IDs) | Modify | Likely `ensure-rerank-sidecar.cjs` / `ensure_rerank_sidecar.py` / `embedders/index.ts` |
| `<this-folder>/decision-record.md` | Create | ≥ 1 ADR per P2 closure |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Identify exact 3 deferred P2 IDs | CSV totals 65 CLOSED + 3 DEFERRED = 68 |
| REQ-002 | Close 3 P2 OR ADR DEFERRED-AGAIN | Each finding has either commit-sha closure evidence or signed ADR |

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No regression in vitest + pytest | Embedders vitest + bin vitest + pytest PASS |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: P2 reconciliation tally exists + math correct
- **SC-002**: 3 P2 closed or DEFERRED-AGAIN ADR'd
- **SC-003**: Vitest + pytest exit 0
- **SC-004**: Strict validate exit 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The 3 deferred IDs differ from explorer guess | Med | Codex sweep is identification-first — math reconciles before code touched |
| Risk | One of the 3 requires cross-consumer API change | High | ADR-escalate DEFERRED-AGAIN per F99 criterion from arc 020/004 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
### Reliability
- **NFR-R01**: zero unrelated test regressions
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
### Data Boundaries
- Empty registry rows: skip
- Findings marked CLOSED but with empty evidence: count as CLOSED (operator audit-trail in commit message)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 3 findings, mostly mechanical |
| Risk | 12/25 | Behavior-change risk on launcher parity |
| Research | 6/20 | Identification step in scope |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
- Which 3 P2 IDs are actually still deferred? Codex sweep produces the answer.
- For F103/F104 (likely): which side of the JS↔Python parity gets the patch? Default: port Python to match JS (JS already hardened in 020/003).
<!-- /ANCHOR:questions -->
