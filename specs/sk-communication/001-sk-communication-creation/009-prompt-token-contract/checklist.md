---
title: "Verification Checklist: Phase 009 Prompt Token-Contract"
description: "Planned verification gates for the versioned marker contract, synthetic example, and fixed-corpus behavior."
trigger_phrases:
  - "prompt-token-contract"
  - "verification checklist"
  - "quality gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/009-prompt-token-contract"
    last_updated_at: "2026-08-13T00:00:00.000Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned token-contract verification gates."
    next_safe_action: "Collect evidence while executing tasks.md."
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-009-scaffold-20260813"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
# Verification Checklist: Phase 009 Prompt Token-Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Cannot close Phase 009 until complete |
| **P1** | Required | Complete or obtain explicit user-approved deferral |
| **P2** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Five requirements and four acceptance scenarios are documented.
- [ ] CHK-002 [P0] The fixed-corpus baseline and unchanged wire boundary are defined.
- [ ] CHK-003 [P1] Profile, fixture, renderer, digest, and consumer dependencies are inventoried.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The profile contract and fixture remain versioned and type-safe.
- [ ] CHK-011 [P0] The adapter message-body structure remains unchanged.
- [ ] CHK-012 [P1] The marker rule and prose-only scope are rendered deterministically.
- [ ] CHK-013 [P1] No unrelated provider or fidelity behavior changes.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Every fixed-corpus marker is copied exactly once, in order, unchanged.
- [ ] CHK-021 [P0] The fixed corpus reaches 100% `restore=restored`.
- [ ] CHK-022 [P0] The revised profile produces non-trivial prose rewriting.
- [ ] CHK-023 [P1] Duplicate, missing, changed, and reordered markers remain rejected.
- [ ] CHK-024 [P1] The package gate passes from final state.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] Prompt-profile producers and consumers are inventoried.
- [ ] CHK-031 [P0] Old/new profile, marker-count, and terse-message matrix axes are recorded.
- [ ] CHK-032 [P0] No-op, marker-drop, marker-echo, reorder, and fallback cases are covered.
- [ ] CHK-033 [P1] Evidence is pinned to the final scoped diff.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] Few-shot examples contain synthetic markers only.
- [ ] CHK-041 [P0] No protected user bytes enter fixtures, logs, or evidence.
- [ ] CHK-042 [P1] Canonical and restoration boundaries remain unchanged.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] Spec, plan, tasks, checklist, and profile-version evidence agree.
- [ ] CHK-051 [P1] Parent map and adjacent-phase navigation match final status.
- [ ] CHK-052 [P2] Operator-facing profile guidance is updated if the public contract changes.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] Temporary corpus output lives only in `scratch/` or an isolated temporary directory.
- [ ] CHK-061 [P1] Task-created temporary output is removed before completion.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 items | 15 | 0/15 |
| P1 items | 11 | 0/11 |
| P2 items | 1 | 0/1 |

**Verification status**: Planned; no implementation evidence has been collected.
<!-- /ANCHOR:summary -->
