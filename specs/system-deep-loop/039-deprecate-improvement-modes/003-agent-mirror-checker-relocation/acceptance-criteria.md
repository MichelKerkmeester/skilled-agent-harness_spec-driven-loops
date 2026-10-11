---
title: "Acceptance Criteria: Phase 3: agent-mirror-checker-relocation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "agent mirror checker relocation acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/039-deprecate-improvement-modes/003-agent-mirror-checker-relocation"
    last_updated_at: "2026-10-10T19:17:43Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: agent-mirror-checker-relocation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/039-deprecate-improvement-modes/003-agent-mirror-checker-relocation
**Level:** 2
**Status:** Complete
**Date:** 2026-10-10
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the moved checker, When the old-path search runs outside `specs/` and history, Then it prints nothing outside the packet | Only generated indexes and the packet README remain (`implementation-summary.md` Verification); callers at `.skilled/hooks/git/pre-commit:82` | Met | - |
| AC-002 | REQ-002 | Given the bin vitest config, When both moved suites run, Then they pass | Both moved suites pass, 11 tests; `.skilled/bin/check-agent-mirror-sync.vitest.ts:10` | Met | - |
| AC-003 | REQ-003 | Given the new path, When `pre-commit.test.sh` and `broken-move-drill.sh` run, Then each matches or beats its baseline | Hook suite 71/71; drill not rerun (baseline failure, clones committed tip), see `implementation-summary.md` Verification | Met | - |
| AC-004 | REQ-001 | Given the worktree, When `node .skilled/bin/check-agent-mirror-sync.cjs --all` runs, Then it exits 0 | 12 agents in sync; `.skilled/bin/check-agent-mirror-sync.cjs:27` | Met | - |

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

The checker runs from `.skilled/bin/` and every caller points there. The drill was not rerun because it clones the committed tip and fails on the baseline.
<!-- /ANCHOR:closure -->
