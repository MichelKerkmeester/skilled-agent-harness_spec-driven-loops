---
title: "Research: conversation playbook scenarios plan review before build"
description: "Three-iteration DeepSeek review of the sk-doc/065 plan, with the load-bearing claims re-checked by the orchestrator: what to reuse in the playbook skill, what to change in phases 001 and 002, per-runtime feasibility, and the runner's fit with 043/006."
trigger_phrases:
  - "conversation scenario plan review"
  - "conversation runner research"
  - "065 deep research findings"
  - "043/006 runner fit"
importance_tier: "important"
contextType: "research"
---
# Research: conversation playbook scenarios plan review

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Topic** | Review the conversation-scenario plan before building it: skill reuse, phase 001 and 002 changes, per-runtime feasibility, and fit with `specs/system-speckit/043-decision-capture/006-live-conversation-test` |
| **Packet** | `specs/sk-doc/065-conversation-playbook-scenarios` |
| **Executor** | cli-pi, `llmgateway/deepseek-v4.1-flash-1017`, `--thinking max`, single executor |
| **Iterations** | 3 of 3, stop reason `maxIterationsReached` (stop policy `max-iterations`) |
| **Findings** | 36 finding rows across `deltas/iter-001.jsonl` to `iter-003.jsonl`, 3 ruled-out directions |
| **Verification** | Each finding below is marked **[verified]** when the orchestrator re-ran or re-read the evidence itself, or **[iteration]** when it rests on the DeepSeek iteration only |
| **Date** | 2026-11-01 |
<!-- /ANCHOR:metadata -->

---

## 2. INVESTIGATION REPORT

The plan is sound in shape and should be built as two phases, in the current order. Neither phase should be split. The changes worth making before the build fall into three groups: the validator has two raw-text checks that the new block will trip, the runner's state snapshot cannot see the failure it exists to catch, and the runner's turn model does not fit five of 043/006's thirteen stages. The last group is a format decision in 001's closed key set, so it has to be settled before 001 freezes its rules.

---

## 3. EXECUTIVE OVERVIEW

- **Keep both phases, keep 001 before 002, split neither.** 001 is one parser, one error code, one export and one reference. 002's real seam is risk class (fake-subject core versus live adapters), and a task re-order isolates it without a packet boundary.
- **001 must mask the conversation block from `verdictChecks` and `evergreenChecks`.** Both scan raw text, so a `check` that greps for `BLOCKED` becomes a `FORBIDDEN_VERDICT` error.
- **002's REQ-008 cannot detect an append to an existing ignored file.** `git status --ignored` lists paths, not contents, and it collapses fully ignored folders, so a test answer appended to the real queue passes unseen.
- **002 cannot express five 043/006 stages as written:** S0 (no human turn), S8 (compact plus a send), S12 (a second scratch project in the same scenario), DEVIATION with retry-once, and randomized think time.
- **Every launch flag in 002's adapter table exists in the installed CLIs.** What `--help` cannot show is the question dialog keys, which is why ADR-002's recorded probes stay necessary.

---

## 4. METHOD AND VERIFICATION

Each iteration was one `pi -p --offline --model llmgateway/deepseek-v4.1-flash-1017 --thinking max` dispatch through the shared command builder, writing its narrative, delta and gateway record under `research/`. All three passed `verify-iteration.cjs`. The orchestrator then re-checked the claims the recommendations rest on: it re-read the cited validator and spec lines, re-ran the chain-table grep with a quoted `--include`, ran `splitTableRow` on an escaped pipe, compared `git status --porcelain --ignored` with `--ignored=matching -uall` on `.skilled/skills/.state`, and ran `--help` on all five CLIs (`claude` 2.1.316, `opencode` v2.1.4, `codex-cli` 0.164.0, `pi` 1.4.0, `devin` 3000.11.234).

Iteration 3's focus text named several of the orchestrator's own hypotheses for Q4 and Q5. Agreement there is not independent confirmation; the points marked **[verified]** carry the orchestrator's own evidence.

---

## 5. THE EXISTING SKILL: REUSE AND IMPROVE (Q1)

1. **[verified] The export seam is ready.** The validator exports a function object and keeps its CLI side effects behind `require.main === module`, so the runner can import `parseConversationScript` without booting the CLI. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:869]
2. **[verified] REQ-004 is one more tuple.** `promptSyncChecks` holds its copies as a list, and the Turn 1 copy is already one entry. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:619]
3. **[verified] The test helper cannot check REQ-003's field path.** `expectViolation` asserts only that the code appears, so a rule that blames `turns` instead of `turns[2].questions[0].answer` still passes. Add a helper that asserts a path fragment. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:57]
4. **[iteration] Keep `fixtures/clean-package` byte-identical.** `expectClean` asserts a package-wide exit 0, and REQ-008's before-and-after comparison is taken against it. Put conversation cases in a separate fixture package. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:65]
5. **[verified] Multi-turn scenarios already exist, as headless chains.** CC-015 and CU-015/CU-016 run turn 2 with `-p --continue` or `--resume` and put "Turn 1: ... Turn 2: ..." in the Exact Prompt cell. None uses the `Turn | Exact user input` table. They suit chat-only continuity checks; the tmux runner is needed only where a question tool must render. [SOURCE: .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/session-continuity/resume-explicit-chat-id.md:50]
6. **[verified] The Turn table rule is documented with no template home and no user.** `SKILL.md` names the Turn 1 cell as a prompt-sync copy, but the snippet template has no Turn table. The new reference should say which multi-turn format to choose, and that a scenario with a conversation block carries no Turn table. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:334]
7. **[verified] 001's measured grep is invalid as written.** `grep -rlI "Exact User Input" .skilled/skills --include=*.md | wc -l` in zsh fails with `no matches found` before grep runs, and `wc` prints 0. Quoted, the grep still prints 0, so the conclusion holds; the recorded command should be quoted. [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/001-scenario-contract/spec.md:93]

---

## 6. PHASE 001: SCENARIO CONTRACT (Q2)

1. **[verified] Mask the block before `verdictChecks` and `evergreenChecks` (high).** `validateScenario` passes raw text to both, unlike `pathChecks` and `backtickPathChecks`. A `check` containing `BLOCKED` or `READY` raises `FORBIDDEN_VERDICT`; a bare `SKIP` in a string can raise `SKIP_BLOCKER_MISSING`; an absolute `/Users/` path or a dated string raises `DEVELOPER_ABSOLUTE_PATH` or `BAKED_RUN_TRANSCRIPT`. Add the masking to REQ-003 with a negative test. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:280] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:426]
2. **[verified] Reword ADR-001's pipe argument.** `splitTableRow` splits only on unescaped `|`, so `colou\?r\|color` stays one cell. The decision still stands on what is true: a cell cannot hold a label list or a per-turn shell check. [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:512]
3. **[iteration] Add a keystroke verb.** The closed key set has no way to press Enter, Escape, an arrow or Ctrl-C, which a first-launch trust or onboarding screen may need. Either a `keys` verb with a closed vocabulary or a rule that `send: ""` means Enter.
4. **[iteration] Do not overload `answer.select` length.** "Two or more labels mean a multi-select" cannot tell a multi-select from a script that toggles one of two options. A `multi: true` field removes the ambiguity.
5. **[iteration] Add a per-turn `runtimes` filter**, so one script can carry a Codex-only turn, and a way to assert a question must not be asked (043/006 tests answer-once behavior).
6. **[iteration] Require `timeout_ms >= 1`**, and state in 001 whether a failed `check` ends the run, since evidence volume follows from it.
7. **[iteration] Order 001's own tasks:** decide the fixture split (item 5.4) and the masking (item 6.1) before the rule table is written.

---

## 7. PHASE 002: CONVERSATION RUNNER (Q3)

1. **[verified] Build the fake-subject core before the live probes.** `tasks.md` puts T001 (probe five runtimes) first, and TASK-SEQ says to run tasks in order, so milestone M2, which needs no quota, waits on about an hour of live probing. Re-order to T003, then T004 to T008 and the fake-subject tests, then M2, then T001 and T002. [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/tasks.md:54] [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/plan.md:319]
2. **[verified] Replace REQ-008's snapshot (high).** `git status --porcelain --ignored -- .skilled/skills/.state` printed 24 lines against 27 for `--ignored=matching -uall`: it collapses fully ignored folders (`session-relaunch/` became one line) and never reports content, so an append to `decision-capture/consumed.jsonl` or a queue file is invisible. Hash file contents under the watched subtree instead. The real `.state` also churns from every live session (spec-gate, goal and decision-capture files of this very session), so scope the watch to the paths a run can reach, or `REPO_CHANGED` will be noise. [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:173]
3. **[verified] Bound `check` and `setup` in time.** REQ-005 bounds only the settle wait, REQ-006 defines only exit 0 or not, and REQ-007's cleanup targets the pane's process group, not the runner's own `bash -c` children. Add `CHECK_TIMEOUT` and `SETUP_TIMEOUT` and extend the survivor check. [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:171]
4. **[iteration] Measure the settle window in T001.** Record six captures 500 ms apart at rest per runtime, so the hardcoded 1500 ms settle rests on a measurement, not on the fake subject.
5. **[iteration] Give R-001 a command:** a `--check-adapters` mode that launches each runtime once, waits for ready, captures one screen and prints `OK` or `DRIFT` with the version.
6. **[iteration] Define reuse of `--out`:** refuse a non-empty `--out/<runtime>/` without `--overwrite`, or key evidence by run id.
7. **[iteration] Add `references/conversation-scenarios.md` to the Definition of Ready**, since T013 edits it.
8. **[iteration] Split only on a tripwire:** if T001 shows two or more runtimes need multi-question dialog parsing, or probing runs past about a day, move adapters, screens and MTP-007 to a third child.

---

## 8. RUNTIME FEASIBILITY (Q4)

| Runtime | Flags in 002 `plan.md` | `--help` result | Open point |
|---------|------------------------|-----------------|------------|
| Claude Code | `--session-id`, `--resume`, `--dangerously-skip-permissions`, `--ax-screen-reader` | **[verified]** all present | 043/006 S9 uses `--continue`, the plan uses `--resume <uuid>` |
| OpenCode | `--standalone`, `--auto`, `--session` | **[verified]** all present; `--session` creates or continues | dialog keys need the probe |
| Codex | `--no-alt-screen`, `--no-daemon`, `--dangerously-bypass-approvals-and-sandbox`, `--enable` | **[verified]** all present; no `--session-id` | `--dangerously-bypass-hook-trust` also exists and may be needed for hooks in a fresh project **[iteration]** |
| Pi | `--session-id`, `--approve`, `--tui-mode` | **[verified]** all present | see below |
| Devin | `--permission-mode dangerous`, `--resume <id>`, `devin list` | **[verified]** `dangerous` mode, `-r/--resume [id]` and `list` present | the resume flow needs the probe |

**[verified] A scratch project outside the repository loses repo-local runtime configuration.** `.pi/models.json` declares the `llmgateway` provider and `.pi/settings.json` sets it as default, so Pi in a scratch folder falls back to its global settings; the decision-capture hooks live in `.claude/`, `.opencode/`, `.codex/` and `.devin/`. 043/006's plan builds `.claude/settings.json`, hook links and an `.opencode/` folder in its scratch project, and names nothing for `.pi/`, `.codex/` or `.devin/`. REQ-013's guidance should say that each runtime's project config must be carried into the scratch project by `setup`, and MTP-007 should state which model each runtime uses there. [SOURCE: specs/system-speckit/043-decision-capture/006-live-conversation-test/plan.md:63] **[iteration]** Pi's question package is installed user-globally as well as repo-locally, so Pi keeps its question tool in scratch. [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:113]

---

## 9. FIT WITH 043/006 (Q5)

| 043/006 need | 002 contract | Fit |
|--------------|--------------|-----|
| Stage marks PASS, FAIL, DEVIATION, N/A | Verdicts PASS, FAIL, SKIP only, and SKIP is a runtime-level blocker | **[verified]** no carrier for DEVIATION or N/A. Mapping N/A to SKIP would make a passing runtime look skipped |
| Retry a stage once on subject DEVIATION | First failed turn ends the runtime's run | **[verified]** contradiction. 043/006 NFR-R02 is unimplementable unless turns become attempt-aware [SOURCE: specs/system-speckit/043-decision-capture/006-live-conversation-test/spec.md:199] |
| Later stages marked SKIPPED after a failure | Matrix records "first failure" only | **[verified]** partial; no per-turn rows for unrun turns [SOURCE: specs/system-speckit/043-decision-capture/006-live-conversation-test/spec.md:209] |
| S0: baselines, no human turn, with a checkpoint | First turn must be a `send`; checks run after turns | **[verified]** no check-only turn |
| S8: `/compact`, then a send, with a sha before and after | One action per turn | **[verified]** must become two turns, so stages and turns stop being one-to-one |
| S9: `/exit`, relaunch with `claude --continue` | `restart` relaunches into the same session id | **[verified]** different mechanism; 043/006 keeps it as an open question |
| S12: kill switch in a new scratch project, row 13 of one `checkpoints.tsv` | Guidance says a second scenario with `env`; a second block in one file is invalid | **[verified]** contradiction [SOURCE: specs/system-speckit/043-decision-capture/006-live-conversation-test/plan.md:84] [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/plan.md:112] |
| Think time 5 to 15 s after a turn, 3 to 8 s after a widget, from a recorded seed | Fixed `delay_ms` per turn | **[verified]** not expressible [SOURCE: specs/system-speckit/043-decision-capture/006-live-conversation-test/plan.md:68] |
| Nudge lines counted per turn's pane | `screen.txt` of the settled screen plus one whole-run `raw-pane.log` | **[iteration]** a nudge printed earlier in the turn can scroll off; give each turn its `raw-pane.log` slice |
| No writes into the real queue | REQ-008 `git status` snapshot | **[verified]** cannot see appends (section 7.2) |
| "Observed value" column | `check.txt` holds whatever the check prints | **[iteration]** fits if the reference tells checks to print the observed value |

The saves (S6, S10, S11) fit: a `send` turn with the slash command and a `check` that copies the record into `$CONVERSATION_TURN_DIR`. **[iteration]** One unverified risk: typing `/speckit:save ...` into a TUI opens slash-command autocompletion, so Enter may pick a completion. The T001 probe should send one slash command per runtime.

---

## 10. CLAIM LEDGER

| Claim | Status |
|-------|--------|
| Validator export seam, prompt-sync tuple, test helper, fixture assertion | verified by reading the cited lines |
| Raw-text `verdictChecks` and `evergreenChecks` | verified at lines 280, 426 and their calls at 742 and 745 |
| Escaped pipe survives `splitTableRow` | verified by running the regex |
| Turn chain table unused; 001's grep unquoted | verified by quoted rerun |
| REQ-008 blind to appends and collapsed folders | verified by comparing the two `git status` forms |
| All adapter flags exist | verified by `--help` on all five CLIs |
| Scratch loses repo-local config | verified for `.pi/` and 043/006's plan; the effect on each runtime's model choice is inferred |
| Keystroke verb, `multi`, per-turn filter, settle measurement, `--check-adapters`, `--out` rule | iteration findings, design judgment, not re-derived |
| Slash-command autocompletion risk | inferred; the T001 probe settles it |

---

## 11. RECOMMENDATIONS

Ranked by the cost of finding the problem late.

1. **Decide the 043/006 format questions before 001 freezes its key set** (section 9): a check-only turn or a `setup`-stage check for S0, a list of actions per turn or split stage ids for S8, a second scenario or a named second project for S12, attempt-aware turns for DEVIATION retry, a stage-status vocabulary (or a documented derivation in 043/006), and seeded jitter for think time. Each is a closed-key-set change.
2. **001: mask the conversation block before `verdictChecks` and `evergreenChecks`**, with a negative test whose `check` contains `BLOCKED`.
3. **002: replace REQ-008's `git status` snapshot with a content hash of the subtrees a run can reach.**
4. **002: re-order tasks so the fake-subject core reaches M2 before any live probe.**
5. **002: bound `check` and `setup` in time and include the runner's own children in the survivor check.**
6. **001: add a field-path assertion helper and keep `clean-package` untouched.**
7. **002/REQ-013: require `setup` to carry each runtime's project config into the scratch project**, and probe one slash command per runtime in T001.
8. **001: add a keystroke verb and a `multi` flag; reword ADR-001's pipe argument; quote the measured grep.**
9. **002: `--check-adapters`, the `--out` reuse rule, the settle measurement and the Definition of Ready line.**

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Split 002 into a core child and an adapters child now | The phase thresholds permit but do not require it, and a task re-order isolates the same risk class without a handoff | `phase-definitions.md` section 2; `tasks.md:54` | 2 |
| Carry 043/006's N/A on the runner's SKIP | SKIP is a runtime-level blocker in REQ-010, so a passing runtime would read as skipped | `002-conversation-runner/spec.md:180` | 3 |
| Fix each runtime's dialog keys from documentation | No CLI documents its question dialog; `--help` proves only the launch flags, so ADR-002's probes stay | `--help` on all five CLIs | 3 |
| Split 001 | One parser, one code, one export, one reference | `001-scenario-contract/spec.md` section 3 | 1 |
| Widen the Turn table instead of a JSON block | A cell cannot hold a label list or a shell check, even though escaped pipes do survive | `validate-playbook-package.cjs:512` | 1 |

---

## Divergence Map

- **Saturated directions:** none recorded; the registry holds no divergence block.
- **Pivots taken:** none (0 completed, 0 failed, 0 audited overrides). No Council artifacts.
- **Evidence breadth:** one model, one lineage, repository files and CLI `--help` output. No interactive session was started.
- **Remaining frontier:** the T001 probe facts (dialog keys, settle behavior, slash-command input, Devin resume, Codex hook trust in a fresh project); the content of `local-obsidian`'s playbook, a symlink outside the repository that no iteration read.

This map documents breadth. The run stopped at its iteration cap, not because the topic converged.

---

## 12. OPEN QUESTIONS

1. Which packet owns the S0, S8, S9 and S12 format decision: 065 (new keys) or 043/006 (restaged scenario)? It constrains 001's key set.
2. Does the runner gain DEVIATION and N/A, or does 043/006 document a derivation from PASS, FAIL and SKIP plus its own `checkpoints.tsv`?
3. Codex: enable `default_mode_request_user_input`, or accept chat-only coverage? (Carried from the parent spec.)
4. Does typing a slash command into each TUI open autocompletion that swallows Enter? T001 should probe it.
5. Which model does each runtime use in a scratch project without the repository's `.pi/`, `.codex/` and `.devin/` configuration?

---

## 13. REFERENCES

- Iterations: `research/iterations/iteration-001.md` to `iteration-003.md`; deltas `research/deltas/iter-001.jsonl` to `iter-003.jsonl`
- State: `research/deep-research-state.jsonl`, `research/deep-research-strategy.md`, `research/findings-registry.json`, `research/deep-research-dashboard.md`
- Resource map: `specs/sk-doc/065-conversation-playbook-scenarios/research/resource-map.md`
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/` (SKILL.md, scripts, assets)
- `specs/sk-doc/065-conversation-playbook-scenarios/001-scenario-contract/`, `002-conversation-runner/`, `decision-record.md`
- `specs/system-speckit/043-decision-capture/006-live-conversation-test/` (read only)
- `.skilled/skills/cli-external-orchestration/cli-*/`

---

## Convergence Report
- Stop reason: maxIterationsReached
- Total iterations: 3
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 1: Q1 and Q2, the existing skill and the 001 contract (0.72); run 2: Q3, the runner phase (0.70); run 3: Q4 and Q5, runtime feasibility and 043/006 fit (0.68)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
