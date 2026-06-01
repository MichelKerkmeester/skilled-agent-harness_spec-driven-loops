---
title: "Spec Memory Stack Phase 019: Lineage and Metadata Repair Runner"
description: "A new direct-run repair runner and a completed migration cut memory_index_scan failures from 503 to 3 by normalizing graph metadata schemas, remapping legacy importance tiers, compacting V8-rejected archived metadata plus realigning stale lineage logical keys."
trigger_phrases:
  - "lineage metadata repair runner"
  - "repair graph metadata mjs"
  - "E_LINEAGE stale logical key repair"
  - "importance tier high to important migration"
  - "memory index scan 503 failures"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/019-lineage-and-metadata-repair-runner` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack`

### Summary

`memory_index_scan` reported 503 failures after investigation showed only 2 were sufficiency failures. The remainder were metadata repair failures: stale `memory_lineage.logical_key` values, graph metadata not satisfying the v1 schema, `importance_tier: "high"` values rejected by the database enum plus archived graph metadata tripping V8 because foreign relationship references still pointed at other packets.

A new direct-run runner at `.opencode/skills/system-spec-kit/mcp_server/scripts/repair-graph-metadata.mjs` delivers `--dry-run` mode, `/tmp` backup safety, structured JSON output plus idempotent behavior. The first real migration pass touched 172 graph metadata files and repaired 337 stale lineage rows. Follow-up graph-only compaction passes cleared the V8 failure class. The final scan result was 3 failures, all malformed `description.json` files in a packet outside the allowed mutation scope.

### Added

- `repair-graph-metadata.mjs` runner with `--dry-run`, `--scan-log`, `--root` plus `--no-lineage` flags
- Structured JSON report output covering scanned counts, changed files, fix classes, failures plus before/after counters
- Backup writes under `/tmp/repair-graph-metadata-*` before any real mutation
- Graph metadata v1 upgrade path from prior schemas with safe defaults for required `manual` and `derived` sections
- `importance_tier: "high"` to `important` normalization path in the runner

### Changed

- 172 `graph-metadata.json` files across `.opencode/specs/**/` normalized to v1 shape, accepted tier values plus V8-safe metadata
- V8-rejected archived graph metadata compacted by clearing foreign relationship and noisy derived fields while preserving required packet identity

### Fixed

- `memory_index_scan` `Invalid graph metadata content` failure count dropped from a large majority of 503 to 0
- `E_LINEAGE` stale predecessor logical keys repaired for 337 `memory_lineage` rows, bringing the count to 0
- `importance_tier` check constraint failures resolved by remapping all `high` tier values to `important`
- Graph metadata V8 rejection count cleared to 0 after targeted compaction passes

### Verification

| Check | Result |
|-------|--------|
| `node --check .opencode/skills/system-spec-kit/mcp_server/scripts/repair-graph-metadata.mjs` | PASS |
| Initial dry-run | PASS: 172 graph files and 337 lineage rows planned after narrowing over-broad canonical JSON writes |
| Real migration pass | PASS: 172 graph files changed, 337 lineage rows repaired, backups in `/tmp/repair-graph-metadata-2026-05-19T19-44-28-899Z` |
| Idempotency dry-run after first pass | PASS: graph changes 0, lineage changes 0 |
| V8 compaction passes | PASS: additional graph-only passes cleared graph metadata V8 count to 0 |
| Final direct scan | PASS for target classes: failed 3, E_LINEAGE 0, invalid graph schema 0, tier check 0, V8 0 |
| Final residual failures | OUT OF SCOPE: 3 malformed `description.json` files remain in `013-embedder-testing-and-architecture/004-code-index-stack` |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/scripts/repair-graph-metadata.mjs` (NEW) | Created | Direct-run migration runner with dry-run, scan-log, backup plus idempotent repair logic |
| `.opencode/specs/**/graph-metadata.json` (172 files) | Modified | Normalized v1 schema, accepted tier values plus V8-safe metadata across all affected spec folders |
| `.opencode/specs/.../002-spec-memory-stack/spec.md` | Modified | Phase-map injection from `create.sh` to register phase 019 |

### Follow-Ups

- Repair the 3 remaining malformed `description.json` files in `013-embedder-testing-and-architecture/004-code-index-stack` packets 015, 017 plus 018. Those files were outside the allowed mutation scope for this packet.
- Ensure the lineage repair path in `repair-graph-metadata.mjs` is documented for operators: it requires a scan log containing `E_LINEAGE` predecessor ids and does not infer database repairs without scan evidence.
