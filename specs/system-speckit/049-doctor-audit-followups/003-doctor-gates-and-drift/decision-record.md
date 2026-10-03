---
title: "Decision Record: Phase 3: doctor-gates-and-drift"
description: "Records why three of the four skill-budget text corrections moved to the description-budget packet while this phase kept the presentation row."
trigger_phrases:
  - "decision record"
  - "skill budget handoff"
  - "description budget packet"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/003-doctor-gates-and-drift"
    last_updated_at: "2026-10-03T07:00:00Z"
    last_updated_by: "build-orchestrator"
    recent_action: "Recorded the skill-budget tooling handoff"
    next_safe_action: "None; the phase is closed"
---
# Decision Record: Phase 3: doctor-gates-and-drift

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

ADR-001 to ADR-003 live in `plan.md` and are Accepted there. This file holds the decision the build added.

---

<!-- ANCHOR:adr-004 -->
## ADR-004: The skill-budget tooling text moves to the description-budget packet

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-03 |
| **Deciders** | Build orchestrator, on the parent session's instruction |

---

<!-- ANCHOR:adr-004-context -->
### Context

REQ-005 bundled four corrections: the rebuild presentation's skill-budget row, the packet label in `audit_descriptions.py`'s report title, the packet label in both `quick_validate.py` docstrings, and the hardcoded 8,000 Claude budget. The last three sit in `audit_descriptions.py` and the sk-doc validators, which `specs/sk-doc/063-description-budget` edits in the same build. Two packets editing one file at once would collide.

### Constraints
- This phase owns `doctor-rebuild-presentation.txt` but not `audit_descriptions.py` or the sk-doc scripts.
- The parent session assigned the three tooling items to the description-budget packet before this build started.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**Summary**: This phase corrects the presentation row only; the report title, the two docstrings and the budget source are handled by `specs/sk-doc/063-description-budget`.

**Details**: AC-005 is marked Superseded by this record. The presentation row now reads "Description-budget audit for skills, commands and agents", and `rg -n "Advisor budget"` over the rebuild presentation finds nothing.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Hand the three tooling items to the description-budget packet** | One owner per file; no concurrent edits | AC-005 closes here only in part | 9/10 |
| Edit all four here | AC-005 closes in one place | Collides with the packet already editing the same files | 2/10 |
| Leave all four open | No collision | Leaves a wrong presentation row this phase owns | 3/10 |

**Why Chosen**: It keeps one writer per file and still fixes the row this phase owns.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

- AC-005's three tooling checks are proven in the description-budget packet, not here.
- If that packet does not land them, the three items reopen against this phase's findings.
<!-- /ANCHOR:adr-004-consequences -->
<!-- /ANCHOR:adr-004 -->
