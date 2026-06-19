---
title: "Changelog: Determinism + Content-ID Foundation (Spec-Kit Memory MCP) [001-speckit-memory/002-determinism-content-id-foundation]"
description: "Chronological changelog for the Determinism + Content-ID Foundation (Spec-Kit Memory MCP) phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/002-determinism-content-id-foundation` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

This sub-phase is the determinism keystone of the Spec-Kit Memory MCP retrieval-intelligence work. Five candidates — the two content-id primitives, the content-derived comparator/output tiebreak (C5-B), the ANN below-RRF tiebreak, the byte-identical bonusOverChannels param (C-X1 'active'), and the rank-time decay clock (C6-A) — were implemented and committed in the flat Wave-0 packet (030). They establish the shared total-comparator, the centralized SHA-256 content-id formula, and the byte-identical-by-default fusion seams that the three sibling subsystems (Code Graph 002, Skill Advisor 003, Deep Loop 004) byte-compare against. Four further candidates remain gated PENDING and were deliberately not built.

### Added

- [B] C-X1-true-multichannel ('configured' mode) (rrf-fusion.ts:345-388) [Pending — gate: shared-infra-dep; build alongside the Wave-1 C2-B per-class weight consumer, after the fusion-bonus unit test lands; default stays 'active'. C-X1 confirmed from-scratch — aionforge has no bonus term, agreement is emergent (../research/iterations/iteration-031.md H31-02)].
- [B] C5-A render-order serialization stage (formatters/search-results.ts:782, envelope.ts:99) [Pending — gate: render-build; serializationId = sha256(canonical fields) re-sort at the render boundary, fuller-parity successor to the shipped C5-B stopgap; golden-file re-baseline once; render tiebreak separate from fusion tiebreak (../research/iterations/iteration-003.md C5-A; iteration-031.md H31-04)].
- [B] M-clock-skew-replay-window (idempotency-receipts.ts:180,143-205) [Pending — gate: multi-writer (single-tenant-refuted); iter-14 BUILD → iter-23 REFUTED/NO-GO: anti-replay clock-skew is a network/multi-writer threat; local writes have no adversarial replay + receipts already dedup (../research/iterations/iteration-023.md)].
- CHK-003 Candidate seams identified before implementation.
- CHK-011 Memory MCP build passes for the shipped candidates.
- CHK-020 two-content-id-primitives implemented, tested, and committed.

### Changed

- two-content-id-primitives — centralize content-body + canonical-field SHA-256 into lib/content-id.ts (hashContentBody, hashCanonicalJson) [Done, commit 18c8582e33; byte-identical proven by parity test; no behavior change].
- ANN-tie-stable-order — append , m.id ASC (COALESCE) to the 4 ranked ANN ORDER BY distance (vector-index-queries.ts:169,199,458,570) [Done, commit bec0eed27f].
- C5-B content-derived tiebreak — content_hash-asc tiebreak (COALESCE id) in the deterministic comparator + all 5 RRF output sorts (ranking-contract.ts, rrf-fusion.ts, hybrid-search.ts) [Done, commit bec0eed27f; primary order unchanged, verified].
- C-X1 'active' — expose the active-channel bonus denominator as the bonusOverChannels param, default 'active' (rrf-fusion.ts:296-371,345-388) [Done, commit 65cfcea513; byte-identical traced arithmetically; opus SHIP].
- [B] M-dual-class-identity (memory-index.ts:281, idempotency-receipts.ts:81-97, causal-edges.ts:140) [Pending — gate: multi-writer (single-tenant-refuted); iter-14 PROMOTE → iter-23 PARTIAL/NO-GO: the capture-vs-content distinction already exists informally; formalizing pays off only for distributed/multi-writer merge (../research/iterations/iteration-014.md → iteration-023.md)].
- Re-confirm shipped-candidate commits against 030 section 14 (18c8582e33, bec0eed27f ×2, 65cfcea513 ×2).

### Fixed

- C6-A rank-time decay clock — caller-nowMs rank-time decay vs the trackAccess-only path; restored the no-timestamp skip guard so it is a pure refactor (stage2-fusion.ts:897-908, fsrs.ts:40-47) [Done, commit 65cfcea513; reinforcement stays a separate event].
- Run validate.sh --strict on this sub-phase and fix structure issues.
- CHK-FIX-001 Each candidate has a final disposition.
- CHK-FIX-002 Gated residue is backed by real evidence, not silent drop.
- CHK-FIX-003 The cross-subsystem byte-compare contract is preserved.
- CHK-FIX-004 Identity-hardening is not shipped against the wrong threat model.

### Verification

- Shipped commits traced - git log --oneline 1ecc531431..HEAD
- Content-id parity - content-hash-dedup.vitest.ts (Wave-0 closeout)
- Determinism seams - Memory focused suite (stage2-fusion, rrf-fusion, unit-rrf-fusion) (Wave-0)
- Sub-phase docs - validate.sh --strict on this folder
- Tasks complete - 17 completed task item(s) recorded

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Byte-identity of the shipped default seams is re-confirmed by the still-open fusion-bonus unit test before any 'configured' promotion (downstream verification, tracked).
- The fusion-bonus invariant unit test is still open. Every "byte-identical-by-default" determinism claim is conditional on it; it must land before any 'configured' promotion.
- No candidate has a measured benefit number. All leverage/effort are structural inference; the shipped seams are tie-only re-orders or default-identity refactors, not benchmarked deltas.
- The 'configured' mode and C5-A are unbuilt. They wait for the Wave-1 C2-B consumer and a render-stage golden re-baseline respectively.
- The identity-hardening pair is unbuilt by design. It is documented-NO-GO for a single-trusted-host tool; only a multi-writer adoption revives it.
