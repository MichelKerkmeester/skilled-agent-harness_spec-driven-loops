# Iteration 002 — the runner phase (Q3)

- **Run**: 2026-11-01T21:41:55.986Z | Segment 1 | Iteration 2 of 3
- **Focus**: Q3 — should `002-conversation-runner` (tmux runner, scratch guard, cleanup, evidence, matrix) be changed, simplified, split or re-ordered, and is anything missing?
- **Mode**: read-only review. No researched file was modified.

## 1. FOCUS

The runner phase as planned, not as built: `002-conversation-runner` is still a plan (`implementation-summary.md` records "Nothing yet", completion 0 of 8 P0 checks), so every finding below is about the plan's shape, not about a defect in shipped code. Q4 (per-runtime feasibility against the `cli-*` skills and each CLI's `--help`) was deliberately left to iteration 3, and only the part of Q5 that bears on 002's own contract — whether the consumer seam is expressible at all — is touched here.

## 2. ACTIONS TAKEN

1. Read `002-conversation-runner/spec.md` (REQ-001..REQ-013, NFRs, risk matrix, edge cases), `plan.md` (components, the per-runtime feasibility table, the consumer mapping table, ADR-001..003, execution and testing strategy), `tasks.md` (18 tasks, the verification checklist) and `implementation-summary.md`.
2. Checked the skill's real state: `scripts/` holds only `validate-playbook-package.cjs` and its suite; `references/` holds `common-pitfalls.md`, `examples.md`, `prompt-voice.md`, `README.md`; `manual-testing-playbook/` holds `operator-contract/`, `package-authoring/`, `scenario-design/` and the root playbook, with no `conversation-runner/`. `tmux 3.8` is installed as claimed.
3. Cross-checked the plan's consumer mapping table against 001's actual closed key set (001 `plan.md` schema table) rather than against its prose, because the mapping table names three keys and all three had to exist in 001 for the rows to be writable.
4. Read the phase-decomposition thresholds in `system-spec-kit/references/structure/phase-definitions.md` §2 to test the split question against a rule rather than taste.

## 3. FINDINGS

### Ordering — the expensive, unprovable step runs first

**F1 (ordering defect, high): the task order puts the five live probes ahead of work that does not need them.**

`TASK-SEQ` states the rule correctly — "The T001 probes come before any adapter code" [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/plan.md:319] — but `tasks.md` orders T001 (probe every runtime) first and the guard, driver, turn loop, cleanup and evidence writer after it [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/tasks.md:54]. T004 through T008 [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/tasks.md:65] consume no adapter screen: the tmux driver, turn loop, cleanup and evidence writer reach the subject through the scratch guard and raw pane only, and the plan's own dependency matrix says guard → driver → turn loop → evidence, with adapters feeding only the question branch [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/plan.md:82].

The consequence is that milestone M2, "Runner works on the fake subject", which needs no model quota and no logged-in CLI [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/plan.md:249], cannot be reached until roughly an hour of interactive orchestrator work across five runtimes is done [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/plan.md:232]. Every quota, auth or selector surprise in T001 sits upstream of the whole deliverable, and a probe that dead-ends leaves nothing shipped.

Recommendation: re-order to T003 (fake subject) → T004–T008 → T010's fake-subject half → M2 → T001 → T002 → T009 → T015/T016, and leave `TASK-SEQ`'s wording alone, since "before any adapter code" is exactly right and the numbered list is what contradicts it.

**F2 (gap, high): neither `check` nor `setup` is bounded in time, and cleanup does not cover either.**

REQ-005 bounds only the settle wait: "A turn that has not settled by `timeout_ms` fails as `TIMEOUT`" [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:170]. REQ-006 then runs `check` with `bash -c` and defines only two outcomes, exit 0 and "any other exit" failing as `CHECK_FAILED` [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:171]. A `check` that blocks — waiting on a lock, a file that never appears, an interactive prompt inside the command — has no exit code at all, so it is neither pass nor fail; the runner waits forever. `setup` has the same hole: REQ-001 refuses "when a `setup` command fails" [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:166] and says nothing about a command that never returns.

REQ-007 does not rescue this. It kills the pane's process group and verifies "no process from that group remains" [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:176], and NFR-P02 bounds that teardown to 10 s [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:219]. But `check` and `setup` are the runner's own children, not the pane's: they sit in a different process group, so both the survivor check and the 10 s bound pass while a hung check child outlives the run. That directly contradicts the phase's own selling point in its executive summary — "every pane and process gone afterwards" — and R-003's survivor claim [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:265].

Recommendation: add a bound to REQ-006 (fail as `CHECK_TIMEOUT`, e.g. 60 s, and count it as a failed turn) and to REQ-001 (`SETUP_TIMEOUT`), extend the survivor check to the runner's own children, and add a test whose `check` sleeps past the bound — asserting the run ends, the verdict names the timeout, and cleanup still passes. This is the cheapest test in the phase and it protects the invariant the whole scratch design exists for.

**F3 (gap, medium-high): the settle predicate is the one timing assumption the probe design cannot falsify.**

REQ-005 defines settling as the ready marker present, the busy marker absent and "the screen is unchanged for 1500 ms", polled every 500 ms, both values hardcoded [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:170] [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:218]. T001 captures three single frames per runtime — "the screen when ready, when busy and at the question" [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/tasks.md:54]. A single frame cannot show whether a screen stays unchanged for 1.5 s; that is a property of a time series. Any status line that repaints a counter, and an elapsed-time or token-count readout is the usual shape for these TUIs, makes the window never recur, and the adapter's ready marker would be correct while the turn never settles.

The only subject that currently exercises the predicate is the fake subject the phase writes itself [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/tasks.md:56], which is circular: a well-behaved line-mode program proves the runner can detect idleness in a program designed to be idle.

Recommendation: have T001 record a short series per runtime — six captures 500 ms apart at rest — and add two facts to `scratch/probes.md`: whether the rest window repeats inside 1500 ms, and whether any per-second counter appears. That turns a hardcoded timing constant from an assumption into a measurement, for the cost of three extra seconds per runtime.

**F4 (gap, medium): R-001's mitigation is a human step with no command behind it.**

R-001 accepts that a CLI update changes the question screen and mitigates with "Recorded screens, CLI version in `result.json`, re-probe on mismatch" [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:263]. ADR-002 restates it: a stale adapter is expected, and "a failure keeps the live screen for a new probe" [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/plan.md:279]. Both describe a manual re-probe with no entry point — the only way to discover drift is to spend a full scripted conversation and read a FAIL.

Recommendation: add a `--check-adapters` mode that launches each runtime once, waits for its ready marker, captures one screen, prints `OK|DRIFT <runtime> <version>` and exits. It costs one launch per runtime, no turns, no questions, and gives R-001's mitigation an executable form while giving R-008's Pi package version a place to be recorded [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:270]. It also becomes the natural pre-flight for 043/006.

**F5 (gap, medium): evidence reuse into an existing `--out` is undefined.**

REQ-009 puts evidence "per runtime ... under `--out`" with fixed filenames and nothing about a folder that already holds a previous run's evidence [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:179]. T015 and T016 both write under `scratch/runs` [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/tasks.md:82]. Repeating a run merges states the reader cannot separate: run N's `question-2.txt` and `check.txt` survive beside run N+1's `result.json`, so the folder looks complete while describing two different runs, and a stale `check.txt` can be read as this run's evidence. The phase's own test-before-fix loop (probe, adapt, re-run) and 043/006's repeated live test both do exactly this.

Recommendation: either refuse a non-empty `--out/<runtime>/` unless `--overwrite` is passed, or write `--out/<run-id>/<runtime>/` and key `matrix.md` to the run id. Either is one line in REQ-009 and one assertion in T008's verify.

### Splitting and simplification

**F6 (verdict on the split question, medium): no split; take F1's re-order instead.**

The thresholds do not decide this. `phase-definitions.md` §2 gates decomposition on a phase score of 25 or more out of 50 together with documentation level 3 or higher, and states that an already-established phase parent "does not need to requalify for every later child" [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:251]. The parent already meets both, so a third child would be permitted but not required. One input does point at a split: the file-count trigger is "> 15" [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:48] and 002 is "About 15 files and 1,400 lines" [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:246], so any growth crosses it.

The real seam is risk class, not size: the core (guard, driver, turn loop, cleanup, evidence, matrix) is provable with zero quota against a fake subject, while the adapters and live runs depend on five external CLIs, five recorded screens and model quota. That seam is worth isolating — but F1 isolates it for free, by reaching M2 before any probe. Splitting now would add a packet boundary, a handoff and a second strict validation to buy what a re-ordered task list already buys.

Recommendation: keep 002 whole, apply F1, and split only on a named tripwire — if T001 shows two or more runtimes need multi-question dialog parsing, or if T001 runs past about a day, move the adapters, the recorded screens and MTP-007 into a third child. No simplification of the runner itself is warranted: the component list is the minimum for driving a TUI, and ADR-001's rejection of `expect` and of the runtimes' RPC modes is better reasoned than the alternatives it rejects.

**F7 (gap, low-medium): the Definition of Ready checks the parser but not the one file 002 edits downstream.**

Definition of Ready asserts only that `parseConversationScript` is a function [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/plan.md:58], echoed by CHK-001 [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/tasks.md:129]. T013 modifies `references/conversation-scenarios.md` [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/tasks.md:73], a file that does not exist today and that 001 creates [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/001-scenario-contract/spec.md:124]. If 001 splits or defers that document, T013 edits a missing file and its verify — `rg -n "^## "` — returns no output with exit 1, which reads like a formatting miss rather than the missing dependency it is.

Recommendation: add the reference's existence to CHK-001 and to Definition of Ready alongside the parser check.

**F8 (confirmed fit, medium): the consumer mapping table is supported by 001's actual key set.**

Three rows needed keys that must exist in the closed set: the kill-switch row uses `env` [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/plan.md:112], the named-stage row uses a turn `id` [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/plan.md:113] and the save row uses `$CONVERSATION_TURN_DIR` from REQ-006. Checked against 001's schema table rather than its prose: `env` is an optional top-level object "such as a kill switch" [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/001-scenario-contract/plan.md:93] and `turns[].id` is an optional unique string used for the turn's evidence folder [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/001-scenario-contract/plan.md:95]. So on these three rows Q3's "is anything missing" answer is no, and the mapping table is writable as planned.

One structural note to carry into Q5: the runner provides the variable and nothing more. What lands inside a turn's directory is fixed by REQ-009 at `screen.txt`, `question-N.txt` and `check.txt`; copying a save's files there is the consumer's `check` to write. That is a clean division, and the reference should say so explicitly, because a reader will otherwise assume the runner collects saves on its own.

## 4. QUESTIONS ANSWERED

- **Q3 — answered.** Change: add a bound to `check` and `setup` and extend the survivor check to the runner's own children (F2); record a rest time series in T001 so the settle predicate is measured rather than assumed (F3); add a `--check-adapters` drift mode (F4); define evidence reuse in `--out` (F5); add the 001 reference's existence to Definition of Ready (F7). Re-order: reach M2 before the probes, because no task before T009 needs a probe (F1). Split: not now — the thresholds permit but do not require a third child, and the re-order buys the same risk isolation (F6). Missing: nothing else at the consumer seam, where all three named keys exist in 001 (F8). No simplification of the runner's components is warranted.

## 5. QUESTIONS REMAINING

- **Q4** (per-runtime feasibility against the `cli-*` skills and each CLI's `--help`): untouched by design. Iteration 1's carried probe still stands — `codex features list` and `codex --help` for `default_mode_request_user_input`. Note that Q3's findings raise the stakes on two feasibility rows rather than answering them: the Claude Code row's `--ax-screen-reader` fallback and the Pi row's bell-flag idea both bear on F3's unchanged-screen predicate, and the OpenCode and Devin rows both admit "the TUI dialog is not captured yet" [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/plan.md:94].
- **Q5** (043/006 fit): carried forward with F8's division-of-labour note and the stage-mark mismatch (PASS/FAIL/SKIP versus PASS/FAIL/DEVIATION/N/A) still open.
- Carried for Q5: whether `env` set once at launch can express a kill switch flipped mid-run, or whether `action: "restart"` re-applies `env` — REQ-003 says restart relaunches "into the same session" and says nothing about the environment [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:168].

## 6. NEXT FOCUS

Q4 and Q5 in one iteration, since it is the last: check each of the five feasibility rows against the matching `cli-*` skill and `--help` (read-only, no interactive sessions), then test the runner contract against `specs/system-speckit/043-decision-capture/006-live-conversation-test` — its stage marks, per-stage state checks, mid-run and final saves, restart, and the kill switch.
