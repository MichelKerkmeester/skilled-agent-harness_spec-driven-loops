---
title: "Decision Record: Retrieval Gating and Recall Recovery"
description: "Architecture decisions for recalibrating the retrieval request-quality gate to read absolute cosine relevance, including archived/cold tiers in retrieval by default, and declining a reranker."
trigger_phrases:
  - "retrieval gating decision record"
  - "absolute relevance calibration adr"
  - "deprecated tier exclusion"
  - "rerank provider decision"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/015-retrieval-gating-and-recall-recovery"
    last_updated_at: "2026-06-16T18:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Revised ADR-002 to include cold tiers by default; ADR-003 rejected (no rerank)"
    next_safe_action: "Land vector-lane cold inclusion with the deferred index rebuild"
    blockers: []
    key_files: ["spec.md", "decision-record.md"]
    completion_pct: 60
---
# Decision Record: Retrieval Gating and Recall Recovery

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Calibrate the request-quality gate off absolute cosine relevance, not the RRF fusion magnitude

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-16 |
| **Deciders** | Operator, implementation seat |

---

<!-- ANCHOR:adr-001-context -->
### Context

The retrieval confidence and request-quality gate read the RRF fusion score, a relative rank-fusion magnitude that lands around 0.01-0.05, and compared it against thresholds calibrated for a cosine relevance scale (HIGH 0.7 / LOW 0.4). With those numbers, `requestQuality: "good"` was structurally unreachable, so every hybrid query collapsed to weak or gap, which forced `citationPolicy: do_not_cite_results` and a "Retrieval quality is weak" response policy. We proved it empirically: a query that returned exactly the right hybrid-RAG specs was still labeled weak.

### Constraints

- The fix ships into a live spec-memory daemon, so it must be revertible without a redeploy.
- Result ordering must not change; the bug is the gate's scale, not the ranking.
- Lexical-only hits have no cosine similarity and still need a value the gate can read.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Read an absolute cosine relevance (0-1) for the confidence and request-quality gate instead of the RRF fusion magnitude.

**How it works**: `resolveAbsoluteRelevance()` in `pipeline/types.ts` prefers cosine similarity over the RRF magnitude and falls back to the effective score for lexical-only hits. `confidence-scoring.ts` feeds that into the confidence `scorePrior` and the `assessRequestQuality` topScore, while margins keep using the ordering score. `resolveEffectiveScore` ordering is untouched, and the whole change sits behind `SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION` (default ON, graduated).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Absolute cosine relevance (chosen)** | Reads a true 0-1 relevance; ordering untouched; revertible | Adds a small read-side resolver | 9/10 |
| Re-tune thresholds to the RRF magnitude | No new resolver | Brittle, corpus-dependent; still conflates rank-fusion with relevance | 4/10 |
| Drop the gate entirely | Removes the false-weak verdict | Loses the genuine low-signal guardrail | 3/10 |

**Why this one**: Reading the real relevance scale fixes the root cause once and keeps the gate's useful low-signal guardrail, instead of papering over a scale mismatch with corpus-specific threshold tuning.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- On-topic strong matches read `good` and `cite_results` instead of weak/do_not_cite.
- The confidence value, request-quality label, and evidence digest now agree on one scale.

**What it costs**:
- One more read-side resolver in the pipeline. Mitigation: it reads already-computed fields, no extra scoring pass.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Calibration shifts result ordering | H | Keep `resolveEffectiveScore` untouched; ordering test |
| Calibration masks a true recall miss | M | Tier A index repair plus live re-run as separate acceptance |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Every hybrid query falsely read weak; proven empirically |
| 2 | **Beyond Local Maxima?** | PASS | Threshold re-tuning and gate removal considered and rejected |
| 3 | **Sufficient?** | PASS | A read-side resolver fixes the scale without touching ordering |
| 4 | **Fits Goal?** | PASS | Directly restores trustworthy on-topic search |
| 5 | **Open Horizons?** | PASS | Cosine relevance is the durable scale; staged tiers build on it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `pipeline/types.ts`: add `resolveAbsoluteRelevance()`; leave `resolveEffectiveScore` unchanged.
- `confidence-scoring.ts`: confidence `scorePrior` and `assessRequestQuality` topScore read absolute relevance.
- `profile-formatters.ts`: evidence digest and per-result "why" read absolute relevance.
- `search-flags.ts`: add `SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION` (default ON, graduated).

**How to roll back**: Set `SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION=false`. The flag is read at scoring time, so no redeploy is needed and no state is left behind.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Include archived/cold (deprecated-tier) memories in retrieval by default for everyone

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-16 |
| **Deciders** | Operator, implementation seat |

---

### Context

The relevant 022/023 hybrid-RAG epics live under `z_archive/`, and roughly 4,847 of 17,287 indexed docs are `tier=deprecated` and hard-filtered in every retrieval channel. The codebase itself classifies that exclusion as `silent-risk`. The operator directed that archived memories be reachable for all users, not behind an opt-in: the system already runs an FSRS temperature model that makes memories hot or cold, and `fsrs-scheduler.ts` decays deprecated at 0.25x (the coldest, fastest-decaying tier). With retrievability already down-ranking cold rows, a hard exclusion is redundant and hides legitimately-cold-but-relevant history.

### Decision

**We chose**: Include cold/deprecated-tier rows in retrieval by default for all users; let FSRS retrievability rank them below hot memories instead of walling them off.

**How it works**: A new graduated flag `SPECKIT_INCLUDE_ARCHIVED_DEFAULT` (default ON) gates the deprecated-tier exclusion in the query-time channels — lexical FTS/BM25 (`sqlite-fts.ts`), in-memory BM25 and trigger (`hybrid-search.ts`). When on (default), those channels stop excluding deprecated rows. Constitutional rows keep their own injected path and stay out of the ranked channels.

The vector (semantic) lane is the deferred remainder. It does not filter deprecated at query time — every vector query joins the materialized `active_memory_projection`, which holds exactly one active row per logical content key (`active_memory_id UNIQUE`) and is maintained incrementally in `vector-index-mutations.ts` / `lineage-state.ts`. Empirically only 5 of 4,847 deprecated rows are in the projection, so the join — not the query-time predicate at `vector-index-queries.ts:424` — is what excludes cold content. Flipping that predicate alone is inert.

Including cold rows in the vector lane is therefore a projection/dedup-model change, NOT a re-embedding problem: 2,676 of the deprecated rows already carry `embedding_status='success'`, so no ollama re-embed is needed — only a projection-population change plus a lightweight SQL rebuild. It is deferred because it carries a real design decision (whether superseded dedup-losers should surface in the semantic lane, or only archived rows whose logical key has no active winner) and a UNIQUE-invariant risk that needs live verification on the running daemon.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Include cold tiers by default, FSRS ranks them (chosen)** | Matches the hot/cold model; archived reachable for all; reversible by flag | Vector lane needs a projection rebuild to follow | 9/10 |
| Honored opt-in only | Default unchanged | Operator explicitly rejected an opt-in; archived stays hidden for normal use | 3/10 |
| Keep the hard exclusion | No work | Hides the very specs the operator searches for | 2/10 |

**Why this one**: The temperature system is the right place to rank cold memories; a hard tier wall duplicates and overrides it. Including cold rows and letting retrievability order them is what the operator asked for and what the architecture already supports.

### Consequences

**What improves**:
- Archived/cold history (z_archive 022/023, deprecated tier) is reachable in the ranked lexical and trigger channels for all users.

**What it costs**:
- Larger candidate pools per query. Mitigation: FSRS retrievability and importance weighting keep cold rows below hot ones; the flag reverts instantly.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cold rows crowd hot results | M | FSRS down-ranks deprecated (0.25x decay); revert via `SPECKIT_INCLUDE_ARCHIVED_DEFAULT=false` |
| Channels diverge (vector still excludes) | M | Vector-lane inclusion tracked as a task; lands with the projection rebuild / reindex |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Operator directive; archived epics otherwise unreachable for normal queries |
| 2 | **Beyond Local Maxima?** | PASS | Opt-in and keep-exclusion both considered and rejected |
| 3 | **Sufficient?** | PASS | Query-time channels include cold rows; vector follows with the rebuild |
| 4 | **Fits Goal?** | PASS | Restores recall of the cold history the operator searches for |
| 5 | **Open Horizons?** | PASS | FSRS ranking remains the single lever for hot/cold ordering |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- `search-flags.ts`: add `SPECKIT_INCLUDE_ARCHIVED_DEFAULT` (default ON, graduated).
- `sqlite-fts.ts`: gate the deprecated-tier filter on the flag (lexical FTS/BM25).
- `hybrid-search.ts`: gate the in-memory BM25 and trigger deprecated filters on the flag.
- Vector lane (option A, implemented behind opt-in `SPECKIT_INCLUDE_ARCHIVED_VECTOR`, default OFF): `backfillColdOrphanProjection()` in `lineage-state.ts` admits archived/cold rows whose logical key has no active winner into `active_memory_projection` (via `buildLogicalKey` — a SQL key expression would not match the stored format; idempotent; preserves the UNIQUE invariant), the vector query filter in `vector-index-queries.ts` is relaxed under the flag, and the backfill is wired best-effort into daemon boot (`context-server.ts`). Unit-tested. Stays opt-in (not default-ON) because the live projection mutation needs one confirmation on the running daemon; no re-embed (2,676 rows already embedded).

**How to roll back**: Set `SPECKIT_INCLUDE_ARCHIVED_DEFAULT=false` to restore the hard exclusion in the query-time channels. No state is left behind.

---

## ADR-003: Do not add a reranker

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Rejected |
| **Date** | 2026-06-16 |
| **Deciders** | Operator, implementation seat |

---

### Context

`pipeline/stage3-rerank.ts` hardcodes `rerankProvider:'none'`; the cross-encoder sidecar was deprecated with no replacement, so Stage 3 does only MMR diversity and chunk-collapse. An earlier proposal was to restore a reranker behind a default-OFF flag.

### Decision

**We chose**: Do not add or restore a reranker. The operator directed against it. The weak-result symptom is fully explained by the gate calibration (ADR-001) and corpus exclusion (ADR-002); a reranker is not needed to fix it and would add a provider dependency and latency for no required benefit here.

### Consequences

**What improves**:
- No new provider dependency, no added per-query latency, smaller surface to validate and maintain.

**What it costs**:
- Stage 3 keeps only MMR diversity. Accepted: ranking quality is carried by hybrid fusion plus the ADR-001 calibration, not a cross-encoder.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future need for finer ranking | L | Can be revisited as a separate decision if evidence shows fusion is insufficient |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Not necessary; calibration + corpus inclusion fix the reported symptom |
| 2 | **Beyond Local Maxima?** | PASS | Restore-behind-flag considered and declined per directive |
| 3 | **Sufficient?** | PASS | Fusion + calibration deliver the required quality |
| 4 | **Fits Goal?** | PASS | Keeps the fix focused and dependency-free |
| 5 | **Open Horizons?** | PASS | A reranker remains a future option if ever justified |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**: Nothing. `stage3-rerank.ts` stays as-is (MMR diversity + chunk-collapse, `rerankProvider:'none'`).

**How to roll back**: Not applicable — no change made.

---

<!--
Level 3 Decision Record: One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
