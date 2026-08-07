---
title: "Vector Read-Path Resilience: Detect, Quarantine, Auto-Rebuild a Malformed Shard"
description: "A live malformed vector shard was silently degrading search. The read path now detects a shard that cannot answer, quarantines it, and auto-rebuilds with hardened dimension discovery, surfacing degraded-vector state instead of trusting a broken shard."
trigger_phrases:
  - "002/008 vector read path resilience changelog"
  - "malformed vector shard quarantine"
  - "vector auto-rebuild degraded state"
  - "027 002/008 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/008-vector-read-path-resilience` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

A live malformed vector shard was observed silently degrading search — the read path trusted a shard that could not actually answer a query and returned thin or empty results without any signal. This phase added detection, quarantine, and auto-rebuild to the vector read path. A shard that fails its integrity and dimension checks is quarantined rather than served, the system seeds degraded-vector state so observability can report the condition, and a rebuild is scheduled with hardened dimension discovery so the rebuilt shard matches the active embedder profile. Detection and quarantine are the in-memory half of the story. The durability half — surviving a restart mid-repair — is the follow-on shipped in phase 020.

### Added

- Vector-shard integrity and dimension assessment on the read path, with quarantine of a shard that cannot answer
- Degraded-vector state seeding so retrieval observability and health can report the condition

### Changed

- `lib/search/vector-index-store.ts` — detects a malformed shard, quarantines it, and triggers auto-rebuild with hardened dimension discovery
- `lib/search/vector-index-queries.ts` — read queries respect the degraded/quarantined shard state
- `lib/embedders/reindex.ts` — rebuild path aligned with quarantine-driven repair
- `lib/observability/retrieval-observability.ts` — surfaces degraded-vector state from the shard assessment

### Fixed

- Deep-review remediation replaced an over-stated REQ-003 completion claim with an honest deferral and corrected the warning source-map so the degraded signal points at the real cause.

### Verification

| Check | Result |
|-------|--------|
| Deep review | CONDITIONAL, resolved after honest REQ-003 deferral |
| Detection and quarantine | PASS against temp-fixture malformed shards |
| Live shard | NOT TOUCHED: verified only against sandboxed temp fixtures, never a live shard |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/observability/retrieval-observability.ts` | Modified |

### Follow-Ups

- Durability across a restart mid-repair shipped in phase 020 (vector-resilience-durability). The phase's own deferred requirement (the live-corpus KNN query-shape rerun) remains deferred and is unrelated to restart durability.
