---
title: "Acceptance Criteria: Phase 11: permission-mode-carry"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "permission mode carry acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/011-permission-mode-carry"
    last_updated_at: "2026-11-13T08:49:33Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-permission-mode-carry"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 11: permission-mode-carry

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 011-permission-mode-carry
**Level:** 2
**Status:** Complete
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`P` is this phase folder and `T` is `.skilled/hooks/session-relaunch/tests`. Every `node --test` run is prefixed with `env -u AI_SESSION_CHILD`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given Claude 2.1.323, When the default-mode and bypass checks of T001 and T002 run, Then `scratch/live-checks.md` holds four result lines, each with a command, an exit status and a captured `permission_mode` | `rg -c -e '^default-mode payload: ' -e '^default flag exit: ' -e '^bypass alone: ' -e '^dangerously plus acceptEdits: ' $P/scratch/live-checks.md` prints 4 Observed 2026-11-13: the orchestrator ran the four `claude -p` checks on Claude Code 2.1.323 and the count printed 4. | Met | - |
| AC-002 | REQ-002 | Given a Stop payload with `permission_mode: "acceptEdits"` and one with none, When the Claude Stop arm runs, Then the first record holds `permissionMode: "acceptEdits"` and the second holds no such key | `node --test --test-name-pattern 'permission mode' $T/claude-adapters.test.cjs` exits 0 with `fail 0`, and `$P/scratch/red.txt` shows the stamp test failing before T006 Observed 2026-11-13: `permission mode` adapters run 2 pass, fail 0, exit 0; scratch/red.txt holds the pre-fix fail 1. | Met | - |
| AC-003 | REQ-003 | Given an armed record, When `arm` runs with `settings.permissionMode` and then again with none, Then the record keeps the mode both times | `node --test --test-name-pattern 'live permission mode' $T/relaunch-core.test.cjs` exits 0 with `fail 0` Observed 2026-11-13: `live permission mode` core run 1 pass, fail 0, exit 0. | Met | - |
| AC-004 | REQ-004 | Given a record with `permissionMode: "acceptEdits"`, When `consume` runs, Then its JSON holds `permissionMode: "acceptEdits"`, and a record without it prints the old JSON | `node --test --test-name-pattern 'permission mode the record holds' --test-name-pattern 'model and effort the record holds' $T/session-relaunch-cli.test.cjs` exits 0 with `fail 0` Observed 2026-11-13: the new consume test and the existing model/effort test each 1 pass, fail 0, exit 0. | Met | - |
| AC-005 | REQ-005 | Given a launch with `--permission-mode manual` and a record holding `acceptEdits`, When the wrapper hops, Then the hop arguments hold `--permission-mode acceptEdits` once, before the seed, and the child env has `SKILLED_LOOP_PERMISSION_MODE=acceptEdits` | `node --test --test-name-pattern 'live permission mode replaces' $T/skilled-loop-wrapper-model-effort.test.cjs` exits 0 with `fail 0` Observed 2026-11-13: replay test passes; the hop holds `--permission-mode acceptEdits` once before the seed and the child env is acceptEdits. | Met | - |
| AC-006 | REQ-006 | Given a record holding `bogusMode`, When the wrapper hops, Then it replays the launch mode and prints `warning: ignoring the sender permission mode bogusMode, relaunching on the launch mode` | `node --test --test-name-pattern 'CLI would reject falls back' $T/skilled-loop-wrapper-model-effort.test.cjs` exits 0 with `fail 0` Observed 2026-11-13: bogusMode test passes with the launch mode and the warning text. | Met | - |
| AC-007 | REQ-007 | Given a record holding `plan` and the operator's answer from T003, When the wrapper hops, Then the hop follows that answer, which under option B is the launch mode plus one stderr note line | `rg -n 'Plan-mode answer' $P/goal.md` prints one row whose state is `Done`, and `node --test --test-name-pattern 'plan mode' $T/skilled-loop-wrapper-model-effort.test.cjs` exits 0 with `fail 0` Observed 2026-11-13: goal row Plan-mode answer is Done naming option B; the plan test passes with the note and the launch mode. | Met | - |
| AC-008 | REQ-008 | Given a record holding `bypassPermissions` and a launch line with no unlocking flag, When the wrapper hops, Then the hop follows the rule T002 recorded, and the wrapper never adds an unlocking flag of its own | `node --test --test-name-pattern 'bypass mode' $T/skilled-loop-wrapper-model-effort.test.cjs` exits 0 with `fail 0`, and `rg -n 'launch_arguments\+=\(--(allow-)?dangerously' .skilled/bin/skilled-loop` prints nothing Observed 2026-11-13: bypass test passes with the launch mode and the warning; the escalation rg printed nothing. | Met | - |
| AC-009 | REQ-009 | Given a consumed record holding `acceptEdits`, When the wrapper prints the manual claim command, Then the command carries `--permission-mode acceptEdits` | `node --test --test-name-pattern 'manual command carries the live permission mode' $T/skilled-loop-wrapper-model-effort.test.cjs` exits 0 with `fail 0` Observed 2026-11-13: manual-command test passes and the printed command carries `--permission-mode acceptEdits`. | Met | - |
| AC-010 | REQ-010 | Given the finished change, When the five test files run in full, Then all pass, the existing Claude replay test keeps its name, and Codex holds no `permissionMode` | `node --test $T/claude-adapters.test.cjs $T/relaunch-core.test.cjs $T/session-relaunch-cli.test.cjs $T/skilled-loop-wrapper-model-effort.test.cjs $T/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `fail 0`, and `rg -n "permissionMode" .skilled/hooks/session-relaunch/codex` prints nothing Observed 2026-11-13: five test files 493 tests, 493 pass, fail 0, exit 0; `rg permissionMode` under codex printed nothing, exit 1. | Met | - |
| AC-011 | REQ-010 | Given the finished phase folder, When strict validation runs, Then it passes | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict` prints `RESULT: PASSED` Observed 2026-11-13: validate.sh printed `RESULT: PASSED`, exit 0. | Met | - |

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

Every row is Met. The two live checks that held AC-001 open ran on Claude Code 2.1.323 after the build, and the row records them.
<!-- /ANCHOR:closure -->
