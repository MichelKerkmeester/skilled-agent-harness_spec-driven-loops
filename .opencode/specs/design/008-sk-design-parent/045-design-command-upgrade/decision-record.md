---
title: "Decision Record: design command upgrade"
description: "Decision record for treating design-command specificity as a fixture-backed command-surface upgrade rather than prose-only cleanup."
trigger_phrases:
  - "design command upgrade decision"
  - "command specificity decision"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/045-design-command-upgrade"
    last_updated_at: "2026-06-30T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Replaced template ADR with command-upgrade decision"
    next_safe_action: "Revisit the decision after command alias inventory"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-154-045-design-command-upgrade"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: design command upgrade

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: fixture-backed command specificity

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-06-30 |
| **Deciders** | sk-design maintainers |

---

<!-- ANCHOR:adr-001-context -->
### Context

The research predecessor found that design-mode selection can be made deterministic, while taste and execution quality remain advisory. Command aliases sit at the front of that deterministic path, so prose-only command cleanup would be too weak.

### Constraints

- Command aliases must not silently break established user workflows.
- The parent router remains the source of truth for design-mode boundaries.
- Replay fixtures are required before implementation completion can be claimed.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: treat command specificity as a fixture-backed routing contract.

**How it works**: command aliases are inventoried, compared with the parent router, then changed only with replay evidence. Compatibility behavior is documented alongside any tightened alias.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Fixture-backed command specificity | Testable, aligns with router, catches drift | Requires fixture maintenance | 8/10 |
| Prose-only cleanup | Fast and low effort | Does not prove command behavior | 4/10 |
| Remove broad aliases immediately | Simplifies routing | Breaks compatibility too aggressively | 3/10 |

**Why this one**: fixture-backed specificity matches the enforceable part of the research result without pretending that design quality itself can be mechanically guaranteed.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Command behavior becomes replayable instead of assumed.
- Router and command docs share the same mode vocabulary.

**What it costs**:
- Replay fixtures need maintenance when command aliases change. Mitigation: keep fixture rows small and mode-specific.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Existing alias behavior changes unexpectedly | High | replay old and new aliases before completion |
| Fixture drift hides real command behavior | Medium | regenerate or inspect fixtures during each command change |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | predecessor research identified command specificity as an enforceable boundary |
| 2 | **Beyond Local Maxima?** | PASS | alternatives compare prose cleanup, fixture-backed contracts, and alias removal |
| 3 | **Sufficient?** | PASS | replay evidence covers command behavior without overreaching into taste |
| 4 | **Fits Goal?** | PASS | command routing is part of the design-family enforcement path |
| 5 | **Open Horizons?** | PASS | fixtures support later per-mode command hardening |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Command aliases and descriptions may change after inventory.
- Replay fixtures become part of the completion gate.

**How to roll back**: revert command-doc edits and replay fixture updates together; keep the inventory notes for a narrower follow-up.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
