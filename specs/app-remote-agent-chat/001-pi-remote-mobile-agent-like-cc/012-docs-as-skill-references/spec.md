---
title: "Feature Specification: Docs as Skill References"
description: "Plans converting the Pi Remote operator documentation set into sk-create-skill reference-template format."
trigger_phrases:
  - "pi remote docs as skill references"
  - "pi mobile phase 12"
  - "docs as skill references"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/012-docs-as-skill-references"
    last_updated_at: "2026-08-13T17:34:34Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Converted 7 operator runbooks to the reference template"
    next_safe_action: "Proceed to phase 013 code standards alignment"
    blockers:
      - "Draft planning phase; implementation evidence pending"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---

# Feature Specification: Docs as Skill References

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-08-13 |
| **Branch** | `skilled/0147-pi-remote-experience` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 12 of 15 |
| **Predecessor** | `../011-architecture-reference/spec.md` |
| **Successor** | `../013-code-standards-alignment/spec.md` |
| **Handoff Criteria** | The operator documentation set under `Apps/Pi Mobile/docs/` is converted to `sk-create-skill` reference-template format and links to the phase 011 architecture reference as the canonical system anchor |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `docs/*.md` runbooks in `Apps/Pi Mobile/` are prose documents without a consistent reference structure. Setup, security, operations, incident playbooks, rollback, release verification, and platform support each use different headings and shapes, which makes them hard to scan, hard to link, and inconsistent with the `sk-create-skill` reference standard that the documentation-and-standards uplift is applying. Without a bounded conversion phase, the set stays uneven and the phase 011 architecture reference cannot serve as one shared anchor.

### Purpose

Deliver a bounded conversion of the operator documentation set into `sk-create-skill` reference-template format, keeping the verified commands and operator-only boundaries intact.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Converting seven `Apps/Pi Mobile/docs/*.md` runbooks to the `sk-create-skill` reference-template shape (numbered ALL-CAPS H2 sections, frontmatter, H1 with a short intro, decision logic and validation checkpoints where the runbook branches).
- Preserving the verified commands, environment variables, platform tables, and operator-only verification steps.
- Cross-linking each converted runbook to the phase 011 architecture reference.

### Out of Scope
- `Apps/Pi Mobile/docs/architecture.md` conversion, which phase `011-architecture-reference` owns.
- The root `README.md` and code-folder READMEs, owned by phases `014` and `010`.
- The doc-quality scoring gate and feature catalog, owned by phase `015`.
- Any change to app source code, tests, or configuration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `Apps/Pi Mobile/docs/setup.md` | Converted | Install, deploy, enroll, open, and PWA-install reference |
| `Apps/Pi Mobile/docs/security.md` | Converted | Threat model, ingress, auth, approval, containment, redaction, retention reference |
| `Apps/Pi Mobile/docs/operations.md` | Converted | Runtime config, migrations, retention, devices, revocation, mutation switch, push reference |
| `Apps/Pi Mobile/docs/incident-playbooks.md` | Converted | Indeterminate mutation, lease, device, sync, and push incident playbooks reference |
| `Apps/Pi Mobile/docs/rollback.md` | Converted | Rollback scope, drill evidence, restore limits, smoke checks reference |
| `Apps/Pi Mobile/docs/release-verification.md` | Converted | Machine gates, numeric thresholds, rollout readiness reference |
| `Apps/Pi Mobile/docs/platform-support.md` | Converted | PWA install, offline, notification, and supported-device matrix reference |
| `Apps/Pi Mobile/docs/architecture.md` | Owned by phase 011 | Canonical system anchor; linked from every converted runbook |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All seven runbooks use the reference shape. | Each converted file has reference frontmatter, an H1 with a short intro, and numbered ALL-CAPS H2 sections. |
| REQ-002 | Verified commands are preserved exactly. | Every command that was tested in the source runbook remains present and unchanged in the converted file. |
| REQ-003 | Operator-only boundaries stay explicit. | Checks that require a live Tailscale, Pi, containment, or iOS environment remain labeled as operator-verification pending. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Runbooks link to one architecture anchor. | Each converted runbook references `docs/architecture.md` rather than restating system structure. |
| REQ-005 | Decision logic is explicit. | Mutation, incident, and rollback runbooks express branch conditions as decision logic or validation checkpoints. |
| REQ-006 | No packet history enters durable docs. | Converted docs cite current files and commands, not spec or phase numbers, per the evergreen-packet-id rule. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An operator can complete setup, operations, incident, and rollback flows from the converted runbooks on the supported host.
- **SC-002**: A reviewer can trace every converted runbook to the architecture anchor and to source or command evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 011 architecture anchor | Runbooks cannot cross-link before it lands | Sequence 012 after 011; link text is planned here |
| Risk | Conversion loses verified commands | Operator outage or data loss | Diff each converted file against the source runbook command set |
| Risk | Uncertainty collapsed into certainty | False operator confidence | Keep `operator-verification pending` labels verbatim |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- Converted runbooks stay scannable with short reference sections.

### Security
- No secret, enrollment payload, Serve anchor, or credential path enters converted docs.

### Reliability
- Every failure state keeps the named fallback, such as the Attention Inbox, in the converted platform support reference.

---

## L2: EDGE CASES

### Data Boundaries
- Environment variable tables, platform matrices, and threshold tables convert as tables without prose duplication.

### Error Scenarios
- Command conflict: preserve the source runbook command and flag the diff.
- Missing architecture link: block handoff until the phase 011 anchor exists.

### State Transitions
- The converted docs are the implementation deliverable; this phase is a Draft plan.

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Seven runbook conversions and one shared anchor dependency |
| Risk | 9/25 | Documentation-only surface |
| Research | 10/20 | Source runbooks read; reference template confirmed |
| Multi-Agent | 5/15 | Single owner by default |
| Coordination | 10/15 | Depends on phase 011; feeds phase 015 |
| **Total** | **48/100** | **Level 2** |

---

## 10. OPEN QUESTIONS

- Which exact commands does implementation preflight confirm as tested in the source runbooks?
- Does the operator defer any P1 conversion after seeing the converted set?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent phase map**: [../spec.md](../spec.md)
- **Implementation plan**: [plan.md](plan.md)
- **Task ledger**: [tasks.md](tasks.md)
- **Verification checklist**: [checklist.md](checklist.md)
- **Current state**: [implementation-summary.md](implementation-summary.md)
