---
title: "Implementation Plan: Skill Advisor Embedding-Staleness Signal (SA8)"
description: "Sequenced approach for closing the advisor projection's load-time staleness blind spot: stamp the embedder signature into the stored projection and compare on load (mirror memory_embedding_reconcile), degrade the semantic_shadow lane on mismatch and reuse the Memory-010 idempotent-async primitive for the projection rebuild."
trigger_phrases:
  - "advisor embedding staleness plan"
  - "SA8 projection signature plan"
  - "advisor projection rebuild idempotent plan"
  - "stamp embedder signature advisor plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/002-skill-advisor-runtime/003-embedding-staleness-signal"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented signal-first phases A-C, Memory-010 rebuild reuse gated"
    next_safe_action: "Wire phase D once the shared idempotent-async primitive is available"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-embedding-staleness-signal"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Skill Advisor Embedding-Staleness Signal (SA8)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`system-skill-advisor/mcp_server`) |
| **Framework** | Skill Advisor MCP daemon + 5-lane fusion scorer |
| **Storage** | SQLite (`skill_nodes` with `embedding`/`embedding_model_id`/`embedding_content_hash`, `vec_<dim>` shard tables, active-embedder meta) |
| **Testing** | vitest (focused per-seam: projection signature, lane degrade, rebuild idempotency) |

### Overview
Close the advisor's load-time staleness blind spot in two facets, signal-first. The WRITE path is already embedder-aware (`refreshSkillEmbeddingsViaAdapter` skips when `vec_model_id===modelId && vec_content_hash===contentHash`, dim-mismatch fail-fast), but the READ/projection boundary the scorer consumes carried NO embedder signature, `loadSqliteProjection` stamped `generatedAt = new Date().toISOString()` at load (`projection.ts:315`), masking embedder-version drift. **Facet #1 (the staleness signal, `SA8-embedding-staleness`)** is implemented: the projection carries an embedder signature/staleness verdict, `semantic_shadow` degrades on stale vectors and status health reports the stale-vector condition. **Facet #2 (the rebuild reuse, `Advisor-embedding-staleness-signal`)** remains gated until the durable-cursor + bounded-retry + idempotency-token primitive from Memory `010-consolidation-cursor-clock` is available, no second engine is built here.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- Seam confirmed by direct read: `projection.ts:315` (load-time `generatedAt` stamp), `skill-graph-db.ts:187,348-352,599-600` (stored model-id columns + `providerModelId` signature builder), `embedding-reconcile.ts:162-189` (the mirror's compare-and-report shape).
- The Memory-010 idempotent-async primitive (durable cursor + bounded retry + idempotency token) is identified as the reuse target for facet #2. Its availability is the only external gate.

### Definition of Done
- A projection built under embedder A, loaded while embedder B is active, yields a structured stale verdict (not a masked `generatedAt = now()`). A matching signature yields not-stale. A missing/null signature fails closed to stale.
- The `semantic_shadow` lane degrades on a stale verdict.
- The rebuild reuse is explicitly left pending until the Memory-010 primitive is available.
- Typecheck + build + focused tests + broad related Vitest + `validate.sh --strict` on this folder pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The change adds a staleness boundary at projection LOAD, mirroring the memory subsystem's reconcile boundary:

- **Signature capture (build/persist).** The projection build (`loadSqliteProjection`, `projection.ts:286-317`) reads the active-embedder pointer and the per-row `embedding_model_id` already stored on `skill_nodes` (`skill-graph-db.ts:187,348-352`), and reuses `providerModelId` (`skill-graph-db.ts:599-600`) to derive a canonical `(provider, name, dim)` signature. The signature is attached to the `AdvisorProjection` shape (a sibling field alongside the retained `generatedAt`, not a replacement, back-compat).
- **Compare on load (the verdict).** `loadAdvisorProjection` (`projection.ts:388`) compares the stored signature against the active embedder pointer (read the way `embedding-reconcile.ts:137-144` reads `active_embedder_*`) and emits `{stale:boolean, reason?:string}` mirroring `embedding-reconcile.ts:182-189` (`verified:false, reason:'shard model X != active Y'`). Fail-closed: a missing/null stored signature ⇒ stale.
- **Lane consumption (degrade).** The `semantic_shadow` lane (`lanes/semantic-shadow.ts`) reads the verdict. On stale it degrades (elide / down-weight) rather than serving superseded cosine results as fresh, consistent with sibling 002's degrade-to-remaining lane-health model.
- **Rebuild (idempotent-async reuse).** A stale verdict may trigger a projection rebuild that rides the Memory-010 durable-cursor + bounded-retry + idempotency-token primitive, single in-flight rebuild (idempotency token), recoverable mid-rebuild (durable cursor), no double-apply.

This is purely additive at the read boundary. It does not touch the embedder registry, active-embedder selection, the write-path refresh guard or the other four lanes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | File:Line | Why it changes |
|---------|-----------|----------------|
| Projection build + load stamp | `lib/scorer/projection.ts:286-317,:388` (and the `generatedAt` stamps `:315,:328,:375,:413`) | Capture the signature at build. Compare + emit the verdict at load |
| Stored embedder identity | `lib/skill-graph/skill-graph-db.ts:187,348-352,599-600` | Surface `embedding_model_id` + `providerModelId` signature to the projection build |
| Semantic-shadow lane | `lib/scorer/lanes/semantic-shadow.ts` | Degrade on a stale verdict instead of trusting superseded vectors |
| Projection-rebuild seam | rebuild path (imports Memory-010 primitive) | Make a stale-triggered rebuild durable + idempotent |
| Mirror reference (read-only) | `system-spec-kit/.../embedders/embedding-reconcile.ts:137-189` | The compare-and-report shape SA8 mirrors |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

**Phase A, Signature capture (REQ-001).** Derive the `(provider, name, dim)` signature from the active pointer + `providerModelId`, attach it to the `AdvisorProjection` shape, retain `generatedAt` for back-compat. Unit-test that a built projection carries the expected signature.

**Phase B, Compare-on-load verdict (REQ-002).** Add the load-time compare in `loadAdvisorProjection`, emit `{stale, reason}` mirroring `embedding-reconcile.ts`, fail-closed on missing signature. Unit-test matching ⇒ not-stale, mismatch ⇒ stale-with-reason, null ⇒ stale.

**Phase C, Lane degrade (REQ-003).** Wire the `semantic_shadow` lane to the verdict. On stale, degrade. Unit-test the lane output under stale vs fresh.

**Phase D, Idempotent rebuild reuse (REQ-004, gated on Memory 010).** Import the Memory-010 durable-cursor + bounded-retry + idempotency-token primitive, route the stale-triggered rebuild through it, ensure single in-flight + crash recovery + no double-apply. Memory 010 has not landed the reusable primitive in this work window, so REQ-004 remains gated after Phase C.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Signature capture**, assert the built projection's signature equals `providerModelId(activePointer)`. Assert `generatedAt` is still present (back-compat).
- **Compare-on-load**, three cases: matching signature ⇒ `stale:false`. Provider/name/dim mismatch ⇒ `stale:true` + reason string in the `embedding-reconcile.ts` shape. Missing/null stored signature ⇒ `stale:true` (fail-closed).
- **Lane degrade**, `semantic_shadow` output under a stale verdict degrades (no superseded cosine rows ranked as fresh) vs fresh verdict (unchanged).
- **Rebuild idempotency/crash** (Phase D), a rebuild interrupted mid-cursor resumes without re-applying completed rows. Two concurrent stale loads launch a single rebuild.
- **Regression baseline**, capture the current code-only typecheck + broad related scorer/status Vitest green count BEFORE changes. Re-run the WHOLE related gate after and report the delta (no benefit number is claimed, correctness only). Live `advisor_validate` remains outside this work window.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Memory `010-consolidation-cursor-clock`**, REQ-004's rebuild reuses its idempotent-async primitive (durable cursor + bounded retry + idempotency token). Hard gate for facet #2 only. Facets REQ-001/002/003 (the signal) are independent.
- **Active-embedder pointer + `providerModelId`** (`skill-graph-db.ts:599-600`), the signature source, read the active pointer like `embedding-reconcile.ts:137-144`.
- **`memory_embedding_reconcile` mirror** (`embedding-reconcile.ts:162-189`), the verdict shape to mirror so advisor + memory staleness semantics stay aligned.
- **Sibling 028/003 phases**, 002 (`runtime-lane-health-degrade`) formalizes lane degrade-to-remaining. Reuse its degrade convention rather than inventing a parallel one. No ordering hard-dependency, but align the lane-degrade shape.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each phase is an independent, reversible commit. To roll back: revert the phase commit. The signature is an ADDED field (back-compat retained `generatedAt`), so reverting Phase A/B leaves the projection shape valid for old consumers. Phase C revert restores the lane's prior unconditional trust. Phase D revert restores the prior (non-durable) rebuild path. No schema migration is destructive, the `embedding_model_id` column already exists (`skill-graph-db.ts:348-352`).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks | Gate |
|-------|-----------|--------|------|
| A (signature capture) | none | B | none |
| B (compare-on-load) | A | C | none |
| C (lane degrade) | B | none | align with sibling 002 degrade shape |
| D (idempotent rebuild) | B (verdict), Memory 010 primitive | none | shared-infra-dep: Memory 010 |

Critical path: A → B → C (the shippable signal). D is parallel-after-B but gated on Memory 010. It does not block the signal shipping.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Candidate / Facet | Effort | Leverage | Basis |
|-------------------|--------|----------|-------|
| `SA8-embedding-staleness` (signal: A+B+C) | S-M | M-H | Single read-boundary add. Mirror exists. Columns exist. Inferred (no benchmark). |
| `Advisor-embedding-staleness-signal` (rebuild reuse: D) | S (if primitive ready) / M (if adapting) | M | Import + adapt the Memory-010 primitive, gated on its landing. Inferred. |

> No measured benefit number exists for SA8, leverage/effort are structural inference per the 028 GO-evidence caveat. Ship for detection/correctness, not a promised delta.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Trigger | Action | Verification |
|---------|--------|--------------|
| Stale verdict false-positives on a valid projection | Revert Phase B. Investigate signature derivation (provider/name/dim normalization) | Typecheck + broad related scorer/status Vitest green. No spurious stale on a freshly-refreshed DB fixture |
| Lane degrade over-suppresses `semantic_shadow` | Revert Phase C. Keep the verdict (report-only) until the degrade shape is aligned with sibling 002 | Lane contributes again. Recommendation parity restored |
| Rebuild thrashes / loops on load | Revert Phase D to the prior non-durable rebuild. Gate eager rebuild behind the idempotency lock | No repeated rebuild on consecutive loads. Single in-flight |
| Memory 010 primitive changes shape after import | Re-pin the import. D is the only consumer affected | Phase D tests green against the updated primitive |
<!-- /ANCHOR:enhanced-rollback -->
