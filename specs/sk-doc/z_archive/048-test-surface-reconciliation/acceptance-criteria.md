---
title: "Acceptance Criteria: Reconcile the test and fixture surfaces that had frozen against a tree that moved"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-doc/048-test-surface-reconciliation"
    last_updated_at: "2026-09-01T06:54:10Z"
    last_updated_by: "scaffold"
    recent_action: "Verified each suite from the final state rather than from a report"
    next_safe_action: "Commit the paths this packet owns"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Reconcile the test and fixture surfaces that had frozen against a tree that moved

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `specs/sk-doc/048-test-surface-reconciliation`
**Level:** 2
**Status:** In Progress
**Date:** 2026-09-01
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the deep-improvement benchmark suite, When it runs from the final state, Then no test fails | 53 files and 675 tests passing, up from 15 files and 67 tests failing | Met | - |
| AC-002 | REQ-001 | Given the spec-kit validation suite, When it runs, Then it reports no failure | `Passed: 83  Failed: 0` | Met | - |
| AC-003 | REQ-001 | Given the advisor regression gate, When it runs, Then every case passes | 94 of 94, `overall_pass` true, with `top1_accuracy` 1.0 and command-bridge false positives at 0 | Met | - |
| AC-004 | REQ-001 | Given the five per-hub canary validators, When each runs, Then each exits zero | 5 of 5 exit 0, reporting 41 modes with single-route coverage | Met | - |
| AC-005 | REQ-002 | Given every fix in this packet, When the diff is read, Then no assertion was weakened, skipped or deleted | Two suites gained tests rather than losing them, and one reframed test asserts a failure state exactly rather than tolerating it | Met | - |
| AC-006 | REQ-003 | Given each stale pin, When it is re-pinned, Then a red run first proved the pin still bites | Six pin sites for one scorer digest, each re-pinned after a failing run named the mismatch | Met | - |
| AC-007 | REQ-004 | Given a test whose subject was withdrawn, When it is repaired, Then it falsifies something still real | A collapse falsifier now breaks the contract its rule guards, and the sole clarify case was retargeted at two live modes | Met | - |
| AC-008 | REQ-005 | Given the real defects found among the stale failures, When the packet closes, Then each is fixed rather than noted | The playbook loader scored one skill on 1 scenario instead of 30, a hub mode had no stage-two wiring, three advisor anchors sat below the routing floor, and one skill was declared a corpus it no longer had | Met | - |
| AC-009 | REQ-002 | Given the negative fixtures and falsifiers, When the suites are re-swept, Then each still fails on its original rule set | 16 negative validation fixtures still fail, and every coverage guard was proven to fire by removing a case | Met | - |
| AC-010 | REQ-001 | Given the remaining suites, When they run from the final state, Then they report no failure | Deep-loop runtime, ai-council, communication, plugins and the connectivity gate are still in flight at the time of writing | Unmet | - |

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

**Closeable:** Not yet

AC-010 is open: four suites and the connectivity gate were still being worked when this was
written. Everything else is met. The criterion that carried the packet is AC-005, because the
easy way to clear ninety-eight failures is to weaken what they assert, and the whole value of
the work is that nothing was.
<!-- /ANCHOR:closure -->
