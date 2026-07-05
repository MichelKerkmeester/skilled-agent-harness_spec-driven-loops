---
title: "Decision Record: Research Baseline And Inventory"
description: "Decision record for keeping completed research evidence inside phase 001 and treating runtime deprecation as later-phase work."
trigger_phrases:
  - "deep-context evidence decision"
  - "research baseline decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-deprecate-deep-context-integrate-capabilities/001-research-baseline-and-inventory"
    last_updated_at: "2026-07-04T17:50:32Z"
    last_updated_by: "opencode"
    recent_action: "Recorded phase 001 decision"
    next_safe_action: "Validate phase 001"
    blockers: []
    key_files:
      - "research/research.md"
      - "../spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-phase-001-decision"
      parent_session_id: "2026-07-04-phase-001-research-baseline"
    completion_pct: 70
    open_questions: []
    answered_questions:
      - "Research evidence should move to phase 001."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Research Baseline And Inventory

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep Completed Research Evidence In Phase 001

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-04 |
| **Deciders** | User, OpenCode assistant |

---

<!-- ANCHOR:adr-001-context -->
### Context

The parent packet must become a lean phase coordination root, while the completed 10-iteration research run remains durable evidence for every implementation phase. Leaving `research/` at the parent would make the parent do more than coordinate and would blur ownership of baseline evidence.

### Constraints

- Parent phase folders should keep heavy docs and research evidence in child phases.
- The research synthesis is already complete and should remain citable.
- Runtime command, agent, registry, advisor, fixture, and code cleanup must not start until evidence and baseline boundaries are stable.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Store completed research artifacts in phase 001 and keep phase 001 documentation-only except for packet organization and metadata refresh.

**How it works**: The parent phase map points to phase 001 for research and baseline evidence. Phases 002-004 consume the phase 001 synthesis and rerun fresh inventory checks before touching runtime or discoverability surfaces.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Move research into phase 001** | Keeps parent lean, gives implementation a stable evidence owner | Requires metadata refresh and path review | 9/10 |
| Leave research at parent | Minimal file movement | Conflicts with lean phase-parent policy and weakens phase ownership | 4/10 |
| Re-run research in each implementation phase | Fresh evidence per phase | Wasteful and risks conflicting syntheses | 3/10 |

**Why this one**: Phase 001 is the natural evidence boundary because it precedes every runtime and discoverability change.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Maintainers know exactly where to find the research basis.
- Parent validation can focus on phase navigation.
- Later phases can cite one synthesis instead of duplicating research notes.

**What it costs**:
- Existing research paths changed. Mitigation: metadata refresh and validation must prove the new phase-local paths are discoverable.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Path drift in research references | Medium | Keep synthesis-internal references relative to the phase root and validate docs. |
| Implementation starts before baseline probes refresh | High | Keep phase 002 start gate tied to fresh grep/advisor baseline checks. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Parent must become lean and research must stay durable. |
| 2 | **Beyond Local Maxima?** | PASS | Compared parent, phase-local, and repeated research options. |
| 3 | **Sufficient?** | PASS | Moves evidence without changing runtime behavior. |
| 4 | **Fits Goal?** | PASS | Supports phased deprecation without scope drift. |
| 5 | **Open Horizons?** | PASS | Later phases can cite or refresh evidence without parent churn. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `research/` moves under `001-research-baseline-and-inventory/`.
- Phase 001 docs own inventory classes, baseline gates, and research handoff.
- Runtime deprecation remains deferred to phase 002 and later.

**How to roll back**: Move `research/` back to the parent, restore parent references, refresh metadata, and rerun strict validation.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
