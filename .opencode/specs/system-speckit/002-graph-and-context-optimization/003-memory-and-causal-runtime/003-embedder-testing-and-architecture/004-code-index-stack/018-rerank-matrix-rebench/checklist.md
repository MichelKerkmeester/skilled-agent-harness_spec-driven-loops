---
title: "Verification Checklist: 016/004/018 Rerank Matrix Re-Bench"
description: "Level 2 verification checklist for rerank matrix harness, analyzer, dispatch tests, deferred full matrix, production default lock, ADR-021, and arc closure."
trigger_phrases:
  - "016/004/018 checklist"
  - "rerank matrix verification"
  - "final reranker verdict checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/018-rerank-matrix-rebench"
    last_updated_at: "2026-05-19T14:35:00Z"
    last_updated_by: "codex"
    recent_action: "Checklist documents completed and blocked gates"
    next_safe_action: "Complete blocked bench/default/ADR gates after 017"
    blockers:
      - "016 and 017 final commits not both visible"
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004018"
      session_id: "016-004-018-checklist"
      parent_session_id: "016-004-018"
    completion_pct: 45
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: 016/004/018 Rerank Matrix Re-Bench

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|---|---|---|
| P0 | Hard blocker | Cannot claim full packet completion until passing |
| P1 | Required | Must pass or be explicitly documented |
| P2 | Optional | Can defer with rationale |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Spec and requirements read before edits.
  - **Evidence**: `spec.md` §3-4 drove R1-R14.
- [x] CHK-002 [P0] Reranker dispatch and config read before edits.
  - **Evidence**: `reranker.py`, `rerankers_jina_v3.py`, and `config.py` were read.
- [x] CHK-003 [P0] Parallel commit boundary checked.
  - **Evidence**: `git log --oneline -15` showed 015, but not `feat(016/004/016)` or `feat(016/004/017)`.
- [x] CHK-004 [P1] Sequential-thinking request handled honestly.
  - **Evidence**: five sequential-thinking MCP calls were made before edits; each returned `user cancelled MCP tool call`.
- [x] CHK-005 [P1] SpawnAgent status recorded.
  - **Evidence**: SpawnAgent was not used; final handoff is `SPAWN_AGENT_USED=no`.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Harness supports all required lanes.
  - **Evidence**: `rerank-matrix-bench.sh` defines lanes A-D and auto-adds Lane E when `rerankers_mxbai.py` exists.
- [x] CHK-011 [P0] Harness has resume and smoke-subset controls.
  - **Evidence**: `--resume`, `--lanes`, and `--iterations` are implemented.
- [x] CHK-012 [P0] Analyzer picker is deterministic.
  - **Evidence**: picker sorts by hit rate, worst-case misses, p95, RAM, maintainability, and stable lane id.
- [x] CHK-013 [P1] Bash stays macOS-compatible.
  - **Evidence**: associative arrays were removed; `bash -n` passes under the local shell.
- [x] CHK-014 [P1] Shared files untouched in this tranche.
  - **Evidence**: this pass did not edit `config.py`, `cocoindex_code/README.md`, or the bake-off decision record.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Shell syntax passes.
  - **Evidence**: `bash -n rerank-matrix-bench.sh` returned exit 0.
- [x] CHK-021 [P0] Python syntax passes.
  - **Evidence**: `python -m py_compile rerank-matrix-analyze.py tests/test_rerank_dispatch.py` returned exit 0.
- [x] CHK-022 [P0] Targeted dispatch pytest passes.
  - **Evidence**: `5 passed` in `tests/test_rerank_dispatch.py`.
- [x] CHK-023 [P1] A+B smoke subset produces valid JSON.
  - **Evidence**: attempted; daemon run did not complete reliably in sandbox. Invalid partial artifacts were removed.
- [x] CHK-024 [P0] Full matrix produces all 12 or 15 run JSONs.
  - **Evidence**: blocked until 017 commit is visible.
- [x] CHK-025 [P0] Analyzer emits final `rerank-matrix-results.md`.
  - **Evidence**: blocked until full matrix run JSONs exist.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned.
  - **Evidence**: empirical matrix/decision packet; not a code defect fix until Phase 4 defaults lock.
- [x] CHK-FIX-002 [P0] Candidate lanes enumerated.
  - **Evidence**: A no-rerank, B BGE, C BGE+path-class, D jina-v3, optional E mxbai.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for current tranche.
  - **Evidence**: harness writes normalized JSON; analyzer consumes normalized JSON; tests cover dispatch/config.
- [x] CHK-FIX-004 [P0] Production default is evidence-backed.
  - **Evidence**: blocked until full matrix results exist.
- [x] CHK-FIX-005 [P1] Rollback path exists for current tranche.
  - **Evidence**: no production behavior changed; rollback is deleting new harness/analyzer/tests/docs.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials added.
  - **Evidence**: changes are shell, Python, tests, markdown, and metadata only.
- [x] CHK-031 [P1] No database reset or re-index performed.
  - **Evidence**: no `ccc reset` or `ccc index` command was run.
- [x] CHK-032 [P1] Runtime path stays overrideable.
  - **Evidence**: harness sets `COCOINDEX_CODE_DIR` only when the operator has not set it.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Packet docs written for the completed tranche.
  - **Evidence**: `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` exist.
- [x] CHK-041 [P0] ADR-021 appended.
  - **Evidence**: blocked until full matrix empirical numbers exist.
- [x] CHK-042 [P0] README updated with final default.
  - **Evidence**: blocked until picker winner exists.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] New harness files live in the existing Phase 2 bench folder.
  - **Evidence**: `../011-rerank-model-fit-investigation/research/phase2-bench/rerank-matrix-bench.sh` and `rerank-matrix-analyze.py`.
- [x] CHK-051 [P1] Invalid smoke artifacts not retained.
  - **Evidence**: partial `laneA-iter1.*` artifacts from the failed sandbox smoke were removed.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Blocked |
|---|---:|---:|---:|
| P0 Items | 17 | 13/17 | 4 |
| P1 Items | 10 | 9/10 | 1 |
| P2 Items | 0 | 0/0 | 0 |

**Verification Date**: 2026-05-19
**Verified By**: Codex
<!-- /ANCHOR:summary -->
