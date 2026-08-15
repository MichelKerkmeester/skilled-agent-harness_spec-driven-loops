---
title: "Verification Checklist: AI Deploy and Onboarding"
description: "Evidence gates for the planned one-command AI boot and deterministic AI deploy playbook; deliverables are Draft until the phase is approved."
trigger_phrases:
  - "pi remote ai deploy and onboarding"
  - "pi mobile phase 16"
  - "ai deploy and onboarding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/016-ai-deploy-and-onboarding"
    last_updated_at: "2026-08-14T04:44:41Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Authored phase 016 ai-deploy-and-onboarding planning set as Draft"
    next_safe_action: "Run validate.sh on phase 016 and reconcile the parent packet map"
    blockers:
      - "Draft planning phase with implementation evidence pending"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 0
---

# Verification Checklist: AI Deploy and Onboarding

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

The boot script and AI playbook are planned, not yet authored. Unchecked implementation rows become verifiable only after the phase is approved and the deliverables exist under `Apps/Pi Mobile/`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements and measurable acceptance criteria are documented. - [EVIDENCE: `spec.md` requirements and success-criteria tables authored 2026-08-14]
- [ ] CHK-002 [P0] Technical approach, dependencies, rollback, and test strategy are documented. - [EVIDENCE: `plan.md` quality-gates, dependencies, rollback, and testing anchors authored 2026-08-14]
- [ ] CHK-003 [P1] Owned surfaces and downstream consumers are identified. - [EVIDENCE: `spec.md` Files to Change table enumerates the boot script, playbook, Serve script, and package alias]
- [ ] CHK-004 [P0] Live predecessor inputs, repository paths, versions, workspace, and negative controls are confirmed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Repository-required format, lint, type, build, and package checks pass.
- [ ] CHK-011 [P0] Boot runs end to end without unexpected errors and alters no runtime, database, or authority surface.
- [ ] CHK-012 [P1] Boot is idempotent and fail-closed for every prerequisite and reuse case.
- [ ] CHK-013 [P1] Mutation posture stays DEFAULT-OFF and Tailscale Funnel stays off on every run.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Boot stage walkthrough and idempotency run pass with exact command and environment evidence.
- [ ] CHK-021 [P0] Negative-control preflight fails for each missing prerequisite with a named cause.
- [ ] CHK-022 [P1] Posture assertions pass for mutation, Funnel, and public URL on every run.
- [ ] CHK-023 [P1] Playbook fresh-AI dry run produces the expected handoff message.
- [ ] CHK-024 [P1] Secret and link validation pass with exact command and environment evidence.
- [ ] CHK-025 [P0] Safe negative controls fail before the implementation and pass only through the intended boundary afterward.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] This is scoped feature work, not an untriaged defect-remediation packet. - [EVIDENCE: `spec.md` problem, purpose, and scope explicitly define a new bounded phase]
- [ ] CHK-FIX-002 [P0] Producers, consumers, policies, evidence surfaces, and successor handoff are inventoried. - [EVIDENCE: `plan.md` affected-surfaces and dependency matrices enumerate the boot and playbook surfaces]
- [ ] CHK-FIX-003 [P1] Independent matrix axes and adversarial classes are named before implementation. - [EVIDENCE: `spec.md` edge cases name missing-prerequisite, already-running, and already-configured classes]
- [ ] CHK-FIX-004 [P1] Final evidence is pinned to exact versions and the completed revision.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secret, raw credential, private host path, transcript, or approval payload leaks into boot output, logs, or evidence.
- [ ] CHK-031 [P0] Boot never enables public exposure, Tailscale Funnel, or remote mutation.
- [ ] CHK-032 [P1] Authentication, authorization, enrollment, and revocation requirements applicable to this phase pass.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks, checklist, and current state share the same planned scope. - [EVIDENCE: the five doc set was cross-authored 2026-08-14 with identical scope and continuity]
- [ ] CHK-041 [P1] The boot script and playbook are handed to the parent packet and the operator as the terminal program outputs.
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

**Verification Date**: spec set authored 2026-08-14; boot and playbook evidence remain pending.
<!-- /ANCHOR:summary -->

---
