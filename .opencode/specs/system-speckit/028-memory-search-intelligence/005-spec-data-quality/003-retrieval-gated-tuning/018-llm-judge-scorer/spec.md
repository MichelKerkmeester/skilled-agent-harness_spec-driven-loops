---
title: "Feature Specification: C5 LLM-as-judge quality scorer [template:level_2/spec.md]"
description: "The qualityScore fusion multiplier ships and applies a plus-or-minus-10-percent band, but it is fed a form-only score that often falls back to a flat 0.5 default. A real semantic LLM-judge score is a better input to that same shipped band not a new lane, and its marginal value over the form-only scorer must be proven first."
trigger_phrases:
  - "llm judge quality scorer"
  - "c5 quality score multiplier"
  - "semantic quality score fusion"
  - "qualityscore better input"
  - "llm as judge memory quality"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "028-memory-search-intelligence/005-spec-data-quality/003-retrieval-gated-tuning/018-llm-judge-scorer"
    last_updated_at: "2026-07-04T17:11:51.250Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored buildable phase spec from research C5 verdict"
    next_safe_action: "Run generate-description and graph-metadata backfill, then plan.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: C5 LLM-as-judge quality scorer

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
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-06-21 |
| **Branch** | `018-llm-judge-scorer` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The retrieval fusion stage already applies a bounded quality multiplier over the composite score. `applyValidationSignalScoring` in `stage2-fusion.ts` reads `metadata.qualityScore`, clamps it to `[0,1]` and turns it into `qualityFactor = 0.9 + (quality * 0.2)`, a deliberate plus-or-minus-10-percent band (L272-288). The backing `quality_score` column has shipped since the V15 migration (`vector-index-schema.ts:643`). The weakness is the input, not the band. The score fed into the multiplier today is a form-only metric, and when it is absent the consumer falls back to a flat `0.5` (`stage2-fusion.ts:272-274`), so a structurally-clean but semantically-thin document and a genuinely useful one can land on the same multiplier. A real semantic judgment of document quality would be a strictly better input to a band that already exists, but its retrieval lift is capped by that same narrow band and stays a hypothesis until proven on this corpus.

### Purpose
Feed a real LLM-as-judge semantic quality score into the already-shipped `qualityScore` multiplier so a better input improves an existing band, and prove its marginal value over the form-only scorer before any default-on or any retrieval claim.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An LLM-as-judge scorer that produces a normalized `[0,1]` semantic quality score for a document, computed on the write path and persisted into the existing `quality_score` column (`vector-index-schema.ts:643`), never into a new column or a second quality DB.
- A form-only-versus-judge comparison harness that scores the same corpus sample both ways and reports the agreement and the divergence, so the marginal value of the judge over the existing form-only scorer is measured before promotion.
- Flag-gated routing so the fusion consumer keeps reading the form-only score by default, and only reads the judge score when an explicit default-off flag is set.
- The governance value path: surfacing the semantic score as a first-class quality signal for the sweep and doctor reports, which is honest on cost and does not depend on a retrieval win.

### Out of Scope
- A second or parallel quality scorer, a parallel quality column or a separate quality DB. The judge writes the existing `quality_score` column and feeds the existing multiplier. A parallel scorer risks divergent verdicts (research.md section 2, Tier D).
- Widening the plus-or-minus-10-percent band. The band is the shipped governance choice and stays fixed. C5 improves the input, not the bound.
- Promoting the judge score to the default fusion input. That promotion is retrieval-class and is gated on a prod-mode completeRecall@3 RISE through the C2 gate. See 015-prodmode-recall-gate.
- Any LLM auto-rewrite of the document body. The judge reads and scores only, it never mutates the authored body (the no-body-mutate rail).
- The re-embed and embedding-coverage guard. C5 changes a metadata multiplier input, not the embedding, so it does not require the C1 re-index, but its retrieval value is still unproven until C2 measures it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `<llm-judge scorer module>` | Create | Compute a normalized `[0,1]` semantic quality score for a document on the write path. Exact host module resolved in plan.md against the live save and indexing path that populates `quality_score` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` | Modify | Add flag-gated input routing in `applyValidationSignalScoring` so `qualityScore` reads the judge score when the flag is on, leaving the band, the `0.9 + (quality * 0.2)` mapping and the form-only default path unchanged when off (L272-288) |
| `<form-vs-judge comparison harness>` | Create | Score a corpus sample with both the form-only scorer and the judge, report agreement and divergence. Host directory resolved in plan.md against the existing eval harness layout |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | WHEN a document is indexed, the system SHALL compute an LLM-as-judge semantic quality score normalized to `[0,1]` and persist it into the existing `quality_score` column | A scored document's `quality_score` reflects the judge output, the value is clamped to `[0,1]` and no new quality column or quality DB is introduced |
| REQ-002 | The judge scorer SHALL read and score the document only and SHALL NOT mutate the authored body | The write path is non-destructive to the body, and a diff of an authored doc before and after scoring shows zero body change (the no-body-mutate rail) |
| REQ-003 | The fusion consumer SHALL keep reading the form-only score by default and SHALL read the judge score only behind an explicit default-off flag | Grep confirms the flag default is off, and with the flag off the fusion path is byte-identical to baseline including the `0.9 + (quality * 0.2)` band and the `0.5` form-only fallback value |
| REQ-004 | A form-only-versus-judge comparison SHALL be run on a corpus sample and SHALL report the judge's marginal value before any promotion | The harness emits per-document form-only and judge scores plus an agreement and divergence summary, and the report is the evidence a release reviewer reads before considering promotion |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The judge score SHALL feed the existing plus-or-minus-10-percent band unchanged, not a widened or new band | The fusion change touches only the input to `qualityFactor`, the `0.9 + (quality * 0.2)` mapping and `clampMultiplier` bound are untouched, and the multiplier range stays fixed at `[0.9, 1.1]` |
| REQ-006 | The governance value SHALL be deliverable independently of any retrieval promotion | With the consumer flag off, the judge score is still computed, persisted and surfaced to the sweep and doctor reports, so the honest governance half ships on cost with zero retrieval risk |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A representative indexed document carries a judge-derived `quality_score` in `[0,1]` in the existing column, computed without any body mutation, and the fusion band stays fixed at `[0.9, 1.1]`.
- **SC-002**: The form-versus-judge comparison report exists and quantifies the judge's marginal value over the form-only scorer, so the promotion decision is evidence-backed rather than assumed.
- **SC-003**: With the consumer flag off, prod-mode retrieval is byte-identical to baseline (the judge score is live as a governance signal but inert in ranking by design), so this phase ships the governance half on cost and hands the retrieval claim to C2.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 015-prodmode-recall-gate | The judge-as-default-fusion-input promotion cannot be claimed without a prod-mode completeRecall@3 RISE through C2. This is the shared unblock condition for every Tier-C and 027 retrieval item | Ship default-off. Promotion is gated on the C2 prod@3 read, not on eval-mode @K |
| Dependency | Shipped `quality_score` column and multiplier | The judge must write the existing column and feed the existing band, not a parallel one | Reuse `vector-index-schema.ts:643` and the `stage2-fusion.ts:272-288` consumer verbatim, adding only the input routing |
| Risk | Marginal value unproven | The retrieval nudge is capped by the deliberately narrow band, so a judge that barely differs from the form-only scorer buys little | REQ-004 makes the form-versus-judge comparison a P0 blocker before any promotion is considered |
| Risk | Divergent-verdict regression | A parallel quality scorer or column could disagree with the live form-only path | Single column, single multiplier, flag-routed input only, no parallel scorer (research.md Tier D) |
| Risk | Unmeasured retrieval claim | Eval-mode @K hides the 3-result prod floor, so any fusion lift measured in eval mode is inadmissible | Consumer stays default-off and no retrieval win is claimed until C2 measures prod@3 |
| Risk | LLM cost and nondeterminism on the write path | A per-document judge call adds latency and variance to indexing | Score on the write or index path only, cache by `content_hash` and keep the judge call out of the read path |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The fusion consumer SHALL add no new per-query DB round-trip. It reads a `quality_score` already present on the row.
- **NFR-P02**: The judge SHALL run on the write or index path only and SHALL NOT add latency to the read path, and it SHALL cache by `content_hash` so an unchanged document is not re-scored.

### Security
- **NFR-S01**: The judge SHALL NOT mutate the authored document body. It reads and scores only and writes a single metadata column (the no-body-mutate rail).

### Reliability
- **NFR-R01**: With the consumer flag off the retrieval path SHALL be byte-identical to baseline, including the `0.5` form-only fallback.
- **NFR-R02**: When the judge call fails or times out, the scorer SHALL fall back to the form-only score so indexing never blocks on the LLM.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a document with no scorable content persists the form-only score, never throws.
- Out-of-range judge output: a judge value outside `[0,1]` is clamped before persistence, mirroring the existing consumer clamp.
- Identical content: an unchanged document hits the `content_hash` cache and is not re-scored.

### Error Scenarios
- Judge unavailable: the scorer falls back to the form-only score and indexing proceeds (NFR-R02).
- Consumer flag off: the judge score is present in the column but the multiplier reads the form-only input, so no row score changes.

### State Transitions
- Partial completion: the governance half (compute, persist, surface to reports) may ship while the consumer flag stays off. The column populates with the judge score and the retrieval input is still form-only.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | One known-file fusion routing change plus a judge scorer module and a comparison harness |
| Risk | 13/25 | Retrieval-class input change, but gated default-off so prod risk is deferred to C2. LLM cost and nondeterminism handled by caching and fallback |
| Research | 7/20 | Both seams grounded to file:line in research.md. Judge module host and harness directory resolved in plan.md |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which live write or index module owns `quality_score` population that the judge should hook (resolved in plan.md against the indexing path that sets the column).
- Which model and prompt the judge uses and how its rubric maps to `[0,1]` so the score is comparable to the form-only metric in the same band.
- Whether the comparison harness reuses the existing `run-eval-v2.mjs` corpus sample or stands a smaller scoring-only sample (resolved in plan.md against the eval harness layout).
<!-- /ANCHOR:questions -->

---

<!--
VERDICT: conditional (C2-gated). Governance value is GO-on-cost: a real semantic quality score is an honest first-class signal for the sweep and doctor reports, floor-bypassing, no re-index. The retrieval value is CONDITIONAL: the judge is a better INPUT to the shipped plus-or-minus-10-percent qualityScore multiplier, not a new lane, its nudge is capped by that band, and it stays default-off and unpromoted until a prod-mode completeRecall@3 RISE through 015-prodmode-recall-gate. Prove marginal value over the form-only scorer first (research.md section 2 Tier C C5 and section 3).
-->
