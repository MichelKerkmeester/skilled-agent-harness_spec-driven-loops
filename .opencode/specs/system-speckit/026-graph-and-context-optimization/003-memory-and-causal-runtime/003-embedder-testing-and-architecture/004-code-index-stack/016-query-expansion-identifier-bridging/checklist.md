---
title: "Verification Checklist: 016 Query Expansion Identifier Bridging"
description: "Level 2 verification checklist for CocoIndex query expansion implementation and bench evidence."
trigger_phrases:
  - "016 query expansion checklist"
  - "identifier bridging checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/016-query-expansion-identifier-bridging"
    last_updated_at: "2026-05-19T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Checklist updated"
    next_safe_action: "Resolve bench gate"
---
# Verification Checklist: 016 Query Expansion Identifier Bridging

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| [P0] | Hard blocker | Cannot claim complete until verified |
| [P1] | Required | Must complete or explicitly defer |
| [P2] | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
  - Evidence: R1-R14 read from packet spec before implementation.
- [x] CHK-002 [P0] Actual hybrid query entry read before edits.
  - Evidence: `query_codebase()` and `_hybrid_vector_rows()` inspected in `query.py`.
- [x] CHK-003 [P1] Post-015 baseline identified.
  - Evidence: `phase2-comparison-015-treesitter.md` records baseline-bge 12/18, bge-path-class 13/18, jina-v3 14/18.
- [x] CHK-004 [P1] Sequential-thinking pre-planning attempted.
  - Evidence: five required MCP calls were made; each returned `user cancelled MCP tool call`.

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Expansion helpers are pure and side-effect free.
  - Evidence: `query_expansion.py` has no I/O, logging, env reads, or config imports.
- [x] CHK-011 [P0] Runtime rollback exists.
  - Evidence: `COCOINDEX_QUERY_EXPANSION=false` returns no-op `ExpandedQuery` and preserves raw FTS query path.
- [x] CHK-012 [P1] Dense fanout is bounded.
  - Evidence: `COCOINDEX_QUERY_EXPANSION_MAX_VARIANTS` default `6`, min `1`, parser fallback on invalid values.
- [x] CHK-013 [P1] FTS5 clause syntax is tested.
  - Evidence: `test_fts_query_accepts_expanded_match_clause` passes against SQLite FTS5.
- [x] CHK-014 [P1] Ruff passes on changed Python files.
  - Evidence: ruff reported `All checks passed!`.

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Minimum 12 query expansion tests exist.
  - Evidence: `tests/test_query_expansion.py` contains 14 tests covering spec cases.
- [x] CHK-021 [P0] Targeted pytest passes.
  - Evidence: query expansion, config, and FTS integration set passed `52 passed`.
- [x] CHK-022 [P0] Full MCP server pytest passes.
  - Evidence: `138 passed` from the MCP server package cwd.
- [ ] CHK-023 [P0] Corrected Phase 2 bench does not regress hit rate.
  - Evidence: failed for two lanes; baseline-bge 12/18 held, bge-path-class 13/18 -> 12/18, jina-v3 14/18 -> 12/18.
- [x] CHK-024 [P1] Probes 1, 5, 12, 15 inspected.
  - Evidence: no miss-to-hit flips; delta artifact records remaining misses and lane regressions.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-025 [P0] Code path implemented behind rollback flag.
  - Evidence: `COCOINDEX_QUERY_EXPANSION=false` preserves the raw query path.
- [ ] CHK-026 [P0] Retrieval fix satisfies bench gate.
  - Evidence: failed; see `phase2-comparison-015-vs-016-delta.md`.

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No LLM dependency or external network call added.
  - Evidence: expansion is deterministic string processing.
- [x] CHK-031 [P1] Malformed operator config fails closed to defaults.
  - Evidence: config parser tests cover invalid bool, int, and synonym JSON shapes.
- [x] CHK-032 [P1] Observability cannot break search.
  - Evidence: JSONL expansion logging catches exceptions and warns.

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] README updated.
  - Evidence: `cocoindex_code/README.md` has Query Expansion section and env-var table rows.
- [x] CHK-041 [P1] ADR-019 appended.
  - Evidence: `004-spec-memory-embedder-bake-off/decision-record.md` includes ADR-019.
- [x] CHK-042 [P1] Packet plan and tasks authored.
  - Evidence: `plan.md` and `tasks.md` created.
- [x] CHK-043 [P1] Packet metadata files created.
  - Evidence: `description.json` generated and `graph-metadata.json` authored locally because global backfill is blocked by an unrelated invalid graph metadata file.

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Scope stayed in requested files plus required FTS5 helper.
  - Evidence: code changes are limited to query expansion, config, query, FTS helper, tests, README, ADR, and packet docs.
- [x] CHK-051 [P1] No git commit made.
  - Evidence: no commit command run.
- [x] CHK-052 [P1] SpawnAgent not used.
  - Evidence: no `spawn_agent` call made; final output will print `SPAWN_AGENT_USED=no`.

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 9/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 0 | 0/0 |

Verification date: 2026-05-19
Verified by: Codex

<!-- /ANCHOR:summary -->
