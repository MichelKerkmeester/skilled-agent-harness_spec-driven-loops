---
title: "Tasks: 006-hybrid-rag-fusion-logic-improvements [template:level_3+/tasks.md]"
description: "Task Format: T### [P0/P1/P2] [P?] Description (file path)"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "tasks"
  - "hybrid rag"
  - "fusion improvements"
  - "audit"
  - "bug prevention"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: 006-hybrid-rag-fusion-logic-improvements

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
| `[P0]`/`[P1]`/`[P2]` | Priority |

**Task Format**: `T### [priority] [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

## Prior-Work Carry-Forward

| Prior Spec | Required Carry-Forward in 006 |
|------------|-------------------------------|
| `002-hybrid-rag-fusion` | Preserve tri-hybrid + MMR/TRM baseline while hardening seams |
| `003-index-tier-anomalies` | Keep canonical path and tier precedence as hard invariants |
| `004-frontmatter-indexing` | Treat normalized frontmatter + idempotent reindex as mandatory preconditions |
| `005-auto-detected-session-bug` | Keep low-confidence routing safeguards and archive exclusion behavior |

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Deep System Audit

- [ ] T001 [P0] Build end-to-end retrieval/index/routing component map (`mcp_server/lib/search/*`, `handlers/*`, `scripts/spec-folder/*`)
- [ ] T002 [P0] Capture baseline fixture corpus and latency/confidence metrics (`mcp_server/tests/*`, benchmark scripts)
- [ ] T003 [P0] Create ranked seam-risk register with owner and mitigation (`spec.md`, `plan.md`, `decision-record.md`)
- [ ] T004 [P1] [P] Validate carry-forward assumptions from `002/003/004/005` against current behavior (`spec.md`, `plan.md`)
<!-- /ANCHOR:phase-1 -->

### Phase 1 Task Matrix

| Task ID | Depends On | Acceptance Criteria |
|---------|------------|---------------------|
| T001 | None | Component map includes inputs, outputs, and failure points per stage. |
| T002 | T001 | Baseline dataset and metrics are reproducible and documented. |
| T003 | T001, T002 | Top 10 risks are ranked by impact/likelihood with owner assigned. |
| T004 | T001 | Continuity matrix maps all inherited constraints to explicit controls. |

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Fusion Logic Hardening

- [ ] T005 [P0] Implement bounded adaptive-fusion guardrails and deterministic tie handling (`lib/search/adaptive-fusion.ts`)
- [ ] T006 [P0] Calibrate evidence-gap thresholds from audited distributions (`lib/search/evidence-gap-detector.ts`)
- [ ] T007 [P0] Make fallback sequence explicit and deterministic for low-signal retrieval (`lib/search/hybrid-search.ts`, `handlers/memory-search.ts`)
- [ ] T008 [P1] [P] Emit channel-contribution diagnostics for debug mode (`handlers/memory-search.ts`)
<!-- /ANCHOR:phase-2 -->

### Phase 2 Task Matrix

| Task ID | Depends On | Acceptance Criteria |
|---------|------------|---------------------|
| T005 | T002, T003 | Weight bounds and tie behavior are unit-tested and deterministic. |
| T006 | T002 | Threshold values are justified by baseline distributions and boundary tests. |
| T007 | T005, T006 | Fallback behavior is predictable and covered by integration tests. |
| T008 | T005 | Diagnostic payload exposes fusion rationale without leaking sensitive data. |

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Automation and Interconnection

- [ ] T009 [P0] Add invariant checks for index canonicalization and tier precedence (`handlers/memory-index.ts`, parser/scoring utilities)
- [ ] T010 [P0] Align retrieval confidence policy with folder detector confidence policy (`handlers/memory-search.ts`, `scripts/spec-folder/folder-detector.ts`)
- [ ] T011 [P1] [P] Wire CI gate outputs for invariant failures and drift summaries (CI config + scripts)
- [ ] T012 [P1] [P] Draft operational runbook for anomaly triage and rollback (`plan.md`, `checklist.md`)
<!-- /ANCHOR:phase-3 -->

### Phase 3 Task Matrix

| Task ID | Depends On | Acceptance Criteria |
|---------|------------|---------------------|
| T009 | T004, T007 | CI fails when canonicalization or tier invariants are broken. |
| T010 | T006, T007 | Low-confidence behavior is policy-aligned across retrieval and routing workflows. |
| T011 | T009, T010 | Build output includes actionable invariant diagnostics and links to failing checks. |
| T012 | T009, T010 | Runbook includes trigger thresholds, ownership, and rollback commands. |

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Bug Prevention and Governance Verification

- [ ] T013 [P0] Add regression scenarios for 003/004/005 failure classes (`mcp_server/tests/*`, script tests)
- [ ] T014 [P0] Run performance verification for `mode="auto"` and `mode="deep"` after hardening (benchmark suites)
- [ ] T015 [P1] Complete checklist evidence and close P0/P1 verification items (`checklist.md`)
- [ ] T016 [P1] Finalize decision record and implementation summary with delivered evidence (`decision-record.md`, `implementation-summary.md`)
- [ ] T017 [P2] Save memory context snapshot after implementation completion (`memory/` via generate-context script)
<!-- /ANCHOR:phase-4 -->

### Phase 4 Task Matrix

| Task ID | Depends On | Acceptance Criteria |
|---------|------------|---------------------|
| T013 | T009, T010 | Regression suite explicitly fails on reintroduced alias/tier/routing defects. |
| T014 | T005, T006, T007 | Performance budgets remain within agreed limits after checks are enabled. |
| T015 | T013, T014 | All P0 items complete and P1 items complete or formally deferred. |
| T016 | T015 | ADR status, approvals, and implementation evidence are synchronized. |
| T017 | T016 | Context snapshot saved with reference to final state and next-steps. |

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Regression and performance gates passed
- [ ] Governance approval workflow updated to approved state
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
TASKS FILE
Actionable task breakdown with dependency and acceptance matrices.
-->
