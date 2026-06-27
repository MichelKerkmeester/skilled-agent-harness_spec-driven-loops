---
title: "Verification Checklist: B1 Scheduled DQ Sweep [template:level_2/checklist.md]"
description: "Verification Date: TBD, scaffold not yet built"
trigger_phrases:
  - "scheduled dq sweep"
  - "data quality sweep"
  - "github actions schedule"
  - "post-merge hook"
  - "guarded auto-fix"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "028-memory-search-intelligence/005-spec-data-quality/002-retroactive-automation/011-scheduled-dq-sweep"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "benchmark-spec-author"
    recent_action: "Mirrored benchmark and test into checklist rows"
    next_safe_action: "Hold for implementation, no code has landed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: B1 Scheduled DQ Sweep

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
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001 report-only, REQ-002 safe-class apply, REQ-003 idempotency)
- [ ] CHK-021 [P0] Manual testing complete (manual workflow_dispatch run and a local apply on a corrupted packet)
- [ ] CHK-022 [P1] Edge cases tested (empty subtree, missing metadata file, malformed validate output, detector throw)
- [ ] CHK-023 [P1] Error scenarios validated (read-only filesystem apply, partial apply interrupted mid-batch)
- [ ] CHK-024 [P0] Benchmark thresholds pinned with reproduce commands (planted catch-rate 100 percent, safe-class conformance count 0, swap precision 1.0, idempotency, first-run real-defect floor)
- [ ] CHK-025 [P0] Named caller test present with its assertions (.opencode/skills/system-spec-kit/scripts/tests/dq-sweep.vitest.ts)
- [ ] CHK-026 [P1] Default-off proven, SPECKIT_DQ_SWEEP defaults false with a flags-off byte-identical corpus hash and an ALL_SPECKIT_FLAGS plus FLAG_CHECKERS entry
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
- [ ] CHK-031 [P0] Input validation implemented (the --roots path is scoped and stays inside the corpus)
- [ ] CHK-032 [P1] CI carries no write credential and no commit step (NFR-S01)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
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
| P0 Items | 13 | 0/13 |
| P1 Items | 12 | 0/12 |
| P2 Items | 2 | 0/2 |

**Verification Date**: TBD
<!-- /ANCHOR:summary -->
