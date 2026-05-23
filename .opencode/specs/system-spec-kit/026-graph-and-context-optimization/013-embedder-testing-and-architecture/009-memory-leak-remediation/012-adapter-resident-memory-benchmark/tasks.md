---
title: "Tasks: Adapter Resident-Memory Benchmark"
description: "Implementation tasks for Adapter Resident-Memory Benchmark."
trigger_phrases:
  - "adapter-resident-memory-benchmark"
  - "009 phase 012"
  - "adapter rss benchmark"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark"
    last_updated_at: "2026-05-22T16:03:59Z"
    last_updated_by: "codex"
    recent_action: "completed-arc-009-phase-012-adapter-rss-benchmark"
    next_safe_action: "arc-009-complete-or-operator-rss-followup"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0a02020202020202020202020202020202020202020202020202020202020202"
      session_id: "009-memory-leak-remediation-012"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Read the child spec and arc 009 phase 008 source decision. (`spec.md`, `../../009-memory-leak-remediation/008-sidecar-local-model-and-adapter-lifecycle/implementation-summary.md`)
- [x] T002 Identify successful-search and sidecar 5xx fallback benchmark entry points. (`.opencode/skills/mcp-coco-index/mcp_server/`)
- [x] T003 Replace scaffold placeholders in `plan.md` with concrete benchmark details. (`plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create benchmark folder. (`.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/`)
- [x] T005 Add successful-search RSS benchmark. (`bench_successful_search_rss.py`)
- [x] T006 Add sidecar 5xx fallback RSS benchmark. (`bench_sidecar_5xx_fallback_rss.py`)
- [x] T007 Add benchmark methodology and shared statistical behavior inside the scripts. (`methodology.md`, benchmark scripts)
- [x] T008 Record raw outputs and statistical summary. (`implementation-summary.md`)
- [x] T009 Record P2 hold or P1 escalation decision. (`implementation-summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run successful-search benchmark in the supported environment. (`.opencode/skills/mcp-coco-index/mcp_server/benchmarks/`)
- [x] T011 Run sidecar 5xx fallback benchmark in the supported environment. (`.opencode/skills/mcp-coco-index/mcp_server/benchmarks/`)
- [x] T012 Fill implementation evidence and limitations. (`implementation-summary.md`)
- [x] T013 Update remediation map item #13 with the benchmark outcome. (`../../009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/remediation-map.md`)
- [x] T014 Update parent arc status and completion percentage. (`../spec.md`)
- [x] T015 Strict-validate this phase and the parent arc. (`validate.sh --strict`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T004-T009 produce reproducible numbers and a severity decision, or an explicit operator-run deferral if sandbox-blocked.
- [x] T010-T011 pass or are documented with explicit environment limits.
- [x] T012 records methodology, results, and next action.
- [x] T013-T014 close the remediation map and parent arc status.
- [x] T015 exits 0 for both phase and parent arc.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent arc**: `../spec.md`
- **Phase spec**: `./spec.md`
- **Source decision**: `../../009-memory-leak-remediation/008-sidecar-local-model-and-adapter-lifecycle/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
