---
title: "Acceptance Criteria: Phase 6: skilled-packet-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "skilled packet fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/006-skilled-packet-fixes"
    last_updated_at: "2026-11-14T16:12:25Z"
    last_updated_by: "scaffold"
    recent_action: "Marked every criterion with observed evidence"
    next_safe_action: "None, the packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-skilled-packet-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: skilled-packet-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `006-skilled-packet-fixes`
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
| AC-001 | REQ-001 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `grep -c '^\| SK-.*\| - \|$' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0, so every row carries fix evidence or `no change`. Observed: `0` on 2026-11-14 at `ac50644619`. | Met | - |
| AC-002 | REQ-002 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests` passes. Observed: 55 pass, 0 fail. | Met | - |
| AC-003 | REQ-003 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `rg -c 'This surface owns edits' .skilled/skills/sk-code/sk-code-skilled/SKILL.md` prints nothing and exits 1, when row `SK-01` held. Observed: nothing printed, exit 1. | Met | - |
| AC-004 | REQ-004 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `rg -c '^# opencode$' .skilled/skills/sk-code/sk-code-skilled/README.md` prints nothing and exits 1, when row `SK-09` held. Observed: nothing printed, exit 1. | Met | - |
| AC-005 | REQ-005 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | No file outside `sk-code-skilled/` and the ledger appears in `git diff --stat` for this phase's commits. Observed: `git show --stat ac50644619` lists ten files, all under `sk-code-skilled/`. The docs commit holds the ledger and this packet's own documents. | Met | - |
| AC-006 | REQ-006 | Given this phase's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | The newest file in `.skilled/skills/sk-code/sk-code-skilled/changelog/` matches the `version` in `.skilled/skills/sk-code/sk-code-skilled/SKILL.md`. Observed: `v2.2.0.0.md` is the newest file and `SKILL.md` holds `version: 2.2.0.0`. | Met | - |

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

Six criteria are met with the outputs observed on 2026-11-14 at commit `ac50644619`.
<!-- /ANCHOR:closure -->
