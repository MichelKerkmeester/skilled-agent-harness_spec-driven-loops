---
title: "Implementation Plan: Scoring Hardening [template:level_2/plan.md]"
description: "Harden the scoring path behind default-OFF flags. Surface a grounding signal in the envelope, subtract a measured corpus noise-floor before banding, add a cite_with_caveat tier, bridge stage4.evidenceGapDetected into the request-quality verdict and document the calibration re-fit as a proven non-fix. Each behavioral flag graduates only against the off-corpus fixtures with a grandfather report mode for the legacy fixtures."
trigger_phrases:
  - "scoring hardening"
  - "grounding signal envelope"
  - "noise floor subtraction banding"
  - "cite with caveat tier"
  - "evidence gap detected verdict"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/038-scoring-hardening"
    last_updated_at: "2026-07-04T17:51:07.092Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented the flag-gated banding and envelope changes for recs 7 8 10 11 12"
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
    answered_questions: []
---
# Implementation Plan: Scoring Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript scoring lib compiled to `.js`, Node ESM eval harness |
| **Framework** | spec-kit search confidence-scoring and search-results modules |
| **Storage** | A measured corpus noise-floor recorded with its embedder, no schema migration |
| **Testing** | Flag-ON and flag-OFF arms over the off-corpus fixtures plus an OFF-arm byte-parity proof |

### Overview
This phase hardens the scoring path around the convergent root-cause fix rather than replacing it. It surfaces a grounding or low-grounding signal on the envelope where the verdict fields are populated (rec 7), subtracts a measured corpus noise-floor from absolute relevance before the band read at `confidence-scoring.ts:400` (rec 8), adds a `cite_with_caveat` tier between `cite_results` and the weak drop (rec 10), bridges `stage4.evidenceGapDetected` into the request-quality verdict so a known gap lowers the band (rec 11), and documents that the calibration re-fit is a proven non-fix because banding is taken off the pre-calibration value at `:400` with `value=maybeCalibrate` at `:388` (rec 12). Each behavioral change is gated behind a default-OFF flag and graduates only after its off-corpus arm is green, with a grandfather report mode for the existing fixtures that carry the prose statuses and prefixed paths the new contract rejects. The typed `.d.ts` and the compiled `.js` surfaces are edited together so the band read matches at both.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met (REQ-001 through REQ-006)
- [x] Tests passing (scoring-hardening.vitest.ts 16/16; 248/248 across touched suites; typecheck and build exit 0)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary, ENV_REFERENCE)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Flag-gated hardening over an unchanged calibration curve. Four behavioral changes each sit behind a default-OFF flag at the banding seam or the envelope population, plus one documentation statement. The OFF arm reproduces the shipped output byte for byte, so the default runtime is unchanged until a flag graduates against its off-corpus fixture. No change to the isotonic calibration curve or to `maybeCalibrate`, because the band is taken off the pre-calibration value and the curve cannot move the verdict.

### Key Components
- **`confidence-scoring` band seam**: the `:400` band read where the noise-floor subtraction lands (rec 8), where the `cite_with_caveat` tier is introduced between `cite_results` and weak (rec 10), and where the `evidenceGapDetected` bridge lowers the band (rec 11), all flag-gated.
- **`search-results` envelope population**: the `:913-916` raw-row seam carrying `fts_score` and `bm25` and the `:1167-1176` verdict-field population where the grounding or low-grounding signal is surfaced (rec 7), flag-gated.
- **The off-corpus fixtures and the wired false-confirm metric**: consumed read-only as the validation harness every flag graduates against.
- **`ENV_REFERENCE.md`**: the feature-flag reference recording the four default-OFF flags and the rec-12 non-fix statement with its file:line proof.

### Data Flow
The raw rows carry `fts_score` and `bm25` at the `search-results` seam. With the rec-7 flag ON the envelope population reads those signals and surfaces a grounding or low-grounding field. With the rec-8 flag ON the band read subtracts the measured noise-floor from absolute relevance before banding. With the rec-10 flag ON a borderline-grounding band resolves to `cite_with_caveat` rather than dropping to weak. With the rec-11 flag ON a true `stage4.evidenceGapDetected` lowers the band no higher than the configured ceiling. With every flag OFF the band and the envelope match the shipped output, and rec 12 ships only the documented non-fix statement.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `confidence-scoring` band read (`:400`, `value=maybeCalibrate` at `:388`) | Bands the pre-calibration absolute relevance with no noise-floor subtraction | subtract a measured corpus noise-floor before the band read behind a default-OFF flag, floor the subtracted value at zero | with the flag ON the kubernetes sample no longer reaches good and with it OFF the band is byte-identical |
| `confidence-scoring` citation policy (`:433-478`) | Resolves a three-state cite_results, weak, gap policy from `requestQuality.label` | add a `cite_with_caveat` tier between cite_results and weak behind a default-OFF flag | with the flag ON a borderline-grounding result resolves to cite_with_caveat, a clear good stays cite_results and a clear miss stays weak, with it OFF the policy is the shipped three-state output |
| `confidence-scoring` band input | Reads `topScore`, `qualityRatio` and `topMargin` with no evidence-gap input | bridge `stage4.evidenceGapDetected` into the band so a true gap bands no higher than the configured ceiling, behind a default-OFF flag | with the flag ON a true evidenceGapDetected lowers the band, with it OFF the band ignores the gap, and the gap is read from stage4 not recomputed |
| `search-results` envelope population (`:1167-1176`) | Populates and ships the verdict fields with no grounding signal | surface a grounding or low-grounding signal on the envelope behind a default-OFF flag, reusing the lexical signals on the raw rows | with the flag ON a borderline cite carries a grounding signal and a clear good carries a grounded signal, with it OFF the envelope is byte-identical |
| `search-results` raw-row signals (`:913-916`) | Carries `fts_score` and `bm25` already available on the raw rows | reuse these signals for the grounding signal and the caveat tier, no recompute | the grounding signal reflects the lexical signals already present on the rows |
| `confidence-scoring.js` and `search-results.js` compiled surfaces | Mirror the typed banding and envelope logic at runtime | apply the same flag-gated edits to the compiled surfaces so they match the typed surfaces | the band read and the envelope population match at the typed and compiled surfaces |
| Calibration curve and `maybeCalibrate` (`:388`) | The isotonic curve that produces the calibrated value | no change, the band is taken off the pre-calibration value so the curve cannot move the verdict | the docs cite `:400` and `:388` and the phase ships no curve edit |
| `ENV_REFERENCE.md` feature-flag reference | Documents the default-off feature flags | add the four default-OFF behavioral flags and the rec-12 non-fix statement | the reference lists each flag default-OFF and records the non-fix proof |

Required inventories:
- Same-class producers: `rg -n 'maybeCalibrate|requestQuality|citationPolicy|cite_results|evidenceGapDetected' .opencode/skills/system-spec-kit/mcp_server/dist/lib/search`.
- Consumers of changed symbols: `rg -n 'fts_score|bm25|cite_with_caveat|noiseFloor' .opencode/skills/system-spec-kit/mcp_server`.
- Matrix axes: each of the four flags ON and OFF, the kubernetes off-corpus sample, the aligned good queries, the correctly-weak authentication case, a result below the noise-floor, a borderline result with no lexical signal, a stage4 payload missing the gap field, and an unmeasured noise-floor for the active embedder.
- Algorithm invariant: with every flag OFF the band and the envelope are byte-identical to the shipped output, the noise-floor subtraction floors at zero, the caveat tier never promotes a fully ungrounded hit, the evidence-gap bridge reads stage4 not a recompute, and the calibration curve is never edited.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the off-corpus fixtures and the wired false-confirm metric are available read-only as the validation harness
- [ ] Confirm the lexical signals `fts_score` and `bm25` are present on the raw rows at the `search-results` seam
- [ ] Define the four default-OFF flag names and the grandfather report mode in `ENV_REFERENCE.md`
- [ ] Measure the corpus noise-floor against the active embedder and record the embedder it was measured against

### Phase 2: Core Implementation
- [ ] Surface the grounding or low-grounding signal on the envelope at the verdict-field population, behind the rec-7 default-OFF flag (rec 7)
- [ ] Subtract the measured noise-floor from absolute relevance before the band read, floored at zero, behind the rec-8 default-OFF flag (rec 8)
- [ ] Add the `cite_with_caveat` tier between cite_results and weak, behind the rec-10 default-OFF flag (rec 10)
- [ ] Bridge `stage4.evidenceGapDetected` into the band so a true gap bands no higher than the configured ceiling, behind the rec-11 default-OFF flag (rec 11)
- [ ] Apply the same edits to the compiled `.js` surfaces so they match the typed surfaces
- [ ] Document the calibration re-fit as a proven non-fix with the `:400` and `:388` file:line evidence, ship no curve edit (rec 12)

### Phase 3: Verification
- [ ] Prove the OFF arm reproduces the shipped band and envelope byte for byte on the aligned good queries and the correctly-weak authentication case
- [ ] Prove the rec-8 flag ON drops the kubernetes off-corpus sample below good
- [ ] Prove the rec-10 flag ON resolves a borderline-grounding result to cite_with_caveat while a clear good and a clear miss keep their tiers
- [ ] Prove the rec-11 flag ON lowers the band on a true evidenceGapDetected and the rec-7 flag ON surfaces the grounding signal
- [ ] Prove the grandfather report lists the legacy fixtures without failing them and the docs prove the rec-12 non-fix
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The band reads `relevance minus noiseFloor` floored at zero with the rec-8 flag ON, the citation policy resolves cite_with_caveat with the rec-10 flag ON, the band reads stage4 evidenceGapDetected with the rec-11 flag ON, and the envelope carries the grounding signal with the rec-7 flag ON | `confidence-scoring.vitest.ts` and `search-results.vitest.ts` |
| Integration | Each flag ON drops or hedges the kubernetes off-corpus sample over the off-corpus fixtures while the aligned good queries and the correctly-weak authentication case hold, and each flag OFF reproduces the shipped output byte for byte | `scoring-hardening-offcorpus.vitest.ts` over the eval fixtures |
| Manual | The grandfather report lists the legacy fixtures without failing them, and the rec-12 docs cite the pre-calibration band read | grandfather report run plus `ENV_REFERENCE.md` review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The off-corpus hard-negative fixtures (rec 1) | Internal | Yellow | No flag can graduate without an off-corpus class to validate against |
| The wired false-confirm eval driver (rec 2) | Internal | Yellow | The graduation gate cannot read a false-confirm rate until the driver lands |
| The lexical signals `fts_score` and `bm25` on the raw rows | Internal | Green | The grounding signal and the caveat tier reuse these signals already present at the seam |
| A measured corpus noise-floor for the active embedder | Internal | Yellow | The rec-8 flag fails closed to the raw-relevance band until the floor is measured |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A flag-ON path regresses the aligned good queries, or the compiled surface drifts from the typed surface.
- **Procedure**: Set every behavioral flag OFF, which restores the shipped band and envelope byte for byte because the OFF arm is the shipped path. The calibration curve needs no revert because it was never edited.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 5-7 hours |
| Verification | Med | 2-4 hours |
| **Total** | | **8-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Off-corpus fixtures available and each flag OFF by default
- [ ] OFF-arm byte parity proven on the aligned good queries
- [ ] Noise-floor measured and recorded with its embedder

### Rollback Procedure
1. Set the four behavioral flags OFF
2. Confirm the band and envelope match the shipped output byte for byte
3. Confirm the calibration curve and `maybeCalibrate` are untouched
4. Re-run the off-corpus and aligned-good fixtures to confirm the shipped state

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change adds flag-gated banding logic and a recorded noise-floor value with no schema migration
<!-- /ANCHOR:enhanced-rollback -->

---
