---
title: "Acceptance Criteria: Phase 2: conversation-runner"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "conversation runner acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/002-conversation-runner"
    last_updated_at: "2026-11-02T13:10:00Z"
    last_updated_by: "beb6e7b1-5f31-42db-8cd9-f58f27216e79"
    recent_action: "Marked every criterion Met with evidence"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: conversation-runner

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/002-conversation-runner
**Level:** 3
**Status:** Complete
**Date:** 2026-11-01
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one. `S` is `.skilled/skills/sk-doc/sk-create-manual-testing-playbook`, `R` is `$S/scripts/run-conversation-scenario.cjs` and `M` is `$S/manual-testing-playbook/conversation-runner/drive-a-scripted-conversation.md`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given each of the five refusal cases (no `--scratch`, a scratch inside the repository, an unmarked non-empty scratch, a failing `setup`, a `specs` link into the repository), When `node $R` runs, Then it exits 2 with a message naming the cause and no tmux server exists afterwards. Given a `setup` command that exits 77, Then the runtime's result is SKIP with that command's first output line as its blocker and the run exits 0 | T004 and the refusal cases in T010. Evidence: `scratch/suite-run9.log` group `refusals` PASS; the suite group `setup exit 77 skips runtime` PASS (2026-11-02) | Met | - |
| AC-002 | REQ-002, REQ-003, REQ-004 | Given the fake subject and a script with a single-select, a multi-select, Other, a chat reply, restart and compact, When the runner plays it, Then the run ends PASS and `answers.txt` holds each scripted answer | T006 suite output. Evidence: `scratch/suite-run9.log` group `fake subject conversation` PASS | Met | - |
| AC-003 | REQ-004, REQ-005 | Given the fake subject asking a question no entry matches, and separately a subject that never settles, When the runner plays each, Then the first ends FAIL `UNEXPECTED_QUESTION` and the second FAIL `TIMEOUT`, each with its screen saved | T010 suite output. Evidence: `scratch/suite-run9.log` groups `unexpected question` and `turn timeout` PASS | Met | - |
| AC-004 | REQ-007 | Given a run that ends PASS, one that ends FAIL, one that times out and one sent SIGINT mid-turn, When each finishes, Then `tmux -L <socket> list-sessions` exits non-zero and `pgrep -g <pane pgid>` prints nothing | T007 and T010 output. Evidence: `scratch/suite-run9.log` groups `cleanup leaves nothing` and `SIGINT cleans up` PASS | Met | - |
| AC-005 | REQ-008 | Given a fake run that writes a file into the test repository's `specs/`, and separately one that appends a line to an existing ignored file in its watched `.skilled/skills/.state/decision-capture/`, When each run ends, Then its verdict is FAIL `REPO_CHANGED` with `repo-before.txt` and `repo-after.txt` saved | T007 output. Evidence: `scratch/suite-run9.log` group `repo changed` PASS | Met | - |
| AC-006 | REQ-009, REQ-010 | Given a fake-subject run, When `find <out> -type f` runs, Then it lists `result.json`, `actions.jsonl`, `raw-pane.log`, `setup.log`, both snapshots, `checkpoints.tsv`, `matrix.md` and per turn `screen.txt` and `check.txt`, and every verdict in `result.json` is PASS, FAIL or SKIP | T008 output. Evidence: `scratch/suite-run9.log` group `evidence files` PASS | Met | - |
| AC-007 | REQ-011 | Given the five recorded screens in `$S/scripts/tests/fixtures/question-screens/`, When the suite runs, Then it prints `adapter screens: PASS (5 runtimes)` | T009 suite output. Evidence: `scratch/suite-run9.log` prints `adapter screens: PASS (5 runtimes)` | Met | - |
| AC-008 | REQ-012 | Given MTP-007, When `node $R --scenario $M --runtime claude-code --scratch /tmp/conv-mtp007 --out scratch/runs` runs, Then it exits 0, the `matrix.md` row reads PASS and `node $S/scripts/validate-playbook-package.cjs --package $S/manual-testing-playbook` exits 0 | T012 and T015 output. Evidence: `scratch/runs/mtp007-attempt7/matrix.md` row `claude-code, PASS, 6/6`, runner exit 0; `validate-playbook-package.cjs` PASS, exit 0. On the final runner and scenario: `scratch/runs/claude-code-final/matrix.md` row `claude-code`, PASS, 6/6, runner exit 0 (`scratch/runs/claude-code-final.log`) | Met | - |
| AC-009 | REQ-012 | Given MTP-007 runs on `opencode`, `codex`, `pi` and `devin`, When `matrix.md` is read, Then it holds five rows, each PASS, FAIL with a reason or SKIP with a named blocker, and each names an evidence folder that exists | T016 output. Evidence: `scratch/runs/matrix3/matrix.md` holds five rows, claude-code, opencode, codex, pi and devin, each `PASS, 6/6`, and each names its evidence folder, which exists; runner exit 0 (`scratch/runs/matrix3.log`). The run used the worktree of decision record Q011 (`scratch/runs/matrix3/run-notes.md`). Second pass after the review and alignment fixes: `scratch/runs/matrix5/` and `scratch/runs/matrix6/` each hold five rows with existing evidence folders; every runtime reads PASS 6/6 in one of them, and the two FAIL rows name their cause in `run-notes.md` (Pi: a case-sensitive scenario check, since fixed; Codex: its weekly usage limit). After the operator reset Codex's quota, `scratch/runs/codex-final/` passed Codex alone on the final runner and scenario, PASS 6/6, exit 0 | Met | - |
| AC-010 | REQ-013 | Given the updated reference, When `rg -n "answer.reply\|optional\|CONVERSATION_TURN_DIR\|kill switch\|matrix.md" $S/references/conversation-scenarios.md` runs, Then it prints a line for each term, and `validate_document.py --type reference` exits 0 | T013 output. Evidence (2026-11-02): the `rg` command printed a line for each term (reference lines 44, 58, 60, 154, 167); `validate_document.py --type reference` printed `VALID`, 0 issues, exit 0 | Met | - |
| AC-012 | REQ-006 | Given the fake subject and a script with a check exiting 77, a failing turn with `retry: 1` that passes on its second attempt, and a `check` that sleeps past `CHECK_TIMEOUT`, When the runner plays each, Then `checkpoints.tsv` records SKIP with the blocker line, PASS with attempts 2, and FAIL `CHECK_TIMEOUT` with later turns `NOT_RUN` and no surviving child | T006, T007 and T010 output. Evidence: `scratch/suite-run9.log` groups `check skip continues`, `retry on second attempt`, `check timeout stops the run` PASS | Met | - |
| AC-013 | REQ-014 | Given the task log, When the first live probe (T001) starts, Then the fake-subject suite has already passed, shown by its recorded output time | File times. Evidence: `scratch/suite-run2.log` ends `PASS conversation runner suite`, written 2026-11-02 00:08:33 +0100; the first live probe ran 05:44 to 05:47 local (`scratch/probes.md`), and the first probe screen `fixtures/question-screens/claude-code.txt` was written 05:46:46 | Met | - |
| AC-014 | REQ-013, REQ-015 | Given MTP-007's `setup`, When it runs, Then each runtime's project config is copied into the scratch project and `default_mode_request_user_input = true` is in the scratch `.codex/config.toml` | T015 and T016 evidence. Evidence: `scratch/runs/matrix2/<runtime>/setup.log` shows all 6 setup commands `exit 0` for each of the five runtimes; each scratch project then held `.claude`, `.codex`, `.devin`, `.opencode`, `.pi` and `opencode.json`, and the codex scratch `.codex/config.toml` held `default_mode_request_user_input = true` under `[features]` | Met | - |
| AC-011 | REQ-001 to REQ-015 | Given the packet, When `validate.sh specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios --strict --recursive` runs, Then it prints `RESULT: PASSED` for the parent and both phases | T018 output. Evidence (2026-11-02): `validate.sh specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios --strict --recursive` prints `RESULT: PASSED` for the parent, `001-scenario-contract` and `002-conversation-runner` | Met | - |

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

Every row is Met. AC-011 is met by the close-out validation. AC-009 is met by `scratch/runs/matrix3/`, and the second pass, `scratch/runs/matrix5/` and `scratch/runs/matrix6/`, repeats it after the review and alignment fixes. The earlier `scratch/runs/matrix2/` run passed 6/6 turns on all five runtimes but failed three rows `REPO_CHANGED` from other sessions' writes (`scratch/runs/matrix2/repo-changed-cause.md`).
<!-- /ANCHOR:closure -->
