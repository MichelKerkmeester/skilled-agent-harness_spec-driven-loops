---
title: "Feature Specification: C4 metadata fusion alpha-blend [template:level_2/spec.md]"
description: "The fusion stage scores a row from text similarity plus a bounded validation multiplier but never blends a separate metadata-signal vector into the score, so a curated-metadata signal cannot move a retrieval result. C4 proposes a linear alpha-blend of text and metadata scores whose alpha is un-calibrated on this corpus and whose value is subsumed by the cheaper C1 prefix."
trigger_phrases:
  - "metadata fusion alpha"
  - "c4 retrieval fusion"
  - "alpha text meta blend"
  - "metadata signal vector"
  - "fusion alpha calibration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "028-memory-search-intelligence/005-spec-data-quality/003-retrieval-gated-tuning/017-metadata-fusion"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored buildable phase spec from research C4 verdict"
    next_safe_action: "Run generate-description and graph-metadata backfill, then plan.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: C4 metadata fusion alpha-blend

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
| **Branch** | `017-metadata-fusion` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The fusion stage scores a candidate from text similarity and then applies a bounded validation multiplier over that composite (`stage2-fusion.ts:261-289`, clamped by `clampMultiplier` at `stage2-fusion.ts:157`). There is no separate metadata-signal score blended into the result, so a document whose curated metadata strongly names a query cannot win on metadata strength alone. C4 proposes the classic linear blend `score = alpha * text + (1 - alpha) * meta`. Two facts make it a hypothesis and not a build. The alpha weight is un-calibrated on this corpus, and the external evidence that metadata carries most of the signal is a SEC-10K finding (`research.md:48`), not a spec-corpus finding, so the blend could just as easily dilute text relevance as sharpen it. The metadata signal C4 would fuse is the same header-path and curated-trigger signal that the cheaper C1 deterministic prefix re-injects directly into the embedded text, so C4 is subsumed by C1 in its cheaper deterministic form and earns a build only after the C1 prefix demonstrates the prod floor can actually move.

### Purpose
Add a metadata-signal fusion lane to the scoring path, default-off and alpha-calibrated against this corpus, so a retrieval gain is only claimed if the linear blend beats the C1 prefix on a prod-mode completeRecall@3 read.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A metadata-signal score for a candidate derived from its already-present curated metadata (header path, curated triggers, content_type) without a new DB round-trip, computed alongside the existing text score.
- A linear blend `alpha * text + (1 - alpha) * meta` folded into the fusion path next to the existing bounded validation multiplier (`stage2-fusion.ts:261-289`), default-off behind a flag with alpha as a tunable parameter, not a hard-coded constant.
- An alpha-calibration pass run against `run-eval-v2.mjs` that sweeps alpha and reports the prod-mode completeRecall@3 number per setting, so alpha is chosen from this corpus and not borrowed from the SEC-10K finding.
- A default-off rail so the lane can land and be calibrated before any prod retrieval behavior changes.

### Out of Scope
- Building C4 at all before C1 demonstrates the floor can move. C4 is subsumed by the cheaper C1 deterministic prefix and is justified only as a measured improvement over it. See 014-chunk-prefix.
- Promoting the lane past default-off. That promotion is the C2 gate's job and is forbidden here. See 015-prodmode-recall-gate.
- Borrowing the SEC-10K alpha or any external alpha as a shipped default. Alpha is calibrated on this corpus or the lane stays off.
- The full re-embed and embedding-coverage guard. C4 fuses at the scoring stage and not the embed stage, so it does not re-pay the C1 re-index, but its value is still unproven until C2 measures it against the C1 baseline.
- Metadata enum auto-generation or new metadata fields. C4 consumes metadata already present, it does not author new fields.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` | Modify | Add a flag-gated metadata-signal score and the `alpha * text + (1 - alpha) * meta` blend next to the existing validation multiplier seam (`stage2-fusion.ts:261-289`), reusing the `clampMultiplier` bound discipline at L157 |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs` | Modify | Add an alpha-sweep mode that reports the prod-mode completeRecall@3 number per alpha setting against the spec corpus, so alpha is calibrated and not assumed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The metadata-fusion lane SHALL be gated default-off behind a flag and SHALL NOT be promoted to default-on within this phase | Grep confirms the flag default is off. The prod retrieval path is byte-identical with the flag off. No completion claim asserts a retrieval win |
| REQ-002 | WHEN the lane is built, alpha SHALL be a tunable parameter calibrated against this corpus and SHALL NOT be a hard-coded value borrowed from an external finding | The alpha-sweep mode reports a prod-mode completeRecall@3 number per setting. The chosen alpha cites that readout, not the SEC-10K finding |
| REQ-003 | The metadata-signal score SHALL be derived from metadata already present on the candidate and SHALL add no new per-query DB round-trip | A code read confirms the meta score reads only fields already on the row. A fusion unit test shows no added query |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | WHEN the lane flag is on, the blend SHALL keep the composite score in the existing bounded range and leave candidates without a metadata signal unchanged | The blend reuses the `clampMultiplier` bound. A fusion unit test shows the score stays in range and a no-metadata candidate scores identically to baseline |
| REQ-005 | The phase SHALL document that C4 is justified only as a measured improvement over the C1 prefix, not as a parallel lane | The decision-record or spec states the C1-first ordering. No task ships C4 ahead of a C1 floor-movement readout |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The alpha-sweep mode produces a prod-mode completeRecall@3 readout per alpha setting on the spec corpus, so any chosen alpha is calibrated against this corpus and not assumed.
- **SC-002**: With the lane flag off, prod-mode retrieval is byte-identical to baseline, so this phase ships an inert calibrated instrument and hands the promotion claim to C2 with the C1-first precondition recorded.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 014-chunk-prefix | C4 is subsumed by the cheaper C1 deterministic prefix. C4 is justified only after C1 demonstrates the prod floor can move and only as a measured improvement over it | Do not build C4 ahead of a C1 floor-movement readout. Treat C4 as an alpha-calibrated experiment on top of the C1 baseline |
| Dependency | 015-prodmode-recall-gate | The lane cannot be promoted to default-on without a prod-mode completeRecall@3 RISE through C2. This is the shared unblock condition for every Tier-C and 027 retrieval item | Ship default-off. Promotion is gated on the C2 prod@3 read, not on eval-mode @K |
| Risk | Un-calibrated alpha | A borrowed alpha could dilute text relevance instead of sharpening it, since the metadata-carries-most-signal claim is a SEC-10K finding not a spec-corpus finding | REQ-002 forces an on-corpus alpha sweep. No external alpha ships as a default |
| Risk | Redundancy with C1 | C4 fuses the same header-path and curated-trigger signal that C1 re-injects more cheaply and deterministically into the embedded text | Gate C4 behind a measured C1 floor movement. Build only if the alpha blend beats the C1 prefix on prod@3 |
| Risk | Unmeasured retrieval claim | Eval-mode @K hides the 3-result prod floor (`confidence-truncation.ts:35`), so a fusion win measured in eval mode is inadmissible | Lane stays default-off. The only admissible readout is the prod-mode completeRecall@3 column through C2 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The metadata-fusion lane SHALL add no new per-query DB round-trip. The metadata signal is computed from fields already on the candidate row.
- **NFR-P02**: The blend SHALL be a constant-time scalar operation per candidate, adding no measurable read-path latency when the flag is off.

### Security
- **NFR-S01**: The lane SHALL NOT mutate any authored document body or any stored row. It changes only the in-flight score (the no-body-mutate rail).

### Reliability
- **NFR-R01**: With the lane flag off the retrieval path SHALL be byte-identical to baseline.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No metadata signal: a candidate with no usable curated metadata scores from text alone, identical to baseline.
- alpha equals one: the blend reduces to the current text-only behavior, which is the safe identity case for the flag-on path.
- alpha equals zero: the blend becomes metadata-only, which the calibration sweep must show is a worse readout, not a default.

### Error Scenarios
- Missing metadata fields: a malformed or absent metadata field contributes zero to the meta score and never throws.
- Flag off: the lane is inert and no candidate score changes.

### State Transitions
- Calibration before promotion: the lane may land and be swept while still default-off. Promotion follows only a C2 prod@3 read taken against the C1 baseline.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | One fusion-stage modification plus an alpha-sweep mode in the existing eval harness |
| Risk | 14/25 | Retrieval-class scoring touch with an un-calibrated parameter, gated default-off and ordered behind C1 so prod risk is deferred |
| Research | 7/20 | Seams grounded to file:line in research.md. Alpha calibration is the genuine open question this phase resolves |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- What metadata-signal function over header path and curated triggers and content_type is the right input to the blend, resolved in plan.md against the fields already on the row.
- Whether C4 is ever worth building once C1 lands, since C1 may already capture the entire metadata signal more cheaply, which makes a measured C1-versus-C4 prod@3 comparison the real gate.
<!-- /ANCHOR:questions -->

---

<!--
VERDICT: experiment / conditional (double-gated). C4 is the weakest-standing Tier-C item. It is subsumed by the cheaper C1 deterministic prefix, carries an un-calibrated alpha and rests on external evidence (SEC-10K) that does not transfer to the spec corpus. Build only after 014-chunk-prefix shows the prod floor can move, ship default-off and promote only on a prod-mode completeRecall@3 RISE through 015-prodmode-recall-gate that beats the C1 baseline. Per research.md section 2 Tier C and the prove-first caveats in section 6.
-->
