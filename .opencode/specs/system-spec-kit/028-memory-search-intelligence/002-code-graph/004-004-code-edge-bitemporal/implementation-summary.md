---
title: "Implementation Summary: Code-Edge Bi-temporal Lifecycle (Q1-C1 cluster)"
description: "Deferred state — the whole Code Graph schema-migration cluster (Q1-C1 columns, Q1-C1-views chokepoint, edge-lifecycle, symbol-timeline) is DEFER-speculative and ships nothing; none of the five candidates is implemented in 030. This summary records the DEFER decision and the gated, sequenced plan ready IF a real as-of consumer ever appears."
trigger_phrases:
  - "code edge bitemporal implementation summary"
  - "q1-c1 cluster deferred"
  - "code graph schema migration not shipped"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/004-004-code-edge-bitemporal"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author code-edge-bitemporal impl-summary (deferred: 0 shipped, 5 gated)"
    next_safe_action: "Hold the cluster behind the DEFER gate; route the real bug to the sibling"
    blockers:
      - "DEFER-speculative; depends on Q6-C1 + a named as-of consumer"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-004-code-edge-bitemporal"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Is there any consumer for as-of/time-travel code-graph reads?"
    answered_questions:
      - "Whole cluster is DEFER-speculative; ships nothing in this phase (030 §3/§14)"
      - "standalone CG-edge-bitemporal-lifecycle is REFUTED (002 iter-013)"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `028-memory-search-intelligence/002-code-graph/004-004-code-edge-bitemporal` |
| **Completed** | Deferred (0 of 5 candidates shipped — the cluster is DEFER-speculative) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing was built. This phase records a decision: the entire `code_edges` bi-temporal cluster is DEFER-speculative and ships no schema migration. The capability gap is real — the code-graph reindex destroys edges on every scan and carries no validity window, so it can never serve as-of-last-green-scan reads — but three findings across 200 research iterations make building it now the wrong call: no consumer wants as-of/time-travel reads, the safety story is already covered by the shipped readiness gate, and the cluster does not fix the one bug that actually bites (dependency-transitivity edge-staleness, owned by the sibling phase). What this phase delivers is the honest DEFER plus a gated, sequenced plan so the work is ready the moment a consumer appears.

### Q1-C1 / Q1-C1-code-edge-bitemporal (PENDING — gated)

The schema migration that would add `valid_at`/`invalid_at` to `code_edges` and turn the four reindex DELETE sites into `UPDATE ... SET invalid_at = <generation>` + INSERT, so a superseded edge is closed (History-readable) rather than destroyed. The two ids are the same build — the second is the cluster-scope alias for the `code_edges` four-timestamp validity-window shape that mirrors Memory's causal C3-B. Gated on Q6-C1 (the generation watermark, which is the value stamped into `invalid_at`) and on a real as-of consumer.

### Q1-C1-views (PENDING — gated, the keystone)

The live current-view chokepoint: `CREATE VIEW code_nodes_live`/`code_edges_live` `WHERE invalid_at IS NULL`, with every default read routed through it and the as-of/audit reader deliberately bypassing. This is the de-risk prerequisite — it defines "current" exactly once and localizes the migration so Q1-C1 does not leak the `invalid_at IS NULL` filter across the whole read surface. It MUST co-ship atomically with Q1-C1 in one SCHEMA_VERSION 5->6 transaction (the aionforge reference, 002 iter-018).

### CG-edge-bitemporal-lifecycle (PENDING — gated, standalone REFUTED)

Edge-granularity versioning (close-and-replace on relabel, one current edge per ordered pair). As a standalone it is REFUTED: the per-scan DELETE+INSERT rebuild fights never-delete versioning, and the existing tombstone machinery already records edge deletion-history (002 iter-013). It survives only as the lifecycle layer ON TOP OF Q1-C1's columns + atomic supersede.

### CG-symbol-timeline-query (PENDING — gated, needs a consumer)

The as-of/time-travel read ("what did the call graph look like at generation/commit N") over the Q1-C1 columns, bypassing the live-view. It has no research seam beyond the Q1-C1 read filter; it is precisely the consumer the rest of the cluster has no demand for today, so it is built only if a real consumer is named.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

This phase delivered the DEFER decision and the gated plan, not code. The reasoning is captured across four ADRs: the cluster is DEFER-speculative (ADR-001), Q1-C1 + Q1-C1-views co-ship atomically with the live-view as the read chokepoint (ADR-002), standalone edge-lifecycle is REFUTED and survives only as a layer on Q1-C1 (ADR-003), and the validity-window shape is shared with Memory's C3-B rather than forked (ADR-004). The sequencing for the un-defer path is recorded in plan.md: Q6-C1 (generation watermark) and CG-closed-vocab-CHECK land first as separate phases, then Q1-C1 + views co-ship in one atomic migration, then the edge-lifecycle layer, with the symbol-timeline read gated on a named consumer. The real edge-staleness bug is routed to sibling `002-002-edge-staleness-correctness`. Nothing migrates, nothing is pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| DEFER the whole cluster; ship nothing (ADR-001) | No as-of consumer; safety redundant with the readiness gate; does not fix the real staleness bug (200-iteration finding) |
| Q1-C1 + Q1-C1-views co-ship atomically; live-view is the read chokepoint (ADR-002) | Q1-C1 alone leaks the `invalid_at IS NULL` filter across the read surface; the view defines "current" once and localizes the migration |
| Standalone CG-edge-bitemporal-lifecycle is REFUTED; layer it on Q1-C1 only (ADR-003) | The per-scan DELETE+INSERT rebuild fights never-delete versioning; tombstones already record deletion-history (002 iter-013) |
| Share the validity-window shape with Memory C3-B (ADR-004) | The shape is the most-transferable cross-subsystem artifact; forking it defeats the build-once intent; retention TTL excluded |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| DEFER-speculative decision recorded | PASS (decision-record ADR-001; spec §3; 030 §3/§14 cross-ref) |
| Q1-C1 / Q1-C1-code-edge-bitemporal | PENDING (gated on Q6-C1 + named consumer; seam confirmed `code-graph-db.ts:177-184,:941,:985,:1012,:1031`) |
| Q1-C1-views | PENDING (gated; keystone; co-ships atomically with Q1-C1; ref 002 iter-018) |
| CG-edge-bitemporal-lifecycle | PENDING (standalone REFUTED 002 iter-013; layer on Q1-C1 only) |
| CG-symbol-timeline-query | PENDING (no consumer; no separate seam beyond Q1-C1 read filter) |
| `validate.sh --strict` on this folder | PASS (spec-doc structure) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **All five candidates are deferred, not built.** None shipped in 030 (030 §14: Code Graph shipped Q4-C1 only; Q1-C1 is explicitly listed DEFER-speculative). This summary documents a deferred state by design.
2. **No consumer exists.** The speculative gate: 200 iterations found no consumer for as-of/time-travel code-graph reads. Until one is named, the cluster stays deferred.
3. **The bi-temporal commit-time=event-time mapping is INFERRED.** The dangling-prune contract (`code-graph-db.ts:957-968`) and the cross-file CALLS resolver were not traced end-to-end; confirm before un-deferring.
4. **No benefit number is measured.** Every leverage/effort tag in research is structural inference, never a benchmarked delta (research §6).
5. **The real edge-staleness bug is out of scope here.** Dependency-transitivity staleness is owned by sibling `002-002-edge-staleness-correctness`; this cluster does not fix it.
<!-- /ANCHOR:limitations -->
