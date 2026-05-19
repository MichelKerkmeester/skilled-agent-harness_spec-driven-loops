---
title: "Tasks: 016/004/018 Rerank Matrix Re-Bench"
description: "Task ledger for the 018 rerank matrix harness, analyzer, dispatch tests, deferred full matrix, production default lock, ADR-021, and arc closure."
trigger_phrases:
  - "016/004/018 tasks"
  - "rerank matrix tasks"
  - "final reranker verdict tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/018-rerank-matrix-rebench"
    last_updated_at: "2026-05-19T14:35:00Z"
    last_updated_by: "codex"
    recent_action: "Completed Phase 1-2 non-shared implementation"
    next_safe_action: "Run full matrix after 016 and 017 commits"
    blockers:
      - "016/017 final commits absent from git log"
      - "Sandbox daemon smoke did not complete reliably"
    key_files:
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004018"
      session_id: "016-004-018-tasks"
      parent_session_id: "016-004-018"
    completion_pct: 45
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: 016/004/018 Rerank Matrix Re-Bench

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` - completed
- `[ ]` - pending
- `[B]` - blocked
- `[P]` - parallelizable
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] T001 - Read 018 `spec.md` fully and extract R1-R14.
- [x] T002 - Read current `reranker.py`, `rerankers_jina_v3.py`, `config.py`, and how rerank ablation is selected.
- [x] T003 - Read legacy `run-phase2-smoke.sh`, corrected fixture path, 013/014/015/016 summaries, and 017 spec state.
- [x] T004 - Check `git log --oneline -15` for `feat(016/004/016)` and `feat(016/004/017)`.
- [x] T005 - Invoke sequential-thinking MCP five times before edits.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

- [x] T006 [P] - Create `rerank-matrix-bench.sh` with A-D lanes, optional E lane, default 3 iterations, `--resume`, lane subsets, fixture override, per-run JSON, and repo-writable daemon runtime default.
- [x] T007 [P] - Create `rerank-matrix-analyze.py` with summary table, majority heatmap, decision matrix, deterministic picker, winner rationale, and runner-up scenario.
- [x] T008 [P] - Add `tests/test_rerank_dispatch.py` covering no-rerank ablation env, model override, BGE default dispatch, jina override dispatch, and model-keyed cache behavior.
- [x] T009 - Preserve losing adapters; no `rerankers_jina_v3.py` deletion.
- [x] T010 - Avoid shared files: no changes to `config.py`, `cocoindex_code/README.md`, or the bake-off `decision-record.md`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] T011 - Run `bash -n rerank-matrix-bench.sh`.
- [x] T012 - Run `python -m py_compile rerank-matrix-analyze.py tests/test_rerank_dispatch.py`.
- [x] T013 - Run targeted pytest for `tests/test_rerank_dispatch.py`.
- [B] T014 - Smoke-test Lane A + Lane B with one iteration each. Blocked: sandbox daemon run did not complete reliably after runtime-dir mitigation; invalid partial artifacts were removed.
- [B] T015 - Run full 4-lane x 3-iteration matrix. Blocked until 017 commit is visible.
- [B] T016 - Run analyzer on full matrix and inspect winner. Blocked until T015.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:phase-4 -->
## 5. PHASE 4: ADR, DOCS, VALIDATION

- [x] T017 - Create L2 packet plan, tasks, checklist, implementation summary, description metadata, and graph metadata for the non-shared tranche.
- [B] T018 - Lock production default in `config.py`. Blocked until full matrix winner.
- [B] T019 - Run final no-env bench as `phase2-comparison-018-final.md`. Blocked until T018.
- [B] T020 - Append ADR-021. Blocked until empirical numbers exist.
- [B] T021 - Update `cocoindex_code/README.md`. Blocked until default winner exists.
- [B] T022 - Update parent continuity and optional `arc-shipped-summary.md`. Blocked until arc actually ships.
- [ ] T023 - Run strict validation for current packet docs.
<!-- /ANCHOR:phase-4 -->

<!-- ANCHOR:completion -->
## 6. COMPLETION CRITERIA

- [x] R1-R2 implementation scaffolding exists for harness/analyzer.
- [x] R3-R4 analyzer implements multi-run aggregation and deterministic picker.
- [B] R5-R9 production default, ADR, and final-state baseline are blocked by upstream commit gate and missing full matrix.
- [x] R10 dispatch tests added and targeted pytest passes.
- [ ] R11 strict validation current packet.
- [B] R12-R14 arc closure, README, and ADR index are blocked until 016/017 land and full matrix completes.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 7. CROSS-REFERENCES

- Spec: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
- Summary: `implementation-summary.md`
- Harness: `../011-rerank-model-fit-investigation/research/phase2-bench/rerank-matrix-bench.sh`
- Analyzer: `../011-rerank-model-fit-investigation/research/phase2-bench/rerank-matrix-analyze.py`
<!-- /ANCHOR:cross-refs -->
