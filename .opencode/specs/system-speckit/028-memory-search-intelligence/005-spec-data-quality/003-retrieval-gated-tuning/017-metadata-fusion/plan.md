---
title: "Implementation Plan: C4 Metadata Fusion Alpha-Blend [template:level_2/plan.md]"
description: "Add a flag-gated metadata-signal lane to the fusion stage that linearly blends text and metadata scores, calibrate alpha against this corpus, and gate the build behind a measured C1 prefix floor movement."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/003-retrieval-gated-tuning/017-metadata-fusion"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase plan for C4 metadata fusion scaffold"
    next_safe_action: "Hold for implementation, no code change has landed yet"
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
# Implementation Plan: C4 Metadata Fusion Alpha-Blend

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
| **Language/Stack** | TypeScript fusion stage, Node eval harness |
| **Framework** | spec-kit search pipeline (`stage2-fusion.ts`) and the v2 eval runner |
| **Storage** | None, the metadata signal reads fields already present on the candidate row |
| **Testing** | A fusion unit test plus an alpha-sweep pass through `run-eval-v2.mjs` reporting prod-mode completeRecall@3 |

### Overview
This phase adds a flag-gated metadata-signal lane to the fusion stage that computes a metadata score from fields already on the candidate row and folds it into a linear blend `alpha * text + (1 - alpha) * meta` next to the existing bounded validation multiplier. Alpha is a tunable parameter calibrated by an alpha-sweep mode in the eval harness that reports the prod-mode completeRecall@3 number per setting on this corpus. The lane ships default-off, adds no per-query DB round-trip, and earns a build only after the cheaper C1 prefix shows the prod floor can move.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Flag-gated scoring lane plus a linear blend folded into the existing fusion seam plus an alpha-sweep mode in the existing eval harness. No new abstraction and no new DB read.

### Key Components
- **`stage2-fusion.ts`**: today scores a candidate from text similarity then applies a bounded validation multiplier, host of the new metadata-signal score and the `alpha * text + (1 - alpha) * meta` blend.
- **The `clampMultiplier` bound**: the existing range discipline the blend reuses so the composite score stays bounded.
- **`run-eval-v2.mjs`**: the v2 eval runner, host of the new alpha-sweep mode that reports prod-mode completeRecall@3 per alpha setting on the spec corpus.
- **The lane flag**: the default-off rail so the lane can land and be calibrated before any prod retrieval behavior changes.

### Data Flow
The fusion stage scores each candidate from text similarity, applies the bounded validation multiplier, then with the lane flag on computes a metadata score from fields already on the row and blends it as `alpha * text + (1 - alpha) * meta`, reusing the `clampMultiplier` bound. With the flag off the lane is inert and the prod retrieval path is byte-identical to baseline. The alpha-sweep mode runs the same scoring path across a sweep of alpha values and emits the prod-mode completeRecall@3 column per setting.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `stage2-fusion.ts` text-and-multiplier scoring | Scores a candidate from text similarity then applies a bounded validation multiplier | add a flag-gated metadata score and the `alpha * text + (1 - alpha) * meta` blend, reuse the `clampMultiplier` bound | grep shows the lane flag and the blend, a fusion unit test shows a no-metadata candidate scores identically to baseline |
| `run-eval-v2.mjs` eval modes | Reports retrieval numbers per run | add an alpha-sweep mode that reports prod-mode completeRecall@3 per alpha setting on the spec corpus | the sweep emits one prod@3 number per alpha value, the chosen alpha cites that readout |
| The metadata signal source | Header path, curated triggers, and content_type already present on the candidate row | read those fields only, add no new per-query DB round-trip | a code read confirms the meta score reads only fields already on the row, a fusion unit test shows no added query |
| The prod retrieval path | Served by the fusion stage with the lane absent today | leave byte-identical when the flag is off | a flag-off run matches the baseline prod retrieval output |
| The C1 prefix baseline | The cheaper deterministic signal C4 is measured against | not a code change here, the build precondition | no task ships C4 ahead of a C1 floor-movement readout |

Required inventories:
- Same-class producers: `rg -n 'clampMultiplier|alpha|metaScore|fusion' .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline`.
- Consumers of changed symbols: `rg -n 'stage2|fusion|completeRecall|alpha-sweep' .opencode/skills/system-spec-kit/mcp_server`.
- Matrix axes: flag off, flag on with metadata present, flag on with no metadata, alpha equals zero, alpha equals one, missing metadata field.
- Algorithm invariant: with the flag off the path is byte-identical, with the flag on the blended score stays in the `clampMultiplier` bound, and a no-metadata candidate scores identically to baseline.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm header path, curated triggers, and content_type are present on the candidate row at the fusion stage with no extra read
- [ ] Decide the lane flag name and its default-off wiring next to the existing fusion config
- [ ] Capture the C1 prefix prod-mode completeRecall@3 baseline this lane must beat

### Phase 2: Core Implementation
- [ ] Add a metadata-signal score in `stage2-fusion.ts` derived from fields already on the row, contributing zero on missing fields and never throwing
- [ ] Fold the `alpha * text + (1 - alpha) * meta` blend next to the existing validation multiplier, reusing the `clampMultiplier` bound, behind the default-off flag with alpha as a tunable parameter
- [ ] Add an alpha-sweep mode to `run-eval-v2.mjs` that reports prod-mode completeRecall@3 per alpha setting on the spec corpus
- [ ] Run the alpha sweep and record the prod@3 readout per setting so any chosen alpha cites this corpus, not the SEC-10K finding

### Phase 3: Verification
- [ ] With the flag off, prod-mode retrieval is byte-identical to baseline
- [ ] A fusion unit test shows the blended score stays in the `clampMultiplier` bound and a no-metadata candidate scores identically to baseline
- [ ] The alpha sweep emits one prod-mode completeRecall@3 number per alpha setting and the C1-versus-C4 comparison is recorded
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The blend stays bounded, a no-metadata candidate matches baseline, a missing metadata field contributes zero | direct fusion unit test |
| Integration | Flag-off prod path byte-identical to baseline, flag-on path blends inside the bound | the search pipeline through the eval runner |
| Manual | Alpha-sweep prod-mode completeRecall@3 readout per setting and the C1-versus-C4 comparison | `run-eval-v2.mjs` alpha-sweep mode |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 014-chunk-prefix floor-movement readout | Internal | Yellow | C4 has no admissible build justification until C1 shows the prod floor can move |
| 015-prodmode-recall-gate prod@3 read | Internal | Yellow | The lane cannot be promoted past default-off without a prod-mode completeRecall@3 rise through C2 |
| Header path, curated triggers, content_type present on the row | Internal | Green | None, the fields ship today and need no new DB read |
| On-corpus alpha calibration | Internal | Yellow | A borrowed alpha could dilute text relevance, so the flip stays off until the sweep picks alpha on this corpus |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The flag-on blend regresses the prod-mode completeRecall@3 number, or the lane fails to beat the C1 prefix baseline.
- **Procedure**: Leave the lane flag off, which restores the byte-identical baseline path, and keep the calibrated instrument inert until the sweep finds an alpha that beats the C1 baseline.
<!-- /ANCHOR:rollback -->

---


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
| Core Implementation | Med | 3-5 hours |
| Verification | Med | 2-4 hours |
| **Total** | | **6-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] C1 prefix prod@3 baseline captured before any C4 build claim
- [ ] Lane flag default verified off
- [ ] Alpha-sweep prod@3 readout staged per setting

### Rollback Procedure
1. Set the lane flag off to restore the byte-identical baseline path
2. Keep the calibrated instrument inert while the sweep is re-run
3. Re-measure the prod-mode completeRecall@3 number against the C1 baseline
4. Re-attempt promotion only on a prod@3 rise through C2 that beats the C1 baseline

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change touches the in-flight score and the eval harness only, no stored row changes
<!-- /ANCHOR:enhanced-rollback -->

---
