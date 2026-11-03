---
title: "Tasks: Phase 2: conversation-runner"
description: "Ordered tasks for the runner: live probes first, then the guard, the tmux driver, the turn loop, cleanup and the adapters, then MTP-007 on all five runtimes."
trigger_phrases:
  - "conversation runner tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/065-conversation-playbook-scenarios/002-conversation-runner"
    last_updated_at: "2026-11-01T21:11:38Z"
    last_updated_by: "planning-session"
    recent_action: "Planned 18 tasks across probes, build and live runs"
    next_safe_action: "Start after 001 hands off, at T001 live probes"
    blockers:
      - "Needs parseConversationScript from 001-scenario-contract"
    key_files:
      - ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: conversation-runner

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`S` is `.skilled/skills/sk-doc/sk-create-manual-testing-playbook`. `R` is `$S/scripts/run-conversation-scenario.cjs`. `T` is `$S/scripts/tests/run-conversation-scenario.test.cjs`. `M` is `$S/manual-testing-playbook/conversation-runner/drive-a-scripted-conversation.md`. Tasks marked "orchestrator" run outside any sandbox, because tmux needs a local socket.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Order, per research section 7.1: T003, then T004 to T008 and the fake-subject cases of T010, then M2, then the live probes T001 and T002, then T009 onward. Task ids keep their numbers.

- [x] T003 [P] Write a line-mode fake subject that prints a ready marker, asks a numbered single or multi question on request, accepts a free-text row and a chat reply, and appends each answer to `answers.txt` (`$S/scripts/tests/fixtures/fake-subject.cjs`). Verify: started by hand in tmux, typing `ask single` shows a numbered question and choosing option 2 appends its label to `answers.txt`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Parse arguments and add the scratch guard with its five refusals (`$R`). Verify: no `--scratch`, a scratch inside the repository, an unmarked non-empty scratch, a failing `setup` and a `specs` link into the repository each exit 2 with a message naming the cause, and no tmux server starts.
- [x] T005 Add the tmux driver: private socket, runner-written config, `pipe-pane`, `capture-pane`, `send-keys -l` and pane state (`$R`). Verify: `tmux list-sessions` on the default socket prints the same lines before and after a fake-subject run.
- [x] T006 Add the turn loop: pause, send, question detection and answering, chat reply, settle, timeout, restart and compact, then the per-turn check (`$R`). Verify: a fake-subject run covering a single-select, a multi-select, Other, a chat reply, restart and compact ends PASS.
- [x] T007 Add cleanup on every exit path and the before-and-after repository snapshot (`$R`). Verify: after the FAIL, timeout and SIGINT cases, `tmux -L <socket> list-sessions` exits non-zero and `pgrep -g <pgid>` prints nothing, a fake run that appends one line to an existing ignored file in the test repository's watched `.state` folder ends FAIL with `REPO_CHANGED`, and a `check` that sleeps past `CHECK_TIMEOUT` fails as `CHECK_TIMEOUT` with no survivor.
- [x] T008 Write the evidence files and `matrix.md` (`$R`). Verify: after a fake-subject run, `find <out> -type f | sort` lists every file named in REQ-009.

Milestone M2: `node $T` passes on the fake subject alone. The live probes start only after it (REQ-014, research section 7.1).

- [x] T001 (done 2026-11-02; the folder holds 29 screens, one `<runtime>.txt` per runtime plus extra states, so the `wc -l` check reads 29, not 5) Orchestrator: probe each runtime once in a throwaway folder under `/tmp`, started with the command in `plan.md` inside a private tmux server. Send "Use your question tool to ask me one question with three options, allowing several answers, then stop." Capture the screen when ready, when busy and at the question. Also record six captures 500 ms apart at rest (the settle window), send one slash command to see whether autocompletion swallows Enter, and record the exit keys, the compact command, how restart finds the session and, for Codex, whether `default_mode_request_user_input` set in the probe folder's own `.codex/config.toml` shows the tool, and which model each runtime uses without this repository's project config. Save each redacted question screen to `$S/scripts/tests/fixtures/question-screens/<runtime>.txt` and the facts to `scratch/probes.md`, then kill each probe server. Verify: `ls $S/scripts/tests/fixtures/question-screens | wc -l` prints 5, `scratch/probes.md` has one row per runtime and `tmux -L <probe socket> list-sessions` fails for each.
- [x] T002 (2026-11-02: the OpenCode, Codex, Pi and Devin rows now carry the probe facts; `rg -c "until the probe" plan.md` prints nothing, exit 1) Update the feasibility table in `plan.md` from the probes. Verify: `rg -c "until the probe" plan.md` prints 0.
- [x] T009 (suite prints `adapter screens: PASS (5 runtimes)`, `scratch/suite-run9.log`) Write the five adapters from the probe screens (`$R`). Verify: the suite prints `adapter screens: PASS (5 runtimes)`.
- [x] T010 (`scratch/suite-run9.log`, exit 0) Collect the refusal, fake-subject, cleanup and adapter cases in one suite (`$T`). Verify: `node $T` exits 0.
- [x] T011 [P] Name the new fixtures (`$S/scripts/tests/fixtures/README.md`). Verify: `rg -c "fake-subject.cjs|question-screens" $S/scripts/tests/fixtures/README.md` prints 2 or more.
- [x] T012 Write MTP-007 with a single-select, a multi-select, Other, a chat reply, restart and compact, and index it in the root playbook (`$M`). Verify: `node $S/scripts/validate-playbook-package.cjs --package $S/manual-testing-playbook` exits 0.
- [x] T013 Add the running, per-runtime and multi-runtime live-test sections to the reference, and the runner-command note to the snippet template (`$S/references/conversation-scenarios.md`). Verify: `rg -n "^## " $S/references/conversation-scenarios.md` lists the three new headings, and `validate_document.py --type reference` exits 0.
- [x] T014 List the runner in `README.md`, set `SKILL.md` to version 1.1.0.0 and write `changelog/v1.1.0.0.md` (`$S/SKILL.md`). Verify: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` ends with `OK: parent-skill-check`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 (`scratch/runs/mtp007-attempt7/`, `PASS 6/6`, exit 0) Orchestrator: run MTP-007 on Claude Code (`scratch/runs/claude-code/`). Verify: `node $R --scenario $M --runtime claude-code --scratch /tmp/conv-mtp007 --out scratch/runs` exits 0, the `matrix.md` row reads PASS and `tmux -L <socket> list-sessions` fails afterwards.
- [x] T016 (2026-11-02 `scratch/runs/matrix3/`: five rows, each `PASS | 6/6`, exit 0, no `REPO_CHANGED`, run against the worktree of decision record Q011. The earlier `scratch/runs/matrix2/` failed three rows `REPO_CHANGED` from other sessions' writes, see its `repo-changed-cause.md`) Orchestrator: run MTP-007 on `opencode`, `codex`, `pi` and `devin` (`scratch/runs/`). Verify: `matrix.md` has five rows, each PASS, FAIL with a reason or SKIP with a named blocker, and each names an evidence folder that exists.
- [x] T017 (fleet `packages 56 violations 1 warnings 93`, this package PASS 0/0; `parent-skill-check` OK; manifest OK) Orchestrator: rerun the fleet, the hub gate and the manifest check. Verify: fleet counts equal the phase 001 after-counts plus nothing new for `$S/manual-testing-playbook`, `parent-skill-check.cjs` ends with OK and `generate-leaf-manifest.cjs --check .skilled/skills/sk-doc` prints OK.
- [x] T018 (2026-11-02: `RESULT: PASSED` for the parent, `001-scenario-contract` and `002-conversation-runner`, exit 0) Validate this phase and the packet. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/065-conversation-playbook-scenarios --strict --recursive` prints `RESULT: PASSED` for all three folders.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: MTP-007 PASS on Claude Code with a five-row `matrix.md` (`scratch/runs/matrix3/`, `matrix5/`, `matrix6/`)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, including its Execution section and ADR-001 to ADR-003
- **Decision record**: See `../decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task gets `[B]`, a reason and the command output that blocked it in the parent `goal.md` log.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase 001 exports `parseConversationScript`, shown by the `node -e` check in `plan.md` (2026-11-02: `node -e` prints `function`; the runner imports it at line 23)
- [x] CHK-002 [P0] Five probe screens exist and every probe tmux server is gone (`$S/scripts/tests/fixtures/question-screens/` holds a `<runtime>.txt` for all five runtimes plus 22 extra states; no probe server is live)
- [x] CHK-003 [P1] The operator has answered the Codex flag question, or Codex is planned as chat-only (decision record Q005: enabled in the repository and on the machine)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check $R` exits 0 (2026-11-02, exit 0)
- [x] CHK-011 [P0] Every exit path calls the same cleanup, shown by the FAIL, timeout and SIGINT cases (suite groups `turn timeout`, `cleanup leaves nothing`, `SIGINT cleans up` and `setup SIGINT cleans up` PASS, exit 0)
- [x] CHK-012 [P1] The runner imports the parser and the runtime ids from the validator and copies neither (`$R` line 24 requires `./validate-playbook-package.cjs` for `parseConversationScript` and `CONVERSATION_RUNTIMES`)
- [x] CHK-013 [P1] No code comment carries a packet, phase or task id (`rg` for ADR, REQ, AC, CHK, MTP and task ids in `$R` prints nothing)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] `node $T` exits 0 when run by the orchestrator (2026-11-02, exit 0, 19 groups PASS)
- [x] CHK-021 [P0] MTP-007 reads PASS on Claude Code (`scratch/runs/matrix5/` and `scratch/runs/matrix6/` rows `claude-code | PASS | 6/6`)
- [x] CHK-022 [P1] All five runtimes have a `matrix.md` row with an evidence folder that exists (`scratch/runs/matrix3/`, `matrix5/` and `matrix6/` each hold five rows and five evidence folders)
- [x] CHK-023 [P1] Each adapter parses its recorded screen into the probe's question text and labels (suite prints `adapter screens: PASS (5 runtimes)`)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Every refusal in REQ-001 exits 2 before any tmux server starts (suite group `refusals` PASS, plus `multi-runtime guards before side effects`)
- [x] CHK-031 [P0] `git status --porcelain --ignored -- specs .skilled/skills/.state` in the repository matches before and after every live run (the main checkout printed the same lines before and after `matrix5` and `matrix6`; the runner's content hash of the worktree matched on every runtime, no `REPO_CHANGED`)
- [x] CHK-032 [P1] The runner opens no `.env` or token file, shown by `rg -n "\.env|token" $R` printing nothing (the `rg` prints `process.env` reads and a busy-line regex containing "tokens"; the runner's only file reads are the scenario, the pane log, the scratch `hooks.json`, Codex's `config.toml` and the hashed snapshot files)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The reference's live-test mapping lists every need named in REQ-013 (AC-010 evidence)
- [x] CHK-041 [P1] The feasibility table in `plan.md` matches `scratch/probes.md` (T002)
- [x] CHK-042 [P2] `README.md` lists the runner script (`README.md` AT A GLANCE "Produces" row and section 9)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Run evidence lives under this phase's `scratch/runs/`, and scratch projects live under `/tmp` (evidence under `scratch/runs/`; scratch projects were under the session folder in `/private/tmp`)
- [x] CHK-051 [P1] Probe folders and leftover scratch projects are deleted before completion (2026-11-02: the six scratch projects of this session's runs and three dead probe sockets removed by exact path)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-02
<!-- /ANCHOR:summary -->

---
