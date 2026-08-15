---
title: "Verification Checklist: Phase 013 Capability-Evidence Unblock"
description: "Planned verification gates for dated capability evidence, supported controls, transport reachability, and fail-closed reversal."
trigger_phrases:
  - "capability-evidence-unblock"
  - "verification checklist"
  - "quality gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/013-capability-evidence-unblock"
    last_updated_at: "2026-08-13T00:00:00.000Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned capability-evidence verification gates."
    next_safe_action: "Collect evidence while executing tasks.md."
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-013-scaffold-20260813"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
# Verification Checklist: Phase 013 Capability-Evidence Unblock

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Cannot close Phase 013 until complete |
| **P1** | Required | Complete or obtain explicit user-approved deferral |
| **P2** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Five requirements and four acceptance scenarios are documented.
- [ ] CHK-002 [P0] Baseline, evidence identity, mappings, observation, and expiry are defined.
- [ ] CHK-003 [P1] Preset, merge, compiler, executor, and evaluation-strata consumers are inventoried.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Capability facts remain typed, dated, and provider/model scoped.
- [ ] CHK-011 [P0] Unknown facts are never promoted by assumption.
- [ ] CHK-012 [P1] Existing merge and compiler boundaries remain fail closed.
- [ ] CHK-013 [P1] Evidence and evaluation strata use one reproducible fixture contract.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Fresh temperature evidence compiles supported.
- [ ] CHK-021 [P0] Fresh thinking evidence compiles supported.
- [ ] CHK-022 [P0] A dispatch with the full snapshot reaches transport.
- [ ] CHK-023 [P1] Missing, stale, contradictory, unknown, and wrong-preset variants fail closed.
- [ ] CHK-024 [P1] The package gate passes from final state.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] Capability producers and compiler/executor consumers are inventoried.
- [ ] CHK-031 [P0] Provider, model, control, freshness, contradiction, and reachability axes are recorded.
- [ ] CHK-032 [P0] Missing, stale, unknown, contradictory, wrong-preset, and fallback cases are covered.
- [ ] CHK-033 [P1] Evidence is pinned to the final scoped diff.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] Capability fixtures contain no credentials or message content.
- [ ] CHK-041 [P0] Unsupported or stale controls never reach transport.
- [ ] CHK-042 [P1] Evidence provenance and expiry are validated before use.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] Spec, plan, tasks, checklist, snapshot, and strata agree.
- [ ] CHK-051 [P1] Parent map and terminal-phase navigation match final status.
- [ ] CHK-052 [P2] Public capability support guidance is updated where applicable.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] Temporary evidence capture stays in `scratch/` or an isolated temporary directory.
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
