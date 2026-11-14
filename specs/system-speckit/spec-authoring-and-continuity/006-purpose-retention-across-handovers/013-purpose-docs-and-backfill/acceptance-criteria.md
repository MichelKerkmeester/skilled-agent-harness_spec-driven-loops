---
title: "Acceptance Criteria: Phase 13: purpose-docs-and-backfill"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "purpose docs and backfill acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/013-purpose-docs-and-backfill"
    last_updated_at: "2026-11-14T11:27:17Z"
    last_updated_by: "planner"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-013-purpose-docs-and-backfill"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 13: purpose-docs-and-backfill

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `013-purpose-docs-and-backfill`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the eight deep-loop parents, When the approved sentences are applied, Then `check-parents.mjs` prints `layout sentence as purpose: 0 of 11` and each approved line starts with `packet` | T017 output | Unmet | - |
| AC-002 | REQ-001 | Given the three reserved sentences, When the approved text replaces each one, Then the old search text of E9, E10 and E11 matches nothing in its file | T006 to T008 output | Unmet | - |
| AC-003 | REQ-002 | Given the catalog package, When the entry, the root section and both links are added, Then `validate_catalog_package.py` prints `violations=0` and each hop entry links `packet-purpose-carry.md` once | T011 and T019 output | Unmet | - |
| AC-004 | REQ-003 | Given the playbook package, When the five scenarios and their index rows are added, Then `validate-playbook-package.cjs` prints `scenarios=124` and `violations=0` | T013 and T020 output | Unmet | - |
| AC-005 | REQ-002, REQ-003 | Given the six new files, When the naming guard runs on a staged copy, Then it prints `EXIT=0` | T021 output | Unmet | - |
| AC-006 | REQ-004 | Given the injection contract, When it describes the compaction output, Then `rg -c 'Packet Purpose'` on it prints `2` | T014 output | Unmet | - |
| AC-007 | REQ-005 | Given the six README passages, When each gains its sentence, Then `rg -c "packet's purpose" README.md` prints at least `6` | T015 output | Unmet | - |
| AC-008 | REQ-006 | Given the library index, When the `packet-purpose.ts` row is read, Then it names both readers and the old phrase matches nothing | T016 output | Unmet | - |
| AC-009 | REQ-007 | Given the eleven parents, When each is strict validated, Then each prints `RESULT: PASSED (errors=0 warnings=0)` | T018 output | Unmet | - |
| AC-010 | REQ-007 | Given the new docs, When they name the runtimes that print the compaction line, Then none names Devin or OpenCode | T023 output | Unmet | - |

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

No. The phase is planned and not built, so every row is unmet until its task runs.
<!-- /ANCHOR:closure -->
