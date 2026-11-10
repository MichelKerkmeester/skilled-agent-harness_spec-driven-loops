---
title: "Implementation Plan: Phase 6: live-conversation-test"
description: "Write one playbook scenario that the 065 conversation runner types into a real interactive session with human pauses, stage by stage, and check the decision-capture queue, nudge, saves, restart and kill switch after each stage in a disposable scratch project. Claude Code runs first, then OpenCode, Codex, Pi and Devin, and each fills one matrix row."
trigger_phrases:
  - "live conversation test plan"
  - "decision capture conversation stages"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: live-conversation-test

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown scenario, bash checkpoint commands, `tmux` 3 at `/opt/homebrew/bin/tmux`, `jq` at `/usr/bin/jq`, Node for the save writer |
| **Framework** | The conversation scenario format and runner from `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios` (sk-create-manual-testing-playbook) |
| **Storage** | Scratch project files only: `<session>.jsonl`, `<session>.nudge` and `consumed.jsonl` under `.skilled/skills/.state/decision-capture/`, plus the demo packet's `decision-record.md` |
| **Testing** | Live interactive runs per runtime, `validate-playbook-package.cjs --package system-spec-kit`, `validate.sh --strict` |

### Overview
This phase adds one playbook scenario, `decision-capture-live-conversation.md`, and its index row. The 065 runner types the scenario's turns into a real Claude Code session in a tmux pane, answers the subject's questions as the human and runs each stage's checkpoint against the scratch project. Proof is a `checkpoints.tsv` per run plus a matrix row per runtime, each cell backed by a pane capture or a file copy.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] `ls specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/implementation-summary.md` exists and names the runner path and the scenario format.
- [ ] `claude auth status` exits 0, and the operator's consent for live sessions and their cost is recorded in `scratch/live-runs/preconditions.txt`.
- [ ] `command -v tmux jq claude` prints three paths.

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is Met, Waived or Superseded.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/043-decision-capture/006-live-conversation-test --strict` prints `RESULT: PASSED`, and `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-spec-kit` reports no new violation.
- [ ] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` name the same scenario file and the same stages.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Scripted conversation scenario. The scenario is data, the 065 runner executes it and this phase owns only the data and the results.

### Key Components
- **Scenario file** (`plugins-and-hooks/decision-capture-live-conversation.md`): the setup block, the stage table S0 to S12, the checkpoint commands, the matrix columns and the sibling extension rule.
- **065 runner** (external, `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios`): starts the subject in a tmux pane on its own socket, waits for turn end or a question widget, pauses like a person, types the human turn or picks the answer, then runs the checkpoint and saves the pane.
- **Scratch project**: built by the scenario's `setup` in the runner's marked scratch folder, which also copies each runtime's project config (`.claude/`, `.opencode/`, `.codex/`, `.pi/`, `.devin/`) and records which model each runtime uses there. It is a `git init` repository with its own `.claude/settings.json` and hook links, `AGENTS.md` and `CLAUDE.md` copied in so the subject asks Gate 3 the way it does in the real repository, a demo packet `specs/demo/001-demo-widget` made by `create.sh` inside it, an `.opencode/` folder and a real `.skilled/skills/.state/` directory. `.skilled/hooks`, `.skilled/bin` and `.skilled/skills/system-spec-kit` are symlinks into the repository, as the save-writer scenario does at `decision-capture-save-writer.md:51-61`. The subject starts with `cd "$P"`, so Claude sets `CLAUDE_PROJECT_DIR` to `$P`, and the launch drops `AI_SESSION_CHILD`, `SYSTEM_HOOKS_DISABLED`, `SYSTEM_DECISION_CAPTURE_DISABLED` and `SKILLED_LOOP_HOPS`, so the subject behaves as an interactive session with Gate 3 live.
- **Evidence store**: `scratch/live-runs/<runtime>-run<N>/` in this child, holding `pane-S<k>.txt`, `queue-S<k>.jsonl`, `consumed-S<k>.jsonl`, `nudge-S<k>.txt`, `decision-record-S6.md`, `decision-record-S10.md`, `decision-record-S11.md`, `baseline/repo-status.txt`, `after/repo-status.txt` and `checkpoints.tsv` (columns: stage, status, evidence path, observed value), derived from the runner's own per-turn `checkpoints.tsv` under `runner/main/` and `runner/kill-switch/`.

### Stage Table

Pauses: each turn carries `delay_ms: [5000, 15000]` and each answer `delay_ms: [3000, 8000]`, drawn by the runner from its recorded `--seed`. A stage whose subject may deviate carries `retry: 1`. Stage marks are the runner's PASS, FAIL or SKIP: a deviation is a FAIL whose check prints `DEVIATION:` and what happened, and a stage that does not apply exits 77 and prints its blocker. Every turn is typed into the interactive pane, never sent as a one-shot `-p` prompt. `Q` is `$P/.skilled/skills/.state/decision-capture`.

| Stage | Human turn or action | Answer the human gives | Checkpoint observable | Expected |
|-------|----------------------|------------------------|-----------------------|----------|
| S0 | Check-only turn: record baselines (the project itself is built by the scenario's `setup`) | none | `git -C "$R" status --short --ignored specs .skilled/skills/.state` and a content hash of `"$R"/.skilled/skills/.state/decision-capture/` saved, `ls "$Q"` | baselines saved, `$Q` empty or absent |
| S1 | "Add a status badge to the demo widget in this project. Once you know where it is documented, stop and wait: write nothing until I tell you, and ask me product questions only when I tell you to." | Gate 3: `A) Existing, specs/demo/001-demo-widget` | `cat "$Q"/*.jsonl 2>/dev/null \| wc -l`, `rg -c -i 'spec folder\|gate 3' "$Q"`, pane shows the question | 0 lines, 0 matches, question visible in `pane-S1.txt` |
| S2 | "Before you write anything, ask me with your question tool which colour the badge uses. One choice." | picks `Amber` | queue lines, distinct `key` count via `jq -r .key "$Q"/*.jsonl \| sort -u \| wc -l`, `answer` of the new line, nudge lines in this turn's pane, `cat "$Q"/*.nudge` | 1 line, 1 key, `Amber`, 1 nudge line, nudge file 1 |
| S3 | "Now ask me which platforms the badge must support. Let me pick several." | picks every option offered | same as S2 | 2 lines, 2 keys, answer joins all labels, 1 nudge line, nudge file 2 |
| S4 | "Ask me for the badge label with a few options. I will type my own." | picks Other and types `Needs review` | same as S2 | 3 lines, 3 keys, answer `Needs review`, 1 nudge line, nudge file 3 |
| S5 | "Do not use the tool this time. End your reply with one plain question to me about whether the badge should blink." | types `No, keep it static.` | queue lines, nudge lines, nudge file | 3 lines, 0 nudge lines, nudge file 3 |
| S6 | `/speckit:save specs/demo/001-demo-widget --full-auto` | none | operator rows and `### Q` items in `decision-record.md`, `consumed.jsonl` lines and distinct keys, each row's decided text against its verbatim answer, process count in the record, `SPECKIT_LEVEL` line before and after, queue lines, nudge file | 4 rows, 4 items, 4 lines and 4 keys, no decided text equals its answer, process count 0, level line unchanged, queue still 3, nudge file 0 |
| S7 | "Ask me with the tool whether the badge sits left or right of the title." | picks `Right` | queue lines, keys, nudge lines, nudge file | 4 lines, 4 keys, 1 nudge line, nudge file 1 |
| S8 | Two turns: `S8-compact` with `action: compact` and a check that saves the queue sha, then `S8-ask`: "Ask me with the tool which size the badge uses." | picks `Small` | queue sha before and after the compaction, then queue lines, keys, nudge | queue unchanged by the compaction, then 5 lines, 5 keys, 1 nudge line, nudge file 2 |
| S9 | `action: restart` (the runner exits and relaunches into the same session id), then "Ask me with the tool whether the badge has a tooltip." as turn `S9-ask` | picks `Yes` | queue files and lines, keys across all files, nudge lines, which session id the new answer carries | 6 lines across files, 6 keys, 1 nudge line, session id recorded |
| S10 | `/speckit:save specs/demo/001-demo-widget --full-auto` | none | operator rows, `### Q` items, consumed keys, process count, nudge file | 7 rows, 7 items, 7 keys, process count 0, nudge file 0 |
| S11 | `/speckit:save specs/demo/001-demo-widget --full-auto` again | none | `cmp decision-record-S10.md decision-record.md`, `wc -l consumed.jsonl`, nudge lines | `cmp` exits 0, 7 lines, 0 nudge lines |
| S12 | Second scenario file `decision-capture-kill-switch-conversation.md`, its own runner invocation and scratch project `$K`, with `"env": {"SYSTEM_DECISION_CAPTURE_DISABLED": "1"}`, then "Ask me with the tool which colour the badge uses." | picks `Amber` | `ls "$K"/.skilled/skills/.state/decision-capture/*.jsonl`, nudge lines, pane shows the answer | no file, 0 nudge lines, answer visible |

The nudge line is the Stop hook's text `operator answer(s) captured this session are not in a decision record yet` (`runtime/hooks/claude/session-stop.ts:107`). Its count rises only when the pending count passes the stored one (`capture-core.mjs:344-368`), which is why S5, S6, S10 and S11 expect none.

### Matrix Columns

One row per runtime: Runtime, CLI version, Model, Question tool (`AskUserQuestion`, `question`, `request_user_input`, `ask-user-question`, `ask_user_question` or "no answer surface"), Answer path (live hook, save-time sweep or none), S1 to S12 (each PASS, FAIL or SKIP with one reason), Nudge sequence observed, Verdict, Evidence folder. Claude is the only runtime with a live hook and a Stop nudge (`.skilled/hooks/README.md:273`), so the nudge cells on the other four read SKIP with that line as the named blocker until sibling 004 changes it.

### Siblings 002 to 005

A sibling adds a stage as S13 and up, or a variant such as S5b, and never renumbers. It reruns the scenario on its runtime and appends a matrix row with the commit it tests. 002 adds a hand-written row to the demo record before S6 and checks it is matched, not duplicated. 003 fills the Codex and Pi rows. 004 turns the OpenCode and Devin nudge cells from N/A to a checked sequence. 005 adds S5b, a chat question asked mid-message (Known Limitation 2 of `001-decision-capture-build/implementation-summary.md:158`).

### Data Flow
The runner types a turn, the subject asks, the runner answers, the hook appends to `$Q/<session>.jsonl` and the Stop hook updates `<session>.nudge` and prints the nudge line. At S6 and S10 the save sweeps the transcript, the subject writes rewritten decisions and the writer upserts `decision-record.md` and appends `consumed.jsonl`. The runner copies each file into the evidence store after every stage.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

N/A: this phase adds a test scenario and its results. It fixes no reported finding and changes no producer or consumer code.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup waits for the 065 runner, records logins and consent and builds the scratch project. Implementation writes the scenario and its index row, then runs Claude and the other four runtimes. Verification checks the repository is untouched, the matrix has no empty cell and both validators pass.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The three existing decision-capture scenarios stay as they are: hook on a fixture, sweeps on fixtures, save writer on one fixed payload | `node --test`, the CLI save |
| Integration | Stages S0 to S12 per runtime, with the checkpoint after each stage | 065 runner, `tmux`, `jq`, `cmp`, `rg` |
| Manual | The operator reads the pane captures for the S1, S5 and S12 judgments | `tmux capture-pane` copies in the evidence store |

The one command that decides a run: `awk -F'\t' '$2=="FAIL"' scratch/live-runs/claude-run1/checkpoints.tsv | wc -l` prints 0, with 13 rows in the file.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| P0: conversation runner and scenario format, `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios` | Internal | Red, being planned | No live run and no scenario layout. T001 blocks every later task. |
| `001-decision-capture-build` hook, sweeps, writer and Stop nudge | Internal | Green, complete | None. |
| `tmux`, `jq`, `node` | External | Green, installed | None. |
| Logins for `claude`, `opencode`, `codex`, `pi` and `devin`, and the operator's consent for paid live turns | External | Yellow, unchecked | The runtime row records "not run" with the `auth status` output. GPT models run only through the GPT provider, and a quota stop ends that row. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a run's after-check shows a change under the real `specs/` or a new file in the real `.skilled/skills/.state/decision-capture/`, or the scenario breaks `validate-playbook-package.cjs`.
- **Procedure**: stop the run with `tmux -L <socket> kill-server`, list the stray paths by diffing against the S0 baseline and report them to the operator before removing anything. For a bad scenario, revert the commit that added the scenario file and its index row.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 065 runner shipped, CLI logins, operator consent | Implementation |
| Implementation | Setup, and the scenario file before any run | Verification |
| Verification | Every runtime row filled | Packet close |
<!-- /ANCHOR:phase-deps -->

---

