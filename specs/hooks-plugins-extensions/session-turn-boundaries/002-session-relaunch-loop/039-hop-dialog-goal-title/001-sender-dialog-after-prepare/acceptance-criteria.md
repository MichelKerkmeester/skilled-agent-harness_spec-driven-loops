---
title: "Acceptance Criteria: Phase 1: sender-dialog-after-prepare"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "sender dialog after prepare acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare"
    last_updated_at: "2026-11-13T18:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked every criterion Met from the saved runs, the test runs and the sync checks"
    next_safe_action: "Operator decides on merge and push of worktree 366"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/subagent-guard.mjs", ".skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-sender-dialog-after-prepare"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: sender-dialog-after-prepare

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 001-sender-dialog-after-prepare
**Level:** 2
**Status:** Complete
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the four failed runs saved by child 016 of packet 038, When their files are read, Then each shows `prepare exit=0`, a `tool_use AskUserQuestion` after prepare and a log that ends at `prepare ... status=pending` | In this phase folder, `rg -o 'ts=\S+ tool_use AskUserQuestion' scratch/failed-runs/*/extract-*.txt` prints four lines and `rg -c 'killer-signal\| relaunch ' scratch/failed-runs/*/relaunch-log.txt` prints nothing. Observed 2026-11-13: dialogs 5.1 s to 42.6 s after prepare, no `killer-signal` and no `relaunch` line, output quoted in `spec.md`. Cited: `scratch/failed-runs/failed-8-a1/relaunch-log.txt:2`, `scratch/failed-runs/failed-8-a1/extract-907c30e8-616b-431d-a6e3-670145b8bbdd.txt:7` | Met | - |
| AC-002 | REQ-002 | Given a pending record for this session under `SKILLED_LOOP_ID`, When the guard sees an `AskUserQuestion` PreToolUse, Then it prints a deny envelope that names the note path and the cancel command | `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 with `pass 20` and `fail 0`, and `scratch/red.txt` shows the denial test failing first with `pass 19` and `fail 1`. Observed on the rerun of 2026-11-13. Cited: `scratch/red.txt:15`, `scratch/red.txt:24`, `scratch/green.txt:23` | Met | - |
| AC-003 | REQ-003 | Given no record, another session's record, an armed record, no `SKILLED_LOOP_ID` or a disabled concern, When the guard sees an `AskUserQuestion` PreToolUse, Then it exits 0 with no output | The five `subagent-guard lets a question dialog through ...` tests pass in the AC-002 run, shown with a check mark in `scratch/green.txt`. Cited: `scratch/green.txt:16` to `scratch/green.txt:20` | Met | - |
| AC-004 | REQ-004 | Given the change, When the tree is inspected, Then no module is added and the core is unchanged | `git status --short .skilled \| rg '^\?\?'` prints nothing, `git diff --name-only -- .skilled/hooks/session-relaunch/lib` prints nothing and `rg -n 'armableRecord, isEntrypoint, readRelaunchFile' .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` prints the import line. Observed 2026-11-13. Cited: `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs:11` | Met | - |
| AC-005 | REQ-005 | Given a record read that throws, When the guard runs, Then the dialog is let through | File inspection of `pendingHandOver` in `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs`: `readRelaunchFile` sits in a `try` whose `catch` returns null, and null leads to `done()`. No test covers a throwing read. Cited: `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs:74`, `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs:76` | Met | - |
| AC-006 | REQ-006 | Given the registry, When the sync script checks the registration files, Then `.claude/settings.json` carries the `AskUserQuestion` binding for the guard | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` printed `PASS: 4 registration files match the 35-hook registry; 22 Pi extensions resolve.` and `rg -c 'session-relaunch/claude/subagent-guard' .claude/settings.json` printed 2 on 2026-11-13. Cited: `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:1184`, `.claude/settings.json:143` | Met | - |
| AC-007 | REQ-007 | Given the edited guard and tests, When the relaunch and OpenCode plugin suites run, Then they pass with six more tests than the baseline of 1524 | `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exited 0 with tests 1530, pass 1530, fail 0 on 2026-11-13. Cited: `scratch/suite.txt:1542`, `scratch/suite.txt:1545` | Met | - |
| AC-008 | REQ-008 | Given the three READMEs that list the guard's bindings, When they are searched, Then each names the new matcher | `rg -c 'AskUserQuestion' .skilled/hooks/session-relaunch/claude/README.md` printed 2, and `rg -n 'question dialog over a pending record' .skilled/hooks/session-relaunch/README.md` and `rg -n 'Bash and AskUserQuestion' .skilled/hooks/README.md` each printed one line. Cited: `.skilled/hooks/README.md:240`, `.skilled/hooks/session-relaunch/README.md:342` | Met | - |

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

Every row is Met. No row asks for a live run of a sender that runs `prepare` itself, and that gap is a Known Limitation in `implementation-summary.md`.
<!-- /ANCHOR:closure -->
