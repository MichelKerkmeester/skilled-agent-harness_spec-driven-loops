---
title: "Implementation Plan: Phase 2: conversation-runner"
description: "One Node script drives each runtime's interactive CLI in a private tmux server inside a scratch project, plays the conversation script into it through per-runtime adapters fixed from live probes, and keeps screens, checks and a results matrix as evidence."
trigger_phrases:
  - "conversation runner plan"
  - "tmux runner design"
  - "runtime adapter feasibility"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/002-conversation-runner"
    last_updated_at: "2026-11-01T21:11:38Z"
    last_updated_by: "planning-session"
    recent_action: "Planned the runner design, adapters and execution workers"
    next_safe_action: "Start after 001 hands off, at T001 live probes"
    blockers:
      - "Needs parseConversationScript from 001-scenario-contract"
    key_files:
      - ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: conversation-runner

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js 20 or newer, CommonJS, driving the tmux 3.8 binary |
| **Framework** | None. `child_process`, `fs`, `os`, `path` and `crypto` from the standard library |
| **Storage** | Files only: the scratch project and the `--out` evidence folder |
| **Testing** | `node scripts/tests/run-conversation-scenario.test.cjs` with a fake subject in real tmux, plus live MTP-007 runs |

### Overview
`scripts/run-conversation-scenario.cjs` reads a scenario's `json conversation` block through the phase 001 parser. For each requested runtime it prepares a marked scratch project, starts the runtime's interactive CLI in a tmux server of its own and plays the script into it. Adapters, one per runtime and each fixed from a recorded probe screen, tell the runner what the screen looks like when the subject is ready, busy or asking. The proof is the runner test suite plus an MTP-007 run that passes on Claude Code and leaves no pane or process behind.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 is complete: `node -e "console.log(typeof require('./.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs').parseConversationScript)"` prints `function`
- [ ] `tmux -V` prints `tmux 3.8` and each of `claude`, `opencode`, `codex`, `pi` and `devin` answers `--version`
- [ ] The operator has answered the Codex flag question in `spec.md` section 12, or the plan proceeds with chat-only Codex
- [ ] `references/conversation-scenarios.md` exists from phase 001, since T013 edits it

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node scripts/tests/run-conversation-scenario.test.cjs` exits 0
- [ ] The MTP-007 Claude Code run exits 0 with a PASS row, and `matrix.md` holds a row for each of the five runtimes
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One script, a tmux driver and per-runtime adapter data.

### Key Components
- **CLI**: `node scripts/run-conversation-scenario.cjs --scenario <file.md> --runtime <id>[,<id>...] --scratch <dir> --out <dir>`. Exit 0 when every runtime is PASS or SKIP, 1 when any is FAIL, 2 on a usage error or a refusal.
- **Scratch guard**: refuses before anything starts (REQ-001). It resolves `--scratch` through its nearest existing ancestor and compares it with the repository root from `git rev-parse --show-toplevel`. It creates `<scratch>/<runtime>/`, writes the `.conversation-scratch` marker, runs `setup` there and then checks that `specs` and `.skilled/skills/.state`, when present, resolve inside that folder. A linked `.skilled` would otherwise send runtime state writes into this repository.
- **tmux driver**: `tmux -L conv-<pid>-<runtime> -f <out>/<runtime>/tmux.conf new-session -d -s subject -x 200 -y 50 -c <project> -e K=V ... <argv>`. The runner-written config sets `remain-on-exit on`, `history-limit 50000` and `monitor-bell on`. `pipe-pane -o` appends raw output to `raw-pane.log`, `capture-pane -p -J` reads the screen, `send-keys -l` types text and `display-message -p '#{pane_pid} #{pane_dead} #{window_bell_flag}'` reads state.
- **Turn loop**: pause `delay_ms`, type or act, then poll every 500 ms until the turn settles or `timeout_ms` passes. On each poll a detected question is matched by `match` against the expected entries and answered through the adapter's keys. When the screen settles with a chat question that matches a pending `reply` entry, the reply is typed and the loop continues. The turn's `check` runs once the screen is settled.
- **Adapters**: one object per runtime with `bin`, `version`, `launch(ctx)`, `resume(ctx)`, `exitKeys`, `compact`, `ready`, `busy`, `questionTool`, `parseQuestion(screen)` and `answerKeys(question, answer)`, plus `transcript(ctx)` where the runtime's log path is known. The runner checks at load that every id in `CONVERSATION_RUNTIMES` has an adapter.
- **Evidence writer**: `result.json`, `actions.jsonl`, `raw-pane.log`, `setup.log`, `repo-before.txt`, `repo-after.txt`, and per turn `turns/<id>/screen.txt`, `question-N.txt` and `check.txt`. After all runtimes, `matrix.md` holds one row per runtime: verdict, turns passed, first failure and evidence path.
- **Cleanup**: SIGTERM to the pane's process group, 5 s grace, SIGKILL, then `kill-server` on the private socket. Then it verifies that no session answers and no process of the group remains. It is registered for normal exit, FAIL, uncaught errors, SIGINT and SIGTERM.

### Data Flow
The scenario file goes through `parseConversationScript`. The scratch guard prepares the project, and the repository snapshot is taken. tmux starts the adapter's `launch` argv. The turn loop writes keys to the pane and reads screens back through the adapter. Checks read the project's files and copy state into `$CONVERSATION_TURN_DIR`. Cleanup runs, the second snapshot is compared and `result.json` and the matrix row are written.

### Runtime Adapters And Feasibility
What the runner can do today rests on the sources named in each row. Every screen text, key sequence and session-id detail is fixed by the T001 probe, not by this table.

| Runtime | Interactive start | Question surface today | How the runner answers | Feasibility |
|---------|-------------------|------------------------|------------------------|-------------|
| Claude Code | `claude --session-id <uuid> --dangerously-skip-permissions`, then `claude --resume <uuid> ...` to restart | `AskUserQuestion` dialog with options, multi-select and a free-text row. A live probe in `043-decision-capture/001` saw its answers in `tool_response.answers` | Arrow or number keys, Space to toggle in a multi-select, the free-text row for Other, Enter to submit. `--ax-screen-reader` renders flat text if the default screen proves hard to parse | High. The tool exists in the default mode, the session id is fixed at launch and `/compact` exists |
| OpenCode | `opencode --standalone --auto --session <id>`, which creates or continues that session. Session ids must start with `ses_`, so the runner derives one from its UUID | `question` tool. Its stored part holds `state.input.questions` and `state.metadata.answers` (`043-decision-capture/001`, Q006). The probe (version 2.1.4) recorded the dialog in `fixtures/question-screens/opencode*.txt` | Arrows then Enter for one choice. In a multi-select, Enter toggles a row and the Submit tab sends. Enter opens the free-text row for Other. A question with only the free-text row is accepted | High. MTP-007 passed 6/6 (`scratch/runs/opencode-attempt2/`). The model comes from the root `opencode.json`, which setup copies |
| Codex | `codex --no-alt-screen --no-daemon --dangerously-bypass-approvals-and-sandbox`, then `codex resume --last` in the scratch folder to restart | `request_user_input`, shown outside Plan mode because the operator enabled `default_mode_request_user_input` (decision record Q005) and setup also sets it in the scratch `.codex/config.toml`. Probe version 0.164.0 | Arrows then Enter. The tool offers one choice per question, so several choices or an Other answer are typed as a note on its `None of the above` row (Q007). Enter waits 500 ms after typed text. Start-up answers folder trust, skips the update offer and leaves hooks untrusted unless the scenario sets `trust_hooks` (Q006) | High. MTP-007 passed 6/6 (`scratch/runs/codex-attempt6/`) |
| Pi | `pi --session-id <id> --approve --tui-mode regular`; the run quits with `/quit`, because `/exit` is sent to the model | Two tools (probe version 1.4.0): `question` draws a pick list ending in `Done (...)`, and `ask_user_question` from `@juicesharp/rpiv-ask-user-question` draws a dialog with a `Type something.` row and a Submit row | Pick list: Enter on each choice, then `Done`. Dialog: Space toggles a row, the `Type something.` row takes Other, the Submit row sends. `/compact` refuses a session that is still small | High. MTP-007 passed 6/6 (`scratch/runs/pi-attempt2/`) |
| Devin | `devin --permission-mode dangerous`, then `devin --continue` in the scratch folder to restart | `ask_user_question` tool. Its stored answer starts "User answered your questions:" (`043-decision-capture/001`, T023). The probe (version 3000.11.234) recorded a folder-trust screen on the first run and the dialog in `fixtures/question-screens/devin*.txt` | Space toggles a multi-select row and Enter confirms. The Other row takes typed text directly. Enter waits 500 ms after typed text | High. MTP-007 passed 6/6 (`scratch/runs/devin-attempt2/`) |

Every start command bypasses permission prompts, because a permission prompt would otherwise read as an unexpected question. That is safe only inside the scratch project the guard enforces.

### Guidance For The Decision-Capture Live Test
`references/conversation-scenarios.md` gains this mapping, written for any multi-runtime live test.

| Need | How the script expresses it |
|------|-----------------------------|
| Answer a single-select, multi-select or free-text Other question | `answer.select` with one label, several labels, or `answer.other` |
| Answer a question asked in plain chat | `answer.reply` |
| A process question, such as the spec-folder question, that must leave no trace | An expected entry, usually `optional: true` because not every runtime asks it. The turn's `check` asserts the captured state holds no trace of it |
| Mid-run and final saves | A `send` turn that asks for the save in plain words, then a `check` that copies the saved files into `$CONVERSATION_TURN_DIR` |
| Restart or compaction | `action: "restart"` or `action: "compact"` |
| Kill-switch run | A second scenario whose `env` sets the switch, with checks that assert nothing was written |
| Named stages, such as S0 to S12 | Turn `id` values, which name the evidence folders |
| Per-runtime results | One `--runtime` list and the `matrix.md` it writes. Stage marks map onto PASS, FAIL and SKIP |
| No writes into real packets | The scratch guard, its containment check and the repository snapshot |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `validate-playbook-package.cjs` exports | Phase 001 parser | unchanged, imported | The runner's load-time adapter check |
| The skill's own playbook root | Six scenarios, MTP-001 to MTP-006 | update: add MTP-007 | `validate-playbook-package.cjs --package .skilled/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook` exits 0 |
| `.github/workflows/playbook-operator-contract.yml` | Fleet validator in CI | unchanged, never runs the runner | The fleet run still passes for this package |
| `specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test` | First consumer | not changed by this phase | Its scenario validates against the phase 001 rules |

Required inventories:
- Same-class producers: `rg -n "tmux|send-keys|capture-pane" .skilled --glob '*.cjs' --glob '*.mjs' --glob '*.sh'` confirms no other driver exists to reuse.
- Consumers of changed symbols: the runner is new, and its only planned consumer is the 043/006 scenario.
- Matrix axes: five runtimes, by answer kind (`select` single, `select` several, `other`, `reply`), by action (`send`, `restart`, `compact`), by exit path (PASS, each FAIL reason, SIGINT).
- Algorithm invariant: the subject's working directory and every Skilled write target resolve inside the marked scratch project, and no tmux server outlives the run.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup probes the five runtimes and records their screens. Implementation builds the guard, the tmux driver, the turn loop, cleanup, the adapters and MTP-007. Verification runs the tests, then MTP-007 on every runtime.

### Execution

The operator set the executors for this packet's implementation work.

- **Implementation workers** run GPT-6 Luna through cli-codex at reasoning `xhigh` on the `fast` service tier: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 codex exec --model gpt-6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast" -c approval_policy=never --sandbox workspace-write "<prompt>" </dev/null`.
- **When Luna's quota is used up**, the fallback is DeepSeek V4.1 Flash 1017 on DevPass through cli-pi at thinking `max`, using the child envelope from `cli-pi/references/providers-and-models.md` section 5: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true pi -p "<prompt>" --model llmgateway/deepseek-v4.1-flash-1017 --thinking max --mode text --offline </dev/null > stdout.log 2> stderr.log`. `pi --list-models` lists that model. cli-pi is preferred for DeepSeek over cli-opencode.
- Luna never runs through `llmgateway` or any other gateway, even as a fallback. The fallback changes the model, never Luna's route.
- Before each dispatch, read `cli-external-orchestration/cli-codex/SKILL.md` or `cli-pi/SKILL.md`, put the shared child-dispatch preamble at the top of the prompt and keep the brief to one change in short literal text. A Pi child reads the exit code as no signal, so the orchestrator checks its output text.
- **The orchestrator, not a worker, runs** the tmux tests, the T001 probes, the MTP-007 live runs, `validate.sh` and the fleet checks. `cli-codex/SKILL.md` records that `--sandbox workspace-write` blocks local IPC sockets and that a nested codex dies at startup under it, and tmux needs a local socket. Workers write code and unit tests, and the orchestrator confirms each claimed result by running it.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each adapter's `parseQuestion` on its recorded screen returns the probe's question text and labels, and returns null on a ready screen | `node scripts/tests/run-conversation-scenario.test.cjs` |
| Integration | Refusals (no scratch, scratch in the repository, unmarked non-empty scratch, failing setup, `specs` linked into the repository). A fake-subject run covering a single-select, a multi-select, Other, a chat reply, restart and compact. `UNEXPECTED_QUESTION`, `TIMEOUT` and a SIGINT mid-run, each followed by a cleanup check | The same suite, with `fake-subject.cjs` in real tmux. Without tmux it prints `SKIP: tmux not found` |
| Manual | MTP-007 on Claude Code, OpenCode, Codex, Pi and Devin | The runner itself, run by the orchestrator, with `matrix.md` kept as evidence |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `parseConversationScript` from phase 001 | Internal | Yellow, planned | The runner cannot read scripts |
| tmux 3.8 | External, installed | Green | No runner. Nothing is installed by this plan |
| Logged-in `claude`, `opencode`, `codex`, `pi` and `devin` | External | Green on this machine | That runtime's row is SKIP or a launch failure |
| `@juicesharp/rpiv-ask-user-question` for Pi | External, installed | Green | Pi tool-question turns SKIP with that blocker |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A run leaves a tmux server or a subject process behind, or a run changes anything under `specs/` or `.skilled/skills/.state/` in the repository.
- **Procedure**: Kill leftovers with `tmux -L <socket> kill-server` for each `conv-*` socket under `${TMUX_TMPDIR:-/tmp}/tmux-$(id -u)/`, restore any changed file with `git restore` from the saved snapshot list, then revert the phase commit with `git revert <sha>`. The validator and phase 001 are not affected.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup, the live probes | Phase 001 handoff | Adapters, because their patterns come from the probe screens |
| Implementation | Setup | Verification |
| Verification | Implementation | The 043/006 live test |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
parseConversationScript (001) ──► scratch guard ──► tmux driver ──► turn loop ──► evidence + matrix
                                                        │               ▲
live probes (T001) ──► question screens ──► adapters ───┘───────────────┘
                                                        │
                                                    cleanup (every exit path)
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Scratch guard | Phase 001 parser | A marked, contained project | tmux driver |
| Live probes | Logged-in CLIs | Five question screens and launch facts | Adapters |
| tmux driver and cleanup | Scratch guard | A private pane and its teardown | Turn loop |
| Adapters | Probes, driver | Ready, busy and question parsing per runtime | Turn loop |
| Turn loop and evidence | Driver, adapters | `result.json` and `matrix.md` | MTP-007 runs |
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Live probes, T001** - about 1 hour of orchestrator time across five runtimes - CRITICAL
2. **Guard, driver, turn loop and cleanup, T004 to T008** - about 4 worker hours - CRITICAL
3. **Adapters and MTP-007 runs, T009 to T016** - about 3 hours - CRITICAL

**Total Critical Path**: about 8 hours, estimated, not measured

**Parallel Opportunities**:
- The fake subject (T003) and the guard (T004) can run at the same time
- Reference sections (T013) and MTP-007 authoring (T012) can run after the adapters exist
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Probes recorded | Five files in `scripts/tests/fixtures/question-screens/` | End of Setup |
| M2 | Runner works on the fake subject | `node scripts/tests/run-conversation-scenario.test.cjs` exits 0 | End of Implementation |
| M3 | Live proof | MTP-007 Claude Code row reads PASS and all five runtimes have a row | End of Verification |
<!-- /ANCHOR:milestones -->

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: tmux on a private socket drives the subject

**Status**: Accepted

**Context**: The runner must type into a full-screen TUI, read what it shows, wait on it and stop it cleanly. tmux 3.8, `expect` and `script` are installed.

**Decision**: Each runtime runs in its own tmux server, `tmux -L conv-<pid>-<runtime>`, with a runner-written config.

**Consequences**:
- `capture-pane` returns the rendered screen, not raw escape codes, so adapters match plain text.
- tmux needs a local socket, so the runner cannot run inside the codex `workspace-write` sandbox. Mitigation: the orchestrator runs it.

**Alternatives Rejected**:
- `expect`: it sees the raw byte stream, so every adapter would parse terminal escape codes itself.
- The runtimes' RPC or server modes, such as `pi --mode rpc` or `opencode serve`: each is different, and none is the interactive surface a human uses, which is what the test must exercise.

---

### ADR-002: Adapters come from recorded probe screens

**Status**: Accepted

**Context**: No CLI documents its question dialog's exact text or keys, and the screens change between releases.

**Decision**: T001 probes each runtime once and stores a redacted question screen. Each adapter's patterns are written against that file, and a test parses it.

**Consequences**:
- An adapter is tested offline against the screen it was built from.
- A CLI update can still break an adapter. Mitigation: `result.json` records the CLI version, and a failure keeps the live screen for a new probe.

**Alternatives Rejected**:
- Patterns written from documentation: nothing documents these dialogs, so the patterns would be guesses.

---

### ADR-003: The runner refuses anything but a marked scratch project

**Status**: Accepted

**Context**: Adapters bypass permission prompts, so a subject can write anywhere its process can reach. The operator required that runs never write into real packets.

**Decision**: The runner refuses unless the project is a marked folder outside the repository whose `specs` and `.skilled/skills/.state` resolve inside it. It also compares repository snapshots before and after each run.

**Consequences**:
- A run cannot start inside the repository, and a write that reaches `specs/` or runtime state fails the run.
- A concurrent session in the same checkout can cause a false `REPO_CHANGED`. Mitigation: the diff is saved for the operator to read.

**Alternatives Rejected**:
- A warning instead of a refusal: the operator asked for a refusal, and a warning does not stop a bypassed-permission subject.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [ ] Read the task's row in `tasks.md`, the requirement it serves in `spec.md` and the Execution section above
- [ ] Confirm phase 001 has handed off, shown by CHK-001 in `tasks.md`
- [ ] Before a worker dispatch, read `cli-codex/SKILL.md` or `cli-pi/SKILL.md`

### Execution Rules

| Rule | Meaning |
|------|---------|
| TASK-SEQ | Run tasks in `tasks.md` order. The T001 probes come before any adapter code |
| TASK-SCOPE | Change only the files in `spec.md` section 3, and note anything else in the parent goal log |
| TASK-VERIFY | A task is done when its Verify command, run by the orchestrator, prints the expected output |

### Status Reporting Format

One line per task in the parent `goal.md` log: `T### PASS|FAIL|BLOCKED <what happened> <evidence path or command output>`.

### Blocked Task Protocol

Mark the task `[B]`, record the blocking command and its output in the parent goal log and stop every task that depends on it. A block that needs a decision, such as the Codex flag or an exhausted quota with no fallback left, goes to the operator as a question.
