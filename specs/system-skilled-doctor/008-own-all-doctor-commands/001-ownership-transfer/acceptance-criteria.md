---
title: "Acceptance Criteria: Phase 1: ownership-transfer"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "ownership transfer acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/008-own-all-doctor-commands/001-ownership-transfer"
    last_updated_at: "2026-11-24T18:45:47Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-ownership-transfer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: ownership-transfer

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `008-own-all-doctor-commands/001-ownership-transfer`
**Level:** 3
**Status:** Complete
**Date:** 2026-11-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the seventeen doctor routers, When `grep -h skill_agent .skilled/commands/doctor/*.md \| sort \| uniq -c` runs, Then it prints one line, `17 <!-- skill_agent: system-skilled-doctor -->` | Observed 2026-11-24 in the worktree | Met | - |
| AC-002 | REQ-002 | Given the regenerated bridges, When `derive-command-bridges.cjs --check` runs, Then it prints `"changed": []` and every `command-doctor` row in `command-attach.ts` names system-skilled-doctor | `scratch/final/bridges-check.txt` exit 0; `rg -c` counts 35 doctor rows and 35 with the new owner | Met | - |
| AC-003 | REQ-003 | Given the change, When the doctor suites, advisor vitest and advisor Python tests run, Then they match the baseline | `run-all`: `7 suite(s) passed, 0 failed`; vitest `3204 passed \| 4 skipped`, same as baseline; pytest `26 passed` | Met | - |
| AC-004 | REQ-004 | Given the docs, When the skill's `SKILL.md` and `README.md` are read, Then they own all seventeen and no live doc outside history names another owner | `SKILL.md` Owns line lists all seventeen; `rg "Does NOT own"` prints nothing; independent review dispatched for a second read | Met | - |
| AC-005 | REQ-005 | Given the routing corpora, When phrase reach and the routing slices run, Then phrase reach prints `STATUS=OK` and the doctor slice keeps every expected pick | `STATUS=OK phrases=262 bridges=35`; `doctor-routing-slice.vitest.ts` passes; the command slice moves only definitional counts | Met | - |

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

Every criterion is met with observed output from the final gate run.
<!-- /ANCHOR:closure -->
