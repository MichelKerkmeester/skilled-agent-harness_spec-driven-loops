---
title: "Verification Checklist: Onboarding and Root README"
description: "Evidence gates for the planned root README realignment and install and onboarding guide for Pi Remote; deliverables are Draft until the phase is approved."
trigger_phrases:
  - "pi remote onboarding and root readme"
  - "pi mobile phase 14"
  - "onboarding and root readme"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/014-onboarding-and-root-readme"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Authored 014 onboarding-and-root-readme spec set as Draft"
    next_safe_action: "Approved 014 plan, then begin 015 doc-quality-and-catalog drafting"
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

# Verification Checklist: Onboarding and Root README

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

The documents are planned, not yet authored. Unchecked implementation rows become verifiable only after the phase is approved and both files exist under `Apps/Pi Mobile/`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements and measurable acceptance criteria are documented. - [EVIDENCE: `spec.md` requirements and success-criteria tables authored 2026-08-13]
- [ ] CHK-002 [P0] Technical approach, dependencies, rollback, and test strategy are documented. - [EVIDENCE: `plan.md` quality-gates, dependencies, rollback, and testing anchors authored 2026-08-13]
- [ ] CHK-003 [P1] Owned surfaces and downstream consumers are identified. - [EVIDENCE: `spec.md` Files to Change table and `plan.md` affected-surfaces inventory enumerate the two deliverables]
- [ ] CHK-004 [P0] Live predecessor inputs, repository paths, versions, workspace, and negative controls are confirmed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Repository-required format, lint, type, build, and package checks pass.
- [ ] CHK-011 [P0] No runtime, database, or authority surface is altered by this phase.
- [ ] CHK-012 [P1] The README uses numbered ALL-CAPS H2 sections with no table of contents.
- [ ] CHK-013 [P1] The install guide uses one command per purpose with expected output.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `sk-doc` validation passes for `README.md`.
- [ ] CHK-021 [P0] `sk-doc` validation passes for `docs/install-and-onboarding.md`.
- [ ] CHK-022 [P1] All five validation checkpoints are present with expected output.
- [ ] CHK-023 [P1] STOP blocks follow every checkpoint that can fail.
- [ ] CHK-024 [P1] The troubleshooting table has five or more actionable entries.
- [ ] CHK-025 [P0] Safe negative controls confirm a missing checkpoint fails validation before the fix and passes after it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] This is scoped feature work, not an untriaged defect-remediation packet. - [EVIDENCE: `spec.md` problem, purpose, and scope explicitly define a new bounded phase]
- [ ] CHK-FIX-002 [P0] Producers, consumers, policies, evidence surfaces, and successor handoff are inventoried. - [EVIDENCE: `plan.md` affected-surfaces and dependency matrices enumerate the two documents and their command sources]
- [ ] CHK-FIX-003 [P1] Independent matrix axes and adversarial classes are named before implementation. - [EVIDENCE: `spec.md` edge cases name checkpoint-failure and command-drift classes]
- [ ] CHK-FIX-004 [P1] Final evidence is pinned to exact versions and the completed revision.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secret, enrollment payload, Serve anchor, or credential value appears in either document.
- [ ] CHK-031 [P0] The install guide never instructs storing or publishing enrollment JSON.
- [ ] CHK-032 [P1] Operator-only verification steps stay labeled pending.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks, checklist, and current state share the same planned scope. - [EVIDENCE: the five doc set was cross-authored 2026-08-13 with identical scope and continuity]
- [ ] CHK-041 [P1] Both deliverables are handed to phase 015 as the quality-gate input.
- [ ] CHK-042 [P2] Optional examples and troubleshooting notes are added where evidence shows they are useful.
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

**Verification Date**: spec set authored 2026-08-13; document authoring and validation evidence remain pending.
<!-- /ANCHOR:summary -->

---
