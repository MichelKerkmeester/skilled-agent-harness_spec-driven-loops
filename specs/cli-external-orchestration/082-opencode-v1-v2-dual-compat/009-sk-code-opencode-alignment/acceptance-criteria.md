---
title: "Acceptance Criteria: Phase 9: sk-code-opencode-alignment"
description: "The criteria this packet must satisfy before it may be closed. Each one is met, waived by a decision record or superseded by one."
trigger_phrases:
  - "sk code opencode alignment acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/009-sk-code-opencode-alignment"
    last_updated_at: "2026-10-18T12:45:09Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-sk-code-opencode-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 9: sk-code-opencode-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `cli-external-orchestration/082-opencode-v1-v2-dual-compat/009-sk-code-opencode-alignment`
**Level:** 2
**Status:** Draft
**Date:** 2026-10-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Evidence | Status | Waiver |
|-------|-----|---------------------|--------------|----------|--------|--------|
| AC-001 | REQ-001 | Given the code from phases 002 to 008 is on the tree, When the drift guards run, Then the gate exits 0 | Run `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh`. Observe the exit status and the line `run-all-drift-guards: all 4 guards PASSED` | | Unmet | - |
| AC-002 | REQ-004 | Given each changed code file, When the comment-hygiene check runs on it, Then its exit status is 0 | Run `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh <file>` on every changed code file in the final set | | Unmet | - |
| AC-003 | REQ-002, REQ-003, REQ-006, REQ-007 | Given the findings ledger, When it is read, Then no P0 or P1 row is Open, every row names one finding class and each path, parser, redaction or security fix names its adversarial test file | Run `rg -n 'Open' findings.md` and confirm that no matching row has severity P0 or P1. Read the Class column of every row. Read the Evidence cell of each such fix | | Unmet | - |
| AC-004 | REQ-005 | Given the suites that phases 002 to 008 touched, When each one runs, Then its pass count is at or above its count in the phase 001 baseline | Run the suite commands listed in tasks.md T020 and compare each count with `../001-unknowns-and-baseline/baseline.json` | | Unmet | - |

The Verification cell holds the exact check to run. The Evidence cell stays empty until the orchestrator runs that check. Then it holds the observed output and exit status.

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

Not started. This section is written when the packet closes, not before.
<!-- /ANCHOR:closure -->
