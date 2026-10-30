---
title: "Acceptance Criteria: Phase 8: hub-gap-report"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hub gap report acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/008-hub-gap-report"
    last_updated_at: "2026-10-30T05:21:19Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-hub-gap-report"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: hub-gap-report

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/075-doctor-sk-skill-command/008-hub-gap-report
**Level:** 2
**Status:** Planned
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a mode already shipped in a hub, When `sk-skill-check.cjs check <mode> --into-hub <hub>` runs, Then every applicable row prints present and it exits 0 | Command output and exit code | Unmet | - |
| AC-002 | REQ-002 | Given the fixture hub whose mode lacks `routerSignals`, When the same command runs, Then row 2 prints missing and it exits 1 | Test case in `sk-skill-check.test.cjs` | Unmet | - |
| AC-003 | REQ-003 | Given a clean tree, When the option runs, Then `git status --porcelain` is identical before and after | Two `git status` captures | Unmet | - |
| AC-004 | REQ-004 | Given a hub without `FULL_INVENTORY` and a `metadata`-class mode, When the report runs, Then rows 5 and 10 print n/a | Test cases | Unmet | - |
| AC-005 | REQ-005 | Given the advisor returns exit 75, When the report runs, Then row 10 prints UNKNOWN | Test case with a stubbed advisor | Unmet | - |
| AC-006 | REQ-006 | Given the new flag, When `route-validate.sh` and `run-all.sh` run, Then both pass | Script outputs | Unmet | - |

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

No criterion is met yet, because the phase is planned and not started.
<!-- /ANCHOR:closure -->
