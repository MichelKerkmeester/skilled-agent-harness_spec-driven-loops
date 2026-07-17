---
title: "Tasks: Investigation P1 Fixes for Execution-Router Policy and Shutdown Hooks"
description: "Task ledger for closing F6, F31, F52, F53, F58, F61, and F74."
trigger_phrases:
  - "arc 010 003 002 tasks"
  - "execution-router p1 task ledger"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/002-fix-investigation-p1s-for-execution-router-policy-and-shutdown-hooks"
    last_updated_at: "2026-05-23T06:22:00Z"
    last_updated_by: "codex"
    recent_action: "completed-execution-router-tasks"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0100030020100030020100030020100030020100030020100030020100030020"
      session_id: "010-003-002-execution-router-p1"
      parent_session_id: null
    completion_pct: 100
---

# Tasks: Investigation P1 Fixes for Execution-Router Policy and Shutdown Hooks

<!-- SPECKIT_LEVEL: 2 -->
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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read phase parent, sibling canonical packet, prior F37 pattern, findings registry, router source, and embedder tests.
- [x] T002 Scaffold Level 2 packet docs with canonical anchors.
- [x] T003 Run strict validation on scaffold before source edits.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Close F6 by moving the testables aggregate to `execution-router.testables.ts`.
- [x] T005 [P] Close F31 by splitting pure policy resolution from warning logging.
- [x] T006 Close F52 by collapsing dimension fallback to explicit/config plus default.
- [x] T007 Close F61 by warning when fallback dimensions come from a mismatched provider/model.
- [x] T008 Close F53 and F58 by simplifying shared signal hook registration and documenting best-effort cleanup.
- [x] T009 [P] Close F74 by deleting `DirectProviderAdapter.ready()`.
- [x] T010 Add execution-router fixture tests for policy, fallback, warning, shutdown hooks, and ready deletion.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run embedder vitest command.
- [x] T012 Run MCP server workspace typecheck.
- [x] T013 Run strict packet validation.
- [x] T014 Fill checklist, decision record, implementation summary, description metadata, and graph metadata with final evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 7 P1 findings are checked off in `checklist.md`.
- [x] Embedder vitest exits 0.
- [x] MCP server typecheck exits 0.
- [x] Strict packet validation exits 0.
- [x] Handoff lists absolute paths and the suggested commit message.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Verification**: See `checklist.md`.
- **Decisions**: See `decision-record.md`.
<!-- /ANCHOR:cross-refs -->
