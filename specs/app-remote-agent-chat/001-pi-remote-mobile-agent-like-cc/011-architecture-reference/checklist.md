---
title: "Verification Checklist: Architecture Reference"
description: "Evidence gates for the planned single system architecture reference for Pi Remote; deliverable is Draft until the phase is approved and authored."
trigger_phrases:
  - "pi remote architecture reference"
  - "pi mobile phase 11"
  - "architecture reference"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/011-architecture-reference"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Authored 011 architecture-reference spec set as Draft"
    next_safe_action: "Approved 011 plan, then begin 012 docs-as-skill-references drafting"
    blockers:
      - "Draft planning phase; implementation evidence pending"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 0
---

# Verification Checklist: Architecture Reference

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot enable dependent capability or complete the phase |
| **[P1]** | Required | Must pass or receive explicit operator deferral |
| **[P2]** | Optional | May defer with owner and reason |

The reference is planned, not yet authored. Unchecked implementation rows become verifiable only after the phase is approved and `Apps/Pi Mobile/docs/architecture.md` is rewritten.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements and measurable acceptance criteria are documented. - [EVIDENCE: `spec.md` requirements and success-criteria tables authored 2026-08-13]
- [ ] CHK-002 [P0] Technical approach, dependencies, rollback, and test strategy are documented. - [EVIDENCE: `plan.md` quality-gates, dependencies, rollback, and testing anchors authored 2026-08-13]
- [ ] CHK-003 [P1] Owned surfaces and downstream consumers are identified. - [EVIDENCE: `spec.md` Files to Change table and `plan.md` affected-surfaces inventory enumerate the four subsystems and five invariants]
- [ ] CHK-004 [P0] Live predecessor inputs, repository paths, versions, workspace, and negative controls are confirmed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Repository-required format, lint, type, build, and package checks pass.
- [ ] CHK-011 [P0] No runtime, database, or authority surface is altered by this phase.
- [ ] CHK-012 [P1] Every module, function, and envelope claim is traceable to source.
- [ ] CHK-013 [P1] The reference introduces no invented transport, endpoint, or capability.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Reference extraction passes with a valid DQI and quality band.
- [ ] CHK-021 [P0] Link and reference validation passes for `docs/architecture.md`.
- [ ] CHK-022 [P1] Source-to-doc trace check passes for the authority loop, envelope, redaction, and containment claims.
- [ ] CHK-023 [P1] Envelope contract diff against `packages/pi-rpc-protocol/src/` shows no drift.
- [ ] CHK-024 [P1] Operator-unverified boundaries are marked explicitly.
- [ ] CHK-025 [P0] Safe negative controls confirm a dropped invariant fails the trace check before the fix and passes after it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] This is scoped feature work, not an untriaged defect-remediation packet. - [EVIDENCE: `spec.md` problem, purpose, and scope explicitly define a new bounded phase]
- [ ] CHK-FIX-002 [P0] Producers, consumers, policies, evidence surfaces, and successor handoff are inventoried. - [EVIDENCE: `plan.md` affected-surfaces and dependency matrices enumerate the four subsystems and the phase 012 boundary]
- [ ] CHK-FIX-003 [P1] Independent matrix axes and adversarial classes are named before implementation. - [EVIDENCE: `spec.md` edge cases name envelope, authority-loss, and replay-barrier classes]
- [ ] CHK-FIX-004 [P1] Final evidence is pinned to exact versions and the completed revision.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secret, raw credential, private host path, transcript, or approval payload leaks into the reference.
- [ ] CHK-031 [P0] The reference never renders Serve anchors or enrollment flows verbatim.
- [ ] CHK-032 [P1] Containment and redaction boundaries match `deploy/containment/pi-remote.sb` and `src/store/redaction.ts`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks, checklist, and current state share the same planned scope. - [EVIDENCE: the five doc set was cross-authored 2026-08-13 with identical scope and continuity]
- [ ] CHK-041 [P1] The reference is handed to phases 012-015 as the canonical system anchor.
- [ ] CHK-042 [P2] Optional diagrams and comparison tables are added where evidence shows they are useful.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temporary output is confined to approved test or scratch locations.
- [ ] CHK-051 [P1] Final scoped status contains no task-created residue or unrelated edit.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Planning P0/P1 | 7 | 7/7 |
| Product P0 | 9 | Implemented; deliverable evidence pending |
| Product P1 | 7 | Implemented; deliverable evidence pending |
| Optional | 2 | 0/2 |

**Verification Date**: spec set authored 2026-08-13; reference authoring and trace evidence remain pending.
<!-- /ANCHOR:summary -->

---
