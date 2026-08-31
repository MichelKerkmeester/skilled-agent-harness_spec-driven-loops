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
**Status:** Draft
**Date:** 2026-08-31
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the three wiring points, When one is skipped, Then the contract says what is lost | Trigger row, index row, governed-section pointer each with its consequence | Unmet | - |
| AC-002 | REQ-002 | Given a shipped rule, When the create path is followed, Then it reproduces that rule actual wiring | Dry-run compared against the live router rows | Unmet | - |
| AC-003 | REQ-003 | Given the retire path, When run against a shipped rule on paper, Then the router stays self-consistent | Row count still equals file count; every link resolves | Unmet | - |
| AC-004 | REQ-004 | Given a rule the scope statement excludes, When a trigger row is proposed, Then the check stops it | Both phase-1 widenings replayed and caught | Unmet | - |
| AC-005 | REQ-005 | Given any path, When it touches `AGENTS.md`, Then it only adds or removes a pointer | Anything else escalates to the operator | Unmet | - |
| AC-006 | REQ-006 | Given a revision that changes when the rule fires, When applied, Then the trigger row changes with it | Otherwise the router lies about the rule | Unmet | - |
| AC-007 | REQ-007 | Given all three paths, When `version` is considered, Then its behaviour is stated for each | Create, revise and retire each say what happens | Unmet | - |
| AC-008 | REQ-008 | Given a retirement, When it completes, Then the reason is recorded | So the same rule is not re-proposed | Unmet | - |
| AC-009 | REQ-009 | Given a repository with no router, When a rule is requested, Then the contract says the router comes first | Consistent with the prerequisite framing | Unmet | - |
| AC-010 | REQ-003 | Given any path interrupted at a step boundary, When the state is inspected, Then nothing dangles | Interruption states enumerated for all three paths | Unmet | - |
| AC-011 | REQ-001 | Given this phase folder, When the packet gate runs, Then the spec docs validate | `validate.sh` on this folder with `--strict` prints `RESULT: PASSED` | Unmet | - |

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

Written when the phase closes. AC-003 carries it: retire is the only operation with no worked example anywhere, so a dry-run that leaves the router self-consistent is the whole evidence that the contract is right.
<!-- /ANCHOR:closure -->
