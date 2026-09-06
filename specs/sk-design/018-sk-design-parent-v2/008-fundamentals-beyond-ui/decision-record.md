---
title: "Decision Record: Fundamentals beyond UI"
description: "Why one mode was broadened rather than a second forked, why the contract names what differs per surface, and why one ordering contest was recorded rather than won."
trigger_phrases:
  - "surface decisions"
  - "broaden not fork"
  - "per-surface differences"
  - "deck review ordering"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/008-fundamentals-beyond-ui"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded the three decisions this phase took"
    next_safe_action: "None open; the deck-review ordering belongs to another owner"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/sk-design-fundamentals/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "ADR-001: broaden the one mode rather than fork a second"
      - "ADR-002: say what differs per surface, not only what is shared"
      - "ADR-003: the deck-review ordering is recorded, not won"
---
# Decision Record: Fundamentals beyond UI

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Broaden the one mode rather than fork a second

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-06 |
| **Deciders** | Phase 8 implementer |
| **Satisfies** | REQ-001, SC-001 |

---

### Context

A slide deck, a printed page and a document layout each need the same spacing scale, type scale,
colour ramp and hierarchy pyramid that a screen does. Reading the contract rather than assuming from
names, only two of its six references are genuinely screen-only: `interaction-craft.md` and
`motion-principles.md`.

### Decision

Name the surfaces inside `sk-design-fundamentals` and say what differs, rather than adding a
deck or print mode.

### Consequences

- The shared judgment lives in one place. A fork would duplicate four systems to differentiate two
  references, and the copies would drift.
- The mode's contract is longer and has to carry a per-surface table to stay specific.

### Alternatives Rejected

- **A separate slide-deck mode.** Duplicates the spacing scale, the type scale, the colour ramp and
  the hierarchy method so that two references can be omitted.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Say what differs per surface, not only what is shared

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-06 |
| **Deciders** | Phase 8 implementer |
| **Satisfies** | REQ-001 |

---

### Context

Surface-agnostic framing that stops naming differences stops being useful. A sentence saying the
rules apply everywhere helps nobody lay out a slide.

### Decision

Carry a table naming each surface, which systems apply, what changes on it, and what does not apply
at all.

### Consequences

- A deck question gets the systems and is told to skip focus rings and touch targets.
- The table is a maintenance surface: every new reference has to be classified as shared or
  screen-only, and nothing enforces that.

### Alternatives Rejected

- **One sentence asserting the rules are surface-agnostic.** True, and useless at the point of work.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The deck-review ordering is recorded, not won

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-06 |
| **Deciders** | Phase 8 implementer |
| **Satisfies** | AC-005 |

---

### Context

`design review of this slide deck` returns `sk-code=0.9379, sk-design=0.9107`. The phrase reaches this
hub above the bar, which is what the requirement asked for, but it loses the ordering.

The pattern is stable rather than incidental. `review this slide deck` gives `sk-code=0.9285`;
`design review of this deck` gives `sk-code=0.9441`. Drop the review verb and it inverts:
`critique this slide layout` returns `sk-design=0.82` alone. So `sk-code` carries strong review
vocabulary, and the phrase is genuinely ambiguous between reviewing an artifact and reviewing the code
that renders it.

### Decision

Record it. Do not inflate this hub's weights and do not trim `sk-code`'s vocabulary.

### Consequences

- The requirement is satisfied, because the phrase reaches this hub above the bar.
- A design review of a non-code artifact still routes to the code skill first, which is a real
  question this phase is not scoped to answer.
- Whoever decides whether a design review of a non-code artifact should outrank a code review inherits
  a measured case rather than a suspicion.

### Alternatives Rejected

- **Trim `sk-code`'s review vocabulary.** Changing a hub this phase does not own, to win an ordering
  contest, is how vocabulary drifts across a fleet.
- **Inflate this hub's design-review weights.** Wins the contest by distorting the scores rather than
  by being the better answer.
<!-- /ANCHOR:adr-003 -->
