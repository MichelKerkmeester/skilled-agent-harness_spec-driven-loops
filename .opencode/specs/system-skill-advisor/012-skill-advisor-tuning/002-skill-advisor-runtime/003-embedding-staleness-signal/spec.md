---
title: "Feature Specification: Skill Advisor Embedding-Staleness Signal (SA8)"
description: "The advisor projection stamps generatedAt=now() at load and carries no embedder signature, so the semantic-shadow lane silently consumes vectors from a superseded embedder. Stamp the embedder id/version into the stored projection and compare on load (mirror memory_embedding_reconcile) to surface the silent staleness hole."
trigger_phrases:
  - "advisor embedding staleness signal"
  - "skill advisor projection embedder drift"
  - "SA8 embedding staleness"
  - "stamp embedder id into advisor projection"
  - "advisor projection generatedAt masks embedder drift"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/012-skill-advisor-tuning/002-skill-advisor-runtime/003-embedding-staleness-signal"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented advisor embedding-staleness signal. Rebuild reuse gated on Mem 010"
    next_safe_action: "Wire the stale-triggered rebuild once the Memory-010 primitive is available"
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
    open_questions:
      - "Memory 010 primitive availability for stale-triggered projection rebuild reuse"
    answered_questions:
      - "Projection staleness is derived from stored model rows and detects mixed model ids."
      - "A stale verdict degrades/elides semantic_shadow and removes it from confidence normalization."
---
# Feature Specification: Skill Advisor Embedding-Staleness Signal (SA8)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | partial (signal shipped, rebuild reuse gated on Memory 010) |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Packet** | system-skill-advisor/012-skill-advisor-tuning/002-skill-advisor-runtime |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Skill Advisor has a load-time staleness blind spot. Its WRITE path is already embedder-aware, `refreshSkillEmbeddingsViaAdapter` skips a re-embed only when `vec_model_id === modelId && vec_content_hash === contentHash` and fails fast on an adapter-vs-active-pointer dim mismatch (`skill-graph-db.ts` per-row guard + `:599-600` `providerModelId` signature builder, plus columns `embedding_model_id`/`embedding_content_hash` at `:187,:348-352`). But the READ/projection boundary the scorer actually consumes carries no embedder signature at all: `loadSqliteProjection` builds the in-memory `AdvisorProjection` and stamps `generatedAt: new Date().toISOString()` at load (`projection.ts:315`, same load-time stamp at `:328,:375,:413`). Because `generatedAt` is recomputed to *now* on every load, any embedder-version drift between the stored vectors and the active embedder is masked, and the `semantic_shadow` lane (`semantic-shadow.ts`, exact cosine over the cached rows) silently consumes vectors produced by a superseded embedder whenever a refresh has not run or only partially ran, with no detection and no repair signal. This is the same "stable source / stale derived artifact" family as the Memory and Code-Graph staleness gaps, but on the advisor's derived projection. **[CONFIRMED, `projection.ts:315`, `skill-graph-db.ts:187/348-352/599-600` read directly, research `../research/sibling-cross-cutting-revisit/research.md:80`, synthesis `01-go-candidates.md:36` & `04-sibling-and-cross-cutting.md:15`]**

### Purpose
Close the load-time staleness hole by stamping the embedder signature (provider/name/dim, the `memory_embedding_reconcile` identity tuple) into the stored advisor projection and comparing it against the active embedder on load, surfacing a stale-projection verdict the way `memory_embedding_reconcile` surfaces a shard mismatch, instead of letting `generatedAt = now()` paper over it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **SA8 staleness signal (net-new at the read boundary)**, capture the embedder signature `(provider, name, dim)` into the persisted projection at build/write time, compare it against the active embedder pointer when `loadAdvisorProjection` runs and emit a structured stale-projection verdict (mirroring `embedding-reconcile.ts`'s shard-mismatch report `verified:false, reason:'...'`) rather than relying on the recomputed `generatedAt` timestamp. Carry the signature through the `AdvisorProjection` shape so the `semantic_shadow` lane and `advisor_status`/`advisor_validate` can read it.
- **Idempotent-async projection rebuild (the cross-cutting reuse)**, when the load-time check finds a stale or partial projection, the rebuild path applies the SAME durable-cursor + bounded-retry + idempotency-token primitive built once in Memory `010-consolidation-cursor-clock`, so a crash mid-rebuild leaves a recoverable state and a re-run does not double-apply. The advisor side is the SECOND consumer of that primitive, it is imported/adapted here, not reinvented (synthesis `04-sibling-and-cross-cutting.md:34`).

### Out of Scope
- The other Skill Advisor candidates (C3 RRF determinism spine, C5 runtime-empty lane elision, C1/QCR/C4/C6/AMB), covered by sibling 028/003 impl sub-phases (`001-rrf-determinism-spine`, `002-runtime-lane-health-degrade` and others).
- BUILDING the shared idempotent-async primitive, it is built once in Memory `010-consolidation-cursor-clock` (durable cursor + bounded retry + idempotency token). This sub-phase REUSES it. If Memory 010 has not landed it, this sub-phase's rebuild path is gated on it (see §6 Dependencies).
- Changing the embedder REGISTRY, the active-embedder selection or the `embedder_set`/`embedder_status` tooling, SA8 reads the active pointer, it does not manage it.
- Re-deriving or re-ranking the other four lanes. SA8 only affects whether the `semantic_shadow` lane's vectors are trusted/served and whether a rebuild is triggered.
- Any measured before/after benefit number, research banked ZERO benchmarks for SA8. Its M-H/S-M leverage/effort are structural inference, not a measured delta (roadmap GO-evidence caveat).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts` | Modify | Capture the embedder signature into the persisted projection at build time, carry it on the `AdvisorProjection` shape and replace the bare `generatedAt = now()` stamp (`:315,:328,:375,:413`) with a signature-bearing build stamp so load-time drift is detectable |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` | Modify | Surface the stored per-row `embedding_model_id` (`:187,:348-352`) and the `providerModelId` signature (`:599-600`) to the projection build so the captured signature reflects what is actually persisted |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` | Modify | Consume the staleness verdict, when the projection is flagged stale, the lane degrades/elides rather than serving superseded vectors as if fresh |
| advisor projection-rebuild path (cursor/retry seam) | Modify | Apply the imported Memory-010 idempotent-async primitive (durable cursor + bounded retry + idempotency token) to the projection rebuild triggered by a stale verdict |
| tests alongside each seam | Create/Modify | Staleness-detection unit test (matching + mismatching signature), lane-degrade test, rebuild idempotency/crash-recovery test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | SA8: capture the embedder signature into the stored projection | The persisted projection carries the embedder signature `(provider, name, dim)` derived from the active embedder pointer / `providerModelId` (`skill-graph-db.ts:599-600`), NOT just a `generatedAt` timestamp. The signature is on the `AdvisorProjection` shape and survives load |
| REQ-002 | SA8: compare on load and emit a stale verdict | `loadAdvisorProjection` (`projection.ts:388`) compares the stored signature against the active embedder and emits a structured `{stale:true, reason:'...'}` verdict on mismatch, mirroring `embedding-reconcile.ts`'s `verified:false, reason:'shard model X != active Y'` shape (`embedding-reconcile.ts:182-189`). A matching signature emits `stale:false`. `generatedAt = now()` no longer masks drift |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | SA8: semantic_shadow lane consumes the verdict | When the projection is flagged stale, the `semantic_shadow` lane (`semantic-shadow.ts`) degrades, it does NOT serve superseded vectors as if fresh. The degrade is observable (matching the lane-empty / degrade-to-remaining behavior the sibling 002 sub-phase formalizes) |
| REQ-004 | SA8: idempotent-async projection rebuild reuses the Memory-010 primitive | A stale verdict can trigger a projection rebuild that uses the durable-cursor + bounded-retry + idempotency-token primitive imported from Memory `010-consolidation-cursor-clock`. A crash mid-rebuild leaves a recoverable state and a re-run does not double-apply (no second build engine is stood up, synthesis `04-sibling-and-cross-cutting.md:34`) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A projection built under embedder A and loaded while embedder B is active is detected as stale (structured verdict with a reason), instead of being served with `generatedAt = now()` masking the drift.
- **SC-002**: The signature mirrors the `memory_embedding_reconcile` identity tuple `(provider, name, dim)` so the advisor's staleness semantics match the memory subsystem's, and the `semantic_shadow` lane degrades rather than trusting superseded vectors.
- **SC-003**: The projection rebuild reuses the Memory-010 idempotent-async primitive (no second cursor/retry engine). A crash mid-rebuild is recoverable and a re-run does not double-apply.
- **SC-004**: Each candidate's STATUS is explicit (PENDING + gate). The SA8 leverage/effort are flagged as structural inference (no measured benefit number). Typecheck, build, focused tests and `validate.sh --strict` on this folder pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The WRITE path already detects per-row drift (`skill-graph-db.ts` skip-when-`vec_model_id===modelId`). SA8 could duplicate that check | Wasted work / two divergent staleness checks | SA8 targets the READ/projection boundary the scorer consumes (where there is NO check today), not the refresh path. Reuse `providerModelId` rather than a new signature format |
| Risk | Changing the projection shape / `generatedAt` semantics could disturb consumers that read `generatedAt` | Behavior drift in `advisor_status`/cache-keying | Keep `generatedAt` for back-compat. ADD the signature as a sibling field. Only the staleness verdict is net-new |
| Risk | No measured benefit number for SA8 | Ship for correctness/detection, not a promised delta | Leverage/effort (M-H / S-M) are structural inference per the 028 GO-evidence caveat. Flag, do not promise |
| Risk | Stale verdict + eager rebuild could thrash on every load during a long re-embed | Load-path latency / churn | Rebuild rides the bounded-retry + cursor primitive (amortized, idempotent). A stale verdict that is already-rebuilding does not re-trigger |
| Dependency | Memory `010-consolidation-cursor-clock` idempotent-async primitive | REQ-004's rebuild path reuses it. If Memory 010 has not shipped the primitive, REQ-004 is gated | Land Memory 010 first (or import the primitive as it lands). REQ-001/002/003 (the staleness signal itself) do not depend on it and can ship first |
| Dependency | Active-embedder pointer + `providerModelId` signature (`skill-graph-db.ts:599-600`) | The captured signature must reflect the real active embedder | Read the active pointer the same way `embedding-reconcile.ts:137-144` reads `active_embedder_*`. Reuse the existing signature builder |
| Dependency | `memory_embedding_reconcile` mirror (`embedding-reconcile.ts:162-189`) | SA8 mirrors its `(name, dim, provider)` compare-and-report shape | Mirror the verdict shape (`verified/reason`) so advisor + memory staleness semantics stay aligned |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The load-time staleness compare is O(1) (a tuple equality against the active pointer), adding no measurable latency to `loadAdvisorProjection`. The rebuild it may trigger is amortized and idempotent via the Memory-010 cursor primitive, never paid synchronously in full on a single load.

### Security
- **NFR-S01**: No new untrusted-input surface, SA8 reads the active-embedder pointer and the stored projection signature, both internally produced. It introduces no external data path.

### Reliability
- **NFR-R01**: A crash during a stale-triggered projection rebuild is recoverable (durable cursor + startup-safe state from the Memory-010 primitive) and a re-run does not double-apply (idempotency token). A stale verdict degrades the `semantic_shadow` lane rather than failing the whole recommendation.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a projection with NO stored embeddings (first run, `loadFilesystemProjection`) carries no signature, treated as not-stale (nothing to compare), the lane simply has no vectors, no false stale verdict.
- Maximum length: a signature for a never-before-seen embedder (provider/name/dim all change) yields a single clear mismatch verdict, not per-row noise.
- Invalid format: a missing/null stored signature on an otherwise-populated projection is treated as STALE (fail-closed, matching `embedding-reconcile.ts:11` "fails closed on mismatch"), so a legacy projection without a signature is flagged for rebuild rather than silently trusted.

### Error Scenarios
- External service failure: the active-embedder pointer is unreadable → report-only (do not crash the load, degrade the lane), mirroring `embedding-reconcile.ts`'s `providerFailurePolicy: 'report-only'`.
- Network timeout: not applicable on the read path (local SQLite + in-process compare). A rebuild that needs the embedder backend rides the bounded-retry budget.
- Concurrent access: two loads observing the same stale verdict must not both launch a rebuild, the idempotency token + cursor lock ensures a single in-flight rebuild.

### State Transitions
- Partial completion: a rebuild interrupted mid-way leaves the cursor at the contiguous-consolidated prefix. The next load resumes, never re-applying a completed row.
- Session expiry: not applicable (no session state). The projection signature is durable in SQLite.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | 2 candidates, ~3-4 advisor files (projection/scorer/lane + rebuild seam). Net-new at a single read boundary |
| Risk | 14/25 | No auth/API. Touches the projection shape consumed by the scorer + a cross-packet primitive dependency (Memory 010). Back-compat for `generatedAt` |
| Research | 7/20 | Seam + mirror fully cited. The one open design choice (single vs per-row signature) is bounded |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. CANDIDATE STATUS

> Per-candidate disposition with research citation and gate. STATUS = DONE (shipped via its 028 commit) when implemented and verified, else PENDING with its gate. The signal candidate is DONE (shipped at `f038ff140e`), the rebuild-reuse candidate is PENDING on its Memory-010 gate. Neither candidate appeared in the packet 030 Wave-0 status table, the Wave-1 list scheduled "advisor embedding-staleness" as future work.

| # | Candidate | Status | Gate | Evidence / Citation |
|---|-----------|--------|------|---------------------|
| 1 | `SA8-embedding-staleness` (the staleness signal: stamp signature + compare on load + lane degrade) | **DONE** | code + unit verification complete, no benchmark gate | Implemented in `projection.ts`, `types.ts`, `semantic-shadow.ts`, `fusion.ts`, `advisor-status.ts`, with `providerModelId` exported from `skill-graph-db.ts`. Tests: `projection-embedding-staleness.vitest.ts`. Broad related gate `tests/scorer lib/scorer/lanes/__tests__ tests/handlers/advisor-status.vitest.ts` passed 90/92 with 2 skipped. Typecheck/build passed. |
| 2 | `Advisor-embedding-staleness-signal` (the idempotent-async projection rebuild reuse) | **PENDING** | shared-infra-dep, Memory `010-consolidation-cursor-clock` idempotent-async primitive | NOT in 030 §14. Reuse mapping: synthesis `04-sibling-and-cross-cutting.md:34` ("the receipt + retry-budget/dead-letter pattern maps onto the Advisor's async embedding projection (SA8) ... build the shared primitive once, reuse on the advisor side"). Gated on Memory 010 landing the primitive. |

> These are two facets of one candidate pair (`["SA8-embedding-staleness","Advisor-embedding-staleness-signal"]`): #1 is the detection signal (independently shippable), #2 is the reuse of the Memory-010 rebuild primitive (gated). Sequencing: ship #1 first, wire #2 when Memory 010's primitive is available.

<!-- ANCHOR:questions -->
## 11. OPEN QUESTIONS

- Memory `010-consolidation-cursor-clock` must land the shared idempotent-async primitive before the stale-triggered projection rebuild reuse can be wired.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Source research**: `../research/research.md`, `../research/sibling-cross-cutting-revisit/research.md:80`, `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md:36`, `../../research/synthesis/04-sibling-and-cross-cutting.md:15,:34`.
- **Wave-0 shipped record (done-candidate evidence)**: Wave-0 record (SA8 NOT present → PENDING) + Wave-1 list.
- **Shared-infra dependency**: `../../001-speckit-memory/010-consolidation-cursor-clock/spec.md` (idempotent-async primitive: durable cursor + bounded retry + idempotency token).
- **Mirror reference**: `memory_embedding_reconcile`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:162-189`.
