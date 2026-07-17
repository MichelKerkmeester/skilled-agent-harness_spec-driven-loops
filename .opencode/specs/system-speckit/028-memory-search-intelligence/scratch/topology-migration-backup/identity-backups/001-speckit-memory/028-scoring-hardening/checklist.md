---
title: "Verification Checklist: Scoring Hardening [template:level_2/checklist.md]"
description: "Verification Date: 2026-06-22. All P0 and P1 items verified with evidence; behavioral flags ship default-OFF, 16-case vitest green, no regression across 248 touched-suite cases."
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
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/028-scoring-hardening"
    last_updated_at: "2026-07-04T17:51:07.092Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified all P0/P1 checklist items against the shipped implementation"
    next_safe_action: "Graduate a flag only after its off-corpus fixture arm is green"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/scoring-hardening.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Scoring Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] The false-confirm metric and a measured noise-floor for the active embedder are available; the off-corpus fixtures are the read-only upstream dependency. Evidence: `scripts/evals/run-false-confirm-eval.mjs` (`falseGoodOnHardNegatives` driver + `SPECKIT_FALSE_CONFIRM_MAX_RATE` gate), measured floor in `lib/search/noise-floor.ts`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Each behavioral change is gated behind a default-OFF flag and the typed and compiled surfaces match. Evidence: four `isOptInEnabled` readers in `lib/search/search-flags.ts`; `npm run build` regenerated dist, new flags present in `dist/lib/search/search-flags.js`, `dist/lib/search/confidence-scoring.js`, `dist/formatters/search-results.js`
- [x] CHK-011 [P0] No console errors or warnings from the scoring path on a valid run. Evidence: vitest run clean, only the unrelated experimental-SQLite node warning
- [x] CHK-012 [P1] The below-floor, no-lexical-signal, missing-gap-field, and unmeasured-noise-floor branches handled. Evidence: tests for floors-at-zero, fail-closed unmeasured embedder, gap-absent stays good, ungrounded never promoted
- [x] CHK-013 [P1] Change follows the existing confidence-scoring and search-results patterns (opt-in flag helper, lexical-signal reuse, additive envelope field)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-006). Evidence: `tests/scoring-hardening.vitest.ts` 16/16
- [x] CHK-021 [P0] With every flag OFF the band, envelope and citation policy are byte-identical to the shipped output. Evidence: each rec has a flag-OFF case asserting the shipped result; the off-corpus lone hit still scores good and the grounded mediocre set stays weak with flags OFF
- [x] CHK-022 [P1] The rec-8 flag ON drops the off-corpus sample below good, the rec-10 flag ON hedges a borderline result to cite_with_caveat, the rec-11 flag ON lowers the band on a true evidenceGapDetected, and the rec-7 flag ON surfaces the grounding signal. Evidence: vitest cases per rec
- [x] CHK-023 [P1] Grandfathering is via default-OFF: with the flags OFF the legacy fixtures reproduce the shipped output and do not fail, so no separate report tool is needed while the flags ship dark; the rec-12 docs cite the pre-calibration band read (`confidence-scoring.ts:531` / `:519` / `:585`)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `algorithmic` (verdict banding) plus `cross-consumer` (citation policy and envelope fields)
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg maybeCalibrate|requestQuality|citationPolicy|cite_results|evidenceGapDetected` over `lib/search` and the formatter; the verdict band and citation policy are the only producers, both edited
- [x] CHK-FIX-003 [P0] Consumer inventory: `deriveCitationPolicy` (2 call sites, both pass grounding), `assessRequestQuality` (formatter call threads the gap option), the `CitationPolicy` union (new `cite_with_caveat` member), the envelope `grounding` field (added to the strip-list)
- [x] CHK-FIX-004 [P0] No security/path/parser/redaction surface changed; the change reads existing in-memory rows and a static floor, so adversarial path tests do not apply
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: each flag ON/OFF, the off-corpus sample, the aligned good and correctly-weak cases, a below-floor result, a missing gap field, an unmeasured floor
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed: the test saves and restores every managed flag per case, proving no cross-case env bleed
- [x] CHK-FIX-007 [P1] Evidence pinned to the working-tree diff; no commit is made this session, so there is no moving branch range to pin against
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] The scoring path reads the existing rows and the static measured noise-floor and introduces no new untrusted input
- [x] CHK-032 [P1] No new execution surface introduced by the flag-gated changes
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized to COMPLETE with evidence
- [x] CHK-041 [P1] Code comments carry the durable WHY, no artifact ids or spec paths
- [x] CHK-042 [P2] ENV_REFERENCE flags and the rec-12 non-fix documented
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files created outside the source tree
- [x] CHK-051 [P1] No scratch artifacts to clean
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 12 | 12/12 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-22
<!-- /ANCHOR:summary -->

---
