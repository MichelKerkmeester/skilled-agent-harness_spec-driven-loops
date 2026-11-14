---
title: "Acceptance Criteria: Phase 8: quality-packet-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "quality packet fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/008-quality-packet-fixes"
    last_updated_at: "2026-11-14T12:01:57Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-quality-packet-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: quality-packet-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `008-quality-packet-fixes`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one. The first 2 rows are the P0 blockers.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|---|---|---|---|---|---|
| AC-001 | REQ-001 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `grep -c '^\| QL-.*\| - \|$' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0, so every row carries fix evidence or `no change`. | Unmet | - |
| AC-002 | REQ-002 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests` passes. | Unmet | - |
| AC-003 | REQ-003 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `rg -l 'manual-testing-playbook' .skilled/skills/sk-code/sk-code-quality/SKILL.md .skilled/skills/sk-code/sk-code-quality/README.md \| wc -l` prints 2, when row `QL-06` held. | Unmet | - |
| AC-004 | REQ-004 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `rg -c 'A finding on a changed line blocks\.' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints nothing and exits 1, when row `QL-14` held. | Unmet | - |
| AC-005 | REQ-005 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | No file outside `sk-code-quality/` and the ledger appears in `git diff --stat` for this phase's commits. | Unmet | - |
| AC-006 | REQ-006 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | The newest file in `.skilled/skills/sk-code/sk-code-quality/changelog/` matches the `version` in `.skilled/skills/sk-code/sk-code-quality/SKILL.md`. | Unmet | - |

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

No criterion is met yet, because this phase is planned and not started.
<!-- /ANCHOR:closure -->
