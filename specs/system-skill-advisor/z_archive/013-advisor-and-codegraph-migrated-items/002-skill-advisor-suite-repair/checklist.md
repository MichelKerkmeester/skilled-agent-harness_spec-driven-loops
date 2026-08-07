---
title: "Verification Checklist: Skill-advisor test-suite repair: fix pre-existing scorer/hook failures and align brief-assertion tests with the fable-5 governor"
description: "Verification Date: 2026-06-15"
trigger_phrases:
  - "verification checklist skill advisor repair"
  - "deep-loop merge test verification"
  - "governor brief checklist"
  - "name"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/013-advisor-and-codegraph-migrated-items/002-skill-advisor-suite-repair"
    last_updated_at: "2026-06-15T19:00:00Z"
    last_updated_by: "opus-agent"
    recent_action: "All checklist items verified; suite at 0 failed/553 after second-pass fixes"
    next_safe_action: "None — complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:eed3ec5f4dd583b35b357a24514f16534811a6fe418dd63dd74edddf5bd8b2ba"
      session_id: "027-003-004-skill-advisor-suite-repair"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Skill-advisor test-suite repair: fix pre-existing scorer/hook failures and align brief-assertion tests with the fable-5 governor

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001..005 present
- [x] CHK-002 [P0] Technical approach defined in plan.md — phases + affected surfaces filled
- [x] CHK-003 [P1] Dependencies identified and available — python3 + built dist confirmed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes build — `npm run build` exits 0
- [x] CHK-011 [P0] No new console errors/warnings — final re-run shows 0 failed / 548 passed / 5 skipped (553)
- [x] CHK-012 [P1] Error handling preserved — disambiguation falls back to legacy id when merged node absent
- [x] CHK-013 [P1] Follows project patterns — test helpers/constants updated in place; no new abstractions
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Acceptance criteria met — REQ-001..003,006,007 verified (build clean; scorer + governor green; settings-parity 41/41; graph validate-only exit 0)
- [x] CHK-021 [P0] Verification complete — full `npx vitest run`: 0 failed / 553 (was 61, then 36)
- [x] CHK-022 [P1] Edge cases tested — token-cap excludes governor suffix; ambiguous brief length check excludes suffix
- [x] CHK-023 [P1] Error scenarios validated — Python-required gate fails loudly; merged-id fallback exercised
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Findings classed — scorer fixtures/corpora/ledger = cross-consumer rename; disambiguation = algorithmic; category allowlist = class-of-bug; governor briefs = cross-consumer.
- [x] CHK-FIX-002 [P0] Same-class producer inventory done — `rg deep-research|deep-review|deep-ai-council` across lib/scorer, scripts, tests; only `deep-loop-workflows` routes.
- [x] CHK-FIX-003 [P0] Consumer inventory done — `EXPECTED_ADVISOR_CONTEXT`/`expectedBrief` consumers (renderer, brief-producer, 3 hook tests) all updated.
- [x] CHK-FIX-004 [P0] Margin/algorithm fix verified — probe shows deep-vs-code-review gap restored to 0.10 for all 5 SA-011/012 prompts.
- [x] CHK-FIX-005 [P1] Matrix axes listed — corpus(labeled,harder) x scorer(python,ts); ledger rules a/b/c/d/e all pass.
- [x] CHK-FIX-006 [P1] Process-state variant — ledger/parity tests run under frozen native env + forced-local Python; launcher flake noted as pre-existing parallel-state.
- [x] CHK-FIX-007 [P1] Evidence pinned — counts from captured baseline vs post-fix full runs on this working tree.
- [x] CHK-FIX-008 [P0] Second-pass diagnoses re-verified against real code — settings-parity confirmed reading `settings.local.json` (no hooks) while committed `settings.json` carries all four events; graph-health confirmed SYMMETRY gates (read `validate_edge_symmetry` + CLI error-count block) while WEIGHT-BAND/PARITY do not.
- [x] CHK-FIX-009 [P0] Preserved guards intact — settings-parity retains the four events, single-element matcher arrays, matcher string, no top-level bash, inner type command, claude-adapter fragments, no copilot/codex, SessionStart worktree-guard, Stop async + 10s floor; only the absolute-anchor/pinned-node assertion was relaxed to the portable form.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — governor is a fixed disposition string, not credentials
- [x] CHK-031 [P0] Input validation intact — prompt-boundary sanitization in render.ts unchanged
- [x] CHK-032 [P1] No auth surface touched — N/A for this package
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — all reflect the full 18 changed files and the 61 to 36 to 0 counts
- [x] CHK-041 [P1] Code comments adequate — durable WHY added at disambiguation + category allowlist + settings-parity portable-form rationale; no ephemeral ids (baseline grep clean)
- [x] CHK-042 [P2] README updated — not applicable
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — ad-hoc probes lived in /tmp, removed
- [x] CHK-051 [P1] scratch/ cleaned before completion — throwaway ledger-generator test deleted
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 13 | 13/13 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-15
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
