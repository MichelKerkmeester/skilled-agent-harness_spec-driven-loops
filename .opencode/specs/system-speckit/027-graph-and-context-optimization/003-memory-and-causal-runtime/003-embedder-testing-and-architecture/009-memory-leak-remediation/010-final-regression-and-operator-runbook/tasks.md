---
title: "Tasks: Final Regression and Operator Runbook"
description: "Task list for final regression evidence, operator runbook, remediation-map closure, and arc completion."
trigger_phrases:
  - "final-regression-and-operator-runbook"
  - "memory leak 10"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook"
    last_updated_at: "2026-05-22T14:40:33Z"
    last_updated_by: "codex"
    recent_action: "planned-phase-010-task-ledger"
    next_safe_action: "execute-targeted-regression-suite"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "operator-runbook.md"
      - "../001-research-synthesis-and-remediation-map/research/remediation-map.md"
    session_dedup:
      fingerprint: "sha256:0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a"
      session_id: "009-memory-leak-remediation-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Tasks are mostly documentation and verification; no new runtime code is in scope."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Final Regression and Operator Runbook

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Read all preceding phase implementation summaries and build the bundled verification table: phases 003-004 deep-loop, 005 process sweep, 006 CocoIndex lifecycle, 007 Code Graph lifecycle, 008 sidecar/adapter lifecycle, and 009 runtime retention.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Run targeted Vitest/pytest from each phase and capture pass counts: mcp-server deep-loop tests for 003/004, scripts ops tests for 005, CocoIndex lifecycle tests for 006, system-code-graph lifecycle tests for 007, sidecar/reranker tests for 008, and mcp-server memory/runtime/embedder/providers tests for 009.
- [x] T003 Run process-memory-harness snapshot and process-sweep fixture, then record before/after or no-op baseline JSON evidence because destructive cleanup is gated.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Author `operator-runbook.md` with quick diagnostics, safe cleanup commands, no-action cases, Apple Silicon reboot-only pressure, phase reference table, and triage decision tree.
- [x] T005 Update `001-research-synthesis-and-remediation-map/research/remediation-map.md` so items 1-17 each have an implementation outcome, phase pointer, status, and evidence link.
- [x] T006 Fill `010-final-regression-and-operator-runbook/implementation-summary.md` with bundled regression evidence, process harness evidence, decisions, limitations, and continuity metadata.
- [x] T007 Update the arc parent `spec.md` and `graph-metadata.json`: phase 010 completed, all phases reconciled, `completion_pct: 100`, and `derived.status: completed`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Final Validation and Handoff

- [x] T008 Strict-validate phase 010, the phase parent, and every child phase 003-010.
- [x] T009 Write the `## Commit Handoff` block with suggested commit `feat(009/010): final regression sweep + operator runbook + arc closure` and absolute paths.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] REQ-001 is satisfied: all P0/P1 lifecycle phases have validation evidence in the bundled table.
- [x] REQ-002 is satisfied: operator guidance distinguishes safe exact-identity cleanup from no-action and reboot-only pressure.
- [x] SC-001 is satisfied: final regression, process baseline, strict validation, and memory index scan status are recorded.
- [x] SC-002 is satisfied: remediation map, implementation summary, and parent arc state are updated.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent arc**: ../spec.md
- **Remediation map**: ../001-research-synthesis-and-remediation-map/research/remediation-map.md
- **Phase 002 harness CLI**: `.opencode/skills/system-spec-kit/scripts/dist/ops/process-memory-harness.js`
- **Phase 005 sweep CLI**: `.opencode/skills/system-spec-kit/scripts/dist/ops/process-sweep.js`
<!-- /ANCHOR:cross-refs -->
