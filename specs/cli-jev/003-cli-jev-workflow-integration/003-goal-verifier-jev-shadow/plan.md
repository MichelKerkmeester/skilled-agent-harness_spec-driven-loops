---
title: "Implementation Plan: Goal Verifier Pi Census, Zero-Call Arms and Opt-In Jev Shadow Mode"
description: "A zero-call Pi census counts the verifier's recorded nudges first. One offline scorer then runs three zero-call arms on a labeled set and counts clamp defects. A gated choice arm on Deem or Jev is built only past a fixed gate, and only its keep adds a shadow mode, inert without its backend, that names the backend that kept."
trigger_phrases:
  - "goal verifier jev plan"
  - "labeled set scorer plan"
  - "jev shadow mode plan"
  - "verifier key gate plan"
  - "pi goal nudge census plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Goal Verifier Pi Census, Zero-Call Arms and Opt-In Jev Shadow Mode

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | A Node.js ES module for the census, Node.js CommonJS for the fixture builder and the scorer, the ES module goal plugin for slice 2 |
| **Framework** | The OpenCode goal plugin, `.opencode/plugins/opencode-goal.js`, through its `MkGoalPlugin.__test` helpers (`:3364`, `:3390`), and goal-core's exported `verifyGoalHeuristic` (`goal-core.cjs:596`, export at `:1611`) |
| **Standards** | Code follows sk-code's OpenCode route (`sk-code-opencode`). Docs go through sk-doc, and `validate_document.py` exits 0 on each doc the build changes (parent D6) |
| **Storage** | A census report, a JSONL labeled set, a JSONL per-call record and a text report in a directory the operator names. Slice 2 writes a JSONL shadow log in the goal state directory |
| **Testing** | `node --test` for the census and scorer tests and the plugin's `opencode-goal-*.test.cjs` suites, a stub `jev` first on `PATH` for every Jev path, a stub `cli-deem` (proposed, phase 008) and a fake Deem server for every Deem path, `validate.sh --strict` and `check-goal.cjs` |

### Overview

Slice 0 counts what Pi already records. Every Pi turn that is not `met` sends a hidden custom message, `[goal_verify] verdict=<v>; reason=<r>`, which Pi records in the session file (`goal-context.ts:245-253`). Since 2026-09-27 Pi holds it until the next user prompt, so a nudge pending when a session ends is never written (`spec.md` section 6). The census reads those records in `~/.pi/agent/sessions`, the operator's choice (parent D4), and prints counts only. Slice 1 builds a labeled set from Claude and Pi sessions and runs three zero-call arms on identical rows. The comparison between the as-ingested arm and the tail-window arm isolates the clamp defect: the plugin clamps evidence at 1,200 characters with an appended `...` (`opencode-goal.js:42`, `:386-389`), and the truncation check then reads that `...` as truncation (`:2214`) and returns `not_met` (`:2313-2316`). Parent D4 stops this phase at the label gate: the builder writes unlabeled rows, the scorer is tested on a synthetic fixture, and no model writes a label. The rest of this overview runs only after the operator labels and is not part of this phase's completion. If the better zero-call arm already meets the stop rule, the report hands the clamp fix to its owners and no model arm is built. Past the gate, a `choice` arm runs behind `--deem` (proposed) or `--jev` and its backend's check: Jev for 3 reruns, Deem over 3 option orders. Jev runs first, then Deem, the operator's order of 2026-09-29. The payload is the operator's own conversation and Deem keeps it on the machine, so Jev still needs the redaction gate below, and Deem runs when that gate is not accepted. For Deem the gate is the tail-window condition alone. Jev also needs the redaction cases and 002's latency record. Slice 2 runs only on keep. It adds a `deem` or `jev` value (proposed) to `OPENCODE_GOAL_VERIFIER`, for the backend that kept, where the heuristic still decides and the model's answer is only logged beside it. The census and the zero-call arms do not change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] The operator named the Pi session directory, `~/.pi/agent/sessions`, on 2026-09-28 (parent D4). No date window was named, so the census reads every date and prints the first and last it finds
- [x] The operator released this phase on 2026-09-28, fifth after 008, 016, 002 and 017 (parent D3)
- [ ] Past the label gate only: the operator's labeled set exists with at least 30 rows
- [ ] For a model arm only: the REQ-014 conditions for its backend hold, three for Jev and the tail-window condition alone for Deem

### Definition of Done

At the label gate, which closes this phase (parent D4):
- [x] The census prints its method line and totals and no message text. Evidence: the run on `~/.pi/agent/sessions` exited 0 with 43 lines in the three fixed shapes and 0 message-text markers (`scratch/w3-build/build-evidence.md` section 3)
- [x] The builder has written the unlabeled rows, no model has written a label and the scorer's tests pass on a synthetic fixture. Evidence: 50 Pi rows with `label` empty on all 50, and the scorer test 12 of 12 inside the goal hooks suite's 166 of 166 (build record sections 4 and 6, session record)
- [x] The goal hooks READMEs list the new files (parent D6). Evidence: briefs 08 and 09, `validate_document.py` `VALID` with 0 issues on each
- [x] `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` passes on this phase. Evidence: the closure pass, `implementation-summary.md` Verification

After the operator labels, outside this phase's completion:
- [ ] The zero-call report prints three arms and a stop line or a gate line. Past the gate, the model arm's report states keep or drop against REQ-006 for its backend
- [ ] On keep, the shadow mode tests pass, a session in `deem` or `jev` mode with its backend unavailable matches `heuristic` mode and the D6 skill docs list the new value
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Count what is recorded, then an offline comparison on identical rows with zero calls, then a gated model arm on Deem or Jev, then a live shadow that never acts. The heuristic keeps authority at every step.

### Key Components

- **Pi census** (`count-pi-goal-nudges.mjs`): reads the session files in the directory it is given, `~/.pi/agent/sessions` for this phase's run (parent D4), keeps a closed whitelist of record types and exits non-zero with a named error on any other. It counts records whose `customType` is `goal-verify-nudge` and parses the verdict and the reason from the fixed content line. It maps each reason to one of five categories: too short, blocking language, truncated, no completion signal and weak link to the objective. The first output line states the unit, the files scanned and the date window with the timestamp field it reads. Output holds file names, counts, categories and dates, never message text.
- **Fixture builder** (`build-verifier-fixture.cjs`): writes rows of `{id, source, objective, raw_text, ingested_text, raw_length, heuristic_recorded, recorded_reason, prelabel, label}`. As built, `ingested_text` is goal-core's `redactEvidence` of the raw text, and the heuristic arm's write through the plugin applies the 1,200-character clamp. goal-core's redaction lacks the plugin's AIza, xox, AKIA and 48-character rules, so it is not the plugin's exact as-ingested form (review P2, recorded). Claude rows pair each native `goal_status` record with the last assistant text before it in the same transcript and carry its `met` in `prelabel`, never in `label`. Pi rows carry the recorded nudge verdict as `heuristic_recorded`, with `label` left empty for the operator, and no model fills it (parent D4). It reads Pi sessions in `~/.pi/agent/sessions` and a Claude transcript directory the operator names, and writes to the path it is given. At the label gate the orchestrator runs it once, writes `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl` and leaves that file uncommitted.
- **Heuristic arm**: per row, `__test.writeGoalAtomic` in a `mkdtemp` state directory, then `__test.maybeVerifyGoal` with `OPENCODE_GOAL_VERIFIER` unset, on the as-ingested form. This is the helper pattern at `opencode-goal-supervisor.test.cjs:34-44`. The verdict and reason come back from the plugin itself, so the arm measures the real heuristic and not a copy, and no export is added.
- **Tail-window arm**: the same checks on the raw last 1,200 characters with no appended marker. It shows what the heuristic would say if the clamp kept the tail instead of marking a cut.
- **Parity arm**: goal-core's `verifyGoalHeuristic` on the raw text. Its `not-met` maps to `not_met`, and its `unclear` keeps its own row and folds into `not_met` only in the two-class table. goal-core returns `not-met` only for blocking language (`:603-604`), which gives an independent check on the wrapper rule.
- **Attribution**: the five heuristic reasons map to five checks (`opencode-goal.js:2207`, `:2211`, `:2215`, `:2219`, `:2225`).
- **Clamp-defect count**: rows where the heuristic arm's reason is the truncation reason and the tail-window arm's is not.
- **Claims column (optional, R4)**: `claims_regex` from the exported `detectCompletionClaim` in `completion-evidence-sentinel.cjs` on the raw text, beside an optional operator `claim_label`. Zero calls. Its false-fire and missed-claim rates feed R4's promote line and nothing in this phase.
- **Stop and gate lines**: the stop rule reads against the better of the heuristic and tail-window arms. On a stop the report names the clamp fix for the plugin and goal-core owners. Otherwise it prints the three REQ-014 conditions and whether each holds.
- **Jev key gate**: `--jev`, then one identity line with the resolved `jev` path and the provider, `JEV_PROVIDER` or `official`. Then `command -v jev`, `jev --version` equal to `jev 0.6.2` and `jev auth status --provider <provider>` exiting 0. Judgments take `JEV_PROVIDER` (`jev_cli/__init__.py:307`) while `auth status` and `auth test` default to `official` (`:339`), so one `--provider` goes to every check and call. The first failure prints its skip line and nothing else changes.
- **Deem gate**: `--deem`, then `cli-deem health` (proposed, phase 008) once per run, which applies the pinned Deem check within 2,000 ms: HTTP 200, `status` `ok`, a backend that is not the stub and the model `deem-0.8-v1`. It prints the backend, the model id and the commit pair. A failure prints `deem arm skipped: not reachable`, `stub backend`, `model` with a details line or `bad health response` (proposed). The scorer never starts the server and passes `cli-deem` no key. Neither gate falls over to the other backend.
- **Jev arm**: `jev choice -q <question> -o 'met=<desc>' -o 'not_met=<desc>' -o 'blocked=<desc>' --provider <provider>`, with the objective and evidence on stdin and no `-s`, which the Python `jev-cli` reads by default. The arm parses the default JSON output for the pick and its probability. It drops the earlier `--value` flag, which prints only the primary value. The descriptions follow the `llm` prompt's rules (`opencode-goal.js:2237-2245`). Each call records the pick and its probability and has a 30 s cap, which mirrors `DEFAULT_VERIFIER_TIMEOUT_MS` at `:49`.
- **Deem arm**: one `cli-deem choice` (proposed) per asked row per option order, with `met`, `not_met` and `blocked` as the option keys and the same descriptions as the Jev arm. The client posts them as Deem's `options` list and maps the pick back to its key. The exact flags are phase 008's. Before the first call the arm prints "nothing leaves the machine", the planned calls, at most 150 for 50 rows, and an estimated wall time at the measured p50. Each record carries the backend, the model id, the model commit, the source commit, the option order and the wall time. Exits after the gate follow the shared gate contract (`spec.md` edge cases). Stability is the order-flip rate over 3 option orders, and a keep holds only for its commit pair.
- **Wrapper rule**: a row the heuristic stopped at the length or the blocking-language check is held and keeps the heuristic's `not_met`. Those two checks run first, so no row the pattern matches can reach either backend. The rule needs no copy of `VERIFIER_BLOCKING_PATTERN`, which neither module exports.
- **Cascade table**: the heuristic first, then the model arm only on rows the heuristic calls `not_met` without blocking language, split by confidence bands written into `spec.md` REQ-009 before the first model call.
- **Shadow mode (keep only)**: the value for the backend that kept, `deem` or `jev`, joins `VALID_VERIFIER_MODES` (`:134`). `defaultSupervisorVerifierForMode` (`:231-234`) keeps the heuristic as the acting verifier for both. After `maybeVerifyGoal` applies that verdict, an async, timeout-bounded spawn asks the backend the mode names, `cli-deem` or `jev`, and `appendGoalJsonl` writes a `deem-shadow` or `jev-shadow` record in the pattern of `logContinuationDecision` (`:869-878`). The spawn's own try and catch holds every shadow error, so none reaches the catch at `:2383-2385` that returns `blocked`. A `verifier_shadow` line prints only on disagreement. In `deem` mode the session gate is the Deem check within 500 ms, which never starts the server, and a changed commit pair disables the shadow for the session with one line.

### Data Flow

The census reads Pi session files and prints counts. Separately, the fixture builder turns the Pi sessions, and any Claude transcripts the operator names, into unlabeled rows. This phase stops there, at the label gate (parent D4). The operator labels the rows after it closes. Labeled rows go through the three zero-call arms, then the stop checks. If headroom remains and the gate holds, the held and asked rows split, the asked rows go to the chosen backend three times, as Jev reruns or Deem option orders, and every arm's table goes into the report with the cascade table and the keep line. Per-call records hold ids, codes, timings and probabilities, never row text. In slice 2 the idle event runs the heuristic, applies its verdict, then checks the session's cached gate result. Only when that gate passed does the shadow call run beside the verdict.

### Invocation

```text
node .skilled/hooks/goal/lib/count-pi-goal-nudges.mjs --dir ~/.pi/agent/sessions
node .skilled/hooks/goal/lib/build-verifier-fixture.cjs [--claude <transcript-dir>] --pi ~/.pi/agent/sessions --out .skilled/hooks/goal/lib/verifier-labeled-set.jsonl [--limit <n>]
node --preserve-symlinks .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs --set <labeled.jsonl> [--out <report-dir>]
node .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs --set <labeled.jsonl> --out <report-dir> --jev
node .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs --set <labeled.jsonl> --out <report-dir> --deem
```

The first three commands are as built. The census has no `--from` or `--to` window and reads every date. The builder's `--limit` defaults to 50. The scorer needs `--preserve-symlinks` where `.opencode/node_modules` is absent, as in this worktree, and without it exits 2 with a named error. The `--jev` and `--deem` lines stay proposed for the work past the label gate, and at the gate both flags exit 2 as unknown. The key is read by `jev` from its own store or from the provider's environment variable. It never appears in any command. `cli-deem` takes no key.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

**Who builds (parent D5).** A fresh Opus 5.5 xhigh build orchestrator writes one single-change brief at a time and runs the CLI executors by Bash only. The operator's roster amendment of 2026-09-28 20:30 set them before the build: Devin `deepseek-v4-1-flash-max` and Pi on `llmgateway/mimo-v2.6-pro` at `--thinking high`, with Cursor retired. It replaced the roster first written here, Pi on Cline and Cursor `grok-4.7-xhigh-fast`. The build orchestrator runs the census and the builder itself, because their output is evidence. The orchestrator session verifies each change, gets a cross-family review of the code and commits path-scoped on the worktree branch, leaving the fixture uncommitted.

Order by slice:

1. **Slice 0, the Pi census.** Script, its three tests, one run on `~/.pi/agent/sessions` and a reconciliation of its totals with the two recorded figures.
2. **Slice 1, zero calls.** Fixture builder, scorer, three arms, attribution, clamp-defect count, normalization, the optional claims column, stop and gate lines, all tested on a synthetic fixture. Then one builder run writes the unlabeled rows.
3. **Docs (parent D6).** The goal hooks READMEs list the new files, through sk-doc.
4. **Label gate (parent D4).** This phase closes here. No model writes a label, and nothing below is part of this phase's completion.
5. **After the labels.** Run the scorer on the operator's labeled set.
6. **Decision 1.** A stop: write the report into `implementation-summary.md`, hand the clamp fix to its owners and close. Otherwise record the three REQ-014 conditions and wait until all hold.
7. **Slice 1, model arm.** Jev first, then Deem (operator, 2026-09-29). For Jev: the key gate with the identity line, egress line, 3 reruns and the aggregate flip rate. For Deem: the health gate with the commit pair, the "nothing leaves the machine" line, 3 option orders and the order-flip rate. For both: the wrapper rule and its assertion, per-call record, cascade table and keep line.
8. **Decision 2.** Drop: write the report and close. Keep, with a per-call p95 under 30 s: go on, for the backend that kept.
9. **Slice 2.** Mode value for that backend, session-cached gate, shadow spawn with its own catch and log, tests with a stub `jev` and a fake Deem server, doc rows and the D6 skill docs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Command | Expected |
|-------|---------|----------|
| Census test | `node --test .skilled/hooks/goal/lib/count-pi-goal-nudges.test.mjs` | Pass. A fixture session with one nudge per reason prints one count per category. An unknown record type exits non-zero with a named error. A grep of the output finds no message text |
| Census run | the first invocation above, on `~/.pi/agent/sessions` | A method line, per-session counts, totals and no message text. The report reconciles its totals with 1,457 nudges in 28 sessions (final synthesis) and 1,616 matches in 37 files (raw count, 2026-09-27) |
| Scorer test | `node --test .skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs` | Pass. A 1,300-character text ending in a full stop reaches the truncation branch in the as-ingested arm and not in the tail-window arm. A blocking-language row is held. An `unclear` row keeps its own row. Fewer than 30 valid rows prints `stop: fewer than 30 rows`. A stub `jev` and a stub `cli-deem` log no call. `not-met` normalizes and an unknown label exits non-zero |
| Builder run, at the label gate | the second invocation above | The unlabeled rows file exists and stays untracked, every Pi row's `label` is empty and the row count per source goes into `implementation-summary.md` |
| Goal hooks READMEs | `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <file>` on each README the build changes | Exit 0 each, and each lists the new `lib/` files |
| Zero-call report, after the labels | the third invocation above | Three confusion tables on identical rows with attribution and the clamp-defect count, then a stop line or the gate line, exit 0 and no per-call file |
| Jev arm, past the gate | the fourth invocation, gate passing | The identity line, then the egress line with calls and estimated input tokens, then every arm's table on identical rows for 3 reruns, the aggregate flip rate, per-call p50 and p95, the cascade table and a `keep` or `drop` line. The wrapper assertion holds |
| Deem arm, past the gate | the fifth invocation, against a fake server in tests and the local server by hand | The health line with the backend, model id and commit pair, then "nothing leaves the machine" with planned calls and estimated wall time, then every arm's table over 3 option orders, the order-flip rate, per-call p50 and p95, the cascade table and a `keep` or `drop` line. Each skip line and exits 3 and 4 behave as the edge cases state |
| Goal suites unchanged (keep only) | `node --test .skilled/plugins/tests/opencode-goal-*.test.cjs .skilled/plugins/tests/goal-doc-contract.test.cjs` | All pass, the same count as before the edit plus the new cases |
| D6 skill docs (keep only) | `validate_document.py` on each catalog, playbook and changelog file the build changes | Exit 0 each |
| No-backend parity (keep only) | the new supervisor cases with a stub `jev` that exits 3 on `auth status`, or a fake Deem server that fails its check | Same verdicts as `heuristic`, one enablement line, no line per verification. A stub that throws leaves the verdict untouched. A changed commit pair disables the `deem` shadow with one line |
| Scope | `git status --short` | Only the files in `spec.md` REQ-012 |
| Packet | `validate.sh --strict` on this folder, `check-goal.cjs` on this folder | `RESULT: PASSED`, checker passes |

No test makes a live Jev or Deem call. A live arm runs by hand, only when its backend's check passes: the operator's key for Jev, a local server passing the Deem check for Deem.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The census needs only a Pi session directory, `~/.pi/agent/sessions`. The operator's labeled set is the hard dependency for everything after it, and parent D4 closes this phase before it. The Jev arm also needs the three REQ-014 conditions, the Python `jev-cli` 0.6.2 on `PATH` and a key, and it is skipped without the last two. The Deem arm needs the tail-window condition, `cli-deem` from phase 008 and a local server passing the Deem check, and it is skipped without the last two. The plugin must load under Node through `import()`, as the supervisor tests already load it.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Slices 0 and 1 are additive: delete the census, the fixture builder, the scorer, their tests, the fixture and the report directories. Then revert the goal hooks README lines that list them. Slice 2 is a path-scoped commit on the worktree branch, and `git revert` undoes it. Otherwise, remove `deem` or `jev` from `VALID_VERIFIER_MODES`, its branch and the shadow call from `.opencode/plugins/opencode-goal.js`, which is the one real file behind the `.skilled/plugins` symlink. Then remove the new supervisor cases, the two doc rows and the value in the D6 catalog, playbook and changelog files. With the value gone, `OPENCODE_GOAL_VERIFIER=deem` or `=jev` falls back to `heuristic` as it does today (`:226-229`).
<!-- /ANCHOR:rollback -->

---
