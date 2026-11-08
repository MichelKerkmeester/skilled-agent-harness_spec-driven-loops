# Iteration 003 — Convergence and stop policy

## Focus

Convergence and stop policy (v4.0.0.3 "deep-loop runs finish their work", v4.0.0.16 lane resume).

1. How `runtime/scripts/convergence.cjs` implements `stopPolicy`, `minIterations` and the four
   convergence modes; whether it reads `config.stopPolicy` at all.
2. Compare against `deep-research/references/convergence/convergence.md` and the
   `step_check_convergence` algorithm in `deep-research-auto.yaml`; flag divergences.
3. Whether the inline 3-signal vote (rolling average, MAD, question entropy) exists in code or
   only in prose the executing AI must compute by hand.

## Actions Taken

- Enumerated the runtime surface: 33 entrypoint scripts, 28 `runtime/lib/deep-loop` modules;
  `convergence.cjs` is 944 lines and `reduce-state.cjs` is the reducer entrypoint.
- Read `convergence.cjs` in full at the structural level (flag table, arg parsing, mode
  resolution, composite scoring, `evaluateResearch`, observation-threshold guard) and grepped
  the whole file for `stopPolicy|minIterations|maxIterations`.
- Grepped `reduce-state.cjs` for the same vocabulary.
- Read the workspace slice of `convergence.md` (lines 30-80: live decision model, convergence
  modes, divergent pivot contract) and `three-signal-model.md` (lines 13-50).
- Extracted every `stop_policy` and `convergence_mode` occurrence from
  `deep-research-auto.yaml`, plus the `step_graph_convergence` / `step_check_convergence` bodies.

## Findings

### F1 — P1, drift (high confidence): no code component owns the stop policy

`convergence.cjs` — 944 lines — contains **zero** occurrences of `stopPolicy`, `stop_policy`,
`minIterations`, `maxIterations` or `max-iterations`. Its accepted flag table runs
`configJson, convergenceMode, graphNoveltyFloor, iteration, loopType, minObservations,
persistSnapshot, readOnly, reportedNovelty, roundId, sessionId, slidingWindowSize, specFolder`
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:45].
`reduce-state.cjs` matches: its only hits are the `divergent/pivots` directory join and a
`config.maxIterations` string interpolation in the dashboard line
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2071].

Both concepts live exclusively in workflow prose:
`stop_policy` is *defined* at [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:643]
and its only *effect* is the branch at
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:776] — "if stop_policy ==
"max-iterations" AND iteration_count < max_iterations: steps 4 and 5 are telemetry only and
cannot set STOP or BLOCKED". Consequence: `convergence.cjs` invoked directly (playbook, test,
script, any future caller) returns `STOP_ALLOWED`/`STOP_BLOCKED` with no `minIterations` floor
and no awareness that the run's policy forbids convergence stops. The metric is prose; the gate
is code; nothing reconciles them.

Verify: `grep -nE "stopPolicy|minIterations" .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` → no output.

### F2 — P1, drift (high confidence): two entirely different convergence math models

Documented model — `three-signal-model.md:25`: "a weighted vote across rolling average of recent
`newInfoRatio` values, MAD noise floor, and question entropy coverage. The weights are `0.30`,
`0.35`, and `0.35`, and a normalized stop score above `0.60` nominates STOP"
[SOURCE: .skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/three-signal-model.md:25].

Implemented model — `computeCompositeScore(signals, 'research')`:
`questionCoverage*0.30 + claimVerificationRate*0.25 + (1-contradictionDensity)*0.15 +
(min(sourceDiversity/3,1))*0.15 + (min(evidenceDepth/5,1))*0.15`
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:329].

The two share **no signal and no weight**. Not one of `newInfoRatio`, MAD or question entropy
appears in the composite, and `0.60` is not a constant anywhere in the entrypoint. The YAML is
aware of the split — it names them separately: "Evaluate coverage-graph convergence before the
inline 3-signal vote" [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:757] and
"combine the inline 3-signal vote with graph convergence" (line 770). `convergence.md:51`
restates the doc model as "Nominate STOP when weighted signal score is above `0.60`" without
naming a single signal [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:51],
so the only definition of the documented vote is the feature-catalog prose. The graph model's
five signals are documented nowhere.

### F3 — P1, drift/canon (high confidence): the feature catalog files prose under "Implementation"

`three-signal-model.md` §3 "SOURCE FILES / ### Implementation" lists exactly three rows, and all
three are reference markdown: `references/convergence/convergence.md`,
`references/state/state-format.md`, `references/protocol/loop-protocol.md`
[SOURCE: .skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/three-signal-model.md:31].
Zero code, zero tests beyond three manual playbooks. The catalog entry is therefore internally
self-refuting evidence that the feature has **no implementation** — and it still passes as a
"SOURCE FILES" contract. This is the canon violation: a feature-catalog page must cite the code
that implements the feature, or the feature is prose.

### F4 — P2, bug (high confidence): every `--config-json` knob is unreachable from the workflow

`configJson` is an accepted flag [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:46]
and is read three ways: `antiConvergence.convergenceMode` /
`config.convergenceMode` (lines 235-242), `config.slidingWindowSize` /
`antiConvergence.slidingWindowSize` (lines 250-257), and `config.min_observations` /
`config.minObservations` (lines 266-267). The workflow's single invocation passes only
`--spec-folder --loop-type --session-id --convergence-mode --persist-snapshot --iteration`
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:759] — no `--config-json`, no
`--sliding-window-size`, no `--min-observations`.

Consequences: (a) `antiConvergence.slidingWindowSize` in `deep-research-config.json` is silently
ignored and a sliding window can only ever be the built-in
`DEFAULT_SLIDING_WINDOW_SIZE = 5` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:38];
(b) the observation-threshold guard built at `readObservationThresholdConfig`
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:274] is dead from the
workflow path, and `DEEP_LOOP_MIN_OBSERVATIONS` is the only way to arm it. "Defaulting to 5"
happens to match the doc, so the defect is invisible until an operator tries to tune it.

Verify: `grep -n "config-json\|configJson" .skilled/commands/deep/assets/deep-research-auto.yaml` → no output.

### F5 — P1, bug/UX (high confidence): `minIterations` is enforced by prose and documented nowhere

The YAML extracts it, defaults it, warns on it, clamps it, enforces it and logs it:
`min_iterations_missing_warning` (line 637), `minIterations raw ... default 0` (line 638), the
clamp to `maxIterations` (line 752), the `min_iterations_guard_pass` event (line 846) and the
`reason = "minIterationsNotReached"` assignment (line 815)
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:815].

The operator-facing convergence reference never defines the field. Its **single** occurrence of
`minIterations` in the whole file is inside the divergent-pivot exclusion list
[SOURCE: .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:68].
An operator reading `convergence.md` to learn what can stop the loop will not find the field that
can veto a stop, nor the `stopPolicy` axis, nor the warning event that will appear in their
bookkeeping log. Verify: `grep -c "minIterations" .../convergence.md` → 1 (line 68 only).

### F6 — P2, drift (medium confidence): `divergent` mode crosses a code/prose boundary no code bridges

`divergent` is a first-class mode in code (`VALID_CONVERGENCE_MODES`, and per `convergence.md:64`
it "computes convergence normally")
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:42]. But the pivot is
not code: the YAML must branch on the *prose-computed* reason —
`branch_on: "convergence_mode == 'divergent' AND reason is in ['composite_converged',
'all_questions_answered']"` [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:862].
So a mode the runtime accepts changes nothing in the runtime; its entire behaviour is a
downstream reinterpretation of a string the AI produced by hand. `convergence.md:68` then adds a
seven-value exclusion list (`maxIterationsReached, blockedStop, stuckRecovery,
minIterationsNotReached, error, manualStop, userPaused`) that only the prose can enforce.

### F7 — P2, improvement: give the reason vocabulary a code owner

Move the stop-policy and `minIterations` decision into `convergence.cjs`: accept `--config-json`
from the workflow, add `stopPolicy` and `minIterations` to the decision, and emit the reason
strings (`minIterationsNotReached`, `stopPolicySuppressed`) from code. That collapses F1, F4, F5
and F6 into one owned contract and lets `convergence.md` document what the tool actually returns
instead of what the workflow hopes it returns. Removing nothing; adding one flag pass-through.

### Observation — this run is a live instance of the prose-owned policy

This lineage's config carries `stopPolicy: "max-iterations"`, so per
[SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:776] the inline vote can never set
STOP or BLOCKED and only `max_iterations` terminates. The state log is consistent: ratio 0.72 →
0.68 across two iterations with 2/11 questions answered and stuck count 0 — diminishing returns
with no convergence stop, exactly what the policy prescribes. Behaviour matches the contract; it
cannot be attributed to drift because no code path could have produced a different outcome.

## Questions Answered

- **Convergence (v4.0.0.3, v4.0.0.16): do runtime/scripts/convergence.cjs and
  deep-research/scripts/reduce-state.cjs honor stopPolicy, minIterations and the four convergence
  modes as deep-research/references/convergence/convergence.md documents?**
  No, for both scripts, on the first two axes and for two different reasons. `stopPolicy` and
  `minIterations` are honored by **neither** — they are owned entirely by
  `deep-research-auto.yaml` prose (643, 776, 815, 846). The four convergence modes **are** honored
  by `convergence.cjs` (line 42) but only as a mode value; `divergent`'s behaviour is
  prose-only, and the mode's config-tunable knobs are unreachable because the workflow never
  passes `--config-json` (F4). `reduce-state.cjs` honors none of the three. The documented
  contract diverges from code on the composite formula (F2), on the owner of the stop decision
  (F1) and on the existence of a documented implementation (F3).

## Questions Remaining

- Single-executor dispatch: which `if_cli_*` branches in `deep-research-auto.yaml` and
  `deep-review-auto.yaml` carry placeholder, field-name or ordering defects?
- Write containment and lane resume (v4.0.0.16): does `runtime/lib/deep-loop/write-containment.ts`
  and the fan-out resume path do what the note claims?
- `cli-classifier` and `cli-jev` (v4.0.0.2, v4.0.0.3, v4.0.1.0): router phrases, Jev feature
  switches, stored-key behaviour vs the notes and vs `hub-router.json` / `mode-registry.json`.
- Hub canon (v4.0.1.0): parent-hub canon across `cli-external-orchestration` and `cli-classifier`.
- Over-engineering: which runtime surfaces (divergent pivot, legacy projection, idea lifecycle,
  observability, wave planner) have no live caller or test.
- UX: which steps of `deep-research-auto.yaml` are unclear, contradictory or impossible.
- Extension: what would remove the manual steps and defects found in this cluster.
- Executor failure handling (v4.0.0.3, v4.0.0.16): quota errors and builder throws under the
  single-executor workflow.
- NEW — Does anything test `convergence.cjs`'s research composite against the documented
  3-signal model, or does the manual playbook assert the prose numbers a human computed?
- NEW — `stopPolicy: max-iterations` makes convergence telemetry-only. Is there a config value or
  note that actually recommends it, or did it arrive by operator default in this lineage?

## Next Focus

Single-executor dispatch defects in `deep-research-auto.yaml` / `deep-review-auto.yaml`, since
iteration 1 surfaced ordering and missing-branch defects there and this iteration's YAML reading
produced two more concrete artifacts (the unreachable `--config-json` pass-through at line 759
and the prose-computed reason at line 815) that belong to the same `if_*` branch surface.
