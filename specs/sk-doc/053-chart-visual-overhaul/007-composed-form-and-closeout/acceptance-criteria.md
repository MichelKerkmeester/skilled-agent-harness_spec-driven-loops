---
title: "Acceptance Criteria: The composed form and the packet closeout"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "composed form acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/053-chart-visual-overhaul/007-composed-form-and-closeout"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the closure gate for the composed form and the closeout"
    next_safe_action: "Put the catalog decision to the operator"
    blockers:
      - "The catalog decision in spec section 10 is unanswered"
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-doc/sk-create-chart/references/catalog.md"
      - ".opencode/skills/sk-doc/sk-create-chart/changelog"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-007-composed-form-and-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the catalog gains a bar and line form with a second scale"
      - "Which family the new row belongs to"
      - "Whether any form is dense enough to need a range window"
    answered_questions:
      - "The second scale appears only when the two magnitudes differ by an order"
      - "An assertion nobody watched fail is not trusted"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: The composed form and the packet closeout

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the phase may close. A phase is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in a decision record.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/053-chart-visual-overhaul/007-composed-form-and-closeout
**Level:** 2
**Status:** Planned
**Date:** 2026-09-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the catalog addition is the operator's call, When a row is proposed, Then the operator answers before the index changes | The answer is recorded in `goal.md` under the progress table | Unmet | - |
| AC-002 | REQ-002 | Given the corpus holds twenty forms, When the composed form lands, Then the check reports twenty-one and resolves the catalog in both directions | The corpus check output reports `chart forms under assets/templates: 21` and `catalog` at zero failures | Unmet | - |
| AC-003 | REQ-002 | Given the form was authored through the documented workflow, When the check runs, Then it satisfies every contract rule without an exception | The full check output is read, and no rule reports a failure against the new file | Unmet | - |
| AC-004 | REQ-003 | Given two series whose maxima differ by an order, When the form draws, Then the rate gets its own axis on the right | A fixture at that spread is opened, and the right axis is present | Unmet | - |
| AC-005 | REQ-003 | Given two series within an order of each other, When the form draws, Then one axis carries both | A fixture at that spread is opened, and the right axis is absent | Unmet | - |
| AC-006 | REQ-004 | Given phases 004, 005 and 006 introduced invariants, When this phase closes, Then each has an assertion in the corpus check | The written inventory from task T003 is read against the check's own list of named checks | Unmet | - |
| AC-007 | REQ-005 | Given an assertion nobody has seen fail is a comforting name, When each new assertion lands, Then it is watched failing on a mutated fixture and the mutation is reverted | Each of the eight failure runs and the final green run are recorded in the implementation summary | Unmet | - |
| AC-008 | REQ-006 | Given a new form and eight new assertions, When the corpus check runs with `--render` from the final state, Then it prints `RESULT: PASSED` | The check output is read directly rather than through a pipe | Unmet | - |
| AC-009 | REQ-007 | Given the six family deliveries are meant to demonstrate the headline rule, When each is read against it, Then a verdict is recorded for every one, including the ones that need no change | The six verdicts are in the phase record, each quoting the headline it judged | Unmet | - |
| AC-010 | REQ-008 | Given seven files carry a version string, When the bump lands, Then all seven read the same string | `grep -rn '^version:'` over the packet returns one distinct value | Unmet | - |
| AC-011 | REQ-008 | Given six phases changed the corpus, When the packet closes, Then the changelog entry describes all of them rather than this phase alone | `changelog/v1.2.0.0.md` is read, and every phase is accounted for | Unmet | - |
| AC-012 | REQ-009 | Given a range window is allowed only where a form is genuinely dense, When the phase closes, Then the disposition is recorded with the arithmetic that decided it | The disposition in `goal.md` names the catalog ceiling for `daily-line` and the threshold it is measured against | Unmet | - |
| AC-013 | REQ-010 | Given this phase authored prose, When it is scanned, Then every document reports zero hard blockers | `python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py` run per document in this folder | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists. A waiver naming
an ADR that is not there fails validation: the point of a waiver is that someone
recorded the reasoning, so an unbacked waiver is treated as an unmet criterion
rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No. The phase is planned, and AC-001 is an operator decision nobody has answered.

AC-007 is the row this phase exists for. Three earlier phases introduced rules and left the checking to this one, which is a reasonable trade only if the checking is real. Eight assertions written in an afternoon and never seen failing would leave the packet with a green run that means less than the one it started with, and the corpus's own scripts README already warns a reader not to read a green run as more than it is.

AC-009 is the row most likely to be answered dishonestly. The six deliveries already look correct, and the temptation is either to skip the audit or to invent a rewrite that justifies the task. The criterion asks for a verdict per delivery, quoting the headline, which makes both failures visible.
<!-- /ANCHOR:closure -->
