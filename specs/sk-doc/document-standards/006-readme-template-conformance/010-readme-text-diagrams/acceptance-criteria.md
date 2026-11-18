---
title: "Acceptance Criteria: Phase 10: readme-text-diagrams"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "readme text diagrams acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/010-readme-text-diagrams"
    last_updated_at: "2026-11-18T10:21:38Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-readme-text-diagrams"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 10: readme-text-diagrams

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 010-readme-text-diagrams
**Level:** 2
**Status:** Complete
**Date:** 2026-11-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the tracked READMEs, When `git ls-files '*README.md' \| xargs rg -l '```mermaid'` runs, Then it prints nothing | The command printed nothing: `mermaid READMEs: 0` | Met | - |
| AC-002 | REQ-001 | Given the 55 changed READMEs, When each diff is read, Then only lines inside the old Mermaid fence changed | `scopecheck.py` printed `files 55 outside 0` | Met | - |
| AC-003 | REQ-002 | Given each new diagram, When its Hy4 reviewer compares it with the old block and the skill, Then the verdict is PASS or each finding is confirmed and applied | 53 `VERDICT: PASS` and 2 `VERDICT: FAIL`, both confirmed against `SKILL.md` and fixed (tasks.md T009) | Met | - |
| AC-004 | REQ-003 | Given the 55 files, When the validator and voice scan run, Then each prints `VALID` with `hard blockers: 0` | `baseline.sh` printed 55 rows of `VALID` with `hard blockers: 0` | Met | - |
| AC-005 | REQ-003 | Given the 13 reference-checker and 8 count-checker failures before the change, When both checkers rerun, Then no file fails that passed before | Reference failures 13 before and after, count failures 8 before and after, 0 new failing files | Met | - |
| AC-006 | REQ-004 | Given the skill README template, When `rg -n -i mermaid` runs on it, Then it prints only the line that rules Mermaid out | `rg -n -i mermaid` printed lines 247 and 358, each ruling Mermaid out | Met | - |
| AC-007 | REQ-005 | Given the 55 files, When `boxcheck.py` runs on them, Then it prints `OK` for each | `boxcheck.py` printed `OK` 55 times | Met | - |
| AC-008 | REQ-003 | Given the whole repository, When the sk-doc suite, the parity test and the link check run, Then each passes | `all sk-doc script tests passed` exit 0, `PARITY PASS`, `0 broken markdown links` | Met | - |

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

Every row is Met, so the phase may close once its commit is on origin/main.
<!-- /ANCHOR:closure -->
