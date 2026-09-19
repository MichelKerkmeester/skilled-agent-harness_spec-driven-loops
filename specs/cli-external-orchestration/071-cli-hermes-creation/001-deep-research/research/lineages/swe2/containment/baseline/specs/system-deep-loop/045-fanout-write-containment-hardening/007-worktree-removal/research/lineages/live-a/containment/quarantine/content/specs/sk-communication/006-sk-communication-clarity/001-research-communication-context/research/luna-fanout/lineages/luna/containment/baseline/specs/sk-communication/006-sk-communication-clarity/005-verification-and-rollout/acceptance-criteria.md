---
title: "Acceptance Criteria: Phase 5: verification-and-rollout"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
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
    recent_action: "Reconciled the three phase docs with the rewritten spec"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".opencode/skills/sk-communication/benchmark/"
      - ".codex/AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-5-clarity-program"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-09-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. The `REQ` cell names the requirement in this phase's `spec.md` that the criterion serves.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a baseline captured during phase 003's setup, When the after-run executes, Then it uses the same cases, rubric and procedure | Compare the two run manifests field by field. Check the baseline's capture against phase 003's first edit. Met by T001, T002 and T003, the fields and case ids match, the prompts match word for word and the capture was taken before any rule file changed | Met | - |
| AC-002 | REQ-002 | Given the two runs, When the delta is reported, Then every dimension appears, including those that did not move | Read the delta report and check it against the rubric's dimension list. Met by T012, the recorded delta covers all seven dimensions including the three that did not move | Met | - |
| AC-003 | REQ-003 | Given a scored reply, When the judge sees it, Then no condition label is present in what the judge reads | Inspect the blinded payload the judge receives. Met by T004, nothing in the rubric names a condition to the judge and blind.mjs masks both sides under random labels | Met | - |
| AC-004 | REQ-004 | Given the release gate, When it is read, Then every named condition is observable here. The condition needing a powered blind human study is named as a gap rather than claimed | Read the gate, check each condition against the command or artifact that produces it, then search the packet for a claim that the gap was met. Met by T013 and T021, each of the five conditions names the command or artifact behind it and the powered blind human study stays a named gap | Met | - |
| AC-005 | REQ-005 | Given a runtime surface generated from the repository root doc, When it is compared with its source, Then the generated sections match | Diff each generated section against its source. Met by T015 and T017, the three synchronizer checks each report PASS | Met | - |
| AC-006 | REQ-006 | Given a deliberately broken opt-in flag, When a session starts, Then it starts cleanly at exit zero | Corrupt the flag, start a session, read the exit status and the session output. Met by T014 and T016, no mechanism was added so there is no flag to break | Met | - |
| AC-007 | REQ-007 | Given the whole packet, When recursive strict validation runs, Then the output carries an explicit PASSED line for the parent and every child folder it carries | `validate.sh --recursive --strict`, read from the output rather than the exit status. Met by T018, PASSED printed for the parent and all nine children, 10 of 10 | Met | - |
| AC-008 | REQ-008 | Given a measured regression on any dimension, When the program claims completion, Then the claim is blocked until the regression is fixed or waived by an ADR | Check the delta report against the completion claim. Met by T020, no dimension fell and no case passed before and failed after | Met | - |
| AC-009 | REQ-003 | Given the negative control case, When both conditions are scored, Then its score does not move | Read the control case's score in both recorded runs. Met by T009, the control observable is true on both sides, the weighted score 0.60 to 0.59 recorded as informational | Met | - |
| AC-010 | REQ-002 | Given a recorded result, When it is read, Then it names the provider that produced it, so an unexplained variance has somewhere to be traced to | Read every row in both run manifests for the provider field. Count the rows that lack one. Met by T010, all fourteen rows in both results files carry the provider | Met | - |
| AC-011 | REQ-002 | Given a scored row, When the delta is assembled, Then the row carries the change kind phase 004 records. No-op rows are reported apart from rewrite rows | Read each scored row against phase 004's accept record. Check the no-op and rewrite split. Met by T005 and T011, the change kind follows the phase 004 contract, no-op rows report apart and the value is n/a because no projection ran | Met | - |

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

This phase is blocked on the phases that change a rule or a contract. The statement is written when
the phase closes, naming which criteria carried it and what was consciously left out. Two rows cannot
be settled by this phase alone. AC-001 depends on a capture that belongs to phase 003's setup.
AC-011 depends on the change-kind field phase 004 adds. The unobservable condition named in AC-004
stays a gap at closure, because no run here produces that evidence.
<!-- /ANCHOR:closure -->
