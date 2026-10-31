---
title: "Tasks: Goal Verifier Pi Census, Zero-Call Arms and Opt-In Jev Shadow Mode"
description: "Ordered tasks for the Pi census, the fixture builder and labeled set, the scorer's three zero-call arms, the gated model arm on Deem or Jev, the keep decision and, only on keep, the shadow mode for the backend that kept."
trigger_phrases:
  - "goal verifier jev tasks"
  - "labeled set scorer tasks"
  - "jev shadow mode tasks"
  - "pi goal nudge census tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Goal Verifier Pi Census, Zero-Call Arms and Opt-In Jev Shadow Mode

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

T001 to T022 keep their ids. The 2026-09-27 amendment added T023 to T031 and listed them where they run. The two-backend amendment the same day added T032 and T033 for the Deem half and rewrote T008, T009, T012 to T016, T018, T019, T029 and T030 in place. The wave 3 amendment on 2026-09-28 added T034 to T036 and rewrote T001, T011, T016, T021, T022, T026 and T027 in place for parent D4 and D6.

**Label gate (parent D4).** This phase closes after T034, T035 and the verification tasks. No model writes a label. T001, T011 and every other `[B]` task wait for the operator's labels and are not part of this phase's completion. **Who builds (parent D5):** a fresh Opus 5.5 xhigh build orchestrator dispatches single-change briefs by Bash and runs the census and the builder itself. Under the operator's roster amendment of 2026-09-28 20:30 the executors were Devin `deepseek-v4-1-flash-max` and Pi on `llmgateway/mimo-v2.6-pro`, with Cursor retired. The orchestrator session verifies, gets a cross-family code review and commits (`plan.md` section 4).

**Closure (2026-09-28).** Built and committed as `1da5b193d2`. `E` is `scratch/w3-build/build-evidence.md`, and the session record is the orchestrator session's verification log.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T002 [P] Confirm the proposed census, fixture builder, scorer, test and fixture names clash with nothing (`rg` over `.skilled/hooks/goal/`). Evidence: closure pass, `git grep` for the five names at the build's start commit `996cf85eef` under `.skilled/hooks/goal/` finds nothing (exit 1), while the same pattern at HEAD finds 6 files. `lib/` then held only the goal-core and goal-slice files. Briefs 01, 02 and 04 each created their two files new (`E` section 5)
- [x] T003 [P] Rerun the search for every reader of `VALID_VERIFIER_MODES` and `OPENCODE_GOAL_VERIFIER`, and confirm with `realpath` that `.opencode/plugins/opencode-goal.js` is still the one real plugin file behind the `.skilled/plugins` symlink. Evidence: closure pass, `rg` outside `specs/` finds `VALID_VERIFIER_MODES` only at `opencode-goal.js:134` and `:228`. `OPENCODE_GOAL_VERIFIER` appears in the plugin, its supervisor test, `goal-plugin.md`, `ENV-REFERENCE.md`, the four catalog and playbook pages and `.env.example`, all already named in `spec.md` sections 3 and 6. `realpath .skilled/plugins/opencode-goal.js` prints `.opencode/plugins/opencode-goal.js`
- [x] T004 [P] Record the goal suites' pass count before any edit (`node --test .skilled/plugins/tests/opencode-goal-*.test.cjs`). Evidence: at `996cf85eef`, with `goal-doc-contract.test.cjs`, 143 tests: 8 pass and 135 fail under plain Node, every failure `ERR_MODULE_NOT_FOUND` for `@opencode-ai/plugin`, because this worktree has no `.opencode/node_modules`. With `--preserve-symlinks --preserve-symlinks-main`, 142 pass and 1 fails. The final run matched both, delta 0 (`E` sections 1 and 6)
- [x] T023 [P] Report the redaction miss to the owners of `opencode-goal.js:474`, `secret-scrubber.ts:128` and `goal-core.cjs:374`, with `TYPESAFE_API_KEY=` and `SERVICE_TOKEN=` fixture values under 48 characters, and record when each owner's case passes. Edit none of the modules. Evidence: confirmed on synthetic strings, a 19 to 23 character value after either name survives all three, and recorded for the goal hooks, plugin and system-spec-kit owners among the operator items (`E` section 9, session record). No module changed (`E` section 6, D8 row). No owner's case passes yet, and T029 rechecks all three before any Jev arm
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T024 Write the Pi census: the method line, the closed record-type whitelist with a named error, per-session counts by verdict and reason category, first and last dates, totals and no message text (`.skilled/hooks/goal/lib/count-pi-goal-nudges.mjs`). Evidence: brief 01 on Devin, then brief 01b on Pi, which restored "from the record timestamp field" to the method line that review of 01 found missing (`E` section 5)
- [x] T025 Write the census test: a fixture session with one nudge per reason, an unknown record type that exits non-zero and a grep that finds no message text (`.skilled/hooks/goal/lib/count-pi-goal-nudges.test.mjs`). Evidence: briefs 01 and 01b, 3 tests, 3 of 3 pass (`E` section 5)
- [x] T026 Run the census on `~/.pi/agent/sessions`, the operator's choice (parent D4), over every date, and reconcile its totals with 1,457 nudges in 28 sessions and 1,616 matches in 37 files, naming the unit, the window or the 2026-09-27 delivery change behind any gap (`implementation-summary.md`). Evidence: exit 0 in 7 s, 43 lines, `files_scanned=5919`, totals 1,822 nudges in 41 files dated 2026-07-29 to 2026-08-10. Scope explains the gap, not the unit, the window or the delivery change: both figures are subsets, reconciled in `implementation-summary.md` (`E` section 3)
- [x] T027 Write the fixture builder: Claude rows paired with native `goal_status` pre-labels, Pi rows with the recorded nudge verdict and an empty `label`, each with the raw text, its as-ingested form and the raw length (`.skilled/hooks/goal/lib/build-verifier-fixture.cjs`). Evidence: brief 02 on Devin (Pi path) and brief 03 on Pi (Claude path), builder test 5 of 5. The Claude pre-label goes to `prelabel` and `label` stays empty (parent D4). `ingested_text` uses goal-core's redaction, which review P2 4 records as not the plugin's exact form (`E` sections 5 and 7, session record)
- [x] T034 Run the builder once at the label gate on `~/.pi/agent/sessions`, adding Claude rows only from a transcript directory the operator has named. Write the rows to `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl`, leave that file uncommitted and record the row count per source in `implementation-summary.md`. No model writes a label (parent D4). Evidence: exit 0 in 10 s, `built: rows=50 pi=50 claude=0`, no Claude directory named. `label` empty on 50 of 50, mode `0600`, untracked and in no commit (`E` section 4, closure pass `git ls-files --error-unmatch` exit 1)
- [x] T035 Add the census, builder, scorer and their tests to the goal hooks README's directory tree, key files and validation sections and to the hub README's `goal/` tree lines, through sk-doc (`.skilled/hooks/goal/README.md`, `.skilled/hooks/README.md:138-139`). Evidence: brief 08 (five edits, +24/-5) and brief 09 (+3), `validate_document.py` `VALID` with 0 issues on each, rerun by the session (`E` section 5, `logs/09.last.txt`, session record)
- [ ] T001 [B] Past the label gate (parent D4), not part of this phase's completion. Open: the operator's step, at least 30 of the 50 rows. **Operator task.** Label the rows the builder writes: adjudicate Claude rows where the pre-label and the heuristic disagree, spot-check about 10 agreements, label every Pi row `met`, `not_met` or `blocked`, strip every secret and decide whether the file is committed. No model writes a label (`.skilled/hooks/goal/lib/verifier-labeled-set.jsonl`)
- [x] T005 Write the scorer's loader and label normalization, mapping `not-met` to `not_met`, keeping `unclear` as its own row and rejecting any other value (`.skilled/hooks/goal/lib/score-verifier-labeled-set.cjs`). Evidence: brief 04 on Devin, its 5 tests pass (`E` section 5)
- [x] T006 Add the three zero-call arms on identical rows: the heuristic through `__test.writeGoalAtomic` and `__test.maybeVerifyGoal` in a `mkdtemp` state directory, the tail-window arm and goal-core parity, with per-check attribution and the clamp-defect count (same file). Evidence: brief 05 on Pi (report lines) and brief 06 on Devin (arms and CLI). A synthetic 30-row run prints 3 arms, 4 table rows each with `unclear` on its own row, per-check `errors:` lines and `clamp_defects: 1` (`E` sections 5 and 6)
- [ ] T028 [P] Optional: add R4's claims column from `detectCompletionClaim` on the raw text beside an optional `claim_label`, leaving the report byte-identical without it (same file). Open: not built, because the orchestrator's build list left it out (`E` section 7). REQ-015 is P2, and nothing at the label gate depends on it
- [x] T007 Add the stop boundaries against the better of the heuristic and tail-window arms: under 30 rows, no headroom with the clamp-fix finding, no reachable rows. Otherwise print the three REQ-014 conditions (same file). Evidence: brief 07 on Pi, three unit tests for no headroom at exactly 0.10, no reachable rows and the gate lines. The gate lines print the tail-window count and name the two Jev conditions as checked by hand, which T029 does past the gate (`E` section 5)
- [x] T010 Write the scorer test: the 1,300-character full-stop case, a held blocking-language row, an `unclear` row, fewer than 30 rows and a stub `jev` and a stub `cli-deem` (proposed, phase 008) that log no call (`.skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs`). Evidence: briefs 04 to 07b, 12 tests, 12 of 12 pass, also run by the reviewer (`E` section 5, session record)
- [ ] T011 [B] Past the label gate (parent D4): run the zero-call report on the operator's labeled set and read the stop or gate line. Open: waits for the operator's labels
- [ ] T029 [B] Past the gate only: confirm that the tail-window arm leaves an unfixable false `not_met`, the only condition for a Deem arm. For a Jev arm also confirm that the three redaction cases pass and that 002 has recorded a per-call latency. Write the confirmation per backend in `goal.md`'s log before any model arm code
- [ ] T030 [B] Past the gate only: write the confidence bands for the cascade table into `spec.md` REQ-009, and for a Deem arm the option-order scheme into REQ-006, before the first model call
- [ ] T008 [B] Past the gate only, Jev arm: add the key gate, `--jev`, the identity line, `command -v jev`, `jev --version` equal to `jev 0.6.2` and `jev auth status --provider <provider>` exit 0, with the three skip lines and one `--provider` for every check and call (scorer)
- [ ] T009 [B] Past the gate only, Jev arm: add the Jev arm, the egress line with calls and estimated input tokens, state on stdin, the wrapper rule and its assertion, the exit-code handling, the 30 s cap, 3 reruns, the per-call JSONL with the pick probability, the aggregate flip rate, the cascade table and the keep line read against both zero-call arms (scorer)
- [ ] T032 [B] Past the gate only, Deem arm: add the Deem gate, `--deem` (proposed) and `cli-deem health` within 2,000 ms printing the backend, the model id and the commit pair, with the four `deem arm skipped:` lines (proposed), no server start, no key and no fallback to the other backend (scorer)
- [ ] T033 [B] Past the gate only, Deem arm: add the Deem arm, the "nothing leaves the machine" line with planned calls and estimated wall time, the wrapper rule and its assertion, 3 option orders, the Deem exits after the gate with the `deem arm stopped:` lines, the per-call JSONL with the backend, model id, commit pair and option order, the order-flip rate, the cascade table and the keep line with its commit pair (scorer)
- [ ] T012 [B] Past the gate only: run each built arm by hand when its backend's check passes, Jev first and then Deem (operator, 2026-09-29), and write each keep or drop result with its backend, and for Deem its commit pair, into `implementation-summary.md`
- [ ] T013 [B] Keep only: add the value for the backend that kept, `deem` (proposed) or `jev`, to `VALID_VERIFIER_MODES` and its branch, keeping the heuristic as the acting verifier (`.opencode/plugins/opencode-goal.js`)
- [ ] T014 [B] Keep only: add the session-cached gate, with one `--provider` for `jev` or the 500 ms Deem check that never starts the server for `deem`, the enablement line, the async timeout-bounded shadow call to `jev` or `cli-deem` with its own catch, the `busy` skip, the `jev-shadow` or `deem-shadow` log, the one-line disable on a changed Deem commit pair and a `verifier_shadow` line only on disagreement (same file)
- [ ] T015 [B] Keep only: add supervisor cases for no-backend parity, a malformed answer, exit 3 mid-session, exit 4 and a thrown shadow error against a stub `jev`, plus a fake Deem server with a failed check and a changed commit pair for `deem` mode (`.opencode/plugins/tests/opencode-goal-supervisor.test.cjs`)
- [ ] T016 [B] Keep only: update the idle-verification bullet and the `OPENCODE_GOAL_VERIFIER` rows to list both values, through sk-doc (`.skilled/hooks/goal/goal-plugin.md:53` and `:70`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:338`)
- [ ] T036 [B] Keep only (parent D6): add the value that kept to the goal plugin's feature catalog and playbook pages in system-spec-kit and system-skill-advisor, write a changelog entry in each skill and recheck both skills' `SKILL.md` and README with `rg` for the verifier values, changing them only if one lists them. All through sk-doc (paths in `spec.md` section 3)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T031 Run the census test and read its output and exit status. Evidence: 3 of 3 inside the goal hooks suite, 166 of 166, exit 0, at the build's final checks and again by the session (`E` section 6, session record)
- [x] T017 Run the scorer test and read its output and exit status. Evidence: 12 of 12 inside the same suite runs, exit 0 (`E` section 6, session record)
- [x] T018 Run the scorer with a stub `jev` and a stub `cli-deem` first on `PATH` and confirm both stub logs stay empty, the zero-call report prints and the exit status is 0 with no per-call file. Evidence: the scorer test "main scores the set through the plugin arms" spawns the scorer on a 30-row set with both stubs first on `PATH`: status 0, the report prints, neither stub log exists (`E` section 6). The scorer's only file write is `zero-call-report.txt` under `--out` (closure pass, `grep` for file writes finds `score-verifier-labeled-set.cjs:464` only)
- [ ] T019 [B] Past the gate only: check the per-call JSONL for a wall time, exit code and pick probability on every call, and on every Deem call the backend, model id, commit pair and option order, and confirm it holds no row text
- [ ] T020 [B] Keep only: rerun the goal suites and `goal-doc-contract.test.cjs` and compare against T004's count
- [x] T021 Run `git status --short` and confirm no change outside the files in `spec.md` REQ-012, and that the fixture is untracked. Evidence: the orchestrator diffed `git status --porcelain` after every dispatch (`E` section 5). At close, `git show --name-only 1da5b193d2` lists only REQ-012 paths and this folder, `git status --short` on `.skilled/hooks`, `.opencode/plugins` and this folder prints nothing and the fixture is untracked (`git ls-files --error-unmatch` exit 1), now listed in the local `.git/info/exclude` (closure pass, session record)
- [x] T022 Run `validate.sh --strict` and `check-goal.cjs` on this phase, and `validate_document.py` on every doc the build changed. Evidence: the build's final checks gave `RESULT: PASSED` with 0 errors and 0 warnings, check-goal 5 of 5 and `VALID` on both READMEs, and the session reran both READMEs `VALID` (`E` section 6, session record). The closure pass reran the phase gates (`implementation-summary.md` Verification)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] At the label gate (parent D4): every task without `[B]` marked `[x]`, and every `[B]` task left open and listed in `implementation-summary.md` as waiting for the operator's labels. Open on one task: T028, the optional claims column, was not built (`E` section 7). Every other task without `[B]` is ticked, and the 16 `[B]` tasks (T001, T011, T029, T030, T008, T009, T032, T033, T012 to T016, T036, T019 and T020) are open and listed in `implementation-summary.md`
- [ ] After the labels, outside this phase's completion: all tasks marked `[x]`, with T008, T009, T012, T019, T029, T030, T032 and T033 closed as not applicable on a stop, T008 and T009 or T032 and T033 closed as not applicable for a backend never built and T013 to T016, T020 and T036 closed as not applicable on a stop or a drop. Open by design: this row belongs to the work after the operator's labels
- [x] No `[B]` task blocked by anything but the label gate. Evidence: every `[B]` task waits first on the operator's labels. The REQ-014 conditions and the keep sit behind that gate, and no defect, missing dependency or failed check blocks any task at the gate (`E` sections 6 and 9, session record)
- [x] Manual verification passed. Evidence: the orchestrator ran the census and the builder on `~/.pi/agent/sessions` and read their output, and the session reran the scorer on the fixture (`stop: fewer than 30 rows`, exit 0) and on `--jev` and `--deem` (exit 2 each) and ran a leak probe of the fixture with no hit in any code file, README or this folder (`E` sections 3, 4 and 6, session record)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
