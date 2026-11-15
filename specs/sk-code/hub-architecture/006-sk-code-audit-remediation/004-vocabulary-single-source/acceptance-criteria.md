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
    last_updated_at: "2026-11-14T14:41:22Z"
    last_updated_by: "scaffold"
    recent_action: "Marked every criterion with observed evidence"
    next_safe_action: "None, the packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-vocabulary-single-source"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one. The first 2 rows are the P0 blockers.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|---|---|---|---|---|---|
| AC-001 | REQ-001 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | With one keyword removed from `code-frontend-aliases` in a scratch copy of the hub, the router-sync guard exits non-zero and names `hub-router.json`. Observed: exit 1 with `hub-router.json` named in 3 problem lines, on 2026-11-14 at `9a9bbb76aa`. | Met | - |
| AC-002 | REQ-002 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | On the unmodified tree, `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints PASS for the router-sync leg. Observed: `PASS: router-sync` with `5/5 checks passed`. | Met | - |
| AC-003 | REQ-003 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `rg -c 'fires on' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md` prints nothing and exits 1. Observed: nothing printed, exit 1. | Met | - |
| AC-004 | REQ-004 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | The `description` of `mode-registry.json` states the aliases rule, and the guard checks it: a registry alias absent from every `hub-router.json` class makes the guard exit non-zero. Observed: the description states the rule, and a scratch alias no class holds made check 2 exit 1. | Met | - |
| AC-005 | REQ-005 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` passes with the two new cases. Observed: 18 pass, 0 fail. | Met | - |
| AC-006 | REQ-006 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | The same leg runs for `sk-code-ci`, whose vocabulary is copied the same way, with no change to its keywords. Observed: the alias rule runs for `sk-code-ci` and passes. Its three keyword copies hold 72, 58 and 12 keywords, so the three-way match does not run for it. | Superseded | ADR-001 |

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

Five criteria are met with the outputs observed on 2026-11-14 at commit `9a9bbb76aa`. AC-006 is superseded by ADR-001 in `decision-record.md`, on the operator's answer of the same day.
<!-- /ANCHOR:closure -->
