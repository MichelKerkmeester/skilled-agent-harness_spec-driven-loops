---
title: "Verification Checklist: Rollout Behavioral Benchmarks -- deep-research + deep-context"
description: "Pending verification checklist -- phase not started."
trigger_phrases:
  - "verification"
  - "checklist"
  - "research context behavior benchmark"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/033-deep-loop-behavior-benchmarks/003-rollout-research-context"
    last_updated_at: "2026-07-02T07:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Checklist authored; all items pending"
    next_safe_action: "Items check off as the phase executes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-003-checklist"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Rollout Behavioral Benchmarks -- deep-research + deep-context

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Predecessor gate confirmed passed before any run.
- [ ] CHK-002 [P0] Requirements in `spec.md`; approach in `plan.md`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P1] All authored contracts/docs schema-valid against the framework reference.
- [ ] CHK-011 [P1] Sibling-package conventions followed.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] This phase's full run matrix scored + classified (or, for the closing phase, no unmeasured cells).
- [ ] CHK-021 [P0] Zero fixture-isolation violations across all runs.
- [ ] CHK-022 [P1] Axis coverage / evidence-citation requirements from spec.md verified.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] This phase's scorecard/analysis outputs published per spec.md.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in contracts, configs, or analysis docs.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Baselines/provenance recorded where this phase captures them.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Run evidence in this phase folder; packages hold contracts + baselines only.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 0/5 |
| P1 Items | 5 | 0/5 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending (phase not started)
<!-- /ANCHOR:summary -->

---
