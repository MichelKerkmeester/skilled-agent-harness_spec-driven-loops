---
title: "Acceptance Criteria: Phase 22: stop-park-notices"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "stop park notices acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/022-stop-park-notices"
    last_updated_at: "2026-11-14T17:30:00Z"
    last_updated_by: "code-agent"
    recent_action: "Marked every criterion Met from the red, green, write-throw and suite runs"
    next_safe_action: "The orchestrator commits and reruns the two commit-scoped checks"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/stop-arm.mjs", ".skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs", ".skilled/hooks/session-relaunch/claude/README.md", ".skilled/hooks/session-relaunch/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-022-stop-park-notices"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does the arm-throw notice reach the operator from a spawned hook? The direct import proves the write seam, and the target-pid test proves the spawned stdout path."
    answered_questions:
      - "Does every parking branch need a notice? Yes, the review found the two silent ones and the other two already print."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 22: stop-park-notices

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 022-stop-park-notices
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a pending record and a Stop whose target pid cannot be resolved, When the hook runs, Then stdout holds one JSON line whose `systemMessage` names the missing session process, the withdrawal on the next prompt and the later Stop, and has no `decision` key | Met. `scratch/red.txt` prints `✖ stop-arm marks the pending record deferred when no process below the loop can be found` with tests 2, pass 0, fail 2, exit 1 before the source edit, and `scratch/green.txt` prints `✔` for it with tests 2, pass 2, fail 0, exit 0 after it. The branch now writes the guarded line at `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:199` to `:211`, and the test parses one line at `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:1369` to `:1376` | Met | - |
| AC-002 | REQ-002 | Given the same record and a Stop whose `arm` call throws, When the hook runs, Then the injected `write` receives one line that names the failed arm, the withdrawal and the later Stop, with no `decision` key | Met. `scratch/red.txt` prints `✖ stop-arm marks the pending record deferred when arming throws` with tests 2, pass 0, fail 2, exit 1 before the source edit, and `scratch/green.txt` prints `✔` for it with tests 2, pass 2, fail 0, exit 0 after it. The `write` seam collects the line at `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:1410`, the assertions sit at `:1418` to `:1425`, and the guarded write sits at `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:230` to `:241` | Met | - |
| AC-003 | REQ-003 | Given either Stop, When the record and the log are read, Then the record holds `deferredAt` with its other fields unchanged, and the log holds exactly one `stop-arm-error` line with that branch's stage | Met. Both changed tests keep the record assertions and the log assertion, and `scratch/green.txt` prints `ℹ fail 0`. The target-pid test compares the record minus `deferredAt` with the fixture at `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:1377` to `:1383` and matches `stop-arm-error stage=target-pid`, and the arm test compares the same shape at `:1426` to `:1432` and matches `stop-arm-error stage=arm` | Met | - |
| AC-004 | REQ-004 | Given either Stop and a notice write that throws, When the hook runs, Then the failure is logged as `stop-arm-error` with `stage: 'notice'`, the record stays stamped and the hook exits 0 | Met. `scratch/write-throw.txt` records `armed=null`, `deferredAt=true`, `unchanged=true`, `noticeLogLines=1`, `targetLogLines=1`, `noticeLine=... stop-arm-error stage=notice loopId=999999999 message=stdout_closed` and `exit=0`, from `scratch/write-throw.mjs` run with `env -u AI_SESSION_CHILD -u OPENCODE_DB`. Cited: `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:208`, `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:238` | Met | - |
| AC-005 | REQ-005 | Given the edited adapter, When the Claude adapter and conformance suites and the whole relaunch and OpenCode plugin suites run, Then they pass with the baseline count | Met. `scratch/claude-conformance.txt` prints `ℹ tests 115`, `ℹ pass 115`, `ℹ fail 0`, `exit=0`. `scratch/final-suite.txt` prints `ℹ tests 1555`, `ℹ pass 1555`, `ℹ fail 0`, `exit=0`, equal to `scratch/baseline.txt` at 1555. `scratch/existing-notices.txt` prints tests 2, pass 2, fail 0, exit 0 for the missing-transcript and background-task notices. Cited: `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:940`, `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:683` | Met | - |
| AC-006 | REQ-006 | Given the fix commit, When it is inspected, Then both READMEs name the notices, and the commit adds no file, record key or log event | Met from the working tree, which the orchestrator commits. `rg -c 'no target pid'` and `rg -c 'arm that throws'` each printed 1 for `.skilled/hooks/session-relaunch/README.md` and 1 for `.skilled/hooks/session-relaunch/claude/README.md`, exit 0. `git diff --stat` names four modified files under `.skilled/hooks/session-relaunch` and adds none, `git status --porcelain` shows no new tracked file outside this child, and `git diff -U0 -- .skilled/hooks/session-relaunch` piped to `rg -c "^\+.*logEvent\('"` printed 2, both reused `stop-arm-error` catches. The two `git show FIX` checks remain for the orchestrator after the commit exists. Cited: `.skilled/hooks/session-relaunch/claude/README.md:27`, `.skilled/hooks/session-relaunch/README.md:134` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Pending` | Planned and not yet built. The builder replaces it with `Met` or `Unmet` when the fix commit lands. |
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

Every row is `Met`, each with an observed run under `scratch/`. The build changed four files and added none. The orchestrator creates the fix commit and reruns the two `git show FIX` checks of T016 against it.
<!-- /ANCHOR:closure -->

---
