---
title: "Acceptance Criteria: Research and add the chart forms the catalogue is missing"
description: "Five criteria: every new form passes every rule, its card never outruns its table, the contract and directory agree, nothing external is added, and no half-built form ever entered the corpus."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-doc/051-sk-create-chart/012-chart-hover-and-pointer-states/010-corpus-expansion-and-gallery/003-new-chart-forms"
    last_updated_at: "2026-09-06T06:26:45Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Research and add the chart forms the catalogue is missing

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 010-corpus-expansion-and-gallery/003-new-chart-forms
**Level:** 3
**Status:** Complete
**Date:** 2026-09-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given each new form, When the corpus gate runs, Then every rule passes | Observed: `RESULT: PASSED`, 0 errors, at 26 templates. `card-readout` and `pointer-reach` each rose from 17 to 22 assertions, so the new forms are checked rather than tolerated | Met | - |
| AC-002 | REQ-002 | Given each new form's card, When its values are compared with its table, Then every value appears there | Observed: `card-readout` 22/22, 0 failures | Met | - |
| AC-003 | REQ-003 | Given the contract table and the directory, When compared, Then they agree in both directions | Observed: `pointer-contract-coverage` 52 assertions, 0 failures, 26 files against 26 rows | Met | - |
| AC-004 | REQ-004 | Given each new form, When inspected, Then it carries no external runtime, framework, CDN reference or build step | Observed: zero external references in each file before it entered the tree; `no-external` passes corpus-wide | Met | - |
| AC-005 | REQ-005 | Given a form still being built, When the corpus is gated, Then that form is not in `assets/templates/` | Observed: all five were written outside the skill tree and moved in only after structural checks; `histogram`'s missing focus rule was caught and fixed before it entered | Met | - |

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

**Closeable:** Yes. Five of five `Met`.

The catalogue grew from twenty-one forms to twenty-six under a stated admission rule: a form joins
only if it can honestly carry a data table holding everything its card reveals. That rule is what
gives "add new chart forms" an end, and it is enforced rather than asserted, by `card-readout`.

Every exclusion is recorded with its reason in the spec rather than silently dropped. `sankey` is
the one genuine omission: it would carry a table cleanly as source, target and value, and it was
deferred for the size of the drawing job, not on principle.

Two defects were caught before they shipped. `population-pyramid` and `histogram` were both adapted
from inert forms and inherited no focus hygiene rule despite gaining a tooltip; the first was caught
by the gate and the second by checking the file before moving it in. Adding `histogram` also made
the catalogue's own prose false, since it documented that this corpus draws no binned histogram and
substituted `distribution-strip` for it. That substitution row and the sentence asserting it were
both removed. No rule checks prose against the corpus, so a blind insert would have shipped a
catalogue advertising the absence of a form it now contains.
<!-- /ANCHOR:closure -->
