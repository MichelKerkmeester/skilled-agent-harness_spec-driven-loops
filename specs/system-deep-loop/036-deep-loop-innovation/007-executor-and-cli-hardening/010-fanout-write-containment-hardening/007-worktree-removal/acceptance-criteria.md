---
title: "Acceptance Criteria: Remove the per-lineage worktree mechanism, its modules, wiring, tests and plan, now that attribution is not a requirement"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/007-worktree-removal"
    last_updated_at: "2026-09-14T09:09:01Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-14-007-worktree-removal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Remove the per-lineage worktree mechanism, its modules, wiring, tests and plan, now that attribution is not a requirement

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/007-worktree-removal
**Level:** 2
**Status:** Complete
**Date:** 2026-09-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the runtime after removal, When listed and grepped, Then no worktree module, config key or flag remains | `runtime/lib/deep-loop/executor-config.ts:695` (containment schema without a worktrees field); `ls runtime/lib/deep-loop` holds no worktree module; `.opencode/commands/deep` has no `--worktrees` | Met | - |
| AC-002 | REQ-002 | Given the removal, When the suite and wrapper tests run, Then both exit zero | `.opencode/bin/tests/worktree-session.test.sh:1` 25 pass and `worktree-reaper.test.sh:1` 24 pass, exit 0; full runtime suite 151 files, 2568 passed, exit 0 | Met | - |
| AC-003 | REQ-003 | Given a live two-lane fan-out with a neighbour writing outside the packet, When it settles, Then every lane is fulfilled and every out-of-scope file is preserved | `007-worktree-removal/research/orchestration-summary.json:1` (total 2, succeeded 2, failed 0, both completed with containment advisory) and `research/orchestration-status.log:1` (two `containment_advisory` events, empty revert lists) | Met | - |

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

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
