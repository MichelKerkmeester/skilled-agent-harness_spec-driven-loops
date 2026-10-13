---
title: "Acceptance Criteria: Clone path and messages"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "clone path and messages acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/001-clone-path-and-messages"
    last_updated_at: "2026-10-13T19:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-029-001-ac"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Clone path and messages

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/001-clone-path-and-messages
**Level:** 2
**Status:** Complete
**Date:** 2026-10-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fresh clone with no `node_modules`, When `ci-skill-root-metadata.cjs` runs, Then it exits 1 with a line naming `worktree-naming.sh provision` and no stack line | Ledger row L-1 at `implementation-summary.md:89`; `goal.md` criterion 1 | Met | - |
| AC-002 | REQ-002 | Given that clone, When the provision command the README names runs, Then it exits 0 and the doctor on sk-code and `ci-skill-root-metadata.cjs` exit 0 | Ledger row L-2 at `implementation-summary.md:90`; `goal.md` criterion 1 | Met | - |
| AC-003 | REQ-003 | Given a copy with stale sk-code routing, When the guard runs, Then it exits 1 and prints the refresh command and both manifest paths | Ledger row L-3 at `implementation-summary.md:91` | Met | - |
| AC-004 | REQ-004 | Given that copy, When the printed refresh and copy run verbatim, Then the guard and sync `--check` exit 0 | Ledger row L-4 at `implementation-summary.md:92` | Met | - |
| AC-005 | REQ-005 | Given the README adapting block, When it is searched, Then it names `skilled.trustRepoHooks`, `regenerate-skill-derived.cjs`, the feature catalog, `leaf-scopes.json` and `phase-detection.md` | Ledger row L-5 at `implementation-summary.md:93`; `goal.md` criterion 3 | Met | - |
| AC-006 | REQ-006 | Given the changed scripts, When both test files, the README battery and the drift guards run, Then all exit 0, and T1 and T3 fail against the origin/main source | Ledger rows L-6 and T1 to T4 at `implementation-summary.md:94` and `implementation-summary.md:99`; `goal.md` criteria 2 and 4 | Met | - |

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

Every criterion is Met. Evidence is the ledger, the T rows and the RV rows in `implementation-summary.md`, from runs on the build commit, and `review/review-report.md`.
<!-- /ANCHOR:closure -->
