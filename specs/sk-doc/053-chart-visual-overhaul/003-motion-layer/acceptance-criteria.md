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
    last_updated_by: "claude-code"
    recent_action: "Authored the closure gate for both motions and the determinism proof"
    next_safe_action: "Capture a settled document dump for each of the nine files"
    blockers:
      - "Phase 002 has not closed, and motion shares stylesheets with the chrome rollout"
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-003-motion-layer"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which bar growth route survives a render on a stacked segment"
      - "What settle time the contract should name"
    answered_questions:
      - "Motion is authored in CSS so the existing motion rule can see it"
      - "No animation repeats"
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
| AC-001 | REQ-001 | Given the time-series forms paint instantly, When the reveal lands, Then each wipes left to right over one second on the named curve | `grep -c '@keyframes' $CHART/assets/templates/daily-line.html $CHART/assets/templates/daily-range.html $CHART/assets/templates/stacked-area.html` reports at least 1 per file, and each declares a one second duration | Unmet | - |
| AC-002 | REQ-002 | Given bar marks appear at full height, When the growth lands, Then each rises from its anchor over half a second on a cubic-out curve | The six bar-family files each declare a 0.5s animation with a cubic-out timing function and a per-mark delay | Unmet | - |
| AC-003 | REQ-002 | Given the stagger has to come from geometry, When the delays are read, Then each is computed from a mark index rather than from a value in the data block | No animation delay in any file references a name defined between the `CHART_DATA` sentinels | Unmet | - |
| AC-004 | REQ-003 | Given a reader may ask their system for no motion, When the preference is set, Then the motion is removed rather than shortened | `grep -rl 'prefers-reduced-motion' $CHART/assets/templates/` lists exactly the nine animating files, and each fallback sets the animation to none | Unmet | - |
| AC-005 | REQ-004 | Given contract rule 12 requires two renders to agree, When each animating file is rendered twice, Then the two settled documents are identical | The two-render comparison reports no difference for all nine files, and its output is kept in `scratch/determinism.txt` | Unmet | - |
| AC-006 | REQ-005 | Given an endless animation makes two renders disagree, When the files are read, Then no animation repeats | No file declares an infinite iteration count, and no `animation` shorthand carries one | Unmet | - |
| AC-007 | REQ-005 | Given rule 12 also bans clocks and randomness, When the corpus check runs, Then the determinism rule reports zero failures | `node $CHART/scripts/check-corpus.cjs` reports 0 failures on `determinism` across every asset file | Unmet | - |
| AC-008 | REQ-006 | Given nine files were edited, When the corpus check runs with `--render` from the final state, Then it prints `RESULT: PASSED` | `node $CHART/scripts/check-corpus.cjs --render` prints `RESULT: PASSED` and `Summary: errors: 0` | Unmet | - |
| AC-009 | REQ-007 | Given the motion rule reads only stylesheet regions today, When a script-driven animation with no fallback is added to a scratch copy, Then the check goes red | The mutated copy produces `RESULT: FAILED` naming the motion check, before `git checkout --` restores it | Unmet | - |
| AC-010 | REQ-007 | Given a fallback that shortens is not a fallback, When one is added to a scratch copy, Then the check goes red | The mutated copy produces `RESULT: FAILED` naming the motion check, before the copy is restored | Unmet | - |
| AC-011 | REQ-007 | Given an animation that repeats breaks rule 12, When one is added to a scratch copy, Then the check goes red | The mutated copy produces `RESULT: FAILED`, before the copy is restored | Unmet | - |
| AC-012 | REQ-008 | Given rule 12 is only checkable once a settle time is named, When the contract is updated, Then rule 13 states that time | `references/template-contract.md` names the settle time beside rule 13 and says why rule 12 needs it | Unmet | - |
| AC-013 | REQ-001 | Given eleven forms do not animate, When the corpus is read, Then none of them carries a reduce-motion fallback it does not need | The same grep that lists nine files lists none of the other eleven | Unmet | - |
| AC-014 | REQ-002 | Given two bar forms have no baseline to grow from, When the growth lands, Then each mark grows from its own anchor following the sign of its step | `waterfall.html` and `progress-single.html` render correctly with a falling step growing downward | Unmet | - |
| AC-015 | REQ-009 | Given this phase authored prose, When it is scanned, Then it reports zero hard blockers | `python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <file>` reports no hard blocker on each document in this folder | Unmet | - |

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

AC-005 is the row this phase exists to satisfy. Motion is the only change in the whole packet that
can break contract rule 12, and the rule has protected the corpus for free until now because
nothing moved. Rows AC-009 through AC-011 matter for the same reason. The motion rule has never
fired on a real file, and a rule with no observed failure is a claim rather than a gate.
<!-- /ANCHOR:closure -->
