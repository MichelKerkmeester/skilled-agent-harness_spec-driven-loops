---
title: "Acceptance Criteria: Phase 5: Integration and Lifecycle Contract"
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
    packet_pointer: "sk-doc/040-create-repo-rules/005-agents-md-integration"
    last_updated_at: "2026-08-31T11:33:11Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the closure gate for integration and lifecycle contract"
    next_safe_action: "Record the router baseline counts, then read the eight wirings"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: Integration and Lifecycle Contract

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/040-create-repo-rules/005-agents-md-integration
**Level:** 2
**Status:** Complete
**Date:** 2026-08-31
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the three wiring points, When one is skipped, Then the contract says what is lost | All three named in §1 with what is lost: trigger row = never loads, index row = unbrowsable, pointer = invisible at the moment of need | Met | - |
| AC-002 | REQ-002 | Given a shipped rule, When the create path is followed, Then it reproduces that rule actual wiring | Create path §3 matches what the reference implementation did eight times; all three points confirmed present on all eight rules, pointers 2-4 each | Met | - |
| AC-003 | REQ-003 | Given the retire path, When run against a shipped rule on paper, Then the router stays self-consistent | Dry-run against `root-cause.md`: 8/8/8 before, 7/7/7 after, self-consistent; four interruption states enumerated, worst is an unreferenced file | Met | - |
| AC-004 | REQ-004 | Given a rule the scope statement excludes, When a trigger row is proposed, Then the check stops it | Both widenings replayed - delegation posture and delivery - and both refused by the §4 In list as it stood at the time | Met | - |
| AC-005 | REQ-005 | Given any path, When it touches `AGENTS.md`, Then it only adds or removes a pointer | §6 bounds every path to adding or removing a pointer; anything else escalates, including a §4 widening | Met | - |
| AC-006 | REQ-006 | Given a revision that changes when the rule fires, When applied, Then the trigger row changes with it | §4 step 3: if the firing condition changes the trigger row changes in the same edit, or the router lies silently | Met | - |
| AC-007 | REQ-007 | Given all three paths, When `version` is considered, Then its behaviour is stated for each | §4 states the fourth-segment convention for all three paths, and records it as a choice because all eight rules sit at 1.0.0.0 | Met | - |
| AC-008 | REQ-008 | Given a retirement, When it completes, Then the reason is recorded | §5 step 5 requires the reason recorded, so the rule is not re-proposed | Met | - |
| AC-009 | REQ-009 | Given a repository with no router, When a rule is requested, Then the contract says the router comes first | §7 states the router is emitted first as a prerequisite, consistent with the framing | Met | - |
| AC-010 | REQ-003 | Given any path interrupted at a step boundary, When the state is inspected, Then nothing dangles | Four states enumerated in §3 and §5; no state leaves a row pointing at a missing file | Met | - |
| AC-011 | REQ-001 | Given this phase folder, When the packet gate runs, Then the spec docs validate | `validate.sh` on this folder with `--strict`: every rule passed and the only error was this row's own `AC_CLOSURE`, which clears once the row is marked | Met | - |

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

AC-003 carried it, as expected: retire has no worked example anywhere, and a dry-run
leaving the router at 7/7/7 is the strongest evidence available short of performing one.
The first attempt at that check reported inconsistent and was a counting error, not a
design error - index rows were being counted as trigger rows. Worth stating because a
dry-run trusted without re-checking its own arithmetic would have condemned a correct
ordering. Left open and named: the path has still never actually run.
<!-- /ANCHOR:closure -->
