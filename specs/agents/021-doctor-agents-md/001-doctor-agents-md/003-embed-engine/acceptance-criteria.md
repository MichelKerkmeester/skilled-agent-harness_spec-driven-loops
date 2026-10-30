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
**Status:** Complete
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a plan run, When the write-spy is read, Then it recorded zero writes | the suite's `a plan run records zero writes` case passes, with the tree digest unchanged and no backup directory created — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:304 | Met | - |
| AC-002 | REQ-002 | Given an apply without the matching digest, When it runs, Then it exits 2 and writes nothing | the suite's `apply without a plan digest exits 2 and writes nothing` and `apply refuses a digest that the tree no longer produces` cases pass, each leaving the tree digest unchanged — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:336 | Met | - |
| AC-003 | REQ-003 | Given temporary copies of the `foreign` and `forked` fixtures, When plan then apply runs, Then the ledger reads `dropped: []` and the fourth part of the invariant holds | `plan` then `apply --plan-digest` printed `preservation: kept 5, carried 0, shipped-replaced 44, dropped 0` (foreign) and `kept 3, carried 0, shipped-replaced 44, dropped 0` (forked), and `preservationCheck` on the disk bytes returned no `dropped` and no `foreign` — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:406 and scratch/evidence.txt:1 | Met | - |
| AC-004 | REQ-004 | Given a composition that omits a carried line, When the post-write proof runs, Then it restores from the backup and ends `STATUS=FAIL` with the dropped lines printed | the suite's `a planted drop restores the backup and ends STATUS=FAIL` case passes, printing the dropped line and `restored: 1 file(s)`, with the file byte-identical to its pre-run bytes — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:566 | Met | - |
| AC-005 | REQ-005 | Given a completed run, When `restore --run=<dir>` runs, Then every recorded file is byte-identical to its backup | `restore --run=<dir> --yes` exited 0 on both fixtures and `cmp` against the pristine copy exited 0; the suite also covers a recreated `CLAUDE.md` and a deleted `AGENTS.md` — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:594 | Met | - |
| AC-006 | REQ-006 | Given a completed apply, When `embed` runs again, Then it prints `NOTHING TO DO` | the suite's `a second run prints NOTHING TO DO` case passes for `plan` and for `apply`, and `node .skilled/commands/doctor/scripts/agents-md-embed.cjs plan` on this repository prints `NOTHING TO DO`, exit 0 — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:642 | Met | - |
| AC-007 | REQ-007 | Given any plan, When the written paths are collected, Then every one is inside the allowlist and a path outside it is refused | the suite's `every written path is inside the allowlist and a path outside it is refused` case passes, naming `.skilled/repo-rules/scope-discipline.md` and `.cursorrules` as refused, and `../outside-the-root.md` as outside the root — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:672 | Met | - |
| AC-008 | REQ-008 | Given a backup path the ignore check does not match, When the plan runs, Then it shows the OS temp path instead | the suite's `an ignored output path holds the backup and a non-ignored one falls back` case passes: a composed tree prints `$TMPDIR/doctor-agents-md/<stamp>` with a `backup-fallback:` reason, and this repository resolves to `.skilled/output/doctor-agents-md/<stamp>` — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:728 | Met | - |
| AC-009 | REQ-009 | Given the `claude-only` fixture, When apply runs, Then `AGENTS.md` is created and `CLAUDE.md` removed, and `--keep-claude-md` keeps it | the suite's `claude-only creates the root document and removes the copy` and `--keep-claude-md keeps the copy it folded` cases pass — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:769 | Met | - |
| AC-010 | REQ-010 | Given a router missing shipped rows, When apply runs, Then only the missing rows are added and the checker passes | the suite writes a router holding 3 of 13 shipped rows; after apply every original line is intact, the tables hold 13 and 13 rows, and `check-repo-rules.cjs --root <tmp>` printed `RESULT: PASSED (11/11 checks)`, exit 0 — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:805 | Met | - |
| AC-011 | REQ-011 | Given an empty block, When apply runs, Then no `.cursor/rules/repo-local.md` is written, and a non-empty block writes one | the suite's `.cursor/rules/repo-local.md exists exactly when the block carries content` case passes on both sides — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:850 | Met | - |
| AC-012 | REQ-012 | Given a completed run, When the backup directory is inspected, Then it still exists and no commit was staged | the suite's `the backup survives the run and records what it holds` case passes: `manifest.json` carries the plan digest and each pre-run sha256, the directory is still there after the run, and the suite asserts the engine contains no `git add`, `git commit` or `git stash` — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:747 | Met | - |
| AC-013 | REQ-013 | Given a block between shipped sections, a line below the end marker and text above the first heading, When plan then apply runs, Then each is carried into the one block at the end and the proof counts it | the suite's `a block placed between shipped sections is carried into the block at the end`, `a line after the end marker is carried into the block` and `text before the first heading is carried into the block` cases pass: each composes the recipe, reshapes its document, applies, finds the text once and only inside the block, and `preservationCheck` on the disk bytes returns no `dropped` and no `foreign`. The third also proves the check itself names the prelude when a composition drops it — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:471 | Met | - |

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

AC-001 through AC-013 are Met, each one naming the case or command that proved it. The
engine writes only inside its allowlist, refuses a plan it cannot replay, and restores its
backup when the post-write proof finds a lost line. The suite passes 26 of 26 cases, the
doctor suite ends `0 failed`, and `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:closure -->
