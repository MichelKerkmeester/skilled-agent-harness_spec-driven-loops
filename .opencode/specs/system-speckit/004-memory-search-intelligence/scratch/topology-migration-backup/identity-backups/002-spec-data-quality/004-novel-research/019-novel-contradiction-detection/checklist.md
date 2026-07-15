---
title: "Verification Checklist: Novel Cross-Doc Contradiction and Staleness Detection [template:level_2/checklist.md]"
description: "QA checklist for the report-only contradiction detector. Items stay unchecked because this packet is a scaffold the build has not started."
trigger_phrases:
  - "contradiction detection"
  - "staleness detection"
  - "cross-doc consistency"
  - "llm entailment scoring"
  - "candidate-pair gating"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-spec-data-quality/004-novel-research/019-novel-contradiction-detection"
    last_updated_at: "2026-06-27T17:15:37.645Z"
    last_updated_by: "benchmark-test-author"
    recent_action: "Added benchmark and default-off rows"
    next_safe_action: "Build the detector after deps land"
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
# Verification Checklist: Novel Cross-Doc Contradiction and Staleness Detection

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

All items below stay unchecked. This packet is a planned scaffold and the detector build has not started.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available (026-shared-safe-fix-engine and 011-scheduled-dq-sweep have landed)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented (scorer timeout errors the pair and the fan-out continues)
- [ ] CHK-013 [P1] Code follows project patterns (one detector entry registered with `fixClass: none`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-006 in spec.md)
- [ ] CHK-021 [P0] Manual testing complete (a flag-on report run surfaces a real cross-doc conflict)
- [ ] CHK-022 [P1] Edge cases tested (no-entity doc skipped, self-pair filtered, empty subtree clean, deleted target skipped)
- [ ] CHK-023 [P1] Error scenarios validated (scorer timeout errored and continued, empty catalog degrades to edges-only)
- [ ] CHK-024 [P0] Benchmark met: `plantedMismatchCatchRate == 1.0` on the planted fixture corpus and a `0` false-positive floor on the clean control (scripts/tests/contradiction-detector.vitest.ts)
- [ ] CHK-025 [P0] Default-off no-regress: a default run is byte-identical to an explicit `SPECKIT_CONTRADICTION_DETECTOR=false` run and flag-ceiling.vitest.ts holds with the flag in ALL_SPECKIT_FLAGS and FLAG_CHECKERS
- [ ] CHK-026 [P1] The named test file asserts the pair-gate bound, the verdict-to-finding fold and the scorer-timeout-continue path (scripts/tests/contradiction-detector.vitest.ts)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented (`fixClass: none` keeps the detector report-only with no write path to the corpus)
- [ ] CHK-032 [P1] Auth/authz working correctly (the detector reads the catalog and graph read-only and mutates nothing)
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
| P0 Items | 14 | 0/14 |
| P1 Items | 14 | 0/14 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet verified (PLANNED scaffold)
<!-- /ANCHOR:summary -->
