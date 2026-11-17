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
    last_updated_at: "2026-11-14T14:30:00Z"
    last_updated_by: "claude"
    recent_action: "Set every criterion Met with its observed evidence"
    next_safe_action: "Operator sets or waives the outcome target"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-023-untuned-outcome-evidence"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the recaptured baseline and the evidence file, When both are searched for a fit row id, Then nothing is found, and no task output holds a sealed row's text | Met: `scratch/scope.txt` shows the fit row id search over the baseline and the evidence file printing nothing (T013). No sealed text was printed because every task read the corpus through `jq 'del(.prompt)'` only (scratch/scope.txt:13) | Met | - |
| AC-002 | REQ-002 | Given the capture before the phase and the recaptured baseline, When `metrics`, `unreachable`, `commands` and the earlier keys of `attachedMetrics` are compared, Then they are byte-equal | Met: `scratch/recapture.txt` shows `cmp earlier-before.json earlier-after.json` exit 0 with no output (T006) (scratch/recapture.txt:8) | Met | - |
| AC-003 | REQ-003 | Given the phase diff of the corpus, When its line counts are read, Then it holds 48 added lines and 0 removed | Met: `scratch/scope.txt` shows the numstat `48` then `0` for `command-prompts.jsonl` (T013) (scratch/scope.txt:11) | Met | - |
| AC-004 | REQ-004 | Given the live capture, When `plain_stages` is read for each split, Then `own + ownerLed + neither` equals `total` and `own` and `attached` equal the `plain` block's values | Met: `scratch/after.txt` shows the slice suite 9 passed (9). The stage lines in `scratch/outcome-evidence.txt` hold the identity in both regimes (scratch/after.txt:3, scratch/outcome-evidence.txt:5) | Met | - |
| AC-005 | REQ-005 | Given the recaptured baseline, When the stage and fit totals are read, Then they are 44, 24 and 24, and each decline kind holds 6 | Met: `scratch/recapture.txt` prints `[44,24,24]` and the slice suite 9 passed (9). `jq -c '.attachedMetrics.fit'` over the baseline shows `refusal`, `question`, `small-edit` and `app-problem` each with `total` 6 (scratch/recapture.txt:16, scratch/recapture.txt:14) | Met | - |
| AC-006 | REQ-006 | Given the counts 8 of 16, 0 of 16, 16 of 16 and 0 of 0, When `wilsonRange` runs, Then it returns 0.28 to 0.72, 0 to 0.19, 0.81 to 1 and `null`, and each `workflow` block holds the two ranges | Met: `scratch/after.txt` shows the transcript score suite 151 passed (151), which holds the `wilsonRange` cases (T007) (scratch/after.txt:6) | Met | - |
| AC-007 | REQ-007 | Given a log with two offered runs, one run with no offer and one line with no offer field, When it is summarized, Then the three denominators add up to the denominator of `followedRate` | Met: the transcript score suite 151 passed (151) holds the offered split case (T008). Each `followed` line in `scratch/outcome-evidence.txt` has offered, notOffered and unknown denominators that add up to its rate's (scratch/after.txt:6, scratch/outcome-evidence.txt:16) | Met | - |
| AC-008 | REQ-008 | Given two arms over four owned rows, When the summary runs with `--pair pre,post`, Then `paired` holds 1 gained, 1 lost, 1 followed in both and 1 in neither, and a summary without the option holds no `paired` key | Met: the transcript score suite 151 passed (151) holds the pairing case (T021), and T021 recorded that the summary without `--pair` has no `paired` key (scratch/after.txt:6, tasks.md:91) | Met | - |
| AC-009 | REQ-009 | Given the evidence file, When its lines are counted by prefix, Then it holds 11 `followed` lines, 5 `paired` lines and 5 `limit:` lines beside the reach, stage and fit lines | Met: T012 counts over `scratch/outcome-evidence.txt`: followed 11, paired 5, limit 5, reach 4, stage 4 and fit 4 (tasks.md:106, scratch/outcome-evidence.txt:35) | Met | - |
| AC-010 | REQ-010 | Given the phase diff, When added comment lines are searched for a spec path or an id, Then nothing is found and seven files changed outside `specs/` | Met: `scratch/scope.txt` shows the comment id search printing nothing and 7 files changed outside `specs/` (T013) (scratch/scope.txt:9, scratch/scope.txt:12) | Met | - |

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

**Closeable:** Yes

Every row is met with the evidence its Verification cell names.
<!-- /ANCHOR:closure -->
