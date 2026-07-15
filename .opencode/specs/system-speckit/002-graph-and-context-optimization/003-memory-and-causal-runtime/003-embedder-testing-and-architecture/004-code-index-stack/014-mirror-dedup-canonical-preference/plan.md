---
title: "Plan: 016/004/014 Mirror Dedup with Canonical Preference"
description: "Implementation plan for canonical mirror collapse in CocoIndex hybrid dedup, including config, path helpers, query integration, tests, benchmark evidence, and ADR-017."
trigger_phrases: ["016/004/014 plan", "mirror dedup plan", "canonical mirror preference plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/014-mirror-dedup-canonical-preference"
    last_updated_at: "2026-05-19T13:10:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented mirror-aware dedup and verified corrected bench"
    next_safe_action: "Commit handoff without git commit"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/path_utils.py"
      - "evidence/phase2-comparison-014-dedup.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004014"
      session_id: "016-004-014-plan"
      parent_session_id: "016-004-014"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Plan: 016/004/014 Mirror Dedup with Canonical Preference

<!-- ANCHOR:summary -->
## 1. SUMMARY

This packet removes runtime mirror redundancy from the CocoIndex rerank candidate set. The implementation adds canonical mirror configuration, pure path-stem helpers, and a mirror-collapse pass before the existing content-hash/source-realpath dedup. The corrected 18-probe bench remains the measurement gate.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Config | `COCOINDEX_CANONICAL_MIRROR` and `COCOINDEX_MIRROR_PREFIXES` parse from env, normalize prefixes, and preserve `[]` opt-out |
| Helper purity | `path_utils.py` functions have no I/O or logging and are unit-tested |
| Query integration | Mirror collapse runs before existing content dedup; empty mirror list skips Pass A |
| Regression tests | Existing MCP server pytest suite passes |
| Bench | Corrected 18-probe bench stays at 14/18 or better in all lanes with p95 under 10% delta |
| Docs | ADR-017, README note, packet docs, and strict validation pass |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The new helper module is `cocoindex_code/path_utils.py` so downstream packets can reuse path-stem logic without importing the indexer. Query-time collapse runs on hybrid candidates after score sorting and before the prior dedup loop. Groups are keyed by path stem plus content hash and line range, which avoids collapsing distinct chunks from the same mirrored file while remaining robust if future indexes store mirror-specific realpaths.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Config And Helpers

- Add canonical mirror and mirror-prefix config fields.
- Normalize prefix values with trailing slashes.
- Add pure helper functions and helper unit tests.

### Phase 2: Query Integration

- Add a mirror-collapse pass to `_dedup_and_rank_hybrid_rows()`.
- Prefer the canonical mirror copy when present.
- Keep first ranked mirror copy when canonical is absent.
- Preserve existing content-hash/source-realpath dedup as Pass B.

### Phase 3: Bench Gate

- Run the corrected 18-probe Phase 2 smoke bench with `OUTPUT_TAG=-014-dedup`.
- Save the comparison in this packet's `evidence/` directory.
- Write a delta against the 013 corrected baseline.

### Phase 4: Docs And Validation

- Append ADR-017.
- Update `cocoindex_code/README.md`.
- Write L2 packet docs and metadata.
- Run strict validation.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | What it verifies |
|---|---|
| `python -m pytest tests/test_path_utils.py tests/test_dedup_mirrors.py tests/test_config.py -q` | New helper, integration, and env parsing behavior |
| `python -m pytest tests/ -v` | Full MCP server regression suite |
| Phase 2 smoke bench | Corrected 18-probe retrieval behavior and latency gate |
| `validate.sh --strict` | Packet documentation contract |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Corrected baseline from packet 013.
- Existing CocoIndex DB; no `ccc reset` or `ccc index`.
- Bench harness support for `FIXTURE_OVERRIDE`, `OUTPUT_TAG`, and `COMPARISON_OUTPUT`.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Set `COCOINDEX_MIRROR_PREFIXES='[]'` and restart the daemon to disable mirror collapse without reverting code. Full rollback is reverting `config.py`, `path_utils.py`, `query.py`, tests, README, ADR-017, and packet docs.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## 8. L2: PHASE DEPENDENCIES

```
Phase 1 (Config + helpers) -> Phase 2 (Query integration) -> Phase 3 (Bench) -> Phase 4 (Docs + validate)
```

| Phase | Depends On | Blocks |
|---|---|---|
| Config + helpers | Spec and current config/query reads | Query integration |
| Query integration | Helper tests and existing dedup behavior | Bench |
| Bench | Passing pytest | Completion claim |
| Docs + validate | Code and bench evidence | Commit handoff |
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## 9. L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Effort |
|---|---|---|
| Config + helpers | Medium | Added env parsing, helper module, and helper tests |
| Query integration | Medium | Added two-pass dedup while preserving existing dedup key semantics |
| Bench | Medium | Ran corrected bench twice due timing variance |
| Docs + validate | Medium | ADR, README, packet docs, metadata, strict validation |
| Total | Medium | One focused implementation pass |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## 10. L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Operator opt-out exists: `COCOINDEX_MIRROR_PREFIXES='[]'`.
- [x] Existing content-hash/source-realpath dedup remains in place.
- [x] No live DB reset or re-index performed.

### Rollback Procedure
1. Set `COCOINDEX_MIRROR_PREFIXES='[]'`.
2. Restart the `ccc` daemon so config is reloaded.
3. If code rollback is needed, revert the code/test/doc files listed in `implementation-summary.md`.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: configuration rollback only; no database reversal is required.
<!-- /ANCHOR:enhanced-rollback -->
