---
title: "Acceptance Criteria: Hub repo folder exemption"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hub repo folder exemption acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/068-hub-repo-folder-exemption"
    last_updated_at: "2026-10-20T18:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked every criterion Met with observed evidence"
    next_safe_action: "Commit after the operator's go-ahead"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/parent-skill-check.cjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "1004bf13-7863-4447-a63e-6ad2f5fcfd86"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Hub repo folder exemption

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/068-hub-repo-folder-exemption
**Level:** 2
**Status:** Complete
**Date:** 2026-10-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given Product Owner's repository root declaring `repo-root-hub`, When both checkers run on it, Then both pass | `parent-skill-check.cjs` on the Product Owner root: 0 fail, 0 warn. `validate_skill_package.py --strict` on the root and its four packets: exit 0 | Met | - |
| AC-002 | REQ-002 | Given a hub without the extension, When the existing suites run, Then every verdict is unchanged | Invariant suite 109 pass 0 fail, other checker suites pass, package regressions 26 pass, sk-doc pytest passes with the harness test settled on a clean clone | Met | - |
| AC-003 | REQ-003 | Given a `repoPaths` entry naming a packet, a hub file, a nested path, a dotted name or an empty list, When the checker runs, Then 3f fails | Repo-root cases in `parent-skill-check-invariants.test.cjs` | Met | - |
| AC-004 | REQ-004 | Given the hub doctrine, When a reader looks up named extensions, Then `repo-root-hub` is listed with its field | `parent-skills-nested-packets.md` Section 4 table row, version 1.2.4.0 | Met | - |

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

Product Owner passing both checkers at its repository root carried the packet. Moneybird Accountant's own registry was left out, since its failures are mostly schema gaps that are that system's work.
<!-- /ANCHOR:closure -->
