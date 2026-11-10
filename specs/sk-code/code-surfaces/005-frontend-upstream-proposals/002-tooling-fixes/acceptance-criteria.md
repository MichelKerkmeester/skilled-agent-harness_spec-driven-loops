---
title: "Acceptance Criteria: Phase 2: tooling-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "tooling fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/code-surfaces/005-frontend-upstream-proposals/002-tooling-fixes"
    last_updated_at: "2026-11-03T08:33:54Z"
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
# Acceptance Criteria: Phase 2: tooling-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `sk-code/code-surfaces/005-frontend-upstream-proposals/002-tooling-fixes`
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
| AC-001 | REQ-001 | Given a fixture hub whose `intent_signals` holds one undeclared phrase, When `--check` runs, Then it names that phrase as an orphan, counts it and exits 1 | The orphan test in `scripts/tests/`. Evidence: `generate-router-intent-signals-orphans.test.cjs` "--check reports a generated phrase no router declares as an orphan" passes; fails with the orphan logic disabled (`scratch/revert-test.txt`) | Met | - |
| AC-002 | REQ-002 | Given the same fixture, When `--write` runs, Then the orphan is gone and the other signals keep their order | The write-order test. Evidence: "--write removes the orphan from both lists and keeps the surviving order" passes; fails with the logic disabled | Met | - |
| AC-003 | REQ-003 | Given a keep-marked signal no router declares, When `--check` and `--write` run, Then it is neither reported nor removed | The keep-marker test. Evidence: "a keep-listed generated phrase is neither reported nor removed" passes | Met | - |
| AC-004 | REQ-004 | Given a reach run with no `--concurrency` flag, When it starts, Then it uses the safer behavior | The reach-default test. Evidence: `ci-router-vocabulary-reach-default.test.cjs` pins `DEFAULT_CONCURRENCY === 2`; fails at 8 | Met | - |
| AC-005 | REQ-005 | Given the two candidate fixes, When the choice is made, Then the measured run that decided it is saved | `scratch/reach-concurrency.txt`. Evidence: `scratch/reach-concurrency.txt` holds warm, loaded and cold runs at 8 and 2; ADR-002 | Met | - |
| AC-006 | REQ-006 | Given the final state, When `--check` runs on the live tree, Then its orphan report is saved for the hub owners | `scratch/orphans.txt`. Evidence: `scratch/orphans.txt`: live `--check` 0 orphans on 7 hubs, plus the per-hub undeclared counts for the owners | Met | - |
| AC-007 | REQ-007 | Given the final state, When `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/` runs, Then it exits 0 | Test output and exit status. Evidence: `node --test scripts/tests/` 97/97, exit 0 | Met | - |

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

Every criterion is met with its evidence recorded in the table, and an independent pass in `scratch/verify-002.md` agreed.
<!-- /ANCHOR:closure -->
