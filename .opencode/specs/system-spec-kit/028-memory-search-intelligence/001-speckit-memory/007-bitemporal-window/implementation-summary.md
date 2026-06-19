---
title: "Implementation Summary: Bi-temporal Window for Spec-Kit Memory Causal + Lineage"
description: "Partial state — skip-closed-in-sweep is SHIPPED (030 e1c6a3c793); the event-time fact-invalidation spearhead, the four-timestamp window (C3-B), chronology-scoped supersession (GR-temporal-ordering-invalidation), and the C3-D separation note are planned and pending implementation."
trigger_phrases:
  - "bitemporal window memory implementation summary"
  - "skip closed in sweep shipped"
  - "event-time invalidation pending"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/007-bitemporal-window"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author bi-temporal-window impl-summary (partial: 1 shipped, 4 pending)"
    next_safe_action: "Implement MEM-fact-invalidation-event-time spearhead (single-site invalidateEdge change)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-007-bitemporal-window"
      parent_session_id: null
    completion_pct: 20
    open_questions:
      - "Is the C3-B four-timestamp window additive against active_memory_projection?"
    answered_questions:
      - "skip-closed-in-sweep is SHIPPED (030 e1c6a3c793)"
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
| **Spec Folder** | `028-memory-search-intelligence/001-speckit-memory/007-bitemporal-window` |
| **Completed** | Partial (1 of 5 candidates shipped) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase carries the Memory MCP's causal + lineage edges toward a correct bi-temporal window. One candidate is already live; the other four are planned against confirmed seams and await implementation. The headline that matters: superseded facts will close at the time they actually became stale, not the time we happened to notice, so "what did we believe as of date X" stops lying.

### skip-closed-in-sweep (SHIPPED)

Closed generated causal edges are now skipped during frontmatter-promoter cleanup. The promoter's stale-edge query gained an `AND invalid_at IS NULL` open-edge clause (`openEdgeClause`), applied only when the schema actually has the column, so already-closed edges are left intact and fixtures without the column stay compatible. This shipped in 030 commit `e1c6a3c793` (030 spec §14 row 9) as cheap defensive hardening ahead of the live edge-presence retirement path — not as a data-loss gate (the collision it guards is theoretical and tombstone-recoverable, per 005 iter-032).

### MEM-fact-invalidation-event-time (PENDING — the spearhead)

The planned change makes `invalidateEdge()` stamp the close timestamp with the superseding fact's lineage event-time instead of `new Date().toISOString()`. It is reader-transparent: all three current-edge readers use a binary `invalid_at IS NULL` test, so only the writer's stamped value changes. A missing event-time falls back to `now()` to preserve the fail-open contract. High leverage, small effort.

### C3-B four-timestamp window (PENDING)

An additive schema evolution: event-time `valid_from`/`valid_to` plus transaction-time `ingested_at`/`expired_at`, declared once and reconciled so the causal-edge and lineage stores share the column shape rather than forking a third. Existing single-pair readers stay byte-identical until a consumer opts into transaction-time semantics. Additivity against `active_memory_projection` is unverified in research and must be confirmed at build.

### GR-temporal-ordering-invalidation (PENDING)

Chronology-driven supersession: when two edges on the same pair conflict, the chronologically-earlier `valid_at` is auto-invalidated. Scoped strictly to conflicting/superseding relation pairs so co-valid, non-conflicting facts are never retired.

### C3-D separation-of-concerns note (PENDING)

A decision note (ADR-003) recording that tombstone-sweep (forgetting) and temporal-close (not-current) are distinct lifecycle operations, and that skip-closed ships as hardening rather than a gate.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

skip-closed-in-sweep was delivered as part of the 030 Wave-0 spearhead with a closed-edge fixture test and shipped under commit `e1c6a3c793`. The four pending candidates are sequenced in plan.md: the spearhead lands first (independent of the migration), then the C3-B window as the additive substrate, then chronology-scoped supersession on top of it, with the C3-D note authored alongside. Each candidate is a separate, reversible scoped commit; nothing is pushed or deployed without explicit user approval. The phase verifies with focused causal/temporal Vitest suites, a reader-transparency grep gate, and `validate.sh --strict`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Source event-time from lineage, treat causal `invalid_at` as a derived projection (ADR-001) | Lineage is the only store that already models event-time; sourcing from the causal projection would reintroduce the same conflation one layer down |
| Exclude retention TTL from the bi-temporal consumer set (ADR-002) | Physical deletion is the opposite of edge-presence currentness; folding it in is a category error that forks a third store |
| Classify skip-closed as defensive hardening, not a C3-A gate (ADR-003) | Adversarial verification (005 iter-032) found the guarded collision theoretical and tombstone-recoverable; gating C3-A on it would be unfounded conservatism |
| Keep the spearhead reader-transparent | All three readers use `IS NULL`; changing only the writer's stamped value keeps the win at H/S and avoids a read-path rewrite |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| skip-closed-in-sweep shipped + tested | PASS (030 `e1c6a3c793`; closed-edge fixture) |
| MEM-fact-invalidation-event-time | PENDING (planned; seam confirmed `temporal-edges.ts:81,86,94`) |
| C3-B four-timestamp window | PENDING (additivity against `active_memory_projection` UNVERIFIED — confirm at build) |
| GR-temporal-ordering-invalidation | PENDING (scope test for co-valid pairs not yet written) |
| C3-D separation note | RECORDED (decision-record ADR-003) |
| `validate.sh --strict` on this folder | PASS (spec-doc structure) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Four of five candidates are planned, not built.** Only skip-closed-in-sweep ships today (`e1c6a3c793`); the spearhead, C3-B, GR-temporal-ordering, and the C3-D note are pending. This summary documents a partial state per the phase's research-then-implement structure.
2. **No benefit number is measured.** Every leverage/effort tag in research is structural inference, never a benchmarked delta (research §6). The spearhead's H rating is inferred from the correctness fix, not a measured recall gain.
3. **C3-B additivity is unverified.** No migration spec exists to confirm the four-timestamp window is purely additive against `active_memory_projection` (005 most-likely-wrong runner-up). Confirm before landing the schema change.
4. **C3-A and C3-C are out of scope.** The live edge-presence retirement path (C3-A) and the transaction-time recall modes (C3-C, L effort) depend on C3-B and live in later phases.
<!-- /ANCHOR:limitations -->
