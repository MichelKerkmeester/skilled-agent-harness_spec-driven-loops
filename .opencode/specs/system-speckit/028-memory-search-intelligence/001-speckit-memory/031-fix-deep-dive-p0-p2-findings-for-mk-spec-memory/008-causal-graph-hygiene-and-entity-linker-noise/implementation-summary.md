---
title: "Implementation Summary: Causal-Graph Hygiene and Entity-Linker Noise"
description: "Down-weighted the 31,644 entity-linker 'supports' edges that were 94% of the causal graph, stopped the strength ratchet, tightened the entity linker and causal-links resolver, regenerated placeholder surrogate titles, and fixed the community lifecycle and graph-signals correctness so the real causal signal is no longer drowned by auto-created co-occurrence noise."
trigger_phrases:
  - "causal graph hygiene"
  - "entity linker noise"
  - "cooccurrence edge downweight"
  - "surrogate title regeneration"
  - "community lifecycle rebuild cadence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/008-causal-graph-hygiene-and-entity-linker-noise"
    last_updated_at: "2026-07-04T17:51:12.479Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Integrated 008 (13 REQs); applied 2 live migrations (31644 edges, 3787 titles); 225 tests green"
    next_safe_action: "Phase 009 learning-feedback-loop-repair"
    blockers: []
    key_files:
      - "mcp_server/lib/graph/community-detection.ts"
      - "mcp_server/lib/graph/graph-signals.ts"
      - "mcp_server/lib/search/entity-linker.ts"
      - "mcp_server/scripts/migrations/downweight-entity-linker-supports.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-016-008-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "ADR-002 amended: keep the Louvain names + document the misnomer, defer the rename; the lifecycle fixes (rebuild cadence + stable IDs) shipped and are what REQ-011 requires"
      - "REQ-003 derived_id backfill is a verified no-op (live dry-run 0 candidates — already backfilled), not a broken selector"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-causal-graph-hygiene-and-entity-linker-noise |
| **Completed** | 2026-07-04 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The causal graph is no longer 94% noise. Of 33,101 edges, 31,118 were auto-created entity-linker `supports` edges at the full causal strength band, so a real causal edge could never outrank the co-occurrence sludge. This phase down-weights that noise in place, stops the strength ratchet that kept inflating it, tightens the two paths that manufactured wrong edges, regenerates the placeholder surrogate titles, and fixes the community and graph-signal correctness bugs sitting on top.

The disposition is a provenance-scoped strength UPDATE, not a delete: 31,644 `created_by='entity_linker'` `supports` edges dropped from strength 0.7 to 0.05, below the causal band, so the default causal read is dominated by real edges while the co-occurrence history is preserved for any consumer that opts into it. `recomputeLocal` no longer ratchets — the additive `strength = MIN(1, strength + boost)` that made every recompute climb toward 1.0 is replaced with a non-accumulating computation, so re-runs are idempotent. The causal-links resolver stops linking arbitrary memories: its fuzzy-`LIKE` fallback now returns unresolved-with-suggestions instead of silently attaching a wrong memory with a confident polarity. The entity linker's incremental path normalizes identifiers the same way the full run does, so an incremental match and a full rebuild agree, and `createEntityLinks` invalidates the caches it dirties. The density guard that can disable cross-encoding now counts only numeric-endpoint memory-to-memory edges, so pseudo-edges can't silently trip it. Entity-catalog reads are deterministic and bounded (an `ORDER BY` on the capped read), per-memory linking failures are contained so one bad memory can't escalate into a full-corpus relink, and the session-trace causal reducer requires ≥2 distinct-session co-occurrences and excludes same-query co-retrieved pairs before it will infer an edge.

### Surrogate titles and the community lifecycle

Placeholder `Memory NNNN` surrogate questions are regenerated from the stored document title where a real title exists — 3,787 rows rewritten — and new surrogates get a real title at generation time. The community subsystem now rebuilds on a live cadence (a staleness check on the write path) instead of freezing until the next checkpoint-restore, while keeping community IDs stable across rebuilds. Graph-signals momentum uses a nearest-snapshot lookup instead of an exact `now − 7d` match that missed on any day without a snapshot, keys its caches on DB identity so a rebind can't serve stale cross-database values, and drains its dirty-set on read so a signal marked stale is recomputed and cleared rather than accumulating unbounded.

### The naming decision

ADR-002 was authored to rename "Louvain" to "label propagation" everywhere, since the implementation is unweighted label propagation. That was amended at ship time: the names, env, and telemetry labels stay for external-consumer compatibility and the misnomer is documented in place, because the algorithm's behavior is unchanged (the lie is a doc problem, not a live defect) and a broad label rename mid-remediation would expand blast radius into every dashboard for zero behavior benefit — the exact risk the ADR itself flagged. The live defects were the lifecycle bugs, and those shipped. The honest rename rides along with the deferred real-modularity decision once 006's eval harness can measure the subsystem.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-5.5-fast (high) implemented the 13 REQs against the frozen Files-to-Change set; GPT-5.5-fast (xhigh) adversarially verified each REQ against real file:line evidence and returned FAIL at 11/13 — REQ-011 (community rebuild cadence beyond checkpoint-restore was missing) and REQ-012 (the graph-signals dirty-set never drained). GPT-high remediated exactly those two, adding the write-path staleness rebuild and the drain-on-read, with tests proving a rebuild happens outside checkpoint-restore with stable IDs and that a dirtied signal is recomputed and cleared. Opus 4.8 final-verified both fixes were real code (not stubs), integrated the 20 in-scope files to main excluding a concurrent session's disjoint validation WIP, and ran the migrations. The three migrations were copy-tested on a full 1.4 GB clone of the live corpus before the two with candidates were applied to the live database under an atomic backup.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| ADR-001: down-weight co-occurrence edges in place (0.7 → 0.05), not delete | Preserves the co-occurrence history for opt-in consumers while removing it from the default causal band; no schema migration, fully reversible via a strength rollback |
| ADR-002 amended: keep the Louvain names, document the misnomer, defer the rename | Behavior is unchanged so the misnomer is a doc problem; the live defects (lifecycle) shipped; a broad telemetry rename mid-remediation is churn risk for zero behavior benefit |
| ADR-003: batched backfill of placeholder surrogate titles | A one-time gated migration fixes the 3,787 existing placeholders; generation-time titles stop new ones, so lazy per-read regeneration is unnecessary |
| REQ-003 backfill is a verified no-op | Live dry-run showed 0 candidates because the derived_id identity fix already backfilled them; confirmed the selector is correct, not broken, then left the gated script in place |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx tsc --build` (integrated main) | PASS (exit 0) |
| 008 targeted vitest (8 files) | PASS (225/225) |
| REQ-001..010, 013 xhigh review | PASS (11/13 first pass) |
| REQ-011, REQ-012 remediated + re-verified | PASS (rebuild cadence + dirty-set drain, real code, tested) |
| Migration copy-test on 1.4 GB live clone | PASS (integrity ok, FK clean, both idempotent to 0 residual) |
| Live migration: down-weight | PASS (31,644 edges 0.7 → 0.05; residual @0.7 = 0) |
| Live migration: surrogate titles | PASS (3,787 rewritten; residual candidates = 0) |
| Live migration: derived_id backfill | PASS (0 candidates — verified no-op) |
| Live post-apply `integrity_check` + `foreign_key_check` | PASS (ok; no FK violations; WAL checkpointed) |
| `validate.sh --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Code effects apply on the next daemon-lease restart.** The ranking, linking, community, and graph-signal code changes take effect when the daemon reloads the rebuilt dist; the running daemon carries the pre-008 code until then (shared deployment debt with phases 001–007).
2. **The live data migrations are already in effect.** Unlike the code, the down-weight and surrogate-title changes are data-level and are live now against the corpus the running daemon reads — the causal band is already de-noised.
3. **Real modularity and the naming rename are deferred to post-006.** A real weighted-modularity algorithm and the honest "Louvain" → "label propagation" rename both wait until 006's eval harness can measure whether they help; recorded as follow-ups, not blockers.
<!-- /ANCHOR:limitations -->
