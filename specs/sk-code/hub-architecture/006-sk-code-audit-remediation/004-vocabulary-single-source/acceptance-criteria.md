---
title: "Acceptance Criteria: Phase 4: vocabulary-single-source"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "vocabulary single source acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/004-vocabulary-single-source"
    last_updated_at: "2026-11-14T12:01:53Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-vocabulary-single-source"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: vocabulary-single-source

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `004-vocabulary-single-source`
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
| AC-001 | REQ-001 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | With one keyword removed from `code-frontend-aliases` in a scratch copy of the hub, the router-sync guard exits non-zero and names `hub-router.json`. | Unmet | - |
| AC-002 | REQ-002 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | On the unmodified tree, `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints PASS for the router-sync leg. | Unmet | - |
| AC-003 | REQ-003 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `rg -c 'fires on' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md` prints nothing and exits 1. | Unmet | - |
| AC-004 | REQ-004 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | The `description` of `mode-registry.json` states the aliases rule, and the guard checks it: a registry alias absent from every `hub-router.json` class makes the guard exit non-zero. | Unmet | - |
| AC-005 | REQ-005 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` passes with the two new cases. | Unmet | - |
| AC-006 | REQ-006 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | The same leg runs for `sk-code-ci`, whose vocabulary is copied the same way, with no change to its keywords. | Unmet | - |

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
