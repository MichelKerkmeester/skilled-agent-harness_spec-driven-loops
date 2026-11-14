---
title: "Acceptance Criteria: Phase 5: hub-router-alignment"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hub router alignment acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/005-hub-router-alignment"
    last_updated_at: "2026-11-14T12:01:54Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-hub-router-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: hub-router-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `005-hub-router-alignment`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one. The first 3 rows are the P0 blockers.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|---|---|---|---|---|---|
| AC-001 | REQ-001 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | The path check in `plan.md` section 5 prints `missing 0` for every backtick path in `ROUTER.md` sections 1 to 7, brace forms expanded. | Unmet | - |
| AC-002 | REQ-002 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `rg -c 'workflow-implement.md' .skilled/skills/sk-code/ROUTER.md` prints 2 or more, and `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0. | Unmet | - |
| AC-003 | REQ-003 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` ends with `STATUS=PASS failed=0`. | Unmet | - |
| AC-004 | REQ-004 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | With a guard forced to fail in a scratch copy, `sk-code-setup-check.cjs` exits non-zero, or its header documents that exit 0 is deliberate and the open question records the operator's answer. | Unmet | - |
| AC-005 | REQ-005 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `sed -n '/^## 3\./,/^## 4\./p;/^## 5\./,/^## 6\./p' .skilled/skills/sk-code/ROUTER.md \| rg -c 'sk-code-ci\|sk-code-frontend'` prints 4 or more. | Unmet | - |
| AC-006 | REQ-006 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `rg -c 'by judgment' .skilled/skills/sk-code/ROUTER.md .skilled/skills/sk-code/sk-code-skilled/SKILL.md .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints nothing and exits 1, and each of the three files names the same selector for the MCP server checklist. | Unmet | - |
| AC-007 | REQ-007 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `rg -c 'barter/' .skilled/skills/sk-code/ROUTER.md` prints nothing and exits 1. | Unmet | - |
| AC-008 | REQ-008 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | The `version` in `SKILL.md`, `description.json`, `mode-registry.json` and `hub-router.json` is the same string, and `.skilled/skills/sk-code/changelog/v<that version>.md` exists. | Unmet | - |

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
