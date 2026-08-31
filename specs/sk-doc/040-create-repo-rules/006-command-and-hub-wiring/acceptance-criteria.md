---
title: "Acceptance Criteria: Phase 6: Command and Hub Wiring"
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
    packet_pointer: "sk-doc/040-create-repo-rules/006-command-and-hub-wiring"
    last_updated_at: "2026-08-31T11:33:12Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the closure gate for command and hub wiring"
    next_safe_action: "Record registry baselines, then read a sibling entry in each"
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
# Acceptance Criteria: Phase 6: Command and Hub Wiring

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/040-create-repo-rules/006-command-and-hub-wiring
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
| AC-001 | REQ-001 | Given the command, When compared to its eleven siblings, Then it matches their shape | Authored through `sk-create-command`, not by hand | Unmet | - |
| AC-002 | REQ-002 | Given each of the four registries, When the entry is checked, Then it is read back rather than assumed | Entry loaded and inspected after writing | Unmet | - |
| AC-003 | REQ-003 | Given the cross-runtime mirror, When it is tested, Then the symlink is followed to a real file | Existence alone is not the check; a sibling packet lost three to dangling links | Unmet | - |
| AC-004 | REQ-004 | Given an overlapping request, When the hub routes, Then the discriminator says when to prefer a sibling | Named explicitly against `sk-create-skill` | Unmet | - |
| AC-005 | REQ-005 | Given every registry, When parsed after the edit, Then all four are valid JSON | The hub loads them for twelve other modes | Unmet | - |
| AC-006 | REQ-006 | Given the choreography, When compared to siblings, Then it has the same three steps in order | Hub, then mode contract, then presentation | Unmet | - |
| AC-007 | REQ-007 | Given a rule-shaped request, When signals are evaluated, Then this mode is selected over `sk-create-skill` | The likely confusion, checked rather than assumed | Unmet | - |
| AC-008 | REQ-008 | Given the argument hint, When read, Then it covers create, revise and retire | The mode owns all three | Unmet | - |
| AC-009 | REQ-009 | Given each registry, When counts are compared before and after, Then exactly one entry was added | Never zero, never two; a successful write is not evidence | Unmet | - |
| AC-010 | REQ-002 | Given the other twelve modes, When routing is checked after the edit, Then none regressed | A malformed shared file breaks more than this mode | Unmet | - |
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

Written when the phase closes. AC-009 is the one that catches the real failure mode: four files must each gain exactly one entry, and a write that succeeds while changing nothing is invisible unless the counts are compared.
<!-- /ANCHOR:closure -->
