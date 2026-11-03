---
title: "Feature Specification: Phase 6: live-conversation-test"
description: "Decision capture was only proven with fixture payloads and one fixed save payload, never in a live session where a person answers real questions over many turns. This phase plans a scripted, timed multi-turn conversation scenario that drives a real test-subject session per runtime and checks the queue, the nudge, two full-auto saves, a restart and the kill switch after each stage."
trigger_phrases:
  - "live conversation test"
  - "phase 6 live conversation test"
  - "decision capture live conversation scenario"
  - "decision capture runtime matrix"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: live-conversation-test

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-01 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-chat-question-detection |
| **Successor** | None |
| **Handoff Criteria** | The Claude row of the matrix is filled from a real run with every checkpoint recorded, and siblings 002 to 005 can rerun the same scenario to re-prove their fixes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Live multi-turn conversation test harness for decision capture specification.

The parent `specs/system-speckit/043-decision-capture` is a series parent: the decision-capture series. Child `001-decision-capture-build` is the finished build. Siblings `002-table-row-matching`, `003-codex-and-pi-capture`, `004-opencode-devin-live-capture` and `005-chat-question-detection` each re-prove their fix with the scenario this phase plans.

**Scope Boundary**: This phase writes the decision-capture conversation scenario, its per-runtime result matrix and the run results. The conversation runner that sends timed turns into a tmux pane is shared and is built in `specs/sk-doc/065-conversation-playbook-scenarios`, not here.

**Dependencies**:
- `specs/sk-doc/065-conversation-playbook-scenarios` must ship the conversation runner and the scenario format before any live run (P0).
- `001-decision-capture-build` supplies the hook, the sweeps, the save writer and the Stop-hook nudge under test.

**Deliverables**:
- One new playbook scenario, `decision-capture-live-conversation.md`, with stages S0 to S12 and a checkpoint per stage.
- Its index row in `manual-testing-playbook.md`.
- A filled runtime matrix with the Claude row from a real run, plus the evidence behind each cell.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The three decision-capture playbook scenarios feed a redacted fixture payload to the hook, run a sweep over a fixture transcript or hand the save one fixed JSON payload, and none of them starts a live session (Measured Behavior below). So nobody has seen a real operator answer a single select, a multi select, a typed "Other" answer and a plain chat question over several turns and then watched the queue, the Stop-hook nudge and two full-auto saves react, which is what the operator asked for: "a series of timed prompts run by an orchestrator with a test subject to see if it works mimicing human conversation".

### Purpose
A scripted conversation, typed into a real interactive session with human pauses, proves on each runtime that every in-scope answer lands once in the decision record and every process question lands nowhere.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ D=.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks
$ rg -c --include-zero 'fixture' $D/decision-capture-*.md
.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-transcript-sweeps.md:3
.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-claude-hook.md:6
.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-save-writer.md:2
$ rg -c --include-zero 'tmux|send-keys|claude -p|opencode run|codex exec|devin -p|pi -p' $D/decision-capture-*.md
.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-transcript-sweeps.md:0
.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-claude-hook.md:0
.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-save-writer.md:0
exit=1
$ rg -c --include-zero '^J=' $D/decision-capture-*.md
.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-transcript-sweeps.md:0
.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-claude-hook.md:0
.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-save-writer.md:1
```
All three scenarios name a fixture and none starts a live or interactive session, since every count of the session pattern is 0. The save-writer scenario drives the save with one fixed `J=` payload. The hook scenario pipes the fixture once (`decision-capture-claude-hook.md:55-65`), and the sweeps scenario runs the Devin sweep on one fixture transcript twice to prove deduplication (`decision-capture-transcript-sweeps.md:52-60`).
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Write one conversation scenario with stages S0 to S12: a Gate 3 process question, a single select, a multi select, a typed "Other" answer, a plain chat question, a mid-conversation full-auto save, a compaction, a restart, a final save, a repeat save and a kill-switch session, each with its checkpoint.
- Run the scenario through the 065 runner against a disposable scratch project, Claude Code first, then OpenCode, Codex, Pi and Devin.
- Record every stage as PASS, FAIL or SKIP with its evidence path (a deviation is a FAIL that quotes it, a stage that does not apply is a SKIP with a named blocker), and fill one matrix row per runtime.
- Record a runtime with no answer surface as such, with the pane or transcript line that shows it.
- Add the scenario's index row and state how siblings 002 to 005 add stages and rerun it.

### Out of Scope
- The conversation runner, its tmux driver and its scenario format - shared with other skills and planned in `specs/sk-doc/065-conversation-playbook-scenarios`.
- Fixing a capture defect a run finds - each fix belongs to the sibling that owns that surface (002 to 005) or to a new sibling, and this phase only records the failing checkpoint.
- Changing the three existing decision-capture scenarios - they stay as the unit-level checks.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-live-conversation.md | Create | The conversation scenario in the 065 format: setup, stages S0 to S12, per-stage checkpoints, the matrix columns and the sibling extension rule. |
| .skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md | Modify | One index row under 7.5 Plugins and Hooks, beside the three decision-capture rows at lines 282-284. |
| .skilled/skills/system-spec-kit/benchmark/reports/YYYY-MM-DD--manual-testing-playbook--decision-capture-live-conversation/README.md and results.csv | Create | The run report and the matrix as data, following the live-run precedent report and the storage rule at `session-relaunch-claude.md:805`. |
| specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/ | Create | Per-run evidence: pane captures, queue and consumed copies, the decision record before and after each save and `checkpoints.tsv`. |
| specs/system-speckit/043-decision-capture/006-live-conversation-test/implementation-summary.md | Modify | The filled matrix and the verification rows. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The scenario file `decision-capture-live-conversation.md` defines stages S0 to S11 in the 065 format, and a second scenario file `decision-capture-kill-switch-conversation.md` defines S12, because a script has one `env` and a run has one scratch project. Each stage names the human turn, the pause before it, what the runner waits for, the answer the human gives and the checkpoint observable with its expected value. S0 is a check-only turn. S8 is two turns, `S8-compact` (`action: compact`) and `S8-ask`, and S9 uses `action: restart`. |
| REQ-002 | Every run uses a disposable scratch project with its own project root and state directory. After a run, `git -C <repo> status --short --ignored specs .skilled/skills/.state` and a content hash of the real `.skilled/skills/.state/decision-capture/` match the baseline taken before it, and the runner reports no `REPO_CHANGED`. |
| REQ-003 | The Claude row of the matrix is filled from a real interactive Claude Code session, and every stage S0 to S12 carries PASS, FAIL or SKIP with an evidence path that exists. The stage marks map onto the runner's turn outcomes: a subject deviation is a FAIL whose check prints `DEVIATION: <what happened>`, after one retry (`retry: 1`), and a stage that does not apply is a SKIP whose check exits 77 and prints its named blocker. `checkpoints.tsv` here is derived from the two runs' runner `checkpoints.tsv` files, joining `S8-compact` and `S8-ask` into one S8 row. |
| REQ-004 | The Gate 3 or other process question the subject asks in S1 appears in no queue file and in neither operator anchor of `decision-record.md`, while the S1 pane capture shows it was asked. |
| REQ-005 | The S6 and S10 full-auto saves write one rewritten decision row and one verbatim appendix item per in-scope answer, with each source key once in `consumed.jsonl`. The S11 repeat save leaves `decision-record.md` byte-identical. |
| REQ-006 | The Stop-hook nudge lines the pane shows per turn, S1 to S11, match the expected sequence 0,1,1,1,0,0,1,1,1,0,0, and the `<session>.nudge` file holds the expected count after each turn. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | After the S8 compaction and the S9 restart, no source key appears twice across the queue files and the answer given after each is queued exactly once. |
| REQ-008 | A kill-switch session (S12) started with `SYSTEM_DECISION_CAPTURE_DISABLED=1` in a fresh scratch project answers one question and leaves no queue file and no nudge line. |
| REQ-009 | The OpenCode, Codex, Pi and Devin rows each hold either checkpoint results or "no answer surface" with the pane or transcript evidence that shows the missing question tool. |
| REQ-010 | `manual-testing-playbook.md` lists the new scenario once and `validate-playbook-package.cjs --package system-spec-kit` reports no new violation. |
| REQ-011 | The scenario states how siblings 002 to 005 extend it: each sibling adds its own stages to the scenario file as S13 and up, or a variant such as S5b, never renumbering, and appends a matrix row with the commit it tests. That is the one inheritance mechanism. |
| REQ-012 | Pauses use seeded ranges: `delay_ms: [5000, 15000]` before each turn and `delay_ms: [3000, 8000]` before each answer, with the runner's `--seed` recorded in `result.json`. |
| REQ-013 | After S6 and S10, `pendingRecords` for the session reports 0 and `consumed.jsonl` gains exactly one row per answer, and the S6 check prints which path did the consuming (the save or the matcher). |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: A real Claude Code run produces a `checkpoints.tsv` with 13 rows, one per stage S0 to S12, and each row's evidence path exists.
- **SC-002**: After S10 the scratch `decision-record.md` holds one operator row per in-scope answer and the process question count in it is 0, and `cmp` after S11 exits 0.
- **SC-003**: Each of the five runtime rows in the matrix has no empty cell.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | P0: the conversation runner and scenario format in `specs/sk-doc/065-conversation-playbook-scenarios` | No live run can start, and the scenario file has no format to follow. | Task T001 stays `[B]` until 065 ships. The stage content in `plan.md` is fixed now, so only its layout waits on 065. |
| Dependency | Provider logins and live-session cost for five CLIs | A runtime cannot run. | T002 records `auth status` per CLI and the operator's consent. A runtime that cannot log in gets a matrix row that says so. |
| Risk | The subject model does not ask the question it was told to ask, or asks it in chat instead of with the tool | High. The checkpoint would test the model, not the capture. | The check prints `DEVIATION:`, the runner reruns the turn once (`retry: 1`), and a second miss is FAIL with the pane capture. |
| Risk | A run writes into the real repository's `specs/` or its real queue | High. Test answers would reach a real packet. | REQ-002 compares `git status` and the real queue listing before and after each run. The scratch project's `.skilled/skills/.state` is a real directory, never a symlink. |
| Risk | The OpenCode sweep reads the user's global store and takes the newest session | Med. A save could pull answers from another session. | Run one runtime at a time and no other OpenCode session during the run. |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Each checkpoint reads only local files and finishes in under 5 s.
- **NFR-P02**: One runtime's S0 to S12 run finishes within 60 minutes of wall-clock time, or the stage that ran out is recorded as FAIL with reason timeout.

### Security
- **NFR-S01**: No run writes to the real repository's `specs/` or `.skilled/skills/.state/decision-capture/` (REQ-002).
- **NFR-S02**: Tracked evidence holds pane captures, queue copies and decision-record copies only, never a raw runtime transcript, because a transcript carries the operator's instruction files.

### Reliability
- **NFR-R01**: One runtime runs at a time, on its own tmux socket, so no check reads another run's state.
- **NFR-R02**: A stage is retried once (`retry: 1`) only where the subject may deviate, never to mask a capture FAIL; both attempts are kept as evidence.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a turn where the subject asks nothing adds no queue line and no nudge line, and S5's chat turn checks exactly that for the hook path.
- Maximum input: S3 selects every option offered, and the queue still gains one line whose answer joins all labels.
- Failure path: a wait that runs out records FAIL with reason timeout, saves the pane, kills that tmux server and marks the later stages SKIPPED.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | One scenario file, one index row, one report and evidence for five runtimes. No code. |
| Risk | 12/25 | Live sessions near a real repository and paid model turns, held by the scratch rule. |
| Research | 12/20 | Codex and Pi question tools are UNKNOWN, and restart session ids are unobserved. |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Does a Claude restart with `--continue` keep the session id? UNKNOWN. Decision: S9 checks keys across all queue files, so the stage passes either way, and the run records which happened.
- Does the save-time sweep honor `SYSTEM_DECISION_CAPTURE_DISABLED`? UNKNOWN: `.skilled/hooks/README.md:47` states the queue effect only. Decision: S12 asserts the hook and the nudge, and records what a save does without a pass rule.
- Does an interactive Codex subject in Plan mode get an answer back from `request_user_input_async`, and does the Pi subject's `ask_user_question` call return the answer the human typed? Sibling 003 found the Pi tool's answers in stored sessions and only unanswered Codex calls under `codex exec`. Their rows record what the live run shows.
- What layout does the 065 scenario format use for a stage? UNKNOWN until 065 is planned. The stage content in `plan.md` holds, and the scenario follows 065's layout.
<!-- /ANCHOR:questions -->

---


