---
title: "Tasks: Adapter Resident-Memory Benchmark"
description: "Implementation tasks for Adapter Resident-Memory Benchmark."
trigger_phrases:
  - "adapter-resident-memory-benchmark"
  - "010 follow-on 2"
  - "adapter rss benchmark"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-memory-leak-follow-ons-arc/002-adapter-resident-memory-benchmark"
    last_updated_at: "2026-05-22T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded follow-on phase."
    next_safe_action: "Plan and execute this phase when ready."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0a02020202020202020202020202020202020202020202020202020202020202"
      session_id: "010-memory-leak-follow-ons-arc-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Source benchmark-gating decision documented in arc 009 phase 008 implementation-summary.md."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Adapter Resident-Memory Benchmark

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

- [ ] T001 Read the child spec and arc 009 phase 008 source decision. (`spec.md`, `../../009-memory-leak-remediation-arc/008-sidecar-local-model-and-adapter-lifecycle/implementation-summary.md`)
- [ ] T002 Identify successful-search and sidecar 5xx fallback benchmark entry points. (`.opencode/skills/mcp-coco-index/mcp_server/`)
- [ ] T003 Replace scaffold placeholders in `plan.md` with concrete benchmark details. (`plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create or wire the benchmark folder. (`.opencode/skills/mcp-coco-index/mcp_server/benchmarks/`)
- [ ] T005 Add successful-search RSS benchmark. (`.opencode/skills/mcp-coco-index/mcp_server/benchmarks/`)
- [ ] T006 Add sidecar 5xx fallback RSS benchmark. (`.opencode/skills/mcp-coco-index/mcp_server/benchmarks/`)
- [ ] T007 Add or reuse slope calculation helpers. (`.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts`)
- [ ] T008 Record raw outputs and statistical summary. (`implementation-summary.md`)
- [ ] T009 Record P2 hold or P1 escalation decision. (`implementation-summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run successful-search benchmark in the supported environment. (`.opencode/skills/mcp-coco-index/mcp_server/benchmarks/`)
- [ ] T011 Run sidecar 5xx fallback benchmark in the supported environment. (`.opencode/skills/mcp-coco-index/mcp_server/benchmarks/`)
- [ ] T012 Fill implementation evidence and limitations. (`implementation-summary.md`)
- [ ] T013 Strict-validate this phase and the parent arc. (`validate.sh --strict`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] T004-T009 produce reproducible numbers and a severity decision.
- [ ] T010-T011 pass or are documented with explicit environment limits.
- [ ] T012 records methodology, results, and next action.
- [ ] T013 exits 0 for both phase and parent arc.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent arc**: `../spec.md`
- **Phase spec**: `./spec.md`
- **Source decision**: `../../009-memory-leak-remediation-arc/008-sidecar-local-model-and-adapter-lifecycle/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
