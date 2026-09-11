---
title: "Acceptance Criteria: Phase 7: progress-updates"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/009-turn-closeout-next-steps/007-progress-updates"
    last_updated_at: "2026-09-11T18:51:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Ran the four decision tests and recorded the AGENTS.md-row verdict"
    next_safe_action: "Operator applies the drafted AGENTS.md bullet or overrides the verdict"
    blockers: []
    key_files:
      - "specs/agents/009-turn-closeout-next-steps/007-progress-updates/research/research.md"
      - "repo-rules/communication.md"
      - "repo-rules/handoff-and-questions.md"
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Apply the drafted AGENTS.md section 3 bullet, or override the verdict toward a rule file as in phase 001?"
    answered_questions:
      - "Spec folder: phase child 007-progress-updates under agents/009-turn-closeout-next-steps"
      - "Verdict: AGENTS.md-row, decided by the four-part refusal test part one"
      - "HVR in a reply: adopt phase 006's answer unchanged rather than re-opening it"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 7: progress-updates

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** agents/009-turn-closeout-next-steps/007-progress-updates
**Level:** 2
**Status:** Complete
**Date:** 2026-09-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the four decision tests, When each is run in order, Then each answer cites `file:line` evidence rather than recall | research/research.md:40, research/research.md:79, research/research.md:107, research/research.md:183 | Met | - |
| AC-002 | REQ-002 | Given four answers, When the routing table is applied, Then exactly one verdict is named with its deciding test | research/research.md:312 names `AGENTS.md-row`; research/research.md:314 names the four-part test part one | Met | - |
| AC-003 | REQ-003 | Given the research is complete, When `git diff` over the two root documents is grepped for this phase's vocabulary, Then nothing matches, so no change in them came from this phase | implementation-summary.md:122 records the observed result and names the pre-existing phase 003 and 004 diff | Met | - |
| AC-004 | REQ-004 | Given three pieces of prior work, When the relationship is stated, Then any duplication is named rather than glossed | research/research.md:223, research/research.md:244, research/research.md:262, research/research.md:266 | Met | - |
| AC-005 | REQ-005 | Given ten rule files, When candidate phrases are checked, Then no phrase collides | research/research.md:295 records 182 phrases and an empty `uniq -d` | Met | - |
| AC-006 | REQ-006 | Given a non-file verdict, When the replacement is drafted, Then the operator can apply it in one move | research/research.md:331 carries the exact bullet and its placement | Met | - |
| AC-007 | SC-001 | Given the finished packet, When `validate.sh --strict` runs, Then it prints an explicit `RESULT: PASSED` | implementation-summary.md:117 records the observed run and its result | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

AC-001 and AC-002 carried the packet: the four tests were run before anything was drafted, and they
returned `AGENTS.md-row` rather than a rule file. What was consciously left out is the authoring and
wiring work, which phases 003 and 004 did for the tenth rule and which this verdict does not admit.
The `AGENTS.md` bullet is drafted and deliberately not applied, because it is new normative content
rather than a pointer and this packet may only make pointer edits there.
<!-- /ANCHOR:closure -->
