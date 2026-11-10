---
title: "Feature Specification: Scoring Hardening [template:level_2/spec.md]"
description: "The verdict and citation path scores an off-corpus term as good on a lone high-cosine hit because banding reads the raw absolute relevance with no grounding signal, no noise-floor subtraction, and no evidence-gap bridge. This phase surfaces a grounding signal in the envelope, subtracts a measured corpus noise-floor before banding, adds a cite_with_caveat tier for borderline grounding, bridges stage4.evidenceGapDetected into the request-quality verdict and documents the calibration re-fit as a proven non-fix. Every behavioral change ships behind a default-OFF flag against the new off-corpus fixtures."
trigger_phrases:
  - "scoring hardening"
  - "grounding signal envelope"
  - "noise floor subtraction banding"
  - "cite with caveat tier"
  - "evidence gap detected verdict"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/028-scoring-hardening"
    last_updated_at: "2026-07-04T17:51:07.092Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented recs 7 8 10 11 12 behind default-OFF flags, built dist, vitest green"
    next_safe_action: "Graduate a flag only after its off-corpus fixture arm is green"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/noise-floor.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The corpus noise-floor is measured against nomic-embed-text-v1.5 and stored per embedder, failing closed for an unmeasured one"
---
# Feature Specification: Scoring Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope and verification evidence.
- Remove placeholders, stale status and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | COMPLETE |
| **Created** | 2026-06-22 |
| **Completed** | 2026-06-22 |
| **Branch** | `028-scoring-hardening` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `/memory:search` verdict and citation path scores an off-corpus term as good on a lone spurious high-cosine hit. The 029 model benchmark caught `kubernetes` scoring good at 0.78 on a semantically unrelated doc, identical across all four models, and the 005 improvement research traced it to a score-calibration miss, not an envelope-fidelity miss. The envelope reported good faithfully because the upstream absolute relevance genuinely returned 0.78. The banding reads the pre-calibration absolute value at `confidence-scoring.ts:400` with no grounding signal, no noise-floor correction and no evidence-gap bridge, so a fluent but unrelated doc that earns a high background cosine from the nomic embedder sails through to good and cite_results. Four facts shape this phase. First, the verdict band derives only from `topScore`, `qualityRatio` and `topMargin` with no query or lexical input (`confidence-scoring.ts:433-478`), so a borderline downgrade is invisible to the reader. Second, the raw absolute relevance is banded with no background-cosine subtraction, so an embedder that hands unrelated text a high floor inflates every band. Third, a borderline grounding case is dropped to weak with no middle tier, so a near-miss is treated the same as a clear miss. Fourth, `stage4.evidenceGapDetected` is computed but never bridged into the request-quality verdict, so a known evidence gap does not lower the band. The calibration curve is provably independent of the verdict because banding is taken off the pre-calibration value at `confidence-scoring.ts:400` with `value=maybeCalibrate` at `:388`, so a curve re-fit can never move good versus weak and is a non-fix that must be documented rather than attempted.

### Purpose
Harden the scoring path so a borderline or off-corpus hit is legible, corrected and hedged rather than confidently mis-cited. Surface a grounding signal in the envelope so a downgrade or borderline cite is visible, subtract a measured corpus noise-floor from absolute relevance before banding so the background cosine no longer inflates the band, add a cite_with_caveat tier so borderline grounding is hedged rather than silently dropped, bridge `stage4.evidenceGapDetected` into the request-quality verdict so a known gap lowers the band, and document the calibration re-fit as a proven non-fix so no future work spends effort on a curve that cannot move the verdict. Every behavioral change ships behind a default-OFF flag or a grandfather report mode and graduates only after validating on the new off-corpus fixtures, because the existing eval and verdict fixtures carry the prose statuses and prefixed paths the new contract rejects.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A grounding-or-low-grounding signal surfaced in the envelope so a downgrade or a borderline cite is legible to the reader rather than silent (rec 7).
- A measured corpus noise-floor subtracted from absolute relevance before banding, the background-cosine correction, gated behind a default-OFF flag (rec 8).
- A `cite_with_caveat` tier between `cite_results` and the weak drop, so a borderline grounding case is hedged rather than dropped, gated behind a default-OFF flag (rec 10).
- A bridge from `stage4.evidenceGapDetected` into the request-quality verdict so a detected evidence gap lowers the band, gated behind a default-OFF flag (rec 11).
- A documented statement that the calibration re-fit is a non-fix, with the file:line proof that banding reads the pre-calibration value, kept as documentation only and never shipped as a behavioral change (rec 12).
- The off-corpus eval fixtures and the dormant `falseGoodOnHardNegatives` metric as the validation harness every flag graduates against, consumed read-only from the upstream fixture phase.

### Out of Scope
- The lexical-grounding floor that gates good and cite_results on a query-term or BM25 overlap (rec 3) and the single-hit corroboration in `assessRequestQuality` (rec 4). Those are the root-cause behavioral fixes and ship in their own phases, this phase surfaces, corrects the floor, hedges, and bridges around them.
- Adding the off-corpus hard-negative fixtures (rec 1) and wiring the false-confirm eval driver (rec 2). This phase consumes that harness, it does not build it.
- The render-contract envelope-fidelity work (ranks 5, 6, 9), which is the separate soft spot B and shares no code with the scoring path.
- A calibration curve re-fit as a behavioral change. Rec 12 is documentation only because the curve cannot move the verdict.
- Any change to the isotonic calibration curve itself or to `maybeCalibrate` at `confidence-scoring.ts:388`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/confidence-scoring.d.ts` | Modify | Subtract a measured noise-floor before banding at the `:400` band read, add the `cite_with_caveat` tier, and bridge `evidenceGapDetected` into the band, all flag-gated default-OFF |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/search-results.d.ts` | Modify | Surface the grounding or low-grounding signal on the result envelope where the verdict fields are populated at the `:913-916` and `:1167-1176` seams, flag-gated default-OFF |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/confidence-scoring.js` | Modify | The compiled banding logic that mirrors the typed surface, same flag-gated changes |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/search-results.js` | Modify | The compiled envelope population that mirrors the typed surface, same flag-gated changes |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs` | Verify (no change) | The eval lens the flags graduate against. Confirm the off-corpus class flows through with no harness edit |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Document the new default-OFF flags and the rec 12 non-fix statement in the feature-flag reference |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rec 7. The envelope MUST surface a grounding or low-grounding signal so a downgrade or a borderline cite is legible, behind a default-OFF flag | With the flag ON a borderline cite carries a grounding signal field on the envelope and a clear good carries a grounded signal, with the flag OFF the envelope matches the shipped output byte for byte, and a unit assertion confirms the signal reflects the lexical grounding present on the result rows |
| REQ-002 | Rec 8. Absolute relevance MUST have a measured corpus noise-floor subtracted before banding, behind a default-OFF flag | With the flag ON the band reads `relevance minus noiseFloor` at the `confidence-scoring` band seam and the kubernetes off-corpus sample no longer reaches good, with the flag OFF the band reads the raw relevance unchanged, and the noise-floor value records the embedder it was measured against |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Rec 10. A `cite_with_caveat` tier MUST sit between `cite_results` and the weak drop so borderline grounding is hedged rather than dropped, behind a default-OFF flag | With the flag ON a borderline-grounding result resolves to `cite_with_caveat` rather than dropping to weak, a clear good still resolves to `cite_results` and a clear miss still resolves to weak, and with the flag OFF the citation policy matches the shipped three-state output |
| REQ-004 | Rec 11. `stage4.evidenceGapDetected` MUST bridge into the request-quality verdict so a detected gap lowers the band, behind a default-OFF flag | With the flag ON a result whose `stage4.evidenceGapDetected` is true bands no higher than `cite_with_caveat` or weak per the configured mapping, with the flag OFF the band ignores `evidenceGapDetected` as it does today, and a unit assertion confirms the gap signal is read from stage4 and not recomputed |
| REQ-005 | Rec 12. The calibration re-fit MUST be documented as a proven non-fix with file:line evidence and MUST NOT ship as a behavioral change | The docs record that banding is taken off the pre-calibration value at `confidence-scoring.ts:400` with `value=maybeCalibrate` at `:388`, state that the curve cannot move good, weak or gap, then confirm the phase ships no edit to the calibration curve or to `maybeCalibrate` |
| REQ-006 | Every behavioral flag MUST default OFF and graduate only after validating on the off-corpus fixtures, and a grandfather report mode MUST cover the existing fixtures that carry prose statuses and prefixed paths the new contract rejects | Each of the four behavioral flags defaults OFF in `ENV_REFERENCE.md`, the OFF arm reproduces the shipped output, and a grandfather report run lists the legacy fixtures without failing them |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With the rec-8 noise-floor flag ON, the `kubernetes` off-corpus sample no longer reaches good, and with it OFF the band is byte-identical to the shipped output, proving the correction is real and reversible.
- **SC-002**: With the rec-7 grounding-signal flag ON, a borderline cite carries a legible grounding signal in the envelope and a clear good carries a grounded signal, proving a downgrade or borderline cite is no longer silent.
- **SC-003**: With the rec-10 caveat-tier flag ON, a borderline-grounding result resolves to `cite_with_caveat` rather than dropping to weak, while a clear good and a clear miss keep their existing tiers, proving the middle tier hedges rather than drops.
- **SC-004**: With the rec-11 evidence-gap flag ON, a result whose `stage4.evidenceGapDetected` is true bands no higher than the configured ceiling, proving a known gap lowers the band.
- **SC-005**: The docs prove the rec-12 calibration re-fit is a non-fix by citing the pre-calibration band read, and the phase ships no curve edit, proving no effort was spent on a curve that cannot move the verdict.
- **SC-006**: Each behavioral flag defaults OFF, the OFF arm reproduces the shipped output on the aligned good queries and the correctly-weak authentication case, and the grandfather report lists the legacy fixtures without failing them.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The off-corpus fixtures and the wired false-confirm metric (recs 1 and 2) | The flags cannot graduate without an off-corpus class to validate against | Consume the upstream fixture phase read-only and keep every flag OFF until its off-corpus arm is green |
| Dependency | The shared lexical signals `fts_score` and `bm25` on the raw rows | The grounding signal and the caveat tier read these signals | Reuse the signals already present at `search-results.ts:913-916` rather than recomputing them |
| Risk | The noise-floor is calibrated against a single embedder | High | Record the embedder the floor was measured against, assert qualitative verdicts over a cosine profile, and store the floor per embedder when more than one is in use |
| Risk | A flag-ON path that diverges from the OFF path silently regresses the aligned good queries | High | Prove the OFF arm reproduces the shipped output byte for byte and gate each flag behind its off-corpus fixture before graduation |
| Risk | A future contributor attempts a calibration re-fit believing it moves the verdict | Med | Document the non-fix with the pre-calibration band-read evidence so the curve is never re-fit for the false-positive |
| Risk | The compiled `.js` surface drifts from the typed `.d.ts` surface | Med | Edit the typed and compiled surfaces together and verify the band read matches at both |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The noise-floor subtraction is a single scalar subtraction per result and adds no measurable latency to the banding pass.

### Reliability
- **NFR-R01**: With every flag OFF the scoring path is byte-identical to the shipped output, so the default runtime is unchanged until a flag is graduated.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A result whose relevance sits below the measured noise-floor: the subtracted value floors at zero rather than going negative, so the band reads a clean zero rather than an inverted score.
- A borderline result with no lexical signal at all: it resolves to `cite_with_caveat` only when the configured grounding threshold is met, otherwise it stays weak, so the caveat tier never promotes a fully ungrounded hit.

### Error Scenarios
- A missing or unmeasured noise-floor for the active embedder: the rec-8 flag fails closed to the shipped raw-relevance band rather than subtracting an unknown floor.
- A stage4 payload with no `evidenceGapDetected` field: the rec-11 bridge treats the gap as absent rather than throwing, so an older payload bands as it does today.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | Five recs across the banding seam and the envelope population, four behavioral flags plus one documentation statement, typed and compiled surfaces edited together |
| Risk | 9/25 | Behavioral banding changes gated default-OFF, embedder-portability of the noise-floor, and the OFF-arm byte parity guard |
| Research | 3/20 | Seams already verified to file:line in research.md section 4 and section 6 |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which embedder the corpus noise-floor is measured against, and whether the floor is stored per embedder given the latent embedder-portability risk.
- Whether `cite_with_caveat` and the rec-11 evidence-gap bridge share one band ceiling or carry independent thresholds.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:verdict -->
## 11. VERDICT

COMPLETE. This phase hardens the scoring path around the convergent root-cause fix rather than replacing it. It surfaces a grounding signal so a downgrade is legible (rec 7), subtracts a measured corpus noise-floor before banding so the background cosine no longer inflates the band (rec 8), adds a `cite_with_caveat` tier so borderline grounding is hedged rather than dropped (rec 10), bridges `stage4.evidenceGapDetected` into the verdict so a known gap lowers the band (rec 11), and documents the calibration re-fit as a proven non-fix because banding is taken off the pre-calibration value and the curve cannot move the verdict (rec 12). Every behavioral change ships behind a default-OFF flag and graduates only against the off-corpus fixtures, with a grandfather report mode for the existing fixtures that carry the prose statuses and prefixed paths the new contract rejects, so the aligned good queries and the correctly-weak authentication case provably do not regress.
<!-- /ANCHOR:verdict -->
