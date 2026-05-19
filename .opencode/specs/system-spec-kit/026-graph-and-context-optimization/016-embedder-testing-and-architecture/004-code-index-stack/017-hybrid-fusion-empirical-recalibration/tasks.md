---
title: "Tasks: 016/004/017 Hybrid Fusion Empirical Recalibration"
description: "Task ledger for RRF sweep harness, deterministic analyzer, config lock, bench evidence, ADR-020, docs, and validation."
trigger_phrases: ["016/004/017 tasks", "RRF sweep tasks", "hybrid fusion tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/017-hybrid-fusion-empirical-recalibration"
    last_updated_at: "2026-05-19T17:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed non-shared harness/analyzer/tests/docs; deferred shared phases"
    next_safe_action: "Resume after feat(016/004/016) is present in git log"
    blockers:
      - "Missing feat(016/004/016) commit"
    key_files:
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004017"
      session_id: "016-004-017-tasks"
      parent_session_id: "016-004-017"
    completion_pct: 45
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: 016/004/017 Hybrid Fusion Empirical Recalibration

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` - completed
- `[ ]` - pending
- `[B]` - blocked
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] T001 - Read `spec.md`, current RRF/query/config locations, existing Phase 2 bench harness, corrected fixture path, post-016 comparison artifact, and 013-016 implementation summaries.
- [x] T002 - Invoke sequential-thinking MCP at least five times before edits. Evidence: six calls returned `user cancelled MCP tool call`; planning was recorded in tool-call inputs and docs.
- [x] T003 - Confirm `feat(016/004/016)` is absent from `git log --oneline -10`; activate shared-file lock.
- [x] T004 - Add `sweep-rrf.sh` with JSON-list grid env parsing, `--resume`, optional `--limit`, per-cell daemon restart, per-cell bench invocation, and per-cell JSON capture.
- [x] T005 - Set both requested `COCOINDEX_RRF_*` vars and current `COCOINDEX_HYBRID_*` vars during each cell for backward compatibility.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

- [x] T006 - Add `sweep-rrf.py` with importable grid parsing, cell loading, p50/p95 summarization, baseline parsing, and deterministic picker.
- [x] T007 - Emit `evidence/sweep-results.md` with top cells, per-probe heatmap, latency scatter, picked cell, three-sentence rationale, and probe notes.
- [x] T008 - Add `tests/test_rrf_config.py` for sweep grid defaults, overrides, invalid values, and picker latency/default tiebreak behavior.
- [x] T009 - Run syntax and targeted tests for the new non-shared files.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [B] T010 - Run 64-cell sweep with default grid. Blocked until `feat(016/004/016)` exists.
- [B] T011 - Inspect `evidence/sweep-results.md` and picked cell. Blocked until T010.
- [B] T012 - Ensure 64 successful cell JSON files exist. Blocked until T010.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:phase-4 -->
## 5. PHASE 4: DEFAULT LOCK AND FINAL GATE

- [B] T013 - Lock `COCOINDEX_HYBRID_RRF_K`, `COCOINDEX_HYBRID_VECTOR_WEIGHT`, and `COCOINDEX_HYBRID_FTS5_WEIGHT` defaults in `config.py`. Blocked by missing 016 commit.
- [B] T014 - Update `query.py` only if shared integration still needs changes after 016 lands. Blocked by missing 016 commit.
- [B] T015 - Lock picked defaults in `config.py`. Blocked by sweep evidence.
- [B] T016 - Run final no-env corrected bench and save `evidence/phase2-comparison-017-recalibrated.md`. Blocked by T015.
<!-- /ANCHOR:phase-4 -->

<!-- ANCHOR:phase-5 -->
## 6. PHASE 5: ADR, README, VALIDATION

- [B] T017 - Append ADR-020 to the bake-off `decision-record.md`. Blocked by picked-cell evidence.
- [B] T018 - Update `cocoindex_code/README.md` hybrid search section. Blocked by picked-cell evidence.
- [x] T019 - Create L2 packet docs and metadata reflecting current partial state and blocker.
- [x] T020 - Run strict validation on the current partial packet docs. Evidence: `validate.sh --strict` returned `RESULT: PASSED`.
- [B] T021 - Reconcile final completion metadata after full sweep, final bench, ADR, and README are complete. Blocked until final evidence exists.
<!-- /ANCHOR:phase-5 -->

<!-- ANCHOR:completion -->
## 7. COMPLETION CRITERIA

- [x] R1-R3 harness and grid contract implemented for future full sweep.
- [x] R2/R5 analyzer and deterministic picker implemented.
- [B] R4 shared config/query env contract blocked by missing 016 commit.
- [B] R6 full sweep report blocked by missing 016 commit.
- [B] R7 ADR-020 blocked by picked-cell evidence.
- [B] R8 final bench gate blocked by picked-cell defaults.
- [x] R9 focused sweep-config tests added and passing.
- [x] R10 current packet docs strict-validate successfully; final completion validation remains blocked until full evidence exists.
- [B] R11 README update blocked by picked-cell evidence.
- [B] R12 latency cap enforced in picker, but final compliance needs full sweep evidence.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 8. CROSS-REFERENCES

- Spec: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
- Summary: `implementation-summary.md`
- Sweep wrapper: `../011-rerank-model-fit-investigation/research/phase2-bench/sweep-rrf.sh`
- Analyzer: `../011-rerank-model-fit-investigation/research/phase2-bench/sweep-rrf.py`
<!-- /ANCHOR:cross-refs -->
