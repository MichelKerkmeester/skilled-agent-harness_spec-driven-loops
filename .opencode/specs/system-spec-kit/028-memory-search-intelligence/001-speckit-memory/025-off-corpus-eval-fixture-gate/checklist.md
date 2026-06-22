---
title: "Verification Checklist: Off-Corpus Eval Fixture and False-Confirm Gate [template:level_2/checklist.md]"
description: "Verification Date: Pending (scaffold, not yet verified)"
trigger_phrases:
  - "off corpus eval fixture"
  - "false confirm gate"
  - "kubernetes regression anchor"
  - "false good on hard negatives"
  - "off corpus hard negative class"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/025-off-corpus-eval-fixture-gate"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scoped QA for the off-corpus fixture and false-confirm gate"
    next_safe_action: "Hold for implementation, no item has been verified yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/ground-truth.json"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/ground-truth-data.js"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-false-confirm-eval.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/eval-metrics.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-025-off-corpus-eval-fixture-gate"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Off-Corpus Eval Fixture and False-Confirm Gate

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
- [ ] CHK-003 [P1] Existing confusion metric export, the six in-corpus decoys and the active embedder readability identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The driver reuses `computeCitabilityConfusionMetrics` and `falseGoodOnHardNegatives` verbatim, with no metric body re-implemented
- [ ] CHK-011 [P0] No console errors or warnings from the driver on a valid run
- [ ] CHK-012 [P1] Missing baseline, a non-numeric env value and a drifted off-corpus term branches handled
- [ ] CHK-013 [P1] Change follows the existing eval-script patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-006)
- [ ] CHK-021 [P0] Every `off_corpus` query has zero relevance rows, no fabricated targets, and the kubernetes anchor deletion-guard test fails when the anchor is removed
- [ ] CHK-022 [P1] The env unset and grandfather report mode record the rate and exit zero, the env below the rate exits non-zero, and a non-numeric env is rejected
- [ ] CHK-023 [P1] The report carries the active embedder name and the scored off-corpus terms so the qualitative good-is-wrong verdict ports across an embedder change
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] The driver reads the existing copy DB and fixture and introduces no new untrusted input
- [ ] CHK-032 [P1] The `SPECKIT_FALSE_CONFIRM_MAX_RATE` env is parsed safely and a non-numeric value is rejected rather than silently disabling the gate
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] ENV reference updated for `SPECKIT_FALSE_CONFIRM_MAX_RATE` (if applicable)
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
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending (scaffold, not yet verified)
<!-- /ANCHOR:summary -->

---
