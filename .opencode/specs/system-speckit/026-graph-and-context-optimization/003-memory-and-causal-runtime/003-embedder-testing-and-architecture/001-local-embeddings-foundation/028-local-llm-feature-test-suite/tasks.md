---
title: "Tasks: Comprehensive local-LLM (hf-local + llama-cpp) feature test suite. 10 functional vitest groups + perf benchmarks (embedding latency, throughput, cold-start, migration throughput). Validates every feature claim in shared/README, embedding_resilience, INSTALL_GUIDE, ENV_REFERENCE, feature_catalog 23/05-5. Acceptance: 0 failed assertions; perf baseline captured for regression tracking. [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/028-local-llm-feature-test-suite"
    last_updated_at: "2026-05-13T19:09:45Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/028-local-llm-feature-test-suite"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Partial local-LLM feature test suite; remaining completion moves to 029-local-llm-feature-test-suite-completion

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] T001 Create project structure
- [ ] T002 Install dependencies
- [ ] T003 [P] Configure development tools
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Record shipped partial local-LLM feature coverage from the remediation stream
- [x] T005 Mark comprehensive 10-group suite and 4 perf benches as not shipped here
- [ ] T006 Defer remaining coverage to `029-local-llm-feature-test-suite-completion/`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Verify this packet no longer claims full suite completion
- [ ] T009 Completion packet validates remaining suite and perf benches
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

