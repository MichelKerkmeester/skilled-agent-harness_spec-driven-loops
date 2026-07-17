---
title: "Tasks: Newer Text Embedders Survey"
description: "Task ledger for the research-only post-May-2026 HF text embedder survey."
trigger_phrases:
  - "newer text embedders tasks"
  - "post may embedder survey tasks"
  - "mk-spec-memory candidate refresh tasks"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/004-newer-text-embedders-survey"
    last_updated_at: "2026-05-18T20:41:03Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed research-only task ledger."
    next_safe_action: "Run strict validation; no benchmark dispatch."
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/004-newer-text-embedders-survey/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "004-newer-text-embedders-survey-tasks-20260518"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No MEASURE candidates; no bench task opened."
---
# Tasks: Newer Text Embedders Survey

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

- [x] T001 Read supplied spec and metadata (`spec.md`, `description.json`, `graph-metadata.json`) [File: spec.md]
- [x] T002 Read Level 1 template and validation contract [Source: system-spec-kit template contract]
- [x] T003 Locate existing bake-off scaffold for possible Phase-2 reference [File: ../../002-spec-memory-stack/004-spec-memory-embedder-bake-off/]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Search requested HF lab/model surfaces for post-2026-05-01 candidates [Source: research.md §6]
- [x] T005 Capture candidate metadata: model_id, dates, size, MTEB/text score, training summary, license, paraphrase signal, Apple compatibility [File: research.md]
- [x] T006 Apply SKIP / CONSIDER / MEASURE rubric [File: research.md]
- [x] T007 Write research verdict with HOLD decision [File: research.md]
- [x] T008 Author missing Level 1 docs [File: plan.md, tasks.md, implementation-summary.md]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Confirm zero MEASURE candidates and no benchmark dispatch [File: research.md]
- [x] T010 Update implementation summary with verdict count and Commit Handoff [File: implementation-summary.md]
- [x] T011 Run strict validation until PASS [Test: validate.sh --strict - PASSED]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Candidate survey documented [File: research.md]
- [x] Standing decision recorded as HOLD on jina-v3 + rescue [File: research.md]
- [x] Bench plan omitted because MEASURE count is zero [File: research.md]
- [x] Strict validation passes [Test: validate.sh --strict - PASSED]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Research**: See `research.md`
- **Summary**: See `implementation-summary.md`
- **Bake-off scaffold**: See `../../002-spec-memory-stack/004-spec-memory-embedder-bake-off/`
<!-- /ANCHOR:cross-refs -->
