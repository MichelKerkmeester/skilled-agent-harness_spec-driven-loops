---
title: "Implementation Summary: Embedding-Staleness Signal (Skill Advisor SA8)"
description: "Planning closeout for the advisor SA8 embedding-staleness sub-phase: the 2-candidate pair (the staleness signal + the Memory-010 idempotent-async rebuild reuse) is fully specified and both PENDING — nothing shipped in Wave-0/030; SA8 is scheduled Wave-1. Records the projection load-time staleness blind spot (generatedAt=now masks embedder drift), the memory_embedding_reconcile mirror, the Memory-010 shared-infra gate for the rebuild leg, and the no-benchmark caveat."
trigger_phrases:
  - "implementation summary advisor embedding staleness"
  - "SA8 projection signature closeout"
  - "advisor embedding staleness pending candidates"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/003-embedding-staleness-signal"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored SA8 planning closeout; both candidates PENDING"
    next_safe_action: "Implement T002-T007 staleness signal; gate T008-T009 on Memory 010"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "../../../030-memory-search-intelligence-impl/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-embedding-staleness-signal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | system-spec-kit/028-memory-search-intelligence/003-skill-advisor/003-embedding-staleness-signal |
| **Authored** | 2026-06-19 |
| **Level** | 2 |
| **Scope** | Advisor SA8 embedding-staleness: the staleness signal (signature capture + compare-on-load + `semantic_shadow` lane degrade) + the Memory-010 idempotent-async rebuild reuse — both PENDING |
| **Branch** | system-speckit/027-xce-research-based-refinement |
| **Shipped via** | None yet — SA8 is NOT in 030 section 14; 030 schedules "advisor embedding-staleness" as Wave-1 future work (`030 spec.md:104`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This is a **planning closeout** (a re-plan), not a code-delivery summary. The sub-phase specifies the advisor's load-time staleness blind spot and its fix. The advisor's WRITE path is already embedder-aware — `refreshSkillEmbeddingsViaAdapter` skips a re-embed only when `vec_model_id===modelId && vec_content_hash===contentHash` (`skill-graph-db.ts:1233-1234`) over the stored `embedding_model_id`/`embedding_content_hash` columns (`:187,:348-352`) and the `providerModelId` signature (`:599-600`). But the READ/projection boundary the scorer actually consumes carries NO embedder signature: `loadSqliteProjection` stamps `generatedAt = new Date().toISOString()` at load (`projection.ts:315`, with the same load-time stamp at `:328,:375,:413`). Because `generatedAt` is recomputed to *now* on every load, any embedder-version drift between the stored vectors and the active embedder is masked — the `semantic_shadow` lane silently consumes vectors from a superseded embedder, with no detection and no repair signal. This is the "stable source / stale derived artifact" family (the same shape as the Memory and Code-Graph staleness gaps), here on the advisor's derived projection.

**Nothing in this sub-phase has shipped.** SA8 is absent from packet 030 (the flat Wave-0 record) section 14; 030 explicitly lists "advisor embedding-staleness" under Wave-1 (`030 spec.md:104`), not as shipped. Both candidates are PENDING.

### Candidate set (both PENDING)

| # | Candidate | Status | Gate |
|---|-----------|--------|------|
| 1 | `SA8-embedding-staleness` — the staleness signal (stamp `(provider,name,dim)` signature at build, compare on load, emit a `{stale,reason}` verdict mirroring `memory_embedding_reconcile`, degrade `semantic_shadow` on stale) | **PENDING** | shared-infra-dep — none for the signal itself; independently shippable. Seam `projection.ts:315`; mirror `embedding-reconcile.ts:162-189`; columns `skill-graph-db.ts:187,348-352,599-600` |
| 2 | `Advisor-embedding-staleness-signal` — the idempotent-async projection rebuild reuse (durable cursor + bounded retry + idempotency token) | **PENDING** | shared-infra-dep — Memory `010-consolidation-cursor-clock` must land the primitive; this is the SECOND consumer, no second engine (synthesis `04-sibling-and-cross-cutting.md:34`) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The re-plan was authored from the authoritative 028 research: the SA8 origin finding `../research/from-006-sibling-revisit/research.md:80` ("the advisor projection stamps `generatedAt = now` at load (`projection.ts:315`), masking embedder-version drift ... Fix: stamp embedder id/version into the stored projection, compare on load, flag stale (mirror `memory_embedding_reconcile`)"), the GO-candidate row `synthesis/01-go-candidates.md:36` (Skill Advisor, seam `projection.ts:315`, effort S-M, Wave-1), and the cross-cutting reuse mapping `synthesis/04-sibling-and-cross-cutting.md:34` ("the receipt + retry-budget/dead-letter pattern maps onto the Advisor's async embedding projection (SA8) ... build the shared primitive once, reuse on the advisor side"). The SA8 seam and the `memory_embedding_reconcile` mirror were read directly: `projection.ts:315,328,375,413` (the load-time `generatedAt` stamps), `skill-graph-db.ts:187,348-352` (stored model-id columns) and `:599-600` (the `providerModelId` signature builder) and `:1233-1234` (the write-path per-row skip guard), and `embedding-reconcile.ts:139-142` (the active-embedder pointer read) + `:183-189` (the `{verified:false, reason:"shard model X != active Y"}` compare-and-report shape) + `:34` (`providerFailurePolicy:"report-only"`). Packet 030 section 14 was read and grepped to confirm NO advisor embedding-staleness candidate shipped (SA8 appears only at the Wave-1 future-work line `030 spec.md:104`). The Level-2 doc set (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, this summary) was written from the system-spec-kit templates and validated with `validate.sh --strict`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Target the READ boundary, mirror — do not duplicate the write path.** The write-path refresh guard already detects per-row drift (`skill-graph-db.ts:1233-1234`); SA8 adds the missing check at projection LOAD (`projection.ts:388`) and mirrors `memory_embedding_reconcile`'s `{stale, reason}` shape (`embedding-reconcile.ts:183-189`) rather than inventing a parallel staleness format, so advisor + memory staleness semantics stay aligned.
- **Signal first, rebuild second.** The staleness signal (signature capture + compare-on-load + lane degrade) is independently shippable and carries NO shared-infra gate; only the projection-rebuild leg gates on Memory `010-consolidation-cursor-clock`. Ship the signal first; wire the rebuild when the primitive lands.
- **Reuse the Memory-010 idempotent-async primitive, do not build a second engine.** The stale-triggered rebuild rides the durable-cursor + bounded-retry + idempotency-token primitive built once in Memory 010 — the advisor is the SECOND consumer (synthesis `04:34`); this sub-phase imports/adapts it, it does not reinvent it.
- **Keep `generatedAt` for back-compat; ADD the signature.** The signature is a sibling field on the `AdvisorProjection` shape, not a replacement for `generatedAt`, so `advisor_status`/cache-keying consumers that read `generatedAt` are undisturbed; only the staleness verdict is net-new.
- **Fail closed; report-only on an unreadable pointer.** A missing/null stored signature ⇒ STALE (a legacy signature-less projection is flagged for rebuild, not silently trusted); an unreadable active-embedder pointer ⇒ report-only (degrade the lane, do not crash the load), mirroring `embedding-reconcile.ts:34`.
- **Ship for detection/correctness, not a promised delta.** SA8 banked ZERO benchmarks; its M-H / S-M leverage/effort are structural inference per the 028 GO-evidence caveat — flag, do not promise.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Planning/documentation**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and this summary authored from the templates; `validate.sh --strict` run on this sub-phase (structure/anchors/frontmatter/required-files).
- **Seam + mirror confirmed by direct read**: the SA8 load-time `generatedAt` stamps (`projection.ts:315,328,375,413`), the stored model-id columns + `providerModelId` signature (`skill-graph-db.ts:187,348-352,599-600`) and the write-path skip guard (`:1233-1234`), and the `memory_embedding_reconcile` compare-and-report shape (`embedding-reconcile.ts:139-142,183-189,34`).
- **Shipped-record confirmed**: SA8 is NOT in `030` section 14; it is scheduled Wave-1 (`030 spec.md:104`). Both candidates PENDING.
- **Implementation/test verification is PENDING** (this sub-phase ships no code): the advisor typecheck/build, the detection + fail-closed + lane-degrade + back-compat Vitest (CHK-010..013, CHK-020..023), and the gated rebuild-idempotency Vitest (CHK-024) are verified at implementation time; CHK-024 is additionally gated on Memory 010.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **No code shipped.** Both candidates are PENDING; this is a re-plan, so the impl-summary documents the planned change and its gates, not delivered commits.
- **No measured benefit number.** SA8 banked ZERO benchmarks; the M-H / S-M leverage/effort are structural inference (`synthesis/01:36` Wave-1, roadmap GO-evidence caveat). The value is detection + repair of a silent staleness hole, not a benchmarked routing-quality delta.
- **The rebuild leg is gated on a sibling subsystem.** Facet #2 (`Advisor-embedding-staleness-signal`) cannot ship until Memory `010-consolidation-cursor-clock` lands the idempotent-async primitive. The signal (facet #1) ships independently.
- **One bounded open design choice remains.** Single canonical projection signature vs a per-row signature (so a partial refresh — some rows on embedder A, some on B — is detectable rather than collapsing to one verdict). Recorded in `spec.md` OPEN QUESTIONS; resolved at implementation time.
- **Lane-degrade shape is shared with sibling 002.** The `semantic_shadow` degrade-on-stale must align with sibling `002-runtime-lane-health-degrade`'s degrade-to-remaining convention rather than inventing a parallel one; no hard ordering dependency, but align the shape.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS

- **Specification**: `spec.md` (section 10 candidate status).
- **Plan**: `plan.md`.
- **Tasks**: `tasks.md`.
- **Checklist**: `checklist.md`.
- **Source research**: `../research/research.md`, `../research/from-006-sibling-revisit/research.md:80` (SA8 origin), `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md:36` + `04-sibling-and-cross-cutting.md:15,:34`.
- **Shared-infra dependency**: `../../001-speckit-memory/010-consolidation-cursor-clock/spec.md` (idempotent-async primitive).
- **Mirror reference (read-only)**: `embedding-reconcile.ts:162-189`.
- **Shipped record (do not modify)**: `../../../030-memory-search-intelligence-impl/spec.md` section 14 + Wave-1 list `:104`.
