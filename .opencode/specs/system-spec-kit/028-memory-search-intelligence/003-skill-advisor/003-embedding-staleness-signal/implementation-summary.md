---
title: "Implementation Summary: Embedding-Staleness Signal (Skill Advisor SA8)"
description: "Implementation closeout for the advisor SA8 embedding-staleness signal: the projection now carries an embedder signature/staleness verdict, semantic_shadow degrades on stale vectors and status health reports the stale-vector condition. The Memory-010 idempotent-async rebuild reuse remains pending/gated."
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
    recent_action: "Implemented and verified T002-T007 staleness signal"
    next_safe_action: "Wire T008-T009 rebuild reuse once Memory-010 lands the primitive"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-embedding-staleness-signal"
      parent_session_id: null
    completion_pct: 80
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
| **Status** | complete |
| **Scope** | Advisor SA8 embedding-staleness: the staleness signal (signature capture + compare-on-load + `semantic_shadow` lane degrade) implemented, Memory-010 idempotent-async rebuild reuse pending |
| **Branch** | system-speckit/027-xce-research-based-refinement |
| **Shipped via** | Commit `f038ff140e` in `system-skill-advisor/mcp_server` (projection + semantic-shadow lane + staleness vitest). Packet 030 untouched |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The staleness signal is implemented. The SQLite projection now computes an `AdvisorEmbeddingSignature` plus `AdvisorEmbeddingStalenessVerdict` from persisted vector model rows, compares that stored identity against the active embedder pointer and keeps `generatedAt` as a back-compatible sibling field. Matching stored vectors yield `stale:false`, mismatched/mixed/missing model ids yield `stale:true` with a reason. Empty projections remain not-stale because there are no vectors to trust or serve.

The `semantic_shadow` lane now fails closed on a stale projection verdict. Fusion also turns that verdict into runtime-degraded lane health so stale vectors are omitted from confidence normalization, not merely returned as an empty match set. `advisor_status` semantic health reports `projection_embedding_stale` and disables the lane when the same verdict is stale.

### Candidate set

| # | Candidate | Status | Gate |
|---|-----------|--------|------|
| 1 | `SA8-embedding-staleness` - the staleness signal (stamp `(provider,name,dim)` signature at build, compare on load, emit a `{stale,reason}` verdict mirroring `memory_embedding_reconcile`, degrade `semantic_shadow` on stale) | **DONE** | Implemented and verified with typecheck, build, focused tests, broad related Vitest, comment hygiene and alignment drift |
| 2 | `Advisor-embedding-staleness-signal` - the idempotent-async projection rebuild reuse (durable cursor + bounded retry + idempotency token) | **PENDING** | shared-infra-dep - Memory `010-consolidation-cursor-clock` must land the primitive, this is the SECOND consumer, no second engine (synthesis `04-sibling-and-cross-cutting.md:34`) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation followed the signal-first sequence. `types.ts` adds the projection signature and stale verdict types. `projection.ts` reads active embedder metadata, reuses the existing `providerModelId` helper exported from `skill-graph-db.ts`, summarizes stored vector model ids from active and legacy embedding storage and emits the structured verdict. `semantic-shadow.ts` elides the lane on stale projections, `fusion.ts` converts that into runtime-degraded lane health, `advisor-status.ts` reports stale projection vectors through semantic lane health. `projection-embedding-staleness.vitest.ts` covers fresh, stale, fail-closed, empty, lane-degrade and status-health behavior.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Target the READ boundary, mirror - do not duplicate the write path.** The write-path refresh guard already detects per-row drift (`skill-graph-db.ts:1233-1234`), SA8 adds the missing check at projection LOAD (`projection.ts:388`) and mirrors `memory_embedding_reconcile`'s `{stale, reason}` shape (`embedding-reconcile.ts:183-189`) rather than inventing a parallel staleness format, so advisor + memory staleness semantics stay aligned.
- **Signal first, rebuild second.** The staleness signal (signature capture + compare-on-load + lane degrade) is independently shippable and carries NO shared-infra gate, only the projection-rebuild leg gates on Memory `010-consolidation-cursor-clock`. Ship the signal first, wire the rebuild when the primitive lands.
- **Reuse the Memory-010 idempotent-async primitive, do not build a second engine.** The stale-triggered rebuild rides the durable-cursor + bounded-retry + idempotency-token primitive built once in Memory 010 - the advisor is the SECOND consumer (synthesis `04:34`), this sub-phase imports/adapts it, it does not reinvent it.
- **Keep `generatedAt` for back-compat, ADD the signature.** The signature is a sibling field on the `AdvisorProjection` shape, not a replacement for `generatedAt`, so `advisor_status`/cache-keying consumers that read `generatedAt` are undisturbed, only the staleness verdict is net-new.
- **Fail closed, report-only on an unreadable pointer.** A missing/null stored signature ⇒ STALE (a legacy signature-less projection is flagged for rebuild, not silently trusted), an unreadable active-embedder pointer ⇒ report-only (degrade the lane, do not crash the load), mirroring `embedding-reconcile.ts:34`.
- **Ship for detection/correctness, not a promised delta.** SA8 banked ZERO benchmarks, its M-H / S-M leverage/effort are structural inference per the 028 GO-evidence caveat - flag, do not promise.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Code-only baseline before implementation**: `npm run typecheck` passed with 0 errors. Broad related Vitest `tests/scorer lib/scorer/lanes/__tests__ tests/handlers/advisor-status.vitest.ts` passed 84/86 with 2 skipped. Live `advisor_validate` was not run because the task prohibited live MCP work.
- **Post-implementation verification**: `npm run typecheck` passed with 0 errors, `npm run build` passed, focused Vitest `projection-embedding-staleness.vitest.ts` passed 6/6, broad related Vitest passed 90/92 with 2 skipped, comment hygiene passed on modified code/test files, `verify_alignment_drift.py --root .opencode/skills/system-skill-advisor/mcp_server` passed.
- **Documentation**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md` and this summary updated for signal DONE / rebuild gated, `validate.sh --strict` run on this sub-phase at closeout.
- **Seam + mirror confirmed by direct read**: the SA8 load-time `generatedAt` stamps (`projection.ts:315,328,375,413`), the stored model-id columns + `providerModelId` signature (`skill-graph-db.ts:187,348-352,599-600`) and the write-path skip guard (`:1233-1234`) and the `memory_embedding_reconcile` compare-and-report shape (`embedding-reconcile.ts:139-142,183-189,34`).
- **Shipped-record confirmed**: SA8 is NOT in `030` section 14, it is scheduled Wave-1 (`030 spec.md:104`). Both candidates PENDING.
- **Residual gate**: the rebuild-idempotency Vitest remains pending with the Memory 010 shared primitive.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Committed at `f038ff140e`.** The code is implemented, verified and shipped in that 028 build commit.
- **No measured benefit number.** SA8 banked ZERO benchmarks, the M-H / S-M leverage/effort are structural inference (`synthesis/01:36` Wave-1, roadmap GO-evidence caveat). The value is detection + repair of a silent staleness hole, not a benchmarked routing-quality delta.
- **The rebuild leg is gated on a sibling subsystem.** Facet #2 (`Advisor-embedding-staleness-signal`) cannot ship until Memory `010-consolidation-cursor-clock` lands the idempotent-async primitive. The signal (facet #1) is independent and implemented.
- **Partial refresh detection is implemented at the stored-row summary level.** Mixed model ids produce a stale verdict rather than collapsing into a false fresh single signature.
- **Lane-degrade shape is aligned with runtime lane health.** `semantic_shadow` is marked runtime-degraded and omitted from confidence normalization when the projection verdict is stale.
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
- **Shipped record (historical evidence)**: Wave-0 record and Wave-1 list.
