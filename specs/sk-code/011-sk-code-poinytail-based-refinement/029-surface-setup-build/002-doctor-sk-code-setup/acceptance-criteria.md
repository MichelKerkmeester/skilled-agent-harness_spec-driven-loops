---
title: "Acceptance Criteria: Doctor sk-code setup"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor sk-code setup acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup"
    last_updated_at: "2026-10-13T19:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-029-002-ac"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Doctor sk-code setup

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup
**Level:** 2
**Status:** In Progress
**Date:** 2026-10-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the doctor routes, When `route-validate.sh` runs, Then it exits 0 and lists `/doctor:sk-code` with target `setup` and `mutating: read-only` | `goal.md` criterion 1 | Unmet | - |
| AC-002 | REQ-002 | Given the live tree and a pristine copy, When `sk-code-setup-check.cjs` runs, Then every leg passes and it exits 0 | Ledger row S-1; `goal.md` criterion 2 | Unmet | - |
| AC-003 | REQ-003 | Given a copy with a hand edit to sk-code routing and no refresh, When the script runs, Then it exits 1, names the guard leg with the refresh command and fails the probe leg | Ledger row S-2 | Unmet | - |
| AC-004 | REQ-004 | Given an unprovisioned clone, When the script runs, Then the precheck names the provision command with no stack | Ledger row S-3 | Unmet | - |
| AC-005 | REQ-005 | Given the mirrors and the three reference files, When the mirror checks and a grep run, Then both checks exit 0 and each file names `/doctor:sk-code` | `goal.md` criterion 4 | Unmet | - |

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

Every criterion is open until 001 is on origin/main and this phase is built, reviewed and its ledger recorded.
<!-- /ANCHOR:closure -->
