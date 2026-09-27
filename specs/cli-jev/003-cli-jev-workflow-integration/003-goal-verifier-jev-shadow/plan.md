---
title: "Implementation Plan: Goal Verifier Pi Census, Zero-Call Arms and Opt-In Jev Shadow Mode"
description: "A zero-call Pi census counts the verifier's recorded nudges first. One offline scorer then runs three zero-call arms on a labeled set and counts clamp defects. A gated Jev choice arm is built only past a fixed gate, and only its keep adds a keyless-inert shadow jev mode to the plugin."
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
| **Framework** | The OpenCode goal plugin, `.opencode/plugins/opencode-goal.js`, through its `MkGoalPlugin.__test` helpers (`:3359`, `:3385`), and goal-core's exported `verifyGoalHeuristic` (`goal-core.cjs:596`, export at `:1611`) |
| **Storage** | A census report, a JSONL labeled set, a JSONL per-call record and a text report in a directory the operator names. Slice 2 writes a JSONL shadow log in the goal state directory |
| **Testing** | `node --test` for the census and scorer tests and the plugin's `opencode-goal-*.test.cjs` suites, a stub `jev` first on `PATH` for every Jev path, `validate.sh --strict` and `check-goal.cjs` |

### Overview

Slice 0 counts what Pi already records. Every Pi turn that is not `met` leaves a hidden custom message, `[goal_verify] verdict=<v>; reason=<r>`, in the session file (`goal-context.ts:233-238`). The census reads those records and prints counts only. Slice 1 builds a labeled set from Claude and Pi sessions and runs three zero-call arms on identical rows. The comparison between the as-ingested arm and the tail-window arm isolates the clamp defect: the plugin clamps evidence at 1,200 characters with an appended `...` (`opencode-goal.js:42`, `:386-389`), and the truncation check then reads that `...` as truncation (`:2209`) and returns `not_met` (`:2308-2311`). If the better zero-call arm already meets the stop rule, the report hands the clamp fix to its owners and no Jev arm is built. Past a three-part gate, a Jev `choice` arm runs behind `--jev` and the key gate for 3 reruns. Slice 2 runs only on keep. It adds a `jev` value to `OPENCODE_GOAL_VERIFIER`, where the heuristic still decides and Jev's answer is only logged beside it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [ ] The operator names the Pi session directory and date window for the census
- [ ] The operator's labeled set exists with at least 30 rows
- [ ] For the Jev arm only: the three REQ-014 conditions hold

### Definition of Done
- [ ] The census prints its method line and totals and no message text
- [ ] The zero-call report prints three arms and a stop line or a gate line. Past the gate, the Jev report states keep or drop against REQ-006
- [ ] On keep, the shadow mode tests pass and a keyless `jev` session matches `heuristic` mode
- [ ] `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` passes on this phase
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Count what is recorded, then an offline comparison on identical rows with zero calls, then a gated Jev arm, then a live shadow that never acts. The heuristic keeps authority at every step.

### Key Components

- **Pi census** (`count-pi-goal-nudges.mjs`): reads the session files in a directory the operator names, keeps a closed whitelist of record types and exits non-zero with a named error on any other. It counts records whose `customType` is `goal-verify-nudge` and parses the verdict and the reason from the fixed content line. It maps each reason to one of five categories: too short, blocking language, truncated, no completion signal and weak link to the objective. The first output line states the unit, the files scanned and the date window with the timestamp field it reads. Output holds file names, counts, categories and dates, never message text.
- **Fixture builder** (`build-verifier-fixture.cjs`): writes rows of `{id, source, objective, raw_text, ingested_text, raw_length, heuristic_recorded, label}`. The as-ingested form is clamped as `opencode-goal.js:1107` does. Claude rows pair each native `goal_status` record with the last assistant text before it in the same transcript and carry its `met` as the pre-label. Pi rows carry the recorded nudge verdict as `heuristic_recorded`, with `label` left for the operator. It reads session directories the operator names and writes to a path the operator names.
- **Heuristic arm**: per row, `__test.writeGoalAtomic` in a `mkdtemp` state directory, then `__test.maybeVerifyGoal` with `OPENCODE_GOAL_VERIFIER` unset, on the as-ingested form. This is the helper pattern at `opencode-goal-supervisor.test.cjs:34-44`. The verdict and reason come back from the plugin itself, so the arm measures the real heuristic and not a copy, and no export is added.
- **Tail-window arm**: the same checks on the raw last 1,200 characters with no appended marker. It shows what the heuristic would say if the clamp kept the tail instead of marking a cut.
- **Parity arm**: goal-core's `verifyGoalHeuristic` on the raw text. Its `not-met` maps to `not_met`, and its `unclear` keeps its own row and folds into `not_met` only in the two-class table. goal-core returns `not-met` only for blocking language (`:603-604`), which gives an independent check on the wrapper rule.
- **Attribution**: the five heuristic reasons map to five checks (`opencode-goal.js:2202`, `:2206`, `:2210`, `:2214`, `:2220`).
- **Clamp-defect count**: rows where the heuristic arm's reason is the truncation reason and the tail-window arm's is not.
- **Claims column (optional, R4)**: `claims_regex` from the exported `detectCompletionClaim` in `completion-evidence-sentinel.cjs` on the raw text, beside an optional operator `claim_label`. Zero calls. Its false-fire and missed-claim rates feed R4's promote line and nothing in this phase.
- **Stop and gate lines**: the stop rule reads against the better of the heuristic and tail-window arms. On a stop the report names the clamp fix for the plugin and goal-core owners. Otherwise it prints the three REQ-014 conditions and whether each holds.
- **Key gate**: `--jev`, then one identity line with the resolved `jev` path and the provider, `JEV_PROVIDER` or `official`. Then `command -v jev`, `jev --version` equal to `jev 0.6.2` and `jev auth status --provider <provider>` exiting 0. Judgments take `JEV_PROVIDER` (`jev_cli/__init__.py:307`) while `auth status` and `auth test` default to `official` (`:339`), so one `--provider` goes to every check and call. The first failure prints its skip line and nothing else changes.
- **Jev arm**: `jev choice -q <question> -o 'met=<desc>' -o 'not_met=<desc>' -o 'blocked=<desc>' --provider <provider>`, with the objective and evidence on stdin and no `-s`, which the Python `jev-cli` reads by default. The arm parses the default JSON output for the pick and its probability. It drops the earlier `--value` flag, which prints only the primary value. The descriptions follow the `llm` prompt's rules (`opencode-goal.js:2232-2240`). Each call records the pick and its probability and has a 30 s cap, which mirrors `DEFAULT_VERIFIER_TIMEOUT_MS` at `:49`.
- **Wrapper rule**: a row the heuristic stopped at the length or the blocking-language check is held and keeps the heuristic's `not_met`. Those two checks run first, so no row the pattern matches can reach Jev. The rule needs no copy of `VERIFIER_BLOCKING_PATTERN`, which neither module exports.
- **Cascade table**: the heuristic first, then Jev only on rows the heuristic calls `not_met` without blocking language, split by confidence bands written into `spec.md` REQ-009 before the first billed call.
- **Shadow mode (keep only)**: `jev` joins `VALID_VERIFIER_MODES` (`:134`). `defaultSupervisorVerifierForMode` (`:231-234`) keeps the heuristic as the acting verifier for `jev`. After `maybeVerifyGoal` applies that verdict, an async, timeout-bounded spawn asks Jev, and `appendGoalJsonl` writes a `jev-shadow` record in the pattern of `logContinuationDecision` (`:869-878`). The spawn's own try and catch holds every shadow error, so none reaches the catch at `:2378-2380` that returns `blocked`. A `verifier_shadow` line prints only on disagreement.

### Data Flow

The census reads Pi session files and prints counts. Separately, the fixture builder turns named sessions into rows, and the operator labels them. Labeled rows go through the three zero-call arms, then the stop checks. If headroom remains and the gate holds, the held and asked rows split, the asked rows go to Jev three times, and every arm's table goes into the report with the cascade table and the keep line. Per-call records hold ids, codes, timings and probabilities, never row text. In slice 2 the idle event runs the heuristic, applies its verdict, then checks the session's cached gate result. Only when that gate passed does the shadow call run beside the verdict.

### Invocation

```text
node .skilled/hooks/goal/lib/count-pi-goal-nudges.mjs --dir <pi-session-dir> --from <date> --to <date>
node .skilled/hooks/goal/lib/build-verifier-fixture.cjs --claude <transcript-dir> --pi <pi-session-dir> --out <fixture.jsonl>
node .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs --set <labeled.jsonl> --out <report-dir>
node .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs --set <labeled.jsonl> --out <report-dir> --jev
```

The flags and paths are proposed and fixed at build time. The key is read by `jev` from its own store or from the provider's environment variable. It never appears in any command.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Order by slice:

1. **Slice 0, the Pi census.** Script, its three tests, one run on the named directory and a reconciliation of its totals with the two recorded figures.
2. **Slice 1, zero calls.** Fixture builder, scorer, three arms, attribution, clamp-defect count, normalization, the optional claims column, stop and gate lines. Run it on the operator's labeled set.
3. **Decision 1.** A stop: write the report into `implementation-summary.md`, hand the clamp fix to its owners and close. Otherwise record the three REQ-014 conditions and wait until all hold.
4. **Slice 1, Jev arm.** Key gate with the identity line, egress line, wrapper rule and its assertion, 3 reruns, per-call record, aggregate flip rate, cascade table and keep line.
5. **Decision 2.** Drop: write the report and close. Keep, with a per-call p95 under 30 s: go on.
6. **Slice 2.** Mode value, session-cached gate, shadow spawn with its own catch and log, tests with a stub `jev`, doc rows.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Command | Expected |
|-------|---------|----------|
| Census test | `node --test .skilled/hooks/goal/lib/count-pi-goal-nudges.test.mjs` | Pass. A fixture session with one nudge per reason prints one count per category. An unknown record type exits non-zero with a named error. A grep of the output finds no message text |
| Census run | the first invocation above, on the operator's directory | A method line, per-session counts, totals and no message text. The report reconciles its totals with 1,457 nudges in 28 sessions (final synthesis) and 1,616 matches in 37 files (raw count, 2026-09-27) |
| Scorer test | `node --test .skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs` | Pass. A 1,300-character text ending in a full stop reaches the truncation branch in the as-ingested arm and not in the tail-window arm. A blocking-language row is held. An `unclear` row keeps its own row. Fewer than 30 valid rows prints `stop: fewer than 30 rows`. A stub `jev` logs no call. `not-met` normalizes and an unknown label exits non-zero |
| Zero-call report | the third invocation above | Three confusion tables on identical rows with attribution and the clamp-defect count, then a stop line or the gate line, exit 0 and no per-call file |
| Keyed arm, past the gate | the fourth invocation, gate passing | The identity line, then the egress line with calls and estimated input tokens, then every arm's table on identical rows for 3 reruns, the aggregate flip rate, per-call p50 and p95, the cascade table and a `keep` or `drop` line. The wrapper assertion holds |
| Goal suites unchanged (keep only) | `node --test .skilled/plugins/tests/opencode-goal-*.test.cjs .skilled/plugins/tests/goal-doc-contract.test.cjs` | All pass, the same count as before the edit plus the new cases |
| Keyless parity (keep only) | the new supervisor cases with a stub `jev` that exits 3 on `auth status` | Same verdicts as `heuristic`, one enablement line, no line per verification. A stub that throws leaves the verdict untouched |
| Scope | `git status --short` | Only the files in `spec.md` REQ-012 |
| Packet | `validate.sh --strict` on this folder, `check-goal.cjs` on this folder | `RESULT: PASSED`, checker passes |

No test makes a live Jev call. The live arm runs by hand, only when the operator's key is present.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The census needs only a Pi session directory. The operator's labeled set is the hard dependency for everything after it. The Jev arm also needs the three REQ-014 conditions, the Python `jev-cli` 0.6.2 on `PATH` and a key, and it is skipped without the last two. The plugin must load under Node through `import()`, as the supervisor tests already load it.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Slices 0 and 1 are additive: delete the census, the fixture builder, the scorer, their tests, the fixture and the report directories. Slice 2 is a path-scoped commit on the worktree branch, and `git revert` undoes it. Otherwise, remove `jev` from `VALID_VERIFIER_MODES`, its branch and the shadow call from `.opencode/plugins/opencode-goal.js`, which is the one real file behind the `.skilled/plugins` symlink. Then remove the new supervisor cases and the two doc rows. With the value gone, `OPENCODE_GOAL_VERIFIER=jev` falls back to `heuristic` as it does today (`:226-229`).
<!-- /ANCHOR:rollback -->

---
