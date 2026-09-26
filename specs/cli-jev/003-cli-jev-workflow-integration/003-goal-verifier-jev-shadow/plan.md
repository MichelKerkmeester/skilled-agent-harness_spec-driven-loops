---
title: "Implementation Plan: Goal Verifier Labeled Set and Opt-In Jev Shadow Mode"
description: "One offline scorer drives the goal plugin's own heuristic over an operator-labeled set with zero Jev calls, then runs a gated Jev choice arm under the wrapper rule. Only a keep against the fixed threshold adds a keyless-inert shadow jev mode to the plugin."
trigger_phrases:
  - "goal verifier jev plan"
  - "labeled set scorer plan"
  - "jev shadow mode plan"
  - "verifier key gate plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Goal Verifier Labeled Set and Opt-In Jev Shadow Mode

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS for the scorer; the ES module goal plugin for slice 2 |
| **Framework** | The OpenCode goal plugin, `.opencode/plugins/opencode-goal.js`, through its `MkGoalPlugin.__test` helpers |
| **Storage** | A JSONL labeled set, a JSONL per-call record and a text report in a directory the operator names; slice 2 writes a JSONL shadow log in the goal state directory |
| **Testing** | `node --test` for the scorer's test and the plugin's `opencode-goal-*.test.cjs` suites, a stub `jev` on `PATH` for every Jev path, `validate.sh --strict` and `check-goal.cjs` |

### Overview

Slice 1 adds one scorer script. For each labeled row it builds a throwaway goal state and asks the plugin's own `maybeVerifyGoal` for the heuristic verdict, which needs no plugin edit. It prints a confusion table with each error tied to the heuristic check that caused it. Behind `--jev` and the key gate, it asks a Jev `choice` about the rows the wrapper rule lets through, three times, and reads the result against a keep threshold fixed in `spec.md` REQ-006. Slice 2 runs only on keep. It adds a `jev` value to `OPENCODE_GOAL_VERIFIER`, where the heuristic still decides and Jev's answer is only logged beside it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [ ] The operator's labeled set exists with at least 30 rows

### Definition of Done
- [ ] The report states keep or drop against REQ-006, or a stop boundary fired first and says which
- [ ] On keep, the shadow mode tests pass and a keyless `jev` session matches `heuristic` mode
- [ ] `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` passes on this phase
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Offline A/B on identical rows first, then a live shadow that never acts. The heuristic keeps authority at every step.

### Key Components

- **Labeled set**: `{id, objective, evidence, label}` per line. The operator writes it from their own sessions, strips secrets and labels each row `met`, `not_met` or `blocked`.
- **Heuristic arm**: per row, `__test.setGoal` and `__test.writeGoalAtomic` in a `mkdtemp` state directory, then `__test.maybeVerifyGoal` with `OPENCODE_GOAL_VERIFIER` unset. This is the helper pattern at `opencode-goal-supervisor.test.cjs:34-44`. The verdict and reason come back from the plugin itself, so the arm measures the real heuristic and not a copy.
- **Attribution**: the five heuristic reasons map to five checks: too short, blocking language, truncated, no completion signal and off-objective (`opencode-goal.js:2201-2221`).
- **Parity column**: the shared core's exported `verifyGoalHeuristic` (`goal-core.cjs:596`, export at `:1611`) runs on the same rows, with its `not-met` and `unclear` normalized to `not_met`. The core returns `not-met` only for blocking language (`:603-604`), which gives an independent check on the wrapper rule.
- **Key gate**: `--jev`, then `command -v jev`, then `jev --version` equal to `jev 0.6.2`, then `jev auth status` exiting 0. The first failure prints `jev arm skipped: <check>` and nothing else changes.
- **Jev arm**: `jev choice -q <question> -o 'met=<desc>' -o 'not_met=<desc>' -o 'blocked=<desc>' --value`, with the objective and evidence on stdin. The descriptions follow the `llm` prompt's rules (`opencode-goal.js:2232-2240`). Each call has a 30 s cap, which mirrors `DEFAULT_VERIFIER_TIMEOUT_MS` at `:49`.
- **Wrapper rule**: a row the heuristic stopped at the length or the blocking-language check is held and keeps the heuristic's `not_met`. Those two checks run first, so no row the pattern matches can reach Jev. The rule needs no copy of `VERIFIER_BLOCKING_PATTERN`, which neither module exports.
- **Shadow mode (keep only)**: `jev` joins `VALID_VERIFIER_MODES` (`:134`). `defaultSupervisorVerifierForMode` (`:231-234`) keeps the heuristic as the acting verifier for `jev`. After `maybeVerifyGoal` applies that verdict, an async, timeout-bounded spawn asks Jev, and `appendGoalJsonl` writes a `jev-shadow` record, in the pattern of `logContinuationDecision` (`:869-878`).

### Data Flow

Labeled rows go into the heuristic arm, then the parity column, then the stop checks. If headroom remains and the gate passes, the held and asked rows split, the asked rows go to Jev three times, and both arms' tables go into the report with the keep line. Per-call records hold ids, codes and timings, never row text. In slice 2 the idle event runs the heuristic, applies its verdict, then checks the session's cached gate result. Only when that gate passed does the shadow call run beside the verdict.

### Invocation

```text
node .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs --set <labeled.jsonl> --out <report-dir>
node .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs --set <labeled.jsonl> --out <report-dir> --jev
```

The flags and paths are proposed and fixed at build time. The key is read by `jev` from its own store or from an exported `TYPESAFE_API_KEY`. It never appears in either command.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Order by slice:

1. **Slice 1, zero calls.** Scorer, synthetic-fixture test, heuristic arm, attribution, parity column, normalization, stop boundaries. Run it on the operator's set.
2. **Slice 1, Jev arm.** Key gate, egress line, wrapper rule and its assertion, 3 reruns, per-call record, stability, keep line.
3. **Decision.** Drop, or any stop boundary: write the report into `implementation-summary.md` and close. Keep, with a per-call p95 under 30 s: go on.
4. **Slice 2.** Mode value, session-cached gate, shadow spawn and log, tests with a stub `jev`, doc rows.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Command | Expected |
|-------|---------|----------|
| Scorer test | `node --test .skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs` | Pass. The happy path runs on a synthetic three-row fixture with `jev` off `PATH`. The edge case shows `not-met` normalizes and an unknown label exits non-zero |
| Keyless baseline | the first invocation above, with `jev` absent from `PATH` | A confusion table with attribution and a parity column, then `jev arm skipped: command -v jev`, exit 0, and no per-call file |
| Keyed arm | the second invocation, gate passing | The egress line and call count first, then both arms' tables on identical rows for 3 reruns, a stability coefficient, per-call p50 and p95, and a `keep` or `drop` line. The script's wrapper assertion holds |
| Goal suites unchanged (keep only) | `node --test .skilled/plugins/tests/opencode-goal-*.test.cjs .skilled/plugins/tests/goal-doc-contract.test.cjs` | All pass, the same count as before the edit plus the new cases |
| Keyless parity (keep only) | the new supervisor cases with a stub `jev` that exits 3 on `auth status` | Same verdicts as `heuristic`, one enablement line, no line per verification |
| Scope | `git status --short` | Only the files in `spec.md` REQ-012 |
| Packet | `validate.sh --strict` on this folder, `check-goal.cjs` on this folder | `RESULT: PASSED`, checker passes |

No test makes a live Jev call. The live arm runs by hand, only when the operator's key is present.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The operator's labeled set is the hard dependency. The Jev arm also needs the Python `jev-cli` 0.6.2 on `PATH` and a key, and it is skipped without either. The plugin must load under Node through `import()`, as the supervisor tests already load it. 002's latency record is soft: slice 1 records its own.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Slice 1 is additive: delete the scorer, its test, the fixture and the report directory. Slice 2 is a path-scoped commit on the worktree branch. `git revert` undoes it. Otherwise, remove `jev` from `VALID_VERIFIER_MODES`, its branch and the shadow call from `.opencode/plugins/opencode-goal.js`, which is the one real file behind both symlinked paths. Then remove the new supervisor cases and the two doc rows. With the value gone, `OPENCODE_GOAL_VERIFIER=jev` falls back to `heuristic` as it does today (`:226-229`).
<!-- /ANCHOR:rollback -->

---
