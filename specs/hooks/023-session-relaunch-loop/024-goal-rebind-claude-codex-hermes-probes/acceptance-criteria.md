---
title: "Acceptance Criteria: Phase 24: goal-rebind-claude-codex-hermes-probes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "goal rebind probes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/024-goal-rebind-claude-codex-hermes-probes"
    last_updated_at: "2026-10-24T19:40:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Authored the acceptance criteria for this planned phase"
    next_safe_action: "Ask the operator about bypass flags, then run probe A"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-24-goal-rebind-claude-codex-hermes-probes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 24: goal-rebind-claude-codex-hermes-probes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/024-goal-rebind-claude-codex-hermes-probes
**Level:** 2
**Status:** Draft
**Date:** 2026-10-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the four probes, When each has run, Then scratch/ holds a record per probe with the command, output and exit status | Four files under `scratch/` named in `spec.md` section 3, each read for its exit status | Unmet | - |
| AC-002 | REQ-002 | Given each probe, When its negative control runs, Then the control shows the opposite result a failing claim would show | The control section in each record, with the plain-text, silent-hook, empty-ask and no-export result | Unmet | - |
| AC-003 | REQ-003 | Given the records, When the summary is written, Then it holds one verdict per probe, what each cannot show and the phase 27 path | The verdict table in `implementation-summary.md` | Unmet | - |
| AC-004 | REQ-004 | Given any probe, When it runs, Then no bypass flag was used without a fresh operator yes | The operator answer recorded in `scratch/` and the command lines in each record | Unmet | - |
| AC-005 | REQ-005 | Given the finished phase, When `git status` runs, Then only this folder changed and no goal, hook or process remains | `git status --short` output and a process list read after the last probe | Unmet | - |

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

Every row is Unmet because the phase is planned and nothing in it has been built or run. The packet closes when the four verdicts and the phase 27 path are written, even if a verdict is inconclusive.
<!-- /ANCHOR:closure -->
