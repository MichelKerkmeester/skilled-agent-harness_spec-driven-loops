---
title: "Acceptance Criteria: Phase 6: doctor-update-local-state"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor update local state acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "commands/002-doctor-audit-and-fixes/006-doctor-update-local-state"
    last_updated_at: "2026-11-02T09:16:49Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: doctor-update-local-state

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** commands/002-doctor-audit-and-fixes/006-doctor-update-local-state
**Level:** 2
**Status:** In Progress
**Date:** 2026-11-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the changed tree, When `release-update.cjs --help` runs and the commit lands, Then the three state paths name `.skilled/skills/.state/doctor-update/` and `git ls-files .skilled/release` prints nothing | `--help` output read 2026-11-02; `git ls-files` after the commit | Unmet | - |
| AC-002 | REQ-002 | Given the suite, When `node .skilled/commands/doctor/scripts/tests/release-update.test.cjs` runs, Then it prints `tests 75`, `pass 75`, `fail 0`, including the legacy-read test | Run by the main session 2026-11-02: `pass 75`, `fail 0`, exit 0; test at `release-update.test.cjs:653` | Met | - |
| AC-003 | REQ-003 | Given a base.json that differs from HEAD, When record-base and a second apply run, Then neither refuses, and a dirty framework file still refuses apply | `release-update.test.cjs:687` and `:995` pass; `:1265` still passes | Met | - |
| AC-004 | REQ-004 | Given the new lock path, When `upgrade-legacy.vitest.ts` runs, Then the lock-refusal tests pass | Run by the main session 2026-11-02: `Tests  67 passed (67)`, exit 0 | Met | - |
| AC-005 | REQ-005 | Given the tree, When `rg -n "\.skilled/release" .skilled -g '!**/changelog/**'` runs, Then every hit is a legacy-fallback reference, and no asset or page asks the operator to commit the records | Hits: `release-update.cjs` legacy constant, the validator's legacy prefix, and legacy tests; `doctor-update-contract.test.cjs` passes 12/12 | Met | - |
| AC-006 | REQ-006 | Given the root playbook, When the validator runs in main and in the worktree, Then both print 0 errors and the same 12 warnings, and `validate-playbook-package.test.cjs` exits 0 | Compared 2026-11-02: identical warning lists; test exit 0 | Met | - |
| AC-007 | REQ-001 | Given Barter's `skilled/` re-pinned to the commit, When `replay.cjs --check --root skilled` runs, Then it ends `miss=0` and `skilled/.skilled/release` does not exist | Barter re-pin evidence | Unmet | - |

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

AC-001, AC-004 and AC-007 wait on the vitest run, the commit and the Barter re-pin.
<!-- /ANCHOR:closure -->
