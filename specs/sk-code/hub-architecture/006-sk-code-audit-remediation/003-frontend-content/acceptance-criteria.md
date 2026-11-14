---
title: "Acceptance Criteria: Phase 3: frontend-content"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "frontend content acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/003-frontend-content"
    last_updated_at: "2026-11-14T12:01:52Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-frontend-content"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: frontend-content

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `003-frontend-content`
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
| AC-001 | REQ-001 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `rg -l 'visual, motion and Figma intents' .skilled/skills/sk-code/sk-code-frontend/SKILL.md .skilled/skills/sk-code/sk-code-frontend/ROUTER.md .skilled/skills/sk-code/sk-code-frontend/references/frontend-practice.md \| wc -l` prints 3, and `rg -c 'web layer before applying a topic reference' .skilled/skills/sk-code/sk-code-frontend/SKILL.md` prints nothing and exits 1. | Unmet | - |
| AC-002 | REQ-002 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `ls .skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/frontend-surface/*.md \| wc -l` prints 11, and the playbook package validator exits 0. | Unmet | - |
| AC-003 | REQ-003 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `cat .skilled/skills/sk-code/sk-code-frontend/references/*.md \| rg -c '^### M[0-9]+\.'` prints 48, the count before the move, so no motion rule is lost or duplicated. | Unmet | - |
| AC-004 | REQ-004 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `wc -l .skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md` prints 400 or fewer. | Unmet | - |
| AC-005 | REQ-005 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/quality-checklist-map.test.cjs` passes with the new frontend row in place. | Unmet | - |
| AC-006 | REQ-006 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `rg -c -- '--text-[a-z0-9]+: *[0-9.]+px' .skilled/skills/sk-code/sk-code-frontend/assets/tokens.css` prints nothing and exits 1, unless the open question is answered the other way. | Unmet | - |
| AC-007 | REQ-007 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `rg -c '^### I8\.' .skilled/skills/sk-code/sk-code-frontend/references/web-internationalization.md` prints 1, and the `P` ids in `web-performance-and-loading.md` appear in ascending order. | Unmet | - |
| AC-008 | REQ-008 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `rg -c 'nine web topic files' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md` prints nothing and exits 1. | Unmet | - |
| AC-009 | REQ-009 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `rg -c 'project mode' .skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md` prints a number above 0 inside section 8, naming where other frameworks live. | Unmet | - |
| AC-010 | REQ-010 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `rg -c 'tokens.css' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md` and `rg -c 'workflow-implement' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md` each print a number above 0. | Unmet | - |

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
