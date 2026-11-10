---
title: "Feature Specification: Phase 2: conversation-runner"
description: "Builds the shared conversation runner in sk-create-manual-testing-playbook: it drives a real interactive session of Claude Code, OpenCode, Codex, Pi or Devin in a private tmux pane inside a scratch project, answers the subject's questions from the script, checks state after each turn and keeps the evidence."
trigger_phrases:
  - "conversation runner"
  - "phase 2 conversation runner"
  - "run-conversation-scenario"
  - "tmux conversation runner"
  - "runtime question adapters"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/002-conversation-runner"
    last_updated_at: "2026-11-02T13:10:00Z"
    last_updated_by: "beb6e7b1-5f31-42db-8cd9-f58f27216e79"
    recent_action: "Runner proven live on all five runtimes"
    next_safe_action: "Operator reviews the commit file list"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Codex structured questions: the under-development flag is enabled (decision record Q005)"
      - "The runner lives in the playbook skill and is shared"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: conversation-runner

<!-- SPECKIT_LEVEL: 3 -->
---

<!-- ANCHOR:metadata -->
## EXECUTIVE SUMMARY

No script in the repository can type into a live runtime session, and the non-interactive modes the CLI skills use hide or remove the question tools a conversation test must exercise. This phase builds one runner that starts a runtime's interactive CLI in a private tmux pane inside a scratch project, plays a `json conversation` script into it, answers the questions the subject asks and runs a state check after every turn. A scripted conversation, MTP-007, passes on Claude Code with every pane and process gone afterwards, and the decision-capture live test runs on the same runner.

**Key Decisions**: tmux on a private socket drives the session (ADR-001 in `plan.md`). Each runtime adapter is fixed from a recorded live screen, not from documentation (ADR-002). The runner refuses to start unless the project is a marked scratch directory outside the repository (ADR-003).

**Critical Dependencies**: `parseConversationScript` from 001-scenario-contract, tmux 3.8 on the machine and logged-in runtime CLIs.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-01 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 2 |
| **Predecessor** | 001-scenario-contract |
| **Successor** | None |
| **Handoff Criteria** | MTP-007 passes on Claude Code, every runtime has a results row and the runner tests exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the conversation playbook scenarios packet.

**Scope Boundary**: The runner, its adapters, its tests, the skill's own conversation scenario and the reference sections on running scripts. The format and its validator checks belong to phase 001.

**Dependencies**:
- `parseConversationScript` and `CONVERSATION_RUNTIMES`, exported by the validator in phase 001
- tmux 3.8 at `/opt/homebrew/bin/tmux`, already installed
- `claude`, `opencode`, `codex`, `pi` and `devin` on `PATH` and logged in, which they are on this machine

**Deliverables**:
- `scripts/run-conversation-scenario.cjs` with five adapters
- Runner tests with a fake subject and five recorded question screens
- MTP-007 in the skill's own playbook and its results on all five runtimes
- Reference sections on running a script, per-runtime notes and multi-runtime live tests
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A conversation script is only useful if something can play it into a real session. The CLI skills dispatch in non-interactive mode, and that mode hides the surface under test: the Pi question tool is removed from the model's tool list in non-interactive runs, and Codex offers its question tool only in Plan mode. Driving a session by hand works once and leaves no repeatable evidence.

### Purpose
One command plays a conversation script into a real interactive session of each requested runtime and returns PASS, FAIL or SKIP per runtime, with the screens, check outputs and transcript that justify the verdict.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run on 2026-11-01. The first two commands show the tools are present and nothing drives them yet. The next two show the question-tool limits named above. The pi package README says "in non-interactive runs the tool is removed from the model's tool list instead of failing every call".
```text
$ command -v tmux expect
/opt/homebrew/bin/tmux
/usr/bin/expect
$ ls .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts
tests
validate-playbook-package.cjs
$ codex features list | grep -E "request_user_input|collaboration"
collaboration_modes                      removed            true
default_mode_request_user_input          under development  false
$ pi list | grep ask-user
  npm:@juicesharp/rpiv-ask-user-question
    /Users/michelkerkmeester/.pi/agent/npm/node_modules/@juicesharp/rpiv-ask-user-question
  npm:@juicesharp/rpiv-ask-user-question
    /Users/michelkerkmeester/MEGA/Development/Skilled/.pi/npm/node_modules/@juicesharp/rpiv-ask-user-question
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Build `scripts/run-conversation-scenario.cjs`: arguments, the scratch guard, a private tmux server per runtime, the turn loop with question answering, idle and timeout detection, restart and compact actions, per-turn checks, evidence, a results matrix and cleanup on every exit path.
- Probe each of the five runtimes once and record its question screen, ready and busy markers, exit keys, compact command and resume behavior.
- Write one adapter per runtime from its probe, with its feasibility recorded.
- Add MTP-007 to the skill's own playbook and run it on all five runtimes.
- Add the running, per-runtime and multi-runtime live-test sections to `references/conversation-scenarios.md`.

### Out of Scope
- The decision-capture scenario. `specs/system-speckit/043-decision-capture/006-live-conversation-test` writes it and runs it here.
- Cursor and Hermes adapters. No scenario needs them today.
- Writing `benchmark/reports/` files. The skill's results contract keeps that a hand step.
- Live runs in CI. They need logged-in CLIs and spend model quota.

### Files to Change
Paths are relative to `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/run-conversation-scenario.cjs` | Create | The runner and its five adapters |
| `scripts/tests/run-conversation-scenario.test.cjs` | Create | Refusals, fake-subject runs, cleanup and adapter screen parsing |
| `scripts/tests/fixtures/fake-subject.cjs` | Create | A small line-mode program that behaves like a TUI subject |
| `scripts/tests/fixtures/question-screens/` | Create | Five redacted question screens, one per runtime, from the probes |
| `scripts/tests/fixtures/README.md` | Modify | Name the new fixtures |
| `references/conversation-scenarios.md` | Modify | Running a script, per-runtime notes, multi-runtime live tests |
| `assets/manual-testing-playbook-snippet-template.md` | Modify | Note that a conversation scenario's command sequence is the runner command |
| `manual-testing-playbook/conversation-runner/drive-a-scripted-conversation.md` | Create | MTP-007 |
| `manual-testing-playbook/manual-testing-playbook.md` | Modify | Section and index entry for MTP-007 |
| `README.md` and `SKILL.md` | Modify | List the runner, set version 1.1.0.0 |
| `changelog/v1.1.0.0.md` | Create | Release note |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The runner exits 2 and starts nothing when `--scratch` is missing, when it resolves inside the repository, when it is a non-empty directory without the runner's `.conversation-scratch` marker, when a `setup` command fails with any exit other than 77, or when `specs` or `.skilled/skills/.state` in the prepared project resolves outside that project. A `setup` command that exits 77 instead skips that runtime: its result is SKIP with the command's first output line as the blocker, and no subject starts. |
| REQ-002 | Each runtime runs in its own tmux server on a private socket named for the run, started with `-f` pointing at a runner-written config, at a fixed 200 by 50 size, with `remain-on-exit` on. The operator's own tmux server is never contacted. |
| REQ-003 | Each turn waits `delay_ms` (a fixed value, or a draw from a `[min, max]` pair using a generator seeded by `--seed`, recorded in `result.json`), then types `send` with `send-keys -l` and Enter, performs `restart` (exit, then relaunch into the same session) or `compact` (the adapter's compact command), or, for a check-only turn, does neither. |
| REQ-004 | During a turn the runner answers each question the adapter detects: `select` with one label or several, `other` through the free-text row and `reply` as a plain chat message. A question that matches no expected entry fails the turn as `UNEXPECTED_QUESTION`, and a required entry never asked fails it as `MISSING_QUESTION`. |
| REQ-005 | A turn settles when the adapter's ready marker shows, its busy marker does not and the screen is unchanged for 1500 ms, polled every 500 ms. A turn that has not settled by `timeout_ms` fails as `TIMEOUT`, and a subject that exits fails it as `SUBJECT_EXITED`. |
| REQ-006 | After each settled turn the runner runs `check` with `bash -c` in the project, with `CONVERSATION_REPO_ROOT`, `CONVERSATION_RUN_DIR`, `CONVERSATION_TURN_DIR` and `CONVERSATION_RUNTIME` (the runtime id) set, so one script can skip a stage that does not apply to a runtime. Exit 0 passes the turn, exit 77 skips that turn with the first output line as its blocker and the run continues, and any other exit fails it as `CHECK_FAILED`. A failed turn with `retry: 1` runs once more. After that, the first failed turn ends that runtime's run and later turns are recorded `NOT_RUN`. `check` is bounded by `CHECK_TIMEOUT` (60 s) and each `setup` command by `SETUP_TIMEOUT` (120 s); an overrun fails as `CHECK_TIMEOUT` or `SETUP_TIMEOUT` and its process group is killed. |
| REQ-007 | On every exit path, including FAIL, timeout, an uncaught error, SIGINT and SIGTERM, the runner kills the pane's process group and its tmux server. It also kills any `setup` or `check` child it started. Afterwards `tmux -L <socket> list-sessions` fails and no process from the pane's group or the runner's own children remains. A survivor fails the run as `CLEANUP_INCOMPLETE`. |
| REQ-008 | The runner records a content hash (path, size and sha256 of every file) of the repository subtrees a run can reach, `specs/` and the watched `.skilled/skills/.state/` subfolders the scenario names (default `decision-capture`), before and after each runtime's run. Any difference fails the run as `REPO_CHANGED` and saves both snapshots. `git status --ignored` is not used, because it lists paths only and collapses fully ignored folders, so it cannot see an append to an existing queue file. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | Evidence per runtime lands under `--out`: `result.json`, `actions.jsonl`, `raw-pane.log`, `setup.log`, both repository snapshots, `checkpoints.tsv` (turn id, status, attempts, evidence folder, observed value) and per turn `screen.txt`, its `raw-pane.log` slice, one `question-N.txt` per question and `check.txt`. `screen.txt` is written before `check` runs. A non-empty `--out/<runtime>/` is refused without `--overwrite`. `--out` also gets `matrix.md` with one row per requested runtime. |
| REQ-010 | Verdicts are PASS, FAIL or SKIP only. SKIP names its blocker: the runtime's binary is missing, the scenario's `runtimes` list leaves it out, or the script needs a question tool the adapter does not have. |
| REQ-011 | The adapters for `claude-code`, `opencode`, `codex`, `pi` and `devin` are each built from a recorded probe screen kept in `scripts/tests/fixtures/question-screens/`, and a test parses each screen into the question text and option labels the probe recorded. |
| REQ-012 | MTP-007 passes `validate-playbook-package.cjs`, scripts a single-select, a multi-select, an Other answer, a chat reply, a restart and a compaction, and passes on Claude Code. The other four runtimes each get a matrix row with evidence. |
| REQ-013 | The reference gains a section that maps a multi-runtime live test's needs onto the script: tool questions, chat questions, a process question that must leave no trace, mid-run and final saves, restart or compaction, a kill-switch run as its own scenario file, per-turn state copies and the results matrix. It says `setup` must copy each runtime's project config (`.claude/`, `.opencode/`, `.codex/`, `.pi/`, `.devin/`) into the scratch project, and MTP-007 records which model each runtime used there. |
| REQ-014 | The fake-subject core (guard, tmux driver, turn loop, cleanup, hashing, evidence) is built and its suite passes before any live probe runs. |
| REQ-015 | Codex's `default_mode_request_user_input` is enabled in the scratch project's own Codex config by `setup`. The operator also enabled it globally and in this repository (decision record Q005), so no Codex tool-question turn is planned as SKIP. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node scripts/tests/run-conversation-scenario.test.cjs` exits 0, run by the orchestrator outside any sandbox because tmux needs a local socket.
- **SC-002**: `run-conversation-scenario.cjs --scenario manual-testing-playbook/conversation-runner/drive-a-scripted-conversation.md --runtime claude-code` exits 0, and its `matrix.md` row reads PASS.
- **SC-003**: After every run, `tmux -L <socket> list-sessions` fails and `pgrep -g <pane pgid>` prints nothing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `parseConversationScript` from phase 001 | The runner cannot read a script without it | Phase 001 hands off only once the export is tested |
| Dependency | Logged-in runtime CLIs | A runtime that cannot start gets no row | A missing binary is SKIP with that blocker. An auth failure shows on the saved screen as a launch timeout |
| Risk | A CLI update changes its question screen | High | Recorded screens pin each adapter, and `result.json` records the CLI version, so a mismatch shows as `UNEXPECTED_QUESTION` or `TIMEOUT` with the screen saved |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The poll interval is 500 ms and the settle window is 1500 ms, both hardcoded. A turn's wall time is its model time plus at most 2 s of runner overhead.
- **NFR-P02**: Cleanup finishes within 10 s of the run's end: SIGTERM to the pane group, 5 s grace, then SIGKILL.

### Security
- **NFR-S01**: The runner reads no credential file and passes no token. Each runtime uses its own logged-in state.
- **NFR-S02**: Adapters launch with their permission prompts bypassed, which is safe only because REQ-001 confines the subject to a marked scratch project outside the repository.

### Reliability
- **NFR-R01**: Every exit path runs the same cleanup, and a test proves it for FAIL, timeout and SIGINT.
- **NFR-R02**: No new dependency. The runner uses the Node standard library and the tmux binary.

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Empty input: a scenario with no valid `json conversation` block exits 2 with the parser's findings and starts nothing.
- Maximum input: five runtimes in one call run one after another, each in its own project folder and tmux server, and each gets one matrix row.
- Failure path: a subject that exits mid-turn fails as `SUBJECT_EXITED` with its last screen saved, and cleanup still runs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | About 15 files and 1,400 lines, a new script driving five external CLIs |
| Risk | 16/25 | Launches CLIs with permission prompts bypassed, so the scratch guard is load-bearing |
| Research | 12/20 | Each runtime's question screen is unknown until probed |
| Multi-Agent | 6/15 | Workstreams: 2, worker-written code and orchestrator-run live probes |
| Coordination | 8/15 | Dependencies: 3, the phase 001 export, the five CLIs and the 043/006 consumer |
| **Total** | **62/100** | **Level 3** |

`recommend-level.sh --loc 1400 --files 15 --architectural` scores 71/100, Level 3.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A CLI update changes the question screen, so the adapter misses it | H | M | Recorded screens, CLI version in `result.json`, re-probe on mismatch |
| R-002 | A permission or workspace-trust prompt is read as a question | M | M | Launch flags bypass prompts in scratch only, and the probe records any prompt that remains |
| R-003 | A runtime daemon outlives cleanup | M | M | `codex --no-daemon`, `opencode --standalone`, and a survivor check that fails the run as `CLEANUP_INCOMPLETE` |
| R-004 | The subject writes into the repository by absolute path | H | L | Containment check before launch and the before-and-after snapshot, which fails the run as `REPO_CHANGED`. Writes outside the repository are not detected |
| R-005 | Another session in the same checkout changes `specs/` during a run | M | M | The snapshot diff is saved, so the operator can see a false `REPO_CHANGED`. Run live tests when no other session writes there |
| R-006 | The subject words a question differently or asks an extra one | M | H | Questions match by regular expression, `optional` covers runtimes that skip one, and a failure keeps the screen for a rerun |
| R-007 | Live runs spend model quota on five runtimes | L | H | Live runs happen on demand, never in CI |
| R-008 | Pi's question tool comes from the third-party package `@juicesharp/rpiv-ask-user-question` | M | L | The adapter records the package version, and without it Pi tool-question turns SKIP with that blocker |

## 11. USER STORIES

### US-001: Run one script on five runtimes (Priority: P0)

**As a** scenario author such as the decision-capture live test, **I want** one command to play my script into each runtime's real interactive session, **so that** I get one PASS, FAIL or SKIP row per runtime with the evidence behind it.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Never touch the real repository (Priority: P1)

**As the** operator, **I want** the runner to refuse anything but a scratch project and to leave no pane or process behind, **so that** a test run cannot write into a real packet or leave a session running.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Record**: See `../decision-record.md` for the operator's answers and the script format

---

## 12. OPEN QUESTIONS

- Codex structured questions: should runs pass `--enable default_mode_request_user_input`, a flag `codex features list` marks under development? The probe tries it first. Without operator approval, Codex runs chat questions only and tool-question turns SKIP with that blocker.
<!-- /ANCHOR:questions -->

---
