---
title: "Verification Checklist: Flag Graduation Benchmark [template:level_2/checklist.md]"
description: "Verification Date: Pending (scaffold, not yet verified)"
trigger_phrases:
  - "flag graduation benchmark"
  - "stage 4 before and after benchmark"
  - "default off flag earn or delete"
  - "graduate flag to default on"
  - "keep off flag roadmap verdict"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/008-flag-graduation-benchmark"
    last_updated_at: "2026-07-04T17:11:54.215Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the checklist at PLANNED, all items pending verification"
    next_safe_action: "Build the benchmark driver, then verify each item with evidence"
    blockers:
      - "HARD-GATED on phase 039, the full-repo migration, being done"
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/graph/flag-graduation-benchmark.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-040-flag-graduation-benchmark"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Flag Graduation Benchmark

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
- [ ] CHK-003 [P0] Phase 039 confirmed done so the corpus is fully migrated before any measurement
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The benchmark reuses the phase 029 harness and the phase 025 false-confirm driver, no new measurement machinery
- [ ] CHK-011 [P0] No console errors or warnings, the driver and vitest run clean and typecheck clean
- [ ] CHK-012 [P1] The neutral-result, false-confirm-regression and unmigrated-corpus branches are handled and tested
- [ ] CHK-013 [P1] The driver follows the existing `scripts/graph` benchmark patterns and the sibling capability-flag style
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Acceptance criteria met, REQ-001 through REQ-005 proven by the benchmark run and the vitest
- [ ] CHK-021 [P0] Each flag is measured in isolation against the same corpus and query set
- [ ] CHK-022 [P1] A flag that raises false confirms does not graduate even with a positive retrieval delta
- [ ] CHK-023 [P1] The earners read default-ON and the kept-off flags read default-OFF with reasons recorded
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The phase is `class-of-decision`, every default-OFF program flag needs a measured before-and-after before it graduates, this measures all of them
- [ ] CHK-FIX-002 [P0] Flag-set inventory pinned, the ten listed program flags are the full set under test
- [ ] CHK-FIX-003 [P0] The dual gate is enforced, graduation requires clearing both the retrieval-or-scoring and the false-confirm bar
- [ ] CHK-FIX-004 [P0] The benchmark refuses to measure an unmigrated corpus, no misleading before-and-after is emitted
- [ ] CHK-FIX-005 [P1] Metric and decision axes listed, retrieval-or-scoring delta, false-confirm delta, neutral band, graduate, keep-off-on-regression, keep-off-on-neutral
- [ ] CHK-FIX-006 [P1] Flags are toggled in isolation per case so a leaked flag cannot attribute one flag's delta to another
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the benchmark run and the verdict docs, the prompt directs commit nothing for the scaffold so no SHA is available yet
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] The benchmark reads the existing corpus and toggles env flags, it introduces no new untrusted input
- [ ] CHK-032 [P1] No new execution surface, the driver reuses the existing harness and false-confirm driver
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/implementation-summary synchronized to the benchmark outcome with no conflicting state
- [ ] CHK-041 [P1] Code comments carry the durable why with no artifact ids or spec paths
- [ ] CHK-042 [P2] `benchmark-status.md` and `keep-off-flag-roadmap.md` written with every flag and every kept-off reason
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No temp files written into the repo, tests use OS tmpdir fixtures
- [ ] CHK-051 [P1] No scratch artifacts to clean
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending, scaffold at PLANNED, HARD-GATED on phase 039
<!-- /ANCHOR:summary -->

---
</content>
