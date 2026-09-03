---
title: "Acceptance Criteria: Fidelity and library research for sk-create-chart"
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
    packet_pointer: "sk-doc/051-sk-create-chart/007-fidelity-and-library-research"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "phase-7-second-read"
    recent_action: "Re-ran every criterion after the second read over the twelve unapplied items"
    next_safe_action: "Fold the ten corrected citations back into the research prose and the mode references"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-7-fidelity-and-library-research"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "The ten corrected citations are recorded but not yet folded back into the mode references"
    answered_questions:
      - "Three template-level changes were applied and gated"
      - "No library was adopted, and the reason is recorded"
      - "All five contract-level recommendations are decided, and ADR-004 is Accepted"
      - "T10 pattern fills and C5 a diverging system are refused in writing"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Fidelity and library research for sk-create-chart

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/051-sk-create-chart/007-fidelity-and-library-research
**Level:** 3
**Status:** Complete
**Date:** 2026-09-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the three reference overviews started at section zero, When the numbering is shifted, Then no overview in the mode starts at zero | `.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:21` now reads `## 1. OVERVIEW`, and `grep -rn '## 0\. OVERVIEW' .opencode/skills/sk-doc/sk-create-chart/` exits 1 with no output | Met | - |
| AC-002 | REQ-001 | Given citations named a section number the shift moved, When the shift is applied, Then each citation names the section it meant | `.opencode/skills/sk-doc/sk-create-chart/manual-testing-playbook/delivery-and-routing/opens-with-no-build-step.md:100` now cites section 5, and the full list is at `implementation-summary.md:76` | Met | - |
| AC-003 | REQ-002 | Given convergence is disabled, When the research loop runs, Then ten iteration records and one synthesis exist | `research/lineages/deepseek-flash-max/research.md:111` carries the ranked recommendations, and `iterations/` and `deltas/` each hold ten files | Met | - |
| AC-004 | REQ-002 | Given a finding is acted on, When it is applied, Then its corpus citation resolves to the line it names | `candlestick.html:137`, `stacked-bars.html:159`, `daily-line.html:136` and `bar-rows.html:31` opened and confirmed | Met | - |
| AC-005 | REQ-003 | Given templates were edited, When the corpus check runs with `--render` from the final state, Then it prints `RESULT: PASSED` | Re-run 2026-09-03 from the final state: `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` printed `RESULT: PASSED`, exit 0, sixteen checks over 29 files, zero failures | Met | - |
| AC-006 | REQ-004 | Given the research recommends something that would change the template contract, When the phase closes, Then that recommendation is a decision rather than an applied edit | ADR-004 recorded all five and applied none. The operator has since decided all five, so ADR-004 now reads `Accepted` and carries a disposition per row | Met | ADR-004 |
| AC-007 | REQ-005 | Given this phase authored prose, When it is scanned, Then it reports zero hard blockers | `implementation-summary.md:161` records the run of `hvr_scan.py` over every document in this folder, zero hard blockers on each | Met | - |
| AC-008 | REQ-003 | Given seven of the ten template-level recommendations were not applied, When the phase closes, Then each is recorded with its evidence | `implementation-summary.md` carries the table of seven with their finding references | Met | ADR-002 |
| AC-009 | REQ-003 | Given the twelve unapplied items, When each is re-read against the contract and the restraint ladder, Then it is applied or refused in writing and none is silently skipped | Nine applied (T2, T3, T5, T6, T7, T8, C1, C2, C3, C4) and two refused with a written reason (T10 and C5, both in `references/color-system.md` section 8). ADR-006 records the deviation on T8 | Met | ADR-006 |
| AC-010 | REQ-003 | Given a formatter now owns every printed number, When the corpus is rendered before and after, Then the only label changes are grouping separators and an evened decimal count | Full label diff over the twenty forms: nine ticks gained a comma, three candlestick rungs gained `.0`, and nothing else moved | Met | - |
| AC-011 | REQ-003 | Given a reading is missing, When the three path builders draw, Then the mark breaks at the gap rather than being drawn as zero | Fixture with two null days: before, the line dived to the baseline and the low-point label printed `null`; after, the line is two segments, the label reads `96` and the figure prints `2 days have no reading and are left out of the line.` | Met | - |
| AC-012 | REQ-004 | Given C1 asks for a narrow-viewport assertion, When the check runs without a browser, Then it fails a template that cannot pan and passes one that can | `narrow-viewport` reports 87 assertions and 0 failures on the corpus, and failed three separate ways on a mutated copy of `scatter.html` before it was restored | Met | - |
| AC-013 | REQ-004 | Given a form is handed more data than its documented shape, When it draws, Then it says so in the figure | Fixture past both ceilings: `scatter` printed the notice at 28 points and `heat-matrix` at 112 cells, each growing its own frame. The shipped data triggers neither | Met | - |
| AC-014 | REQ-002 | Given the library half of the research ran without web tooling, When it is re-run on an executor with live search, Then every upstream URL it cites is marked resolved or unverified | Ten iterations of `/deep:research` on `cli-codex gpt-5.6-luna` with `webSearch: live`, in worktree `worktrees/042-chart-upstream-citation-verify`. All 43 cited URLs carry a verdict: 31 VERIFIED, 10 CORRECTED, 2 UNVERIFIABLE. Ledger at `research/verification-2026-09-03/lineages/codex-luna-max/research.md` | Met | - |

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

The renumbering and the ten-iteration research loop carried the first pass, and three of the ten
template-level recommendations were applied and gated there. The second read has since closed the
remaining twelve: nine are applied and two are refused in writing, and no item is left as a silent
skip. Every claim above is pinned to an observation made from the final state.

The last open criterion is now closed. The library half of the research was re-run on 2026-09-03 on
an executor with live web search, in its own worktree as ADR-005 requires, and every URL it cited
came back with a verdict rather than an assumption. Ten of the forty-three citations needed
correcting and two could not be reached at all, which is the reason the re-run was worth its own
dispatch.
<!-- /ANCHOR:closure -->
