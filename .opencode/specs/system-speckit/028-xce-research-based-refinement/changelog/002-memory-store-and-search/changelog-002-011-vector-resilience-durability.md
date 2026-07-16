---
title: "Vector Resilience Durability: Shard Repair Survives a Restart"
description: "The vector shard-repair intent now survives a process restart. A persisted repair-pending sentinel plus a completeness check (vector rowcount against the index success count) decides between resuming a real repair and clearing a stale sentinel, so a crash mid-repair resumes instead of serving an empty shard."
trigger_phrases:
  - "002/011 vector resilience durability changelog"
  - "repair pending sentinel completeness check"
  - "shard repair survives restart"
  - "027 002/011 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/011-vector-resilience-durability` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

Phase 002/008 made a malformed vector shard detectable and rebuildable, but the "this shard needs repair" intent lived only in memory. A restart before the rebuild finished lost that intent, and the next boot attached a fresh empty shard while health still reported success — permanent recall loss with nothing flagged. This phase made the repair durable. A repair-pending sentinel is persisted at quarantine, and boot uses a completeness check — the vector rowcount against the `memory_index` success count, not a file-exists probe that returns OK for a missing shard — to decide between resuming a real repair and clearing a stale sentinel on an already-rebuilt shard. The quarantine rename is itself a durable marker, so repair resumes even when no sentinel write could land. An in-flight guard stops a double boot-attach from scheduling the same rebuild twice.

### Added

- A persisted repair-pending sentinel written at quarantine, cleared on rebuild completion
- A boot-time completeness oracle that compares vector rowcount against the index success count to classify resume-repair versus clear-stale
- An in-flight guard against a double boot-attach scheduling the same rebuild twice

### Changed

- `lib/search/vector-index-store.ts` — persists and reads the repair-pending sentinel, runs the completeness check at boot, treats the quarantine rename as a durable marker
- `lib/embedders/reindex.ts` — clears the degraded flag when a non-repair reindex completes for a degraded profile, and clears the sentinel on rebuild completion
- `lib/observability/retrieval-observability.ts` — reports the durable degraded/repair-pending state

### Fixed

- Deep-review remediation replaced a probe that returned OK for a missing file with the completeness-based oracle, which is what made the boot decision trustworthy across a crash mid-repair.

### Verification

| Check | Result |
|-------|--------|
| Deep review | resolved after the completeness-based shard-repair durability remediation |
| Resume across restart | PASS against temp-fixture shards: a crash mid-repair resumes, a rebuilt shard clears its stale sentinel |
| Double boot-attach | PASS: the in-flight guard prevents scheduling the same rebuild twice |
| Live shard | NOT TOUCHED: verified against sandboxed temp fixtures only |
| Live adoption | DEFERRED: source fix goes live after a dist rebuild and daemon recycle; otherwise inert |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/observability/retrieval-observability.ts` | Modified |

### Follow-Ups

- Live adoption requires a dist rebuild plus daemon recycle (operator-gated). The behavior is otherwise inert until then.
