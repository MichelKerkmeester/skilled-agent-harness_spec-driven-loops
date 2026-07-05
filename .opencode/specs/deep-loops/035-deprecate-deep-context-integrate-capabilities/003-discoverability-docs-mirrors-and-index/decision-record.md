---
title: "Decision Record: Discoverability Docs Mirrors And Index Cleanup"
description: "Architecture decision for cleaning standalone deep-context discoverability from the registry outward after public redirect verification."
trigger_phrases:
  - "deep-context registry decision"
  - "deep-context discoverability decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-deprecate-deep-context-integrate-capabilities/003-discoverability-docs-mirrors-and-index"
    last_updated_at: "2026-07-04T17:50:32Z"
    last_updated_by: "opencode"
    recent_action: "Accepted registry-outward cleanup decision after implementation"
    next_safe_action: "Proceed to phase 004 runtime cleanup."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-phase-003-decision"
      parent_session_id: "2026-07-04-phase-003-contract-authoring"
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Registry and advisor must agree before docs cleanup is claimed ready."
      - "Active deep-context agent mirrors should become disabled deprecation stubs."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Discoverability Docs Mirrors And Index Cleanup

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Registry-Outward Cleanup After Redirect Proof

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-04 |
| **Deciders** | User, OpenCode assistant |

---

<!-- ANCHOR:adr-001-context -->
### Context

Discoverability for standalone `deep-context` exists across registry, advisor, root docs, parent skill docs, orchestrator routing tables, and generated indexes. These surfaces are downstream of runtime behavior. If they change before the public route is closed, users can still invoke a hidden legacy route.

Direct inventory found both active deep-context mirror files and missing mirror references. Cleanup must reconcile actual files rather than preserve dead route entries.

### Constraints

- Phase 002 must prove `/deep:context` no longer starts the legacy loop first.
- `@context` remains the active exploration/retrieval agent.
- Advisor projection drift guards must pass after registry changes.
- Generated indexes should be refreshed through owner tooling, not manually edited when tooling exists.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: clean discoverability from the registry outward after phase 002 redirect proof.

**How it works**: update the mode registry first, refresh advisor projections and skill graph indexes, then update active user docs and orchestrator mirrors to match. Generated indexes and phase metadata are refreshed last so search surfaces reflect the new current-state contract.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Registry-outward after redirect proof** | Preserves source-of-truth order and behavior safety | Requires phase 002 to finish first | 9/10 |
| Docs-first cleanup | Fast visible change | Registry/advisor can still contradict docs | 5/10 |
| Advisor-only cleanup | Reduces automated recommendations | Root docs and orchestrator still advertise stale routes | 4/10 |
| Archive nested packet before discoverability cleanup | Removes many mentions quickly | Breaks fixtures/benchmarks before phase 004 verification | 3/10 |

**Why this one**: it avoids hidden callable behavior and keeps routing metadata synchronized through the existing registry/advisor contract.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Current docs, advisor, and registry stop contradicting each other.
- Missing mirror references are removed or redirected based on actual file evidence.
- Phase 004 can focus on fixtures, benchmarks, and runtime internals instead of user-facing routing.

**What it costs**:
- Cleanup waits for phase 002 proof. Mitigation: this prevents hiding an executable legacy path.
- Generated index refresh may need owner tooling discovery. Mitigation: document any unavailable tooling and keep generated-pending status explicit.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Advisor drift | High | Run routing registry drift guard. |
| Active docs still advertise standalone context | Medium | Grep active docs after edits. |
| Missing mirror paths remain | Medium | Glob mirror files and update routing tables from evidence. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Active docs and registry still mention standalone deep-context. |
| 2 | **Beyond Local Maxima?** | PASS | Considered docs-first, advisor-only, and archive-first paths. |
| 3 | **Sufficient?** | PASS | Registry/advisor/docs/mirrors/indexes cover current discoverability. |
| 4 | **Fits Goal?** | PASS | This is the required bridge between public redirect and runtime cleanup. |
| 5 | **Open Horizons?** | PASS | Later phase can archive internals without user-facing drift. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Registry and advisor projection surfaces.
- Parent skill and active root docs.
- OpenCode/Claude orchestrator routing docs.
- OpenCode/Claude deep-context agent mirror stubs.
- Generated descriptions and skill graph indexes.

**How to roll back**: revert phase 003 registry/advisor/docs/index edits, rerun advisor projection generation or drift guard, and leave phase 002 redirect behavior untouched unless phase 002 independently fails.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
