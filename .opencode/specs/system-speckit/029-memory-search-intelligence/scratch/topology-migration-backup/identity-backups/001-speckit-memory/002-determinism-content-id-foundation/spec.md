---
title: "Feature Specification: Determinism + Content-ID Foundation (Spec-Kit Memory MCP)"
description: "The shared total-comparator, two SHA-256 content-id primitives and the rank-time fusion-bonus/decay-clock seams that every determinism candidate and cross-subsystem consumer byte-compares against. The cheap reversible wins shipped in Wave-0 (packet 030). The determinism residue (render-order serialization stage, configured-channel multichannel bonus) and the single-tenant-refuted identity-hardening pair remain documented as PENDING."
trigger_phrases:
  - "determinism content-id foundation"
  - "memory total comparator keystone"
  - "content-derived tiebreak serialization"
  - "fuseResultsMulti bonusOverChannels"
  - "028 speckit-memory impl phase"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/001-speckit-memory/002-determinism-content-id-foundation"
    last_updated_at: "2026-07-04T17:51:02.224Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped 5 determinism candidates byte-identical, 4 gated residue"
    next_safe_action: "Land fusion-bonus invariant test before configured-mode promotion"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "../research/research.md"
      - "../../research/roadmap.md"
      - "../../research/synthesis/01-go-candidates.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-determinism-foundation"
      parent_session_id: null
    completion_pct: 55
    open_questions:
      - "Does the live fusion-bonus unit test confirm the C-X1 'active' default is byte-identical to pre-change fusion (the still-open determinism gate)?"
      - "Is M-dual-class-identity / M-clock-skew-replay-window ever worth building, given the single-tenant refutation, or do they stay documented-NO-GO?"
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: Determinism + Content-ID Foundation (Spec-Kit Memory MCP)

## EXECUTIVE SUMMARY

This sub-phase is the determinism keystone of the Spec-Kit Memory MCP (the PRIMARY subsystem of packet 028's Memory Search Intelligence roadmap). It owns the shared total-comparator, the two SHA-256 content-id primitives (content-body and canonical-field) and the rank-time fusion-bonus / decay-clock seams that every other determinism candidate and every cross-subsystem consumer (Code Graph 002, Skill Advisor 003, Deep Loop 004) byte-compares its output against. The cheap, reversible, no-benchmark wins already shipped in the flat Wave-0 implementation record (030). This sub-phase records them as DONE with their commit evidence and carries the residue, the render-order serialization stage (C5-A), the configured-channel multichannel bonus (C-X1 `'configured'`) and the single-tenant-refuted identity-hardening pair, as documented PENDING work with explicit gates.

**Key Decisions**: Build the total-comparator + content-id formula once and reuse N (the keystone, per `synthesis/01` Shared-infrastructure). Ship the byte-identical-by-default seams (C-X1 `'active'`, C6-A clock) and the cheap tiebreaks (ANN, C5-B) first. Leave the render-stage and the multi-writer identity hardening documented but unbuilt because they are either fuller-parity follow-ups or single-tenant-refuted.

**Critical Dependencies**: The two-primitive content-id module (shipped `18c8582e33`) is the shared dependency for C5-B, the ANN tiebreak COALESCE fallback and the eventual C5-A render stage. The C-X1 `'active'` default (shipped `65cfcea513`) is the de-risking prerequisite for the Wave-1 per-class zero-weighting (C2-B) that the `'configured'` residue exists to serve.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/029-memory-search-intelligence` |
| **Parent Packet** | system-speckit/029-memory-search-intelligence/001-speckit-memory |
| **Source research** | `../research/research.md`, `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md` + `03` |
| **Shipped record** | Wave-0 record (Wave-0 commits `738e118751..ab5459fb6d`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Memory MCP fuses ranked signals and renders a result set the downstream agent loop caches against, but its ordering is not reproducible: the candidate-merge comparators sort score-only with non-content tie-breaks (input-order or clock-derived `updated_at`), the four ranked ANN `ORDER BY distance` queries have no tie-break so which rows survive the LIMIT into fusion is run-to-run unstable, and recall serialization is a bare `JSON.stringify` with no content-derived render-order stage (`research.md` Internal Baseline, `001` iter-3 Q5). Identity is the sequential `memory_index.id` autoincrement, and the SHA-256 hashing formula is duplicated across `memory-parser.ts` (content-body) and `idempotency-receipts.ts` (canonical-field) rather than centralized. Without a single hand-written total comparator and a centralized content-id formula, every determinism candidate re-implements a partial ordering (JS `(a,b)=>b-a` is not a total order, NaN / -0 poison it, per `synthesis/01` SA7) and the cross-subsystem byte-compare contract cannot hold.

### Purpose
Establish the determinism + content-id foundation, one total comparator, two SHA-256 content-id primitives, content-derived tiebreaks at every ordering seam and the byte-identical-by-default rank-time fusion-bonus / decay-clock seams, so that recall ordering is reproducible across runs and the four-subsystem byte-compare contract has a stable substrate. Ship the cheap reversible wins and document the fuller-parity residue.

### Critical context (from the 028 BROADENING + 027-REVISIT addenda, authoritative, supersede pass-1)
- **No candidate has a measured before/after benefit number**, every leverage/effort rating is structural inference, never a benchmarked delta (`synthesis/03` §B). Ship for reproducibility/testability, not a promised delta.
- **The galadriel prompt-cache (~84%) determinism justification is INVALID for an MCP server**, that figure is an in-process-agent property. An out-of-band MCP server's recall lands in the client's mutable tail and makes no API calls. Determinism stands on reproducibility/testability, not prompt-cache (`synthesis/03` §A, `001` iter-29 G29-02). Do not cite the ~84% anywhere.
- **C5-B is a reorder-of-ties, not a stabilization**, the comparator is already total via the unique rowid. C5-B's value is content-derived *stability* (survives id reassignment / cross-DB), which downstream byte-caches may notice (`synthesis/03` §B, `001` iter-3).
- **The two-primitive module is a coupling-risk, not a clean S**, centralizing identity risks diverging from legacy bare-hex hashes. Primitive B's token-stripping is receipt-specific. Centralize the *formula*, parameterize the *identity* (`synthesis/03` §A, `001` iter-14/23).
- **The total-comparator is THE keystone. The content-derived-id is 2nd-tier**, a dependency only for the identity/tiebreak subset, not co-equal. Both are gate-free Wave-0 (`synthesis/01` Shared-infrastructure, `04` keystone correction).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope: the determinism + content-id foundation candidate set

| # | Candidate | One-line change | Seam (file:line) | Eff | Status |
|---|-----------|-----------------|------------------|-----|--------|
| 1 | **two-content-id-primitives** | Centralize Primitive A `computeContentHash` (content-body) + Primitive B `hashJson`/`normalizeForHash` (canonical-field) into one module, parameterize identity (legacy hashes bare-hex, B's token-stripping is receipt-specific) | `memory-parser.ts:914-916`, `idempotency-receipts.ts:59-102, 81-102` | S→M | **DONE** |
| 2 | **ANN-tie-stable-order** | Append `, m.id ASC` (COALESCE) to the 4 ranked ANN `ORDER BY distance` so which rows survive the LIMIT into fusion is run-stable (determinism *below* RRF) | `vector-index-queries.ts:169,199,458,570` | S | **DONE** |
| 3 | **C5-B** | `content_hash`-asc tiebreak (COALESCE to id for BM25/nullable) in the deterministic comparator + all RRF output sorts, for content-derived ordering *stability* | `ranking-contract.ts:46-53`, `rrf-fusion.ts:255`, comparators `hybrid-search.ts:752-758,900-904,922-926` | S | **DONE** |
| 4 | **C-X1** (`'active'`) | Expose the active-channel bonus denominator as a named `bonusOverChannels` param, defaulting to `'active'` so existing fusion stays byte-identical | `rrf-fusion.ts:296-371, 345-388` | S→M | **DONE** |
| 5 | **C6-A** | Always-on rank-time decay vs caller-supplied `nowMs` (not just `trackAccess`), reinforcement stays a separate explicit event, clock-less query byte-identical | `stage2-fusion.ts:897-908`, `fsrs.ts:40-47` | S→M | **DONE** |
| 6 | **C-X1-true-multichannel** (`'configured'`) | The second `bonusOverChannels:'configured'` mode so per-class zero-weighting (Wave-1 C2-B) does not distort survivors' convergence bonus, the residue beyond the shipped `'active'` default | `rrf-fusion.ts:345-388` | S→M | **PENDING** (shared-infra-dep) |
| 7 | **C5-A** | Content-derived serialization-order *render* stage (`serializationId = sha256(canonical fields)`) separating render order from score order, leaving fusion untouched, the fuller aionforge-parity successor to the C5-B stopgap | `formatters/search-results.ts:782`, `envelope.ts:99` | M | **PENDING** (render-build) |
| 8 | **M-dual-class-identity** | Dual-class identity (time-ordered capture ids + content-addressed derived ids, non-sortability as honest signal, time never inferred from id) | `memory-index.ts:281`, `idempotency-receipts.ts:81-97`, `causal-edges.ts:140` | M/S | **PENDING** (multi-writer-gate, single-tenant-refuted) |
| 9 | **M-clock-skew-replay-window** | Refuse writes deviating > tolerance, wall-clock accept/reject only, never stored, bounds replay/storm | `idempotency-receipts.ts:180,143-205` | M/S | **PENDING** (multi-writer-gate, single-tenant-refuted) |

> **Cross-subsystem contract.** This set is the keystone every determinism candidate and cross-subsystem consumer byte-compares against: Code Graph (002) promotes `fuseResultsMulti` with an adapter for impact-channel fusion, Skill Advisor (003) imports it for lane fusion, Deep Loop (004) reuses the content-derived ordering for its merge tie-break. The `{bonusOverChannels}` option name is the real seam. The `'active'` default keeps existing fusion byte-identical so all consumers stay stable until they opt into `'configured'`.

### Out of Scope (this sub-phase)
- **Wave-1 consumers of the foundation** (own sub-phases): C2-A retrieval-class classifier, C2-B per-class `RetrievalProfile` weight injection (the actual consumer of C-X1 `'configured'`), C2-C graph-expansion gating. The `'configured'` mode is built *here*. Its caller is built there.
- **C4-A idempotency-receipts default-on**, lives in the idempotency/save-path sub-phase. It consumes Primitive B but is gated by an update-path regression (11 `handleMemoryUpdate` tests break on the flip, `030` spec §14 candidate 6).
- **C4-B content-addressed `derived_id`**, Wave-2 schema migration (additive `derived_id TEXT UNIQUE`, must include anchors or the legacy UNIQUE backfill rejects). Consumes Primitive A/B but adds a column + index.
- **The writer-provenance-signing trio** (`001` iter-14 B/C/G), scope-flagged out for a single-trusted-host tool.
- Modifying packet 030 (the Wave-0 shipped record), the external reference systems under `external/` or any sibling subsystem (002/003/004) code.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.../mcp_server/lib/content-id.ts` | Create (DONE `18c8582e33`) | Centralized `hashContentBody` + `hashCanonicalJson` (the two primitives) |
| `.../mcp_server/lib/search/vector-index-queries.ts` | Modify (DONE `bec0eed27f`) | `, m.id ASC` COALESCE on the 4 ranked ANN `ORDER BY distance` |
| `.../shared/algorithms/rrf-fusion.ts` | Modify (DONE `bec0eed27f` + `65cfcea513`) | content_hash tiebreak in output sorts, `bonusOverChannels` param (`'active'` default) |
| `.../mcp_server/lib/search/pipeline/stage2-fusion.ts` | Modify (DONE `65cfcea513`) | rank-time decay clock vs caller `nowMs`, no-timestamp skip guard preserved |
| `.../mcp_server/lib/response/envelope.ts` + `formatters/search-results.ts` | Modify (PENDING C5-A) | content-derived serialization-order render stage |
| `.../shared/algorithms/rrf-fusion.ts` | Modify (PENDING C-X1 `'configured'`) | second bonus-denominator mode for per-class zero-weighting |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Two SHA-256 content-id primitives centralized into one module, formula-identical to the legacy call sites | DONE, `lib/content-id.ts` (`hashContentBody` content-body + `hashCanonicalJson` canonical-field), byte-identical hash outputs proven by parity test, no behavior change (`030` §14 cand 7, commit `18c8582e33`) |
| REQ-002 | The 4 ranked ANN `ORDER BY distance` queries are run-stable on tie | DONE, `, m.id ASC` (COALESCE) appended to all 4, which rows survive the LIMIT into fusion is now deterministic (`030` §14 cand 3, commit `bec0eed27f`) |
| REQ-003 | Score-tie ordering at the comparator and RRF output sorts is content-derived, primary order unchanged | DONE, `content_hash`-asc tiebreak (COALESCE id) in the deterministic comparator + all 5 RRF output sorts, primary order unchanged (verified), 3 broad-batch failures confirmed pre-existing on baseline (`030` §14 cand 4, commit `bec0eed27f`) |
| REQ-004 | The active-channel bonus denominator is a named param defaulting to byte-identical behavior | DONE, `bonusOverChannels` param defaults to `'active'` (byte-identical traced arithmetically), opus review SHIP (`030` §14 cand 5, commit `65cfcea513`) |
| REQ-005 | Rank-time decay reads a caller-supplied `nowMs` clock, clock-less query stays byte-identical, reinforcement stays a separate event | DONE, rank-time decay clock added, restored the no-timestamp skip guard so C6-A is a pure refactor (`030` §14 cand 5, commit `65cfcea513`) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The `bonusOverChannels:'configured'` mode exists so per-class zero-weighting does not reshape survivors' convergence bonus | PENDING, gated on the Wave-1 C2-B consumer + the still-open fusion-bonus unit test. Build the `'configured'` denominator alongside C2-B, default stays `'active'` (`roadmap.md` Sequencing Notes, `001` iter-7 #10/#13) |
| REQ-007 | A content-derived serialization-order render stage separates render order from score order at the render boundary, leaving fusion untouched | PENDING, `serializationId = sha256(canonical fields)` re-sort before `serializeEnvelope`. Do C5-B first (shipped), C5-A supersedes it, golden-file rebaseline once (`001` iter-3 C5-A, iter-7 #16) |
| REQ-008 | The single-tenant disposition of the identity-hardening pair is recorded, not silently dropped | PENDING/documented, M-dual-class-identity (PARTIAL/NO-GO single-tenant) and M-clock-skew-replay-window (REFUTED/NO-GO single-tenant) are recorded with their multi-writer gate. Neither ships without a distributed/multi-writer justification (`001` iter-14 → iter-23) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Recall ordering is reproducible across identical recalls at the ANN-below-RRF, comparator and RRF-output seams, the shipped tiebreaks (ANN, C5-B) make which rows survive the LIMIT and how equal-score ties break content-derived, not input-order or clock-derived.
- **SC-002**: The content-id formula is centralized once (one module, two primitives) and proven byte-identical to the legacy call sites by a parity test, no divergence from the legacy bare-hex hashes.
- **SC-003**: The C-X1 `'active'` default and the C6-A clock are byte-identical to pre-change fusion by an arithmetic/traced check (the cross-subsystem byte-compare contract holds, consumers 002/003/004 stay stable until they opt in).
- **SC-004**: Every PENDING residue (C-X1 `'configured'`, C5-A, the identity-hardening pair) has an explicit gate recorded (shared-infra-dep / render-build / multi-writer-gate) so nothing is silently dropped and nothing ships ungated.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Centralizing the content-id formula diverges from legacy bare-hex hashes | High, breaks dedup / receipt keying | Parameterize identity, prove byte-identical with a parity test (DONE, `18c8582e33`) |
| Risk | C-X1 `'active'` / C6-A clock silently change fusion math | High, breaks the cross-subsystem byte-compare contract | Default `'active'`, arithmetic/traced byte-identity proof, restored no-timestamp skip guard (DONE) |
| Risk | C5-A render stage re-baselines golden files | Med, one-time snapshot churn | Do C5-B first (shipped), C5-A is the superseding render stage, re-baseline once |
| Dependency | Wave-1 C2-B per-class weight injection | Blocks REQ-006 | C-X1 `'configured'` is built here but only consumed by C2-B, sequence with that sub-phase |
| Dependency | Still-open fusion-bonus unit test | Gates the "byte-identical-by-default" determinism claim | Land the unit test before promoting `'configured'` (`synthesis/03` §B) |
| Dependency | Single-tenant threat model | De-scopes REQ-008 pair | The pair is REFUTED/NO-GO for a single-trusted-host tool, only a multi-writer adoption revives it (`001` iter-23) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The shipped tiebreaks and bonus/clock seams add no measurable ranking cost, they are tie-only re-orders and named-param refactors over the existing fusion path, not new passes.

### Security
- **NFR-S01**: No new external data sink or trust boundary is introduced. The identity-hardening pair (dual-class / clock-skew) is explicitly NOT shipped because its threat model (remote / multi-writer adversary) does not apply to a single-trusted-host MCP.

### Reliability
- **NFR-R01**: Every shipped seam is byte-identical-by-default or a content-derived tie re-order. The cross-subsystem byte-compare contract (consumers 002/003/004) is the reliability invariant.

---

## 8. EDGE CASES

### Data Boundaries
- Nullable / BM25-path `content_hash`: the tiebreak COALESCEs to `id` so the comparator stays total even when `content_hash` is absent.
- Clock-less query: C6-A's no-timestamp skip guard keeps a query that supplies no `nowMs` byte-identical to pre-change behavior.

### Error Scenarios
- Legacy bare-hex hashes: the centralized formula must reproduce them exactly. A parity test is the guard.
- Per-class zero-weighting (future C2-B): without the `'configured'` mode, zeroing a channel would distort the survivors' convergence-bonus denominator, the reason the `'configured'` residue exists.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Files: ~6 seams. LOC: small per seam. Systems: Memory MCP fusion + render + hashing, cross-subsystem byte-compare contract |
| Risk | 16/25 | Auth: N. API: shared `fuseResultsMulti` signature consumed by 3 sibling subsystems. Breaking: byte-identity must hold |
| Research | 14/20 | Investigation done (200-iteration campaign), residue gated on a still-open fusion-bonus unit test + threat-model call |
| Multi-Agent | 6/15 | Foundation for sibling-subsystem consumers, no parallel workstream within this sub-phase |
| Coordination | 9/15 | Dependencies: Wave-1 C2-B (configured mode), idempotency/save sub-phase (Primitive B), Wave-2 C4-B (derived_id) |
| **Total** | **60/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Centralized content-id formula diverges from legacy hashes | H | L | Parity test proved byte-identical (DONE) |
| R-002 | `'active'`/clock seams break fusion byte-identity for consumers | H | L | Arithmetic/traced default-identity proof (DONE) |
| R-003 | `'configured'` mode promoted before the fusion-bonus unit test lands | M | M | Gate REQ-006 on the unit test + the C2-B consumer |
| R-004 | Identity-hardening pair built despite single-tenant refutation | M | L | Keep PENDING/documented behind a multi-writer-adoption gate |

---

## 11. USER STORIES

### US-001: Reproducible recall ordering (Priority: P0)

**As a** downstream agent loop caching against recall output, **I want** identical recalls to render in the same order, **so that** my byte-cache and any cross-run diff is stable.

**Acceptance Criteria**:
1. Given two identical recalls with equal-score ties, When fusion runs, Then the surviving rows and their order are content-derived and identical (ANN tiebreak + C5-B).

### US-002: One content-id formula, two primitives (Priority: P0)

**As a** maintainer of the hashing call sites, **I want** the content-body and canonical-field SHA-256 formulas in one module, **so that** dedup, receipts and future derived-id all share one proven-identical implementation.

**Acceptance Criteria**:
1. Given the centralized module, When a hash is computed, Then it is byte-identical to the legacy `memory-parser.ts` / `idempotency-receipts.ts` output (parity test).

### US-003: Byte-identical-by-default fusion seams (Priority: P1)

**As a** sibling subsystem (Code Graph / Skill Advisor / Deep Loop) byte-comparing against the shared fuser, **I want** the new bonus/clock seams to default to current behavior, **so that** I am not silently re-ordered when the foundation lands.

**Acceptance Criteria**:
1. Given the default `bonusOverChannels:'active'` and a clock-less query, When fusion/decay runs, Then output is byte-identical to pre-change (traced/arithmetic proof).

### US-004: No silently dropped residue (Priority: P1)

**As a** packet owner reading this sub-phase, **I want** every PENDING candidate to name its gate, **so that** the render-stage, the configured-mode and the single-tenant-refuted pair are tracked, not lost.

**Acceptance Criteria**:
1. Given the candidate table, When a candidate is PENDING, Then its gate (shared-infra-dep / render-build / multi-writer-gate) is recorded with a research citation.

---

## 12. OPEN QUESTIONS

- Does the live fusion-bonus unit test confirm the C-X1 `'active'` default is byte-identical to pre-change fusion (the still-open determinism gate that conditions every "byte-identical-by-default" claim, `synthesis/03` §B)?
- Is the identity-hardening pair (dual-class identity / clock-skew window) ever worth building, or does it stay documented-NO-GO unless a multi-writer / distributed-merge mode is adopted (`001` iter-23 single-tenant refutation)?
- For C5-A: which canonical-identity fields enter `serializationId` so render order is stable cross-DB without colliding with the C5-B comparator tiebreak (the render tiebreak and the fusion tiebreak must stay separate, per `001` iter-31 H31-04)?
<!-- /ANCHOR:questions -->

---

## 13. CANDIDATE STATUS

| # | Candidate | Status | Commit | Gate / Notes |
|---|-----------|--------|--------|--------------|
| 1 | two-content-id-primitives | **DONE** | `18c8582e33` | Centralized into `lib/content-id.ts` (`hashContentBody` + `hashCanonicalJson`), byte-identical proven by parity test, no behavior change (`030` §14 cand 7) |
| 2 | ANN-tie-stable-order | **DONE** | `bec0eed27f` | `, m.id ASC` (COALESCE) on the 4 ranked ANN `ORDER BY distance`, LIMIT-survival into fusion now run-stable (`030` §14 cand 3) |
| 3 | C5-B | **DONE** | `bec0eed27f` | `content_hash`-asc tiebreak in deterministic comparator + all 5 RRF output sorts, primary order unchanged (verified), a reorder-of-ties for content-derived *stability*, not a stabilization (`030` §14 cand 4) |
| 4 | C-X1 (`'active'`) | **DONE** | `65cfcea513` | `bonusOverChannels` param defaults to `'active'` (byte-identical traced arithmetically), opus SHIP (`030` §14 cand 5) |
| 5 | C6-A | **DONE** | `65cfcea513` | Rank-time decay clock vs caller `nowMs`, restored no-timestamp skip guard so it is a pure refactor, reinforcement stays a separate event (`030` §14 cand 5) |
| 6 | C-X1-true-multichannel (`'configured'`) | **PENDING** | - | **Gate: shared-infra-dep**, built only alongside the Wave-1 C2-B per-class weight consumer, conditioned on the still-open fusion-bonus unit test, default stays `'active'` (`roadmap.md` Sequencing Notes, `001` iter-7 #10/#13/#31 H31-02 confirms C-X1 is from-scratch, aionforge has no bonus term, agreement is emergent) |
| 7 | C5-A | **PENDING** | - | **Gate: render-build**, content-derived serialization-order render stage (`serializationId = sha256(canonical fields)`), fuller aionforge-parity successor to the shipped C5-B stopgap, golden-file rebaseline once, render tiebreak separate from fusion tiebreak (`001` iter-3 C5-A, iter-31 H31-04) |
| 8 | M-dual-class-identity | **PENDING** | - | **Gate: multi-writer (single-tenant-refuted)**, iter-14 PROMOTE → iter-23 PARTIAL/NO-GO: the capture-vs-content distinction already exists informally (autoincrement id + contentHash dedup), formalizing pays off only for distributed/multi-writer merge. Documented, not built |
| 9 | M-clock-skew-replay-window | **PENDING** | - | **Gate: multi-writer (single-tenant-refuted)**, iter-14 BUILD → iter-23 REFUTED/NO-GO: anti-replay clock-skew is a network/multi-writer threat, local writes have no adversarial replay + receipts already dedup. Documented, not built |

**Foundation status: 5 DONE (committed in Wave-0 / packet 030), 4 PENDING (gated).** The two cross-subsystem keystones, the shared total-comparator (via C5-B's content-derived tiebreak) and the two content-id primitives, are DONE. The byte-identical-by-default fusion seams (C-X1 `'active'`, C6-A) are DONE. The residue is the fuller-parity render stage (C5-A), the per-class `'configured'` bonus mode and the single-tenant-refuted identity-hardening pair.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Source research**: `../research/research.md`, `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md` + `03-corrections-caveats-and-residuals.md`
- **Per-candidate detail**: `../research/iterations/iteration-003.md` (C5-A/B, C9), `iteration-007.md` (sequencing), `iteration-014.md` + `iteration-023.md` (dual-class / clock-skew), `iteration-031.md` (C-X1 from-scratch confirmation)
