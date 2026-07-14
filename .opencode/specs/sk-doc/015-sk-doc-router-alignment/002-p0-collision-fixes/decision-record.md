---
title: "Decision Record: Existing-Document Quality Ownership"
description: "Records the boundary between artifact authoring validation and standalone existing-document quality work."
trigger_phrases: ["quality ownership decision", "creator validation boundary"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-router-alignment/002-p0-collision-fixes"
    last_updated_at: "2026-07-13T06:25:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored and validated the phase spec docs"
    next_safe_action: "Orchestrator gate and commit"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Existing-Document Quality Ownership
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Route Standalone Quality Actions Centrally
### Metadata
| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-13 |
| Decider | Operator brief |

<!-- ANCHOR:adr-001-context -->
### Context
README and flowchart workflows need validation for artifacts they author, but standalone audit, validation, scoring, and optimization over existing markdown belong to the quality-control workflow.

### Constraints
- Creator packets must retain their local validator gates.
- Existing-document quality queries must not be stolen by artifact creators.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision
**We chose**: creator packets own create/edit plus same-request validation; `create-quality-control` owns standalone quality actions over existing documents.

**How it works**: Remove quality verbs from creator activation boundaries, add exact handoffs, and state existing README/flowchart ownership in quality control.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|---|---|---|---|
| Target-state boundary | Preserves author gates and one quality owner | Requires explicit wording | 10/10 |
| Let each artifact packet audit itself | Local expertise | Colliding quality routes and duplicated policy | 4/10 |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences
**What improves**: Quality queries select one packet and creators retain delivery checks.

**What it costs**: Requests must distinguish existing-document quality from authoring. Mitigation: exact trigger and handoff wording.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation
Necessary: PASS. Alternatives explored: PASS. Simplest boundary: PASS. Fits routing goal: PASS. Extensible to other artifacts: PASS.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation
Edit three packet activation/handoff sections and verify four coverage queries. Rollback restores those three sections.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
