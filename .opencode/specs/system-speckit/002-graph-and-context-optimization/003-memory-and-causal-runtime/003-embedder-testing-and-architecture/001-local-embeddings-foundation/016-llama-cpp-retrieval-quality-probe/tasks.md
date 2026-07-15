---
title: "Tasks: 016 llama-cpp retrieval quality probe"
description: "Ordered task list and evidence for the llama-cpp retrieval quality probe."
trigger_phrases:
  - "016 retrieval probe tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/016-llama-cpp-retrieval-quality-probe"
    last_updated_at: "2026-05-13T10:23:12Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed retrieval probe and strict validation"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:3160160160160160160160160160160160160160160160160160160160160160"
      session_id: "016-llama-cpp-retrieval-quality-probe-2026-05-13"
      parent_session_id: "016-llama-cpp-retrieval-quality-probe-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 016 llama-cpp retrieval quality probe

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |

**Task Format**: `T### [P?] Description (file path) [evidence]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T000 Confirm no delegation. Evidence: `SPAWN_AGENT_USED=no`.
- [x] T001 Inspect Level 1 template anchors. Evidence: read `templates/examples/level_1/spec.md`.
- [x] T002 Inspect sibling packet 015 and parent metadata. Evidence: read 015 summary and parent `graph-metadata.json`.
- [x] T003 Inspect provider/factory contract. Evidence: `HfLocalProvider`, `LlamaCppProvider`, and `createEmbeddingsProvider()` read.
- [x] T004 Inspect sqlite schema read-only. Evidence: `memory_index.content_text` selected after `content`/`summary` columns were not present.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Create packet-local scratch directory. Evidence: `scratch/` exists under the 016 packet.
- [x] T011 Create probe harness. Evidence: `scratch/probe-retrieval-quality.ts`.
- [x] T012 Run initial probe and capture failure. Evidence: 2,048-char chunking exceeded llama-cpp embedding context.
- [x] T013 Adjust probe max text length fairly. Evidence: both providers use `PROBE_MAX_TEXT_LENGTH=700`.
- [x] T014 Run completed probe. Evidence: `scratch/probe-results.json` records `corpus_size=200`, `query_count=50`, and verdict `EQUIVALENT`.
- [x] T015 Generate human-readable examples. Evidence: `scratch/probe-results.md` contains five side-by-side top-5 comparisons.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Create Level 1 packet docs. Evidence: `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md`.
- [x] T021 Create packet metadata. Evidence: `description.json` and `graph-metadata.json`.
- [x] T022 Update parent graph metadata. Evidence: parent `children_ids` includes 016 and `last_active_child_id` points to 016.
- [x] T023 Run strict validation. Evidence: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../016-llama-cpp-retrieval-quality-probe --strict` exited 0 with 0 errors and 0 warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Existing sqlite store was not mutated.
- [x] No provider, factory, dependency, or external test files were edited.
- [x] Probe artifacts contain real measured numbers.
- [x] Human examples show no obvious canonicality regression.
- [x] Strict validation exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Parent packet: `../spec.md`
- Predecessor packet: `../015-node-llama-cpp-evaluation/implementation-summary.md`
- Results JSON: `scratch/probe-results.json`
- Results Markdown: `scratch/probe-results.md`
<!-- /ANCHOR:cross-refs -->
