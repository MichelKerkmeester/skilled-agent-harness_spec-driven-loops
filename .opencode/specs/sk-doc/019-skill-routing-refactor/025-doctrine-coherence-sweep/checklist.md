---
title: "Verification Checklist: Doctrine Coherence Sweep"
description: "Planned verification for the stale-phrase purge and canonical-link additions."
trigger_phrases:
  - "doctrine coherence sweep checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/025-doctrine-coherence-sweep"
    last_updated_at: "2026-07-28T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Planned"
    next_safe_action: "Execute after operator go"
    blockers:
      - "Execution awaits operator authorization"
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "025-doctrine-coherence-sweep"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Doctrine Coherence Sweep

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Items marked only with probe output or diff evidence at execution time.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P1] All 22 findings re-verified on the execution tip; probe list derived
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-002 [P2] Edits link the contract instead of restating the matrix
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-003 [P1] Stale-phrase probes return zero repo-wide
- [ ] CHK-004 [P1] Fleet gate, freshness, doctor, suites green after regeneration
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-005 [P1] All five advisor-facing mislabels corrected; overlay restatement gone; shape trees reconciled
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-006 [P2] Prose-only diff; no executable changes
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-007 [P1] Every edited authored doc version-bumped
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-008 [P2] No new files beyond regenerated manifests
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Pending execution.
<!-- /ANCHOR:summary -->
