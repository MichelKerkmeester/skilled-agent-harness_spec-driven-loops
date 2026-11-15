---
title: "Acceptance Criteria: Phase 17: terminal-record-gaps"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "terminal record gaps acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/017-terminal-record-gaps"
    last_updated_at: "2026-11-15T10:10:54Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-terminal-record-gaps"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 17: terminal-record-gaps

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `017-terminal-record-gaps`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a terminal record with stopReason `maxDurationReached`, When it is prepared, Then it is accepted | `deep-review-ledger-schema.vitest.ts` terminal test accepts `maxDurationReached`; the file passes 17/17 (`scratch/after.txt`) | Met | - |
| AC-002 | REQ-002 | Given `deep-review.yaml`, When `rg -n -B1 'skip_to: phase_synthesis' deep-review.yaml` runs, Then the duration stop's jump is preceded by `run_first: record_terminal_gates`, and the stop-reason rule lists `maxDurationReached` | `scratch/after.txt`: line 903 `run_first: record_terminal_gates` before line 904's jump; the rule at line 1144 lists `maxDurationReached` | Met | - |
| AC-003 | REQ-003 | Given `deep-review.yaml`, When `rg -n 'skip_to: gate_pre_synthesis\|proceed_to: gate_pre_synthesis' deep-review.yaml` runs, Then it exits 1, so every manual stop enters at `phase_synthesis` and runs hydrate and derive-verdict | `scratch/after.txt`: rg exit 1; lines 1254, 1298, 1411 and 1795 go to `phase_synthesis` with their `set` and `run_first` kept | Met | - |
| AC-004 | REQ-004 | Given the T001 baseline, When the build is done, Then `npm test` and `npm run typecheck` show no failure the baseline lacks and the drift check prints `OK` | `scratch/after.txt`: suite 3019 passed, 0 failed (baseline 3019 passed); typecheck exit 0; census 92/25/67 []; drift `OK commands=2` | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Yes. Every criterion is Met with observed evidence.
<!-- /ANCHOR:closure -->
