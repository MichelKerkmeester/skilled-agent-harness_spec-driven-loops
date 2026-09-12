---
title: "Acceptance Criteria: Phase 5: verification-and-rollout"
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
    packet_pointer: "sk-communication/006-sk-communication-clarity/005-verification-and-rollout"
    last_updated_at: "2026-09-12T13:00:00Z"
    last_updated_by: "opus-5-session"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Wait for phases 003 and 004, then measure against the captured baseline"
    blockers:
      - "Phase 003 has not run"
      - "Phase 004 has not run"
    key_files:
      - ".opencode/skills/sk-communication/benchmark/"
      - ".codex/AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-5-clarity-program"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: verification-and-rollout

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-communication/006-sk-communication-clarity/005-verification-and-rollout
**Level:** 2
**Status:** Draft
**Date:** 2026-09-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a baseline captured before phase 003's first edit, When the after-run executes, Then it uses the same cases, rubric and procedure | Compare the two recorded run manifests field by field | Unmet | - |
| AC-002 | REQ-002 | Given the two runs, When the delta is reported, Then every dimension appears, including those that did not move | Read the delta report and check it against the rubric's dimension list | Unmet | - |
| AC-003 | REQ-003 | Given a scored reply, When the judge sees it, Then no condition label is present in what the judge reads | Inspect the blinded payload the judge receives | Unmet | - |
| AC-004 | REQ-004 | Given the release gate, When it is read, Then every condition is observable here and the unobservable ones are named as gaps | Read the gate and check each condition against a command or artifact that produces it | Unmet | - |
| AC-005 | REQ-005 | Given a runtime surface generated from the repository root doc, When it is compared with its source, Then the generated sections match | Diff each generated section against its source | Unmet | - |
| AC-006 | REQ-006 | Given a deliberately broken opt-in flag, When a session starts, Then it starts cleanly at exit zero | Corrupt the flag, start a session, read the exit status and the session output | Unmet | - |
| AC-007 | REQ-007 | Given the whole packet, When recursive strict validation runs, Then the output carries an explicit PASSED line for the parent and all five children | `validate.sh --recursive --strict`, read from the output rather than the exit status | Unmet | - |
| AC-008 | REQ-008 | Given a measured regression on any dimension, When the program claims completion, Then the claim is blocked until the regression is fixed or waived by an ADR | Check the delta report against the completion claim | Unmet | - |
| AC-009 | - | Given the negative control case, When both conditions are scored, Then its score does not move | Read the control case's score in both recorded runs | Unmet | - |

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

**Closeable:** No

This phase is blocked on phases 003 and 004. The statement is written when the phase closes, naming
which criteria carried it and what was consciously left out.
<!-- /ANCHOR:closure -->
