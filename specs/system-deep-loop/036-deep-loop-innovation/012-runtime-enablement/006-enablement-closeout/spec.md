---
title: "Feature Specification: Enablement Closeout"
description: "Reconcile epic status against the enabled system and document what now exists: feature catalog, manual-testing playbook, and mode-facing docs that describe the gateway rather than direct appends."
trigger_phrases:
  - "enablement closeout"
  - "epic status reconcile"
  - "document the enabled system"
importance_tier: "important"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/006-enablement-closeout"
    last_updated_at: "2026-08-19T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Authored the closeout contract"
    next_safe_action: "Wait for the whole-system gate verdict"
    blockers:
      - "Predecessor 005-whole-system-gate must pass first"
    key_files:
      - ".opencode/skills/system-deep-loop/feature-catalog"
      - ".opencode/skills/system-deep-loop/manual-testing-playbook"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Enablement Closeout

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/006-enablement-closeout |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-08-19 |
| **Owner skill** | system-deep-loop |
| **Authority posture** | No runtime change; documentation and status only |

> Phase adjacency under `012-runtime-enablement` (navigation order): predecessor `005-whole-system-gate`;
> successor `007-effect-enablement`. The successor is a late-allocated dependency phase, not a step that
> runs after closeout — phase numbers are allocation order, and `007-effect-enablement` is a prerequisite
> of the flip in `002`/`003`.
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After enablement, the epic's documentation describes a system that no longer exists. Packets across `036` record a
dark substrate, legacy-authoritative modes, and a cutover that was never wired. The feature catalog and manual-testing
playbook describe the pre-enablement runtime. Mode-facing documents still frame direct appends as normal.

Documentation that describes a superseded system is worse than absent documentation, because it is trusted. Someone
reading it will conclude the substrate is dark and act accordingly.

### Purpose

Make the written record match the built system, and reconcile status across the epic so no packet claims a state that
enablement has invalidated.

### Calibration

> **Severity calibration (carry verbatim, do not re-escalate).** In every confirmed case the actor is the operator or
> a stale local file, not a remote attacker. Read every P0 and P1 below as **cutover-readiness and robustness risk,
> not breach risk**.

### Non-Goals

- Runtime changes of any kind.
- Rewriting the epic's history. Superseded packets are marked superseded, not edited to pretend they always said this.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Reconcile status across `036` packets whose claims enablement has changed, including the cutover packets that assumed
  a boundary existed.
- Update the feature catalog to describe the enabled runtime.
- Update the manual-testing playbook so its procedures exercise the gateway path.
- Update mode-facing documents that still describe direct appends as normal.
- Record what the gate measured, so the closeout points at evidence rather than restating it.

### Out of Scope

- Any runtime code change.
- Any authority change.
- New features.

### Affected Surfaces

| Surface | Change |
|---------|--------|
| `036` packet statuses | Reconciled to the enabled reality |
| `feature-catalog/` | Describes the enabled runtime |
| `manual-testing-playbook/` | Procedures exercise the gateway |
| Mode-facing docs | No longer frame direct appends as normal |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: No `036` packet claims a completion or authority state that enablement has invalidated.
- **REQ-002**: Packets superseded by enablement are marked superseded with a pointer to what superseded them.
- **REQ-003**: The feature catalog describes the enabled runtime, including the gateway and the projection.
- **REQ-004**: The manual-testing playbook's procedures exercise the gateway path rather than direct file writes.
- **REQ-005**: No mode-facing document presents a direct append as a normal operation.
- **REQ-006**: The closeout points at the gate receipt rather than restating its contents.
- **REQ-007**: No runtime code or authority record changes in this phase.
- **REQ-008**: Every claim in the updated documents is checked against the built system, not against the plan.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A sweep of `036` finds no packet claiming an invalidated state.
- **SC-002**: Superseded packets carry a supersession pointer.
- **SC-003**: The feature catalog's runtime description matches the code, verified by spot-checking named symbols.
- **SC-004**: A playbook procedure, followed literally, exercises the gateway.
- **SC-005**: A search finds no mode-facing document presenting a direct append as normal.
- **SC-006**: `validate.sh --recursive --strict` over `036` reports Errors: 0.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Consequence | Mitigation |
|------|-------------|------------|
| Documentation is written from the plan rather than the build | The record is confidently wrong in a new way | REQ-008 requires each claim to be checked against the built system |
| A superseded packet is edited rather than marked | The epic's history stops being auditable | REQ-002 marks supersession; it does not rewrite |
| Status reconciliation is done by search-and-replace | Packets get a status that does not match their contents | Each status change is made against that packet's own evidence |
| Closeout restates the gate | Two sources of truth for one verdict, drifting apart | REQ-006 points at the receipt instead |

**Dependencies**: `005-whole-system-gate` complete with a recorded verdict.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None requiring an operator.
<!-- /ANCHOR:questions -->
