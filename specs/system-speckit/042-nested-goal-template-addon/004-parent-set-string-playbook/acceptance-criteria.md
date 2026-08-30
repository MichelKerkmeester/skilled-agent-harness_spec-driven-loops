---
title: "Acceptance Criteria: Parent Set-String Playbook"
description: "The operator-facing contract for what actually gets set as the objective: a short pointer plus the completion criteria copied out, because no stop evaluator opens the referenced file."
trigger_phrases:
  - "set string playbook"
  - "goal pointer"
  - "completion criteria copied"
  - "stop evaluator"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/042-nested-goal-template-addon/004-parent-set-string-playbook"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase specification from the verified research"
    next_safe_action: "Author the playbook and its worked example"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/references/"
    session_dedup:
      fingerprint: "sha256:7b648916c2041f3fe137f6d1efb6321a8f104c0a72e199bb84f2fd0bb36e242b"
      session_id: "2026-08-29-042-004-parent-set-string-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Completion criteria are copied into the set string because evaluators do not read the file"
---

# Acceptance Criteria: Parent Set-String Playbook

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/042-nested-goal-template-addon/004-parent-set-string-playbook
**Level:** 2
**Status:** Draft
**Date:** 2026-08-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the playbook, When an operator follows it, Then they produce a set string without opening the packet | Pointer, binding and copied-criteria shape at `references/workflows/goal-set-string-playbook.md:23` | Met | - |
| AC-002 | REQ-002 | Given the worked example, When measured, Then it fits inside the smallest documented runtime cap | Worked example measures 529 characters (`references/workflows/goal-set-string-playbook.md:85`), inside every documented cap | Met | - |
| AC-003 | REQ-003 | Given the playbook, When read, Then it states the precedence rule between parent decisions and child detail | Precedence stated at `references/workflows/goal-set-string-playbook.md:29` | Met | - |
| AC-004 | REQ-004 | Given the playbook, When read, Then it explains why completion criteria are copied rather than referenced | `references/workflows/goal-set-string-playbook.md:46` states why criteria are copied, not referenced | Met | - |
| AC-005 | REQ-005 | Given a durable slice that will not fit, When an operator consults the playbook, Then it tells them what to cut | Cut order at `references/workflows/goal-set-string-playbook.md:54` | Met | - |

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

All five criteria met. The worked example's stated size was measured rather than asserted, and both numbers in it were corrected after measurement.
<!-- /ANCHOR:closure -->
