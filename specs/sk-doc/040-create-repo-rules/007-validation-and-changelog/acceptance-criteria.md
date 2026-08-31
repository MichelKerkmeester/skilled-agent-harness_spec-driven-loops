---
title: "Acceptance Criteria: Phase 7: Validation, Changelog and Closeout"
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
    packet_pointer: "sk-doc/040-create-repo-rules/007-validation-and-changelog"
    last_updated_at: "2026-08-31T11:33:13Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the closure gate for validation, changelog and closeout"
    next_safe_action: "Choose the borderline refusal case and write it down first"
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
# Acceptance Criteria: Phase 7: Validation, Changelog and Closeout

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/040-create-repo-rules/007-validation-and-changelog
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
| AC-001 | REQ-001 | Given the mode, When it is exercised, Then both an accept and a refusal were run and kept | Two outputs retained as evidence regardless of verdict | Unmet | - |
| AC-002 | REQ-002 | Given the refused request, When the output is read, Then it names the failed test and the destination | A bare refusal is not a useful answer | Unmet | - |
| AC-003 | REQ-003 | Given the changelog symlink, When it is tested, Then it resolves to the packet changelog directory | Followed, not merely created | Unmet | - |
| AC-004 | REQ-004 | Given the parent packet, When the gate runs recursively, Then the parent and all seven children pass | First `RESULT:` line per folder | Unmet | - |
| AC-005 | REQ-005 | Given a defect found by the exercise, When it is handled, Then it is attributed to its owning phase | A closeout that patches earlier work hides where the defect came from | Unmet | - |
| AC-006 | REQ-006 | Given a plain-language rule request, When the advisor routes it, Then it reaches this mode | If the advisor is unreachable, recorded as not run rather than passed | Unmet | - |
| AC-007 | REQ-007 | Given the changelog, When compared to siblings, Then it matches their format | Written to the changelog mode format | Unmet | - |
| AC-008 | REQ-008 | Given the produced rule, When judged, Then it passes the phase-4 standards and not only the structural floor | The harder of the two bars | Unmet | - |
| AC-009 | REQ-009 | Given the packet documents, When read together, Then none contradicts another about state | Parent status, phase map and completion claims agree | Unmet | - |
| AC-010 | REQ-010 | Given the verdict, When reported, Then it is honest including if the mode is not worth using | Seven phases of sunk cost is not a reason to recommend a tool | Unmet | - |
| AC-011 | REQ-001 | Given the corpus, When the exercise finishes, Then `repo-rules/` is unchanged | Unless an operator decision ships the exercise rule | Unmet | - |
| AC-012 | REQ-004 | Given this phase folder, When the packet gate runs, Then the spec docs validate | `validate.sh` on this folder with `--strict` prints `RESULT: PASSED` | Unmet | - |

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

Written when the phase closes. AC-001 and AC-010 decide whether this is a closure or a ceremony: the packet closes on two observed runs, and the verdict is reported as it came out rather than as the phase count would suggest.
<!-- /ANCHOR:closure -->
