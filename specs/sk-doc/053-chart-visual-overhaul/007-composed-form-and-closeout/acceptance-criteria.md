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
**Status:** Complete
**Date:** 2026-09-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the catalog addition is the operator's call, When a row is proposed, Then the operator answers before the index changes | goal.md:60 records decision D1a and goal.md:104 the progress row. The operator answered yes on 2026-09-03, so the form was built rather than refused | Met | - |
| AC-002 | REQ-002 | Given the corpus holds twenty forms, When the composed form lands, Then the check reports twenty-one and resolves the catalog in both directions | scratch/final-render-rerun.txt:3 prints `files scanned: 30 (chart forms under assets/templates: 21)`, scratch/final-render-rerun.txt:9 puts `catalog` at 43 assertions and 0 failures, and scratch/final-render-rerun.txt:10 puts `catalog-system` at 22 and 0 | Met | - |
| AC-003 | REQ-002 | Given the form was authored through the documented workflow, When the check runs, Then it satisfies every contract rule without an exception | The check block starting at scratch/final-render-rerun.txt:7 lists all 28 named checks at 0 failures, so no rule names `bar-line-composed.html`. The run includes the eight rules written in this phase, which is what makes it a stronger pass than the baseline block at scratch/baseline-render.txt:7 | Met | - |
| AC-004 | REQ-003 | Given two series whose maxima differ by an order, When the form draws, Then the rate gets its own axis on the right | The condition is at .opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-line-composed.html:274 and the shipped block spreads 2,040 over 4.0, which is 510. The right ladder runs 0 to 4 with the axis named `percent` in the line's colour, read from scratch/fixtures/shipped-light.png | Met | - |
| AC-005 | REQ-003 | Given two series within an order of each other, When the form draws, Then one axis carries both | A fixture at a spread of 6.4, at scratch/fixtures/within-an-order.html:192, draws one ladder to 100 with no right axis and no right gutter and names it `orders and percent`, read from scratch/fixtures/within-an-order.png | Met | - |
| AC-006 | REQ-004 | Given phases 004, 005 and 006 introduced invariants, When this phase closes, Then each has an assertion in the corpus check | decision-record.md:173 carries the mapping. The inventory found two of the eight already enforced, by `palette-block` and `palette-source-dark`, and a third covered in part by `settled-render`. Eight assertions were written, two of them replacing the covered rows with invariants from the same phases, and every row names a check in scratch/final-render.txt:7-34 | Met | - |
| AC-007 | REQ-005 | Given an assertion nobody has seen fail is a comforting name, When each new assertion lands, Then it is watched failing on a mutated fixture and the mutation is reverted | Fourteen mutations across the eight checks, raw runs from scratch/negative-controls.txt:1 to scratch/negative-controls.txt:134, quoted per check in the table at implementation-summary.md:109. Four were re-run verbatim as the scripts README writes them, at scratch/negative-controls.txt:94. Every restore confirmed by `diff -r` against the kept copy | Met | - |
| AC-008 | REQ-006 | Given a new form and eight new assertions, When the corpus check runs with `--render` from the final state, Then it prints `RESULT: PASSED` | scratch/final-render-rerun.txt:38 prints `RESULT: PASSED`, scratch/final-render-rerun.txt:36 prints `Summary: errors: 0` and scratch/final-render-rerun.txt:39 records exit 0. Redirected to the file and read from it rather than through a pipe. The run before it, at scratch/final-render.txt:35, died on one browser open and is kept rather than discarded | Met | - |
| AC-009 | REQ-007 | Given the six family deliveries are meant to demonstrate the headline rule, When each is read against it, Then a verdict is recorded for every one, including the ones that need no change | Six verdicts in the table starting at implementation-summary.md:201, each quoting its headline and naming the family it stands for. All six pass and nothing was changed, which is the finding rather than a skipped task | Met | - |
| AC-010 | REQ-008 | Given seven files carry a version string, When the bump lands, Then all seven read the same string | Superseded. One distinct value would require `changelog/v1.0.0.0.md` to claim 1.2.0.0, which puts a false claim into a historical record. The packet keeps per-document versions and the replacement is stricter: every document this overhaul changed carries a version that moved, no document it did not change carries one that moved, and the packet version in `SKILL.md` and `README.md` matches the newest changelog filename. Eight documents moved and eleven correctly did not | Superseded | ADR-005 |
| AC-011 | REQ-008 | Given six phases changed the corpus, When the packet closes, Then the changelog entry describes all of them rather than this phase alone | All seven phases appear in the entry, whose feature list starts at .opencode/skills/sk-doc/sk-create-chart/changelog/v1.2.0.0.md:14 and whose fixes start at .opencode/skills/sk-doc/sk-create-chart/changelog/v1.2.0.0.md:25: the chrome and its proof sheet, the motion, the pointer, the dark ground, the empty-data notice and the catalog re-check, and the composed form with the closing eight checks. The version convention is at .opencode/skills/sk-doc/sk-create-chart/changelog/v1.2.0.0.md:40 and the carried-forward rename at .opencode/skills/sk-doc/sk-create-chart/changelog/v1.2.0.0.md:39 | Met | - |
| AC-012 | REQ-009 | Given a range window is allowed only where a form is genuinely dense, When the phase closes, Then the disposition is recorded with the arithmetic that decided it | Refused, with a six-row density table at decision-record.md:301 naming `daily-line`'s documented ceiling of thirty readings against the past-thirty threshold. The second reason survives a raised ceiling: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:366 forbids a handler from moving a mark, which is what a range window does | Met | - |
| AC-013 | REQ-010 | Given this phase authored prose, When it is scanned, Then every document reports zero hard blockers | Zero hard blockers on all seven documents in this folder and on the nine package documents this phase edited, `hvr_scan.py` run per file with and the corresponding evidence row at implementation-summary.md:263 | Met | - |

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

**Closeable:** Yes. Twelve rows are `Met` against observed evidence and one is `Superseded` by a stricter obligation recorded in ADR-005.

AC-007 is the row this phase exists for, and it is the row that took the longest. Three earlier phases introduced rules and left the checking to this one, which is a reasonable trade only if the checking is real. Eight assertions written in an afternoon and never seen failing would have left the packet with a green run meaning less than the one it started with. Fourteen mutations answer it, each applied to a passing corpus, watched failing with the right check and the right file named, and restored from a copy taken beforehand. Four of them were then re-run exactly as the scripts README writes them, because a documented recipe naming a file nobody mutated is a recipe nobody has tested.

AC-009 was the row most likely to be answered dishonestly, and the criterion did its job. The six deliveries did already look correct, so the temptation was either to skip the audit or to invent a rewrite justifying the task. Quoting the headline is what made the reading visible: six verdicts, six quotations, no changes, and the finding is that the recommendation was already satisfied.

AC-010 is the row that failed for a reason nobody expected, and it is superseded rather than softened. Its premise was that seven files carry one packet version that had drifted. The inventory says otherwise. The packet keeps per-document versions, every document untouched since the first release still reads 1.0.0.0 correctly, and a changelog entry's version names the release it describes. Meeting the criterion literally would have meant writing a false claim into a historical record. ADR-005 carries the reading and the replacement, which checks that the bumps are correct rather than merely uniform.
<!-- /ANCHOR:closure -->
