---
title: "Acceptance Criteria: embed engine"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "agents md embed acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/003-embed-engine"
    last_updated_at: "2026-10-30T12:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet the open criteria, then mark each one Met with its command output"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: embed engine

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `agents/021-doctor-agents-md/001-doctor-agents-md/003-embed-engine`
**Level:** 2
**Status:** Draft
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a plan run, When the write-spy is read, Then it recorded zero writes | the suite's plan-writes-nothing case passes | Unmet | - |
| AC-002 | REQ-002 | Given an apply without the matching digest, When it runs, Then it exits 2 and writes nothing | the suite's digest-mismatch case passes | Unmet | - |
| AC-003 | REQ-003 | Given temporary copies of the `foreign` and `forked` fixtures, When plan then apply runs, Then the ledger reads `dropped: []` and the fourth part of the invariant holds | `node .skilled/commands/doctor/scripts/agents-md-embed.cjs plan` then `apply --plan-digest <d>` on a copy prints `preservation: kept <n>, carried <m>, shipped-replaced <k>, dropped 0` | Unmet | - |
| AC-004 | REQ-004 | Given a composition that omits a carried line, When the post-write proof runs, Then it restores from the backup and ends `STATUS=FAIL` with the dropped lines printed | the suite's planted-drop case passes | Unmet | - |
| AC-005 | REQ-005 | Given a completed run, When `restore --run=<dir>` runs, Then every recorded file is byte-identical to its backup | `restore --run=<dir>` followed by a comparison against the pristine fixture copy exits 0 | Unmet | - |
| AC-006 | REQ-006 | Given a completed apply, When `embed` runs again, Then it prints `NOTHING TO DO` | the second-run case prints `NOTHING TO DO` and exits 0 | Unmet | - |
| AC-007 | REQ-007 | Given any plan, When the written paths are collected, Then every one is inside the allowlist and a path outside it is refused | the suite's allowlist case passes and names the refused path | Unmet | - |
| AC-008 | REQ-008 | Given a backup path the ignore check does not match, When the plan runs, Then it shows the OS temp path instead | the suite's fallback case passes | Unmet | - |
| AC-009 | REQ-009 | Given the `claude-only` fixture, When apply runs, Then `AGENTS.md` is created and `CLAUDE.md` removed, and `--keep-claude-md` keeps it | the suite's two `claude-only` cases pass | Unmet | - |
| AC-010 | REQ-010 | Given a router missing shipped rows, When apply runs, Then only the missing rows are added and the checker passes | `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs --root <tmp>` prints `RESULT: PASSED (11/11 checks)` | Unmet | - |
| AC-011 | REQ-011 | Given an empty block, When apply runs, Then no `.cursor/rules/repo-local.md` is written, and a non-empty block writes one | the suite's mirror case passes on both sides | Unmet | - |
| AC-012 | REQ-012 | Given a completed run, When the backup directory is inspected, Then it still exists and no commit was staged | the suite's backup-retention case passes and `git status --porcelain` shows no staged change | Unmet | - |

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

AC-001 through AC-012 are unmet: the child is specified and not started.
<!-- /ANCHOR:closure -->
