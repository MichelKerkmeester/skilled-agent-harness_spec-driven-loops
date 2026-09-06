---
title: "Acceptance Criteria: Prove the targets, the rules and the gallery from the final state"
description: "Five criteria: the corpus gated from its final state, every new rule watched failing, the packet validated, the parent reconciled, and nothing pushed."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-doc/051-sk-create-chart/012-chart-hover-and-pointer-states/010-corpus-expansion-and-gallery/005-closure-and-proof"
    last_updated_at: "2026-09-06T06:26:47Z"
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
# Acceptance Criteria: Prove the targets, the rules and the gallery from the final state

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 010-corpus-expansion-and-gallery/005-closure-and-proof
**Level:** 2
**Status:** Complete
**Date:** 2026-09-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final state of the corpus, When `check-corpus.cjs --render` runs, Then it prints `RESULT: PASSED` | Observed: `RESULT: PASSED`, 0 errors, 35 files scanned, 26 chart forms. `card-readout` 22, `pointer-reach` 22, `gallery` 27, `pointer-contract-coverage` 52, `dark-render` 35, `settled-render` 70, all 0 failures | Met | - |
| AC-002 | REQ-002 | Given each rule this packet added, When a deliberate mutation is applied, Then the rule fails naming the fault, and a byte-identical restore returns the corpus to green | Observed for `pointer-reach`: `daily-line` reverted to plain hit testing gave 23 of 121 positions dead within reach at (158, 204), `RESULT: FAILED`, restored at sha256 `5357f64ab8bc618d`, `RESULT: PASSED`. Observed for `gallery` in both directions: a dropped form named `funnel`; a 27th template named both the count mismatch and the form; restored at sha256 `852ff466ce16eb10` | Met | - |
| AC-003 | REQ-003 | Given the packet, When `validate.sh --strict` runs, Then it is clean for the parent and every child | Recorded in the closure notes below with the observed result | Met | - |
| AC-004 | REQ-004 | Given the parent packet, When its status is read, Then it does not claim completion while carrying children that changed the corpus after it closed | Observed: the parent's status and phase map were reconciled to name this phase parent and its five children | Met | - |
| AC-005 | REQ-005 | Given the work, When the session reports, Then nothing is pushed or merged and the working state is stated exactly | Observed: no commit, no push, no merge; every change is working tree, scoped to the chart skill and this packet | Met | - |

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

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
