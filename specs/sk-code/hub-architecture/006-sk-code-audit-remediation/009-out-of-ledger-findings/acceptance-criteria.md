---
title: "Acceptance Criteria: Phase 9: out-of-ledger-findings"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "out of ledger findings acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/009-out-of-ledger-findings"
    last_updated_at: "2026-11-14T17:05:50Z"
    last_updated_by: "scaffold"
    recent_action: "Marked every criterion with observed evidence"
    next_safe_action: "None, the packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-out-of-ledger-findings"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 9: out-of-ledger-findings

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `009-out-of-ledger-findings`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one. The first 2 rows are the P0 blockers.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|---|---|---|---|---|---|
| AC-001 | REQ-001 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `rg -c 'CHK-CMT' .skilled/skills/sk-code -g '*.md' -g '!**/changelog/**'` prints nothing and exits 1. Observed: nothing printed, exit 1, on 2026-11-14 at `7f35cb2db1`. | Met | - |
| AC-002 | REQ-002 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints `all 4 guards PASSED` and exits 0. Observed: `all 4 guards PASSED`, exit 0. | Met | - |
| AC-003 | REQ-003 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py .skilled/skills/sk-code/sk-code-skilled/scripts/README.md` prints a `PASS` line with `unresolved=0`. Observed: `PASS`, `unresolved=0`. | Met | - |
| AC-004 | REQ-004 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `rg -c 'OpenCode' .skilled/skills/sk-code/sk-code-quality/README.md` prints nothing and exits 1, and `rg -c 'OpenCode' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints 1, the line that names OpenCode as a runtime. Observed: nothing printed with exit 1, and `1`. | Met | - |
| AC-005 | REQ-005 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `rg -c 'depth alias maps' .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/efficiency-and-restraint/minimum-evidence-gate.md` prints nothing and exits 1. Observed: nothing printed, exit 1. | Met | - |
| AC-006 | REQ-006 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `rg -c '^\\| `scripts/tests/' .skilled/skills/sk-code/sk-code-skilled/manual-testing-playbook/manual-testing-playbook.md` prints 9. | Met | - |
| AC-007 | REQ-007 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | In each of `sk-code-skilled`, `sk-code-review` and `sk-code-quality`, the newest file in `changelog/` matches the `version` in `SKILL.md`. Observed: `v2.2.1.0.md`, `v1.9.18.0.md` and `v1.13.21.0.md` are the newest files, and each `SKILL.md` holds the same version. | Met | - |
| AC-008 | REQ-008 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `git show --stat` for this phase's code commit lists only files under those three packets. Observed: `git show --stat 7f35cb2db1` lists twelve files, all under the three packets. | Met | - |
| AC-009 | REQ-009 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `grep -c '^- \\[ \\] CHK-012' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/002-frontend-reach/tasks.md` prints 0. Observed: `0`. | Met | - |
| AC-010 | REQ-010 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | The `goal.md` log holds one row that compares a second reader's statement of when the MCP server checklist applies with the selector wording. Observed: the row `MCP server checklist selector, second reading` is in the log. | Met | - |

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

Ten criteria are met with the outputs observed on 2026-11-14 at commit `7f35cb2db1`.
<!-- /ANCHOR:closure -->
