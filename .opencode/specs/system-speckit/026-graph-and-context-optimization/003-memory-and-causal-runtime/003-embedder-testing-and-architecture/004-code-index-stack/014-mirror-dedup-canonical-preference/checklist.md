---
title: "Verification Checklist: 016/004/014 Mirror Dedup with Canonical Preference"
description: "Level 2 verification checklist for mirror-aware CocoIndex dedup, config parsing, helper purity, integration tests, corrected bench evidence, ADR-017, and strict validation."
trigger_phrases: ["016/004/014 checklist", "mirror dedup verification", "canonical mirror checklist"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/014-mirror-dedup-canonical-preference"
    last_updated_at: "2026-05-19T13:10:00Z"
    last_updated_by: "codex"
    recent_action: "Completed verification checklist and strict validation"
    next_safe_action: "Commit handoff without git commit"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004014"
      session_id: "016-004-014-checklist"
      parent_session_id: "016-004-014"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: 016/004/014 Mirror Dedup with Canonical Preference

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
  - **Evidence**: `spec.md` §3-4 drove R1-R10 implementation.
- [x] CHK-002 [P0] Target files read before edits.
  - **Evidence**: `query.py`, `indexer.py`, `config.py`, trigger evidence, baseline, bench harness, tests, README, ADR target, and 013 summary were read.
- [x] CHK-003 [P1] Sequential-thinking request handled honestly.
  - **Evidence**: five MCP calls returned `user cancelled MCP tool call`; no successful sequential-thinking result was fabricated.
- [x] CHK-004 [P0] SpawnAgent not used.
  - **Evidence**: no `spawn_agent` call was made; final run contract is `SPAWN_AGENT_USED=no`.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Config supports canonical mirror and mirror prefixes.
  - **Evidence**: `Config.from_env()` parses `COCOINDEX_CANONICAL_MIRROR` and `COCOINDEX_MIRROR_PREFIXES`; `[]` disables mirror collapse.
- [x] CHK-011 [P0] Path helpers are pure.
  - **Evidence**: `path_utils.py` has no I/O or logging.
- [x] CHK-012 [P0] Query integration is two-pass.
  - **Evidence**: `_collapse_mirror_aliases()` runs before the existing `_dedup_key_from_record()` loop.
- [x] CHK-013 [P1] Distinct chunks are not over-collapsed.
  - **Evidence**: mirror groups are keyed by path stem plus content hash and line range, not by path stem alone.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Targeted pytest coverage passes.
  - **Evidence**: `.venv/bin/python -m pytest tests/test_path_utils.py tests/test_dedup_mirrors.py tests/test_config.py -q` returned `39 passed`.
- [x] CHK-021 [P0] Full MCP server pytest suite passes.
  - **Evidence**: `.venv/bin/python -m pytest tests/ -v` returned `104 passed`.
- [x] CHK-022 [P0] Corrected bench completed.
  - **Evidence**: `phase2-comparison-014-dedup.md` reports `14/18` for baseline-bge, bge-path-class, and jina-v3.
- [x] CHK-023 [P0] No probe regressed from hit to miss.
  - **Evidence**: `phase2-comparison-013-vs-014-delta.md` records no per-probe hit/miss changes.
- [x] CHK-024 [P1] Latency gate satisfied.
  - **Evidence**: retained rerun p95 deltas are -14.53%, -4.26%, and -5.69% versus the corrected baseline.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned.
  - **Evidence**: defect class is rerank-window alias pollution from runtime mirror paths.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed.
  - **Evidence**: all default runtime mirror prefixes `.opencode/`, `.codex/`, `.gemini/`, and `.claude/` are covered.
- [x] CHK-FIX-003 [P0] Consumer inventory completed.
  - **Evidence**: query dedup, config singleton, helper tests, README, ADR, and packet docs were updated.
- [x] CHK-FIX-004 [P0] Tests cover adversarial cases.
  - **Evidence**: tests cover canonical absent, mixed mirror/non-mirror same stem, empty candidates, single candidate, and mirror opt-out.
- [x] CHK-FIX-005 [P1] Rollback path exists.
  - **Evidence**: `COCOINDEX_MIRROR_PREFIXES='[]'` disables Pass A without code rollback.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials added.
  - **Evidence**: changes are local Python, tests, markdown, and JSON metadata.
- [x] CHK-031 [P1] Live DB was not reset or re-indexed.
  - **Evidence**: no `ccc reset` or `ccc index` was run.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] ADR appended.
  - **Evidence**: ADR-017 appended to `004-spec-memory-embedder-bake-off/decision-record.md`.
- [x] CHK-041 [P0] README updated if present.
  - **Evidence**: `cocoindex_code/README.md` exists and now documents mirror dedup behavior.
- [x] CHK-042 [P0] Packet docs synchronized.
  - **Evidence**: `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json` exist.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] New evidence lives under the scoped 014 packet.
  - **Evidence**: comparison and delta docs are under `014-mirror-dedup-canonical-preference/evidence/`.
- [x] CHK-051 [P1] Historical 013 artifacts preserved.
  - **Evidence**: corrected baseline remains unchanged; 014 artifacts use the `-014-dedup` tag.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---:|---:|
| P0 Items | 18 | 18/18 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-19
**Verified By**: Codex
<!-- /ANCHOR:summary -->
