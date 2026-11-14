---
title: "Acceptance Criteria: Phase 23: untuned-outcome-evidence"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "untuned outcome evidence acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/023-untuned-outcome-evidence"
    last_updated_at: "2026-11-14T08:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Run T001 once phases 020, 021 and 022 are Complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-023-untuned-outcome-evidence"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 23: untuned-outcome-evidence

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 023-untuned-outcome-evidence
**Level:** 2
**Status:** Planned
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the recaptured baseline and the evidence file, When both are searched for a fit row id, Then nothing is found, and no task output holds a sealed row's text | The id search in T013 prints nothing | Unmet | - |
| AC-002 | REQ-002 | Given the capture before the phase and the recaptured baseline, When `metrics`, `unreachable`, `commands` and the earlier keys of `attachedMetrics` are compared, Then they are byte-equal | `cmp` in T006 prints nothing and exits 0 | Unmet | - |
| AC-003 | REQ-003 | Given the phase diff of the corpus, When its line counts are read, Then it holds 48 added lines and 0 removed | `git diff --numstat` in T013 prints `48` then `0` | Unmet | - |
| AC-004 | REQ-004 | Given the live capture, When `plain_stages` is read for each split, Then `own + ownerLed + neither` equals `total` and `own` and `attached` equal the `plain` block's values | `npx vitest run tests/command-routing-slice.vitest.ts` reports 0 failed | Unmet | - |
| AC-005 | REQ-005 | Given the recaptured baseline, When the stage and fit totals are read, Then they are 44, 24 and 24, and each decline kind holds 6 | The `jq` check in T006 prints `[44,24,24]` and the slice file reports 0 failed | Unmet | - |
| AC-006 | REQ-006 | Given the counts 8 of 16, 0 of 16, 16 of 16 and 0 of 0, When `wilsonRange` runs, Then it returns 0.28 to 0.72, 0 to 0.19, 0.81 to 1 and `null`, and each `workflow` block holds the two ranges | `npx vitest run tests/command-transcript-score.vitest.ts` reports 0 failed | Unmet | - |
| AC-007 | REQ-007 | Given a log with two offered runs, one run with no offer and one line with no offer field, When it is summarized, Then the three denominators add up to the denominator of `followedRate` | The scorer test file reports 0 failed | Unmet | - |
| AC-008 | REQ-008 | Given two arms over four owned rows, When the summary runs with `--pair pre,post`, Then `paired` holds 1 gained, 1 lost, 1 followed in both and 1 in neither, and a summary without the option holds no `paired` key | The scorer test file reports 0 failed and the `has("paired")` check in T009 prints `false` | Unmet | - |
| AC-009 | REQ-009 | Given the evidence file, When its lines are counted by prefix, Then it holds 11 `followed` lines, 5 `paired` lines and 5 `limit:` lines beside the reach, stage and fit lines | The `rg` counts in T012 | Unmet | - |
| AC-010 | REQ-010 | Given the phase diff, When added comment lines are searched for a spec path or an id, Then nothing is found and seven files changed outside `specs/` | The checks in T013 | Unmet | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** No

The phase is planned and not built, so every row is unmet.
<!-- /ANCHOR:closure -->
