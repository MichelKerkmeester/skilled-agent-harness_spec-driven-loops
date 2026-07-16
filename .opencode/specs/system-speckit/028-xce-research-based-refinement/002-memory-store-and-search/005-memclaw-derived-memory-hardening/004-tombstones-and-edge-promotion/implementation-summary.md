---
title: "Implementation Summary: Phase 4: tombstones-and-edge-promotion"
description: "Delivered summary for flag-gated memory tombstones, skip-manual causal-edge promotion, active/purgeable partial indexes, and the entity-not-causal advisory invariant."
trigger_phrases:
  - "SPECKIT_SOFT_DELETE_TOMBSTONES default off"
  - "tombstone soft-delete idempotent deleted_at"
  - "causal edge promotion skip manual created_by"
  - "active purgeable partial index split"
  - "entity co-occurrence not causal truth invariant"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/005-memclaw-derived-memory-hardening/004-tombstones-and-edge-promotion"
    last_updated_at: "2026-06-10T14:30:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Flag-gated tombstones and reconciled docs"
    next_safe_action: "Land recall filters before enabling flag"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-tombstones-and-edge-promotion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Existing delete was hard-delete, not soft-delete"
      - "Tombstones stay default-off until recall filters land"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-tombstones-and-edge-promotion |
| **Completed** | 2026-06-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase now preserves shipped behavior by default and moves tombstone semantics behind an explicit opt-in. The independent review found the original premise was wrong: memory delete was not a soft-delete writer that rewrote `deleted_at`; it was a hard delete through `vectorIndex.deleteMemory`. Because recall surfaces do not yet filter `deleted_at IS NULL`, tombstones cannot be enabled safely by default.

### Default-off tombstone flag

`SPECKIT_SOFT_DELETE_TOMBSTONES` is documented as an opt-in flag and defaults to off. With the flag off, `memory_delete` and `memory_bulk_delete` call the existing hard-delete primitive, so rows are removed from `memory_index` and the existing cache, FTS, vector, active-projection, and ancillary cleanup path remains active. With the flag on, the delete handlers use the tombstone writer and preserve the first timestamp with `deleted_at = COALESCE(deleted_at, <now>)`.

### Retention sweep partition gate

The retention sweep now follows the same flag. With the flag off, expired active rows are selected and reaped exactly as before, even when a `deleted_at` column and purgeable partial index exist. With the flag on, the sweep uses the purgeable partition (`deleted_at IS NOT NULL`) and reports that partition in `tombstoneState`. The feedback-retention hook path is preserved: `buildFeedbackRetentionReport`, `isFeedbackRetentionLearningEnabled`, `feedbackRetention`, and `extendedIds` behavior was not changed.

### Skip-manual edge promotion and provenance pass-through

The existing skip-manual guard in `causal-edges.ts` remains in place. Auto promotion does not overwrite a manually-authored causal edge on the natural key, and the provenance pass-through in `causal-graph.ts` and `causal-links-processor.ts` remains intact. The causal-graph API note is explicit: callers that do not want similarity-derived support edges should pass `similarity:false`; entity and co-occurrence evidence is recall evidence, not causal truth.

### Schema and invariant artifacts

The active and purgeable partial indexes plus migration stay at schema version 37. They are additive and harmless while tombstones are disabled. The advisory rule `entity-cooccurrence-is-not-causal.md` remains as the constitutional boundary: entity and co-occurrence signals must not be promoted as causal truth.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` | Modified | Default-off flag gate: hard delete when off, COALESCE tombstone when on. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` | Modified | Same flag gate and first-timestamp tombstone behavior for bulk deletes. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts` | Modified | Default-off active TTL sweep; flag-on purgeable partition selection. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Documented `SPECKIT_SOFT_DELETE_TOMBSTONES`; total count 175 to 176. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/causal-edge-tombstones.vitest.ts` | Modified | Added default hard-delete proof and flag-on first-timestamp tests. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts` | Modified | Added flag-off active TTL proof and flag-on purgeable partition proof. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Kept | Active/purgeable partial indexes and v37 migration remain as reviewed. |
| `.opencode/skills/system-spec-kit/constitutional/entity-cooccurrence-is-not-causal.md` | Kept | Advisory invariant remains as reviewed. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The repair is intentionally small. The delete handlers read one opt-in env var and choose either the existing hard-delete primitive or the already-implemented tombstone UPDATE. The retention sweep reads the same flag and only adds `deleted_at IS NOT NULL` and `INDEXED BY idx_memory_purgeable_retention` when tombstones are enabled. Tests exercise both flag states directly.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `SPECKIT_SOFT_DELETE_TOMBSTONES` default off | Recall surfaces do not filter tombstones yet; default-on would leave deleted memories searchable. |
| Use `vectorIndex.deleteMemory` when the flag is off | This preserves current hard-delete behavior and cleanup side effects instead of approximating them. |
| Keep COALESCE only on the flag-on path | First-timestamp tombstones are useful, but only after recall filtering and cache invalidation are complete. |
| Gate retention sweep partitioning with the same flag | Governed TTL must keep deleting active expired rows by default; purgeable-only sweep is correct only when tombstones are enabled. |
| Leave skip-manual edges and v37 partial indexes as-is | They are independent additive fixes and were not part of the P0 regression. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit -p tsconfig.json` | PASS, no output |
| `npx vitest run tests/causal-edge-tombstones.vitest.ts tests/memory-retention-sweep.vitest.ts tests/memory-retention-feedback-learning.vitest.ts tests/causal-edges-write-safety.vitest.ts` | PASS, 4 files, 48 tests |
| Flag-off single delete hard-removes memory | PASS, `causal-edge-tombstones.vitest.ts` asserts row removed from `memory_index` and related edge tombstoned. |
| Flag-on single and bulk tombstone first timestamp | PASS, repeated deletes keep the first `deleted_at` in `causal-edge-tombstones.vitest.ts`. |
| Flag-off retention sweep reaps active expired rows | PASS, `memory-retention-sweep.vitest.ts` asserts expired active and tombstoned rows are deleted when flag is unset. |
| Flag-on retention sweep uses purgeable partition | PASS, `memory-retention-sweep.vitest.ts` asserts `usesPurgeablePartition:true`, `usingPurgeableIndex:true`, and only tombstoned expired rows are swept. |
| Schema version | PASS, `SCHEMA_VERSION` remains 37. |
| Env count | PASS, `ENV_REFERENCE.md` total changed from 175 to 176. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. `SPECKIT_SOFT_DELETE_TOMBSTONES` must stay off until a follow-up adds `deleted_at IS NULL` filtering to every recall surface: search, list, get, context, and triggers.
2. The same follow-up must add cache invalidation for tombstoned rows and decide tombstone-on-expiry reaping semantics before operators enable the flag.
3. Governed TTL behavior is intentionally hard-delete by default. The P1 note is that active expired governed rows must continue to reap while the tombstone flag is off.
4. Causal graph callers that do not want similarity-derived support edges should pass `similarity:false`; entity/co-occurrence remains recall evidence only.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dash, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
