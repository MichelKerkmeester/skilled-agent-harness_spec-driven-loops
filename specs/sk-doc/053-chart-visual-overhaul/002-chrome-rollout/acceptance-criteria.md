---
title: "Acceptance Criteria: Roll the settled chrome across the whole chart corpus"
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
    packet_pointer: "sk-doc/053-chart-visual-overhaul/002-chrome-rollout"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the closure gate for the twenty-nine file chrome pass"
    next_safe_action: "Confirm phase 001 closed with a disposition on both forks"
    blockers:
      - "Phase 001 has not answered the stroke weight fork"
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-002-chrome-rollout"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which rungs the ladder needs"
      - "Whether the radius tokens live inside the palette sentinels"
    answered_questions:
      - "No number is formatted by the host locale"
      - "The mono face is a system stack"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Roll the settled chrome across the whole chart corpus

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/053-chart-visual-overhaul/002-chrome-rollout
**Level:** 3
**Status:** Draft
**Date:** 2026-09-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Every command below runs from the repository root. `CHART` stands for
`.opencode/skills/sk-doc/sk-create-chart`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given ten files draw a solid grid, When A1 rolls out, Then every one of them draws it dashed at `3 3` in a weakened rule colour | `grep -rc 'stroke-dasharray' $CHART/assets/ ` reports at least 1 for each of the ten grid-bearing files, against the recorded before-count of 0 | Unmet | - |
| AC-002 | REQ-002 | Given tick ink sits at full strength, When A1b rolls out, Then every `.tick` declaration reads muted | `grep -rn '^\.tick' $CHART/assets/` shows the muted role on every match, and the match count equals the recorded before-count | Unmet | - |
| AC-003 | REQ-003 | Given every asset file sets one sans stack, When A2 rolls out, Then every printed number is set in a system mono face with tabular figures | `grep -rlc 'ui-monospace' $CHART/assets/` lists all twenty-nine asset files | Unmet | - |
| AC-004 | REQ-004 | Given the corpus formatter is locale-independent on purpose, When the mono treatment lands, Then no file calls a locale-dependent formatter | `grep -rn 'toLocaleString' $CHART/assets/` returns nothing | Unmet | - |
| AC-005 | REQ-003 | Given the formatter owns every printed figure, When the face changes, Then the rendered labels change only in face | A full rendered label list before and after shows no change in digits, grouping or decimal count | Unmet | - |
| AC-006 | REQ-005 | Given the line family draws one mark weight, When A7 rolls out, Then it carries small dots and a surface-ringed dot on the headline point | `daily-line.html` and `stacked-area.html` each render two mark radii, with the ring filled from the surface token | Unmet | - |
| AC-007 | REQ-005 | Given area and band fills sit at flat opacity, When A9 rolls out, Then each fades toward the baseline | `grep -rc 'linearGradient' $CHART/assets/templates/daily-line.html $CHART/assets/templates/daily-range.html $CHART/assets/templates/stacked-area.html` reports at least 1 per file | Unmet | - |
| AC-008 | REQ-006 | Given twenty files each type `border-radius: 10px`, When the ladder ships, Then none of them does | `grep -rc 'border-radius: 10px' $CHART/assets/` returns 0 across every file, against the recorded before-count of 20 | Unmet | - |
| AC-009 | REQ-006 | Given a convention nothing checks is a wish, When the ladder ships, Then the corpus check asserts it | `node $CHART/scripts/check-corpus.cjs` prints the new check name with a nonzero assertion count and 0 failures | Unmet | - |
| AC-010 | REQ-006 | Given a validator that has only ever passed is not evidence, When a template is mutated to type its own corner, Then the check goes red | The mutated copy produces `RESULT: FAILED` naming the radius check, and `git checkout --` restores the green run | Unmet | - |
| AC-011 | REQ-008 | Given bar marks draw square corners, When the mark rung lands, Then bar-family marks carry a two pixel radius on the outer visible edge only | `grep -rn 'rx=' $CHART/assets/templates/` returns the six bar-family files, and a stacked segment carries it on the top segment alone | Unmet | - |
| AC-012 | REQ-007 | Given twenty-nine files were edited, When the corpus check runs with `--render` from the final state, Then it prints `RESULT: PASSED` | `node $CHART/scripts/check-corpus.cjs --render` prints `RESULT: PASSED` and `Summary: errors: 0` | Unmet | - |
| AC-013 | REQ-007 | Given the check does not judge the picture, When the rollout finishes, Then every file is opened and its labels read | A per-file note records that the axis labels were read after the mono face changed advances | Unmet | - |
| AC-014 | REQ-009 | Given two reference documents describe chrome, When the rollout finishes, Then neither still claims the old behaviour | `references/template-contract.md` shows the block a new form carries, and `references/color-system.md` lists the radius roles beside the colour roles | Unmet | - |
| AC-015 | REQ-001 | Given the skeleton is what a new form is copied from, When the rollout finishes, Then it carries everything the templates carry | `assets/color/palette-sheet-neutral.html` passes every check that the twenty forms pass, and it is edited last | Unmet | - |
| AC-016 | REQ-009 | Given one chrome row is carried without being applied, When the phase closes, Then its reason is written down | ADR-004 in `decision-record.md` records the round tick dots row, its vendored evidence and why the corpus has nothing to replace | Unmet | ADR-004 |
| AC-017 | REQ-010 | Given this phase authored prose, When it is scanned, Then it reports zero hard blockers | `python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <file>` reports no hard blocker on each document in this folder | Unmet | - |

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

**Closeable:** No.

Nothing has run. Every row above is open, which is the expected state for a phase that has been
planned and not yet worked.

AC-010 is the row worth watching. A green run over twenty-nine files is easy to produce and easy
to trust wrongly, and the only thing that turns the new radius assertion into evidence is watching
it go red on a file that deserves it. The phase does not claim the ladder is enforced until that
has happened.
<!-- /ANCHOR:closure -->
