---
title: "Acceptance Criteria: Phase 4: playbook-scenarios"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "playbook scenarios acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/code-surfaces/005-frontend-upstream-proposals/004-playbook-scenarios"
    last_updated_at: "2026-11-03T08:33:56Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: playbook-scenarios

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `sk-code/code-surfaces/005-frontend-upstream-proposals/004-playbook-scenarios`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final mcp-figma playbook, When the validator runs with `--package`, Then it exits 0 and reports 20 scenarios across 7 categories | `scratch/validator-final.txt`. Evidence: `scratch/validator-final.txt`: exit 0, scenarios=20 categories=7 | Met | - |
| AC-002 | REQ-002 | Given the final fundamentals playbook, When the validator runs with `--package`, Then it prints `PASS` with 13 or 14 scenarios and `violations=0` | `scratch/validator-final.txt`. Evidence: PASS, scenarios=14, violations=0 | Met | - |
| AC-003 | REQ-003 | Given the check-a-built-screen scenario, When one pass cannot run, Then the observed verdict is `INCOMPLETE` | `scratch/check-run.txt`. Evidence: `check-built-screen.md` expects `INCOMPLETE`; `scratch/check-run.txt` observed Pass 5 `NOT RUN` and overall `INCOMPLETE` | Met | - |
| AC-004 | REQ-004 | Given every new scenario file, When it is grepped case-insensitively for `barter`, Then nothing prints | The grep output, empty. Evidence: the grep prints nothing, exit 1 | Met | - |
| AC-005 | REQ-005 | Given the token-or-scale proposal, When it is compared with SKD-010, Then the add-or-drop decision and its reason are recorded and match what exists on disk | `scratch/skd-010-overlap.md` and `ls` of the fundamentals playbook. Evidence: `scratch/skd-010-overlap.md`: added as SKD-013, with the reason | Met | - |
| AC-006 | REQ-006 | Given the mcp-figma root index, When the validator runs, Then the hand-typed and derived census counts are equal | The `HAND_TYPED_CENSUS` line. Evidence: HAND_TYPED_CENSUS reports 20 scenarios, 7 categories on both sides | Met | - |
| AC-007 | REQ-007 | Given each new scenario, When it is read, Then it names the file it exercises | `rg -n -i "figma-to-code.md\|profile"` on the new files (case-insensitive: the slot is titled "Project Profile Slot"). Evidence: every new file hits (2 to 20 lines each) | Met | - |

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

Every criterion is met with its evidence recorded in the table, and an independent pass in `scratch/verify-004.md` agreed once the case of the AC-007 grep was corrected.
<!-- /ANCHOR:closure -->
