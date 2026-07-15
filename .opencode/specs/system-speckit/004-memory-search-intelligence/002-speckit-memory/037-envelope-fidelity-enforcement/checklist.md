---
title: "Verification Checklist: Envelope-Fidelity Enforcement [template:level_2/checklist.md]"
description: "Verification Date: 2026-06-22, all P0 and P1 items verified, vitest 12/12 green"
trigger_phrases:
  - "envelope fidelity enforcement"
  - "mandatory render slots verdict"
  - "post render envelope fidelity check"
  - "pre rendered verdict fragment"
  - "requestQuality citationPolicy render"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/037-envelope-fidelity-enforcement"
    last_updated_at: "2026-07-04T17:51:01.493Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified the render mandate, fidelity check and fragment, all P0 and P1 items green"
    next_safe_action: "Run the grandfather report over a captured render corpus before the default-on flip follow-on"
    blockers: []
    key_files:
      - ".opencode/commands/memory/search.md"
      - ".opencode/commands/memory/assets/search_presentation.txt"
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/check-envelope-fidelity.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-027-envelope-fidelity-enforcement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Envelope-Fidelity Enforcement

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
- [x] CHK-003 [P1] Shipped verdict shape (`{ requestQuality: { label } }` plus `citationPolicy`) at `formatters/search-results.ts:1160-1179`, the default-OFF `SPECKIT_ENVELOPE_FIDELITY_V1` flag and the grandfather report mode all identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The fragment renders from the same `requestQualityData` and `citationPolicy` pair via `buildEnvelopeRenderFragment`, and `confidence-scoring.ts` is unchanged (git diff shows no edit)
- [x] CHK-011 [P0] No console errors or warnings from the fidelity check on a valid run (CLI smoke test exit 0)
- [x] CHK-012 [P1] Empty result, confidence-disabled, renamed-field and altered-value branches handled (vitest cases pass)
- [x] CHK-013 [P1] Change follows the existing default-OFF flag, command-contract and eval-script `.mjs` patterns (`isOptInEnabled`, sibling `run-false-confirm-eval.mjs`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-004), vitest 12/12 green
- [x] CHK-021 [P0] A render that drops a tool-shipped field fails the fidelity check in fail mode (exit 1), and lists with zero exit in grandfather report mode
- [x] CHK-022 [P1] The render contract `search.md:76,78,144` and the asset `search_presentation.txt:102-117` describe the two fields as conditionally-mandatory required-when-present with a re-emit rule behind the default-OFF flag
- [x] CHK-023 [P1] The fragment emit is default-OFF and renders both field names with verbatim verdict values, and the grandfather report mode lists a non-conforming render without failing
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class is `class-of-bug` (model-dependent verdict drop at render), addressed by the fragment plus the render mandate plus the replay check.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg requestQuality|citationPolicy` confirms the formatter derive site is the sole non-empty verdict producer, the empty-result path ships no fragment by design.
- [x] CHK-FIX-003 [P0] Consumer inventory: `envelopeRender` is additive on `data`, the memory_context re-wrap spreads `data` wholesale (passthrough test passes), and the command contract plus asset are updated.
- [N/A] CHK-FIX-004 [P0] Not a security/path/parser/redaction fix; the render-side table tests (dropped, renamed, altered, no-op faithful, nothing-to-replay) stand in for the matrix.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md and exercised: dropped, renamed, altered, faithful, empty/confidence-disabled, fail mode, grandfather mode.
- [x] CHK-FIX-006 [P1] Hostile env variant: the flag reads process env, and the flag-off byte-identical test plus flag-on test both run with explicit env set and restored.
- [x] CHK-FIX-007 [P1] Evidence pinned to the working-tree diff in implementation-summary.md, not committed (commit deferred to the user).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] The fidelity check reads a captured verdict and a rendered string and introduces no new untrusted input
- [x] CHK-032 [P1] No new execution surface, the fragment is a plain string and the check is a deterministic offline replay
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized, status set to COMPLETE, flag documented in ENV_REFERENCE.md
- [x] CHK-041 [P1] Code comments adequate, durable WHY only, no artifact ids or spec paths
- [N/A] CHK-042 [P2] README updated (if applicable), ENV_REFERENCE flag table updated instead
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only, the CLI smoke test used /tmp fixtures that were removed
- [x] CHK-051 [P1] scratch/ cleaned before completion, no stray fixtures left in the repo
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 (1 N/A, not a security/path/parser fix) |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 0/1 (1 N/A, ENV_REFERENCE updated instead) |

**Verification Date**: 2026-06-22
<!-- /ANCHOR:summary -->

---
