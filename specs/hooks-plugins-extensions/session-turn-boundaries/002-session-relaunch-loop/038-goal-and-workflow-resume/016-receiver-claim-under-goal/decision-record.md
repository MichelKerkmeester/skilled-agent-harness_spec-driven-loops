---
title: "Decision Record: Phase 16: receiver-claim-under-goal"
description: "The close of the phase with no code change, on ten claims in ten live hops under a goal that allows other work."
trigger_phrases:
  - "receiver claim under goal decisions"
  - "claim line not built"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/016-receiver-claim-under-goal"
    last_updated_at: "2026-11-13T13:20:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded the close branch as ADR-001"
    next_safe_action: "None, the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "orchestrator-016-receiver-claim-under-goal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 16: receiver-claim-under-goal

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
### ADR-001: No claim line is appended to the Claude goal start prompt

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-13 |
| **Deciders** | The gate in `goal.md` decision D2, which the operator approved with the greenlight of 2026-11-13 |

#### Context

A Claude receiver that starts on a carried goal gets its claim instructions as start context, not in its start prompt. On 2026-11-13 five live goal hops under the `pong` goal delivered that start context every time, and the receiver claimed its note in two of the five. The `pong` goal tells the session to reply with one word and do nothing else, so a receiver that obeys it has a reason to skip the claim.

The phase therefore measured first. Decision D2 fixed the rule before any run: ten live hops under a goal that allows other work, and ten claims of ten closes the phase with no code change.

#### Decision

**Closed with no code change.** Ten counted runs under the `open` goal each logged `goal-start-claim`, and all ten hold a `claimed` line in `history.txt` and end with `status: done` (`scratch/live-open/`). The claim line after the goal slice, change A, is not built, and the rows that describe it are waived.

#### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **Close on the measure** | No change to a start prompt that works, and the goal headline stays alone in the prompt | Ten runs do not prove the claim never fails |
| Build the claim line anyway | A second route for the claim | Spends up to the 4,000-character limit of the goal condition on a line the measure does not call for, and the line is dropped exactly when the slice is long |

**Why this one**: the rule was set before the runs, and the runs met it.

#### Consequences

- `lib/goal-handover.cjs`, `skilled-loop` and the README are unchanged by this phase.
- A goal whose text forbids other work can still make a receiver skip its claim. The two-of-five count under the `pong` goal stands, and that goal is a test fixture, not a goal a packet would carry.
- One of the ten runs is weaker than the rest: its sender created the file that meets the goal before the hop. The other nine left the goal unmet.
- Four further attempts never hopped, because the sender opened a question dialog after `prepare`. They show a sender that does not hand over, which this phase does not measure. `goal.md` records them.
- If a skipped claim is seen under a goal that allows other work, change A is the first candidate, and this record is superseded by the one that builds it.

#### Implementation

**What changes**: nothing in code. The harness copy with its `open` goal mode and the ten run folders stay in this phase's `scratch/`.

**How to roll back**: delete this record, set the waived rows back to Unmet and build change A from `tasks.md` T010 to T018.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.
<!-- /ANCHOR:operator-answers-verbatim -->

---
