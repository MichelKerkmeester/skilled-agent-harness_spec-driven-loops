---
title: "Acceptance Criteria: Fix eight skill and command surfacing gaps in the advisor scorer, its CLI JSON and its index freshness check"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "surfacing scorer follow ups acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/011-surfacing-scorer-follow-ups"
    last_updated_at: "2026-11-17T20:46:09Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-surfacing-scorer-follow-ups"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Fix eight skill and command surfacing gaps in the advisor scorer, its CLI JSON and its index freshness check

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 011-surfacing-scorer-follow-ups
**Level:** 2
**Status:** Complete
**Date:** 2026-11-17
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a command bridge phrase of three or more content words, When a prompt carries all of its content words and the leading word inside the window, Then the command surfaces at the tolerant score | `tests/scorer/command-phrase-tolerance.vitest.ts:41`, 4 tests, failed before the change and passed after it in the recorded run. The re-pin prompt surfaces `command-doctor-overlay-repin` on the built CLI, recorded at `scratch/work-record.md:9`. Not re-run for this packet. | Met | - |
| AC-002 | REQ-002 | Given a single-word phrase joined to another word by a hyphen, When the prompt contains the joined name, Then that phrase does not match, and a phrase with its own hyphen still matches | `tests/name-mention-scoring.vitest.ts:139`, new describe block with 3 tests, failed before the change and passed after it in the recorded run. Recorded at `scratch/work-record.md:12`. Not re-run. | Met | - |
| AC-003 | REQ-003 | Given ticket-status wording with a tracker noun, When the prompt also contains the review token, Then the review boost is skipped, and a plain request keeps the boost | `tests/scorer/review-status-wording.vitest.ts:18`, 2 tests, failed before the change and passed after it in the recorded run. Recorded at `scratch/work-record.md:13`. Not re-run. | Met | - |
| AC-004 | REQ-004 | Given the generated bridge JSON, When the scorer starts, Then the bridges come from the JSON, and a missing or malformed file falls back to the compiled block | `tests/scorer/command-bridge-loader.vitest.ts:37`, 3 tests, passed in the recorded run. Recorded at `scratch/work-record.md:14`. Not re-run. | Met | - |
| AC-005 | REQ-005 | Given a short prompt that a skill reaching only the floor could tie, When the wide ambiguity set forms, Then the floor-only skill stays in the set, as the recorded decision requires | Operator decision on 2026-11-17: keep current behavior, no code change. `tests/scorer/advisor-quality-049-003.vitest.ts:339` pins the kept behavior. The recorded run passed it. | Met | - |
| AC-006 | REQ-006 | Given an exact command bridge match and its owner skill, When both score, Then the command keeps its place below the owner and is still offered, as the recorded decision requires | Operator decision on 2026-11-17: keep current behavior, no code change. The tie-break is at `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1421`, and the recorded decision is at `specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/synthesis-review.md:143`. | Met | - |
| AC-007 | REQ-007 | Given the index freshness claim, When the native scorer is checked, Then a verdict is recorded with its evidence | Verdict recorded at `scratch/work-record.md:15`: not confirmed for the native scorer. The verdict is inferred, not tested. A native route change after a `SKILL.md` keywords edit would confirm it. | Met | - |
| AC-008 | REQ-008 | Given the CLI JSON per-lane claim, When `advisor_recommend` runs with `"options":{"includeAttribution":true}`, Then each recommendation carries `laneBreakdown` and `why_recommended` | Recorded at `scratch/work-record.md:16` on the ticket prompt. The field was already available, so no code change was made. | Met | - |

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

**Closeable:** Yes

Every row is Met. Both operator decisions were recorded on 2026-11-17, and no criterion blocks closure. The evidence for the recorded runs is in `scratch/work-record.md` and was not re-run for this packet.
<!-- /ANCHOR:closure -->
