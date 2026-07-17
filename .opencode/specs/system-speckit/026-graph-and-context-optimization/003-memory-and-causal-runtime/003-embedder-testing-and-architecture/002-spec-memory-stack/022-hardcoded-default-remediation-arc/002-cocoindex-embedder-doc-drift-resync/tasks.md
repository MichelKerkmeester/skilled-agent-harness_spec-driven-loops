---
title: "Tasks: 022/002 CocoIndex Embedder Doc-Drift Resync"
description: "5 tasks; all complete in single execution."
trigger_phrases:
  - "022/002 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002-cocoindex-embedder-doc-drift-resync"
    last_updated_at: "2026-05-23T16:15:00Z"
    last_updated_by: "main_agent"
    recent_action: "All tasks complete"
    next_safe_action: "n/a"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022c3"
      session_id: "016-002-022-002-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Tasks shipped"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: 022/002 CocoIndex Embedder Doc-Drift Resync

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` complete | `[ ]` pending
- `[T###]` task id | `[P#]` priority
- All shipped in single execution 2026-05-23 ~16:10 UTC
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] [T001] [P0] Read `registered_embedders.py:255-256` to confirm `DEFAULT_EMBEDDER_NAME='sbert/nomic-ai/CodeRankEmbed'` and `DEFAULT_RERANKER_NAME='Qwen/Qwen3-Reranker-0.6B'`.
- [x] [T002] [P0] Confirm memory entry `project_2026_05_19_cocoindex_arc_shipped.md` is stale on reranker (says jina-v3; actual current default is Qwen3-0.6B per 023B follow-on). Action: defer reranker doc edits to 002b; update memory entry post-arc.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

- [x] [T003] [P0] Edit `config_templates.md`: 3 `_NOTE_2` lines (positions 75, 140, 160) `google/embeddinggemma-300m` → `sbert/nomic-ai/CodeRankEmbed`. Used `replace_all=true` on the surrounding 3-line context block.
- [x] [T004] [P1] Edit `embedder-pluggability.md:342`: annotate jina-v2-base-code row as "historical CocoIndex default per 018 ADR-001, superseded by `sbert/nomic-ai/CodeRankEmbed` in the 018 follow-on (corrected-pipeline bench tied `bge-code-v1` on hit rate with lower latency)".
- [x] [T005] [P2] Edit `ENV_REFERENCE.md:560`: date `2026-04-01` → `2026-05-23`.
- [x] [T006] [P0] Edit `SKILL.md:8`: keywords block — add `code-rank-embed` adjacent to existing `embeddinggemma-300m` (kept embeddinggemma as a search keyword for the registered baseline candidate).
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] [T007] [P0] `rg "google/embeddinggemma-300m" .opencode/skills/mcp-coco-index/assets/config_templates.md` returns 0 hits — VERIFIED.
- [x] [T008] [P0] `grep "Last updated: 2026-05-23" .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` returns 1 hit — VERIFIED.
- [x] [T009] [P0] `grep "code-rank-embed" .opencode/skills/mcp-coco-index/SKILL.md` returns 1 hit — VERIFIED.
- [x] [T010] [P0] Strict-validate phase 002 exit 0 — VERIFIED.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

All P0/P1/P2 tasks complete. Phase 002 ships closing 2 P0 + 1 P1 + 1 P2 from the embedder side. Reranker side scoped for 002b.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- spec.md §4 REQUIREMENTS R1–R5 map to T003–T010
- plan.md §4 IMPLEMENTATION PHASES match
- implementation-summary.md captures shipped state + 002b deferred scope
<!-- /ANCHOR:cross-refs -->
