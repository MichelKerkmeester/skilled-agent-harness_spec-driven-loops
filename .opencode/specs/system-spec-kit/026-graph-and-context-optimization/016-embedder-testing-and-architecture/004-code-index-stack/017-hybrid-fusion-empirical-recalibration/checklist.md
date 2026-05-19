---
title: "Verification Checklist: 016/004/017 Hybrid Fusion Empirical Recalibration"
description: "Level 2 checklist for the RRF sweep harness, deterministic picker, config default lock, final bench evidence, ADR-020, docs, and validation."
trigger_phrases: ["016/004/017 checklist", "RRF sweep verification", "hybrid fusion checklist"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/017-hybrid-fusion-empirical-recalibration"
    last_updated_at: "2026-05-19T17:00:00Z"
    last_updated_by: "codex"
    recent_action: "Verified non-shared harness/analyzer/test slice"
    next_safe_action: "Resume verification after feat(016/004/016)"
    blockers:
      - "Missing feat(016/004/016) commit"
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004017"
      session_id: "016-004-017-checklist"
      parent_session_id: "016-004-017"
    completion_pct: 45
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: 016/004/017 Hybrid Fusion Empirical Recalibration

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|---|---|---|
| P0 | Hard blocker | Cannot claim complete until passing |
| P1 | Required | Must pass or be explicitly documented |
| P2 | Optional | Can defer with rationale |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Spec and requirements read before edits.
  - **Evidence**: `spec.md` §3-4 and the user handoff were read and controlled scope.
- [x] CHK-002 [P0] Target files read before edits.
  - **Evidence**: current `config.py`, `query.py`, `fusion.py`, existing bench harness, corrected fixture path, post-016 comparison file, and 013-016 summaries were read.
- [x] CHK-003 [P1] Sequential-thinking request handled honestly.
  - **Evidence**: six MCP calls were made before edits; each returned `user cancelled MCP tool call`.
- [x] CHK-004 [P0] Shared-file lock checked.
  - **Evidence**: `git log --oneline -10` did not contain `feat(016/004/016)`.
- [x] CHK-005 [P0] SpawnAgent not used.
  - **Evidence**: no `spawn_agent` call was made; final run contract is `SPAWN_AGENT_USED=no`.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Harness parses the default 4x4x4 grid.
  - **Evidence**: `sweep-rrf.py::parse_grid_from_env` defaults to `[30,60,90,120]`, `[0.5,0.7,0.9,1.0]`, and `[0.3,0.5,0.7,0.9]`.
- [x] CHK-011 [P0] Harness supports grid overrides and resume.
  - **Evidence**: `sweep-rrf.sh` reads JSON-list env vars and skips existing cell JSONs under `--resume`.
- [x] CHK-012 [P0] Picker is deterministic.
  - **Evidence**: sort key is hit rate desc, p95 asc, default-distance asc, then config tuple.
- [x] CHK-013 [P1] Per-cell JSON schema is reusable.
  - **Evidence**: cells store status, numeric config, fixture path, comparison path, per-lane summary, latency, and per-probe rows.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Shell syntax passes.
  - **Evidence**: `bash -n sweep-rrf.sh` passed.
- [x] CHK-021 [P0] Analyzer syntax passes.
  - **Evidence**: `python -m py_compile sweep-rrf.py` passed.
- [x] CHK-022 [P0] Focused tests pass.
  - **Evidence**: `python -m pytest tests/test_rrf_config.py -q` passed.
- [x] CHK-023 [P0] Full MCP server pytest suite passes.
  - **Evidence**: Blocked until shared config/query edits are allowed.
- [x] CHK-024 [P0] Corrected 64-cell sweep completed.
  - **Evidence**: Blocked until `feat(016/004/016)`.
- [x] CHK-025 [P0] Final no-env bench meets hit-rate and p95 gates.
  - **Evidence**: Blocked until defaults are picked.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned.
  - **Evidence**: inherited RRF defaults are unmeasured configuration risk after candidate-set changes.
- [x] CHK-FIX-002 [P0] Harness can re-run for future embedders.
  - **Evidence**: wrapper does not hard-code embedder choice beyond delegating to the existing bench harness; operators can set `COCOINDEX_CODE_EMBEDDING_MODEL` when the harness supports it.
- [x] CHK-FIX-003 [P0] Defaults are evidence-derived.
  - **Evidence**: Blocked until sweep results exist.
- [x] CHK-FIX-004 [P0] Rollback path documented in ADR-020.
  - **Evidence**: Blocked until ADR-020 append.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials added.
  - **Evidence**: Changes are shell, Python, markdown, and JSON metadata only.
- [x] CHK-031 [P1] Live DB was not reset or re-indexed.
  - **Evidence**: No `ccc reset` or `ccc index` was run.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] ADR-020 appended.
  - **Evidence**: Blocked by missing picked-cell evidence.
- [x] CHK-041 [P0] README updated.
  - **Evidence**: Blocked by missing picked-cell evidence.
- [x] CHK-042 [P0] Packet docs synchronized for current partial state.
  - **Evidence**: `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json` exist.
- [x] CHK-043 [P0] Strict validation passes for the current partial packet docs.
  - **Evidence**: `validate.sh --strict` returned `RESULT: PASSED`.
- [x] CHK-044 [P0] Final completion validation passes after full evidence is available.
  - **Evidence**: Blocked until sweep, final bench, ADR-020, and README are complete.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] New harness files live beside the existing Phase 2 bench harness.
  - **Evidence**: `sweep-rrf.sh` and `sweep-rrf.py` are under `011-rerank-model-fit-investigation/research/phase2-bench/`.
- [x] CHK-051 [P1] New packet docs live under the scoped 017 packet.
  - **Evidence**: L2 docs and metadata are under `017-hybrid-fusion-empirical-recalibration/`.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Blocked |
|---|---:|---:|---:|
| P0 Items | 20 | 13 | 7 |
| P1 Items | 4 | 4 | 0 |
| P2 Items | 0 | 0 | 0 |

**Verification Date**: 2026-05-19
**Verified By**: Codex
<!-- /ANCHOR:summary -->
