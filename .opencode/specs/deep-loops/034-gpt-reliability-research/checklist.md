---
title: "Verification Checklist: GPT Reliability Research Campaign"
description: "Pending verification checklist — campaign not started."
trigger_phrases:
  - "verification"
  - "checklist"
  - "gpt reliability research checklist"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/034-gpt-reliability-research"
    last_updated_at: "2026-07-03T12:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "All items verified; campaign complete"
    next_safe_action: "Implementation packet per synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "034-checklist-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: GPT Reliability Research Campaign

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

- [x] CHK-001 [P0] Angle briefs authored and seeded from 033 evidence before iteration 001.
- [x] CHK-002 [P0] Requirements in `spec.md`; approach in `plan.md`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P1] Dispatch prompt template enforces the evidence-cited output contract (file:line + tagged proposals).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Every iteration graded (productive/thin/stuck/off-target) in the iteration log with a steering decision.
- [x] CHK-021 [P0] ≥20 productive iterations OR documented early convergence (all angles dry).
- [x] CHK-022 [P1] Registry findings each carry file:line evidence and a tagged proposal.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] `research/synthesis.md` published: ranked P0/P1/P2 proposals mapped to 033 failures + verification cells.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Zero writes outside the packet tree across all iterations; no secrets in briefs or outputs.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Iteration log complete (one row per iteration incl. kills/retries); provenance (model, variant, date) recorded.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] All campaign artifacts under this packet's `research/` tree; nothing written elsewhere.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 4 | 4/4 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-03
<!-- /ANCHOR:summary -->
