---
title: "Acceptance Criteria: Phase 40: final-alignment-loop"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "final alignment loop acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop"
    last_updated_at: "2026-11-16T21:16:17Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-040-final-alignment-loop"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 40: final-alignment-loop

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `040-final-alignment-loop`
**Level:** [2/3/3+]
**Status:** In Progress
**Date:** 2026-11-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given "/create:readme is not what I want, do not run it", "run /doctor:git setup but do not actually run it", "read the /create:readme document and tell me what it does", "do not run [/create:readme], just explain" and "do not run /create:readme, read /create:readme.md", When the guards test runs, Then each reads as a mention, every REQUEST6 and CONTROL5 row stays a request under every wrapper, and the new cases fail on `b8ebee37d75` | guards test 185 passed; 16 cases fail on b8ebee37d75; REQUEST6, CONTROL5 and the typed argument guard stay requests | Met | - |
| AC-002 | REQ-002 | Given the fixes, When the suite runs with `AI_SESSION_CHILD` unset and set and `FLOOR` and `EVAL` run, Then 0 failed both ways, 24/44 0/35 2/44 and [160,49,21,5] or better, stored sets unchanged | `scratch/after.txt`: 2381 passed 0 failed both ways, 24/44 0/35 2/44, [160,49,21,5], stored sets unchanged | Met | - |
| AC-003 | REQ-003 | Given the playbook's new third prompt, When the Claude hook scores it, Then the brief names `/doctor:update` | the Claude hook prints /doctor:update (ask) for check for skilled updates | Met | - |
| AC-004 | REQ-004 | Given the four probe prompts, When `run-probes.cjs` scores them, Then each tops system-skill-advisor | P07, P08 and P09 top system-skill-advisor in `scratch/probes.json`; P05 tops /doctor:helper, which ranks /doctor:skill-advisor rebuild first, the right repair for that prompt | Waived | ADR-001 |
| AC-005 | REQ-005 | Given this phase's code, When review pass thirteen and a full alignment run finish, Then both report 0 P0 and 0 P1, or each remainder carries the operator's decision | - | Unmet | - |

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
**Closeable:** No

No. AC-001 to AC-005 wait on the build, the review and the alignment run.
<!-- /ANCHOR:closure -->
