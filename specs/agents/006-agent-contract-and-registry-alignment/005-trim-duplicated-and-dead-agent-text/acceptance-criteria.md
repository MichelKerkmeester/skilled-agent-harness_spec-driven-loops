---
title: "Acceptance Criteria: Phase 5: trim-duplicated-and-dead-agent-text"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "trim duplicated and dead agent text acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/006-agent-contract-and-registry-alignment/005-trim-duplicated-and-dead-agent-text"
    last_updated_at: "2026-11-14T11:36:24Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-trim-duplicated-and-dead-agent-text"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: trim-duplicated-and-dead-agent-text

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 006-agent-contract-and-registry-alignment/005-trim-duplicated-and-dead-agent-text
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given each block removed in this phase, When the removal map is read, Then it has a row for the block with a surviving line or a stated reason | `scratch/removal-map.md` has one row per removed block, and no row's last cell is empty Observed 2026-11-14: the map has 25 rows, one per removed block, and no row's last cell is empty. Each agent file equals the expected file the map's script wrote before the cut. | Met | - |
| AC-002 | REQ-002 | Given the shortened `code.md`, When `code` is dispatched on one small task, Then its return carries every field of the return template | `scratch/code-dispatch-after.md` holds the return, and each field named in `code.md` section 8 appears in it Observed 2026-11-14: the return carries all ten required and all four conditional fields of the return template, which is section 9 of `code.md` since phase 4. `rg -c 'missing' scratch/code-dispatch-after.md` printed no line. | Met | - |
| AC-003 | REQ-003 | Given the edited canonical files, When the mirror check runs, Then every comparable copy is in sync | `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0 Observed 2026-11-14: `node .skilled/bin/check-agent-mirror-sync.cjs --all` ended with `11 agent(s) checked — all comparable mirrors in sync — OK` and exited 0. | Met | - |
| AC-004 | REQ-004 | Given the eleven agent files, When they are searched for the summary box, Then nothing matches | `rg -l '^│  AUTHORITY' .skilled/agents` prints no path Observed 2026-11-14: the search printed no path, and the wider `rg -l '^│' .skilled/agents` printed none either. Nine files carried a box, not eight. | Met | - |
| AC-005 | REQ-005 | Given the eleven agent files, When one copy of the block is changed and the check runs, Then it exits 1 and names the file | The vitest case `flags a drifted shared block` passes, and `node .skilled/bin/sync-agent-roster.cjs --check` exits 0 Observed 2026-11-14: the case passed in a run of 13 passed of 13. The check exited 1 naming `design` and `markdown` before those two were aligned, and prints `agent-roster: OK` and exits 0 now. | Met | - |
| AC-006 | REQ-006 | Given `code.md`, When the two sections are counted, Then the total is 1,300 words or fewer, down from 2,070 | `scratch/after.txt` records the word count of each section, taken with the awk command in T002 Observed 2026-11-14: OUTPUT VERIFICATION is 1,009 words and ANTI-PATTERNS 257, 1,266 in total, down from 2,063. | Met | - |
| AC-007 | REQ-007 | Given the eleven agent files, When their words are counted, Then the total is 50,000 or lower, down from 52,568 | `wc -w .skilled/agents/*.md` prints a total of 50000 or lower Observed 2026-11-14: the total is 50,856, down from 53,367 at the start of the phase. The planned cuts are all made and the ceiling is not reached. | Waived | ADR-001 |
| AC-008 | REQ-008 | Given the amended template, When the check runs, Then it exits 0 with no new exception added for the summary | `node .skilled/bin/sync-agent-roster.cjs --check` exits 0, and `git diff main -- .skilled/agents/agent-registry.json` shows no new `SUMMARY` exception Observed 2026-11-14: the check printed `agent-roster: OK` and exited 0, and the registry diff holds no `SUMMARY` exception. | Met | - |

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

Seven criteria are `Met`, each with the output observed on 2026-11-14. AC-007 is `Waived` by ADR-001: the operator accepted the measured total over cutting a rule to reach the ceiling.
<!-- /ANCHOR:closure -->
