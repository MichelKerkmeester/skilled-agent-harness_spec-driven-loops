# Deep-Review Iteration 9 — Correctness (Opus second opinion)

## State Summary

- Mode: review | Dimension: correctness | Iteration 9 of 10
- Target: deep-agent-improvement TWO-LANE program (phases 008-013), post-015-remediation state.
- Independent OPUS 4.8 second opinion. Job: (a) confirm 015 remediations still hold, (b) hunt NEW
  correctness issues not already reported across iterations 1-8.
- Prior findings (14 across iters 1-8: P1 materializer traversal, P1 bundle-gate exec gate, P1 doc
  Mode-4 cross-ref, P1 Lane B promotion non-executable, P1 criteria-grep traversal, P1 mode-aware
  promotion claim, plus P2 cluster) are NOT re-reported.

## Files Reviewed (correctness focus)

- `scripts/shared/loop-host.cjs` — `planInvocation` step plan for model-benchmark (LANE_MODEL_BENCHMARK,
  BENCHMARK_* forwarding); confirmed the plan emits ONLY materialize + run-benchmark.
- `scripts/shared/materialize-benchmark-fixtures.cjs` — `renderFixture` writes the fixture's OWN
  `content`/`markdown` to `{id}.md`.
- `scripts/model-benchmark/run-benchmark.cjs` — `scoreFixture`/`scoreFixture5dim` read `fixtureOutputPath`
  (the materialized reference file); recommendation/aggregate gates.
- `scripts/model-benchmark/dispatch-model.cjs` — verified NOT spawned by loop-host plan or any YAML step.
- `scripts/model-benchmark/scorer/score-model-variant.cjs`, `grader/harness.cjs`,
  `deterministic/cwd-check.cjs` — `classifyPath` traversal classification edge probing.
- `scripts/agent-improvement/score-candidate.cjs` — `scoreDimStructural` RegExp construction; cache path.
- `scripts/shared/reduce-state.cjs` — plateau / mode attribution (no new defect).
- `commands/deep/start-model-benchmark-loop.md`, `assets/deep_start-model-benchmark-loop_auto.yaml`,
  `SKILL.md`, `explicit.ts`, the three in-scope vitest files.
- Live trace: ran materialize → run-benchmark on the default profile (see Evidence below).

## Findings by Severity

### P0

None.

### P1

**correctness-9-1 — The wired Lane B (model-benchmark) loop scores the fixtures' OWN reference content
against the fixtures' OWN criteria; no model is ever invoked to produce a candidate. `dispatch-model.cjs`
is dead code in the wired path, and the aggregate "model" score is a model-independent constant.**

- Files: `scripts/shared/loop-host.cjs:130-160` (planInvocation), `scripts/shared/materialize-benchmark-fixtures.cjs:36-58,84-92` (renderFixture / write), `scripts/model-benchmark/run-benchmark.cjs:434-437` (scores fixtureOutputPath), `commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml:145-147` (only step that runs the loop is loop-host).
- Evidence (what I actually saw):
  1. `loop-host.planInvocation(mode='model-benchmark')` returns exactly two steps:
     `materialize-benchmark-fixtures.cjs` then `run-benchmark.cjs` (loop-host.cjs:153-159).
     `dispatch-model.cjs` is in `LANE_MODEL_BENCHMARK` (loop-host.cjs:48-51) for path RESOLUTION only;
     it is never added to any plan.
  2. The materializer writes each fixture's OWN reference body to `{fixture.id}.md`
     (`renderFixture` uses `fixture.markdown` or `fixture.content`; materialize main writes
     `path.join(outputsDir, \`${fixture.id}.md\`)`, materialize cjs:36-58,91).
  3. `run-benchmark` then scores that same `{fixture.id}.md` against the SAME fixture's
     `requiredHeadings`/`requiredPatterns` (run-benchmark.cjs:437 pattern path, :434 5dim path both
     read `fixtureOutputPath(outputsDir, fixture.id)`).
  4. The auto YAML `phase_loop` runs ONLY `loop-host` (step_run_benchmark, auto.yaml:147), then journal
     emits + reduce + stop-check. No step writes model output into `benchmark-outputs/{id}.md`.
     `grep` for any `{id}.md`/dispatch write between materialize and run-benchmark: none.
  5. Live proof: `materialize --profile default --outputs-dir T` then
     `run-benchmark --profile default --outputs-dir T` →
     `aggregateScore: 100, recommendation: benchmark-pass, all 3 rows score 100, passed:true`.
     The fixture authored its own pass; the score is a fixed function of the fixture pair, not of any model.
  6. Even on `--scorer 5dim --grader llm`, `scoreFixture5dim` reads the materialized reference file as
     `outputText` (run-benchmark.cjs:274) — the LLM grader grades the fixture's reference content, never
     a model-produced candidate. So no grader configuration makes the loop measure a model either.
- Consequence: the headline capability of Lane B ("benchmark a model or prompt framework",
  start-model-benchmark-loop.md:274,282-291; auto.yaml role/purpose/action lines 4-6) does not exercise
  any model in the wired loop. The score is invariant across iterations, so the documented
  `step_stop_check` plateau ("3+ identical aggregate scores", auto.yaml:23-24) trivially fires by
  iteration 3 on a constant — not because a model converged. `dispatch-model.cjs` (the only component
  that would produce a candidate from a model) is unreachable from the wired Lane B path; its read-only
  defaults, backoff, sentinel, and all of dispatch-model's 015/122 remediations protect code that the
  loop never calls.
- Why P1 not P0: the loop runs end-to-end, writes a valid report, and the agent-improvement (Lane A)
  path and all isolated scorer/dispatcher units are correct. Nothing is silently corrupted. But the
  core MODEL-benchmark behavior is non-functional as wired — a serious, model-blind defect.
- Why P1 not P2: this is not cosmetic — it nullifies the lane's stated purpose and makes every
  benchmark verdict a tautology (fixture scored against itself).
- Fix (do NOT implement here; choose one): (a) insert a per-fixture dispatch step in
  loop-host's model-benchmark plan / the auto YAML that calls `dispatch-model.cjs` with the fixture's
  prompt and OVERWRITES `{outputsDir}/{fixture.id}.md` with the model's stdout BEFORE run-benchmark
  scores it; (b) if Lane B is intentionally a fixture-self-validation harness (not a model benchmark),
  rewrite the role/purpose/docs to say so and demote/remove `dispatch-model.cjs` references and the
  "benchmark a model" framing; (c) at minimum document the current state as not-yet-wired model dispatch
  and gate the loop so it does not report a model verdict it did not measure.

#### Claim Adjudication (correctness-9-1)
- claim: The wired model-benchmark loop never invokes a model; it scores each fixture's own reference
  content against that fixture's own criteria, yielding a model-independent constant aggregate.
- evidenceRefs: loop-host.cjs:153-159; materialize-benchmark-fixtures.cjs:36-58,91;
  run-benchmark.cjs:434-437,274; deep_start-model-benchmark-loop_auto.yaml:145-147; live run aggregateScore=100.
- counterevidenceSought: searched all of `.opencode/commands/deep/` and
  `.opencode/skills/deep-agent-improvement/scripts/` for any caller that spawns/requires `dispatch-model.cjs`
  in the wired path, and for any step writing `benchmark-outputs/{id}.md` other than the materializer.
  Found dispatch-model only in docs/README + the loop-host RESOLVE set, never in a plan step or YAML command.
- alternativeExplanation: "The 5dim/llm grader supplies the model signal." Rejected: the llm grader
  reads the materialized reference file as `outputText` (run-benchmark.cjs:274); it grades the fixture's
  reference content, not a model-produced candidate, and only affects D4 — not the candidate text.
- finalSeverity: P1
- confidence: 0.88
- downgradeTrigger: discovering an out-of-scope glue step (e.g. in a confirm-mode YAML or a setup hook
  not in this review's file list) that dispatches a model and overwrites `{id}.md` before run-benchmark
  in the actual operator path would downgrade this to P2 (docs/wiring-clarity) or close it.

### P2

**correctness-9-2 — `loop-host` lists `dispatch-model.cjs` in `LANE_MODEL_BENCHMARK` (path-resolution
set) but `planInvocation` never plans it, so `resolveScriptPath('dispatch-model.cjs')` is reachable only
via a code path that does not exist.**

- File: `scripts/shared/loop-host.cjs:48-51,79-81,130-159`.
- Evidence: `LANE_MODEL_BENCHMARK = Set(['run-benchmark.cjs','dispatch-model.cjs'])` and
  `resolveScriptPath` maps `dispatch-model.cjs` to `../model-benchmark/dispatch-model.cjs`, but
  `planInvocation` only ever returns `materialize-benchmark-fixtures.cjs` + `run-benchmark.cjs`. No plan
  step names `dispatch-model.cjs`, so the lane entry and its resolveScriptPath branch are unreachable
  from loop-host. This is the structural footprint of correctness-9-1: the resolver was prepared for a
  dispatch step that was never wired.
- Fix: either wire the dispatch step (see correctness-9-1 fix (a)) or drop the unused
  `dispatch-model.cjs` entry from `LANE_MODEL_BENCHMARK` to remove the misleading "it's wired" signal.
- confidence: 0.9

## Confirmations (015 remediations re-verified in current code; no regression)

- F-P0-1 (loop-host space-form parseArgs): CONFIRMED — `--key value` binds to the following non-`--`
  token; the model-benchmark plan correctly forwards `--scorer`/`--grader` in space form
  (loop-host.cjs:99-110,149-152).
- F-P1-9 (run-benchmark fixture-id sanitize): CONFIRMED — `assertSafeFixtureId` still rejects `../evil`
  and `a/b` before any `path.join` (run-benchmark.cjs:126-138); the materializer guard remains the prior
  open correctness-1-1 (not re-reported).
- F-P1-1 (dispatch read-only default + write opt-in): CONFIRMED present in dispatch-model.cjs:185-234 —
  but note correctness-9-1: this module is never reached by the wired loop.
- F-P1-13 / F-P1-7 (report snapshot + scorer/grader/profile provenance success+failure): CONFIRMED
  (run-benchmark.cjs:88-91,413-427,457-575).
- F-P1-4 (D4 grader clamp on fresh + cache-hit): CONFIRMED (harness.cjs:44-48,206-209,229-231).
- F-P1-11 / F-P1-12 (packet-local + candidate-keyed score cache): CONFIRMED
  (score-candidate.cjs:171-181,554-555).
- TST-1 backward-compat identity: CONFIRMED (loop-host TST-1 block).
- cwd-check `classifyPath`: CONFIRMED sound for traversal (`../../../etc/passwd`, `..`, `foo/../../evil`
  all → `traversal_attempt`; `foo/../bar` → `bare_relative`). One harmless quirk: an absolute in-cwd path
  whose FILENAME contains a `..` substring (e.g. `/repo/proj/weird..name.ts`) is classified
  `bare_relative` instead of `absolute_in_fixture_cwd` because the `includes('..')` branch precedes the
  `startsWith('/')` branch — both score 1.0, so D3 score is unaffected. Noted, not a finding.
- `scoreDimStructural` RegExp build (score-candidate.cjs:235): the interpolated section fragment derives
  ONLY from the fixed label set in generate-profile.cjs `deriveStructural` (CORE/OUTPUT/ANTI/CAPABILITY/
  RULES/RELATED) — none contain regex metacharacters, so the construction cannot crash in practice.
  Latent robustness gap only; not a reachable defect.
- run-benchmark recommendation gate: empty-results → aggregateScore 0 < threshold → benchmark-fail
  (safe); the pattern path is byte-identical to the pre-5dim matcher.

## Traceability Checks (correctness-relevant)

- `spec_code`: FAIL for the Lane B headline claim — "benchmark a model" (docs + YAML role/purpose) does
  not resolve to model-exercising behavior in the wired loop (correctness-9-1). The materialize→score
  data flow resolves to fixture-self-scoring, not model evaluation.

## Verdict

CONDITIONAL — one NEW P1 (Lane B benchmark loop is model-blind: scores fixtures against themselves;
dispatch-model unwired) + one supporting P2. Lane A and all isolated units remain correct; all sampled
015 remediations hold with no regression.

## Next Dimension

security (iteration 10) — final pass; re-confirm bundle-gate exec gate (prior P1) and probe whether the
unwired dispatch path leaves any latent injection surface if a future wiring step is added.
