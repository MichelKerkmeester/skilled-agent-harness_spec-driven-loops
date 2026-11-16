---
title: "Acceptance Criteria: Phase 33: untuned-arm-arena-run"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "untuned arm arena run acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run"
    last_updated_at: "2026-11-15T23:21:04Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-033-untuned-arm-arena-run"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 33: untuned-arm-arena-run

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 033-untuned-arm-arena-run
**Level:** 2
**Status:** Complete
**Date:** 2026-11-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given five arenas at `AC`, When every turn ends, Then each arena reads no remote and an empty status and every run line reads `restored: true` | Every arena ended at b765c7a14c5 with 0 remotes and an empty status (scratch/arenas-after.txt, the post-run check); 397 of 401 lines read restored true, the 4 fresh-skill-04 head-move lines read false (ADR-001) | Waived | ADR-001 |
| AC-002 | REQ-002 | Given the run and its scoring, When the evidence is written, Then no prompt text was read or printed and each number came from a committed script | `rg -c '"prompt"'` over summary-arm.json, arm-evidence.txt and runs/ exits 1 (no match); evidence numbers come from the scorer and the 026 jq filters (scratch/arm-evidence.txt:16) | Met | - |
| AC-003 | REQ-003 | Given the run logs, When grouped by arm and run, Then each runtime prints `[36,36,8]` | The grouping prints [36,36,8] for claude, opencode, pi, devin and dsh (scratch/grouping.txt:2) | Met | - |
| AC-004 | REQ-004 | Given `arm-evidence.txt`, When the 026 target as option D amends it is applied, Then the goal log holds one `Arm verdict` row whose numbers match the file | The goal log's Arm verdict row reads Not shown with pooled p 0.0769, dsh decline starts 1 of 16 and floors 2 and 5 of 44, the same numbers as arm-evidence.txt (../goal.md:333, scratch/arm-evidence.txt:16) | Met | - |
| AC-005 | REQ-005 | Given the smoke log, When delivery is read per arm, Then off reads false and on reads true on claude, pi, devin and dsh, and opencode reads unknown in both | scratch/smoke.txt: false off and true on for claude, pi, devin and dsh, opencode unknown both, MISMATCH empty, 0 unscored (scratch/smoke.txt:1) | Met | - |
| AC-006 | REQ-006 | Given the faults the scorer and `MISMATCH` list, When each is rerun once, Then `reruns.txt` names each and the total stays at or under 440 lines | reruns.txt lists the fresh-skill-04 faults and the two dsh exit-1 lines with reasons; run lines 401 plus 10 smoke is 411, under 440 (scratch/reruns.txt:1) | Met | - |
| AC-007 | REQ-007 | Given the verdict, When the phase closes, Then the goal log holds the verdict, per-runtime, step reader and B-5 rows | Goal log holds Arm verdict, Arm devin, Step reader and B-5 trigger rows (../goal.md:333) | Met | - |

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

Six rows are Met and AC-001 is Waived by ADR-001, which exists in decision-record.md.
<!-- /ANCHOR:closure -->
