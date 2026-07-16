---
title: "Verification Checklist: Per-Doc Quality SLAs [template:level_2/checklist.md]"
description: "Verification Date: pending build. PLANNED scaffold, every item unchecked."
trigger_phrases:
  - "per doc quality sla checklist"
  - "sla verification"
  - "report only ticket"
  - "default off flag"
  - "host queue dependency"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/004-novel-research/007-novel-per-doc-quality-slas"
    last_updated_at: "2026-06-27T17:15:39.283Z"
    last_updated_by: "benchmark-test-scaffold"
    recent_action: "Added benchmark and default-off proof rows to verification"
    next_safe_action: "Verify checklist items once SLA evaluator is built"
    blockers:
      - "Host queue (freshness decay queue or B3 refinement_queue) must exist before build"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/quality/quality-loop.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/pe-gating.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Per-Doc Quality SLAs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims and hidden blocker deferrals.
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
- [ ] CHK-003 [P1] Host queue dependency identified and confirmed present
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling degrades to a no-op on evaluator or ticket-write failure
- [ ] CHK-013 [P1] Code follows the existing quality and feedback path patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-006)
- [ ] CHK-021 [P0] Threshold boundary and report-only behavior tested
- [ ] CHK-022 [P1] Edge cases tested (no-SLA doc, missing score, at-threshold boundary)
- [ ] CHK-023 [P1] Error scenarios validated (no host queue, queue write failure, duplicate ticket)
- [ ] CHK-024 [P0] Benchmark met, planted catch-rate 1.0 and swap-precision zero-false-positive over the fixture roster with exactly one report-only ticket per flagged doc and no doc mutation
- [ ] CHK-025 [P1] Benchmark reproduce path pinned to `npx vitest run quality-sla.vitest.ts` with the first-run-defect sweep specified for the live corpus
- [ ] CHK-026 [P0] `SPECKIT_QUALITY_SLA` default off, added to `ALL_SPECKIT_FLAGS` and `FLAG_CHECKERS`, checker returns false by default and `flag-ceiling.vitest.ts` stays green
- [ ] CHK-027 [P1] Runtime reversibility through `SPECKIT_QUALITY_SLA=false` keeps the save and search responses byte-for-byte unchanged
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
- [ ] CHK-031 [P0] Ticket stays inside the existing host queue and memory DB trust boundary
- [ ] CHK-032 [P1] No new external surface added
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-043 [P1] PLANNED scaffold passes `validate.sh --strict` through `validator-registry.json` and `scripts/rules/check-*.sh`
- [ ] CHK-042 [P2] README updated (if applicable)
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
| P0 Items | 14 | 0/14 |
| P1 Items | 16 | 0/16 |
| P2 Items | 1 | 0/1 |

**Verification Date**: pending build (PLANNED scaffold, not yet implemented)
<!-- /ANCHOR:summary -->
