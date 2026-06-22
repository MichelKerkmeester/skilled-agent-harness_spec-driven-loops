---
title: "Verification Checklist: Lexical-Grounding Floor and Single-Hit Corroboration [template:level_2/checklist.md]"
description: "Verification Date: Pending (scaffold, not yet verified)"
trigger_phrases:
  - "lexical grounding floor"
  - "single hit corroboration"
  - "off corpus false relevance"
  - "citation grounding floor"
  - "assess request quality corroboration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/026-lexical-grounding-floor"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scoped the QA items for the floor, the corroboration guard and the flag"
    next_safe_action: "Hold for implementation, no item has been verified yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/__tests__/search/lexical-grounding-floor.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-026-lexical-grounding-floor"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Lexical-Grounding Floor and Single-Hit Corroboration

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Lexical signal on the rows, the citation-policy derivation and the 030 off-corpus validation set identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The floor and the corroboration guard read the lexical signal already on the rows and add no new query, embedding call or DB read
- [ ] CHK-011 [P0] No console errors or warnings from the verdict path on a valid run with the flag ON or OFF
- [ ] CHK-012 [P1] Absent lexical signal and unparseable flag value branches handled, failing closed
- [ ] CHK-013 [P1] Change follows the existing `assessRequestQuality` and `search-flags.ts` patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-005)
- [ ] CHK-021 [P0] With the flag ON the kubernetes off-corpus sample scores weak or gap and returns do_not_cite_results
- [ ] CHK-022 [P1] With the flag ON a single-result zero-margin sample scores weak and a two-hit corroborated query at the same top score scores good
- [ ] CHK-023 [P1] With the flag OFF the kubernetes sample still scores good, the aligned good queries still score good with the flag ON, the weak case still scores weak, and the vitest pins a cosine profile not a literal cosine
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the changed verdict label, the citation policy, the flag and the tests.
- [ ] CHK-FIX-004 [P0] The off-corpus, lone-hit, absent-signal, flag-OFF no-op and aligned-good cases are covered as adversarial table tests.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env variant executed because the flag reads process-wide env state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] The floor reads the existing rows and the flag reads env, no new untrusted input is introduced
- [ ] CHK-032 [P1] No new execution surface introduced by the verdict change
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate, carrying the durable WHY without artifact ids
- [ ] CHK-042 [P2] Flag documented in the env reference (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending (scaffold, not yet verified)
<!-- /ANCHOR:summary -->

---
