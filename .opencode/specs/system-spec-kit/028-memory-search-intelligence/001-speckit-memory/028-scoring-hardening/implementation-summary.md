---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Scaffolded phase that will surface a grounding signal in the envelope, subtract a measured corpus noise-floor before banding, add a cite_with_caveat tier, bridge stage4.evidenceGapDetected into the verdict and document the calibration re-fit as a non-fix, each behavioral change behind a default-OFF flag. No code change has landed."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/028-scoring-hardening"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded scoring-hardening impl scaffold status PLANNED"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/dist/lib/search/confidence-scoring.d.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/lib/search/search-results.d.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-scoring-hardening |
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Grounding signal in the envelope

The phase will surface a grounding or low-grounding signal on the result envelope at the verdict-field population so a downgrade or a borderline cite is legible to the reader rather than silent (rec 7). Today the citation policy derives only from `requestQuality.label`, which uses `topScore`, `qualityRatio` and `topMargin` with no query or lexical input, so a borderline downgrade is invisible. The signal reuses the lexical `fts_score` and `bm25` already present on the raw rows rather than recomputing them. It ships behind a default-OFF flag, so with the flag OFF the envelope matches the shipped output byte for byte.

### Noise-floor subtraction before banding

The phase will subtract a measured corpus noise-floor from absolute relevance before the band read (rec 8). Today the band reads the pre-calibration absolute value with no background-cosine correction, so the nomic embedder that hands fluent but unrelated text a high background cosine inflates every band and a lone off-corpus hit reaches good. The subtraction floors at zero so the band never inverts, records the embedder the floor was measured against, and ships behind a default-OFF flag. With the flag ON the kubernetes off-corpus sample no longer reaches good, and with it OFF the band is byte-identical.

### cite_with_caveat tier

The phase will add a `cite_with_caveat` tier between `cite_results` and the weak drop so a borderline grounding case is hedged rather than silently dropped (rec 10). Today a borderline result drops to weak with no middle tier, so a near-miss is treated the same as a clear miss. The tier ships behind a default-OFF flag and never promotes a fully ungrounded hit, so with the flag OFF the citation policy matches the shipped three-state output.

### Evidence-gap bridge into the verdict

The phase will bridge `stage4.evidenceGapDetected` into the request-quality verdict so a detected evidence gap lowers the band (rec 11). Today `evidenceGapDetected` is computed but never bridged into the band, so a known gap does not lower the verdict. The bridge reads the gap from stage4 rather than recomputing it, bands a true gap no higher than the configured ceiling, and ships behind a default-OFF flag.

### Calibration re-fit documented as a non-fix

The phase will document that the calibration re-fit is a proven non-fix (rec 12). The band is taken off the pre-calibration value at `confidence-scoring.ts:400` with `value=maybeCalibrate` at `:388`, so the curve cannot move good, weak or gap. The phase ships only this documented statement with its file:line proof and edits no calibration curve, so no future effort is spent on a curve that cannot move the verdict.

### Files Changed

This table lists the planned changes. None have been applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/confidence-scoring.d.ts` | Planned modify | Noise-floor subtraction, the cite_with_caveat tier, and the evidence-gap bridge, all flag-gated default-OFF |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/search-results.d.ts` | Planned modify | Surface the grounding or low-grounding signal on the envelope, flag-gated default-OFF |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/confidence-scoring.js` | Planned modify | The compiled banding logic mirroring the typed surface |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/search-results.js` | Planned modify | The compiled envelope population mirroring the typed surface |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs` | Verify only | The eval lens the flags graduate against, no harness edit |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Planned modify | The four default-OFF flags and the rec-12 non-fix statement |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned sequence measures the corpus noise-floor against the active embedder first, then surfaces the grounding signal, subtracts the noise-floor, adds the caveat tier, and bridges the evidence gap, each behind its own default-OFF flag, applying the edits to the typed and compiled surfaces together. The OFF-arm byte-parity proof on the aligned good queries and the correctly-weak authentication case, the rec-8 proof that the kubernetes off-corpus sample drops below good, the rec-10 and rec-11 hedge and bridge proofs, and the grandfather report over the legacy fixtures land with the flags. The rec-12 non-fix statement ships as documentation with its pre-calibration band-read evidence and no curve edit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ship every behavioral change behind a default-OFF flag | The existing eval and verdict fixtures carry the prose statuses and prefixed paths the new contract rejects, so the OFF arm must reproduce the shipped output until a flag graduates against the off-corpus fixtures |
| Subtract the noise-floor from the pre-calibration value, not the calibrated value | The band is taken off the pre-calibration value at `confidence-scoring.ts:400`, so the correction must land at the band seam and the calibration curve must not be touched |
| Add a middle cite_with_caveat tier rather than widen the weak drop | A borderline near-miss and a clear miss are not the same signal, so hedging is more faithful than dropping both to weak |
| Read `stage4.evidenceGapDetected` rather than recompute the gap | The gap is already computed in stage4, so bridging the existing signal avoids a second source of truth |
| Document the calibration re-fit as a non-fix instead of attempting it | The verdict band is provably independent of the curve, so a re-fit cannot move good versus weak and would spend effort on a non-fix |
| Floor the noise-floor-subtracted value at zero | A relevance below the floor must read a clean zero rather than an inverted negative band |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run. The checks below are planned and currently unmet. The planned graduation gate is the off-corpus eval run with each flag ON, and the planned docs gate is `validate.sh --strict`.

| Check | Result |
|-------|--------|
| With every flag OFF the band and envelope are byte-identical to the shipped output | PLANNED, not yet run |
| The rec-8 flag ON drops the kubernetes off-corpus sample below good | PLANNED, not yet run |
| The rec-10 flag ON resolves a borderline-grounding result to cite_with_caveat while a clear good and a clear miss keep their tiers | PLANNED, not yet run |
| The rec-11 flag ON lowers the band on a true `stage4.evidenceGapDetected` | PLANNED, not yet run |
| The rec-7 flag ON surfaces a grounding signal on a borderline cite and a grounded signal on a clear good | PLANNED, not yet run |
| The grandfather report lists the legacy fixtures without failing them and the rec-12 docs cite the pre-calibration band read | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. No code change has landed and no check has passed.
2. **Fixture precondition.** No flag can graduate until the off-corpus hard-negative fixtures and the wired false-confirm metric exist, so the flags stay OFF until that harness lands.
3. **Embedder-portability.** The corpus noise-floor is calibrated against a single embedder, so the rec-8 flag fails closed to the raw-relevance band when the active embedder has no measured floor, and the floor must be stored per embedder when more than one is in use.
4. **Root-cause dependency.** This phase surfaces, corrects the floor, hedges, and bridges around the convergent lexical-grounding floor and the single-hit corroboration, which ship in their own phases, so the hardening is most effective once those root-cause fixes also land.
<!-- /ANCHOR:limitations -->

---
