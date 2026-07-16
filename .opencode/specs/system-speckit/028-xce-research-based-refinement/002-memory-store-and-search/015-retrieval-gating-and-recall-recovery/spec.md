---
title: "Feature Specification: Retrieval Gating and Recall Recovery"
description: "On-topic memory searches report requestQuality:weak and do_not_cite_results because the request-quality gate reads the RRF fusion score against cosine-calibrated thresholds, making good structurally unreachable."
trigger_phrases:
  - "retrieval gating"
  - "recall recovery"
  - "request quality weak"
  - "absolute relevance calibration"
  - "do not cite"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/015-retrieval-gating-and-recall-recovery"
    last_updated_at: "2026-06-16T18:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Reframed archived to include-by-default; removed rerank from scope"
    next_safe_action: "Land vector-lane cold inclusion with the deferred index rebuild"
    blockers: []
    key_files:
      - "mcp_server/lib/search/pipeline/types.ts"
      - "mcp_server/lib/search/confidence-scoring.ts"
      - "mcp_server/lib/search/search-flags.ts"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "spec-015-retrieval-gating-and-recall-recovery"
      parent_session_id: null
    completion_pct: 40
    open_questions:
      - "Vector-lane cold inclusion: redefine active_memory_projection then rebuild."
    answered_questions:
      - "Include archived/cold tiers by default for all users; FSRS ranks them."
      - "Do not add a reranker."
---
# Feature Specification: Retrieval Gating and Recall Recovery

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

On-topic memory searches report `requestQuality: weak` and `do_not_cite_results` and appear to return almost nothing, even when the relevant specs are indexed and findable. The dominant cause is a calibration mismatch: the request-quality gate reads the RRF fusion score (magnitude ~0.01-0.05) as if it were an absolute 0-1 relevance, but its HIGH 0.7 / LOW 0.4 thresholds are calibrated for a cosine scale. As a result, `requestQuality: "good"` is structurally unreachable and every hybrid query collapses to weak/gap, forcing a conservative citation and response policy. This packet recalibrates the gate to read an absolute cosine relevance while leaving result ordering untouched, includes archived/cold (deprecated-tier) memories in retrieval by default for everyone (FSRS retrievability ranks them lower), and makes the result presentation truncation-resilient.

**Key Decisions**: Calibrate confidence and request-quality off absolute cosine relevance, not the RRF magnitude (ADR-001); include archived/cold tiers in retrieval by default for all users, letting the FSRS temperature model rank them instead of hard-excluding (ADR-002); do not add a reranker (ADR-003).

**Critical Dependencies**: Live spec-memory daemon (`mcp_server`), the existing hybrid search pipeline (`stage2-fusion`), and the `/memory:search` presentation contract.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-06-16 |
| **Branch** | `system-speckit/028-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 15 |
| **Predecessor** | 014-idempotency-flag-on-correctness |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On-topic memory searches return `requestQuality: weak`, `citationPolicy: do_not_cite_results`, and a "Retrieval quality is weak" response policy even when the exactly-right specs are indexed and surfaced. The request-quality and confidence gates read the RRF fusion score (a relative rank-fusion magnitude that lands around 0.01-0.05) against thresholds that assume an absolute 0-1 cosine scale (HIGH 0.7 / LOW 0.4), so `good` can never be reached. This was proven empirically: a query that returned the correct hybrid-RAG specs was still labeled weak. Four secondary problems make searches look emptier than they are: archived and deprecated corpus is hard-excluded, cross-encoder reranking is removed, index health is degraded, and a token-budget truncation plus constitutional auto-surface noise hides the real hits.

### Purpose
On-topic memory searches that return strong cosine matches report `requestQuality: "good"` and `cite_results`, without changing which results rank first.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Recalibrate the confidence and request-quality gate to read an absolute cosine relevance (0-1) instead of the RRF fusion magnitude, behind a default-ON graduated flag.
- Make the per-result "why" and evidence-digest "avg score" report the same absolute relevance scale the gate reads.
- Include archived/cold (deprecated-tier) rows in the query-time channels (lexical FTS/BM25, trigger) by default for all users, behind a default-ON graduated flag; FSRS retrievability ranks them lower.
- Make `/memory:search` presentation truncation-resilient and de-duplicate constitutional auto-surface rows out of the ranked list.
- Defer vector-lane cold inclusion (redefine `active_memory_projection` + rebuild) to the index repair.
- Repair degraded index health (failed vectors, missing vectors, un-enriched rows) as a deferred operational task.

### Out of Scope
- Changing the RRF/RSF fusion ordering - ordering stays driven by the effective fusion score; this packet only changes the confidence/quality/digest scale.
- The post-hoc intent-weighting stage (`intentWeightsApplied: off`) - by design for hybrid search to avoid double-counting; not a bug.
- Adding or restoring a reranker - rejected per operator directive (ADR-003); `stage3-rerank.ts` stays as-is.
- Maintenance/consolidation deprecated filters (entity catalog, interference scoring) - those are data-integrity paths, not retrieval ranking; left untouched.
- General `/memory:search` UX redesign beyond truncation resilience and constitutional de-dup.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/pipeline/types.ts` | Modify | Add `resolveAbsoluteRelevance()` preferring cosine over RRF magnitude |
| `mcp_server/lib/search/confidence-scoring.ts` | Modify | Use absolute relevance for confidence `scorePrior` and `assessRequestQuality` topScore |
| `mcp_server/lib/response/profile-formatters.ts` | Modify | Evidence digest and per-result "why" use absolute relevance |
| `mcp_server/lib/search/search-flags.ts` | Modify | Add `SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION` (default ON, graduated) |
| `mcp_server/tests/absolute-relevance-calibration.vitest.ts` | Create | 6 tests covering calibration and revert path |
| `.opencode/commands/memory/assets/search_presentation.txt` | Modify | Truncation-resilient rendering plus constitutional-row de-dup |
| `mcp_server/lib/search/sqlite-fts.ts` | Modify | Include cold/deprecated tier by default (gated by `SPECKIT_INCLUDE_ARCHIVED_DEFAULT`) |
| `mcp_server/lib/search/hybrid-search.ts` | Modify | Include cold/deprecated tier in in-memory BM25 + trigger channels |
| `mcp_server/lib/search/vector-index-mutations.ts` / `lib/storage/lineage-state.ts` | Modify | Admit archived/cold rows into `active_memory_projection` + lightweight rebuild (deferred; no re-embed) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Gate reads absolute cosine relevance | `resolveAbsoluteRelevance()` prefers cosine similarity (0-1) over RRF magnitude; lexical-only hits fall back to the effective score |
| REQ-002 | Confidence and request-quality use absolute relevance | `confidence-scoring.ts` feeds absolute relevance into `scorePrior` and `assessRequestQuality` topScore; margins still use the ordering score |
| REQ-003 | Ordering is unchanged | `resolveEffectiveScore` ordering is byte-for-byte unchanged; RRF still drives result order |
| REQ-004 | Calibration is flag-gated and revertible | `SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION=false` reverts to prior weak/do_not_cite behavior; proven by test |
| REQ-005 | No regression in confidence/recovery suites | New 6-test suite passes; existing 129 confidence/recovery tests pass; `npm run typecheck` clean |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Presentation is truncation-resilient | When `meta.tokenBudgetTruncated` is set, `/memory:search` renders from `progressiveDisclosure`; constitutional rows are de-duplicated |
| REQ-007 | Cold/archived tiers included by default in query-time channels | `SPECKIT_INCLUDE_ARCHIVED_DEFAULT` (default ON) stops the deprecated-tier exclusion in lexical FTS/BM25 and trigger channels; constitutional stays on its injected path; `=false` reverts (test-proven) |
| REQ-008 | Vector-lane cold inclusion (option A, implemented behind opt-in flag) | `backfillColdOrphanProjection()` admits archived rows with no active winner into `active_memory_projection` (UNIQUE invariant preserved, idempotent) + vector query filter relaxed under `SPECKIT_INCLUDE_ARCHIVED_VECTOR` (default OFF); unit-tested; live activation = set flag + restart + spot-check |
| REQ-009 | Index repair (staged, deferred) | `memory_embedding_reconcile`, `memory_index_scan({force:true})`, and `code_graph_scan` run only when the operator is home and confirms |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A short on-topic query that returns strong cosine matches yields `requestQuality: "good"` and `citationPolicy: "cite_results"`, where it previously returned weak/do_not_cite.
- **SC-002**: Result ordering is identical before and after calibration; only the confidence, quality, and digest scales change.
- **SC-003**: Setting `SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION=false` restores the prior behavior, verified by an automated test.
- **SC-004**: `npm run typecheck` is clean and the new plus existing confidence/recovery test suites are green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Live spec-memory daemon | Calibration ships into a running daemon | Flag-gate (default ON, graduated); revert via env flag |
| Dependency | Hybrid search pipeline stages | Calibration must not shift ordering | Keep `resolveEffectiveScore` untouched; only confidence/quality/digest read absolute relevance |
| Risk | Cold rows crowd hot results | 4,847 deprecated docs enter the candidate pool | FSRS retrievability down-ranks deprecated (0.25x decay); revert via `SPECKIT_INCLUDE_ARCHIVED_DEFAULT=false` |
| Risk | Channels diverge (vector still excludes) | Cold rows surface in lexical/trigger but not vector until projection rebuild | Track vector-lane inclusion as a task; lands with the reindex |
| Risk | Index repair spikes CPU | Local ollama re-embedding overloads the operator's machine | Defer Tier A until operator is home and confirms |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Calibration adds no measurable per-query latency; `resolveAbsoluteRelevance()` reads already-computed fields, no extra scoring pass.

### Security
- **NFR-S01**: Constitutional rows must stay on their own injected path and out of the ranked retrieval channels even when cold/deprecated tiers are included.

### Reliability
- **NFR-R01**: Disabling the calibration flag returns the daemon to its exact prior behavior with no residual state.

---

## 8. EDGE CASES

### Data Boundaries
- Lexical-only hit with no cosine similarity: `resolveAbsoluteRelevance()` falls back to the effective score so the gate still has a value to read.
- Token-budget truncation `5 -> 1`: presentation renders from `progressiveDisclosure` so all materialized results show, not just the first.

### Error Scenarios
- Degraded index (failed/missing vectors): calibration improves the gate verdict but does not invent recall; Tier A repair is the recall fix and is deferred.
- Constitutional auto-surface noise: de-dup removes repeated constitutional rows so real hits are not crowded out.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 9, multi-surface (pipeline, scoring, response, presentation) |
| Risk | 22/25 | Live daemon, public response policy, archived corpus, breaking-ordering risk |
| Research | 12/20 | Root-cause diagnosis complete; channel-by-channel exclusion mapping done |
| Multi-Agent | 6/15 | Single workstream, sequenced tiers |
| Coordination | 8/15 | Tier A deferred on operator availability |
| **Total** | **70/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Calibration shifts result ordering | H | L | Keep `resolveEffectiveScore` untouched; ordering test |
| R-002 | Cold rows crowd hot results | M | L | FSRS down-ranks deprecated (0.25x); revert via flag |
| R-003 | Lexical/trigger include cold but vector still excludes | M | M | Vector-lane inclusion tracked; lands with reindex |
| R-004 | Index repair spikes operator CPU | M | H | Defer until operator home and confirms |
| R-005 | Calibration masks a true recall miss | M | L | Tier A repair plus live re-run as separate acceptance |

---

## 11. USER STORIES

### US-001: Trustworthy on-topic search (Priority: P0)

**As an** operator running `/memory:search` on a topic I know is covered, **I want** strong matches to report good quality and be citable, **so that** I can trust and cite the results instead of seeing a blanket weak verdict.

**Acceptance Criteria**:
1. Given a short on-topic query with strong cosine matches, When I run the search, Then `requestQuality` is `good` and `citationPolicy` is `cite_results`.
2. Given the same query before and after calibration, When I compare result order, Then the order is unchanged.
3. Given `SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION=false`, When I run the query, Then the prior weak/do_not_cite behavior returns.

### US-002: Reaching archived hybrid-RAG epics (Priority: P1)

**As an** operator researching hybrid-RAG history, **I want** archived and cold memories included in search by default, **so that** the z_archive 022/023 epics surface in the ranked list without me asking, ranked below hot memories.

**Acceptance Criteria**:
1. Given a normal query, When it runs against the lexical/trigger channels, Then cold/deprecated rows are included and ranked by FSRS retrievability below hot rows.
2. Given `SPECKIT_INCLUDE_ARCHIVED_DEFAULT=false`, When I run the same query, Then cold/deprecated rows are excluded (legacy behavior).
3. Given the vector lane, When the projection rebuild has not yet run, Then cold rows surface via lexical/trigger but not yet the semantic channel (tracked, deferred).

### US-003: Seeing all materialized results (Priority: P1)

**As an** operator, **I want** `/memory:search` to render all materialized results even under a tight token budget, **so that** a truncated render does not make a populated search look empty.

**Acceptance Criteria**:
1. Given `meta.tokenBudgetTruncated` is set, When the command renders, Then it reads `progressiveDisclosure` and shows all materialized results.
2. Given constitutional auto-surface rows, When the command renders, Then duplicate constitutional rows are removed from the ranked list.

---

## 12. OPEN QUESTIONS

- Vector-lane cold inclusion design: **RESOLVED — option A** (admit only archived rows whose logical key has no active winner; no superseded dedup-losers). Implemented behind opt-in `SPECKIT_INCLUDE_ARCHIVED_VECTOR` (default OFF), unit-tested. **OPEN: one live activation + spot-check on the running daemon (logical-key match against real data, no duplicate explosion); independent of the reindex.**
- Should constitutional-tier rows ever be reachable in the ranked channels, or always injected-only? **RESOLVED: injected-only; cold-tier inclusion does not change constitutional handling.**
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
