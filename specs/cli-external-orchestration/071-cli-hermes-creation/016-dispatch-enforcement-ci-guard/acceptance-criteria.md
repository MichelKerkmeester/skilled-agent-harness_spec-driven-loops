---
title: "Acceptance Criteria: Phase 4: dispatch-enforcement-ci-guard"
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
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/016-dispatch-enforcement-ci-guard"
    last_updated_at: "2026-09-15T16:29:34Z"
    last_updated_by: "scaffold"
    recent_action: "Every criterion met with its evidence recorded"
    next_safe_action: "None; the packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-016-dispatch-enforcement-ci-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: dispatch-enforcement-ci-guard

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/071-cli-hermes-creation/016-dispatch-enforcement-ci-guard
**Level:** 2
**Status:** Complete
**Date:** 2026-09-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a check added with no fixture pair, When the guard runs, Then it fails | Mutation run: a new check inserted into the registry turns the suite red, green again once restored | Met | - |
| AC-002 | REQ-002 | Given a predicate loosened to accept its own violation, When the guard runs, Then it fails | Mutation run: the Pi offline predicate replaced with an always-true function turns the suite red | Met | - |
| AC-003 | REQ-003 | Given a packet that drops a declared rule, When the guard runs, Then it fails | Mutation run: removing the Pi offline rule from its packet turns the suite red via the bijection assertion | Met | - |
| AC-004 | REQ-004 | Given the suite, When the workflow runs it, Then a failure fails the build and a deleted suite fails closed | Blocking workflow added; both of its steps verified from the repository root, and the missing-file branch exits 1 by construction | Met | - |
| AC-005 | REQ-005 | Given a rule declared at an unknown severity, When the guard runs, Then it fails | Mutation run: changing a severity to an unrecognised level turns the suite red | Met | - |

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

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
