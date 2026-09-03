---
title: "Acceptance Criteria: Add the reveal wipe and the bar growth, both gated and both deterministic"
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
    packet_pointer: "sk-doc/053-chart-visual-overhaul/003-motion-layer"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Closed all fifteen rows against observed output"
    next_safe_action: "Start phase 004 on a corpus whose render path compares pictures as well as documents"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-003-motion-layer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Motion is authored in CSS so the existing motion rule can see it"
      - "No animation repeats"
      - "The transform route survives a stacked segment and the clip route does not"
      - "One second, made true by capping the stagger rather than letting it accumulate"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Add the reveal wipe and the bar growth, both gated and both deterministic

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/053-chart-visual-overhaul/003-motion-layer
**Level:** 2
**Status:** Complete
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
| AC-001 | REQ-001 | Given the time-series forms paint instantly, When the reveal lands, Then each wipes left to right over one second on the named curve | `grep -c '@keyframes'` reports 1 on each of the three, and each declares `animation: chart-reveal 1s cubic-bezier(0, 0.7, 0.5, 1) backwards`. The curve is the one the vendored line chart names as its reveal easing, re-typed rather than imported Declaration at `$CHART/assets/templates/daily-line.html:101`. | Met | - |
| AC-002 | REQ-002 | Given bar marks appear at full height, When the growth lands, Then each rises from its anchor over half a second on a cubic-out curve | Each of the six declares `0.5s cubic-bezier(0.33, 1, 0.68, 1)` with `animation-delay: min(var(--mark-index, 0) * 0.05s, 0.5s)`. The curve is cubic-out and the 0.05s step is the stagger the vendored bar charts name. The delay is capped, so a reader who pastes thirty rows into the data block still gets a file that settles inside the one second rule 13 names Declaration at `$CHART/assets/templates/bar-columns.html:93`. | Met | - |
| AC-003 | REQ-002 | Given the stagger has to come from geometry, When the delays are read, Then each is computed from a mark index rather than from a value in the data block | Every `--mark-index` is a `forEach` index, except `grouped-bars`, which uses a running draw counter. Its first version read `d.values.length`, a name defined between the sentinels, and was rewritten when this row was checked rather than after The rewritten counter is at `$CHART/assets/templates/grouped-bars.html:236`. | Met | - |
| AC-004 | REQ-003 | Given a reader may ask their system for no motion, When the preference is set, Then the motion is removed rather than shortened | `grep -rl 'prefers-reduced-motion' $CHART/assets/templates/` lists nine files, and all nine fallbacks read `animation: none`. The check now rejects a fallback that declares anything else, which is the failure AC-010 demonstrates Fallback at `$CHART/assets/templates/daily-line.html:106`, and the full roster at `scratch/reduce-motion-coverage.txt:27`. | Met | - |
| AC-005 | REQ-004 | Given contract rule 12 requires two renders to agree, When each animating file is rendered twice, Then the two settled documents are identical | `settled-render: 58 assertion(s), 0 failure(s)`, two per file across all 29. Each of the nine also settles to a picture byte-identical to the control captured before any file animated. Both comparisons are in `scratch/determinism.txt`, with the hashes Gate line at `scratch/determinism.txt:11`, per-file hashes from `scratch/determinism.txt:25`. | Met | - |
| AC-006 | REQ-005 | Given an endless animation makes two renders disagree, When the files are read, Then no animation repeats | A search of `$CHART/assets/` for `infinite` and for `iteration-count` returns nothing. AC-011 is the run that proves the check would catch one The branch that would catch one is at `$CHART/scripts/check-corpus.cjs:610`. | Met | - |
| AC-007 | REQ-005 | Given rule 12 also bans clocks and randomness, When the corpus check runs, Then the determinism rule reports zero failures | `determinism: 29 assertion(s), 0 failure(s)`. A search of `$CHART/assets/` for `Math.random`, `Date.now`, `new Date(` and `performance.now` returns nothing `scratch/validator-after.txt:12`. | Met | - |
| AC-008 | REQ-006 | Given nine files were edited, When the corpus check runs with `--render` from the final state, Then it prints `RESULT: PASSED` | `RESULT: PASSED`, `Summary: errors: 0`, exit 0, with `render: 29 assertion(s), 0 failure(s)` and `motion: 116 assertion(s), 0 failure(s)`. Capture: `scratch/validator-after.txt`. The gate was run five times from the final state and passed every time `scratch/validator-after.txt:28`, with the summary at `scratch/validator-after.txt:26` and the motion tally at `scratch/validator-after.txt:15`. | Met | - |
| AC-009 | REQ-007 | Given the motion rule reads only stylesheet regions today, When a script-driven animation with no fallback is added to a scratch copy, Then the check goes red | A `requestAnimationFrame` sweep added to `bar-columns.html` produced `RESULT: FAILED` naming `motion`, with the message about no media query reaching a motion driven from script. The restore came from a kept copy, not from `git checkout --`: that command reverts to the last commit, and with this phase uncommitted it would have thrown the work away. The run after the restore printed `RESULT: PASSED`. Capture: `scratch/motion-negative.txt` `scratch/motion-negative.txt:2`, restored and green at `scratch/motion-negative.txt:7`. | Met | - |
| AC-010 | REQ-007 | Given a fallback that shortens is not a fallback, When one is added to a scratch copy, Then the check goes red | `animation-duration: 0.01s` in place of `animation: none` produced `RESULT: FAILED` naming `motion`, quoting the declaration back. Restored from the kept copy, and the run after printed `RESULT: PASSED` `scratch/motion-negative.txt:11`, restored and green at `scratch/motion-negative.txt:16`. | Met | - |
| AC-011 | REQ-007 | Given an animation that repeats breaks rule 12, When one is added to a scratch copy, Then the check goes red | `infinite` added to the reveal shorthand in `daily-line.html` produced `RESULT: FAILED` naming `motion`. Restored from the kept copy, and the run after printed `RESULT: PASSED` `scratch/motion-negative.txt:20`, restored and green at `scratch/motion-negative.txt:25`. | Met | - |
| AC-012 | REQ-008 | Given rule 12 is only checkable once a settle time is named, When the contract is updated, Then rule 13 states that time | Rule 13 now reads that a file which animates carries a fallback removing the motion, never repeats, and settles within one second of first paint. Rule 12 gained `settled-render` as a second check name. Three paragraphs under the table say why the two rules argue without a named ceiling, and why the stagger is capped rather than accumulated Rule 13 at `$CHART/references/template-contract.md:183`. | Met | - |
| AC-013 | REQ-001 | Given eleven forms do not animate, When the corpus is read, Then none of them carries a reduce-motion fallback it does not need | The same grep lists nine files and none of the other eleven. `box-plot`, `calendar-grid`, `candlestick`, `distribution-strip`, `heat-matrix`, `independent-percentages`, `parallel-axes`, `scatter`, `treemap`, `unit-grid` and `unit-ring` carry no fallback, because none of them moves `scratch/reduce-motion-coverage.txt:27`. | Met | - |
| AC-014 | REQ-002 | Given two bar forms have no baseline to grow from, When the growth lands, Then each mark grows from its own anchor following the sign of its step | `scratch/mid-frames/waterfall.png` is a paused frame part way through the growth. The two falling steps hang from the total above them and grow downward, the two rises climb from the total below, and both anchors stand on the baseline. `progress-single` grows from the left edge of its track The falling-step origin is at `$CHART/assets/templates/waterfall.html:102`. | Met | - |
| AC-015 | REQ-009 | Given this phase authored prose, When it is scanned, Then it reports zero hard blockers | `hvr_scan.py` reports `hard blockers: 0` on every document in this folder and on both reference documents this phase edited Reported against `specs/sk-doc/053-chart-visual-overhaul/003-motion-layer/goal.md:1` and the five documents beside it. | Met | - |

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

**Closeable:** Yes.

All fifteen rows are `Met`. Nothing is waived and nothing is superseded, so `decision-record.md`
is not needed and has not been created.

AC-005 was the row this phase existed to satisfy, and it is the one whose instrument changed
while the work was under way. The plan proposed comparing two document dumps. That comparison
runs and passes, and on its own it would have been close to worthless here: a stylesheet
animation never touches the DOM, so two dumps of a file still visibly moving are identical. The
check therefore compares the painted picture as well, and the picture is the half that does the
work. A thirty second reveal, which every structural rule is right to pass, makes it go red.

Rows AC-009 through AC-011 mattered because the motion rule had never once fired on a real file,
and a rule with no observed failure is a claim rather than a gate. All three now have a red run
behind them. So does the rendered check, which was written in this phase and would otherwise have
inherited exactly the problem it was built to fix.
<!-- /ANCHOR:closure -->
