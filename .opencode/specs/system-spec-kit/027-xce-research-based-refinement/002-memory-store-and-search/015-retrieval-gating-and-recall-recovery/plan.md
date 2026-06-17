---
title: "Implementation Plan: Retrieval Gating and Recall Recovery [template:level_3/plan.md]"
description: "Recalibrate the retrieval confidence and request-quality gate to read absolute cosine relevance instead of the RRF fusion magnitude, and include archived/cold tiers in retrieval by default, then defer the vector-lane rebuild and index repair."
trigger_phrases:
  - "retrieval gating plan"
  - "absolute relevance calibration"
  - "request quality gate"
  - "include archived default"
  - "cold tier retrieval"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/015-retrieval-gating-and-recall-recovery"
    last_updated_at: "2026-06-16T18:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Reconciled plan: cold-tier inclusion by default; rerank rejected"
    next_safe_action: "Land vector-lane cold inclusion with the deferred index rebuild"
    blockers: []
    key_files:
      - "mcp_server/lib/search/pipeline/types.ts"
      - "mcp_server/lib/search/confidence-scoring.ts"
      - "mcp_server/lib/search/sqlite-fts.ts"
      - "mcp_server/lib/search/hybrid-search.ts"
    session_dedup:
      fingerprint: "sha256:2222222222222222222222222222222222222222222222222222222222222222"
      session_id: "plan-015-retrieval-gating-and-recall-recovery"
      parent_session_id: null
    completion_pct: 65
    open_questions:
      - "Vector-lane cold inclusion needs the projection rebuilt."
    answered_questions:
      - "Calibrate off cosine, not RRF magnitude."
      - "Include archived/cold tiers by default; no reranker."
---
# Implementation Plan: Retrieval Gating and Recall Recovery

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js (spec-memory MCP daemon) |
| **Framework** | Internal hybrid search pipeline (`mcp_server/lib/search`) |
| **Storage** | SQLite main DB + vector store (cosine similarity), RRF/RSF fusion |
| **Testing** | Vitest (`mcp_server/tests`), `npm run typecheck` |

### Overview
The retrieval confidence and request-quality gate currently reads the RRF fusion score (magnitude ~0.01-0.05) against cosine-calibrated thresholds (HIGH 0.7 / LOW 0.4), so `requestQuality: "good"` is unreachable and every hybrid query collapses to weak/do_not_cite. The fix adds `resolveAbsoluteRelevance()` that prefers cosine similarity (0-1) over the RRF magnitude, feeds that into the confidence `scorePrior` and `assessRequestQuality` topScore (margins keep the ordering score), and updates the response digest and per-result "why" to the same scale. Ordering is untouched. It also includes archived/cold (deprecated-tier) memories in the query-time channels by default (FSRS retrievability ranks them lower). The work is sequenced as Tier B (calibration + cold-tier inclusion, shipped) then Tier C (presentation shipped; no reranker per directive) then Tier A (index repair + vector-lane projection rebuild, deferred).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (live daemon, pipeline stages, presentation contract)

### Definition of Done
- [x] Calibration acceptance criteria met (good/cite on strong cosine matches)
- [x] Ordering unchanged, proven by test
- [x] `npm run typecheck` clean; new and existing confidence/recovery tests green
- [ ] Deferred items (vector-lane cold inclusion, index repair) carry explicit acceptance and are marked NOT done
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pipeline stages with a flag-gated scoring shim. Calibration is a read-side resolver layered over already-computed scores; it never re-scores or re-orders.

### Key Components
- **`resolveAbsoluteRelevance()`** (`pipeline/types.ts`): prefers cosine similarity (0-1) over RRF magnitude; lexical-only hits fall back to the effective score.
- **`confidence-scoring.ts`**: uses absolute relevance for the confidence `scorePrior` and for `assessRequestQuality` topScore; margins still use the ordering score.
- **`profile-formatters.ts`**: evidence digest "avg score" and per-result "why" read absolute relevance.
- **`search-flags.ts`**: `SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION` (default ON, graduated); `=false` reverts.
- **`search_presentation.txt`**: truncation-resilient render from `progressiveDisclosure` plus constitutional-row de-dup.

### Data Flow
Retrieval -> fusion (RRF/RSF, ordering preserved) -> `resolveEffectiveScore` (ordering, unchanged) -> `resolveAbsoluteRelevance` (new, confidence/quality/digest only) -> confidence-scoring -> response formatters -> citation/response policy. Downstream, `formatters/search-results.ts` derives `citationPolicy` (`deriveCitationPolicy`) and `responsePolicy` (`deriveResponsePolicy`) purely from `requestQuality.label === 'good'`, and `avgConfidence` for the recovery gate is the mean calibrated `confidence.value` - so raising calibration flips the citation policy and relaxes the recovery trigger together.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a bug fix touching public response policy and shared retrieval scoring, so the affected-surface inventory is required.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `pipeline/types.ts` `resolveEffectiveScore` | Owns result ordering off the RRF/RSF fusion score | unchanged | Ordering test; byte-diff shows no change to the function |
| `pipeline/types.ts` `resolveAbsoluteRelevance` | New: absolute cosine relevance for confidence/quality/digest | update (added) | Unit test prefers cosine over RRF; lexical fallback to effective score |
| `confidence-scoring.ts` | Confidence `scorePrior` + `assessRequestQuality` topScore | update | Test: good/cite on strong cosine; margins still use ordering score |
| `response/profile-formatters.ts` | Evidence digest + per-result "why" scale | update | Digest avg + why read absolute relevance |
| `formatters/search-results.ts` | Derives `citationPolicy`/`responsePolicy` from `requestQuality.label` | not a consumer change (reads the same field) | `deriveCitationPolicy` / `deriveResponsePolicy` flip on label `good` |
| `search-flags.ts` | Feature-flag registry | update | Flag present; `=false` reverts, proven by test |
| `sqlite-fts.ts` | Lexical FTS/BM25 deprecated-tier exclusion | update | Cold/deprecated included by default; `SPECKIT_INCLUDE_ARCHIVED_DEFAULT=false` reverts (test) |
| `hybrid-search.ts` | In-memory BM25 + trigger deprecated exclusion | update | Cold/deprecated included by default; flag-off reverts (test) |
| `vector-index-mutations.ts` / `lineage-state.ts` projection-population | Maintains one active row per logical key (5/4,847 deprecated in projection) | update (deferred) | Admit archived/cold rows + lightweight rebuild; no re-embed (2,676 already embedded); design + live verify |
| `pipeline/stage3-rerank.ts` | Hardcodes `rerankProvider:'none'` | unchanged | Reranker rejected per directive (ADR-003) |
| `search_presentation.txt` + `/memory:search` | Renders ranked results | update | Renders from `progressiveDisclosure` on truncation; constitutional de-dup |

Required inventories:
- Same-class producers: `rg -n 'resolveEffectiveScore|resolveAbsoluteRelevance|scorePrior' mcp_server/lib/search`.
- Consumers of changed symbols: `rg -n 'requestQuality|citationPolicy|responsePolicy|avgConfidence' mcp_server --glob '*.ts'`.
- Matrix axes: query length (short / long), match type (cosine / lexical-only), flag state (ON / OFF), truncation (on / off).
- Algorithm invariant: changing the confidence/quality/digest scale MUST NOT change `resolveEffectiveScore` ordering for any input.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Capture the gate-vs-reality baseline (on-topic query returns correct specs yet reads weak)
- [x] Confirm `resolveEffectiveScore` ordering is the surface to leave untouched
- [x] Add `SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION` flag (default ON, graduated)

### Phase 2: Core Implementation
- [x] Add `resolveAbsoluteRelevance()` in `pipeline/types.ts` (cosine over RRF; lexical fallback)
- [x] Wire absolute relevance into `confidence-scoring.ts` (`scorePrior`, `assessRequestQuality` topScore; margins keep ordering score)
- [x] Update `profile-formatters.ts` evidence digest + per-result "why"
- [x] Make `search_presentation.txt` truncation-resilient + constitutional de-dup (Tier C presentation)
- [x] Include cold/deprecated tiers by default in query-time channels (`sqlite-fts.ts`, `hybrid-search.ts`) behind `SPECKIT_INCLUDE_ARCHIVED_DEFAULT`
- [ ] Vector-lane cold inclusion: redefine `active_memory_projection` + rebuild (deferred with reindex)

### Phase 3: Verification
- [x] New `absolute-relevance-calibration.vitest.ts` (6 tests) passes
- [x] Existing confidence/recovery suites pass (129 tests, no regression)
- [x] `npm run typecheck` clean
- [x] Update `hybrid-search.vitest.ts` BM25 deprecated tests to the new contract; full hybrid suite green (104)
- [ ] Live re-run of the original queries after the daemon reconnects and after index repair (deferred)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `resolveAbsoluteRelevance`, confidence/quality calibration, revert path | Vitest |
| Integration | Confidence + recovery suites (no regression) | Vitest |
| Type | Whole `mcp_server` package | `npm run typecheck` |
| Manual (deferred) | Live re-run of original weak queries after Tier B/A | `/memory:search` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| spec-memory daemon | Internal | Green | Calibration cannot ship live |
| Hybrid search pipeline (`stage2-fusion`) | Internal | Green | No place to read cosine relevance |
| `/memory:search` presentation contract | Internal | Green | Truncation/de-dup fix cannot render |
| FSRS retrievability ranking | Internal | Green | Down-ranks cold rows so inclusion does not flood |
| `active_memory_projection` population + rebuild | Internal | Yellow (needs live verify, no re-embed) | Vector lane keeps excluding cold rows until the projection admits them |
| Local ollama re-embedding | Internal | Yellow (operator mobile) | Index repair + projection rebuild deferred until operator home |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Calibration shifts ordering, masks a true miss, or destabilizes the daemon.
- **Procedure**: Set `SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION=false` to revert to prior weak/do_not_cite behavior (test-proven); no residual state. Staged items default OFF, so reverting them is a no-op until explicitly enabled.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Tier B (calibration + cold-tier inclusion) ──► Tier C (presentation) ──► Tier A (index repair + projection rebuild, deferred)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Tier B calibration | Baseline captured | Tier C, acceptance probe |
| Tier B cold-tier inclusion (query-time) | FSRS ranking | Vector-lane inclusion (deferred) |
| Tier C presentation | Tier B | Result-visibility acceptance |
| Tier A index repair + projection rebuild (deferred) | Operator home + confirm | Vector-lane cold inclusion, recall-delta acceptance |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Tier B calibration | Med | Done this session |
| Tier B cold-tier inclusion (query-time) | Med | Done this session |
| Tier C presentation | Low | Done this session |
| Vector-lane cold inclusion | Med | Deferred (needs projection rebuild) |
| Tier A index repair | Med | Deferred (CPU-heavy, operator home only) |
| **Total** | | **Core shipped; remainder staged/deferred** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Calibration is flag-gated (default ON, graduated)
- [x] Revert path proven by test (`=false`)
- [x] Ordering left untouched

### Rollback Procedure
1. Set `SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION=false`.
2. No redeploy needed; the flag is read at scoring time.
3. Smoke test: re-run a known query and confirm prior weak/do_not_cite behavior.
4. No stakeholder notification required (read-only scoring change).

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A - calibration reads existing fields; no data written.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│  Tier B Calibration  │────►│  Tier C Presentation │────►│  Tier A Index Repair │
│  + Cold Inclusion    │     │  (shipped)           │     │  + Projection Rebuild│
│  (shipped)           │     │                      │     │  (deferred)          │
└──────────┬───────────┘     └──────────────────────┘     └──────────────────────┘
           │
     ┌─────▼──────────────┐
     │ resolveAbsolute    │
     │ Relevance (new)    │
     └────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| `resolveAbsoluteRelevance` | cosine + RRF fields | absolute relevance | confidence-scoring, formatters |
| `confidence-scoring` | absolute relevance | confidence + requestQuality | citation/response policy |
| `profile-formatters` | absolute relevance | digest + why | presentation |
| `search-results` derivers | requestQuality.label | citationPolicy, responsePolicy | none (read-only) |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Add `resolveAbsoluteRelevance`** - done - CRITICAL
2. **Wire confidence/quality off absolute relevance** - done - CRITICAL
3. **Flag-gate + revert test** - done - CRITICAL
4. **Truncation-resilient presentation** - done - CRITICAL (visibility)

**Total Critical Path**: Core calibration shipped this session.

**Parallel Opportunities**:
- Vector-lane cold inclusion rides with the index repair (both need the projection rebuilt).
- Index repair (Tier A) is decoupled from the shipped query-time work and deferred.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Calibration shipped | good/cite on strong cosine; ordering unchanged | Done |
| M2 | Presentation resilient | Renders from progressiveDisclosure; constitutional de-dup | Done |
| M3 | Cold tiers included (query-time) | Deprecated rows in lexical/trigger by default; flag reverts | Done |
| M4 | Vector-lane cold inclusion (option A) | Backfill + query-filter behind opt-in flag; unit-tested | Done (code); live activation pending |
| M5 | Index repaired | failedVectors -> 0; vecRowsTotal == rowsTotal | Deferred |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Calibrate off absolute cosine relevance, not RRF magnitude

**Status**: Accepted

**Context**: The gate read the RRF fusion magnitude (~0.01-0.05) against cosine-calibrated thresholds (HIGH 0.7 / LOW 0.4), so `good` was unreachable.

**Decision**: Add `resolveAbsoluteRelevance()` that prefers cosine similarity (0-1), feed it into confidence and request-quality, and leave ordering on the effective fusion score.

**Consequences**:
- On-topic strong matches now read good/cite.
- Ordering is unchanged; only the confidence/quality/digest scale moves.

**Alternatives Rejected**:
- Re-tuning thresholds to RRF magnitude: brittle, corpus-dependent, and still conflates rank-fusion with relevance.

See `decision-record.md` for the full ADR set.

---

<!--
LEVEL 3 PLAN
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
