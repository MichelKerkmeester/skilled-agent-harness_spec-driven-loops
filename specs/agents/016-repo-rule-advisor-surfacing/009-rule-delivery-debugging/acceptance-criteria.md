---
title: "Acceptance Criteria: Rule delivery debugging"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "rule delivery debugging acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/009-rule-delivery-debugging"
    last_updated_at: "2026-10-04T21:40:04Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "repo-rule-advisor-2026-10-04"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Rule delivery debugging

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** agents/016-repo-rule-advisor-surfacing/009-rule-delivery-debugging
**Level:** 2
**Status:** Complete
**Date:** 2026-10-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the prompt sets and the adopted diff, When they are searched for instructions to read a rule, Then none is found | `grep` over `experiment/` prompt files and `git show` of the adoption commit. Only the Gate 3 pre-answer matched; the adoption diff edits `AGENTS.md` | Met | - |
| AC-002 | REQ-002 | Given the result files, When each rate is read, Then it carries a denominator and a Wilson 95% interval | `results/final-scores.txt`, `final-scores-2.txt`, `control-arm-miss-rates.txt` | Met | - |
| AC-003 | REQ-003 | Given the harness runs, When rates are reported, Then Gate 5 and reply-rule miss rates appear for each executor | `rule-experiment.py score` output in `results/`, per executor in both final-scores files | Met | - |
| AC-004 | REQ-004 | Given the missed runs, When the audit is read, Then each falls in one cause class and the class counts sum to the miss count | `results/control-arm-miss-rates.txt` cause table: 5 Gate 5 and 197 reply-rule misses, classes sum to both | Met | - |
| AC-005 | REQ-005 | Given the first scored arm run, When `git log` is read, Then `preregistration.md` was committed earlier | `git log` output: 5750410dfd before the first transcript at 09:41:53, d321efd706 before 11:03:44 | Met | - |
| AC-006 | REQ-006 | Given a hook arm, When the pre-registration is read, Then the measured miss rate passed its stated threshold before the arm ran | `results/decision-2.md`: no hook arm ran, Gate 6 misses 21.1%, under 30% | Met | - |
| AC-007 | REQ-007 | Given the adoption commit, When `git log` is read, Then it is later than the commits recording the 006 and 007 window results | `git log` output | Superseded | ADR-001 |
| AC-008 | REQ-008 | Given the plan, When its decision on varying the global instructions is read, Then it names one route and the reason | `plan.md` arm instructions (REQ-008): project-level copy | Met | - |

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

The phase is planned and every criterion is open.
<!-- /ANCHOR:closure -->
