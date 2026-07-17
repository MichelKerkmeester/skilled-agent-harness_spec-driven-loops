---
title: "Tasks: Indexer Surface Investigation"
description: "Task ledger for the research-only indexer surface mapping packet."
trigger_phrases:
  - "indexer surface investigation tasks"
  - "016 retrieval surface tasks"
  - "ollama bge promotion indexer tasks"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/001-indexer-surface-investigation"
    last_updated_at: "2026-05-22T16:19:13Z"
    last_updated_by: "codex"
    recent_action: "Added Level 1 task ledger for strict validation."
    next_safe_action: "Keep research packet closed; no implementation action."
    blockers: []
    key_files:
      - "research.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0010010010010010010010010010010010010010010010010010010010010013"
      session_id: "001-indexer-surface-investigation-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Research table and implications were already captured."
---
# Tasks: Indexer Surface Investigation

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Read the research spec and parent arc metadata [File: spec.md]
- [x] T002 Confirm the packet is research-only [File: spec.md]
- [x] T003 Identify the consumer systems named by the spec [File: spec.md]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Inspect agent, command, skill, and MCP definitions [File: research.md]
- [x] T005 Map retrieval calls to indexer ownership [File: research.md]
- [x] T006 Classify indexed content and embedder tier [File: research.md]
- [x] T007 Record mismatches and sub-phase implications [File: research.md]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Add missing Level 1 docs for validator completeness [File: plan.md, tasks.md, implementation-summary.md]
- [x] T009 Update renamed parent path references [File: spec.md, research.md]
- [x] T010 Run strict validation until PASS [Test: validate.sh --strict]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Research table exists [File: research.md]
- [x] Per-system evidence is recorded [File: research.md]
- [x] No runtime behavior was changed [Scope: docs only]
- [x] Strict validation passes [Test: validate.sh --strict]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Research**: See `research.md`
- **Plan**: See `plan.md`
- **Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
