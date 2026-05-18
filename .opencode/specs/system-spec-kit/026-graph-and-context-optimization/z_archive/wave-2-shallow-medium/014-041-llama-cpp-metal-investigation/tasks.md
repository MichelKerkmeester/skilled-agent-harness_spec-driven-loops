---
title: "Tasks: llama-cpp Metal Investigation [template:level_1/tasks.md]"
description: "Task ledger for a research-only packet investigating node-llama-cpp Metal backend failures."
trigger_phrases:
  - "tasks"
  - "llama-cpp"
  - "Metal"
  - "research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/041-llama-cpp-metal-investigation"
    last_updated_at: "2026-05-14T15:23:23Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-041"
    recent_action: "Created research task ledger"
    next_safe_action: "Review ADR"
    blockers: []
    key_files:
      - "tasks.md"
      - "research.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:a66a0e03c3d7ff47ea0cd24ea81854cd9ac1c5fed59dac8442d05823ae978aba"
      session_id: "cli-codex-gpt5.5-xhigh-fast-041"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: llama-cpp Metal Investigation

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

- [x] T001 Run pre-check for existing `041-*` folder
- [x] T002 [P] Read system-spec-kit templates
- [x] T003 Create scratch probe script in the 041 packet
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Capture Node, OS, Xcode, package, binary, and GGUF metadata
- [x] T005 Inspect provider and node-llama-cpp backend selection behavior without editing source
- [x] T006 Run explicit `gpuLayers: 0` auto backend probe
- [x] T007 Run explicit CPU backend probe with `build: "never"`
- [x] T008 Document H1-H5 evidence in `research.md`
- [x] T009 Record recommendation in `decision-record.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run strict spec validation
- [x] T011 Stage only the 041 packet folder
- [x] T012 Commit research packet on `main`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `research.md`
- **ADR**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
