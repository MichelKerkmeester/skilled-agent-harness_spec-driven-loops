---
title: "Decision Record: goal binding record and launcher"
description: "Why the relaunch CLI owns the hand-over note's goal_packet field and rewrites it on every prepare and keep, instead of keeping a value a sender wrote by hand."
trigger_phrases:
  - "goal packet field ownership"
  - "goal_packet decision record"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/025-goal-binding-record-and-launcher"
    last_updated_at: "2026-10-25T00:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded why the CLI owns goal_packet and why AC-002 is superseded"
    next_safe_action: "None for this phase; the receiver side is phases 26 and 27"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs"
      - ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-025-goal-binding-record-and-launcher"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: goal binding record and launcher

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The relaunch CLI owns the goal_packet field

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-25 |
| **Deciders** | Operator default, applied by the build session after review |

---

<!-- ANCHOR:adr-001-context -->
### Context

The first build wrote `goal_packet` once and then kept whatever the note held. A value a sender wrote by hand was validated, and `prepare` or `keep` refused a bad one with exit 2. A review found two problems with that. A note prepared again after its goal ended still handed on the dead goal, because the field was never rewritten. And receivers now bind the field as their own goal, so any value the CLI did not prove hands a goal to a session that should not have one.

### Constraints

- The field is the receiver's only signal that the sender had a goal, so it must say what the sender's goal is now.
- A hand-over must never fail for want of a goal. A bad field should not block the hop.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: the CLI re-resolves `goal_packet` on every `prepare` and `keep` and writes the result, removing the field when the sender has no provable goal.

**How it works**: the resolver reads the sender runtime's own goal state. The CLI replaces the field with what it finds, removes it when it finds nothing, and leaves an unchanged note alone. A value written by hand is replaced or removed like any other, so a bad value no longer exits 2. `claim` and `consume` still apply the same path check before they use a field.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **CLI owns the field, rewritten each time** | The field always matches the sender's goal now; a dead goal is never handed on | A sender can no longer name a packet by hand | 9/10 |
| Keep a hand-written value, refuse a bad one | A sender can name a packet the resolver cannot see | A stale or unproven value reaches a receiver that binds it | 4/10 |

**Why this one**: receivers bind the field without asking, so only a value the CLI proved from the sender's own goal state is safe to pass on.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A note prepared again after its goal ended carries no packet.
- A sender with no provable goal, including every Codex sender today, hands on no packet.

**What it costs**:
- A Codex sender never hands on a goal until its goal store can be read and matched. Mitigation: the receiver still has the fenced goal slice the goal posture rule sends.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An operator expects a hand-written packet to survive | L | The README and the handoff command say the CLI owns the field |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The review reproduced a dead goal handed on after a second prepare |
| 2 | **Beyond Local Maxima?** | PASS | Keeping and validating a hand-written value was the first build and was compared |
| 3 | **Sufficient?** | PASS | One rule, applied at the two writers, covers both review findings |
| 4 | **Fits Goal?** | PASS | The phase exists to tell the receiver whether the sender had a goal |
| 5 | **Open Horizons?** | PASS | A Codex reader can be added later without changing the rule |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `relaunch-core.cjs`: the resolver fails closed, and `updateFrontmatter` treats `null` as removing a field.
- `session-relaunch.cjs`: `prepare` and `keep` replace or remove the field on every call.
- AC-002, which required exit 2 for a bad value, is superseded by AC-006.

**How to roll back**: revert the fix commit for this phase. The earlier commit's write-once behavior and its AC-002 come back with it.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
