---
title: "Tasks: Delete the inactive LLM-model reranking (cross-encoder + local GGUF reranker + reranker interface + conditional-rerank gate + 7 tests; remove stage3 Step 1) while preserving the active algorithmic MMR diversity reranker; behavior-neutral, triple-verified via tsc + full memory-search vitest [template:level_2/tasks.md]"
description: "Completed task ledger for packet 017: code cleanup, doc alignment, test cleanup, and verification of MMR preservation."
trigger_phrases:
  - "tasks"
  - "remove llm reranking"
  - "keep mmr"
  - "reranker cleanup"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/017-remove-llm-reranking-keep-mmr"
    last_updated_at: "2026-05-25T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Marked completed tasks for code, docs, tests, and verification."
    next_safe_action: "commit 017 changeset"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/result-explainability.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/decision-audit.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts"
    session_dedup:
      fingerprint: "sha256:6587d9dbefe05b61a2b6749dfc08d87f9e0321641eb442f35ef528a02dd0cb0b"
      session_id: "017-remove-llm-reranking-keep-mmr-doc-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Delete the inactive LLM-model reranking (cross-encoder + local GGUF reranker + reranker interface + conditional-rerank gate + 7 tests; remove stage3 Step 1) while preserving the active algorithmic MMR diversity reranker; behavior-neutral, triple-verified via tsc + full memory-search vitest

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

- [x] T001 Confirm predecessor commit split: core removal already landed in packet 014/003 commit `b564013c0e`.
- [x] T002 Classify MMR as algorithmic diversity vector math, distinct from the LLM cross-encoder/local GGUF sidecar.
- [x] T003 [P] Identify historical records and unrelated fields that must remain out of scope.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [A] Remove reranker confidence scoring vestiges (`.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts`).
- [x] T005 [A] Remove dead explainability reranker support signal (`.opencode/skills/system-spec-kit/mcp_server/lib/search/result-explainability.ts`).
- [x] T006 [A] Remove stale rerank trigger audit metric (`.opencode/skills/system-spec-kit/mcp_server/lib/search/decision-audit.ts`).
- [x] T007 [A] Remove stale canonical reranker output comment (`.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`).
- [x] T008 [B] Align Stage 3 narratives to MMR diversity reranking plus MPAB chunk collapse across active docs and feature catalog files.
- [x] T009 [B] Remove retired reranker flags and the COHERE_API_KEY row from active environment/flag references.
- [x] T010 [B] Delete dangling local GGUF reranker feature-catalog/playbook references that pointed at files removed earlier.
- [x] T011 [B] Correct confidence docs from four factors to three factors and remove `reranker_support`/`reranker_boost` UX references.
- [x] T012 [B] Complete post-deprecation doc alignment in root README and `references/memory/embedder_pluggability.md`.
- [x] T013 [C] Remove reranker-specific assertions, fixtures, and cases from affected Vitest files.
- [x] T014 [C] Strengthen `result-confidence` high-envelope fixture with vector/FTS sources and a second anchor.
- [x] T015 [C] Fix the stale embedder-default assertion from `BAAI/bge-base-en-v1.5` to `nomic-ai/nomic-embed-text-v1.5`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 [D] Run `node_modules/.bin/tsc --noEmit -p mcp_server/tsconfig.json` and record 0 errors.
- [x] T017 [D] Run affected test set and record 14 files / 493 tests passed.
- [x] T018 [D] Run broad search/scoring/pipeline/retrieval subsystem subset and record 107 files / 2371 tests passed.
- [x] T019 [D] Confirm MMR independence: no cross-encoder imports, `SPECKIT_MMR` Stage 3 step intact, MMR-only regression passes.
- [x] T020 [D] Document full 528-file suite limitation and substitution evidence.
- [x] T021 [D] Author Level 2 packet docs and prepare metadata/strict validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual and automated verification evidence captured.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
