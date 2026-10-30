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
| AC-001 | REQ-001 | Given a plan run, When the write-spy is read, Then it recorded zero writes | the suite's `a plan run records zero writes` case passes, with the tree digest unchanged and no backup directory created — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:325 | Met | - |
| AC-002 | REQ-002 | Given an apply without the matching digest, When it runs, Then it exits 2 and writes nothing | the suite's `apply without a plan digest exits 2 and writes nothing` and `apply refuses a digest that the tree no longer produces` cases pass, each leaving the tree digest unchanged — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:357 | Met | - |
| AC-003 | REQ-003 | Given temporary copies of the `foreign` and `forked` fixtures, When plan then apply runs, Then the ledger reads `dropped: []` and the fourth part of the invariant holds | `plan` then `apply --plan-digest` printed `preservation: kept 5, carried 0, shipped-replaced 44, dropped 0` (foreign) and `kept 3, carried 0, shipped-replaced 44, dropped 0` (forked), and `preservationCheck` on the disk bytes returned no `dropped` and no `foreign` — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:427 and scratch/evidence.txt:1 | Met | - |
| AC-004 | REQ-004 | Given a composition that omits a carried line, When the post-write proof runs, Then it restores from the backup and ends `STATUS=FAIL` with the dropped lines printed | the suite's `a planted drop restores the backup and ends STATUS=FAIL` case passes, printing the dropped line and `restored: 1 file(s)`, with the file byte-identical to its pre-run bytes — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:587 | Met | - |
| AC-005 | REQ-005 | Given a completed run, When `restore --run=<dir>` runs, Then every recorded file is byte-identical to its backup | `restore --run=<dir> --yes` exited 0 on both fixtures and `cmp` against the pristine copy exited 0; the suite also covers a recreated `CLAUDE.md` and a deleted `AGENTS.md` — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:615 | Met | - |
| AC-006 | REQ-006 | Given a completed apply, When `embed` runs again, Then it prints `NOTHING TO DO` | the suite's `a second run prints NOTHING TO DO` case passes for `plan` and for `apply`, and `node .skilled/commands/doctor/scripts/agents-md-embed.cjs plan` on this repository prints `NOTHING TO DO`, exit 0 — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:663 | Met | - |
| AC-007 | REQ-007 | Given any plan, When the written paths are collected, Then every one is inside the allowlist and a path outside it is refused | the suite's `every written path is inside the allowlist and a path outside it is refused` case passes, naming `.skilled/repo-rules/scope-discipline.md` and `.cursorrules` as refused, and `../outside-the-root.md` as outside the root — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:693 | Met | - |
| AC-008 | REQ-008 | Given a backup path the ignore check does not match, When the plan runs, Then it shows the OS temp path instead | the suite's `an ignored output path holds the backup and a non-ignored one falls back` case passes: a composed tree resolves its base to `$TMPDIR/doctor-agents-md` with a `backup-fallback:` reason, and this repository resolves to `.skilled/output/doctor-agents-md`; the directory under either base is the plan digest's first 16 hex characters — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:749 | Met | - |
| AC-009 | REQ-009 | Given the `claude-only` fixture, When apply runs, Then `AGENTS.md` is created and `CLAUDE.md` removed, and `--keep-claude-md` keeps it | the suite's `claude-only creates the root document and removes the copy` and `--keep-claude-md keeps the copy it folded` cases pass — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:790 | Met | - |
| AC-010 | REQ-010 | Given a router missing shipped rows, When apply runs, Then only the missing rows are added and the checker passes | the suite writes a router holding 3 of 13 shipped rows; after apply every original line is intact, the tables hold 13 and 13 rows, and `check-repo-rules.cjs --root <tmp>` printed `RESULT: PASSED (11/11 checks)`, exit 0 — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:826 | Met | - |
| AC-011 | REQ-011 | Given an empty block, When apply runs, Then no `.cursor/rules/repo-local.md` is written, and a non-empty block writes one | the suite's `.cursor/rules/repo-local.md exists exactly when the block carries content` case passes on both sides — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:871 | Met | - |
| AC-012 | REQ-012 | Given a completed run, When the backup directory is inspected, Then it still exists and no commit was staged | the suite's `the backup survives the run and records what it holds` case passes: `manifest.json` carries the plan digest and each pre-run sha256, the directory is still there after the run, and the suite asserts the engine contains no `git add`, `git commit` or `git stash` — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:768 | Met | - |
| AC-013 | REQ-013 | Given a block between shipped sections, a line below the end marker and text above the first heading, When plan then apply runs, Then each is carried into the one block at the end and the proof counts it | the suite's `a block placed between shipped sections is carried into the block at the end`, `a line after the end marker is carried into the block` and `text before the first heading is carried into the block` cases pass: each composes the recipe, reshapes its document, applies, finds the text once and only inside the block, and `preservationCheck` on the disk bytes returns no `dropped` and no `foreign`. The third also proves the check itself names the prelude when a composition drops it — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:492 | Met | - |
| AC-014 | REQ-014 | Given a document whose prose quotes both marker literals, When plan then apply runs, Then the sentence survives inside the block; and given a lone marker line or two blocks, the run exits 2 and names the fault | the suite's `a sentence quoting both markers is repository content, not the block`, `a marker literal after text is content, and a lone marker line is refused` and `a document carrying two blocks is refused by name, not as dropped lines` cases pass: the sentence is found once and inside the block, the half-written document exits 2 with `one of its two markers`, and the duplicated one exits 2 naming all four marker lines with no `dropped:` line — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:901 | Met | - |
| AC-015 | REQ-015 | Given a document whose sentence carries both marker literals and a composition that loses it, When `preservationCheck` runs, Then it names that line | the suite's `the preservation proof requires the raw lines of the old document` case passes, returning exactly the quoted sentence with part 1; the same case failed before the proof read raw lines, returning the two marker-bounded fragments instead — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:926 | Met | - |
| AC-016 | REQ-016 | Given a pending tree and its plan digest, When `apply --dry-run` runs, Then it prints the plan and writes nothing | the suite's `apply --dry-run prints the plan and writes nothing` case passes: exit 0, the tree digest unchanged, the same plan digest and undo line printed, `dry-run: nothing was written`, no `STATUS=OK`, and the backup directory it names does not exist — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:1018 | Met | - |
| AC-017 | REQ-017 | Given a plan and its apply, When the two are compared, Then they name the same backup directory, and a re-plan of the same work picks a different one | the suite's `the plan names the backup apply uses, and a taken directory is re-planned` case passes: the applied `backup:` and `undo:` lines equal the plan's, the directory exists after the run, and after a restore the next plan prints a different, unsuffixed, nonexistent directory and a different digest — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:1042 | Met | - |
| AC-018 | REQ-018 | Given a nested bullet indented four spaces inside an edited section and in a folded copy, When apply runs, Then the block carries the line with its spaces | the suite's `a carried line keeps its leading whitespace` case passes for both trees, finding the line with its four spaces in the composed document and `dropped 0` in the ledger — see .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:993 | Met | - |

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

AC-001 through AC-018 are Met, each one naming the case or command that proved it. The
engine writes only inside its allowlist, refuses a plan it cannot replay, refuses a document
whose block is half written or duplicated, and restores its backup when the post-write proof
finds a lost line. The suite passes 33 of 33 cases, the doctor suite ends `0 failed`, and
`validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:closure -->
