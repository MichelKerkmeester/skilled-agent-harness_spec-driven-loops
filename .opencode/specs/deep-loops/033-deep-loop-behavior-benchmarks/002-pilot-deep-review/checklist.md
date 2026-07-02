---
title: "Verification Checklist: Pilot Behavioral Benchmark -- deep-review"
description: "Pending verification checklist -- phase not started."
trigger_phrases:
  - "verification"
  - "checklist"
  - "deep review behavior benchmark"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/033-deep-loop-behavior-benchmarks/002-pilot-deep-review"
    last_updated_at: "2026-07-02T07:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Checklist authored; all items pending"
    next_safe_action: "Items check off as the phase executes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-002-checklist"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Pilot Behavioral Benchmark -- deep-review

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

- [ ] CHK-001 [P0] Phase-001 exit gate confirmed passed before any run.
- [ ] CHK-002 [P0] Requirements documented in `spec.md`; approach in `plan.md`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P1] RVB contracts schema-valid against the framework reference.
- [ ] CHK-011 [P1] Package follows the sibling-package conventions (index, frontmatter, contract format).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Axis coverage verified: E1-E4 + C1-C3 sampled; >=4 of 8 scenarios at C1/C2.
- [ ] CHK-021 [P0] 24/24 runs scored + classified (8 baseline + 16 GPT).
- [ ] CHK-022 [P0] Zero fixture-isolation violations across all runs.
- [ ] CHK-023 [P1] Consolidated-question-halt scenarios scored per REQ-003 (halt = pass, not timeout).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Pilot scorecard published with explicit 031-phase-012 comparison.
- [ ] CHK-FIX-002 [P0] Calibration retro completed; framework amendments landed before phase 003.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in contracts or run configs.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Baselines recorded in the package `baselines/` with capture provenance (date, opencode version, leg).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Run evidence in this phase's `runs/`; package holds contracts + baselines only.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 5 | 0/5 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending (phase not started)
<!-- /ANCHOR:summary -->

---
