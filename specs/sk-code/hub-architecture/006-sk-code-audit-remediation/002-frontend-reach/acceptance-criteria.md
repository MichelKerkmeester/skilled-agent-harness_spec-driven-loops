---
title: "Acceptance Criteria: Phase 2: frontend-reach"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "frontend reach acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/002-frontend-reach"
    last_updated_at: "2026-11-14T12:01:50Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-frontend-reach"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: frontend-reach

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `002-frontend-reach`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one. The first 4 rows are the P0 blockers.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|---|---|---|---|---|---|
| AC-001 | REQ-001 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | Every line tagged `frontend` in `specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/scratch/probes.txt` returns a decision whose `targets` include `sk-code-frontend`: 13 of 13. | Unmet | - |
| AC-002 | REQ-002 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | No line tagged `negative` in the same file returns a decision whose `targets` include `sk-code-frontend`: 0 of 8. | Unmet | - |
| AC-003 | REQ-003 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | The line tagged `review` returns `sk-code-review` first and `sk-code-frontend` second. | Unmet | - |
| AC-004 | REQ-004 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `node .skilled/bin/compiled-route-guard.cjs --json` and `node .skilled/bin/compiled-route-sync.cjs --check` both exit 0. | Unmet | - |
| AC-005 | REQ-005 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "update the stylesheet" --surface-hint FRONTEND` returns `sk-code-frontend` as a target. | Unmet | - |
| AC-006 | REQ-006 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | No keyword in `code-frontend-aliases` or `code-frontend-visual` is a single word: the count script in `plan.md` section 5 prints 0. | Unmet | - |
| AC-007 | REQ-007 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | Every prompt that routed to a non-frontend packet in `scratch/router-baseline.txt` still routes to the same first target. | Unmet | - |
| AC-008 | REQ-008 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-code/manual-testing-playbook` exits 0. | Unmet | - |

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
